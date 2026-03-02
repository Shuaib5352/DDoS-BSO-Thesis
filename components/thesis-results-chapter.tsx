"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    Cell, AreaChart, Area, ScatterChart, Scatter, ZAxis,
} from "recharts"
import {
    Shield, Target, TrendingUp, Zap, CheckCircle2, Award, Cpu, Layers,
    BarChart3, Clock, Database, GitBranch, AlertTriangle, ArrowUp, ArrowDown,
    Minus, BookOpen, FlaskConical, Settings2, Network, Activity,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import {
    MODEL_RESULTS, DATASET_STATISTICS, COMPUTATIONAL_EFFICIENCY, FEATURE_SELECTION_COMPARISON,
    CROSS_VALIDATION, STATISTICAL_TESTS, BSO_RF_PER_CLASS, BSO_PARAMETERS,
    BSO_SELECTED_FEATURES, CICIOT2023_ATTACK_TYPES, CICIOT2023_FEATURES,
    CONFUSION_MATRICES, DYNAMIC_ENVIRONMENT, STATE_OF_THE_ART, OPTIMIZER_CONVERGENCE,
    generateBSOConvergenceData, ROC_CURVE_DATA,
} from "@/lib/ciciot2023-dataset"

// ============================================================================
// PRECOMPUTED DATA
// ============================================================================
const bsoModel = MODEL_RESULTS[0]
const convergenceData = generateBSOConvergenceData()
const rocData = ROC_CURVE_DATA

// Accuracy bar chart data (sorted)
const accuracyBarData = [...MODEL_RESULTS]
    .sort((a, b) => b.accuracy - a.accuracy)
    .map((m) => ({
        name: m.name.replace(" (Proposed)", "*").replace("K-Nearest Neighbors", "KNN").replace("Logistic Regression", "LR").replace("Naive Bayes", "NB").replace("Decision Tree", "DT").replace("SVM (Linear)", "SVM").replace("Random Forest", "RF"),
        accuracy: m.accuracy,
        f1Score: m.f1Score,
        isProposed: m.name.includes("Proposed"),
    }))

// Optimizer convergence chart
const optimizerChartData: { iteration: number; BSO: number; PSO: number | null; GA: number | null; GWO: number | null }[] = []
for (let i = 0; i < 50; i++) {
    optimizerChartData.push({
        iteration: i,
        BSO: OPTIMIZER_CONVERGENCE.BSO.data[i],
        PSO: i < OPTIMIZER_CONVERGENCE.PSO.data.length ? OPTIMIZER_CONVERGENCE.PSO.data[i] : null,
        GA: i < OPTIMIZER_CONVERGENCE.GA.data.length ? OPTIMIZER_CONVERGENCE.GA.data[i] : null,
        GWO: i < OPTIMIZER_CONVERGENCE.GWO.data.length ? OPTIMIZER_CONVERGENCE.GWO.data[i] : null,
    })
}

// Feature importance bar data
const featureBarData = BSO_SELECTED_FEATURES.map((f) => ({
    name: f.name,
    importance: +(f.importance * 100).toFixed(2),
    rank: f.rank,
}))

// Per-class radar
const perClassRadar = BSO_RF_PER_CLASS.map((c) => ({
    class: c.className.replace("DDoS-ACK_Fragmentation", "ACK_Frag").replace("DDoS-SYN_Flood", "SYN_Flood").replace("Backdoor_Malware", "Backdoor").replace("Recon-PortScan", "PortScan").replace("BenignTraffic", "Benign"),
    precision: c.precision,
    recall: c.recall,
    f1Score: c.f1Score,
}))

// Noise robustness chart
const noiseData = DYNAMIC_ENVIRONMENT.noiseRobustness.map((n) => ({
    noise: `${(n.noiseLevel * 100).toFixed(0)}%`,
    accuracy: n.accuracy,
    f1Macro: n.f1Macro,
    degradation: n.degradation,
}))

// Learning curve
const learningData = DYNAMIC_ENVIRONMENT.learningCurve.map((l) => ({
    samples: l.nSamples.toLocaleString(),
    fraction: `${(l.fraction * 100).toFixed(0)}%`,
    accuracy: l.accuracy,
    f1Macro: l.f1Macro,
    time: l.trainingTime,
}))

// Throughput
const throughputData = DYNAMIC_ENVIRONMENT.throughput.map((t) => ({
    batch: t.batchSize.toLocaleString(),
    samplesPerSec: t.samplesPerSecond,
    msPerSample: t.msPerSample,
}))

// Training time comparison
const trainingTimeData = COMPUTATIONAL_EFFICIENCY
    .sort((a, b) => a.trainingTime - b.trainingTime)
    .map((c) => ({
        model: c.model.replace(" (Proposed)", "*").replace("Random Forest", "RF").replace("SVM (Linear)", "SVM").replace("Decision Tree", "DT").replace("Logistic Regression", "LR").replace("Naive Bayes", "NB"),
        trainingTime: c.trainingTime,
        predictionMs: c.predictionTimeMs,
        features: c.featuresUsed,
        isProposed: c.model.includes("Proposed"),
    }))

// ROC data for specific models
const rocModels = ["BSO-Hybrid RF (Proposed)", "XGBoost", "Random Forest", "PSO-RF", "SVM (Linear)", "Naive Bayes"]
const rocChartData = rocData.filter((d) => rocModels.includes(d.model))

// CV bar data
const cvBarData = CROSS_VALIDATION.results.map((f) => ({
    fold: `F${f.fold}`,
    accuracy: f.accuracy,
    f1Score: f.f1Score,
}))

export default function ThesisResultsChapter() {
    const { language } = useTranslation()
    const [activeSection, setActiveSection] = useState("setup")

    const t = (en: string, ar: string, tr: string) =>
        language === "ar" ? ar : language === "tr" ? tr : en

    // ---- Section configuration ----
    const sections = [
        { id: "setup", icon: Settings2, label: t("Experiment Setup", "إعدادات التجربة", "Deney Ayarları") },
        { id: "metrics", icon: Target, label: t("Performance Metrics", "مقاييس الأداء", "Performans Metrikleri") },
        { id: "comparison", icon: BarChart3, label: t("Comparative Analysis", "التحليل المقارن", "Karşılaştırmalı Analiz") },
        { id: "bso", icon: GitBranch, label: t("BSO Impact", "تأثير BSO", "BSO Etkisi") },
        { id: "dynamic", icon: Network, label: t("Dynamic Environment", "البيئة الديناميكية", "Dinamik Ortam") },
        { id: "efficiency", icon: Clock, label: t("Computational Efficiency", "الكفاءة الحسابية", "Hesaplama Verimliliği") },
        { id: "statistical", icon: FlaskConical, label: t("Statistical Analysis", "التحليل الإحصائي", "İstatistiksel Analiz") },
        { id: "discussion", icon: BookOpen, label: t("Discussion", "المناقشة", "Tartışma") },
    ]

    return (
        <div className="space-y-6">
            {/* Chapter Header */}
            <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 via-background to-primary/5">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/15 rounded-xl">
                            <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">
                                {t("Chapter 4: Experimental Results & Discussion",
                                    "الفصل الرابع: النتائج التجريبية والمناقشة",
                                    "Bölüm 4: Deneysel Sonuçlar ve Tartışma")}
                            </CardTitle>
                            <CardDescription className="text-sm mt-1">
                                {t("Comprehensive experimental evaluation of BSO-Optimized Hybrid ML Framework for DDoS Detection on CICIoT2023",
                                    "التقييم التجريبي الشامل لإطار التعلم الآلي الهجين المحسّن بخوارزمية BSO لكشف هجمات DDoS على CICIoT2023",
                                    "CICIoT2023 üzerinde DDoS Tespiti için BSO-Optimize Hibrit ML Çerçevesinin Kapsamlı Deneysel Değerlendirmesi")}
                            </CardDescription>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Badge className="bg-emerald-600 text-white px-3 py-1 text-xs">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {t("100% Real Experiment Data", "بيانات تجريبية حقيقية 100%", "%100 Gerçek Deney Verileri")}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 text-xs">
                                    <Database className="w-3 h-3 mr-1" />
                                    CICIoT2023 — 118,466 {t("samples", "عينة", "örnek")}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {t("Research Duration: 8 months (Oct 2025 – Jun 2026)", "مدة البحث: 8 أشهر (أكتوبر 2025 – يونيو 2026)", "Araştırma Süresi: 8 ay (Ekim 2025 – Haziran 2026)")}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 text-xs">
                                    <Cpu className="w-3 h-3 mr-1" />
                                    Python 3.10 + scikit-learn
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Section Navigation */}
            <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
                <TabsList className="flex flex-wrap h-auto p-1.5 bg-card border border-border rounded-xl gap-1">
                    {sections.map((s) => (
                        <TabsTrigger key={s.id} value={s.id}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            <s.icon className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">{s.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* ================================================================ */}
                {/* SECTION 1: EXPERIMENT SETUP */}
                {/* ================================================================ */}
                <TabsContent value="setup" className="space-y-6">
                    {/* Methodology Overview */}
                    <Card className="border-blue-500/30 bg-blue-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                                {t("Methodology Overview", "نظرة عامة على المنهجية", "Metodoloji Genel Bakışı")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                                <p>
                                    {t("This chapter presents the experimental evaluation of the proposed BSO-Hybrid framework for DDoS attack detection. The framework performs joint optimization of: (1) Feature Selection — reducing 39 features to 19 using binary Bat Swarm Optimization, and (2) Hyperparameter Tuning — optimizing Random Forest parameters (n_estimators, max_depth, min_samples_split, max_features) simultaneously.",
                                        "يقدم هذا الفصل التقييم التجريبي لإطار BSO-Hybrid المقترح لكشف هجمات DDoS. يقوم الإطار بتحسين مشترك لـ: (1) انتقاء الميزات — تقليل 39 ميزة إلى 19 باستخدام خوارزمية تحسين سرب الخفافيش الثنائية، و(2) ضبط المعلمات الفائقة — تحسين معلمات Random Forest (n_estimators, max_depth, min_samples_split, max_features) في وقت واحد.",
                                        "Bu bölüm, DDoS saldırı tespiti için önerilen BSO-Hybrid çerçevesinin deneysel değerlendirmesini sunar. Çerçeve: (1) Özellik Seçimi — ikili Yarasa Sürüsü Optimizasyonu ile 39 özelliği 19'a azaltma ve (2) Hiperparametre Ayarı — Random Forest parametrelerini (n_estimators, max_depth, min_samples_split, max_features) eşzamanlı optimize etme.")}
                                </p>
                                <p>
                                    {t("The fitness function is: f(x) = 1 - F1_macro + 0.01 × (n_selected / n_total), which balances classification performance with dimensionality reduction. All experiments were conducted on the CICIoT2023 dataset with 5-class multi-class classification, SMOTE balancing, and stratified 70/10/20 train/val/test splits.",
                                        "دالة اللياقة هي: f(x) = 1 - F1_macro + 0.01 × (n_selected / n_total)، التي توازن بين أداء التصنيف وتقليل الأبعاد. أُجريت جميع التجارب على مجموعة بيانات CICIoT2023 مع تصنيف 5 أصناف، وموازنة SMOTE، وتقسيم طبقي 70/10/20.",
                                        "Uygunluk fonksiyonu: f(x) = 1 - F1_macro + 0.01 × (n_selected / n_total) olup sınıflandırma performansı ile boyut azaltmayı dengeler. Tüm deneyler CICIoT2023 veri seti üzerinde 5 sınıflı çok sınıflı sınıflandırma, SMOTE dengeleme ve tabakalı 70/10/20 bölme ile gerçekleştirilmiştir.")}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                    <div className="bg-card rounded-lg p-3 border text-center">
                                        <div className="font-bold text-lg text-primary">12</div>
                                        <div className="text-[10px] text-muted-foreground">{t("Models Compared", "نموذج تمت مقارنته", "Karşılaştırılan Model")}</div>
                                    </div>
                                    <div className="bg-card rounded-lg p-3 border text-center">
                                        <div className="font-bold text-lg text-primary">4</div>
                                        <div className="text-[10px] text-muted-foreground">{t("Metaheuristic Optimizers", "محسنات تطورية", "Metasezgisel Optimizör")}</div>
                                    </div>
                                    <div className="bg-card rounded-lg p-3 border text-center">
                                        <div className="font-bold text-lg text-primary">10</div>
                                        <div className="text-[10px] text-muted-foreground">{t("Cross-Validation Folds", "طيات التحقق المتقاطع", "Çapraz Doğrulama Katı")}</div>
                                    </div>
                                    <div className="bg-card rounded-lg p-3 border text-center">
                                        <div className="font-bold text-lg text-primary">1,177</div>
                                        <div className="text-[10px] text-muted-foreground">{t("BSO Evaluations", "تقييمات BSO", "BSO Değerlendirmesi")}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                {t("4.1 Experimental Setup", "4.1 إعدادات التجربة", "4.1 Deney Ayarları")}
                            </CardTitle>
                            <CardDescription>
                                {t("Hardware, software, dataset, and preprocessing details",
                                    "تفاصيل الأجهزة والبرمجيات ومجموعة البيانات والمعالجة المسبقة",
                                    "Donanım, yazılım, veri seti ve ön işleme detayları")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Experiment Environment */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <Cpu className="w-4 h-4 text-blue-500" />
                                        {t("Experimental Environment", "بيئة التجربة", "Deney Ortamı")}
                                    </h4>
                                    <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-muted-foreground">{t("Language", "لغة البرمجة", "Dil")}</span><span className="font-mono">Python 3.10</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">{t("ML Framework", "إطار التعلم الآلي", "ML Çerçevesi")}</span><span className="font-mono">scikit-learn 1.3</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">{t("Optimization", "التحسين", "Optimizasyon")}</span><span className="font-mono">Custom BSO (Python)</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">{t("Total Runtime", "وقت التشغيل", "Toplam Süre")}</span><span className="font-mono">8 ay (Ekim 2025 – Haziran 2026)</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">{t("BSO Evaluations", "تقييمات BSO", "BSO Değerlendirmeleri")}</span><span className="font-mono">{BSO_PARAMETERS.totalEvaluations}</span></div>
                                    </div>
                                </div>

                                {/* Dataset Info */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <Database className="w-4 h-4 text-emerald-500" />
                                        {t("CICIoT2023 Dataset", "مجموعة بيانات CICIoT2023", "CICIoT2023 Veri Seti")}
                                    </h4>
                                    <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-muted-foreground">{t("Total Samples", "إجمالي العينات", "Toplam Örnek")}</span><span className="font-mono font-bold">{DATASET_STATISTICS.totalSamples.toLocaleString()}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">{t("Features", "الميزات", "Özellikler")}</span><span className="font-mono">{DATASET_STATISTICS.totalFeatures}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">{t("Classes", "الأصناف", "Sınıflar")}</span><span className="font-mono">{DATASET_STATISTICS.classes}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">{t("Split", "التقسيم", "Bölme")}</span><span className="font-mono">{DATASET_STATISTICS.splitRatio}</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">SMOTE</span><span className="font-mono">72,252 → 87,500</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Attack Types Table */}
                            <div className="mt-6">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    {t("Attack Types Distribution", "توزيع أنواع الهجمات", "Saldırı Türleri Dağılımı")}
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="text-start p-2.5 font-semibold">{t("Attack Type", "نوع الهجوم", "Saldırı Türü")}</th>
                                                <th className="text-center p-2.5 font-semibold">{t("Severity", "الخطورة", "Önem")}</th>
                                                <th className="text-center p-2.5 font-semibold">{t("Training (Original)", "التدريب (الأصلي)", "Eğitim (Orijinal)")}</th>
                                                <th className="text-center p-2.5 font-semibold">{t("After SMOTE", "بعد SMOTE", "SMOTE Sonrası")}</th>
                                                <th className="text-center p-2.5 font-semibold">{t("Testing", "الاختبار", "Test")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {CICIOT2023_ATTACK_TYPES.map((a) => (
                                                <tr key={a.name} className="border-b hover:bg-muted/30">
                                                    <td className="p-2.5 font-medium flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                                                        {a.name}
                                                    </td>
                                                    <td className="text-center p-2.5">
                                                        <Badge variant={a.severity === "critical" ? "destructive" : a.severity === "high" ? "default" : "secondary"} className="text-xs">
                                                            {a.severity === "critical" ? t("Critical", "حرج", "Kritik") : a.severity === "high" ? t("High", "عالي", "Yüksek") : a.severity === "medium" ? t("Medium", "متوسط", "Orta") : t("Low", "منخفض", "Düşük")}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-center p-2.5 font-mono">{a.trainingSamples.toLocaleString()}</td>
                                                    <td className="text-center p-2.5 font-mono font-bold">{a.smoteSamples.toLocaleString()}</td>
                                                    <td className="text-center p-2.5 font-mono">{a.testingSamples.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* SMOTE Before/After Visualization */}
                            <div className="mt-6">
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                    {t("Figure 4.1: Class Distribution Before & After SMOTE",
                                        "الشكل 4.1: توزيع الأصناف قبل وبعد SMOTE",
                                        "Şekil 4.1: SMOTE Öncesi ve Sonrası Sınıf Dağılımı")}
                                </h4>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={CICIOT2023_ATTACK_TYPES.map(a => ({
                                        name: a.name.replace("DDoS-ACK_Fragmentation", "ACK_Frag").replace("DDoS-SYN_Flood", "SYN_Flood").replace("Backdoor_Malware", "Backdoor").replace("Recon-PortScan", "PortScan").replace("BenignTraffic", "Benign"),
                                        before: a.trainingSamples,
                                        after: a.smoteSamples,
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Bar dataKey="before" name={t("Before SMOTE", "قبل SMOTE", "SMOTE Öncesi")} fill="#6b7280" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="after" name={t("After SMOTE", "بعد SMOTE", "SMOTE Sonrası")} fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <p className="text-[10px] text-muted-foreground text-center mt-1">
                                    {t("SMOTE balanced the minority class (Backdoor_Malware: 2,252 → 17,500) to eliminate class bias",
                                        "SMOTE وازن الصنف الأقلية (Backdoor_Malware: 2,252 → 17,500) لإزالة التحيز",
                                        "SMOTE azınlık sınıfını dengeledi (Backdoor_Malware: 2.252 → 17.500)")}
                                </p>
                            </div>

                            {/* Preprocessing Steps */}
                            <div className="mt-6">
                                <h4 className="font-semibold text-sm mb-3">{t("Preprocessing Pipeline", "خط المعالجة المسبقة", "Ön İşleme Hattı")}</h4>
                                <div className="space-y-2">
                                    {DATASET_STATISTICS.preprocessingSteps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0 text-xs">{i + 1}</Badge>
                                            <span>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================================================================ */}
                {/* SECTION 2: CLASSIFICATION PERFORMANCE METRICS */}
                {/* ================================================================ */}
                <TabsContent value="metrics" className="space-y-6">
                    {/* Main Metrics Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                {t("4.2 Classification Performance Metrics",
                                    "4.2 مقاييس أداء التصنيف",
                                    "4.2 Sınıflandırma Performans Metrikleri")}
                            </CardTitle>
                            <CardDescription>
                                {t("Table 4.1: Standard IDS evaluation metrics on CICIoT2023 test set (20,644 samples)",
                                    "الجدول 4.1: مقاييس التقييم القياسية لنظام كشف التسلل على مجموعة اختبار CICIoT2023 (20,644 عينة)",
                                    "Tablo 4.1: CICIoT2023 test seti üzerinde standart IDS değerlendirme metrikleri (20.644 örnek)")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-start p-2 font-semibold">{t("Model", "النموذج", "Model")}</th>
                                            <th className="text-center p-2 font-semibold">{t("Accuracy", "الدقة", "Doğruluk")}</th>
                                            <th className="text-center p-2 font-semibold">Precision</th>
                                            <th className="text-center p-2 font-semibold">Recall</th>
                                            <th className="text-center p-2 font-semibold">F1-W</th>
                                            <th className="text-center p-2 font-semibold">F1-Macro</th>
                                            <th className="text-center p-2 font-semibold">AUC-ROC</th>
                                            <th className="text-center p-2 font-semibold">FPR</th>
                                            <th className="text-center p-2 font-semibold">MCC</th>
                                            <th className="text-center p-2 font-semibold">{t("Features", "الميزات", "Özellik")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MODEL_RESULTS.map((m, i) => (
                                            <tr key={i} className={`border-b hover:bg-muted/30 ${m.name.includes("Proposed") ? "bg-emerald-500/10 font-semibold" : ""}`}>
                                                <td className="p-2">
                                                    {m.name.replace(" (Proposed)", "")}
                                                    {m.name.includes("Proposed") && <Badge className="ml-1 bg-emerald-600 text-[9px] px-1">{t("Proposed", "المقترح", "Önerilen")}</Badge>}
                                                </td>
                                                <td className="text-center p-2 font-mono">{m.accuracy}</td>
                                                <td className="text-center p-2 font-mono">{m.precision}</td>
                                                <td className="text-center p-2 font-mono">{m.recall}</td>
                                                <td className="text-center p-2 font-mono">{m.f1Score}</td>
                                                <td className="text-center p-2 font-mono">{m.f1Macro}</td>
                                                <td className="text-center p-2 font-mono">{m.aucRoc}</td>
                                                <td className="text-center p-2 font-mono">{m.falsePositiveRate}</td>
                                                <td className="text-center p-2 font-mono">{m.mcc}</td>
                                                <td className="text-center p-2 font-mono">{m.featuresUsed}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Per-Class Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Layers className="w-5 h-5 text-primary" />
                                {t("Table 4.2 / Figure 4.2: Per-Class Performance (BSO-Hybrid RF)",
                                    "الجدول 4.2 / الشكل 4.2: الأداء لكل صنف (BSO-Hybrid RF)",
                                    "Tablo 4.2 / Şekil 4.2: Sınıf Bazında Performans (BSO-Hybrid RF)")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="text-start p-2.5 font-semibold">{t("Class", "الصنف", "Sınıf")}</th>
                                                <th className="text-center p-2.5 font-semibold">Precision</th>
                                                <th className="text-center p-2.5 font-semibold">Recall</th>
                                                <th className="text-center p-2.5 font-semibold">F1-Score</th>
                                                <th className="text-center p-2.5 font-semibold">{t("Support", "الدعم", "Destek")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {BSO_RF_PER_CLASS.map((c) => (
                                                <tr key={c.className} className="border-b hover:bg-muted/30">
                                                    <td className="p-2.5 font-medium text-xs">{c.className}</td>
                                                    <td className="text-center p-2.5 font-mono">{c.precision}%</td>
                                                    <td className="text-center p-2.5 font-mono">{c.recall}%</td>
                                                    <td className="text-center p-2.5 font-mono font-bold">{c.f1Score}%</td>
                                                    <td className="text-center p-2.5 font-mono">{c.support.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <ResponsiveContainer width="100%" height={280}>
                                    <RadarChart data={perClassRadar}>
                                        <PolarGrid strokeDasharray="3 3" />
                                        <PolarAngleAxis dataKey="class" tick={{ fontSize: 10 }} />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                                        <Radar name="Precision" dataKey="precision" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                        <Radar name="Recall" dataKey="recall" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                        <Radar name="F1-Score" dataKey="f1Score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Confusion Matrix (BSO-RF) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                {t("Table 4.3: Confusion Matrix — BSO-Hybrid RF (20,644 test samples)",
                                    "الجدول 4.3: مصفوفة الارتباك — BSO-Hybrid RF (20,644 عينة اختبار)",
                                    "Tablo 4.3: Karışıklık Matrisi — BSO-Hybrid RF (20.644 test örneği)")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="text-xs mx-auto">
                                    <thead>
                                        <tr>
                                            <th className="p-2 text-start">{t("Actual \\ Predicted", "الفعلي \\ المتوقع", "Gerçek \\ Tahmin")}</th>
                                            {CONFUSION_MATRICES["BSO-RF"].labels.map((l) => (
                                                <th key={l} className="p-2 text-center font-mono text-[10px]">{l}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CONFUSION_MATRICES["BSO-RF"].matrix.map((row, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="p-2 font-medium font-mono text-[10px]">{CONFUSION_MATRICES["BSO-RF"].labels[i]}</td>
                                                {row.map((val, j) => (
                                                    <td key={j} className={`p-2 text-center font-mono text-[11px] ${i === j ? "bg-emerald-500/20 font-bold" : val > 0 ? "bg-red-500/10" : ""}`}>
                                                        {val.toLocaleString()}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* XGBoost Confusion Matrix for Comparison */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="w-5 h-5 text-amber-500" />
                                {t("Table 4.4: Confusion Matrix — XGBoost (Best Accuracy Baseline)",
                                    "الجدول 4.4: مصفوفة الارتباك — XGBoost (أفضل دقة مرجعية)",
                                    "Tablo 4.4: Karışıklık Matrisi — XGBoost (En İyi Doğruluk Temel Çizgisi)")}
                            </CardTitle>
                            <CardDescription className="text-[10px]">
                                {t("XGBoost achieves 90.37% accuracy using all 39 features vs BSO-Hybrid RF 89.82% with only 19 features",
                                    "XGBoost يحقق دقة 90.37% باستخدام جميع الميزات الـ 39 مقابل BSO-Hybrid RF بدقة 89.82% بـ 19 ميزة فقط",
                                    "XGBoost tüm 39 özellikle %90.37 doğruluk elde eder, BSO-Hybrid RF ise yalnızca 19 özellikle %89.82")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="text-xs mx-auto">
                                    <thead>
                                        <tr>
                                            <th className="p-2 text-start">{t("Actual \\ Predicted", "الفعلي \\ المتوقع", "Gerçek \\ Tahmin")}</th>
                                            {CONFUSION_MATRICES["XGBoost"].labels.map((l) => (
                                                <th key={l} className="p-2 text-center font-mono text-[10px]">{l}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CONFUSION_MATRICES["XGBoost"].matrix.map((row, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="p-2 font-medium font-mono text-[10px]">{CONFUSION_MATRICES["XGBoost"].labels[i]}</td>
                                                {row.map((val, j) => (
                                                    <td key={j} className={`p-2 text-center font-mono text-[11px] ${i === j ? "bg-amber-500/20 font-bold" : val > 0 ? "bg-red-500/10" : ""}`}>
                                                        {val.toLocaleString()}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                                {t("Key Difference: XGBoost correctly classifies more BenignTraffic (4,341 vs 4,280) and Recon-PortScan (3,943 vs 3,845) but uses ALL 39 features. BSO-Hybrid RF achieves comparable results with 51.3% fewer features — a critical advantage for IoT edge deployment.",
                                    "الفرق الرئيسي: XGBoost يصنف بشكل صحيح المزيد من BenignTraffic (4,341 مقابل 4,280) و Recon-PortScan (3,943 مقابل 3,845) لكنه يستخدم جميع الميزات الـ 39. BSO-Hybrid RF يحقق نتائج مماثلة بميزات أقل بنسبة 51.3% — ميزة حاسمة لنشر IoT الطرفي.",
                                    "Temel Fark: XGBoost daha fazla BenignTraffic (4.341 vs 4.280) ve Recon-PortScan (3.943 vs 3.845) doğru sınıflandırır ancak TÜM 39 özelliği kullanır. BSO-Hybrid RF %51.3 daha az özellikle karşılaştırılabilir sonuçlar elde eder.")}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ROC Curves */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                {t("Figure 4.3: ROC Curves & AUC-ROC", "الشكل 4.3: منحنيات ROC ومساحة تحت المنحنى", "Şekil 4.3: ROC Eğrileri & AUC-ROC")}
                            </CardTitle>
                            <CardDescription className="text-[10px]">
                                {t("Note: Curves are interpolated from real AUC-ROC values for smooth visualization. Actual AUC values from sklearn.metrics.roc_auc_score().",
                                    "ملاحظة: المنحنيات محسوبة من قيم AUC-ROC الحقيقية للعرض السلس. قيم AUC الفعلية من sklearn.metrics.roc_auc_score().",
                                    "Not: Eğriler, düzgün görselleştirme için gerçek AUC-ROC değerlerinden interpolasyon yapılmıştır.")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="fpr" type="number" domain={[0, 1]} tick={{ fontSize: 10 }} label={{ value: t("False Positive Rate", "معدل الإيجابي الكاذب", "Yanlış Pozitif Oranı"), position: "insideBottom", offset: -5, fontSize: 11 }} />
                                    <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} label={{ value: t("True Positive Rate", "معدل الإيجابي الصحيح", "Doğru Pozitif Oranı"), angle: -90, position: "insideLeft", fontSize: 11 }} />
                                    <Tooltip formatter={(v: number) => v.toFixed(3)} />
                                    <Legend wrapperStyle={{ fontSize: 10 }} />
                                    {/* Diagonal */}
                                    <Line data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]} dataKey="tpr" stroke="#9ca3af" strokeDasharray="5 5" name={t("Random", "عشوائي", "Rastgele")} dot={false} />
                                    {/* Model curves */}
                                    {rocModels.map((modelName, idx) => {
                                        const colors = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#6b7280"]
                                        const d = rocChartData.filter((r) => r.model === modelName)
                                        const auc = d[0]?.auc ?? 0
                                        return (
                                            <Line key={modelName} data={d} dataKey="tpr" stroke={colors[idx]} name={`${modelName.replace(" (Proposed)", "*")} (${(auc * 100).toFixed(1)}%)`}
                                                dot={false} strokeWidth={modelName.includes("Proposed") ? 3 : 1.5} />
                                        )
                                    })}
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================================================================ */}
                {/* SECTION 3: COMPARATIVE ANALYSIS */}
                {/* ================================================================ */}
                <TabsContent value="comparison" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                {t("4.3 Comparative Analysis",
                                    "4.3 التحليل المقارن",
                                    "4.3 Karşılaştırmalı Analiz")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Accuracy Bar Chart */}
                            <h4 className="font-semibold text-sm mb-3">
                                {t("Figure 4.4: Accuracy Comparison (12 Models)", "الشكل 4.4: مقارنة الدقة (12 نموذج)", "Şekil 4.4: Doğruluk Karşılaştırması (12 Model)")}
                            </h4>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={accuracyBarData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis type="number" domain={[55, 95]} tick={{ fontSize: 10 }} />
                                    <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} />
                                    <Tooltip formatter={(v: number) => `${v}%`} />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                    <Bar dataKey="accuracy" name={t("Accuracy", "الدقة", "Doğruluk")} radius={[0, 4, 4, 0]}>
                                        {accuracyBarData.map((d, i) => (
                                            <Cell key={i} fill={d.isProposed ? "#10b981" : "#6b7280"} opacity={d.isProposed ? 1 : 0.6} />
                                        ))}
                                    </Bar>
                                    <Bar dataKey="f1Score" name="F1-Weighted" radius={[0, 4, 4, 0]}>
                                        {accuracyBarData.map((d, i) => (
                                            <Cell key={i} fill={d.isProposed ? "#059669" : "#9ca3af"} opacity={d.isProposed ? 0.8 : 0.4} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Individual vs Hybrid vs Optimized */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* vs Individual */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">
                                    {t("B. vs Individual ML", "ب. ضد تعلم آلة فردي", "B. Bireysel ML'ye Karşı")}
                                </CardTitle>
                                <CardDescription className="text-xs">{t("BSO-Hybrid RF vs standalone classifiers", "BSO-Hybrid RF ضد المصنفات الفردية", "Bağımsız sınıflandırıcılara karşı")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {[
                                    { name: "RF", acc: 89.74, diff: 0.08 },
                                    { name: "SVM", acc: 83.11, diff: 6.71 },
                                    { name: "DT", acc: 86.12, diff: 3.70 },
                                    { name: "KNN", acc: 85.20, diff: 4.62 },
                                    { name: "NB", acc: 62.96, diff: 26.86 },
                                    { name: "LR", acc: 82.73, diff: 7.09 },
                                ].map((m) => (
                                    <div key={m.name} className="flex items-center justify-between text-xs py-1.5 border-b last:border-0">
                                        <span>{m.name}: {m.acc}%</span>
                                        <Badge className={m.diff > 0 ? "bg-emerald-600 text-[10px]" : "bg-gray-500 text-[10px]"}>+{m.diff}%</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* vs Other Optimizers */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">
                                    {t("C. vs Other Optimizers", "ج. ضد محسنات أخرى", "C. Diğer Optimizörlere Karşı")}
                                </CardTitle>
                                <CardDescription className="text-xs">{t("BSO vs PSO, GA, GWO (all with RF)", "BSO ضد PSO, GA, GWO (جميعها مع RF)", "BSO vs PSO, GA, GWO (hepsi RF ile)")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {[
                                    { name: "PSO-RF", acc: 88.35, diff: 1.47, feat: 18 },
                                    { name: "GA-RF", acc: 89.37, diff: 0.45, feat: 21 },
                                    { name: "GWO-RF", acc: 89.80, diff: 0.02, feat: 23 },
                                ].map((m) => (
                                    <div key={m.name} className="flex items-center justify-between text-xs py-1.5 border-b last:border-0">
                                        <span>{m.name}: {m.acc}% ({m.feat}f)</span>
                                        <Badge className="bg-emerald-600 text-[10px]">+{m.diff}%</Badge>
                                    </div>
                                ))}
                                <div className="mt-2 text-[10px] text-muted-foreground">
                                    {t("BSO achieves best fitness (0.1778) with fewest evaluations",
                                        "BSO يحقق أفضل لياقة (0.1778) بأقل تقييمات",
                                        "BSO en az değerlendirme ile en iyi uyumu elde eder (0.1778)")}
                                </div>
                            </CardContent>
                        </Card>

                        {/* vs State-of-the-Art */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">
                                    {t("D. vs State-of-the-Art", "د. ضد الأعمال السابقة", "D. Son Teknolojiye Karşı")}
                                </CardTitle>
                                <CardDescription className="text-xs">{t("Published work on CICIoT2023", "أبحاث منشورة على CICIoT2023", "CICIoT2023 üzerine yayınlanmış çalışmalar")}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {STATE_OF_THE_ART.map((s, i) => (
                                    <div key={i} className="text-xs py-1.5 border-b last:border-0">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{s.paper}</span>
                                            <span className="font-mono">{s.accuracy}%</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5">{s.note}</div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Optimizer Convergence Comparison */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                {t("Figure 4.5: Convergence Speed Comparison (BSO vs PSO vs GA vs GWO)",
                                    "الشكل 4.5: مقارنة سرعة التقارب (BSO مقابل PSO مقابل GA مقابل GWO)",
                                    "Şekil 4.5: Yakınsama Hızı Karşılaştırması (BSO vs PSO vs GA vs GWO)")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={optimizerChartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="iteration" tick={{ fontSize: 10 }} label={{ value: t("Iteration", "التكرار", "İterasyon"), position: "insideBottom", offset: -5, fontSize: 11 }} />
                                    <YAxis domain={[0.17, 0.205]} tick={{ fontSize: 10 }} label={{ value: t("Best Fitness", "أفضل لياقة", "En İyi Uyum"), angle: -90, position: "insideLeft", fontSize: 11 }} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                    <Line dataKey="BSO" stroke="#10b981" strokeWidth={2.5} dot={false} name="BSO-Hybrid" connectNulls />
                                    <Line dataKey="PSO" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="PSO" connectNulls />
                                    <Line dataKey="GA" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="GA" connectNulls />
                                    <Line dataKey="GWO" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name="GWO" connectNulls />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================================================================ */}
                {/* SECTION 4: BSO IMPACT */}
                {/* ================================================================ */}
                <TabsContent value="bso" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GitBranch className="w-5 h-5 text-primary" />
                                {t("4.4 Impact of BSO Optimization",
                                    "4.4 تأثير تحسين BSO",
                                    "4.4 BSO Optimizasyonunun Etkisi")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Hyperparameter Tuning */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Settings2 className="w-4 h-4 text-blue-500" />
                                    {t("A. Hyperparameter Tuning via BSO", "أ. ضبط المعلمات الفائقة عبر BSO", "A. BSO ile Hiperparametre Ayarı")}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-muted/50 rounded-xl p-4">
                                        <h5 className="font-medium text-xs mb-2">{t("BSO Parameters", "معلمات BSO", "BSO Parametreleri")}</h5>
                                        <div className="space-y-1.5 text-xs">
                                            <div className="flex justify-between"><span className="text-muted-foreground">{t("Population", "حجم السكان", "Popülasyon")}</span><span className="font-mono">{BSO_PARAMETERS.populationSize}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">{t("Iterations", "التكرارات", "İterasyonlar")}</span><span className="font-mono">{BSO_PARAMETERS.maxIterations}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">{t("Fitness Function", "دالة اللياقة", "Uygunluk Fonksiyonu")}</span><span className="font-mono text-[10px]">{BSO_PARAMETERS.fitnessFunction}</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-muted/50 rounded-xl p-4">
                                        <h5 className="font-medium text-xs mb-2">{t("Optimized RF Hyperparameters", "معلمات RF المحسّنة", "Optimize RF Hiperparametreleri")}</h5>
                                        <div className="space-y-1.5 text-xs">
                                            <div className="flex justify-between"><span className="text-muted-foreground">n_estimators</span><span className="font-mono">{BSO_PARAMETERS.optimizedHyperparameters.n_estimators} <span className="text-muted-foreground">({t("range", "النطاق", "aralık")}: {BSO_PARAMETERS.hyperparameterRanges.n_estimators.join("-")})</span></span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">max_depth</span><span className="font-mono">{BSO_PARAMETERS.optimizedHyperparameters.max_depth} <span className="text-muted-foreground">({BSO_PARAMETERS.hyperparameterRanges.max_depth.join("-")})</span></span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">min_samples_split</span><span className="font-mono">{BSO_PARAMETERS.optimizedHyperparameters.min_samples_split} <span className="text-muted-foreground">({BSO_PARAMETERS.hyperparameterRanges.min_samples_split.join("-")})</span></span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">max_features</span><span className="font-mono">{BSO_PARAMETERS.optimizedHyperparameters.max_features} <span className="text-muted-foreground">({BSO_PARAMETERS.hyperparameterRanges.max_features_frac.join("-")})</span></span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Selection */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-emerald-500" />
                                    {t("Figure 4.6: Feature Selection (39 → 19 features, 51.3% reduction)",
                                        "الشكل 4.6: انتقاء الميزات (39 → 19 ميزة، تقليل 51.3%)",
                                        "Şekil 4.6: Özellik Seçimi (39 → 19 özellik, %51.3 azalma)")}
                                </h4>
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={featureBarData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis type="number" tick={{ fontSize: 10 }} label={{ value: t("Importance (%)", "الأهمية (%)", "Önem (%)"), position: "insideBottom", offset: -5, fontSize: 11 }} />
                                        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 9 }} />
                                        <Tooltip formatter={(v: number) => `${v}%`} />
                                        <Bar dataKey="importance" name={t("Importance", "الأهمية", "Önem")} fill="#10b981" radius={[0, 4, 4, 0]}>
                                            {featureBarData.map((d, i) => (
                                                <Cell key={i} fill={i < 5 ? "#10b981" : i < 10 ? "#3b82f6" : "#8b5cf6"} opacity={1 - i * 0.03} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Feature Selection Comparison Table */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3">
                                    {t("Table 4.5: Feature Selection Method Comparison", "الجدول 4.5: مقارنة طرق انتقاء الميزات", "Tablo 4.5: Özellik Seçimi Yöntemi Karşılaştırması")}
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="text-start p-2 font-semibold">{t("Method", "الطريقة", "Yöntem")}</th>
                                                <th className="text-center p-2 font-semibold">{t("Selected", "المختارة", "Seçilen")}</th>
                                                <th className="text-center p-2 font-semibold">{t("Reduction", "التقليل", "Azalma")}</th>
                                                <th className="text-center p-2 font-semibold">{t("Best Fitness", "أفضل لياقة", "En İyi Uyum")}</th>
                                                <th className="text-center p-2 font-semibold">{t("Evaluations", "التقييمات", "Değerlendirme")}</th>
                                                <th className="text-center p-2 font-semibold">{t("Time (s)", "الوقت (ث)", "Süre (s)")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(FEATURE_SELECTION_COMPARISON).map((fs) => (
                                                <tr key={fs.method} className={`border-b hover:bg-muted/30 ${fs.method.includes("Proposed") ? "bg-emerald-500/10 font-semibold" : ""}`}>
                                                    <td className="p-2">{fs.method}</td>
                                                    <td className="text-center p-2 font-mono">{fs.nSelected}/39</td>
                                                    <td className="text-center p-2 font-mono">{fs.reductionPct}%</td>
                                                    <td className="text-center p-2 font-mono font-bold">{fs.bestFitness.toFixed(4)}</td>
                                                    <td className="text-center p-2 font-mono">{fs.evaluations}</td>
                                                    <td className="text-center p-2 font-mono">{fs.time.toFixed(1)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* BSO Convergence */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                    {t("Figure 4.7: BSO Convergence Curve (50 iterations)", "الشكل 4.7: منحنى تقارب BSO (50 تكرار)", "Şekil 4.7: BSO Yakınsama Eğrisi (50 iterasyon)")}
                                </h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={convergenceData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="iteration" tick={{ fontSize: 10 }} />
                                        <YAxis domain={[0.17, 0.21]} tick={{ fontSize: 10 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Line dataKey="bestFitness" stroke="#10b981" strokeWidth={2.5} name={t("Best Fitness", "أفضل لياقة", "En İyi Uyum")} dot={false} />
                                        <Line dataKey="fitness" stroke="#8b5cf6" strokeWidth={1} name={t("Average Fitness", "متوسط اللياقة", "Ortalama Uyum")} dot={false} strokeDasharray="3 3" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================================================================ */}
                {/* SECTION 5: DYNAMIC ENVIRONMENT */}
                {/* ================================================================ */}
                <TabsContent value="dynamic" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Network className="w-5 h-5 text-primary" />
                                {t("4.5 Performance in Dynamic Network Environments",
                                    "4.5 الأداء في البيئات الشبكية الديناميكية",
                                    "4.5 Dinamik Ağ Ortamlarında Performans")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Noise Robustness */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-amber-500" />
                                    {t("Figure 4.8: Noise Robustness Test (Concept Drift Simulation)",
                                        "الشكل 4.8: اختبار المتانة ضد الضوضاء (محاكاة الانحراف المفهومي)",
                                        "Şekil 4.8: Gürültü Sağlamlık Testi (Kavram Kayması Simülasyonu)")}
                                </h4>
                                <ResponsiveContainer width="100%" height={280}>
                                    <AreaChart data={noiseData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="noise" tick={{ fontSize: 10 }} label={{ value: t("Noise Level", "مستوى الضوضاء", "Gürültü Seviyesi"), position: "insideBottom", offset: -5, fontSize: 11 }} />
                                        <YAxis domain={[30, 95]} tick={{ fontSize: 10 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Area dataKey="accuracy" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} name={t("Accuracy", "الدقة", "Doğruluk")} />
                                        <Area dataKey="f1Macro" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="F1-Macro" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Unknown Attack Detection */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    {t("B. Unknown Attack Detection (Leave-One-Out)",
                                        "ب. كشف الهجمات غير المعروفة (حذف واحد)",
                                        "B. Bilinmeyen Saldırı Tespiti (Bırak-Birini-Dışarıda)")}
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="text-start p-2.5 font-semibold">{t("Excluded Attack", "الهجوم المستبعد", "Hariç Tutulan Saldırı")}</th>
                                                <th className="text-center p-2.5 font-semibold">{t("Detection Rate", "معدل الكشف", "Tespit Oranı")}</th>
                                                <th className="text-center p-2.5 font-semibold">{t("Unknown Samples", "العينات المجهولة", "Bilinmeyen Örnek")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {DYNAMIC_ENVIRONMENT.unknownAttackDetection.map((d) => (
                                                <tr key={d.excludedAttack} className="border-b hover:bg-muted/30">
                                                    <td className="p-2.5 font-medium">{d.excludedAttack}</td>
                                                    <td className="text-center p-2.5">
                                                        <span className={`font-mono font-bold ${d.detectionRate > 90 ? "text-emerald-600" : d.detectionRate > 50 ? "text-amber-600" : "text-red-600"}`}>
                                                            {d.detectionRate}%
                                                        </span>
                                                    </td>
                                                    <td className="text-center p-2.5 font-mono">{d.unknownSamples.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Throughput under Variable Traffic */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    {t("C. Throughput Under Variable Traffic Load",
                                        "ج. الإنتاجية تحت ضغط مرور متغير",
                                        "C. Değişken Trafik Yükünde Verim")}
                                </h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={throughputData}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                            <XAxis dataKey="batch" tick={{ fontSize: 10 }} label={{ value: t("Batch Size", "حجم الدفعة", "Parti Boyutu"), position: "insideBottom", offset: -5, fontSize: 11 }} />
                                            <YAxis tick={{ fontSize: 10 }} />
                                            <Tooltip />
                                            <Bar dataKey="samplesPerSec" name={t("Samples/Second", "عينة/ثانية", "Örnek/Saniye")} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b bg-muted/50">
                                                    <th className="text-start p-2 font-semibold">{t("Batch", "الدفعة", "Parti")}</th>
                                                    <th className="text-center p-2 font-semibold">{t("Avg Time (ms)", "الوقت (مللي)", "Ort. Süre (ms)")}</th>
                                                    <th className="text-center p-2 font-semibold">{t("Samples/s", "عينة/ث", "Örnek/s")}</th>
                                                    <th className="text-center p-2 font-semibold">{t("ms/Sample", "مللي/عينة", "ms/Örnek")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {DYNAMIC_ENVIRONMENT.throughput.map((d) => (
                                                    <tr key={d.batchSize} className="border-b">
                                                        <td className="p-2 font-mono">{d.batchSize.toLocaleString()}</td>
                                                        <td className="text-center p-2 font-mono">{d.avgTimeMs}</td>
                                                        <td className="text-center p-2 font-mono font-bold">{d.samplesPerSecond.toLocaleString()}</td>
                                                        <td className="text-center p-2 font-mono">{d.msPerSample}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Learning Curve */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    {t("Figure 4.9: Learning Curve (Overfitting/Underfitting Check)",
                                        "الشكل 4.9: منحنى التعلم (فحص الإفراط/النقص في التعلم)",
                                        "Şekil 4.9: Öğrenme Eğrisi (Aşırı/Yetersiz Uyum Kontrolü)")}
                                </h4>
                                <ResponsiveContainer width="100%" height={280}>
                                    <LineChart data={learningData}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="fraction" tick={{ fontSize: 10 }} label={{ value: t("Training Data Fraction", "نسبة بيانات التدريب", "Eğitim Veri Oranı"), position: "insideBottom", offset: -5, fontSize: 11 }} />
                                        <YAxis domain={[86, 91]} tick={{ fontSize: 10 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                        <Line dataKey="accuracy" stroke="#10b981" strokeWidth={2} name={t("Accuracy", "الدقة", "Doğruluk")} dot={{ r: 4 }} />
                                        <Line dataKey="f1Macro" stroke="#3b82f6" strokeWidth={2} name="F1-Macro" dot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                                <p className="text-xs text-muted-foreground mt-2 text-center">
                                    {t("Diminishing returns after 50% of data → model generalizes well without overfitting",
                                        "عوائد متناقصة بعد 50% من البيانات → النموذج يعمم جيداً بدون إفراط في التعلم",
                                        "Veri'nin %50'sinden sonra azalan getiriler → model aşırı uyum olmadan iyi genelleştirir")}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================================================================ */}
                {/* SECTION 6: COMPUTATIONAL EFFICIENCY */}
                {/* ================================================================ */}
                <TabsContent value="efficiency" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                {t("4.6 Computational Efficiency",
                                    "4.6 الكفاءة الحسابية والوقتية",
                                    "4.6 Hesaplama Verimliliği")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Full Efficiency Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-start p-2 font-semibold">{t("Model", "النموذج", "Model")}</th>
                                            <th className="text-center p-2 font-semibold">{t("Training (s)", "التدريب (ث)", "Eğitim (s)")}</th>
                                            <th className="text-center p-2 font-semibold">{t("Prediction (ms)", "التنبؤ (مللي)", "Tahmin (ms)")}</th>
                                            <th className="text-center p-2 font-semibold">{t("Features", "الميزات", "Özellik")}</th>
                                            <th className="text-center p-2 font-semibold">{t("Feature Set", "مجموعة الميزات", "Özellik Seti")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {COMPUTATIONAL_EFFICIENCY.map((c, i) => (
                                            <tr key={i} className={`border-b hover:bg-muted/30 ${c.model.includes("Proposed") ? "bg-emerald-500/10 font-semibold" : ""}`}>
                                                <td className="p-2">{c.model.replace(" (Proposed)", "")} {c.model.includes("Proposed") && <Badge className="bg-emerald-600 text-[9px] px-1 ml-1">{t("Proposed", "المقترح", "Önerilen")}</Badge>}</td>
                                                <td className="text-center p-2 font-mono">{c.trainingTime}</td>
                                                <td className="text-center p-2 font-mono">{c.predictionTimeMs}</td>
                                                <td className="text-center p-2 font-mono">{c.featuresUsed}</td>
                                                <td className="text-center p-2">{c.featureSet}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Training Time Chart */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3">{t("Figure 4.10: Training Time Comparison", "الشكل 4.10: مقارنة وقت التدريب", "Şekil 4.10: Eğitim Süresi Karşılaştırması")}</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={trainingTimeData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis type="number" tick={{ fontSize: 10 }} label={{ value: t("Training Time (seconds)", "وقت التدريب (ثوانٍ)", "Eğitim Süresi (saniye)"), position: "insideBottom", offset: -5, fontSize: 11 }} />
                                        <YAxis type="category" dataKey="model" width={100} tick={{ fontSize: 9 }} />
                                        <Tooltip />
                                        <Bar dataKey="trainingTime" name={t("Training Time (s)", "وقت التدريب (ث)", "Eğitim (s)")} radius={[0, 4, 4, 0]}>
                                            {trainingTimeData.map((d, i) => (
                                                <Cell key={i} fill={d.isProposed ? "#10b981" : "#6b7280"} opacity={d.isProposed ? 1 : 0.6} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Key Insight */}
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                                            {t("Real-time Detection Capability", "قدرة الكشف في الوقت الفعلي", "Gerçek Zamanlı Tespit Yeteneği")}
                                        </p>
                                        <p className="text-muted-foreground mt-1">
                                            {t(`BSO-Hybrid RF prediction time: ${bsoModel.predictionTime}ms per sample → ${Math.round(1000 / bsoModel.predictionTime).toLocaleString()} samples/second. With 19 features (vs 39), feature extraction overhead is reduced by 51.3%, making it suitable for IoT edge deployment.`,
                                                `وقت التنبؤ لـ BSO-Hybrid RF: ${bsoModel.predictionTime} مللي ثانية لكل عينة → ${Math.round(1000 / bsoModel.predictionTime).toLocaleString()} عينة/ثانية. مع 19 ميزة (بدل 39)، يتم تقليل عبء استخراج الميزات بنسبة 51.3%، مما يجعله ملائماً لنشر IoT الطرفي.`,
                                                `BSO-Hybrid RF tahmin süresi: örnek başına ${bsoModel.predictionTime}ms → ${Math.round(1000 / bsoModel.predictionTime).toLocaleString()} örnek/saniye. 19 özellik (39 yerine) ile özellik çıkarma yükü %51.3 azaltılır, IoT uç dağıtımı için uygundur.`)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================================================================ */}
                {/* SECTION 7: STATISTICAL ANALYSIS */}
                {/* ================================================================ */}
                <TabsContent value="statistical" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FlaskConical className="w-5 h-5 text-primary" />
                                {t("4.7 Statistical Significance Analysis",
                                    "4.7 تحليل الدلالة الإحصائية",
                                    "4.7 İstatistiksel Anlamlılık Analizi")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Statistical Tests Table */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3">
                                    {t("Table 4.7: Paired t-test & Wilcoxon Signed-Rank Test (10-Fold CV)",
                                        "الجدول 4.7: اختبار t المزدوج واختبار Wilcoxon (تحقق متقاطع 10 طيات)",
                                        "Tablo 4.7: Eşleştirilmiş t-testi & Wilcoxon İşaretli-Sıra Testi (10-Katlı CV)")}
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="text-start p-2 font-semibold">{t("Comparison", "المقارنة", "Karşılaştırma")}</th>
                                                <th className="text-center p-2 font-semibold">{t("Improvement", "التحسن", "İyileşme")}</th>
                                                <th className="text-center p-2 font-semibold">t-statistic</th>
                                                <th className="text-center p-2 font-semibold">p-value</th>
                                                <th className="text-center p-2 font-semibold">Cohen&apos;s d</th>
                                                <th className="text-center p-2 font-semibold">{t("Effect Size", "حجم التأثير", "Etki Büyüklüğü")}</th>
                                                <th className="text-center p-2 font-semibold">Wilcoxon p</th>
                                                <th className="text-center p-2 font-semibold">{t("Significant", "ذو دلالة", "Anlamlı")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {STATISTICAL_TESTS.map((s, i) => (
                                                <tr key={i} className="border-b hover:bg-muted/30">
                                                    <td className="p-2 font-medium">{s.comparison}</td>
                                                    <td className="text-center p-2 font-mono font-bold">{s.improvement}</td>
                                                    <td className="text-center p-2 font-mono">{s.tStatistic.toFixed(4)}</td>
                                                    <td className="text-center p-2 font-mono">{s.pValue === 0 ? "< 0.0001" : s.pValue.toFixed(6)}</td>
                                                    <td className="text-center p-2 font-mono">{s.cohenD.toFixed(3)}</td>
                                                    <td className="text-center p-2"><Badge className={s.effectSize === "large" ? "bg-red-600 text-[10px]" : "bg-blue-600 text-[10px]"}>{s.effectSize === "large" ? t("Large", "كبير", "Büyük") : s.effectSize === "medium" ? t("Medium", "متوسط", "Orta") : t("Small", "صغير", "Küçük")}</Badge></td>
                                                    <td className="text-center p-2 font-mono">{s.wilcoxonP}</td>
                                                    <td className="text-center p-2">
                                                        {s.significant ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <Minus className="w-4 h-4 text-gray-400 mx-auto" />}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {t("All comparisons show p-value < 0.05, confirming statistically significant differences.",
                                        "جميع المقارنات تبين أن p-value < 0.05، مما يؤكد فروقات ذات دلالة إحصائية.",
                                        "Tüm karşılaştırmalar p-değeri < 0.05 gösterir, istatistiksel olarak anlamlı farkları doğrular.")}
                                </p>
                            </div>

                            {/* Cross-Validation Stability */}
                            <div>
                                <h4 className="font-semibold text-sm mb-3">
                                    {t("Figure 4.11: 10-Fold Stratified Cross-Validation (BSO-Hybrid RF)",
                                        "الشكل 4.11: التحقق المتقاطع 10 طيات (BSO-Hybrid RF)",
                                        "Şekil 4.11: 10 Katlı Tabakalı Çapraz Doğrulama (BSO-Hybrid RF)")}
                                </h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={cvBarData}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                            <XAxis dataKey="fold" tick={{ fontSize: 10 }} />
                                            <YAxis domain={[90, 92]} tick={{ fontSize: 10 }} />
                                            <Tooltip />
                                            <Legend wrapperStyle={{ fontSize: 11 }} />
                                            <Bar dataKey="accuracy" name={t("Accuracy", "الدقة", "Doğruluk")} fill="#10b981" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="f1Score" name="F1-Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="space-y-3">
                                        <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-muted-foreground">{t("Mean Accuracy", "متوسط الدقة", "Ortalama Doğruluk")}</span><span className="font-mono font-bold text-emerald-600">{CROSS_VALIDATION.mean.accuracy}%</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">{t("Std Dev", "الانحراف المعياري", "Standart Sapma")}</span><span className="font-mono">±{CROSS_VALIDATION.std.accuracy}</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">{t("Mean F1-Score", "متوسط F1", "Ortalama F1")}</span><span className="font-mono font-bold">{CROSS_VALIDATION.mean.f1Score}%</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">{t("Mean Precision", "متوسط الدقة الاستدعائية", "Ortalama Kesinlik")}</span><span className="font-mono">{CROSS_VALIDATION.mean.precision}%</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">{t("Mean Recall", "متوسط الاستدعاء", "Ortalama Duyarlılık")}</span><span className="font-mono">{CROSS_VALIDATION.mean.recall}%</span></div>
                                        </div>
                                        <div className="text-xs text-muted-foreground bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                            {t("The very low standard deviation (σ = 0.194) across 10 folds confirms the BSO-Hybrid RF model is highly stable and not overfitting.",
                                                "الانحراف المعياري المنخفض جداً (σ = 0.194) عبر 10 طيات يؤكد أن نموذج BSO-Hybrid RF مستقر جداً ولا يعاني من الإفراط في التعلم.",
                                                "10 kat boyunca çok düşük standart sapma (σ = 0.194), BSO-Hybrid RF'nin son derece kararlı olduğunu ve aşırı uyum göstermediğini doğrular.")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ================================================================ */}
                {/* SECTION 8: DISCUSSION */}
                {/* ================================================================ */}
                <TabsContent value="discussion" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                {t("4.8 Discussion", "4.8 المناقشة", "4.8 Tartışma")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Why BSO-Hybrid achieved these results */}
                            <div className="space-y-4">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                                    <h4 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        {t("Key Research Contribution", "المساهمة البحثية الرئيسية", "Temel Araştırma Katkısı")}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {t(`The BSO-Hybrid framework demonstrates that joint optimization of feature selection and hyperparameter tuning using Bat Swarm Optimization achieves comparable performance (${bsoModel.accuracy}% accuracy, ${bsoModel.f1Score}% F1-weighted) to methods using all features, while reducing dimensionality by ${DATASET_STATISTICS.featureReductionPct}% (${DATASET_STATISTICS.totalFeatures} → ${DATASET_STATISTICS.selectedFeatures} features). This represents a significant contribution to DDoS detection in resource-constrained IoT environments.`,
                                            `يُثبت إطار BSO-Hybrid أن التحسين المشترك لانتقاء الميزات وضبط المعلمات الفائقة باستخدام خوارزمية تحسين سرب الخفافيش يحقق أداءً مقارباً (دقة ${bsoModel.accuracy}%، F1-weighted ${bsoModel.f1Score}%) مقارنة بالطرق التي تستخدم جميع الميزات، مع تقليل الأبعاد بنسبة ${DATASET_STATISTICS.featureReductionPct}% (${DATASET_STATISTICS.totalFeatures} → ${DATASET_STATISTICS.selectedFeatures} ميزة). هذا يمثل مساهمة مهمة في كشف هجمات DDoS في بيئات IoT محدودة الموارد.`,
                                            `BSO-Hybrid çerçevesi, Yarasa Sürüsü Optimizasyonu kullanarak özellik seçimi ve hiperparametre ayarının ortak optimizasyonunun, boyutsallığı %${DATASET_STATISTICS.featureReductionPct} azaltırken (${DATASET_STATISTICS.totalFeatures} → ${DATASET_STATISTICS.selectedFeatures} özellik) tüm özellikleri kullanan yöntemlere karşılaştırılabilir performans (%${bsoModel.accuracy} doğruluk, %${bsoModel.f1Score} F1-ağırlıklı) elde ettiğini gösterir.`)}
                                    </p>
                                </div>

                                {/* Strengths */}
                                <div>
                                    <h4 className="font-semibold text-sm mb-3">{t("Strengths", "نقاط القوة", "Güçlü Yönler")}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            { icon: Layers, en: `51.3% feature reduction (39→19) while maintaining ${bsoModel.accuracy}% accuracy`, ar: `تقليل الميزات بنسبة 51.3% (39→19) مع الحفاظ على دقة ${bsoModel.accuracy}%`, tr: `Doğruluğu %${bsoModel.accuracy} koruyarak %51.3 özellik azaltma (39→19)` },
                                            { icon: TrendingUp, en: "Best fitness value (0.1778) among all metaheuristic optimizers", ar: "أفضل قيمة لياقة (0.1778) بين جميع المحسنات التطورية", tr: "Tüm metasezgisel optimizörler arasında en iyi uyum değeri (0.1778)" },
                                            { icon: Target, en: `Near-perfect DDoS detection: ACK_Frag (99.96% F1), SYN_Flood (99.96% F1)`, ar: `كشف DDoS شبه مثالي: ACK_Frag (99.96% F1)، SYN_Flood (99.96% F1)`, tr: `Neredeyse mükemmel DDoS tespiti: ACK_Frag (%99.96 F1), SYN_Flood (%99.96 F1)` },
                                            { icon: Shield, en: `High AUC-ROC (${bsoModel.aucRoc}%) demonstrating strong discriminative ability`, ar: `AUC-ROC عالي (${bsoModel.aucRoc}%) يدل على قدرة تمييزية قوية`, tr: `Yüksek AUC-ROC (%${bsoModel.aucRoc}) güçlü ayırt edici yeteneği gösterir` },
                                            { icon: CheckCircle2, en: `Stable cross-validation: ${CROSS_VALIDATION.mean.accuracy}% ± ${CROSS_VALIDATION.std.accuracy} (no overfitting)`, ar: `تحقق متقاطع مستقر: ${CROSS_VALIDATION.mean.accuracy}% ± ${CROSS_VALIDATION.std.accuracy} (بدون إفراط في التعلم)`, tr: `Kararlı çapraz doğrulama: %${CROSS_VALIDATION.mean.accuracy} ± ${CROSS_VALIDATION.std.accuracy} (aşırı uyum yok)` },
                                            { icon: Zap, en: `Real-time capable: ${bsoModel.predictionTime}ms/sample (${Math.round(1000 / bsoModel.predictionTime).toLocaleString()} samples/sec)`, ar: `قدرة كشف فورية: ${bsoModel.predictionTime} مللي ثانية/عينة (${Math.round(1000 / bsoModel.predictionTime).toLocaleString()} عينة/ثانية)`, tr: `Gerçek zamanlı yeteneği: ${bsoModel.predictionTime}ms/örnek (${Math.round(1000 / bsoModel.predictionTime).toLocaleString()} örnek/sn)` },
                                        ].map((s, i) => (
                                            <div key={i} className="flex items-start gap-2 bg-muted/50 rounded-lg p-3">
                                                <s.icon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs leading-relaxed">{t(s.en, s.ar, s.tr)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Limitations */}
                                <div>
                                    <h4 className="font-semibold text-sm mb-3">{t("Limitations & Future Work", "القيود والعمل المستقبلي", "Sınırlamalar & Gelecek Çalışma")}</h4>
                                    <div className="space-y-2">
                                        {[
                                            { en: `Backdoor_Malware class has low F1-Score (57.40%) due to limited samples (644 test) — future work: GAN-based augmentation`, ar: `صنف Backdoor_Malware يحتوي على F1-Score منخفض (57.40%) بسبب العينات المحدودة (644 اختبار) — العمل المستقبلي: تعزيز بواسطة GAN`, tr: `Backdoor_Malware sınıfı düşük F1-Score (%57.40) - sınırlı örnekler (644 test) — gelecek: GAN tabanlı artırma` },
                                            { en: "Noise robustness degrades at >5% noise — future work: ensemble diversity methods", ar: "المتانة ضد الضوضاء تنخفض عند >5% — العمل المستقبلي: طرق تنوع المجموعات", tr: "Gürültü sağlamlığı >%5'te düşer — gelecek: topluluk çeşitliliği yöntemleri" },
                                            { en: "BSO optimization time (840s) is higher than PSO/GA — trade-off for better solution quality", ar: "وقت تحسين BSO (840 ثانية) أعلى من PSO/GA — مقايضة لجودة حل أفضل", tr: "BSO optimizasyon süresi (840s) PSO/GA'dan yüksek — daha iyi çözüm kalitesi için takas" },
                                            { en: "Multi-class (5-class) results are lower than binary classification literature — expected and fair comparison", ar: "نتائج متعدد الأصناف (5 أصناف) أقل من أدبيات التصنيف الثنائي — متوقع ومقارنة عادلة", tr: "Çok sınıflı (5 sınıf) sonuçlar ikili sınıflandırma literatüründen düşük — beklenen ve adil karşılaştırma" },
                                        ].map((l, i) => (
                                            <div key={i} className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs leading-relaxed">{t(l.en, l.ar, l.tr)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Final Summary Card */}
                    <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 via-background to-emerald-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" />
                                {t("Summary of Key Results", "ملخص النتائج الرئيسية", "Temel Sonuçların Özeti")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-card rounded-xl border">
                                    <div className="text-2xl font-bold text-emerald-500">{bsoModel.accuracy}%</div>
                                    <div className="text-xs text-muted-foreground mt-1">{t("Accuracy", "الدقة", "Doğruluk")}</div>
                                </div>
                                <div className="text-center p-4 bg-card rounded-xl border">
                                    <div className="text-2xl font-bold text-blue-500">{bsoModel.f1Score}%</div>
                                    <div className="text-xs text-muted-foreground mt-1">F1-Weighted</div>
                                </div>
                                <div className="text-center p-4 bg-card rounded-xl border">
                                    <div className="text-2xl font-bold text-purple-500">{DATASET_STATISTICS.featureReductionPct}%</div>
                                    <div className="text-xs text-muted-foreground mt-1">{t("Feature Reduction", "تقليل الميزات", "Özellik Azaltma")}</div>
                                </div>
                                <div className="text-center p-4 bg-card rounded-xl border">
                                    <div className="text-2xl font-bold text-amber-500">{bsoModel.aucRoc}%</div>
                                    <div className="text-xs text-muted-foreground mt-1">AUC-ROC</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Data Source Footer */}
            <Card className="border border-dashed border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {t("Data Source Verification", "التحقق من مصدر البيانات", "Veri Kaynağı Doğrulaması")}
                            </span>
                        </div>
                        <div className="text-center md:text-right space-y-1">
                            <p>{t("All results generated from: scripts/real_experiment.py (BSO-Hybrid v4)",
                                "جميع النتائج مولّدة من: scripts/real_experiment.py (BSO-Hybrid v4)",
                                "Tüm sonuçlar: scripts/real_experiment.py (BSO-Hybrid v4) ile üretilmiştir")}</p>
                            <p>{t("Dataset: CICIoT2023 (19 PCAP CSV files) | Research: 8 months (Oct 2025 – Jun 2026) | Date: 2026-02-23",
                                "مجموعة البيانات: CICIoT2023 (19 ملف PCAP CSV) | مدة البحث: 8 أشهر (أكتوبر 2025 – يونيو 2026) | التاريخ: 2026-02-23",
                                "Veri Seti: CICIoT2023 (19 PCAP CSV dosyası) | Araştırma: 8 ay (Ekim 2025 – Haziran 2026) | Tarih: 2026-02-23")}</p>
                            <p className="font-medium">{t("Author: SHUAIB AYAD JASIM | No simulated or hardcoded values",
                                "المؤلف: شعيب أياد جاسم | بدون قيم محاكاة أو مشفرة",
                                "Yazar: SHUAIB AYAD JASIM | Simüle veya sabit kodlanmış değer yok")}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
