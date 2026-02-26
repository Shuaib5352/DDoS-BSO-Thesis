// Machine Learning Classification System for DDoS Detection
import type { ProcessedFeatures } from "./data-processor"

export interface ClassificationResult {
  prediction: "normal" | "suspicious" | "ddos"
  confidence: number
  probabilities: {
    normal: number
    suspicious: number
    ddos: number
  }
  features: ProcessedFeatures
  timestamp: number
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  falsePositiveRate: number
  falseNegativeRate: number
}

export interface TrainingData {
  features: number[]
  label: "normal" | "suspicious" | "ddos"
}

// Support Vector Machine Classifier (simplified implementation)
export class SVMClassifier {
  private weights: number[] = []
  private bias = 0
  private isTrained = false
  private supportVectors: number[][] = []
  private alpha: number[] = []
  private labels: number[] = []

  constructor(
    private kernel: "linear" | "rbf" = "rbf",
    private C = 1.0,
    private gamma = 0.1,
  ) {}

  // Simplified SVM training (in real implementation, use proper SVM library)
  train(trainingData: TrainingData[]): void {
    console.log("Training SVM classifier with", trainingData.length, "samples")

    // Convert labels to numeric format
    const numericData = trainingData.map((sample) => ({
      features: sample.features,
      label: sample.label === "normal" ? -1 : sample.label === "suspicious" ? 0 : 1,
    }))

    // Simplified training process (mock implementation)
    const featureCount = trainingData[0].features.length
    this.weights = Array(featureCount)
      .fill(0)
      .map(() => Math.random() * 0.1 - 0.05)
    this.bias = Math.random() * 0.1 - 0.05

    // Simulate iterative training
    for (let epoch = 0; epoch < 100; epoch++) {
      let totalLoss = 0

      numericData.forEach((sample, index) => {
        const prediction = this.internalPredict(sample.features)
        const error = sample.label - prediction

        // Update weights (simplified gradient descent)
        this.weights = this.weights.map((w, i) => w + 0.01 * error * sample.features[i])
        this.bias += 0.01 * error

        totalLoss += Math.abs(error)
      })

      if (totalLoss < 0.1) break // Early stopping
    }

    this.isTrained = true
    console.log("SVM training completed successfully")
  }

  private internalPredict(features: number[]): number {
    // Linear combination
    let score = this.bias
    for (let i = 0; i < features.length && i < this.weights.length; i++) {
      score += this.weights[i] * features[i]
    }

    // Apply kernel transformation for RBF
    if (this.kernel === "rbf") {
      score = Math.tanh(score * this.gamma)
    }

    return score
  }

  predict(features: number[]): number {
    if (!this.isTrained) {
      throw new Error("Model must be trained before prediction")
    }

    return this.internalPredict(features)
  }

  classify(features: ProcessedFeatures): ClassificationResult {
    const featureVector = this.extractFeatureVector(features)
    const rawScore = this.predict(featureVector)

    // Convert to probabilities using softmax-like function
    const normalScore = Math.exp(-Math.abs(rawScore + 1))
    const suspiciousScore = Math.exp(-Math.abs(rawScore))
    const ddosScore = Math.exp(-Math.abs(rawScore - 1))

    const total = normalScore + suspiciousScore + ddosScore
    const probabilities = {
      normal: normalScore / total,
      suspicious: suspiciousScore / total,
      ddos: ddosScore / total,
    }

    // Determine prediction based on highest probability
    let prediction: "normal" | "suspicious" | "ddos" = "normal"
    let confidence = probabilities.normal

    if (probabilities.suspicious > confidence) {
      prediction = "suspicious"
      confidence = probabilities.suspicious
    }
    if (probabilities.ddos > confidence) {
      prediction = "ddos"
      confidence = probabilities.ddos
    }

    return {
      prediction,
      confidence,
      probabilities,
      features,
      timestamp: Date.now(),
    }
  }

  private extractFeatureVector(features: ProcessedFeatures): number[] {
    return [
      features.packetRate / 1000, // Normalize packet rate
      features.avgPacketSize / 1500, // Normalize packet size
      features.entropyScore / 10, // Normalize entropy
      Object.keys(features.protocolDistribution).length / 10, // Protocol diversity
      Object.keys(features.flagFrequency).length / 10, // Flag diversity
      Math.log(features.packetRate + 1) / 10, // Log packet rate
      features.avgPacketSize > 1000 ? 1 : 0, // Large packet indicator
      features.entropyScore < 2 ? 1 : 0, // Low entropy indicator
      features.packetRate > 500 ? 1 : 0, // High rate indicator
      Object.values(features.protocolDistribution).reduce((a, b) => Math.max(a, b), 0) / features.packetRate, // Dominant protocol ratio
    ]
  }

  getModelInfo(): { type: string; parameters: any; trained: boolean } {
    return {
      type: "SVM",
      parameters: {
        kernel: this.kernel,
        C: this.C,
        gamma: this.gamma,
        featureCount: this.weights.length,
      },
      trained: this.isTrained,
    }
  }
}

// Random Forest Classifier (simplified implementation)
export class RandomForestClassifier {
  private trees: DecisionTree[] = []
  private isTrained = false

  constructor(
    private nTrees = 10,
    private maxDepth = 5,
    private minSamples = 2,
  ) {}

  train(trainingData: TrainingData[]): void {
    console.log("Training Random Forest with", this.nTrees, "trees")

    this.trees = []

    for (let i = 0; i < this.nTrees; i++) {
      // Bootstrap sampling
      const bootstrapSample = this.bootstrapSample(trainingData)

      // Create and train decision tree
      const tree = new DecisionTree(this.maxDepth, this.minSamples)
      tree.train(bootstrapSample)
      this.trees.push(tree)
    }

    this.isTrained = true
    console.log("Random Forest training completed")
  }

  private bootstrapSample(data: TrainingData[]): TrainingData[] {
    const sample: TrainingData[] = []
    for (let i = 0; i < data.length; i++) {
      const randomIndex = Math.floor(Math.random() * data.length)
      sample.push(data[randomIndex])
    }
    return sample
  }

  classify(features: ProcessedFeatures): ClassificationResult {
    if (!this.isTrained) {
      throw new Error("Model must be trained before prediction")
    }

    const featureVector = this.extractFeatureVector(features)

    // Get predictions from all trees
    const predictions = this.trees.map((tree) => tree.predict(featureVector))

    // Count votes
    const votes = { normal: 0, suspicious: 0, ddos: 0 }
    predictions.forEach((pred) => {
      votes[pred as keyof typeof votes]++
    })

    // Calculate probabilities
    const total = this.trees.length
    const probabilities = {
      normal: votes.normal / total,
      suspicious: votes.suspicious / total,
      ddos: votes.ddos / total,
    }

    // Determine final prediction
    let prediction: "normal" | "suspicious" | "ddos" = "normal"
    let confidence = probabilities.normal

    if (probabilities.suspicious > confidence) {
      prediction = "suspicious"
      confidence = probabilities.suspicious
    }
    if (probabilities.ddos > confidence) {
      prediction = "ddos"
      confidence = probabilities.ddos
    }

    return {
      prediction,
      confidence,
      probabilities,
      features,
      timestamp: Date.now(),
    }
  }

  private extractFeatureVector(features: ProcessedFeatures): number[] {
    return [
      features.packetRate,
      features.avgPacketSize,
      features.entropyScore,
      Object.keys(features.protocolDistribution).length,
      Object.keys(features.flagFrequency).length,
      features.packetRate > 100 ? 1 : 0,
      features.avgPacketSize > 800 ? 1 : 0,
      features.entropyScore < 3 ? 1 : 0,
    ]
  }

  getModelInfo(): { type: string; parameters: any; trained: boolean } {
    return {
      type: "Random Forest",
      parameters: {
        nTrees: this.nTrees,
        maxDepth: this.maxDepth,
        minSamples: this.minSamples,
      },
      trained: this.isTrained,
    }
  }
}

// Simple Decision Tree for Random Forest
class DecisionTree {
  private root: TreeNode | null = null

  constructor(
    private maxDepth: number,
    private minSamples: number,
  ) {}

  train(data: TrainingData[]): void {
    this.root = this.buildTree(data, 0)
  }

  private buildTree(data: TrainingData[], depth: number): TreeNode {
    // Check stopping criteria
    if (depth >= this.maxDepth || data.length < this.minSamples || this.isPure(data)) {
      return new TreeNode(this.getMajorityClass(data))
    }

    // Find best split
    const bestSplit = this.findBestSplit(data)
    if (!bestSplit) {
      return new TreeNode(this.getMajorityClass(data))
    }

    // Split data
    const leftData = data.filter((sample) => sample.features[bestSplit.featureIndex] <= bestSplit.threshold)
    const rightData = data.filter((sample) => sample.features[bestSplit.featureIndex] > bestSplit.threshold)

    // Create node
    const node = new TreeNode()
    node.featureIndex = bestSplit.featureIndex
    node.threshold = bestSplit.threshold
    node.left = this.buildTree(leftData, depth + 1)
    node.right = this.buildTree(rightData, depth + 1)

    return node
  }

  private isPure(data: TrainingData[]): boolean {
    if (data.length === 0) return true
    const firstLabel = data[0].label
    return data.every((sample) => sample.label === firstLabel)
  }

  private getMajorityClass(data: TrainingData[]): string {
    const counts = { normal: 0, suspicious: 0, ddos: 0 }
    data.forEach((sample) => {
      counts[sample.label as keyof typeof counts]++
    })

    return Object.entries(counts).reduce((a, b) =>
      counts[a[0] as keyof typeof counts] > counts[b[0] as keyof typeof counts] ? a : b,
    )[0]
  }

  private findBestSplit(data: TrainingData[]): { featureIndex: number; threshold: number } | null {
    let bestGini = Number.POSITIVE_INFINITY
    let bestSplit = null

    const featureCount = data[0].features.length

    for (let featureIndex = 0; featureIndex < featureCount; featureIndex++) {
      const values = data.map((sample) => sample.features[featureIndex]).sort((a, b) => a - b)

      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2
        const gini = this.calculateGini(data, featureIndex, threshold)

        if (gini < bestGini) {
          bestGini = gini
          bestSplit = { featureIndex, threshold }
        }
      }
    }

    return bestSplit
  }

  private calculateGini(data: TrainingData[], featureIndex: number, threshold: number): number {
    const leftData = data.filter((sample) => sample.features[featureIndex] <= threshold)
    const rightData = data.filter((sample) => sample.features[featureIndex] > threshold)

    const totalSize = data.length
    const leftSize = leftData.length
    const rightSize = rightData.length

    if (leftSize === 0 || rightSize === 0) return Number.POSITIVE_INFINITY

    const leftGini = this.giniImpurity(leftData)
    const rightGini = this.giniImpurity(rightData)

    return (leftSize / totalSize) * leftGini + (rightSize / totalSize) * rightGini
  }

  private giniImpurity(data: TrainingData[]): number {
    if (data.length === 0) return 0

    const counts = { normal: 0, suspicious: 0, ddos: 0 }
    data.forEach((sample) => {
      counts[sample.label as keyof typeof counts]++
    })

    const total = data.length
    let gini = 1

    Object.values(counts).forEach((count) => {
      const probability = count / total
      gini -= probability * probability
    })

    return gini
  }

  predict(features: number[]): string {
    if (!this.root) return "normal"
    return this.traverseTree(this.root, features)
  }

  private traverseTree(node: TreeNode, features: number[]): string {
    if (node.isLeaf()) {
      return node.prediction!
    }

    if (features[node.featureIndex!] <= node.threshold!) {
      return this.traverseTree(node.left!, features)
    } else {
      return this.traverseTree(node.right!, features)
    }
  }
}

class TreeNode {
  featureIndex?: number
  threshold?: number
  prediction?: string
  left?: TreeNode
  right?: TreeNode

  constructor(prediction?: string) {
    this.prediction = prediction
  }

  isLeaf(): boolean {
    return this.prediction !== undefined
  }
}

// Hybrid BSO-Enhanced Classifier
export class HybridBSOClassifier {
  private svmClassifier: SVMClassifier
  private rfClassifier: RandomForestClassifier
  private isTrained = false
  private bsoWeights: number[] = [0.6, 0.4] // SVM weight, RF weight

  constructor() {
    this.svmClassifier = new SVMClassifier("rbf", 1.0, 0.1)
    this.rfClassifier = new RandomForestClassifier(15, 6, 3)
  }

  train(trainingData: TrainingData[]): void {
    console.log("Training Hybrid BSO-Enhanced Classifier")

    if (!trainingData || trainingData.length === 0) {
      throw new Error("Training data is required")
    }

    try {
      // Train both base classifiers
      this.svmClassifier.train(trainingData)
      this.rfClassifier.train(trainingData)

      this.isTrained = true
      console.log("Hybrid classifier training completed successfully")
    } catch (error) {
      console.error("Training failed:", error)
      this.isTrained = false
      throw error
    }
  }

  setBSOWeights(weights: number[]): void {
    if (weights.length === 2 && Math.abs(weights[0] + weights[1] - 1.0) < 0.001) {
      this.bsoWeights = weights
      console.log("BSO weights updated:", weights)
    }
  }

  classify(features: ProcessedFeatures): ClassificationResult {
    if (!this.isTrained) {
      throw new Error("Model must be trained before prediction")
    }

    // Get predictions from both classifiers
    const svmResult = this.svmClassifier.classify(features)
    const rfResult = this.rfClassifier.classify(features)

    // Combine predictions using BSO-optimized weights
    const combinedProbs = {
      normal: this.bsoWeights[0] * svmResult.probabilities.normal + this.bsoWeights[1] * rfResult.probabilities.normal,
      suspicious:
        this.bsoWeights[0] * svmResult.probabilities.suspicious +
        this.bsoWeights[1] * rfResult.probabilities.suspicious,
      ddos: this.bsoWeights[0] * svmResult.probabilities.ddos + this.bsoWeights[1] * rfResult.probabilities.ddos,
    }

    // Determine final prediction
    let prediction: "normal" | "suspicious" | "ddos" = "normal"
    let confidence = combinedProbs.normal

    if (combinedProbs.suspicious > confidence) {
      prediction = "suspicious"
      confidence = combinedProbs.suspicious
    }
    if (combinedProbs.ddos > confidence) {
      prediction = "ddos"
      confidence = combinedProbs.ddos
    }

    return {
      prediction,
      confidence,
      probabilities: combinedProbs,
      features,
      timestamp: Date.now(),
    }
  }

  getModelInfo(): { type: string; components: any[]; trained: boolean } {
    return {
      type: "Hybrid BSO-Enhanced",
      components: [this.svmClassifier.getModelInfo(), this.rfClassifier.getModelInfo()],
      trained: this.isTrained,
    }
  }

  evaluateModel(testData: TrainingData[]): ModelMetrics {
    let correct = 0
    const truePositives = { normal: 0, suspicious: 0, ddos: 0 }
    const falsePositives = { normal: 0, suspicious: 0, ddos: 0 }
    const falseNegatives = { normal: 0, suspicious: 0, ddos: 0 }

    testData.forEach((sample) => {
      const mockFeatures: ProcessedFeatures = {
        packetRate: sample.features[0] || 0,
        avgPacketSize: sample.features[1] || 0,
        entropyScore: sample.features[2] || 0,
        protocolDistribution: {},
        flagFrequency: {},
      }

      const result = this.classify(mockFeatures)

      if (result.prediction === sample.label) {
        correct++
        truePositives[sample.label as keyof typeof truePositives]++
      } else {
        falsePositives[result.prediction as keyof typeof falsePositives]++
        falseNegatives[sample.label as keyof typeof falseNegatives]++
      }
    })

    const accuracy = correct / testData.length
    const totalTP = Object.values(truePositives).reduce((a, b) => a + b, 0)
    const totalFP = Object.values(falsePositives).reduce((a, b) => a + b, 0)
    const totalFN = Object.values(falseNegatives).reduce((a, b) => a + b, 0)

    const precision = totalTP / (totalTP + totalFP) || 0
    const recall = totalTP / (totalTP + totalFN) || 0
    const f1Score = (2 * (precision * recall)) / (precision + recall) || 0

    return {
      accuracy,
      precision,
      recall,
      f1Score,
      falsePositiveRate: totalFP / (totalFP + totalTP) || 0,
      falseNegativeRate: totalFN / (totalFN + totalTP) || 0,
    }
  }
}
