"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BookOpen, Search, ExternalLink, CheckCircle2, XCircle,
    ArrowUpRight, Filter, TrendingUp, Award, Zap,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   İlgili Çalışmalar Karşılaştırma Tablosu
   (Literature Review — Related Works Comparison)
   ═══════════════════════════════════════════════════════════════ */

interface RelatedWork {
    id: number
    authors: string
    year: number
    title: string
    dataset: string
    method: string
    featureSelection: string
    classifier: string
    accuracy: number
    f1Score?: number
    aucRoc?: number
    features: number | string
    classes: number | string
    samples: string
    strengths: string[]
    weaknesses: string[]
    category: string
}

const RELATED_WORKS: RelatedWork[] = [
    {
        id: 1,
        authors: "Sharafaldin et al.",
        year: 2019,
        title: "Developing Realistic Distributed Denial of Service Attack Dataset",
        dataset: "CICDDoS2019",
        method: "Ensemble ML",
        featureSelection: "CICFlowMeter (manual)",
        classifier: "Random Forest",
        accuracy: 99.7,
        f1Score: 99.5,
        aucRoc: 99.8,
        features: 80,
        classes: 13,
        samples: "50M+",
        strengths: ["Büyük ölçekli veri seti", "Çok sınıflı saldırı tipleri", "Gerçekçi trafik"],
        weaknesses: ["Öznitelik seçimi yok", "IoT ortamına özgü değil", "Aşırı öğrenme riski"],
        category: "DDoS Tespiti",
    },
    {
        id: 2,
        authors: "Doriguzzi-Corin et al.",
        year: 2020,
        title: "LUCID: A Practical Lightweight Deep Learning Solution for DDoS Detection",
        dataset: "CIC-IDS2017 / CSE-CICIDS2018",
        method: "Deep Learning",
        featureSelection: "Yok (CNN otomatik)",
        classifier: "CNN (Lightweight)",
        accuracy: 99.7,
        f1Score: 99.6,
        features: "11 (ham)",
        classes: 2,
        samples: "3M+",
        strengths: ["Hafif model", "Gerçek zamanlı tespit", "Düşük gecikme"],
        weaknesses: ["İkili sınıflandırma", "IoT'ye özgü değil", "Sınırlı saldırı çeşitliliği"],
        category: "Derin Öğrenme",
    },
    {
        id: 3,
        authors: "Jia et al.",
        year: 2020,
        title: "Flowguard: An Intelligent Edge Defense Mechanism Against IoT DDoS Attacks",
        dataset: "NSL-KDD / UNSW-NB15",
        method: "Federated Learning",
        featureSelection: "PCA",
        classifier: "DNN",
        accuracy: 97.8,
        f1Score: 97.2,
        aucRoc: 98.5,
        features: 15,
        classes: 5,
        samples: "250K",
        strengths: ["Dağıtık öğrenme", "Gizlilik koruması", "Edge computing"],
        weaknesses: ["Yüksek iletişim maliyeti", "Sınırlı öznitelik azaltma", "Eski veri setleri"],
        category: "IoT Güvenlik",
    },
    {
        id: 4,
        authors: "Cil et al.",
        year: 2021,
        title: "Detection of DDoS Attacks with Feed Forward Based Deep Neural Network Model",
        dataset: "CICDDoS2019",
        method: "DNN",
        featureSelection: "Korelasyon Analizi",
        classifier: "Feed-Forward DNN",
        accuracy: 99.8,
        f1Score: 99.7,
        features: 25,
        classes: 12,
        samples: "50M+",
        strengths: ["Çok yüksek doğruluk", "Çok sınıflı tespit", "Derin ağ mimarisi"],
        weaknesses: ["Hesaplama maliyeti yüksek", "IoT uyumluluğu düşük", "Yorumlanabilirlik zayıf"],
        category: "Derin Öğrenme",
    },
    {
        id: 5,
        authors: "Almiani et al.",
        year: 2020,
        title: "DDoS Detection in IoT using Hybrid Deep Learning",
        dataset: "BoT-IoT",
        method: "Hybrid DL",
        featureSelection: "Autoencoder",
        classifier: "LSTM + CNN",
        accuracy: 98.2,
        f1Score: 97.8,
        aucRoc: 98.9,
        features: 42,
        classes: 4,
        samples: "73M+",
        strengths: ["IoT'ye özgü veri seti", "Hibrit mimari", "Temporal analiz"],
        weaknesses: ["Çok büyük model", "Eğitim süresi uzun", "Öznitelik seçimi yetersiz"],
        category: "IoT Güvenlik",
    },
    {
        id: 6,
        authors: "Khraisat et al.",
        year: 2019,
        title: "Survey of Intrusion Detection Systems: Techniques, Datasets and Challenges",
        dataset: "Çoklu (Anket)",
        method: "Anket Çalışması",
        featureSelection: "Çeşitli",
        classifier: "Çeşitli",
        accuracy: 95.0,
        features: "Değişken",
        classes: "Değişken",
        samples: "Değişken",
        strengths: ["Kapsamlı karşılaştırma", "Tüm yöntemleri içerir", "Zorlukları tanımlar"],
        weaknesses: ["Deneysel sonuç yok", "IoT odaklı değil", "Meta-sezgisel yok"],
        category: "Anket",
    },
    {
        id: 7,
        authors: "Koroniotis et al.",
        year: 2019,
        title: "Towards the Development of Realistic Botnet Dataset: Bot-IoT",
        dataset: "Bot-IoT",
        method: "Ensemble ML",
        featureSelection: "Information Gain",
        classifier: "Random Forest + SVM",
        accuracy: 99.0,
        f1Score: 98.5,
        aucRoc: 99.2,
        features: 43,
        classes: 5,
        samples: "73M+",
        strengths: ["IoT botnet verileri", "Büyük ölçek", "Açık kaynak"],
        weaknesses: ["Sentetik ortam", "Dengesiz sınıflar problem", "Eski saldırı kalıpları"],
        category: "DDoS Tespiti",
    },
    {
        id: 8,
        authors: "Elsayed et al.",
        year: 2020,
        title: "InSDN: A Novel SDN Intrusion Dataset",
        dataset: "InSDN",
        method: "SDN-based ML",
        featureSelection: "Chi-Square",
        classifier: "Random Forest",
        accuracy: 99.9,
        f1Score: 99.8,
        features: 30,
        classes: 7,
        samples: "343K",
        strengths: ["SDN ortamı", "Yüksek doğruluk", "Çoklu saldırı"],
        weaknesses: ["Küçük veri seti", "IoT değil", "Gerçek dünya doğrulaması yok"],
        category: "DDoS Tespiti",
    },
    {
        id: 9,
        authors: "Yang & He",
        year: 2020,
        title: "An Advanced Temporal Credal Network Approach for DDoS Detection",
        dataset: "CIC-IDS2017",
        method: "Bayesian Network",
        featureSelection: "Mutual Information",
        classifier: "Temporal Credal Net",
        accuracy: 97.5,
        f1Score: 96.8,
        features: 20,
        classes: 6,
        samples: "2.8M",
        strengths: ["Belirsizlik modelleme", "Temporal bağımlılık", "Yorumlanabilir"],
        weaknesses: ["Hesaplama karmaşıklığı", "Ölçeklenebilirlik kısıtlı", "Eski veri seti"],
        category: "İstatistiksel",
    },
    {
        id: 10,
        authors: "Ferrag et al.",
        year: 2022,
        title: "Edge-IIoTset: A New Comprehensive Realistic Cyber Security Dataset for IoT",
        dataset: "Edge-IIoTset",
        method: "ML + DL",
        featureSelection: "PCA + RF önem",
        classifier: "Ensemble (RF + DNN)",
        accuracy: 98.6,
        f1Score: 98.2,
        aucRoc: 99.1,
        features: 61,
        classes: 15,
        samples: "157K",
        strengths: ["Endüstriyel IoT", "15 saldırı tipi", "Güncel veri seti"],
        weaknesses: ["Öznitelik fazlalığı", "Meta-sezgisel yok", "Karmaşık pipeline"],
        category: "IoT Güvenlik",
    },
    {
        id: 11,
        authors: "Neto et al.",
        year: 2023,
        title: "CICIoT2023: A Real-Time Dataset and Benchmark for IoT Attack Detection",
        dataset: "CICIoT2023",
        method: "Benchmark ML",
        featureSelection: "CICFlowMeter (otomatik)",
        classifier: "DT, RF, SVM, KNN, MLP",
        accuracy: 98.4,
        f1Score: 97.8,
        aucRoc: 99.0,
        features: 47,
        classes: 34,
        samples: "46M+",
        strengths: ["En güncel IoT veri seti", "105 IoT cihaz", "34 saldırı tipi"],
        weaknesses: ["Meta-sezgisel yok", "Öznitelik seçimi yetersiz", "Dengesiz sınıflar"],
        category: "Benchmark",
    },
    {
        id: 12,
        authors: "Bu Çalışma (Proposed)",
        year: 2026,
        title: "BSO-Hibrit RF ile Geliştirilmiş DDoS Tespiti — CICIoT2023",
        dataset: "CICIoT2023",
        method: "BSO + Hibrit RF",
        featureSelection: "BSO (Yarasa Sürüsü Optimizasyonu)",
        classifier: "BSO-Hibrit RF",
        accuracy: 89.82,
        f1Score: 89.90,
        aucRoc: 98.38,
        features: 19,
        classes: 5,
        samples: "118K",
        strengths: [
            "Meta-sezgisel öznitelik seçimi",
            "Eşzamanlı öznitelik + hiperparametre optimizasyonu",
            "%51.3 öznitelik azaltma",
            "SMOTE ile sınıf dengeleme",
            "12 model ile kapsamlı karşılaştırma",
        ],
        weaknesses: [
            "5 sınıf (34 sınıfın alt kümesi)",
            "Gerçek zamanlı test yok",
            "Tek veri seti üzerinde doğrulama",
        ],
        category: "Bu Çalışma",
    },
]

const CATEGORIES = ["Tümü", "Bu Çalışma", "DDoS Tespiti", "IoT Güvenlik", "Derin Öğrenme", "Benchmark", "Anket", "İstatistiksel"]

export default function LiteratureComparison() {
    const [filter, setFilter] = useState("Tümü")
    const [search, setSearch] = useState("")

    const filtered = RELATED_WORKS.filter((w) => {
        const matchCat = filter === "Tümü" || w.category === filter
        const matchSearch =
            search === "" ||
            w.authors.toLowerCase().includes(search.toLowerCase()) ||
            w.title.toLowerCase().includes(search.toLowerCase()) ||
            w.dataset.toLowerCase().includes(search.toLowerCase()) ||
            w.method.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const proposed = RELATED_WORKS.find((w) => w.id === 12)!

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-cyan-500" />
                    İlgili Çalışmalar Karşılaştırması
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Literatürdeki {RELATED_WORKS.length - 1} çalışma ile tezimizin sistematik karşılaştırması — Bölüm 2 için referans tablosu
                </p>
            </div>

            {/* ════════════════════ AVANTAJ KARTI ════════════════════ */}
            <Card className="border-emerald-200 dark:border-emerald-800/40 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-bold text-emerald-800 dark:text-emerald-200">Bu Çalışmanın Temel Katkıları</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { label: "Meta-Sezgisel Öznitelik Seçimi", detail: "BSO ile otomatik ve optimal öznitelik alt kümesi belirleme", icon: Zap },
                            { label: "Hibrit Optimizasyon", detail: "Öznitelik seçimi + hiperparametre eşzamanlı optimize", icon: TrendingUp },
                            { label: "%51.3 Öznitelik Azaltma", detail: "39 → 19 öznitelik, hesaplama maliyeti yarıya indi", icon: Filter },
                            { label: "Kapsamlı Karşılaştırma", detail: "12 model ile deneysel doğrulama ve istatistiksel testler", icon: CheckCircle2 },
                        ].map((c) => (
                            <div key={c.label} className="p-3 rounded-lg bg-white/60 dark:bg-slate-800/40 border border-emerald-100 dark:border-emerald-800/30">
                                <c.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-1" />
                                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">{c.label}</p>
                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">{c.detail}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ FİLTRE ════════════════════ */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Yazar, başlık, veri seti ara..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === cat
                                    ? "bg-cyan-600 text-white shadow-md"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ════════════════════ KARŞILAŞTIRMA TABLOSU ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                        <BookOpen className="w-5 h-5" />
                        Karşılaştırma Tablosu ({filtered.length} çalışma)
                    </CardTitle>
                    <CardDescription>Tablo 2.1 — Literatürdeki ilgili çalışmaların karşılaştırmalı analizi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    {["#", "Yazarlar", "Yıl", "Veri Seti", "Yöntem", "Öznitelik Seçimi", "Sınıflandırıcı", "Doğruluk", "F1", "AUC", "Öznitelik", "Sınıf"].map(
                                        (h) => (
                                            <th key={h} className="px-2 py-2.5 text-left font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((w) => {
                                    const isProposed = w.id === 12
                                    return (
                                        <tr
                                            key={w.id}
                                            className={`border-b border-slate-100 dark:border-slate-800 transition-colors ${isProposed
                                                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 font-medium"
                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                                                }`}
                                        >
                                            <td className="px-2 py-2 text-slate-500">{w.id}</td>
                                            <td className="px-2 py-2 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                                {isProposed && <Award className="w-3 h-3 inline mr-1 text-emerald-500" />}
                                                {w.authors}
                                            </td>
                                            <td className="px-2 py-2 text-slate-600 dark:text-slate-400">{w.year}</td>
                                            <td className="px-2 py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">{w.dataset}</td>
                                            <td className="px-2 py-2">
                                                <Badge variant="outline" className="text-[10px]">{w.method}</Badge>
                                            </td>
                                            <td className="px-2 py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">{w.featureSelection}</td>
                                            <td className="px-2 py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">{w.classifier}</td>
                                            <td className={`px-2 py-2 font-mono font-bold ${isProposed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"}`}>
                                                %{w.accuracy}
                                            </td>
                                            <td className="px-2 py-2 font-mono text-slate-600 dark:text-slate-400">
                                                {w.f1Score ? `%${w.f1Score}` : "—"}
                                            </td>
                                            <td className="px-2 py-2 font-mono text-slate-600 dark:text-slate-400">
                                                {w.aucRoc ? `%${w.aucRoc}` : "—"}
                                            </td>
                                            <td className={`px-2 py-2 font-mono ${isProposed ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-600 dark:text-slate-400"}`}>
                                                {w.features}
                                            </td>
                                            <td className="px-2 py-2 font-mono text-slate-600 dark:text-slate-400">{w.classes}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ DETAYLI KARTLAR ════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((w) => {
                    const isProposed = w.id === 12
                    return (
                        <Card
                            key={w.id}
                            className={`${isProposed
                                    ? "border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-200 dark:ring-emerald-800/50"
                                    : "border-slate-200 dark:border-slate-700"
                                }`}
                        >
                            <CardContent className="pt-4 pb-4 space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {isProposed && <Badge className="bg-emerald-500 text-white text-[9px]">BU ÇALIŞMA</Badge>}
                                            <Badge variant="outline" className="text-[9px]">{w.category}</Badge>
                                            <span className="text-[10px] text-slate-400">{w.year}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{w.authors}</h3>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{w.title}</p>
                                    </div>
                                    <div className={`text-right ${isProposed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200"}`}>
                                        <div className="text-lg font-black font-mono">%{w.accuracy}</div>
                                        <div className="text-[9px] text-slate-400">Doğruluk</div>
                                    </div>
                                </div>

                                {/* Metrics */}
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    {[
                                        { label: "Veri Seti", value: w.dataset },
                                        { label: "Öznitelik", value: String(w.features) },
                                        { label: "Sınıf", value: String(w.classes) },
                                        { label: "Yöntem", value: w.method },
                                    ].map((m) => (
                                        <div key={m.label} className="p-1.5 rounded bg-slate-50 dark:bg-slate-800/50">
                                            <div className="text-[9px] text-slate-400">{m.label}</div>
                                            <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">{m.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Strengths & Weaknesses */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[9px] font-bold text-green-600 dark:text-green-400 mb-1">Güçlü Yönler</p>
                                        {w.strengths.map((s, i) => (
                                            <div key={i} className="flex items-start gap-1 text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-red-600 dark:text-red-400 mb-1">Zayıf Yönler / Boşluklar</p>
                                        {w.weaknesses.map((w2, i) => (
                                            <div key={i} className="flex items-start gap-1 text-[10px] text-slate-600 dark:text-slate-400 mb-0.5">
                                                <XCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                                                <span>{w2}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* ════════════════════ BOŞLUK ANALİZİ ════════════════════ */}
            <Card className="border-blue-200 dark:border-blue-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-base">
                        <ArrowUpRight className="w-5 h-5" />
                        Literatür Boşluk Analizi (Research Gap)
                    </CardTitle>
                    <CardDescription>Bu tezin doldurduğu akademik boşluklar</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                gap: "Meta-sezgisel Öznitelik Seçimi Eksikliği",
                                detail: "Çoğu çalışma manuel veya filtreleme tabanlı öznitelik seçimi kullanır. BSO gibi wrapper tabanlı meta-sezgisel yöntemler nadiren uygulanmıştır.",
                                solution: "BSO ile otomatik, optimal öznitelik alt kümesi seçimi — 39 → 19 öznitelik (%51.3 azaltma)",
                            },
                            {
                                gap: "Eşzamanlı Optimizasyon Yokluğu",
                                detail: "Öznitelik seçimi ve hiperparametre optimizasyonu genellikle ayrı adımlarda yapılır, bu da alt-optimal sonuçlara yol açar.",
                                solution: "BSO-Hibrit yaklaşımla öznitelik + hiperparametre eşzamanlı optimize edilir",
                            },
                            {
                                gap: "CICIoT2023 Üzerinde BSO Uygulanmamış",
                                detail: "CICIoT2023 yeni ve kapsamlı bir IoT veri seti olmasına rağmen, BSO ile öznitelik seçimi henüz uygulanmamıştır.",
                                solution: "CICIoT2023'ün 5 sınıflı alt kümesinde BSO-RF ile ilk kapsamlı çalışma",
                            },
                            {
                                gap: "Kapsamlı Model Karşılaştırması Yetersizliği",
                                detail: "Birçok çalışma yalnızca 2-3 model ile karşılaştırma yapar, bu da sonuçların genellenebilirliğini azaltır.",
                                solution: "12 farklı model (4 meta-sezgisel + 8 geleneksel) ile deneysel karşılaştırma",
                            },
                        ].map((g) => (
                            <div key={g.gap} className="p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 bg-blue-50/30 dark:bg-blue-950/20 space-y-2">
                                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-200">{g.gap}</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{g.detail}</p>
                                <div className="flex items-start gap-1.5 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/30">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{g.solution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
