// Performance Evaluation System for DDoS Detection
import type { ClassificationResult } from "./ml-classifier"
import type { ProcessedFeatures } from "./data-processor"

export interface PerformanceMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  specificity: number
  sensitivity: number
  falsePositiveRate: number
  falseNegativeRate: number
  truePositiveRate: number
  trueNegativeRate: number
  matthewsCorrelationCoefficient: number
  areaUnderCurve: number
}

export interface ConfusionMatrix {
  truePositive: number
  trueNegative: number
  falsePositive: number
  falseNegative: number
  total: number
}

export interface BenchmarkResult {
  algorithmName: string
  metrics: PerformanceMetrics
  confusionMatrix: ConfusionMatrix
  executionTime: number
  memoryUsage: number
  throughput: number // predictions per second
  timestamp: number
}

export interface SystemPerformance {
  cpuUsage: number
  memoryUsage: number
  networkLatency: number
  diskIO: number
  processingSpeed: number
  timestamp: number
}

export interface EvaluationReport {
  overallMetrics: PerformanceMetrics
  algorithmComparison: BenchmarkResult[]
  systemPerformance: SystemPerformance[]
  detectionLatency: number[]
  throughputAnalysis: {
    packetsPerSecond: number
    classificationsPerSecond: number
    averageResponseTime: number
  }
  recommendations: string[]
  timestamp: number
}

export class PerformanceEvaluator {
  private benchmarkHistory: BenchmarkResult[] = []
  private systemMetrics: SystemPerformance[] = []
  private detectionLatencies: number[] = []

  // Evaluate classification performance with detailed metrics
  evaluateClassification(
    predictions: ClassificationResult[],
    groundTruth: { label: "normal" | "suspicious" | "ddos"; timestamp: number }[],
  ): PerformanceMetrics {
    console.log("Evaluating classification performance with", predictions.length, "predictions")

    // Create confusion matrix for multi-class classification
    const classes = ["normal", "suspicious", "ddos"]
    const confusionMatrix: Record<string, Record<string, number>> = {}

    classes.forEach((actual) => {
      confusionMatrix[actual] = {}
      classes.forEach((predicted) => {
        confusionMatrix[actual][predicted] = 0
      })
    })

    // Populate confusion matrix
    predictions.forEach((pred, index) => {
      if (index < groundTruth.length) {
        const actual = groundTruth[index].label
        const predicted = pred.prediction
        confusionMatrix[actual][predicted]++
      }
    })

    // Calculate metrics for each class and average
    const totalAccuracy = 0
    let totalPrecision = 0
    let totalRecall = 0
    let totalF1 = 0
    let totalSpecificity = 0

    classes.forEach((className) => {
      const tp = confusionMatrix[className][className]
      const fp = classes.reduce((sum, c) => sum + (c !== className ? confusionMatrix[c][className] : 0), 0)
      const fn = classes.reduce((sum, c) => sum + (c !== className ? confusionMatrix[className][c] : 0), 0)
      const tn = classes.reduce(
        (sum, actualClass) =>
          sum +
          classes.reduce(
            (innerSum, predClass) =>
              innerSum +
              (actualClass !== className && predClass !== className ? confusionMatrix[actualClass][predClass] : 0),
            0,
          ),
        0,
      )

      const precision = tp / (tp + fp) || 0
      const recall = tp / (tp + fn) || 0
      const f1 = (2 * precision * recall) / (precision + recall) || 0
      const specificity = tn / (tn + fp) || 0

      totalPrecision += precision
      totalRecall += recall
      totalF1 += f1
      totalSpecificity += specificity
    })

    // Calculate overall metrics
    const totalPredictions = predictions.length
    const correctPredictions = predictions.filter(
      (pred, index) => index < groundTruth.length && pred.prediction === groundTruth[index].label,
    ).length

    const accuracy = correctPredictions / totalPredictions
    const avgPrecision = totalPrecision / classes.length
    const avgRecall = totalRecall / classes.length
    const avgF1 = totalF1 / classes.length
    const avgSpecificity = totalSpecificity / classes.length

    // Calculate additional metrics
    const falsePositiveRate = 1 - avgSpecificity
    const falseNegativeRate = 1 - avgRecall
    const truePositiveRate = avgRecall
    const trueNegativeRate = avgSpecificity

    // Matthews Correlation Coefficient (simplified for multi-class)
    const mcc = Math.sqrt(accuracy * avgSpecificity * avgRecall * (1 - falsePositiveRate))

    // Simulated AUC (Area Under Curve)
    const auc = (truePositiveRate + trueNegativeRate) / 2

    return {
      accuracy,
      precision: avgPrecision,
      recall: avgRecall,
      f1Score: avgF1,
      specificity: avgSpecificity,
      sensitivity: avgRecall,
      falsePositiveRate,
      falseNegativeRate,
      truePositiveRate,
      trueNegativeRate,
      matthewsCorrelationCoefficient: mcc,
      areaUnderCurve: auc,
    }
  }

  // Benchmark algorithm performance
  async benchmarkAlgorithm(
    algorithmName: string,
    classifyFunction: (features: ProcessedFeatures) => Promise<ClassificationResult>,
    testData: { features: ProcessedFeatures; label: "normal" | "suspicious" | "ddos" }[],
  ): Promise<BenchmarkResult> {
    console.log(`Benchmarking algorithm: ${algorithmName}`)

    const startTime = performance.now()
    const startMemory = this.getMemoryUsage()

    const predictions: ClassificationResult[] = []
    const groundTruth = testData.map((item) => ({ label: item.label, timestamp: Date.now() }))

    // Run predictions and measure performance
    for (const testItem of testData) {
      const predictionStart = performance.now()
      const result = await classifyFunction(testItem.features)
      const predictionEnd = performance.now()

      predictions.push(result)
      this.detectionLatencies.push(predictionEnd - predictionStart)
    }

    const endTime = performance.now()
    const endMemory = this.getMemoryUsage()

    const executionTime = endTime - startTime
    const memoryUsage = endMemory - startMemory
    const throughput = testData.length / (executionTime / 1000) // predictions per second

    // Calculate performance metrics
    const metrics = this.evaluateClassification(predictions, groundTruth)

    // Create confusion matrix
    const confusionMatrix = this.createConfusionMatrix(predictions, groundTruth)

    const benchmarkResult: BenchmarkResult = {
      algorithmName,
      metrics,
      confusionMatrix,
      executionTime,
      memoryUsage,
      throughput,
      timestamp: Date.now(),
    }

    this.benchmarkHistory.push(benchmarkResult)
    return benchmarkResult
  }

  // Create confusion matrix for binary classification (simplified)
  private createConfusionMatrix(
    predictions: ClassificationResult[],
    groundTruth: { label: "normal" | "suspicious" | "ddos"; timestamp: number }[],
  ): ConfusionMatrix {
    let tp = 0,
      tn = 0,
      fp = 0,
      fn = 0

    predictions.forEach((pred, index) => {
      if (index < groundTruth.length) {
        const actual = groundTruth[index].label
        const predicted = pred.prediction

        // Treat "normal" as negative, others as positive for binary classification
        const actualPositive = actual !== "normal"
        const predictedPositive = predicted !== "normal"

        if (actualPositive && predictedPositive) tp++
        else if (!actualPositive && !predictedPositive) tn++
        else if (!actualPositive && predictedPositive) fp++
        else if (actualPositive && !predictedPositive) fn++
      }
    })

    return {
      truePositive: tp,
      trueNegative: tn,
      falsePositive: fp,
      falseNegative: fn,
      total: predictions.length,
    }
  }

  // Monitor system performance
  recordSystemPerformance(): SystemPerformance {
    const performance: SystemPerformance = {
      cpuUsage: this.getCPUUsage(),
      memoryUsage: this.getMemoryUsage(),
      networkLatency: this.getNetworkLatency(),
      diskIO: this.getDiskIO(),
      processingSpeed: this.getProcessingSpeed(),
      timestamp: Date.now(),
    }

    this.systemMetrics.push(performance)

    // Keep only last 100 measurements
    if (this.systemMetrics.length > 100) {
      this.systemMetrics = this.systemMetrics.slice(-100)
    }

    return performance
  }

  // Generate comprehensive evaluation report
  generateEvaluationReport(): EvaluationReport {
    console.log("Generating comprehensive evaluation report")

    // Calculate overall metrics from benchmark history
    const overallMetrics = this.calculateOverallMetrics()

    // Get recent system performance
    const recentSystemPerformance = this.systemMetrics.slice(-20)

    // Calculate throughput analysis
    const throughputAnalysis = this.calculateThroughputAnalysis()

    // Generate recommendations
    const recommendations = this.generateRecommendations(overallMetrics, recentSystemPerformance)

    return {
      overallMetrics,
      algorithmComparison: [...this.benchmarkHistory],
      systemPerformance: recentSystemPerformance,
      detectionLatency: [...this.detectionLatencies.slice(-100)],
      throughputAnalysis,
      recommendations,
      timestamp: Date.now(),
    }
  }

  private calculateOverallMetrics(): PerformanceMetrics {
    if (this.benchmarkHistory.length === 0) {
      return {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        specificity: 0,
        sensitivity: 0,
        falsePositiveRate: 0,
        falseNegativeRate: 0,
        truePositiveRate: 0,
        trueNegativeRate: 0,
        matthewsCorrelationCoefficient: 0,
        areaUnderCurve: 0,
      }
    }

    const latest = this.benchmarkHistory[this.benchmarkHistory.length - 1]
    return latest.metrics
  }

  private calculateThroughputAnalysis() {
    const recentBenchmarks = this.benchmarkHistory.slice(-5)
    const avgThroughput = recentBenchmarks.reduce((sum, b) => sum + b.throughput, 0) / recentBenchmarks.length || 0
    const avgLatency =
      this.detectionLatencies.slice(-100).reduce((sum, l) => sum + l, 0) / this.detectionLatencies.length || 0

    return {
      packetsPerSecond: avgThroughput * 10, // Simulate packet processing rate
      classificationsPerSecond: avgThroughput,
      averageResponseTime: avgLatency,
    }
  }

  private generateRecommendations(metrics: PerformanceMetrics, systemPerformance: SystemPerformance[]): string[] {
    const recommendations: string[] = []

    // Performance-based recommendations
    if (metrics.accuracy < 0.9) {
      recommendations.push("Consider retraining the model with more diverse data to improve accuracy")
    }

    if (metrics.falsePositiveRate > 0.1) {
      recommendations.push("High false positive rate detected. Adjust classification thresholds to reduce false alarms")
    }

    if (metrics.recall < 0.85) {
      recommendations.push("Low recall indicates missed attacks. Consider feature engineering or ensemble methods")
    }

    // System performance recommendations
    const avgCPU = systemPerformance.reduce((sum, p) => sum + p.cpuUsage, 0) / systemPerformance.length
    const avgMemory = systemPerformance.reduce((sum, p) => sum + p.memoryUsage, 0) / systemPerformance.length

    if (avgCPU > 80) {
      recommendations.push("High CPU usage detected. Consider optimizing algorithms or scaling horizontally")
    }

    if (avgMemory > 85) {
      recommendations.push("High memory usage. Implement data streaming or increase system memory")
    }

    // Latency recommendations
    const avgLatency =
      this.detectionLatencies.slice(-50).reduce((sum, l) => sum + l, 0) / this.detectionLatencies.length
    if (avgLatency > 100) {
      recommendations.push("Detection latency is high. Consider model optimization or hardware acceleration")
    }

    if (recommendations.length === 0) {
      recommendations.push("System performance is optimal. Continue monitoring for any degradation")
    }

    return recommendations
  }

  // Simulated system metrics (in real implementation, these would use actual system APIs)
  private getCPUUsage(): number {
    return Math.random() * 40 + 30 // 30-70%
  }

  private getMemoryUsage(): number {
    return Math.random() * 30 + 40 // 40-70%
  }

  private getNetworkLatency(): number {
    return Math.random() * 20 + 5 // 5-25ms
  }

  private getDiskIO(): number {
    return Math.random() * 50 + 10 // 10-60 MB/s
  }

  private getProcessingSpeed(): number {
    return Math.random() * 500 + 1000 // 1000-1500 operations/sec
  }

  // Get benchmark history
  getBenchmarkHistory(): BenchmarkResult[] {
    return [...this.benchmarkHistory]
  }

  // Get system metrics history
  getSystemMetrics(): SystemPerformance[] {
    return [...this.systemMetrics]
  }

  // Get detection latency statistics
  getLatencyStatistics(): {
    min: number
    max: number
    average: number
    median: number
    p95: number
    p99: number
  } {
    const latencies = [...this.detectionLatencies].sort((a, b) => a - b)
    const length = latencies.length

    if (length === 0) {
      return { min: 0, max: 0, average: 0, median: 0, p95: 0, p99: 0 }
    }

    return {
      min: latencies[0],
      max: latencies[length - 1],
      average: latencies.reduce((sum, l) => sum + l, 0) / length,
      median: latencies[Math.floor(length / 2)],
      p95: latencies[Math.floor(length * 0.95)],
      p99: latencies[Math.floor(length * 0.99)],
    }
  }

  // Clear performance history
  clearHistory(): void {
    this.benchmarkHistory = []
    this.systemMetrics = []
    this.detectionLatencies = []
    console.log("Performance history cleared")
  }
}

// Singleton instance
export const performanceEvaluator = new PerformanceEvaluator()
