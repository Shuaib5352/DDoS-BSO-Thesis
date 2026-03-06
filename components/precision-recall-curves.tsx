"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from "recharts"
import { BarChart3, Info } from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */
interface PrClassData {
    class: string
    precision: number[]
    recall: number[]
    ap: number
}

interface CurvesData {
    [model: string]: {
        rocPerClass: unknown[]
        prCurves: PrClassData[]
    }
}

/* ═══════════════════════════════════════════════════════════════
   Colors
   ═══════════════════════════════════════════════════════════════ */
const CLASS_COLORS: Record<string, string> = {
    Backdoor_Malware: "#ef4444",
    BenignTraffic: "#22c55e",
    "DDoS-ACK_Fragmentation": "#3b82f6",
    "DDoS-SYN_Flood": "#f59e0b",
    "Recon-PortScan": "#8b5cf6",
    "micro-average": "#0ea5e9",
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
   Helper: Build Recharts data from PR curves
   ═══════════════════════════════════════════════════════════════ */
function buildPrChartData(prCurves: PrClassData[]) {
    // Merge all classes into a unified recall grid
    const allRecall = new Set<number>()
    allRecall.add(0)
    allRecall.add(1)
    for (const cls of prCurves) {
        for (const r of cls.recall) allRecall.add(r)
    }
    const sortedRecall = Array.from(allRecall).sort((a, b) => a - b)

    return sortedRecall.map((recall) => {
        const entry: Record<string, number> = { recall: Math.round(recall * 10000) / 10000 }
        for (const cls of prCurves) {
            // Find interpolated precision
            let prec = 0
            // PR curves go from high recall to low recall, so reverse search
            for (let i = 0; i < cls.recall.length - 1; i++) {
                const r0 = cls.recall[i], r1 = cls.recall[i + 1]
                const p0 = cls.precision[i], p1 = cls.precision[i + 1]
                const rMin = Math.min(r0, r1), rMax = Math.max(r0, r1)
                if (recall >= rMin && recall <= rMax) {
                    if (r1 === r0) { prec = p0; break }
                    const ratio = (recall - r0) / (r1 - r0)
                    prec = p0 + ratio * (p1 - p0)
                    break
                }
            }
            entry[cls.class] = Math.round(Math.max(0, prec) * 10000) / 10000
        }
        return entry
    })
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function PrecisionRecallCurves() {
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
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
                <CardContent className="relative pt-6 pb-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Kesinlik-Duyarlılık Eğrileri (Precision-Recall)
                        </h2>
                        <span className="inline-block bg-white/20 text-white text-[11px] font-mono font-bold px-3 py-0.5 rounded-full">Şekil 4.15 · Tablo 4.13</span>
                        <p className="text-xs text-white/80 max-w-2xl mx-auto">
                            Dengesiz sınıflar için ROC&apos;dan daha bilgilendirici — özellikle Backdoor_Malware (%3.1 oran) için kritik
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
                            className="text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                        >
                            {MODEL_DISPLAY[m] || m}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {modelNames.map((model) => {
                    const prCurves = data[model]?.prCurves || []
                    return (
                        <TabsContent key={model} value={model}>
                            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                                <CardContent className="pt-6 pb-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            {MODEL_DISPLAY[model] || model} — Kesinlik-Duyarlılık Eğrileri
                                        </h3>
                                        {model === "BSO-Hybrid RF" && (
                                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] border-0">
                                                Önerilen Model
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="h-[450px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={buildPrChartData(prCurves)}
                                                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                                <XAxis
                                                    dataKey="recall"
                                                    type="number"
                                                    domain={[0, 1]}
                                                    tick={{ fontSize: 10 }}
                                                    label={{ value: "Duyarlılık (Recall)", position: "bottom", fontSize: 11, offset: -5 }}
                                                />
                                                <YAxis
                                                    type="number"
                                                    domain={[0, 1]}
                                                    tick={{ fontSize: 10 }}
                                                    label={{ value: "Kesinlik (Precision)", angle: -90, position: "insideLeft", fontSize: 11 }}
                                                />
                                                <Tooltip
                                                    formatter={(value: number, name: string) => [
                                                        `${(value * 100).toFixed(1)}%`,
                                                        name === "micro-average" ? "Mikro Ortalama" : name.replace("DDoS-", "").replace("_", " "),
                                                    ]}
                                                    labelFormatter={(v: number) => `Recall: ${(v * 100).toFixed(1)}%`}
                                                    contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }}
                                                />
                                                <Legend
                                                    wrapperStyle={{ fontSize: 10 }}
                                                    formatter={(value: string) => {
                                                        const cls = prCurves.find((p) => p.class === value)
                                                        const displayName = value === "micro-average"
                                                            ? "Mikro Ortalama"
                                                            : value.replace("DDoS-", "").replace("_", " ")
                                                        return `${displayName} (AP=${cls?.ap.toFixed(4) || "?"})`
                                                    }}
                                                />
                                                {prCurves.map((cls) => (
                                                    <Line
                                                        key={cls.class}
                                                        dataKey={cls.class}
                                                        stroke={CLASS_COLORS[cls.class] || "#6366f1"}
                                                        strokeWidth={cls.class === "micro-average" ? 2.5 : 1.5}
                                                        strokeDasharray={cls.class === "micro-average" ? "6 3" : ""}
                                                        dot={false}
                                                        name={cls.class}
                                                    />
                                                ))}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* AP Table */}
                                    <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
                                        {prCurves.map((cls) => (
                                            <div
                                                key={cls.class}
                                                className="text-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                                                style={{
                                                    borderLeftColor: CLASS_COLORS[cls.class] || "#6366f1",
                                                    borderLeftWidth: 3,
                                                }}
                                            >
                                                <div className="text-lg font-black text-slate-900 dark:text-white">
                                                    {cls.ap.toFixed(4)}
                                                </div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                                                    {cls.class === "micro-average"
                                                        ? "Mikro Ort."
                                                        : cls.class.replace("DDoS-", "").replace("_", " ")}
                                                </div>
                                                <div className="text-[9px] text-slate-400 dark:text-slate-500">AP</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )
                })}
            </Tabs>

            {/* Model Comparison Table */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <CardContent className="pt-6 pb-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                        Ortalama Kesinlik (AP) Karşılaştırması — Tüm Modeller
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[11px]">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-bold text-slate-600 dark:text-slate-400">Model</th>
                                    <th className="text-center py-2 px-2 font-bold text-red-600">Backdoor</th>
                                    <th className="text-center py-2 px-2 font-bold text-green-600">Benign</th>
                                    <th className="text-center py-2 px-2 font-bold text-blue-600">ACK_Frag</th>
                                    <th className="text-center py-2 px-2 font-bold text-amber-600">SYN_Flood</th>
                                    <th className="text-center py-2 px-2 font-bold text-violet-600">PortScan</th>
                                    <th className="text-center py-2 px-2 font-bold text-cyan-600">Mikro Ort.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modelNames.map((model) => {
                                    const prCurves = data[model]?.prCurves || []
                                    const getAp = (cls: string) => prCurves.find((p) => p.class === cls)?.ap
                                    return (
                                        <tr
                                            key={model}
                                            className={`border-b border-slate-100 dark:border-slate-800 ${model === "BSO-Hybrid RF" ? "bg-indigo-50/50 dark:bg-indigo-950/20 font-bold" : ""}`}
                                        >
                                            <td className="py-2 px-3 text-slate-800 dark:text-slate-200">
                                                {MODEL_DISPLAY[model] || model}
                                            </td>
                                            <td className="text-center py-2 px-2">{getAp("Backdoor_Malware")?.toFixed(4) || "-"}</td>
                                            <td className="text-center py-2 px-2">{getAp("BenignTraffic")?.toFixed(4) || "-"}</td>
                                            <td className="text-center py-2 px-2">{getAp("DDoS-ACK_Fragmentation")?.toFixed(4) || "-"}</td>
                                            <td className="text-center py-2 px-2">{getAp("DDoS-SYN_Flood")?.toFixed(4) || "-"}</td>
                                            <td className="text-center py-2 px-2">{getAp("Recon-PortScan")?.toFixed(4) || "-"}</td>
                                            <td className="text-center py-2 px-2 font-bold">{getAp("micro-average")?.toFixed(4) || "-"}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Insight */}
            <Card className="border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                            <strong>Neden PR Eğrileri?</strong> ROC eğrileri dengesiz veri setlerinde yanıltıcı olabilir — yüksek negatif sayısı nedeniyle
                            FPR düşük kalır. PR eğrileri, azınlık sınıflarının (Backdoor_Malware: %3.1 oran) gerçek performansını daha doğru yansıtır.
                            BSO-Hibrit RF&apos;nin Backdoor AP&apos;si (0.5018) sınırlı eğitim verisi nedeniyle en düşük değerdir ancak
                            Decision Tree&apos;ye (0.1962) göre %155 daha yüksektir.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
