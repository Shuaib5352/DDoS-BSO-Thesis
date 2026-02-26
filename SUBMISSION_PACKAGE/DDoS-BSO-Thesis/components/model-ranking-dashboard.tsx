"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    MODEL_RESULTS,
    CONFUSION_MATRICES,
    COMPUTATIONAL_EFFICIENCY,
    CROSS_VALIDATION,
    STATISTICAL_TESTS,
} from "@/lib/ciciot2023-dataset"
import { Trophy, Medal, ArrowUpDown, CheckCircle2, Star, TrendingUp, Zap, Target } from "lucide-react"
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Legend, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
    ScatterChart, Scatter, ZAxis,
} from "recharts"

type SortKey = "accuracy" | "f1Score" | "f1Macro" | "aucRoc" | "mcc" | "trainingTime" | "predictionTime" | "featuresUsed"

const METRIC_LABELS: Record<SortKey, string> = {
    accuracy: "Doğruluk %",
    f1Score: "F1-Ağırlıklı %",
    f1Macro: "F1-Macro %",
    aucRoc: "AUC-ROC %",
    mcc: "MCC",
    trainingTime: "Eğitim Süresi (s)",
    predictionTime: "Tahmin (ms)",
    featuresUsed: "Kullanılan Özellikler",
}

// Assign rank colors
function getRankBadge(rank: number) {
    if (rank === 1) return { color: "bg-amber-500", icon: "🥇", label: "1." }
    if (rank === 2) return { color: "bg-gray-400", icon: "🥈", label: "2." }
    if (rank === 3) return { color: "bg-orange-600", icon: "🥉", label: "3." }
    return { color: "bg-muted", icon: "", label: `#${rank}` }
}

// Normalize value to 0-100 for composite score
function normalizeMetric(value: number, allValues: number[], higherIsBetter: boolean): number {
    const min = Math.min(...allValues)
    const max = Math.max(...allValues)
    if (max === min) return 50
    const normalized = ((value - min) / (max - min)) * 100
    return higherIsBetter ? normalized : 100 - normalized
}

export default function ModelRankingDashboard() {
    const [sortBy, setSortBy] = useState<SortKey>("accuracy")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

    // Sort models
    const sortedModels = [...MODEL_RESULTS].sort((a, b) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        // For time & features, lower is better
        const lowerIsBetter = ["trainingTime", "predictionTime", "featuresUsed"].includes(sortBy)
        if (lowerIsBetter) {
            return sortDir === "desc" ? aVal - bVal : bVal - aVal
        }
        return sortDir === "desc" ? bVal - aVal : aVal - bVal
    })

    const handleSort = (key: SortKey) => {
        if (sortBy === key) {
            setSortDir(sortDir === "desc" ? "asc" : "desc")
        } else {
            setSortBy(key)
            setSortDir("desc")
        }
    }

    // Composite score: weighted average of normalized metrics
    const compositeScores = MODEL_RESULTS.map((m) => {
        const accNorm = normalizeMetric(m.accuracy, MODEL_RESULTS.map(r => r.accuracy), true)
        const f1MacroNorm = normalizeMetric(m.f1Macro, MODEL_RESULTS.map(r => r.f1Macro), true)
        const aucNorm = normalizeMetric(m.aucRoc, MODEL_RESULTS.map(r => r.aucRoc), true)
        const mccNorm = normalizeMetric(m.mcc, MODEL_RESULTS.map(r => r.mcc), true)
        const featNorm = normalizeMetric(m.featuresUsed, MODEL_RESULTS.map(r => r.featuresUsed), false)
        const timeNorm = normalizeMetric(m.trainingTime, MODEL_RESULTS.map(r => r.trainingTime), false)

        // Weights: accuracy 25%, f1-macro 25%, AUC 15%, MCC 15%, features 10%, time 10%
        const score = accNorm * 0.25 + f1MacroNorm * 0.25 + aucNorm * 0.15 + mccNorm * 0.15 + featNorm * 0.10 + timeNorm * 0.10
        return {
            name: m.name,
            score: Math.round(score * 100) / 100,
            accuracy: accNorm,
            f1Macro: f1MacroNorm,
            auc: aucNorm,
            mcc: mccNorm,
            features: featNorm,
            time: timeNorm,
            featureSet: m.featureSet || "All",
        }
    }).sort((a, b) => b.score - a.score)

    // Radar data for top 5 models
    const top5 = compositeScores.slice(0, 5)
    const radarMetrics = ["Doğruluk", "F1-Macro", "AUC-ROC", "MCC", "Verimlilik", "Özellik Azaltma"]
    const radarData = radarMetrics.map((metric, idx) => {
        const row: Record<string, number | string> = { metric }
        top5.forEach((model) => {
            const vals = [model.accuracy, model.f1Macro, model.auc, model.mcc, model.time, model.features]
            row[model.name] = Math.round(vals[idx] * 10) / 10
        })
        return row
    })

    // Scatter: Accuracy vs Training time (all 12 models)
    const scatterData = MODEL_RESULTS.map((m) => ({
        name: m.name,
        x: m.trainingTime,
        y: m.accuracy,
        z: m.featuresUsed,
        featureSet: m.featureSet || "All",
    })).filter(d => d.x < 10) // Exclude SVM outlier for better viz

    const scatterDataSVM = MODEL_RESULTS.filter(m => m.trainingTime >= 10).map(m => ({
        name: m.name,
        x: m.trainingTime,
        y: m.accuracy,
    }))

    // Per-metric ranking
    const metricRankings = (["accuracy", "f1Macro", "aucRoc", "mcc"] as SortKey[]).map((key) => {
        const sorted = [...MODEL_RESULTS].sort((a, b) => b[key] - a[key])
        return {
            metric: METRIC_LABELS[key],
            top3: sorted.slice(0, 3).map((m, i) => ({
                name: m.name,
                value: m[key],
                rank: i + 1,
            })),
        }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-yellow-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Trophy className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Model Sıralama ve Karşılaştırma Paneli</CardTitle>
                                <CardDescription>
                                    Kapsamlı Çok Kriterli Model Değerlendirmesi
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-emerald-600">%100 Gerçek Deney Verileri</Badge>
                            <Badge className="bg-amber-600">{MODEL_RESULTS.length} Model Karşılaştırıldı</Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Composite Score Podium */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Bileşik Puan Sıralaması
                    </CardTitle>
                    <CardDescription>
                        Ağırlıklı puan: Doğruluk(%25) + F1-Macro(%25) + AUC(%15) + MCC(%15) + Özellikler(%10) + Hız(%10)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {compositeScores.map((model, i) => {
                            const badge = getRankBadge(i + 1)
                            return (
                                <div key={model.name} className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:bg-muted/30 ${i === 0 ? "border-amber-500/50 bg-amber-500/5" : i === 1 ? "border-gray-400/50 bg-gray-400/5" : i === 2 ? "border-orange-500/50 bg-orange-500/5" : "border-border/50"}`}>
                                    <div className="flex items-center gap-2 w-16 flex-shrink-0">
                                        <Badge className={`${badge.color} text-xs px-1.5`}>
                                            {badge.icon} {badge.label}
                                        </Badge>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm truncate">{model.name}</span>
                                            <Badge variant="outline" className="text-[10px]">{model.featureSet}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <div className="w-32 md:w-48 bg-muted rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-3 rounded-full transition-all ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-500" : "bg-blue-500"}`}
                                                style={{ width: `${model.score}%` }}
                                            />
                                        </div>
                                        <span className="font-mono font-bold text-sm w-14 text-right">{model.score.toFixed(1)}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Top 5 Radar Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-500" />
                            İlk 5 Model — Çok Metrikli Radar
                        </CardTitle>
                        <CardDescription>6 boyutta normalleştirilmiş karşılaştırma</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8 }} />
                                    {top5.map((model, i) => {
                                        const colors = ["#22c55e", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444"]
                                        return (
                                            <Radar
                                                key={model.name}
                                                name={model.name.replace(" (Proposed)", "")}
                                                dataKey={model.name}
                                                stroke={colors[i]}
                                                fill={colors[i]}
                                                fillOpacity={i === 0 ? 0.2 : 0.05}
                                                strokeWidth={i === 0 ? 2.5 : 1.5}
                                            />
                                        )
                                    })}
                                    <Legend wrapperStyle={{ fontSize: 10 }} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Per-Metric Champions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Medal className="w-5 h-5 text-amber-500" />
                            Metrik Bazında Şampiyonlar
                        </CardTitle>
                        <CardDescription>Her bir performans metriği için en iyi 3 model</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {metricRankings.map((ranking) => (
                                <div key={ranking.metric} className="p-3 rounded-lg border border-border/50">
                                    <div className="font-semibold text-sm mb-2 text-muted-foreground">{ranking.metric}</div>
                                    <div className="space-y-1.5">
                                        {ranking.top3.map((m) => {
                                            const badge = getRankBadge(m.rank)
                                            return (
                                                <div key={m.name} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm">{badge.icon}</span>
                                                        <span className="text-sm font-medium">{m.name}</span>
                                                    </div>
                                                    <span className="font-mono font-bold text-sm">
                                                        {typeof m.value === "number" && m.value < 1 ? m.value.toFixed(4) : m.value}
                                                        {typeof m.value === "number" && m.value > 1 ? "%" : ""}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Efficiency Scatter: Accuracy vs Training Time */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-500" />
                        Doğruluk vs Eğitim Süresi — Verimlilik Sınırı
                    </CardTitle>
                    <CardDescription>
                        Sol üst köşedeki modeller en iyi doğruluk-hız oranını sunar.
                        SVM ({MODEL_RESULTS[6].trainingTime}s) ölçek nedeniyle grafikten çıkarılmıştır.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="Eğitim Süresi"
                                    unit="s"
                                    label={{ value: "Eğitim Süresi (saniye)", position: "insideBottom", offset: -5, style: { fontSize: 11 } }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="Doğruluk"
                                    domain={[60, 92]}
                                    label={{ value: "Doğruluk (%)", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                                />
                                <ZAxis type="number" dataKey="z" range={[80, 300]} name="Özellikler" />
                                <Tooltip
                                    formatter={(value: number, name: string) => {
                                        if (name === "Eğitim Süresi") return [`${value.toFixed(3)}s`, name]
                                        if (name === "Doğruluk") return [`${value.toFixed(2)}%`, name]
                                        return [value, name]
                                    }}
                                    labelFormatter={(label) => {
                                        const m = scatterData.find(d => d.x === label)
                                        return m?.name || ""
                                    }}
                                    content={({ payload }) => {
                                        if (!payload || payload.length === 0) return null
                                        const data = payload[0]?.payload
                                        if (!data) return null
                                        return (
                                            <div className="bg-card border border-border rounded-lg p-2 shadow-lg text-xs">
                                                <div className="font-bold mb-1">{data.name}</div>
                                                <div>Doğruluk: {data.y.toFixed(2)}%</div>
                                                <div>Eğitim: {data.x.toFixed(3)}s</div>
                                                <div>Özellikler: {data.z}</div>
                                            </div>
                                        )
                                    }}
                                />
                                <Scatter
                                    name="Modeller"
                                    data={scatterData}
                                    fill="#3b82f6"
                                >
                                    {scatterData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={entry.featureSet === "BSO" ? "#22c55e" : entry.featureSet === "All" && entry.name === "XGBoost" ? "#f59e0b" : "#3b82f6"}
                                            stroke={entry.name === "BSO-Hybrid RF (Proposed)" ? "#22c55e" : "transparent"}
                                            strokeWidth={entry.name === "BSO-Hybrid RF (Proposed)" ? 3 : 0}
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    {scatterDataSVM.length > 0 && (
                        <div className="mt-2 p-2 bg-amber-500/10 rounded-lg text-xs">
                            <strong>Not:</strong> SVM (Doğrusal) eğitim süresi = {scatterDataSVM[0].x}s (doğruluk: {scatterDataSVM[0].y}%) — ölçek nedeniyle grafikten çıkarılmıştır.
                            SVM, BSO-RF'den 18 kat daha yavaş ve daha düşük doğruluğa sahiptir.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Full Sortable Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ArrowUpDown className="w-5 h-5 text-blue-500" />
                        Tam Model Karşılaştırması — Sıralanabilir Tablo
                    </CardTitle>
                    <CardDescription>Sıralamak için herhangi bir sütun başlığına tıklayın. Tüm metrikler gerçek deneylerden alınmıştır.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">#</th>
                                    <th className="text-left p-2 font-bold">Model</th>
                                    {(Object.keys(METRIC_LABELS) as SortKey[]).map((key) => (
                                        <th
                                            key={key}
                                            className="text-right p-2 font-bold cursor-pointer hover:text-blue-500 select-none whitespace-nowrap"
                                            onClick={() => handleSort(key)}
                                        >
                                            {METRIC_LABELS[key]}
                                            {sortBy === key && (
                                                <span className="ml-1">{sortDir === "desc" ? "↓" : "↑"}</span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedModels.map((m, i) => {
                                    const isProposed = m.name.includes("Proposed")
                                    return (
                                        <tr key={m.name} className={`border-b border-border/50 hover:bg-muted/30 ${isProposed ? "bg-emerald-500/5 font-semibold" : ""}`}>
                                            <td className="p-2 text-muted-foreground">{i + 1}</td>
                                            <td className="p-2 font-medium whitespace-nowrap">
                                                {isProposed && <span className="text-emerald-500 mr-1">★</span>}
                                                {m.name}
                                            </td>
                                            <td className="p-2 text-right font-mono">{m.accuracy}</td>
                                            <td className="p-2 text-right font-mono">{m.f1Score}</td>
                                            <td className="p-2 text-right font-mono">{m.f1Macro}</td>
                                            <td className="p-2 text-right font-mono">{m.aucRoc}</td>
                                            <td className="p-2 text-right font-mono">{m.mcc.toFixed(4)}</td>
                                            <td className="p-2 text-right font-mono">{m.trainingTime}</td>
                                            <td className="p-2 text-right font-mono">{m.predictionTime}</td>
                                            <td className="p-2 text-right font-mono">{m.featuresUsed}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Cross-Validation Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        10 Katlı Çapraz Doğrulama — BSO-Hybrid RF
                    </CardTitle>
                    <CardDescription>
                        Model kararlılığını kanıtlayan gerçek ÇD sonuçları: Ortalama Doğruluk = {CROSS_VALIDATION.mean.accuracy}% ± {CROSS_VALIDATION.std.accuracy}%
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CROSS_VALIDATION.results}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="fold" tickFormatter={(v: number) => `Katman ${v}`} tick={{ fontSize: 10 }} />
                                <YAxis domain={[89, 92]} label={{ value: "Doğruluk (%)", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} />
                                <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
                                <Bar dataKey="accuracy" name="Doğruluk %" fill="#22c55e" opacity={0.85} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                        {(["accuracy", "precision", "recall", "f1Score"] as const).map((key) => (
                            <div key={key} className="p-2 rounded-lg bg-muted/30">
                                <div className="text-xs text-muted-foreground capitalize">{key === "f1Score" ? "F1-Score" : key === "accuracy" ? "Doğruluk" : key === "precision" ? "Precision" : key === "recall" ? "Recall" : key}</div>
                                <div className="text-lg font-bold">{CROSS_VALIDATION.mean[key]}%</div>
                                <div className="text-xs text-muted-foreground">±{CROSS_VALIDATION.std[key]}%</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Statistical Significance */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                        İstatistiksel Anlamlılık Testleri (Gerçek p-değerleri)
                    </CardTitle>
                    <CardDescription>10 katlı ÇD'den eşleştirilmiş t-testi ve Wilcoxon işaretli sıra testi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {STATISTICAL_TESTS.map((test, i) => (
                            <div key={i} className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-all">
                                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                    <h4 className="font-bold text-sm">{test.comparison}</h4>
                                    <div className="flex gap-2">
                                        <Badge className={test.significant ? "bg-emerald-600" : "bg-gray-500"}>
                                            {test.significant ? "Anlamlı" : "Anlamlı Değil"}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            Etki: {test.effectSize}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                                    <div className="p-2 bg-muted/30 rounded">
                                        <div className="text-muted-foreground">İyileştirme</div>
                                        <div className="font-mono font-bold">{test.improvement}</div>
                                    </div>
                                    <div className="p-2 bg-muted/30 rounded">
                                        <div className="text-muted-foreground">t-İstatistiği</div>
                                        <div className="font-mono font-bold">{test.tStatistic.toFixed(4)}</div>
                                    </div>
                                    <div className="p-2 bg-muted/30 rounded">
                                        <div className="text-muted-foreground">p-Değeri</div>
                                        <div className="font-mono font-bold">{test.pValue < 0.0001 ? "< 0.0001" : test.pValue}</div>
                                    </div>
                                    <div className="p-2 bg-muted/30 rounded">
                                        <div className="text-muted-foreground">Cohen&apos;s d</div>
                                        <div className="font-mono font-bold">{test.cohenD.toFixed(4)}</div>
                                    </div>
                                    <div className="p-2 bg-muted/30 rounded">
                                        <div className="text-muted-foreground">Wilcoxon p</div>
                                        <div className="font-mono font-bold">{test.wilcoxonP}</div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 italic">{test.note}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
