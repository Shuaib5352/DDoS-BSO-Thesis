"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell,
    ComposedChart, Scatter, ReferenceLine,
} from "recharts"
import {
    Shuffle, AlertTriangle, TrendingDown, Clock, Zap, CheckCircle2,
    Activity, Gauge, Timer, Eye, Shield, BarChart3, Waves, Brain,
} from "lucide-react"
import { DYNAMIC_ENVIRONMENT } from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   Concept Drift Simulation — Dynamic Environment Analysis
   Uses real DYNAMIC_ENVIRONMENT data to simulate temporal drift
   ═══════════════════════════════════════════════════════════════ */

// ── Simulated time windows for concept drift ──
function buildConceptDriftData() {
    const { noiseRobustness, learningCurve } = DYNAMIC_ENVIRONMENT
    // Simulate 12 time windows where attack distribution shifts
    const windows = [
        { window: "T1", period: "0–2 saat", driftType: "Yok", noiseIdx: 0, attackMix: "Kararlı", retrain: false },
        { window: "T2", period: "2–4 saat", driftType: "Yok", noiseIdx: 0, attackMix: "Kararlı", retrain: false },
        { window: "T3", period: "4–6 saat", driftType: "Ani Kayma", noiseIdx: 1, attackMix: "SYN ↑ %40", retrain: false },
        { window: "T4", period: "6–8 saat", driftType: "Ani Kayma", noiseIdx: 2, attackMix: "ACK Frag ↑", retrain: false },
        { window: "T5", period: "8–10 saat", driftType: "Kademeli", noiseIdx: 3, attackMix: "Karışık", retrain: false },
        { window: "T6", period: "10–12 saat", driftType: "Kademeli", noiseIdx: 3, attackMix: "Yeni Varyant", retrain: true },
        { window: "T7", period: "12–14 saat", driftType: "Yeniden Eğitim", noiseIdx: 0, attackMix: "Kararlı", retrain: true },
        { window: "T8", period: "14–16 saat", driftType: "Tekrarlayan", noiseIdx: 1, attackMix: "SYN Tekrar", retrain: false },
        { window: "T9", period: "16–18 saat", driftType: "Tekrarlayan", noiseIdx: 2, attackMix: "ACK Tekrar", retrain: false },
        { window: "T10", period: "18–20 saat", driftType: "Ani Kayma", noiseIdx: 4, attackMix: "Yoğun Saldırı", retrain: false },
        { window: "T11", period: "20–22 saat", driftType: "Kademeli", noiseIdx: 5, attackMix: "Polimorfik", retrain: false },
        { window: "T12", period: "22–24 saat", driftType: "Yeniden Eğitim", noiseIdx: 0, attackMix: "Kararlı", retrain: true },
    ]

    return windows.map((w) => ({
        ...w,
        accuracy: noiseRobustness[w.noiseIdx].accuracy,
        f1Macro: noiseRobustness[w.noiseIdx].f1Macro,
        degradation: noiseRobustness[w.noiseIdx].degradation,
    }))
}

// ── Color map for drift types ──
const DRIFT_COLORS: Record<string, string> = {
    "Yok": "#10b981",
    "Ani Kayma": "#ef4444",
    "Kademeli": "#f59e0b",
    "Tekrarlayan": "#8b5cf6",
    "Yeniden Eğitim": "#3b82f6",
}

const DRIFT_LABELS: Record<string, string> = {
    "Yok": "Kararlı Ortam",
    "Ani Kayma": "Sudden Drift",
    "Kademeli": "Gradual Drift",
    "Tekrarlayan": "Recurring Drift",
    "Yeniden Eğitim": "After Retraining",
}

export default function ConceptDriftSimulation() {
    const [selectedDriftType, setSelectedDriftType] = useState<string | null>(null)

    const conceptDriftData = useMemo(() => buildConceptDriftData(), [])
    const { noiseRobustness, unknownAttackDetection, throughput, learningCurve } = DYNAMIC_ENVIRONMENT

    // Noise robustness chart data
    const noiseData = noiseRobustness.map((n) => ({
        ...n,
        noisePct: `%${(n.noiseLevel * 100).toFixed(0)}`,
    }))

    // Throughput chart data
    const throughputData = throughput.map((t) => ({
        ...t,
        batchLabel: t.batchSize.toLocaleString("tr-TR"),
        kSamplesPerSec: (t.samplesPerSecond / 1000).toFixed(1),
    }))

    // Learning curve chart
    const learningData = learningCurve.map((l) => ({
        ...l,
        fractionPct: `%${(l.fraction * 100).toFixed(0)}`,
        nSamplesLabel: (l.nSamples / 1000).toFixed(1) + "K",
    }))

    // Filter drift data
    const filteredDrift = selectedDriftType
        ? conceptDriftData.filter((d) => d.driftType === selectedDriftType)
        : conceptDriftData

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Shuffle className="w-8 h-8 text-amber-500" />
                    Kavram Kayması ve Dinamik Ortam Simülasyonu
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    BSO-Hybrid RF modelinin değişen ağ koşullarında dayanıklılık analizi — gürültü, bilinmeyen saldırı, verimlilik ve kavram kayması senaryoları
                </p>
            </div>

            {/* ════════════════════ ÖZET METRİKLER ════════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-emerald-200 dark:border-emerald-800/40">
                    <CardContent className="pt-4 pb-4 text-center">
                        <Shield className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">%89.82</div>
                        <div className="text-xs text-slate-500 mt-1">Temiz Veri Doğruluğu</div>
                    </CardContent>
                </Card>
                <Card className="border-red-200 dark:border-red-800/40">
                    <CardContent className="pt-4 pb-4 text-center">
                        <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-black text-red-600 dark:text-red-400">%30.50</div>
                        <div className="text-xs text-slate-500 mt-1">Max Bozulma (@%30 Gürültü)</div>
                    </CardContent>
                </Card>
                <Card className="border-blue-200 dark:border-blue-800/40">
                    <CardContent className="pt-4 pb-4 text-center">
                        <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400">231K</div>
                        <div className="text-xs text-slate-500 mt-1">Maks Örnekler/sn</div>
                    </CardContent>
                </Card>
                <Card className="border-purple-200 dark:border-purple-800/40">
                    <CardContent className="pt-4 pb-4 text-center">
                        <Eye className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-black text-purple-600 dark:text-purple-400">%68.92</div>
                        <div className="text-xs text-slate-500 mt-1">Ort. Bilinmeyen Saldırı Tespiti</div>
                    </CardContent>
                </Card>
            </div>

            {/* ════════════════════ KAVRAM KAYMASI SİMÜLASYONU ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Waves className="w-5 h-5 text-amber-500" />
                        24 Saatlik Kavram Kayması Simülasyonu
                    </CardTitle>
                    <CardDescription>
                        Zaman penceresi boyunca saldırı dağılımı değişimleri ve model doğruluğuna etkileri
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Drift type filter */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge
                            variant={selectedDriftType === null ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSelectedDriftType(null)}
                        >
                            Tümü ({conceptDriftData.length})
                        </Badge>
                        {Object.entries(DRIFT_COLORS).map(([type, color]) => (
                            <Badge
                                key={type}
                                variant={selectedDriftType === type ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSelectedDriftType(selectedDriftType === type ? null : type)}
                                style={selectedDriftType === type ? { backgroundColor: color } : {}}
                            >
                                <div className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: color }} />
                                {type} ({conceptDriftData.filter((d) => d.driftType === type).length})
                            </Badge>
                        ))}
                    </div>

                    <ResponsiveContainer width="100%" height={380}>
                        <ComposedChart data={conceptDriftData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="window" tick={{ fontSize: 11 }} />
                            <YAxis
                                yAxisId="acc"
                                domain={[50, 95]}
                                tick={{ fontSize: 11 }}
                                tickFormatter={(v: number) => `%${v}`}
                                label={{ value: "Doğruluk (%)", angle: -90, position: "insideLeft", offset: -5 }}
                            />
                            <YAxis
                                yAxisId="deg"
                                orientation="right"
                                domain={[0, 35]}
                                tick={{ fontSize: 11 }}
                                tickFormatter={(v: number) => `%${v}`}
                                label={{ value: "Bozulma (%)", angle: 90, position: "insideRight", offset: 0 }}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload?.length) return null
                                    const d = payload[0].payload
                                    return (
                                        <div className="rounded-xl border bg-white dark:bg-slate-900 shadow-lg p-3 text-xs">
                                            <div className="font-bold text-sm mb-1">{d.window} · {d.period}</div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DRIFT_COLORS[d.driftType] }} />
                                                <span className="font-semibold">{d.driftType}</span>
                                                <span className="text-slate-400">({DRIFT_LABELS[d.driftType]})</span>
                                            </div>
                                            <div>Saldırı: <span className="font-medium">{d.attackMix}</span></div>
                                            <div>Doğruluk: <span className="font-bold text-emerald-600">%{d.accuracy}</span></div>
                                            <div>Bozulma: <span className="font-bold text-red-600">%{d.degradation}</span></div>
                                            {d.retrain && <div className="text-blue-500 font-bold mt-1">🔄 Yeniden Eğitim Uygulandı</div>}
                                        </div>
                                    )
                                }}
                            />
                            <Legend />
                            <ReferenceLine yAxisId="acc" y={89.82} stroke="#10b981" strokeDasharray="5 5" label={{ value: "Temiz: %89.82", position: "right", fontSize: 10 }} />
                            <Area
                                yAxisId="acc"
                                type="monotone"
                                dataKey="accuracy"
                                fill="#6366f133"
                                stroke="#6366f1"
                                strokeWidth={2.5}
                                name="Doğruluk (%)"
                                dot={(props: any) => {
                                    const { cx, cy, payload } = props
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={payload.retrain ? 6 : 4}
                                            fill={DRIFT_COLORS[payload.driftType]}
                                            stroke="white"
                                            strokeWidth={2}
                                        />
                                    )
                                }}
                            />
                            <Bar yAxisId="deg" dataKey="degradation" name="Bozulma (%)" barSize={24} radius={[4, 4, 0, 0]}>
                                {conceptDriftData.map((entry, i) => (
                                    <Cell key={i} fill={DRIFT_COLORS[entry.driftType]} opacity={0.6} />
                                ))}
                            </Bar>
                        </ComposedChart>
                    </ResponsiveContainer>

                    {/* Timeline legend */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {conceptDriftData.map((d) => (
                            <div
                                key={d.window}
                                className={`p-2.5 rounded-lg border text-xs ${d.retrain
                                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                                        : "bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700"
                                    }`}
                            >
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: DRIFT_COLORS[d.driftType] }} />
                                    <span className="font-bold">{d.window}</span>
                                    <span className="text-slate-400">{d.period}</span>
                                </div>
                                <div className="text-slate-500">{d.attackMix}</div>
                                {d.retrain && <Badge className="text-[8px] mt-1 bg-blue-500">Retrain</Badge>}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ GÜRÜLTÜ DAYANIKLILIĞI ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Gürültü Dayanıklılık Analizi (Noise Robustness)
                    </CardTitle>
                    <CardDescription>
                        Artan Gauss gürültü seviyelerine karşı model performansının bozulması
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={340}>
                        <ComposedChart data={noiseData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="noisePct" tick={{ fontSize: 11 }} label={{ value: "Gürültü Seviyesi", position: "insideBottomRight", offset: -5 }} />
                            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={(v: number) => `%${v}`} />
                            <Tooltip
                                formatter={(value: number, name: string) => [
                                    `%${value.toFixed(2)}`,
                                    name === "accuracy" ? "Doğruluk" : name === "f1Macro" ? "F1-Makro" : "Bozulma",
                                ]}
                            />
                            <Legend formatter={(v: string) => v === "accuracy" ? "Doğruluk" : v === "f1Macro" ? "F1-Makro" : "Bozulma"} />
                            <Area type="monotone" dataKey="accuracy" fill="#6366f122" stroke="#6366f1" strokeWidth={2.5} name="accuracy" />
                            <Line type="monotone" dataKey="f1Macro" stroke="#10b981" strokeWidth={2} name="f1Macro" dot={{ r: 4 }} />
                            <Bar dataKey="degradation" fill="#ef444455" name="degradation" barSize={20} radius={[4, 4, 0, 0]} />
                        </ComposedChart>
                    </ResponsiveContainer>

                    {/* Noise table */}
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-300 dark:border-slate-600">
                                    <th className="text-left py-2 px-3">Gürültü</th>
                                    <th className="text-center py-2 px-3">Doğruluk</th>
                                    <th className="text-center py-2 px-3">F1-Makro</th>
                                    <th className="text-center py-2 px-3">Bozulma</th>
                                    <th className="text-left py-2 px-3">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {noiseRobustness.map((n) => (
                                    <tr key={n.noiseLevel} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="py-2 px-3 font-mono font-bold">%{(n.noiseLevel * 100).toFixed(0)}</td>
                                        <td className="text-center py-2 px-3 font-bold">{n.accuracy}%</td>
                                        <td className="text-center py-2 px-3">{n.f1Macro}%</td>
                                        <td className="text-center py-2 px-3">
                                            <Badge variant={n.degradation === 0 ? "default" : n.degradation < 25 ? "secondary" : "destructive"}>
                                                %{n.degradation}
                                            </Badge>
                                        </td>
                                        <td className="py-2 px-3">
                                            {n.degradation === 0 ? (
                                                <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Temiz</span>
                                            ) : n.degradation < 25 ? (
                                                <span className="flex items-center gap-1 text-amber-600"><AlertTriangle className="w-3 h-3" /> Orta</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-600"><AlertTriangle className="w-3 h-3" /> Yüksek</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ BİLİNMEYEN SALDIRI TESPİTİ ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-500" />
                        Bilinmeyen Saldırı Tespiti (Leave-One-Out)
                    </CardTitle>
                    <CardDescription>
                        Eğitimde hiç görülmemiş saldırı tiplerini tespit etme yeteneği
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={unknownAttackDetection} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="excludedAttack" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={60} />
                            <YAxis domain={[0, 105]} tick={{ fontSize: 11 }} tickFormatter={(v: number) => `%${v}`} />
                            <Tooltip
                                formatter={(value: number, name: string) => [`%${value}`, "Tespit Oranı"]}
                                labelFormatter={(label) => `Dışlanan: ${label}`}
                            />
                            <Bar dataKey="detectionRate" name="Tespit Oranı" radius={[8, 8, 0, 0]}>
                                {unknownAttackDetection.map((entry, i) => (
                                    <Cell
                                        key={i}
                                        fill={
                                            entry.detectionRate > 90
                                                ? "#10b981"
                                                : entry.detectionRate > 50
                                                    ? "#f59e0b"
                                                    : "#ef4444"
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {unknownAttackDetection.map((u) => (
                            <div
                                key={u.excludedAttack}
                                className={`p-3 rounded-lg border ${u.detectionRate > 90
                                        ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200"
                                        : u.detectionRate > 50
                                            ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200"
                                            : "bg-red-50 dark:bg-red-950/20 border-red-200"
                                    }`}
                            >
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{u.excludedAttack}</div>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-lg font-black" style={{
                                        color: u.detectionRate > 90 ? "#10b981" : u.detectionRate > 50 ? "#f59e0b" : "#ef4444"
                                    }}>
                                        %{u.detectionRate}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{u.unknownSamples.toLocaleString("tr-TR")} örnek</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ VERİMLİLİK VE ÖĞRENME ════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Throughput */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Zap className="w-4 h-4 text-blue-500" />
                            Çıktı Hızı (Throughput)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={throughputData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="batchLabel" tick={{ fontSize: 10 }} />
                                <YAxis
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                                    label={{ value: "Örnek/sn", angle: -90, position: "insideLeft", offset: -5, fontSize: 10 }}
                                />
                                <Tooltip
                                    formatter={(value: number) => [value.toLocaleString("tr-TR"), "Örnek/sn"]}
                                    labelFormatter={(label) => `Batch: ${label}`}
                                />
                                <Bar dataKey="samplesPerSecond" name="Örnek/sn" radius={[6, 6, 0, 0]}>
                                    {throughputData.map((_, i) => (
                                        <Cell key={i} fill={["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#3b82f6"][i]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Learning Curve */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Brain className="w-4 h-4 text-emerald-500" />
                            Öğrenme Eğrisi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={learningData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="nSamplesLabel" tick={{ fontSize: 10 }} />
                                <YAxis domain={[87, 91]} tick={{ fontSize: 10 }} tickFormatter={(v: number) => `%${v}`} />
                                <Tooltip
                                    formatter={(value: number, name: string) => [
                                        name === "accuracy" ? `%${value}` : name === "trainingTime" ? `${value}s` : `%${value}`,
                                        name === "accuracy" ? "Doğruluk" : name === "trainingTime" ? "Eğitim Süresi" : "F1-Makro"
                                    ]}
                                />
                                <Legend formatter={(v: string) => v === "accuracy" ? "Doğruluk" : "F1-Makro"} />
                                <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} name="accuracy" />
                                <Line type="monotone" dataKey="f1Macro" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="f1Macro" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* ════════════════════ SONUÇ PANELİ ════════════════════ */}
            <Card className="border-amber-200 dark:border-amber-800/40 bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                        <BarChart3 className="w-5 h-5 text-amber-500" />
                        Dinamik Ortam Sonuçları
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/40">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" /> Gürültü Etkisi
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                Model %5 gürültüde bile %24.09 doğruluk kaybı yaşıyor — bu, gerçek zamanlı ortamlarda
                                <strong> veri ön işleme ve gürültü filtrelemenin kritik önemini</strong> gösteriyor.
                                %30 gürültüde doğruluk %59.32&apos;ye düşüyor.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/40">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
                                <Eye className="w-4 h-4 text-purple-500" /> Bilinmeyen Saldırı
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                DDoS tabanlı saldırılar (SYN: %100, ACK: %99.98) mükemmel tespit ediliyor.
                                Ancak Recon-PortScan (%9.86) ve Backdoor (%65.84) düşük kaldı —
                                <strong> transfer öğrenme ve anomali tabanlı hibrit yaklaşımlar</strong> gerekebilir.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/40">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-blue-500" /> Gerçek Zamanlı Potansiyel
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                20K+ batch boyutuyla saniyede 231K+ örnek işleyebilen model,
                                <strong> gerçek zamanlı ağ izleme için yeterli kapasiteye</strong> sahip.
                                Öğrenme eğrisi %10 veriyle bile %88.13 doğruluk gösteriyor.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
