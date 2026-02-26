"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { BSOOptimizer, type BSOParams } from "@/lib/bso-optimizer"
import { BSO_PARAMETERS, BSO_SELECTED_FEATURES, DATASET_STATISTICS } from "@/lib/ciciot2023-dataset"
import { Play, RotateCcw, Settings, Info } from "lucide-react"

interface BSOVisualizationProps {
  onOptimizationComplete?: (result: any) => void
}

export default function BSOVisualization({ onOptimizationComplete }: BSOVisualizationProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState<any[]>([])
  const [currentResult, setCurrentResult] = useState<any>(null)
  const [swarmState, setSwarmState] = useState<any>(null)

  const bsoParams: Partial<BSOParams> = {
    swarmSize: BSO_PARAMETERS.populationSize,
    dimensions: BSO_PARAMETERS.dimensions,
    maxIterations: BSO_PARAMETERS.maxIterations,
    frequencyMin: BSO_PARAMETERS.frequencyMin,
    frequencyMax: BSO_PARAMETERS.frequencyMax,
    initialLoudness: BSO_PARAMETERS.initialLoudness,
    initialPulseRate: BSO_PARAMETERS.initialPulseRate,
    alpha: BSO_PARAMETERS.alpha,
    gamma: BSO_PARAMETERS.gamma,
  }

  const runOptimization = async () => {
    setIsRunning(true)
    setProgress([])
    setCurrentResult(null)
    setSwarmState(null)

    // Run in a timeout to allow UI to update
    setTimeout(() => {
      const optimizer = new BSOOptimizer(bsoParams)
      const result = optimizer.optimize()
      const progressData = optimizer.getProgress()
      const finalSwarmState = optimizer.getSwarmState()

      setProgress(progressData)
      setCurrentResult(result)
      setSwarmState(finalSwarmState)
      setIsRunning(false)

      if (onOptimizationComplete) {
        onOptimizationComplete(result)
      }
    }, 100)
  }

  return (
    <div className="space-y-6">
      {/* BSO Algorithm Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Bat Swarm Optimization (BSO) - Özellik Seçimi
          </CardTitle>
          <CardDescription>
            CICIoT2023 veri setinde özellik alt kümesi seçimini optimize etmek için Yang (2010) Bat Algorithm
            ({DATASET_STATISTICS.totalFeatures} özellik, {DATASET_STATISTICS.classes} saldırı türü)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Button onClick={runOptimization} disabled={isRunning}>
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Optimize ediliyor..." : "BSO Optimizasyonunu Çalıştır"}
            </Button>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="secondary">Popülasyon: {BSO_PARAMETERS.populationSize}</Badge>
              <Badge variant="secondary">İterasyonlar: {BSO_PARAMETERS.maxIterations}</Badge>
              <Badge variant="secondary">Boyutlar: {BSO_PARAMETERS.dimensions}</Badge>
              <Badge variant="secondary">A0: {BSO_PARAMETERS.initialLoudness}</Badge>
              <Badge variant="secondary">r0: {BSO_PARAMETERS.initialPulseRate}</Badge>
              <Badge variant="secondary">alpha: {BSO_PARAMETERS.alpha}</Badge>
              <Badge variant="secondary">gamma: {BSO_PARAMETERS.gamma}</Badge>
            </div>
          </div>

          {/* Algorithm description */}
          <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground space-y-1">
            <p className="flex items-start gap-2"><Info className="w-4 h-4 mt-0.5 shrink-0" /> <span><strong>Uygunluk fonksiyonu:</strong> F(S) = 1 - Accuracy(RF, S) + beta * |S|/|F|, burada S seçilen özellik alt kümesi ve beta = 0.01 özellik sayısını cezalandırır.</span></p>
            <p className="ml-6"><strong>Transfer fonksiyonu:</strong> S-şekilli sigmoid V(x) = 1/(1+exp(-x)) sürekli hızı ikili özellik seçimine eşler.</p>
            <p className="ml-6"><strong>Amaç:</strong> Minimum özellikle sınıflandırma doğruluğunu maksimize eden optimal özellik alt kümesini bulmak için uygunluğu minimize edin.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Convergence Curve */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">BSO Yakınsama Eğrisi</CardTitle>
            <CardDescription>İterasyonlar boyunca en iyi uygunluk değeri ve popülasyon çeşitliliği</CardDescription>
          </CardHeader>
          <CardContent>
            {progress.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={progress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="iteration" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  <Legend />
                  <Area type="monotone" dataKey="bestFitness" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} name="En İyi Uygunluk" />
                  <Area type="monotone" dataKey="avgFitness" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.08} strokeWidth={1} name="Ort. Uygunluk" />
                  <Area type="monotone" dataKey="diversity" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} strokeWidth={1} name="Çeşitlilik" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Yakınsama eğrisini görmek için optimizasyonu çalıştırın
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimizasyon Sonuçları</CardTitle>
            <CardDescription>BSO algoritması tarafından bulunan en iyi çözüm</CardDescription>
          </CardHeader>
          <CardContent>
            {currentResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">En İyi Uygunluk</span>
                    <div className="text-2xl font-bold text-green-600">{currentResult.bestFitness.toFixed(6)}</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">İterasyonlar</span>
                    <div className="text-2xl font-bold">{currentResult.iterations}</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Tahmini Doğruluk</span>
                    <div className="text-2xl font-bold text-primary">{currentResult.estimatedAccuracy.toFixed(2)}%</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Seçilen Özellikler</span>
                    <div className="text-2xl font-bold">{currentResult.selectedFeatureIndices.length} / {BSO_PARAMETERS.dimensions}</div>
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Naive Bayes temel çizgisine göre iyileştirme: +{currentResult.improvementOverBaseline.toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Özellik Azaltma</span>
                  <Progress value={(1 - currentResult.selectedFeatureIndices.length / BSO_PARAMETERS.dimensions) * 100} className="mt-2 h-3" />
                  <span className="text-xs text-muted-foreground">
                    {((1 - currentResult.selectedFeatureIndices.length / BSO_PARAMETERS.dimensions) * 100).toFixed(1)}% boyut azaltma
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Henüz sonuç yok
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature Selection Results */}
      {currentResult && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">BSO Seçilmiş Özellik Ağırlıkları</CardTitle>
              <CardDescription>
                BSO ağırlığına göre sıralanan ilk 15 özellik ({BSO_PARAMETERS.dimensions} orijinal CICIoT2023 özelliğinden seçilmiş)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={currentResult.featureWeights
                    .filter((f: any) => f.selected)
                    .sort((a: any, b: any) => b.weight - a.weight)
                    .slice(0, 15)}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                  <Bar dataKey="weight" fill="#10b981" name="BSO Ağırlığı" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bat Swarm Positions */}
          {swarmState && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Yarasa Sürüsü Son Konumları</CardTitle>
                <CardDescription>
                  Optimizasyon uzayında {BSO_PARAMETERS.populationSize} yarasanın son konumları (boyut 1-2 projeksiyonu)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="x" name="Hız Boyut-1" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="y" name="Hız Boyut-2" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                    <Scatter
                      name="Yarasalar"
                      data={swarmState.bats}
                      fill="#3b82f6"
                    />
                    <Scatter
                      name="Global En İyi"
                      data={[{ x: swarmState.globalBest[0] ?? 0, y: swarmState.globalBest[1] ?? 0, fitness: swarmState.globalBestFitness }]}
                      fill="#ef4444"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Parameter evolution */}
          {progress.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">BSO Parametre Evrimi</CardTitle>
                <CardDescription>İterasyonlar boyunca ses yüksekliği azalması ve nabız hızı artışı</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="iteration" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                    <Legend />
                    <Line dataKey="loudness" stroke="#ef4444" strokeWidth={2} name="Ort. Ses Yüksekliği (A)" dot={false} />
                    <Line dataKey="pulseRate" stroke="#10b981" strokeWidth={2} name="Ort. Nabız Hızı (r)" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
