"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Database, Layers, Filter, Brain, Zap, Target, CheckCircle2,
    ArrowRight, Play, Pause, RotateCcw, SkipForward,
    FileSpreadsheet, BarChart3, Shield, Activity, Sparkles,
    AlertTriangle, TrendingUp,
} from "lucide-react"
import {
    DATASET_STATISTICS,
    BSO_SELECTED_FEATURES,
    BSO_PARAMETERS,
    MODEL_RESULTS,
    CICIOT2023_ATTACK_TYPES,
    CICIOT2023_FEATURES,
} from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   Veri Analiz Süreci — Adım Adım Görsel Demo
   BSO-Hibrit RF Pipeline: Ham Veri → Ön İşleme → BSO → Eğitim → Sonuç
   ═══════════════════════════════════════════════════════════════ */

interface PipelineStep {
    id: number
    title: string
    subtitle: string
    icon: typeof Database
    color: string
    gradient: string
    duration: number // ms for auto-play
}

const STEPS: PipelineStep[] = [
    { id: 0, title: "Ham Veri", subtitle: "CICIoT2023 Veri Seti", icon: Database, color: "text-blue-500", gradient: "from-blue-500 to-blue-600", duration: 4000 },
    { id: 1, title: "Ön İşleme", subtitle: "Temizlik & Dönüştürme", icon: Filter, color: "text-purple-500", gradient: "from-purple-500 to-purple-600", duration: 4000 },
    { id: 2, title: "SMOTE Dengeleme", subtitle: "Sınıf Dengesizliği Çözümü", icon: Layers, color: "text-indigo-500", gradient: "from-indigo-500 to-indigo-600", duration: 4000 },
    { id: 3, title: "BSO Algoritması", subtitle: "Yarasa Sürüsü Optimizasyonu", icon: Brain, color: "text-emerald-500", gradient: "from-emerald-500 to-emerald-600", duration: 6000 },
    { id: 4, title: "Öznitelik Seçimi", subtitle: "39 → 19 Öznitelik", icon: Target, color: "text-amber-500", gradient: "from-amber-500 to-amber-600", duration: 4000 },
    { id: 5, title: "Model Eğitimi", subtitle: "BSO-Hibrit Random Forest", icon: Zap, color: "text-cyan-500", gradient: "from-cyan-500 to-cyan-600", duration: 4000 },
    { id: 6, title: "Sonuçlar", subtitle: "Performans Metrikleri", icon: CheckCircle2, color: "text-rose-500", gradient: "from-rose-500 to-rose-600", duration: 5000 },
]

export default function PipelineDemo() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [animProgress, setAnimProgress] = useState(0)

    // Auto-play
    useEffect(() => {
        if (!isPlaying) return
        const step = STEPS[currentStep]
        const interval = 50
        const increment = (interval / step.duration) * 100

        const timer = setInterval(() => {
            setAnimProgress((prev) => {
                if (prev >= 100) {
                    // Move to next step
                    if (currentStep < STEPS.length - 1) {
                        setCurrentStep((s) => s + 1)
                        return 0
                    } else {
                        setIsPlaying(false)
                        return 100
                    }
                }
                return prev + increment
            })
        }, interval)

        return () => clearInterval(timer)
    }, [isPlaying, currentStep])

    const goToStep = useCallback((step: number) => {
        setCurrentStep(step)
        setAnimProgress(0)
        setIsPlaying(false)
    }, [])

    const handlePlay = useCallback(() => {
        if (currentStep === STEPS.length - 1 && animProgress >= 100) {
            setCurrentStep(0)
            setAnimProgress(0)
        }
        setIsPlaying((p) => !p)
    }, [currentStep, animProgress])

    const handleNext = useCallback(() => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep((s) => s + 1)
            setAnimProgress(0)
        }
    }, [currentStep])

    const handleReset = useCallback(() => {
        setCurrentStep(0)
        setAnimProgress(0)
        setIsPlaying(false)
    }, [])

    const step = STEPS[currentStep]

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Activity className="w-8 h-8 text-indigo-500" />
                    Veri Analiz Süreci — Adım Adım Demo
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    CICIoT2023 veri setinden BSO-Hibrit RF sınıflandırmasına kadar tüm pipeline adımları
                </p>
            </div>

            {/* ════════════════════ ADIM GÖSTERGESİ ════════════════════ */}
            <Card>
                <CardContent className="pt-5 pb-5">
                    <div className="flex items-center gap-1 overflow-x-auto pb-2">
                        {STEPS.map((s, i) => {
                            const isActive = i === currentStep
                            const isDone = i < currentStep
                            const Icon = s.icon
                            return (
                                <div key={s.id} className="flex items-center flex-shrink-0">
                                    <button
                                        onClick={() => goToStep(i)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-xs font-medium ${isActive
                                            ? `bg-gradient-to-r ${s.gradient} text-white shadow-lg scale-105`
                                            : isDone
                                                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                                : "text-slate-400 dark:text-slate-500 hover:text-slate-600"
                                            }`}
                                    >
                                        {isDone ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                                        )}
                                        <span className="hidden sm:inline">{s.title}</span>
                                        <span className="sm:hidden">{i + 1}</span>
                                    </button>
                                    {i < STEPS.length - 1 && (
                                        <ArrowRight className={`w-4 h-4 mx-1 flex-shrink-0 ${isDone ? "text-emerald-400" : "text-slate-300 dark:text-slate-600"}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${step.gradient} transition-all duration-100`}
                            style={{ width: `${((currentStep + animProgress / 100) / STEPS.length) * 100}%` }}
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3 mt-3">
                        <button
                            onClick={handlePlay}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isPlaying
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200"
                                : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200"
                                }`}
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            {isPlaying ? "Duraklat" : "Otomatik Oynat"}
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentStep >= STEPS.length - 1}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-all"
                        >
                            <SkipForward className="w-4 h-4" /> Sonraki
                        </button>
                        <button
                            onClick={handleReset}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                            <RotateCcw className="w-4 h-4" /> Başa Dön
                        </button>
                        <span className="ml-auto text-xs text-slate-400">
                            Adım {currentStep + 1} / {STEPS.length}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ ADIM İÇERİĞİ ════════════════════ */}
            <div className="animate-fade-in" key={currentStep}>
                {currentStep === 0 && <StepRawData />}
                {currentStep === 1 && <StepPreprocessing />}
                {currentStep === 2 && <StepSMOTE />}
                {currentStep === 3 && <StepBSO />}
                {currentStep === 4 && <StepFeatureSelection />}
                {currentStep === 5 && <StepTraining />}
                {currentStep === 6 && <StepResults />}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 0 — Ham Veri
   ═══════════════════════════════════════════════════════════════ */
function StepRawData() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-blue-200 dark:border-blue-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Database className="w-5 h-5" /> CICIoT2023 Veri Seti
                    </CardTitle>
                    <CardDescription>Kanada Siber Güvenlik Enstitüsü tarafından oluşturulmuş gerçek IoT ağ trafiği</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <StatBox label="Toplam Örnek" value="103.218" color="blue" />
                        <StatBox label="Toplam Öznitelik" value="39" color="indigo" />
                        <StatBox label="Sınıf Sayısı" value="5" color="purple" />
                        <StatBox label="CSV Dosyası" value="19 adet" color="violet" />
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">39 Ham Öznitelik:</p>
                        <div className="flex flex-wrap gap-1">
                            {CICIOT2023_FEATURES.map((f, i) => (
                                <Badge key={i} variant="outline" className="text-[9px] px-1.5 py-0 font-mono bg-white/50 dark:bg-slate-800/50">
                                    {f.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <FileSpreadsheet className="w-5 h-5" /> Saldırı Sınıfları (Dengesiz)
                    </CardTitle>
                    <CardDescription>Orijinal veri setindeki sınıf dağılımı — ciddi dengesizlik mevcut</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {CICIOT2023_ATTACK_TYPES.map((at) => {
                        const maxSamples = Math.max(...CICIOT2023_ATTACK_TYPES.map((a) => a.trainingSamples))
                        const pct = (at.trainingSamples / maxSamples) * 100
                        return (
                            <div key={at.name} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: at.color }} />
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{at.name}</span>
                                    </div>
                                    <span className="font-mono text-slate-500">{at.trainingSamples.toLocaleString("tr-TR")}</span>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: at.color }} />
                                </div>
                            </div>
                        )
                    })}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/20 text-xs text-red-700 dark:text-red-300">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span><strong>Problem:</strong> Backdoor_Malware sınıfı sadece 2.252 örnek — çoğunluk sınıfının %12.9&apos;u</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 1 — Ön İşleme
   ═══════════════════════════════════════════════════════════════ */
function StepPreprocessing() {
    const steps = [
        { step: "1. Veri Yükleme", detail: "19 CSV dosyasından verilerin okunması", before: "Ham CSV", after: "DataFrame (103.218 × 39)", icon: FileSpreadsheet, color: "bg-blue-500" },
        { step: "2. Alt Örnekleme", detail: "Çoğunluk sınıflarının 25.000 örneğe indirilmesi", before: "Dengesiz dağılım", after: "25.000/sınıf (maks)", icon: Filter, color: "bg-purple-500" },
        { step: "3. Eğitim/Test Bölme", detail: "Tabakalı (stratified) bölme: %70 / %10 / %20", before: "Tek veri seti", after: "87.500 / 10.322 / 20.644", icon: Layers, color: "bg-indigo-500" },
        { step: "4. StandardScaler", detail: "Her özniteliğin ortalaması=0, std=1 yapılır", before: "Farklı ölçekler", after: "Normalleştirilmiş [0,1]", icon: BarChart3, color: "bg-teal-500" },
    ]

    return (
        <Card className="border-purple-200 dark:border-purple-800/40">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Filter className="w-5 h-5" /> Ön İşleme Adımları
                </CardTitle>
                <CardDescription>Ham verinin modele hazır hale getirilmesi</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {steps.map((s, i) => (
                        <div key={i} className="flex items-start gap-4">
                            {/* Timeline dot */}
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center`}>
                                    <s.icon className="w-5 h-5 text-white" />
                                </div>
                                {i < steps.length - 1 && <div className="w-0.5 h-12 bg-slate-200 dark:bg-slate-700 mt-1" />}
                            </div>
                            {/* Content */}
                            <div className="flex-1 pb-4">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{s.step}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.detail}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-[10px] px-2 py-0 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">{s.before}</Badge>
                                    <ArrowRight className="w-3 h-3 text-emerald-500" />
                                    <Badge variant="outline" className="text-[10px] px-2 py-0 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">{s.after}</Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 2 — SMOTE Dengeleme
   ═══════════════════════════════════════════════════════════════ */
function StepSMOTE() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-indigo-200 dark:border-indigo-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <Layers className="w-5 h-5" /> SMOTE Nedir?
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        <strong>SMOTE</strong> (Synthetic Minority Over-sampling Technique), azınlık sınıfı için sentetik örnekler üreterek sınıf dengesizliğini çözen bir yöntemdir.
                    </p>
                    <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2">
                        <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-xs">Nasıl Çalışır?</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                            <li>Azınlık sınıfından bir örnek seçilir</li>
                            <li>K-en yakın komşusu (k=5) bulunur</li>
                            <li>Rastgele bir komşu seçilir</li>
                            <li>İkisi arasında sentetik yeni örnek üretilir</li>
                            <li>Tüm sınıflar eşitlenene kadar tekrarlanır</li>
                        </ol>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <StatBox label="Sentetik Örnek" value={DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString("tr-TR")} color="indigo" />
                        <StatBox label="Dengeli Sınıf/başı" value={DATASET_STATISTICS.balancedClassCount.toLocaleString("tr-TR")} color="emerald" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-indigo-200 dark:border-indigo-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <BarChart3 className="w-5 h-5" /> Önce / Sonra Karşılaştırma
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {CICIOT2023_ATTACK_TYPES.map((at) => (
                        <div key={at.name} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: at.color }} />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{at.name}</span>
                                </div>
                            </div>
                            {/* Before bar */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-red-500 w-10 text-right font-mono">Önce</span>
                                <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full opacity-60" style={{ width: `${(at.trainingSamples / 17500) * 100}%`, backgroundColor: at.color }} />
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 w-14 text-right">{at.trainingSamples.toLocaleString("tr-TR")}</span>
                            </div>
                            {/* After bar */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-emerald-500 w-10 text-right font-mono">Sonra</span>
                                <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: "100%", backgroundColor: at.color }} />
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 w-14 text-right">{at.smoteSamples.toLocaleString("tr-TR")}</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-xs text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span><strong>Çözüm:</strong> SMOTE ile 72.252 → 87.500 eğitim örneği (tüm sınıflar 17.500)</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 3 — BSO Algoritması
   ═══════════════════════════════════════════════════════════════ */
function StepBSO() {
    const params = [
        { name: "Popülasyon (Yarasa)", value: BSO_PARAMETERS.populationSize, desc: "Aynı anda çalışan yarasa sayısı" },
        { name: "Maks İterasyon", value: BSO_PARAMETERS.maxIterations, desc: "Optimizasyon döngü sayısı" },
        { name: "Frekans Aralığı", value: `${BSO_PARAMETERS.frequencyMin} – ${BSO_PARAMETERS.frequencyMax}`, desc: "Yarasa yankılanma frekansı" },
        { name: "Başlangıç Gürültü", value: BSO_PARAMETERS.initialLoudness, desc: "Yüksek başlar, zamanla azalır" },
        { name: "Darbe Oranı", value: BSO_PARAMETERS.initialPulseRate, desc: "Düşük başlar, zamanla artar" },
        { name: "α (Alpha)", value: BSO_PARAMETERS.alpha, desc: "Gürültü azalma katsayısı" },
        { name: "γ (Gamma)", value: BSO_PARAMETERS.gamma, desc: "Darbe oranı artış katsayısı" },
        { name: "Boyut", value: `${BSO_PARAMETERS.dimensions} → ${BSO_PARAMETERS.selectedDimensions}`, desc: "Öznitelik uzayı boyutu" },
    ]

    const bsoSteps = [
        { step: "1. Başlatma", desc: "25 yarasa rastgele pozisyonlarla başlatılır. Her pozisyon bir öznitelik alt kümesini temsil eder (binary vektör, 39 boyut).", color: "bg-emerald-500" },
        { step: "2. Fitness Hesaplama", desc: `Her yarasa için RF modeli eğitilir, fitness = 1 - F1_macro + 0.01 × (seçilen/toplam). Düşük fitness = iyi çözüm.`, color: "bg-blue-500" },
        { step: "3. Frekans Güncelleme", desc: "Her yarasa frekansını günceller: f = f_min + (f_max - f_min) × β, β ∈ [0,1] rastgele.", color: "bg-purple-500" },
        { step: "4. Hız & Pozisyon", desc: "Yarasalar en iyi çözüme doğru hareket eder: v(t+1) = v(t) + (x - x_best) × f, x(t+1) = x(t) + v(t+1).", color: "bg-amber-500" },
        { step: "5. Yerel Arama", desc: "Darbe oranı yüksekse rastgele yürüyüş yapılır: x_new = x_best + ε × avg(loudness). Keşif-sömürü dengesi.", color: "bg-rose-500" },
        { step: "6. Yakınsama", desc: `${BSO_PARAMETERS.maxIterations} iterasyon sonunda en iyi yarasa 19 öznitelik seçer. Gürültü → 0, darbe → 1 olur.`, color: "bg-cyan-500" },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Algorithm steps */}
                <Card className="border-emerald-200 dark:border-emerald-800/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                            <Brain className="w-5 h-5" /> BSO Algoritması Nasıl Çalışır?
                        </CardTitle>
                        <CardDescription>Yarasa Sürüsü Optimizasyonu — Meta-sezgisel öznitelik seçimi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {bsoSteps.map((s, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-7 h-7 rounded-full ${s.color} flex items-center justify-center flex-shrink-0 text-white text-xs font-bold`}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.step}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Parameters */}
                <Card className="border-emerald-200 dark:border-emerald-800/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                            <Sparkles className="w-5 h-5" /> BSO Parametreleri
                        </CardTitle>
                        <CardDescription>Deneylerde kullanılan gerçek hiperparametre değerleri</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {params.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                    <div>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{p.name}</span>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500">{p.desc}</p>
                                    </div>
                                    <Badge variant="secondary" className="font-mono text-xs">{String(p.value)}</Badge>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30">
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Fitness Fonksiyonu:</p>
                            <code className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                                {BSO_PARAMETERS.fitnessFunction}
                            </code>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analogy */}
            <Card className="border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-950/10">
                <CardContent className="pt-4 pb-4">
                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                        <strong>🦇 Benzetme:</strong> 25 yarasa karanlık bir ormanda avlanıyor. Her yarasa bir &quot;çözüm&quot; = hangi
                        öznitelikleri seçeceğini belirleyen bir pozisyon. Yarasalar yankılanma (echolocation) ile iletişir:
                        iyi av bulan yarasa daha yüksek sesle bağırır, diğerleri onun konumuna yaklaşır.
                        50 tur sonunda en iyi avı bulan yarasa kazanır —&gt; 19 en iyi öznitelik seçilir.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 4 — Öznitelik Seçimi
   ═══════════════════════════════════════════════════════════════ */
function StepFeatureSelection() {
    const selectedNames = new Set(BSO_SELECTED_FEATURES.map((f) => f.name))

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-amber-200 dark:border-amber-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                        <Target className="w-5 h-5" /> 39 → 19 Öznitelik
                    </CardTitle>
                    <CardDescription>BSO tarafından seçilen (yeşil) ve elenen (kırmızı) öznitelikler</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                        {CICIOT2023_FEATURES.map((f, i) => {
                            const isSelected = selectedNames.has(f.name)
                            return (
                                <Badge
                                    key={i}
                                    className={`text-[10px] px-2 py-0.5 font-mono transition-all ${isSelected
                                        ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                                        : "bg-red-50 dark:bg-red-950/20 text-red-400 dark:text-red-500 border-red-200 dark:border-red-800 line-through opacity-60"
                                        }`}
                                    variant="outline"
                                >
                                    {isSelected && <CheckCircle2 className="w-2.5 h-2.5 mr-1" />}
                                    {f.name}
                                </Badge>
                            )
                        })}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs">
                        <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Seçilen: 19</span>
                        <span className="flex items-center gap-1 text-red-400"><span className="line-through">Elenen: 20</span></span>
                        <span className="flex items-center gap-1 text-amber-600"><TrendingUp className="w-3 h-3" /> %{DATASET_STATISTICS.featureReductionPct} azaltma</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                        <BarChart3 className="w-5 h-5" /> Seçilen Özniteliklerin Önemi
                    </CardTitle>
                    <CardDescription>BSO-RF tarafından hesaplanan önem puanları</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {BSO_SELECTED_FEATURES.slice(0, 10).map((f) => {
                            const pct = (f.importance / BSO_SELECTED_FEATURES[0].importance) * 100
                            return (
                                <div key={f.name} className="space-y-0.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            <span className="text-amber-500 font-mono mr-1">#{f.rank}</span> {f.name}
                                        </span>
                                        <span className="font-mono text-slate-500">{(f.importance * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                        <p className="text-[10px] text-slate-400 mt-2 text-center">İlk 10 öznitelik gösterilmektedir (toplam 19)</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 5 — Model Eğitimi
   ═══════════════════════════════════════════════════════════════ */
function StepTraining() {
    const hp = BSO_PARAMETERS.optimizedHyperparameters
    const bsoRF = MODEL_RESULTS[0]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-cyan-200 dark:border-cyan-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                        <Zap className="w-5 h-5" /> BSO-Hibrit RF Eğitimi
                    </CardTitle>
                    <CardDescription>BSO ile optimize edilmiş Random Forest hiperparametreleri</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {[
                            { name: "n_estimators (Ağaç Sayısı)", value: hp?.n_estimators ?? 266 },
                            { name: "max_depth (Maks Derinlik)", value: hp?.max_depth ?? 25 },
                            { name: "min_samples_split", value: hp?.min_samples_split ?? 3 },
                            { name: "min_samples_leaf", value: hp?.min_samples_leaf ?? 1 },
                            { name: "max_features", value: `"${hp?.max_features ?? "sqrt"}"` },
                        ].map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-800/30">
                                <span className="text-sm text-slate-700 dark:text-slate-300">{p.name}</span>
                                <Badge variant="secondary" className="font-mono">{String(p.value)}</Badge>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <StatBox label="Eğitim Süresi" value={`${bsoRF.trainingTime}s`} color="cyan" />
                        <StatBox label="Tahmin Süresi" value={`${bsoRF.predictionTime}s`} color="teal" />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-cyan-200 dark:border-cyan-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                        <Shield className="w-5 h-5" /> Eğitim Süreci
                    </CardTitle>
                    <CardDescription>Model eğitimi adımları</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { step: "1. Veri Hazırlığı", desc: `87.500 eğitim örneği × 19 öznitelik matris hazırlanır`, color: "bg-blue-500" },
                            { step: "2. RF Başlatma", desc: `${hp?.n_estimators ?? 266} karar ağacı başlatılır (max_depth=${hp?.max_depth ?? 25})`, color: "bg-purple-500" },
                            { step: "3. Bootstrap Örnekleme", desc: "Her ağaç farklı bir alt örneklem üzerinde eğitilir (bagging)", color: "bg-indigo-500" },
                            { step: "4. Bölme Kriteri", desc: `Her düğümde √19 ≈ 4 rastgele öznitelik değerlendirilir (Gini impurity)`, color: "bg-emerald-500" },
                            { step: "5. Oylama", desc: `${hp?.n_estimators ?? 266} ağacın çoğunluk oyuyla nihai sınıf belirlenir`, color: "bg-amber-500" },
                            { step: "6. Doğrulama", desc: "10.322 doğrulama örneği ile hiperparametre kontrolü", color: "bg-rose-500" },
                        ].map((s, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full ${s.color} flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold`}>
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.step}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   STEP 6 — Sonuçlar
   ═══════════════════════════════════════════════════════════════ */
function StepResults() {
    const bsoRF = MODEL_RESULTS[0]
    const rf39 = MODEL_RESULTS.find((m) => m.name === "Random Forest")
    const metrics = [
        { name: "Doğruluk (Accuracy)", bso: bsoRF.accuracy, rf: rf39?.accuracy ?? 0, unit: "%" },
        { name: "F1-Makro", bso: bsoRF.f1Macro, rf: rf39?.f1Macro ?? 0, unit: "%" },
        { name: "AUC-ROC", bso: bsoRF.aucRoc, rf: rf39?.aucRoc ?? 0, unit: "%" },
        { name: "MCC", bso: bsoRF.mcc, rf: rf39?.mcc ?? 0, unit: "" },
        { name: "Eğitim Süresi", bso: bsoRF.trainingTime, rf: rf39?.trainingTime ?? 0, unit: "s" },
        { name: "Öznitelik Sayısı", bso: bsoRF.featuresUsed, rf: rf39?.featuresUsed ?? 39, unit: "" },
    ]

    return (
        <div className="space-y-6">
            {/* Hero result */}
            <Card className="border-2 border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50/50 via-white to-indigo-50/50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-indigo-950/20">
                <CardContent className="pt-6 pb-6">
                    <div className="text-center space-y-4">
                        <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                            BSO-Hibrit RF — Nihai Sonuçlar
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                            20.644 test örneği üzerinde değerlendirilmiş sonuçlar
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                            <StatBox label="Doğruluk" value={`%${bsoRF.accuracy}`} color="emerald" />
                            <StatBox label="F1-Makro" value={`%${bsoRF.f1Macro}`} color="blue" />
                            <StatBox label="AUC-ROC" value={`%${bsoRF.aucRoc}`} color="purple" />
                            <StatBox label="Öznitelik" value={`${bsoRF.featuresUsed}/39`} color="amber" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* BSO-RF vs standard RF comparison */}
            <Card className="border-rose-200 dark:border-rose-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                        <TrendingUp className="w-5 h-5" /> Karşılaştırma: BSO-RF (19 öznitelik) vs Standart RF (39 öznitelik)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {metrics.map((m, i) => {
                            const diff = m.bso - m.rf
                            const isImproved = m.name === "Öznitelik Sayısı" ? diff < 0 : m.name === "Eğitim Süresi" ? diff < 0 : diff > 0
                            return (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-40">{m.name}</span>
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="flex-1 text-center">
                                            <Badge className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700 font-mono" variant="outline">
                                                BSO-RF: {m.bso}{m.unit}
                                            </Badge>
                                        </div>
                                        <span className="text-xs text-slate-400">vs</span>
                                        <div className="flex-1 text-center">
                                            <Badge className="font-mono" variant="outline">
                                                RF: {m.rf}{m.unit}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Badge
                                        className={`text-[10px] ${isImproved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}
                                        variant="outline"
                                    >
                                        {diff > 0 ? "+" : ""}{m.name === "MCC" ? diff.toFixed(4) : diff.toFixed(2)}{m.unit}
                                    </Badge>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-emerald-700 dark:text-emerald-300">
                        <strong>Sonuç:</strong> BSO-Hibrit RF, 19 öznitelikle (%51.3 azaltma) standart RF&apos;nin 39 öznitelikle ulaştığı performansı koruyor,
                        hatta doğruluk ve F1-Makro&apos;da hafif artış sağlıyor. Eğitim süresi de %17 azalmıştır.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   Utility: Stat box
   ═══════════════════════════════════════════════════════════════ */
function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
    const colorMap: Record<string, string> = {
        blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
        indigo: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/40",
        purple: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40",
        violet: "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/40",
        emerald: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
        amber: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
        cyan: "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/40",
        teal: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/40",
    }
    return (
        <div className={`p-3 rounded-xl border text-center ${colorMap[color] ?? colorMap.blue}`}>
            <div className="text-lg font-black">{value}</div>
            <div className="text-[10px] opacity-70 mt-0.5">{label}</div>
        </div>
    )
}
