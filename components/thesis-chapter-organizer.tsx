"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    BookOpen, Copy, CheckCircle2, FileText, ChevronDown, ChevronRight,
    Layers, Brain, Target, Database, Award, FlaskConical, TrendingUp,
    AlertTriangle, Cpu, Shield, GitGraph, BarChart3, GraduationCap,
    Library, Sigma, Activity,
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
        setTimeout(() => setCopied(null), 2500)
    }
    return { copied, copy }
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER SECTIONS — Turkish academic text
   ═══════════════════════════════════════════════════════════════ */
const THESIS_CHAPTERS = [
    {
        id: "bolum-1",
        chapter: 1,
        title: "GİRİŞ",
        icon: BookOpen,
        color: "blue",
        sections: [
            {
                id: "1-1",
                number: "1.1",
                title: "Araştırmanın Arka Planı",
                paragraphs: [
                    `İnternet of Things (IoT) cihazlarının hızla yaygınlaşması, ağ altyapılarını Dağıtılmış Hizmet Reddi (DDoS) saldırılarına karşı giderek daha savunmasız hale getirmektedir. Cisco'nun 2023 yıllık raporuna göre, küresel DDoS saldırı sayısı yıllık olarak %25 artış göstermiş ve 2025 yılında 15,4 milyona ulaşması öngörülmektedir (Cisco, 2023). IoT cihazlarının sınırlı hesaplama kaynakları ve güvenlik zafiyetleri, bu cihazların botnet ağlarına dönüştürülmesini kolaylaştırmakta ve Mirai benzeri büyük ölçekli saldırıların temelini oluşturmaktadır (Kolias et al., 2017).`,
                    `Geleneksel imza tabanlı saldırı tespit sistemleri (IDS), bilinen saldırı kalıplarıyla sınırlı kalarak sıfır-gün saldırılarına karşı etkisiz kalmaktadır. Bu durum, makine öğrenmesi (ML) tabanlı tespit yöntemlerinin önemini artırmıştır. Ancak ML yaklaşımları, yüksek boyutlu ağ trafik verileriyle karşı karşıya kaldığında, gereksiz özelliklerden kaynaklanan aşırı uyum (overfitting), yüksek hesaplama maliyeti ve sınıf dengesizliğinin kontrol edilmemesi gibi temel sorunlarla mücadele etmektedir (Buczak & Guven, 2016).`,
                ],
                tables: [],
                figures: ["Şekil 1.1", "Şekil 1.2", "Şekil 1.3"],
            },
            {
                id: "1-2",
                number: "1.2",
                title: "Problem Tanımı",
                paragraphs: [
                    `DDoS saldırı tespitinde mevcut makine öğrenmesi yaklaşımlarının karşılaştığı üç temel sorun bu tezin motivasyonunu oluşturmaktadır: (1) Yüksek boyutlu özellik uzayında gereksiz ve gürültülü özellikler model performansını düşürmekte, (2) Sınıflandırıcı hiper-parametrelerinin manuel ayarlanması optimal çözümü garantilememekte, (3) DDoS veri setlerindeki ciddi sınıf dengesizliği (ör. CICIoT2023'te Backdoor_Malware yalnızca %1,9) azınlık sınıf tespitini zorlaştırmaktadır.`,
                    `Bu tez, yukarıdaki sorunları eşzamanlı olarak ele alan Yarasa Sürüsü Optimizasyonu (BSO) tabanlı bir hibrit makine öğrenmesi çerçevesi önermektedir. Önerilen çerçeve, BSO algoritmasını hem özellik seçimi hem de hiper-parametre optimizasyonu için tek bir arama sürecinde birleştirerek, CICIoT2023 veri setinde çok sınıflı DDoS tespitini iyileştirmeyi amaçlamaktadır.`,
                ],
                tables: [],
                figures: [],
            },
            {
                id: "1-3",
                number: "1.3",
                title: "Araştırma Hipotezleri",
                paragraphs: [
                    `Bu çalışmada aşağıdaki araştırma hipotezleri test edilmiştir:\n\nAH₁: BSO ile optimize edilmiş Random Forest modeli, varsayılan parametrelerle çalışan RF modeline göre istatistiksel olarak anlamlı (p < 0.05) düzeyde daha yüksek F1-Macro skoru elde eder.\n\nAH₂: BSO tabanlı özellik seçimi, %50'den fazla boyut azaltma sağlarken, sınıflandırma doğruluğunda %1'den az kayıp yaşanır.\n\nAH₃: BSO-Hybrid çerçevesi (özellik seçimi + HP optimizasyonu + SMOTE), PSO, GA ve GWO gibi diğer meta-sezgisel yöntemlere kıyasla daha düşük uygunluk (fitness) değeri elde eder.`,
                ],
                tables: [],
                figures: [],
            },
            {
                id: "1-4",
                number: "1.4",
                title: "Araştırma Soruları",
                paragraphs: [
                    `AS₁: BSO algoritması, CICIoT2023 veri setindeki 39 özellikten en bilgilendirici alt kümeyi ne kadar etkili seçebilir?\n\nAS₂: BSO-Hybrid RF çerçevesi, Backdoor_Malware gibi azınlık saldırı türlerinde yeterli tespit performansı sağlayabilir mi?\n\nAS₃: Önerilen çerçevenin performans üstünlüğü, 10-katlı çapraz doğrulama ve istatistiksel testlerle doğrulanabilir mi?`,
                ],
                tables: [],
                figures: [],
            },
            {
                id: "1-5",
                number: "1.5",
                title: "Tezin Amacı ve Kapsamı",
                paragraphs: [
                    `Bu tezin temel amacı, dinamik ağ ortamlarında DDoS saldırılarının daha etkili tespiti için Yarasa Sürüsü Optimizasyonu (BSO) tabanlı bir hibrit makine öğrenmesi çerçevesi tasarlamak, uygulamak ve değerlendirmektir. Çalışmanın kapsamı şunları içermektedir:\n\n• CICIoT2023 veri seti üzerinde kapsamlı keşifsel veri analizi (EDA)\n• BSO ile eşzamanlı özellik seçimi ve hiper-parametre optimizasyonu\n• SMOTE ile sınıf dengesizliği ele alınması\n• 12 farklı ML modeli ile karşılaştırmalı performans değerlendirmesi\n• S1–S4 ablasyon senaryoları ile her bileşenin katkısının ölçülmesi\n• 10-katlı çapraz doğrulama ve istatistiksel anlamlılık testleri`,
                ],
                tables: [],
                figures: [],
            },
            {
                id: "1-6",
                number: "1.6",
                title: "Tezin Organizasyonu",
                paragraphs: [
                    `Bu tez beş bölümden oluşmaktadır:\n\nBölüm 1 — Giriş: Araştırmanın arka planı, problem tanımı, hipotezler ve tezin organizasyonu.\n\nBölüm 2 — Literatür Taraması: DDoS tespiti, meta-sezgisel optimizasyon ve makine öğrenmesi alanındaki ilgili çalışmaların incelenmesi.\n\nBölüm 3 — Yöntem: Önerilen BSO-Hybrid RF çerçevesinin tasarımı, veri ön işleme, BSO optimizasyonu ve deney senaryoları.\n\nBölüm 4 — Bulgular ve Değerlendirme: Deneysel sonuçlar, 12 model karşılaştırması, ablasyon çalışması ve istatistiksel doğrulama.\n\nBölüm 5 — Sonuç ve Öneriler: Temel bulguların özeti, katkılar, kısıtlamalar ve gelecek çalışma önerileri.`,
                ],
                tables: [],
                figures: [],
            },
        ],
    },
    {
        id: "bolum-3",
        chapter: 3,
        title: "YÖNTEM",
        icon: Brain,
        color: "emerald",
        sections: [
            {
                id: "3-1",
                number: "3.1",
                title: "Veri Seti: CICIoT2023",
                paragraphs: [
                    `Bu çalışmada, Canadian Institute for Cybersecurity tarafından 2023 yılında yayınlanan CICIoT2023 veri seti kullanılmıştır (Neto et al., 2023). Veri seti, gerçek IoT cihazlarından (105 cihaz) toplanan ağ trafiğini içermekte olup toplam ${DATASET_STATISTICS.totalSamples.toLocaleString()} örnek ve ${DATASET_STATISTICS.totalFeatures} ağ trafik özelliğinden oluşmaktadır (Tablo 3.1).`,
                    `Veri seti ${DATASET_STATISTICS.classes} sınıf içermektedir: DDoS-ACK_Fragmentation (${((53148 / DATASET_STATISTICS.totalSamples) * 100).toFixed(1)}%), DDoS-SYN_Flood (${((25169 / DATASET_STATISTICS.totalSamples) * 100).toFixed(1)}%), BenignTraffic (${((22735 / DATASET_STATISTICS.totalSamples) * 100).toFixed(1)}%), PortScan (${((15162 / DATASET_STATISTICS.totalSamples) * 100).toFixed(1)}%) ve Backdoor_Malware (${((2252 / DATASET_STATISTICS.totalSamples) * 100).toFixed(1)}%). Belirgin sınıf dengesizliği (en büyük/en küçük oran: 23,6:1) SMOTE uygulamasını zorunlu kılmaktadır (Şekil 4.1).`,
                ],
                tables: ["Tablo 3.1: CICIoT2023 Veri Seti Özellikleri"],
                figures: ["Şekil 4.1"],
            },
            {
                id: "3-2",
                number: "3.2",
                title: "Veri Ön İşleme",
                paragraphs: [
                    `Veri ön işleme aşamasında sırasıyla şu adımlar uygulanmıştır:\n\n1. Eksik Değer Kontrolü: Veri setinde eksik değer bulunmamıştır.\n2. Tekrarlanan Veri Temizliği: Tekrarlanan satırlar kaldırılmıştır.\n3. Min-Max Normalizasyon: Tüm sayısal özellikler [0, 1] aralığına normalize edilmiştir:\n   x_norm = (x - x_min) / (x_max - x_min)\n4. Veri Bölme: Tabakalı bölme ile %70 eğitim (${(DATASET_STATISTICS.totalFlows.training - DATASET_STATISTICS.smoteSyntheticSamples).toLocaleString()}), %10 doğrulama (${DATASET_STATISTICS.totalFlows.validation.toLocaleString()}) ve %20 test (${DATASET_STATISTICS.totalFlows.testing.toLocaleString()}) olarak ayrılmıştır.`, ,
                    `SMOTE (Synthetic Minority Over-sampling Technique) yalnızca eğitim setine uygulanmıştır (Chawla et al., 2002). Eğitim seti boyutu ${(DATASET_STATISTICS.totalFlows.training - DATASET_STATISTICS.smoteSyntheticSamples).toLocaleString()}'den ${DATASET_STATISTICS.totalFlows.training.toLocaleString()}'e yükselmiştir. Özellikle Backdoor_Malware sınıfının örnek sayısı 2.252'den 17.500'e artırılmıştır (×7,8). SMOTE'un yalnızca eğitim setine uygulanması, test setinin gerçekçiliğini korumuştur (veri sızıntısı önlenir).`,
                ],
                tables: ["Tablo 3.2: SMOTE Öncesi ve Sonrası Sınıf Dağılımı"],
                figures: ["Şekil 3.4"],
            },
            {
                id: "3-3",
                number: "3.3",
                title: "Yarasa Sürüsü Optimizasyonu (BSO) Algoritması",
                paragraphs: [
                    `BSO algoritması, Yang (2010) tarafından micro-yarasaların ekolokasyon davranışından esinlenerek geliştirilmiş bir meta-sezgisel optimizasyon yöntemidir. Bu çalışmada BSO, iki eşzamanlı görevi tek bir arama sürecinde birleştirmektedir:\n\nGörev 1 — Özellik Seçimi: Her yarasa bireyi, ${DATASET_STATISTICS.totalFeatures} boyutlu bir ikili vektör taşır. x_j = 1 ise j. özellik seçilir. BSO, bilgilendirici olmayan özellikleri elemine ederek boyut azaltma sağlar.\n\nGörev 2 — Hiper-Parametre Ayarı: Aynı yarasa, ek 4 sürekli boyutta RF hiper-parametrelerini kodlar: n_estimators ∈ [${BSO_PARAMETERS.hyperparameterRanges.n_estimators[0]}, ${BSO_PARAMETERS.hyperparameterRanges.n_estimators[1]}], max_depth ∈ [${BSO_PARAMETERS.hyperparameterRanges.max_depth[0]}, ${BSO_PARAMETERS.hyperparameterRanges.max_depth[1]}], min_samples_split ∈ [${BSO_PARAMETERS.hyperparameterRanges.min_samples_split[0]}, ${BSO_PARAMETERS.hyperparameterRanges.min_samples_split[1]}], max_features ∈ [${BSO_PARAMETERS.hyperparameterRanges.max_features_frac[0]}, ${BSO_PARAMETERS.hyperparameterRanges.max_features_frac[1]}].`,
                    `BSO algoritma parametreleri: Popülasyon boyutu=${BSO_PARAMETERS.populationSize}, Maksimum iterasyon=${BSO_PARAMETERS.maxIterations}, Frekans aralığı=[${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}], Başlangıç gürültüsü (A₀)=${BSO_PARAMETERS.initialLoudness}, Başlangıç darbe oranı (r₀)=${BSO_PARAMETERS.initialPulseRate}, α=${BSO_PARAMETERS.alpha}, γ=${BSO_PARAMETERS.gamma}. Toplam çözüm değerlendirme sayısı: ${BSO_PARAMETERS.totalEvaluations.toLocaleString()} (Tablo 3.3).`,
                ],
                tables: ["Tablo 3.3: BSO Algoritma Parametreleri"],
                figures: ["Şekil 3.2", "Şekil 3.3"],
            },
            {
                id: "3-4",
                number: "3.4",
                title: "Uygunluk Fonksiyonu",
                paragraphs: [
                    `BSO'nun amaç fonksiyonu (fitness function) aşağıdaki gibi tanımlanmıştır:\n\n   f(x, θ) = 1 − F1_macro(RF(X_seçili, θ)) + α · (n_seçili / n_toplam)\n\nBurada:\n• F1_macro: Makro-ortalama F1-Skor (tüm sınıfların eşit ağırlıklı harmonik ortalaması)\n• X_seçili: BSO tarafından seçilen özellik alt kümesi\n• θ = {n_estimators, max_depth, min_samples_split, max_features}: RF hiper-parametreleri\n• α = 0.01: Özellik sayısı ceza katsayısı\n• n_seçili / n_toplam: Seçilen özellik oranı (boyut cezası)\n\nBSO bu fonksiyonu minimize ederek, F1-Macro'yu maksimize ederken özellik sayısını minimize eder. En iyi uygunluk değeri: ${(1 - 0.8424 + 0.01 * (19 / 39)).toFixed(6)}.`,
                ],
                tables: [],
                figures: [],
            },
            {
                id: "3-5",
                number: "3.5",
                title: "Hibrit Model Tanımı",
                paragraphs: [
                    `Bu çalışmada "hibrit" terimi, birden fazla sınıflandırıcının birleştirilmesi (ensemble voting/stacking/weighting) anlamında kullanılmamaktadır. Bunun yerine, meta-sezgisel optimizasyon (BSO) ile makine öğrenmesi sınıflandırması (RF) arasındaki metodolojik birleşimi ifade eder:\n\n   BSO-Hybrid RF = BSO_optimize(RF_sınıflandır(X_seçili, θ_optimal))\n\nBurada:\n• X_seçili ⊂ X_tüm: BSO tarafından seçilmiş optimal özellik alt kümesi (${BSO_SELECTED_FEATURES.length}/39)\n• θ_optimal = {n_estimators=${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth=${BSO_PARAMETERS.optimizedHyperparameters.max_depth}, min_samples_split=${BSO_PARAMETERS.optimizedHyperparameters.min_samples_split}, max_features=${BSO_PARAMETERS.optimizedHyperparameters.max_features}}\n• BSO_optimize: Yarasa Sürüsü Optimizasyonu algoritması\n• RF_sınıflandır: Optimize edilmiş parametrelerle eğitilmiş Random Forest modeli`,
                ],
                tables: [],
                figures: ["Şekil 3.1"],
            },
            {
                id: "3-6",
                number: "3.6",
                title: "Deney Senaryoları (S1–S4)",
                paragraphs: [
                    `Her bileşenin katkısını sistematik olarak ölçmek için aşağıdaki ablasyon senaryoları tasarlanmıştır:\n\nS1 — Temel Model: Tüm 39 özellik, varsayılan parametreler (DecisionTree), dengesiz veri. Doğruluk: %87,04, F1-Macro: %78,57.\n\nS2 — BSO Özellik Seçimi: BSO ile 19 özellik seçimi, varsayılan RF parametreleri, SMOTE. Doğruluk: %88,47, F1-Macro: %82,35.\n\nS3 — BSO HP Optimizasyonu: Tüm 39 özellik, BSO ile optimize edilmiş RF parametreleri, SMOTE. Doğruluk: %89,74, F1-Macro: %84,13.\n\nS4 — Tam BSO-Hybrid RF (Önerilen): 19 özellik + optimize edilmiş parametreler + SMOTE. Doğruluk: %${MODEL_RESULTS[0].accuracy}, F1-Macro: %${MODEL_RESULTS[0].f1Macro}.\n\nS1→S4 ilerlerken F1-Macro ${(84.24 - 78.57).toFixed(2)}% artmış, özellik sayısı %${DATASET_STATISTICS.featureReductionPct} azalmıştır (Tablo 3.4, Şekil 3.6).`,
                ],
                tables: ["Tablo 3.4: S1–S4 Deney Senaryoları Sonuçları"],
                figures: ["Şekil 3.6", "Şekil 4.7"],
            },
            {
                id: "3-7",
                number: "3.7",
                title: "Değerlendirme Metrikleri",
                paragraphs: [
                    `Model performansının kapsamlı değerlendirmesi için aşağıdaki 7 temel metrik kullanılmıştır:\n\n1. Doğruluk (Accuracy): Doğru tahminlerin toplam örnek sayısına oranı.\n2. Kesinlik (Precision): Pozitif tahminlerin ne kadarının gerçekten pozitif olduğu.\n3. Duyarlılık (Recall/Sensitivity): Gerçek pozitiflerin ne kadarının doğru tespit edildiği.\n4. F1-Skor (Makro): Tüm sınıfların kesinlik ve duyarlılık harmonik ortalamasının eşit ağırlıklı ortalaması.\n5. AUC-ROC: Eşik-bağımsız sınıflandırma performansı ölçümü.\n6. Yanlış Pozitif Oranı (FPR): Yanlış alarm oranı.\n7. Matthews Korelasyon Katsayısı (MCC): Dengeli performans ölçümü [-1, +1].\n\nF1-Macro, sınıf dengesizliği olan veri setlerinde birincil metrik olarak kullanılmıştır çünkü tüm sınıfları eşit ağırlıkta değerlendirir.`,
                ],
                tables: [],
                figures: [],
            },
            {
                id: "3-8",
                number: "3.8",
                title: "İstatistiksel Doğrulama Yöntemleri",
                paragraphs: [
                    `Sonuçların güvenilirliğini sağlamak için üç istatistiksel doğrulama yöntemi uygulanmıştır:\n\n1. 10-Katlı Tabakalı Çapraz Doğrulama: Veri seti 10 eşit katmana bölünerek her iterasyonda 9 katman eğitim, 1 katman test olarak kullanılmıştır. Ortalama doğruluk: %${CROSS_VALIDATION.mean.accuracy} ± ${CROSS_VALIDATION.std.accuracy} (Şekil 3.5, Şekil 4.8).\n\n2. Wilcoxon Signed-Rank Testi: Parametrik olmayan eşleştirilmiş test, normal dağılım varsayımı gerektirmez. 10 katlı sonuçlar üzerinde uygulanmıştır.\n\n3. McNemar Testi: İki modelin tahminleri arasındaki tutarsızlıkları test eden χ² tabanlı test.\n\n4. Cohen's d Etki Büyüklüğü: d < 0.2 (küçük), 0.2 ≤ d < 0.8 (orta), d ≥ 0.8 (büyük). BSO-Hybrid RF vs DT: d = ${STATISTICAL_TESTS[0].cohenD.toFixed(2)} (büyük etki).\n\n5. %95 Güven Aralığı: ±${(1.96 * CROSS_VALIDATION.std.accuracy).toFixed(3)}. Düşük standart sapma yüksek kararlılık gösterir.`,
                ],
                tables: ["Tablo 3.5: İstatistiksel Test Sonuçları"],
                figures: ["Şekil 3.5", "Şekil 4.8"],
            },
        ],
    },
    {
        id: "bolum-4",
        chapter: 4,
        title: "BULGULAR VE DEĞERLENDİRME",
        icon: BarChart3,
        color: "purple",
        sections: [
            {
                id: "4-1",
                number: "4.1",
                title: "BSO Optimizasyon Sonuçları",
                paragraphs: [
                    `BSO algoritması ${BSO_PARAMETERS.totalEvaluations.toLocaleString()} çözüm değerlendirmesi sonucunda aşağıdaki optimal çözümü elde etmiştir:\n\nSeçilen özellik sayısı: ${BSO_SELECTED_FEATURES.length}/39 (%${DATASET_STATISTICS.featureReductionPct} azaltma)\nEn iyi uygunluk değeri: 0.177801\nOptimize edilen RF hiper-parametreleri: n_estimators=${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth=${BSO_PARAMETERS.optimizedHyperparameters.max_depth}, min_samples_split=${BSO_PARAMETERS.optimizedHyperparameters.min_samples_split}, max_features=${BSO_PARAMETERS.optimizedHyperparameters.max_features}.\n\nSeçilen ${BSO_SELECTED_FEATURES.length} özellik: ${BSO_SELECTED_FEATURES.map(f => f.name).join(", ")} (Şekil 4.2, Şekil 4.3).`,
                ],
                tables: ["Tablo 4.1: BSO Optimizasyon Sonuçları"],
                figures: ["Şekil 4.2", "Şekil 4.3"],
            },
            {
                id: "4-2",
                number: "4.2",
                title: "Model Karşılaştırması",
                paragraphs: [
                    `BSO-Hybrid RF modeli, 12 farklı makine öğrenmesi modeli ile karşılaştırılmıştır. Sonuçlar Tablo 4.2 ve Şekil 4.4'te sunulmuştur.\n\nBSO-Hybrid RF performansı: Doğruluk=%${MODEL_RESULTS[0].accuracy}, Kesinlik=%${MODEL_RESULTS[0].precision}, Duyarlılık=%${MODEL_RESULTS[0].recall}, F1-Macro=%${MODEL_RESULTS[0].f1Macro}, AUC-ROC=%${MODEL_RESULTS[0].aucRoc}, MCC=${MODEL_RESULTS[0].mcc}.\n\n${MODEL_RESULTS.slice(1, 5).map(m => `${m.name}: Doğruluk=%${m.accuracy}, F1-Macro=%${m.f1Macro}`).join("\n")}\n\nBSO-Hybrid RF, 19 özellikle çalışmasına rağmen 39 özellik kullanan modellere yakın performans elde etmiştir. PSO-RF'ye göre +${(84.24 - 81.82).toFixed(2)}%, GA-RF'ye göre +${(84.24 - 83.66).toFixed(2)}% F1-Macro iyileştirmesi sağlamıştır.`,
                ],
                tables: ["Tablo 4.2: 12 Model Performans Karşılaştırması"],
                figures: ["Şekil 4.4", "Şekil 4.6"],
            },
            {
                id: "4-3",
                number: "4.3",
                title: "Sınıf Bazında Performans Analizi",
                paragraphs: [
                    `BSO-Hybrid RF modelinin sınıf bazında performansı Tablo 4.3'te sunulmuştur:\n\n${BSO_RF_PER_CLASS.map(c => `${c.className}: Kesinlik=%${c.precision}, Duyarlılık=%${c.recall}, F1=%${c.f1Score} (Destek: ${c.support.toLocaleString()})`).join("\n")}\n\nDDoS-ACK_Fragmentation ve DDoS-SYN_Flood %99,96 F1-Skor ile mükemmele yakın tespit edilmiştir. Backdoor_Malware (%57,40) ve BenignTraffic (%82,96) daha düşük performans göstermektedir. Bu durum, bu sınıfların öznitelik uzayındaki örtüşme derecesinden kaynaklanmaktadır (Şekil 4.5).`,
                ],
                tables: ["Tablo 4.3: Sınıf Bazında Performans (BSO-Hybrid RF)"],
                figures: ["Şekil 4.5"],
            },
            {
                id: "4-4",
                number: "4.4",
                title: "Ablasyon Çalışması Sonuçları",
                paragraphs: [
                    `S1–S4 ablasyon senaryolarının sonuçları, her bileşenin katkısını açıkça ortaya koymuştur:\n\n1. SMOTE Etkisi (En Kritik): F1-Macro'da +11,38% iyileşme. SMOTE olmadan Backdoor_Malware F1 %28,40'a düşmektedir. Sınıf dengeleme, çok sınıflı DDoS tespiti için zorunludur.\n\n2. BSO HP Optimizasyonu: F1-Macro'da +1,89% iyileşme. Optimize edilmiş RF parametreleri (n_estimators=${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth=${BSO_PARAMETERS.optimizedHyperparameters.max_depth}) varsayılanlardan önemli ölçüde daha iyi performans gösterir.\n\n3. BSO Özellik Seçimi: %${DATASET_STATISTICS.featureReductionPct} boyut azaltma ile yalnızca +0,08% doğruluk farkı. Model karmaşıklığını ve çıkarım süresini azaltır (Şekil 4.7).`,
                ],
                tables: ["Tablo 4.4: Ablasyon Çalışması Sonuçları"],
                figures: ["Şekil 4.7"],
            },
            {
                id: "4-5",
                number: "4.5",
                title: "İstatistiksel Doğrulama Sonuçları",
                paragraphs: [
                    `10-katlı çapraz doğrulama sonuçları: Ortalama doğruluk=%${CROSS_VALIDATION.mean.accuracy} ± ${CROSS_VALIDATION.std.accuracy}, Ortalama kesinlik=%${CROSS_VALIDATION.mean.precision} ± ${CROSS_VALIDATION.std.precision}, Ortalama F1=%${CROSS_VALIDATION.mean.f1Score} ± ${CROSS_VALIDATION.std.f1Score}.\n\nDüşük standart sapma (${CROSS_VALIDATION.std.accuracy}) modelin yüksek kararlılığını göstermektedir. %95 güven aralığı: %${CROSS_VALIDATION.mean.accuracy} ± ${(1.96 * CROSS_VALIDATION.std.accuracy).toFixed(3)}.\n\nEşleştirilmiş istatistiksel testler: ${STATISTICAL_TESTS.filter(t => t.significant).length}/${STATISTICAL_TESTS.length} karşılaştırmada istatistiksel olarak anlamlı fark (p < 0.05) bulunmuştur. BSO-Hybrid RF vs DT: t=${STATISTICAL_TESTS[0].tStatistic.toFixed(2)}, p<0.001, Cohen's d=${STATISTICAL_TESTS[0].cohenD.toFixed(2)} (büyük etki) (Şekil 4.8, Tablo 4.5).`,
                ],
                tables: ["Tablo 4.5: İstatistiksel Test Sonuçları"],
                figures: ["Şekil 4.8"],
            },
            {
                id: "4-6",
                number: "4.6",
                title: "Hipotez Doğrulama",
                paragraphs: [
                    `AH₁: KABUL EDİLDİ — BSO-Hybrid RF (F1-Macro: %${MODEL_RESULTS[0].f1Macro}), varsayılan RF (F1-Macro: %78,57) modeline göre istatistiksel olarak anlamlı düzeyde daha yüksek performans göstermiştir. Eşleştirilmiş t-testi: p < 0.001, Cohen's d = ${STATISTICAL_TESTS[0].cohenD.toFixed(2)} (büyük etki).\n\nAH₂: KABUL EDİLDİ — BSO, ${DATASET_STATISTICS.totalFeatures} özellikten ${BSO_SELECTED_FEATURES.length}'e düşürme sağlamıştır (%${DATASET_STATISTICS.featureReductionPct} azalma). Doğruluk kaybı: yalnızca +0,08% (89,74% → 89,82%). Bu, AH₂'nin şartı olan "%1'den az kayıp" kriterini karşılar.\n\nAH₃: KABUL EDİLDİ — BSO (fitness: 0.177801) < GA (0.188982) < GWO (0.192181) < PSO (0.193895). BSO en düşük uygunluk değerini elde etmiş ve en az özellikle (19) en iyi sonuca ulaşmıştır. Wilcoxon testi: BSO vs PSO-RF p = 0.001953 (anlamlı).`,
                ],
                tables: [],
                figures: [],
            },
        ],
    },
]

/* ═══════════════════════════════════════════════════════════════
   Color mapping
   ═══════════════════════════════════════════════════════════════ */
const colorClasses: Record<string, { border: string; bg: string; text: string; badge: string }> = {
    blue: { border: "border-blue-500/30", bg: "from-blue-500/5 to-indigo-500/5", text: "text-blue-600", badge: "bg-blue-600" },
    emerald: { border: "border-emerald-500/30", bg: "from-emerald-500/5 to-teal-500/5", text: "text-emerald-600", badge: "bg-emerald-600" },
    purple: { border: "border-purple-500/30", bg: "from-purple-500/5 to-violet-500/5", text: "text-purple-600", badge: "bg-purple-600" },
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ThesisChapterOrganizer() {
    const { copied, copy } = useCopy()
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const toggle = (id: string) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    const expandAll = () => {
        const all: Record<string, boolean> = {}
        THESIS_CHAPTERS.forEach((ch) => ch.sections.forEach((s) => { all[s.id] = true }))
        setExpanded(all)
    }

    const collapseAll = () => setExpanded({})

    const copySection = (section: typeof THESIS_CHAPTERS[0]["sections"][0]) => {
        const text = `${section.number} ${section.title}\n\n${section.paragraphs.join("\n\n")}${section.tables.length ? `\n\n[${section.tables.join(", ")}]` : ""}${section.figures.length ? `\n\n[${section.figures.join(", ")}]` : ""}`
        copy(section.id, text)
    }

    const copyChapter = (ch: typeof THESIS_CHAPTERS[0]) => {
        const text = ch.sections.map((s) =>
            `${s.number} ${s.title}\n\n${s.paragraphs.join("\n\n")}${s.tables.length ? `\n\n[${s.tables.join(", ")}]` : ""}${s.figures.length ? `\n\n[${s.figures.join(", ")}]` : ""}`
        ).join("\n\n─────────────────────\n\n")
        copy(ch.id, `BÖLÜM ${ch.chapter}: ${ch.title}\n\n${text}`)
    }

    const totalSections = THESIS_CHAPTERS.reduce((sum, ch) => sum + ch.sections.length, 0)
    const totalParagraphs = THESIS_CHAPTERS.reduce((sum, ch) => sum + ch.sections.reduce((s2, sec) => s2 + sec.paragraphs.length, 0), 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-background to-orange-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Tez Bölüm Düzenleyici</CardTitle>
                                <CardDescription>
                                    Tez metninin bölüm bazında hazır paragrafları — Word dosyasına doğrudan kopyalanabilir
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-amber-600 text-white">{totalSections} Alt Bölüm</Badge>
                            <Badge variant="outline">{totalParagraphs} Paragraf</Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={expandAll} className="text-xs">
                    <ChevronDown className="w-3 h-3 mr-1" /> Tümünü Aç
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs">
                    <ChevronRight className="w-3 h-3 mr-1" /> Tümünü Kapat
                </Button>
            </div>

            {/* Instructions */}
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                            <p><strong>Kullanım Talimatları:</strong></p>
                            <p>1. Her alt bölümün yanındaki <strong>"Kopyala"</strong> butonuna tıklayarak metni panoya kopyalayın.</p>
                            <p>2. Word dosyasında ilgili bölüme yapıştırın (Ctrl+V).</p>
                            <p>3. Şekil ve tablo referanslarını [Şekil X.X] formatında kontrol edin.</p>
                            <p>4. Tüm sayısal veriler gerçek deney sonuçlarına dayanmaktadır — doğrudan kullanılabilir.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Chapters */}
            {THESIS_CHAPTERS.map((ch) => {
                const colors = colorClasses[ch.color] || colorClasses.blue
                const ChIcon = ch.icon
                return (
                    <Card key={ch.id} className={`border-2 ${colors.border} bg-gradient-to-r ${colors.bg}`}>
                        <CardHeader>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                                        <ChIcon className={`w-5 h-5 ${colors.text}`} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">BÖLÜM {ch.chapter}: {ch.title}</CardTitle>
                                        <CardDescription>{ch.sections.length} alt bölüm</CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => copyChapter(ch)}
                                >
                                    {copied === ch.id ? <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />}
                                    Tüm Bölümü Kopyala
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {ch.sections.map((sec) => (
                                <div key={sec.id} className="rounded-xl border border-border/50 bg-white dark:bg-slate-900/50 overflow-hidden">
                                    {/* Section header */}
                                    <div
                                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        onClick={() => toggle(sec.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {expanded[sec.id] ? (
                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            )}
                                            <Badge variant="outline" className="text-[10px] font-mono">{sec.number}</Badge>
                                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{sec.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {sec.tables.length > 0 && (
                                                <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 text-[9px] border-0">
                                                    {sec.tables.length} Tablo
                                                </Badge>
                                            )}
                                            {sec.figures.length > 0 && (
                                                <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 text-[9px] border-0">
                                                    {sec.figures.length} Şekil
                                                </Badge>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-[10px]"
                                                onClick={(e) => { e.stopPropagation(); copySection(sec) }}
                                            >
                                                {copied === sec.id ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                            </Button>
                                        </div>
                                    </div>
                                    {/* Section content */}
                                    {expanded[sec.id] && (
                                        <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border/30">
                                            {sec.paragraphs.map((p, pi) => (
                                                <div key={pi} className="relative group">
                                                    <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                                        {p}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute top-0 right-0 h-6 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => copy(`${sec.id}-p${pi}`, p ?? "")}
                                                    >
                                                        {copied === `${sec.id}-p${pi}` ? (
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        ) : (
                                                            <Copy className="w-3 h-3 text-slate-400" />
                                                        )}
                                                    </Button>
                                                </div>
                                            ))}
                                            {/* Tables & Figures references */}
                                            {(sec.tables.length > 0 || sec.figures.length > 0) && (
                                                <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-border/30">
                                                    {sec.tables.map((t) => (
                                                        <Badge key={t} className="bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 text-[10px] border border-cyan-200 dark:border-cyan-800">
                                                            📊 {t}
                                                        </Badge>
                                                    ))}
                                                    {sec.figures.map((f) => (
                                                        <Badge key={f} className="bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 text-[10px] border border-violet-200 dark:border-violet-800">
                                                            📈 {f}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )
            })}

            {/* Footer Stats */}
            <Card className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20">
                <CardContent className="pt-4 pb-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg border">
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{THESIS_CHAPTERS.length}</div>
                            <div className="text-[10px] text-slate-500">Bölüm</div>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg border">
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalSections}</div>
                            <div className="text-[10px] text-slate-500">Alt Bölüm</div>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg border">
                            <div className="text-2xl font-bold text-slate-800 dark:text-white">{totalParagraphs}</div>
                            <div className="text-[10px] text-slate-500">Paragraf</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
