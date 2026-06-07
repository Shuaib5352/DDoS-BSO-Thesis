#!/usr/bin/env python3
"""
Extract cross-validation fold scores for statistical analysis
Generates CSV files suitable for Paired t-test, Wilcoxon, and Cohen's d calculations
Reference model: BSO-Hybrid RF (Proposed)
"""

import json
import csv
from pathlib import Path
from typing import Dict, List, Any, Tuple
import numpy as np
from scipy import stats

def extract_fold_scores(json_file: str) -> Tuple[Dict[str, Dict[str, List[float]]], List[str]]:
    """
    Extract fold scores from experiment_results.json
    
    Args:
        json_file: Path to experiment_results.json
        
    Returns:
        Tuple of (fold_data dict, metrics list)
    """
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    fold_data = {}
    metrics = set()
    
    if 'crossValidation' in data:
        cv_data = data['crossValidation']
        
        for model_name, model_metrics in cv_data.items():
            fold_data[model_name] = {}
            
            # Extract scores for each metric
            for metric_name, metric_data in model_metrics.items():
                if metric_name == 'folds':
                    continue
                    
                if isinstance(metric_data, dict) and 'scores' in metric_data:
                    fold_data[model_name][metric_name] = metric_data['scores']
                    metrics.add(metric_name)
    
    return fold_data, sorted(list(metrics))


def export_folds_to_csv(fold_data: Dict[str, Dict[str, List[float]]], 
                        output_file: str, metric: str = 'accuracy') -> None:
    """
    Export fold scores to CSV for statistical analysis
    
    Args:
        fold_data: Dictionary with model fold scores
        output_file: Path to output CSV file
        metric: Metric to export (accuracy, f1Macro, precision, recall)
    """
    # Extract fold scores for the specified metric
    models = []
    fold_scores = {}
    max_folds = 0
    
    for model_name, metrics in fold_data.items():
        if metric in metrics:
            scores = metrics[metric]
            fold_scores[model_name] = scores
            models.append(model_name)
            max_folds = max(max_folds, len(scores))
    
    if not models:
        print(f"✗ No data found for metric: {metric}")
        return
    
    # Sort with reference model first
    reference_model = "BSO-Hybrid RF (Proposed)"
    if reference_model in models:
        models.remove(reference_model)
        models = [reference_model] + sorted(models)
    
    # Write CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        
        # Header
        header = ['Fold'] + models
        writer.writerow(header)
        
        # Data rows
        for fold_idx in range(max_folds):
            row = [f'Fold_{fold_idx + 1}']
            for model in models:
                if fold_idx < len(fold_scores[model]):
                    row.append(fold_scores[model][fold_idx])
                else:
                    row.append('')
            writer.writerow(row)
    
    print(f"✓ Fold scores for '{metric}' exported to: {output_file}")
    print(f"  Models: {len(models)}")
    print(f"  Folds: {max_folds}")


def export_summary_statistics(fold_data: Dict[str, Dict[str, List[float]]], 
                              output_file: str) -> None:
    """
    Export summary statistics for all metrics
    
    Args:
        fold_data: Dictionary with model fold scores
        output_file: Path to output CSV file
    """
    rows = []
    
    for model_name, metrics in fold_data.items():
        for metric_name, scores in metrics.items():
            scores_arr = np.array(scores)
            row = {
                'Model': model_name,
                'Metric': metric_name,
                'Folds': len(scores),
                'Mean': np.mean(scores_arr),
                'Std': np.std(scores_arr, ddof=1),
                'Min': np.min(scores_arr),
                'Max': np.max(scores_arr),
                'Median': np.median(scores_arr),
                'Q1': np.percentile(scores_arr, 25),
                'Q3': np.percentile(scores_arr, 75)
            }
            rows.append(row)
    
    # Sort with reference model first
    reference_model = "BSO-Hybrid RF (Proposed)"
    reference_rows = [r for r in rows if r['Model'] == reference_model]
    other_rows = sorted([r for r in rows if r['Model'] != reference_model], key=lambda x: x['Model'])
    rows = reference_rows + other_rows
    
    # Write CSV
    fieldnames = ['Model', 'Metric', 'Folds', 'Mean', 'Std', 'Min', 'Max', 'Median', 'Q1', 'Q3']
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"✓ Summary statistics exported to: {output_file}")


def calculate_statistical_tests(fold_data: Dict[str, Dict[str, List[float]]], 
                                output_file: str, metric: str = 'accuracy') -> None:
    """
    Calculate paired t-tests, Wilcoxon tests, and Cohen's d
    Reference model: BSO-Hybrid RF (Proposed)
    
    Args:
        fold_data: Dictionary with model fold scores
        output_file: Path to output CSV file
        metric: Metric to analyze
    """
    # Get scores for the metric
    scores_dict = {}
    for model_name, model_metrics in fold_data.items():
        if metric in model_metrics:
            scores_dict[model_name] = np.array(model_metrics[metric])
    
    if len(scores_dict) < 2:
        print(f"✗ Need at least 2 models with '{metric}' data for statistical tests")
        return
    
    # Reference model
    reference_model = "BSO-Hybrid RF (Proposed)"
    if reference_model not in scores_dict:
        print(f"✗ Reference model '{reference_model}' not found!")
        print(f"  Available models: {list(scores_dict.keys())}")
        return
    
    rows = []
    scores1 = scores_dict[reference_model]
    
    # Compare reference with all other models
    for model2 in sorted(scores_dict.keys()):
        if model2 == reference_model:
            continue
        
        scores2 = scores_dict[model2]
        
        # Ensure same length
        if len(scores1) != len(scores2):
            print(f"⚠ Warning: {reference_model} has {len(scores1)} folds, {model2} has {len(scores2)} folds")
            min_len = min(len(scores1), len(scores2))
            s1 = scores1[:min_len]
            s2 = scores2[:min_len]
        else:
            s1 = scores1
            s2 = scores2
        
        # Paired t-test
        t_stat, t_pvalue = stats.ttest_rel(s1, s2)
        
        # Wilcoxon signed-rank test
        w_stat, w_pvalue = stats.wilcoxon(s1, s2)
        
        # Cohen's d
        diff = s1 - s2
        mean_diff = np.mean(diff)
        cohens_d = mean_diff / np.std(diff, ddof=1)
        
        # Effect size interpretation
        if abs(cohens_d) < 0.2:
            effect = "negligible"
        elif abs(cohens_d) < 0.5:
            effect = "small"
        elif abs(cohens_d) < 0.8:
            effect = "medium"
        else:
            effect = "large"
        
        row = {
            'Comparison': f"{reference_model} vs {model2}",
            'Baseline_Model': reference_model,
            'Comparison_Model': model2,
            'Mean_Diff': mean_diff,
            'T_Statistic': t_stat,
            'T_p_value': t_pvalue,
            'T_Significant': 'Yes' if t_pvalue < 0.05 else 'No',
            'Wilcoxon_Statistic': w_stat,
            'Wilcoxon_p_value': w_pvalue,
            'Wilcoxon_Significant': 'Yes' if w_pvalue < 0.05 else 'No',
            'Cohens_d': cohens_d,
            'Effect_Size': effect
        }
        rows.append(row)
    
    # Write CSV
    fieldnames = ['Comparison', 'Baseline_Model', 'Comparison_Model', 'Mean_Diff', 'T_Statistic', 
                  'T_p_value', 'T_Significant', 'Wilcoxon_Statistic', 'Wilcoxon_p_value',
                  'Wilcoxon_Significant', 'Cohens_d', 'Effect_Size']
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"✓ Statistical tests for '{metric}' exported to: {output_file}")
    print(f"  Reference Model: {reference_model}")
    print(f"  Comparisons: {len(rows)}")


def main():
    """Main execution function"""
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    json_file = repo_root / 'public' / 'experiment_results.json'
    output_dir = repo_root / 'public'
    
    print("=" * 80)
    print("Cross-Validation Fold Scores Extraction & Statistical Analysis")
    print("Reference Model: BSO-Hybrid RF (Proposed)")
    print("=" * 80)
    
    # Check if JSON file exists
    if not json_file.exists():
        print(f"✗ Error: {json_file} not found!")
        return
    
    print(f"📄 Reading from: {json_file}\n")
    
    # Extract fold data
    fold_data, metrics = extract_fold_scores(str(json_file))
    
    if not fold_data:
        print("✗ No cross-validation data found!")
        return
    
    print(f"✓ Found {len(fold_data)} models")
    print(f"✓ Available metrics: {', '.join(metrics)}\n")
    
    # List all models
    print("Models found:")
    for i, model in enumerate(sorted(fold_data.keys()), 1):
        prefix = "🔴 " if model == "BSO-Hybrid RF (Proposed)" else "   "
        print(f"{prefix}{i}. {model}")
    print()
    
    # Export fold scores for each metric
    print("\n1. Exporting fold scores by metric:")
    print("-" * 80)
    for metric in metrics:
        csv_file = output_dir / f'cross_validation_folds_{metric}.csv'
        export_folds_to_csv(fold_data, str(csv_file), metric)
    
    # Export summary statistics
    print("\n2. Exporting summary statistics:")
    print("-" * 80)
    summary_file = output_dir / 'cross_validation_summary.csv'
    export_summary_statistics(fold_data, str(summary_file))
    
    # Calculate statistical tests for each metric
    print("\n3. Calculating statistical tests (BSO-Hybrid RF as reference):")
    print("-" * 80)
    for metric in metrics:
        test_file = output_dir / f'statistical_tests_{metric}.csv'
        calculate_statistical_tests(fold_data, str(test_file), metric)
    
    # Print detailed summary
    print("\n" + "=" * 80)
    print("DETAILED SUMMARY")
    print("=" * 80)
    for model_name, metrics_dict in sorted(fold_data.items()):
        ref_mark = " 🔴 [REFERENCE]" if model_name == "BSO-Hybrid RF (Proposed)" else ""
        print(f"\n{model_name}{ref_mark}:")
        for metric_name, scores in sorted(metrics_dict.items()):
            scores_arr = np.array(scores)
            print(f"  {metric_name}:")
            print(f"    Scores: {[f'{s:.2f}' for s in scores]}")
            print(f"    Mean ± Std: {np.mean(scores_arr):.2f} ± {np.std(scores_arr, ddof=1):.4f}")
            print(f"    Range: [{np.min(scores_arr):.2f}, {np.max(scores_arr):.2f}]")
    
    print("\n" + "=" * 80)
    print("✓ All exports completed!")
    print("=" * 80)


if __name__ == '__main__':
    main()
