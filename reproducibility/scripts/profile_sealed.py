"""Profile one frozen model per fresh process with identical timings."""

import argparse
import json
from pathlib import Path
from time import perf_counter

import joblib
import numpy as np
import pandas as pd
import psutil


SCRIPT_DIR = Path(__file__).resolve().parent
OUT = SCRIPT_DIR.parent if SCRIPT_DIR.parent.name == "reproducibility" else SCRIPT_DIR.parent / "reproducibility"
parser = argparse.ArgumentParser()
parser.add_argument("--model", choices=["bso", "all39"], required=True)
args = parser.parse_args()
filename = "fitted_pipeline.joblib" if args.model == "bso" else "fitted_rf_all39.joblib"
process = psutil.Process()
rss_before = process.memory_info().rss
bundle = joblib.load(OUT / filename)
rss_after = process.memory_info().rss
test = np.load(OUT / "test_inputs.npz")
raw = test["X"]
imputer, scaler, keep, mask, model = (bundle[k] for k in
    ("imputer", "scaler", "constant_feature_mask", "selected_feature_mask", "model"))
def predict_pipeline(batch):
    x = scaler.transform(imputer.transform(batch)[:, keep])[:, mask]
    return model.predict_proba(x)


rows = []
for batch_size in [1, 32, 128, 512, 1024]:
    batch = raw[:batch_size]
    for _ in range(5):
        predict_pipeline(batch)
    times = []
    for _ in range(100):
        t = perf_counter()
        predict_pipeline(batch)
        times.append(perf_counter() - t)
    median = float(np.median(times))
    rows.append({"batch_size": batch_size, "repetitions": 100,
        "median_batch_ms": 1000 * median, "p95_batch_ms": 1000 * float(np.quantile(times, 0.95)),
        "median_ms_per_flow": 1000 * median / batch_size,
        "throughput_flows_per_second": batch_size / median})
pd.DataFrame(rows).to_csv(OUT / f"resource_profile_{args.model}.csv", index=False)
summary = {"model": args.model, "serialized_model_mb": (OUT / filename).stat().st_size / 1e6,
    "rss_before_load_mb": rss_before / 1e6, "rss_after_load_mb": rss_after / 1e6,
    "rss_increment_mb": (rss_after - rss_before) / 1e6,
    "peak_working_set_mb": getattr(process.memory_info(), "peak_wset", process.memory_info().rss) / 1e6,
    "measurement": "software host profile; full saved preprocessing plus predict_proba; five warmups and 100 repeated calls per batch size",
    "physical_energy_measured": False}
(OUT / f"resource_summary_{args.model}.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
print(summary)
print(pd.DataFrame(rows).to_string(index=False))
