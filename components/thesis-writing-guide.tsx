"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    FileText, BookOpen, CheckCircle2, AlertCircle,
    Table2, Image, ChevronDown, ChevronRight, BarChart3,
    Brain, Database, Layers, Target, TrendingUp, Printer,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   Tez Yazım Rehberi (Thesis Writing Guide)
   Bölüm bazında yapı, tablo/şekil önerileri, kelime sayıları
   ═══════════════════════════════════════════════════════════════ */

interface ChapterSection {
    title: string
    suggestedPages: string
    description: string
    keyPoints: string[]
    tables: string[]
    figures: string[]
    tips: string[]
}

interface Chapter {
    number: number
    title: string
    titleEn: string
    icon: React.ElementType
    color: string
    suggestedPages: string
    wordCount: string
    sections: ChapterSection[]
    status: "tamamlandı" | "devam" | "planlandı"
}

const CHAPTERS: Chapter[] = [
    {
        number: 1,
        title: "Giriş",
        titleEn: "Introduction",
        icon: BookOpen,
        color: "blue",
        suggestedPages: "8-12",
        wordCount: "2.500-3.500",
        status: "devam",
        sections: [
            {
                title: "1.1 Problem Tanımı",
                suggestedPages: "2-3",
                description: "DDoS saldırılarının IoT ortamlarındaki artan tehdidi ve mevcut tespit yöntemlerinin yetersizlikleri.",
                keyPoints: [
                    "IoT cihazlarının hızlı artışı ve güvenlik açıklıkları",
                    "DDoS saldırılarının hacmi ve karmaşıklığındaki artış",
                    "Geleneksel tespit yöntemlerinin sınırlılıkları",
                    "Öznitelik fazlalığının model performansına etkisi",
                ],
                tables: [],
                figures: ["DDoS saldırı istatistikleri grafiği (yıllara göre)"],
                tips: ["Güncel istatistiklerle başlayın (2023-2025 DDoS raporları)", "Problemin boyutunu sayılarla destekleyin"],
            },
            {
                title: "1.2 Amaç ve Hedefler",
                suggestedPages: "1-2",
                description: "Tezin ana amacı ve spesifik araştırma hedefleri.",
                keyPoints: [
                    "BSO ile otomatik öznitelik seçimi",
                    "RF hiperparametre optimizasyonu",
                    "Hibrit çerçeve ile eşzamanlı optimizasyon",
                    "CICIoT2023 üzerinde kapsamlı değerlendirme",
                ],
                tables: [],
                figures: [],
                tips: ["Her hedefi numaralandırın ve ölçülebilir yapın", "3-5 spesifik hedef belirleyin"],
            },
            {
                title: "1.3 Araştırma Soruları",
                suggestedPages: "1",
                description: "Tezin yanıtlamayı hedeflediği araştırma soruları.",
                keyPoints: [
                    "AS1: BSO tabanlı öznitelik seçimi DDoS tespit doğruluğunu artırır mı?",
                    "AS2: Eşzamanlı öznitelik + hiperparametre optimizasyonu ayrı adımlardan daha etkili midir?",
                    "AS3: BSO-RF çerçevesi meta-sezgisel alternatiflerden (PSO, GA, GWO) üstün müdür?",
                    "AS4: Öznitelik azaltma hesaplama maliyetini nasıl etkiler?",
                ],
                tables: [],
                figures: [],
                tips: ["Her soruyu sonuç bölümünde yanıtladığınızdan emin olun"],
            },
            {
                title: "1.4 Tezin Katkısı",
                suggestedPages: "1",
                description: "Literatüre yapılan özgün katkılar.",
                keyPoints: [
                    "BSO'nun CICIoT2023 üzerinde ilk uygulaması",
                    "Hibrit öznitelik + hiperparametre optimizasyonu",
                    "%51.3 öznitelik azaltma ile karşılaştırılabilir performans",
                    "12 model ile kapsamlı deneysel karşılaştırma",
                ],
                tables: [],
                figures: [],
                tips: ["Her katkıyı bir cümleyle özetleyin", "Katkıların hangi boşluğu doldurduğunu belirtin"],
            },
            {
                title: "1.5 Tez Organizasyonu",
                suggestedPages: "1",
                description: "Tezin bölüm yapısının kısa açıklaması.",
                keyPoints: ["Her bölümün 1-2 cümle açıklaması"],
                tables: [],
                figures: [],
                tips: ["Kısa ve öz tutun"],
            },
        ],
    },
    {
        number: 2,
        title: "Literatür Taraması",
        titleEn: "Literature Review",
        icon: BookOpen,
        color: "purple",
        suggestedPages: "15-20",
        wordCount: "5.000-7.000",
        status: "devam",
        sections: [
            {
                title: "2.1 DDoS Saldırıları ve IoT Güvenliği",
                suggestedPages: "3-4",
                description: "DDoS saldırı türleri, IoT ortamlarındaki güvenlik zorlukları.",
                keyPoints: [
                    "DDoS saldırı taksonomisi (volumetrik, protokol, uygulama)",
                    "IoT'ye özgü güvenlik zorlukları",
                    "Geleneksel vs. ML tabanlı tespit yaklaşımları",
                ],
                tables: ["DDoS saldırı türleri sınıflandırma tablosu"],
                figures: ["DDoS saldırı taksonomisi diyagramı"],
                tips: ["En az 15-20 kaynak referans verin", "2020 sonrası çalışmalara ağırlık verin"],
            },
            {
                title: "2.2 Makine Öğrenmesi ile Saldırı Tespiti",
                suggestedPages: "4-5",
                description: "ML tabanlı IDS/DDoS tespit yöntemlerinin kapsamlı incelemesi.",
                keyPoints: [
                    "Denetimli öğrenme yaklaşımları (RF, SVM, DT, KNN, vb.)",
                    "Ensemble yöntemler (Bagging, Boosting)",
                    "Derin öğrenme yaklaşımları (CNN, LSTM, Autoencoder)",
                    "Transfer öğrenme ve federe öğrenme",
                ],
                tables: ["İlgili çalışmalar karşılaştırma tablosu (Tablo 2.1)"],
                figures: [],
                tips: ["Bu dashboarddaki 'İlgili Çalışmalar' bileşenini referans alın", "Karşılaştırma tablosu çok önemli"],
            },
            {
                title: "2.3 Meta-Sezgisel Optimizasyon ve Öznitelik Seçimi",
                suggestedPages: "4-5",
                description: "Meta-sezgisel algoritmaların öznitelik seçimindeki kullanımı.",
                keyPoints: [
                    "Wrapper vs. filter vs. embedded öznitelik seçimi",
                    "PSO, GA, GWO ve diğer meta-sezgiseller",
                    "Yarasa Algoritması (BA) ve BSO varyantları",
                    "Hibrit optimizasyon yaklaşımları",
                ],
                tables: ["Meta-sezgisel algoritma karşılaştırma tablosu"],
                figures: ["Öznitelik seçimi yöntemleri taksonomisi"],
                tips: ["BSO'nun diğer meta-sezgisellerden farkını vurgulayın", "Neden BSO seçildiğini gerekçelendirin"],
            },
            {
                title: "2.4 CICIoT2023 Veri Seti",
                suggestedPages: "2-3",
                description: "Kullanılan veri setinin detaylı tanıtımı ve seçim gerekçesi.",
                keyPoints: [
                    "Veri seti oluşturma metodolojisi",
                    "105 IoT cihaz, 33 saldırı türü",
                    "Diğer veri setleriyle karşılaştırma",
                    "Bu çalışmada kullanılan alt küme (5 sınıf, 39 öznitelik)",
                ],
                tables: ["CICIoT2023 veri seti istatistikleri"],
                figures: ["Sınıf dağılımı grafiği"],
                tips: ["Neden bu veri setinin seçildiğini açıklayın", "Orijinal veri setindeki 33 sınıftan 5'ini seçme gerekçesi"],
            },
        ],
    },
    {
        number: 3,
        title: "Materyal ve Yöntem",
        titleEn: "Materials and Methods",
        icon: Brain,
        color: "emerald",
        suggestedPages: "15-20",
        wordCount: "5.000-7.000",
        status: "devam",
        sections: [
            {
                title: "3.1 Veri Seti Hazırlama",
                suggestedPages: "3-4",
                description: "Veri ön işleme, temizleme ve dengeleme adımları.",
                keyPoints: [
                    "CSV dosyalarının yüklenmesi ve birleştirilmesi",
                    "Random undersampling stratejisi",
                    "Stratifiye train/val/test bölme (%70/%10/%20)",
                    "StandardScaler normalizasyon",
                ],
                tables: ["Ön işleme sonrası istatistikler", "Train/Val/Test bölme tablosu"],
                figures: ["Ön işleme pipeline diyagramı"],
                tips: ["Dashboarddaki 'Veri Seti Keşifsel Analizi'ni kullanın", "Her adımı sırayla açıklayın"],
            },
            {
                title: "3.2 SMOTE Dengeleme",
                suggestedPages: "2-3",
                description: "SMOTE ile azınlık sınıf dengeleme.",
                keyPoints: [
                    "Sınıf dengesizliği problemi (7.77:1 oran)",
                    "SMOTE algoritması açıklaması",
                    "72.252 → 87.500 dengeleme sonucu",
                    "Yalnızca eğitim setine uygulama (veri sızıntısı önleme)",
                ],
                tables: ["SMOTE öncesi/sonrası sınıf dağılımı"],
                figures: ["Sınıf dağılımı karşılaştırma grafiği"],
                tips: ["Neden oversampling seçildiğini belirtin", "SMOTE formülünü dahil edin"],
            },
            {
                title: "3.3 BSO Algoritması",
                suggestedPages: "4-5",
                description: "Yarasa Sürüsü Optimizasyonu'nun öznitelik seçimine uyarlanması.",
                keyPoints: [
                    "Orijinal Yarasa Algoritması (Yang, 2010)",
                    "BSO: Binary Bat Swarm Optimization adaptasyonu",
                    "Frekans, hız, pozisyon güncelleme denklemleri",
                    "Sigmoid transfer fonksiyonu ile binary dönüşüm",
                    "Fitness fonksiyonu tasarımı",
                    "BSO parametreleri (pop=25, iter=50, α=0.9, γ=0.9)",
                ],
                tables: ["BSO algoritma parametreleri tablosu"],
                figures: ["BSO akış diyagramı", "Yakınsama eğrisi"],
                tips: ["Dashboarddaki 'Formüller' bileşenini referans alın", "Pseudo-code ekleyin"],
            },
            {
                title: "3.4 Hibrit BSO-RF Çerçevesi",
                suggestedPages: "3-4",
                description: "BSO ile RF hiperparametre optimizasyonunun eşzamanlı gerçekleştirilmesi.",
                keyPoints: [
                    "Eşzamanlı öznitelik seçimi + hiperparametre optimizasyonu",
                    "RF hiperparametre arama uzayı",
                    "Optimize edilen parametreler (n_estimators=266, max_depth=20, vb.)",
                    "Fitness değerlendirme stratejisi",
                ],
                tables: ["Hiperparametre arama uzayı", "Optimize edilen parametreler"],
                figures: ["Hibrit çerçeve diyagramı (Sistem Mimarisi)"],
                tips: ["Bu çalışmanın TEZ katkısı burada — detaylı yazın", "Dashboarddaki 'Sistem Mimarisi'ni kullanın"],
            },
            {
                title: "3.5 Karşılaştırma Modelleri",
                suggestedPages: "2-3",
                description: "Karşılaştırma için kullanılan 12 modelin tanıtımı.",
                keyPoints: [
                    "4 meta-sezgisel (BSO-RF, BSO-SVM, PSO-RF, GA-RF, GWO-RF)",
                    "7 geleneksel ML (RF, SVM, DT, KNN, NB, LR, XGBoost)",
                    "Her modelin kısa açıklaması",
                ],
                tables: ["Model listesi ve konfigürasyonları"],
                figures: [],
                tips: ["Her model için 1-2 paragraf yeterli"],
            },
            {
                title: "3.6 Değerlendirme Metrikleri",
                suggestedPages: "1-2",
                description: "Kullanılan performans metriklerinin tanımı.",
                keyPoints: [
                    "Accuracy, Precision, Recall, F1-Score",
                    "F1-Macro (dengesiz veri için önem)",
                    "AUC-ROC, MCC, Specificity",
                    "Confusion Matrix yorumlama",
                ],
                tables: [],
                figures: [],
                tips: ["Dashboarddaki 'Formüller' bileşenindeki denklemleri kullanın", "Neden F1-Macro'nun önemli olduğunu vurgulayın"],
            },
        ],
    },
    {
        number: 4,
        title: "Bulgular / Deneysel Sonuçlar",
        titleEn: "Results and Discussion",
        icon: BarChart3,
        color: "amber",
        suggestedPages: "20-25",
        wordCount: "7.000-9.000",
        status: "devam",
        sections: [
            {
                title: "4.1 BSO Yakınsama Analizi",
                suggestedPages: "2-3",
                description: "BSO optimizasyon sürecinin analizi.",
                keyPoints: [
                    "50 iterasyonluk yakınsama eğrisi",
                    "Öznitelik sayısının iterasyonla azalması",
                    "Gürültü ve darbe oranı değişimleri",
                    "Optimal çözüme ulaşma hızı",
                ],
                tables: ["İterasyon bazlı yakınsama verileri"],
                figures: ["Yakınsama eğrisi (fitness vs iterasyon)", "Seçilen öznitelik sayısı vs iterasyon"],
                tips: ["Dashboarddaki 'BSO Optimizasyonu' bileşenini kullanın"],
            },
            {
                title: "4.2 Seçilen Öznitelikler",
                suggestedPages: "2-3",
                description: "BSO tarafından seçilen 19 özniteliğin analizi.",
                keyPoints: [
                    "19 seçilen öznitelik listesi ve önem sıralaması",
                    "Elenen 20 özniteliğin analizi",
                    "Ağ trafiği açısından seçilen özniteliklerin anlamı",
                    "Öznitelik önem dağılımı",
                ],
                tables: ["Seçilen öznitelikler ve önem değerleri"],
                figures: ["Öznitelik önem çubuk grafiği"],
                tips: ["Dashboarddaki 'Öznitelik Analizi' ve 'Öznitelik Seçimi' bileşenlerini kullanın"],
            },
            {
                title: "4.3 Model Karşılaştırma Sonuçları",
                suggestedPages: "5-6",
                description: "12 modelin detaylı performans karşılaştırması.",
                keyPoints: [
                    "Ana performans tablosu (tüm metrikler)",
                    "En iyi vs. en kötü model analizi",
                    "Meta-sezgisel modeller arası karşılaştırma",
                    "BSO-RF'nin güçlü ve zayıf yönleri",
                ],
                tables: ["Ana karşılaştırma tablosu (12 model × 10+ metrik)"],
                figures: ["Radar grafiği", "Çubuk grafik karşılaştırması"],
                tips: ["Bu tezin EN ÖNEMLİ bölümü — çok detaylı yazın", "Dashboarddaki tüm karşılaştırma bileşenlerini kullanın"],
            },
            {
                title: "4.4 İstatistiksel Anlamlılık Testleri",
                suggestedPages: "3-4",
                description: "Model farkının istatistiksel doğrulaması.",
                keyPoints: [
                    "McNemar testi sonuçları",
                    "Wilcoxon testi sonuçları",
                    "Cohen's d etki büyüklüğü",
                    "5-fold çapraz doğrulama",
                    "%95 güven aralıkları",
                ],
                tables: ["İkili karşılaştırma tablosu", "CV tablosu"],
                figures: ["Güven aralığı grafiği"],
                tips: ["Dashboarddaki 'İstatistiksel Anlamlılık' bileşenini kullanın"],
            },
            {
                title: "4.5 Karışıklık Matrisi Analizi",
                suggestedPages: "3-4",
                description: "Detaylı sınıf bazlı performans analizi.",
                keyPoints: [
                    "BSO-RF karışıklık matrisi",
                    "Sınıf bazlı precision, recall, f1",
                    "En çok karıştırılan sınıflar",
                    "Yanlış sınıflandırma kalıpları",
                ],
                tables: ["Sınıf bazlı performans tablosu"],
                figures: ["Karışıklık matrisi ısı haritası", "Hata dağılım grafiği"],
                tips: ["Dashboarddaki 'Karışıklık Matrisi' ve 'Hata Analizi' bileşenlerini kullanın"],
            },
            {
                title: "4.6 Ablasyon Çalışması",
                suggestedPages: "2-3",
                description: "Her bileşenin katkısının ayrıştırılması.",
                keyPoints: [
                    "SMOTE etkisi",
                    "BSO etkisi (öznitelik seçimi)",
                    "Hiperparametre optimizasyonu etkisi",
                    "Her bileşenin marjinal katkısı",
                ],
                tables: ["Ablasyon çalışması tablosu"],
                figures: ["Bileşen katkı grafiği"],
                tips: ["Dashboarddaki 'Ablasyon Çalışması' bileşenini kullanın"],
            },
        ],
    },
    {
        number: 5,
        title: "Sonuç ve Öneriler",
        titleEn: "Conclusion and Future Work",
        icon: Target,
        color: "rose",
        suggestedPages: "5-8",
        wordCount: "1.500-2.500",
        status: "planlandı",
        sections: [
            {
                title: "5.1 Sonuçlar",
                suggestedPages: "2-3",
                description: "Tezin ana bulgularının özeti.",
                keyPoints: [
                    "Her araştırma sorusunun yanıtı",
                    "BSO-RF'nin temel performans sonuçları",
                    "Öznitelik azaltma başarısı",
                    "Meta-sezgisel karşılaştırma sonuçları",
                ],
                tables: [],
                figures: [],
                tips: ["Her araştırma sorusunu tek tek yanıtlayın", "Sayısal sonuçlarla destekleyin"],
            },
            {
                title: "5.2 Kısıtlamalar",
                suggestedPages: "1-2",
                description: "Çalışmanın sınırlılıkları.",
                keyPoints: [
                    "5 sınıf alt kümesi (34 sınıfın tamamı değil)",
                    "Tek veri seti üzerinde doğrulama",
                    "Gerçek zamanlı dağıtım testi yapılmadı",
                    "BSO parametre hassasiyeti incelenmedi",
                ],
                tables: [],
                figures: [],
                tips: ["Dürüst olun — kısıtlamaları kabul etmek tezi güçlendirir"],
            },
            {
                title: "5.3 Gelecek Çalışmalar",
                suggestedPages: "1-2",
                description: "Önerilen gelecek araştırma yönleri.",
                keyPoints: [
                    "Tüm 34 CICIoT2023 sınıfında doğrulama",
                    "Çoklu veri seti genelleme (UNSW-NB15, NSL-KDD)",
                    "Gerçek zamanlı IoT gateway entegrasyonu",
                    "Derin öğrenme + BSO hibrit model",
                    "Federe öğrenme ile dağıtık BSO",
                ],
                tables: [],
                figures: [],
                tips: ["Her öneri için 2-3 cümle yeterli", "Uygulanabilir ve spesifik öneriler yapın"],
            },
        ],
    },
]

const colorStyles: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    blue: { border: "border-blue-200 dark:border-blue-800/40", bg: "bg-blue-50/50 dark:bg-blue-950/20", text: "text-blue-700 dark:text-blue-300", badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" },
    purple: { border: "border-purple-200 dark:border-purple-800/40", bg: "bg-purple-50/50 dark:bg-purple-950/20", text: "text-purple-700 dark:text-purple-300", badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" },
    emerald: { border: "border-emerald-200 dark:border-emerald-800/40", bg: "bg-emerald-50/50 dark:bg-emerald-950/20", text: "text-emerald-700 dark:text-emerald-300", badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" },
    amber: { border: "border-amber-200 dark:border-amber-800/40", bg: "bg-amber-50/50 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-300", badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" },
    rose: { border: "border-rose-200 dark:border-rose-800/40", bg: "bg-rose-50/50 dark:bg-rose-950/20", text: "text-rose-700 dark:text-rose-300", badge: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300" },
}

export default function ThesisWritingGuide() {
    const [expandedChapters, setExpandedChapters] = useState<number[]>([1])

    const toggleChapter = (num: number) => {
        setExpandedChapters((prev) => (prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]))
    }

    const totalTables = CHAPTERS.reduce((s, c) => s + c.sections.reduce((s2, sec) => s2 + sec.tables.length, 0), 0)
    const totalFigures = CHAPTERS.reduce((s, c) => s + c.sections.reduce((s2, sec) => s2 + sec.figures.length, 0), 0)

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <FileText className="w-8 h-8 text-sky-500" />
                    Tez Yazım Rehberi
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Bölüm bazında tez yapısı, önerilen tablo/şekiller ve yazım ipuçları — toplam ~{CHAPTERS.reduce((s, c) => s + parseInt(c.suggestedPages.split("-")[1] || c.suggestedPages), 0)} sayfa
                </p>
            </div>

            {/* ════════════════════ GENEL İSTATİSTİK ════════════════════ */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                    { label: "Bölüm", value: `${CHAPTERS.length}`, icon: BookOpen, color: "text-blue-600 dark:text-blue-400" },
                    { label: "Sayfa (Tahmini)", value: "63-85", icon: FileText, color: "text-purple-600 dark:text-purple-400" },
                    { label: "Kelime", value: "21K-30K", icon: Printer, color: "text-emerald-600 dark:text-emerald-400" },
                    { label: "Tablo", value: `${totalTables}+`, icon: Table2, color: "text-amber-600 dark:text-amber-400" },
                    { label: "Şekil", value: `${totalFigures}+`, icon: Image, color: "text-rose-600 dark:text-rose-400" },
                ].map((m) => (
                    <Card key={m.label}>
                        <CardContent className="pt-3 pb-3 text-center">
                            <m.icon className={`w-5 h-5 mx-auto mb-1 ${m.color}`} />
                            <div className={`text-lg font-black ${m.color}`}>{m.value}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{m.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ════════════════════ BÖLÜMLER ════════════════════ */}
            {CHAPTERS.map((ch) => {
                const styles = colorStyles[ch.color]
                const Icon = ch.icon
                const isExpanded = expandedChapters.includes(ch.number)

                return (
                    <Card key={ch.number} className={styles.border}>
                        {/* Header — clickable */}
                        <CardHeader
                            className="cursor-pointer select-none"
                            onClick={() => toggleChapter(ch.number)}
                        >
                            <CardTitle className={`flex items-center gap-2 ${styles.text}`}>
                                <Icon className="w-5 h-5" />
                                Bölüm {ch.number}: {ch.title}
                                <span className="text-xs font-normal text-slate-400">({ch.titleEn})</span>
                                <div className="ml-auto flex items-center gap-2">
                                    <Badge className={`${styles.badge} text-[9px]`}>{ch.suggestedPages} sayfa</Badge>
                                    <Badge className={`${styles.badge} text-[9px]`}>{ch.wordCount} kelime</Badge>
                                    <Badge
                                        className={`text-[9px] ${ch.status === "tamamlandı"
                                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700"
                                                : ch.status === "devam"
                                                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                            }`}
                                    >
                                        {ch.status}
                                    </Badge>
                                    {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                                </div>
                            </CardTitle>
                        </CardHeader>

                        {/* Sections */}
                        {isExpanded && (
                            <CardContent className="space-y-4">
                                {ch.sections.map((sec) => (
                                    <div key={sec.title} className={`p-4 rounded-xl ${styles.bg} border ${styles.border} space-y-2`}>
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{sec.title}</h4>
                                            <Badge variant="outline" className="text-[9px]">{sec.suggestedPages} sayfa</Badge>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{sec.description}</p>

                                        {/* Key points */}
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-slate-500 uppercase">Anahtar Noktalar:</p>
                                            {sec.keyPoints.map((kp, i) => (
                                                <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                    <span>{kp}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tables & Figures */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {sec.tables.map((t, i) => (
                                                <Badge key={i} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[9px]">
                                                    <Table2 className="w-3 h-3 mr-1" />{t}
                                                </Badge>
                                            ))}
                                            {sec.figures.map((f, i) => (
                                                <Badge key={i} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[9px]">
                                                    <Image className="w-3 h-3 mr-1" />{f}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Tips */}
                                        {sec.tips.length > 0 && (
                                            <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/30">
                                                <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400 mb-1">💡 İpuçları:</p>
                                                {sec.tips.map((tip, i) => (
                                                    <p key={i} className="text-[10px] text-amber-700 dark:text-amber-300">• {tip}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        )}
                    </Card>
                )
            })}

            {/* ════════════════════ DASHBOARD REFERANSLARI ════════════════════ */}
            <Card className="border-cyan-200 dark:border-cyan-800/40">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 text-base">
                        <TrendingUp className="w-5 h-5" />
                        Dashboard → Tez Bölümü Eşleştirmesi
                    </CardTitle>
                    <CardDescription>Hangi dashboard bileşeni hangi tez bölümünü destekler</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                            { tab: "Veri Seti Analizi", chapter: "Bölüm 3.1", type: "Tablo + Şekil" },
                            { tab: "BSO Optimizasyonu", chapter: "Bölüm 3.3 & 4.1", type: "Şekil" },
                            { tab: "Öznitelik Analizi", chapter: "Bölüm 4.2", type: "Tablo + Şekil" },
                            { tab: "Öznitelik Seçimi", chapter: "Bölüm 4.2", type: "Tablo" },
                            { tab: "ML Sınıflandırma", chapter: "Bölüm 4.3", type: "Tablo" },
                            { tab: "Model Sıralaması", chapter: "Bölüm 4.3", type: "Tablo + Şekil" },
                            { tab: "Karışıklık Matrisi", chapter: "Bölüm 4.5", type: "Şekil" },
                            { tab: "Hata Analizi", chapter: "Bölüm 4.5", type: "Tablo + Şekil" },
                            { tab: "Ablasyon Çalışması", chapter: "Bölüm 4.6", type: "Tablo" },
                            { tab: "İstatistiksel Testler", chapter: "Bölüm 4.4", type: "Tablo" },
                            { tab: "İlgili Çalışmalar", chapter: "Bölüm 2.2", type: "Tablo" },
                            { tab: "Formüller", chapter: "Bölüm 3.3 & 3.6", type: "Denklemler" },
                            { tab: "Kaynakça", chapter: "Kaynaklar", type: "Referans Listesi" },
                            { tab: "Tez Tabloları", chapter: "Tüm Bölümler", type: "Dışa Aktarım" },
                            { tab: "Sistem Mimarisi", chapter: "Bölüm 3.4", type: "Şekil" },
                        ].map((m) => (
                            <div key={m.tab} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{m.tab}</span>
                                <div className="flex items-center gap-1">
                                    <Badge variant="outline" className="text-[9px]">{m.chapter}</Badge>
                                    <Badge className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-[9px]">{m.type}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
