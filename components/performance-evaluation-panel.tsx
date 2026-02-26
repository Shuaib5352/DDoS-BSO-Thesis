"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  Clock,
  Cpu,
  MemoryStick,
  Zap,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Activity,
} from "lucide-react"
import {
  performanceEvaluator,
  type EvaluationReport,
  type BenchmarkResult,
  type SystemPerformance,
} from "@/lib/performance-evaluator"
import { HybridBSOClassifier } from "@/lib/ml-classifier"
import { DataProcessor } from "@/lib/data-processor"

export default function PerformanceEvaluationPanel() {
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [systemMetrics, setSystemMetrics] = useState<SystemPerformance[]>([])
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([])
  const [latencyStats, setLatencyStats] = useState<any>(null)

  useEffect(() => {
    // Start system monitoring
    const interval = setInterval(() => {
      const metrics = performanceEvaluator.recordSystemPerformance()
      setSystemMetrics((prev) => [...prev.slice(-19), metrics]) // Keep last 20 measurements

      const stats = performanceEvaluator.getLatencyStatistics()
      setLatencyStats(stats)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const runComprehensiveEvaluation = async () => {
    setIsEvaluating(true)

    try {
      console.log("Starting comprehensive performance evaluation")

      // Generate test data
      const testData = []
      for (let i = 0; i < 100; i++) {
        const packets = await DataProcessor.loadTONIoTDataset()
        const features = DataProcessor.extractFeatures(packets.slice(0, 10))
        const label = Math.random() > 0.8 ? (Math.random() > 0.5 ? "ddos" : "suspicious") : "normal"
        testData.push({ features, label: label as "normal" | "suspicious" | "ddos" })
      }

      // Benchmark different algorithms
      const classifier = new HybridBSOClassifier()

      // Simulate training
      const trainingData = testData.slice(0, 80).map((item) => ({
        features: [
          item.features.packetRate,
          item.features.avgPacketSize,
          item.features.entropyScore,
          Object.keys(item.features.protocolDistribution).length,
          Object.keys(item.features.flagFrequency).length,
          0,
          0,
          0,
        ],
        label: item.label,
      }))

      classifier.train(trainingData)

      // Benchmark the classifier
      const benchmarkResult = await performanceEvaluator.benchmarkAlgorithm(
        "Hybrid BSO-Enhanced",
        async (features) => classifier.classify(features),
        testData.slice(80), // Use last 20 for testing
      )

      setBenchmarkResults((prev) => [...prev, benchmarkResult])

      // Generate comprehensive report
      const report = performanceEvaluator.generateEvaluationReport()
      setEvaluationReport(report)

      console.log("Performance evaluation completed")
    } catch (error) {
      console.error("Performance evaluation failed:", error)
    } finally {
      setIsEvaluating(false)
    }
  }

  const clearEvaluationHistory = () => {
    performanceEvaluator.clearHistory()
    setBenchmarkResults([])
    setEvaluationReport(null)
    setSystemMetrics([])
    console.log("Evaluation history cleared")
  }

  const getPerformanceColor = (value: number, threshold: { good: number; warning: number }) => {
    if (value >= threshold.good) return "text-green-600"
    if (value >= threshold.warning) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (value: number, threshold: { good: number; warning: number }) => {
    if (value >= threshold.good) return "default"
    if (value >= threshold.warning) return "secondary"
    return "destructive"
  }

  // Prepare radar chart data for metrics comparison
  const radarData = evaluationReport
    ? [
      {
        metric: "Doğruluk",
        value: evaluationReport.overallMetrics.accuracy * 100,
        fullMark: 100,
      },
      {
        metric: "Kesinlik",
        value: evaluationReport.overallMetrics.precision * 100,
        fullMark: 100,
      },
      {
        metric: "Duyarlılık",
        value: evaluationReport.overallMetrics.recall * 100,
        fullMark: 100,
      },
      {
        metric: "F1 Skoru",
        value: evaluationReport.overallMetrics.f1Score * 100,
        fullMark: 100,
      },
      {
        metric: "Özgüllük",
        value: evaluationReport.overallMetrics.specificity * 100,
        fullMark: 100,
      },
    ]
    : []

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performans Değerlendirme Sistemi
          </CardTitle>
          <CardDescription>DDoS tespit sistemi performansı ve verimliliğinin kapsamlı analizi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={runComprehensiveEvaluation} disabled={isEvaluating}>
              <Target className="w-4 h-4 mr-2" />
              {isEvaluating ? "Değerlendiriliyor..." : "Kapsamlı Değerlendirmeyi Çalıştır"}
            </Button>
            <Button variant="outline" onClick={clearEvaluationHistory}>
              Geçmişi Temizle
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>Gerçek zamanlı izleme aktif</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Performans Genel Bakışı</TabsTrigger>
          <TabsTrigger value="metrics">Detaylı Metrikler</TabsTrigger>
          <TabsTrigger value="system">Sistem Performansı</TabsTrigger>
          <TabsTrigger value="latency">Gecikme Analizi</TabsTrigger>
          <TabsTrigger value="recommendations">Öneriler</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Key Performance Indicators */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Genel Doğruluk</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${evaluationReport ? getPerformanceColor(evaluationReport.overallMetrics.accuracy * 100, { good: 90, warning: 80 }) : ""}`}
                >
                  {evaluationReport ? (evaluationReport.overallMetrics.accuracy * 100).toFixed(1) : "0.0"}%
                </div>
                <p className="text-xs text-muted-foreground">Tespit doğruluğu</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ort. Yanıt Süresi</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latencyStats ? latencyStats.average.toFixed(1) : "0.0"}ms</div>
                <p className="text-xs text-muted-foreground">Tespit gecikmesi</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">İşlem Hacmi</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {evaluationReport ? evaluationReport.throughputAnalysis.classificationsPerSecond.toFixed(0) : "0"}
                </div>
                <p className="text-xs text-muted-foreground">Sınıflandırma/sn</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Yanlış Pozitif Oranı</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${evaluationReport ? getPerformanceColor(100 - evaluationReport.overallMetrics.falsePositiveRate * 100, { good: 95, warning: 90 }) : ""}`}
                >
                  {evaluationReport ? (evaluationReport.overallMetrics.falsePositiveRate * 100).toFixed(2) : "0.00"}%
                </div>
                <p className="text-xs text-muted-foreground">Yanlış alarmlar</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Radar Chart */}
          {evaluationReport && (
            <Card>
              <CardHeader>
                <CardTitle>Performans Metrikleri Genel Bakışı</CardTitle>
                <CardDescription>Çok boyutlu performans analizi</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Performans"
                      dataKey="value"
                      stroke="var(--color-chart-1)"
                      fill="var(--color-chart-1)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {evaluationReport ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Detailed Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Sınıflandırma Metrikleri</CardTitle>
                  <CardDescription>Detaylı performans dökümü</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Kesinlik</span>
                      <div className="text-xl font-bold">
                        {(evaluationReport.overallMetrics.precision * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Duyarlılık</span>
                      <div className="text-xl font-bold">
                        {(evaluationReport.overallMetrics.recall * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">F1 Skoru</span>
                      <div className="text-xl font-bold">
                        {(evaluationReport.overallMetrics.f1Score * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Özgüllük</span>
                      <div className="text-xl font-bold">
                        {(evaluationReport.overallMetrics.specificity * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Doğru Pozitif Oranı</span>
                      <span>{(evaluationReport.overallMetrics.truePositiveRate * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={evaluationReport.overallMetrics.truePositiveRate * 100} />

                    <div className="flex justify-between">
                      <span>Doğru Negatif Oranı</span>
                      <span>{(evaluationReport.overallMetrics.trueNegativeRate * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={evaluationReport.overallMetrics.trueNegativeRate * 100} />
                  </div>
                </CardContent>
              </Card>

              {/* Algorithm Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Algoritma Performansı</CardTitle>
                  <CardDescription>Kıyaslama sonuçları karşılaştırması</CardDescription>
                </CardHeader>
                <CardContent>
                  {benchmarkResults.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={benchmarkResults.map((result) => ({
                          name: result.algorithmName,
                          accuracy: result.metrics.accuracy * 100,
                          precision: result.metrics.precision * 100,
                          recall: result.metrics.recall * 100,
                          throughput: result.throughput,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="accuracy" fill="var(--color-chart-1)" name="Doğruluk %" />
                        <Bar dataKey="precision" fill="var(--color-chart-2)" name="Kesinlik %" />
                        <Bar dataKey="recall" fill="var(--color-chart-3)" name="Duyarlılık %" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Kıyaslama sonuçlarını görmek için değerlendirmeyi çalıştırın
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Detaylı metrikleri görmek için kapsamlı değerlendirmeyi çalıştırın</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Resource Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Sistem Kaynak Kullanımı</CardTitle>
                <CardDescription>Gerçek zamanlı sistem performans izleme</CardDescription>
              </CardHeader>
              <CardContent>
                {systemMetrics.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={systemMetrics.map((metric, index) => ({
                        time: index,
                        cpu: metric.cpuUsage,
                        memory: metric.memoryUsage,
                        network: metric.networkLatency,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        stackId="1"
                        stroke="var(--color-chart-1)"
                        fill="var(--color-chart-1)"
                        name="CPU %"
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        stackId="2"
                        stroke="var(--color-chart-2)"
                        fill="var(--color-chart-2)"
                        name="Bellek %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Sistem metrikleri toplanıyor...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current System Status */}
            <Card>
              <CardHeader>
                <CardTitle>Mevcut Sistem Durumu</CardTitle>
                <CardDescription>Canlı sistem performans göstergeleri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemMetrics.length > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        <span>CPU Kullanımı</span>
                      </div>
                      <Badge
                        variant={getPerformanceBadge(100 - systemMetrics[systemMetrics.length - 1].cpuUsage, {
                          good: 50,
                          warning: 30,
                        })}
                      >
                        {systemMetrics[systemMetrics.length - 1].cpuUsage.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={systemMetrics[systemMetrics.length - 1].cpuUsage} />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MemoryStick className="w-4 h-4" />
                        <span>Bellek Kullanımı</span>
                      </div>
                      <Badge
                        variant={getPerformanceBadge(100 - systemMetrics[systemMetrics.length - 1].memoryUsage, {
                          good: 50,
                          warning: 30,
                        })}
                      >
                        {systemMetrics[systemMetrics.length - 1].memoryUsage.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={systemMetrics[systemMetrics.length - 1].memoryUsage} />

                    <div className="flex items-center justify-between">
                      <span>Ağ Gecikmesi</span>
                      <span>{systemMetrics[systemMetrics.length - 1].networkLatency.toFixed(1)}ms</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>İşlem Hızı</span>
                      <span>{systemMetrics[systemMetrics.length - 1].processingSpeed.toFixed(0)} ops/sec</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="latency" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Latency Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Gecikme İstatistikleri</CardTitle>
                <CardDescription>Tespit yanıt süresi analizi</CardDescription>
              </CardHeader>
              <CardContent>
                {latencyStats ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Ortalama</span>
                        <div className="text-xl font-bold">{latencyStats.average.toFixed(2)}ms</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Medyan</span>
                        <div className="text-xl font-bold">{latencyStats.median.toFixed(2)}ms</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">95. Yüzdelik</span>
                        <div className="text-xl font-bold">{latencyStats.p95.toFixed(2)}ms</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">99. Yüzdelik</span>
                        <div className="text-xl font-bold">{latencyStats.p99.toFixed(2)}ms</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Min Gecikme</span>
                        <span>{latencyStats.min.toFixed(2)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maks Gecikme</span>
                        <span>{latencyStats.max.toFixed(2)}ms</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    Gecikme verisi mevcut değil
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Throughput Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>İşlem Hacmi Analizi</CardTitle>
                <CardDescription>Sistem işleme kapasitesi</CardDescription>
              </CardHeader>
              <CardContent>
                {evaluationReport ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Saniyedeki Sınıflandırma</span>
                      <div className="text-2xl font-bold">
                        {evaluationReport.throughputAnalysis.classificationsPerSecond.toFixed(0)}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Saniyedeki Paket</span>
                      <div className="text-2xl font-bold">
                        {evaluationReport.throughputAnalysis.packetsPerSecond.toFixed(0)}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Ortalama Yanıt Süresi</span>
                      <div className="text-xl font-bold">
                        {evaluationReport.throughputAnalysis.averageResponseTime.toFixed(2)}ms
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    İşlem hacmi analizini görmek için değerlendirmeyi çalıştırın
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performans Önerileri</CardTitle>
              <CardDescription>Sistem optimizasyonu için yapay zeka önerileri</CardDescription>
            </CardHeader>
            <CardContent>
              {evaluationReport && evaluationReport.recommendations.length > 0 ? (
                <div className="space-y-4">
                  {evaluationReport.recommendations.map((recommendation, index) => (
                    <Alert key={index}>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{recommendation}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Performans önerileri almak için kapsamlı değerlendirmeyi çalıştırın
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
