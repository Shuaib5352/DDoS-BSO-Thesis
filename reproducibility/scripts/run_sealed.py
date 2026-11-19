"""Group-disjoint split-first rerun of the existing sampled CICIoT2023 matrix."""

from __future__ import annotations

import hashlib
import json
import platform
import sys
from pathlib import Path
from time import perf_counter
from itertools import combinations

import joblib
import numpy as np
import pandas as pd
import scipy
import sklearn
import imblearn
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (accuracy_score, balanced_accuracy_score, confusion_matrix,
                             f1_score, matthews_corrcoef, precision_recall_fscore_support,
                             precision_score, recall_score, roc_auc_score)
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.preprocessing import StandardScaler

from corrected_optimizer import search


SEED = 42
SCRIPT_DIR = Path(__file__).resolve().parent
OUT = SCRIPT_DIR.parent if SCRIPT_DIR.parent.name == "reproducibility" else SCRIPT_DIR.parent / "reproducibility"
HISTORICAL_HP = {"n_estimators": 266, "max_depth": 20, "min_samples_split": 7,
                 "max_features": 0.469}


def sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def dump_json(path, value):
    path.write_text(json.dumps(value, indent=2, default=lambda x: x.item() if hasattr(x, "item") else str(x)), encoding="utf-8")


def sampled_data():
    data = np.load(OUT / "sampled_numeric_data.npz")
    schema = json.loads((OUT / "schema.json").read_text(encoding="utf-8"))
    X, y = data["X"], data["y"]
    assert X.shape == (103218, 39) and len(y) == len(X)
    return X, y, schema["original_feature_order"], schema["classes"]


def group_split(X, y):
    # Canonicalize NaN payloads and signed zero, then hash all 39 raw numeric values.
    canonical = np.ascontiguousarray(X.copy(), dtype="<f8")
    canonical[canonical == 0] = 0.0
    canonical[np.isnan(canonical)] = np.nan
    hashes = np.array([hashlib.sha256(row.tobytes()).hexdigest() for row in canonical], dtype="U64")
    _, groups = np.unique(hashes, return_inverse=True)
    np.save(OUT / "group_hashes.npy", hashes)
    np.save(OUT / "group_ids.npy", groups)
    splitter = StratifiedGroupKFold(n_splits=10, shuffle=True, random_state=SEED)
    fold_ids = np.empty(len(y), dtype=np.int8)
    for fold, (_, held) in enumerate(splitter.split(X, y, groups)):
        fold_ids[held] = fold
    np.save(OUT / "fold_ids.npy", fold_ids)
    counts = np.stack([np.bincount(y[fold_ids == fold], minlength=5) for fold in range(10)])
    total = counts.sum(axis=0)
    best = None
    for test_folds in combinations(range(10), 2):
        remaining = [f for f in range(10) if f not in test_folds]
        test_count = counts[list(test_folds)].sum(axis=0)
        for val_fold in remaining:
            val_count = counts[val_fold]
            train_count = total - test_count - val_count
            score = (((test_count - 0.2 * total) ** 2 / (0.2 * total + 1)).sum()
                     + ((val_count - 0.1 * total) ** 2 / (0.1 * total + 1)).sum()
                     + ((train_count - 0.7 * total) ** 2 / (0.7 * total + 1)).sum())
            candidate = (float(score), test_folds, val_fold)
            if best is None or candidate < best:
                best = candidate
    _, test_folds, val_fold = best
    test = np.flatnonzero(np.isin(fold_ids, test_folds))
    val = np.flatnonzero(fold_ids == val_fold)
    train = np.flatnonzero(~np.isin(fold_ids, (*test_folds, val_fold)))
    assert len(train) + len(val) + len(test) == len(y)
    overlaps = {
        "exact_row_overlap_train_val": len(set(hashes[train]) & set(hashes[val])),
        "exact_row_overlap_train_test": len(set(hashes[train]) & set(hashes[test])),
        "exact_row_overlap_val_test": len(set(hashes[val]) & set(hashes[test])),
    }
    assert all(v == 0 for v in overlaps.values()), overlaps
    np.savez_compressed(OUT / "split_indices.npz", train=train, validation=val, test=test)
    dump_json(OUT / "group_split.json", {"method": "StratifiedGroupKFold(10, shuffle=True, random_state=42); deterministic 2-fold test/1-fold validation selection by class-count target error",
        "test_folds": test_folds, "validation_fold": val_fold, "train_rows": len(train),
        "validation_rows": len(val), "test_rows": len(test), "overlaps": overlaps,
        "class_counts": {"train": np.bincount(y[train], minlength=5).tolist(),
                         "validation": np.bincount(y[val], minlength=5).tolist(),
                         "test": np.bincount(y[test], minlength=5).tolist()}})
    return train, val, test


def metrics(y, pred, proba=None):
    result = {"accuracy": accuracy_score(y, pred),
              "macro_f1": f1_score(y, pred, average="macro", zero_division=0),
              "weighted_precision": precision_score(y, pred, average="weighted", zero_division=0),
              "weighted_recall": recall_score(y, pred, average="weighted", zero_division=0),
              "weighted_f1": f1_score(y, pred, average="weighted", zero_division=0),
              "balanced_accuracy": balanced_accuracy_score(y, pred),
              "mcc": matthews_corrcoef(y, pred)}
    if proba is not None:
        result["weighted_ovr_roc_auc"] = roc_auc_score(y, proba, multi_class="ovr", average="weighted", labels=np.arange(proba.shape[1]))
    return result


def main():
    t0 = perf_counter()
    X, y, feature_cols, classes = sampled_data()
    train, val, test = group_split(X, y)
    print(f"split train={len(train)} val={len(val)} test={len(test)}", flush=True)

    # All learned transformations see training rows only. The test features are not transformed until selection is frozen.
    imputer = SimpleImputer(strategy="median", keep_empty_features=True)
    Xt = imputer.fit_transform(X[train])
    keep = np.ptp(Xt, axis=0) > 0
    assert keep.any()
    scaler = StandardScaler()
    Xt = scaler.fit_transform(Xt[:, keep])
    Xv = scaler.transform(imputer.transform(X[val])[:, keep])
    selected_input_names = list(np.array(feature_cols)[keep])
    smote = SMOTE(random_state=SEED, k_neighbors=5)
    Xs, ys = smote.fit_resample(Xt, y[train])
    dump_json(OUT / "fit_trace.json", {"split_created_before_any_fit": True,
        "imputer_fit_rows": train.tolist(), "constant_screen_rows": train.tolist(),
        "scaler_fit_rows": train.tolist(), "smote_fit_rows": train.tolist(),
        "bso_train_rows": train.tolist(), "bso_validation_rows": val.tolist(),
        "test_used_in_optimization": False})
    print(f"train preprocessing complete: {Xt.shape[1]} features, SMOTE {len(Xt)}->{len(Xs)}", flush=True)

    bso = search(Xs, ys, Xv, y[val], seed=SEED, population=25, iterations=50,
                 eval_rows=12000, n_jobs=8)
    mask = bso.pop("mask")
    np.save(OUT / "selected_feature_mask.npy", mask)
    dump_json(OUT / "optimizer_result.json", {**bso, "selected_feature_names": list(np.array(selected_input_names)[mask])})
    print(f"BSO complete in {bso['seconds']:.1f}s; {mask.sum()} features", flush=True)

    # Ablations use validation only; the test partition remains unopened.
    ablations = []
    configs = [("RF baseline", Xt, y[train], np.ones(len(selected_input_names), bool), HISTORICAL_HP),
               ("+ SMOTE", Xs, ys, np.ones(len(selected_input_names), bool), HISTORICAL_HP),
               ("+ BSO feature selection", Xs, ys, mask, HISTORICAL_HP),
               ("+ RF tuning", Xs, ys, np.ones(len(selected_input_names), bool), bso["hyperparameters"]),
               ("full BSO-RF", Xs, ys, mask, bso["hyperparameters"])]
    for name, xa, ya, ma, hp in configs:
        model = RandomForestClassifier(**hp, class_weight="balanced", random_state=SEED, n_jobs=8)
        model.fit(xa[:, ma], ya)
        result = metrics(y[val], model.predict(Xv[:, ma]))
        ablations.append({"configuration": name, "n_features": int(ma.sum()), **result})
        print(f"ablation {name}: macro-F1={result['macro_f1']:.4f}", flush=True)
    pd.DataFrame(ablations).to_csv(OUT / "validation_ablation.csv", index=False)

    final_model = RandomForestClassifier(**bso["hyperparameters"], class_weight="balanced",
                                         random_state=SEED, n_jobs=8)
    start_fit = perf_counter()
    final_model.fit(Xs[:, mask], ys)
    fit_seconds = perf_counter() - start_fit
    bundle = {"imputer": imputer, "constant_feature_mask": keep, "scaler": scaler,
              "selected_feature_mask": mask, "model": final_model,
              "original_feature_order": feature_cols, "post_screen_feature_order": selected_input_names,
              "selected_feature_order": list(np.array(selected_input_names)[mask]), "classes": classes,
              "seed": SEED}
    joblib.dump(bundle, OUT / "fitted_pipeline.joblib", compress=3)
    all39_model = RandomForestClassifier(**bso["hyperparameters"], class_weight="balanced",
                                         random_state=SEED, n_jobs=8)
    all39_model.fit(Xs, ys)
    all39_bundle = {**bundle, "selected_feature_mask": np.ones(len(selected_input_names), dtype=bool),
                    "selected_feature_order": selected_input_names, "model": all39_model}
    joblib.dump(all39_bundle, OUT / "fitted_rf_all39.joblib", compress=3)
    dump_json(OUT / "model_metadata.json", {"selected_feature_order": bundle["selected_feature_order"],
        "post_screen_feature_order": selected_input_names, "original_feature_order": feature_cols,
        "class_mapping": {str(i): c for i, c in enumerate(classes)}, "hyperparameters": bso["hyperparameters"],
        "seed": SEED, "n_train": len(train), "n_validation": len(val), "n_test": len(test),
        "final_fit_seconds": fit_seconds, "bso_seconds": bso["seconds"]})

    # The sole primary test access occurs after the fitted pipeline has been saved.
    X_test_raw, y_test = X[test], y[test]
    np.savez_compressed(OUT / "test_inputs.npz", X=X_test_raw, y=y_test, row_index=test)
    X_test = scaler.transform(imputer.transform(X_test_raw)[:, keep])[:, mask]
    pred = final_model.predict(X_test)
    proba = final_model.predict_proba(X_test)
    pred_all = all39_model.predict(scaler.transform(imputer.transform(X_test_raw)[:, keep]))
    proba_all = all39_model.predict_proba(scaler.transform(imputer.transform(X_test_raw)[:, keep]))
    pd.DataFrame({"row_index": test, "true_label": y_test, "predicted_label": pred}).to_csv(OUT / "test_predictions.csv", index=False)
    np.save(OUT / "test_probabilities.npy", proba)
    pd.DataFrame({"row_index": test, "true_label": y_test, "predicted_label": pred_all}).to_csv(OUT / "all39_test_predictions.csv", index=False)
    np.save(OUT / "all39_test_probabilities.npy", proba_all)
    summary = metrics(y_test, pred, proba)
    summary_all = metrics(y_test, pred_all, proba_all)
    cm = confusion_matrix(y_test, pred, labels=np.arange(len(classes)))
    pd.DataFrame(cm, index=classes, columns=classes).to_csv(OUT / "confusion_matrix.csv")
    pc, rc, fc, support = precision_recall_fscore_support(y_test, pred, labels=np.arange(len(classes)), zero_division=0)
    pd.DataFrame({"class": classes, "precision": pc, "recall": rc, "f1": fc,
                  "support": support}).to_csv(OUT / "per_class_metrics.csv", index=False)
    dump_json(OUT / "test_metrics.json", summary)
    pd.DataFrame([summary]).to_csv(OUT / "test_metrics.csv", index=False)
    dump_json(OUT / "all39_test_metrics.json", summary_all)
    pd.DataFrame([summary_all]).to_csv(OUT / "all39_test_metrics.csv", index=False)
    print("TEST_METRICS " + json.dumps(summary), flush=True)
    print("ALL39_TEST_METRICS " + json.dumps(summary_all), flush=True)

    rng = np.random.default_rng(20260923)
    bootstrap = []
    for _ in range(1000):
        b = rng.integers(0, len(y_test), len(y_test))
        if len(np.unique(y_test[b])) != len(classes):
            continue
        bootstrap.append(metrics(y_test[b], pred[b], proba[b]))
    cis = {k: {"lower": float(np.quantile([v[k] for v in bootstrap], 0.025)),
               "upper": float(np.quantile([v[k] for v in bootstrap], 0.975))}
           for k in summary}
    dump_json(OUT / "bootstrap_95ci.json", cis)
    pd.DataFrame([{"metric": k, "estimate": summary[k], **v} for k, v in cis.items()]).to_csv(OUT / "bootstrap_95ci.csv", index=False)
    comparison = []
    for name, count, values in [("BSO-RF", int(mask.sum()), summary), ("Tuned RF-All39", int(keep.sum()), summary_all)]:
        comparison.append({"model": name, "features": count, "reduction": 1 - count / 39,
            "accuracy": values["accuracy"], "macro_f1": values["macro_f1"],
            "weighted_f1": values["weighted_f1"], "balanced_accuracy": values["balanced_accuracy"],
            "mcc": values["mcc"], "weighted_ovr_roc_auc": values["weighted_ovr_roc_auc"]})
    pd.DataFrame(comparison).to_csv(OUT / "predictive_comparison.csv", index=False)
    dump_json(OUT / "environment.json", {"python": sys.version, "platform": platform.platform(),
        "numpy": np.__version__, "pandas": pd.__version__, "sklearn": sklearn.__version__,
        "imblearn": imblearn.__version__, "scipy": scipy.__version__, "joblib": joblib.__version__,
        "total_seconds": perf_counter() - t0})
    with open(OUT / "sha256sums.txt", "w", encoding="utf-8") as f:
        for path in sorted(OUT.iterdir()):
            if path.is_file() and path.name != "sha256sums.txt":
                f.write(f"{sha(path)}  {path.name}\n")
    print("COMPLETE", flush=True)


if __name__ == "__main__":
    main()
