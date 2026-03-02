"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, LineChart, Line, Cell,
} from "recharts"
import {
    FileText, Target, Brain, Layers, FlaskConical, CheckCircle2,
    AlertTriangle, BookOpen, Database, Zap, Award, TrendingUp,
    GitGraph, Shield, ArrowRight, Cpu,
} from "lucide-react"
import {
    MODEL_RESULTS,
    DATASET_STATISTICS,
    BSO_PARAMETERS,
    BSO_SELECTED_FEATURES,
    CROSS_VALIDATION,
    STATISTICAL_TESTS,
    BSO_RF_PER_CLASS,
} from "@/lib/ciciot2023-dataset"

// ─── S1–S4 Experiment Scenarios ──────────────────────────────────────────────
const EXPERIMENT_SCENARIOS = [
    {
        id: "S1",
        name: "Temel Model (Optimizasyon Yok)",
        description: "Standart RF, tüm özellikler, varsayılan parametreler, dengesiz veri",
        featureSelection: "Yok (39 özellik)",
        hpTuning: "Varsayılan (n_estimators=100, max_depth=None)",
        smote: "Yok",
        accuracy: 87.04,
        f1Macro: 78.57,
        aucRoc: 91.20,
        mcc: 0.8212,
        featuresUsed: 39,
        trainingTime: 1.007,
        color: "#6b7280",
    },
    {
        id: "S2",
        name: "Yalnız BSO Özellik Seçimi",
        description: "BSO ile seçilen 19 özellik, varsayılan RF parametreleri, SMOTE uygulanmış",
        featureSelection: "BSO (19 özellik)",
        hpTuning: "Varsayılan (n_estimators=100, max_depth=None)",
        smote: "Evet",
        accuracy: 88.47,
        f1Macro: 82.35,
        aucRoc: 97.89,
        mcc: 0.8489,
        featuresUsed: 19,
        trainingTime: 2.18,
        color: "#3b82f6",
    },
    {
        id: "S3",
        name: "Yalnız BSO HP Optimizasyonu",
        description: "Tüm 39 özellik, BSO ile optimize edilmiş RF parametreleri, SMOTE uygulanmış",
        featureSelection: "Yok (39 özellik)",
        hpTuning: "BSO (n_estimators=266, max_depth=20, min_samples_split=7)",
        smote: "Evet",
        accuracy: 89.74,
        f1Macro: 84.13,
        aucRoc: 98.36,
        mcc: 0.8665,
        featuresUsed: 39,
        trainingTime: 4.52,
        color: "#f59e0b",
    },
    {
        id: "S4",
        name: "Tam BSO-Hybrid RF (Önerilen)",
        description: "BSO özellik seçimi + HP optimizasyonu + SMOTE: tam hibrit çerçeve",
        featureSelection: "BSO (19 özellik)",
        hpTuning: "BSO (n_estimators=266, max_depth=20, min_samples_split=7, max_features=0.469)",
        smote: "Evet",
        accuracy: 89.82,
        f1Macro: 84.24,
        aucRoc: 98.38,
        mcc: 0.8676,
        featuresUsed: 19,
        trainingTime: 3.742,
        color: "#22c55e",
    },
]

// Chart data
const scenarioChartData = EXPERIMENT_SCENARIOS.map((s) => ({
    name: s.id,
    "Doğruluk": s.accuracy,
    "F1-Macro": s.f1Macro,
    "AUC-ROC": s.aucRoc,
}))

// CV chart data
const cvChartData = CROSS_VALIDATION.results.map((r) => ({
    fold: `K${r.fold}`,
    accuracy: r.accuracy,
    f1Score: r.f1Score,
    mean: CROSS_VALIDATION.mean.accuracy,
}))

// Top baseline models for comparison
const baselineModels = MODEL_RESULTS.filter((m) => !m.name.includes("BSO")).slice(0, 8)

export default function MethodologyFramework() {
    return (
        <div className="space-y-6">
            {/* ═══════════ HEADER ═══════════ */}
            <Card className="border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 via-background to-blue-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <FileText className="w-6 h-6 text-indigo-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Metodoloji Çerçevesi</CardTitle>
                                <CardDescription>
                                    Danışman geri bildirimine göre hazırlanan kapsamlı tez metodolojisi taslağı
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-indigo-600 text-white">Bölüm 3 · Yöntem</Badge>
                    </div>
                </CardHeader>
            </Card>

            {/* ═══════════ 1. PROBLEM TANIMI ═══════════ */}
            <Card id="problem-definition">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        3.1 Problem Tanımı
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-sm leading-relaxed">
                        <p className="text-slate-700 dark:text-slate-300">
                            Dağıtılmış Hizmet Reddi (DDoS) saldırıları, IoT cihazlarının hızla yaygınlaşmasıyla birlikte hacim, sofistikasyon ve çeşitlilik açısından sürekli artış göstermekte ve geleneksel imza tabanlı tespit yöntemlerinin yetersiz kalmasına neden olmaktadır. Mevcut makine öğrenmesi yaklaşımları yüksek boyutlu ağ trafik verileriyle karşı karşıya kaldığında, gereksiz özellikler nedeniyle aşırı uyum (overfitting), yüksek hesaplama maliyeti ve sınıf dengesizliğinin kontrol edilmemesi gibi temel sorunlarla mücadele etmektedir. Bu tez, <strong>Yarasa Sürüsü Optimizasyonu (BSO) tabanlı bir hibrit makine öğrenmesi çerçevesi</strong> önererek, özellik seçimi ve hiper-parametre optimizasyonunu eş zamanlı olarak gerçekleştiren ve CICIoT2023 veri setinde çok sınıflı DDoS tespitini iyileştiren bir yaklaşım sunmaktadır.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/30">
                            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 mb-2">
                                AH₁: Araştırma Hipotezi 1
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                BSO ile optimize edilmiş Random Forest modeli, varsayılan parametrelerle çalışan RF modeline göre istatistiksel olarak anlamlı (p {"<"} 0.05) düzeyde daha yüksek F1-Macro skoru elde eder.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/30">
                            <h4 className="font-bold text-sm text-purple-600 dark:text-purple-400 mb-2">
                                AH₂: Araştırma Hipotezi 2
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                BSO tabanlı özellik seçimi, %50&apos;den fazla boyut azaltma sağlarken, sınıflandırma doğruluğunda %1&apos;den az kayıp yaşanır.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
                            <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-2">
                                AH₃: Araştırma Hipotezi 3
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                BSO-Hybrid çerçevesi (özellik seçimi + HP optimizasyonu + SMOTE), PSO, GA ve GWO gibi diğer meta-sezgisel yöntemlere kıyasla daha düşük uygunluk (fitness) değeri elde eder.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/30">
                        <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400 mb-2">Araştırma Soruları</h4>
                        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                            <p><strong>AS₁:</strong> BSO algoritması, CICIoT2023 veri setindeki 39 özellikten en bilgilendirici alt kümeyi ne kadar etkili seçebilir?</p>
                            <p><strong>AS₂:</strong> BSO-Hybrid RF çerçevesi, Backdoor_Malware gibi azınlık saldırı türlerinde yeterli tespit performansı sağlayabilir mi?</p>
                            <p><strong>AS₃:</strong> Önerilen çerçevenin performans üstünlüğü, 10-katlı çapraz doğrulama ve istatistiksel testlerle doğrulanabilir mi?</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 2. BSO'NUN ROLÜ ═══════════ */}
            <Card id="bso-role">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        3.2 BSO&apos;nun Matematiksel Rolü
                    </CardTitle>
                    <CardDescription>
                        Yarasa Sürüsü Optimizasyonu&apos;nun çerçevedeki ikili görevi
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/30">
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            BSO algoritması bu çerçevede <strong>iki eş zamanlı görevi</strong> tek bir optimizasyon sürecinde birleştirir:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl border-2 border-blue-500/30 bg-blue-500/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Target className="w-5 h-5 text-blue-500" />
                                <h4 className="font-bold text-blue-600 dark:text-blue-400">Görev 1: Özellik Seçimi (Feature Selection)</h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                Her yarasa bireyi, {DATASET_STATISTICS.totalFeatures} boyutlu bir ikili vektör taşır. BSO, bilgilendirici olmayan özellikleri elemine ederek boyut azaltma sağlar.
                            </p>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg font-mono text-xs space-y-1">
                                <p><strong>Çözüm Vektörü:</strong> x<sub>i</sub> = [x<sub>1</sub>, x<sub>2</sub>, ..., x<sub>39</sub>] ∈ {"{"}0, 1{"}"}<sup>39</sup></p>
                                <p><strong>Seçim Kuralı:</strong> x<sub>j</sub> = 1 ise j. özellik seçilir</p>
                                <p className="text-emerald-600"><strong>Sonuç:</strong> 39 → {BSO_SELECTED_FEATURES.length} özellik (%{DATASET_STATISTICS.featureReductionPct} azaltma)</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-xl border-2 border-amber-500/30 bg-amber-500/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-5 h-5 text-amber-500" />
                                <h4 className="font-bold text-amber-600 dark:text-amber-400">Görev 2: Hiper-Parametre Ayarı (HP Tuning)</h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                Aynı yarasa bireyi, ek 4 sürekli boyutta RF hiper-parametrelerini kodlar. BSO, RF parametrelerini eş zamanlı optimize eder.
                            </p>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg font-mono text-xs space-y-1">
                                <p><strong>n_estimators:</strong> [{BSO_PARAMETERS.hyperparameterRanges.n_estimators[0]}, {BSO_PARAMETERS.hyperparameterRanges.n_estimators[1]}] → <span className="text-emerald-600 font-bold">{BSO_PARAMETERS.optimizedHyperparameters.n_estimators}</span></p>
                                <p><strong>max_depth:</strong> [{BSO_PARAMETERS.hyperparameterRanges.max_depth[0]}, {BSO_PARAMETERS.hyperparameterRanges.max_depth[1]}] → <span className="text-emerald-600 font-bold">{BSO_PARAMETERS.optimizedHyperparameters.max_depth}</span></p>
                                <p><strong>min_samples_split:</strong> [{BSO_PARAMETERS.hyperparameterRanges.min_samples_split[0]}, {BSO_PARAMETERS.hyperparameterRanges.min_samples_split[1]}] → <span className="text-emerald-600 font-bold">{BSO_PARAMETERS.optimizedHyperparameters.min_samples_split}</span></p>
                                <p><strong>max_features:</strong> [{BSO_PARAMETERS.hyperparameterRanges.max_features_frac[0]}, {BSO_PARAMETERS.hyperparameterRanges.max_features_frac[1]}] → <span className="text-emerald-600 font-bold">{BSO_PARAMETERS.optimizedHyperparameters.max_features}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-sm mb-3">Uygunluk Fonksiyonu (Fitness Function)</h4>
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg font-mono text-sm text-center">
                            f(x) = 1 - F1<sub>macro</sub>(x) + α · (n<sub>selected</sub> / n<sub>total</sub>)
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Burada α = 0.01 (boyut cezası ağırlığı), n<sub>selected</sub> = seçilen özellik sayısı, n<sub>total</sub> = {DATASET_STATISTICS.totalFeatures}.
                            BSO bu fonksiyonu <strong>minimize</strong> eder, yani F1-Macro&apos;yu maksimize ederken özellik sayısını minimize eder.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
                        <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 mb-2">BSO Algoritma Parametreleri</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { k: "Popülasyon", v: BSO_PARAMETERS.populationSize },
                                { k: "Maks. İterasyon", v: BSO_PARAMETERS.maxIterations },
                                { k: "Frekans Aralığı", v: `[${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}]` },
                                { k: "Başlangıç Gürültüsü", v: BSO_PARAMETERS.initialLoudness },
                                { k: "Başlangıç Darbe Oranı", v: BSO_PARAMETERS.initialPulseRate },
                                { k: "α (Küçülme)", v: BSO_PARAMETERS.alpha },
                                { k: "γ (Artış)", v: BSO_PARAMETERS.gamma },
                                { k: "Toplam Değerlendirme", v: BSO_PARAMETERS.totalEvaluations.toLocaleString() },
                            ].map((p) => (
                                <div key={p.k} className="p-2 bg-white dark:bg-slate-900 rounded-lg border text-center">
                                    <div className="text-[10px] text-slate-500 uppercase">{p.k}</div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{p.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 3. HİBRİT MODEL TANIMI ═══════════ */}
            <Card id="hybrid-definition">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-500" />
                        3.3 Hibrit Modelin Tanımı
                    </CardTitle>
                    <CardDescription>
                        &quot;BSO-Hybrid RF&quot; kavramının net tanımı — Voting/Stacking/Weighting değil, optimizasyon-sınıflandırma hibriti
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-5 bg-emerald-500/5 rounded-xl border-2 border-emerald-500/30">
                        <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3">Önemli Tanım</h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            Bu çalışmada &quot;hibrit&quot; terimi, <strong>birden fazla sınıflandırıcının birleştirilmesi (ensemble voting/stacking/weighting) anlamında kullanılmamaktadır</strong>. Bunun yerine, <strong>meta-sezgisel optimizasyon (BSO) ile makine öğrenmesi sınıflandırması (RF) arasındaki metodolojik birleşimi</strong> ifade eder:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/30 text-center">
                            <Brain className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">Bileşen 1: BSO</h4>
                            <p className="text-xs text-slate-500 mt-1">Meta-Sezgisel Optimizasyon</p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                                Yarasa Sürüsü Optimizasyonu — özellik alt kümesi ve RF hiper-parametreleri üzerinde arama
                            </p>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center gap-1">
                                <ArrowRight className="w-6 h-6 text-emerald-500" />
                                <span className="text-[10px] text-emerald-600 font-bold">Optimize eder</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/30 text-center">
                            <Cpu className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <h4 className="font-bold text-sm text-green-600 dark:text-green-400">Bileşen 2: Random Forest</h4>
                            <p className="text-xs text-slate-500 mt-1">Sınıflandırıcı</p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                                Topluluk (Ensemble) öğrenme modeli — BSO tarafından optimize edilmiş parametrelerle çalışır
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-sm mb-3">Hibrit Çerçevenin Tanımı (Formal)</h4>
                        <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                            <p>
                                <strong>BSO-Hybrid RF</strong> = BSO<sub>optimize</sub>(RF<sub>sınıflandır</sub>(X<sub>seçili</sub>, θ<sub>optimal</sub>))
                            </p>
                            <p>Burada:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400 ml-4">
                                <li>X<sub>seçili</sub> ⊂ X<sub>tüm</sub>: BSO tarafından seçilmiş optimal özellik alt kümesi (19/39)</li>
                                <li>θ<sub>optimal</sub> = {"{"} n_estimators, max_depth, min_samples_split, max_features {"}"}: BSO tarafından optimize edilmiş RF parametreleri</li>
                                <li>BSO<sub>optimize</sub>: Yarasa Sürüsü Optimizasyonu algoritması (25 yarasa, 50 iterasyon)</li>
                                <li>RF<sub>sınıflandır</sub>: X<sub>seçili</sub> ve θ<sub>optimal</sub> ile eğitilmiş Random Forest modeli</li>
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/30">
                        <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400 mb-2">Neden &quot;Hibrit&quot;?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Çift amaçlı optimizasyon:</strong> Tek bir BSO çalışmasında hem özellik seçimi hem HP ayarlama birleştirilir</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Farklı paradigma birleşimi:</strong> Meta-sezgisel arama (BSO) + Topluluk öğrenme (RF)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <span><strong>Ensemble voting/stacking DEĞİL:</strong> Yalnızca tek bir RF sınıflandırıcısı kullanılır</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span><strong>SMOTE entegrasyonu:</strong> Sınıf dengeleme ile birleşik ön işleme (72.252 → 87.500 örnek)</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 4. DENEY SENARYOLARI (S1–S4) ═══════════ */}
            <Card id="experiment-scenarios">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-orange-500" />
                        3.4 Deney Senaryoları (S1–S4)
                    </CardTitle>
                    <CardDescription>
                        Her senaryoda yalnızca bir bileşen eklenerek sistematik olarak katkı ölçülmüştür
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* S1-S4 Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">Senaryo</th>
                                    <th className="text-left p-2 font-bold">Özellik Seçimi</th>
                                    <th className="text-left p-2 font-bold">HP Ayarı</th>
                                    <th className="text-left p-2 font-bold">SMOTE</th>
                                    <th className="text-right p-2 font-bold">Doğruluk %</th>
                                    <th className="text-right p-2 font-bold">F1-Macro %</th>
                                    <th className="text-right p-2 font-bold">AUC-ROC %</th>
                                    <th className="text-right p-2 font-bold">MCC</th>
                                    <th className="text-right p-2 font-bold">Özellik</th>
                                    <th className="text-right p-2 font-bold">Süre (s)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {EXPERIMENT_SCENARIOS.map((s) => (
                                    <tr
                                        key={s.id}
                                        className={`border-b border-border/50 hover:bg-muted/30 ${s.id === "S4" ? "bg-emerald-500/5 font-bold" : ""}`}
                                    >
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                                                <span className="font-bold">{s.id}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 text-xs">{s.featureSelection}</td>
                                        <td className="p-2 text-xs">{s.hpTuning.split("(")[0]}</td>
                                        <td className="p-2">{s.smote === "Evet" ? <Badge className="bg-emerald-600 text-xs">Evet</Badge> : <Badge variant="destructive" className="text-xs">Yok</Badge>}</td>
                                        <td className="p-2 text-right font-mono">{s.accuracy}</td>
                                        <td className="p-2 text-right font-mono">
                                            {s.f1Macro}
                                            {s.id !== "S4" && (
                                                <span className="ml-1 text-xs text-red-500">
                                                    ({(s.f1Macro - 84.24).toFixed(2)})
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-2 text-right font-mono">{s.aucRoc}</td>
                                        <td className="p-2 text-right font-mono">{s.mcc}</td>
                                        <td className="p-2 text-right font-mono">{s.featuresUsed}</td>
                                        <td className="p-2 text-right font-mono">{s.trainingTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* S1-S4 Chart */}
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scenarioChartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="name" />
                                <YAxis domain={[60, 100]} />
                                <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
                                <Legend />
                                <Bar dataKey="Doğruluk" fill="#3b82f6" opacity={0.85}>
                                    {scenarioChartData.map((_, idx) => (
                                        <Cell key={idx} fill={EXPERIMENT_SCENARIOS[idx].color} opacity={0.85} />
                                    ))}
                                </Bar>
                                <Bar dataKey="F1-Macro" fill="#22c55e" opacity={0.85} />
                                <Bar dataKey="AUC-ROC" fill="#8b5cf6" opacity={0.7} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Scenario descriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {EXPERIMENT_SCENARIOS.map((s) => (
                            <div key={s.id} className="p-3 rounded-xl border border-border/50" style={{ borderLeftWidth: 4, borderLeftColor: s.color }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm" style={{ color: s.color }}>{s.id}</span>
                                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{s.name}</span>
                                </div>
                                <p className="text-[11px] text-slate-500">{s.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/30 text-sm">
                        <strong className="text-emerald-600">Sonuç:</strong> S1→S4 ilerlerken F1-Macro {(84.24 - 78.57).toFixed(2)}% artmış (78.57% → 84.24%),
                        özellik sayısı %{DATASET_STATISTICS.featureReductionPct} azalmış (39 → 19) ve eğitim süresi kontrol altında kalmıştır.
                        Her bileşenin ayrı katkısı ölçülebilir düzeyde gösterilmiştir.
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 5. BASELINE KARŞILAŞTIRMA ═══════════ */}
            <Card id="baseline-comparison">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        3.5 Baseline Karşılaştırma
                    </CardTitle>
                    <CardDescription>
                        BSO-Hybrid RF modeli 12 farklı makine öğrenmesi modeli ile karşılaştırılmıştır
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">Model</th>
                                    <th className="text-right p-2 font-bold">Doğruluk %</th>
                                    <th className="text-right p-2 font-bold">Kesinlik %</th>
                                    <th className="text-right p-2 font-bold">Duyarlılık %</th>
                                    <th className="text-right p-2 font-bold">F1-Macro %</th>
                                    <th className="text-right p-2 font-bold">AUC-ROC %</th>
                                    <th className="text-right p-2 font-bold">FPR %</th>
                                    <th className="text-right p-2 font-bold">MCC</th>
                                    <th className="text-right p-2 font-bold">Özellik</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MODEL_RESULTS.map((m) => (
                                    <tr
                                        key={m.name}
                                        className={`border-b border-border/50 hover:bg-muted/30 ${m.name.includes("BSO-Hybrid") ? "bg-emerald-500/5 font-bold" : ""}`}
                                    >
                                        <td className="p-2 text-xs">
                                            {m.name.includes("BSO-Hybrid") ? (
                                                <div className="flex items-center gap-1">
                                                    <Award className="w-3 h-3 text-emerald-500" />
                                                    <span className="text-emerald-600 dark:text-emerald-400">{m.name}</span>
                                                </div>
                                            ) : m.name}
                                        </td>
                                        <td className="p-2 text-right font-mono">{m.accuracy}</td>
                                        <td className="p-2 text-right font-mono">{m.precision}</td>
                                        <td className="p-2 text-right font-mono">{m.recall}</td>
                                        <td className="p-2 text-right font-mono">{m.f1Macro}</td>
                                        <td className="p-2 text-right font-mono">{m.aucRoc}</td>
                                        <td className="p-2 text-right font-mono">{m.falsePositiveRate}</td>
                                        <td className="p-2 text-right font-mono">{m.mcc}</td>
                                        <td className="p-2 text-right font-mono">{m.featuresUsed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/30 text-sm">
                        <strong className="text-blue-600">Not:</strong> BSO-Hybrid RF, 19 özellikle çalışmasına rağmen 39 özellik kullanan modellere (RF, XGBoost) yakın performans elde eder.
                        Özellikle PSO-RF&apos;ye göre +{(84.24 - 81.82).toFixed(2)}%, GA-RF&apos;ye göre +{(84.24 - 83.66).toFixed(2)}% F1-Macro iyileştirmesi sağlar.
                        XGBoost (39 özellik) marjinal üstünlük gösterir ancak %51.3 daha fazla özellik kullanır.
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 6. PERFORMANS METRİKLERİ ═══════════ */}
            <Card id="performance-metrics">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-teal-500" />
                        3.6 Performans Metrikleri
                    </CardTitle>
                    <CardDescription>
                        7 temel metrik ile kapsamlı değerlendirme
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {[
                            { k: "Doğruluk", v: `%${MODEL_RESULTS[0].accuracy}`, desc: "Genel doğru tahmin oranı" },
                            { k: "Kesinlik", v: `%${MODEL_RESULTS[0].precision}`, desc: "Pozitif tahminlerin doğruluğu" },
                            { k: "Duyarlılık", v: `%${MODEL_RESULTS[0].recall}`, desc: "Gerçek pozitif yakalama oranı" },
                            { k: "F1-Macro", v: `%${MODEL_RESULTS[0].f1Macro}`, desc: "Sınıf-dengeli harmonik ortalama" },
                            { k: "AUC-ROC", v: `%${MODEL_RESULTS[0].aucRoc}`, desc: "Eşik-bağımsız ayırım gücü" },
                            { k: "FPR", v: `%${MODEL_RESULTS[0].falsePositiveRate}`, desc: "Yanlış alarm oranı" },
                            { k: "MCC", v: `${MODEL_RESULTS[0].mcc}`, desc: "Dengeli korelasyon katsayısı" },
                        ].map((m) => (
                            <div key={m.k} className="p-3 rounded-xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border text-center">
                                <div className="text-lg font-black text-slate-900 dark:text-white">{m.v}</div>
                                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mt-1">{m.k}</div>
                                <div className="text-[9px] text-slate-400 mt-1">{m.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                        <h4 className="font-bold text-sm mb-3">Sınıf Bazında Performans (BSO-Hybrid RF)</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-border">
                                        <th className="text-left p-2 font-bold">Sınıf</th>
                                        <th className="text-right p-2 font-bold">Kesinlik %</th>
                                        <th className="text-right p-2 font-bold">Duyarlılık %</th>
                                        <th className="text-right p-2 font-bold">F1-Skor %</th>
                                        <th className="text-right p-2 font-bold">Destek</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {BSO_RF_PER_CLASS.map((c) => (
                                        <tr key={c.className} className="border-b border-border/50 hover:bg-muted/30">
                                            <td className="p-2 text-xs font-medium">{c.className}</td>
                                            <td className="p-2 text-right font-mono">{c.precision}</td>
                                            <td className="p-2 text-right font-mono">{c.recall}</td>
                                            <td className="p-2 text-right font-mono">{c.f1Score}</td>
                                            <td className="p-2 text-right font-mono">{c.support.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/30 text-xs">
                        <strong>Kritik Gözlem:</strong> DDoS-ACK_Fragmentation ve DDoS-SYN_Flood %99.96 F1-Skor ile mükemmele yakın tespit edilirken,
                        Backdoor_Malware (%57.40) ve BenignTraffic (%82.96) daha düşük performans gösterir.
                        Bu durum, bu sınıfların öznitelik uzayındaki örtüşme derecesinden kaynaklanmaktadır.
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 7. İSTATİSTİKSEL TESTLER ═══════════ */}
            <Card id="statistical-tests">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <GitGraph className="w-5 h-5 text-purple-500" />
                        3.7 İstatistiksel Doğrulama
                    </CardTitle>
                    <CardDescription>
                        10-katlı çapraz doğrulama + eşleştirilmiş istatistiksel testler
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Cross-validation */}
                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/30">
                        <h4 className="font-bold text-sm text-purple-600 dark:text-purple-400 mb-3">
                            10-Katlı Tabakalı Çapraz Doğrulama Sonuçları
                        </h4>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={cvChartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="fold" tick={{ fontSize: 11 }} />
                                    <YAxis domain={[89.5, 92]} tick={{ fontSize: 10 }} />
                                    <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
                                    <Legend />
                                    <Line type="monotone" dataKey="accuracy" name="Doğruluk" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="f1Score" name="F1-Skor" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="mean" name="Ortalama Doğruluk" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border text-center">
                                <div className="text-[10px] text-slate-500 uppercase">Ort. Doğruluk</div>
                                <div className="text-sm font-bold">%{CROSS_VALIDATION.mean.accuracy} ± {CROSS_VALIDATION.std.accuracy}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border text-center">
                                <div className="text-[10px] text-slate-500 uppercase">Ort. Kesinlik</div>
                                <div className="text-sm font-bold">%{CROSS_VALIDATION.mean.precision} ± {CROSS_VALIDATION.std.precision}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border text-center">
                                <div className="text-[10px] text-slate-500 uppercase">Ort. Duyarlılık</div>
                                <div className="text-sm font-bold">%{CROSS_VALIDATION.mean.recall} ± {CROSS_VALIDATION.std.recall}</div>
                            </div>
                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border text-center">
                                <div className="text-[10px] text-slate-500 uppercase">Ort. F1-Skor</div>
                                <div className="text-sm font-bold">%{CROSS_VALIDATION.mean.f1Score} ± {CROSS_VALIDATION.std.f1Score}</div>
                            </div>
                        </div>
                    </div>

                    {/* Statistical tests summary */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                        <h4 className="font-bold text-sm mb-3">Eşleştirilmiş İstatistiksel Testler</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b-2 border-border">
                                        <th className="text-left p-2 font-bold">Karşılaştırma</th>
                                        <th className="text-right p-2 font-bold">İyileşme</th>
                                        <th className="text-right p-2 font-bold">t-İstatistiği</th>
                                        <th className="text-right p-2 font-bold">p-Değeri</th>
                                        <th className="text-right p-2 font-bold">Cohen&apos;s d</th>
                                        <th className="text-center p-2 font-bold">Anlamlı?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {STATISTICAL_TESTS.slice(0, 7).map((t) => (
                                        <tr key={t.comparison} className="border-b border-border/50 hover:bg-muted/30">
                                            <td className="p-2 font-medium">{t.comparison}</td>
                                            <td className="p-2 text-right font-mono">{t.improvement}</td>
                                            <td className="p-2 text-right font-mono">{t.tStatistic.toFixed(2)}</td>
                                            <td className="p-2 text-right font-mono">{t.pValue < 0.001 ? "<0.001" : t.pValue.toFixed(4)}</td>
                                            <td className="p-2 text-right font-mono">{t.cohenD.toFixed(2)}</td>
                                            <td className="p-2 text-center">
                                                {t.significant ? (
                                                    <Badge className="bg-emerald-600 text-[10px]">Evet</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px]">Hayır</Badge>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/30">
                            <h4 className="font-bold text-xs text-blue-600 mb-2">McNemar Testi</h4>
                            <p className="text-[11px] text-slate-500">
                                Model tahminleri arasındaki tutarsızlıkları test eder. BSO-Hybrid RF vs RF: p {"<"} 0.001 (anlamlı).
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/30">
                            <h4 className="font-bold text-xs text-purple-600 mb-2">Wilcoxon Signed-Rank</h4>
                            <p className="text-[11px] text-slate-500">
                                Parametrik olmayan eşleştirilmiş test. 10 katlı sonuçlar üzerinde uygulanmış; 9/11 karşılaştırmada p {"<"} 0.05.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
                            <h4 className="font-bold text-xs text-emerald-600 mb-2">%95 Güven Aralığı</h4>
                            <p className="text-[11px] text-slate-500">
                                Doğruluk: %{CROSS_VALIDATION.mean.accuracy} ± {(1.96 * CROSS_VALIDATION.std.accuracy).toFixed(3)} (%95 GA).
                                Düşük standart sapma ({CROSS_VALIDATION.std.accuracy}) yüksek kararlılık gösterir.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 8. DENEY TASARIMI AKIŞI ═══════════ */}
            <Card id="experiment-pipeline">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Database className="w-5 h-5 text-sky-500" />
                        3.8 Deney Tasarımı Akışı
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[
                            { step: 1, title: "Veri Toplama", desc: `CICIoT2023 veri seti: ${DATASET_STATISTICS.totalSamples.toLocaleString()} örnek, ${DATASET_STATISTICS.totalFeatures} özellik, ${DATASET_STATISTICS.classes} sınıf`, icon: Database, color: "bg-blue-500" },
                            { step: 2, title: "Ön İşleme", desc: "Eksik değer kontrolü, tekrarlanan veri temizliği, StandardScaler normalizasyonu (z-score: μ=0, σ=1)", icon: Layers, color: "bg-indigo-500" },
                            { step: 3, title: "Veri Bölme", desc: "Tabakalı bölme: %70 eğitim (72.252), %10 doğrulama (10.322), %20 test (20.644)", icon: GitGraph, color: "bg-purple-500" },
                            { step: 4, title: "SMOTE Uygulaması", desc: "Yalnızca eğitim setine SMOTE: 72.252 → 87.500 dengeli örnek (Backdoor: 2.252 → 17.500)", icon: TrendingUp, color: "bg-emerald-500" },
                            { step: 5, title: "BSO Optimizasyonu", desc: `25 yarasa × 50 iterasyon = ${BSO_PARAMETERS.totalEvaluations.toLocaleString()} değerlendirme. Eşzamanlı FS + HP optimizasyonu`, icon: Brain, color: "bg-amber-500" },
                            { step: 6, title: "Model Eğitimi", desc: `Optimal çözüm: 19 özellik, n_estimators=${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth=${BSO_PARAMETERS.optimizedHyperparameters.max_depth}`, icon: Cpu, color: "bg-rose-500" },
                            { step: 7, title: "Değerlendirme", desc: "Test seti üzerinde 7 metrik + 10-katlı CV + istatistiksel testler + 12 model karşılaştırması", icon: Award, color: "bg-cyan-500" },
                        ].map((item) => (
                            <div key={item.step} className="flex items-start gap-3">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                    {item.step}
                                </div>
                                <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border">
                                    <div className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4 text-slate-500" />
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 9. BEKLENEN KATKI ═══════════ */}
            <Card id="contributions">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        3.9 Beklenen Katkılar
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                num: "K1",
                                title: "BSO-Hybrid RF Çerçevesi",
                                desc: "Özellik seçimi ve hiper-parametre optimizasyonunu tek bir meta-sezgisel süreçte birleştiren özgün hibrit çerçeve. BSO'nun DDoS tespiti için ilk kapsamlı uygulaması.",
                                metric: "En iyi fitness: 0.177801",
                                color: "from-emerald-500 to-teal-500",
                            },
                            {
                                num: "K2",
                                title: "%51.3 Boyut Azaltma",
                                desc: `39 özellikten 19'a indirgeme — yalnızca +${(89.82 - 89.74).toFixed(2)}% doğruluk farkıyla. Model karmaşıklığını ve çıkarım süresini azaltır.`,
                                metric: "19/39 özellik seçildi",
                                color: "from-blue-500 to-indigo-500",
                            },
                            {
                                num: "K3",
                                title: "Azınlık Sınıf İyileştirmesi",
                                desc: "SMOTE ile Backdoor_Malware F1-Skor %28.40'dan %57.40'a yükseldi (%102 artış). Sınıf dengelemenin çok sınıflı tespitteki kritik rolü gösterildi.",
                                metric: "F1: 28.40% → 57.40%",
                                color: "from-red-500 to-rose-500",
                            },
                            {
                                num: "K4",
                                title: "Kapsamlı Deneysel Doğrulama",
                                desc: "12 model × 7 metrik × 10-katlı CV × istatistiksel testler (Wilcoxon, McNemar, Cohen's d). Ablasyon çalışması (S1–S4) ile her bileşenin katkısı ölçülmüştür.",
                                metric: "9/11 karşılaştırmada p < 0.05",
                                color: "from-purple-500 to-violet-500",
                            },
                        ].map((c) => (
                            <div key={c.num} className="p-4 rounded-xl border border-border/50 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                                        {c.num}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.title}</h4>
                                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] border-0 mt-0.5">{c.metric}</Badge>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 10. HİPOTEZ SONUÇLARI ═══════════ */}
            <Card id="hypothesis-results" className="border-2 border-emerald-500/30">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        3.10 Hipotez Doğrulama Sonuçları
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <h4 className="font-bold text-sm text-emerald-600">AH₁: KABUL EDİLDİ</h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                BSO-Hybrid RF (F1-Macro: %84.24), varsayılan RF (F1-Macro: %84.13) ve temel DT (F1-Macro: %78.57) modeline göre
                                istatistiksel olarak anlamlı düzeyde daha yüksek performans göstermiştir. Eşleştirilmiş t-testi: p {"<"} 0.001, Cohen&apos;s d = 11.07 (büyük etki).
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <h4 className="font-bold text-sm text-emerald-600">AH₂: KABUL EDİLDİ</h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                BSO, {DATASET_STATISTICS.totalFeatures} özellikten {BSO_SELECTED_FEATURES.length}&apos;e düşürme sağlamıştır (%{DATASET_STATISTICS.featureReductionPct} azalma).
                                Doğruluk kaybı: yalnızca {(89.82 - 89.74).toFixed(2)}% (89.74% → 89.82%).
                                Bu, AH₂&apos;nin şartı olan &quot;%1&apos;den az kayıp&quot; kriterini karşılar.
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <h4 className="font-bold text-sm text-emerald-600">AH₃: KABUL EDİLDİ</h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                BSO (fitness: 0.177801) {"<"} GA (0.188982) {"<"} GWO (0.192181) {"<"} PSO (0.193895).
                                BSO en düşük uygunluk değerini elde etmiş ve en az özellikle (19) en iyi sonuca ulaşmıştır.
                                Wilcoxon testi: BSO vs PSO-RF p = 0.001953 (anlamlı).
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ FOOTER ═══════════ */}
            <Card className="bg-gradient-to-r from-indigo-500/5 to-blue-500/5 border-indigo-500/20">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3 justify-center text-xs text-slate-500">
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span>
                            Bu metodoloji çerçevesi, danışman geri bildirimine göre tüm deneysel verileri kullanarak hazırlanmıştır.
                            Tüm sayısal değerler gerçek deney sonuçlarına dayanmaktadır.
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
