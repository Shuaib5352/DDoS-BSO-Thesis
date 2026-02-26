"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Brain, Zap, Target } from "lucide-react"
import {
  HybridBSOClassifier,
  SVMClassifier,
  RandomForestClassifier,
  type TrainingData,
  type ClassificationResult,
} from "@/lib/ml-classifier"
import { DataProcessor } from "@/lib/data-processor"
import { useTranslation } from "@/hooks/use-translation"

interface MLClassificationPanelProps {
  onClassificationResult?: (result: ClassificationResult) => void
}

export default function MLClassificationPanel({ onClassificationResult }: MLClassificationPanelProps) {
  const { t } = useTranslation()

  const [hybridClassifier, setHybridClassifier] = useState<HybridBSOClassifier | null>(null)
  const [svmClassifier, setSvmClassifier] = useState<SVMClassifier | null>(null)
  const [rfClassifier, setRfClassifier] = useState<RandomForestClassifier | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [modelMetrics, setModelMetrics] = useState<any>(null)
  const [realtimeResults, setRealtimeResults] = useState<ClassificationResult[]>([])
  const [currentPrediction, setCurrentPrediction] = useState<ClassificationResult | null>(null)
  const [isModelTrained, setIsModelTrained] = useState(false)
  const [classificationInterval, setClassificationInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    initializeClassifiers()
  }, [])

  useEffect(() => {
    return () => {
      if (classificationInterval) {
        clearInterval(classificationInterval)
      }
    }
  }, [classificationInterval])

  const initializeClassifiers = () => {
    setHybridClassifier(new HybridBSOClassifier())
    setSvmClassifier(new SVMClassifier("rbf", 1.0, 0.1))
    setRfClassifier(new RandomForestClassifier(15, 6, 3))
  }

  const generateTrainingData = (): TrainingData[] => {
    const data: TrainingData[] = []

    // Generate normal traffic samples
    for (let i = 0; i < 300; i++) {
      data.push({
        features: [
          Math.random() * 100 + 50, // Normal packet rate
          Math.random() * 500 + 200, // Normal packet size
          Math.random() * 3 + 4, // Normal entropy
          Math.random() * 0.3, // Low protocol diversity
          Math.random() * 0.2, // Low flag diversity
          0, // Not high rate
          0, // Not large packets
          0, // Not low entropy
        ],
        label: "normal",
      })
    }

    // Generate suspicious activity samples
    for (let i = 0; i < 150; i++) {
      data.push({
        features: [
          Math.random() * 200 + 100, // Elevated packet rate
          Math.random() * 800 + 300, // Varied packet size
          Math.random() * 2 + 2, // Lower entropy
          Math.random() * 0.5 + 0.3, // Medium protocol diversity
          Math.random() * 0.4 + 0.2, // Medium flag diversity
          Math.random() > 0.5 ? 1 : 0, // Sometimes high rate
          Math.random() > 0.7 ? 1 : 0, // Sometimes large packets
          Math.random() > 0.6 ? 1 : 0, // Sometimes low entropy
        ],
        label: "suspicious",
      })
    }

    // Generate DDoS attack samples
    for (let i = 0; i < 100; i++) {
      data.push({
        features: [
          Math.random() * 500 + 300, // High packet rate
          Math.random() * 200 + 64, // Small packet size (typical for DDoS)
          Math.random() * 1.5 + 0.5, // Very low entropy
          Math.random() * 0.2, // Low protocol diversity
          Math.random() * 0.8 + 0.2, // High flag diversity
          1, // High rate indicator
          0, // Not large packets
          1, // Low entropy indicator
        ],
        label: "ddos",
      })
    }

    return data.sort(() => Math.random() - 0.5) // Shuffle
  }

  const trainModels = async () => {
    if (!hybridClassifier || !svmClassifier || !rfClassifier) return false

    setIsTraining(true)
    setTrainingProgress(0)
    setIsModelTrained(false)

    try {
      const trainingData = generateTrainingData()

      // Train SVM
      setTrainingProgress(25)
      svmClassifier.train(trainingData)

      // Train Random Forest
      setTrainingProgress(50)
      rfClassifier.train(trainingData)

      // Train Hybrid Classifier
      setTrainingProgress(75)
      hybridClassifier.train(trainingData)

      // Evaluate models
      setTrainingProgress(90)
      const testData = generateTrainingData().slice(0, 100)
      const metrics = hybridClassifier.evaluateModel(testData)
      setModelMetrics(metrics)

      setTrainingProgress(100)
      setIsModelTrained(true)
      return true
    } catch (error) {
      console.error("Training error:", error)
      setIsModelTrained(false)
      return false
    } finally {
      setIsTraining(false)
    }
  }

  const startRealtimeClassification = async () => {
    if (!hybridClassifier) return

    let trainingSuccess = isModelTrained
    if (!isModelTrained) {
      trainingSuccess = await trainModels()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    if (!trainingSuccess) {
      console.error("Cannot start classification: Model training failed")
      return
    }

    setIsClassifying(true)
    setRealtimeResults([])

    const interval = setInterval(async () => {
      try {
        if (!hybridClassifier) {
          return
        }

        const mockPackets = await DataProcessor.loadTONIoTDataset()
        const features = DataProcessor.extractFeatures(mockPackets.slice(0, 50))

        const result = hybridClassifier.classify(features)
        console.log("Classification result:", JSON.stringify(result))
        setCurrentPrediction(result)

        setRealtimeResults((prev) => {
          const newResults = [...prev, result].slice(-20)
          return newResults
        })

        if (onClassificationResult) {
          onClassificationResult(result)
        }
      } catch (error) {
        console.error("Classification error:", error)
      }
    }, 2000)

    setClassificationInterval(interval)

    setTimeout(() => {
      clearInterval(interval)
      setClassificationInterval(null)
      setIsClassifying(false)
    }, 30000)
  }

  const stopRealtimeClassification = () => {
    if (classificationInterval) {
      clearInterval(classificationInterval)
      setClassificationInterval(null)
    }
    setIsClassifying(false)
  }

  const threatLevelColor = (prediction: string) => {
    switch (prediction) {
      case "normal":
        return "var(--color-chart-1)"
      case "suspicious":
        return "var(--color-chart-2)"
      case "ddos":
        return "var(--color-chart-3)"
      default:
        return "var(--color-muted)"
    }
  }

  const classificationHistory = realtimeResults.map((result, index) => ({
    time: index,
    normal: result.probabilities.normal * 100,
    suspicious: result.probabilities.suspicious * 100,
    ddos: result.probabilities.ddos * 100,
    prediction: result.prediction,
  }))

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            {t("mlClassificationSystem")}
          </CardTitle>
          <CardDescription>{t("hybridBsoClassifier")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={trainModels} disabled={isTraining}>
              <Target className="w-4 h-4 mr-2" />
              {isTraining ? t("loading") : t("trainModel")}
            </Button>
            <Button
              onClick={isClassifying ? stopRealtimeClassification : startRealtimeClassification}
              disabled={isTraining}
              variant={isClassifying ? "destructive" : "default"}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isClassifying ? t("stop") : t("classifyTraffic")}
            </Button>
            {isModelTrained && !isTraining && (
              <Badge variant="default" className="ml-2">
                {t("modelTrained")}
              </Badge>
            )}
          </div>

          {isTraining && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("loading")}</span>
                <span>{trainingProgress}%</span>
              </div>
              <Progress value={trainingProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="realtime">{t("realTimeMonitoring")}</TabsTrigger>
          <TabsTrigger value="performance">{t("performanceAnalysis")}</TabsTrigger>
          <TabsTrigger value="comparison">{t("algorithmComparison")}</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Prediction */}
            <Card>
              <CardHeader>
                <CardTitle>{t("currentPrediction")}</CardTitle>
                <CardDescription>{t("latestClassificationResult")}</CardDescription>
              </CardHeader>
              <CardContent>
                {currentPrediction ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div
                        className="text-3xl font-bold mb-2"
                        style={{ color: threatLevelColor(currentPrediction.prediction) }}
                      >
                        {currentPrediction.prediction.toUpperCase()}
                      </div>
                      <Badge variant={currentPrediction.prediction === "normal" ? "default" : "destructive"}>
                        {t("confidence")}: {(currentPrediction.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t("normalTraffic")}</span>
                        <span>{(currentPrediction.probabilities.normal * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={currentPrediction.probabilities.normal * 100} />

                      <div className="flex justify-between">
                        <span>{t("suspiciousActivity")}</span>
                        <span>{(currentPrediction.probabilities.suspicious * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={currentPrediction.probabilities.suspicious * 100} />

                      <div className="flex justify-between">
                        <span>{t("ddosAttacks")}</span>
                        <span>{(currentPrediction.probabilities.ddos * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={currentPrediction.probabilities.ddos * 100} />
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    {t("startClassificationToSeeResults")}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Classification History */}
            <Card>
              <CardHeader>
                <CardTitle>{t("classificationTimeline")}</CardTitle>
                <CardDescription>{t("realtimePredictionProbabilities")}</CardDescription>
              </CardHeader>
              <CardContent>
                {classificationHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={classificationHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="normal"
                        stroke="var(--color-chart-1)"
                        name={`${t("normalTraffic")} %`}
                      />
                      <Line
                        type="monotone"
                        dataKey="suspicious"
                        stroke="var(--color-chart-2)"
                        name={`${t("suspiciousActivity")} %`}
                      />
                      <Line
                        type="monotone"
                        dataKey="ddos"
                        stroke="var(--color-chart-3)"
                        name={`${t("ddosAttacks")} %`}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {t("noClassificationDataYet")}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>{t("performanceMetrics")}</CardTitle>
                <CardDescription>{t("hybridBsoClassifierResults")}</CardDescription>
              </CardHeader>
              <CardContent>
                {modelMetrics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">{t("accuracy")}</span>
                        <div className="text-2xl font-bold">{(modelMetrics.accuracy * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t("f1Score")}</span>
                        <div className="text-2xl font-bold">{(modelMetrics.f1Score * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t("precision")}</span>
                        <div className="text-xl font-semibold">{(modelMetrics.precision * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">{t("recall")}</span>
                        <div className="text-xl font-semibold">{(modelMetrics.recall * 100).toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t("falsePositiveRate")}</span>
                        <span>{(modelMetrics.falsePositiveRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("falseNegativeRate")}</span>
                        <span>{(modelMetrics.falseNegativeRate * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    {t("trainModelsToSeeMetrics")}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Threat Detection Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{t("detectionDistribution")}</CardTitle>
                <CardDescription>{t("classificationResultsBreakdown")}</CardDescription>
              </CardHeader>
              <CardContent>
                {realtimeResults.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: t("normalTraffic"),
                            value: realtimeResults.filter((r) => r.prediction === "normal").length,
                            color: "var(--color-chart-1)",
                          },
                          {
                            name: t("suspiciousActivity"),
                            value: realtimeResults.filter((r) => r.prediction === "suspicious").length,
                            color: "var(--color-chart-2)",
                          },
                          {
                            name: t("ddosAttacks"),
                            value: realtimeResults.filter((r) => r.prediction === "ddos").length,
                            color: "var(--color-chart-3)",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[0, 1, 2].map((index) => (
                          <Cell key={`cell-${index}`} fill={`var(--color-chart-${index + 1})`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    {t("noDetectionDataAvailable")}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("algorithmComparison")}</CardTitle>
              <CardDescription>{t("performanceComparisonOfDifferentML")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={[
                    { name: "XGBoost", accuracy: 90.37, precision: 90.83, recall: 90.37, f1: 84.74 },
                    { name: "BSO-Hibrit RF", accuracy: 89.82, precision: 90.19, recall: 89.82, f1: 84.24 },
                    { name: "Random Forest", accuracy: 89.74, precision: 90.14, recall: 89.74, f1: 83.06 },
                    { name: "GA-RF", accuracy: 89.60, precision: 90.01, recall: 89.60, f1: 83.66 },
                    { name: "Karar Ağacı", accuracy: 86.20, precision: 87.02, recall: 86.20, f1: 80.62 },
                    { name: "SVM (Doğrusal)", accuracy: 82.02, precision: 83.67, recall: 82.02, f1: 72.83 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="var(--color-chart-1)" name={`${t("accuracy")} %`} />
                  <Bar dataKey="precision" fill="var(--color-chart-2)" name={`${t("precision")} %`} />
                  <Bar dataKey="recall" fill="var(--color-chart-3)" name={`${t("recall")} %`} />
                  <Bar dataKey="f1" fill="var(--color-chart-4)" name={`${t("f1Score")} %`} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
