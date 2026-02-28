"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Copy, CheckCircle2 } from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   Sembol ve Kısaltma Tablosu (Glossary / Notation Table)
   ═══════════════════════════════════════════════════════════════ */

interface GlossaryItem {
    symbol: string
    turkishName: string
    englishName: string
    description: string
    category: string
    firstUse: string
}

const GLOSSARY: GlossaryItem[] = [
    /* ─── Kısaltmalar (Abbreviations) ─── */
    { symbol: "DDoS", turkishName: "Dağıtık Hizmet Engelleme", englishName: "Distributed Denial of Service", description: "Birden fazla kaynaktan hedefe yoğun trafik göndererek hizmeti engelleme saldırısı", category: "Kısaltma", firstUse: "Bölüm 1" },
    { symbol: "IoT", turkishName: "Nesnelerin İnterneti", englishName: "Internet of Things", description: "İnternete bağlı fiziksel cihaz ağı", category: "Kısaltma", firstUse: "Bölüm 1" },
    { symbol: "BSO", turkishName: "Yarasa Sürüsü Optimizasyonu", englishName: "Bat Swarm Optimization", description: "Yarasaların ekolokasyon davranışına dayanan meta-sezgisel optimizasyon algoritması", category: "Kısaltma", firstUse: "Bölüm 1" },
    { symbol: "RF", turkishName: "Rastgele Orman", englishName: "Random Forest", description: "Birden fazla karar ağacının çoğunluk oylaması ile sınıflandırma yapan ensemble yöntem", category: "Kısaltma", firstUse: "Bölüm 1" },
    { symbol: "BSO-RF", turkishName: "BSO-Hibrit Rastgele Orman", englishName: "BSO-Hybrid Random Forest", description: "Bu tezde önerilen hibrit çerçeve — eşzamanlı öznitelik seçimi + hiperparametre optimizasyonu", category: "Kısaltma", firstUse: "Bölüm 1" },
    { symbol: "ML", turkishName: "Makine Öğrenmesi", englishName: "Machine Learning", description: "Veriden otomatik öğrenme ve tahmin yapan algoritma ailesi", category: "Kısaltma", firstUse: "Bölüm 1" },
    { symbol: "IDS", turkishName: "Saldırı Tespit Sistemi", englishName: "Intrusion Detection System", description: "Ağ trafiğini izleyerek saldırıları tespit eden sistem", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "SMOTE", turkishName: "Sentetik Azınlık Aşırı Örnekleme", englishName: "Synthetic Minority Over-sampling Technique", description: "Azınlık sınıfından sentetik örnekler üreterek sınıf dengesizliğini gideren yöntem", category: "Kısaltma", firstUse: "Bölüm 3" },
    { symbol: "SVM", turkishName: "Destek Vektör Makinesi", englishName: "Support Vector Machine", description: "Sınıflar arasında en geniş marjı bulan sınıflandırma algoritması", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "KNN", turkishName: "K-En Yakın Komşu", englishName: "K-Nearest Neighbors", description: "Yeni örneği en yakın K komşusunun sınıfına göre sınıflandıran algoritma", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "DT", turkishName: "Karar Ağacı", englishName: "Decision Tree", description: "İf-then kurallarıyla hiyerarşik bölme yapan sınıflandırıcı", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "NB", turkishName: "Naif Bayes", englishName: "Naive Bayes", description: "Bayes teoremine dayanan olasılıksal sınıflandırıcı", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "LR", turkishName: "Lojistik Regresyon", englishName: "Logistic Regression", description: "Sigmoid fonksiyonu ile ikili/çoklu sınıflandırma yapan istatistiksel model", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "XGBoost", turkishName: "Aşırı Gradyan Artırma", englishName: "Extreme Gradient Boosting", description: "Sıralı ağaç ekleme ile optimize edilen gradient boosting uygulaması", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "PSO", turkishName: "Parçacık Sürüsü Optimizasyonu", englishName: "Particle Swarm Optimization", description: "Parçacık sürüsünün kolektif davranışına dayanan optimizasyon algoritması", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "GA", turkishName: "Genetik Algoritma", englishName: "Genetic Algorithm", description: "Doğal seçilim ve evrime dayanan optimizasyon algoritması", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "GWO", turkishName: "Gri Kurt Optimizasyonu", englishName: "Grey Wolf Optimizer", description: "Kurt sürüsü hiyerarşisine dayanan meta-sezgisel optimizasyon", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "AUC-ROC", turkishName: "ROC Eğrisi Altındaki Alan", englishName: "Area Under ROC Curve", description: "Sınıflandırıcının ayırt edici gücünü ölçen metrik (0.5-1.0)", category: "Kısaltma", firstUse: "Bölüm 3" },
    { symbol: "MCC", turkishName: "Matthews Korelasyon Katsayısı", englishName: "Matthews Correlation Coefficient", description: "Dengesiz verilerde güvenilir performans metriği (−1 ile +1 arası)", category: "Kısaltma", firstUse: "Bölüm 3" },
    { symbol: "CV", turkishName: "Çapraz Doğrulama", englishName: "Cross-Validation", description: "Modeli farklı veri alt kümelerinde test ederek genelleme performansını ölçme yöntemi", category: "Kısaltma", firstUse: "Bölüm 3" },
    { symbol: "OOB", turkishName: "Torba Dışı", englishName: "Out-of-Bag", description: "Bootstrap örnekleminde kullanılmayan örneklerin hata tahmini için kullanılması", category: "Kısaltma", firstUse: "Bölüm 3" },
    { symbol: "PCA", turkishName: "Temel Bileşen Analizi", englishName: "Principal Component Analysis", description: "Boyut azaltma için kullanılan doğrusal projeksiyon yöntemi", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "CICIoT2023", turkishName: "CIC IoT 2023 Veri Seti", englishName: "Canadian Institute for Cybersecurity IoT 2023", description: "105 IoT cihaz ve 33 saldırı türü içeren gerçekçi ağ trafiği veri seti", category: "Kısaltma", firstUse: "Bölüm 1" },
    { symbol: "TCP", turkishName: "İletim Kontrol Protokolü", englishName: "Transmission Control Protocol", description: "Bağlantı temelli, güvenilir veri iletim protokolü", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "UDP", turkishName: "Kullanıcı Veri Protokolü", englishName: "User Datagram Protocol", description: "Bağlantısız, hızlı veri iletim protokolü", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "SYN", turkishName: "Senkronizasyon", englishName: "Synchronize", description: "TCP bağlantı başlatma bayrağı — SYN flood saldırısında kötüye kullanılır", category: "Kısaltma", firstUse: "Bölüm 2" },
    { symbol: "ACK", turkishName: "Doğrulama", englishName: "Acknowledgement", description: "TCP onay bayrağı — ACK fragmentation saldırısında kötüye kullanılır", category: "Kısaltma", firstUse: "Bölüm 2" },

    /* ─── Matematiksel Semboller ─── */
    { symbol: "fᵢ", turkishName: "Frekans", englishName: "Frequency", description: "i. yarasanın ekolokasyon frekansı (f_min=0.0, f_max=2.0)", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "vᵢ(t)", turkishName: "Hız", englishName: "Velocity", description: "i. yarasanın t anındaki hız vektörü", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "xᵢ(t)", turkishName: "Pozisyon", englishName: "Position", description: "i. yarasanın t anındaki pozisyon vektörü (çözüm temsili)", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "x*", turkishName: "En İyi Çözüm", englishName: "Global Best", description: "Tüm yarasalar arasındaki en iyi global pozisyon", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "Aᵢ(t)", turkishName: "Gürültü Seviyesi", englishName: "Loudness", description: "i. yarasanın t anındaki gürültü seviyesi (A₀=0.95, α=0.9 ile azalır)", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "rᵢ(t)", turkishName: "Darbe Oranı", englishName: "Pulse Rate", description: "i. yarasanın t anındaki darbe oranı (r₀=0.5, γ=0.9 ile artar)", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "α", turkishName: "Soğutma Katsayısı", englishName: "Cooling Coefficient", description: "Gürültü azaltma oranı (α=0.9)", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "γ", turkishName: "Darbe Artış Katsayısı", englishName: "Pulse Increase Coefficient", description: "Darbe oranı artış hızı (γ=0.9)", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "β", turkishName: "Rastgele Sayı", englishName: "Random Number", description: "[0,1] aralığında düzgün dağılımlı rastgele sayı", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "F(x)", turkishName: "Fitness Fonksiyonu", englishName: "Fitness Function", description: "Çözüm kalitesini ölçen amaç fonksiyonu — minimize edilir", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "S(·)", turkishName: "Sigmoid Fonksiyonu", englishName: "Sigmoid Function", description: "Sürekli değeri [0,1] aralığına dönüştüren transfer fonksiyonu", category: "BSO Sembol", firstUse: "Bölüm 3" },
    { symbol: "λ", turkishName: "Ağırlık Katsayısı", englishName: "Weight Coefficient", description: "Fitness fonksiyonunda öznitelik azaltma ağırlığı (λ=0.01)", category: "BSO Sembol", firstUse: "Bölüm 3" },

    /* ─── Metrikler ─── */
    { symbol: "TP", turkishName: "Doğru Pozitif", englishName: "True Positive", description: "Pozitif olarak doğru tahmin edilen örnek sayısı", category: "Metrik", firstUse: "Bölüm 3" },
    { symbol: "TN", turkishName: "Doğru Negatif", englishName: "True Negative", description: "Negatif olarak doğru tahmin edilen örnek sayısı", category: "Metrik", firstUse: "Bölüm 3" },
    { symbol: "FP", turkishName: "Yanlış Pozitif", englishName: "False Positive", description: "Yanlış alarm — negatif örneğin pozitif tahmin edilmesi", category: "Metrik", firstUse: "Bölüm 3" },
    { symbol: "FN", turkishName: "Yanlış Negatif", englishName: "False Negative", description: "Kaçırılmış tespit — pozitif örneğin negatif tahmin edilmesi", category: "Metrik", firstUse: "Bölüm 3" },
    { symbol: "F1", turkishName: "F1-Skoru", englishName: "F1-Score", description: "Precision ve Recall'un harmonik ortalaması", category: "Metrik", firstUse: "Bölüm 3" },
    { symbol: "F1-Macro", turkishName: "F1-Makro", englishName: "F1-Macro Average", description: "Her sınıfın F1-skorunun eşit ağırlıklı ortalaması", category: "Metrik", firstUse: "Bölüm 3" },

    /* ─── RF Semboller ─── */
    { symbol: "Gini(D)", turkishName: "Gini Safsızlık", englishName: "Gini Impurity", description: "Düğümdeki sınıf safsızlığını ölçen metrik — 0=saf, 0.5=tam karışık", category: "RF Sembol", firstUse: "Bölüm 3" },
    { symbol: "B", turkishName: "Ağaç Sayısı", englishName: "Number of Trees", description: "Random Forest'taki toplam ağaç sayısı (B=266, BSO ile optimize)", category: "RF Sembol", firstUse: "Bölüm 3" },
    { symbol: "m_try", turkishName: "Alt Küme Boyutu", englishName: "Feature Subset Size", description: "Her bölmede değerlendirilen öznitelik sayısı (⌊√19⌋=4)", category: "RF Sembol", firstUse: "Bölüm 3" },

    /* ─── İstatistik ─── */
    { symbol: "p-value", turkishName: "p-değeri", englishName: "p-value", description: "Sıfır hipotezi altında gözlenen sonucun olasılığı — p<0.05 = anlamlı", category: "İstatistik", firstUse: "Bölüm 4" },
    { symbol: "H₀", turkishName: "Sıfır Hipotezi", englishName: "Null Hypothesis", description: "İki model arasında fark olmadığını varsayan hipotez", category: "İstatistik", firstUse: "Bölüm 4" },
    { symbol: "H₁", turkishName: "Alternatif Hipotez", englishName: "Alternative Hypothesis", description: "İki model arasında anlamlı fark olduğunu öne süren hipotez", category: "İstatistik", firstUse: "Bölüm 4" },
    { symbol: "d (Cohen)", turkishName: "Etki Büyüklüğü", englishName: "Cohen's d Effect Size", description: "Farkın pratik anlamlılığını ölçen metrik — küçük(0.2), orta(0.5), büyük(0.8)", category: "İstatistik", firstUse: "Bölüm 4" },
    { symbol: "μ", turkishName: "Ortalama", englishName: "Mean", description: "Aritmetik ortalama — StandardScaler'da öznitelik ortalaması", category: "İstatistik", firstUse: "Bölüm 3" },
    { symbol: "σ", turkishName: "Standart Sapma", englishName: "Standard Deviation", description: "Verilerin ortalamadan sapma ölçüsü — StandardScaler'da kullanılır", category: "İstatistik", firstUse: "Bölüm 3" },
]

const CATEGORIES = ["Tümü", "Kısaltma", "BSO Sembol", "RF Sembol", "Metrik", "İstatistik"]

export default function GlossaryNotation() {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("Tümü")
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

    const filtered = GLOSSARY.filter((g) => {
        const matchCat = filter === "Tümü" || g.category === filter
        const q = search.toLowerCase()
        const matchSearch =
            q === "" ||
            g.symbol.toLowerCase().includes(q) ||
            g.turkishName.toLowerCase().includes(q) ||
            g.englishName.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q)
        return matchCat && matchSearch
    })

    const copyRow = (g: GlossaryItem, idx: number) => {
        const text = `${g.symbol}\t${g.turkishName}\t${g.englishName}\t${g.description}`
        navigator.clipboard.writeText(text)
        setCopiedIdx(idx)
        setTimeout(() => setCopiedIdx(null), 1500)
    }

    const catCounts = CATEGORIES.map((cat) => ({
        cat,
        count: cat === "Tümü" ? GLOSSARY.length : GLOSSARY.filter((g) => g.category === cat).length,
    }))

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-lime-500" />
                    Sembol ve Kısaltma Tablosu
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Tezde kullanılan {GLOSSARY.length} sembol, kısaltma ve notasyon — Tez başında verilecek liste
                </p>
            </div>

            {/* ════════════════════ KATEGORİ SAYILARI ════════════════════ */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {catCounts.map((cc) => (
                    <button
                        key={cc.cat}
                        onClick={() => setFilter(cc.cat)}
                        className={`p-2 rounded-lg text-center transition-all border ${filter === cc.cat
                                ? "bg-lime-50 dark:bg-lime-950/30 border-lime-300 dark:border-lime-700 text-lime-700 dark:text-lime-300"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                            }`}
                    >
                        <div className={`text-lg font-black ${filter === cc.cat ? "text-lime-600 dark:text-lime-400" : ""}`}>{cc.count}</div>
                        <div className="text-[9px]">{cc.cat}</div>
                    </button>
                ))}
            </div>

            {/* ════════════════════ ARAMA ════════════════════ */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Sembol, Türkçe veya İngilizce isim ara..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500 outline-none"
                />
            </div>

            {/* ════════════════════ ANA TABLO ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lime-700 dark:text-lime-300">
                        <BookOpen className="w-5 h-5" />
                        Sembol ve Kısaltmalar ({filtered.length} madde)
                    </CardTitle>
                    <CardDescription>Tez başında yer alacak kısaltmalar ve semboller listesi — satır kopyalanabilir</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    {["Sembol", "Türkçe", "İngilizce", "Açıklama", "Kategori", "İlk Kullanım", ""].map((h) => (
                                        <th key={h} className="px-2 py-2 text-left font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((g, idx) => (
                                    <tr key={`${g.symbol}-${idx}`} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                        <td className="px-2 py-2 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">{g.symbol}</td>
                                        <td className="px-2 py-2 text-slate-700 dark:text-slate-300 whitespace-nowrap">{g.turkishName}</td>
                                        <td className="px-2 py-2 text-slate-500 dark:text-slate-400 italic whitespace-nowrap">{g.englishName}</td>
                                        <td className="px-2 py-2 text-slate-600 dark:text-slate-400 max-w-xs">{g.description}</td>
                                        <td className="px-2 py-2">
                                            <Badge variant="outline" className="text-[9px] whitespace-nowrap">{g.category}</Badge>
                                        </td>
                                        <td className="px-2 py-2 text-slate-500 dark:text-slate-400 text-[10px] whitespace-nowrap">{g.firstUse}</td>
                                        <td className="px-2 py-2">
                                            <button
                                                onClick={() => copyRow(g, idx)}
                                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                title="Satırı kopyala"
                                            >
                                                {copiedIdx === idx ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ NOT ════════════════════ */}
            <Card className="border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/20">
                <CardContent className="pt-4 pb-4 text-xs text-blue-800 dark:text-blue-200 space-y-2">
                    <p><strong>Kullanım Rehberi:</strong></p>
                    <p>• Bu tablo, tez metninin başında &quot;Kısaltmalar ve Semboller Listesi&quot; olarak yer almalıdır.</p>
                    <p>• Kısaltmalar metin içinde ilk kullanımda açık yazılmalıdır: &quot;Yarasa Sürüsü Optimizasyonu (BSO)&quot;</p>
                    <p>• Matematiksel semboller, ilgili denklemin hemen altında veya yanında açıklanmalıdır.</p>
                    <p>• Satırları kopyalayıp doğrudan Word/LaTeX belgesine yapıştırabilirsiniz.</p>
                </CardContent>
            </Card>
        </div>
    )
}
