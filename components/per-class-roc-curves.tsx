"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from "recharts"
import { TrendingUp, Info } from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */
interface RocClassData {
    class: string
    fpr: number[]
    tpr: number[]
    auc: number
}

interface CurvesData {
    [model: string]: {
        rocPerClass: RocClassData[]
        prCurves: unknown[]
    }
}

/* ═══════════════════════════════════════════════════════════════
   Color mapping
   ═══════════════════════════════════════════════════════════════ */
const CLASS_COLORS: Record<string, string> = {
    Backdoor_Malware: "#ef4444",
    BenignTraffic: "#22c55e",
    "DDoS-ACK_Fragmentation": "#3b82f6",
    "DDoS-SYN_Flood": "#f59e0b",
    "Recon-PortScan": "#8b5cf6",
}

const MODEL_DISPLAY: Record<string, string> = {
    "BSO-Hybrid RF": "BSO-Hibrit RF (Önerilen)",
    XGBoost: "XGBoost",
    "Random Forest": "Rastgele Orman",
    "GWO-RF": "GWO-RF",
    "Decision Tree": "Karar Ağacı",
    "SVM (Linear)": "SVM (Doğrusal)",
}

/* ═══════════════════════════════════════════════════════════════
   Helper: Convert fpr/tpr arrays to Recharts data
   ═══════════════════════════════════════════════════════════════ */
function buildRocChartData(rocPerClass: RocClassData[]) {
    // Merge all classes into unified FPR grid
    const allFpr = new Set<number>()
    allFpr.add(0)
    allFpr.add(1)
    for (const cls of rocPerClass) {
        for (const f of cls.fpr) allFpr.add(f)
    }
    const sortedFpr = Array.from(allFpr).sort((a, b) => a - b)

    // Interpolate TPR for each class at each FPR point
    return sortedFpr.map((fpr) => {
        const entry: Record<string, number> = { fpr: Math.round(fpr * 10000) / 10000 }
        for (const cls of rocPerClass) {
            // Find interpolated TPR
            let tpr = 0
            for (let i = 0; i < cls.fpr.length - 1; i++) {
                if (fpr >= cls.fpr[i] && fpr <= cls.fpr[i + 1]) {
                    const ratio = cls.fpr[i + 1] === cls.fpr[i]
                        ? 0
                        : (fpr - cls.fpr[i]) / (cls.fpr[i + 1] - cls.fpr[i])
                    tpr = cls.tpr[i] + ratio * (cls.tpr[i + 1] - cls.tpr[i])
                    break
                }
                if (fpr > cls.fpr[cls.fpr.length - 1]) tpr = cls.tpr[cls.tpr.length - 1]
            }
            entry[cls.class] = Math.round(tpr * 10000) / 10000
        }
        return entry
    })
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function PerClassRocCurves() {
    const [data, setData] = useState<CurvesData | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedModel, setSelectedModel] = useState("BSO-Hybrid RF")

    useEffect(() => {
        fetch("/curves_tsne_data.json")
            .then((r) => r.json())
            .then((d) => {
                setData(d.curves)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const modelNames = useMemo(() => (data ? Object.keys(data) : []), [data])
    const rocData = useMemo(() => {
        if (!data || !data[selectedModel]) return null
        return data[selectedModel].rocPerClass
    }, [data, selectedModel])

    const chartData = useMemo(() => {
        if (!rocData) return []
        return buildRocChartData(rocData)
    }, [rocData])

    if (loading) {
        return (
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <CardContent className="pt-12 pb-12 text-center">
                    <div className="animate-pulse text-slate-400">Yükleniyor...</div>
                </CardContent>
            </Card>
        )
    }

    if (!data) {
        return (
            <Card className="border border-red-200 dark:border-red-800/40 shadow-sm">
                <CardContent className="pt-6 pb-6 text-center text-red-500 text-sm">
                    curves_tsne_data.json yüklenemedi. Lütfen extract_curves_tsne.py betiğini çalıştırın.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-0 overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
                <CardContent className="relative pt-6 pb-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Sınıf Bazlı ROC Eğrileri (One-vs-Rest)
                        </h2>
                        <span className="inline-block bg-white/20 text-white text-[11px] font-mono font-bold px-3 py-0.5 rounded-full">Şekil 4.14</span>
                        <p className="text-xs text-white/80 max-w-2xl mx-auto">
                            Her saldırı sınıfı için ayrı ROC eğrisi ve AUC değeri — 6 model karşılaştırması
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Model Selector */}
            <Tabs value={selectedModel} onValueChange={setSelectedModel}>
                <TabsList className="h-auto p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex-wrap gap-1">
                    {modelNames.map((m) => (
                        <TabsTrigger
                            key={m}
                            value={m}
                            className="text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                        >
                            {MODEL_DISPLAY[m] || m}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {modelNames.map((model) => (
                    <TabsContent key={model} value={model}>
                        <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                            <CardContent className="pt-6 pb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        {MODEL_DISPLAY[model] || model} — Sınıf Bazlı ROC Eğrileri
                                    </h3>
                                    {model === "BSO-Hybrid RF" && (
                                        <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-[10px] border-0">
                                            Önerilen Model
                                        </Badge>
                                    )}
                                </div>

                                <div className="h-[450px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={data[model] ? buildRocChartData(data[model].rocPerClass) : []}
                                            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                            <XAxis
                                                dataKey="fpr"
                                                type="number"
                                                domain={[0, 1]}
                                                tick={{ fontSize: 10 }}
                                                label={{ value: "Yanlış Pozitif Oranı (FPR)", position: "bottom", fontSize: 11, offset: -5 }}
                                            />
                                            <YAxis
                                                type="number"
                                                domain={[0, 1]}
                                                tick={{ fontSize: 10 }}
                                                label={{ value: "Doğru Pozitif Oranı (TPR)", angle: -90, position: "insideLeft", fontSize: 11 }}
                                            />
                                            <Tooltip
                                                formatter={(value: number, name: string) => [
                                                    `${(value * 100).toFixed(1)}%`,
                                                    name.replace("DDoS-", "").replace("_", " "),
                                                ]}
                                                labelFormatter={(v: number) => `FPR: ${(v * 100).toFixed(1)}%`}
                                                contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }}
                                            />
                                            <Legend
                                                wrapperStyle={{ fontSize: 10 }}
                                                formatter={(value: string) => {
                                                    const cls = data[model]?.rocPerClass.find((r) => r.class === value)
                                                    return `${value.replace("DDoS-", "").replace("_", " ")} (AUC=${cls?.auc.toFixed(4) || "?"})`
                                                }}
                                            />
                                            {/* Diagonal reference line */}
                                            <Line
                                                dataKey="fpr"
                                                stroke="#94a3b8"
                                                strokeDasharray="8 4"
                                                strokeWidth={1}
                                                dot={false}
                                                name="Rastgele (AUC=0.5)"
                                                legendType="none"
                                            />
                                            {data[model]?.rocPerClass.map((cls) => (
                                                <Line
                                                    key={cls.class}
                                                    dataKey={cls.class}
                                                    stroke={CLASS_COLORS[cls.class] || "#6366f1"}
                                                    strokeWidth={2}
                                                    dot={false}
                                                    name={cls.class}
                                                />
                                            ))}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* AUC Table */}
                                <div className="mt-4 grid grid-cols-5 gap-2">
                                    {data[model]?.rocPerClass.map((cls) => (
                                        <div
                                            key={cls.class}
                                            className="text-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                                            style={{ borderLeftColor: CLASS_COLORS[cls.class], borderLeftWidth: 3 }}
                                        >
                                            <div className="text-lg font-black text-slate-900 dark:text-white">
                                                {cls.auc.toFixed(4)}
                                            </div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                                                {cls.class.replace("DDoS-", "").replace("_", " ")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Insight */}
            <Card className="border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/50 dark:bg-indigo-950/20">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed">
                            <strong>DDoS-ACK_Fragmentation</strong> ve <strong>DDoS-SYN_Flood</strong> sınıfları tüm modellerde
                            AUC ≈ 1.0000 ile mükemmel ayrım gösterirken, <strong>Backdoor_Malware</strong> en düşük AUC değerine sahiptir (BSO-RF: 0.9568).
                            Bu, sınırlı eğitim örneklerinden (3.218) kaynaklanır ve SMOTE ile iyileştirilmiş olsa da zorluk devam etmektedir.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
