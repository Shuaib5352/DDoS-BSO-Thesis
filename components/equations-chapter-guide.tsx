"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Copy, Check, Search, Calculator, ChevronDown, ChevronRight } from "lucide-react"

// =============================================================================
// دليل المعادلات حسب الفصول — Equations Chapter Guide
// =============================================================================

interface Equation {
    id: string
    number: string
    latex: string
    description: string
    descriptionEN: string
    chapter: number
    section: string
    usage: string
}

const EQUATIONS: Equation[] = [
    // ─── Bölüm 2 · Kuramsal Çerçeve (Theoretical Framework) ────────────────
    {
        id: "eq-2-1", number: "Denklem 2.1", chapter: 2,
        section: "2.2 Makine Öğrenmesi Değerlendirme Metrikleri",
        latex: "Accuracy = \\frac{TP + TN}{TP + TN + FP + FN}",
        description: "Doğruluk — Toplam doğru tahminlerin toplam örneklere oranı",
        descriptionEN: "Accuracy — Ratio of correct predictions to total samples",
        usage: "Tüm modellerin temel performans karşılaştırması"
    },
    {
        id: "eq-2-2", number: "Denklem 2.2", chapter: 2,
        section: "2.2 Makine Öğrenmesi Değerlendirme Metrikleri",
        latex: "Precision_c = \\frac{TP_c}{TP_c + FP_c}",
        description: "Kesinlik — Sınıf c için doğru pozitif tahminlerin oranı",
        descriptionEN: "Precision — Ratio of true positives for class c",
        usage: "DDoS alarm doğruluğunun ölçülmesi"
    },
    {
        id: "eq-2-3", number: "Denklem 2.3", chapter: 2,
        section: "2.2 Makine Öğrenmesi Değerlendirme Metrikleri",
        latex: "Recall_c = \\frac{TP_c}{TP_c + FN_c}",
        description: "Duyarlılık (Recall) — Gerçek pozitiflerin yakalanma oranı",
        descriptionEN: "Recall — Proportion of actual positives correctly identified",
        usage: "Saldırı kaçırma oranının ölçülmesi"
    },
    {
        id: "eq-2-4", number: "Denklem 2.4", chapter: 2,
        section: "2.2 Makine Öğrenmesi Değerlendirme Metrikleri",
        latex: "F1_c = 2 \\times \\frac{Precision_c \\times Recall_c}{Precision_c + Recall_c}",
        description: "F1-Skor — Kesinlik ve duyarlılığın harmonik ortalaması",
        descriptionEN: "F1-Score — Harmonic mean of precision and recall",
        usage: "Dengesiz sınıflarda performans değerlendirmesi"
    },
    {
        id: "eq-2-5", number: "Denklem 2.5", chapter: 2,
        section: "2.2 Makine Öğrenmesi Değerlendirme Metrikleri",
        latex: "F1_{macro} = \\frac{1}{C} \\sum_{c=1}^{C} F1_c",
        description: "Makro F1-Skor — Tüm sınıfların F1 değerlerinin ağırlıksız ortalaması",
        descriptionEN: "Macro F1-Score — Unweighted average of per-class F1 scores",
        usage: "Sınıf dengesizliğine duyarlı genel performans ölçümü"
    },
    {
        id: "eq-2-6", number: "Denklem 2.6", chapter: 2,
        section: "2.2 Makine Öğrenmesi Değerlendirme Metrikleri",
        latex: "F1_{weighted} = \\sum_{c=1}^{C} w_c \\times F1_c, \\quad w_c = \\frac{n_c}{N}",
        description: "Ağırlıklı F1-Skor — Sınıf büyüklüğüne göre ağırlıklı F1 ortalaması",
        descriptionEN: "Weighted F1-Score — F1 average weighted by class size",
        usage: "Genel sınıflandırma performansının ölçülmesi"
    },
    {
        id: "eq-2-7", number: "Denklem 2.7", chapter: 2,
        section: "2.2 Makine Öğrenmesi Değerlendirme Metrikleri",
        latex: "MCC = \\frac{TP \\times TN - FP \\times FN}{\\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}",
        description: "Matthews Korelasyon Katsayısı — Dengesiz veri setleri için güvenilir metrik [-1, +1]",
        descriptionEN: "Matthews Correlation Coefficient — Reliable metric for imbalanced datasets",
        usage: "Çok sınıflı sınıflandırma kalitesinin doğrulanması"
    },
    {
        id: "eq-2-8", number: "Denklem 2.8", chapter: 2,
        section: "2.2 Makine Öğrenmesi Değerlendirme Metrikleri",
        latex: "FPR_c = \\frac{FP_c}{FP_c + TN_c}",
        description: "Yanlış Pozitif Oranı — ROC eğrisi için gerekli",
        descriptionEN: "False Positive Rate — Required for ROC curve",
        usage: "ROC-AUC hesaplaması"
    },
    {
        id: "eq-2-9", number: "Denklem 2.9", chapter: 2,
        section: "2.3 SMOTE — Sentetik Azınlık Aşırı Örnekleme",
        latex: "x_{new} = x_i + \\lambda \\times (x_{nn} - x_i), \\quad \\lambda \\in [0, 1]",
        description: "SMOTE sentetik örnek üretimi — k-NN tabanlı doğrusal interpolasyon (Chawla vd., 2002)",
        descriptionEN: "SMOTE synthetic sample generation — k-NN based linear interpolation",
        usage: "Backdoor_Malware azınlık sınıfının dengelenmesi (2.252 → 17.500)"
    },
    {
        id: "eq-2-10", number: "Denklem 2.10", chapter: 2,
        section: "2.4 Özellik Normalizasyonu",
        latex: "x_{norm} = \\frac{x - \\mu}{\\sigma}",
        description: "Z-score standartlaştırma (StandardScaler) — μ=0, σ=1",
        descriptionEN: "Z-score standardization (StandardScaler) — μ=0, σ=1",
        usage: "Tüm 39 özelliğin aynı ölçeğe getirilmesi"
    },

    // ─── Bölüm 3 · Araştırma Yöntemi (Research Methodology) ─────────────────
    {
        id: "eq-3-1", number: "Denklem 3.1", chapter: 3,
        section: "3.2 BSO Algoritması — Frekans Güncelleme",
        latex: "f_i = f_{min} + (f_{max} - f_{min}) \\times \\beta, \\quad \\beta \\in [0, 1]",
        description: "BSO frekans güncelleme denklemi — Arama uzayındaki hareket hızı",
        descriptionEN: "BSO frequency update — Movement speed in search space",
        usage: "Her iterasyonda yarasa hızının belirlenmesi"
    },
    {
        id: "eq-3-2", number: "Denklem 3.2", chapter: 3,
        section: "3.2 BSO Algoritması — Hız Güncelleme",
        latex: "v_i^{(t+1)} = v_i^{(t)} + (x_i^{(t)} - x_{best}) \\times f_i",
        description: "BSO hız güncelleme denklemi — En iyi çözüme doğru hareket",
        descriptionEN: "BSO velocity update — Movement toward best solution",
        usage: "Yarasanın arama uzayındaki yönlendirilmesi"
    },
    {
        id: "eq-3-3", number: "Denklem 3.3", chapter: 3,
        section: "3.2 BSO Algoritması — Konum Güncelleme",
        latex: "x_i^{(t+1)} = x_i^{(t)} + v_i^{(t+1)}",
        description: "BSO konum güncelleme denklemi — Yeni çözüm pozisyonu",
        descriptionEN: "BSO position update — New solution position",
        usage: "Yeni özellik/HP kombinasyonunun belirlenmesi"
    },
    {
        id: "eq-3-4", number: "Denklem 3.4", chapter: 3,
        section: "3.2 BSO Algoritması — Ses Yüksekliği Azaltma",
        latex: "A_i^{(t+1)} = \\alpha \\times A_i^{(t)}, \\quad \\alpha \\in (0, 1)",
        description: "Ses yüksekliği (loudness) azaltma — Başlangıç: A₀=0.95, α sönümleme katsayısı",
        descriptionEN: "Loudness decay — Initial: A₀=0.95, α damping coefficient",
        usage: "Keşif (exploration) → sömürü (exploitation) geçişi"
    },
    {
        id: "eq-3-5", number: "Denklem 3.5", chapter: 3,
        section: "3.2 BSO Algoritması — Darbe Oranı Artışı",
        latex: "r_i^{(t+1)} = r_i^{(0)} \\times (1 - e^{-\\gamma t})",
        description: "Darbe oranı (pulse rate) artışı — Başlangıç: r₀=0.5, γ artış katsayısı",
        descriptionEN: "Pulse rate increase — Initial: r₀=0.5, γ growth coefficient",
        usage: "Yerel arama yoğunluğunun artırılması"
    },
    {
        id: "eq-3-6", number: "Denklem 3.6", chapter: 3,
        section: "3.3 BSO-Hybrid RF — Çözüm Vektörü Kodlaması",
        latex: "\\vec{x}_i = [\\underbrace{b_1, b_2, \\ldots, b_{39}}_{\\text{Özellik seçimi} \\in \\{0,1\\}^{39}} \\;|\\; \\underbrace{n_{est}, d_{max}, s_{min}, f_{max}}_{\\text{HP ayarlama} \\in \\mathbb{R}^4}]",
        description: "BSO-Hybrid çözüm vektörü — 39 ikili + 4 sürekli boyut (toplam 43 boyut)",
        descriptionEN: "BSO-Hybrid solution vector — 39 binary + 4 continuous dimensions",
        usage: "Eşzamanlı özellik seçimi ve hiperparametre optimizasyonu"
    },
    {
        id: "eq-3-7", number: "Denklem 3.7", chapter: 3,
        section: "3.3 BSO-Hybrid RF — Amaç Fonksiyonu",
        latex: "f(\\vec{x}) = (1 - F1_{macro}(RF(X_{selected}, \\theta))) + \\alpha \\times \\frac{n_{selected}}{n_{total}}",
        description: "BSO fitness fonksiyonu — F1-Macro performansı + kompaktlık cezası (α=0.01)",
        descriptionEN: "BSO fitness function — F1-Macro performance + compactness penalty (α=0.01)",
        usage: "BSO optimizasyonunun temel hedef fonksiyonu"
    },
    {
        id: "eq-3-8", number: "Denklem 3.8", chapter: 3,
        section: "3.3 BSO-Hybrid RF — HP Parametre Aralıkları",
        latex: "n_{est} \\in [50, 400], \\; d_{max} \\in [5, 35], \\; s_{min} \\in [2, 15], \\; f_{max} \\in [0.3, 1.0]",
        description: "Random Forest hiperparametre arama aralıkları",
        descriptionEN: "Random Forest hyperparameter search ranges",
        usage: "BSO'nun optimize ettiği RF parametre sınırları"
    },
    {
        id: "eq-3-9", number: "Denklem 3.9", chapter: 3,
        section: "3.3 BSO-Hybrid RF — Formal Tanım",
        latex: "\\text{BSO-Hybrid RF} = \\underset{\\vec{x}}{\\arg\\min} \\; f(\\vec{x}) = BSO_{optimize}(RF(X_{selected}, \\theta_{optimal}))",
        description: "BSO-Hybrid RF formal optimizasyon tanımı",
        descriptionEN: "BSO-Hybrid RF formal optimization definition",
        usage: "Hibrit çerçevenin matematiksel tanımı"
    },

    // ─── Bölüm 4 · Bulgular ve Tartışma (Results & Discussion) ──────────────
    {
        id: "eq-4-1", number: "Denklem 4.1", chapter: 4,
        section: "4.3 İstatistiksel Anlamlılık Testleri",
        latex: "H_0: \\mu_{BSO-RF} = \\mu_{comparison}, \\quad H_1: \\mu_{BSO-RF} \\neq \\mu_{comparison}",
        description: "İkili t-testi hipotezleri — Boş ve alternatif hipotez",
        descriptionEN: "Paired t-test hypotheses — Null and alternative hypothesis",
        usage: "11 model ile ikili karşılaştırma"
    },
    {
        id: "eq-4-2", number: "Denklem 4.2", chapter: 4,
        section: "4.3 İstatistiksel Anlamlılık Testleri",
        latex: "t = \\frac{\\bar{d}}{s_d / \\sqrt{n}}, \\quad \\bar{d} = \\frac{1}{n} \\sum_{i=1}^{n} (x_{BSO,i} - x_{comp,i})",
        description: "Eşleştirilmiş t-testi istatistiği — Katlı farkların analizi",
        descriptionEN: "Paired t-test statistic — Analysis of fold differences",
        usage: "10-katlı CV sonuçlarının karşılaştırılması"
    },
    {
        id: "eq-4-3", number: "Denklem 4.3", chapter: 4,
        section: "4.3 İstatistiksel Anlamlılık Testleri",
        latex: "d = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_{pooled}}, \\quad s_{pooled} = \\sqrt{\\frac{s_1^2 + s_2^2}{2}}",
        description: "Cohen's d etki büyüklüğü — |d|<0.2 ihmal, 0.2–0.5 küçük, 0.5–0.8 orta, >0.8 büyük",
        descriptionEN: "Cohen's d effect size — Standardized mean difference",
        usage: "Farkların pratik anlamlılığının ölçülmesi"
    },
    {
        id: "eq-4-4", number: "Denklem 4.4", chapter: 4,
        section: "4.4 Güven Aralığı",
        latex: "CI_{95\\%} = \\bar{x} \\pm 1.96 \\times \\frac{\\sigma}{\\sqrt{n}}",
        description: "%95 güven aralığı — 10-katlı CV doğruluğu için",
        descriptionEN: "95% confidence interval for 10-fold CV accuracy",
        usage: "BSO-Hybrid RF: %89.47 ± 0.219"
    },
    {
        id: "eq-4-5", number: "Denklem 4.5", chapter: 4,
        section: "4.5 Optimizatör Yakınsama Analizi",
        latex: "\\Delta_{improve} = \\frac{f_{start} - f_{final}}{f_{start}} \\times 100\\%",
        description: "Fitness iyileştirme yüzdesi — Yakınsama performansı",
        descriptionEN: "Fitness improvement percentage — Convergence performance",
        usage: "BSO vs GA vs PSO vs GWO yakınsama karşılaştırması"
    },
]

// فصول
const CHAPTERS = [
    { num: 2, title: "Bölüm 2 — Kuramsal Çerçeve", titleEN: "Theoretical Framework", color: "bg-blue-500", count: 0 },
    { num: 3, title: "Bölüm 3 — Araştırma Yöntemi", titleEN: "Research Methodology", color: "bg-purple-500", count: 0 },
    { num: 4, title: "Bölüm 4 — Bulgular ve Tartışma", titleEN: "Results & Discussion", color: "bg-emerald-500", count: 0 },
]

CHAPTERS.forEach(ch => { ch.count = EQUATIONS.filter(e => e.chapter === ch.num).length })

export default function EquationsChapterGuide() {
    const [search, setSearch] = useState("")
    const [expandedChapters, setExpandedChapters] = useState<number[]>([2, 3, 4])
    const [copied, setCopied] = useState<string | null>(null)

    const toggleChapter = (num: number) => {
        setExpandedChapters(prev =>
            prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
        )
    }

    const filtered = EQUATIONS.filter(eq =>
        !search || [eq.number, eq.latex, eq.description, eq.descriptionEN, eq.section, eq.usage]
            .some(s => s.toLowerCase().includes(search.toLowerCase()))
    )

    const copyLatex = (eq: Equation) => {
        navigator.clipboard.writeText(`${eq.number}: $${eq.latex}$`)
        setCopied(eq.id)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30">
            <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Calculator className="h-6 w-6 text-amber-600" />
                        Denklem Dizini — Bölümlere Göre
                        <Badge variant="outline" className="ml-2 text-sm">{EQUATIONS.length} Denklem</Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {CHAPTERS.map(ch => (
                            <Badge key={ch.num} className={`${ch.color} text-white text-xs`}>
                                B{ch.num}: {ch.count}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="relative mt-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Denklem ara... (ör: fitness, SMOTE, Cohen, MCC)"
                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* LaTeX Guide */}
                <div className="mt-3 p-3 bg-amber-100/60 rounded-lg text-xs text-amber-800 space-y-1">
                    <p className="font-bold flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> Tezde Kullanım Kılavuzu:</p>
                    <p>• Her denklem <code className="bg-amber-200 px-1 rounded">Denklem X.Y</code> formatında numaralandırılmıştır</p>
                    <p>• LaTeX: <code className="bg-amber-200 px-1 rounded">\begin&#123;equation&#125; ... \label&#123;eq:3-7&#125; \end&#123;equation&#125;</code></p>
                    <p>• Referans: <code className="bg-amber-200 px-1 rounded">Denklem~\ref&#123;eq:3-7&#125;&apos;de tanımlanan BSO fitness fonksiyonu...</code></p>
                    <p>• Kopyala butonuna tıklayarak LaTeX kodunu doğrudan alabilirsiniz</p>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {CHAPTERS.map(ch => {
                    const chapterEqs = filtered.filter(e => e.chapter === ch.num)
                    if (chapterEqs.length === 0 && search) return null

                    const isExpanded = expandedChapters.includes(ch.num)

                    // Group by section
                    const sections: Record<string, Equation[]> = {}
                    chapterEqs.forEach(eq => {
                        if (!sections[eq.section]) sections[eq.section] = []
                        sections[eq.section].push(eq)
                    })

                    return (
                        <div key={ch.num} className="border rounded-xl overflow-hidden">
                            {/* Chapter Header */}
                            <button
                                onClick={() => toggleChapter(ch.num)}
                                className={`w-full flex items-center justify-between p-3 ${ch.color} text-white hover:opacity-90 transition`}
                            >
                                <div className="flex items-center gap-2">
                                    {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                    <span className="font-bold">{ch.title}</span>
                                    <span className="text-white/80 text-sm">({ch.titleEN})</span>
                                </div>
                                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                                    {chapterEqs.length} denklem
                                </Badge>
                            </button>

                            {/* Equations */}
                            {isExpanded && (
                                <div className="divide-y bg-white">
                                    {Object.entries(sections).map(([sectionName, eqs]) => (
                                        <div key={sectionName}>
                                            {/* Section subheader */}
                                            <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 border-b">
                                                📖 {sectionName}
                                            </div>
                                            {eqs.map(eq => (
                                                <div key={eq.id} className="px-4 py-3 hover:bg-amber-50/50 transition group">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 space-y-1.5">
                                                            {/* Number + Description */}
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <Badge className="bg-amber-500 text-white text-xs font-mono shrink-0">
                                                                    {eq.number}
                                                                </Badge>
                                                                <span className="text-sm font-medium text-gray-800">{eq.description}</span>
                                                            </div>
                                                            {/* LaTeX */}
                                                            <div className="font-mono text-xs bg-gray-100 rounded px-3 py-2 text-gray-700 overflow-x-auto">
                                                                <code>${eq.latex}$</code>
                                                            </div>
                                                            {/* Usage */}
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <span className="font-semibold text-amber-600">Kullanım:</span> {eq.usage}
                                                            </div>
                                                        </div>
                                                        {/* Copy button */}
                                                        <button
                                                            onClick={() => copyLatex(eq)}
                                                            className="opacity-0 group-hover:opacity-100 transition p-1.5 hover:bg-amber-100 rounded shrink-0"
                                                            title="LaTeX kopyala"
                                                        >
                                                            {copied === eq.id
                                                                ? <Check className="h-4 w-4 text-green-600" />
                                                                : <Copy className="h-4 w-4 text-gray-400" />
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Summary Table */}
                <div className="mt-4 border rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white p-3 text-sm font-bold">
                        📊 Özet — Denklem Dağılımı
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">Bölüm</th>
                                <th className="px-4 py-2 text-left font-semibold">Konu</th>
                                <th className="px-4 py-2 text-center font-semibold">Denklem Sayısı</th>
                                <th className="px-4 py-2 text-left font-semibold">Aralık</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr className="hover:bg-blue-50">
                                <td className="px-4 py-2 font-medium">Bölüm 2</td>
                                <td className="px-4 py-2 text-gray-600">Değerlendirme Metrikleri, SMOTE, Normalizasyon</td>
                                <td className="px-4 py-2 text-center font-bold text-blue-600">10</td>
                                <td className="px-4 py-2 text-gray-500 font-mono text-xs">Denklem 2.1 – 2.10</td>
                            </tr>
                            <tr className="hover:bg-purple-50">
                                <td className="px-4 py-2 font-medium">Bölüm 3</td>
                                <td className="px-4 py-2 text-gray-600">BSO Algoritması, Hibrit Çerçeve, Fitness Fonksiyonu</td>
                                <td className="px-4 py-2 text-center font-bold text-purple-600">9</td>
                                <td className="px-4 py-2 text-gray-500 font-mono text-xs">Denklem 3.1 – 3.9</td>
                            </tr>
                            <tr className="hover:bg-emerald-50">
                                <td className="px-4 py-2 font-medium">Bölüm 4</td>
                                <td className="px-4 py-2 text-gray-600">İstatistiksel Testler, Güven Aralığı, Yakınsama</td>
                                <td className="px-4 py-2 text-center font-bold text-emerald-600">5</td>
                                <td className="px-4 py-2 text-gray-500 font-mono text-xs">Denklem 4.1 – 4.5</td>
                            </tr>
                        </tbody>
                        <tfoot className="bg-amber-50 font-bold">
                            <tr>
                                <td className="px-4 py-2">TOPLAM</td>
                                <td className="px-4 py-2"></td>
                                <td className="px-4 py-2 text-center text-amber-700">24</td>
                                <td className="px-4 py-2 text-gray-500 font-mono text-xs">Denklem 2.1 – 4.5</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Placement Notes */}
                <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 text-sm space-y-2">
                    <p className="font-bold text-blue-800">📝 Teze Yerleştirme Notları:</p>
                    <ul className="space-y-1.5 text-gray-700">
                        <li><strong>Bölüm 2 (Kuramsal Çerçeve):</strong> Denklem 2.1–2.8 — değerlendirme metriklerini, Denklem 2.9 — SMOTE formülünü, Denklem 2.10 — normalizasyonu burada tanımlayın. Bu denklemler Bölüm 4&apos;te kullanılacak.</li>
                        <li><strong>Bölüm 3 (Araştırma Yöntemi):</strong> Denklem 3.1–3.5 — BSO algoritmasının matematiksel temelini, Denklem 3.6–3.9 — hibrit çerçeveyi burada açıklayın. Özellikle <strong>Denklem 3.7 (fitness fonksiyonu)</strong> en kritik denklemdir.</li>
                        <li><strong>Bölüm 4 (Bulgular):</strong> Denklem 4.1–4.3 — istatistiksel test formüllerini sonuçlarla birlikte, Denklem 4.4 — güven aralığını, Denklem 4.5 — yakınsama analizini burada sunun.</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
