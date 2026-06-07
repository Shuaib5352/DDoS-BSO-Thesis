#!/usr/bin/env python3
"""
Extract cross-validation results from experiment_results.json and export to CSV
"""

import json
import csv
from pathlib import Path
from typing import Dict, List, Any

def extract_cross_validation_data(json_file: str) -> List[Dict[str, Any]]:
    """
    Extract cross-validation results from JSON file.
    
    Args:
        json_file: Path to experiment_results.json
        
    Returns:
        List of dictionaries containing cross-validation data
    """
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    cv_results = []
    
    # Extract cross-validation data
    if 'crossValidation' in data:
        cv_data = data['crossValidation']
        
        for model_name, metrics in cv_data.items():
            row = {'Model': model_name}
            
            # Add all metrics from the CV data
            for metric_name, metric_values in metrics.items():
                if isinstance(metric_values, dict):
                    # Handle metrics with mean and std (e.g., accuracy, f1Macro)
                    if 'mean' in metric_values:
                        row[f'{metric_name}_Mean'] = metric_values['mean']
                    if 'std' in metric_values:
                        row[f'{metric_name}_Std'] = metric_values['std']
                else:
                    row[metric_name] = metric_values
            
            cv_results.append(row)
    
    return cv_results


def export_to_csv(data: List[Dict[str, Any]], output_file: str) -> None:
    """
    Export cross-validation data to CSV file.
    
    Args:
        data: List of dictionaries with cross-validation results
        output_file: Path to output CSV file
    """
    if not data:
        print("No cross-validation data found!")
        return
    
    # Get all unique fieldnames
    fieldnames = set()
    for row in data:
        fieldnames.update(row.keys())
    
    # Sort fieldnames with 'Model' first
    fieldnames = sorted(list(fieldnames))
    if 'Model' in fieldnames:
        fieldnames.remove('Model')
        fieldnames = ['Model'] + fieldnames
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    
    print(f"✓ Cross-validation results exported to: {output_file}")
    print(f"✓ Total models: {len(data)}")
    print(f"✓ Total metrics: {len(fieldnames) - 1}")


def main():
    """Main execution function"""
    # Define paths
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    json_file = repo_root / 'public' / 'experiment_results.json'
    csv_file = repo_root / 'public' / 'cross_validation_results.csv'
    
    print("=" * 60)
    print("Cross-Validation Results Extraction Tool")
    print("=" * 60)
    
    # Check if JSON file exists
    if not json_file.exists():
        print(f"✗ Error: {json_file} not found!")
        return
    
    print(f"📄 Reading from: {json_file}")
    
    # Extract data
    cv_data = extract_cross_validation_data(str(json_file))
    
    if cv_data:
        # Export to CSV
        export_to_csv(cv_data, str(csv_file))
        
        # Print summary
        print("\n" + "=" * 60)
        print("Summary:")
        print("=" * 60)
        for idx, row in enumerate(cv_data, 1):
            print(f"\n{idx}. {row.get('Model', 'Unknown')}:")
            for key, value in sorted(row.items()):
                if key != 'Model':
                    if isinstance(value, float):
                        print(f"   {key}: {value:.4f}")
                    else:
                        print(f"   {key}: {value}")
    else:
        print("✗ No cross-validation data found!")


if __name__ == '__main__':
    main()
