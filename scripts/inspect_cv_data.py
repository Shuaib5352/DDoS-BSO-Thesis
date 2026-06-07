#!/usr/bin/env python3
"""
Quick inspection script to check which models have cross-validation fold scores
"""

import json
from pathlib import Path

def inspect_cv_data():
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    json_file = repo_root / 'public' / 'experiment_results.json'
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    cv_data = data.get('crossValidation', {})
    
    print("=" * 80)
    print("CROSS-VALIDATION DATA INSPECTION")
    print("=" * 80)
    print(f"\nTotal models with CV data: {len(cv_data)}\n")
    
    for model_name, metrics in sorted(cv_data.items()):
        print(f"{'='*80}")
        print(f"Model: {model_name}")
        print(f"{'='*80}")
        
        num_folds = metrics.get('folds', 'N/A')
        print(f"Number of folds: {num_folds}")
        
        for metric_name in ['accuracy', 'f1Macro', 'precision', 'recall']:
            if metric_name in metrics:
                metric_data = metrics[metric_name]
                if isinstance(metric_data, dict):
                    scores = metric_data.get('scores', [])
                    mean_val = metric_data.get('mean', 'N/A')
                    std_val = metric_data.get('std', 'N/A')
                    print(f"\n  {metric_name}:")
                    print(f"    Scores ({len(scores)} folds): {scores}")
                    print(f"    Mean: {mean_val}, Std: {std_val}")
            else:
                print(f"\n  {metric_name}: ❌ NOT FOUND")
        
        print()
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY FOR STATISTICAL TESTS")
    print("=" * 80)
    
    models_with_all_metrics = []
    for model_name, metrics in cv_data.items():
        has_all = all(metric in metrics for metric in ['accuracy', 'f1Macro', 'precision', 'recall'])
        if has_all:
            models_with_all_metrics.append(model_name)
    
    print(f"\n✅ Models with all metrics (accuracy, f1Macro, precision, recall):")
    print(f"   Total: {len(models_with_all_metrics)}")
    for i, model in enumerate(models_with_all_metrics, 1):
        ref_mark = " 🔴 [REFERENCE]" if model == "BSO-Hybrid RF (Proposed)" else ""
        print(f"   {i}. {model}{ref_mark}")
    
    if len(models_with_all_metrics) < 2:
        print("\n⚠️  WARNING: Less than 2 models available for statistical comparison!")
        print("   Cannot perform paired statistical tests.")
    else:
        print(f"\n✅ Can perform statistical tests between {len(models_with_all_metrics)} models")
        print(f"   Comparisons: BSO-Hybrid RF vs {len(models_with_all_metrics) - 1} other model(s)")

if __name__ == '__main__':
    inspect_cv_data()
