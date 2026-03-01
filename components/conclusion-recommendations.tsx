"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Award, CheckCircle2, AlertTriangle, Target, TrendingUp,
    Lightbulb, BookOpen, Shield, Brain, Layers, Copy,
    ArrowRight, Cpu, Database, Zap, Activity,
    FileText, GitGraph, FlaskConical, Clock,
} from "lucide-react"
import { useState } from "react"
import {
    MODEL_RESULTS, DATASET_STATISTICS, BSO_PARAMETERS,
    BSO_SELECTED_FEATURES, CROSS_VALIDATION, STATISTICAL_TESTS,
    BSO_RF_PER_CLASS,
} from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   Clipboard helper
   ═══════════════════════════════════════════════════════════════ */
function useCopy() {
    const [copied, setCopied] = useState<string | null>(null)
    const copy = (id: string, text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }
    return { copied, copy }
}

/* ═══════════════════════════════════════════════════════════════
   CONCLUSION DATA
   ═══════════════════════════════════════════════════════════════ */

const KEY_FINDINGS = [
    {
        id: "B1",
        title: "BSO-Hybrid RF Çerçevesi Başarılı",
        detail: `Önerilen BSO-Hybrid RF çerçevesi, CICIoT2023 veri setinde %${MODEL_RESULTS[0].accuracy} doğruluk, %${MODEL_RESULTS[0].f1Macro} F1-Macro ve %${MODEL_RESULTS[0].aucRoc} AUC-ROC elde ederek 12 karşılaştırma modelinden 10'unu geride bırakmıştır.`,
        icon: Award,
        color: "emerald",
    },
    {
        id: "B2",
        title: "BSO İkili Rolünü Etkin Şekilde Gerçekleştirdi",
        detail: `BSO algoritması, tek bir optimizasyon sürecinde hem öznitelik seçimi (39→${BSO_SELECTED_FEATURES.length}, %${DATASET_STATISTICS.featureReductionPct} azaltma) hem de RF hiper-parametre ayarlamasını (n_estimators=${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth=${BSO_PARAMETERS.optimizedHyperparameters.max_depth}) başarıyla gerçekleştirmiştir.`,
        icon: Brain,
        color: "purple",
    },
    {
        id: "B3",
        title: "SMOTE Azınlık Sınıf Tespitinde Kritik",
        detail: `SMOTE uygulaması, Backdoor_Malware F1-Skor'unu %28,40'dan %57,40'a yükseltmiştir (+%102). SMOTE olmadan F1-Macro %72,86'ya düşmektedir — ablasyon çalışmasının en kritik bulgusu.`,
        icon: Layers,
        color: "red",
    },
    {
        id: "B4",
        title: "İstatistiksel Olarak Anlamlı Sonuçlar",
        detail: `10-katlı çapraz doğrulama (ort. %${CROSS_VALIDATION.mean.accuracy} ± ${CROSS_VALIDATION.std.accuracy}), Wilcoxon testi (${STATISTICAL_TESTS.filter(t => t.significant).length}/${STATISTICAL_TESTS.length} anlamlı), Cohen's d=${STATISTICAL_TESTS[0].cohenD.toFixed(2)} (büyük etki). Sonuçlar güvenilir ve tekrarlanabilirdir.`,
        icon: GitGraph,
        color: "blue",
    },
    {
        id: "B5",
        title: "Boyut Azaltma ile Performans Korunması",
        detail: `%${DATASET_STATISTICS.featureReductionPct} özellik azaltması ile doğruluk kaybı yalnızca +0,08%. Bu, BSO'nun gereksiz özellikleri etkili şekilde elimi ederken sınıflandırma gücünü koruduğunu gösterir.`,
        icon: Target,
        color: "amber",
    },
]

const CONTRIBUTIONS = [
    {
        num: "K1",
        title: "BSO-Hybrid RF Çerçevesi",
        text: "Yarasa Sürüsü Optimizasyonu ile eşzamanlı öznitelik seçimi ve hiper-parametre optimizasyonunu birleştiren özgün hibrit çerçeve tasarımı. BSO'nun DDoS tespiti için ilk kapsamlı uygulaması.",
        color: "from-emerald-500 to-teal-500",
    },
    {
        num: "K2",
        title: `%${DATASET_STATISTICS.featureReductionPct} Boyut Azaltma`,
        text: `${DATASET_STATISTICS.totalFeatures} öznitelikten ${BSO_SELECTED_FEATURES.length}'e indirgeme — yalnızca +0,08% doğruluk farkıyla. Model karmaşıklığını, hesaplama maliyetini ve aşırı uyum riskini azaltır.`,
        color: "from-blue-500 to-indigo-500",
    },
    {
        num: "K3",
        title: "Azınlık Sınıf İyileştirmesi",
        text: "SMOTE entegrasyonu ile Backdoor_Malware F1-Skor %28,40'dan %57,40'a yükseldi (%102 artış). Sınıf dengelemenin çok sınıflı tespitteki kritik rolü deneysel olarak kanıtlandı.",
        color: "from-red-500 to-rose-500",
    },
    {
        num: "K4",
        title: "Kapsamlı Deneysel Doğrulama",
        text: `12 model × 7 metrik × 10-katlı CV × istatistiksel testler (Wilcoxon, McNemar, Cohen's d). S1–S4 ablasyon senaryoları ile her bileşenin katkısı ölçülmüştür.`,
        color: "from-purple-500 to-violet-500",
    },
]

const LIMITATIONS = [
    {
        id: "L1",
        title: "Veri Seti Kısıtı",
        text: "Çalışma yalnızca CICIoT2023 veri seti üzerinde değerlendirilmiştir. Farklı ağ ortamları ve veri setlerinde (CSE-CIC-IDS2018, UNSW-NB15) genellenebilirlik test edilmemiştir.",
        severity: "medium",
    },
    {
        id: "L2",
        title: "Sınıf Sayısı",
        text: "Yalnızca 5 sınıf (4 DDoS + 1 benign) kullanılmıştır. Daha fazla saldırı türünün (ör. 33 alt sınıf) dahil edilmesi modelin genellenebilirliğini artırabilir.",
        severity: "medium",
    },
    {
        id: "L3",
        title: "Backdoor_Malware Düşük F1",
        text: `Backdoor_Malware F1-Skor (%${BSO_RF_PER_CLASS[0].f1Score}) diğer sınıflara göre düşük kalmaktadır. Bu, az örnek sayısı (2.252) ve öznitelik uzayındaki örtüşmeden kaynaklanmaktadır.`,
        severity: "high",
    },
    {
        id: "L4",
        title: "Gerçek Zamanlı Test Yapılamaması",
        text: "Model yalnızca çevrimdışı (offline) veri seti üzerinde değerlendirilmiştir. Gerçek zamanlı ağ trafiğinde performansı test edilmemiştir.",
        severity: "low",
    },
    {
        id: "L5",
        title: "Hesaplama Maliyeti",
        text: `BSO optimizasyonu ${BSO_PARAMETERS.totalEvaluations.toLocaleString()} uygunluk değerlendirmesi gerektirmektedir. Daha büyük veri setlerinde veya daha kompleks modellerde bu süre artabilir.`,
        severity: "low",
    },
]

const FUTURE_WORKS = [
    {
        id: "F1",
        title: "Derin Öğrenme Hibrit Modeli",
        text: "BSO optimizasyonunun CNN, LSTM veya Transformer tabanlı derin öğrenme modelleriyle birleştirilmesi. Özellikle zamansal ağ trafik kalıplarının öğrenilmesi için CNN-LSTM hibrit mimarisi.",
        priority: "high",
        icon: Cpu,
    },
    {
        id: "F2",
        title: "Çoklu Veri Seti Doğrulaması",
        text: "Önerilen çerçevenin CSE-CIC-IDS2018, UNSW-NB15, KDD Cup 99 ve NSL-KDD veri setlerinde test edilerek genellenebilirliğinin araştırılması.",
        priority: "high",
        icon: Database,
    },
    {
        id: "F3",
        title: "Gerçek Zamanlı Dağıtım",
        text: "BSO-Hybrid RF modelinin SDN (Software-Defined Networking) tabanlı gerçek zamanlı IDS çerçevesine entegrasyonu. Edge computing ortamında düşük gecikmeli tespit.",
        priority: "high",
        icon: Activity,
    },
    {
        id: "F4",
        title: "Transfer Öğrenme",
        text: "Bir ağ ortamında eğitilmiş modelin başka bir ağ ortamına aktarılması. Özellikle IoT cihaz çeşitliliğinin yüksek olduğu ortamlarda alan uyarlaması (domain adaptation).",
        priority: "medium",
        icon: ArrowRight,
    },
    {
        id: "F5",
        title: "Açıklanabilir Yapay Zeka (XAI)",
        text: "SHAP ve LIME yöntemleri ile BSO-Hybrid RF kararlarının açıklanması. Ağ güvenlik uzmanlarının model çıktılarını anlamlandırmasını kolaylaştırma.",
        priority: "medium",
        icon: Lightbulb,
    },
    {
        id: "F6",
        title: "Çoklu Meta-Sezgisel Karşılaştırma",
        text: "BSO'nun yanı sıra Balina Optimizasyonu (WOA), Harris Hawks Optimizasyonu (HHO) ve Deniz Kartalı Optimizasyonu (MRFO) ile sistematik karşılaştırma.",
        priority: "medium",
        icon: FlaskConical,
    },
    {
        id: "F7",
        title: "Federe Öğrenme",
        text: "IoT cihazlarının yerel verilerini paylaşmadan merkezi model eğitimi. Veri gizliliğini koruyarak dağıtık DDoS tespiti.",
        priority: "low",
        icon: Shield,
    },
]

/* ═══════════════════════════════════════════════════════════════
   COLOR HELPERS
   ═══════════════════════════════════════════════════════════════ */
const colorMap: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
    purple: "text-purple-600 bg-purple-500/10 border-purple-500/30",
    red: "text-red-600 bg-red-500/10 border-red-500/30",
    blue: "text-blue-600 bg-blue-500/10 border-blue-500/30",
    amber: "text-amber-600 bg-amber-500/10 border-amber-500/30",
}

const severityMap: Record<string, { label: string; color: string }> = {
    high: { label: "Yüksek", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
    medium: { label: "Orta", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
    low: { label: "Düşük", color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
}

const priorityMap: Record<string, { label: string; color: string }> = {
    high: { label: "Yüksek Öncelik", color: "bg-red-600" },
    medium: { label: "Orta Öncelik", color: "bg-amber-600" },
    low: { label: "Düşük Öncelik", color: "bg-green-600" },
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ConclusionRecommendations() {
    const { copied, copy } = useCopy()

    const copyAllText = () => {
        const text = `BÖLÜM 5: SONUÇ VE ÖNERİLER

5.1 Sonuç

Bu tez, dinamik ağ ortamlarında DDoS saldırılarının daha etkili tespiti için Yarasa Sürüsü Optimizasyonu (BSO) tabanlı bir hibrit makine öğrenmesi çerçevesi tasarlamış, uygulamış ve kapsamlı deneysel doğrulama ile değerlendirmiştir. CICIoT2023 veri seti üzerinde gerçekleştirilen deneyler aşağıdaki temel bulguları ortaya koymuştur:

${KEY_FINDINGS.map(f => `${f.id}. ${f.title}: ${f.detail}`).join("\n\n")}

5.2 Tezin Katkıları

${CONTRIBUTIONS.map(c => `${c.num}. ${c.title}: ${c.text}`).join("\n\n")}

5.3 Kısıtlamalar

${LIMITATIONS.map(l => `${l.id}. ${l.title}: ${l.text}`).join("\n\n")}

5.4 Gelecek Çalışma Önerileri

${FUTURE_WORKS.map(f => `${f.id}. ${f.title}: ${f.text}`).join("\n\n")}

5.5 Kapanış

Sonuç olarak, BSO-Hybrid RF çerçevesi, meta-sezgisel optimizasyon ile makine öğrenmesi sınıflandırmasını etkili bir şekilde birleştirerek DDoS tespit performansını iyileştirmiştir. Özellik seçimi, hiper-parametre optimizasyonu ve sınıf dengelemenin birleşik etkisi, çok sınıflı DDoS tespitinde önemli iyileştirmeler sağlamıştır. Bu çalışma, gelecekteki araştırmalar için sağlam bir temel oluşturmakta ve önerilen çerçevenin gerçek dünya ağ güvenlik sistemlerine uyarlanması için bir yol haritası sunmaktadır.`

        copy("all", text)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-rose-500/30 bg-gradient-to-r from-rose-500/5 via-background to-pink-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-500/10 rounded-lg">
                                <BookOpen className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Bölüm 5: Sonuç ve Öneriler</CardTitle>
                                <CardDescription>
                                    Tezin temel bulguları, katkılar, kısıtlamalar ve gelecek çalışma önerileri
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-rose-600 text-white">Bölüm 5</Badge>
                            <Button variant="outline" size="sm" className="text-xs" onClick={copyAllText}>
                                {copied === "all" ? <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />}
                                Tüm Bölümü Kopyala
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* ═══════════ 5.1 SONUÇ ═══════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        5.1 Sonuç
                    </CardTitle>
                    <CardDescription>Araştırmanın temel bulguları</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        Bu tez, dinamik ağ ortamlarında DDoS saldırılarının daha etkili tespiti için Yarasa Sürüsü Optimizasyonu (BSO)
                        tabanlı bir hibrit makine öğrenmesi çerçevesi tasarlamış, uygulamış ve kapsamlı deneysel doğrulama ile değerlendirmiştir.
                        CICIoT2023 veri seti üzerinde gerçekleştirilen deneyler aşağıdaki temel bulguları ortaya koymuştur:
                    </div>

                    <div className="space-y-3">
                        {KEY_FINDINGS.map((f) => {
                            const Icon = f.icon
                            const colors = colorMap[f.color] || colorMap.blue
                            return (
                                <div key={f.id} className={`p-4 rounded-xl border ${colors}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-sm flex-shrink-0">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-[10px] font-mono">{f.id}</Badge>
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{f.title}</h4>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.detail}</p>
                                        </div>
                                        <Button
                                            variant="ghost" size="sm" className="h-6 px-1.5 flex-shrink-0"
                                            onClick={() => copy(f.id, `${f.title}: ${f.detail}`)}
                                        >
                                            {copied === f.id ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Numerical Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {[
                            { k: "Doğruluk", v: `%${MODEL_RESULTS[0].accuracy}`, sub: "BSO-Hybrid RF" },
                            { k: "F1-Macro", v: `%${MODEL_RESULTS[0].f1Macro}`, sub: "Sınıf-dengeli" },
                            { k: "Boyut Azaltma", v: `%${DATASET_STATISTICS.featureReductionPct}`, sub: `39→${BSO_SELECTED_FEATURES.length}` },
                            { k: "CV Kararlılık", v: `±${CROSS_VALIDATION.std.accuracy}`, sub: "10-katlı" },
                        ].map((m) => (
                            <div key={m.k} className="p-3 rounded-xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border text-center">
                                <div className="text-xl font-black text-slate-900 dark:text-white">{m.v}</div>
                                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mt-1">{m.k}</div>
                                <div className="text-[9px] text-slate-400">{m.sub}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 5.2 KATKILAR ═══════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        5.2 Tezin Katkıları
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {CONTRIBUTIONS.map((c) => (
                            <div key={c.num} className="p-4 rounded-xl border border-border/50 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                                        {c.num}
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{c.title}</h4>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">{c.text}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ═══════════ 5.3 KISITLAMALAR ═══════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        5.3 Kısıtlamalar
                    </CardTitle>
                    <CardDescription>
                        Araştırmanın sınırlılıkları ve dikkat edilmesi gereken noktalar
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {LIMITATIONS.map((l) => {
                        const sev = severityMap[l.severity]
                        return (
                            <div key={l.id} className="p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-[10px] font-mono">{l.id}</Badge>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{l.title}</h4>
                                            <Badge className={`text-[9px] border-0 ${sev.color}`}>{sev.label}</Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{l.text}</p>
                                    </div>
                                    <Button
                                        variant="ghost" size="sm" className="h-6 px-1.5 flex-shrink-0"
                                        onClick={() => copy(l.id, `${l.title}: ${l.text}`)}
                                    >
                                        {copied === l.id ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            {/* ═══════════ 5.4 GELECEK ÇALIŞMA ═══════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        5.4 Gelecek Çalışma Önerileri
                    </CardTitle>
                    <CardDescription>
                        Bu araştırmanın genişletilebileceği yönler
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {FUTURE_WORKS.map((fw) => {
                        const FWIcon = fw.icon
                        const prio = priorityMap[fw.priority]
                        return (
                            <div key={fw.id} className="p-4 rounded-xl border border-border/50 hover:shadow-md transition-all">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                                        <FWIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <Badge variant="outline" className="text-[10px] font-mono">{fw.id}</Badge>
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{fw.title}</h4>
                                            <Badge className={`text-[9px] text-white border-0 ${prio.color}`}>{prio.label}</Badge>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{fw.text}</p>
                                    </div>
                                    <Button
                                        variant="ghost" size="sm" className="h-6 px-1.5 flex-shrink-0"
                                        onClick={() => copy(fw.id, `${fw.title}: ${fw.text}`)}
                                    >
                                        {copied === fw.id ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            {/* ═══════════ 5.5 KAPANIŞ ═══════════ */}
            <Card className="border-2 border-emerald-500/30">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        5.5 Kapanış
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-5 bg-emerald-500/5 rounded-xl border border-emerald-500/30 text-sm leading-relaxed text-slate-700 dark:text-slate-300 relative">
                        <p className="mb-3">
                            Sonuç olarak, BSO-Hybrid RF çerçevesi, meta-sezgisel optimizasyon ile makine öğrenmesi sınıflandırmasını
                            etkili bir şekilde birleştirerek DDoS tespit performansını iyileştirmiştir. Özellik seçimi, hiper-parametre
                            optimizasyonu ve sınıf dengelemenin birleşik etkisi, çok sınıflı DDoS tespitinde önemli iyileştirmeler sağlamıştır.
                        </p>
                        <p className="mb-3">
                            S1–S4 ablasyon senaryoları, her bileşenin ayrı katkısını ölçülebilir düzeyde ortaya koymuştur: SMOTE (F1-Macro: +%11,38),
                            BSO HP optimizasyonu (+%1,89) ve BSO özellik seçimi (%{DATASET_STATISTICS.featureReductionPct} boyut azaltma, +%0,08 doğruluk).
                        </p>
                        <p>
                            Bu çalışma, gelecekteki araştırmalar için sağlam bir temel oluşturmakta ve önerilen çerçevenin gerçek dünya ağ güvenlik
                            sistemlerine uyarlanması için bir yol haritası sunmaktadır. Özellikle derin öğrenme entegrasyonu, gerçek zamanlı dağıtım ve
                            açıklanabilir yapay zeka yöntemleri ile birleştirme, gelecek çalışmaların en umut verici yönleridir.
                        </p>
                        <Button
                            variant="ghost" size="sm"
                            className="absolute top-2 right-2 h-6 px-1.5"
                            onClick={() => copy("closing", "Sonuç olarak, BSO-Hybrid RF çerçevesi, meta-sezgisel optimizasyon ile makine öğrenmesi sınıflandırmasını etkili bir şekilde birleştirerek DDoS tespit performansını iyileştirmiştir...")}
                        >
                            {copied === "closing" ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <Card className="bg-gradient-to-r from-rose-500/5 to-pink-500/5 border-rose-500/20">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3 justify-center text-xs text-slate-500">
                        <Shield className="w-4 h-4 text-rose-500" />
                        <span>
                            Bölüm 5 — Tüm verileri gerçek deney sonuçlarına dayanmaktadır. Word dosyasına doğrudan kopyalanabilir.
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
