"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from "recharts"
import { Trophy, Clock, MemoryStick, Target, Zap, TrendingUp } from "lucide-react"
import { algorithmComparator, type ComparisonMetrics, type AlgorithmResult } from "@/lib/algorithm-comparator"

export function AlgorithmComparisonPanel() {
  const [comparison, setComparison] = useState<ComparisonMetrics | null>(null)
  const [benchmarking, setBenchmarking] = useState<string | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<string>("accuracy")

  useEffect(() => {
    const loadComparison = () => {
      const data = algorithmComparator.getComparison()
      setComparison(data)
    }

    loadComparison()
  }, [])

  const handleBenchmark = async (algorithmName: string) => {
    setBenchmarking(algorithmName)
    try {
      const result = await algorithmComparator.runBenchmark(algorithmName)
      // Update the comparison with new benchmark result
      if (comparison) {
        const updatedAlgorithms = comparison.algorithms.map((algo) => (algo.name === algorithmName ? result : algo))
        setComparison({
          ...comparison,
          algorithms: updatedAlgorithms,
        })
      }
    } finally {
      setBenchmarking(null)
    }
  }

  if (!comparison) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Algoritma Karşılaştırması</CardTitle>
          <CardDescription>Karşılaştırma verileri yükleniyor...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const chartData = comparison.algorithms.map((algo) => ({
    name: algo.name.replace("Hybrid BSO-", "BSO-"),
    accuracy: (algo.accuracy * 100).toFixed(1),
    precision: (algo.precision * 100).toFixed(1),
    recall: (algo.recall * 100).toFixed(1),
    f1Score: (algo.f1Score * 100).toFixed(1),
    processingTime: algo.processingTime,
    memoryUsage: algo.memoryUsage,
    falsePositiveRate: (algo.falsePositiveRate * 100).toFixed(1),
  }))

  const radarData = comparison.algorithms.map((algo) => ({
    algorithm: algo.name.split(" ")[0],
    accuracy: algo.accuracy * 100,
    precision: algo.precision * 100,
    recall: algo.recall * 100,
    speed: Math.max(0, 100 - algo.processingTime * 10),
    efficiency: Math.max(0, 100 - algo.memoryUsage / 10),
  }))

  const scatterData = comparison.algorithms.map((algo) => ({
    x: algo.accuracy * 100,
    y: Math.max(0, 100 - algo.processingTime * 10),
    name: algo.name,
    size: 100 - algo.memoryUsage / 10,
  }))

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En İyi Performans</CardTitle>
            <Trophy className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{comparison.bestPerformer}</div>
            <p className="text-xs text-muted-foreground">Ağırlıklı puanlamaya göre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Edilen Algoritmalar</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comparison.algorithms.length}</div>
            <p className="text-xs text-muted-foreground">
              {comparison.benchmarkData.samples.toLocaleString()} örnek test edildi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veri Seti</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comparison.benchmarkData.features}</div>
            <p className="text-xs text-muted-foreground">{comparison.benchmarkData.dataset} veri setinden özellikler</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performans</TabsTrigger>
          <TabsTrigger value="detailed">Detaylı Görünüm</TabsTrigger>
          <TabsTrigger value="radar">Radar Analizi</TabsTrigger>
          <TabsTrigger value="recommendations">Öneriler</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Algoritma Performans Karşılaştırması</CardTitle>
              <CardDescription>Algoritmalar arası Doğruluk, Precision, Recall ve F1-Skoru karşılaştırması</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accuracy" fill="hsl(var(--primary))" name="Doğruluk %" />
                  <Bar dataKey="precision" fill="hsl(var(--success))" name="Precision %" />
                  <Bar dataKey="recall" fill="hsl(var(--warning))" name="Recall %" />
                  <Bar dataKey="f1Score" fill="hsl(var(--danger))" name="F1-Skoru %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <div className="grid gap-4">
            {comparison.algorithms.map((algo, index) => (
              <Card key={index} className={algo.name === comparison.bestPerformer ? "border-warning" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {algo.name}
                        {algo.name === comparison.bestPerformer && (
                          <Badge variant="secondary" className="bg-warning/10 text-warning">
                            <Trophy className="w-3 h-3 mr-1" />
                            En İyi
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Doğruluk: {(algo.accuracy * 100).toFixed(1)}% | F1-Skoru: {(algo.f1Score * 100).toFixed(1)}%
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBenchmark(algo.name)}
                      disabled={benchmarking === algo.name}
                    >
                      {benchmarking === algo.name ? "Çalışıyor..." : "Kıyaslama"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Doğruluk</span>
                      </div>
                      <Progress value={algo.accuracy * 100} className="h-2" />
                      <span className="text-xs text-muted-foreground">{(algo.accuracy * 100).toFixed(1)}%</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium">Hız</span>
                      </div>
                      <Progress value={Math.max(0, 100 - algo.processingTime * 10)} className="h-2" />
                      <span className="text-xs text-muted-foreground">{algo.processingTime}s</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MemoryStick className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium">Bellek</span>
                      </div>
                      <Progress value={Math.max(0, 100 - algo.memoryUsage / 10)} className="h-2" />
                      <span className="text-xs text-muted-foreground">{algo.memoryUsage.toFixed(1)} MB</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-danger" />
                        <span className="text-sm font-medium">YP Oranı</span>
                      </div>
                      <Progress value={100 - algo.falsePositiveRate * 100} className="h-2" />
                      <span className="text-xs text-muted-foreground">
                        {(algo.falsePositiveRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Çok Boyutlu Analiz</CardTitle>
              <CardDescription>Algoritma performansını birden fazla boyutta gösteren radar grafiği</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart
                  data={
                    radarData[0]
                      ? Object.keys(radarData[0])
                        .filter((key) => key !== "algorithm")
                        .map((key) => ({
                          metric: key.charAt(0).toUpperCase() + key.slice(1),
                          ...radarData.reduce(
                            (acc, algo) => ({
                              ...acc,
                              [algo.algorithm]: algo[key as keyof typeof algo],
                            }),
                            {},
                          ),
                        }))
                      : []
                  }
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  {radarData.map((algo, index) => (
                    <Radar
                      key={algo.algorithm}
                      name={algo.algorithm}
                      dataKey={algo.algorithm}
                      stroke={`hsl(${index * 60}, 70%, 50%)`}
                      fill={`hsl(${index * 60}, 70%, 50%)`}
                      fillOpacity={0.1}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Doğruluk vs Hız Dengesi</CardTitle>
              <CardDescription>
                Doğruluk ve işlem hızı arasındaki ilişkiyi gösteren saçılım grafiği
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={scatterData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" name="Doğruluk" unit="%" />
                  <YAxis dataKey="y" name="Hız Skoru" unit="" />
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Algoritma: ${scatterData.find((d) => d.x === label)?.name}`}
                  />
                  <Scatter dataKey="y" fill="hsl(var(--primary))" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yapay Zeka Destekli Öneriler</CardTitle>
              <CardDescription>Kapsamlı algoritma analizine dayalı öneriler</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparison.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kıyaslama Bilgileri</CardTitle>
              <CardDescription>Test ortamı ve veri seti hakkında detaylar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Veri Seti</div>
                  <div className="text-lg font-semibold">{comparison.benchmarkData.dataset}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Örnekler</div>
                  <div className="text-lg font-semibold">{comparison.benchmarkData.samples.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Özellikler</div>
                  <div className="text-lg font-semibold">{comparison.benchmarkData.features} (BSO: {comparison.benchmarkData.selectedFeatures ?? 18})</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Test Tarihi</div>
                  <div className="text-lg font-semibold">{comparison.benchmarkData.testDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AlgorithmComparisonPanel
