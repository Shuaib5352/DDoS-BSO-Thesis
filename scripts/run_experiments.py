#!/usr/bin/env python3
"""
=================================================================================
Master Experiment Runner
=================================================================================
Runs all experiments in sequence and generates the complete results package
for the Master's thesis.

Usage:
    python run_experiments.py

This script will:
1. Run the main BSO-DDoS experiment pipeline
2. Generate BSO feature selection analysis plots
3. Generate model evaluation plots and tables
4. Export all results to JSON for web dashboard integration

Output:
    ./results/
        experiment_results.json     - Complete experiment data
        bso_convergence.json        - BSO convergence data
        model_comparison.json       - Model comparison data
        figures/
            bso_convergence_analysis.png
            feature_importance_analysis.png
            bso_parameter_sensitivity.png
            bso_search_space.png
            confusion_matrices.png
            roc_and_comparison.png
            attack_detection_heatmap.png
            training_time_vs_accuracy.png
            model_comparison_table.csv
            model_comparison_table.tex
=================================================================================
"""

import os
import sys
import time
from datetime import datetime


def main():
    start = time.time()

    print("=" * 80)
    print("  MASTER THESIS EXPERIMENT RUNNER")
    print("  DDoS Detection with BSO-Optimized Hybrid ML Framework")
    print("  Dataset: CIC-DDoS2019")
    print(f"  Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)

    # Create output directories
    os.makedirs('./results/figures/', exist_ok=True)
    os.makedirs('./data/CIC-DDoS2019/', exist_ok=True)

    # Step 1: Main BSO-DDoS Experiment
    print("\n" + "=" * 80)
    print("  STEP 1/3: Running Main BSO-DDoS Experiment Pipeline")
    print("=" * 80)
    try:
        from bso_ddos_experiment import main as run_experiment
        run_experiment()
    except ImportError:
        print("  ERROR: Could not import bso_ddos_experiment.py")
        print("  Make sure you're running from the scripts/ directory")
        sys.exit(1)

    # Step 2: BSO Feature Analysis
    print("\n" + "=" * 80)
    print("  STEP 2/3: Generating BSO Feature Analysis Plots")
    print("=" * 80)
    try:
        from bso_feature_analysis import main as run_bso_analysis
        run_bso_analysis()
    except ImportError:
        print("  ERROR: Could not import bso_feature_analysis.py")

    # Step 3: Model Evaluation
    print("\n" + "=" * 80)
    print("  STEP 3/3: Generating Model Evaluation Plots")
    print("=" * 80)
    try:
        from model_evaluation import main as run_evaluation
        run_evaluation()
    except ImportError:
        print("  ERROR: Could not import model_evaluation.py")

    total_time = time.time() - start

    print("\n" + "=" * 80)
    print("  ALL EXPERIMENTS COMPLETE")
    print("=" * 80)
    print(f"  Total execution time: {total_time:.1f} seconds ({total_time/60:.1f} minutes)")
    print(f"  Results directory: ./results/")
    print(f"  Figures directory: ./results/figures/")
    print()
    print("  Files generated:")
    for root, dirs, files in os.walk('./results'):
        for f in sorted(files):
            filepath = os.path.join(root, f)
            size = os.path.getsize(filepath)
            print(f"    {filepath} ({size:,} bytes)")
    print()
    print("  To use with the web dashboard:")
    print("  Copy experiment_results.json to the public/ directory")
    print("  or update lib/cic-ddos2019-dataset.ts with the actual results.")
    print("=" * 80)


if __name__ == '__main__':
    main()
