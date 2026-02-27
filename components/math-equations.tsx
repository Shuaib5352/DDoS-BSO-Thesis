"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Brain, Target, Zap, BarChart3, Layers, Calculator,
    TrendingUp, Shield, Activity, Sigma,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   Matematiksel Formüller — Tez Denklemleri
   BSO, RF, SMOTE, Performans Metrikleri
   ═══════════════════════════════════════════════════════════════ */

interface EquationCard {
    id: string
    number: string        // equation number like (1), (2)
    name: string
    description: string
    latex: string         // displayed as styled code
    variables?: string[]  // variable explanations
}

/* ─── BSO Equations ─── */
const BSO_EQUATIONS: EquationCard[] = [
    {
        id: "bso-freq",
        number: "(1)",
        name: "Frekans Güncelleme",
        description: "Her yarasa, minimum ve maksimum frekans arasında rastgele bir frekans değeri alır.",
        latex: "fᵢ = f_min + (f_max − f_min) × β",
        variables: [
            "fᵢ : i. yarasanın frekansı",
            "f_min, f_max : frekans alt ve üst sınırları (0.0, 2.0)",
            "β ∈ [0, 1] : düzgün dağılımlı rastgele sayı",
        ],
    },
    {
        id: "bso-vel",
        number: "(2)",
        name: "Hız Güncelleme",
        description: "Yarasanın hızı, mevcut en iyi çözüme olan uzaklığa göre güncellenir.",
        latex: "vᵢ(t+1) = vᵢ(t) + [xᵢ(t) − x*] × fᵢ",
        variables: [
            "vᵢ(t) : i. yarasanın t anındaki hızı",
            "xᵢ(t) : i. yarasanın t anındaki pozisyonu",
            "x* : şu ana kadar bulunan en iyi global pozisyon",
        ],
    },
    {
        id: "bso-pos",
        number: "(3)",
        name: "Pozisyon Güncelleme",
        description: "Yarasa, yeni hızına göre pozisyonunu günceller.",
        latex: "xᵢ(t+1) = xᵢ(t) + vᵢ(t+1)",
        variables: [
            "xᵢ(t+1) : yeni pozisyon (öznitelik alt kümesi)",
            "Her boyut, bir özniteliğin seçilip seçilmediğini belirler",
        ],
    },
    {
        id: "bso-loud",
        number: "(4)",
        name: "Gürültü (Loudness) Azaltma",
        description: "Gürültü seviyesi her iterasyonda azalır — keşiften sömürüye geçiş.",
        latex: "Aᵢ(t+1) = α × Aᵢ(t)",
        variables: [
            "Aᵢ(t) : i. yarasanın t anındaki gürültü seviyesi",
            "α = 0.9 : soğutma katsayısı (0 < α < 1)",
            "A → 0 olduğunda yarasa en iyi çözüme yakınsar",
        ],
    },
    {
        id: "bso-pulse",
        number: "(5)",
        name: "Darbe Oranı Artışı",
        description: "Darbe oranı zamanla artar — yerel arama yoğunluğu arttırılır.",
        latex: "rᵢ(t+1) = rᵢ(0) × [1 − e^(−γt)]",
        variables: [
            "rᵢ(0) = 0.5 : başlangıç darbe oranı",
            "γ = 0.9 : darbe artış katsayısı",
            "t → ∞ iken rᵢ → rᵢ(0) (tam sömürü modu)",
        ],
    },
    {
        id: "bso-local",
        number: "(6)",
        name: "Yerel Arama (Random Walk)",
        description: "Yüksek darbe oranına sahip yarasalar yerel arama yapar.",
        latex: "x_new = x_best + ε × Ā(t)",
        variables: [
            "x_best : mevcut en iyi çözüm",
            "ε ∈ [−1, 1] : rastgele pertürbasyon",
            "Ā(t) : tüm yarasaların ortalama gürültü seviyesi",
        ],
    },
    {
        id: "bso-fitness",
        number: "(7)",
        name: "Fitness (Uygunluk) Fonksiyonu",
        description: "Çift amaçlı: yüksek sınıflandırma + az öznitelik.",
        latex: "F(x) = (1 − F1_macro) + λ × (|S| / |T|)",
        variables: [
            "F1_macro : makro ortalama F1-skoru",
            "|S| : seçilen öznitelik sayısı",
            "|T| = 39 : toplam öznitelik sayısı",
            "λ = 0.01 : öznitelik azaltma ağırlığı",
            "Amaç: F(x) → min (düşük = iyi)",
        ],
    },
    {
        id: "bso-binary",
        number: "(8)",
        name: "İkili (Binary) Dönüşüm — Sigmoid",
        description: "Sürekli pozisyon değeri, öznitelik seçim kararına dönüştürülür.",
        latex: "S(xᵢⱼ) = 1 / (1 + e^(−xᵢⱼ))\n\nxᵢⱼ' = { 1,  eğer rand < S(xᵢⱼ)\n         { 0,  aksi halde",
        variables: [
            "xᵢⱼ : i. yarasanın j. boyut değeri",
            "S(·) : sigmoid transfer fonksiyonu",
            "xᵢⱼ' = 1 → j. öznitelik seçildi",
            "xᵢⱼ' = 0 → j. öznitelik elendi",
        ],
    },
]

/* ─── Random Forest Equations ─── */
const RF_EQUATIONS: EquationCard[] = [
    {
        id: "rf-gini",
        number: "(9)",
        name: "Gini Safsızlık (Impurity)",
        description: "Karar ağacının her düğümünde bölme kalitesini ölçer.",
        latex: "Gini(D) = 1 − Σᵏ₌₁ (pₖ)²",
        variables: [
            "D : düğümdeki veri alt kümesi",
            "K = 5 : sınıf sayısı",
            "pₖ : k. sınıfın düğümdeki oranı",
            "Gini = 0 → saf düğüm (tek sınıf)",
        ],
    },
    {
        id: "rf-split",
        number: "(10)",
        name: "Bilgi Kazancı (Information Gain)",
        description: "Bölmenin ne kadar bilgi sağladığını ölçer.",
        latex: "ΔGini = Gini(D) − Σ (|Dⱼ| / |D|) × Gini(Dⱼ)",
        variables: [
            "D : ebeveyn düğümü",
            "Dⱼ : bölme sonrası oluşan alt düğümler",
            "|Dⱼ| / |D| : alt düğümün ağırlığı",
            "En yüksek ΔGini → en iyi bölme",
        ],
    },
    {
        id: "rf-vote",
        number: "(11)",
        name: "Çoğunluk Oylaması (Majority Voting)",
        description: "266 ağacın tahminleri birleştirilerek nihai sınıf belirlenir.",
        latex: "ŷ = mode{h₁(x), h₂(x), ..., h_B(x)}",
        variables: [
            "hₜ(x) : t. karar ağacının tahmini",
            "B = 266 : toplam ağaç sayısı (BSO ile optimize)",
            "mode : en sık tekrarlanan sınıf etiketini seçer",
        ],
    },
    {
        id: "rf-oob",
        number: "(12)",
        name: "Bootstrap Örnekleme",
        description: "Her ağaç, orijinal verinin rastgele alt örneklemi üzerinde eğitilir.",
        latex: "Dₜ = Bootstrap(D, n)\nP(i ∉ Dₜ) ≈ (1 − 1/n)ⁿ ≈ 0.368",
        variables: [
            "D : orijinal eğitim seti (87.500 örnek)",
            "n : örneklem boyutu (tekrarlı seçim ile)",
            "Her ağaç verilerin ~%63.2'sini görür",
            "%36.8 OOB (out-of-bag) doğrulama için kullanılır",
        ],
    },
    {
        id: "rf-features",
        number: "(13)",
        name: "Rastgele Öznitelik Alt Kümesi",
        description: "Her bölmede yalnızca rastgele √m öznitelik değerlendirilir.",
        latex: "m_try = ⌊√m⌋ = ⌊√19⌋ = 4",
        variables: [
            "m = 19 : BSO-seçilmiş toplam öznitelik sayısı",
            "m_try = 4 : her bölmede değerlendirilen öznitelik",
            "Ağaçlar arasında çeşitlilik sağlar (de-korelasyon)",
        ],
    },
]

/* ─── SMOTE Equations ─── */
const SMOTE_EQUATIONS: EquationCard[] = [
    {
        id: "smote-synth",
        number: "(14)",
        name: "Sentetik Örnek Üretimi",
        description: "Azınlık sınıfından iki örnek arasında yeni sentetik örnek oluşturulur.",
        latex: "x_new = xᵢ + λ × (x_nn − xᵢ)",
        variables: [
            "xᵢ : azınlık sınıfından seçilen örnek",
            "x_nn : xᵢ'nin k-en yakın komşularından biri",
            "λ ∈ [0, 1] : rastgele interpolasyon katsayısı",
            "x_new : üretilen sentetik örnek",
        ],
    },
    {
        id: "smote-knn",
        number: "(15)",
        name: "K-En Yakın Komşu Mesafesi",
        description: "Öklid mesafesi ile en yakın komşular belirlenir.",
        latex: "d(xᵢ, xⱼ) = √[Σᵐ₌₁ (xᵢₘ − xⱼₘ)²]",
        variables: [
            "xᵢ, xⱼ : iki örnek arasındaki mesafe",
            "m = 19 : öznitelik sayısı",
            "k = 5 : komşu sayısı (varsayılan)",
        ],
    },
]

/* ─── Normalization ─── */
const NORM_EQUATIONS: EquationCard[] = [
    {
        id: "scaler",
        number: "(16)",
        name: "StandardScaler Normalizasyon",
        description: "Her özniteliği ortalama=0, standart sapma=1 olacak şekilde ölçekler.",
        latex: "z = (x − μ) / σ",
        variables: [
            "x : orijinal öznitelik değeri",
            "μ : özniteliğin ortalaması",
            "σ : özniteliğin standart sapması",
            "z : normalleştirilmiş değer",
        ],
    },
]

/* ─── Performance Metrics ─── */
const METRIC_EQUATIONS: EquationCard[] = [
    {
        id: "accuracy",
        number: "(17)",
        name: "Doğruluk (Accuracy)",
        description: "Tüm doğru tahminlerin toplam tahminlere oranı.",
        latex: "Accuracy = (TP + TN) / (TP + TN + FP + FN)",
        variables: [
            "TP : Doğru Pozitif | TN : Doğru Negatif",
            "FP : Yanlış Pozitif | FN : Yanlış Negatif",
            "BSO-RF Sonucu: %89.82",
        ],
    },
    {
        id: "precision",
        number: "(18)",
        name: "Kesinlik (Precision)",
        description: "Pozitif tahminlerin ne kadarının gerçekten pozitif olduğu.",
        latex: "Precision = TP / (TP + FP)",
        variables: [
            "Yüksek precision → az yanlış alarm",
            "BSO-RF Sonucu: %90.19",
        ],
    },
    {
        id: "recall",
        number: "(19)",
        name: "Duyarlılık (Recall / Sensitivity)",
        description: "Gerçek pozitiflerin ne kadarının tespit edildiği.",
        latex: "Recall = TP / (TP + FN)",
        variables: [
            "Yüksek recall → az kaçırılmış saldırı",
            "BSO-RF Sonucu: %89.82",
        ],
    },
    {
        id: "f1",
        number: "(20)",
        name: "F1-Skoru (Harmonik Ortalama)",
        description: "Precision ve Recall'un harmonik ortalaması — dengeli performans ölçüsü.",
        latex: "F1 = 2 × (Precision × Recall) / (Precision + Recall)",
        variables: [
            "F1 ∈ [0, 1] : 1 = mükemmel, 0 = en kötü",
            "BSO-RF F1-Score: %89.90",
            "BSO-RF F1-Macro: %84.24",
        ],
    },
    {
        id: "f1-macro",
        number: "(21)",
        name: "F1-Makro (Sınıf Ortalaması)",
        description: "Her sınıfın F1-skoru eşit ağırlıkla ortalaması — dengesiz verilerde kritik.",
        latex: "F1_macro = (1/K) × Σᵏ₌₁ F1ₖ",
        variables: [
            "K = 5 : sınıf sayısı",
            "F1ₖ : k. sınıfın F1-skoru",
            "Azınlık sınıflarına eşit önem verir",
        ],
    },
    {
        id: "auc-roc",
        number: "(22)",
        name: "AUC-ROC",
        description: "ROC eğrisi altında kalan alan — sınıflandırıcının ayırt etme yeteneği.",
        latex: "AUC = ∫₀¹ TPR(FPR) d(FPR)\n\nTPR = TP / (TP + FN)\nFPR = FP / (FP + TN)",
        variables: [
            "TPR : Gerçek Pozitif Oranı (Sensitivity)",
            "FPR : Yanlış Pozitif Oranı (1 − Specificity)",
            "AUC = 1.0 → mükemmel ayırt etme",
            "BSO-RF Sonucu: %98.38",
        ],
    },
    {
        id: "mcc",
        number: "(23)",
        name: "Matthews Korelasyon Katsayısı (MCC)",
        description: "Dengesiz veri setleri için en güvenilir metrik — tüm karışıklık matrisi hücreleri kullanılır.",
        latex: "MCC = (TP×TN − FP×FN) / √[(TP+FP)(TP+FN)(TN+FP)(TN+FN)]",
        variables: [
            "MCC ∈ [−1, +1]",
            "+1 : mükemmel tahmin",
            " 0 : rastgele tahmin",
            "−1 : tamamen ters tahmin",
            "BSO-RF Sonucu: 0.8676",
        ],
    },
    {
        id: "specificity",
        number: "(24)",
        name: "Özgüllük (Specificity)",
        description: "Gerçek negatiflerin ne kadarının doğru tespit edildiği.",
        latex: "Specificity = TN / (TN + FP)",
        variables: [
            "Normal trafiğin doğru sınıflandırılma oranı",
            "BSO-RF Sonucu: %90.19",
        ],
    },
]

/* ─── Sections ─── */
const SECTIONS = [
    { title: "Yarasa Sürüsü Optimizasyonu (BSO)", icon: Brain, color: "emerald", equations: BSO_EQUATIONS, eqCount: 8 },
    { title: "Random Forest Sınıflandırıcı", icon: Zap, color: "cyan", equations: RF_EQUATIONS, eqCount: 5 },
    { title: "SMOTE Dengeleme", icon: Layers, color: "indigo", equations: SMOTE_EQUATIONS, eqCount: 2 },
    { title: "Normalizasyon", icon: Activity, color: "purple", equations: NORM_EQUATIONS, eqCount: 1 },
    { title: "Performans Metrikleri", icon: BarChart3, color: "rose", equations: METRIC_EQUATIONS, eqCount: 8 },
]

const sectionColors: Record<string, { card: string; badge: string; header: string }> = {
    emerald: { card: "border-emerald-200 dark:border-emerald-800/40", badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", header: "text-emerald-700 dark:text-emerald-300" },
    cyan: { card: "border-cyan-200 dark:border-cyan-800/40", badge: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300", header: "text-cyan-700 dark:text-cyan-300" },
    indigo: { card: "border-indigo-200 dark:border-indigo-800/40", badge: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300", header: "text-indigo-700 dark:text-indigo-300" },
    purple: { card: "border-purple-200 dark:border-purple-800/40", badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300", header: "text-purple-700 dark:text-purple-300" },
    rose: { card: "border-rose-200 dark:border-rose-800/40", badge: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300", header: "text-rose-700 dark:text-rose-300" },
}

export default function MathEquations() {
    const totalEquations = SECTIONS.reduce((sum, s) => sum + s.equations.length, 0)

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-indigo-500" />
                    Matematiksel Formüller
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Bu tezde kullanılan {totalEquations} temel matematiksel denklem — BSO, RF, SMOTE ve performans metrikleri
                </p>
            </div>

            {/* ════════════════════ İSTATİSTİK KARTLARI ════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {SECTIONS.map((s) => {
                    const Icon = s.icon
                    const colors = sectionColors[s.color]
                    return (
                        <Card key={s.title} className={colors.card}>
                            <CardContent className="pt-3 pb-3 text-center">
                                <Icon className={`w-5 h-5 mx-auto mb-1 ${colors.header}`} />
                                <div className={`text-lg font-black ${colors.header}`}>{s.equations.length}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{s.title.split("(")[0].trim()}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* ════════════════════ DENKLEM BÖLÜMLERİ ════════════════════ */}
            {SECTIONS.map((section) => {
                const Icon = section.icon
                const colors = sectionColors[section.color]
                return (
                    <Card key={section.title} className={colors.card}>
                        <CardHeader>
                            <CardTitle className={`flex items-center gap-2 ${colors.header}`}>
                                <Icon className="w-5 h-5" />
                                {section.title}
                            </CardTitle>
                            <CardDescription>{section.equations.length} denklem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                                {section.equations.map((eq) => (
                                    <div
                                        key={eq.id}
                                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge className={`${colors.badge} font-mono text-xs px-2`}>{eq.number}</Badge>
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{eq.name}</h3>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{eq.description}</p>

                                        {/* Equation box */}
                                        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                                            <pre className="font-mono text-base sm:text-lg text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed tracking-wide">
                                                {eq.latex}
                                            </pre>
                                        </div>

                                        {/* Variables */}
                                        {eq.variables && eq.variables.length > 0 && (
                                            <div className="mt-3 space-y-1">
                                                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Değişkenler:</p>
                                                {eq.variables.map((v, i) => (
                                                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                                                        <span className="text-slate-300 dark:text-slate-600 mt-0.5">•</span>
                                                        <span className="font-mono">{v}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}

            {/* ════════════════════ ÖNEMLİ NOT ════════════════════ */}
            <Card className="border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/20">
                <CardContent className="pt-4 pb-4 text-sm text-blue-900 dark:text-blue-100 space-y-2">
                    <p>
                        <strong>Notasyon Rehberi:</strong>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                        <span>Σ → Toplam</span>
                        <span>∫ → İntegral</span>
                        <span>√ → Karekök</span>
                        <span>∈ → Elemanıdır</span>
                        <span>× → Çarpma</span>
                        <span>≈ → Yaklaşık</span>
                        <span>⌊·⌋ → Taban</span>
                        <span>→ → Yakınsar</span>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        Toplam {totalEquations} denklem — Denklem (1)-(8): BSO, (9)-(13): RF, (14)-(15): SMOTE, (16): Normalizasyon, (17)-(24): Metrikler
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
