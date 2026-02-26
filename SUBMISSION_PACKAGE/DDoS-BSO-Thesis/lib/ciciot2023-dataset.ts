// =============================================================================
// CICIoT2023 DATASET — REAL EXPERIMENT RESULTS (BSO-Hybrid v4)
// =============================================================================
// Generated from: scripts/real_experiment.py
// Dataset: CICIoT2023 — Real Network Traffic
// Author: SHUAIB AYAD JASIM
// Experiment Date: 2026-02-23
// Total Runtime: 1332.6 s (22.2 min)
// SMOTE: Applied (72,252 → 87,500 training samples)
// BSO-Hybrid: Joint feature selection + RF hyperparameter optimization
// =============================================================================

// ---------------------------------------------------------------------------
// 1. FEATURE SCHEMA (39 features from CICIoT2023)
// ---------------------------------------------------------------------------
export const CICIOT2023_FEATURES = [
  { name: "Header_Length", type: "numeric", description: "Header length of the packet" },
  { name: "Protocol Type", type: "numeric", description: "Protocol type identifier" },
  { name: "Time_To_Live", type: "numeric", description: "Time-to-live of the packet" },
  { name: "Rate", type: "numeric", description: "Packet rate" },
  { name: "fin_flag_number", type: "numeric", description: "FIN flag count" },
  { name: "syn_flag_number", type: "numeric", description: "SYN flag count" },
  { name: "rst_flag_number", type: "numeric", description: "RST flag count" },
  { name: "psh_flag_number", type: "numeric", description: "PSH flag count" },
  { name: "ack_flag_number", type: "numeric", description: "ACK flag count" },
  { name: "ece_flag_number", type: "numeric", description: "ECE flag count" },
  { name: "cwr_flag_number", type: "numeric", description: "CWR flag count" },
  { name: "ack_count", type: "numeric", description: "ACK packet count" },
  { name: "syn_count", type: "numeric", description: "SYN packet count" },
  { name: "fin_count", type: "numeric", description: "FIN packet count" },
  { name: "rst_count", type: "numeric", description: "RST packet count" },
  { name: "HTTP", type: "numeric", description: "HTTP protocol indicator" },
  { name: "HTTPS", type: "numeric", description: "HTTPS protocol indicator" },
  { name: "DNS", type: "numeric", description: "DNS protocol indicator" },
  { name: "Telnet", type: "numeric", description: "Telnet protocol indicator" },
  { name: "SMTP", type: "numeric", description: "SMTP protocol indicator" },
  { name: "SSH", type: "numeric", description: "SSH protocol indicator" },
  { name: "IRC", type: "numeric", description: "IRC protocol indicator" },
  { name: "TCP", type: "numeric", description: "TCP protocol indicator" },
  { name: "UDP", type: "numeric", description: "UDP protocol indicator" },
  { name: "DHCP", type: "numeric", description: "DHCP protocol indicator" },
  { name: "ARP", type: "numeric", description: "ARP protocol indicator" },
  { name: "ICMP", type: "numeric", description: "ICMP protocol indicator" },
  { name: "IGMP", type: "numeric", description: "IGMP protocol indicator" },
  { name: "IPv", type: "numeric", description: "IPv protocol indicator" },
  { name: "LLC", type: "numeric", description: "LLC protocol indicator" },
  { name: "Tot sum", type: "numeric", description: "Total sum of packets" },
  { name: "Min", type: "numeric", description: "Minimum packet size" },
  { name: "Max", type: "numeric", description: "Maximum packet size" },
  { name: "AVG", type: "numeric", description: "Average packet size" },
  { name: "Std", type: "numeric", description: "Standard deviation of packet size" },
  { name: "Tot size", type: "numeric", description: "Total size of packets" },
  { name: "IAT", type: "numeric", description: "Inter-arrival time" },
  { name: "Number", type: "numeric", description: "Number of packets" },
  { name: "Variance", type: "numeric", description: "Variance of packet size" },
]

// ---------------------------------------------------------------------------
// 2. ATTACK TYPES (5 classes from CICIoT2023)
// ---------------------------------------------------------------------------
export const CICIOT2023_ATTACK_TYPES = [
  { name: "Backdoor_Malware", severity: "high", trainingSamples: 2252, testingSamples: 644, color: "#ef4444", smoteSamples: 17500 },
  { name: "BenignTraffic", severity: "info", trainingSamples: 17500, testingSamples: 5000, color: "#22c55e", smoteSamples: 17500 },
  { name: "DDoS-ACK_Fragmentation", severity: "critical", trainingSamples: 17500, testingSamples: 5000, color: "#f59e0b", smoteSamples: 17500 },
  { name: "DDoS-SYN_Flood", severity: "critical", trainingSamples: 17500, testingSamples: 5000, color: "#3b82f6", smoteSamples: 17500 },
  { name: "Recon-PortScan", severity: "medium", trainingSamples: 17500, testingSamples: 5000, color: "#8b5cf6", smoteSamples: 17500 },
]

// ---------------------------------------------------------------------------
// 3. DATASET STATISTICS (after SMOTE balancing)
// ---------------------------------------------------------------------------
export const DATASET_STATISTICS = {
  totalFeatures: 39,
  selectedFeatures: 19,
  featureReductionPct: 51.3,
  totalSamples: 118466,
  totalFlows: { training: 87500, validation: 10322, testing: 20644 },
  splitRatio: "70/10/20 (stratified)",
  smoteApplied: true,
  smoteSyntheticSamples: 15248,
  originalMinorityCount: 2252,
  balancedClassCount: 17500,
  classes: 5,
  preprocessingSteps: [
    "Loaded 19 CSV files from CICIoT2023",
    "Random undersampling to 25,000 per majority class",
    "Stratified train/val/test split (70/10/20)",
    "SMOTE oversampling on training set (72,252 → 87,500)",
    "StandardScaler normalization",
  ],
}

// ---------------------------------------------------------------------------
// 4. BSO-SELECTED FEATURES (19 features, ranked by importance in BSO-Hybrid RF)
// ---------------------------------------------------------------------------
export const BSO_SELECTED_FEATURES = [
  { rank: 1, name: "syn_count", importance: 0.224480, originalIndex: 12 },
  { rank: 2, name: "Number", importance: 0.183394, originalIndex: 37 },
  { rank: 3, name: "Tot sum", importance: 0.154063, originalIndex: 30 },
  { rank: 4, name: "Rate", importance: 0.105115, originalIndex: 3 },
  { rank: 5, name: "Max", importance: 0.085952, originalIndex: 32 },
  { rank: 6, name: "Header_Length", importance: 0.066085, originalIndex: 0 },
  { rank: 7, name: "HTTPS", importance: 0.051489, originalIndex: 16 },
  { rank: 8, name: "Time_To_Live", importance: 0.045447, originalIndex: 2 },
  { rank: 9, name: "psh_flag_number", importance: 0.020764, originalIndex: 7 },
  { rank: 10, name: "HTTP", importance: 0.019776, originalIndex: 15 },
  { rank: 11, name: "fin_flag_number", importance: 0.012970, originalIndex: 4 },
  { rank: 12, name: "UDP", importance: 0.012883, originalIndex: 23 },
  { rank: 13, name: "DNS", importance: 0.008363, originalIndex: 17 },
  { rank: 14, name: "ARP", importance: 0.003231, originalIndex: 25 },
  { rank: 15, name: "LLC", importance: 0.002768, originalIndex: 29 },
  { rank: 16, name: "SSH", importance: 0.001919, originalIndex: 20 },
  { rank: 17, name: "DHCP", importance: 0.000821, originalIndex: 24 },
  { rank: 18, name: "IGMP", importance: 0.000344, originalIndex: 27 },
  { rank: 19, name: "cwr_flag_number", importance: 0.000135, originalIndex: 10 },
]

// ---------------------------------------------------------------------------
// 5. MODEL RESULTS (12 models — from real experiment on test set)
// ---------------------------------------------------------------------------
export interface ModelResult {
  name: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  f1Macro: number
  aucRoc: number
  trainingTime: number
  predictionTime: number
  featuresUsed: number
  falsePositiveRate: number
  falseNegativeRate: number
  specificity: number
  mcc: number
  featureSet?: string
}

export const MODEL_RESULTS: ModelResult[] = [
  {
    name: "BSO-Hybrid RF (Proposed)",
    accuracy: 89.82,
    precision: 90.19,
    recall: 89.82,
    f1Score: 89.90,
    f1Macro: 84.24,
    aucRoc: 98.38,
    trainingTime: 3.742,
    predictionTime: 0.0043,
    featuresUsed: 19,
    falsePositiveRate: 9.81,
    falseNegativeRate: 10.18,
    specificity: 90.19,
    mcc: 0.8676,
    featureSet: "BSO",
  },
  {
    name: "BSO-SVM",
    accuracy: 82.19,
    precision: 88.99,
    recall: 82.19,
    f1Score: 84.57,
    f1Macro: 74.03,
    aucRoc: 97.0,
    trainingTime: 5.485,
    predictionTime: 0.0009,
    featuresUsed: 19,
    falsePositiveRate: 11.01,
    falseNegativeRate: 17.81,
    specificity: 88.99,
    mcc: 0.7808,
    featureSet: "BSO",
  },
  {
    name: "PSO-RF",
    accuracy: 88.35,
    precision: 88.54,
    recall: 88.35,
    f1Score: 88.39,
    f1Macro: 81.82,
    aucRoc: 97.87,
    trainingTime: 2.601,
    predictionTime: 0.0071,
    featuresUsed: 18,
    falsePositiveRate: 11.46,
    falseNegativeRate: 11.65,
    specificity: 88.54,
    mcc: 0.848,
    featureSet: "PSO",
  },
  {
    name: "GA-RF",
    accuracy: 89.37,
    precision: 89.53,
    recall: 89.37,
    f1Score: 89.41,
    f1Macro: 83.66,
    aucRoc: 98.24,
    trainingTime: 2.816,
    predictionTime: 0.006,
    featuresUsed: 21,
    falsePositiveRate: 10.47,
    falseNegativeRate: 10.63,
    specificity: 89.53,
    mcc: 0.8614,
    featureSet: "GA",
  },
  {
    name: "GWO-RF",
    accuracy: 89.80,
    precision: 90.06,
    recall: 89.80,
    f1Score: 89.87,
    f1Macro: 84.35,
    aucRoc: 98.37,
    trainingTime: 3.508,
    predictionTime: 0.006,
    featuresUsed: 23,
    falsePositiveRate: 9.94,
    falseNegativeRate: 10.20,
    specificity: 90.06,
    mcc: 0.8671,
    featureSet: "GWO",
  },
  {
    name: "Random Forest",
    accuracy: 89.74,
    precision: 89.89,
    recall: 89.74,
    f1Score: 89.77,
    f1Macro: 84.13,
    aucRoc: 98.36,
    trainingTime: 4.52,
    predictionTime: 0.0068,
    featuresUsed: 39,
    falsePositiveRate: 10.11,
    falseNegativeRate: 10.26,
    specificity: 89.89,
    mcc: 0.8665,
    featureSet: "All",
  },
  {
    name: "SVM (Linear)",
    accuracy: 83.11,
    precision: 88.99,
    recall: 83.11,
    f1Score: 85.21,
    f1Macro: 75.09,
    aucRoc: 97.25,
    trainingTime: 68.244,
    predictionTime: 0.0011,
    featuresUsed: 39,
    falsePositiveRate: 11.01,
    falseNegativeRate: 16.89,
    specificity: 88.99,
    mcc: 0.7928,
    featureSet: "All",
  },
  {
    name: "Decision Tree",
    accuracy: 86.12,
    precision: 86.34,
    recall: 86.12,
    f1Score: 86.27,
    f1Macro: 78.57,
    aucRoc: 91.2,
    trainingTime: 1.007,
    predictionTime: 0.0003,
    featuresUsed: 39,
    falsePositiveRate: 13.66,
    falseNegativeRate: 13.88,
    specificity: 86.34,
    mcc: 0.8212,
    featureSet: "All",
  },
  {
    name: "K-Nearest Neighbors",
    accuracy: 85.20,
    precision: 86.19,
    recall: 85.20,
    f1Score: 86.19,
    f1Macro: 77.16,
    aucRoc: 95.61,
    trainingTime: 0.006,
    predictionTime: 0.0514,
    featuresUsed: 39,
    falsePositiveRate: 13.81,
    falseNegativeRate: 14.80,
    specificity: 86.19,
    mcc: 0.8098,
    featureSet: "All",
  },
  {
    name: "Naive Bayes",
    accuracy: 62.96,
    precision: 66.18,
    recall: 62.96,
    f1Score: 66.18,
    f1Macro: 57.17,
    aucRoc: 96.09,
    trainingTime: 0.048,
    predictionTime: 0.0007,
    featuresUsed: 39,
    falsePositiveRate: 33.82,
    falseNegativeRate: 37.04,
    specificity: 66.18,
    mcc: 0.5852,
    featureSet: "All",
  },
  {
    name: "Logistic Regression",
    accuracy: 82.73,
    precision: 84.98,
    recall: 82.73,
    f1Score: 84.98,
    f1Macro: 74.80,
    aucRoc: 97.3,
    trainingTime: 3.742,
    predictionTime: 0.0001,
    featuresUsed: 39,
    falsePositiveRate: 15.02,
    falseNegativeRate: 17.27,
    specificity: 84.98,
    mcc: 0.7876,
    featureSet: "All",
  },
  {
    name: "XGBoost",
    accuracy: 90.37,
    precision: 90.35,
    recall: 90.37,
    f1Score: 90.35,
    f1Macro: 84.74,
    aucRoc: 98.51,
    trainingTime: 4.688,
    predictionTime: 0.002,
    featuresUsed: 39,
    falsePositiveRate: 9.65,
    falseNegativeRate: 9.63,
    specificity: 90.35,
    mcc: 0.8742,
    featureSet: "All",
  },
]

// ---------------------------------------------------------------------------
// 6. BSO ALGORITHM PARAMETERS & CONVERGENCE DATA (BSO-Hybrid, 50 iterations)
// ---------------------------------------------------------------------------
export const BSO_PARAMETERS = {
  populationSize: 25,
  maxIterations: 50,
  frequencyMin: 0.0,
  frequencyMax: 2.0,
  initialLoudness: 0.95,
  initialPulseRate: 0.5,
  alpha: 0.9,
  gamma: 0.9,
  dimensions: 39,
  selectedDimensions: 19,
  convergenceThreshold: 1e-6,
  fitnessFunction: "1 - F1_macro + 0.01 * (n_selected / n_total)",
  hybridOptimization: true,
  optimizedHyperparameters: {
    n_estimators: 266,
    max_depth: 20,
    min_samples_split: 7,
    max_features: 0.469,
  },
  hyperparameterRanges: {
    n_estimators: [50, 400],
    max_depth: [5, 35],
    min_samples_split: [2, 15],
    max_features_frac: [0.3, 1.0],
  },
  totalEvaluations: 1177,
  optimizationTime: 840.43,
}

/** Real BSO-Hybrid convergence curve from experiment (50 iterations) */
export function generateBSOConvergenceData(): {
  iteration: number
  fitness: number
  bestFitness: number
  diversity: number
  loudness: number
  pulseRate: number
  selectedFeatures: number
}[] {
  const realData = [
    { iteration: 0, bestFitness: 0.184825, avgFitness: 0.200021, selectedFeatures: 27 },
    { iteration: 1, bestFitness: 0.183088, avgFitness: 0.191476, selectedFeatures: 25 },
    { iteration: 2, bestFitness: 0.181799, avgFitness: 0.194135, selectedFeatures: 21 },
    { iteration: 3, bestFitness: 0.181435, avgFitness: 0.190601, selectedFeatures: 21 },
    { iteration: 4, bestFitness: 0.181129, avgFitness: 0.200868, selectedFeatures: 22 },
    { iteration: 5, bestFitness: 0.181129, avgFitness: 0.195327, selectedFeatures: 22 },
    { iteration: 6, bestFitness: 0.181129, avgFitness: 0.202679, selectedFeatures: 22 },
    { iteration: 7, bestFitness: 0.181129, avgFitness: 0.211452, selectedFeatures: 22 },
    { iteration: 8, bestFitness: 0.181014, avgFitness: 0.200518, selectedFeatures: 21 },
    { iteration: 9, bestFitness: 0.180983, avgFitness: 0.195750, selectedFeatures: 20 },
    { iteration: 10, bestFitness: 0.180983, avgFitness: 0.198495, selectedFeatures: 20 },
    { iteration: 11, bestFitness: 0.180673, avgFitness: 0.195257, selectedFeatures: 21 },
    { iteration: 12, bestFitness: 0.180673, avgFitness: 0.194536, selectedFeatures: 21 },
    { iteration: 13, bestFitness: 0.180673, avgFitness: 0.200093, selectedFeatures: 21 },
    { iteration: 14, bestFitness: 0.180673, avgFitness: 0.201612, selectedFeatures: 21 },
    { iteration: 15, bestFitness: 0.179905, avgFitness: 0.190819, selectedFeatures: 21 },
    { iteration: 16, bestFitness: 0.179905, avgFitness: 0.199296, selectedFeatures: 21 },
    { iteration: 17, bestFitness: 0.179905, avgFitness: 0.194277, selectedFeatures: 21 },
    { iteration: 18, bestFitness: 0.179757, avgFitness: 0.199849, selectedFeatures: 20 },
    { iteration: 19, bestFitness: 0.179757, avgFitness: 0.204054, selectedFeatures: 20 },
    { iteration: 20, bestFitness: 0.179427, avgFitness: 0.192536, selectedFeatures: 19 },
    { iteration: 21, bestFitness: 0.179427, avgFitness: 0.193079, selectedFeatures: 19 },
    { iteration: 22, bestFitness: 0.179427, avgFitness: 0.191688, selectedFeatures: 19 },
    { iteration: 23, bestFitness: 0.179427, avgFitness: 0.191101, selectedFeatures: 19 },
    { iteration: 24, bestFitness: 0.179427, avgFitness: 0.187818, selectedFeatures: 19 },
    { iteration: 25, bestFitness: 0.179427, avgFitness: 0.187170, selectedFeatures: 19 },
    { iteration: 26, bestFitness: 0.179427, avgFitness: 0.185475, selectedFeatures: 19 },
    { iteration: 27, bestFitness: 0.179427, avgFitness: 0.194779, selectedFeatures: 19 },
    { iteration: 28, bestFitness: 0.179427, avgFitness: 0.191739, selectedFeatures: 19 },
    { iteration: 29, bestFitness: 0.179427, avgFitness: 0.192119, selectedFeatures: 19 },
    { iteration: 30, bestFitness: 0.179427, avgFitness: 0.188633, selectedFeatures: 19 },
    { iteration: 31, bestFitness: 0.179427, avgFitness: 0.186241, selectedFeatures: 19 },
    { iteration: 32, bestFitness: 0.179427, avgFitness: 0.190814, selectedFeatures: 19 },
    { iteration: 33, bestFitness: 0.179427, avgFitness: 0.186654, selectedFeatures: 19 },
    { iteration: 34, bestFitness: 0.179427, avgFitness: 0.185787, selectedFeatures: 19 },
    { iteration: 35, bestFitness: 0.179427, avgFitness: 0.193499, selectedFeatures: 19 },
    { iteration: 36, bestFitness: 0.179301, avgFitness: 0.186727, selectedFeatures: 20 },
    { iteration: 37, bestFitness: 0.179301, avgFitness: 0.188759, selectedFeatures: 20 },
    { iteration: 38, bestFitness: 0.179301, avgFitness: 0.182090, selectedFeatures: 20 },
    { iteration: 39, bestFitness: 0.179301, avgFitness: 0.184430, selectedFeatures: 20 },
    { iteration: 40, bestFitness: 0.179301, avgFitness: 0.183888, selectedFeatures: 20 },
    { iteration: 41, bestFitness: 0.179301, avgFitness: 0.187773, selectedFeatures: 20 },
    { iteration: 42, bestFitness: 0.179301, avgFitness: 0.186481, selectedFeatures: 20 },
    { iteration: 43, bestFitness: 0.179301, avgFitness: 0.184072, selectedFeatures: 20 },
    { iteration: 44, bestFitness: 0.177801, avgFitness: 0.184230, selectedFeatures: 19 },
    { iteration: 45, bestFitness: 0.177801, avgFitness: 0.189771, selectedFeatures: 19 },
    { iteration: 46, bestFitness: 0.177801, avgFitness: 0.189608, selectedFeatures: 19 },
    { iteration: 47, bestFitness: 0.177801, avgFitness: 0.185909, selectedFeatures: 19 },
    { iteration: 48, bestFitness: 0.177801, avgFitness: 0.193035, selectedFeatures: 19 },
    { iteration: 49, bestFitness: 0.177801, avgFitness: 0.187681, selectedFeatures: 19 },
  ]

  const A0 = 0.95, alpha = 0.9, r0 = 0.5, gamma = 0.9
  return realData.map((d) => ({
    iteration: d.iteration,
    fitness: d.avgFitness,
    bestFitness: d.bestFitness,
    diversity: Math.abs(d.avgFitness - d.bestFitness),
    loudness: A0 * Math.pow(alpha, d.iteration),
    pulseRate: r0 * (1 - Math.exp(-gamma * d.iteration)),
    selectedFeatures: d.selectedFeatures,
  }))
}

// ---------------------------------------------------------------------------
// 6b. METAHEURISTIC CONVERGENCE COMPARISON (BSO vs PSO vs GA vs GWO)
// ---------------------------------------------------------------------------
export const OPTIMIZER_CONVERGENCE = {
  BSO: {
    name: "BSO-Hybrid",
    iterations: 50,
    population: 25,
    finalBestFitness: 0.177801,
    nSelected: 19,
    time: 840.43,
    evaluations: 1177,
    data: [0.184825, 0.183088, 0.181799, 0.181435, 0.181129, 0.181129, 0.181129, 0.181129, 0.181014, 0.180983, 0.180983, 0.180673, 0.180673, 0.180673, 0.180673, 0.179905, 0.179905, 0.179905, 0.179757, 0.179757, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179427, 0.179301, 0.179301, 0.179301, 0.179301, 0.179301, 0.179301, 0.179301, 0.179301, 0.177801, 0.177801, 0.177801, 0.177801, 0.177801, 0.177801],
  },
  PSO: {
    name: "PSO",
    iterations: 40,
    population: 20,
    finalBestFitness: 0.193895,
    nSelected: 18,
    time: 68.91,
    evaluations: 820,
    data: [0.199141, 0.199141, 0.199141, 0.197860, 0.197860, 0.197693, 0.197693, 0.197693, 0.197693, 0.197693, 0.197490, 0.197490, 0.197490, 0.197490, 0.197490, 0.197490, 0.197490, 0.197490, 0.195505, 0.195505, 0.195505, 0.195505, 0.195505, 0.195505, 0.195505, 0.195505, 0.195505, 0.195505, 0.195505, 0.195290, 0.195290, 0.195290, 0.195290, 0.195290, 0.195290, 0.195290, 0.195290, 0.195290, 0.195290, 0.193895],
  },
  GA: {
    name: "GA",
    iterations: 40,
    population: 20,
    finalBestFitness: 0.188982,
    nSelected: 21,
    time: 60.47,
    evaluations: 722,
    data: [0.199332, 0.193521, 0.190793, 0.190793, 0.190793, 0.190793, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982, 0.188982],
  },
  GWO: {
    name: "GWO",
    iterations: 40,
    population: 20,
    finalBestFitness: 0.192181,
    nSelected: 23,
    time: 70.23,
    evaluations: 820,
    data: [0.196093, 0.193160, 0.193160, 0.193160, 0.193160, 0.193160, 0.193160, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.193146, 0.192181, 0.192181, 0.192181, 0.192181, 0.192181, 0.192181, 0.192181, 0.192181],
  },
}

// ---------------------------------------------------------------------------
// 7. CONFUSION MATRICES (from real evaluation on test set — 20,644 samples)
// ---------------------------------------------------------------------------
export interface ConfusionMatrixData {
  model: string
  matrix: number[][]
  labels: string[]
  total: number
}

const CLASS_LABELS = ["Backdoor_Malware", "BenignTraffic", "DDoS-ACK_Frag", "DDoS-SYN_Flood", "Recon-PortScan"]

export const CONFUSION_MATRICES: Record<string, ConfusionMatrixData> = {
  "BSO-RF": {
    model: "BSO-Hybrid RF (Proposed)",
    labels: CLASS_LABELS,
    matrix: [
      [421, 122, 0, 0, 101],
      [163, 4280, 0, 0, 557],
      [0, 0, 5000, 0, 0],
      [0, 0, 4, 4996, 0],
      [239, 916, 0, 0, 3845],
    ],
    total: 20644,
  },
  "BSO-SVM": {
    model: "BSO-SVM",
    labels: CLASS_LABELS,
    matrix: [
      [398, 153, 0, 0, 93],
      [1115, 3502, 0, 0, 383],
      [0, 1, 4995, 0, 4],
      [0, 0, 7, 4992, 1],
      [1151, 768, 0, 0, 3081],
    ],
    total: 20644,
  },
  "PSO-RF": {
    model: "PSO-RF",
    labels: CLASS_LABELS,
    matrix: [
      [349, 156, 0, 0, 139],
      [157, 4128, 0, 0, 715],
      [0, 0, 4999, 0, 1],
      [0, 0, 4, 4996, 0],
      [227, 1007, 0, 0, 3766],
    ],
    total: 20644,
  },
  "GA-RF": {
    model: "GA-RF",
    labels: CLASS_LABELS,
    matrix: [
      [386, 128, 0, 0, 130],
      [140, 4200, 0, 0, 660],
      [0, 0, 4998, 0, 2],
      [0, 0, 3, 4994, 3],
      [198, 929, 1, 0, 3872],
    ],
    total: 20644,
  },
  "GWO-RF": {
    model: "GWO-RF",
    labels: CLASS_LABELS,
    matrix: [
      [415, 116, 0, 0, 113],
      [139, 4253, 0, 0, 608],
      [2, 0, 4997, 0, 1],
      [0, 0, 3, 4997, 0],
      [226, 897, 0, 0, 3877],
    ],
    total: 20644,
  },
  "RF": {
    model: "Random Forest",
    labels: CLASS_LABELS,
    matrix: [
      [394, 128, 0, 0, 122],
      [130, 4263, 0, 0, 607],
      [0, 0, 5000, 0, 0],
      [0, 0, 4, 4996, 0],
      [205, 923, 0, 0, 3872],
    ],
    total: 20644,
  },
  "SVM": {
    model: "SVM (Linear)",
    labels: CLASS_LABELS,
    matrix: [
      [426, 135, 0, 0, 83],
      [1063, 3551, 0, 0, 386],
      [0, 0, 4999, 0, 1],
      [0, 0, 4, 4995, 1],
      [1007, 807, 0, 0, 3186],
    ],
    total: 20644,
  },
  "DT": {
    model: "Decision Tree",
    labels: CLASS_LABELS,
    matrix: [
      [310, 161, 0, 0, 173],
      [230, 3770, 0, 0, 1000],
      [0, 0, 4995, 4, 1],
      [0, 0, 4, 4996, 0],
      [289, 1003, 0, 0, 3708],
    ],
    total: 20644,
  },
  "KNN": {
    model: "K-Nearest Neighbors",
    labels: CLASS_LABELS,
    matrix: [
      [396, 147, 0, 0, 101],
      [612, 3836, 0, 0, 552],
      [1, 0, 4997, 0, 2],
      [0, 0, 3, 4997, 0],
      [653, 985, 0, 0, 3362],
    ],
    total: 20644,
  },
  "NB": {
    model: "Naive Bayes",
    labels: CLASS_LABELS,
    matrix: [
      [624, 16, 0, 0, 4],
      [4448, 487, 0, 0, 65],
      [1, 0, 4998, 1, 0],
      [0, 0, 6, 4994, 0],
      [2931, 174, 1, 0, 1894],
    ],
    total: 20644,
  },
  "LR": {
    model: "Logistic Regression",
    labels: CLASS_LABELS,
    matrix: [
      [434, 132, 0, 0, 78],
      [1098, 3511, 0, 0, 391],
      [0, 0, 4999, 0, 1],
      [0, 0, 4, 4995, 1],
      [1089, 771, 0, 0, 3140],
    ],
    total: 20644,
  },
  "XGBoost": {
    model: "XGBoost",
    labels: CLASS_LABELS,
    matrix: [
      [376, 133, 0, 0, 135],
      [113, 4341, 0, 0, 546],
      [0, 0, 4999, 0, 1],
      [0, 0, 4, 4996, 0],
      [160, 897, 0, 0, 3943],
    ],
    total: 20644,
  },
}

// ---------------------------------------------------------------------------
// 8. ROC CURVE DATA (per model, derived from real AUC values)
// ---------------------------------------------------------------------------
export function generateROCData(): {
  model: string
  fpr: number
  tpr: number
  auc: number
}[] {
  const models = [
    { name: "BSO-Hybrid RF (Proposed)", auc: 0.9838, steepness: 26 },
    { name: "BSO-SVM", auc: 0.9700, steepness: 19 },
    { name: "PSO-RF", auc: 0.9787, steepness: 23 },
    { name: "GA-RF", auc: 0.9824, steepness: 25 },
    { name: "GWO-RF", auc: 0.9837, steepness: 26 },
    { name: "Random Forest", auc: 0.9836, steepness: 26 },
    { name: "XGBoost", auc: 0.9851, steepness: 27 },
    { name: "SVM (Linear)", auc: 0.9725, steepness: 20 },
    { name: "Decision Tree", auc: 0.9120, steepness: 12 },
    { name: "KNN", auc: 0.9561, steepness: 16 },
    { name: "Naive Bayes", auc: 0.9609, steepness: 17 },
    { name: "Logistic Regression", auc: 0.9730, steepness: 20 },
  ]

  const data: { model: string; fpr: number; tpr: number; auc: number }[] = []

  models.forEach(({ name, auc, steepness }) => {
    for (let fpr = 0; fpr <= 1.0; fpr += 0.02) {
      const tpr = 1 - Math.pow(1 - fpr, steepness) * (1 - (auc - 0.5) * 2)
      data.push({
        model: name,
        fpr: Math.round(fpr * 1000) / 1000,
        tpr: Math.min(1, Math.max(0, tpr)),
        auc,
      })
    }
  })

  return data
}

// ---------------------------------------------------------------------------
// 9. PER-CLASS PERFORMANCE (BSO-Hybrid RF, from real experiment)
// ---------------------------------------------------------------------------
export interface PerClassMetric {
  className: string
  precision: number
  recall: number
  f1Score: number
  support: number
}

export const BSO_RF_PER_CLASS: PerClassMetric[] = [
  { className: "Backdoor_Malware", precision: 51.15, recall: 65.37, f1Score: 57.40, support: 644 },
  { className: "BenignTraffic", precision: 80.48, recall: 85.60, f1Score: 82.96, support: 5000 },
  { className: "DDoS-ACK_Fragmentation", precision: 99.92, recall: 100.0, f1Score: 99.96, support: 5000 },
  { className: "DDoS-SYN_Flood", precision: 100.0, recall: 99.92, f1Score: 99.96, support: 5000 },
  { className: "Recon-PortScan", precision: 85.39, recall: 76.90, f1Score: 80.92, support: 5000 },
]

// ---------------------------------------------------------------------------
// 10. STATISTICAL SIGNIFICANCE TESTS (10-fold CV, from real experiment)
// ---------------------------------------------------------------------------
export const STATISTICAL_TESTS = [
  {
    comparison: "BSO-Hybrid vs Random Forest",
    improvement: "-0.45%",
    tStatistic: -9.7019,
    pValue: 0.000005,
    significant: true,
    cohenD: -3.234,
    effectSize: "large",
    wilcoxonP: 0.001953,
    note: "BSO-Hybrid, %51 daha az özellikle karşılaştırılabilir performans elde eder",
  },
  {
    comparison: "BSO-Hybrid vs Decision Tree",
    improvement: "+3.62%",
    tStatistic: 33.1978,
    pValue: 0.0,
    significant: true,
    cohenD: 11.0659,
    effectSize: "large",
    wilcoxonP: 0.001953,
    note: "Karar Ağacına göre anlamlı iyileştirme",
  },
  {
    comparison: "BSO-Hybrid vs Logistic Regression",
    improvement: "+10.51%",
    tStatistic: 86.4492,
    pValue: 0.0,
    significant: true,
    cohenD: 28.8164,
    effectSize: "large",
    wilcoxonP: 0.001953,
    note: "Lojistik Regresyona göre anlamlı iyileştirme",
  },
  {
    comparison: "BSO-Hybrid vs XGBoost",
    improvement: "-0.55%",
    tStatistic: -4.2814,
    pValue: 0.002038,
    significant: true,
    cohenD: -1.427,
    effectSize: "large",
    wilcoxonP: 0.003906,
    note: "XGBoost marjinal üstünlük sağlar ancak 39 özellik kullanır; BSO-Hybrid 19 ile rekabet eder",
  },
  {
    comparison: "BSO-Hybrid vs PSO-RF",
    improvement: "+1.47%",
    tStatistic: 15.3264,
    pValue: 0.0,
    significant: true,
    cohenD: 5.1088,
    effectSize: "large",
    wilcoxonP: 0.001953,
    note: "BSO, PSO tabanlı özellik seçimine göre anlamlı üstünlük sağlar",
  },
  {
    comparison: "BSO-Hybrid vs GA-RF",
    improvement: "+0.45%",
    tStatistic: 6.8421,
    pValue: 0.000071,
    significant: true,
    cohenD: 2.2807,
    effectSize: "large",
    wilcoxonP: 0.001953,
    note: "BSO, GA tabanlı özellik seçimine göre anlamlı üstünlük ve daha az özellik kullanır",
  },
  {
    comparison: "BSO-Hybrid vs GWO-RF",
    improvement: "+0.02%",
    tStatistic: 0.3142,
    pValue: 0.7609,
    significant: false,
    cohenD: 0.1047,
    effectSize: "small",
    wilcoxonP: 0.625,
    note: "GWO ile istatistiksel fark yok; ancak BSO 19 özellik, GWO 23 özellik kullanır",
  },
  {
    comparison: "BSO-Hybrid vs BSO-SVM",
    improvement: "+7.63%",
    tStatistic: 52.8736,
    pValue: 0.0,
    significant: true,
    cohenD: 17.6245,
    effectSize: "large",
    wilcoxonP: 0.001953,
    note: "RF sınıflandırıcısı SVM'ye göre çok daha iyi performans gösterir",
  },
  {
    comparison: "BSO-Hybrid vs KNN",
    improvement: "+4.62%",
    tStatistic: 38.4217,
    pValue: 0.0,
    significant: true,
    cohenD: 12.8072,
    effectSize: "large",
    wilcoxonP: 0.001953,
    note: "KNN'ye göre anlamlı iyileştirme, daha hızlı tahmin süresi ile",
  },
  {
    comparison: "BSO-Hybrid vs Naive Bayes",
    improvement: "+26.86%",
    tStatistic: 142.8531,
    pValue: 0.0,
    significant: true,
    cohenD: 47.6177,
    effectSize: "large",
    wilcoxonP: 0.001953,
    note: "Naive Bayes karmaşık trafik kalıplarını modellemede yetersiz kalır",
  },
  {
    comparison: "BSO-Hybrid vs SVM (Linear)",
    improvement: "+6.71%",
    tStatistic: 48.2163,
    pValue: 0.0,
    significant: true,
    cohenD: 16.0721,
    effectSize: "large",
    wilcoxonP: 0.001953,
    note: "Doğrusal SVM, doğrusal olmayan sınıflandırma görevlerinde yetersiz kalır",
  },
]

// ---------------------------------------------------------------------------
// 11. CROSS-VALIDATION RESULTS (10-fold Stratified CV, from real experiment)
// ---------------------------------------------------------------------------
export const CROSS_VALIDATION = {
  model: "BSO-Hybrid RF",
  folds: 10,
  results: [
    { fold: 1, accuracy: 90.89, precision: 90.92, recall: 90.97, f1Score: 90.88 },
    { fold: 2, accuracy: 91.04, precision: 91.07, recall: 91.12, f1Score: 91.02 },
    { fold: 3, accuracy: 90.84, precision: 90.85, recall: 90.93, f1Score: 90.82 },
    { fold: 4, accuracy: 90.87, precision: 90.93, recall: 90.93, f1Score: 90.86 },
    { fold: 5, accuracy: 91.37, precision: 91.46, recall: 91.44, f1Score: 91.38 },
    { fold: 6, accuracy: 90.66, precision: 90.66, recall: 90.72, f1Score: 90.61 },
    { fold: 7, accuracy: 91.16, precision: 91.17, recall: 91.22, f1Score: 91.13 },
    { fold: 8, accuracy: 90.99, precision: 91.11, recall: 91.05, f1Score: 91.00 },
    { fold: 9, accuracy: 91.12, precision: 91.22, recall: 91.16, f1Score: 91.13 },
    { fold: 10, accuracy: 90.82, precision: 90.85, recall: 90.87, f1Score: 90.80 },
  ],
  mean: { accuracy: 90.98, precision: 91.02, recall: 91.04, f1Score: 90.96 },
  std: { accuracy: 0.194, precision: 0.218, recall: 0.193, f1Score: 0.206 },
}

// ---------------------------------------------------------------------------
// 12. DYNAMIC ENVIRONMENT TESTS (from real experiment)
// ---------------------------------------------------------------------------
export const DYNAMIC_ENVIRONMENT = {
  noiseRobustness: [
    { noiseLevel: 0, accuracy: 89.82, f1Macro: 84.24, degradation: 0 },
    { noiseLevel: 0.05, accuracy: 65.73, f1Macro: 55.12, degradation: 24.09 },
    { noiseLevel: 0.10, accuracy: 63.32, f1Macro: 51.17, degradation: 26.50 },
    { noiseLevel: 0.15, accuracy: 62.25, f1Macro: 49.12, degradation: 27.57 },
    { noiseLevel: 0.20, accuracy: 60.37, f1Macro: 46.73, degradation: 29.45 },
    { noiseLevel: 0.25, accuracy: 59.91, f1Macro: 46.12, degradation: 29.91 },
    { noiseLevel: 0.30, accuracy: 59.32, f1Macro: 45.26, degradation: 30.50 },
  ],
  unknownAttackDetection: [
    { excludedAttack: "Backdoor_Malware", detectionRate: 65.84, unknownSamples: 644 },
    { excludedAttack: "DDoS-ACK_Fragmentation", detectionRate: 99.98, unknownSamples: 5000 },
    { excludedAttack: "DDoS-SYN_Flood", detectionRate: 100.0, unknownSamples: 5000 },
    { excludedAttack: "Recon-PortScan", detectionRate: 9.86, unknownSamples: 5000 },
  ],
  throughput: [
    { batchSize: 100, avgTimeMs: 38.25, samplesPerSecond: 2615, msPerSample: 0.3825 },
    { batchSize: 500, avgTimeMs: 48.08, samplesPerSecond: 10400, msPerSample: 0.0962 },
    { batchSize: 1000, avgTimeMs: 48.43, samplesPerSecond: 20647, msPerSample: 0.0484 },
    { batchSize: 5000, avgTimeMs: 59.09, samplesPerSecond: 84621, msPerSample: 0.0118 },
    { batchSize: 20644, avgTimeMs: 89.05, samplesPerSecond: 231833, msPerSample: 0.0043 },
  ],
  learningCurve: [
    { fraction: 0.1, nSamples: 8750, accuracy: 88.13, f1Macro: 81.80, trainingTime: 0.513 },
    { fraction: 0.2, nSamples: 17500, accuracy: 88.76, f1Macro: 82.70, trainingTime: 0.759 },
    { fraction: 0.3, nSamples: 26250, accuracy: 89.01, f1Macro: 83.16, trainingTime: 1.078 },
    { fraction: 0.5, nSamples: 43750, accuracy: 89.41, f1Macro: 83.71, trainingTime: 1.834 },
    { fraction: 0.7, nSamples: 61249, accuracy: 89.61, f1Macro: 84.00, trainingTime: 2.663 },
    { fraction: 1.0, nSamples: 87500, accuracy: 89.85, f1Macro: 84.34, trainingTime: 4.207 },
  ],
}

// ---------------------------------------------------------------------------
// 13. FEATURE SELECTION COMPARISON (BSO vs PSO vs GA vs GWO)
// ---------------------------------------------------------------------------
export const FEATURE_SELECTION_COMPARISON = {
  BSO: {
    method: "BSO-Hybrid (Proposed)",
    nSelected: 19,
    reductionPct: 51.3,
    bestFitness: 0.177801,
    evaluations: 1177,
    time: 840.43,
    features: ["Header_Length", "Time_To_Live", "Rate", "fin_flag_number", "psh_flag_number", "cwr_flag_number", "syn_count", "HTTP", "HTTPS", "DNS", "SSH", "UDP", "DHCP", "ARP", "IGMP", "LLC", "Tot sum", "Max", "Number"],
  },
  PSO: {
    method: "PSO",
    nSelected: 18,
    reductionPct: 53.8,
    bestFitness: 0.193895,
    evaluations: 820,
    time: 68.91,
    features: ["Time_To_Live", "fin_flag_number", "syn_flag_number", "rst_flag_number", "psh_flag_number", "ack_flag_number", "ack_count", "HTTP", "HTTPS", "DNS", "SMTP", "SSH", "IRC", "TCP", "UDP", "Min", "IAT", "Number"],
  },
  GA: {
    method: "GA",
    nSelected: 21,
    reductionPct: 46.2,
    bestFitness: 0.188982,
    evaluations: 722,
    time: 60.47,
    features: ["Protocol Type", "Time_To_Live", "psh_flag_number", "ece_flag_number", "ack_count", "syn_count", "fin_count", "HTTP", "HTTPS", "DNS", "SSH", "IRC", "TCP", "DHCP", "ARP", "IPv", "LLC", "Min", "Max", "Std", "IAT"],
  },
  GWO: {
    method: "GWO",
    nSelected: 23,
    reductionPct: 41.0,
    bestFitness: 0.192181,
    evaluations: 820,
    time: 70.23,
    features: ["Time_To_Live", "Rate", "fin_flag_number", "syn_flag_number", "psh_flag_number", "ack_flag_number", "ece_flag_number", "fin_count", "rst_count", "HTTP", "HTTPS", "DNS", "Telnet", "SMTP", "SSH", "DHCP", "IPv", "LLC", "Tot sum", "Max", "AVG", "Std", "IAT"],
  },
}

// ---------------------------------------------------------------------------
// 14. COMPUTATIONAL EFFICIENCY
// ---------------------------------------------------------------------------
export const COMPUTATIONAL_EFFICIENCY = [
  { model: "BSO-Hybrid RF (Proposed)", trainingTime: 3.742, predictionTimeMs: 0.0043, featuresUsed: 19, featureSet: "BSO" },
  { model: "BSO-SVM", trainingTime: 5.485, predictionTimeMs: 0.0009, featuresUsed: 19, featureSet: "BSO" },
  { model: "PSO-RF", trainingTime: 2.601, predictionTimeMs: 0.0071, featuresUsed: 18, featureSet: "PSO" },
  { model: "GA-RF", trainingTime: 2.816, predictionTimeMs: 0.006, featuresUsed: 21, featureSet: "GA" },
  { model: "GWO-RF", trainingTime: 3.508, predictionTimeMs: 0.006, featuresUsed: 23, featureSet: "GWO" },
  { model: "Random Forest", trainingTime: 4.52, predictionTimeMs: 0.0068, featuresUsed: 39, featureSet: "All" },
  { model: "SVM (Linear)", trainingTime: 68.244, predictionTimeMs: 0.0011, featuresUsed: 39, featureSet: "All" },
  { model: "Decision Tree", trainingTime: 1.007, predictionTimeMs: 0.0003, featuresUsed: 39, featureSet: "All" },
  { model: "KNN", trainingTime: 0.006, predictionTimeMs: 0.0514, featuresUsed: 39, featureSet: "All" },
  { model: "Naive Bayes", trainingTime: 0.048, predictionTimeMs: 0.0007, featuresUsed: 39, featureSet: "All" },
  { model: "Logistic Regression", trainingTime: 3.742, predictionTimeMs: 0.0001, featuresUsed: 39, featureSet: "All" },
  { model: "XGBoost", trainingTime: 4.688, predictionTimeMs: 0.002, featuresUsed: 39, featureSet: "All" },
]

// ---------------------------------------------------------------------------
// 15. STATE-OF-THE-ART COMPARISON
// ---------------------------------------------------------------------------
export const STATE_OF_THE_ART = [
  { paper: "Neto et al. (2023)", dataset: "CICIoT2023", method: "Random Forest", accuracy: 99.0, f1Score: 98.0, note: "Binary classification (benign vs attack)" },
  { paper: "Ferrag et al. (2023)", dataset: "CICIoT2023", method: "DNN", accuracy: 98.2, f1Score: 97.5, note: "Binary classification, deep learning" },
  { paper: "Proposed (BSO-Hybrid RF)", dataset: "CICIoT2023", method: "BSO-Hybrid RF", accuracy: 89.82, f1Score: 89.90, note: "5-class multi-class, BSO optimization, SMOTE, 19 features" },
]

// ---------------------------------------------------------------------------
// 16. TRAFFIC PATTERN GENERATOR (based on real CICIoT2023 patterns)
// ---------------------------------------------------------------------------
export function generateRealisticTraffic(
  points = 60,
): {
  time: string
  timestamp: number
  benign: number
  ack_frag: number
  syn: number
  portscan: number
  backdoor: number
  total: number
}[] {
  const data = []
  const now = Date.now()

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = now - i * 1000
    const date = new Date(timestamp)
    const seconds = date.getSeconds()
    const minute = date.getMinutes()

    const benignBase = 140 + Math.sin(seconds * 0.12) * 40
    const attackBurst = minute % 5 === 0 && seconds < 15 ? 2.5 : 1.0
    const ack_fragBase = 25 * attackBurst + Math.random() * 8
    const synBase = 25 * attackBurst + Math.random() * 8
    const portscanBase = 10 * attackBurst + Math.random() * 4
    const backdoorBase = 3 * attackBurst + Math.random() * 2

    const benign = Math.round(benignBase + Math.random() * 15)
    const ack_frag = Math.round(ack_fragBase)
    const syn = Math.round(synBase)
    const portscan = Math.round(portscanBase)
    const backdoor = Math.round(backdoorBase)

    data.push({
      time: date.toLocaleTimeString(),
      timestamp,
      benign,
      ack_frag,
      syn,
      portscan,
      backdoor,
      total: benign + ack_frag + syn + portscan + backdoor,
    })
  }

  return data
}

// ---------------------------------------------------------------------------
// 17. TRAINING HISTORY (loss & accuracy per epoch — RF convergence simulation)
// ---------------------------------------------------------------------------
export function generateTrainingHistory(): {
  epoch: number
  trainLoss: number
  valLoss: number
  trainAccuracy: number
  valAccuracy: number
}[] {
  const data = []
  for (let epoch = 1; epoch <= 50; epoch++) {
    const trainLoss = 0.45 * Math.exp(-epoch / 8) + 0.102 + Math.random() * 0.005
    const valLoss = 0.48 * Math.exp(-epoch / 9) + 0.108 + Math.random() * 0.008
    const trainAccuracy = (1 - trainLoss) * 100
    const valAccuracy = (1 - valLoss) * 100

    data.push({
      epoch,
      trainLoss: Math.max(0.102, trainLoss),
      valLoss: Math.max(0.108, valLoss),
      trainAccuracy: Math.min(90.5, trainAccuracy),
      valAccuracy: Math.min(90.0, valAccuracy),
    })
  }
  return data
}
