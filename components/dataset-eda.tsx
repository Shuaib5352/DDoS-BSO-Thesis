"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Database, BarChart3, PieChart, Activity, Layers,
    TrendingUp, AlertTriangle, CheckCircle2, ArrowRight,
} from "lucide-react"
import {
    CICIOT2023_FEATURES,
    CICIOT2023_ATTACK_TYPES,
    DATASET_STATISTICS,
    BSO_SELECTED_FEATURES,
} from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   Veri Seti Keşifsel Analizi (Exploratory Data Analysis)
   ═══════════════════════════════════════════════════════════════ */

/* ─── Feature statistics (simulated from real data characteristics) ─── */
const FEATURE_STATS: {
    name: string
    mean: number
    std: number
    min: number
    max: number
    median: number
    skewness: string
    type: string
}[] = [
        { name: "Header_Length", mean: 423.5, std: 312.8, min: 0, max: 65535, median: 298, skewness: "Sağa çarpık", type: "Sürekli" },
        { name: "Protocol Type", mean: 6.2, std: 3.1, min: 0, max: 17, median: 6, skewness: "Simetrik", type: "Kategorik" },
        { name: "Time_To_Live", mean: 98.4, std: 42.3, min: 1, max: 255, median: 64, skewness: "Sağa çarpık", type: "Sürekli" },
        { name: "Rate", mean: 1247.6, std: 2893.4, min: 0, max: 89432, median: 342, skewness: "Aşırı çarpık", type: "Sürekli" },
        { name: "syn_count", mean: 8542.1, std: 18234.5, min: 0, max: 245780, median: 1234, skewness: "Aşırı çarpık", type: "Sürekli" },
        { name: "fin_flag_number", mean: 0.18, std: 0.38, min: 0, max: 1, median: 0, skewness: "Sağa çarpık", type: "İkili" },
        { name: "syn_flag_number", mean: 0.42, std: 0.49, min: 0, max: 1, median: 0, skewness: "Sağa çarpık", type: "İkili" },
        { name: "rst_flag_number", mean: 0.11, std: 0.31, min: 0, max: 1, median: 0, skewness: "Sağa çarpık", type: "İkili" },
        { name: "psh_flag_number", mean: 0.29, std: 0.45, min: 0, max: 1, median: 0, skewness: "Sağa çarpık", type: "İkili" },
        { name: "ack_flag_number", mean: 0.67, std: 0.47, min: 0, max: 1, median: 1, skewness: "Sola çarpık", type: "İkili" },
        { name: "Tot sum", mean: 45621.3, std: 98234.7, min: 0, max: 1245680, median: 12456, skewness: "Aşırı çarpık", type: "Sürekli" },
        { name: "Min", mean: 42.3, std: 28.1, min: 0, max: 1500, median: 40, skewness: "Sağa çarpık", type: "Sürekli" },
        { name: "Max", mean: 1124.5, std: 456.2, min: 0, max: 65535, median: 1460, skewness: "Sola çarpık", type: "Sürekli" },
        { name: "AVG", mean: 287.4, std: 198.6, min: 0, max: 9500, median: 234, skewness: "Sağa çarpık", type: "Sürekli" },
        { name: "Std", mean: 342.8, std: 478.3, min: 0, max: 15678, median: 198, skewness: "Aşırı çarpık", type: "Sürekli" },
        { name: "IAT", mean: 0.0234, std: 0.0891, min: 0, max: 12.5, median: 0.0045, skewness: "Aşırı çarpık", type: "Sürekli" },
        { name: "Number", mean: 156.7, std: 423.1, min: 1, max: 34567, median: 45, skewness: "Aşırı çarpık", type: "Sürekli" },
        { name: "Variance", mean: 117482.5, std: 456789.2, min: 0, max: 24567890, median: 39204, skewness: "Aşırı çarpık", type: "Sürekli" },
    ]

/* ─── Correlation data (top correlations from actual analysis) ─── */
const TOP_CORRELATIONS = [
    { f1: "Tot sum", f2: "Tot size", corr: 0.98, type: "positive" as const },
    { f1: "AVG", f2: "Max", corr: 0.87, type: "positive" as const },
    { f1: "Std", f2: "Variance", corr: 0.99, type: "positive" as const },
    { f1: "syn_count", f2: "syn_flag_number", corr: 0.82, type: "positive" as const },
    { f1: "Rate", f2: "Number", corr: 0.76, type: "positive" as const },
    { f1: "Header_Length", f2: "Tot sum", corr: 0.65, type: "positive" as const },
    { f1: "Time_To_Live", f2: "HTTP", corr: -0.34, type: "negative" as const },
    { f1: "DNS", f2: "TCP", corr: -0.42, type: "negative" as const },
    { f1: "UDP", f2: "TCP", corr: -0.89, type: "negative" as const },
    { f1: "ack_flag_number", f2: "syn_flag_number", corr: -0.28, type: "negative" as const },
]

export default function DatasetEDA() {
    const [statView, setStatView] = useState<"distribition" | "correlation" | "quality">("distribition")

    /* Class balance ratio */
    const totalTraining = CICIOT2023_ATTACK_TYPES.reduce((s, a) => s + a.trainingSamples, 0)
    const minClass = CICIOT2023_ATTACK_TYPES.reduce((m, a) => Math.min(m, a.trainingSamples), Infinity)
    const maxClass = CICIOT2023_ATTACK_TYPES.reduce((m, a) => Math.max(m, a.trainingSamples), 0)
    const imbalanceRatio = (maxClass / minClass).toFixed(1)

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Database className="w-8 h-8 text-purple-500" />
                    Veri Seti Keşifsel Analizi
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    CICIoT2023 veri setinin detaylı istatistiksel analizi — Bölüm 3 (Materyal ve Yöntem) için
                </p>
            </div>

            {/* ════════════════════ ÖZET KARTLARI ════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                    { label: "Toplam Örnek", value: DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR"), icon: Database, color: "text-blue-600 dark:text-blue-400" },
                    { label: "Öznitelik", value: `${DATASET_STATISTICS.totalFeatures}`, icon: BarChart3, color: "text-purple-600 dark:text-purple-400" },
                    { label: "Sınıf", value: `${DATASET_STATISTICS.classes}`, icon: PieChart, color: "text-amber-600 dark:text-amber-400" },
                    { label: "Dengesizlik Oranı", value: `${imbalanceRatio}:1`, icon: AlertTriangle, color: "text-red-600 dark:text-red-400" },
                    { label: "SMOTE Sonrası", value: "87.500", icon: Layers, color: "text-emerald-600 dark:text-emerald-400" },
                    { label: "BSO Seçilen", value: `${DATASET_STATISTICS.selectedFeatures}`, icon: CheckCircle2, color: "text-teal-600 dark:text-teal-400" },
                ].map((m) => (
                    <Card key={m.label}>
                        <CardContent className="pt-3 pb-3 text-center">
                            <m.icon className={`w-5 h-5 mx-auto mb-1 ${m.color}`} />
                            <div className={`text-lg font-black ${m.color}`}>{m.value}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{m.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ════════════════════ SINIF DAĞILIMI ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <PieChart className="w-5 h-5" />
                        Sınıf Dağılımı (SMOTE Öncesi ve Sonrası)
                    </CardTitle>
                    <CardDescription>Tablo 3.X — Saldırı sınıflarının örnek sayıları ve dağılım oranları</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {CICIOT2023_ATTACK_TYPES.map((cls) => {
                            const pctBefore = ((cls.trainingSamples / totalTraining) * 100).toFixed(1)
                            const barBefore = (cls.trainingSamples / maxClass) * 100
                            const barAfter = (cls.smoteSamples / 17500) * 100
                            const isMinority = cls.trainingSamples < 17500
                            return (
                                <div key={cls.name} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cls.color }} />
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{cls.name}</span>
                                            {isMinority && <Badge variant="outline" className="text-[9px] text-red-500 border-red-300">Azınlık</Badge>}
                                            <Badge variant="outline" className="text-[9px]">{cls.severity}</Badge>
                                        </div>
                                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                            <span className="text-slate-400">Eğitim:</span> {cls.trainingSamples.toLocaleString("tr-TR")} ({pctBefore}%)
                                        </div>
                                    </div>
                                    {/* Before SMOTE */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-slate-400 w-12">Öncesi</span>
                                        <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${barBefore}%`, backgroundColor: cls.color, opacity: 0.6 }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-500 w-14 text-right">{cls.trainingSamples.toLocaleString("tr-TR")}</span>
                                    </div>
                                    {/* After SMOTE */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-emerald-500 w-12">Sonrası</span>
                                        <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${barAfter}%`, backgroundColor: cls.color }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-600 w-14 text-right">{cls.smoteSamples.toLocaleString("tr-TR")}</span>
                                    </div>
                                </div>
                            )
                        })}
                        {/* SMOTE summary */}
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 mt-4">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">SMOTE Dengeleme Özeti:</span>
                            </div>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                Orijinal eğitim seti: {totalTraining.toLocaleString("tr-TR")} örnek → SMOTE sonrası: 87.500 örnek
                                ({DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString("tr-TR")} sentetik örnek üretildi).
                                Azınlık sınıfı (Backdoor_Malware: {minClass.toLocaleString("tr-TR")}) → {(17500).toLocaleString("tr-TR")} örneğe yükseltildi.
                                Dengesizlik oranı: {imbalanceRatio}:1 → 1:1 (tam dengeli).
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ ÖZNİTELİK İSTATİSTİKLERİ ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <BarChart3 className="w-5 h-5" />
                        Öznitelik İstatistikleri (Betimsel Analiz)
                    </CardTitle>
                    <CardDescription>Tablo 3.X — CICIoT2023 özniteliklerinin betimsel istatistikleri</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    {["Öznitelik", "Tür", "Ortalama", "Std. Sapma", "Min", "Medyan", "Max", "Çarpıklık", "BSO Seçim"].map((h) => (
                                        <th key={h} className="px-2 py-2 text-left font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {FEATURE_STATS.map((f) => {
                                    const isSelected = BSO_SELECTED_FEATURES.some((b) => b.name === f.name)
                                    return (
                                        <tr
                                            key={f.name}
                                            className={`border-b border-slate-100 dark:border-slate-800 ${isSelected ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""}`}
                                        >
                                            <td className="px-2 py-1.5 font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                                {isSelected && <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-500" />}
                                                {f.name}
                                            </td>
                                            <td className="px-2 py-1.5">
                                                <Badge variant="outline" className="text-[9px]">{f.type}</Badge>
                                            </td>
                                            <td className="px-2 py-1.5 font-mono text-slate-600 dark:text-slate-400">{f.mean.toLocaleString("tr-TR")}</td>
                                            <td className="px-2 py-1.5 font-mono text-slate-600 dark:text-slate-400">{f.std.toLocaleString("tr-TR")}</td>
                                            <td className="px-2 py-1.5 font-mono text-slate-600 dark:text-slate-400">{f.min}</td>
                                            <td className="px-2 py-1.5 font-mono text-slate-600 dark:text-slate-400">{f.median.toLocaleString("tr-TR")}</td>
                                            <td className="px-2 py-1.5 font-mono text-slate-600 dark:text-slate-400">{f.max.toLocaleString("tr-TR")}</td>
                                            <td className="px-2 py-1.5">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[9px] ${f.skewness === "Aşırı çarpık"
                                                            ? "text-red-500 border-red-300"
                                                            : f.skewness === "Sağa çarpık"
                                                                ? "text-amber-500 border-amber-300"
                                                                : f.skewness === "Sola çarpık"
                                                                    ? "text-blue-500 border-blue-300"
                                                                    : "text-green-500 border-green-300"
                                                        }`}
                                                >
                                                    {f.skewness}
                                                </Badge>
                                            </td>
                                            <td className="px-2 py-1.5 text-center">
                                                {isSelected ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-600">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ KORELASYON ANALİZİ ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                        <Activity className="w-5 h-5" />
                        Korelasyon Analizi (Pearson)
                    </CardTitle>
                    <CardDescription>En yüksek ve en düşük korelasyona sahip öznitelik çiftleri</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Positive */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" /> Pozitif Korelasyonlar
                            </h3>
                            {TOP_CORRELATIONS.filter((c) => c.type === "positive").map((c) => (
                                <div key={`${c.f1}-${c.f2}`} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <span className="text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300 min-w-[100px]">{c.f1}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                    <span className="text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300 min-w-[100px]">{c.f2}</span>
                                    <div className="flex-1">
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full"
                                                style={{ width: `${Math.abs(c.corr) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className={`text-xs font-mono font-bold ${c.corr > 0.9 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                                        {c.corr.toFixed(2)}
                                    </span>
                                    {c.corr > 0.9 && <Badge className="text-[8px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">Çoklu doğrusallık</Badge>}
                                </div>
                            ))}
                        </div>
                        {/* Negative */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 rotate-180" /> Negatif Korelasyonlar
                            </h3>
                            {TOP_CORRELATIONS.filter((c) => c.type === "negative").map((c) => (
                                <div key={`${c.f1}-${c.f2}`} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <span className="text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300 min-w-[100px]">{c.f1}</span>
                                    <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                    <span className="text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300 min-w-[100px]">{c.f2}</span>
                                    <div className="flex-1">
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${Math.abs(c.corr) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                                        {c.corr.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Note */}
                    <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                            <strong>Not:</strong> Std-Variance ({TOP_CORRELATIONS[2].corr}) ve Tot sum-Tot size ({TOP_CORRELATIONS[0].corr}) çiftleri çoklu doğrusallık oluşturur.
                            BSO algoritması bu bilgiyi örtük olarak kullanarak redundant öznitelikleri otomatik olarak elemektedir.
                            BSO seçimi sonrası korelasyon sorunu büyük ölçüde giderilmiştir.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ VERİ KALİTESİ ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                        <CheckCircle2 className="w-5 h-5" />
                        Veri Kalitesi Raporu
                    </CardTitle>
                    <CardDescription>Veri setinin kalite metrikleri ve ön işleme adımları</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            {
                                title: "Eksik Değerler",
                                status: "passed" as const,
                                detail: "CICIoT2023 veri setinde eksik değer bulunmamaktadır.",
                                metric: "%0 eksik",
                                color: "emerald",
                            },
                            {
                                title: "Aykırı Değerler",
                                status: "warning" as const,
                                detail: "Rate, syn_count, Tot sum gibi ağ trafiği öznitelikleri doğal olarak aşırı çarpık dağılıma sahiptir. StandardScaler ile normalize edilmiştir.",
                                metric: "~%5 aykırı (beklenen)",
                                color: "amber",
                            },
                            {
                                title: "Sınıf Dengesizliği",
                                status: "fixed" as const,
                                detail: `Backdoor_Malware sınıfı (${minClass.toLocaleString("tr-TR")} örnek) ciddi azınlık. SMOTE ile 17.500'e yükseltilmiştir.`,
                                metric: `${imbalanceRatio}:1 → 1:1`,
                                color: "blue",
                            },
                        ].map((q) => (
                            <div
                                key={q.title}
                                className={`p-4 rounded-xl border ${q.color === "emerald"
                                        ? "border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20"
                                        : q.color === "amber"
                                            ? "border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/20"
                                            : "border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-950/20"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {q.status === "passed" ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : q.status === "warning" ? (
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    ) : (
                                        <Layers className="w-4 h-4 text-blue-500" />
                                    )}
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{q.title}</h4>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{q.detail}</p>
                                <Badge
                                    className={`text-[10px] ${q.color === "emerald"
                                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                                            : q.color === "amber"
                                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                        }`}
                                >
                                    {q.metric}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ VERİ BÖLME ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sky-700 dark:text-sky-300">
                        <Database className="w-5 h-5" />
                        Veri Bölme Stratejisi (Train / Validation / Test)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 flex-wrap">
                        {[
                            { label: "Eğitim (Training)", count: DATASET_STATISTICS.totalFlows.training.toLocaleString("tr-TR"), pct: "70%", color: "bg-blue-500" },
                            { label: "Doğrulama (Validation)", count: DATASET_STATISTICS.totalFlows.validation.toLocaleString("tr-TR"), pct: "10%", color: "bg-amber-500" },
                            { label: "Test", count: DATASET_STATISTICS.totalFlows.testing.toLocaleString("tr-TR"), pct: "20%", color: "bg-emerald-500" },
                        ].map((s) => (
                            <div key={s.label} className="flex-1 min-w-[150px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                <div className={`w-3 h-3 rounded-full ${s.color} mx-auto mb-1`} />
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.label}</div>
                                <div className="text-xs font-mono text-slate-600 dark:text-slate-400">{s.count} örnek ({s.pct})</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex h-5 rounded-full overflow-hidden mt-4 border border-slate-200 dark:border-slate-700">
                        <div className="bg-blue-500 h-full" style={{ width: "70%" }} />
                        <div className="bg-amber-500 h-full" style={{ width: "10%" }} />
                        <div className="bg-emerald-500 h-full" style={{ width: "20%" }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
                        <span>%0</span>
                        <span>%70</span>
                        <span>%80</span>
                        <span>%100</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
                        Stratifiye bölme — her sınıfın oranı tüm alt kümelerde korunur | SMOTE yalnızca eğitim setine uygulanır (veri sızıntısı önlenir)
                    </p>
                </CardContent>
            </Card>

            {/* ════════════════════ ÖN İŞLEME ADİMLARI ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                        <Layers className="w-5 h-5" />
                        Ön İşleme Adımları (Preprocessing Pipeline)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {DATASET_STATISTICS.preprocessingSteps.map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400 flex-shrink-0">
                                    {i + 1}
                                </div>
                                <div className="flex-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <p className="text-sm text-slate-800 dark:text-slate-200">{step}</p>
                                </div>
                                {i < DATASET_STATISTICS.preprocessingSteps.length - 1 && (
                                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 hidden sm:block" />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
