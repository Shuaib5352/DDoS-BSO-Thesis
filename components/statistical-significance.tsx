"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    TrendingUp, CheckCircle2, BarChart3, Award,
    ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, Sigma,
} from "lucide-react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, Legend, ScatterChart, Scatter,
    ZAxis, ComposedChart, Line, Area, ErrorBar,
} from "recharts"
import { MODEL_RESULTS, STATISTICAL_TESTS, CROSS_VALIDATION } from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   İstatistiksel Anlamlılık Testleri
   (Statistical Significance Tests — Real experiment data)
   ═══════════════════════════════════════════════════════════════ */

const PROPOSED = MODEL_RESULTS[0]

/* ─── Build pairwise comparison from real STATISTICAL_TESTS ─── */
interface PairwiseTest {
    model: string
    improvement: string
    tStatistic: number
    pValue: number
    wilcoxonP: number
    cohensD: number
    significant: boolean
    effectSize: string
    note: string
    winner: "BSO-RF" | "Opponent" | "Tie"
}

const PAIRWISE_TESTS: PairwiseTest[] = STATISTICAL_TESTS.map((t) => {
    const impNum = parseFloat(t.improvement)
    let winner: "BSO-RF" | "Opponent" | "Tie"
    if (impNum > 0 && t.significant) winner = "BSO-RF"
    else if (impNum < 0 && t.significant) winner = "Opponent"
    else winner = "Tie"

    return {
        model: t.comparison.replace("BSO-Hybrid vs ", ""),
        improvement: t.improvement,
        tStatistic: t.tStatistic,
        pValue: t.pValue,
        wilcoxonP: t.wilcoxonP,
        cohensD: t.cohenD,
        significant: t.significant,
        effectSize: t.effectSize,
        note: t.note,
        winner,
    }
})

/* ─── 10-fold CV confidence intervals (95%) ─── */
const CV_FOLDS = CROSS_VALIDATION.results
const CV_MEAN = CROSS_VALIDATION.mean
const CV_STD = CROSS_VALIDATION.std

const CONFIDENCE_INTERVAL_95 = {
    accuracy: {
        lower: CV_MEAN.accuracy - 1.96 * (CV_STD.accuracy / Math.sqrt(CROSS_VALIDATION.folds)),
        upper: CV_MEAN.accuracy + 1.96 * (CV_STD.accuracy / Math.sqrt(CROSS_VALIDATION.folds)),
    },
    f1Score: {
        lower: CV_MEAN.f1Score - 1.96 * (CV_STD.f1Score / Math.sqrt(CROSS_VALIDATION.folds)),
        upper: CV_MEAN.f1Score + 1.96 * (CV_STD.f1Score / Math.sqrt(CROSS_VALIDATION.folds)),
    },
}

function pValueBadge(p: number) {
    if (p < 0.001) return <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[9px]">p&lt;0.001 ***</Badge>
    if (p < 0.01) return <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[9px]">p&lt;0.01 **</Badge>
    if (p < 0.05) return <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[9px]">p&lt;0.05 *</Badge>
    return <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px]">p={p.toFixed(3)} ns</Badge>
}

function effectSizeBadge(d: number) {
    const abs = Math.abs(d)
    if (abs >= 0.8) return <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[9px]">Büyük ({d.toFixed(2)})</Badge>
    if (abs >= 0.5) return <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[9px]">Orta ({d.toFixed(2)})</Badge>
    if (abs >= 0.2) return <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[9px]">Küçük ({d.toFixed(2)})</Badge>
    return <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px]">İhmal ({d.toFixed(2)})</Badge>
}

export default function StatisticalSignificance() {
    const sigCount = PAIRWISE_TESTS.filter((t) => t.significant).length
    const bsoWins = PAIRWISE_TESTS.filter((t) => t.winner === "BSO-RF").length

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                    İstatistiksel Anlamlılık Testleri
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    BSO-Hybrid RF ile diğer modellerin istatistiksel karşılaştırması — Bölüm 4. Bulgular için
                </p>
            </div>

            {/* ════════════════════ ÖZET ════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Anlamlı Farklar", value: `${sigCount}/${PAIRWISE_TESTS.length}`, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
                    { label: "BSO-RF Üstün", value: `${bsoWins} model`, icon: Award, color: "text-amber-600 dark:text-amber-400" },
                    { label: "Anlamlılık Düzeyi", value: "α = 0.05", icon: BarChart3, color: "text-blue-600 dark:text-blue-400" },
                    { label: "CV Katlama", value: "10-Fold", icon: Sigma, color: "text-purple-600 dark:text-purple-400" },
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

            {/* ════════════════════ HİPOTEZ ════════════════════ */}
            <Card className="border-indigo-200 dark:border-indigo-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <AlertTriangle className="w-5 h-5" />
                        Hipotez Testleri
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">H₀ (Sıfır Hipotezi)</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                BSO-Hybrid RF modeli ile karşılaştırılan model arasında sınıflandırma performansı açısından istatistiksel olarak anlamlı bir fark yoktur.
                            </p>
                            <div className="mt-2 font-mono text-xs text-slate-500 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                                H₀: μ_BSO-RF = μ_karşılaştırma
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">H₁ (Alternatif Hipotez)</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                BSO-Hybrid RF modeli, karşılaştırılan modelden istatistiksel olarak anlamlı düzeyde farklı (daha iyi veya daha kötü) performans gösterir.
                            </p>
                            <div className="mt-2 font-mono text-xs text-slate-500 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                                H₁: μ_BSO-RF ≠ μ_karşılaştırma
                            </div>
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/30">
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                            <strong>Kullanılan Testler:</strong> Eşleştirilmiş t-testi (10-katlı CV skorları üzerinde), Wilcoxon İşaretli Sıra Testi (parametrik olmayan alternatif), Cohen&apos;s d (etki büyüklüğü). Anlamlılık düzeyi: α = 0.05. Tüm testler 10-katlı tabakalı çapraz doğrulama F1-Macro sonuçlarına dayanmaktadır.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ İKİLİ KARŞILAŞTIRMA TABLOSU ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                        <BarChart3 className="w-5 h-5" />
                        İkili Karşılaştırma Tablosu (BSO-RF vs Diğerleri)
                    </CardTitle>
                    <CardDescription>Tablo 4.5 — 10-katlı CV F1-Macro farkları, eşleştirilmiş t-testi ve Wilcoxon testi sonuçları</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    {["Karşılaştırma", "ΔF1-M (CV)", "t-istatistiği", "p (t-test)", "p (Wilcoxon)", "Cohen's d", "Sonuç"].map((h) => (
                                        <th key={h} className="px-2 py-2 text-left font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {PAIRWISE_TESTS.map((t) => {
                                    const impNum = parseFloat(t.improvement)
                                    return (
                                        <tr key={t.model} className={`border-b border-slate-100 dark:border-slate-800 ${t.significant ? "" : "opacity-60"}`}>
                                            <td className="px-2 py-2 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{t.model}</td>
                                            <td className="px-2 py-2 font-mono">
                                                <span className={`flex items-center gap-0.5 ${impNum > 0 ? "text-emerald-600" : impNum < -0.01 ? "text-red-500" : "text-slate-500"}`}>
                                                    {impNum > 0 ? <ArrowUpRight className="w-3 h-3" /> : impNum < -0.01 ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                                    {t.improvement}
                                                </span>
                                            </td>
                                            <td className="px-2 py-2 font-mono text-slate-600 dark:text-slate-400">{t.tStatistic.toFixed(2)}</td>
                                            <td className="px-2 py-2">{pValueBadge(t.pValue)}</td>
                                            <td className="px-2 py-2">{pValueBadge(t.wilcoxonP)}</td>
                                            <td className="px-2 py-2">{effectSizeBadge(t.cohensD)}</td>
                                            <td className="px-2 py-2">
                                                {t.winner === "BSO-RF" ? (
                                                    <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[9px]">BSO-RF ✓</Badge>
                                                ) : t.winner === "Opponent" ? (
                                                    <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[9px]">{t.model.split(" ")[0]} ✓</Badge>
                                                ) : (
                                                    <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px]">Fark yok</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-slate-500 dark:text-slate-400">
                        <span>*** p &lt; 0.001</span>
                        <span>** p &lt; 0.01</span>
                        <span>* p &lt; 0.05</span>
                        <span>ns = anlamlı değil</span>
                        <span>ΔF1-M = 10-katlı CV F1-Macro farkı</span>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ ÇAPRAZ DOĞRULAMA ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Sigma className="w-5 h-5" />
                        10-Katlı Tabakalı Çapraz Doğrulama Sonuçları (BSO-Hybrid RF)
                    </CardTitle>
                    <CardDescription>Tablo 4.6 — 10-fold Stratified CV doğruluk, kesinlik, duyarlılık ve F1 oranları</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    {["Katlama", "Doğruluk (%)", "Kesinlik (%)", "Duyarlılık (%)", "F1-Skor (%)"].map((h) => (
                                        <th key={h} className="px-2 py-2 text-left font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {CV_FOLDS.map((fold) => (
                                    <tr key={fold.fold} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="px-2 py-1.5 font-medium text-slate-800 dark:text-slate-200">K{fold.fold}</td>
                                        <td className="px-2 py-1.5 font-mono text-slate-600 dark:text-slate-400">{fold.accuracy.toFixed(2)}</td>
                                        <td className="px-2 py-1.5 font-mono text-slate-600 dark:text-slate-400">{fold.precision.toFixed(2)}</td>
                                        <td className="px-2 py-1.5 font-mono text-slate-600 dark:text-slate-400">{fold.recall.toFixed(2)}</td>
                                        <td className="px-2 py-1.5 font-mono text-slate-600 dark:text-slate-400">{fold.f1Score.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {/* Ortalama satırı */}
                                <tr className="border-t-2 border-slate-300 dark:border-slate-600 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold">
                                    <td className="px-2 py-2 text-emerald-700 dark:text-emerald-300">
                                        <Award className="w-3 h-3 inline mr-1" />Ort.
                                    </td>
                                    <td className="px-2 py-2 font-mono text-emerald-700 dark:text-emerald-300">{CV_MEAN.accuracy.toFixed(2)} ±{CV_STD.accuracy}</td>
                                    <td className="px-2 py-2 font-mono text-emerald-700 dark:text-emerald-300">{CV_MEAN.precision.toFixed(2)} ±{CV_STD.precision}</td>
                                    <td className="px-2 py-2 font-mono text-emerald-700 dark:text-emerald-300">{CV_MEAN.recall.toFixed(2)} ±{CV_STD.recall}</td>
                                    <td className="px-2 py-2 font-mono text-emerald-700 dark:text-emerald-300">{CV_MEAN.f1Score.toFixed(2)} ±{CV_STD.f1Score}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800/30">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            <strong>%95 Güven Aralığı (Doğruluk):</strong> [{CONFIDENCE_INTERVAL_95.accuracy.lower.toFixed(2)}, {CONFIDENCE_INTERVAL_95.accuracy.upper.toFixed(2)}]
                            &nbsp;|&nbsp;
                            <strong>F1-Skor:</strong> [{CONFIDENCE_INTERVAL_95.f1Score.lower.toFixed(2)}, {CONFIDENCE_INTERVAL_95.f1Score.upper.toFixed(2)}]
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ CV KUTU GRAFİĞİ (BOX PLOT) ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                        <BarChart3 className="w-5 h-5" />
                        Şekil 4.X: 10-Katlı CV Dağılımı — Kutu Grafiği (Box Plot)
                    </CardTitle>
                    <CardDescription>BSO-Hybrid RF modelinin 10-katlı çapraz doğrulama varyansı ve kararlılık analizi</CardDescription>
                </CardHeader>
                <CardContent>
                    {(() => {
                        /* Build box plot data from CV results */
                        const metrics = [
                            { key: "accuracy" as const, label: "Doğruluk (%)", color: "#22c55e" },
                            { key: "precision" as const, label: "Kesinlik (%)", color: "#3b82f6" },
                            { key: "recall" as const, label: "Duyarlılık (%)", color: "#f59e0b" },
                            { key: "f1Score" as const, label: "F1-Skor (%)", color: "#8b5cf6" },
                        ]

                        const boxData = metrics.map((m) => {
                            const values = CV_FOLDS.map((f) => f[m.key]).sort((a, b) => a - b)
                            const q1 = values[Math.floor(values.length * 0.25)]
                            const median = values[Math.floor(values.length * 0.5)]
                            const q3 = values[Math.floor(values.length * 0.75)]
                            const min = values[0]
                            const max = values[values.length - 1]
                            const iqr = q3 - q1
                            const mean = values.reduce((s, v) => s + v, 0) / values.length
                            return {
                                name: m.label,
                                min: +min.toFixed(2),
                                q1: +q1.toFixed(2),
                                median: +median.toFixed(2),
                                q3: +q3.toFixed(2),
                                max: +max.toFixed(2),
                                iqr: +iqr.toFixed(3),
                                mean: +mean.toFixed(2),
                                color: m.color,
                                range: +(max - min).toFixed(2),
                            }
                        })

                        return (
                            <div className="space-y-6">
                                {/* Visual Box Plot using CSS */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {boxData.map((d) => {
                                        const scaleMin = Math.floor(d.min - 0.5)
                                        const scaleMax = Math.ceil(d.max + 0.5)
                                        const range = scaleMax - scaleMin
                                        const toPos = (v: number) => ((v - scaleMin) / range) * 100

                                        return (
                                            <div key={d.name} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 text-center">{d.name}</div>
                                                <div className="relative h-48 flex items-center justify-center">
                                                    {/* Vertical box plot */}
                                                    <div className="relative w-16 h-full">
                                                        {/* Whisker line (min to max) */}
                                                        <div
                                                            className="absolute left-1/2 -translate-x-1/2 w-px bg-slate-400 dark:bg-slate-500"
                                                            style={{
                                                                bottom: `${toPos(d.min)}%`,
                                                                height: `${toPos(d.max) - toPos(d.min)}%`,
                                                            }}
                                                        />
                                                        {/* Min whisker cap */}
                                                        <div
                                                            className="absolute left-1/2 -translate-x-1/2 w-6 h-px bg-slate-500"
                                                            style={{ bottom: `${toPos(d.min)}%` }}
                                                        />
                                                        {/* Max whisker cap */}
                                                        <div
                                                            className="absolute left-1/2 -translate-x-1/2 w-6 h-px bg-slate-500"
                                                            style={{ bottom: `${toPos(d.max)}%` }}
                                                        />
                                                        {/* Box (Q1 to Q3) */}
                                                        <div
                                                            className="absolute left-1/2 -translate-x-1/2 w-12 rounded border-2 opacity-80"
                                                            style={{
                                                                bottom: `${toPos(d.q1)}%`,
                                                                height: `${Math.max(toPos(d.q3) - toPos(d.q1), 2)}%`,
                                                                backgroundColor: d.color + "30",
                                                                borderColor: d.color,
                                                            }}
                                                        />
                                                        {/* Median line */}
                                                        <div
                                                            className="absolute left-1/2 -translate-x-1/2 w-12 h-0.5"
                                                            style={{
                                                                bottom: `${toPos(d.median)}%`,
                                                                backgroundColor: d.color,
                                                            }}
                                                        />
                                                        {/* Mean dot */}
                                                        <div
                                                            className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900"
                                                            style={{
                                                                bottom: `calc(${toPos(d.mean)}% - 5px)`,
                                                                backgroundColor: d.color,
                                                            }}
                                                        />
                                                    </div>
                                                    {/* Scale labels */}
                                                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 font-mono">
                                                        <span>{scaleMax}</span>
                                                        <span>{scaleMin}</span>
                                                    </div>
                                                </div>
                                                {/* Stats below */}
                                                <div className="mt-3 space-y-1 text-[10px] text-slate-600 dark:text-slate-400">
                                                    <div className="flex justify-between"><span>Min:</span><span className="font-mono">{d.min}%</span></div>
                                                    <div className="flex justify-between"><span>Q1:</span><span className="font-mono">{d.q1}%</span></div>
                                                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200"><span>Medyan:</span><span className="font-mono">{d.median}%</span></div>
                                                    <div className="flex justify-between"><span>Q3:</span><span className="font-mono">{d.q3}%</span></div>
                                                    <div className="flex justify-between"><span>Max:</span><span className="font-mono">{d.max}%</span></div>
                                                    <div className="flex justify-between text-slate-500"><span>IQR:</span><span className="font-mono">{d.iqr}</span></div>
                                                    <div className="flex justify-between text-slate-500"><span>Aralık:</span><span className="font-mono">{d.range}</span></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                {/* Fold-by-fold bar chart */}
                                <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={CV_FOLDS} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                            <XAxis dataKey="fold" tickFormatter={(v: number) => `K${v}`} tick={{ fontSize: 10 }} />
                                            <YAxis domain={[88, 93]} tick={{ fontSize: 10 }} />
                                            <Tooltip formatter={(v: number) => [`${v.toFixed(2)}%`, ""]} />
                                            <Legend wrapperStyle={{ fontSize: 10 }} />
                                            <Bar dataKey="accuracy" name="Doğruluk" fill="#22c55e" opacity={0.85} radius={[3, 3, 0, 0]} />
                                            <Bar dataKey="precision" name="Kesinlik" fill="#3b82f6" opacity={0.85} radius={[3, 3, 0, 0]} />
                                            <Bar dataKey="recall" name="Duyarlılık" fill="#f59e0b" opacity={0.85} radius={[3, 3, 0, 0]} />
                                            <Bar dataKey="f1Score" name="F1-Skor" fill="#8b5cf6" opacity={0.85} radius={[3, 3, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/40">
                                    <p className="text-xs text-cyan-700 dark:text-cyan-300">
                                        <strong>Yorum:</strong> 10-katlı CV sonuçlarında düşük varyans (IQR &lt; 0.5, Aralık &lt; 1.0) modelin aşırı öğrenme (overfitting)
                                        yapmadığını ve farklı veri alt kümelerinde tutarlı performans gösterdiğini kanıtlamaktadır.
                                        Kutu grafikleri tüm metrikler için sıkı bir dağılım sergilemektedir.
                                    </p>
                                </div>
                            </div>
                        )
                    })()}
                </CardContent>
            </Card>

            {/* ════════════════════ GÜVEN ARALIKLI GÖRSEL ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                        <BarChart3 className="w-5 h-5" />
                        Model Karşılaştırması — Test Seti Doğruluğu
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {MODEL_RESULTS.slice().sort((a, b) => b.accuracy - a.accuracy).map((m) => {
                            const isBSO = m.name === "BSO-Hybrid RF (Proposed)"
                            const scaleMin = 60
                            const scaleMax = 92
                            const range = scaleMax - scaleMin
                            const accPos = ((m.accuracy - scaleMin) / range) * 100

                            return (
                                <div key={m.name} className="flex items-center gap-2">
                                    <span className={`text-[10px] w-36 text-right truncate ${isBSO ? "font-bold text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}>
                                        {m.name.replace(" (Proposed)", "")}
                                    </span>
                                    <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded relative">
                                        <div
                                            className={`absolute top-0.5 h-4 rounded ${isBSO ? "bg-emerald-400/60 dark:bg-emerald-600/40" : "bg-blue-300/50 dark:bg-blue-700/30"}`}
                                            style={{ width: `${Math.max(0, Math.min(accPos, 100))}%` }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-mono w-14 ${isBSO ? "font-bold text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}>
                                        {m.accuracy.toFixed(1)}%
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1 px-38">
                        <span>%60</span>
                        <span>%70</span>
                        <span>%80</span>
                        <span>%90</span>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ YORUM ════════════════════ */}
            <Card className="border-green-200 dark:border-green-800/40 bg-green-50/50 dark:bg-green-900/20">
                <CardContent className="pt-4 pb-4 space-y-3">
                    <h3 className="text-sm font-bold text-green-800 dark:text-green-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        İstatistiksel Değerlendirme Özeti
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-green-700 dark:text-green-300">
                        <div className="space-y-1.5">
                            <p>• {sigCount}/{PAIRWISE_TESTS.length} karşılaştırmada istatistiksel olarak anlamlı fark tespit edilmiştir (p &lt; 0.05).</p>
                            <p>• BSO-Hybrid RF, {bsoWins} modele karşı istatistiksel olarak anlamlı üstünlük gösterir.</p>
                            <p>• GWO-RF ile arasındaki fark istatistiksel olarak anlamlı değildir (p = 0.76).</p>
                            <p>• XGBoost ve Random Forest, BSO-RF&apos;den marjinal olarak daha yüksek CV F1-Macro elde eder ancak %51.3 daha fazla öznitelik gerektirir.</p>
                        </div>
                        <div className="space-y-1.5">
                            <p>• 10-katlı CV sonuçları BSO-RF&apos;nin tutarlı performans gösterdiğini doğrular (Std = {CV_STD.accuracy}).</p>
                            <p>• Cohen&apos;s d etki büyüklüğü, BSO-SVM, Naive Bayes ve SVM karşılaştırmalarında &quot;büyük&quot; olarak sınıflandırılmıştır.</p>
                            <p>• %95 güven aralığı (doğruluk): [{CONFIDENCE_INTERVAL_95.accuracy.lower.toFixed(2)}, {CONFIDENCE_INTERVAL_95.accuracy.upper.toFixed(2)}] — dar aralık yüksek güvenilirlik gösterir.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
