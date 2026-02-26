#!/usr/bin/env python3
"""
=================================================================================
Master Thesis Experiment Runner (Enhanced)
=================================================================================

Title: Improved Detection of DDoS Attacks Using a Hybrid Machine Learning 
       Framework Optimized with Bat Swarm Optimization (BSO) in Dynamic Network 
       Environments

Author: SHUAIB AYAD JASIM
Date: February 2026
University: Karatay University, Konya, Turkey

USAGE:
    python run_experiments_enhanced.py

DESCRIPTION:
    This enhanced script runs all experiments in sequence with:
    - Comprehensive error handling and logging
    - Progress tracking and feedback
    - Dependency checking
    - Detailed result summary
    - Performance metrics

OUTPUT:
    ./results/
        experiment_results.json     - Complete experiment data
        bso_convergence.json        - BSO convergence data
        model_comparison.json       - Model comparison data
        performance_metrics.json    - Timing and resource metrics
        figures/
            bso_convergence_analysis.png
            feature_importance_analysis.png
            bso_parameter_sensitivity.png
            confusion_matrices.png
            roc_and_comparison.png
            attack_detection_heatmap.png

REQUIREMENTS:
    pip install -r requirements.txt

=================================================================================
"""

import os
import sys
import time
import logging
import traceback
from datetime import datetime
from pathlib import Path

# ============================================================================
# Configuration
# ============================================================================

SCRIPT_DIR = Path(__file__).parent.absolute()
PROJECT_DIR = SCRIPT_DIR.parent
RESULTS_DIR = PROJECT_DIR / 'results'
FIGURES_DIR = RESULTS_DIR / 'figures'
DATA_DIR = PROJECT_DIR / 'data' / 'CICIoT2023'

LOG_LEVEL = logging.INFO
LOG_FORMAT = '[%(asctime)s] %(levelname)-8s: %(message)s'
LOG_DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

# ============================================================================
# Logging Setup
# ============================================================================

def setup_logging():
    """Configure logging system."""
    logging.basicConfig(
        level=LOG_LEVEL,
        format=LOG_FORMAT,
        datefmt=LOG_DATE_FORMAT,
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(RESULTS_DIR / 'experiment.log')
        ]
    )
    return logging.getLogger(__name__)

logger = None


# ============================================================================
# Utility Functions
# ============================================================================

def setup_directories():
    """Create required directories."""
    logger.info("Setting up directories...")
    try:
        RESULTS_DIR.mkdir(parents=True, exist_ok=True)
        FIGURES_DIR.mkdir(parents=True, exist_ok=True)
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        logger.info(f"✓ Directory structure ready: {RESULTS_DIR}")
        return True
    except Exception as e:
        logger.error(f"Failed to create directories: {e}")
        return False


def check_dependencies():
    """Check if all required Python packages are available."""
    logger.info("Checking dependencies...")
    
    required_packages = {
        'numpy': 'NumPy',
        'pandas': 'Pandas',
        'sklearn': 'Scikit-learn',
        'matplotlib': 'Matplotlib',
        'seaborn': 'Seaborn',
        'scipy': 'SciPy'
    }
    
    optional_packages = {
        'imblearn': 'Imbalanced-learn (SMOTE)',
        'xgboost': 'XGBoost'
    }
    
    missing = []
    for import_name, package_name in required_packages.items():
        try:
            __import__(import_name)
            logger.debug(f"  ✓ {package_name}")
        except ImportError:
            logger.error(f"  ✗ {package_name} NOT FOUND")
            missing.append((import_name, package_name))
    
    for import_name, package_name in optional_packages.items():
        try:
            __import__(import_name)
            logger.debug(f"  ✓ {package_name} (optional)")
        except ImportError:
            logger.warning(f"  ⚠ {package_name} (optional) NOT FOUND - some features may be unavailable")
    
    if missing:
        logger.error(f"Missing {len(missing)} required packages:")
        for _, name in missing:
            logger.error(f"  - {name}")
        logger.error("Install with: pip install -r requirements.txt")
        return False
    
    logger.info("✓ All required dependencies available")
    return True


def print_header(title, level=1):
    """Print a formatted header."""
    separator = "=" * 80
    if level == 1:
        logger.info(separator)
        logger.info(f"  {title}")
        logger.info(separator)
    else:
        logger.info("-" * 80)
        logger.info(f"  {title}")
        logger.info("-" * 80)


def print_experiment_intro():
    """Print experiment introduction."""
    print_header("🔬 MASTER THESIS EXPERIMENT RUNNER", 1)
    logger.info(f"Title: Improved Detection of DDoS Attacks Using Hybrid ML")
    logger.info(f"       Framework Optimized with Bat Swarm Optimization (BSO)")
    logger.info(f"Author: SHUAIB AYAD JASIM")
    logger.info(f"Institution: Karatay University, Konya, Turkey")
    logger.info(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info(f"Platform: {sys.platform} | Python: {sys.version.split()[0]}")


def run_experiment_step(step_num, title, module_name, function_name):
    """Run a single experiment step with error handling."""
    print_header(f"STEP {step_num}/3: {title}", 2)
    
    try:
        module = __import__(module_name)
        func = getattr(module, function_name)
        
        logger.info(f"Starting {title}...")
        start = time.time()
        
        result = func()
        
        elapsed = time.time() - start
        logger.info(f"✓ {title} completed in {elapsed:.1f}s")
        return True
        
    except ImportError as e:
        logger.error(f"Could not import {module_name}: {e}")
        logger.info("Make sure you're running from the scripts/ directory")
        return False
    except AttributeError as e:
        logger.error(f"Could not find function {function_name} in {module_name}: {e}")
        return False
    except Exception as e:
        logger.error(f"Error running {title}: {e}")
        logger.debug(traceback.format_exc())
        return False


def print_results_summary(total_time):
    """Print summary of generated results."""
    print_header("📊 RESULTS SUMMARY", 2)
    
    if RESULTS_DIR.exists():
        files_generated = []
        total_size = 0
        
        for filepath in RESULTS_DIR.rglob('*'):
            if filepath.is_file():
                size = filepath.stat().st_size
                total_size += size
                rel_path = filepath.relative_to(PROJECT_DIR)
                files_generated.append((rel_path, size))
        
        if files_generated:
            logger.info("Generated files:")
            for rel_path, size in sorted(files_generated):
                logger.info(f"  {rel_path} ({size:,} bytes)")
            logger.info(f"\nTotal size: {total_size:,} bytes ({total_size/1024/1024:.2f} MB)")
        else:
            logger.warning("No output files found")
    
    logger.info(f"\nTotal execution time: {total_time:.1f}s ({total_time/60:.1f} minutes)")


def print_next_steps():
    """Print next steps for user."""
    print_header("📝 NEXT STEPS", 2)
    logger.info("1. Move to project root directory:")
    logger.info("   cd ..")
    logger.info("")
    logger.info("2. Copy results to web dashboard:")
    logger.info("   cp results/experiment_results.json public/")
    logger.info("")
    logger.info("3. Start the web dashboard:")
    logger.info("   npm run dev")
    logger.info("")
    logger.info("4. Open in browser:")
    logger.info("   http://localhost:3000")


# ============================================================================
# Main Entry Point
# ============================================================================

def main():
    """Main entry point."""
    global logger
    
    # Setup logging
    logger = setup_logging()
    
    # Print introduction
    print_experiment_intro()
    
    # Setup and validation
    if not setup_directories():
        logger.error("Failed to setup directories")
        return 1
    
    if not check_dependencies():
        logger.error("Missing required dependencies")
        return 1
    
    # Change to scripts directory
    os.chdir(SCRIPT_DIR)
    logger.info(f"Working directory: {os.getcwd()}")
    
    # Run experiments
    start_time = time.time()
    
    try:
        success = True
        
        # Step 1: Main experiment
        if not run_experiment_step(1, "BSO-DDoS Main Experiment", "real_experiment", "main"):
            success = False
        
        # Step 2: BSO Feature Analysis
        if not run_experiment_step(2, "BSO Feature Analysis", "bso_feature_analysis", "main"):
            logger.warning("Step 2 failed, continuing anyway...")
        
        # Step 3: Model Evaluation
        if not run_experiment_step(3, "Model Evaluation", "model_evaluation", "main"):
            logger.warning("Step 3 failed, continuing anyway...")
        
        total_time = time.time() - start_time
        
        # Print results
        print_header("", 1)
        if success:
            logger.info("✅ PRIMARY EXPERIMENTS COMPLETED SUCCESSFULLY")
        else:
            logger.warning("⚠️  SOME EXPERIMENTS HAD ISSUES")
        
        print_results_summary(total_time)
        print_next_steps()
        print_header("", 1)
        
        return 0 if success else 1
        
    except KeyboardInterrupt:
        logger.warning("\n⚠️  Experiment interrupted by user")
        return 130
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        logger.debug(traceback.format_exc())
        return 1
    finally:
        # Final log
        logger.info("Experiment runner finished")


if __name__ == '__main__':
    sys.exit(main())
