"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Legend,
} from "recharts"
import { CheckCircle2, XCircle, BarChart3, Target, Zap, Layers } from "lucide-react"
import {
    BSO_SELECTED_FEATURES,
    CICIOT2023_FEATURES,
    FEATURE_SELECTION_COMPARISON,
    MODEL_RESULTS,
    DATASET_STATISTICS,
} from "@/lib/ciciot2023-dataset"

// ─── Feature categories ────────────────────────────────────────────────────────
const FEATURE_CATEGORIES: Record<string, { features: string[]; color: string; description: string }> = {
    "Ağ Bayrakları": {
        features: ["fin_flag_number", "syn_flag_number", "rst_flag_number", "psh_flag_number", "ack_flag_number", "ece_flag_number", "cwr_flag_number"],
        color: "#ef4444",
        description: "Bağlantı durumunu gösteren TCP bayrak tabanlı özellikler",
    },
    "Paket Sayıları": {
        features: ["ack_count", "syn_count", "fin_count", "rst_count"],
        color: "#f59e0b",
        description: "Toplu paket sayısı özellikleri",
    },
    "Protokol Türleri": {
        features: ["HTTP", "HTTPS", "DNS", "Telnet", "SMTP", "SSH", "IRC", "TCP", "UDP", "DHCP", "ARP", "ICMP", "IGMP", "IPv", "LLC"],
        color: "#3b82f6",
        description: "Protokol göstergesi özellikleri",
    },
    "İstatistiksel Özellikler": {
        features: ["Tot sum", "Min", "Max", "AVG", "Std", "Tot size", "IAT", "Number", "Variance"],
        color: "#22c55e",
        description: "İstatistiksel paket boyutu ve zamanlama özellikleri",
    },
    "Başlık Özellikleri": {
        features: ["Header_Length", "Protocol Type", "Time_To_Live", "Rate"],
        color: "#8b5cf6",
        description: "Paket başlığı üst veri özellikleri",
    },
}

// Build all 39 features with selection status and importance
const allFeaturesData = CICIOT2023_FEATURES.map((f) => {
    const selected = BSO_SELECTED_FEATURES.find((s) => s.name === f.name)
    let category = "Diğer"
    for (const [cat, info] of Object.entries(FEATURE_CATEGORIES)) {
        if (info.features.includes(f.name)) { category = cat; break }
    }
    return {
        name: f.name,
        importance: selected ? selected.importance : 0,
        rank: selected ? selected.rank : null,
        selected: !!selected,
        category,
    }
}).sort((a, b) => b.importance - a.importance)

// Category selection analysis
const categoryAnalysis = Object.entries(FEATURE_CATEGORIES).map(([name, info]) => {
    const total = info.features.length
    const selectedCount = info.features.filter((f) => BSO_SELECTED_FEATURES.some((s) => s.name === f)).length
    return {
        category: name,
        total,
        selected: selectedCount,
        dropped: total - selectedCount,
        selectionRate: Math.round((selectedCount / total) * 100),
        color: info.color,
        description: info.description,
    }
})

// Feature overlap between optimizers
const optimizers = ["BSO", "PSO", "GA", "GWO"] as const
const featureOverlap = CICIOT2023_FEATURES.map((f) => {
    const selectedBy: string[] = []
    for (const opt of optimizers) {
        if (FEATURE_SELECTION_COMPARISON[opt].features.includes(f.name)) {
            selectedBy.push(opt)
        }
    }
    return { name: f.name, selectedBy, count: selectedBy.length }
}).filter((f) => f.count > 0).sort((a, b) => b.count - a.count)

// Unique features per optimizer
const uniqueFeatures = optimizers.map((opt) => {
    const features = FEATURE_SELECTION_COMPARISON[opt].features
    const unique = features.filter((f) => {
        return !optimizers.some((other) => other !== opt && FEATURE_SELECTION_COMPARISON[other].features.includes(f))
    })
    return { optimizer: opt, total: features.length, unique: unique.length, shared: features.length - unique.length, uniqueFeatures: unique }
})

export default function FeatureImportanceAnalysis() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-indigo-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Özellik Önemi ve Seçim Analizi</CardTitle>
                                <CardDescription>
                                    Gerçek CICIoT2023 deney sonuçlarını kullanan BSO özellik seçim analizi
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-blue-600">{DATASET_STATISTICS.totalFeatures} Toplam Özellik</Badge>
                            <Badge className="bg-emerald-600">{DATASET_STATISTICS.selectedFeatures} BSO Tarafından Seçilen</Badge>
                            <Badge className="bg-amber-600">%{DATASET_STATISTICS.featureReductionPct} Azaltma</Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* 1. Feature Importance Ranking (all 39) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        Şekil 5.1: Özellik Önemi Sıralaması (Tüm 39 Özellik)
                    </CardTitle>
                    <CardDescription>
                        Yeşil çubuklar = BSO tarafından seçilen ({BSO_SELECTED_FEATURES.length} özellik) | Kırmızı çubuklar = Çıkarılan ({39 - BSO_SELECTED_FEATURES.length} özellik)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[600px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={allFeaturesData} layout="vertical" margin={{ left: 120, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis type="number" domain={[0, 0.25]} tickFormatter={(v: number) => v.toFixed(3)} />
                                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10 }} />
                                <Tooltip
                                    formatter={(value: number) => [value.toFixed(6), "Önem"]}
                                    labelFormatter={(label) => {
                                        const f = allFeaturesData.find((d) => d.name === label)
                                        return `${label} (${f?.selected ? `Seçildi - Sıra #${f.rank}` : "Çıkarıldı"})`
                                    }}
                                />
                                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                                    {allFeaturesData.map((entry, index) => (
                                        <Cell key={index} fill={entry.selected ? "#22c55e" : "#ef4444"} opacity={entry.selected ? 1 : 0.4} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Top 19 Selected Features Detail */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Tablo 5.1: BSO Seçilmiş Özellikler (39'dan 19)
                    </CardTitle>
                    <CardDescription>
                        BSO-Hibrit optimizasyonu ile seçilen özellikler önem skoruna göre sıralanmış
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">Sıra</th>
                                    <th className="text-left p-2 font-bold">Özellik Adı</th>
                                    <th className="text-left p-2 font-bold">Kategori</th>
                                    <th className="text-right p-2 font-bold">Önem</th>
                                    <th className="text-right p-2 font-bold">Katkı %</th>
                                    <th className="text-center p-2 font-bold">Kümülatif %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const totalImportance = BSO_SELECTED_FEATURES.reduce((s, f) => s + f.importance, 0)
                                    let cumulative = 0
                                    return BSO_SELECTED_FEATURES.map((f) => {
                                        const contrib = (f.importance / totalImportance) * 100
                                        cumulative += contrib
                                        const feat = allFeaturesData.find((d) => d.name === f.name)
                                        return (
                                            <tr key={f.rank} className="border-b border-border/50 hover:bg-muted/30">
                                                <td className="p-2 font-bold text-blue-500">#{f.rank}</td>
                                                <td className="p-2 font-medium">{f.name}</td>
                                                <td className="p-2">
                                                    <Badge variant="outline" className="text-xs" style={{ borderColor: FEATURE_CATEGORIES[feat?.category || ""]?.color }}>
                                                        {feat?.category}
                                                    </Badge>
                                                </td>
                                                <td className="p-2 text-right font-mono">{f.importance.toFixed(6)}</td>
                                                <td className="p-2 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-20 bg-muted rounded-full h-2">
                                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${contrib}%` }} />
                                                        </div>
                                                        <span className="font-mono w-12 text-right">{contrib.toFixed(1)}%</span>
                                                    </div>
                                                </td>
                                                <td className="p-2 text-center font-mono text-muted-foreground">{cumulative.toFixed(1)}%</td>
                                            </tr>
                                        )
                                    })
                                })()}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 p-3 bg-blue-500/10 rounded-lg text-sm">
                        <strong>Temel Gözlem:</strong> İlk 5 özellik (syn_count, Number, Tot sum, Rate, Max) toplam önemin{" "}
                        %{((BSO_SELECTED_FEATURES.slice(0, 5).reduce((s, f) => s + f.importance, 0) / BSO_SELECTED_FEATURES.reduce((s, f) => s + f.importance, 0)) * 100).toFixed(1)}{"'ini "}
                        oluşturur, DDoS tespiti için güçlü ayırt edici güce işaret eder.
                    </div>
                </CardContent>
            </Card>

            {/* 3. Category Selection Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Layers className="w-5 h-5 text-purple-500" />
                            Şekil 5.2: Kategoriye Göre Özellik Seçimi
                        </CardTitle>
                        <CardDescription>Her kategoriden kaç özellik seçildi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-15} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="selected" name="Seçilen" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="dropped" name="Çıkarılan" stackId="a" fill="#ef4444" opacity={0.5} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {categoryAnalysis.map((cat) => (
                                <div key={cat.category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="font-medium">{cat.category}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-muted-foreground">{cat.selected}/{cat.total}</span>
                                        <Badge variant={cat.selectionRate >= 50 ? "default" : "secondary"} className="text-xs">
                                            {cat.selectionRate}%
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Category Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Layers className="w-5 h-5 text-indigo-500" />
                            Şekil 5.3: Kategoriye Göre Seçilen Özelliklerin Dağılımı
                        </CardTitle>
                        <CardDescription>BSO tarafından seçilen 19 özelliğin kategori bileşimi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryAnalysis.filter((c) => c.selected > 0)}
                                        dataKey="selected"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        innerRadius={60}
                                        label={({ category, selected }: { category: string; selected: number }) => `${category}: ${selected}`}
                                        labelLine={true}
                                    >
                                        {categoryAnalysis.filter((c) => c.selected > 0).map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 4. Feature Overlap Between Optimizers */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        Tablo 5.2: Optimizatörler Arası Özellik Seçimi Uzlaşısı
                    </CardTitle>
                    <CardDescription>
                        Birden fazla optimizatör tarafından seçilen özellikler daha güçlü ilgililik kanıtına sahiptir
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Consensus Groups */}
                        <div className="space-y-4">
                            {[4, 3, 2, 1].map((count) => {
                                const features = featureOverlap.filter((f) => f.count === count)
                                if (features.length === 0) return null
                                return (
                                    <div key={count} className="p-3 rounded-lg border border-border/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={count === 4 ? "bg-emerald-600" : count === 3 ? "bg-blue-600" : count === 2 ? "bg-amber-600" : "bg-gray-500"}>
                                                {count}/4 optimizatör tarafından seçildi
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">({features.length} özellik)</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {features.map((f) => (
                                                <Badge key={f.name} variant="outline" className="text-xs">
                                                    {f.name}
                                                    <span className="ml-1 text-muted-foreground">
                                                        ({f.selectedBy.join(", ")})
                                                    </span>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Unique Features per Optimizer */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm mb-2">Optimizatör Başına Benzersiz Özellik Seçimi</h4>
                            {uniqueFeatures.map((opt) => (
                                <div key={opt.optimizer} className="p-3 rounded-lg border border-border/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">{FEATURE_SELECTION_COMPARISON[opt.optimizer].method}</span>
                                        <div className="flex gap-1">
                                            <Badge variant="outline" className="text-xs">{opt.total} toplam</Badge>
                                            <Badge className="bg-blue-600 text-xs">{opt.unique} benzersiz</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-muted rounded-full h-3">
                                            <div
                                                className="bg-blue-500 h-3 rounded-full"
                                                style={{ width: `${(opt.shared / opt.total) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">%{Math.round((opt.shared / opt.total) * 100)} paylaşılan</span>
                                    </div>
                                    {opt.uniqueFeatures.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {opt.uniqueFeatures.map((f) => (
                                                <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 5. Feature Selection Impact on Performance */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-500" />
                        Şekil 5.4: Özellik Seçiminin Model Performansına Etkisi
                    </CardTitle>
                    <CardDescription>
                        BSO-RF (19 özellik) vs tüm 39 özellikle RF karşılaştırması
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={[
                                    { metric: "Accuracy", bso: MODEL_RESULTS[0].accuracy, rf: MODEL_RESULTS[5].accuracy },
                                    { metric: "Precision", bso: MODEL_RESULTS[0].precision, rf: MODEL_RESULTS[5].precision },
                                    { metric: "Recall", bso: MODEL_RESULTS[0].recall, rf: MODEL_RESULTS[5].recall },
                                    { metric: "F1-Score", bso: MODEL_RESULTS[0].f1Score, rf: MODEL_RESULTS[5].f1Score },
                                    { metric: "F1-Macro", bso: MODEL_RESULTS[0].f1Macro, rf: MODEL_RESULTS[5].f1Macro },
                                    { metric: "Specificity", bso: MODEL_RESULTS[0].specificity, rf: MODEL_RESULTS[5].specificity },
                                ]}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                                    <PolarRadiusAxis domain={[75, 100]} tick={{ fontSize: 9 }} />
                                    <Radar name="BSO-RF (19 özellik)" dataKey="bso" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} strokeWidth={2} />
                                    <Radar name="RF (39 özellik)" dataKey="rf" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                                    <Legend />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold">Temel Bulgular</h4>
                            <div className="space-y-2 text-sm">
                                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                                    <div className="font-semibold text-emerald-600">✓ Özellik Azaltma</div>
                                    <p>BSO, rekabetçi performansı korurken özellikleri 39'dan 19'a düşürür (<strong>%51.3 azalma</strong>)</p>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                    <div className="font-semibold text-blue-600">✓ Doğruluk Karşılaştırması</div>
                                    <p>BSO-RF: {MODEL_RESULTS[0].accuracy}% vs RF: {MODEL_RESULTS[5].accuracy}% (Δ = {(MODEL_RESULTS[0].accuracy - MODEL_RESULTS[5].accuracy).toFixed(2)}%)</p>
                                </div>
                                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                                    <div className="font-semibold text-purple-600">✓ Tahmin Hızı</div>
                                    <p>BSO-RF tahmin: {MODEL_RESULTS[0].predictionTime}ms vs RF: {MODEL_RESULTS[5].predictionTime}ms (%{((1 - MODEL_RESULTS[0].predictionTime / MODEL_RESULTS[5].predictionTime) * 100).toFixed(0)} daha hızlı)</p>
                                </div>
                                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                                    <div className="font-semibold text-amber-600">✓ Aşırı Öğrenme Azaltma</div>
                                    <p>Daha az özellik model karmaşıklığını azaltır ve genellemeyi iyileştirir. Çapraz doğrulama std: ±{0.194}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 6. Dropped Features Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        Tablo 5.3: Çıkarılan Özellik Analizi (20 Özellik)
                    </CardTitle>
                    <CardDescription>BSO bu özellikleri neden çıkardı — düşük ayırt edici güç veya artıklık</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">#</th>
                                    <th className="text-left p-2 font-bold">Özellik Adı</th>
                                    <th className="text-left p-2 font-bold">Kategori</th>
                                    <th className="text-center p-2 font-bold">Diğerleri Tarafından Seçildi mi?</th>
                                    <th className="text-left p-2 font-bold">Çıkarılma Nedeni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allFeaturesData.filter((f) => !f.selected).map((f, idx) => {
                                    const overlap = featureOverlap.find((o) => o.name === f.name)
                                    const reasons: Record<string, string> = {
                                        "Protocol Type": "Belirli protokol göstergeleriyle artık (HTTP, TCP, vb.)",
                                        "syn_flag_number": "Daha yüksek öneme sahip syn_count ile ilişkili",
                                        "rst_flag_number": "Saldırı sınıflandırması için düşük ayırt edici güç",
                                        "ack_flag_number": "ack_count ve diğer bayrak özellikleriyle artık",
                                        "ece_flag_number": "Standart ağ trafiğinde nadiren kullanılır",
                                        "ack_count": "Diğer bayrak/sayım özellikleri tarafından kısmen yakalanır",
                                        "fin_count": "Düşük önem, fin_flag_number ile ilişkili",
                                        "rst_count": "Çoğu saldırı düzeninde düşük frekans",
                                        "Telnet": "CICIoT2023 veri setinde çok nadir protokol",
                                        "SMTP": "IoT saldırı trafiğinde minimum varlık",
                                        "IRC": "Eski protokol, modern saldırılarda nadiren görülür",
                                        "TCP": "Çok genel — belirli protokoller (HTTP, DNS) daha bilgilendirici",
                                        "ICMP": "Seçilen saldırı kategorilerinde sınırlı oluşum",
                                        "IPv": "Örnekler arasında çoğunlukla sabit",
                                        "Min": "AVG ve Max ile yüksek korelasyon",
                                        "AVG": "Tot sum ve Number tarafından kısmen yakalanır",
                                        "Std": "Variance ve diğer istatistiklerle ilişkili",
                                        "Tot size": "Tot sum ile yüksek korelasyon",
                                        "IAT": "Varış arası süre DDoS alt türleri için daha az ayırt edici",
                                        "Variance": "Std özelliğiyle artık",
                                    }
                                    return (
                                        <tr key={f.name} className="border-b border-border/50 hover:bg-muted/30">
                                            <td className="p-2 text-muted-foreground">{idx + 1}</td>
                                            <td className="p-2 font-medium text-red-400">{f.name}</td>
                                            <td className="p-2">
                                                <Badge variant="outline" className="text-xs">{f.category}</Badge>
                                            </td>
                                            <td className="p-2 text-center">
                                                {overlap ? (
                                                    <Badge className="bg-amber-600 text-xs">{overlap.selectedBy.join(", ")}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">Hiçbiri</span>
                                                )}
                                            </td>
                                            <td className="p-2 text-xs text-muted-foreground">{reasons[f.name] || "BSO uygunluk değerlendirmesinde düşük önem skoru"}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
