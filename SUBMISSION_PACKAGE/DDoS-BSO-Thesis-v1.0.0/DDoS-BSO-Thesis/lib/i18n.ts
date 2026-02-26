"use client"

import { useState, useEffect } from "react"

export type Translation = {
  // Navigation & Layout
  appTitle: string
  appDescription: string
  realTimeMonitoring: string
  dataProcessing: string
  mlClassification: string
  cryptographicSecurity: string
  performanceAnalysis: string

  // Dashboard
  activeConnections: string
  threatsBlocked: string
  bsoAccuracy: string
  dataProcessed: string
  networkTrafficAnalysis: string
  threatDistribution: string

  // Status & Alerts
  highPriorityAlert: string
  detectedPotentialDDoS: string
  normalTraffic: string
  suspiciousActivity: string
  ddosAttacks: string

  // BSO Optimization
  bsoOptimizationControl: string
  birdSwarmOptimization: string
  startOptimization: string
  optimizing: string
  reset: string
  swarmSize: string
  dimensions: string

  // ML Classification
  mlClassificationSystem: string
  hybridBsoClassifier: string
  trainModel: string
  classifyTraffic: string
  currentPrediction: string
  latestClassificationResult: string
  confidence: string
  classificationTimeline: string
  realtimePredictionProbabilities: string
  startClassificationToSeeResults: string
  noClassificationDataYet: string
  hybridBsoClassifierResults: string
  accuracy: string
  f1Score: string
  precision: string
  recall: string
  falsePositiveRate: string
  falseNegativeRate: string
  trainModelsToSeeMetrics: string
  detectionDistribution: string
  classificationResultsBreakdown: string
  noDetectionDataAvailable: string
  algorithmComparison: string
  performanceComparisonOfDifferentML: string

  // Security
  cryptographicEnhancement: string
  encryptionStatus: string
  keyRotation: string
  securityRecommendations: string

  // Performance
  performanceMetrics: string
  systemHealth: string
  latencyAnalysis: string
  throughputAnalysis: string

  // Network
  networkTopology: string
  deviceStatus: string
  connections: string
  trafficVolume: string

  // System Administration
  systemAdministration: string
  userManagement: string
  configuration: string
  auditLogs: string
  dataExport: string

  // Comprehensive System Diagram
  comprehensiveSystemDiagram: string
  interactiveAnimatedDiagram: string
  iotDevices: string
  dataProcessingCenter: string
  encryption: string
  birdSwarmAlgorithm: string
  intelligentClassification: string
  threatDetection: string
  response: string
  processingSteps: string
  processingTimeline: string
  packetsProcessed: string
  threatsDetected: string
  systemAccuracy: string
  encryptionLevel: string
  speed: string
  block: string
  safe: string
  complete: string
  inProgress: string
  pending: string
  iotDataCollection: string
  dataPreprocessing: string
  bsoOptimization: string
  ddosDetection: string
  automatedResponse: string

  // Advanced Research Dashboard
  advancedResearchTools: string
  comprehensiveAnalysisForAcademicResearch: string
  statisticalTests: string
  featureAnalysis: string
  rocAnalysis: string
  timeSeriesAnalysis: string
  correlationAnalysis: string
  modelInterpretability: string
  hypothesisTesting: string
  statisticalSignificanceTests: string
  significant: string
  notSignificant: string
  statistic: string
  runningAnalysis: string
  runStatisticalTests: string
  effectSizeAnalysis: string
  practicalSignificanceMetrics: string
  featureImportanceRanking: string
  shapValuesAndConfidenceIntervals: string
  importance: string
  featureConfidenceAnalysis: string
  statisticalConfidenceInFeatureSelection: string
  exportFeatureAnalysis: string
  rocCurveAnalysis: string
  receiverOperatingCharacteristic: string
  optimalThreshold: string
  precisionRecallCurve: string
  precisionRecallTradeoff: string
  temporalPatternAnalysis: string
  attackPatternsOverTime: string
  attackTraffic: string
  trend: string
  seasonalDecomposition: string
  trendSeasonalityAnalysis: string
  seasonalComponent: string
  anomalyDetection: string
  statisticalAnomalies: string
  anomaliesDetected: string
  averageDeviation: string
  analyzingPatterns: string
  runTimeSeriesAnalysis: string
  featureCorrelationMatrix: string
  interFeatureRelationships: string
  positiveCorrelation: string
  negativeCorrelation: string
  shapValueAnalysis: string
  modelDecisionExplanation: string
  decisionBoundaryAnalysis: string
  classificationDecisionRegions: string
  modelComplexityAnalysis: string
  biasVarianceTradeoff: string
  bias: string
  variance: string
  totalError: string
  generateInterpretabilityReport: string

  // Publication Results
  publicationResults: string
  comprehensiveAnalysis: string
  confusionMatrix: string
  rocCurves: string
  // featureAnalysis: string // Duplicate, keep the one from Advanced Research Dashboard for consistency
  bsoAnalysis: string
  comparison: string
  statistical: string
  confusionMatrices: string
  detailedClassificationResults: string
  classMetrics: string
  rocCurve: string
  precisionRecallCurve: string
  topFeaturesForDetection: string
  featureRelationships: string
  featureCorrelation: string
  bsoConvergence: string
  optimizationProgress: string
  bsoParameters: string
  optimizationConfiguration: string
  trainingTime: string
  computationalEfficiency: string
  statisticalSignificance: string
  hypothesisTesting: string
  improvement: string
  conclusion: string
  statisticalConclusion: string

  // Model Training Interface
  modelTraining: string
  trainingConfiguration: string
  configureAndTrainModels: string
  learningRate: string
  epochs: string
  batchSize: string
  validationSplit: string
  earlyStoppingPatience: string
  startTraining: string
  training: string
  stopTraining: string
  trainingProgress: string
  currentEpoch: string
  trainingLoss: string
  validationLoss: string
  trainingAccuracy: string
  validationAccuracy: string
  estimatedTimeRemaining: string
  trainingResults: string
  finalMetrics: string
  modelPerformance: string

  // Dataset Management
  datasetManagement: string
  uploadAndManageDatasets: string
  uploadDataset: string
  selectFile: string
  uploadCSV: string
  uploading: string
  datasetStatistics: string
  totalRecords: string
  features: string
  normalTrafficPercentage: string
  attackTrafficPercentage: string
  dataQuality: string
  missingValues: string
  duplicates: string
  outliers: string
  featureDistribution: string
  classBalance: string

  // Help Documentation
  helpDocumentation: string
  comprehensiveGuide: string
  gettingStarted: string
  systemOverview: string
  systemOverviewDescription: string
  quickStart: string
  quickStartDescription: string
  features: string
  featuresDescription: string
  bsoOptimization: string
  bsoDescription: string
  mlClassification: string
  mlDescription: string
  cryptographicSecurity: string
  cryptoDescription: string
  performanceMonitoring: string
  performanceDescription: string
  usageGuide: string
  monitoringTraffic: string
  monitoringDescription: string
  trainingModels: string
  trainingDescription: string
  analyzingResults: string
  analyzingDescription: string
  exportingData: string
  exportingDescription: string
  technicalDetails: string
  algorithms: string
  algorithmsDescription: string
  dataProcessing: string
  dataProcessingDescription: string
  securityFeatures: string
  securityDescription: string
  troubleshooting: string
  commonIssues: string
  troubleshootingDescription: string

  // Real Data Integration
  realDataIntegration: string
  connectToRealDataSources: string
  packetCapture: string
  database: string
  mlModel: string
  cloudServices: string
  networkInterface: string
  bpfFilter: string
  captureType: string
  startPacketCapture: string
  databaseConnection: string
  databaseType: string
  host: string
  port: string
  databaseName: string
  username: string
  password: string
  connectToDatabase: string
  mlModelEndpoint: string
  mlPlatform: string
  endpointURL: string
  modelType: string
  apiKey: string
  connectToMLModel: string
  cloudServiceIntegration: string
  cloudProvider: string
  region: string
  accessKeyID: string
  secretAccessKey: string
  connectToCloudService: string
  realDatasetLoaders: string
  loadPopularDatasets: string
  connected: string
  disconnected: string
  online: string
  offline: string

  // New translations from updates
  appSubtitle: string
  overview: string
  realtime: string
  research: string
  publication: string
  monitoring: string
  systemStatus: string
  packetsAnalyzed: string
  attacksDetected: string
  modelAccuracy: string
  threatLevel: string
  normal: string
  warning: string
  critical: string
  startAnalysis: string
  stopAnalysis: string
  exportData: string
  settings: string
  help: string
  language: string
  theme: string
  darkMode: string
  lightMode: string
  dataConfiguration: string
  datasetManagement: string
  documentation: string
  totalPackets: string
  trainingTime: string
  predictionTime: string
  featureImportance: string
  confusionMatrix: string
  rocCurve: string
  encryptionStatus: string
  securityLevel: string
  liveMonitoring: string
  updateInterval: string
  packetsPerSecond: string
  bytesPerSecond: string
  activeThreats: string
  blockedAttacks: string
  systemLoad: string
  memoryUsage: string
  cpuUsage: string
  networkLatency: string

  // Academic Research Panel
  academicResearch: string
  exportPDF: string
  exportCSV: string
  exportCharts: string
  datasetInfo: string
  performance: string
  attackTypes: string
  cicIoT2023Dataset: string
  totalSamples: string
  benignSamples: string
  attackSamples: string
  category: string
  samples: string
  percentage: string
  trainingSet: string
  testingSet: string
  attackTypesIncluded: string
  algorithmPerformanceComparison: string
  detailedMetricsComparison: string
  algorithm: string
  auc: string
  proposed: string
  bsoOptimizationAnalysis: string
  convergenceBehavior: string
  currentFitness: string
  bestFitness: string
  avgFitness: string
  parameter: string
  value: string
  populationSize: string
  maxIterations: string
  frequencyMin: string
  frequencyMax: string
  loudnessInitial: string
  pulseRateInitial: string
  convergenceIteration: string
  finalAccuracy: string
  featureImportanceAnalysis: string
  topFeaturesWithBSOWeights: string
  rank: string
  feature: string
  normalizedWeight: string
  contribution: string
  confusionMatrixAnalysis: string
  bsoRFModel: string
  truePositive: string
  falsePositive: string
  falseNegative: string
  trueNegative: string
  metric: string
  specificity: string
  attackTypeDetectionRates: string
  perAttackTypePerformance: string
  attackType: string
  detected: string
  detectionRate: string
  falsePositives: string
}

const translations: Record<string, Translation> = {
  en: {
    // Navigation & Layout
    appTitle: "DDoS Detection System",
    appDescription: "Cryptographic-Enhanced Hybrid BSO Model for IoT Security",
    realTimeMonitoring: "Real-time Monitoring",
    dataProcessing: "Data Processing",
    mlClassification: "ML Classification",
    cryptographicSecurity: "Cryptographic Security",
    performanceAnalysis: "Performance Analysis",

    // Dashboard
    activeConnections: "Active Connections",
    threatsBlocked: "Threats Blocked",
    bsoAccuracy: "BSO Accuracy",
    dataProcessed: "Data Processed",
    networkTrafficAnalysis: "Network Traffic Analysis",
    threatDistribution: "Threat Distribution",

    // Status & Alerts
    highPriorityAlert: "High Priority Alert",
    detectedPotentialDDoS: "Detected potential DDoS attack from 192.168.1.0/24 subnet. BSO optimization engaged.",
    normalTraffic: "Normal Traffic",
    suspiciousActivity: "Suspicious Activity",
    ddosAttacks: "DDoS Attacks",

    // BSO Optimization
    bsoOptimizationControl: "BSO Optimization Control",
    birdSwarmOptimization: "Bird Swarm Optimization for feature selection and parameter tuning",
    startOptimization: "Start Optimization",
    optimizing: "Optimizing...",
    reset: "Reset",
    swarmSize: "Swarm Size",
    dimensions: "Dimensions",

    // ML Classification
    mlClassificationSystem: "ML Classification System",
    hybridBsoClassifier: "Hybrid BSO-Enhanced SVM and Random Forest for DDoS Detection",
    trainModel: "Train Models",
    classifyTraffic: "Start Real-time Classification",
    currentPrediction: "Current Prediction",
    latestClassificationResult: "Latest classification result",
    confidence: "Confidence",
    classificationTimeline: "Classification Timeline",
    realtimePredictionProbabilities: "Real-time prediction probabilities",
    startClassificationToSeeResults: "Start classification to see results",
    noClassificationDataYet: "No classification data yet",
    hybridBsoClassifierResults: "Hybrid BSO-Enhanced Classifier Results",
    accuracy: "Accuracy",
    f1Score: "F1 Score",
    precision: "Precision",
    recall: "Recall",
    falsePositiveRate: "False Positive Rate",
    falseNegativeRate: "False Negative Rate",
    trainModelsToSeeMetrics: "Train models to see performance metrics",
    detectionDistribution: "Detection Distribution",
    classificationResultsBreakdown: "Classification results breakdown",
    noDetectionDataAvailable: "No detection data available",
    algorithmComparison: "Algorithm Comparison",
    performanceComparisonOfDifferentML: "Performance comparison of different ML approaches",

    // Security
    cryptographicEnhancement: "Cryptographic Enhancement",
    encryptionStatus: "Encryption Status",
    keyRotation: "Key Rotation",
    securityRecommendations: "Security Recommendations",

    // Performance
    performanceMetrics: "Performance Metrics",
    systemHealth: "System Health",
    latencyAnalysis: "Latency Analysis",
    throughputAnalysis: "Throughput Analysis",

    // Network
    networkTopology: "Network Topology",
    deviceStatus: "Device Status",
    connections: "Connections",
    trafficVolume: "Traffic Volume",

    // System Administration
    systemAdministration: "System Administration",
    userManagement: "User Management",
    configuration: "Configuration",
    auditLogs: "Audit Logs",
    dataExport: "Data Export",

    // Comprehensive System Diagram
    comprehensiveSystemDiagram: "Comprehensive System Diagram",
    interactiveAnimatedDiagram: "Interactive animated diagram showing how the complete DDoS detection system works",
    iotDevices: "IoT Devices",
    dataProcessingCenter: "Data Processing",
    encryption: "Encryption",
    birdSwarmAlgorithm: "Bird Swarm Algorithm",
    intelligentClassification: "Intelligent Classification",
    threatDetection: "Threat Detection",
    response: "Response",
    processingSteps: "Processing Steps",
    processingTimeline: "Processing Timeline",
    packetsProcessed: "Packets Processed",
    threatsDetected: "Threats Detected",
    systemAccuracy: "System Accuracy",
    encryptionLevel: "Encryption Level",
    speed: "Speed",
    block: "Block",
    safe: "Safe",
    complete: "Complete",
    inProgress: "In Progress",
    pending: "Pending",
    iotDataCollection: "IoT Data Collection",
    dataPreprocessing: "Data Preprocessing",
    bsoOptimization: "BSO Optimization",
    ddosDetection: "DDoS Detection",
    automatedResponse: "Automated Response",

    // Advanced Research Dashboard
    advancedResearchTools: "Advanced Research Tools",
    comprehensiveAnalysisForAcademicResearch:
      "Comprehensive analysis tools for academic research and thesis development",
    statisticalTests: "Statistical Tests",
    featureAnalysis: "Feature Analysis",
    rocAnalysis: "ROC Analysis",
    timeSeriesAnalysis: "Time Series Analysis",
    correlationAnalysis: "Correlation Analysis",
    modelInterpretability: "Model Interpretability",
    hypothesisTesting: "Hypothesis Testing",
    statisticalSignificanceTests: "Statistical significance tests for algorithm comparison",
    significant: "Significant",
    notSignificant: "Not Significant",
    statistic: "Statistic",
    runningAnalysis: "Running Analysis...",
    runStatisticalTests: "Run Statistical Tests",
    effectSizeAnalysis: "Effect Size Analysis",
    practicalSignificanceMetrics: "Practical significance metrics",
    featureImportanceRanking: "Feature Importance Ranking",
    shapValuesAndConfidenceIntervals: "SHAP values and confidence intervals",
    importance: "Importance",
    featureConfidenceAnalysis: "Feature Confidence Analysis",
    statisticalConfidenceInFeatureSelection: "Statistical confidence in feature selection",
    exportFeatureAnalysis: "Export Feature Analysis",
    rocCurveAnalysis: "ROC Curve Analysis",
    receiverOperatingCharacteristic: "Receiver Operating Characteristic curve",
    optimalThreshold: "Optimal Threshold",
    precisionRecallCurve: "Precision-Recall Curve",
    precisionRecallTradeoff: "Precision-recall tradeoff analysis",
    temporalPatternAnalysis: "Temporal Pattern Analysis",
    attackPatternsOverTime: "Attack patterns and trends over time",
    attackTraffic: "Attack Traffic",
    trend: "Trend",
    seasonalDecomposition: "Seasonal Decomposition",
    trendSeasonalityAnalysis: "Trend and seasonality analysis",
    seasonalComponent: "Seasonal Component",
    anomalyDetection: "Anomaly Detection",
    statisticalAnomalies: "Statistical anomalies in traffic patterns",
    anomaliesDetected: "Anomalies Detected",
    averageDeviation: "Average Deviation",
    analyzingPatterns: "Analyzing Patterns...",
    runTimeSeriesAnalysis: "Run Time Series Analysis",
    featureCorrelationMatrix: "Feature Correlation Matrix",
    interFeatureRelationships: "Inter-feature relationships and dependencies",
    positiveCorrelation: "Positive Correlation",
    negativeCorrelation: "Negative Correlation",
    shapValueAnalysis: "SHAP Value Analysis",
    modelDecisionExplanation: "Model decision explanation and feature attribution",
    decisionBoundaryAnalysis: "Decision Boundary Analysis",
    classificationDecisionRegions: "Classification decision regions",
    modelComplexityAnalysis: "Model Complexity Analysis",
    biasVarianceTradeoff: "Bias-variance tradeoff analysis",
    bias: "Bias",
    variance: "Variance",
    totalError: "Total Error",
    generateInterpretabilityReport: "Generate Interpretability Report",

    // Publication Results
    publicationResults: "Publication Results",
    comprehensiveAnalysis: "Comprehensive analysis and visualizations for research publication",
    confusionMatrix: "Confusion Matrix",
    rocCurves: "ROC Curves",
    // featureAnalysis: "Feature Analysis", // Kept from Advanced Research Dashboard
    bsoAnalysis: "BSO Analysis",
    comparison: "Comparison",
    statistical: "Statistical",
    confusionMatrices: "Confusion Matrices",
    detailedClassificationResults: "Detailed classification results for each algorithm",
    classMetrics: "Class Metrics",
    rocCurve: "ROC Curve",
    precisionRecallCurve: "Precision-Recall Curve",
    topFeaturesForDetection: "Top features for DDoS detection",
    featureRelationships: "Feature relationships and dependencies",
    featureCorrelation: "Feature Correlation",
    bsoConvergence: "BSO Convergence",
    optimizationProgress: "Optimization progress over iterations",
    bsoParameters: "BSO Parameters",
    optimizationConfiguration: "Optimization configuration and settings",
    trainingTime: "Training Time",
    computationalEfficiency: "Computational efficiency comparison",
    statisticalSignificance: "Statistical Significance",
    hypothesisTesting: "Hypothesis testing and p-value analysis",
    improvement: "Improvement",
    conclusion: "Conclusion",
    statisticalConclusion:
      "The BSO-optimized Random Forest algorithm shows statistically significant improvements (p < 0.05) over all baseline algorithms, with practical improvements ranging from 2.5% to 7.2% in accuracy. These results demonstrate the effectiveness of the hybrid BSO approach for DDoS detection in dynamic network environments.",

    // Model Training Interface
    modelTraining: "Model Training",
    trainingConfiguration: "Training Configuration",
    configureAndTrainModels: "Configure and Train Models",
    learningRate: "Learning Rate",
    epochs: "Epochs",
    batchSize: "Batch Size",
    validationSplit: "Validation Split",
    earlyStoppingPatience: "Early Stopping Patience",
    startTraining: "Start Training",
    training: "Training",
    stopTraining: "Stop Training",
    trainingProgress: "Training Progress",
    currentEpoch: "Current Epoch",
    trainingLoss: "Training Loss",
    validationLoss: "Validation Loss",
    trainingAccuracy: "Training Accuracy",
    validationAccuracy: "Validation Accuracy",
    estimatedTimeRemaining: "Estimated Time Remaining",
    trainingResults: "Training Results",
    finalMetrics: "Final Metrics",
    modelPerformance: "Model Performance",

    // Dataset Management
    datasetManagement: "Dataset Management",
    uploadAndManageDatasets: "Upload and Manage Datasets",
    uploadDataset: "Upload Dataset",
    selectFile: "Select File",
    uploadCSV: "Upload CSV",
    uploading: "Uploading...",
    datasetStatistics: "Dataset Statistics",
    totalRecords: "Total Records",
    features: "Features",
    normalTrafficPercentage: "Normal Traffic Percentage",
    attackTrafficPercentage: "Attack Traffic Percentage",
    dataQuality: "Data Quality",
    missingValues: "Missing Values",
    duplicates: "Duplicates",
    outliers: "Outliers",
    featureDistribution: "Feature Distribution",
    classBalance: "Class Balance",

    // Help Documentation
    helpDocumentation: "Help Documentation",
    comprehensiveGuide: "Comprehensive Guide",
    gettingStarted: "Getting Started",
    systemOverview: "System Overview",
    systemOverviewDescription: "Get an overview of the DDoS Detection System and its components.",
    quickStart: "Quick Start",
    quickStartDescription: "Begin using the system with minimal setup.",
    features: "Features",
    featuresDescription: "Explore the various features and functionalities of the DDoS Detection System.",
    bsoOptimization: "BSO Optimization",
    bsoDescription:
      "Learn about the Bird Swarm Optimization algorithm used for feature selection and parameter tuning.",
    mlClassification: "ML Classification",
    mlDescription: "Understand the machine learning classification methods employed for DDoS detection.",
    cryptographicSecurity: "Cryptographic Security",
    cryptoDescription: "Discover how cryptographic enhancements improve the security of the system.",
    performanceMonitoring: "Performance Monitoring",
    performanceDescription: "Monitor the system's performance metrics and health.",
    usageGuide: "Usage Guide",
    monitoringTraffic: "Monitoring Traffic",
    monitoringDescription: "Learn how to monitor network traffic for potential threats.",
    trainingModels: "Training Models",
    trainingDescription: "Guide on configuring and training machine learning models.",
    analyzingResults: "Analyzing Results",
    analyzingDescription: "Instructions for analyzing and interpreting classification results.",
    exportingData: "Exporting Data",
    exportingDescription: "How to export data for further analysis or reporting.",
    technicalDetails: "Technical Details",
    algorithms: "Algorithms",
    algorithmsDescription: "Detailed information about the algorithms used in the system.",
    dataProcessing: "Data Processing",
    dataProcessingDescription: "Description of the data processing pipeline.",
    securityFeatures: "Security Features",
    securityDescription: "Information on the security features provided by the system.",
    troubleshooting: "Troubleshooting",
    commonIssues: "Common Issues",
    troubleshootingDescription: "Steps to resolve common problems encountered while using the system.",

    // Real Data Integration
    realDataIntegration: "Real Data Integration",
    connectToRealDataSources: "Connect to real data sources for professional DDoS detection",
    packetCapture: "Packet Capture",
    database: "Database",
    mlModel: "ML Model",
    cloudServices: "Cloud Services",
    networkInterface: "Network Interface",
    bpfFilter: "BPF Filter (Optional)",
    captureType: "Capture Type",
    startPacketCapture: "Start Packet Capture",
    databaseConnection: "Database Connection",
    databaseType: "Database Type",
    host: "Host",
    port: "Port",
    databaseName: "Database Name",
    username: "Username",
    password: "Password",
    connectToDatabase: "Connect to Database",
    mlModelEndpoint: "ML Model Endpoint",
    mlPlatform: "ML Platform",
    endpointURL: "Endpoint URL",
    modelType: "Model Type",
    apiKey: "API Key (Optional)",
    connectToMLModel: "Connect to ML Model",
    cloudServiceIntegration: "Cloud Service Integration",
    cloudProvider: "Cloud Provider",
    region: "Region",
    accessKeyID: "Access Key ID",
    secretAccessKey: "Secret Access Key",
    connectToCloudService: "Connect to Cloud Service",
    realDatasetLoaders: "Real Dataset Loaders",
    loadPopularDatasets: "Load popular DDoS detection datasets",
    connected: "Connected",
    disconnected: "Disconnected",
    online: "Online",
    offline: "Offline",

    // Additional translations from updates
    appSubtitle: "BSO-Optimized Hybrid Machine Learning Framework",
    overview: "Overview",
    realtime: "Real-time",
    bsoAnalysis: "BSO Analysis",
    mlClassification: "ML Classification",
    algorithms: "Algorithms",
    security: "Security",
    performance: "Performance",
    research: "Research",
    publication: "Publication",
    monitoring: "Monitoring",
    systemStatus: "System Status",
    packetsAnalyzed: "Packets Analyzed",
    attacksDetected: "Attacks Detected",
    modelAccuracy: "Model Accuracy",
    activeConnections: "Active Connections",
    threatLevel: "Threat Level",
    normal: "Normal",
    warning: "Warning",
    critical: "Critical",
    startAnalysis: "Start Analysis",
    stopAnalysis: "Stop Analysis",
    exportData: "Export Data",
    settings: "Settings",
    help: "Help",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    dataConfiguration: "Data Configuration",
    modelTraining: "Model Training",
    datasetManagement: "Dataset Management",
    documentation: "Documentation",
    totalPackets: "Total Packets",
    ddosAttacks: "DDoS Attacks",
    normalTraffic: "Normal Traffic",
    accuracy: "Accuracy",
    precision: "Precision",
    recall: "Recall",
    f1Score: "F1 Score",
    trainingTime: "Training Time",
    predictionTime: "Prediction Time",
    featureImportance: "Feature Importance",
    confusionMatrix: "Confusion Matrix",
    rocCurve: "ROC Curve",
    algorithmComparison: "Algorithm Comparison",
    bsoOptimization: "BSO Optimization",
    encryptionStatus: "Encryption Status",
    securityLevel: "Security Level",
    liveMonitoring: "Live Monitoring",
    updateInterval: "Update Interval",
    packetsPerSecond: "Packets/Second",
    bytesPerSecond: "Bytes/Second",
    activeThreats: "Active Threats",
    blockedAttacks: "Blocked Attacks",
    systemLoad: "System Load",
    memoryUsage: "Memory Usage",
    cpuUsage: "CPU Usage",
    networkLatency: "Network Latency",

    // Academic Research Panel
    academicResearch: "Academic Research",
    exportPDF: "Export PDF",
    exportCSV: "Export CSV",
    exportCharts: "Export Charts",
    datasetInfo: "Dataset Info",
    performance: "Performance",
    attackTypes: "Attack Types",
    cicIoT2023Dataset: "CICIoT2023 Dataset",
    totalSamples: "Total Samples",
    benignSamples: "Benign Samples",
    attackSamples: "Attack Samples",
    category: "Category",
    samples: "Samples",
    percentage: "Percentage",
    trainingSet: "Training Set",
    testingSet: "Testing Set",
    attackTypesIncluded: "Attack Types Included",
    algorithmPerformanceComparison: "Algorithm Performance Comparison",
    detailedMetricsComparison: "Detailed metrics comparison across all models",
    algorithm: "Algorithm",
    auc: "AUC-ROC",
    proposed: "Proposed",
    bsoOptimizationAnalysis: "BSO Optimization Analysis",
    convergenceBehavior: "Convergence behavior and parameter configuration",
    currentFitness: "Current Fitness",
    bestFitness: "Best Fitness",
    avgFitness: "Average Fitness",
    parameter: "Parameter",
    value: "Value",
    populationSize: "Population Size",
    maxIterations: "Max Iterations",
    frequencyMin: "Frequency Min",
    frequencyMax: "Frequency Max",
    loudnessInitial: "Loudness (A₀)",
    pulseRateInitial: "Pulse Rate (r₀)",
    convergenceIteration: "Convergence Iteration",
    finalAccuracy: "Final Accuracy",
    featureImportanceAnalysis: "Feature Importance Analysis",
    topFeaturesWithBSOWeights: "Top features selected by BSO with importance weights",
    rank: "Rank",
    feature: "Feature",
    normalizedWeight: "Normalized Weight",
    contribution: "Contribution",
    confusionMatrixAnalysis: "Confusion Matrix Analysis",
    bsoRFModel: "BSO-Hybrid RF Model (Binary: Attack vs Benign)",
    truePositive: "True Positive",
    falsePositive: "False Positive",
    falseNegative: "False Negative",
    trueNegative: "True Negative",
    metric: "Metric",
    specificity: "Specificity",
    attackTypeDetectionRates: "Attack Type Detection Rates",
    perAttackTypePerformance: "Per-attack type performance analysis",
    attackType: "Attack Type",
    detected: "Detected",
    detectionRate: "Detection Rate",
    falsePositives: "False Positives",
  },
  ar: {
    // Navigation & Layout
    appTitle: "نظام كشف هجمات DDoS",
    appDescription: "نموذج BSO الهجين المحسن تشفيرياً لأمان إنترنت الأشياء",
    realTimeMonitoring: "المراقبة في الوقت الفعلي",
    dataProcessing: "معالجة البيانات",
    mlClassification: "تصنيف التعلم الآلي",
    cryptographicSecurity: "الأمان التشفيري",
    performanceAnalysis: "تحليل الأداء",

    // Dashboard
    activeConnections: "الاتصالات النشطة",
    threatsBlocked: "التهديدات المحجوبة",
    bsoAccuracy: "دقة BSO",
    dataProcessed: "البيانات المعالجة",
    networkTrafficAnalysis: "تحليل حركة الشبكة",
    threatDistribution: "توزيع التهديدات",

    // Status & Alerts
    highPriorityAlert: "تنبيه عالي الأولوية",
    detectedPotentialDDoS: "تم اكتشاف هجوم DDoS محتمل من الشبكة الفرعية 192.168.1.0/24. تم تفعيل تحسين BSO.",
    normalTraffic: "حركة مرور عادية",
    suspiciousActivity: "نشاط مشبوه",
    ddosAttacks: "هجمات DDoS",

    // BSO Optimization
    bsoOptimizationControl: "التحكم في تحسين BSO",
    birdSwarmOptimization: "تحسين سرب الطيور لاختيار الميزات وضبط المعاملات",
    startOptimization: "بدء التحسين",
    optimizing: "جاري التحسين...",
    reset: "إعادة تعيين",
    swarmSize: "حجم السرب",
    dimensions: "الأبعاد",

    // ML Classification
    mlClassificationSystem: "نظام تصنيف التعلم الآلي",
    hybridBsoClassifier: "مصنف BSO الهجين المحسن مع SVM و Random Forest لكشف DDoS",
    trainModel: "تدريب النماذج",
    classifyTraffic: "بدء التصنيف في الوقت الفعلي",
    currentPrediction: "التنبؤ الحالي",
    latestClassificationResult: "أحدث نتيجة تصنيف",
    confidence: "الثقة",
    classificationTimeline: "الجدول الزمني للتصنيف",
    realtimePredictionProbabilities: "احتماليات التنبؤ في الوقت الفعلي",
    startClassificationToSeeResults: "ابدأ التصنيف لرؤية النتائج",
    noClassificationDataYet: "لا توجد بيانات تصنيف بعد",
    hybridBsoClassifierResults: "نتائج مصنف BSO الهجين المحسن",
    accuracy: "الدقة",
    f1Score: "نقاط F1",
    precision: "الدقة",
    recall: "الاستدعاء",
    falsePositiveRate: "معدل الإيجابية الخاطئة",
    falseNegativeRate: "معدل السلبية الخاطئة",
    trainModelsToSeeMetrics: "قم بتدريب النماذج لرؤية مقاييس الأداء",
    detectionDistribution: "توزيع الكشف",
    classificationResultsBreakdown: "تفصيل نتائج التصنيف",
    noDetectionDataAvailable: "لا توجد بيانات كشف متاحة",
    algorithmComparison: "مقارنة الخوارزميات",
    performanceComparisonOfDifferentML: "مقارنة أداء مناهج التعلم الآلي المختلفة",

    // Security
    cryptographicEnhancement: "التحسين التشفيري",
    encryptionStatus: "حالة التشفير",
    keyRotation: "دوران المفاتيح",
    securityRecommendations: "توصيات الأمان",

    // Performance
    performanceMetrics: "مقاييس الأداء",
    systemHealth: "صحة النظام",
    latencyAnalysis: "تحليل زمن الاستجابة",
    throughputAnalysis: "تحليل الإنتاجية",

    // Network
    networkTopology: "طوبولوجيا الشبكة",
    deviceStatus: "حالة الجهاز",
    connections: "الاتصالات",
    trafficVolume: "حجم حركة المرور",

    // System Administration
    systemAdministration: "إدارة النظام",
    userManagement: "إدارة المستخدمين",
    configuration: "التكوين",
    auditLogs: "سجلات التدقيق",
    dataExport: "تصدير البيانات",

    // Comprehensive System Diagram
    comprehensiveSystemDiagram: "مخطط النظام الشامل",
    interactiveAnimatedDiagram: "رسم متحرك تفاعلي يوضح كيفية عمل نظام كشف هجمات DDoS بالكامل",
    iotDevices: "أجهزة إنترنت الأشياء",
    dataProcessingCenter: "معالجة البيانات",
    encryption: "التشفير",
    birdSwarmAlgorithm: "خوارزمية سرب الطيور",
    intelligentClassification: "التصنيف الذكي",
    threatDetection: "كشف التهديدات",
    response: "الاستجابة",
    processingSteps: "خطوات المعالجة",
    processingTimeline: "الجدول الزمني للمعالجة",
    packetsProcessed: "حزم معالجة",
    threatsDetected: "تهديدات مكتشفة",
    systemAccuracy: "دقة النظام",
    encryptionLevel: "مستوى التشفير",
    speed: "السرعة",
    block: "حظر",
    safe: "آمن",
    complete: "مكتمل",
    inProgress: "جاري",
    pending: "في الانتظار",
    iotDataCollection: "جمع البيانات من أجهزة إنترنت الأشياء",
    dataPreprocessing: "معالجة البيانات والتنظيف",
    bsoOptimization: "تحسين خوارزمية سرب الطيور",
    ddosDetection: "كشف هجمات DDoS",
    automatedResponse: "الاستجابة التلقائية",

    // Advanced Research Dashboard
    advancedResearchTools: "أدوات البحث المتقدمة",
    comprehensiveAnalysisForAcademicResearch: "أدوات تحليل شاملة للبحث الأكاديمي وتطوير الرسائل العلمية",
    statisticalTests: "الاختبارات الإحصائية",
    featureAnalysis: "تحليل الميزات",
    rocAnalysis: "تحليل ROC",
    timeSeriesAnalysis: "تحليل السلاسل الزمنية",
    correlationAnalysis: "تحليل الارتباط",
    modelInterpretability: "قابلية تفسير النموذج",
    hypothesisTesting: "اختبار الفرضيات",
    statisticalSignificanceTests: "اختبارات الدلالة الإحصائية لمقارنة الخوارزميات",
    significant: "دال إحصائياً",
    notSignificant: "غير دال إحصائياً",
    statistic: "الإحصائية",
    runningAnalysis: "جاري التحليل...",
    runStatisticalTests: "تشغيل الاختبارات الإحصائية",
    effectSizeAnalysis: "تحليل حجم التأثير",
    practicalSignificanceMetrics: "مقاييس الدلالة العملية",
    featureImportanceRanking: "ترتيب أهمية الميزات",
    shapValuesAndConfidenceIntervals: "قيم SHAP وفترات الثقة",
    importance: "الأهمية",
    featureConfidenceAnalysis: "تحليل ثقة الميزات",
    statisticalConfidenceInFeatureSelection: "الثقة الإحصائية في اختيار الميزات",
    exportFeatureAnalysis: "تصدير تحليل الميزات",
    rocCurveAnalysis: "تحليل منحنى ROC",
    receiverOperatingCharacteristic: "منحنى خصائص التشغيل المستقبل",
    optimalThreshold: "العتبة المثلى",
    precisionRecallCurve: "منحنى الدقة-الاستدعاء",
    precisionRecallTradeoff: "تحليل المقايضة بين الدقة والاستدعاء",
    temporalPatternAnalysis: "تحليل الأنماط الزمنية",
    attackPatternsOverTime: "أنماط الهجمات والاتجاهات عبر الزمن",
    attackTraffic: "حركة الهجمات",
    trend: "الاتجاه",
    seasonalDecomposition: "التحليل الموسمي",
    trendSeasonalityAnalysis: "تحليل الاتجاه والموسمية",
    seasonalComponent: "المكون الموسمي",
    anomalyDetection: "كشف الشذوذ",
    statisticalAnomalies: "الشذوذ الإحصائي في أنماط حركة المرور",
    anomaliesDetected: "الشذوذ المكتشف",
    averageDeviation: "متوسط الانحراف",
    analyzingPatterns: "تحليل الأنماط...",
    runTimeSeriesAnalysis: "تشغيل تحليل السلاسل الزمنية",
    featureCorrelationMatrix: "مصفوفة ارتباط الميزات",
    interFeatureRelationships: "العلاقات والتبعيات بين الميزات",
    positiveCorrelation: "ارتباط إيجابي",
    negativeCorrelation: "ارتباط سلبي",
    shapValueAnalysis: "تحليل قيم SHAP",
    modelDecisionExplanation: "شرح قرارات النموذج وإسناد الميزات",
    decisionBoundaryAnalysis: "تحليل حدود القرار",
    classificationDecisionRegions: "مناطق قرارات التصنيف",
    modelComplexityAnalysis: "تحليل تعقيد النموذج",
    biasVarianceTradeoff: "تحليل المقايضة بين التحيز والتباين",
    bias: "التحيز",
    variance: "التباين",
    totalError: "إجمالي الخطأ",
    generateInterpretabilityReport: "إنشاء تقرير قابلية التفسير",

    // Publication Results
    publicationResults: "نتائج النشر",
    comprehensiveAnalysis: "تحليل شامل ورسوم بيانية للنشر البحثي",
    confusionMatrix: "مصفوفة الارتباك",
    rocCurves: "منحنيات ROC",
    // featureAnalysis: "تحليل الميزات", // Kept from Advanced Research Dashboard
    bsoAnalysis: "تحليل BSO",
    comparison: "المقارنة",
    statistical: "إحصائي",
    confusionMatrices: "مصفوفات الارتباك",
    detailedClassificationResults: "نتائج التصنيف التفصيلية لكل خوارزمية",
    classMetrics: "مقاييس الفئة",
    rocCurve: "منحنى ROC",
    precisionRecallCurve: "منحنى الدقة-الاستدعاء",
    topFeaturesForDetection: "أهم الميزات لكشف DDoS",
    featureRelationships: "علاقات وتبعيات الميزات",
    featureCorrelation: "ارتباط الميزات",
    bsoConvergence: "تقارب BSO",
    optimizationProgress: "تقدم التحسين عبر التكرارات",
    bsoParameters: "معاملات BSO",
    optimizationConfiguration: "تكوين وإعدادات التحسين",
    trainingTime: "وقت التدريب",
    computationalEfficiency: "مقارنة الكفاءة الحسابية",
    statisticalSignificance: "الدلالة الإحصائية",
    hypothesisTesting: "اختبار الفرضيات وتحليل قيمة p",
    improvement: "التحسين",
    conclusion: "الخلاصة",
    statisticalConclusion:
      "تُظهر خوارزمية Random Forest المحسنة بـ BSO تحسينات ذات دلالة إحصائية (p < 0.05) على جميع الخوارزميات الأساسية، مع تحسينات عملية تتراوح من 2.5٪ إلى 7.2٪ في الدقة. تُظهر هذه النتائج فعالية نهج BSO الهجين لكشف DDoS في بيئات الشبكة الديناميكية.",

    // Model Training Interface
    modelTraining: "تدريب النموذج",
    trainingConfiguration: "تكوين التدريب",
    configureAndTrainModels: "تكوين وتدريب النماذج",
    learningRate: "معدل التعلم",
    epochs: "الحلقات",
    batchSize: "حجم الدفعة",
    validationSplit: "تقسيم التحقق",
    earlyStoppingPatience: "الصبر المبكر للتوقف",
    startTraining: "بدء التدريب",
    training: "التدريب",
    stopTraining: "إيقاف التدريب",
    trainingProgress: "تقدم التدريب",
    currentEpoch: "الحلقة الحالية",
    trainingLoss: "خسارة التدريب",
    validationLoss: "خسارة التحقق",
    trainingAccuracy: "دقة التدريب",
    validationAccuracy: "دقة التحقق",
    estimatedTimeRemaining: "الوقت المتوقع للانتهاء",
    trainingResults: "نتائج التدريب",
    finalMetrics: "المقاييس النهائية",
    modelPerformance: "أداء النموذج",

    // Dataset Management
    datasetManagement: "إدارة مجموعات البيانات",
    uploadAndManageDatasets: "تحميل وإدارة مجموعات البيانات",
    uploadDataset: "تحميل مجموعة البيانات",
    selectFile: "اختيار الملف",
    uploadCSV: "تحميل CSV",
    uploading: "جارٍ التحميل...",
    datasetStatistics: "إحصائيات مجموعات البيانات",
    totalRecords: "مجموع السجلات",
    features: "الميزات",
    normalTrafficPercentage: "نسبة حركة المرور العادية",
    attackTrafficPercentage: "نسبة حركة الهجمات",
    dataQuality: "جودة البيانات",
    missingValues: "قيم مفقودة",
    duplicates: "التكرارات",
    outliers: "الشذوذ",
    featureDistribution: "توزيع الميزات",
    classBalance: "وازن الفئات",

    // Help Documentation
    helpDocumentation: "توثيق المساعدة",
    comprehensiveGuide: "دليل شامل",
    gettingStarted: "البدء",
    systemOverview: "نظرة عامة على النظام",
    systemOverviewDescription: "احصل على نظرة عامة على نظام كشف هجمات DDoS وعناصره.",
    quickStart: "بداية سريعة",
    quickStartDescription: "ابدأ استخدام النظام مع تكوين بسيط.",
    features: "الميزات",
    featuresDescription: "استكشف الميزات المختلفة والوظائف المتاحة في نظام كشف هجمات DDoS.",
    bsoOptimization: "تحسين BSO",
    bsoDescription: "تعرف على خوارزمية تحسين سرب الطيور المستخدمة لاختيار الميزات وضبط المعاملات.",
    mlClassification: "تصنيف التعلم الآلي",
    mlDescription: "فهم طرق تصنيف التعلم الآلي المستخدمة لكشف هجمات DDoS.",
    cryptographicSecurity: "الأمان التشفيري",
    cryptoDescription: "اكتشف كيف تحسينات التشفير تحسن أمان النظام.",
    performanceMonitoring: "مراقبة الأداء",
    performanceDescription: "مراقبة مقاييس أداء النظام وصحة النظام.",
    usageGuide: "دليل الاستخدام",
    monitoringTraffic: "مراقبة حركة المرور",
    monitoringDescription: "تعلم كيفية مراقبة حركة الشبكة للتهديدات المحتملة.",
    trainingModels: "تدريب النماذج",
    trainingDescription: "دليل تكوين وتدريب نماذج التعلم الآلي.",
    analyzingResults: "تحليل النتائج",
    analyzingDescription: "تعليمات لتحليل وفهم نتائج التصنيف.",
    exportingData: "تصدير البيانات",
    exportingDescription: "كيفية تصدير البيانات للتحليل أو التقارير.",
    technicalDetails: "التفاصيل التقنية",
    algorithms: "الخوارزميات",
    algorithmsDescription: "معلومات مفصلة عن الخوارزميات المستخدمة في النظام.",
    dataProcessing: "معالجة البيانات",
    dataProcessingDescription: "وصف خط معالجة البيانات.",
    securityFeatures: "ميزات الأمان",
    securityDescription: "معلومات حول ميزات الأمان التي يوفرها النظام.",
    troubleshooting: "التصحيح",
    commonIssues: "المشاكل الشائعة",
    troubleshootingDescription: "خطوات لحل المشكلات الشائعة عند استخدام النظام.",

    // Real Data Integration
    realDataIntegration: "تكامل البيانات الحقيقية",
    connectToRealDataSources: "الاتصال بمصادر البيانات الحقيقية للكشف الاحترافي عن DDoS",
    packetCapture: "التقاط الحزم",
    database: "قاعدة البيانات",
    mlModel: "نموذج التعلم الآلي",
    cloudServices: "الخدمات السحابية",
    networkInterface: "واجهة الشبكة",
    bpfFilter: "مرشح BPF (اختياري)",
    captureType: "نوع الالتقاط",
    startPacketCapture: "بدء التقاط الحزم",
    databaseConnection: "اتصال قاعدة البيانات",
    databaseType: "نوع قاعدة البيانات",
    host: "المضيف",
    port: "المنفذ",
    databaseName: "اسم قاعدة البيانات",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    connectToDatabase: "الاتصال بقاعدة البيانات",
    mlModelEndpoint: "نقطة نهاية نموذج التعلم الآلي",
    mlPlatform: "منصة التعلم الآلي",
    endpointURL: "عنوان URL للنقطة النهائية",
    modelType: "نوع النموذج",
    apiKey: "مفتاح API (اختياري)",
    connectToMLModel: "الاتصال بنموذج التعلم الآلي",
    cloudServiceIntegration: "تكامل الخدمة السحابية",
    cloudProvider: "مزود الخدمة السحابية",
    region: "المنطقة",
    accessKeyID: "معرف مفتاح الوصول",
    secretAccessKey: "مفتاح الوصول السري",
    connectToCloudService: "الاتصال بالخدمة السحابية",
    realDatasetLoaders: "محملات مجموعات البيانات الحقيقية",
    loadPopularDatasets: "تحميل مجموعات بيانات كشف DDoS الشائعة",
    connected: "متصل",
    disconnected: "غير متصل",
    online: "متصل",
    offline: "غير متصل",

    // Additional translations from updates
    appSubtitle: "إطار عمل هجين للتعلم الآلي محسن بخوارزمية BSO",
    overview: "نظرة عامة",
    realtime: "الوقت الفعلي",
    bsoAnalysis: "تحليل BSO",
    mlClassification: "تصنيف ML",
    algorithms: "الخوارزميات",
    security: "الأمان",
    performance: "الأداء",
    research: "البحث",
    publication: "النشر",
    monitoring: "المراقبة",
    systemStatus: "حالة النظام",
    packetsAnalyzed: "الحزم المحللة",
    attacksDetected: "الهجمات المكتشفة",
    modelAccuracy: "دقة النموذج",
    activeConnections: "الاتصالات النشطة",
    threatLevel: "مستوى التهديد",
    normal: "طبيعي",
    warning: "تحذير",
    critical: "حرج",
    startAnalysis: "بدء التحليل",
    stopAnalysis: "إيقاف التحليل",
    exportData: "تصدير البيانات",
    settings: "الإعدادات",
    help: "المساعدة",
    language: "اللغة",
    theme: "المظهر",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    dataConfiguration: "تكوين البيانات",
    modelTraining: "تدريب النموذج",
    datasetManagement: "إدارة البيانات",
    documentation: "التوثيق",
    totalPackets: "إجمالي الحزم",
    trainingTime: "وقت التدريب",
    predictionTime: "وقت التنبؤ",
    featureImportance: "أهمية الميزات",
    confusionMatrix: "مصفوفة الارتباك",
    rocCurve: "منحنى ROC",
    algorithmComparison: "مقارنة الخوارزميات",
    bsoOptimization: "تحسين BSO",
    encryptionStatus: "حالة التشفير",
    securityLevel: "مستوى الأمان",
    liveMonitoring: "المراقبة الحية",
    updateInterval: "فترة التحديث",
    packetsPerSecond: "حزم/ثانية",
    bytesPerSecond: "بايت/ثانية",
    activeThreats: "التهديدات النشطة",
    blockedAttacks: "الهجمات المحظورة",
    systemLoad: "حمل النظام",
    memoryUsage: "استخدام الذاكرة",
    cpuUsage: "استخدام المعالج",
    networkLatency: "تأخير الشبكة",

    // Academic Research Panel
    academicResearch: "البحث الأكاديمي",
    exportPDF: "تصدير PDF",
    exportCSV: "تصدير CSV",
    exportCharts: "تصدير الرسوم البيانية",
    datasetInfo: "معلومات البيانات",
    performance: "الأداء",
    attackTypes: "أنواع الهجمات",
    cicIoT2023Dataset: "مجموعة بيانات CICIoT2023",
    totalSamples: "إجمالي العينات",
    benignSamples: "العينات الحميدة",
    attackSamples: "عينات الهجمات",
    category: "الفئة",
    samples: "العينات",
    percentage: "النسبة المئوية",
    trainingSet: "مجموعة التدريب",
    testingSet: "مجموعة الاختبار",
    attackTypesIncluded: "أنواع الهجمات المشمولة",
    algorithmPerformanceComparison: "مقارنة أداء الخوارزميات",
    detailedMetricsComparison: "مقارنة المقاييس التفصيلية عبر جميع النماذج",
    algorithm: "الخوارزمية",
    auc: "AUC-ROC",
    proposed: "المقترح",
    bsoOptimizationAnalysis: "تحليل تحسين BSO",
    convergenceBehavior: "سلوك التقارب وتكوين المعاملات",
    currentFitness: "اللياقة الحالية",
    bestFitness: "أفضل لياقة",
    avgFitness: "متوسط اللياقة",
    parameter: "المعامل",
    value: "القيمة",
    populationSize: "حجم السكان",
    maxIterations: "أقصى تكرارات",
    frequencyMin: "أدنى تردد",
    frequencyMax: "أقصى تردد",
    loudnessInitial: "الصوت (A₀)",
    pulseRateInitial: "معدل النبض (r₀)",
    convergenceIteration: "تكرار التقارب",
    finalAccuracy: "الدقة النهائية",
    featureImportanceAnalysis: "تحليل أهمية الميزات",
    topFeaturesWithBSOWeights: "أهم الميزات المختارة بواسطة BSO مع أوزان الأهمية",
    rank: "الرتبة",
    feature: "الميزة",
    normalizedWeight: "الوزن المعياري",
    contribution: "المساهمة",
    confusionMatrixAnalysis: "تحليل مصفوفة الارتباك",
    bsoRFModel: "نموذج BSO-Hybrid RF (ثنائي: هجوم مقابل حميد)",
    truePositive: "إيجابي صحيح",
    falsePositive: "إيجابي خاطئ",
    falseNegative: "سلبي خاطئ",
    trueNegative: "سلبي صحيح",
    metric: "المقياس",
    specificity: "النوعية",
    attackTypeDetectionRates: "معدلات كشف أنواع الهجمات",
    perAttackTypePerformance: "تحليل الأداء لكل نوع هجوم",
    attackType: "نوع الهجوم",
    detected: "المكتشف",
    detectionRate: "معدل الكشف",
    falsePositives: "الإيجابيات الخاطئة",
  },
  tr: {
    // Navigation & Layout
    appTitle: "DDoS Tespit Sistemi",
    appDescription: "IoT Güvenliği için Kriptografik Geliştirilmiş Hibrit BSO Modeli",
    realTimeMonitoring: "Gerçek Zamanlı İzleme",
    dataProcessing: "Veri İşleme",
    mlClassification: "ML Sınıflandırma",
    cryptographicSecurity: "Kriptografik Güvenlik",
    performanceAnalysis: "Performans Analizi",

    // Dashboard
    activeConnections: "Aktif Bağlantılar",
    threatsBlocked: "Engellenen Tehditler",
    bsoAccuracy: "BSO Doğruluğu",
    dataProcessed: "İşlenen Veri",
    networkTrafficAnalysis: "Ağ Trafiği Analizi",
    threatDistribution: "Tehdit Dağılımı",

    // Status & Alerts
    highPriorityAlert: "Yüksek Öncelikli Uyarı",
    detectedPotentialDDoS:
      "192.168.1.0/24 alt ağından potansiyel DDoS saldırısı tespit edildi. BSO optimizasyonu devreye girdi.",
    normalTraffic: "Normal Trafik",
    suspiciousActivity: "Şüpheli Aktivite",
    ddosAttacks: "DDoS Saldırıları",

    // BSO Optimization
    bsoOptimizationControl: "BSO Optimizasyon Kontrolü",
    birdSwarmOptimization: "Özellik seçimi ve parametre ayarlaması için Kuş Sürüsü Optimizasyonu",
    startOptimization: "Optimizasyonu Başlat",
    optimizing: "Optimize ediliyor...",
    reset: "Sıfırla",
    swarmSize: "Sürü Boyutu",
    dimensions: "Boyutlar",

    // ML Classification
    mlClassificationSystem: "ML Sınıflandırma Sistemi",
    hybridBsoClassifier: "DDoS Tespiti için Hibrit BSO Geliştirilmiş SVM ve Random Forest",
    trainModel: "Modelleri Eğit",
    classifyTraffic: "Gerçek Zamanlı Sınıflandırmayı Başlat",
    currentPrediction: "Mevcut Tahmin",
    latestClassificationResult: "En son sınıflandırma sonucu",
    confidence: "Güven",
    classificationTimeline: "Sınıflandırma Zaman Çizelgesi",
    realtimePredictionProbabilities: "Gerçek zamanlı tahmin olasılıkları",
    startClassificationToSeeResults: "Sonuçları görmek için sınıflandırmayı başlatın",
    noClassificationDataYet: "Henüz sınıflandırma verisi yok",
    hybridBsoClassifierResults: "Hibrit BSO Geliştirilmiş Sınıflandırıcı Sonuçları",
    accuracy: "Doğruluk",
    f1Score: "F1 Skoru",
    precision: "Kesinlik",
    recall: "Duyarlılık",
    falsePositiveRate: "Yanlış Pozitif Oranı",
    falseNegativeRate: "Yanlış Negatif Oranı",
    trainModelsToSeeMetrics: "Performans metriklerini görmek için modelleri eğitin",
    detectionDistribution: "Tespit Dağılımı",
    classificationResultsBreakdown: "Sınıflandırma sonuçları dökümü",
    noDetectionDataAvailable: "Tespit verisi mevcut değil",
    algorithmComparison: "Algoritma Karşılaştırması",
    performanceComparisonOfDifferentML: "Farklı ML yaklaşımlarının performans karşılaştırması",

    // Security
    cryptographicEnhancement: "Kriptografik Geliştirme",
    encryptionStatus: "Şifreleme Durumu",
    keyRotation: "Anahtar Rotasyonu",
    securityRecommendations: "Güvenlik Önerileri",

    // Performance
    performanceMetrics: "Performans Metrikleri",
    systemHealth: "Sistem Sağlığı",
    latencyAnalysis: "Gecikme Analizi",
    throughputAnalysis: "Verim Analizi",

    // Network
    networkTopology: "Ağ Topolojisi",
    deviceStatus: "Cihaz Durumu",
    connections: "Bağlantılar",
    trafficVolume: "Trafik Hacmi",

    // System Administration
    systemAdministration: "Sistem Yönetimi",
    userManagement: "Kullanıcı Yönetimi",
    configuration: "Yapılandırma",
    auditLogs: "Denetim Günlükleri",
    dataExport: "Veri Dışa Aktarma",

    // Comprehensive System Diagram
    comprehensiveSystemDiagram: "Kapsamlı Sistem Diyagramı",
    interactiveAnimatedDiagram:
      "Tam DDoS tespit sisteminin nasıl çalıştığını gösteren etkileşimli animasyonlu diyagram",
    iotDevices: "IoT Cihazları",
    dataProcessingCenter: "Veri İşleme",
    encryption: "Şifreleme",
    birdSwarmAlgorithm: "Kuş Sürüsü Algoritması",
    intelligentClassification: "Akıllı Sınıflandırma",
    threatDetection: "Tehdit Tespiti",
    response: "Yanıt",
    processingSteps: "İşleme Adımları",
    processingTimeline: "İşleme Zaman Çizelgesi",
    packetsProcessed: "İşlenen Paketler",
    threatsDetected: "Tespit Edilen Tehditler",
    systemAccuracy: "Sistem Doğruluğu",
    encryptionLevel: "Şifreleme Seviyesi",
    speed: "Hız",
    block: "Engelle",
    safe: "Güvenli",
    complete: "Tamamlandı",
    inProgress: "Devam Ediyor",
    pending: "Beklemede",
    iotDataCollection: "IoT Veri Toplama",
    dataPreprocessing: "Veri Ön İşleme",
    bsoOptimization: "BSO Optimizasyonu",
    ddosDetection: "DDoS Tespiti",
    automatedResponse: "Otomatik Yanıt",

    // Advanced Research Dashboard
    advancedResearchTools: "Gelişmiş Araştırma Araçları",
    comprehensiveAnalysisForAcademicResearch: "Akademik araştırma ve tez geliştirme için kapsamlı analiz araçları",
    statisticalTests: "İstatistiksel Testler",
    featureAnalysis: "Özellik Analizi",
    rocAnalysis: "ROC Analizi",
    timeSeriesAnalysis: "Zaman Serisi Analizi",
    correlationAnalysis: "Korelasyon Analizi",
    modelInterpretability: "Model Yorumlanabilirliği",
    hypothesisTesting: "Hipotez Testi",
    statisticalSignificanceTests: "Algoritma karşılaştırması için istatistiksel anlamlılık testleri",
    significant: "Anlamlı",
    notSignificant: "Anlamlı Değil",
    statistic: "İstatistik",
    runningAnalysis: "Analiz Çalışıyor...",
    runStatisticalTests: "İstatistiksel Testleri Çalıştır",
    effectSizeAnalysis: "Etki Boyutu Analizi",
    practicalSignificanceMetrics: "Pratik anlamlılık metrikleri",
    featureImportanceRanking: "Özellik Önem Sıralaması",
    shapValuesAndConfidenceIntervals: "SHAP değerleri ve güven aralıkları",
    importance: "Önem",
    featureConfidenceAnalysis: "Özellik Güven Analizi",
    statisticalConfidenceInFeatureSelection: "Özellik seçiminde istatistiksel güven",
    exportFeatureAnalysis: "Özellik Analizini Dışa Aktar",
    rocCurveAnalysis: "ROC Eğrisi Analizi",
    receiverOperatingCharacteristic: "Alıcı İşletim Karakteristiği eğrisi",
    optimalThreshold: "Optimal Eşik",
    precisionRecallCurve: "Kesinlik-Geri Çağırma Eğrisi",
    precisionRecallTradeoff: "Kesinlik-geri çağırma ödünleşim analizi",
    temporalPatternAnalysis: "Zamansal Desen Analizi",
    attackPatternsOverTime: "Zaman içindeki saldırı desenleri ve eğilimleri",
    attackTraffic: "Saldırı Trafiği",
    trend: "Eğilim",
    seasonalDecomposition: "Mevsimsel Ayrıştırma",
    trendSeasonalityAnalysis: "Eğilim ve mevsimsellik analizi",
    seasonalComponent: "Mevsimsel Bileşen",
    anomalyDetection: "Anomali Tespiti",
    statisticalAnomalies: "Trafik desenlerindeki istatistiksel anomaliler",
    anomaliesDetected: "Tespit Edilen Anomaliler",
    averageDeviation: "Ortalama Sapma",
    analyzingPatterns: "Analiz ediliyor...",
    runTimeSeriesAnalysis: "Zaman Serisi Analizini Çalıştır",
    featureCorrelationMatrix: "Özellik Korelasyon Matrisi",
    interFeatureRelationships: "Özellikler arası ilişkiler ve bağımlılıklar",
    positiveCorrelation: "Pozitif Korelasyon",
    negativeCorrelation: "Negatif Korelasyon",
    shapValueAnalysis: "SHAP Değer Analizi",
    modelDecisionExplanation: "Model karar açıklaması ve özellik atfı",
    decisionBoundaryAnalysis: "Karar Sınırı Analizi",
    classificationDecisionRegions: "Kararlar bölgeleri",
    modelComplexityAnalysis: "Model Karmaşıklık Analizi",
    biasVarianceTradeoff: "Önyargı-varyans ödünleşim analizi",
    bias: "Önyargı",
    variance: "Varyans",
    totalError: "Toplam Hata",
    generateInterpretabilityReport: "Yorumlanabilirlik Raporu Oluştur",

    // Publication Results
    publicationResults: "Yayın Sonuçları",
    comprehensiveAnalysis: "Araştırma yayını için kapsamlı analiz ve görselleştirmeler",
    confusionMatrix: "Karışıklık Matrisi",
    rocCurves: "منحنيات ROC",
    // featureAnalysis: "Özellik Analizi", // Kept from Advanced Research Dashboard
    bsoAnalysis: "BSO Analizi",
    comparison: "Karşılaştırma",
    statistical: "İstatistiksel",
    confusionMatrices: "Karışıklık Matrisleri",
    detailedClassificationResults: "Detaylı sınıflandırma sonuçları",
    classMetrics: "Sınıf Metrikleri",
    rocCurve: "ROC Eğrisi",
    precisionRecallCurve: "Kesinlik-Geri Çağırma Eğrisi",
    topFeaturesForDetection: "DDoS tespiti için en önemli özellikler",
    featureRelationships: "Özellik ilişkileri ve bağımlılıkları",
    featureCorrelation: "Özellik Korelasyonu",
    bsoConvergence: "BSO Yakınsama",
    optimizationProgress: "İterasyonlar boyunca optimizasyon ilerlemesi",
    bsoParameters: "BSO Parametreleri",
    optimizationConfiguration: "Optimizasyon yapılandırması ve ayarları",
    trainingTime: "Eğitim Süresi",
    computationalEfficiency: "Hesaplama verimliliği karşılaştırması",
    statisticalSignificance: "İstatistiksel Anlamlılık",
    hypothesisTesting: "Hipotez testi ve p-değeri analizi",
    improvement: "İyileştirme",
    conclusion: "Sonuç",
    statisticalConclusion:
      "BSO ile optimize edilmiş Random Forest algoritması, tüm temel algoritmalara göre istatistiksel olarak anlamlı iyileştirmeler (p < 0.05) göstermektedir ve doğrulukta %2.5 ile %7.2 arasında pratik iyileştirmeler sağlamaktadır. Bu sonuçlar, dinamik ağ ortamlarında DDoS tespiti için hibrit BSO yaklaşımının etkinliğini göstermektedir.",

    // Model Training Interface
    modelTraining: "Model Eğitimi",
    trainingConfiguration: "Eğitim Yapılandırması",
    configureAndTrainModels: "Modelleri Yapılandır ve Eğit",
    learningRate: "Öğrenme Oranı",
    epochs: "Epochs",
    batchSize: "Batch Size",
    validationSplit: "Doğrulama Bölümü",
    earlyStoppingPatience: "Erken Durdurma Sabırsızlığı",
    startTraining: "Eğitimi Başlat",
    training: "Eğitim",
    stopTraining: "Eğitimi Durdur",
    trainingProgress: "Eğitim İlerlemesi",
    currentEpoch: "Geçerli Epoch",
    trainingLoss: "Eğitim Kaybı",
    validationLoss: "Doğrulama Kaybı",
    trainingAccuracy: "Eğitim Doğruluğu",
    validationAccuracy: "Doğrulama Doğruluğu",
    estimatedTimeRemaining: "Kalan Tahmini Süre",
    trainingResults: "Eğitim Sonuçları",
    finalMetrics: "Son Metrikler",
    modelPerformance: "Model Performansı",

    // Dataset Management
    datasetManagement: "Veri Kümesi Yönetimi",
    uploadAndManageDatasets: "Veri Kümeslerini Yükle ve Yönet",
    uploadDataset: "Veri Kümesi Yükle",
    selectFile: "Dosya Seç",
    uploadCSV: "CSV Yükle",
    uploading: "Yükleniyor...",
    datasetStatistics: "Veri Kümesi İstatistikleri",
    totalRecords: "Toplam Kayıtlar",
    features: "Özellikler",
    normalTrafficPercentage: "Normal Trafik Yüzdesi",
    attackTrafficPercentage: "Saldırı Trafik Yüzdesi",
    dataQuality: "Veri Kalitesi",
    missingValues: "Eksik Değerler",
    duplicates: "Yinelenen Kayıtlar",
    outliers: "Aykırı Noktalar",
    featureDistribution: "Özellik Dağılımı",
    classBalance: "Sınıf Dengesi",

    // Help Documentation
    helpDocumentation: "Yardım Dokümantasyonu",
    comprehensiveGuide: "Kapsamlı Rehber",
    gettingStarted: "Başlarken",
    systemOverview: "Sistem Genel Bakışı",
    systemOverviewDescription: "DDoS Tespit Sistemi ve bileşenlerinin genel bakışını alın.",
    quickStart: "Hızlı Başlat",
    quickStartDescription: "Sistem kullanmaya en az kurulumla başlayın.",
    features: "Özellikler",
    featuresDescription: "Sistemdeki çeşitli özellikler ve işlevsellikleri keşfedin.",
    bsoOptimization: "BSO Optimizasyonu",
    bsoDescription:
      "Kuş Sürüsü Optimizasyonu algoritması, özellik seçimi ve parametre ayarlaması için nasıl kullanıldığını öğrenin.",
    mlClassification: "ML Sınıflandırması",
    mlDescription: "DDoS tespiti için kullanılan makine öğrenimi sınıflandırma yöntemlerini anlayın.",
    cryptographicSecurity: "Kriptografik Güvenlik",
    cryptoDescription: "Sistemin güvenliğini geliştiren kriptografik iyileştirmeleri keşfedin.",
    performanceMonitoring: "Performans İzleme",
    performanceDescription: "Sistem performans metriklerini ve sağlıkını izleyin.",
    usageGuide: "Kullanım Rehberi",
    monitoringTraffic: "Trafik İzleme",
    monitoringDescription: "Potansiyel tehditleri izlemek için ağ trafiğini nasıl izleyeceğinizi öğrenin.",
    trainingModels: "Modelleri Eğitme",
    trainingDescription: "Nitelikli ve etkili makine öğrenimi modellerini eğitme kılavuzu.",
    analyzingResults: "Sonuçları Analiz Etme",
    analyzingDescription: "Sınıflandırma sonuçlarını analiz etme ve yorumlama talimatları.",
    exportingData: "Verileri Dışa Aktarma",
    exportingDescription: "Analiz veya raporlama amacıyla verileri nasıl dışa aktaracağınızı öğrenin.",
    technicalDetails: "Teknik Ayrıntılar",
    algorithms: "Algoritmalar",
    algorithmsDescription: "Sisteminde kullanılan algoritmalar hakkında ayrıntılı bilgi.",
    dataProcessing: "Veri İşleme",
    dataProcessingDescription: "Veri işleme boru hattı açıklaması.",
    securityFeatures: "Güvenlik Özellikleri",
    securityDescription: "Sistem tarafından sağlanan güvenlik özelliklerine dair bilgi.",
    troubleshooting: "Sorun Giderme",
    commonIssues: "Sıkı Sorunlar",
    troubleshootingDescription: "Sistem kullanırken karşılaşılan yaygın sorunları çözme adımları.",

    // Real Data Integration
    realDataIntegration: "Gerçek Veri Entegrasyonu",
    connectToRealDataSources: "Profesyonel DDoS tespiti için gerçek veri kaynaklarına bağlanın",
    packetCapture: "Paket Yakalama",
    database: "Veritabanı",
    mlModel: "ML Modeli",
    cloudServices: "Bulut Hizmetleri",
    networkInterface: "Ağ Arayüzü",
    bpfFilter: "BPF Filtresi (İsteğe Bağlı)",
    captureType: "Yakalama Türü",
    startPacketCapture: "Paket Yakalamayı Başlat",
    databaseConnection: "Veritabanı Bağlantısı",
    databaseType: "Veritabanı Türü",
    host: "Ana Bilgisayar",
    port: "Port",
    databaseName: "Veritabanı Adı",
    username: "Kullanıcı Adı",
    password: "Şifre",
    connectToDatabase: "Veritabanına Bağlan",
    mlModelEndpoint: "ML Model Uç Noktası",
    mlPlatform: "ML Platformu",
    endpointURL: "Uç Nokta URL'si",
    modelType: "Model Türü",
    apiKey: "API Anahtarı (İsteğe Bağlı)",
    connectToMLModel: "ML Modeline Bağlan",
    cloudServiceIntegration: "Bulut Hizmeti Entegrasyonu",
    cloudProvider: "Bulut Sağlayıcısı",
    region: "Bölge",
    accessKeyID: "Erişim Anahtarı Kimliği",
    secretAccessKey: "Gizli Erişim Anahtarı",
    connectToCloudService: "Bulut Hizmetine Bağlan",
    realDatasetLoaders: "Gerçek Veri Kümesi Yükleyicileri",
    loadPopularDatasets: "Popüler DDoS tespit veri kümelerini yükleyin",
    connected: "Bağlı",
    disconnected: "Bağlantı Kesildi",
    online: "Çevrimiçi",
    offline: "Çevrimdışı",

    // Additional translations from updates
    appSubtitle: "BSO ile Optimize Edilmiş Hibrit Makine Öğrenimi Çerçevesi",
    overview: "Genel Bakış",
    realtime: "Gerçek Zamanlı",
    bsoAnalysis: "BSO Analizi",
    mlClassification: "ML Sınıflandırma",
    algorithms: "Algoritmalar",
    security: "Güvenlik",
    performance: "Performans",
    research: "Araştırma",
    publication: "Yayın",
    monitoring: "İzleme",
    systemStatus: "Sistem Durumu",
    packetsAnalyzed: "Analiz Edilen Paketler",
    attacksDetected: "Tespit Edilen Saldırılar",
    modelAccuracy: "Model Doğruluğu",
    activeConnections: "Aktif Bağlantılar",
    threatLevel: "Tehdit Seviyesi",
    normal: "Normal",
    warning: "Uyarı",
    critical: "Kritik",
    startAnalysis: "Analizi Başlat",
    stopAnalysis: "Analizi Durdur",
    exportData: "Veriyi Dışa Aktar",
    settings: "Ayarlar",
    help: "Yardım",
    language: "Dil",
    theme: "Tema",
    darkMode: "Karanlık Mod",
    lightMode: "Aydınlık Mod",
    dataConfiguration: "Veri Yapılandırma",
    modelTraining: "Model Eğitimi",
    datasetManagement: "Veri Seti Yönetimi",
    documentation: "Dokümantasyon",
    totalPackets: "Toplam Paketler",
    trainingTime: "Eğitim Süresi",
    predictionTime: "Tahmin Süresi",
    featureImportance: "Özellik Önemi",
    confusionMatrix: "Karışıklık Matrisi",
    rocCurve: "ROC Eğrisi",
    algorithmComparison: "Algoritma Karşılaştırması",
    bsoOptimization: "BSO Optimizasyonu",
    encryptionStatus: "Şifreleme Durumu",
    securityLevel: "Güvenlik Seviyesi",
    liveMonitoring: "Canlı İzleme",
    updateInterval: "Güncelleme Aralığı",
    packetsPerSecond: "Paket/Saniye",
    bytesPerSecond: "Bayt/Saniye",
    activeThreats: "Aktif Tehditler",
    blockedAttacks: "Engellenen Saldırılar",
    systemLoad: "Sistem Yükü",
    memoryUsage: "Bellek Kullanımı",
    cpuUsage: "CPU Kullanımı",
    networkLatency: "Ağ Gecikmesi",

    // Academic Research Panel
    academicResearch: "Akademik Araştırma",
    exportPDF: "PDF Dışa Aktar",
    exportCSV: "CSV Dışa Aktar",
    exportCharts: "Grafikleri Dışa Aktar",
    datasetInfo: "Veri Seti Bilgisi",
    performance: "Performans",
    attackTypes: "Saldırı Türleri",
    cicIoT2023Dataset: "CICIoT2023 Veri Seti",
    totalSamples: "Toplam Örnekler",
    benignSamples: "İyi Huylu Örnekler",
    attackSamples: "Saldırı Örnekleri",
    category: "Kategori",
    samples: "Örnekler",
    percentage: "Yüzde",
    trainingSet: "Eğitim Seti",
    testingSet: "Test Seti",
    attackTypesIncluded: "Dahil Edilen Saldırı Türleri",
    algorithmPerformanceComparison: "Algoritma Performans Karşılaştırması",
    detailedMetricsComparison: "Tüm modeller arasında detaylı metrik karşılaştırması",
    algorithm: "Algoritma",
    auc: "AUC-ROC",
    proposed: "Önerilen",
    bsoOptimizationAnalysis: "BSO Optimizasyon Analizi",
    convergenceBehavior: "Yakınsama davranışı ve parametre yapılandırması",
    currentFitness: "Mevcut Uygunluk",
    bestFitness: "En İyi Uygunluk",
    avgFitness: "Ortalama Uygunluk",
    parameter: "Parametre",
    value: "Değer",
    populationSize: "Popülasyon Boyutu",
    maxIterations: "Maksimum İterasyon",
    frequencyMin: "Minimum Frekans",
    frequencyMax: "Maksimum Frekans",
    loudnessInitial: "Ses Yüksekliği (A₀)",
    pulseRateInitial: "Nabız Oranı (r₀)",
    convergenceIteration: "Yakınsama İterasyonu",
    finalAccuracy: "Son Doğruluk",
    featureImportanceAnalysis: "Özellik Önem Analizi",
    topFeaturesWithBSOWeights: "BSO tarafından seçilen en önemli özellikler ve ağırlıkları",
    rank: "Sıra",
    feature: "Özellik",
    normalizedWeight: "Normalize Ağırlık",
    contribution: "Katkı",
    confusionMatrixAnalysis: "Karışıklık Matrisi Analizi",
    bsoRFModel: "BSO-Hybrid RF Modeli (İkili: Saldırı vs İyi Huylu)",
    truePositive: "Doğru Pozitif",
    falsePositive: "Yanlış Pozitif",
    falseNegative: "Yanlış Negatif",
    trueNegative: "Doğru Negatif",
    metric: "Metrik",
    specificity: "Özgüllük",
    attackTypeDetectionRates: "Saldırı Türü Tespit Oranları",
    perAttackTypePerformance: "Saldırı türü bazında performans analizi",
    attackType: "Saldırı Türü",
    detected: "Tespit Edilen",
    detectionRate: "Tespit Oranı",
    falsePositives: "Yanlış Pozitifler",
  },
}

export type Language = keyof typeof translations

class I18nManager {
  private currentLanguage: Language = "tr"
  private listeners: Set<(language: Language) => void> = new Set()
  private initialized = false

  setLanguage(language: Language) {
    if (!translations[language]) return

    this.currentLanguage = language

    // Update document direction for RTL languages
    if (typeof document !== "undefined") {
      if (language === "ar") {
        document.documentElement.dir = "rtl"
        document.documentElement.lang = "ar"
      } else {
        document.documentElement.dir = "ltr"
        document.documentElement.lang = language
      }

      // Store preference
      localStorage.setItem("ddos-app-language", language)
    }

    // Notify all listeners
    this.listeners.forEach((listener) => listener(language))
  }

  getLanguage(): Language {
    return this.currentLanguage
  }

  getTranslation(): Translation {
    return translations[this.currentLanguage]
  }

  t(key: keyof Translation): string {
    return translations[this.currentLanguage][key] || translations.en[key] || key
  }

  subscribe(listener: (language: Language) => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  initialize() {
    if (this.initialized || typeof window === "undefined") return

    this.initialized = true

    // Load saved language preference
    const savedLanguage = localStorage.getItem("ddos-app-language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      this.setLanguage(savedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split("-")[0] as Language
      if (translations[browserLang]) {
        this.setLanguage(browserLang)
      }
    }
  }
}

export const i18n = new I18nManager()

export function useLanguage() {
  const [, forceUpdate] = useState(0)
  const [language, setLanguageState] = useState<Language>(() => i18n.getLanguage())

  useEffect(() => {
    // Initialize on first mount
    i18n.initialize()
    setLanguageState(i18n.getLanguage())

    // Subscribe to language changes
    const unsubscribe = i18n.subscribe((newLanguage) => {
      setLanguageState(newLanguage)
      forceUpdate((n) => n + 1) // Force re-render
    })

    return unsubscribe
  }, [])

  const t = (key: keyof Translation): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  const setLanguage = (lang: Language) => {
    i18n.setLanguage(lang)
  }

  return { language, t, setLanguage }
}
