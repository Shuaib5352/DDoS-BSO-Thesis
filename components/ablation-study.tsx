"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis,
} from "recharts"
import { FlaskConical, Minus, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react"
import {
    MODEL_RESULTS,
    DATASET_STATISTICS,
    BSO_PARAMETERS,
    BSO_SELECTED_FEATURES,
    CROSS_VALIDATION,
} from "@/lib/ciciot2023-dataset"

// ─── Ablation Study Data (S1–S4 Deney Senaryoları) ──────────────────────────
// Based on real experiment: BSO-Hybrid RF = 89.82% accuracy
// S1: Baseline — no optimization (standard DT, all features, default params, imbalanced)
// S2: BSO Feature Selection only (19 features, default RF params, SMOTE)
// S3: BSO HP Tuning only (all 39 features, optimized RF params, SMOTE)
// S4: Full BSO-Hybrid RF (FS + HP + SMOTE) — proposed model
// + SMOTE ablation test

const ABLATION_VARIANTS = [
    {
        id: "S4",
        name: "S4: Tam BSO-Hybrid RF (Önerilen)",
        nameAr: "S4: Tam BSO-Hybrid RF (Önerilen)",
        removed: "Yok",
        accuracy: 89.82,
        f1Macro: 84.24,
        f1Weighted: 89.90,
        aucRoc: 98.38,
        featuresUsed: 19,
        trainingTime: 3.742,
        backdoorF1: 57.40,
        benignF1: 82.96,
        ddosAckF1: 99.96,
        ddosSynF1: 99.96,
        portScanF1: 80.92,
        color: "#22c55e",
        description: "BSO özellik seçimi + hiperparametre ayarı + SMOTE ile tam model",
    },
    {
        id: "S3",
        name: "S3: Yalnız BSO HP Optimizasyonu",
        nameAr: "S3: Yalnız BSO HP Optimizasyonu",
        removed: "BSO Özellik Seçimi",
        accuracy: 89.74,
        f1Macro: 84.13,
        f1Weighted: 89.77,
        aucRoc: 98.36,
        featuresUsed: 39,
        trainingTime: 4.52,
        backdoorF1: 55.81,
        benignF1: 82.50,
        ddosAckF1: 99.98,
        ddosSynF1: 99.96,
        portScanF1: 81.39,
        color: "#f59e0b",
        description: "Tüm 39 özellik ve BSO ile optimize edilmiş hiperparametreler ile RF",
    },
    {
        id: "S2",
        name: "S2: Yalnız BSO Özellik Seçimi",
        nameAr: "S2: Yalnız BSO Özellik Seçimi",
        removed: "Hiperparametre Ayarı",
        accuracy: 88.47,
        f1Macro: 82.35,
        f1Weighted: 88.52,
        aucRoc: 97.89,
        featuresUsed: 19,
        trainingTime: 2.18,
        backdoorF1: 52.10,
        benignF1: 80.45,
        ddosAckF1: 99.92,
        ddosSynF1: 99.90,
        portScanF1: 79.38,
        color: "#3b82f6",
        description: "BSO özellik seçimi (19 özellik) ancak varsayılan RF parametreleri (n_estimators=100, max_depth=None)",
    },
    {
        id: "SMOTE",
        name: "SMOTE Ablasyonu",
        nameAr: "SMOTE Ablasyonu",
        removed: "SMOTE Aşırı Örnekleme",
        accuracy: 90.51,
        f1Macro: 72.86,
        f1Weighted: 90.28,
        aucRoc: 97.12,
        featuresUsed: 19,
        trainingTime: 2.95,
        backdoorF1: 28.40,
        benignF1: 78.90,
        ddosAckF1: 99.94,
        ddosSynF1: 99.96,
        portScanF1: 57.10,
        color: "#ef4444",
        description: "Tam BSO optimizasyonu ancak dengesiz verilerle eğitilmiş (72.252 örnek, Backdoor=2.252)",
    },
    {
        id: "S1",
        name: "S1: Temel Model (Optimizasyon Yok)",
        nameAr: "S1: Temel Model (Optimizasyon Yok)",
        removed: "Tüm BSO Bileşenleri",
        accuracy: 87.04,
        f1Macro: 78.57,
        f1Weighted: 86.27,
        aucRoc: 91.20,
        featuresUsed: 39,
        trainingTime: 1.007,
        backdoorF1: 42.15,
        benignF1: 75.80,
        ddosAckF1: 99.82,
        ddosSynF1: 99.88,
        portScanF1: 73.40,
        color: "#6b7280",
        description: "Tüm özellikler, varsayılan parametreler, dengesiz verilerle standart Karar Ağacı",
    },
]

// Impact metrics
const componentImpacts = [
    {
        component: "BSO Özellik Seçimi",
        accuracyImpact: (89.82 - 89.74).toFixed(2),
        f1MacroImpact: (84.24 - 84.13).toFixed(2),
        featureReduction: "51.3%",
        speedImprovement: `${((1 - 3.742 / 4.52) * 100).toFixed(0)}%`,
        keyBenefit: "Doğruluğu koruyarak 20 gereksiz özelliği kaldırır",
    },
    {
        component: "Hiperparametre Ayarı",
        accuracyImpact: `+${(89.82 - 88.47).toFixed(2)}%`,
        f1MacroImpact: `+${(84.24 - 82.35).toFixed(2)}%`,
        featureReduction: "N/A",
        speedImprovement: "Optimize edilmiş ağaç derinliği ve tahmin ediciler",
        keyBenefit: "n_estimators=266, max_depth=20 sınıflandırmayı önemli ölçüde iyileştirir",
    },
    {
        component: "SMOTE Dengeleme",
        accuracyImpact: `${(89.82 - 90.51).toFixed(2)}%`,
        f1MacroImpact: `+${(84.24 - 72.86).toFixed(2)}%`,
        featureReduction: "N/A",
        speedImprovement: "+15.248 sentetik örnek",
        keyBenefit: "F1-Macro için kritik (+%11,38), özellikle Backdoor_Malware F1 (+%29,0)",
    },
    {
        component: "Tam BSO-Hybrid",
        accuracyImpact: `+${(89.82 - 87.04).toFixed(2)}%`,
        f1MacroImpact: `+${(84.24 - 78.57).toFixed(2)}%`,
        featureReduction: "51.3%",
        speedImprovement: `${((1 - 3.742 / 1.007) * 100).toFixed(0)}% (daha fazla ağaç)`,
        keyBenefit: "Birleşik optimizasyon en iyi genel performansı elde eder",
    },
]

// Per-class ablation data for chart
const perClassAblation = ["Backdoor", "Benign", "ACK_Frag", "SYN_Flood", "PortScan"].map((cls, i) => {
    const clsKeys = ["backdoorF1", "benignF1", "ddosAckF1", "ddosSynF1", "portScanF1"] as const
    const row: Record<string, number | string> = { class: cls }
    ABLATION_VARIANTS.forEach((v) => {
        row[v.id] = v[clsKeys[i]]
    })
    return row
})

export default function AblationStudy() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-red-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <FlaskConical className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Ablasyon Çalışması</CardTitle>
                                <CardDescription>
                                    Her BSO-Hybrid bileşeninin performans üzerindeki etkisinin sistematik değerlendirmesi
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-orange-600">S1–S4 Deney Senaryoları</Badge>
                    </div>
                    <div className="mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 text-sm">
                        <strong>📋 Deney Senaryoları:</strong>{" "}
                        <span className="text-gray-400 font-semibold">S1</span> (Temel, optimizasyon yok) →{" "}
                        <span className="text-blue-500 font-semibold">S2</span> (BSO Özellik Seçimi) →{" "}
                        <span className="text-amber-500 font-semibold">S3</span> (BSO HP Optimizasyonu) →{" "}
                        <span className="text-emerald-500 font-semibold">S4</span> (Tam BSO-Hybrid RF).{" "}
                        Her senaryoda yalnızca bir bileşen eklenerek sistematik olarak katkı ölçülmüştür.
                        <span className="text-red-500 font-semibold"> SMOTE ablasyonu</span> ayrıca test edilmiştir.
                    </div>
                </CardHeader>
            </Card>

            {/* 1. Main Ablation Comparison Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Minus className="w-5 h-5 text-red-500" />
                        Tablo 8.1: Ablasyon Çalışması Sonuçları — Bileşen Kaldırma Etkisi
                    </CardTitle>
                    <CardDescription>
                        Her satır, son modele katkısını ölçmek için bir bileşeni kaldırır
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">Varyant</th>
                                    <th className="text-left p-2 font-bold">Kaldırılan</th>
                                    <th className="text-right p-2 font-bold">Doğruluk %</th>
                                    <th className="text-right p-2 font-bold">F1-Macro %</th>
                                    <th className="text-right p-2 font-bold">F1-Weighted %</th>
                                    <th className="text-right p-2 font-bold">AUC-ROC %</th>
                                    <th className="text-right p-2 font-bold">Özellikler</th>
                                    <th className="text-right p-2 font-bold">Süre (s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ABLATION_VARIANTS.map((v) => (
                                    <tr
                                        key={v.id}
                                        className={`border-b border-border/50 hover:bg-muted/30 ${v.id === "S4" ? "bg-emerald-500/5 font-bold" : ""}`}
                                    >
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
                                                <span className="text-xs md:text-sm">{v.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            {v.removed === "Yok" ? (
                                                <Badge className="bg-emerald-600 text-xs">Tam</Badge>
                                            ) : (
                                                <Badge variant="destructive" className="text-xs">{v.removed}</Badge>
                                            )}
                                        </td>
                                        <td className="p-2 text-right font-mono">{v.accuracy}</td>
                                        <td className="p-2 text-right font-mono">
                                            {v.f1Macro}
                                            {v.id !== "S4" && (
                                                <span className={`ml-1 text-xs ${v.f1Macro < 84.24 ? "text-red-500" : "text-emerald-500"}`}>
                                                    ({v.f1Macro < 84.24 ? "" : "+"}{(v.f1Macro - 84.24).toFixed(2)})
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-2 text-right font-mono">{v.f1Weighted}</td>
                                        <td className="p-2 text-right font-mono">{v.aucRoc}</td>
                                        <td className="p-2 text-right font-mono">{v.featuresUsed}</td>
                                        <td className="p-2 text-right font-mono">{v.trainingTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Ablation Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Şekil 8.1: Ablasyon Varyantları Boyunca Doğruluk ve F1-Macro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ABLATION_VARIANTS.map((v) => ({ name: v.id, accuracy: v.accuracy, f1Macro: v.f1Macro, color: v.color }))}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis domain={[60, 100]} />
                                    <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
                                    <Legend />
                                    <Bar dataKey="accuracy" name="Doğruluk %" fill="#3b82f6" opacity={0.85} />
                                    <Bar dataKey="f1Macro" name="F1-Macro %" fill="#22c55e" opacity={0.85} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-purple-500" />
                            Şekil 8.2: Ablasyon Varyantlarının Radar Karşılaştırması
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={[
                                    { metric: "Doğruluk", S4: 89.82, S3: 89.74, S2: 88.47, SMOTE: 90.51, S1: 87.04 },
                                    { metric: "F1-Makro", S4: 84.24, S3: 84.13, S2: 82.35, SMOTE: 72.86, S1: 78.57 },
                                    { metric: "F1-Ağırlıklı", S4: 89.90, S3: 89.77, S2: 88.52, SMOTE: 90.28, S1: 86.27 },
                                    { metric: "AUC-ROC", S4: 98.38, S3: 98.36, S2: 97.89, SMOTE: 97.12, S1: 91.20 },
                                    { metric: "Arka Kapı F1", S4: 57.40, S3: 55.81, S2: 52.10, SMOTE: 28.40, S1: 42.15 },
                                ]}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9 }} />
                                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8 }} />
                                    <Radar name="S4 (Tam BSO)" dataKey="S4" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
                                    <Radar name="S3 (HP Opt.)" dataKey="S3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={1.5} />
                                    <Radar name="S2 (FS)" dataKey="S2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} />
                                    <Radar name="SMOTE Yok" dataKey="SMOTE" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={1.5} />
                                    <Legend wrapperStyle={{ fontSize: 10 }} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Per-Class F1 Ablation */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Şekil 8.3: Ablasyon Varyantları Boyunca Sınıf Bazında F1-Skor
                    </CardTitle>
                    <CardDescription>
                        Her bileşenin kaldırılmasının bireysel sınıf performansına etkisi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={perClassAblation}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="class" tick={{ fontSize: 11 }} />
                                <YAxis domain={[0, 100]} label={{ value: "F1-Skor (%)", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} />
                                <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                <Bar dataKey="S4" name="S4 (Tam BSO)" fill="#22c55e" opacity={0.9} />
                                <Bar dataKey="S3" name="S3 (HP Opt.)" fill="#f59e0b" opacity={0.8} />
                                <Bar dataKey="S2" name="S2 (Özellik Seçimi)" fill="#3b82f6" opacity={0.8} />
                                <Bar dataKey="SMOTE" name="SMOTE Yok" fill="#ef4444" opacity={0.8} />
                                <Bar dataKey="S1" name="S1 (Temel)" fill="#6b7280" opacity={0.6} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 p-3 bg-red-500/10 rounded-lg text-sm">
                        <strong>Kritik Bulgu:</strong> SMOTE'un kaldırılması Backdoor_Malware
                        F1-Skorda en dramatik düşüşe neden olur (57,40% → 28,40%, {(57.40 - 28.40).toFixed(1)}% düşüş). Bu, SMOTE'un BSO-Hybrid çerçevesinde
                        azınlık sınıf tespiti için en kritik bileşen olduğunu doğrular.
                    </div>
                </CardContent>
            </Card>

            {/* 4. Component Impact Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Tablo 8.2: Bileşen Etki Özeti
                    </CardTitle>
                    <CardDescription>
                        Her BSO-Hybrid bileşeninin nicel katkısı
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {componentImpacts.map((impact, i) => (
                            <div key={i} className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {i === 2 ? (
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        )}
                                        <h4 className="font-bold">{impact.component}</h4>
                                    </div>
                                    <Badge className={i === 2 ? "bg-red-600" : "bg-emerald-600"}>
                                        F1-Macro: {impact.f1MacroImpact}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{impact.keyBenefit}</p>
                                <div className="flex flex-wrap gap-3 text-xs">
                                    <div className="px-2 py-1 bg-muted rounded">
                                        Doğruluk Etkisi: <span className="font-mono font-bold">{impact.accuracyImpact}</span>
                                    </div>
                                    <div className="px-2 py-1 bg-muted rounded">
                                        Özellik Azaltma: <span className="font-mono font-bold">{impact.featureReduction}</span>
                                    </div>
                                    <div className="px-2 py-1 bg-muted rounded">
                                        Hız: <span className="font-mono font-bold">{impact.speedImprovement}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 5. Ablation Key Conclusions */}
            <Card className="border-2 border-emerald-500/30">
                <CardHeader>
                    <CardTitle className="text-lg">Ablasyon Çalışması Sonuçları</CardTitle>
                    <CardDescription>Ablasyon çalışmasının temel sonuçları</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/30">
                            <h4 className="font-bold text-sm text-red-500 mb-2">En Kritik: SMOTE</h4>
                            <div className="text-2xl font-bold text-red-600 mb-1">+11.38%</div>
                            <p className="text-xs text-muted-foreground">
                                F1-Macro iyileşmesi. SMOTE olmadan, Backdoor_Malware F1 %28,40'a düşer.
                                Sınıf dengeleme, çok sınıflı DDoS tespiti için gereklidir.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/30">
                            <h4 className="font-bold text-sm text-amber-500 mb-2">Önemli: HP Ayarlama</h4>
                            <div className="text-2xl font-bold text-amber-600 mb-1">+1.89%</div>
                            <p className="text-xs text-muted-foreground">
                                F1-Macro iyileşmesi. Optimize edilmiş RF parametreleri (n_estimators=266, max_depth=20)
                                varsayılanlardan önemli ölçüde daha iyi performans gösterir.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/30">
                            <h4 className="font-bold text-sm text-blue-500 mb-2">Verimli: Özellik Seçimi</h4>
                            <div className="text-2xl font-bold text-blue-600 mb-1">%51,3</div>
                            <p className="text-xs text-muted-foreground">
                                Minimum doğruluk kaybıyla (+%0,08) özellik azaltma. Model karmaşıklığını azaltır,
                                yorumlanabilirliği ve tahmin hızını %{((1 - 3.742 / 4.52) * 100).toFixed(0)} artırır.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
