"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, Legend,
} from "recharts"
import { Layers, Info, Eye } from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */
interface TsnePoint {
    x: number
    y: number
    label: number
    className: string
}

interface TsneResult {
    perplexity: number
    nPoints: number
    nFeatures: number
    featureSet: string
    computeTime: number
    points: TsnePoint[]
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
}

const CLASS_DISPLAY: Record<string, string> = {
    Backdoor_Malware: "Backdoor Malware",
    BenignTraffic: "Benign Traffic",
    "DDoS-ACK_Fragmentation": "DDoS ACK Frag.",
    "DDoS-SYN_Flood": "DDoS SYN Flood",
    "Recon-PortScan": "Recon PortScan",
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function TsneVisualization() {
    const [tsneData, setTsneData] = useState<Record<string, TsneResult> | null>(null)
    const [loading, setLoading] = useState(true)
    const [perplexity, setPerplexity] = useState("perplexity_30")

    useEffect(() => {
        fetch("/curves_tsne_data.json")
            .then((r) => r.json())
            .then((d) => {
                setTsneData(d.tsne)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const currentData = useMemo(() => {
        if (!tsneData || !tsneData[perplexity]) return null
        return tsneData[perplexity]
    }, [tsneData, perplexity])

    // Group points by class for separate Scatter series
    const classGroups = useMemo(() => {
        if (!currentData) return {}
        const groups: Record<string, TsnePoint[]> = {}
        for (const p of currentData.points) {
            if (!groups[p.className]) groups[p.className] = []
            groups[p.className].push(p)
        }
        return groups
    }, [currentData])

    // Class count stats
    const classStats = useMemo(() => {
        if (!currentData) return []
        const counts: Record<string, number> = {}
        for (const p of currentData.points) {
            counts[p.className] = (counts[p.className] || 0) + 1
        }
        return Object.entries(counts).sort(([, a], [, b]) => b - a)
    }, [currentData])

    if (loading) {
        return (
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <CardContent className="pt-12 pb-12 text-center">
                    <div className="animate-pulse text-slate-400">Yükleniyor...</div>
                </CardContent>
            </Card>
        )
    }

    if (!tsneData) {
        return (
            <Card className="border border-red-200 dark:border-red-800/40 shadow-sm">
                <CardContent className="pt-6 pb-6 text-center text-red-500 text-sm">
                    curves_tsne_data.json yüklenemedi.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-0 overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600" />
                <CardContent className="relative pt-6 pb-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                            <Eye className="w-5 h-5" />
                            t-SNE Boyut İndirgeme Görselleştirmesi
                        </h2>
                        <span className="inline-block bg-white/20 text-white text-[11px] font-mono font-bold px-3 py-0.5 rounded-full">Şekil 4.16</span>
                        <p className="text-xs text-white/80 max-w-2xl mx-auto">
                            BSO tarafından seçilen 19 öznitelik ile test verisinin 2D projeksiyon haritası —
                            sınıf kümelerinin ayrılabilirliğini gösterir
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Perplexity Selector */}
            <Tabs value={perplexity} onValueChange={setPerplexity}>
                <TabsList className="h-auto p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl gap-1">
                    <TabsTrigger
                        value="perplexity_30"
                        className="text-xs px-4 py-1.5 rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                    >
                        Perplexity = 30
                    </TabsTrigger>
                    <TabsTrigger
                        value="perplexity_50"
                        className="text-xs px-4 py-1.5 rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                    >
                        Perplexity = 50
                    </TabsTrigger>
                </TabsList>

                {["perplexity_30", "perplexity_50"].map((pKey) => (
                    <TabsContent key={pKey} value={pKey}>
                        <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                            <CardContent className="pt-6 pb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-md">
                                        <Layers className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        t-SNE 2D Projeksiyon
                                    </h3>
                                    <Badge className="ml-2 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] border-0">
                                        {currentData?.nPoints.toLocaleString("tr-TR")} Nokta
                                    </Badge>
                                    <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 text-[10px] border-0">
                                        {currentData?.nFeatures} BSO Öznitelik
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 ml-11">
                                    Test verisi alt örneklemi (5.000 nokta) — perplexity={tsneData[pKey]?.perplexity},
                                    hesaplama: {tsneData[pKey]?.computeTime}s
                                </p>

                                <div className="h-[550px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                            <XAxis
                                                type="number"
                                                dataKey="x"
                                                name="t-SNE 1"
                                                tick={{ fontSize: 9 }}
                                                label={{ value: "t-SNE Bileşen 1", position: "bottom", fontSize: 10, offset: -5 }}
                                            />
                                            <YAxis
                                                type="number"
                                                dataKey="y"
                                                name="t-SNE 2"
                                                tick={{ fontSize: 9 }}
                                                label={{ value: "t-SNE Bileşen 2", angle: -90, position: "insideLeft", fontSize: 10 }}
                                            />
                                            <Tooltip
                                                contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }}
                                                formatter={(value: number, name: string) => [value.toFixed(2), name]}
                                                labelFormatter={() => ""}
                                                content={({ payload }) => {
                                                    if (!payload || payload.length === 0) return null
                                                    const p = payload[0]?.payload as TsnePoint
                                                    if (!p) return null
                                                    return (
                                                        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-[11px]">
                                                            <div className="font-bold" style={{ color: CLASS_COLORS[p.className] }}>
                                                                {CLASS_DISPLAY[p.className] || p.className}
                                                            </div>
                                                            <div className="text-slate-500 mt-1">
                                                                t-SNE 1: {p.x.toFixed(2)} | t-SNE 2: {p.y.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    )
                                                }}
                                            />
                                            <Legend
                                                wrapperStyle={{ fontSize: 10 }}
                                                payload={Object.keys(classGroups).map((cn) => ({
                                                    value: `${CLASS_DISPLAY[cn] || cn} (${classGroups[cn]?.length || 0})`,
                                                    type: "circle" as const,
                                                    color: CLASS_COLORS[cn] || "#6366f1",
                                                }))}
                                            />
                                            {Object.entries(classGroups).map(([className, points]) => (
                                                <Scatter
                                                    key={className}
                                                    name={CLASS_DISPLAY[className] || className}
                                                    data={points}
                                                    fill={CLASS_COLORS[className] || "#6366f1"}
                                                    fillOpacity={0.6}
                                                    r={2.5}
                                                >
                                                    {points.map((_, idx) => (
                                                        <Cell
                                                            key={idx}
                                                            fill={CLASS_COLORS[className] || "#6366f1"}
                                                            fillOpacity={0.55}
                                                        />
                                                    ))}
                                                </Scatter>
                                            ))}
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Class distribution legend */}
                                <div className="mt-4 grid grid-cols-5 gap-2">
                                    {classStats.map(([cn, count]) => (
                                        <div
                                            key={cn}
                                            className="text-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                                            style={{ borderLeftColor: CLASS_COLORS[cn], borderLeftWidth: 3 }}
                                        >
                                            <div className="text-lg font-black text-slate-900 dark:text-white">
                                                {count.toLocaleString("tr-TR")}
                                            </div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                                                {CLASS_DISPLAY[cn] || cn}
                                            </div>
                                            <div className="text-[9px] text-slate-400">
                                                %{((count / (currentData?.nPoints || 1)) * 100).toFixed(1)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Technical info */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <CardContent className="pt-5 pb-5">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
                        t-SNE Parametreleri
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { key: "Algoritma", value: "t-SNE (Barnes-Hut)" },
                            { key: "Bileşen Sayısı", value: "2" },
                            { key: "Başlatma", value: "PCA" },
                            { key: "Maksimum İterasyon", value: "1.000" },
                            { key: "Öğrenme Oranı", value: "auto" },
                            { key: "Giriş Öznitelikleri", value: "19 (BSO seçimi)" },
                            { key: "Örneklem", value: "5.000 test noktası" },
                            { key: "Random Seed", value: "42" },
                        ].map((item) => (
                            <div key={item.key} className="flex justify-between items-center py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">{item.key}</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Insight */}
            <Card className="border border-purple-200 dark:border-purple-800/40 bg-purple-50/50 dark:bg-purple-950/20">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <div className="text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed">
                            <strong>t-SNE Yorumu:</strong> BSO tarafından seçilen 19 öznitelik, 5 saldırı sınıfını 2D uzayda belirgin kümelere ayırabilmektedir.
                            <strong> DDoS-ACK_Fragmentation</strong> ve <strong>DDoS-SYN_Flood</strong> sınıfları net ayrım gösterirken,
                            <strong> BenignTraffic</strong> ve <strong>Recon-PortScan</strong> arasında kısmi örtüşme gözlemlenir — bu, %80.92 F1-skoru
                            ile daha düşük performansı açıklar.
                            <strong> Backdoor_Malware</strong> noktaları diğer kümelere dağılmıştır — bu, düşük F1 (%57.40) skorunun
                            sınıfın karmaşık ve örtüşen doğasından kaynaklandığını görsel olarak doğrular.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
