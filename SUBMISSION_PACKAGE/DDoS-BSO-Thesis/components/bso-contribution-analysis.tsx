"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Cell,
} from "recharts"
import {
    TrendingUp,
    Target,
    Zap,
    Shield,
    CheckCircle2,
    ArrowDown,
    ArrowUp,
    Minus,
    Award,
    Cpu,
    Layers,
    BarChart3,
} from "lucide-react"
import {
    MODEL_RESULTS,
    DATASET_STATISTICS,
    COMPUTATIONAL_EFFICIENCY,
    FEATURE_SELECTION_COMPARISON,
    CROSS_VALIDATION,
    STATISTICAL_TESTS,
    BSO_RF_PER_CLASS,
} from "@/lib/ciciot2023-dataset"

// Get BSO-Hybrid and XGBoost data
const bsoModel = MODEL_RESULTS.find((m) => m.name.includes("BSO-Hybrid"))!
const xgbModel = MODEL_RESULTS.find((m) => m.name.includes("XGBoost"))!
const rfModel = MODEL_RESULTS.find((m) => m.name.includes("Random Forest") && !m.name.includes("BSO") && !m.name.includes("PSO") && !m.name.includes("GA") && !m.name.includes("GWO"))!

// Efficiency data
const bsoEfficiency = COMPUTATIONAL_EFFICIENCY.find((m) => m.model.includes("BSO-Hybrid"))!
const xgbEfficiency = COMPUTATIONAL_EFFICIENCY.find((m) => m.model.includes("XGBoost"))!

// Calculate differences
const accDiff = (bsoModel.accuracy - xgbModel.accuracy).toFixed(2)
const f1Diff = (bsoModel.f1Score - xgbModel.f1Score).toFixed(2)
const featureReduction = ((1 - bsoModel.featuresUsed / xgbModel.featuresUsed) * 100).toFixed(1)

// Radar comparison data
const radarData = [
    { metric: "Doğruluk", BSO: bsoModel.accuracy, XGBoost: xgbModel.accuracy, fullMark: 100 },
    { metric: "Kesinlik", BSO: bsoModel.precision, XGBoost: xgbModel.precision, fullMark: 100 },
    { metric: "Duyarlılık", BSO: bsoModel.recall, XGBoost: xgbModel.recall, fullMark: 100 },
    { metric: "F1-Skor", BSO: bsoModel.f1Score, XGBoost: xgbModel.f1Score, fullMark: 100 },
    { metric: "AUC-ROC", BSO: bsoModel.aucRoc, XGBoost: xgbModel.aucRoc, fullMark: 100 },
    { metric: "Öz. Verimi", BSO: 100, XGBoost: (19 / 39) * 100, fullMark: 100 },
]

// Feature efficiency comparison
const featureEfficiencyData = [
    {
        method: "BSO-Hybrid RF",
        features: FEATURE_SELECTION_COMPARISON.BSO.nSelected,
        accuracy: bsoModel.accuracy,
        efficiencyScore: (bsoModel.accuracy / FEATURE_SELECTION_COMPARISON.BSO.nSelected).toFixed(2),
        color: "#10b981",
    },
    {
        method: "PSO-RF",
        features: FEATURE_SELECTION_COMPARISON.PSO.nSelected,
        accuracy: MODEL_RESULTS.find((m) => m.name === "PSO-RF")!.accuracy,
        efficiencyScore: (MODEL_RESULTS.find((m) => m.name === "PSO-RF")!.accuracy / FEATURE_SELECTION_COMPARISON.PSO.nSelected).toFixed(2),
        color: "#3b82f6",
    },
    {
        method: "GA-RF",
        features: FEATURE_SELECTION_COMPARISON.GA.nSelected,
        accuracy: MODEL_RESULTS.find((m) => m.name === "GA-RF")!.accuracy,
        efficiencyScore: (MODEL_RESULTS.find((m) => m.name === "GA-RF")!.accuracy / FEATURE_SELECTION_COMPARISON.GA.nSelected).toFixed(2),
        color: "#8b5cf6",
    },
    {
        method: "GWO-RF",
        features: FEATURE_SELECTION_COMPARISON.GWO.nSelected,
        accuracy: MODEL_RESULTS.find((m) => m.name === "GWO-RF")!.accuracy,
        efficiencyScore: (MODEL_RESULTS.find((m) => m.name === "GWO-RF")!.accuracy / FEATURE_SELECTION_COMPARISON.GWO.nSelected).toFixed(2),
        color: "#f59e0b",
    },
    {
        method: "XGBoost",
        features: 39,
        accuracy: xgbModel.accuracy,
        efficiencyScore: (xgbModel.accuracy / 39).toFixed(2),
        color: "#ef4444",
    },
    {
        method: "Random Forest",
        features: 39,
        accuracy: rfModel.accuracy,
        efficiencyScore: (rfModel.accuracy / 39).toFixed(2),
        color: "#6b7280",
    },
]

// Accuracy per feature (efficiency metric)
const accuracyPerFeature = featureEfficiencyData.map((d) => ({
    method: d.method,
    accPerFeature: Number(d.efficiencyScore),
    features: d.features,
    accuracy: d.accuracy,
}))

// Advantage areas
const advantageAreas = [
    {
        id: "feature_reduction",
        iconColor: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        badgeColor: "bg-emerald-600",
    },
    {
        id: "comparable_accuracy",
        iconColor: "text-blue-500",
        bgColor: "bg-blue-500/10",
        badgeColor: "bg-blue-600",
    },
    {
        id: "joint_optimization",
        iconColor: "text-purple-500",
        bgColor: "bg-purple-500/10",
        badgeColor: "bg-purple-600",
    },
    {
        id: "iot_suitability",
        iconColor: "text-amber-500",
        bgColor: "bg-amber-500/10",
        badgeColor: "bg-amber-600",
    },
]

const advantageIcons = [Layers, Target, Zap, Cpu]

export default function BSOContributionAnalysis() {
    const texts = {
        tr: {
            title: "BSO-Hybrid Katkı Analizi",
            subtitle: "XGBoost'un marjinal doğruluk avantajına rağmen BSO-Hybrid RF neden en uygun seçimdir",
            keyFinding: "Temel Araştırma Bulgusu",
            keyFindingText: `BSO-Hybrid RF, yalnızca ${bsoModel.featuresUsed} özellik kullanarak (%${featureReduction} azalma) %${bsoModel.accuracy} doğruluk elde ederken, XGBoost tüm ${xgbModel.featuresUsed} özelliği kullanarak %${xgbModel.accuracy} elde etti. Doğruluk farkı yalnızca %${Math.abs(Number(accDiff))} — istatistiksel olarak önemsiz — ancak BSO-Hybrid, kaynak kısıtlı IoT ortamları için önemli hesaplama ve pratik avantajlar sunar.`,
            vsXGBoost: "BSO-Hybrid RF vs XGBoost — Detaylı Karşılaştırma",
            metricComparison: "Metrik Bazında Karşılaştırma",
            radarTitle: "Çok Boyutlu Performans Radarı",
            radarSubtitle: "Tüm değerlendirme metriklerinde BSO-Hybrid RF vs XGBoost",
            featureEffTitle: "Özellik Başına Doğruluk Verimliliği",
            featureEffSubtitle: "Yüksek = daha iyi verimlilik (kullanılan özelliklere göre elde edilen doğruluk)",
            advantagesTitle: "BSO-Hybrid Rekabet Avantajları",
            advantagesSubtitle: "Önerilen yöntem neden gerçek bir araştırma katkısı temsil eder",
            advantages: [
                {
                    title: "%51.3 Özellik Azaltma",
                    desc: `%${bsoModel.accuracy} doğruluğu koruyarak 39 özelliği 19'a düşürür. Bu, IoT uç cihazları için kritik olan daha düşük hesaplama maliyeti, daha hızlı çıkarım ve azaltılmış depolama gereksinimlerine dönüşür.`,
                    metric: `${bsoModel.featuresUsed} / ${xgbModel.featuresUsed} özellik`,
                },
                {
                    title: "Karşılaştırılabilir Doğruluk",
                    desc: `XGBoost'un yalnızca %${Math.abs(Number(accDiff))} altında (%${bsoModel.accuracy} vs %${xgbModel.accuracy}), istatistiksel gürültü aralığında. Çapraz doğrulama BSO-Hybrid'in %${CROSS_VALIDATION.mean.accuracy} ± ${CROSS_VALIDATION.std.accuracy} elde ettiğini gösterir — son derece kararlı.`,
                    metric: `Δ = %${Math.abs(Number(accDiff))}`,
                },
                {
                    title: "Ortak Optimizasyon",
                    desc: "Tek bir optimizasyon döngüsünde eşzamanlı özellik seçimi + hiperparametre ayarı. XGBoost ayrı özellik mühendisliği ve ayar adımları gerektirir, bu BSO-Hybrid'i daha otomatik ve tekrarlanabilir kılar.",
                    metric: "2'si 1 arada optimizasyon",
                },
                {
                    title: "IoT Dağıtım Uygunluğu",
                    desc: `%${featureReduction} daha az özellikle model, özellik çıkarmak için daha az bant genişliği, daha az bellek ve daha hızlı gerçek zamanlı tahmin gerektirir — kaynak kısıtlı IoT ağ geçitleri için ideal.`,
                    metric: `%${featureReduction} daha az kaynak`,
                },
            ],
            comparisonTable: "Kapsamlı Karşılaştırma Tablosu",
            metric: "Metrik",
            bsoHybrid: "BSO-Hybrid RF (Önerilen)",
            xgboost: "XGBoost (Temel)",
            difference: "Fark",
            interpretation: "Yorum",
            crossValidation: "Çapraz Doğrulama Kararlılığı",
            crossValidationDesc: `10 Katlı Tabakalı CV — Ortalama: %${CROSS_VALIDATION.mean.accuracy} ± ${CROSS_VALIDATION.std.accuracy} (SS)`,
            conclusion: "Araştırma Katkısı Özeti",
            conclusionText: `BSO-Hybrid RF çerçevesi, metasezgisel optimizasyonun model karmaşıklığını %${featureReduction} oranında önemli ölçüde azaltırken neredeyse optimal sınıflandırma performansı (%${bsoModel.accuracy} vs %${xgbModel.accuracy}) elde edebildiğini göstermektedir. Marjinal doğruluk kaybı (%${Math.abs(Number(accDiff))}) ile önemli boyut azaltma (${bsoModel.featuresUsed} vs ${xgbModel.featuresUsed} özellik) arasındaki bu denge, hesaplama kaynaklarının sınırlı olduğu IoT ortamlarında DDoS tespitine önemli bir katkı temsil etmektedir.`,
            winner: "Kazanan",
            tie: "Berabere",
            accPerFeature: "Özellik Başına Doğruluk",
        },
    }

    const tx = texts.tr

    // Comparison table data
    const comparisonRows = [
        {
            metric: "Doğruluk (%)",
            bso: bsoModel.accuracy,
            xgb: xgbModel.accuracy,
            diff: Number(accDiff),
            interp: { tr: "Marjinal fark (< %1)" },
        },
        {
            metric: "Kesinlik (%)",
            bso: bsoModel.precision,
            xgb: xgbModel.precision,
            diff: Number((bsoModel.precision - xgbModel.precision).toFixed(2)),
            interp: { tr: "Neredeyse aynı" },
        },
        {
            metric: "Duyarlılık (%)",
            bso: bsoModel.recall,
            xgb: xgbModel.recall,
            diff: Number((bsoModel.recall - xgbModel.recall).toFixed(2)),
            interp: { tr: "Neredeyse aynı" },
        },
        {
            metric: "F1-Ağırlıklı (%)",
            bso: bsoModel.f1Score,
            xgb: xgbModel.f1Score,
            diff: Number(f1Diff),
            interp: { tr: "Marjinal fark" },
        },
        {
            metric: "F1-Makro (%)",
            bso: bsoModel.f1Macro,
            xgb: xgbModel.f1Macro,
            diff: Number((bsoModel.f1Macro - xgbModel.f1Macro).toFixed(2)),
            interp: { tr: "Marjinal fark" },
        },
        {
            metric: "AUC-ROC (%)",
            bso: bsoModel.aucRoc,
            xgb: xgbModel.aucRoc,
            diff: Number((bsoModel.aucRoc - xgbModel.aucRoc).toFixed(2)),
            interp: { tr: "Neredeyse aynı" },
        },
        {
            metric: "MCC",
            bso: bsoModel.mcc,
            xgb: xgbModel.mcc,
            diff: Number((bsoModel.mcc - xgbModel.mcc).toFixed(4)),
            interp: { tr: "Neredeyse aynı" },
        },
        {
            metric: "Kullanılan Özellikler",
            bso: bsoModel.featuresUsed,
            xgb: xgbModel.featuresUsed,
            diff: bsoModel.featuresUsed - xgbModel.featuresUsed,
            interp: { tr: "BSO %51.3 daha az özellik kullanır ✓" },
        },
        {
            metric: "Eğitim Süresi (s)",
            bso: bsoEfficiency.trainingTime,
            xgb: xgbEfficiency.trainingTime,
            diff: Number((bsoEfficiency.trainingTime - xgbEfficiency.trainingTime).toFixed(3)),
            interp: { tr: "BSO daha hızlı eğitilir ✓" },
        },
    ]

    return (
        <div className="space-y-6">
            {/* Key Finding Banner */}
            <Card className="border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 via-background to-blue-500/5">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/15 rounded-xl">
                            <Award className="w-7 h-7 text-emerald-500" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{tx.title}</CardTitle>
                            <CardDescription className="text-sm mt-1">{tx.subtitle}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">{tx.keyFinding}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{tx.keyFindingText}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                        <div className="text-center p-4 bg-card rounded-xl border">
                            <div className="text-2xl font-bold text-emerald-500">{bsoModel.accuracy}%</div>
                            <div className="text-xs text-muted-foreground mt-1">BSO-Hybrid RF</div>
                            <Badge className="mt-2 bg-emerald-600 text-xs">{bsoModel.featuresUsed} özellik</Badge>
                        </div>
                        <div className="text-center p-4 bg-card rounded-xl border">
                            <div className="text-2xl font-bold text-red-500">{xgbModel.accuracy}%</div>
                            <div className="text-xs text-muted-foreground mt-1">XGBoost</div>
                            <Badge variant="outline" className="mt-2 text-xs">{xgbModel.featuresUsed} özellik</Badge>
                        </div>
                        <div className="text-center p-4 bg-card rounded-xl border">
                            <div className="text-2xl font-bold text-blue-500">{Math.abs(Number(accDiff))}%</div>
                            <div className="text-xs text-muted-foreground mt-1">Doğruluk Farkı</div>
                            <Badge variant="secondary" className="mt-2 text-xs">İstatistiksel önemsiz</Badge>
                        </div>
                        <div className="text-center p-4 bg-card rounded-xl border">
                            <div className="text-2xl font-bold text-purple-500">{featureReduction}%</div>
                            <div className="text-xs text-muted-foreground mt-1">Özellik Azaltma</div>
                            <Badge className="mt-2 bg-purple-600 text-xs">Ana Katkı</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Radar Chart + Detailed Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            {tx.radarTitle}
                        </CardTitle>
                        <CardDescription>{tx.radarSubtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <RadarChart data={radarData}>
                                <PolarGrid strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                                <PolarRadiusAxis angle={90} domain={[80, 100]} tick={{ fontSize: 10 }} />
                                <Radar
                                    name="BSO-Hybrid RF"
                                    dataKey="BSO"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                                <Radar
                                    name="XGBoost"
                                    dataKey="XGBoost"
                                    stroke="#ef4444"
                                    fill="#ef4444"
                                    fillOpacity={0.15}
                                    strokeWidth={2}
                                />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Accuracy per Feature Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            {tx.featureEffTitle}
                        </CardTitle>
                        <CardDescription>{tx.featureEffSubtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={accuracyPerFeature} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis type="number" domain={[0, 6]} tick={{ fontSize: 11 }} label={{ value: tx.accPerFeature, position: "insideBottom", offset: -5, fontSize: 11 }} />
                                <YAxis type="category" dataKey="method" width={100} tick={{ fontSize: 11 }} />
                                <Tooltip
                                    formatter={(value: number, name: string, props: { payload: { method: string; features: number; accuracy: number } }) => [
                                        `${value} (${props.payload.accuracy}% / ${props.payload.features} features)`,
                                        tx.accPerFeature,
                                    ]}
                                />
                                <Bar dataKey="accPerFeature" radius={[0, 6, 6, 0]}>
                                    {accuracyPerFeature.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={featureEfficiencyData[index].color}
                                            opacity={entry.method.includes("BSO-Hybrid") ? 1 : 0.6}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Advantages Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        {tx.advantagesTitle}
                    </CardTitle>
                    <CardDescription>{tx.advantagesSubtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tx.advantages.map((adv, i) => {
                            const Icon = advantageIcons[i]
                            const area = advantageAreas[i]
                            return (
                                <div key={i} className={`${area.bgColor} rounded-xl p-5 border border-border/50`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${area.bgColor}`}>
                                            <Icon className={`w-5 h-5 ${area.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-sm">{adv.title}</h4>
                                                <Badge className={`${area.badgeColor} text-xs`}>{adv.metric}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">{adv.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Comparison Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        {tx.comparisonTable}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="text-start p-3 font-semibold">{tx.metric}</th>
                                    <th className="text-center p-3 font-semibold text-emerald-600">{tx.bsoHybrid}</th>
                                    <th className="text-center p-3 font-semibold text-red-600">{tx.xgboost}</th>
                                    <th className="text-center p-3 font-semibold">{tx.difference}</th>
                                    <th className="text-center p-3 font-semibold">{tx.winner}</th>
                                    <th className="text-start p-3 font-semibold">{tx.interpretation}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, i) => {
                                    const bsoWins = row.metric.includes("Özellik")
                                        ? row.bso < row.xgb
                                        : row.metric.includes("Süre")
                                            ? row.bso < row.xgb
                                            : row.bso > row.xgb
                                    const isTie = Math.abs(row.diff) < 0.5 && !row.metric.includes("Özellik")

                                    return (
                                        <tr key={i} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-3 font-medium">{row.metric}</td>
                                            <td className="text-center p-3">
                                                <span className={bsoWins ? "font-bold text-emerald-600" : ""}>{row.bso}</span>
                                            </td>
                                            <td className="text-center p-3">
                                                <span className={!bsoWins && !isTie ? "font-bold text-red-600" : ""}>{row.xgb}</span>
                                            </td>
                                            <td className="text-center p-3">
                                                <span className={`flex items-center justify-center gap-1 ${row.diff > 0 ? "text-emerald-600" : row.diff < 0 ? "text-red-500" : ""}`}>
                                                    {row.diff > 0 ? <ArrowUp className="w-3 h-3" /> : row.diff < 0 ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                                    {row.diff > 0 ? "+" : ""}{row.diff}
                                                </span>
                                            </td>
                                            <td className="text-center p-3">
                                                {isTie ? (
                                                    <Badge variant="outline" className="text-xs">{tx.tie}</Badge>
                                                ) : bsoWins ? (
                                                    <Badge className="bg-emerald-600 text-xs">BSO ✓</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs border-red-300">XGB</Badge>
                                                )}
                                            </td>
                                            <td className="p-3 text-xs text-muted-foreground">
                                                {row.interp.tr}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Cross-Validation Stability */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        {tx.crossValidation}
                    </CardTitle>
                    <CardDescription>{tx.crossValidationDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {CROSS_VALIDATION.results.map((fold) => (
                            <div key={fold.fold} className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground w-16">Fold {fold.fold}</span>
                                <div className="flex-1">
                                    <Progress value={fold.accuracy} className="h-2.5" />
                                </div>
                                <span className="text-sm font-mono font-medium w-16 text-end">{fold.accuracy}%</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                            <span className="text-xs font-semibold w-16">Ortalama</span>
                            <div className="flex-1">
                                <Progress value={CROSS_VALIDATION.mean.accuracy} className="h-3" />
                            </div>
                            <span className="text-sm font-mono font-bold w-16 text-end text-emerald-600">{CROSS_VALIDATION.mean.accuracy}%</span>
                        </div>
                        <div className="text-center text-xs text-muted-foreground mt-2">
                            σ = {CROSS_VALIDATION.std.accuracy} — Çok düşük standart sapma, yüksek kararlılık gösterir
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Research Conclusion */}
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        {tx.conclusion}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                        <p className="text-sm leading-relaxed text-muted-foreground">{tx.conclusionText}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-5">
                        <div className="text-center p-3 rounded-lg bg-card border">
                            <div className="text-lg font-bold text-emerald-500">{bsoModel.accuracy}%</div>
                            <div className="text-[10px] text-muted-foreground">%19 özellikle doğruluk</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-card border">
                            <div className="text-lg font-bold text-purple-500">{featureReduction}%</div>
                            <div className="text-[10px] text-muted-foreground">Karmaşıklık azaltma</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-card border">
                            <div className="text-lg font-bold text-blue-500">{CROSS_VALIDATION.mean.accuracy}%</div>
                            <div className="text-[10px] text-muted-foreground">Çapraz doğrulama ort.</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
