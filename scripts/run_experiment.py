#!/usr/bin/env python3
"""
================================================================================
MASTER'S THESIS - PROFESSIONAL EXPERIMENT RUNNER v5
"Improved Detection of DDoS Attacks Using a Hybrid Machine Learning Framework
 Optimized with Bat Swarm Optimization (BSO) in Dynamic Network Environments"

Author: SHUAIB AYAD JASIM
Purpose: Automated, professional-grade experiment execution with proper logging,
         error handling, and data validation.
================================================================================
"""

import os
import sys
import json
import logging
import argparse
import traceback
from datetime import datetime
from pathlib import Path

# Configure logging
LOG_DIR = Path(__file__).parent.parent / 'logs'
LOG_DIR.mkdir(exist_ok=True)

LOG_FILE = LOG_DIR / f"experiment_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class ExperimentRunner:
    """Professional experiment runner with full error handling and validation."""
    
    def __init__(self, config_file=None):
        """Initialize experiment runner."""
        self.start_time = datetime.now()
        self.config = self.load_config(config_file)
        self.validate_environment()
        logger.info("=" * 80)
        logger.info("EXPERIMENT RUNNER INITIALIZED")
        logger.info(f"Config: {self.config}")
        logger.info("=" * 80)
    
    def load_config(self, config_file):
        """Load configuration from file or use defaults."""
        default_config = {
            'data_dir': r'C:\Users\imiss\Downloads',
            'output_dir': Path(__file__).parent.parent / 'public',
            'random_seed': 42,
            'cv_folds': 10,
            'max_samples_per_class': 25000,
            'bso_pop': 25,
            'bso_iter': 50,
            'comp_pop': 20,
            'comp_iter': 40,
            'verbose': True,
        }
        
        if config_file and os.path.exists(config_file):
            try:
                with open(config_file, 'r') as f:
                    user_config = json.load(f)
                default_config.update(user_config)
                logger.info(f"Loaded config from {config_file}")
            except Exception as e:
                logger.warning(f"Failed to load config from {config_file}: {e}")
        
        return default_config
    
    def validate_environment(self):
        """Validate that all required dependencies and data are available."""
        logger.info("Validating environment...")
        
        # Check Python version
        if sys.version_info < (3, 8):
            raise RuntimeError(f"Python 3.8+ required, got {sys.version}")
        logger.info(f"✓ Python {sys.version.split()[0]}")
        
        # Check required packages
        required_packages = {
            'numpy': 'numerical computing',
            'pandas': 'data processing',
            'sklearn': 'machine learning',
            'scipy': 'statistics',
        }
        
        for pkg, desc in required_packages.items():
            try:
                __import__(pkg)
                logger.info(f"✓ {pkg}: {desc}")
            except ImportError:
                raise RuntimeError(f"Missing required package: {pkg} ({desc})")
        
        # Optional packages
        optional_packages = {'xgboost': 'gradient boosting', 'imblearn': 'SMOTE'}
        for pkg, desc in optional_packages.items():
            try:
                __import__(pkg)
                logger.info(f"✓ {pkg} (optional): {desc}")
            except ImportError:
                logger.warning(f"⚠ {pkg} not installed (optional): {desc}")
        
        # Check data directory
        data_dir = Path(self.config['data_dir'])
        if not data_dir.exists():
            raise RuntimeError(f"Data directory not found: {data_dir}")
        logger.info(f"✓ Data directory: {data_dir}")
        
        # List available CSV files
        csv_files = list(data_dir.glob('*.csv'))
        if not csv_files:
            raise RuntimeError(f"No CSV files found in {data_dir}")
        logger.info(f"✓ Found {len(csv_files)} CSV files")
        
        # Create output directory
        output_dir = Path(self.config['output_dir'])
        output_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"✓ Output directory: {output_dir}")
    
    def run_experiment(self):
        """Run the complete experiment pipeline."""
        try:
            logger.info("Starting experiment pipeline...")
            
            # Import here to catch import errors during validation
            from scripts.real_experiment import main as run_main
            
            # Run main experiment
            logger.info("Executing real_experiment.py...")
            run_main()
            
            logger.info("✓ Experiment completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"✗ Experiment failed: {e}")
            logger.error(traceback.format_exc())
            return False
    
    def run_post_processing(self):
        """Run post-processing and statistical analysis."""
        try:
            logger.info("Starting post-processing...")
            
            from scripts.extract_cross_validation_csv import main as extract_main
            
            logger.info("Extracting cross-validation results...")
            extract_main()
            
            logger.info("✓ Post-processing completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"✗ Post-processing failed: {e}")
            logger.error(traceback.format_exc())
            return False
    
    def generate_report(self):
        """Generate experiment report."""
        elapsed = (datetime.now() - self.start_time).total_seconds()
        minutes = elapsed / 60
        
        output_file = Path(self.config['output_dir']) / 'experiment_results.json'
        
        report = f"""
================================================================================
EXPERIMENT EXECUTION REPORT
================================================================================

Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Duration: {minutes:.1f} minutes ({elapsed:.1f} seconds)

Status: {'✓ SUCCESS' if os.path.exists(output_file) else '✗ FAILED'}

Output Files:
  - Experiment results: {output_file}
  - CV folds (accuracy): {Path(self.config['output_dir']) / 'cross_validation_folds_accuracy.csv'}
  - CV folds (f1Macro): {Path(self.config['output_dir']) / 'cross_validation_folds_f1Macro.csv'}
  - Statistical tests: {Path(self.config['output_dir']) / 'statistical_tests_f1Macro.csv'}
  - Log file: {LOG_FILE}

Next Steps:
  1. Check output files in: {self.config['output_dir']}
  2. Review statistical tests in: statistical_tests_f1Macro.csv
  3. Build Tablo 25 with verified data

Contact: Check logs for errors
================================================================================
"""
        
        logger.info(report)
        
        # Save report
        report_file = LOG_DIR / f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        return report
    
    def execute(self):
        """Execute full pipeline."""
        logger.info(f"Beginning experiment execution at {self.start_time}")
        
        try:
            # Step 1: Run main experiment
            if not self.run_experiment():
                logger.error("Main experiment failed")
                return False
            
            # Step 2: Post-processing
            if not self.run_post_processing():
                logger.warning("Post-processing had issues but continuing...")
            
            # Step 3: Generate report
            self.generate_report()
            
            logger.info("=" * 80)
            logger.info("✓ FULL PIPELINE COMPLETED SUCCESSFULLY")
            logger.info("=" * 80)
            return True
            
        except Exception as e:
            logger.error(f"Pipeline execution failed: {e}")
            logger.error(traceback.format_exc())
            return False


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Professional DDoS Detection Experiment Runner',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_experiment.py                    # Run with defaults
  python run_experiment.py --config config.json  # Run with custom config
  python run_experiment.py --verbose         # Run with verbose output
        """
    )
    
    parser.add_argument('--config', type=str, default=None,
                       help='Path to configuration JSON file')
    parser.add_argument('--verbose', action='store_true',
                       help='Enable verbose output')
    parser.add_argument('--data-dir', type=str, default=None,
                       help='Override data directory path')
    parser.add_argument('--output-dir', type=str, default=None,
                       help='Override output directory path')
    
    args = parser.parse_args()
    
    # Create runner
    runner = ExperimentRunner(config_file=args.config)
    
    # Override config from command line if provided
    if args.data_dir:
        runner.config['data_dir'] = args.data_dir
    if args.output_dir:
        runner.config['output_dir'] = args.output_dir
    
    # Execute pipeline
    success = runner.execute()
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
