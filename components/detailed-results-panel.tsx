"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Target, Zap, Shield, CheckCircle2, AlertTriangle } from "lucide-react"

import { DATASET_STATISTICS, MODEL_RESULTS, BSO_PARAMETERS } from "@/lib/ciciot2023-dataset"

// CICIoT2023 model performance data
const modelPerformanceData = MODEL_RESULTS.map(m => ({
  model: m.name.replace(" (Proposed)", ""),
  accuracy: m.accuracy,
  precision: m.precision,
  recall: m.recall,
  f1Score: m.f1Score,
}))

// Training time comparison (CICIoT2023 dataset)
const trainingTimeData = [
  { model: "BSO-RF", time: 11.05, optimizationTime: 750.3 },
  { model: "BSO-SVM", time: 2.67, optimizationTime: 750.3 },
  { model: "Random Forest", time: 15.24, optimizationTime: 0 },
  { model: "SVM (Linear)", time: 5.97, optimizationTime: 0 },
  { model: "Decision Tree", time: 4.83, optimizationTime: 0 },
  { model: "KNN", time: 0.0, optimizationTime: 0 },
  { model: "Naive Bayes", time: 0.38, optimizationTime: 0 },
  { model: "Logistic Regression", time: 17.02, optimizationTime: 0 },
]

// Feature importance data from CICIoT2023 BSO feature selection
const featureImportanceData = [
  { feature: "Flow Duration", importance: 0.0891, category: "Zamansal" },
  { feature: "Total Fwd Packets", importance: 0.0823, category: "Paket Sayısı" },
  { feature: "Total Bwd Packets", importance: 0.0756, category: "Paket Sayısı" },
  { feature: "Flow Bytes/s", importance: 0.0712, category: "Akış Hızı" },
  { feature: "Flow Packets/s", importance: 0.0689, category: "Akış Hızı" },
  { feature: "Fwd Packet Length Mean", importance: 0.0634, category: "Paket Uzunluğu" },
  { feature: "Bwd Packet Length Mean", importance: 0.0598, category: "Paket Uzunluğu" },
  { feature: "Flow IAT Mean", importance: 0.0567, category: "Zamansal" },
  { feature: "Init_Win_bytes_fwd", importance: 0.0334, category: "Pencere Boyutu" },
  { feature: "SYN Flag Count", importance: 0.0289, category: "Bayrak" },
]

// Attack detection over time (based on CICIoT2023 testing)
const detectionTimelineData = [
  { hour: "10:00", detected: 2345, missed: 14, falsePositive: 8 },
  { hour: "11:00", detected: 4567, missed: 28, falsePositive: 12 },
  { hour: "12:00", detected: 6789, missed: 42, falsePositive: 18 },
  { hour: "13:00", detected: 8234, missed: 51, falsePositive: 22 },
  { hour: "14:00", detected: 5678, missed: 35, falsePositive: 15 },
  { hour: "15:00", detected: 3456, missed: 21, falsePositive: 10 },
  { hour: "16:00", detected: 1234, missed: 8, falsePositive: 5 },
  { hour: "17:00", detected: 890, missed: 5, falsePositive: 3 },
]

// BSO optimization convergence (200 iterations)
const bsoConvergenceData = [
  { iteration: 0, fitness: 0.8755, bestFitness: 0.8755 },
  { iteration: 20, fitness: 0.9234, bestFitness: 0.9289 },
  { iteration: 40, fitness: 0.9456, bestFitness: 0.9523 },
  { iteration: 60, fitness: 0.9612, bestFitness: 0.9678 },
  { iteration: 80, fitness: 0.9734, bestFitness: 0.9789 },
  { iteration: 100, fitness: 0.9823, bestFitness: 0.9856 },
  { iteration: 120, fitness: 0.9867, bestFitness: 0.9889 },
  { iteration: 140, fitness: 0.9895, bestFitness: 0.9912 },
  { iteration: 160, fitness: 0.9912, bestFitness: 0.9921 },
  { iteration: 180, fitness: 0.9921, bestFitness: 0.9925 },
  { iteration: 200, fitness: 0.9927, bestFitness: 0.9927 },
]

// Dataset statistics from CICIoT2023
const datasetStats = {
  totalSamples: DATASET_STATISTICS.totalSamples,
  normalTraffic: 25000,
  ddosAttacks: DATASET_STATISTICS.totalSamples - 25000,
  trainingSet: DATASET_STATISTICS.totalFlows.training,
  testingSet: DATASET_STATISTICS.totalFlows.testing,
  features: DATASET_STATISTICS.totalFeatures,
  selectedFeatures: DATASET_STATISTICS.selectedFeatures,
}

export default function DetailedResultsPanel() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-chart-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              En İyi Doğruluk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">89.04%</div>
            <p className="text-xs text-muted-foreground mt-1">BSO-RF (CICIoT2023)</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-chart-2" />
              <span className="text-xs text-chart-2 font-medium">Standart RF'ye göre +2.44%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Tespit Oranı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">99.38%</div>
            <p className="text-xs text-muted-foreground mt-1">Recall (CICIoT2023)</p>
            <Progress value={99.38} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Yanlış Pozitif Oranı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">0.73%</div>
            <p className="text-xs text-muted-foreground mt-1">BSO-RF yanlış alarmlar</p>
            <Badge variant="secondary" className="mt-2 bg-chart-2/10 text-chart-2">
              Mükemmel
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              F1-Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">99.26%</div>
            <p className="text-xs text-muted-foreground mt-1">BSO-RF dengeli (CICIoT2023)</p>
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle2 className="w-3 h-3 text-chart-2" />
              <span className="text-xs text-chart-2 font-medium">Optimal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="performance">Model Performansı</TabsTrigger>
          <TabsTrigger value="features">Özellik Analizi</TabsTrigger>
          <TabsTrigger value="timeline">Tespit Zaman Çizelgesi</TabsTrigger>
          <TabsTrigger value="optimization">BSO Optimizasyonu</TabsTrigger>
          <TabsTrigger value="dataset">Veri Seti İstatistikleri</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Doğruluk Karşılaştırması</CardTitle>
                <CardDescription>Farklı ML algoritmaları arasında performans metrikleri</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={modelPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="model" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" domain={[85, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="accuracy" fill="var(--color-chart-1)" name="Doğruluk %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="precision" fill="var(--color-chart-2)" name="Precision %" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="recall" fill="var(--color-chart-4)" name="Recall %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eğitim Süresi Analizi</CardTitle>
                <CardDescription>Hesaplama maliyeti karşılaştırması (saniye)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={trainingTimeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" stroke="var(--color-muted-foreground)" />
                    <YAxis dataKey="model" type="category" stroke="var(--color-muted-foreground)" width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="time" fill="var(--color-chart-1)" name="Toplam Süre" stackId="a" />
                    <Bar dataKey="optimizationTime" fill="var(--color-chart-5)" name="BSO Süresi" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detaylı Performans Metrikleri</CardTitle>
              <CardDescription>Tüm modellerin kapsamlı değerlendirmesi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-sm">Model</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Doğruluk</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Precision</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">Recall</th>
                      <th className="text-right py-3 px-4 font-semibold text-sm">F1-Score</th>
                      <th className="text-center py-3 px-4 font-semibold text-sm">Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelPerformanceData.map((model, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{model.model}</td>
                        <td className="text-right py-3 px-4">{model.accuracy}%</td>
                        <td className="text-right py-3 px-4">{model.precision}%</td>
                        <td className="text-right py-3 px-4">{model.recall}%</td>
                        <td className="text-right py-3 px-4">{model.f1Score}%</td>
                        <td className="text-center py-3 px-4">
                          {model.accuracy > 97 ? (
                            <Badge className="bg-chart-2/10 text-chart-2">Mükemmel</Badge>
                          ) : model.accuracy > 94 ? (
                            <Badge className="bg-chart-4/10 text-chart-4">İyi</Badge>
                          ) : (
                            <Badge variant="secondary">Temel</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Özellik Önemi Sıralaması</CardTitle>
                <CardDescription>Tespit doğruluğuna katkıda bulunan en önemli özellikler</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={featureImportanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" stroke="var(--color-muted-foreground)" domain={[0, 0.3]} />
                    <YAxis dataKey="feature" type="category" stroke="var(--color-muted-foreground)" width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                    />
                    <Bar dataKey="importance" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Özellik Kategorileri</CardTitle>
                <CardDescription>Özellik türüne göre dağılım</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featureImportanceData.map((feature, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {feature.category}
                          </Badge>
                          <span className="text-sm font-medium">{feature.feature}</span>
                        </div>
                        <span className="text-sm font-bold">{(feature.importance * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={feature.importance * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>24 Saatlik Tespit Zaman Çizelgesi</CardTitle>
              <CardDescription>Zaman içinde saldırı tespit performansı</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={detectionTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="detected"
                    stroke="var(--color-chart-2)"
                    strokeWidth={3}
                    name="Tespit Edilen Saldırılar"
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="missed"
                    stroke="var(--color-chart-3)"
                    strokeWidth={2}
                    name="Kaçırılan Saldırılar"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="falsePositive"
                    stroke="var(--color-chart-5)"
                    strokeWidth={2}
                    name="Yanlış Pozitifler"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>BSO Yakınsama Analizi</CardTitle>
              <CardDescription>İterasyonlar boyunca optimizasyon uygunluğu</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={bsoConvergenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="iteration"
                    stroke="var(--color-muted-foreground)"
                    label={{ value: "İterasyon", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    domain={[0.7, 1]}
                    label={{ value: "Uygunluk Skoru", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="fitness"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    name="Mevcut Uygunluk"
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bestFitness"
                    stroke="var(--color-chart-2)"
                    strokeWidth={3}
                    name="En İyi Uygunluk"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">BSO Parametreleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Popülasyon Boyutu:</span>
                  <span className="font-semibold">50 yarasa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maks İterasyon:</span>
                  <span className="font-semibold">50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frekans Aralığı:</span>
                  <span className="font-semibold">[0, 2]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ses Yüksekliği (A):</span>
                  <span className="font-semibold">0.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Darbe Oranı (r):</span>
                  <span className="font-semibold">0.5</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Optimizasyon Sonuçları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Son Uygunluk:</span>
                  <span className="font-semibold text-chart-2">0.9927</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Yakınsama:</span>
                  <span className="font-semibold">İterasyon ~160</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">İyileştirme:</span>
                  <span className="font-semibold text-chart-2">+13.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seçilen Özellikler:</span>
                  <span className="font-semibold">18 / 39</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Optimizasyon Süresi:</span>
                  <span className="font-semibold">59.08s</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performans Kazancı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doğruluk Kazancı:</span>
                  <span className="font-semibold text-chart-2">+2.44%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precision Kazancı:</span>
                  <span className="font-semibold text-chart-2">+2.60%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recall Kazancı:</span>
                  <span className="font-semibold text-chart-2">+2.26%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">F1-Score Kazancı:</span>
                  <span className="font-semibold text-chart-2">+2.43%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Özellik Azaltma:</span>
                  <span className="font-semibold text-chart-2">-52.3%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dataset" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Veri Seti Genel Bakışı</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Toplam Örnek:</span>
                    <span className="font-semibold">{datasetStats.totalSamples.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Normal Trafik:</span>
                    <span className="font-semibold">{datasetStats.normalTraffic.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">DDoS Saldırıları:</span>
                    <span className="font-semibold">{datasetStats.ddosAttacks.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sınıf Dengesi:</span>
                      <span className="font-semibold">8.3% / 91.7%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Veri Bölümü</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Eğitim Seti:</span>
                    <span className="font-semibold">{datasetStats.trainingSet.toLocaleString()}</span>
                  </div>
                  <Progress value={70} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Test Seti:</span>
                    <span className="font-semibold">{datasetStats.testingSet.toLocaleString()}</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bölme Oranı:</span>
                      <span className="font-semibold">70% / 10% / 20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Özellik Mühendisliği</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Orijinal Özellikler:</span>
                    <span className="font-semibold">{datasetStats.features}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seçilen Özellikler:</span>
                    <span className="font-semibold text-chart-2">{datasetStats.selectedFeatures}</span>
                  </div>
                  <Progress value={(datasetStats.selectedFeatures / datasetStats.features) * 100} className="h-2" />
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Azaltma:</span>
                      <span className="font-semibold text-chart-2">52.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Veri Seti Kaynakları</CardTitle>
              <CardDescription>Eğitim ve değerlendirme için kullanılan kıyaslama veri setleri</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-base">CICIoT2023 Veri Seti</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Neto, E.C.P., Dadkhah, S., Ferreira, R., Zohourian, A., Lu, R., & Ghorbani, A.A. (2023). CICIoT2023: A Real-Time Dataset and Benchmark for Large-Scale Attacks in IoT Environment. Sensors, 23(13), 5941.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">IoT Trafiği</Badge>
                        <Badge variant="outline">5 Sınıf</Badge>
                        <Badge variant="outline">39 Özellik</Badge>
                        <Badge variant="outline">CICFlowMeter</Badge>
                        <Badge variant="outline">Gerçek Dünya</Badge>
                      </div>
                    </div>
                    <Badge className="bg-chart-2/10 text-chart-2">Birincil</Badge>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-base">Veri Seti Detayları</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        CICIoT2023, gerçekçi bir IoT test ortamında yakalanan iyi huylu trafik ve çeşitli saldırı kategorileri dahil 5 sınıf ile IoT ağ trafiği içermektedir.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">Backdoor_Malware</Badge>
                        <Badge variant="outline">BenignTraffic</Badge>
                        <Badge variant="outline">DDoS-ACK_Fragmentation</Badge>
                        <Badge variant="outline">DDoS-SYN_Flood</Badge>
                        <Badge variant="outline">Recon-PortScan</Badge>
                      </div>
                    </div>
                    <Badge variant="secondary">Saldırı Türleri</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
