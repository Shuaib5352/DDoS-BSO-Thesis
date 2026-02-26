"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CONFUSION_MATRICES, MODEL_RESULTS, BSO_RF_PER_CLASS } from "@/lib/ciciot2023-dataset"
import { Grid3X3, CheckCircle2, XCircle, TrendingUp, Target } from "lucide-react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts"

// Short class labels for display
const SHORT_LABELS = ["Backdoor", "Benign", "ACK_Frag", "SYN_Flood", "PortScan"]

// Model keys and display names
const MODEL_KEYS = Object.keys(CONFUSION_MATRICES) as (keyof typeof CONFUSION_MATRICES)[]

// Helper: compute per-class metrics from confusion matrix
function computeMetricsFromMatrix(matrix: number[][]) {
    const n = matrix.length
    const metrics = []
    const total = matrix.reduce((s, row) => s + row.reduce((a, b) => a + b, 0), 0)
    let totalCorrect = 0

    for (let i = 0; i < n; i++) {
        const TP = matrix[i][i]
        const FN = matrix[i].reduce((s, v) => s + v, 0) - TP
        const FP = matrix.reduce((s, row) => s + row[i], 0) - TP
        const TN = total - TP - FP - FN
        const precision = TP + FP > 0 ? (TP / (TP + FP)) * 100 : 0
        const recall = TP + FN > 0 ? (TP / (TP + FN)) * 100 : 0
        const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0
        totalCorrect += TP
        metrics.push({ class: SHORT_LABELS[i], TP, FP, FN, TN, precision, recall, f1, support: TP + FN })
    }

    const accuracy = (totalCorrect / total) * 100
    const f1Macro = metrics.reduce((s, m) => s + m.f1, 0) / n
    return { metrics, accuracy, f1Macro, totalCorrect, total }
}

// Color scale for heatmap (0 to max)
function getHeatColor(value: number, max: number): string {
    if (value === 0) return "transparent"
    const intensity = Math.min(value / max, 1)
    // Low intensity = light blue, high intensity = deep blue
    const r = Math.round(239 - intensity * 200)
    const g = Math.round(246 - intensity * 180)
    const b = Math.round(255 - intensity * 30)
    return `rgb(${r}, ${g}, ${b})`
}

function getDiagonalColor(value: number, max: number): string {
    if (value === 0) return "transparent"
    const intensity = Math.min(value / max, 1)
    const r = Math.round(240 - intensity * 206)
    const g = Math.round(253 - intensity * 56)
    const b = Math.round(244 - intensity * 189)
    return `rgb(${r}, ${g}, ${b})`
}

export default function ConfusionMatrixHeatmap() {
    const [selectedModel, setSelectedModel] = useState<string>("BSO-RF")
    const [compareModel, setCompareModel] = useState<string | null>(null)

    const cmData = CONFUSION_MATRICES[selectedModel]
    const matrix = cmData.matrix
    const maxVal = Math.max(...matrix.flat())
    const { metrics, accuracy, f1Macro, totalCorrect, total } = computeMetricsFromMatrix(matrix)

    // Compare model metrics
    const cmData2 = compareModel ? CONFUSION_MATRICES[compareModel] : null
    const metrics2 = cmData2 ? computeMetricsFromMatrix(cmData2.matrix) : null

    // Build per-class comparison data for bar chart
    const perClassComparison = SHORT_LABELS.map((cls, i) => {
        const row: Record<string, number | string> = { class: cls }
        row["primary"] = metrics[i].f1
        if (metrics2) row["compare"] = metrics2.metrics[i].f1
        return row
    })

    // All models accuracy ranking
    const modelRanking = MODEL_KEYS.map((key) => {
        const cm = CONFUSION_MATRICES[key]
        const { accuracy: acc, f1Macro: f1m } = computeMetricsFromMatrix(cm.matrix)
        return { key, model: cm.model, accuracy: acc, f1Macro: f1m }
    }).sort((a, b) => b.accuracy - a.accuracy)

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-violet-500/30 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-500/10 rounded-lg">
                                <Grid3X3 className="w-6 h-6 text-violet-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Etkileşimli Karışıklık Matrisi Isı Haritası</CardTitle>
                                <CardDescription>
                                    Tüm 12 Model İçin Gerçek 5×5 Karışıklık Matrisleri
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-emerald-600">%100 Gerçek Deney Verileri</Badge>
                            <Badge className="bg-violet-600">{total.toLocaleString()} Test Örneği</Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Model Selector */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        Görselleştirmek İçin Model Seçin
                    </CardTitle>
                    <CardDescription>Karışıklık matrisini görüntülemek için herhangi bir modele tıklayın. İsteğe bağlı olarak karşılaştırma için ikinci bir model seçin.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div>
                            <div className="text-xs font-semibold text-muted-foreground mb-2">Birincil Model:</div>
                            <div className="flex flex-wrap gap-2">
                                {MODEL_KEYS.map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedModel(key)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedModel === key
                                            ? "bg-violet-600 text-white border-violet-600 shadow-md"
                                            : "bg-muted/50 border-border hover:bg-muted"
                                            }`}
                                    >
                                        {CONFUSION_MATRICES[key].model}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-muted-foreground mb-2">
                                Karşılaştır (isteğe bağlı):
                                {compareModel && (
                                    <button onClick={() => setCompareModel(null)} className="ml-2 text-red-400 hover:text-red-500">
                                        ✕ Temizle
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {MODEL_KEYS.filter((k) => k !== selectedModel).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setCompareModel(compareModel === key ? null : key)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${compareModel === key
                                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                            : "bg-muted/50 border-border hover:bg-muted"
                                            }`}
                                    >
                                        {CONFUSION_MATRICES[key].model}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Confusion Matrix Heatmap */}
            <div className={`grid grid-cols-1 ${compareModel ? "lg:grid-cols-2" : ""} gap-6`}>
                {/* Primary Matrix */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Grid3X3 className="w-5 h-5 text-violet-500" />
                            {cmData.model}
                        </CardTitle>
                        <CardDescription>
                            Doğruluk: <span className="font-bold text-emerald-500">{accuracy.toFixed(2)}%</span> |
                            F1-Macro: <span className="font-bold text-blue-500">{f1Macro.toFixed(2)}%</span> |
                            Doğru: {totalCorrect.toLocaleString()}/{total.toLocaleString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            {/* Column headers */}
                            <div className="flex items-end mb-1 ml-[100px]">
                                <div className="text-xs text-center text-muted-foreground font-semibold w-full mb-1">Tahmin Edilen Etiket</div>
                            </div>
                            <div className="flex items-end mb-1 ml-[100px]">
                                {SHORT_LABELS.map((label) => (
                                    <div key={label} className="flex-1 text-center text-[10px] md:text-xs font-medium text-muted-foreground px-0.5">
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* Matrix rows */}
                            <div className="flex">
                                {/* Row label: "True Label" */}
                                <div className="flex items-center justify-center w-[14px]">
                                    <div className="text-xs text-muted-foreground font-semibold -rotate-90 whitespace-nowrap">
                                        Gerçek Etiket
                                    </div>
                                </div>

                                <div className="flex-1">
                                    {matrix.map((row, i) => (
                                        <div key={i} className="flex items-center">
                                            {/* Row label */}
                                            <div className="w-[86px] text-right pr-2 text-[10px] md:text-xs font-medium text-muted-foreground flex-shrink-0">
                                                {SHORT_LABELS[i]}
                                            </div>
                                            {/* Cells */}
                                            {row.map((value, j) => {
                                                const isDiagonal = i === j
                                                const bgColor = isDiagonal ? getDiagonalColor(value, maxVal) : getHeatColor(value, maxVal)
                                                const textColor = value === 0
                                                    ? "text-muted-foreground/30"
                                                    : isDiagonal
                                                        ? value > maxVal * 0.5 ? "text-white" : "text-emerald-700"
                                                        : value > maxVal * 0.3 ? "text-white" : "text-foreground"
                                                return (
                                                    <div
                                                        key={j}
                                                        className={`flex-1 aspect-square min-h-[40px] md:min-h-[56px] flex items-center justify-center border border-border/30 ${textColor} ${isDiagonal ? "font-bold" : ""}`}
                                                        style={{ backgroundColor: bgColor }}
                                                        title={`Gerçek: ${SHORT_LABELS[i]}, Tahmin: ${SHORT_LABELS[j]}, Sayı: ${value}`}
                                                    >
                                                        <span className="text-[10px] md:text-sm font-mono">
                                                            {value.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-4 mt-3 justify-center text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getDiagonalColor(maxVal, maxVal) }} />
                                    <span>Doğru (köşegen)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatColor(maxVal, maxVal) }} />
                                    <span>Yanlış Sınıflandırma</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded border border-border/50" />
                                    <span>Sıfır</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Compare Matrix */}
                {compareModel && cmData2 && metrics2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Grid3X3 className="w-5 h-5 text-blue-500" />
                                {cmData2.model}
                            </CardTitle>
                            <CardDescription>
                                Doğruluk: <span className="font-bold text-emerald-500">{metrics2.accuracy.toFixed(2)}%</span> |
                                F1-Macro: <span className="font-bold text-blue-500">{metrics2.f1Macro.toFixed(2)}%</span> |
                                Doğru: {metrics2.totalCorrect.toLocaleString()}/{metrics2.total.toLocaleString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <div className="flex items-end mb-1 ml-[100px]">
                                    <div className="text-xs text-center text-muted-foreground font-semibold w-full mb-1">Tahmin Edilen Etiket</div>
                                </div>
                                <div className="flex items-end mb-1 ml-[100px]">
                                    {SHORT_LABELS.map((label) => (
                                        <div key={label} className="flex-1 text-center text-[10px] md:text-xs font-medium text-muted-foreground px-0.5">
                                            {label}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex">
                                    <div className="flex items-center justify-center w-[14px]">
                                        <div className="text-xs text-muted-foreground font-semibold -rotate-90 whitespace-nowrap">Gerçek Etiket</div>
                                    </div>
                                    <div className="flex-1">
                                        {cmData2.matrix.map((row, i) => {
                                            const maxVal2 = Math.max(...cmData2.matrix.flat())
                                            return (
                                                <div key={i} className="flex items-center">
                                                    <div className="w-[86px] text-right pr-2 text-[10px] md:text-xs font-medium text-muted-foreground flex-shrink-0">
                                                        {SHORT_LABELS[i]}
                                                    </div>
                                                    {row.map((value, j) => {
                                                        const isDiag = i === j
                                                        const bg = isDiag ? getDiagonalColor(value, maxVal2) : getHeatColor(value, maxVal2)
                                                        const tc = value === 0 ? "text-muted-foreground/30" : isDiag ? (value > maxVal2 * 0.5 ? "text-white" : "text-emerald-700") : (value > maxVal2 * 0.3 ? "text-white" : "text-foreground")
                                                        return (
                                                            <div key={j} className={`flex-1 aspect-square min-h-[40px] md:min-h-[56px] flex items-center justify-center border border-border/30 ${tc} ${isDiag ? "font-bold" : ""}`} style={{ backgroundColor: bg }}>
                                                                <span className="text-[10px] md:text-sm font-mono">{value.toLocaleString()}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Per-Class Metrics Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Sınıf Bazında Metrikler — {cmData.model}
                    </CardTitle>
                    <CardDescription>Yukarıdaki karışıklık matrisinden doğrudan hesaplanmıştır</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">Sınıf</th>
                                    <th className="text-right p-2 font-bold">TP</th>
                                    <th className="text-right p-2 font-bold">FP</th>
                                    <th className="text-right p-2 font-bold">FN</th>
                                    <th className="text-right p-2 font-bold">Precision %</th>
                                    <th className="text-right p-2 font-bold">Recall %</th>
                                    <th className="text-right p-2 font-bold">F1-Score %</th>
                                    <th className="text-right p-2 font-bold">Destek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics.map((m, i) => (
                                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                                        <td className="p-2 font-medium">{m.class}</td>
                                        <td className="p-2 text-right font-mono text-emerald-500">{m.TP.toLocaleString()}</td>
                                        <td className="p-2 text-right font-mono text-red-400">{m.FP.toLocaleString()}</td>
                                        <td className="p-2 text-right font-mono text-amber-400">{m.FN.toLocaleString()}</td>
                                        <td className="p-2 text-right font-mono">{m.precision.toFixed(2)}</td>
                                        <td className="p-2 text-right font-mono">{m.recall.toFixed(2)}</td>
                                        <td className="p-2 text-right font-mono font-bold">{m.f1.toFixed(2)}</td>
                                        <td className="p-2 text-right text-muted-foreground">{m.support.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="border-t-2 border-border font-bold bg-muted/20">
                                    <td className="p-2">Ağırlıklı Ort. / Toplam</td>
                                    <td className="p-2 text-right font-mono text-emerald-500">{totalCorrect.toLocaleString()}</td>
                                    <td className="p-2 text-right" colSpan={2} />
                                    <td className="p-2 text-right" colSpan={2} />
                                    <td className="p-2 text-right font-mono">{f1Macro.toFixed(2)}</td>
                                    <td className="p-2 text-right text-muted-foreground">{total.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* F1-Score Per-Class Comparison */}
            {compareModel && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Sınıf Bazında F1-Skoru Karşılaştırması
                        </CardTitle>
                        <CardDescription>
                            {cmData.model} vs {cmData2?.model}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={perClassComparison}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="class" tick={{ fontSize: 11 }} />
                                    <YAxis domain={[0, 100]} label={{ value: "F1-Score (%)", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} />
                                    <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, ""]} />
                                    <Legend />
                                    <Bar dataKey="primary" name={cmData.model} fill="#8b5cf6" opacity={0.9} />
                                    <Bar dataKey="compare" name={cmData2?.model || ""} fill="#3b82f6" opacity={0.8} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Diagonal Accuracy Quick View (all models) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Tüm Modeller — Karışıklık Matrislerinden Doğruluk
                    </CardTitle>
                    <CardDescription>
                        Her modelin gerçek karışıklık matrisinin köşegen toplamlarından doğrudan hesaplanan doğruluk
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={modelRanking} layout="vertical" margin={{ left: 140 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis type="number" domain={[55, 95]} tickFormatter={(v: number) => `${v}%`} />
                                <YAxis type="category" dataKey="model" width={135} tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, ""]} />
                                <Bar dataKey="accuracy" name="Doğruluk %">
                                    {modelRanking.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={entry.key === "BSO-RF" ? "#22c55e" : entry.key === "XGBoost" ? "#f59e0b" : "#3b82f6"}
                                            opacity={entry.key === "BSO-RF" ? 1 : 0.7}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
