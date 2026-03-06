#!/usr/bin/env python3
"""
=================================================================================
  EXTRACT: Per-class ROC, Precision-Recall Curves, and t-SNE Embeddings
  Lightweight script — reuses existing pipeline, no full retraining needed.
  Author: SHUAIB AYAD JASIM
=================================================================================
"""
import os, sys, json, time, warnings
import numpy as np
import pandas as pd

warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder, label_binarize
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    precision_recall_curve, average_precision_score,
    roc_curve, auc
)
from sklearn.manifold import TSNE

try:
    from imblearn.over_sampling import SMOTE
    HAS_SMOTE = True
except ImportError:
    HAS_SMOTE = False

try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

# =============================================================================
# CONFIGURATION (must match real_experiment.py exactly)
# =============================================================================
DATA_DIR = r'C:\Users\imiss\Downloads'
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

DATA_FILES = {
    'BenignTraffic': [
        'BenignTraffic.pcap.csv', 'BenignTraffic1.pcap.csv',
        'BenignTraffic2.pcap.csv', 'BenignTraffic3.pcap.csv',
    ],
    'DDoS-SYN_Flood': [
        'DDoS-SYN_Flood.pcap.csv', 'DDoS-SYN_Flood1.pcap.csv',
        'DDoS-SYN_Flood2.pcap.csv', 'DDoS-SYN_Flood3.pcap.csv',
        'DDoS-SYN_Flood4.pcap.csv', 'DDoS-SYN_Flood5.pcap.csv',
        'DDoS-SYN_Flood7.pcap.csv', 'DDoS-SYN_Flood11.pcap.csv',
        'DDoS-SYN_Flood12.pcap.csv', 'DDoS-SYN_Flood13.pcap.csv',
        'DDoS-SYN_Flood14.pcap.csv', 'DDoS-SYN_Flood15.pcap.csv',
    ],
    'DDoS-ACK_Fragmentation': ['DDoS-ACK_Fragmentation.pcap.csv'],
    'Recon-PortScan': ['Recon-PortScan.pcap.csv'],
    'Backdoor_Malware': ['Backdoor_Malware.pcap.csv'],
}
MAX_SAMPLES_PER_CLASS = 25000
RF_FINAL_TREES = 300

# BSO best hyperparameters (from real experiment)
BSO_HP = {
    'n_estimators': 266, 'max_depth': 20,
    'min_samples_split': 7, 'max_features': 0.469,
}

# BSO selected feature indices (from real experiment)
BSO_INDICES = [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 17, 20, 24, 25, 27, 28, 30, 34, 38]


def load_and_preprocess():
    """Replicate exact same data pipeline as real_experiment.py"""
    print("=" * 60)
    print("Phase 1: Loading & Preprocessing (same as real_experiment.py)")
    print("=" * 60)

    all_frames = []
    for label, files in DATA_FILES.items():
        label_frames = []
        for fname in files:
            fpath = os.path.join(DATA_DIR, fname)
            if not os.path.exists(fpath):
                continue
            df = pd.read_csv(fpath, low_memory=False)
            df['Label'] = label
            label_frames.append(df)
        if label_frames:
            combined = pd.concat(label_frames, ignore_index=True)
            if len(combined) > MAX_SAMPLES_PER_CLASS:
                combined = combined.sample(n=MAX_SAMPLES_PER_CLASS, random_state=RANDOM_SEED)
            all_frames.append(combined)

    data = pd.concat(all_frames, ignore_index=True)
    print(f"  Loaded: {len(data):,} samples")

    feature_cols = [c for c in data.columns if c != 'Label']
    X = data[feature_cols].copy()
    y = data['Label'].copy()

    for col in X.columns:
        X[col] = pd.to_numeric(X[col], errors='coerce')
    X.replace([np.inf, -np.inf], np.nan, inplace=True)
    X.fillna(X.median(), inplace=True)

    constant_cols = [c for c in X.columns if X[c].nunique() <= 1]
    if constant_cols:
        X.drop(columns=constant_cols, inplace=True)

    feature_names = list(X.columns)
    le = LabelEncoder()
    y_enc = le.fit_transform(y)
    class_names = list(le.classes_)
    n_classes = len(class_names)
    print(f"  Features: {len(feature_names)}, Classes: {class_names}")

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 70/10/20 split (SAME seed, SAME strategy)
    X_trainval, X_test, y_trainval, y_test = train_test_split(
        X_scaled, y_enc, test_size=0.2, random_state=RANDOM_SEED, stratify=y_enc)
    X_train, X_val, y_train, y_val = train_test_split(
        X_trainval, y_trainval, test_size=0.125, random_state=RANDOM_SEED, stratify=y_trainval)

    # SMOTE on training data
    if HAS_SMOTE:
        pre_smote = dict(zip(*np.unique(y_train, return_counts=True)))
        k = min(5, min(pre_smote.values()) - 1)
        smote = SMOTE(random_state=RANDOM_SEED, k_neighbors=max(1, k))
        X_train, y_train = smote.fit_resample(X_train, y_train)
        print(f"  SMOTE: {sum(pre_smote.values()):,} -> {len(X_train):,}")

    print(f"  Train={len(X_train):,} | Val={len(X_val):,} | Test={len(X_test):,}")

    return {
        'X_train': X_train, 'X_test': X_test,
        'y_train': y_train, 'y_test': y_test,
        'feature_names': feature_names,
        'class_names': class_names,
        'n_classes': n_classes,
    }


def get_proba(clf, X):
    """Get probability predictions from any classifier."""
    if hasattr(clf, 'predict_proba'):
        return clf.predict_proba(X)
    elif hasattr(clf, 'decision_function'):
        dec = clf.decision_function(X)
        if dec.ndim == 1:
            dec = np.column_stack([-dec, dec])
        exp_d = np.exp(dec - dec.max(axis=1, keepdims=True))
        return exp_d / exp_d.sum(axis=1, keepdims=True)
    return None


def compute_pr_curves(y_test, y_proba, class_names, n_classes):
    """Compute per-class precision-recall curves."""
    y_bin = label_binarize(y_test, classes=list(range(n_classes)))
    pr_data = []

    for ci in range(n_classes):
        precision, recall, _ = precision_recall_curve(y_bin[:, ci], y_proba[:, ci])
        ap = average_precision_score(y_bin[:, ci], y_proba[:, ci])

        # Downsample to ~50 points for JSON size
        step = max(1, len(precision) // 50)
        pr_data.append({
            'class': class_names[ci],
            'precision': precision[::step].tolist(),
            'recall': recall[::step].tolist(),
            'ap': round(float(ap), 4),
        })

    # Micro-averaged
    precision_micro, recall_micro, _ = precision_recall_curve(
        y_bin.ravel(), y_proba.ravel())
    ap_micro = average_precision_score(y_bin, y_proba, average='micro')
    step = max(1, len(precision_micro) // 50)
    pr_data.append({
        'class': 'micro-average',
        'precision': precision_micro[::step].tolist(),
        'recall': recall_micro[::step].tolist(),
        'ap': round(float(ap_micro), 4),
    })

    return pr_data


def extract_all_curves(prep):
    """Train all 12 models and extract ROC + PR curve data."""
    print("\n" + "=" * 60)
    print("Phase 2: Training Models & Extracting ROC + PR Curves")
    print("=" * 60)

    X_train, X_test = prep['X_train'], prep['X_test']
    y_train, y_test = prep['y_train'], prep['y_test']
    cn = prep['class_names']
    nc = prep['n_classes']
    nf = len(prep['feature_names'])
    bso_idx = np.array(BSO_INDICES)

    models = [
        ('BSO-Hybrid RF', RandomForestClassifier(
            n_estimators=BSO_HP['n_estimators'], max_depth=BSO_HP['max_depth'],
            min_samples_split=BSO_HP['min_samples_split'], max_features=BSO_HP['max_features'],
            class_weight='balanced', random_state=RANDOM_SEED, n_jobs=-1),
         bso_idx),
        ('XGBoost', XGBClassifier(
            n_estimators=200, max_depth=8, learning_rate=0.1,
            random_state=RANDOM_SEED, n_jobs=-1,
            eval_metric='mlogloss', verbosity=0) if HAS_XGB else None,
         None),
        ('Random Forest', RandomForestClassifier(
            n_estimators=RF_FINAL_TREES, class_weight='balanced',
            random_state=RANDOM_SEED, n_jobs=-1),
         None),
        ('GWO-RF', RandomForestClassifier(
            n_estimators=RF_FINAL_TREES, class_weight='balanced',
            random_state=RANDOM_SEED, n_jobs=-1),
         None),  # will be loaded from experiment_results.json
        ('Decision Tree', DecisionTreeClassifier(
            class_weight='balanced', random_state=RANDOM_SEED),
         None),
        ('SVM (Linear)', CalibratedClassifierCV(
            LinearSVC(max_iter=2000, class_weight='balanced',
                      random_state=RANDOM_SEED), cv=3),
         None),
    ]

    # Load feature indices from experiment_results.json
    exp_path = os.path.join(OUTPUT_DIR, 'experiment_results.json')
    if os.path.exists(exp_path):
        with open(exp_path, 'r') as f:
            exp = json.load(f)
        # Get GWO feature indices
        gwo_info = exp.get('featureSelectionComparison', {}).get('GWO', {})
        gwo_idx = np.array(gwo_info.get('selectedIndices', list(range(nf))))
        # Update GWO-RF entry
        for i, (name, clf, fi) in enumerate(models):
            if name == 'GWO-RF':
                models[i] = (name, clf, gwo_idx)
    else:
        print("  WARNING: experiment_results.json not found, using all features for GWO-RF")

    results = {}

    for name, clf, feat_idx in models:
        if clf is None:
            continue
        Xtr = X_train[:, feat_idx] if feat_idx is not None else X_train
        Xte = X_test[:, feat_idx] if feat_idx is not None else X_test

        print(f"\n  Training: {name} ({Xtr.shape[1]} features)...", end=" ", flush=True)
        t0 = time.time()
        clf.fit(Xtr, y_train)
        elapsed = time.time() - t0
        print(f"{elapsed:.1f}s")

        y_proba = get_proba(clf, Xte)
        if y_proba is None:
            print(f"    SKIP: {name} has no probability output")
            continue

        # ROC curves
        y_bin = label_binarize(y_test, classes=list(range(nc)))
        roc_data = []
        for ci in range(nc):
            fpr, tpr, _ = roc_curve(y_bin[:, ci], y_proba[:, ci])
            roc_auc = auc(fpr, tpr)
            step = max(1, len(fpr) // 50)
            roc_data.append({
                'class': cn[ci],
                'fpr': fpr[::step].tolist(),
                'tpr': tpr[::step].tolist(),
                'auc': round(float(roc_auc), 4),
            })

        # PR curves
        pr_data = compute_pr_curves(y_test, y_proba, cn, nc)

        results[name] = {
            'rocPerClass': roc_data,
            'prCurves': pr_data,
        }

        # Print summary
        for r in roc_data:
            print(f"    ROC {r['class']:30s}: AUC={r['auc']:.4f}")
        for p in pr_data:
            print(f"    PR  {p['class']:30s}: AP={p['ap']:.4f}")

    return results


def compute_tsne(prep):
    """Compute t-SNE embedding on test data."""
    print("\n" + "=" * 60)
    print("Phase 3: t-SNE Dimensionality Reduction Visualization")
    print("=" * 60)

    X_test = prep['X_test']
    y_test = prep['y_test']
    cn = prep['class_names']
    bso_idx = np.array(BSO_INDICES)

    # Use BSO-selected features for t-SNE (more meaningful)
    X_bso = X_test[:, bso_idx]

    # Subsample for t-SNE speed (max 5000 points)
    max_points = 5000
    if len(X_bso) > max_points:
        idx = np.random.choice(len(X_bso), max_points, replace=False)
        X_sub = X_bso[idx]
        y_sub = y_test[idx]
    else:
        X_sub = X_bso
        y_sub = y_test

    print(f"  Input: {X_sub.shape[0]} samples × {X_sub.shape[1]} BSO features")

    # Two perplexity values for comparison
    tsne_results = {}
    for perp in [30, 50]:
        print(f"  Computing t-SNE (perplexity={perp})...", end=" ", flush=True)
        t0 = time.time()
        tsne = TSNE(n_components=2, perplexity=perp, random_state=RANDOM_SEED,
                     max_iter=1000, learning_rate='auto', init='pca')
        embedding = tsne.fit_transform(X_sub)
        elapsed = time.time() - t0
        print(f"{elapsed:.1f}s")

        # Build point data
        points = []
        for i in range(len(embedding)):
            points.append({
                'x': round(float(embedding[i, 0]), 2),
                'y': round(float(embedding[i, 1]), 2),
                'label': int(y_sub[i]),
                'className': cn[y_sub[i]],
            })

        tsne_results[f'perplexity_{perp}'] = {
            'perplexity': perp,
            'nPoints': len(points),
            'nFeatures': X_sub.shape[1],
            'featureSet': 'BSO (19 features)',
            'computeTime': round(elapsed, 1),
            'points': points,
        }

    return tsne_results


def main():
    print("\n" + "#" * 60)
    print("  EXTRACT: ROC + PR Curves + t-SNE")
    print("#" * 60)
    t_start = time.time()

    prep = load_and_preprocess()
    curves = extract_all_curves(prep)
    tsne = compute_tsne(prep)

    total = time.time() - t_start
    print(f"\n  Total time: {total:.1f}s ({total/60:.1f} min)")

    # Save results
    output = {
        'curves': curves,
        'tsne': tsne,
        'metadata': {
            'script': 'extract_curves_tsne.py',
            'seed': RANDOM_SEED,
            'totalTime': round(total, 1),
            'classNames': prep['class_names'],
            'bsoFeatures': BSO_INDICES,
        }
    }

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_path = os.path.join(OUTPUT_DIR, 'curves_tsne_data.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False, default=str)

    print(f"\n  Saved to: {out_path}")
    print(f"  File size: {os.path.getsize(out_path) / 1024:.1f} KB")
    print("\n" + "#" * 60)
    print("  DONE!")
    print("#" * 60)


if __name__ == '__main__':
    main()
