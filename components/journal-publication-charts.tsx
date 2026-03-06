"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    ScatterChart, Scatter, ZAxis, Cell,
} from "recharts"
import {
    BarChart3, Clock, Target, Cpu, Server, Shield, Info, Layers, CheckCircle2,
} from "lucide-react"
import {
    MODEL_RESULTS,
    BSO_RF_PER_CLASS,
    COMPUTATIONAL_EFFICIENCY,
    CROSS_VALIDATION,
} from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   COLOR PALETTE
   ═══════════════════════════════════════════════════════════════ */
const COLORS = {
    precision: "#3b82f6",
    recall: "#10b981",
    f1: "#f59e0b",
    proposed: "#6366f1",
    metaheuristic: "#8b5cf6",
    baseline: "#94a3b8",
    xgboost: "#ef4444",
}

const MODEL_COLORS = [
    "#6366f1", // BSO-Hybrid RF
    "#818cf8", // BSO-SVM
    "#8b5cf6", // PSO-RF
    "#a78bfa", // GA-RF
    "#7c3aed", // GWO-RF
    "#3b82f6", // RF
    "#f97316", // SVM
    "#22c55e", // DT
    "#06b6d4", // KNN
    "#f43f5e", // NB
    "#eab308", // LR
    "#ef4444", // XGBoost
]

/* ═══════════════════════════════════════════════════════════════
   1. PER-CLASS PERFORMANCE BAR CHART (BSO-Hybrid RF)
   ═══════════════════════════════════════════════════════════════ */
function PerClassPerformanceChart() {
    const data = BSO_RF_PER_CLASS.map((c) => ({
        name: c.className.replace("DDoS-", "").replace("_", " "),
        fullName: c.className,
        Kesinlik: c.precision,
        Duyarlılık: c.recall,
        "F1-Skor": c.f1Score,
        Destek: c.support,
    }))

    return (
        <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                        <Target className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Sınıf Bazlı Performans — BSO-Hibrit RF
                    </h3>
                    <Badge className="ml-2 bg-indigo-600 text-white text-[10px] border-0 font-mono font-bold">Şekil 4.9</Badge>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] border-0">
                        5 Sınıf
                    </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5 ml-11">
                    Her saldırı türü için kesinlik, duyarlılık ve F1-skoru (test seti: 20.644 örnek)
                </p>

                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10 }} />
                            <Tooltip
                                formatter={(value: number, name: string) => [`%${value.toFixed(2)}`, name]}
                                contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #e2e8f0" }}
                            />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="Kesinlik" fill={COLORS.precision} radius={[0, 4, 4, 0]} barSize={14} />
                            <Bar dataKey="Duyarlılık" fill={COLORS.recall} radius={[0, 4, 4, 0]} barSize={14} />
                            <Bar dataKey="F1-Skor" fill={COLORS.f1} radius={[0, 4, 4, 0]} barSize={14} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Summary callout for Backdoor_Malware */}
                <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                            <strong>Backdoor_Malware</strong> sınıfı en düşük F1-skoruna (%57.40) sahiptir.
                            Bu, yalnızca 3.218 eğitim örneğine sahip olması (diğer sınıfların %12.9&apos;u) ve karmaşık saldırı kalıplarından kaynaklanmaktadır.
                            SMOTE ile %28.40&apos;dan %57.40&apos;a iyileştirilmiştir (+%102 artış).
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

/* ═══════════════════════════════════════════════════════════════
   2. COMPUTATIONAL EFFICIENCY CHART
   ═══════════════════════════════════════════════════════════════ */
function ComputationalEfficiencyChart() {
    // Prepare training time data (log scale friendly)
    const trainingData = COMPUTATIONAL_EFFICIENCY.map((m, i) => ({
        name: m.model.replace(" (Proposed)", "").replace(" (Linear)", ""),
        "Eğitim Süresi (s)": m.trainingTime,
        "Öznitelik Sayısı": m.featuresUsed,
        color: MODEL_COLORS[i],
        isProposed: m.model.includes("Proposed"),
    }))

    // Scatter: features vs accuracy (bubble = training time)
    const scatterData = MODEL_RESULTS.map((m, i) => ({
        name: m.name.replace(" (Proposed)", "").replace(" (Linear)", ""),
        features: m.featuresUsed,
        accuracy: m.accuracy,
        trainingTime: m.trainingTime,
        color: MODEL_COLORS[i],
        isProposed: m.name.includes("Proposed"),
    }))

    return (
        <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md">
                        <Clock className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Hesaplama Verimliliği Karşılaştırması
                    </h3>
                    <Badge className="ml-2 bg-indigo-600 text-white text-[10px] border-0 font-mono font-bold">Şekil 4.10–4.11</Badge>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] border-0">
                        12 Model
                    </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5 ml-11">
                    Eğitim süresi ve öznitelik sayısı — doğruluk ile birlikte değerlendirilmeli
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Training Time Bar Chart */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            Eğitim Süresi (saniye)
                        </h4>
                        <div className="h-[360px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trainingData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis type="number" tick={{ fontSize: 10 }} />
                                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 9 }} />
                                    <Tooltip
                                        formatter={(value: number) => [`${value.toFixed(3)} s`, "Eğitim Süresi"]}
                                        contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }}
                                    />
                                    <Bar dataKey="Eğitim Süresi (s)" radius={[0, 4, 4, 0]} barSize={16}>
                                        {trainingData.map((entry, idx) => (
                                            <Cell
                                                key={idx}
                                                fill={entry.isProposed ? "#6366f1" : "#94a3b8"}
                                                fillOpacity={entry.isProposed ? 1 : 0.7}
                                                stroke={entry.isProposed ? "#4f46e5" : "transparent"}
                                                strokeWidth={entry.isProposed ? 2 : 0}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Features vs Accuracy Scatter */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-500" />
                            Öznitelik Sayısı vs Doğruluk (%)
                        </h4>
                        <div className="h-[360px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis type="number" dataKey="features" name="Öznitelik" tick={{ fontSize: 10 }} domain={[15, 42]} label={{ value: "Öznitelik Sayısı", position: "bottom", fontSize: 10 }} />
                                    <YAxis type="number" dataKey="accuracy" name="Doğruluk" tick={{ fontSize: 10 }} domain={[60, 92]} label={{ value: "Doğruluk (%)", angle: -90, position: "insideLeft", fontSize: 10 }} />
                                    <ZAxis type="number" dataKey="trainingTime" range={[60, 400]} name="Eğitim Süresi" />
                                    <Tooltip
                                        formatter={(value: number, name: string) => {
                                            if (name === "Doğruluk") return [`%${value.toFixed(2)}`, name]
                                            if (name === "Eğitim Süresi") return [`${value.toFixed(3)} s`, name]
                                            return [value, name]
                                        }}
                                        contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }}
                                    />
                                    <Scatter data={scatterData} name="Modeller">
                                        {scatterData.map((entry, idx) => (
                                            <Cell
                                                key={idx}
                                                fill={entry.isProposed ? "#6366f1" : entry.color}
                                                stroke={entry.isProposed ? "#4f46e5" : "#64748b"}
                                                strokeWidth={entry.isProposed ? 3 : 1}
                                                fillOpacity={0.8}
                                            />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                                BSO-Hibrit RF (19 öznitelik)
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
                                Diğer modeller (39 öznitelik)
                            </span>
                            <span>Daire boyutu = Eğitim süresi</span>
                        </div>
                    </div>
                </div>

                {/* Key Insight */}
                <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40">
                    <div className="flex items-start gap-2">
                        <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed">
                            <strong>BSO-Hibrit RF</strong>, yalnızca 19 öznitelik ile %89.82 doğruluk elde ederek,
                            39 öznitelik kullanan Random Forest (%89.74) ile istatistiksel olarak eşdeğer performans göstermiş (p=0.38)
                            ancak %51.3 daha az öznitelik kullanarak hesaplama karmaşıklığını önemli ölçüde azaltmıştır.
                            SVM&apos;nin eğitim süresi (68.2 s) diğer tüm modellerden en az 14× daha yüksektir.
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

/* ═══════════════════════════════════════════════════════════════
   3. MULTI-MODEL RADAR CHART (Top 6 Models)
   ═══════════════════════════════════════════════════════════════ */
function MultiModelRadarChart() {
    // Select top 6 most interesting models for readability
    const selectedModels = [
        MODEL_RESULTS[0],  // BSO-Hybrid RF
        MODEL_RESULTS[11], // XGBoost
        MODEL_RESULTS[4],  // GWO-RF
        MODEL_RESULTS[5],  // Random Forest
        MODEL_RESULTS[3],  // GA-RF
        MODEL_RESULTS[7],  // Decision Tree
    ]

    const metrics = ["Doğruluk", "Kesinlik", "Duyarlılık", "F1-Makro", "AUC-ROC", "MCC×100"]

    const radarData = metrics.map((metric) => {
        const entry: Record<string, string | number> = { metric }
        selectedModels.forEach((m) => {
            const shortName = m.name.replace(" (Proposed)", "").replace(" (Linear)", "")
            switch (metric) {
                case "Doğruluk": entry[shortName] = m.accuracy; break
                case "Kesinlik": entry[shortName] = m.precision; break
                case "Duyarlılık": entry[shortName] = m.recall; break
                case "F1-Makro": entry[shortName] = m.f1Macro; break
                case "AUC-ROC": entry[shortName] = m.aucRoc; break
                case "MCC×100": entry[shortName] = m.mcc * 100; break
            }
        })
        return entry
    })

    const radarColors = ["#6366f1", "#ef4444", "#7c3aed", "#3b82f6", "#a78bfa", "#22c55e"]

    return (
        <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-md">
                        <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Çok Metrikli Model Karşılaştırması — Radar Grafiği
                    </h3>
                    <Badge className="ml-2 bg-indigo-600 text-white text-[10px] border-0 font-mono font-bold">Şekil 4.12</Badge>
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] border-0">
                        6 Model × 6 Metrik
                    </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5 ml-11">
                    En iyi 6 modelin 6 farklı performans metriği üzerinden kapsamlı karşılaştırması
                </p>

                <div className="h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} outerRadius="72%">
                            <PolarGrid strokeDasharray="3 3" opacity={0.4} />
                            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
                            <PolarRadiusAxis angle={30} domain={[70, 100]} tick={{ fontSize: 9 }} />
                            {selectedModels.map((m, i) => {
                                const shortName = m.name.replace(" (Proposed)", "").replace(" (Linear)", "")
                                return (
                                    <Radar
                                        key={shortName}
                                        name={shortName}
                                        dataKey={shortName}
                                        stroke={radarColors[i]}
                                        fill={radarColors[i]}
                                        fillOpacity={i === 0 ? 0.2 : 0.05}
                                        strokeWidth={i === 0 ? 2.5 : 1.5}
                                        strokeDasharray={i === 0 ? "" : "4 2"}
                                    />
                                )
                            })}
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

/* ═══════════════════════════════════════════════════════════════
   4. CROSS-VALIDATION COMPARISON BAR CHART (All Models)
   ═══════════════════════════════════════════════════════════════ */
function CVComparisonChart() {
    const cvData = CROSS_VALIDATION.foldResults.map((m) => ({
        name: m.model.replace("BSO-Hybrid RF", "BSO-RF").replace(" (Linear)", "").replace("Logistic Regression", "LogReg").replace("Random Forest", "RF").replace("Decision Tree", "DT").replace("Naive Bayes", "NB").replace("K-Nearest Neighbors", "KNN"),
        "Ortalama Doğruluk": m.meanAccuracy,
        "Standart Sapma": m.stdAccuracy,
        isProposed: m.model.includes("BSO-Hybrid"),
    }))

    return (
        <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        10-Katlı Çapraz Doğrulama Karşılaştırması
                    </h3>
                    <Badge className="ml-2 bg-indigo-600 text-white text-[10px] border-0 font-mono font-bold">Şekil 4.13</Badge>
                    <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 text-[10px] border-0">
                        SMOTE Her Katta İçeride
                    </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5 ml-11">
                    Tüm 12 modelin çapraz doğrulama ortalama doğrulukları — hata çubukları ±1 standart sapmayı gösterir
                </p>

                <div className="h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cvData} margin={{ top: 10, right: 30, left: 10, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis dataKey="name" tick={{ fontSize: 9, angle: -35 }} interval={0} height={60} />
                            <YAxis domain={[55, 92]} tick={{ fontSize: 10 }} label={{ value: "Doğruluk (%)", angle: -90, position: "insideLeft", fontSize: 10 }} />
                            <Tooltip
                                formatter={(value: number, name: string) => [`%${value.toFixed(2)}`, name]}
                                contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }}
                            />
                            <Bar dataKey="Ortalama Doğruluk" radius={[4, 4, 0, 0]} barSize={28}>
                                {cvData.map((entry, idx) => (
                                    <Cell
                                        key={idx}
                                        fill={entry.isProposed ? "#6366f1" : "#94a3b8"}
                                        fillOpacity={entry.isProposed ? 1 : 0.7}
                                        stroke={entry.isProposed ? "#4f46e5" : "transparent"}
                                        strokeWidth={entry.isProposed ? 2 : 0}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

/* ═══════════════════════════════════════════════════════════════
   5. REPRODUCIBILITY & ENVIRONMENT INFORMATION
   ═══════════════════════════════════════════════════════════════ */
function ReproducibilityInfo() {
    const envInfo = [
        {
            category: "Donanım", items: [
                { key: "İşlemci", value: "Intel Core (x86_64)" },
                { key: "RAM", value: "≥16 GB" },
                { key: "İşletim Sistemi", value: "Windows" },
                { key: "GPU", value: "Kullanılmadı (CPU tabanlı ML)" },
            ]
        },
        {
            category: "Yazılım Ortamı", items: [
                { key: "Python", value: "3.13.12" },
                { key: "scikit-learn", value: "1.8.0" },
                { key: "XGBoost", value: "3.2.0" },
                { key: "imbalanced-learn", value: "0.14.1" },
                { key: "scipy", value: "1.17.0" },
                { key: "numpy", value: "≥2.0" },
                { key: "pandas", value: "≥2.0" },
            ]
        },
        {
            category: "Deney Parametreleri", items: [
                { key: "Random Seed", value: "42 (tüm bölmeler ve modeller)" },
                { key: "Veri Bölme", value: "Tabakalı 70/10/20 (train/val/test)" },
                { key: "CV Katları", value: "10-katlı tabakalı (StratifiedKFold)" },
                { key: "SMOTE Stratejisi", value: "Her CV katlama içinde ayrı uygulandı" },
                { key: "Ölçeklendirme", value: "StandardScaler (z-score normalizasyonu)" },
                { key: "Deney Tarihi", value: "6 Mart 2026" },
                { key: "Toplam Çalışma Süresi", value: "~42.3 dakika (2541 saniye)" },
            ]
        },
        {
            category: "BSO Optimizasyon Parametreleri", items: [
                { key: "Popülasyon Boyutu", value: "25" },
                { key: "Maksimum İterasyon", value: "50" },
                { key: "Frekans Aralığı", value: "[0.0, 2.0]" },
                { key: "Başlangıç Ses Yüksekliği (A₀)", value: "0.95" },
                { key: "Başlangıç Darbe Oranı (r₀)", value: "0.5" },
                { key: "α (Ses Azalma)", value: "0.9" },
                { key: "γ (Darbe Artış)", value: "0.9" },
                { key: "Uygunluk Fonksiyonu", value: "1 − F1_macro + 0.01 × (n_selected / n_total)" },
            ]
        },
    ]

    return (
        <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md">
                        <Server className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Tekrarlanabilirlik Bilgileri
                    </h3>
                    <Badge className="ml-2 bg-indigo-600 text-white text-[10px] border-0 font-mono font-bold">Tablo 4.14</Badge>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] border-0">
                        Reproducibility
                    </Badge>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5 ml-11">
                    Deneylerin bağımsız olarak tekrarlanabilmesi için gerekli tüm ortam ve parametre bilgileri
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {envInfo.map((section) => (
                        <div key={section.category} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/60 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">
                                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{section.category}</h4>
                            </div>
                            <div className="p-3 space-y-1.5">
                                {section.items.map((item) => (
                                    <div key={item.key} className="flex justify-between items-center py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.key}</span>
                                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 font-mono">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reproducibility Note */}
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                            <strong>Açık Kaynak:</strong> Tüm deney kodları, veri ön işleme betikleri ve bu etkileşimli kontrol paneli
                            <a href="https://github.com/Shuaib5352/DDoS-BSO-Thesis" target="_blank" rel="noopener noreferrer" className="underline font-bold ml-1">GitHub</a>
                            &apos;da açık erişimlidir. random_state=42 ile tüm sonuçlar birebir tekrarlanabilir.
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT — Journal Publication Charts
   ═══════════════════════════════════════════════════════════════ */
export default function JournalPublicationCharts() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-0 overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />
                <CardContent className="relative pt-6 pb-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-lg font-bold text-white">
                            Yayın İçin Ek Şekiller ve Bilgiler
                        </h2>
                        <p className="text-xs text-white/80 max-w-2xl mx-auto">
                            Uluslararası dergi yayını için gerekli olan ek görselleştirmeler:
                            sınıf bazlı performans, hesaplama verimliliği, çok metrikli karşılaştırma ve tekrarlanabilirlik bilgileri
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Charts */}
            <PerClassPerformanceChart />
            <ComputationalEfficiencyChart />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <MultiModelRadarChart />
                <CVComparisonChart />
            </div>
            <ReproducibilityInfo />
        </div>
    )
}
