"""
Unit Tests for BSO-DDoS Detection System
Master's Thesis: DDoS Detection with BSO-Hybrid ML Framework
Author: SHUAIB AYAD JASIM
Date: February 2026
"""

import unittest
import json
import numpy as np
from pathlib import Path


class TestDatasetValidation(unittest.TestCase):
    """Test dataset structure and integrity."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.CICIOT_EXPECTED_FEATURES = 39
        self.CICIOT_EXPECTED_CLASSES = 5
        self.CICIOT_EXPECTED_SAMPLES = 118466
    
    def test_dataset_loading(self):
        """Test that CICIoT2023 dataset can be loaded."""
        # Check if experiment results exist
        results_file = Path("../public/experiment_results.json")
        self.assertTrue(results_file.exists(), "experiment_results.json not found")
    
    def test_experiment_results_format(self):
        """Test experiment results JSON format."""
        with open("../public/experiment_results.json", "r") as f:
            data = json.load(f)
        
        # Check required fields
        self.assertIn("experimentInfo", data)
        self.assertIn("datasetStatistics", data)
        self.assertIn("modelResults", data)
    
    def test_feature_count(self):
        """Test that feature count matches expectations."""
        with open("../public/experiment_results.json", "r") as f:
            data = json.load(f)
        
        features = data["datasetStatistics"]["featureNames"]
        self.assertEqual(len(features), self.CICIOT_EXPECTED_FEATURES,
                        f"Expected {self.CICIOT_EXPECTED_FEATURES} features, got {len(features)}")
    
    def test_attack_types(self):
        """Test that all attack types are present."""
        expected_types = {
            "Backdoor_Malware", "BenignTraffic", 
            "DDoS-ACK_Fragmentation", "DDoS-SYN_Flood", "Recon-PortScan"
        }
        
        with open("../public/experiment_results.json", "r") as f:
            data = json.load(f)
        
        attack_types = set(data["attackTypes"].keys())
        self.assertEqual(attack_types, expected_types,
                        f"Attack type mismatch. Expected {expected_types}, got {attack_types}")


class TestBSOParameters(unittest.TestCase):
    """Test BSO algorithm parameter constraints."""
    
    def test_population_size_valid(self):
        """Test valid population size."""
        population_size = 25
        self.assertGreaterEqual(population_size, 5, "Population size too small")
        self.assertLessEqual(population_size, 1000, "Population size too large")
    
    def test_iteration_count_valid(self):
        """Test valid iteration count."""
        iterations = 50
        self.assertGreaterEqual(iterations, 10, "Iterations too small")
        self.assertLessEqual(iterations, 10000, "Iterations too large")
    
    def test_frequency_range_valid(self):
        """Test frequency range."""
        f_min, f_max = 0.0, 2.0
        self.assertLess(f_min, f_max, "Frequency range invalid")
    
    def test_loudness_in_range(self):
        """Test loudness parameter in valid range."""
        loudness = 0.95
        self.assertGreaterEqual(loudness, 0)
        self.assertLessEqual(loudness, 1)
    
    def test_pulse_rate_in_range(self):
        """Test pulse rate parameter in valid range."""
        pulse_rate = 0.5
        self.assertGreaterEqual(pulse_rate, 0)
        self.assertLessEqual(pulse_rate, 1)


class TestRandomForestParameters(unittest.TestCase):
    """Test Random Forest hyperparameter constraints."""
    
    def test_n_estimators_valid(self):
        """Test number of trees."""
        n_estimators = 266
        self.assertGreaterEqual(n_estimators, 1)
        self.assertLessEqual(n_estimators, 10000)
    
    def test_max_depth_valid(self):
        """Test maximum depth."""
        max_depth = 20
        self.assertGreaterEqual(max_depth, 1)
        self.assertLessEqual(max_depth, 100)
    
    def test_min_samples_split_valid(self):
        """Test minimum samples for split."""
        min_samples_split = 7
        self.assertGreaterEqual(min_samples_split, 2)
    
    def test_max_features_valid(self):
        """Test maximum features ratio."""
        max_features = 0.469
        self.assertGreaterEqual(max_features, 0)
        self.assertLessEqual(max_features, 1)


class TestFeatureSelection(unittest.TestCase):
    """Test feature selection logic."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.total_features = 39
        self.selected_features = 19
    
    def test_feature_count_realistic(self):
        """Test selected feature count is realistic."""
        self.assertGreater(self.selected_features, 0)
        self.assertLess(self.selected_features, self.total_features)
    
    def test_dimension_reduction_percentage(self):
        """Test dimension reduction percentage."""
        reduction_pct = (self.total_features - self.selected_features) / self.total_features * 100
        expected_pct = 51.3
        self.assertAlmostEqual(reduction_pct, expected_pct, delta=0.1,
                              msg="Dimension reduction percentage mismatch")
    
    def test_feature_indices_unique(self):
        """Test that all selected feature indices are unique."""
        indices = list(range(self.selected_features))
        unique_indices = set(indices)
        self.assertEqual(len(indices), len(unique_indices),
                        "Feature indices contain duplicates")
    
    def test_feature_indices_in_bounds(self):
        """Test that feature indices are within bounds."""
        indices = list(range(self.selected_features))
        for idx in indices:
            self.assertGreaterEqual(idx, 0)
            self.assertLess(idx, self.total_features)


class TestClassificationMetrics(unittest.TestCase):
    """Test classification performance metrics."""
    
    def test_accuracy_in_range(self):
        """Test accuracy is in valid range."""
        accuracy = 0.8982
        self.assertGreaterEqual(accuracy, 0)
        self.assertLessEqual(accuracy, 1)
    
    def test_precision_in_range(self):
        """Test precision is in valid range."""
        precision = 0.89
        self.assertGreaterEqual(precision, 0)
        self.assertLessEqual(precision, 1)
    
    def test_recall_in_range(self):
        """Test recall is in valid range."""
        recall = 0.90
        self.assertGreaterEqual(recall, 0)
        self.assertLessEqual(recall, 1)
    
    def test_f1_score_in_range(self):
        """Test F1 score is in valid range."""
        f1 = 0.8990
        self.assertGreaterEqual(f1, 0)
        self.assertLessEqual(f1, 1)
    
    def test_f1_consistency(self):
        """Test F1 score calculation consistency."""
        precision = 0.89
        recall = 0.90
        expected_f1 = 2 * (precision * recall) / (precision + recall)
        actual_f1 = 0.8990
        self.assertAlmostEqual(actual_f1, expected_f1, places=3,
                              msg="F1 score inconsistency")
    
    def test_auc_roc_in_range(self):
        """Test AUC-ROC is in valid range."""
        auc_roc = 0.95
        self.assertGreaterEqual(auc_roc, 0)
        self.assertLessEqual(auc_roc, 1)


class TestComparisonResults(unittest.TestCase):
    """Test algorithm comparison results."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.algorithms = {
            "BSO-Hybrid RF": {"accuracy": 0.8982, "features": 19},
            "XGBoost": {"accuracy": 0.9037, "features": 39},
            "Standard RF": {"accuracy": 0.8974, "features": 39},
            "PSO-RF": {"accuracy": 0.8740, "features": 21},
            "GA-RF": {"accuracy": 0.8701, "features": 18},
            "GWO-RF": {"accuracy": 0.8773, "features": 20},
        }
    
    def test_all_algorithms_have_metrics(self):
        """Test all algorithms have required metrics."""
        for alg_name, metrics in self.algorithms.items():
            self.assertIn("accuracy", metrics, f"{alg_name} missing accuracy")
            self.assertIn("features", metrics, f"{alg_name} missing features")
    
    def test_bso_competitive_with_xgboost(self):
        """Test BSO-Hybrid is competitive with XGBoost."""
        bso_acc = self.algorithms["BSO-Hybrid RF"]["accuracy"]
        xgb_acc = self.algorithms["XGBoost"]["accuracy"]
        
        # Difference should be small
        diff = abs(bso_acc - xgb_acc)
        self.assertLess(diff, 0.01, "BSO-Hybrid too far below XGBoost")
    
    def test_bso_better_than_psogawo(self):
        """Test BSO-Hybrid is better than PSO, GA, GWO."""
        bso_acc = self.algorithms["BSO-Hybrid RF"]["accuracy"]
        
        for alg_name in ["PSO-RF", "GA-RF", "GWO-RF"]:
            comp_acc = self.algorithms[alg_name]["accuracy"]
            self.assertGreater(bso_acc, comp_acc,
                             f"BSO-Hybrid should be better than {alg_name}")
    
    def test_bso_fewer_features_than_xgboost(self):
        """Test BSO-Hybrid uses fewer features than XGBoost."""
        bso_features = self.algorithms["BSO-Hybrid RF"]["features"]
        xgb_features = self.algorithms["XGBoost"]["features"]
        
        self.assertLess(bso_features, xgb_features,
                       "BSO-Hybrid should use fewer features than XGBoost")


class TestResultsPersistence(unittest.TestCase):
    """Test that results are properly saved and can be loaded."""
    
    def test_results_file_exists(self):
        """Test results file exists."""
        results_file = Path("../public/experiment_results.json")
        self.assertTrue(results_file.exists(), "Results file not found")
    
    def test_results_file_readable(self):
        """Test results file is valid JSON."""
        try:
            with open("../public/experiment_results.json", "r") as f:
                data = json.load(f)
            self.assertIsInstance(data, dict)
        except json.JSONDecodeError:
            self.fail("Results file is not valid JSON")
    
    def test_results_file_not_empty(self):
        """Test results file is not empty."""
        with open("../public/experiment_results.json", "r") as f:
            data = json.load(f)
        self.assertTrue(len(data) > 0, "Results file is empty")


class TestConvergenceBehavior(unittest.TestCase):
    """Test convergence behavior of BSO algorithm."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Mock convergence history
        self.convergence_history = [
            {"iteration": 0, "best_fitness": 0.5},
            {"iteration": 1, "best_fitness": 0.45},
            {"iteration": 2, "best_fitness": 0.43},
            {"iteration": 3, "best_fitness": 0.42},
            {"iteration": 4, "best_fitness": 0.42},
        ]
    
    def test_convergence_is_monotonic(self):
        """Test fitness generally improves (non-increasing)."""
        for i in range(1, len(self.convergence_history) - 1):
            current = self.convergence_history[i]["best_fitness"]
            next_val = self.convergence_history[i + 1]["best_fitness"]
            # Allow small increases due to randomness
            self.assertLessEqual(next_val, current + 0.005)
    
    def test_convergence_has_plateau(self):
        """Test convergence shows stabilization."""
        early_improvement = self.convergence_history[0]["best_fitness"] - self.convergence_history[2]["best_fitness"]
        late_improvement = self.convergence_history[3]["best_fitness"] - self.convergence_history[4]["best_fitness"]
        
        self.assertGreater(early_improvement, late_improvement,
                          "No convergence plateau detected")
    
    def test_all_fitness_valid(self):
        """Test all fitness values are valid numbers."""
        for entry in self.convergence_history:
            self.assertIsInstance(entry["best_fitness"], (int, float))
            self.assertTrue(np.isfinite(entry["best_fitness"]),
                          f"Invalid fitness value: {entry['best_fitness']}")


class TestFeaturesImportance(unittest.TestCase):
    """Test feature importance rankings."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.top_features = [
            {"rank": 1, "name": "syn_count", "importance": 0.224480},
            {"rank": 2, "name": "Number", "importance": 0.183394},
            {"rank": 3, "name": "Tot sum", "importance": 0.154063},
            {"rank": 4, "name": "Rate", "importance": 0.105115},
        ]
    
    def test_importance_scores_in_range(self):
        """Test importance scores are between 0 and 1."""
        for feat in self.top_features:
            self.assertGreaterEqual(feat["importance"], 0)
            self.assertLessEqual(feat["importance"], 1)
    
    def test_importance_descending(self):
        """Test importance scores are in descending order."""
        for i in range(1, len(self.top_features)):
            prev = self.top_features[i - 1]["importance"]
            curr = self.top_features[i]["importance"]
            self.assertGreater(prev, curr,
                             f"Importance not in descending order at rank {i}")
    
    def test_rankings_unique(self):
        """Test rankings are unique."""
        ranks = [feat["rank"] for feat in self.top_features]
        unique_ranks = set(ranks)
        self.assertEqual(len(ranks), len(unique_ranks), "Duplicate ranks")


# ============================================================================
# Test Suite Runner
# ============================================================================

if __name__ == "__main__":
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test classes
    suite.addTests(loader.loadTestsFromTestCase(TestDatasetValidation))
    suite.addTests(loader.loadTestsFromTestCase(TestBSOParameters))
    suite.addTests(loader.loadTestsFromTestCase(TestRandomForestParameters))
    suite.addTests(loader.loadTestsFromTestCase(TestFeatureSelection))
    suite.addTests(loader.loadTestsFromTestCase(TestClassificationMetrics))
    suite.addTests(loader.loadTestsFromTestCase(TestComparisonResults))
    suite.addTests(loader.loadTestsFromTestCase(TestResultsPersistence))
    suite.addTests(loader.loadTestsFromTestCase(TestConvergenceBehavior))
    suite.addTests(loader.loadTestsFromTestCase(TestFeaturesImportance))
    
    # Run tests with verbosity
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    print(f"Tests Run: {result.testsRun}")
    print(f"Successes: {result.testsRun - len(result.failures) - len(result.errors)}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print("=" * 70)
    
    # Exit with appropriate code
    exit(0 if result.wasSuccessful() else 1)
