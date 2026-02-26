"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    MessageCircleQuestion, ChevronDown, ChevronUp, Search,
    BookOpen, Target, Brain, Shield, Database, Layers,
    Award, TrendingUp, AlertTriangle, Lightbulb, Microscope,
    BarChart3, GitCompare, Zap, Globe, Lock, Server,
    CheckCircle2, ArrowRight, Sparkles, GraduationCap,
    HelpCircle, FileQuestion, Star,
} from "lucide-react"
import { MODEL_RESULTS, DATASET_STATISTICS, BSO_PARAMETERS, BSO_SELECTED_FEATURES } from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   Q&A Data — Every possible supervisor question
   ═══════════════════════════════════════════════════════════════ */
interface QAItem {
    id: string
    question: string
    answer: string[]
    keyPoints?: string[]
    category: string
    difficulty: "temel" | "orta" | "ileri"
    icon: React.ElementType
}

const QA_CATEGORIES = [
    { id: "motivation", label: "Motivasyon & Araştırma Boşluğu", icon: Lightbulb, gradient: "from-amber-500 to-orange-600", count: 0 },
    { id: "methodology", label: "Metodoloji & Teknik Detaylar", icon: Microscope, gradient: "from-blue-500 to-indigo-600", count: 0 },
    { id: "dataset", label: "Veri Seti & Ön İşleme", icon: Database, gradient: "from-emerald-500 to-teal-600", count: 0 },
    { id: "algorithm", label: "BSO Algoritması & Hibrit Yaklaşım", icon: Brain, gradient: "from-purple-500 to-violet-600", count: 0 },
    { id: "results", label: "Sonuçlar & Değerlendirme", icon: BarChart3, gradient: "from-rose-500 to-pink-600", count: 0 },
    { id: "comparison", label: "Karşılaştırma & Üstünlük", icon: GitCompare, gradient: "from-cyan-500 to-blue-600", count: 0 },
    { id: "limitations", label: "Sınırlamalar & Gelecek Çalışmalar", icon: AlertTriangle, gradient: "from-red-500 to-orange-600", count: 0 },
    { id: "practical", label: "Pratik Uygulama & Gerçek Dünya", icon: Globe, gradient: "from-teal-500 to-emerald-600", count: 0 },
]

const QA_DATA: QAItem[] = [
    // ══════════════════════════════════════════════════════
    //  MOTIVASYON & ARAŞTIRMA BOŞLUĞU
    // ══════════════════════════════════════════════════════
    {
        id: "m1",
        category: "motivation",
        difficulty: "temel",
        icon: Lightbulb,
        question: "Bu araştırmanın temel motivasyonu nedir? Neden bu konuyu seçtiniz?",
        answer: [
            "DDoS (Dağıtık Hizmet Engelleme) saldırıları, modern ağ altyapılarının en ciddi güvenlik tehditlerinden biridir. 2023 verilerine göre DDoS saldırıları yılda %65 artış göstermektedir.",
            "Geleneksel makine öğrenmesi yöntemleri DDoS tespitinde yüksek boyutlu öznitelik uzaylarıyla çalışırken gereksiz ve gürültülü öznitelikler nedeniyle performans kaybı yaşamaktadır.",
            "Mevcut çalışmalar çoğunlukla tek aşamalı öznitelik seçimi veya sabit hiperparametre kullanan modeller sunmaktadır. Aynı anda hem öznitelik seçimi hem de hiperparametre optimizasyonu yapan hibrit bir çerçeve eksikliği bulunmaktadır.",
            "Bu tez, Yarasa Sürüsü Optimizasyonu (BSO) algoritmasını ilk kez eşzamanlı öznitelik seçimi ve Random Forest hiperparametre optimizasyonu için kullanan yeni bir hibrit çerçeve önermektedir."
        ],
        keyPoints: [
            "DDoS saldırıları yılda %65 artış",
            "Yüksek boyutlu öznitelik uzayı sorunu",
            "Eşzamanlı optimizasyon eksikliği",
            "BSO'nun DDoS tespitinde ilk kez kullanımı"
        ],
    },
    {
        id: "m2",
        category: "motivation",
        difficulty: "temel",
        icon: Target,
        question: "Literatürdeki araştırma boşluğu (research gap) tam olarak nedir?",
        answer: [
            "Literatürdeki ana boşluklar şunlardır:",
            "1) Tek Aşamalı Yaklaşım Sorunu: Mevcut çalışmaların çoğu ya sadece öznitelik seçimi ya da sadece hiperparametre optimizasyonu yapmaktadır. Bu iki sürecin birbirinden bağımsız ele alınması, global optimuma ulaşmayı engellemektedir.",
            "2) BSO'nun DDoS Alanında Kullanılmamış Olması: Yarasa Sürüsü Optimizasyonu algoritması, diğer alanlarda başarı göstermesine rağmen, DDoS tespit sistemlerinde öznitelik seçimi için henüz kullanılmamıştır.",
            "3) CICIoT2023 Veri Seti ile BSO Entegrasyonu: Bu yeni ve kapsamlı IoT güvenlik veri seti üzerinde BSO tabanlı öznitelik seçimi araştırılmamıştır.",
            "4) Eşzamanlı Optimizasyon: Öznitelik seçimi ve sınıflandırıcı hiperparametrelerinin tek bir meta-sezgisel çerçeve içinde birlikte optimize edildiği çalışma sayısı çok azdır.",
            "Bu tez, tüm bu boşlukları kapatacak şekilde BSO-Hibrit RF çerçevesini önermektedir."
        ],
        keyPoints: [
            "Tek aşamalı optimizasyon yetersizliği",
            "BSO'nun DDoS alanında ilk kullanımı",
            "CICIoT2023 + BSO entegrasyonu yeni",
            "Eşzamanlı öznitelik + hiperparametre optimizasyonu eksik"
        ],
    },
    {
        id: "m3",
        category: "motivation",
        difficulty: "orta",
        icon: Award,
        question: "Bu tezin ana katkıları (contributions) nelerdir?",
        answer: [
            "Bu tezin literatüre üç temel katkısı bulunmaktadır:",
            `1) BSO-Hibrit RF Çerçevesi: Yarasa Sürüsü Optimizasyonu algoritmasını Random Forest ile birleştiren yeni bir hibrit çerçeve tasarlanmış ve uygulanmıştır. Bu çerçeve, 39 öznitelikten en bilgilendirici ${DATASET_STATISTICS.selectedFeatures} özniteliği seçerken, aynı anda RF hiperparametrelerini (n_estimators=${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth=${BSO_PARAMETERS.optimizedHyperparameters.max_depth}) optimize etmektedir.`,
            `2) Kapsamlı Karşılaştırmalı Analiz: 12 farklı model (4 meta-sezgisel + 8 geleneksel ML) kapsamlı bir şekilde karşılaştırılmıştır. BSO-Hibrit RF, %${MODEL_RESULTS[0].accuracy} doğruluk ve %${MODEL_RESULTS[0].f1Macro} F1-Makro ile meta-sezgisel tabanlı modeller arasında en iyi performansı göstermiştir.`,
            "3) CICIoT2023 Üzerinde İlk BSO Uygulaması: Bu güncel ve kapsamlı IoT veri seti üzerinde BSO tabanlı optimizasyonun ilk uygulaması gerçekleştirilmiş, SMOTE ile sınıf dengesizliği problemi de ele alınmıştır.",
            "Ek olarak, sonuçların istatistiksel anlamlılığı Friedman ve Nemenyi testleri ile doğrulanmıştır."
        ],
        keyPoints: [
            "Yeni BSO-Hibrit RF çerçevesi",
            "12 model kapsamlı karşılaştırma",
            "CICIoT2023 üzerinde ilk BSO uygulaması",
            "İstatistiksel anlamlılık doğrulaması"
        ],
    },
    {
        id: "m4",
        category: "motivation",
        difficulty: "temel",
        icon: Shield,
        question: "DDoS tespiti neden önemlidir? Gerçek dünyada ne gibi etkiler yaratır?",
        answer: [
            "DDoS saldırıları modern dijital altyapının en büyük tehditlerinden biridir:",
            "• Finansal Kayıp: Bir DDoS saldırısı saatte ortalama $100.000-$500.000 kayba neden olabilir.",
            "• IoT Güvenliği: IoT cihazlarının yaygınlaşmasıyla botnet tabanlı DDoS saldırıları katlanarak artmaktadır (Mirai botnet örneği).",
            "• Kritik Altyapı: Hastaneler, bankalar, enerji sistemleri gibi kritik altyapılar DDoS saldırılarına karşı savunmasızdır.",
            "• Ulusal Güvenlik: Devlet kurumları ve askeri sistemler sürekli DDoS tehdidi altındadır.",
            "Bu nedenle, yüksek doğruluklu ve düşük gecikme süreli DDoS tespit sistemleri kritik öneme sahiptir. Önerilen BSO-Hibrit RF çerçevesi, yüksek doğruluk ile birlikte düşük öznitelik boyutu sayesinde hızlı tespit imkânı sunmaktadır."
        ],
    },

    // ══════════════════════════════════════════════════════
    //  METODOLOJİ & TEKNİK DETAYLAR
    // ══════════════════════════════════════════════════════
    {
        id: "t1",
        category: "methodology",
        difficulty: "orta",
        icon: Microscope,
        question: "Araştırma metodolojinizi adım adım açıklar mısınız?",
        answer: [
            "Araştırma metodolojisi 6 temel aşamadan oluşmaktadır:",
            `Aşama 1 — Veri Toplama: CICIoT2023 veri setinden ${DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} örnek, ${DATASET_STATISTICS.totalFeatures} öznitelik ve ${DATASET_STATISTICS.classes} sınıf kullanılmıştır.`,
            `Aşama 2 — Veri Ön İşleme: Eksik değer kontrolü, aykırı değer tespiti, ve StandardScaler ile normalizasyon yapılmıştır. Veri seti ${DATASET_STATISTICS.splitRatio} oranında bölünmüştür.`,
            `Aşama 3 — SMOTE Dengeleme: Azınlık sınıfı (Backdoor_Malware: ${DATASET_STATISTICS.originalMinorityCount} örnek) sentetik örneklerle ${DATASET_STATISTICS.balancedClassCount}'e çıkarılmıştır (72.252 → 87.500).`,
            `Aşama 4 — BSO Optimizasyonu: Pop=${BSO_PARAMETERS.populationSize}, İter=${BSO_PARAMETERS.maxIterations} ile yarasa sürüsü optimizasyonu çalıştırılmıştır. Her yarasa, bir öznitelik alt kümesi ve RF hiperparametre seti kodlamaktadır.`,
            `Aşama 5 — Model Eğitimi: BSO'nun bulduğu en iyi ${DATASET_STATISTICS.selectedFeatures} öznitelik ve optimal hiperparametrelerle RF modeli eğitilmiştir.`,
            "Aşama 6 — Değerlendirme: Doğruluk, F1-Makro, AUC-ROC, MCC, çapraz doğrulama ve istatistiksel testler ile kapsamlı değerlendirme yapılmıştır."
        ],
        keyPoints: [
            "6 aşamalı sistematik metodoloji",
            "SMOTE ile sınıf dengesizliği çözümü",
            "BSO ile eşzamanlı optimizasyon",
            "Kapsamlı değerlendirme metrikleri"
        ],
    },
    {
        id: "t2",
        category: "methodology",
        difficulty: "ileri",
        icon: Target,
        question: "Uygunluk fonksiyonu (fitness function) nasıl tasarlandı ve neden?",
        answer: [
            `Uygunluk fonksiyonu şu şekilde tanımlanmıştır: ${BSO_PARAMETERS.fitnessFunction}`,
            "Bu tasarım iki temel hedefi dengelemektedir:",
            "1) Sınıflandırma Performansı (1 - F1_macro): F1-Makro skoru kullanılmasının nedeni, dengesiz sınıf dağılımlarında her sınıfın eşit ağırlıkla değerlendirilmesini sağlamaktır. Doğruluk (accuracy) yerine F1-Makro tercih edilmiştir çünkü doğruluk, çoğunluk sınıfına yanlı olabilir.",
            "2) Öznitelik Seçimi Cezası (0.01 * n_selected / n_total): Bu terim, daha az öznitelik kullanan çözümleri ödüllendirmektedir. 0.01 katsayısı, öznitelik sayısının performanstan çok daha düşük ağırlıkta olmasını sağlar.",
            "Minimizasyon problemi olarak formüle edilmiştir: En iyi çözüm, en yüksek F1-Makro ile en az öznitelik sayısını birleştirendir.",
            "Bu çok-amaçlı uygunluk fonksiyonu, ağırlıklı toplam (weighted sum) yöntemiyle skaler hale getirilmiştir."
        ],
        keyPoints: [
            "F1-Makro: Dengesiz sınıflar için ideal",
            "Öznitelik cezası: %1 ağırlık",
            "Minimizasyon problemi",
            "Çok-amaçlı → tek-amaçlı dönüşüm"
        ],
    },
    {
        id: "t3",
        category: "methodology",
        difficulty: "ileri",
        icon: Layers,
        question: "Çapraz doğrulama stratejiniz nedir? Aşırı öğrenmeyi nasıl önlediniz?",
        answer: [
            "Aşırı öğrenmeyi önlemek için çok katmanlı bir strateji uygulanmıştır:",
            "1) Katmanlı Bölme (Stratified Split): Veri seti 70/10/20 oranında eğitim/doğrulama/test olarak bölünmüştür. Stratified yöntem, her bölmede sınıf oranlarının korunmasını sağlar.",
            "2) 5-Katlı Çapraz Doğrulama: BSO optimizasyonu sırasında uygunluk değerlendirmesi doğrulama seti üzerinde yapılmıştır. Ayrıca, nihai model 5-katlı çapraz doğrulama ile test edilmiştir.",
            "3) Erken Durdurma Benzeri Mekanizma: BSO'da yakınsama eşiği (convergence threshold = 1e-6) kullanılmıştır. Ardışık iterasyonlarda iyileşme bu eşiğin altında kalırsa, algoritma yakınsamış kabul edilir.",
            "4) SMOTE Sadece Eğitim Setinde: SMOTE yalnızca eğitim setine uygulanmıştır; test seti hiçbir zaman modifiye edilmemiştir. Bu, veri sızıntısını (data leakage) önler.",
            "5) Bağımsız Test Seti: Nihai performans değerlendirmesi, modelin hiçbir aşamada görmediği 20.644 örneklik bağımsız test seti üzerinde yapılmıştır."
        ],
        keyPoints: [
            "Stratified 70/10/20 bölme",
            "5-katlı çapraz doğrulama",
            "SMOTE sadece eğitim setinde",
            "Bağımsız test seti değerlendirmesi"
        ],
    },
    {
        id: "t4",
        category: "methodology",
        difficulty: "orta",
        icon: BarChart3,
        question: "Değerlendirme metrikleri olarak neden bu metrikleri seçtiniz?",
        answer: [
            "Kapsamlı bir değerlendirme için birbirini tamamlayan çoklu metrikler kullanılmıştır:",
            `• Doğruluk (Accuracy = %${MODEL_RESULTS[0].accuracy}): Genel doğru sınıflandırma oranı. Tek başına yeterli değildir çünkü dengesiz sınıflarda yanıltıcı olabilir.`,
            `• F1-Makro (%${MODEL_RESULTS[0].f1Macro}): Her sınıfın F1 skorunun ortalaması. Dengesiz veri setlerinde en adil metrik olarak kabul edilir.`,
            `• F1-Ağırlıklı (%${MODEL_RESULTS[0].f1Score}): Sınıf boyutuna göre ağırlıklandırılmış F1. Büyük sınıflara daha fazla ağırlık verir.`,
            `• AUC-ROC (%${MODEL_RESULTS[0].aucRoc}): Eşik bağımsız performans ölçümü. %98.38 değeri, modelin mükemmel ayırt edici kapasiteye sahip olduğunu gösterir.`,
            `• MCC (${MODEL_RESULTS[0].mcc}): Matthews Korelasyon Katsayısı, dengesiz sınıflarda bile güvenilir tek bir skordur. +1 mükemmel, 0 rastgele.`,
            "• Kesinlik (Precision) ve Duyarlılık (Recall): Yanlış pozitif ve yanlış negatif oranlarını ayrı ayrı gösterir.",
            "• Özgüllük (Specificity): Negatif sınıfların doğru sınıflandırılma oranı.",
            "Bu çoklu metrik yaklaşımı, sonuçların güvenilirliğini ve kapsamlılığını garanti altına almaktadır."
        ],
    },

    // ══════════════════════════════════════════════════════
    //  VERİ SETİ & ÖN İŞLEME
    // ══════════════════════════════════════════════════════
    {
        id: "d1",
        category: "dataset",
        difficulty: "temel",
        icon: Database,
        question: "Neden CICIoT2023 veri setini seçtiniz? Diğer veri setlerinden farkı nedir?",
        answer: [
            "CICIoT2023 veri setinin seçim nedenleri şunlardır:",
            "1) Güncellik: 2023 yılında yayınlanan en güncel IoT ağ güvenliği veri setlerinden biridir. Eski veri setleri (NSL-KDD 1999, CIC-IDS-2017) artık modern saldırı kalıplarını yansıtmamaktadır.",
            "2) IoT Odaklı: IoT cihazlarından gerçek ağ trafiği toplanmıştır. IoT DDoS saldırılarının artması nedeniyle bu odak kritik öneme sahiptir.",
            "3) Çeşitli Saldırı Türleri: DDoS-ACK_Fragmentation, DDoS-SYN_Flood, Backdoor_Malware, Recon-PortScan ve BenignTraffic sınıflarını içermektedir.",
            `4) Gerçekçi Öznitelikler: ${DATASET_STATISTICS.totalFeatures} öznitelik, gerçek ağ trafiğinden çıkarılmıştır (paket boyutu, bayrak sayıları, protokol türleri, inter-arrival time vb.).`,
            "5) Akademik Kabul: Canadian Institute for Cybersecurity (CIC) tarafından yayınlanmıştır ve akademik toplulukte yaygın olarak referans alınmaktadır.",
            "6) Tekrarlanabilirlik: Açık erişimli olması, araştırmanın tekrarlanabilirliğini garanti altına almaktadır."
        ],
        keyPoints: [
            "2023 — En güncel IoT güvenlik veri seti",
            "Gerçek IoT ağ trafiği",
            "5 çeşitli saldırı sınıfı",
            "CIC tarafından akademik güvenilirlik"
        ],
    },
    {
        id: "d2",
        category: "dataset",
        difficulty: "orta",
        icon: Layers,
        question: "SMOTE nedir ve neden kullandınız? Diğer dengeleme yöntemlerinden farkı nedir?",
        answer: [
            "SMOTE (Synthetic Minority Over-sampling Technique), azınlık sınıfı için sentetik örnekler üreten bir aşırı örnekleme yöntemidir.",
            `Kullanım Nedeni: Orijinal veri setinde Backdoor_Malware sınıfı yalnızca ${DATASET_STATISTICS.originalMinorityCount} örnekle temsil edilirken, DDoS sınıfları 17.500 örnekle temsil edilmekteydi. Bu dengesizlik, modelin azınlık sınıfını ihmal etmesine neden olmaktadır.`,
            `SMOTE ile eğitim seti 72.252'den ${DATASET_STATISTICS.balancedClassCount * DATASET_STATISTICS.classes}'e (${DATASET_STATISTICS.balancedClassCount} × ${DATASET_STATISTICS.classes} sınıf) çıkarılmıştır.`,
            "Neden SMOTE?",
            "• Random Oversampling: Birebir kopya oluşturur → aşırı öğrenme riski yüksek.",
            "• Random Undersampling: Veri kaybına neden olur → bilgi kaybı.",
            "• SMOTE: En yakın komşular arasında enterpolasyon ile yeni, benzersiz sentetik örnekler üretir → aşırı öğrenme riskini azaltır.",
            "• ADASYN/BorderlineSMOTE: Daha karmaşık ama bu çalışmada SMOTE yeterli performans sağlamıştır.",
            "Kritik Not: SMOTE yalnızca eğitim setine uygulanmıştır. Test seti orijinal dağılımını korumuştur (veri sızıntısı önlendi)."
        ],
        keyPoints: [
            "Azınlık sınıfı: 2.252 → 17.500",
            "Sentetik enterpolasyon yöntemi",
            "Sadece eğitim setine uygulandı",
            "Veri sızıntısı önlendi"
        ],
    },
    {
        id: "d3",
        category: "dataset",
        difficulty: "orta",
        icon: Shield,
        question: "Veri sızıntısını (data leakage) nasıl önlediniz?",
        answer: [
            "Veri sızıntısı, modelin test verisinden bilgi edinmesi durumudur ve sonuçları geçersiz kılar. Bunu önlemek için şu adımlar atılmıştır:",
            "1) Bölme Önceliği: Veri seti ÖNCE train/val/test olarak bölünmüş, SONRA SMOTE uygulanmıştır. Böylece test seti hiçbir zaman sentetik veri içermez.",
            "2) Normalizasyon Sırası: StandardScaler sadece eğitim setine fit edilmiş, aynı parametrelerle doğrulama ve test setlerine transform uygulanmıştır.",
            "3) Öznitelik Seçimi: BSO optimizasyonu doğrulama seti üzerinde yapılmıştır, test seti hiçbir zaman görülmemiştir.",
            "4) Hiperparametre Optimizasyonu: BSO'nun hiperparametre araması da doğrulama seti üzerinde gerçekleştirilmiştir.",
            "5) Stratified Bölme: Tüm bölmelerde sınıf oranlarının korunması sağlanmıştır.",
            "Bu önlemler, raporlanan performans değerlerinin gerçek dünya performansını doğru yansıtmasını garanti altına almaktadır."
        ],
    },

    // ══════════════════════════════════════════════════════
    //  BSO ALGORİTMASI & HİBRİT YAKLAŞIM
    // ══════════════════════════════════════════════════════
    {
        id: "a1",
        category: "algorithm",
        difficulty: "temel",
        icon: Brain,
        question: "Yarasa Sürüsü Optimizasyonu (BSO) nedir ve nasıl çalışır?",
        answer: [
            "Yarasa Sürüsü Optimizasyonu (Bat Swarm Optimization), yarasaların ekolokasyon davranışını taklit eden bir meta-sezgisel optimizasyon algoritmasıdır. 2010 yılında Xin-She Yang tarafından önerilmiştir.",
            "Temel çalışma prensibi:",
            `• Popülasyon: ${BSO_PARAMETERS.populationSize} yarasa, çözüm uzayında rastgele konumlarla başlar.`,
            `• Frekans: Her yarasa, [${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}] aralığında bir frekans ile uçar. Frekans, hareket hızını belirler.`,
            `• Ses Yüksekliği (Loudness = ${BSO_PARAMETERS.initialLoudness}): Yarasanın keşif kapasitesini kontrol eder. Başlangıçta yüksek (keşif), zamanla azalır (sömürü).`,
            `• Darbe Hızı (Pulse Rate = ${BSO_PARAMETERS.initialPulseRate}): Yerel arama olasılığını belirler. Başlangıçta düşük, zamanla artar.`,
            `• α (${BSO_PARAMETERS.alpha}) ve γ (${BSO_PARAMETERS.gamma}): Loudness azalma ve pulse rate artma katsayıları.`,
            `• İterasyon: ${BSO_PARAMETERS.maxIterations} iterasyon boyunca yarasalar en iyi çözüme yakınsar.`,
            "BSO'nun avantajı, keşif (exploration) ve sömürü (exploitation) dengesi arasında otomatik geçiş yapabilmesidir."
        ],
        keyPoints: [
            "Ekolokasyon tabanlı meta-sezgisel",
            "Keşif ↔ sömürü otomatik dengesi",
            "Frekans, ses ve darbe hızı parametreleri",
            "25 yarasa × 50 iterasyon"
        ],
    },
    {
        id: "a2",
        category: "algorithm",
        difficulty: "ileri",
        icon: GitCompare,
        question: "BSO'yu neden PSO, GA ve GWO yerine tercih ettiniz?",
        answer: [
            "BSO'nun diğer meta-sezgisel algoritmalara göre avantajları:",
            "1) Frekans Tabanlı Uyarlanabilirlik: PSO sabit hız güncelleme kuralları kullanırken, BSO frekans parametresi sayesinde arama adımını dinamik olarak ayarlar.",
            "2) Otomatik Keşif-Sömürü Dengesi: GA crossover/mutasyon oranlarını manuel ayarlamayı gerektirirken, BSO loudness ve pulse rate mekanizmalarıyla bu dengeyi otomatik yönetir.",
            "3) Daha Az Parametre: GWO'nun hiyerarşik yapısı (α, β, δ kurt) ek karmaşıklık eklerken, BSO'nun parametre sayısı göreceli olarak azdır.",
            "4) Deneysel Doğrulama: Bu tezde 4 meta-sezgisel algoritma doğrudan karşılaştırılmıştır:",
            `   • BSO-Hibrit RF: %${MODEL_RESULTS[0].accuracy} doğruluk, %${MODEL_RESULTS[0].f1Macro} F1-Makro, ${MODEL_RESULTS[0].featuresUsed} öznitelik`,
            `   • PSO-RF: %${MODEL_RESULTS[2].accuracy} doğruluk, %${MODEL_RESULTS[2].f1Macro} F1-Makro, ${MODEL_RESULTS[2].featuresUsed} öznitelik`,
            `   • GA-RF: %${MODEL_RESULTS[3].accuracy} doğruluk, %${MODEL_RESULTS[3].f1Macro} F1-Makro, ${MODEL_RESULTS[3].featuresUsed} öznitelik`,
            `   • GWO-RF: %${MODEL_RESULTS[4].accuracy} doğruluk, %${MODEL_RESULTS[4].f1Macro} F1-Makro, ${MODEL_RESULTS[4].featuresUsed} öznitelik`,
            "BSO-Hibrit RF, en az öznitelikle (19) rekabetçi sonuçlar elde etmiştir. Özellikle hibrit optimizasyon (öznitelik + hiperparametre) BSO'yu öne çıkarmaktadır."
        ],
        keyPoints: [
            "Dinamik frekans ayarlaması",
            "Otomatik keşif-sömürü dengesi",
            "Daha az parametre ihtiyacı",
            "Deneysel olarak en iyi boyut azaltma (19/39)"
        ],
    },
    {
        id: "a3",
        category: "algorithm",
        difficulty: "ileri",
        icon: Zap,
        question: "Hibrit yaklaşım tam olarak ne anlama geliyor? İki ayrı optimizasyon değil mi?",
        answer: [
            "Hayır, bu iki ayrı optimizasyon DEĞİLDİR. Hibrit yaklaşımın ayırt edici özelliği eşzamanlılıktır:",
            `Kodlama Yapısı: Her yarasa, ${BSO_PARAMETERS.dimensions} boyutlu bir vektör taşır. Bu vektörün:`,
            `• İlk ${DATASET_STATISTICS.totalFeatures} boyutu: Öznitelik seçimi (ikili: 0/1, eşik ≥ 0.5 → seçili)`,
            "• Ek boyutlar: RF hiperparametreleri (n_estimators, max_depth, min_samples_split, max_features)",
            "Tek Uygunluk Değerlendirmesi: Her yarasa pozisyonu değerlendirildiğinde, o pozisyondaki öznitelik alt kümesi VE hiperparametreler birlikte kullanılarak bir RF modeli eğitilir ve F1-Makro hesaplanır.",
            "Bu yaklaşımın avantajı: Öznitelik alt kümesi ile hiperparametreler arasındaki etkileşimi (interaction effect) yakalayabilmesidir. Örneğin, bazı öznitelik kombinasyonları belirli hiperparametrelerle daha iyi çalışabilir.",
            "Geleneksel ardışık yaklaşımda (önce öznitelik seç, sonra hiperparametre ayarla), bu etkileşim kaybolur. Hibrit yaklaşım, global optimal çözüme daha yakın sonuçlar üretir.",
            `Sonuç: ${DATASET_STATISTICS.selectedFeatures} öznitelik + n_estimators=${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth=${BSO_PARAMETERS.optimizedHyperparameters.max_depth} birlikte optimize edilmiştir.`
        ],
        keyPoints: [
            "Eşzamanlı optimizasyon (ardışık değil)",
            "Tek vektörde öznitelik + hiperparametre",
            "Etkileşim etkilerini yakalar",
            "Global optimuma daha yakın"
        ],
    },
    {
        id: "a4",
        category: "algorithm",
        difficulty: "orta",
        icon: Brain,
        question: "Random Forest'ı neden temel sınıflandırıcı olarak seçtiniz?",
        answer: [
            "Random Forest'ın temel sınıflandırıcı olarak seçilme nedenleri:",
            "1) Topluluk Öğrenmesi (Ensemble Learning): Birden fazla karar ağacının birleşimi, tek bir ağaca göre daha güvenilir ve kararlı sonuçlar üretir.",
            "2) Aşırı Öğrenmeye Dayanıklılık: Bagging (Bootstrap Aggregating) mekanizması, bireysel ağaçların aşırı öğrenmesini dengeleyerek genel modelin genelleme kapasitesini artırır.",
            "3) Öznitelik Önemi Çıkarımı: RF doğal olarak öznitelik önem sıralaması üretir, bu BSO'nun öznitelik seçimi ile uyumludur.",
            "4) Yüksek Boyutluluk Toleransı: Yüksek boyutlu öznitelik uzaylarında bile iyi performans gösterir.",
            "5) Paralel Eğitim: Ağaçlar bağımsız eğitilebilir, hesaplama süresini kısaltır.",
            `6) Deneysel Kanıt: Tüm 39 öznitelikle bile RF %${MODEL_RESULTS[5].accuracy} doğruluk elde etmiştir. BSO optimizasyonu ile bu değer %${MODEL_RESULTS[0].accuracy}'ye (ve F1-Makro %${MODEL_RESULTS[5].f1Macro}'den %${MODEL_RESULTS[0].f1Macro}'e) yükselmiştir.`,
            "7) Ağ Güvenliği Uygunluğu: Ağ trafiği verileri genellikle non-linear ilişkiler içerir ve RF bu tür ilişkileri etkili bir şekilde modelleyebilir."
        ],
    },
    {
        id: "a5",
        category: "algorithm",
        difficulty: "ileri",
        icon: Target,
        question: "BSO hiperparametrelerini (pop=25, iter=50) nasıl belirlediniz?",
        answer: [
            "BSO hiperparametrelerinin belirlenmesi sistematik bir süreçle gerçekleştirilmiştir:",
            `Popülasyon Boyutu (${BSO_PARAMETERS.populationSize}):`,
            "• Literatür önerisi: meta-sezgisel algoritmalar için 20-50 arasında yaygın.",
            "• Çok küçük popülasyon → erken yakınsama, yerel minimumda takılma → çeşitlilik yetersiz.",
            "• Çok büyük popülasyon → hesaplama maliyeti artar, her iterasyonda N×RF eğitimi gerekir.",
            "• 25: İyi bir keşif-hesaplama dengesi sağlar.",
            `Maksimum İterasyon (${BSO_PARAMETERS.maxIterations}):`,
            "• Yakınsama analizi: Deneysel olarak ~30. iterasyonda yakınsama gözlenmiştir.",
            "• 50 iterasyon: Yakınsamanın sağlanması için yeterli marj bırakır.",
            "• Yakınsama eşiği (1e-6) sayesinde erken durdurma mekanizması da mevcuttur.",
            `Frekans Aralığı [${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}]: Orijinal BSO makalesindeki öneriye uygun.`,
            `Ses Yüksekliği (${BSO_PARAMETERS.initialLoudness}) ve Darbe Hızı (${BSO_PARAMETERS.initialPulseRate}): Yüksek başlangıç loudness (keşif) ve düşük pulse rate (geniş arama), zamanla ters çevrilir (sömürü).`,
            `α=${BSO_PARAMETERS.alpha}, γ=${BSO_PARAMETERS.gamma}: Loudness azalma ve pulse rate artma hızını kontrol eder. Literatürde yaygın olarak 0.9 kullanılır.`
        ],
    },

    // ══════════════════════════════════════════════════════
    //  SONUÇLAR & DEĞERLENDİRME
    // ══════════════════════════════════════════════════════
    {
        id: "r1",
        category: "results",
        difficulty: "temel",
        icon: Award,
        question: "BSO-Hibrit RF'nin ana sonuçları nelerdir?",
        answer: [
            `BSO-Hibrit RF modeli test seti üzerinde aşağıdaki sonuçları elde etmiştir:`,
            `• Doğruluk (Accuracy): %${MODEL_RESULTS[0].accuracy}`,
            `• Kesinlik (Precision): %${MODEL_RESULTS[0].precision}`,
            `• Duyarlılık (Recall): %${MODEL_RESULTS[0].recall}`,
            `• F1-Ağırlıklı (F1-Weighted): %${MODEL_RESULTS[0].f1Score}`,
            `• F1-Makro (F1-Macro): %${MODEL_RESULTS[0].f1Macro}`,
            `• AUC-ROC: %${MODEL_RESULTS[0].aucRoc}`,
            `• MCC: ${MODEL_RESULTS[0].mcc}`,
            `• Özgüllük (Specificity): %${MODEL_RESULTS[0].specificity}`,
            `• Öznitelik Sayısı: ${MODEL_RESULTS[0].featuresUsed}/${DATASET_STATISTICS.totalFeatures} (%${DATASET_STATISTICS.featureReductionPct} azaltma)`,
            `• Eğitim Süresi: ${MODEL_RESULTS[0].trainingTime} saniye`,
            `• Tahmin Süresi: ${MODEL_RESULTS[0].predictionTime} saniye/örnek`,
            "Bu sonuçlar, BSO-Hibrit RF'nin yüksek doğrulukla birlikte verimli bir öznitelik alt kümesi kullandığını göstermektedir."
        ],
    },
    {
        id: "r2",
        category: "results",
        difficulty: "orta",
        icon: BarChart3,
        question: "İstatistiksel anlamlılık testleri uyguladınız mı? Sonuçlar ne gösteriyor?",
        answer: [
            "Evet, sonuçların istatistiksel anlamlılığı titizlikle doğrulanmıştır:",
            "1) Friedman Testi: 12 modelin performansını karşılaştırmak için kullanılmıştır. Bu non-parametrik test, modeller arasında anlamlı fark olup olmadığını belirler.",
            "   - H₀: Tüm modeller eşit performans gösterir.",
            "   - p-değeri < 0.05 → H₀ reddedilir → modeller arasında anlamlı fark vardır.",
            "2) Nemenyi Post-Hoc Testi: Friedman testi anlamlı fark gösterdiğinde, hangi model çiftleri arasında fark olduğunu belirlemek için Nemenyi testi uygulanmıştır.",
            "3) 5-Katlı Çapraz Doğrulama: Sonuçların tek bir veri bölmesine bağımlı olmadığı doğrulanmıştır. Standart sapma değerleri düşük çıkmıştır, bu da modelin kararlılığını gösterir.",
            "4) Güven Aralıkları: %95 güven aralıkları hesaplanmış, BSO-Hibrit RF'nin tutarlı performans gösterdiği doğrulanmıştır.",
            "Bu kapsamlı istatistiksel doğrulama, sonuçların şansa bağlı olmadığını ve bilimsel olarak geçerli olduğunu kanıtlamaktadır."
        ],
        keyPoints: [
            "Friedman testi: Modeller arası anlamlı fark",
            "Nemenyi post-hoc: İkili karşılaştırmalar",
            "5-katlı çapraz doğrulama kararlılığı",
            "%95 güven aralıkları"
        ],
    },
    {
        id: "r3",
        category: "results",
        difficulty: "ileri",
        icon: Microscope,
        question: "Öznitelik seçimi sonuçlarını nasıl yorumluyorsunuz? En önemli öznitelikler nelerdir?",
        answer: [
            `BSO, ${DATASET_STATISTICS.totalFeatures} öznitelikten ${DATASET_STATISTICS.selectedFeatures} öznitelik seçmiştir. En önemli öznitelikler ve yorumları:`,
            `1) syn_count (İmportance: ${BSO_SELECTED_FEATURES[0].importance.toFixed(4)}): SYN paket sayısı — DDoS-SYN Flood saldırılarının doğrudan göstergesi. En yüksek önem skoru beklenen bir sonuçtur.`,
            `2) Number (${BSO_SELECTED_FEATURES[1].importance.toFixed(4)}): Paket sayısı — Yüksek hacimli DDoS saldırılarını tespit eder.`,
            `3) Tot sum (${BSO_SELECTED_FEATURES[2].importance.toFixed(4)}): Toplam paket boyutu — Trafik hacmi anomalisi göstergesi.`,
            `4) Rate (${BSO_SELECTED_FEATURES[3].importance.toFixed(4)}): Paket hızı — Anlık trafik yoğunluğu, DDoS'un belirgin özelliği.`,
            `5) Max (${BSO_SELECTED_FEATURES[4].importance.toFixed(4)}): Maksimum paket boyutu — Fragmentation saldırılarını tespit eder.`,
            "Yorumlar:",
            "• İlk 5 öznitelik toplam önemin ~%75'ini oluşturmaktadır → Pareto prensibi.",
            "• Ağ bayrakları (SYN, PSH, FIN) ve protokol göstergeleri (HTTP, HTTPS, DNS) birlikte değerlendirildiğinde, model hem hacimsel hem de protokol tabanlı saldırıları tespit edebilmektedir.",
            "• 20 özniteliğin elenmesi (%51.3 azaltma) modelin hesaplama maliyetini önemli ölçüde düşürürken, doğruluğu korumaktadır."
        ],
    },

    // ══════════════════════════════════════════════════════
    //  KARŞILAŞTIRMA & ÜSTÜNLÜK
    // ══════════════════════════════════════════════════════
    {
        id: "c1",
        category: "comparison",
        difficulty: "temel",
        icon: GitCompare,
        question: "BSO-Hibrit RF'yi diğer 11 modelle nasıl karşılaştırdınız?",
        answer: [
            "12 model 4 kategoride karşılaştırılmıştır:",
            "Kategori 1 — BSO Tabanlı Modeller: BSO-Hibrit RF ve BSO-SVM (aynı öznitelik seti, farklı sınıflandırıcı).",
            "Kategori 2 — Diğer Meta-Sezgisel + RF: PSO-RF, GA-RF, GWO-RF (aynı sınıflandırıcı, farklı optimizasyon).",
            "Kategori 3 — Geleneksel ML (tüm öznitelikler): RF, SVM, DT, KNN, NB, LR, XGBoost.",
            "Karşılaştırma kriterleri:",
            "• Sınıflandırma performansı (doğruluk, F1-Makro, AUC-ROC, MCC)",
            "• Boyut azaltma etkinliği (seçilen öznitelik sayısı)",
            "• Hesaplama verimliliği (eğitim ve tahmin süresi)",
            "• Genelleme kapasitesi (çapraz doğrulama sonuçları)",
            `Sonuç: BSO-Hibrit RF, %${MODEL_RESULTS[0].accuracy} doğruluk ile meta-sezgisel modeller arasında en yüksek performansı göstermiştir. Ayrıca sadece ${MODEL_RESULTS[0].featuresUsed} öznitelik kullanarak en düşük boyutluluğu sağlamıştır.`
        ],
    },
    {
        id: "c2",
        category: "comparison",
        difficulty: "orta",
        icon: TrendingUp,
        question: "XGBoost (%90.37) BSO-Hibrit RF'den (%89.82) daha yüksek doğruluk gösteriyor. Bu nasıl açıklanır?",
        answer: [
            "Bu çok önemli bir gözlemdir ve akademik dürüstlük açısından detaylı ele alınmalıdır:",
            `1) Doğruluk Farkı Minimal: %${MODEL_RESULTS[11].accuracy} vs %${MODEL_RESULTS[0].accuracy} = sadece %0.55 fark. Bu, 20.644 örneklik test setinde ~113 örneklik farka karşılık gelir.`,
            "2) Öznitelik Boyutu Avantajı: XGBoost tüm 39 özniteliği kullanırken, BSO-Hibrit RF sadece 19 öznitelik kullanmaktadır. Bu %51.3'lük azaltma, gerçek dünya uygulamalarında kritik avantaj sağlar:",
            "   • Daha hızlı tahmin süresi (daha az öznitelik hesaplaması)",
            "   • Daha düşük bellek kullanımı",
            "   • Daha az veri toplama gereksinimi",
            "   • Model yorumlanabilirliği artar",
            "3) F1-Makro Karşılaştırması: BSO-Hibrit RF'nin F1-Makro'su %84.24, XGBoost'unki %84.74 — fark sadece %0.50.",
            "4) MCC Karşılaştırması: BSO-Hibrit RF MCC=0.8676, XGBoost MCC=0.8742 — ihmal edilebilir fark.",
            "5) Tezin Ana Argümanı: BSO-Hibrit RF, XGBoost ile neredeyse eşdeğer performansı YARISINI öznitelikle elde etmektedir. Bu, boyut azaltma + performans dengesi açısından üstün bir çerçeve sunar.",
            "6) İstatistiksel Anlamlılık: Bu fark, istatistiksel testlerde anlamlı bulunmamıştır — yani performanslar istatistiksel olarak eşdeğerdir.",
            "Sonuç: Tez öznitelik seçimi + hiperparametre optimizasyonu çerçevesi önermektedir, en yüksek doğruluğu iddia etmemektedir. Boyut azaltma ile rekabetçi performans ana katkıdır."
        ],
        keyPoints: [
            "Fark sadece %0.55 (istatistiksel olarak anlamsız)",
            "BSO-RF: 19 öznitelik vs XGBoost: 39 öznitelik",
            "Boyut azaltma asıl katkı",
            "Akademik dürüstlük: sınırlama olarak belirtildi"
        ],
    },
    {
        id: "c3",
        category: "comparison",
        difficulty: "orta",
        icon: Award,
        question: "BSO-Hibrit RF'nin GWO-RF'den (%89.80) farkı çok az. Bu anlamlı mı?",
        answer: [
            `BSO-Hibrit RF (%${MODEL_RESULTS[0].accuracy}) ile GWO-RF (%${MODEL_RESULTS[4].accuracy}) arasındaki fark sadece %0.02'dir. Bu doğrudan doğruluk karşılaştırması yapıldığında minimal bir farktır. Ancak:`,
            `1) Öznitelik Sayısı Farkı: BSO-RF ${MODEL_RESULTS[0].featuresUsed} öznitelik, GWO-RF ${MODEL_RESULTS[4].featuresUsed} öznitelik kullanmaktadır. BSO 4 öznitelik daha az kullanarak aynı performansı sağlamıştır.`,
            `2) F1-Makro: BSO-RF %${MODEL_RESULTS[0].f1Macro} vs GWO-RF %${MODEL_RESULTS[4].f1Macro} — burada GWO-RF hafif üstün, fark %0.11.`,
            "3) Hibrit Avantaj: BSO eşzamanlı öznitelik + hiperparametre optimizasyonu yaparken, GWO sadece öznitelik seçimi yapmıştır. BSO daha az boyutla aynı performansı elde etmiştir.",
            "4) Tezin Pozisyonu: BSO-Hibrit RF'nin ana katkısı en yüksek doğruluk değil, eşzamanlı optimizasyon çerçevesidir. Daha az öznitelikle rekabetçi performans, pratik avantaj sağlar.",
            "5) İstatistiksel Eşdeğerlik: Bu iki model arasındaki fark istatistiksel olarak anlamlı değildir, performansları eşdeğer kabul edilebilir."
        ],
    },

    // ══════════════════════════════════════════════════════
    //  SINIRLAMALAR & GELECEK ÇALIŞMALAR
    // ══════════════════════════════════════════════════════
    {
        id: "l1",
        category: "limitations",
        difficulty: "temel",
        icon: AlertTriangle,
        question: "Bu çalışmanın sınırlamaları nelerdir?",
        answer: [
            "Her bilimsel çalışma gibi, bu tezin de bilinen sınırlamaları vardır:",
            "1) Tek Veri Seti: Deneyler yalnızca CICIoT2023 veri seti üzerinde gerçekleştirilmiştir. Diğer veri setlerinde (örn. CIC-IDS-2018, UNSW-NB15) sonuçlar farklılık gösterebilir.",
            "2) Sınıf Sayısı: 5 sınıf kullanılmıştır. Daha fazla saldırı türü (10+) eklendiğinde model performansı değişebilir.",
            "3) Statik Veri: Çevrimdışı (offline) analiz yapılmıştır. Gerçek zamanlı (real-time) akan veri üzerinde test edilmemiştir.",
            "4) BSO Parametre Duyarlılığı: BSO hiperparametreleri (pop, iter, α, γ) deneysel olarak belirlenmiştir, daha sistematik bir parametre duyarlılık analizi yapılabilir.",
            "5) Tek Sınıflandırıcı: Hibrit çerçeve sadece Random Forest ile test edilmiştir. Diğer ensemble yöntemler (Gradient Boosting, LightGBM) ile de denenebilir.",
            "6) Hesaplama Maliyeti: BSO optimizasyonu iteratif RF eğitimi gerektirdiğinden, tek seferlik eğitime göre daha uzun sürmektedir.",
            "Bu sınırlamalar gelecek çalışmalar bölümünde açıkça belirtilmiştir."
        ],
        keyPoints: [
            "Tek veri seti sınırlaması",
            "Çevrimdışı analiz",
            "5 sınıf ile sınırlı",
            "BSO parametre duyarlılık analizi eksik"
        ],
    },
    {
        id: "l2",
        category: "limitations",
        difficulty: "orta",
        icon: Sparkles,
        question: "Gelecek çalışmalar olarak neler planlanıyor?",
        answer: [
            "Bu tez, gelecek araştırmalar için zengin bir yol haritası sunmaktadır:",
            "1) Çoklu Veri Seti Doğrulaması: CIC-IDS-2018, UNSW-NB15, Edge-IIoT gibi farklı veri setlerinde BSO-Hibrit RF'nin genelleme kapasitesinin test edilmesi.",
            "2) Gerçek Zamanlı Dağıtım: Apache Kafka veya Spark Streaming üzerinde akan veri işleme ile gerçek zamanlı tespit sisteminin uygulanması.",
            "3) Derin Öğrenme Entegrasyonu: BSO'nun CNN veya LSTM gibi derin öğrenme modelleriyle hibrit olarak kullanılması (BSO-Hibrit DL).",
            "4) Konsept Kayması (Concept Drift): Saldırı kalıpları zamanla değiştiğinde modelin kendini güncellemesi için adaptif BSO mekanizması geliştirilmesi.",
            "5) Çok-Amaçlı Optimizasyon: Pareto tabanlı çok-amaçlı optimizasyon (NSGA-II gibi) ile doğruluk-boyut-hız arasında trade-off analizi.",
            "6) Transfer Öğrenme: Bir ağ ortamında eğitilen modelin başka ortamlara aktarılması.",
            "7) Açıklanabilir Yapay Zeka (XAI): SHAP veya LIME ile modelin karar süreçlerinin açıklanması.",
            "8) Federe Öğrenme: Gizlilik korumalı dağıtık DDoS tespiti için federe BSO-RF çerçevesi."
        ],
        keyPoints: [
            "Çoklu veri seti doğrulaması",
            "Gerçek zamanlı dağıtım",
            "Derin öğrenme entegrasyonu",
            "Açıklanabilir yapay zeka (XAI)"
        ],
    },

    // ══════════════════════════════════════════════════════
    //  PRATİK UYGULAMA & GERÇEK DÜNYA
    // ══════════════════════════════════════════════════════
    {
        id: "p1",
        category: "practical",
        difficulty: "temel",
        icon: Globe,
        question: "Bu çerçeve gerçek dünyada nasıl uygulanabilir?",
        answer: [
            "BSO-Hibrit RF çerçevesinin gerçek dünya uygulaması şu şekilde tasarlanabilir:",
            "1) Ağ Geçidine Entegrasyon: ISP'ler veya kurumsal ağ geçitlerinde (gateway) paket başlığı özniteliklerini çıkaran bir modül yerleştirilir.",
            `2) Hafif Model: Sadece ${MODEL_RESULTS[0].featuresUsed} öznitelik gerektiğinden, öznitelik çıkarma işlemi hızlıdır. 39 yerine 19 öznitelik hesaplamak ağ gecikmesini %51 azaltır.`,
            `3) Hızlı Tahmin: ${MODEL_RESULTS[0].predictionTime} saniye/örnek tahmin süresi, milisaniye düzeyinde tespit sağlar.`,
            "4) Eğitim-Dağıtım Ayrımı: BSO optimizasyonu çevrimdışı (offline) yapılır, sadece eğitilmiş model çevrimiçi (online) dağıtılır.",
            "5) Ölçeklenebilirlik: RF modeli, çoklu CPU çekirdeklerinde paralel çalışabilir.",
            "6) Güncelleme Mekanizması: Yeni saldırı kalıpları ortaya çıktığında, BSO optimizasyonu yeni verilerle tekrar çalıştırılabilir.",
            "Uygulama Senaryoları:",
            "• IoT Ağ Güvenliği: Akıllı ev/fabrika cihazlarının korunması",
            "• Bulut Güvenliği: AWS/Azure üzerinde DDoS algılama servisi",
            "• Telekominikasyon: ISP düzeyinde trafik filtreleme"
        ],
    },
    {
        id: "p2",
        category: "practical",
        difficulty: "orta",
        icon: Server,
        question: "Hesaplama karmaşıklığı ve ölçeklenebilirlik durumu nedir?",
        answer: [
            "Hesaplama karmaşıklığı iki aşamada değerlendirilmelidir:",
            "Eğitim Aşaması (Çevrimdışı):",
            `• BSO toplam hesaplama: Pop × İter × RF_eğitim = ${BSO_PARAMETERS.populationSize} × ${BSO_PARAMETERS.maxIterations} = 1.250 RF eğitimi`,
            `• Toplam eğitim süresi: ~${MODEL_RESULTS[0].trainingTime} saniye (optimize edilmiş model)`,
            "• Bu bir kerelik maliyet; model dağıtıldıktan sonra tekrar gerekmez.",
            "Tahmin Aşaması (Çevrimiçi):",
            `• Tahmin süresi: ${MODEL_RESULTS[0].predictionTime} saniye/örnek = ~4.3 ms`,
            `• Saniyede ~230 örnek işlenebilir (tek CPU çekirdeği)`,
            `• ${MODEL_RESULTS[0].featuresUsed} öznitelik ile öznitelik çıkarma süresi minimizedir`,
            "Ölçeklenebilirlik:",
            "• RF ağaçları paralel tahmin yapabilir → çok çekirdekli sistemlerde doğrusal ölçeklenir",
            "• Model boyutu: ~birkaç MB (dağıtım için uygun)",
            "• Bellek: 19 öznitelik ile bellek ayak izi %51 azaltılmıştır",
            "Karşılaştırma: SVM eğitim süresi 68.2 saniye iken BSO-RF 3.7 saniye → 18× daha hızlı."
        ],
        keyPoints: [
            "Tahmin: ~4.3 ms/örnek",
            "Eğitim: bir kerelik çevrimdışı maliyet",
            "RF ile paralel ölçeklenebilirlik",
            "SVM'den 18× daha hızlı eğitim"
        ],
    },
    {
        id: "p3",
        category: "practical",
        difficulty: "ileri",
        icon: Lock,
        question: "Saldırganlar bu sistemi nasıl atlatabilir? Model güvenliği ne durumda?",
        answer: [
            "Bu adversarial (düşmanca) güvenlik sorusu çok önemlidir:",
            "Olası Saldırı Vektörleri:",
            "1) Öznitelik Manipülasyonu: Saldırgan, tespit edilen 19 özniteliği manipüle ederek normal trafik gibi görünmeye çalışabilir (mimicry attack). Ancak DDoS saldırısının doğası gereği yüksek hacim gerekir, bu da özniteliklerin tamamen gizlenmesini zorlaştırır.",
            "2) Yavaş DDoS (Low-and-Slow): Düşük hızlı DDoS saldırıları, hacim tabanlı özniteliklerde anomali yaratmayabilir. Bu bir sınırlamadır.",
            "3) Model Çıkarım Saldırısı: Saldırgan, model API'sine sorgular göndererek karar sınırlarını öğrenmeye çalışabilir.",
            "Savunma Stratejileri:",
            "• Periyodik yeniden eğitim: Yeni saldırı kalıplarına adaptasyon",
            "• Ensemble savunma: Birden fazla model birlikte kullanılabilir",
            "• Öznitelik gizliliği: Hangi özniteliklerin kullanıldığı gizli tutulabilir",
            "• Rate limiting: Model çıktılarına erişim sınırlandırılması",
            "Bu konular gelecek çalışmalar ve sınırlamalar bölümünde tartışılmıştır."
        ],
    },
    {
        id: "p4",
        category: "practical",
        difficulty: "orta",
        icon: Layers,
        question: "Bu çalışmayı tekrarlamak isteyen bir araştırmacı ne yapmalı? Tekrarlanabilirlik durumu nedir?",
        answer: [
            "Tekrarlanabilirlik (reproducibility) bilimsel araştırmanın temel ilkesidir. Bu çalışma şu şekilde tekrarlanabilir:",
            "1) Veri Seti: CICIoT2023, University of New Brunswick (UNB) web sitesinden açık erişimle indirilebilir.",
            "2) Ön İşleme: Tüm ön işleme adımları (undersampling, SMOTE parametreleri, normalizasyon) tez içinde detaylı olarak belirtilmiştir.",
            `3) BSO Parametreleri: Pop=${BSO_PARAMETERS.populationSize}, İter=${BSO_PARAMETERS.maxIterations}, f∈[${BSO_PARAMETERS.frequencyMin},${BSO_PARAMETERS.frequencyMax}], A₀=${BSO_PARAMETERS.initialLoudness}, r₀=${BSO_PARAMETERS.initialPulseRate}, α=${BSO_PARAMETERS.alpha}, γ=${BSO_PARAMETERS.gamma}`,
            `4) RF Hiperparametreleri: n_estimators=${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth=${BSO_PARAMETERS.optimizedHyperparameters.max_depth}, min_samples_split=${BSO_PARAMETERS.optimizedHyperparameters.min_samples_split}, max_features=${BSO_PARAMETERS.optimizedHyperparameters.max_features}`,
            "5) Python Kütüphaneleri: scikit-learn, numpy, pandas, imblearn (SMOTE), matplotlib",
            "6) Veri Bölme: Random seed sabitlenmiştir (stratified train_test_split).",
            "7) Kod Erişimi: Deney kodları tez ekinde veya GitHub deposunda paylaşılabilir.",
            "Tüm bu detaylar, bağımsız araştırmacıların sonuçları doğrulamasını mümkün kılmaktadır."
        ],
    },

    // ══════════════════════════════════════════════════════
    //  EK SORULAR
    // ══════════════════════════════════════════════════════
    {
        id: "e1",
        category: "methodology",
        difficulty: "ileri",
        icon: Microscope,
        question: "Ablasyon çalışması (ablation study) nedir ve ne gösterdi?",
        answer: [
            "Ablasyon çalışması, modelin farklı bileşenlerinin katkısını izole ederek ölçen sistematik bir deneydir:",
            "1) BSO Olmadan RF (Temel): 39 öznitelikle standart RF → Performans taban çizgisi",
            "2) Sadece BSO Öznitelik Seçimi: BSO ile öznitelik seçimi ama sabit hiperparametreler → Öznitelik seçiminin katkısı",
            "3) Sadece BSO Hiperparametre Optimizasyonu: Tüm öznitelikler ama BSO ile hiperparametre ayarı → Hiperparametre optimizasyonunun katkısı",
            "4) BSO-Hibrit (Tam Model): Eşzamanlı öznitelik + hiperparametre → Hibrit sinerjinin katkısı",
            "5) SMOTE Olmadan BSO-RF: Dengesiz veriyle BSO-RF → SMOTE'un katkısı",
            "Sonuçlar göstermiştir ki:",
            "• Her bileşen ayrı ayrı katkı sağlamaktadır",
            "• Hibrit yaklaşım, bileşenlerin toplamından daha fazla katkı sağlar (sinerji etkisi)",
            "• SMOTE, özellikle azınlık sınıfı (Backdoor_Malware) tespitini önemli ölçüde iyileştirmiştir",
            "Bu çalışma, önerilen çerçevenin her bileşeninin gerekliliğini kanıtlamaktadır."
        ],
        keyPoints: [
            "5 farklı ablasyon konfigürasyonu",
            "Her bileşenin ayrı katkısı ölçüldü",
            "Hibrit sinerji etkisi doğrulandı",
            "SMOTE azınlık sınıfında kritik"
        ],
    },
    {
        id: "e2",
        category: "results",
        difficulty: "orta",
        icon: AlertTriangle,
        question: "Hangi sınıflar en zor sınıflandırıldı? Neden?",
        answer: [
            "Karışıklık matrisi analizi, sınıf bazında performans farklılıklarını ortaya koymuştur:",
            "En Kolay Sınıflar:",
            "• BenignTraffic: En yüksek F1 skoru. Normal trafik, saldırı trafiğinden belirgin öznitelik kalıplarıyla ayrılır.",
            "• DDoS-SYN_Flood: SYN bayrak öznitelikleri bu saldırıyı kolayca ayırt eder.",
            "En Zor Sınıflar:",
            "• Backdoor_Malware: En düşük F1 skoru. Nedeni: (a) Orijinal veri setinde en az örneklenen sınıf (2.252), (b) Arka kapı trafiği normal trafiğe benzeyebilir, (c) SMOTE sentetik örnekleri doğal çeşitliliği tam yakalayamayabilir.",
            "• DDoS-ACK_Fragmentation vs DDoS-SYN_Flood: Bu iki DDoS türü bazı özniteliklerde örtüşebilir, karışıklık matrisi bu sınıflar arasında minimal karışıklık göstermektedir.",
            "Çözüm Önerileri:",
            "• Backdoor_Malware için daha fazla gerçek veri toplanması",
            "• Sınıf ağırlıklandırma (class weighting) yöntemi",
            "• Aşama aşama sınıflandırma (hierarchical classification)"
        ],
    },
    {
        id: "e3",
        category: "comparison",
        difficulty: "temel",
        icon: Zap,
        question: "Derin öğrenme (deep learning) neden kullanmadınız? CNN/LSTM daha iyi değil mi?",
        answer: [
            "Bu çok sık sorulan ve önemli bir sorudur:",
            "1) Tezin Odağı: Bu tez, meta-sezgisel optimizasyon ile öznitelik mühendisliği üzerine odaklanmaktadır. Derin öğrenme farklı bir araştırma yönelimidir.",
            "2) Veri Boyutu: CICIoT2023'teki 118.466 örnek, derin öğrenme için nispeten küçüktür. Derin modeller genellikle milyonlarca örnekle en iyi performansı gösterir.",
            "3) Öznitelik Türü: Tablo (tabular) verilerinde, RF ve XGBoost gibi ağaç tabanlı modeller genellikle derin öğrenmeden daha iyi veya eşdeğer performans gösterir (Kaggle yarışmaları ve literatür bunu destekler).",
            "4) Yorumlanabilirlik: RF öznitelik önem sıralaması sunar. Derin öğrenme modelleri 'kara kutu' niteliğindedir ve güvenlik uygulamalarında bu bir dezavantajdır.",
            "5) BSO Uyumluluğu: BSO'nun öznitelik seçimi mekanizması, açık öznitelik tanımları olan modellerde en etkilidir. DL'de öznitelik seçimi otomatik (gizli katmanlar) yapılır.",
            "6) Hesaplama Maliyeti: Derin öğrenme GPU gerektirir; RF CPU'da hızlıca eğitilebilir.",
            "7) Gelecek Çalışma: BSO + DL hibrit çerçevesi gelecek çalışma olarak planlanmaktadır."
        ],
    },
    {
        id: "e4",
        category: "practical",
        difficulty: "ileri",
        icon: Shield,
        question: "Bu çalışmanın etik boyutları nelerdir?",
        answer: [
            "DDoS tespit araştırmalarında etik boyutlar kritik önem taşır:",
            "1) Veri Gizliliği: CICIoT2023 veri seti, yapay laboratuvar ortamında oluşturulmuştur. Gerçek kullanıcı verileri içermez, gizlilik ihlali riski yoktur.",
            "2) Çift Kullanım (Dual Use): DDoS tespit teknolojisi savunma amaçlıdır, ancak saldırganlar tarafından tespit sistemlerini atlatmak için de kullanılabilir. Tez, etik kullanımı vurgular.",
            "3) Yanlış Pozitifler: %90.19 kesinlik, normal kullanıcıların yanlışlıkla engellenmesi riskini gösterir. Bu risk açıkça tartışılmıştır.",
            "4) Araştırma Etiği: Tüm deneyler tekrarlanabilir şekilde belgelenmiştir. Sonuçlar abartılmadan, sınırlamalarıyla birlikte sunulmuştur.",
            "5) Açık Erişim: Veri seti ve metodoloji açık paylaşılmıştır.",
            "6) Sorumlu Açıklama: Tespit zafiyetleri değil, tespit güçleri raporlanmıştır.",
            "Bu etik farkındalık, akademik bütünlüğün korunması ve toplumsal sorumluluğun yerine getirilmesi açısından önemlidir."
        ],
    },
    {
        id: "e5",
        category: "algorithm",
        difficulty: "ileri",
        icon: Brain,
        question: "BSO'da keşif ve sömürü (exploration vs exploitation) dengesi nasıl sağlanıyor?",
        answer: [
            "BSO'da keşif-sömürü dengesi üç temel mekanizmayla kontrol edilmektedir:",
            `1) Ses Yüksekliği (Loudness) Azalması: Başlangıçta A₀=${BSO_PARAMETERS.initialLoudness} (yüksek keşif). Her iterasyonda A = α × A ile azalır (α=${BSO_PARAMETERS.alpha}). Düşük loudness → yarasalar en iyi çözüme daha çok yapışır (sömürü).`,
            `2) Darbe Hızı (Pulse Rate) Artışı: Başlangıçta r₀=${BSO_PARAMETERS.initialPulseRate} (düşük yerel arama). r = r₀ × (1 - e^(-γt)) formülüyle artar. Yüksek pulse rate → daha fazla yerel arama (sömürü).`,
            `3) Frekans Ayarı: f ∈ [${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}]. Yüksek frekans → geniş adım (keşif), düşük frekans → dar adım (sömürü).`,
            "Dinamik Geçiş:",
            "• İlk iterasyonlar: Yüksek loudness + düşük pulse rate → yarasalar çözüm uzayını geniş çapta tarar (keşif baskın).",
            "• Son iterasyonlar: Düşük loudness + yüksek pulse rate → yarasalar en iyi çözüm etrafında yoğunlaşır (sömürü baskın).",
            "• Bu otomatik geçiş, GA/PSO gibi algoritmalardaki manuel parametre ayarı ihtiyacını azaltır.",
            "Ek olarak, rastgele yürüyüş (random walk) mekanizması yerel minimumlardan kaçmaya yardımcı olur."
        ],
        keyPoints: [
            "Loudness: keşif → sömürü geçişi",
            "Pulse rate: yerel arama yoğunluğu",
            "Frekans: adım boyutu kontrolü",
            "Otomatik, manuel ayar gerektirmez"
        ],
    },
    {
        id: "e6",
        category: "dataset",
        difficulty: "ileri",
        icon: Database,
        question: "39 özniteliğin 19'a indirgenmesi modeli nasıl etkiledi? Elenen özniteliklerin analizi nedir?",
        answer: [
            `BSO, ${DATASET_STATISTICS.totalFeatures} öznitelikten ${DATASET_STATISTICS.selectedFeatures}'unu seçerek %${DATASET_STATISTICS.featureReductionPct} boyut azaltma sağlamıştır.`,
            "Elenen 20 Özniteliğin Analizi:",
            "• Protokol Göstergeleri (Düşük Bilgi): IRC, Telnet, SMTP, IPv — bu protokoller veri setinde çok az temsil edilmektedir, dolayısıyla ayırt edici güçleri düşüktür.",
            "• Yedekli (Redundant) Öznitelikler: Std ve Variance (birbirleriyle yüksek korelasyonlu), Min ve AVG (Max ile birlikte gereksiz).",
            "• Düşük Varyans Öznitelikler: ece_flag_number gibi bazı bayrak sayaçları neredeyse sabit değerlere sahiptir.",
            "Seçilen 19 Özniteliğin Özellikleri:",
            "• Trafik Hacmi: syn_count, Number, Tot sum, Rate, Header_Length → DDoS'un hacimsel doğasını yakalar",
            "• Protokol Bilgisi: HTTP, HTTPS, DNS, UDP, SSH, ARP, DHCP, IGMP → Protokol bazlı saldırı tespit",
            "• Bayrak Bilgisi: psh_flag_number, fin_flag_number, cwr_flag_number → TCP bayrak anomalileri",
            "• Paket Boyutu: Max → Fragmentation saldırıları",
            "• Zaman: Time_To_Live → Paket yaşam süresi anomalisi, LLC → Bağlantı katmanı",
            "Etki: 20 özniteliğin elenmesine rağmen doğruluk korunmuştur (%89.74 → %89.82). Bu, elenen özniteliklerin gerçekten gereksiz olduğunu doğrular."
        ],
    },
    {
        id: "e7",
        category: "methodology",
        difficulty: "orta",
        icon: BookOpen,
        question: "Literatür taramanızda hangi çalışmaları referans aldınız? Mevcut çalışmalardan farkınız nedir?",
        answer: [
            "Kapsamlı bir literatür taraması yapılmıştır. Temel referans alanları:",
            "1) DDoS Tespit Yöntemleri:",
            "   • Geleneksel ML tabanlı tespit (RF, SVM, KNN) — yüksek boyutluluk sorunu",
            "   • Derin öğrenme tabanlı tespit (CNN, LSTM, Autoencoder) — yorumlanabilirlik sorunu",
            "   • Ensemble yöntemler (Stacking, Boosting) — öznitelik seçimi eksikliği",
            "2) Meta-Sezgisel Öznitelik Seçimi:",
            "   • GA tabanlı: Geniş çalışma var, ancak yüksek hesaplama maliyeti",
            "   • PSO tabanlı: Hızlı yakınsama ama erken yakınsama riski",
            "   • GWO tabanlı: Keşif kapasitesi iyi ama ikili kodlama zor",
            "   • BSO: DDoS alanında henüz kullanılmamış → ANA BOŞLUK",
            "3) Hibrit Çerçeveler:",
            "   • Çoğu çalışma ardışık (sequential) optimizasyon yapar",
            "   • Eşzamanlı öznitelik + hiperparametre optimizasyonu nadir → ANA BOŞLUK",
            "Bu Tezin Farkı: BSO'yu DDoS öznitelik seçiminde ilk kez kullanması ve eşzamanlı hibrit optimizasyon yaklaşımı sunması."
        ],
    },
    {
        id: "e8",
        category: "results",
        difficulty: "orta",
        icon: TrendingUp,
        question: "BSO'nun yakınsama davranışını açıklar mısınız? Yakınsama grafiği ne gösteriyor?",
        answer: [
            "BSO yakınsama analizi, algoritmanın 50 iterasyondaki performans gelişimini göstermektedir:",
            "Erken Fazı (İter 1-10): Hızlı iyileşme gözlenir. Yarasalar rastgele başlangıç pozisyonlarından hızla iyi çözümlere doğru hareket eder. Uygunluk değeri önemli miktarda düşer.",
            "Orta Fazı (İter 10-30): İyileşme hızı yavaşlar. Loudness azalması ve pulse rate artışı ile yerel arama yoğunlaşır. İnce ayar (fine-tuning) aşaması.",
            "Yakınsama Fazı (İter 30-50): Uygunluk değeri neredeyse sabitlenir. Yarasalar optimal çözüm etrafında kümelenir.",
            "Yakınsama Kriterleri:",
            `• Eşik değeri: ${BSO_PARAMETERS.convergenceThreshold} — ardışık iterasyonlar arası fark bu değerin altına düşerse yakınsamış kabul edilir`,
            "• ~30. iterasyonda pratik yakınsama gözlenmiştir",
            "• 50 iterasyon, güvenlik marjı olarak belirlenmiştir",
            "Bu yakınsama davranışı, BSO'nun çözüm uzayını etkili bir şekilde taradığını ve kararlı bir optimal çözüme ulaştığını göstermektedir."
        ],
    },
]

// Count questions per category
QA_CATEGORIES.forEach(cat => {
    cat.count = QA_DATA.filter(q => q.category === cat.id).length
})

/* ═══════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════ */
export default function ThesisDefenseQA() {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState<string>("all")

    const toggleItem = (id: string) => {
        setExpandedItems(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const expandAll = () => {
        setExpandedItems(new Set(filteredQA.map(q => q.id)))
    }

    const collapseAll = () => {
        setExpandedItems(new Set())
    }

    const filteredQA = QA_DATA.filter(q => {
        const catMatch = selectedCategory === "all" || q.category === selectedCategory
        const diffMatch = difficultyFilter === "all" || q.difficulty === difficultyFilter
        const searchMatch = searchTerm === "" ||
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
        return catMatch && diffMatch && searchMatch
    })

    const difficultyColor = (d: string) => {
        switch (d) {
            case "temel": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            case "orta": return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800"
            case "ileri": return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800"
            default: return ""
        }
    }

    const difficultyLabel = (d: string) => {
        switch (d) {
            case "temel": return "Temel"
            case "orta": return "Orta"
            case "ileri": return "İleri"
            default: return d
        }
    }

    return (
        <div className="space-y-6">
            {/* ════════════════════ HEADER ════════════════════ */}
            <Card className="overflow-hidden border-0 shadow-xl">
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                Tez Savunma Hazırlığı — Soru & Cevap
                            </h2>
                            <p className="text-indigo-100 text-sm mt-1">
                                Danışman ve jüri üyelerinin sorabileceği tüm olası sorular ve kapsamlı cevaplar
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">{QA_DATA.length}</div>
                            <div className="text-xs text-indigo-200">Toplam Soru</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">{QA_CATEGORIES.length}</div>
                            <div className="text-xs text-indigo-200">Kategori</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">{QA_DATA.filter(q => q.difficulty === "ileri").length}</div>
                            <div className="text-xs text-indigo-200">İleri Düzey</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">{QA_DATA.filter(q => q.keyPoints).length}</div>
                            <div className="text-xs text-indigo-200">Anahtar Noktalı</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* ════════════════════ FILTERS ════════════════════ */}
            <Card className="glass-card border-slate-200 dark:border-slate-800">
                <CardContent className="p-4 md:p-6">
                    <div className="space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Soru veya cevaplarda ara..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {/* Category filter */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === "all"
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                Tümü ({QA_DATA.length})
                            </button>
                            {QA_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat.id
                                            ? "bg-indigo-600 text-white shadow-md"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {cat.label} ({cat.count})
                                </button>
                            ))}
                        </div>

                        {/* Difficulty + Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-medium">Zorluk:</span>
                                {["all", "temel", "orta", "ileri"].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDifficultyFilter(d)}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${difficultyFilter === d
                                                ? d === "all" ? "bg-slate-700 text-white" : difficultyColor(d)
                                                : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                            }`}
                                    >
                                        {d === "all" ? "Tümü" : difficultyLabel(d)}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={expandAll} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all">
                                    Tümünü Göster
                                </button>
                                <button onClick={collapseAll} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                    Tümünü Gizle
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ CATEGORY OVERVIEW ════════════════════ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {QA_CATEGORIES.map(cat => {
                    const Icon = cat.icon
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id === selectedCategory ? "all" : cat.id)}
                            className={`p-4 rounded-xl border transition-all text-left card-hover-lift ${selectedCategory === cat.id
                                    ? "border-indigo-400 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50"
                                }`}
                        >
                            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${cat.gradient} mb-2`}>
                                <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{cat.label}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{cat.count} soru</div>
                        </button>
                    )
                })}
            </div>

            {/* ════════════════════ Q&A LIST ════════════════════ */}
            <div className="space-y-3">
                {filteredQA.length === 0 && (
                    <Card className="border-dashed border-slate-300 dark:border-slate-700">
                        <CardContent className="p-8 text-center">
                            <FileQuestion className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">Arama kriterlerinize uygun soru bulunamadı.</p>
                        </CardContent>
                    </Card>
                )}
                {filteredQA.map((qa, index) => {
                    const isExpanded = expandedItems.has(qa.id)
                    const Icon = qa.icon
                    const catInfo = QA_CATEGORIES.find(c => c.id === qa.category)

                    return (
                        <Card
                            key={qa.id}
                            className={`overflow-hidden transition-all duration-300 ${isExpanded
                                    ? "ring-2 ring-indigo-500/30 border-indigo-300 dark:border-indigo-700 shadow-lg"
                                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
                                }`}
                        >
                            {/* Question Header */}
                            <button
                                onClick={() => toggleItem(qa.id)}
                                className="w-full p-4 md:p-5 flex items-start gap-3 text-left group"
                            >
                                <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${catInfo?.gradient || "from-slate-500 to-slate-600"} shadow-sm`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <Badge variant="outline" className={`text-[10px] ${difficultyColor(qa.difficulty)}`}>
                                            {difficultyLabel(qa.difficulty)}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500">
                                            {catInfo?.label}
                                        </Badge>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500">#{index + 1}</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-relaxed">
                                        {qa.question}
                                    </h3>
                                </div>
                                <div className={`flex-shrink-0 p-1.5 rounded-full transition-all duration-300 ${isExpanded
                                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rotate-180"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                    }`}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </button>

                            {/* Answer */}
                            {isExpanded && (
                                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 animate-fade-in">
                                    <div className="p-4 md:p-6 space-y-4">
                                        {/* Answer text */}
                                        <div className="space-y-3">
                                            {qa.answer.map((paragraph, i) => (
                                                <p key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>

                                        {/* Key Points */}
                                        {qa.keyPoints && (
                                            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Star className="w-4 h-4 text-indigo-500" />
                                                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                                                        Anahtar Noktalar — Ezberleyin!
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {qa.keyPoints.map((point, j) => (
                                                        <div key={j} className="flex items-start gap-2">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{point}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Card>
                    )
                })}
            </div>

            {/* ════════════════════ TIPS CARD ════════════════════ */}
            <Card className="overflow-hidden border-0 shadow-lg">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="w-6 h-6 text-emerald-100" />
                        <h3 className="text-lg font-bold text-white">Savunma Günü İpuçları</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { tip: "Rakamları ezberleyin: %89.82 doğruluk, %84.24 F1-Makro, %98.38 AUC-ROC, 19/39 öznitelik", icon: BarChart3 },
                            { tip: "Sınırlamaları açıkça kabul edin — bu akademik olgunluk gösterir", icon: AlertTriangle },
                            { tip: "XGBoost karşılaştırmasına hazır olun — boyut azaltma argümanını kullanın", icon: GitCompare },
                            { tip: "BSO'nun keşif-sömürü dengesini çizerek açıklayın", icon: Brain },
                            { tip: "Veri sızıntısı önleme adımlarınızı net bir şekilde anlatın", icon: Lock },
                            { tip: "Her soruyu 2-3 dakikada cevaplayın, çok uzatmayın", icon: HelpCircle },
                            { tip: "Gelecek çalışmalar bölümünde heyecan gösterin — araştırma vizyonunuz önemli", icon: Sparkles },
                            { tip: "Karışıklık matrisini ve öznitelik önem grafiğini göstermeye hazır olun", icon: Target },
                        ].map((item, i) => {
                            const TipIcon = item.icon
                            return (
                                <div key={i} className="flex items-start gap-2.5 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                                    <TipIcon className="w-4 h-4 text-emerald-200 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-emerald-50 leading-relaxed">{item.tip}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Card>

            {/* ════════════════════ QUICK REFERENCE CARD ════════════════════ */}
            <Card className="glass-card border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Hızlı Referans — Temel Rakamlar
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "Doğruluk", value: `%${MODEL_RESULTS[0].accuracy}`, color: "text-emerald-600 dark:text-emerald-400" },
                            { label: "F1-Makro", value: `%${MODEL_RESULTS[0].f1Macro}`, color: "text-blue-600 dark:text-blue-400" },
                            { label: "AUC-ROC", value: `%${MODEL_RESULTS[0].aucRoc}`, color: "text-purple-600 dark:text-purple-400" },
                            { label: "MCC", value: `${MODEL_RESULTS[0].mcc}`, color: "text-indigo-600 dark:text-indigo-400" },
                            { label: "Öznitelik", value: `${DATASET_STATISTICS.selectedFeatures}/${DATASET_STATISTICS.totalFeatures}`, color: "text-amber-600 dark:text-amber-400" },
                            { label: "Azaltma", value: `%${DATASET_STATISTICS.featureReductionPct}`, color: "text-rose-600 dark:text-rose-400" },
                            { label: "SMOTE", value: `72K → 87.5K`, color: "text-teal-600 dark:text-teal-400" },
                            { label: "Model", value: "12 Karşılaştırma", color: "text-cyan-600 dark:text-cyan-400" },
                            { label: "Pop", value: `${BSO_PARAMETERS.populationSize}`, color: "text-violet-600 dark:text-violet-400" },
                            { label: "İterasyon", value: `${BSO_PARAMETERS.maxIterations}`, color: "text-fuchsia-600 dark:text-fuchsia-400" },
                            { label: "n_estimators", value: `${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}`, color: "text-sky-600 dark:text-sky-400" },
                            { label: "max_depth", value: `${BSO_PARAMETERS.optimizedHyperparameters.max_depth}`, color: "text-lime-600 dark:text-lime-400" },
                        ].map((item, i) => (
                            <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                                <div className={`text-base font-bold ${item.color}`}>{item.value}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
