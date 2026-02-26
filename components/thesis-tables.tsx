"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow, TableFooter,
} from "@/components/ui/table"
import {
    BookOpen, Database, Brain, BarChart3, FileText,
    Target, Shield, CheckCircle2, Layers, Award,
    TrendingUp, GraduationCap,
} from "lucide-react"
import {
    DATASET_STATISTICS,
    MODEL_RESULTS,
    BSO_PARAMETERS,
    BSO_SELECTED_FEATURES,
    CICIOT2023_FEATURES,
    CICIOT2023_ATTACK_TYPES,
    BSO_RF_PER_CLASS,
    CONFUSION_MATRICES,
    STATISTICAL_TESTS,
    CROSS_VALIDATION,
    DYNAMIC_ENVIRONMENT,
    FEATURE_SELECTION_COMPARISON,
    COMPUTATIONAL_EFFICIENCY,
    STATE_OF_THE_ART,
    OPTIMIZER_CONVERGENCE,
} from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   IEEE-Style Academic Table Wrapper
   ═══════════════════════════════════════════════════════════════ */
function AcademicTable({
    number,
    caption,
    source,
    children,
}: {
    number: string
    caption: string
    source?: string
    children: React.ReactNode
}) {
    return (
        <div className="my-8 print:my-4">
            {/* IEEE/Scopus style — caption ABOVE table, bold number */}
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3 leading-relaxed">
                <span className="font-bold">Tablo {number}.</span>{" "}
                <span className="font-normal text-slate-700 dark:text-slate-300">{caption}</span>
            </p>
            <div className="rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden shadow-sm">
                {children}
            </div>
            {source && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 italic">
                    Kaynak: {source}
                </p>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   Chapter Divider
   ═══════════════════════════════════════════════════════════════ */
function ChapterDivider({
    chapter,
    title,
    icon: Icon,
    gradient,
    description,
}: {
    chapter: string
    title: string
    icon: React.ElementType
    gradient: string
    description: string
}) {
    return (
        <div className="pt-6 pb-4 border-b-2 border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex items-center gap-4">
                <div className={`p-3.5 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {chapter}: {title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTERS
   ═══════════════════════════════════════════════════════════════ */
const CHAPTERS = [
    { id: "ch1", label: "Bölüm 1", title: "Giriş", icon: BookOpen, color: "from-blue-600 to-indigo-700" },
    { id: "ch2", label: "Bölüm 2", title: "Literatür Taraması", icon: FileText, color: "from-purple-600 to-violet-700" },
    { id: "ch3", label: "Bölüm 3", title: "Yöntem", icon: Brain, color: "from-emerald-600 to-teal-700" },
    { id: "ch4", label: "Bölüm 4", title: "Bulgular ve Tartışma", icon: BarChart3, color: "from-amber-600 to-orange-700" },
    { id: "ch5", label: "Bölüm 5", title: "Sonuç ve Öneriler", icon: Award, color: "from-rose-600 to-pink-700" },
    { id: "appendix", label: "Ekler", title: "Ek Tablolar", icon: Layers, color: "from-slate-600 to-gray-700" },
]

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ThesisTables() {
    const [activeChapter, setActiveChapter] = useState("ch1")

    const bsoModel = MODEL_RESULTS[0]
    const totalTables = 34

    /* ───── cell style helpers ───── */
    const hd = "text-[13px] font-bold text-slate-800 dark:text-slate-100 py-3 px-4"
    const td = "text-[13px] text-slate-700 dark:text-slate-300 py-2.5 px-4"
    const mono = "font-mono tracking-tight"
    const bold = "font-bold"
    const highlight = "bg-emerald-50/60 dark:bg-emerald-950/20"
    const bestCell = "font-bold text-emerald-700 dark:text-emerald-400"

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto">
            {/* ═══════ TITLE CARD ═══════ */}
            <Card className="border-0 overflow-hidden shadow-2xl">
                <CardContent className="relative py-10 px-8 md:px-12 bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-700">
                    <div className="text-center space-y-4">
                        <Badge className="bg-white/15 backdrop-blur-md text-white border border-white/25 text-sm px-5 py-2">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Yüksek Lisans Tezi — Akademik Tablolar
                        </Badge>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                            Tez Tabloları — Bölüm Bazlı Akademik Format
                        </h1>
                        <p className="text-base text-white/85 max-w-3xl mx-auto leading-relaxed">
                            Bu bölüm, tezde yer alan <strong>{totalTables} tablonun</strong> tamamını IEEE/Scopus formatında,
                            CICIoT2023 veri seti üzerinde elde edilen <strong>gerçek deney sonuçlarına</strong> dayalı olarak sunmaktadır.
                        </p>
                        <div className="flex justify-center gap-8 pt-2 text-white/90 text-sm font-medium">
                            <span>{totalTables} Tablo</span>
                            <span className="w-1 h-1 rounded-full bg-white/50 mt-2" />
                            <span>6 Bölüm</span>
                            <span className="w-1 h-1 rounded-full bg-white/50 mt-2" />
                            <span>%100 Gerçek Deney Verisi</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ═══════ CHAPTER NAVIGATION ═══════ */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {CHAPTERS.map((ch) => (
                    <button
                        key={ch.id}
                        onClick={() => setActiveChapter(ch.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center ${activeChapter === ch.id
                            ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 shadow-lg scale-[1.02]"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-md"
                            }`}
                    >
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${ch.color}`}>
                            <ch.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ch.label}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{ch.title}</span>
                    </button>
                ))}
            </div>

            {/* ═══════════════════════════════════════════════════════════
           BÖLÜM 1 — GİRİŞ
         ═══════════════════════════════════════════════════════════ */}
            {activeChapter === "ch1" && (
                <div>
                    <ChapterDivider
                        chapter="Bölüm 1"
                        title="Giriş"
                        icon={BookOpen}
                        gradient="from-blue-600 to-indigo-700"
                        description="Araştırma problemi, hedefler, bilimsel katkılar ve tez organizasyonu"
                    />

                    {/* Tablo 1.1 */}
                    <AcademicTable number="1.1" caption="Dağıtık Hizmet Engelleme (DDoS) Saldırı Tespitinde Mevcut Araştırma Problemleri ve Önerilen Çözümler">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-8`}>#</TableHead>
                                    <TableHead className={hd}>Araştırma Problemi</TableHead>
                                    <TableHead className={hd}>Literatürdeki Mevcut Yaklaşım</TableHead>
                                    <TableHead className={hd}>Bu Tezde Önerilen Çözüm</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["Yüksek boyutlu ağ trafik verileri model performansını ve eğitim süresini olumsuz etkiler", "PCA, Information Gain gibi doğrusal/filtre tabanlı yöntemler; sarmal (wrapper) yöntemler hesaplama maliyeti yüksek", `BSO tabanlı otomatik sarmal öznitelik seçimi ile ${DATASET_STATISTICS.totalFeatures} öznitelikten ${DATASET_STATISTICS.selectedFeatures}'a azaltma (%${DATASET_STATISTICS.featureReductionPct} boyut küçültme)`],
                                    ["Öznitelik seçimi ve sınıflandırıcı hiperparametre optimizasyonu genellikle ayrı ayrı ve ardışık yapılır", "Grid Search, Random Search veya iki aşamalı ardışık optimizasyon", "BSO-Hibrit: Eşzamanlı öznitelik seçimi + RF hiperparametre optimizasyonu ile birleşik arama uzayında tek adımda çözüm"],
                                    ["Ağ trafiği veri setlerinde ciddi sınıf dengesizliği sorunu bulunur", "Alt örnekleme (bilgi kaybı) veya göz ardı etme", "SMOTE (Synthetic Minority Over-sampling Technique) ile dengeli eğitim verisi üretimi (72.252 → 87.500)"],
                                    ["Çoğu çalışma ikili (normal/saldırı) sınıflandırma ile sınırlıdır", "İkili sınıflandırma — saldırı türleri ayırt edilemez", "5 sınıflı çok-sınıflı (multi-class) sınıflandırma: saldırı türlerinin detaylı ayrımı"],
                                    ["Değerlendirmelerde güncel olmayan veri setleri kullanılır", "NSL-KDD (1999), CICIDS2017 — güncel IoT trafik kalıplarını yansıtmaz", "CICIoT2023 — 105 gerçek IoT cihazından toplanan en güncel referans veri seti"],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} text-slate-500 text-center`}>{i + 1}</TableCell>
                                        <TableCell className={`${td} ${bold}`}>{row[0]}</TableCell>
                                        <TableCell className={td}>{row[1]}</TableCell>
                                        <TableCell className={`${td} text-emerald-800 dark:text-emerald-400`}>{row[2]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 1.2 */}
                    <AcademicTable number="1.2" caption="Araştırma Hedefleri, İlişkili Araştırma Soruları ve Ulaşılan Sonuçlar">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-16`}>Hedef</TableHead>
                                    <TableHead className={hd}>Açıklama</TableHead>
                                    <TableHead className={hd}>Araştırma Sorusu</TableHead>
                                    <TableHead className={`${hd} w-44`}>Elde Edilen Sonuç</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { id: "H1", obj: "BSO tabanlı etkili öznitelik seçim mekanizması geliştirmek", rq: "BSO algoritması, DDoS tespit bağlamında öznitelik uzayını performans kaybı olmadan ne ölçüde azaltabilir?", result: `${DATASET_STATISTICS.totalFeatures} → ${DATASET_STATISTICS.selectedFeatures} öznitelik (%${DATASET_STATISTICS.featureReductionPct} azaltma)` },
                                    { id: "H2", obj: "BSO-RF hibrit optimizasyon çerçevesi tasarlamak ve uygulamak", rq: "Eşzamanlı öznitelik seçimi ve hiperparametre optimizasyonu, ayrı ayrı yapılan optimizasyona kıyasla sınıflandırma performansını artırır mı?", result: `%${bsoModel.accuracy} doğruluk, %${bsoModel.f1Macro} F1-Makro` },
                                    { id: "H3", obj: "Kapsamlı ve istatistiksel olarak geçerli karşılaştırmalı değerlendirme yapmak", rq: "Önerilen BSO-Hibrit RF yöntemi, mevcut ML ve diğer hibrit metasezgisel yöntemlerden istatistiksel olarak anlamlı şekilde farklı mıdır?", result: "12 model, 11 istatistiksel test (p < 0.05)" },
                                    { id: "H4", obj: "Dinamik ve gürültülü ortam koşullarında model dayanıklılığını değerlendirmek", rq: "Önerilen model, gerçek dünya ağ koşullarındaki gürültü ve bilinmeyen saldırı türleri karşısında ne düzeyde güvenilir tespit yapabilir?", result: "7 gürültü seviyesi, 4 bilinmeyen saldırı testi" },
                                    { id: "H5", obj: "Gerçek zamanlı ağ ortamlarında hesaplama verimliliğini analiz etmek", rq: "Önerilen çerçeve, yüksek hızlı ağ trafiği işleme gereksinimlerini karşılayabilir mi?", result: `${bsoModel.predictionTime} ms/örnek, 231.833 örnek/sn` },
                                ].map((row, i) => (
                                    <TableRow key={row.id} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} ${bold} text-indigo-700 dark:text-indigo-400 text-center`}>{row.id}</TableCell>
                                        <TableCell className={td}>{row.obj}</TableCell>
                                        <TableCell className={`${td} italic text-slate-600 dark:text-slate-400`}>{row.rq}</TableCell>
                                        <TableCell className={`${td} ${mono} ${bestCell}`}>{row.result}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 1.3 */}
                    <AcademicTable number="1.3" caption="Bu Tezin Bilimsel ve Pratik Katkıları" source="Yazarın kendi çalışması">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-8`}>#</TableHead>
                                    <TableHead className={`${hd} w-56`}>Katkı Alanı</TableHead>
                                    <TableHead className={hd}>Detaylı Açıklama</TableHead>
                                    <TableHead className={`${hd} w-44`}>Deneysel Kanıt</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["Verimli Boyut Azaltma ile Rekabetçi Performans", "BSO algoritması ile 39 öznitelikten 19'u seçilerek %51.3 boyut azaltma gerçekleştirilmiş; tam öznitelik RF'ine göre yalnızca %0.08 fark ile karşılaştırılabilir performans elde edilmiştir. Öznitelik başına verimlilik oranı (doğruluk/öznitelik) tüm modeller arasında en yüksek değerdedir (4.73 vs XGBoost 2.32).", `%${bsoModel.accuracy} doğ. (19 özn.) vs %89.74 RF (39 özn.) — fark sadece %0.08`],
                                    ["BSO-Hibrit Eşzamanlı Optimizasyon", "Öznitelik seçimi ({0,1}^39) ve RF hiperparametre optimizasyonu (ℝ⁴) birleşik arama uzayında eşzamanlı gerçekleştirilmiş; PSO-RF'e göre +%1.47, GA-RF'e göre +%0.45 istatistiksel olarak anlamlı üstünlük (p < 0.05) elde edilmiştir.", `BSO > PSO (+%1.47, p<0.001), BSO > GA (+%0.45, p<0.001)`],
                                    ["Kapsamlı Karşılaştırma Çerçevesi", "12 ML modeli (6 geleneksel + 1 topluluk + 5 hibrit) ve 4 metasezgisel optimizatör (BSO, PSO, GA, GWO) ile sistematik değerlendirme; eşleştirilmiş t-testi, Wilcoxon, Cohen's d ile istatistiksel doğrulama. MCC ve AUC-ROC dahil 8 performans metriği kullanılmıştır.", "11 istatistiksel test, 10 katlı CV (σ=0.194)"],
                                    ["Çok-Sınıflı DDoS Tespiti", "İkili sınıflandırma yerine 5 sınıflı (BenignTraffic, DDoS-ACK, DDoS-SYN, Backdoor, Recon) detaylı saldırı tür ayrımı; CICIoT2023 üzerinde çok-sınıflı değerlendirme", `5 sınıf, ${DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} örnek`],
                                    ["Dinamik Ortam Analizi", "Gauss gürültüsü ekleme (%0–30), bilinmeyen saldırı türü tespiti (leave-one-class-out), ve işlem hacmi (throughput) analizleri ile gerçek dünya koşullarında dayanıklılık değerlendirmesi", "7 gürültü seviyesi, 4 bilinmeyen saldırı, 5 parti boyutu"],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} text-slate-500 text-center`}>{i + 1}</TableCell>
                                        <TableCell className={`${td} ${bold}`}>{row[0]}</TableCell>
                                        <TableCell className={td}>{row[1]}</TableCell>
                                        <TableCell className={`${td} ${mono} text-emerald-700 dark:text-emerald-400 text-sm`}>{row[2]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 1.4 */}
                    <AcademicTable number="1.4" caption="Tez Organizasyonu ve Bölüm İçerikleri">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-28`}>Bölüm</TableHead>
                                    <TableHead className={`${hd} w-48`}>Başlık</TableHead>
                                    <TableHead className={hd}>İçerik Özeti</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["Bölüm 1", "Giriş", "Araştırma problemi, motivasyon, hedefler, araştırma soruları, bilimsel katkılar, tez organizasyonu"],
                                    ["Bölüm 2", "Literatür Taraması", "DDoS saldırıları ve sınıflandırması, ML tabanlı tespit yöntemleri, metasezgisel optimizasyon, öznitelik seçimi, CICIoT2023 veri seti, ilgili çalışmalar"],
                                    ["Bölüm 3", "Araştırma Yöntemi", "Veri seti analizi, ön işleme ardışık düzeni, BSO algoritma tasarımı, hibrit çerçeve mimarisi, ML modelleri, değerlendirme metrikleri"],
                                    ["Bölüm 4", "Bulgular ve Tartışma", "Sınıflandırma sonuçları, sınıf bazlı performans, karışıklık matrisleri, metasezgisel karşılaştırma, çapraz doğrulama, istatistiksel testler, hesaplama verimliliği, dinamik ortam testleri"],
                                    ["Bölüm 5", "Sonuç ve Öneriler", "Ana bulguların özeti, araştırma sorularının yanıtları, sınırlılıklar, gelecek çalışma önerileri"],
                                    ["Ekler", "Ek Materyaller", "Tam öznitelik listesi (39 öznitelik), detaylı öznitelik seçim karşılaştırması, optimizatör yakınsama verileri"],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} ${bold} text-indigo-700 dark:text-indigo-400`}>{row[0]}</TableCell>
                                        <TableCell className={`${td} ${bold}`}>{row[1]}</TableCell>
                                        <TableCell className={td}>{row[2]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
           BÖLÜM 2 — LİTERATÜR TARAMASI
         ═══════════════════════════════════════════════════════════ */}
            {activeChapter === "ch2" && (
                <div>
                    <ChapterDivider
                        chapter="Bölüm 2"
                        title="Literatür Taraması"
                        icon={FileText}
                        gradient="from-purple-600 to-violet-700"
                        description="DDoS saldırı türleri, ML tabanlı tespit yöntemleri, referans veri setleri ve Scopus indeksli ilgili çalışmalar"
                    />

                    {/* Tablo 2.1 */}
                    <AcademicTable number="2.1" caption="CICIoT2023 Veri Setindeki Trafik Sınıfları ve Örneklem Dağılımları" source="Neto et al., 2023 — CICIoT2023 veri seti">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Sınıf Adı</TableHead>
                                    <TableHead className={hd}>Saldırı Kategorisi</TableHead>
                                    <TableHead className={`${hd} text-right`}>Orijinal Eğitim</TableHead>
                                    <TableHead className={`${hd} text-right`}>SMOTE Sonrası</TableHead>
                                    <TableHead className={`${hd} text-right`}>Test Seti</TableHead>
                                    <TableHead className={`${hd} text-right`}>Oran (%)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {CICIOT2023_ATTACK_TYPES.map((atk, i) => {
                                    const totalTest = CICIOT2023_ATTACK_TYPES.reduce((s, a) => s + a.testingSamples, 0)
                                    return (
                                        <TableRow key={atk.name} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                            <TableCell className={`${td} ${bold}`}>
                                                <span className="inline-flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: atk.color }} />
                                                    {atk.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className={td}>
                                                {atk.name === "BenignTraffic" ? "Normal Trafik" :
                                                    atk.name === "DDoS-ACK_Fragmentation" ? "Hacimsel DDoS" :
                                                        atk.name === "DDoS-SYN_Flood" ? "Protokol DDoS" :
                                                            atk.name === "Backdoor_Malware" ? "Kötü Amaçlı Yazılım" :
                                                                "Keşif Saldırısı"}
                                            </TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{atk.trainingSamples.toLocaleString("tr-TR")}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{atk.smoteSamples.toLocaleString("tr-TR")}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{atk.testingSamples.toLocaleString("tr-TR")}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{((atk.testingSamples / totalTest) * 100).toFixed(1)}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-slate-100 dark:bg-slate-800 font-bold">
                                    <TableCell className={`${td} ${bold}`} colSpan={2}>Toplam</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{CICIOT2023_ATTACK_TYPES.reduce((s, a) => s + a.trainingSamples, 0).toLocaleString("tr-TR")}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{CICIOT2023_ATTACK_TYPES.reduce((s, a) => s + a.smoteSamples, 0).toLocaleString("tr-TR")}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{CICIOT2023_ATTACK_TYPES.reduce((s, a) => s + a.testingSamples, 0).toLocaleString("tr-TR")}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>100.0</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 2.2 */}
                    <AcademicTable number="2.2" caption="Ağ Saldırı Tespitinde Kullanılan Referans Veri Setlerinin Karşılaştırması" source="İlgili literatürden derleme">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Veri Seti</TableHead>
                                    <TableHead className={`${hd} text-center`}>Yıl</TableHead>
                                    <TableHead className={`${hd} text-right`}>Örnek Sayısı</TableHead>
                                    <TableHead className={`${hd} text-right`}>Öznitelik</TableHead>
                                    <TableHead className={`${hd} text-right`}>Sınıf</TableHead>
                                    <TableHead className={`${hd} text-center`}>IoT</TableHead>
                                    <TableHead className={`${hd} text-center`}>Güncellik</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { name: "KDD Cup 99", year: "1999", samples: "4.898.431", features: 41, classes: 5, iot: false, currency: "Düşük" },
                                    { name: "NSL-KDD", year: "2009", samples: "148.517", features: 41, classes: 5, iot: false, currency: "Düşük" },
                                    { name: "UNSW-NB15", year: "2015", samples: "2.540.044", features: 49, classes: 10, iot: false, currency: "Orta" },
                                    { name: "CICIDS2017", year: "2017", samples: "2.830.743", features: 78, classes: 15, iot: false, currency: "Orta" },
                                    { name: "CIC-DDoS2019", year: "2019", samples: "50.063.112", features: 87, classes: 13, iot: false, currency: "Orta" },
                                    { name: "TON_IoT", year: "2020", samples: "461.043", features: 44, classes: 10, iot: true, currency: "Yüksek" },
                                    { name: "Edge-IIoTset", year: "2022", samples: "10.686.199", features: 61, classes: 14, iot: true, currency: "Yüksek" },
                                    { name: "CICIoT2023", year: "2023", samples: "118.466*", features: 39, classes: 5, iot: true, currency: "En güncel", selected: true },
                                ].map((ds, i) => (
                                    <TableRow key={ds.name} className={ds.selected ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold} ${ds.selected ? bestCell : ""}`}>{ds.name}</TableCell>
                                        <TableCell className={`${td} ${mono} text-center`}>{ds.year}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{ds.samples}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{ds.features}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{ds.classes}</TableCell>
                                        <TableCell className={`${td} text-center`}>{ds.iot ? "✓" : "—"}</TableCell>
                                        <TableCell className={`${td} text-center ${ds.selected ? bestCell : ""}`}>{ds.currency}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p className="text-[11px] text-slate-500 mt-2 px-4 pb-2 italic">* Alt örnekleme sonrası kullanılan örnek sayısı. Orijinal veri seti 46 farklı saldırı türü içermektedir.</p>
                    </AcademicTable>

                    {/* Tablo 2.3 — State of the Art on CICIoT2023 */}
                    <AcademicTable number="2.3" caption="CICIoT2023 Veri Seti Üzerindeki Güncel Çalışmalar ile Önerilen Yöntemin Karşılaştırması" source="Neto et al. (2023); Ferrag et al. (2023); Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Çalışma</TableHead>
                                    <TableHead className={`${hd} text-center`}>Yıl</TableHead>
                                    <TableHead className={hd}>Veri Seti</TableHead>
                                    <TableHead className={hd}>Yöntem</TableHead>
                                    <TableHead className={`${hd} text-center`}>Sınıflandırma Türü</TableHead>
                                    <TableHead className={`${hd} text-right`}>Doğruluk (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>F1 (%)</TableHead>
                                    <TableHead className={hd}>Öznitelik Seçimi</TableHead>
                                    <TableHead className={hd}>Not</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {STATE_OF_THE_ART.map((row, i) => {
                                    const isProposed = row.paper.includes("Proposed")
                                    return (
                                        <TableRow key={i} className={isProposed ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                            <TableCell className={`${td} ${bold} ${isProposed ? bestCell : ""}`}>{row.paper}</TableCell>
                                            <TableCell className={`${td} ${mono} text-center`}>{isProposed ? "2026" : "2023"}</TableCell>
                                            <TableCell className={`${td} text-[12px]`}>{row.dataset}</TableCell>
                                            <TableCell className={`${td} text-[12px]`}>{row.method}</TableCell>
                                            <TableCell className={`${td} text-center text-[12px]`}>{isProposed ? "Çok-sınıflı (5)" : "İkili"}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{row.accuracy.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{row.f1Score.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} text-[12px]`}>{isProposed ? "BSO (39→19, %51.3 azaltma)" : "Yok (tüm öznitelikler)"}</TableCell>
                                            <TableCell className={`${td} text-[11px] text-slate-500 dark:text-slate-400`}>{row.note}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        <p className="text-[11px] text-slate-500 mt-2 px-4 pb-2 italic">
                            ⚠ Kritik Metodolojik Not: Neto et al. ve Ferrag et al. ikili sınıflandırma (normal vs saldırı) kullanmaktadır; önerilen yöntem ise 5 sınıflı
                            çok-sınıflı sınıflandırma gerçekleştirir. İkili sınıflandırmada tek bir karar sınırı yeterli iken, 5 sınıflı problemde model 4 farklı sınıf
                            sınırını eşzamanlı öğrenmelidir — bu durum görevi inherent olarak zorlaştırır (Fernández et al., 2018). Literatürde ikili→çok-sınıflı
                            geçişte %5–15 doğruluk kaybı normal kabul edilmektedir. Bu bağlamda %89.82 doğruluk oldukça rekabetçi bir değerdir. Ayrıca, önerilen
                            yöntem ek olarak %51.3 otomatik boyut azaltma ve BSO tabanlı hiperparametre optimizasyonu katkıları sunmaktadır — bu özellikler
                            karşılaştırılan diğer çalışmalarda bulunmamaktadır.
                        </p>
                    </AcademicTable>

                    {/* Tablo 2.4 */}
                    <AcademicTable number="2.4" caption="Metasezgisel Optimizasyon Algoritmalarının Karşılaştırması" source="Yang, 2010; Kennedy & Eberhart, 1995; Holland, 1975; Mirjalili et al., 2014">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Algoritma</TableHead>
                                    <TableHead className={hd}>İlham Kaynağı</TableHead>
                                    <TableHead className={`${hd} text-center`}>Yıl</TableHead>
                                    <TableHead className={hd}>Keşif Mekanizması</TableHead>
                                    <TableHead className={hd}>Sömürü Mekanizması</TableHead>
                                    <TableHead className={hd}>Güçlü Yönü</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["BSO (Bat Swarm)", "Yarasa ekolokasyonu", "2010", "Frekans ayarı ile küresel arama", "Gürlük ve nabız oranı ile lokal arama", "Keşif-sömürü otomatik dengesi"],
                                    ["PSO (Particle Swarm)", "Kuş/balık sürü davranışı", "1995", "Kognitif ve sosyal bileşenler", "En iyi konuma yakınsama", "Hızlı yakınsama, az parametre"],
                                    ["GA (Genetic Algorithm)", "Doğal evrim süreci", "1975", "Çaprazlama ve mutasyon", "Elitizm ile seçilim", "Geniş arama uzayı keşfi"],
                                    ["GWO (Grey Wolf)", "Kurt sürüsü hiyerarşisi", "2014", "α, β, δ kurt rehberliği", "Çember daralma mekanizması", "Basit implementasyon"],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i === 0 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold} ${i === 0 ? bestCell : ""}`}>{row[0]}</TableCell>
                                        <TableCell className={td}>{row[1]}</TableCell>
                                        <TableCell className={`${td} ${mono} text-center`}>{row[2]}</TableCell>
                                        <TableCell className={`${td} text-[12px]`}>{row[3]}</TableCell>
                                        <TableCell className={`${td} text-[12px]`}>{row[4]}</TableCell>
                                        <TableCell className={`${td} text-[12px]`}>{row[5]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 2.5 */}
                    <AcademicTable number="2.5" caption="CICIoT2023 Veri Setinden 5 Sınıf Seçiminin Bilimsel Gerekçesi" source="Neto et al. (2023); Yazarın metodolojik kararı">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-8`}>#</TableHead>
                                    <TableHead className={`${hd} w-52`}>Gerekçe</TableHead>
                                    <TableHead className={hd}>Detaylı Açıklama</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["Saldırı Kategori Temsili", "CICIoT2023 orijinal 33 alt saldırı türü 7 ana kategoriye ayrılmaktadır. Seçilen 5 sınıf, en kritik 4 ana kategoriyi (Hacimsel DDoS, Protokol DDoS, Keşif Saldırısı, Backdoor/Kötü Amaçlı Yazılım) ve normal trafiği temsil ederek saldırı yelpazesinin %80'inden fazlasını kapsamaktadır."],
                                    ["Hesaplama Fizibilitesi", "33 sınıflı BSO optimizasyonu (25 popülasyon × 50 iterasyon × 33 sınıf) hesaplama maliyetini katlanarak artırır. 5 sınıf seçimi, BSO optimizasyonunu 22 dakikalık makul bir süreye indirerek kapsamlı 4 optimizatör karşılaştırması yapabilmeyi mümkün kılmıştır."],
                                    ["SMOTE Dengeleme Kalitesi", "33 sınıfın çoğu son derece az örneğe sahiptir (bazıları <100). SMOTE ile 33 sınıfı eşzamanlı dengelemek sentetik örneklerin kalitesini önemli ölçüde düşürür (Fernández et al., 2018). 5 sınıf ile SMOTE uygulaması daha güvenilir sentetik örnekler üretmektedir."],
                                    ["Tezin Bilimsel Odağı", "Bu tezin ana katkısı BSO tabanlı hibrit öznitelik seçimi ve eşzamanlı optimizasyon çerçevesidir — sınıflandırma görevinin karmaşıklığı değil. 5 sınıf ile BSO'nun etkinliği, diğer optimizatörlere (PSO, GA, GWO) karşı net olarak değerlendirilmiştir."],
                                    ["Literatür Tutarlılığı", "CICIoT2023 üzerindeki mevcut çalışmalar (Neto et al., 2023; Ferrag et al., 2023) da sabit sayıda sınıf kullanmıştır. Önerilen 5 sınıf seçimi, çok-sınıflı sınıflandırma zorluğunu getirirken ikili sınıflandırmaya göre önemli ek karmaşıklık eklemektedir."],
                                    ["Genişletilebilirlik", "Önerilen BSO-Hibrit çerçeve, modüler yapısı sayesinde 33 sınıfa genişletilebilir niteliktedir. Bu genişletme, gelecek çalışma önerisi olarak Tablo 5.2'de sunulmaktadır."],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} text-slate-500 text-center`}>{i + 1}</TableCell>
                                        <TableCell className={`${td} ${bold}`}>{row[0]}</TableCell>
                                        <TableCell className={td}>{row[1]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
           BÖLÜM 3 — YÖNTEM
         ═══════════════════════════════════════════════════════════ */}
            {activeChapter === "ch3" && (
                <div>
                    <ChapterDivider
                        chapter="Bölüm 3"
                        title="Araştırma Yöntemi"
                        icon={Brain}
                        gradient="from-emerald-600 to-teal-700"
                        description="Veri seti, ön işleme, BSO algoritması parametreleri, hibrit çerçeve yapısı ve değerlendirme stratejisi"
                    />

                    {/* Tablo 3.1 */}
                    <AcademicTable number="3.1" caption="CICIoT2023 Veri Seti Genel İstatistikleri" source="Neto et al. (2023); Yazarın deney ortamı">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Parametre</TableHead>
                                    <TableHead className={`${hd} w-40`}>Değer</TableHead>
                                    <TableHead className={hd}>Açıklama</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["Toplam Örnek", DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR"), "Alt örnekleme sonrası kullanılan toplam ağ akışı sayısı"],
                                    ["Orijinal Öznitelik Sayısı", DATASET_STATISTICS.totalFeatures.toString(), "CICIoT2023 veri setindeki toplam öznitelik sayısı"],
                                    ["Seçilen Öznitelik Sayısı", DATASET_STATISTICS.selectedFeatures.toString(), "BSO algoritması tarafından seçilen öznitelik sayısı"],
                                    ["Boyut Azaltma Oranı", `%${DATASET_STATISTICS.featureReductionPct}`, "BSO öznitelik seçimi ile sağlanan azaltma oranı"],
                                    ["Sınıf Sayısı", DATASET_STATISTICS.classes.toString(), "1 normal (benign) + 4 saldırı sınıfı"],
                                    ["Eğitim Seti (SMOTE Sonrası)", DATASET_STATISTICS.totalFlows.training.toLocaleString("tr-TR"), "Dengeli eğitim seti boyutu (SMOTE uygulanmış)"],
                                    ["Doğrulama Seti", DATASET_STATISTICS.totalFlows.validation.toLocaleString("tr-TR"), "Hiperparametre seçimi için ayrılan doğrulama seti"],
                                    ["Test Seti", DATASET_STATISTICS.totalFlows.testing.toLocaleString("tr-TR"), "Son değerlendirme için kullanılan bağımsız test seti"],
                                    ["Bölme Stratejisi", DATASET_STATISTICS.splitRatio, "Sınıf dağılımını koruyarak tabakalı (stratified) bölme"],
                                    ["SMOTE Sentetik Örnek", DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString("tr-TR"), `Azınlık sınıfı ${DATASET_STATISTICS.originalMinorityCount} → ${DATASET_STATISTICS.balancedClassCount.toLocaleString("tr-TR")} dengeleme`],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold}`}>{row[0]}</TableCell>
                                        <TableCell className={`${td} ${mono} ${bold} text-indigo-700 dark:text-indigo-400`}>{row[1]}</TableCell>
                                        <TableCell className={td}>{row[2]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 3.2 */}
                    <AcademicTable number="3.2" caption="Veri Ön İşleme Ardışık Düzeni (Pipeline) Adımları ve Etkileri">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-16 text-center`}>Adım</TableHead>
                                    <TableHead className={`${hd} w-52`}>İşlem</TableHead>
                                    <TableHead className={hd}>Teknik Detay</TableHead>
                                    <TableHead className={hd}>Veri Üzerindeki Etki</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    [1, "Veri Yükleme", "CICIoT2023 veri setinden 19 CSV dosyasının Pandas ile yüklenmesi ve birleştirilmesi", "Ham veri seti oluşturuldu"],
                                    [2, "Alt Örnekleme", "Çoğunluk sınıfları sınıf başına 25.000 örneğe rastgele alt örnekleme", "Hesaplama maliyeti azaltıldı; temsil korundu"],
                                    [3, "Eksik Değer İşleme", "NaN ve sonsuz (inf) değerlerin kontrol edilmesi ve kaldırılması", "Veri kalitesi ve tutarlılığı sağlandı"],
                                    [4, "Tabakalı Bölme", "Veri setinin %70 eğitim, %10 doğrulama, %20 test olarak stratified bölünmesi", "Sınıf dağılımı tüm alt kümelerde korundu"],
                                    [5, "SMOTE Dengeleme", "Eğitim setine SMOTE uygulanması: 72.252 → 87.500 (sınıf başına 17.500)", "Sınıf dengesizliği giderildi; azınlık sınıfı güçlendirildi"],
                                    [6, "StandardScaler", "Tüm özniteliklerin μ=0, σ=1 olacak şekilde z-score normalizasyonu", "Öznitelik ölçek farklılıkları ortadan kaldırıldı"],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} ${bold} text-center text-indigo-700 dark:text-indigo-400`}>{row[0]}</TableCell>
                                        <TableCell className={`${td} ${bold}`}>{row[1]}</TableCell>
                                        <TableCell className={td}>{row[2]}</TableCell>
                                        <TableCell className={`${td} text-emerald-700 dark:text-emerald-400`}>{row[3]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 3.3 */}
                    <AcademicTable number="3.3" caption="BSO Algoritması ile Seçilen 19 Öznitelik ve Önem Sıralaması (Random Forest Gini İmpürite)" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-16 text-center`}>Sıra</TableHead>
                                    <TableHead className={hd}>Öznitelik Adı</TableHead>
                                    <TableHead className={`${hd} text-right`}>Önem Skoru</TableHead>
                                    <TableHead className={`${hd} text-right`}>Kümülatif (%)</TableHead>
                                    <TableHead className={hd}>Öznitelik Kategorisi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(() => {
                                    const total = BSO_SELECTED_FEATURES.reduce((s, f) => s + f.importance, 0)
                                    let cumulative = 0
                                    return BSO_SELECTED_FEATURES.map((f, i) => {
                                        cumulative += (f.importance / total) * 100
                                        const category = f.name.includes("flag") || f.name.includes("count") ? "TCP Bayrak" :
                                            ["HTTP", "HTTPS", "DNS", "SSH", "UDP", "DHCP", "ARP", "IGMP", "LLC"].includes(f.name) ? "Protokol" :
                                                ["Tot sum", "Max", "Number", "Rate"].includes(f.name) ? "İstatistiksel" :
                                                    ["Header_Length", "Time_To_Live"].includes(f.name) ? "Paket Başlığı" : "Diğer"
                                        return (
                                            <TableRow key={f.rank} className={f.rank <= 5 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                                <TableCell className={`${td} ${mono} ${bold} text-center`}>
                                                    {f.rank <= 3 ? `🥇🥈🥉`.charAt((f.rank - 1) * 2) + `🥇🥈🥉`.charAt((f.rank - 1) * 2 + 1) : f.rank}
                                                </TableCell>
                                                <TableCell className={`${td} ${mono} ${bold}`}>{f.name}</TableCell>
                                                <TableCell className={`${td} ${mono} text-right`}>{f.importance.toFixed(6)}</TableCell>
                                                <TableCell className={`${td} ${mono} text-right ${cumulative >= 95 ? bestCell : ""}`}>{cumulative.toFixed(1)}</TableCell>
                                                <TableCell className={td}>
                                                    <Badge variant="outline" className="text-[11px]">{category}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                })()}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableCell className={`${td} ${bold}`} />
                                    <TableCell className={`${td} ${bold}`}>Toplam (19 öznitelik)</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{BSO_SELECTED_FEATURES.reduce((s, f) => s + f.importance, 0).toFixed(6)}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>100.0</TableCell>
                                    <TableCell className={td}>%{DATASET_STATISTICS.featureReductionPct} azaltma</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 3.4 */}
                    <AcademicTable number="3.4" caption="BSO (Bat Swarm Optimization) Algoritması Parametreleri ve Yapılandırması" source="Yang (2010); Yazarın parametre ayarlaması">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Parametre</TableHead>
                                    <TableHead className={`${hd} w-28`}>Sembol</TableHead>
                                    <TableHead className={`${hd} w-32`}>Değer</TableHead>
                                    <TableHead className={hd}>Açıklama</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["Popülasyon Boyutu", "N", BSO_PARAMETERS.populationSize.toString(), "Sürüdeki yarasa sayısı (çözüm adayları)"],
                                    ["Maksimum İterasyon", "T_max", BSO_PARAMETERS.maxIterations.toString(), "Optimizasyon döngü sayısı"],
                                    ["Frekans Aralığı", "f ∈ [f_min, f_max]", `[${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}]`, "Yarasa frekans aralığı — keşif çeşitliliği"],
                                    ["Başlangıç Gürlüğü", "A₀", BSO_PARAMETERS.initialLoudness.toString(), "Başlangıç ses yüksekliği parametresi"],
                                    ["Başlangıç Nabız Oranı", "r₀", BSO_PARAMETERS.initialPulseRate.toString(), "Başlangıç nabız emisyon oranı"],
                                    ["Gürlük Azalma Katsayısı", "α", BSO_PARAMETERS.alpha.toString(), "A_{t+1} = α · A_t (monoton azalan)"],
                                    ["Nabız Artış Katsayısı", "γ", BSO_PARAMETERS.gamma.toString(), "r_t = r₀ · (1 - e^{-γt}) (monoton artan)"],
                                    ["Arama Uzayı Boyutu", "D", `${BSO_PARAMETERS.dimensions} + 4`, "{0,1}^39 (öznitelik) × ℝ⁴ (hiperparametre)"],
                                    ["Uygunluk Fonksiyonu", "f(x)", "—", BSO_PARAMETERS.fitnessFunction],
                                    ["Toplam Fonksiyon Değerlendirmesi", "—", BSO_PARAMETERS.totalEvaluations.toLocaleString("tr-TR"), "BSO çalışması boyunca toplam uygunluk hesaplaması"],
                                    ["Optimizasyon Çalışma Süresi", "—", `${BSO_PARAMETERS.optimizationTime.toFixed(2)} s`, "BSO optimizasyon toplam süresi (≈14 dk)"],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold}`}>{row[0]}</TableCell>
                                        <TableCell className={`${td} ${mono} text-indigo-700 dark:text-indigo-400`}>{row[1]}</TableCell>
                                        <TableCell className={`${td} ${mono} ${bold}`}>{row[2]}</TableCell>
                                        <TableCell className={td}>{row[3]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 3.5 */}
                    <AcademicTable number="3.5" caption="BSO ile Optimize Edilen Random Forest Hiperparametreleri" source="Yazarın BSO optimizasyon sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Hiperparametre</TableHead>
                                    <TableHead className={hd}>Arama Aralığı</TableHead>
                                    <TableHead className={`${hd} ${bestCell}`}>Optimize Edilen Değer</TableHead>
                                    <TableHead className={hd}>Açıklama</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["n_estimators", `[${BSO_PARAMETERS.hyperparameterRanges.n_estimators.join(", ")}]`, BSO_PARAMETERS.optimizedHyperparameters.n_estimators.toString(), "Ormandaki karar ağacı sayısı"],
                                    ["max_depth", `[${BSO_PARAMETERS.hyperparameterRanges.max_depth.join(", ")}]`, BSO_PARAMETERS.optimizedHyperparameters.max_depth.toString(), "Her ağacın izin verilen maksimum derinliği"],
                                    ["min_samples_split", `[${BSO_PARAMETERS.hyperparameterRanges.min_samples_split.join(", ")}]`, BSO_PARAMETERS.optimizedHyperparameters.min_samples_split.toString(), "Düğüm bölünmesi için gereken minimum örnek sayısı"],
                                    ["max_features", `[${BSO_PARAMETERS.hyperparameterRanges.max_features_frac.join(", ")}]`, BSO_PARAMETERS.optimizedHyperparameters.max_features.toString(), "Her bölünmede dikkate alınacak öznitelik oranı"],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} ${bold}`}>{row[0]}</TableCell>
                                        <TableCell className={`${td} ${mono} text-slate-500`}>{row[1]}</TableCell>
                                        <TableCell className={`${td} ${mono} ${bestCell}`}>{row[2]}</TableCell>
                                        <TableCell className={td}>{row[3]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 3.6 */}
                    <AcademicTable number="3.6" caption="BSO-Hibrit RF Çerçeve Ardışık Düzeni (Pipeline) ve Veri Akışı">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-16 text-center`}>Aşama</TableHead>
                                    <TableHead className={`${hd} w-44`}>Bileşen</TableHead>
                                    <TableHead className={hd}>Giriş</TableHead>
                                    <TableHead className={hd}>Çıkış</TableHead>
                                    <TableHead className={hd}>Kullanılan Yöntem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    [1, "Veri Yükleme", "19 CSV dosyası (CICIoT2023)", "Birleşik ham veri seti", "Pandas DataFrame birleştirme"],
                                    [2, "Alt Örnekleme", `Ham veri seti`, `${DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} örnek`, "Rastgele alt örnekleme (25K/sınıf)"],
                                    [3, "Bölme", `${DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} örnek`, "Eğitim / Doğrulama / Test", "Tabakalı bölme (70/10/20)"],
                                    [4, "SMOTE", "72.252 eğitim örneği", "87.500 dengeli eğitim örneği", "SMOTE üst örnekleme"],
                                    [5, "Normalizasyon", "87.500 eğitim + 10K doğ. + 20K test", "Ölçekli veri matrisleri", "StandardScaler (z-score)"],
                                    [6, "BSO Optimizasyonu", `Arama uzayı: {0,1}^39 × ℝ⁴`, "19 öznitelik + 4 HP", "BSO-Hibrit (50 iter × 25 pop)"],
                                    [7, "Model Eğitimi", "87.500 × 19 matris", "Eğitilmiş RF modeli", "Random Forest (266 ağaç, derinlik 20)"],
                                    [8, "Değerlendirme", "20.644 test örneği × 19", "Performans metrikleri", "Accuracy, F1, AUC-ROC, MCC, CM"],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} ${bold} text-center text-indigo-700 dark:text-indigo-400`}>{row[0]}</TableCell>
                                        <TableCell className={`${td} ${bold}`}>{row[1]}</TableCell>
                                        <TableCell className={`${td} ${mono} text-[12px]`}>{row[2]}</TableCell>
                                        <TableCell className={`${td} ${mono} text-[12px]`}>{row[3]}</TableCell>
                                        <TableCell className={`${td} text-[12px]`}>{row[4]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
           BÖLÜM 4 — BULGULAR VE TARTIŞMA
         ═══════════════════════════════════════════════════════════ */}
            {activeChapter === "ch4" && (
                <div>
                    <ChapterDivider
                        chapter="Bölüm 4"
                        title="Bulgular ve Tartışma"
                        icon={BarChart3}
                        gradient="from-amber-600 to-orange-700"
                        description="Deneysel sonuçlar, model karşılaştırmaları, istatistiksel testler, dinamik ortam analizleri"
                    />

                    {/* Tablo 4.1 */}
                    <AcademicTable number="4.1" caption="Deneysel Ortam Yapılandırması ve Kullanılan Yazılım/Donanım Özellikleri">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-52`}>Bileşen</TableHead>
                                    <TableHead className={hd}>Teknik Detay</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["İşletim Sistemi", "Ubuntu 22.04 LTS / Windows 11"],
                                    ["Programlama Dili", "Python 3.10"],
                                    ["ML Kütüphanesi", "scikit-learn 1.3.2"],
                                    ["Optimizasyon Çerçevesi", "Özel BSO implementasyonu (Python/NumPy)"],
                                    ["Veri İşleme", "pandas 2.1.4, NumPy 1.26.2"],
                                    ["Dengeleme Kütüphanesi", "imbalanced-learn 0.11.0 (SMOTE)"],
                                    ["XGBoost Sürümü", "xgboost 2.0.2"],
                                    ["Veri Seti", "CICIoT2023 — 118.466 örnek, 39 öznitelik, 5 sınıf"],
                                    ["Toplam Çalışma Süresi", "1.332,6 saniye (≈22,2 dakika)"],
                                    ["Deney Tarihi", "23 Şubat 2026"],
                                    ["Çapraz Doğrulama", "10-katlı tabakalı çapraz doğrulama (Stratified K-Fold)"],
                                    ["Tekrarlanabilirlik", "random_state = 42 (tüm rastgele işlemler)"],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold}`}>{row[0]}</TableCell>
                                        <TableCell className={`${td} ${mono}`}>{row[1]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 4.2 */}
                    <AcademicTable number="4.2" caption="BSO-Hibrit RF Modeli: Sınıf Bazlı Sınıflandırma Raporu (Test Seti, n = 20.644)" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Sınıf</TableHead>
                                    <TableHead className={`${hd} text-right`}>Hassasiyet (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Duyarlılık (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>F1 Skoru (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Destek (n)</TableHead>
                                    <TableHead className={hd}>Yorum</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {BSO_RF_PER_CLASS.map((cls, i) => (
                                    <TableRow key={cls.className} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold}`}>{cls.className}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{cls.precision.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{cls.recall.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right ${cls.f1Score >= 99 ? bestCell : cls.f1Score < 70 ? "text-amber-600 dark:text-amber-400 font-bold" : ""}`}>{cls.f1Score.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{cls.support.toLocaleString("tr-TR")}</TableCell>
                                        <TableCell className={`${td} text-[12px] text-slate-500 dark:text-slate-400`}>
                                            {cls.className === "DDoS-ACK_Fragmentation" || cls.className === "DDoS-SYN_Flood"
                                                ? "Mükemmel tespit — belirgin protokol imzası sayesinde neredeyse hatasız sınıflandırma"
                                                : cls.className === "BenignTraffic"
                                                    ? "İyi tespit — çeşitli normal trafik kalıpları nedeniyle sınırlı karışma"
                                                    : cls.className === "Recon-PortScan"
                                                        ? "İyi tespit — normal tarama trafiğiyle kısmi örtüşme nedeniyle zorlayıcı"
                                                        : "Düşük destek (n=644); SMOTE sentetik örnekleri gerçek saldırı çeşitliliğini tam yansıtamamaktadır (SMOTE'un bilinen kısıtı, Chawla et al., 2002)"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-slate-100 dark:bg-slate-800 font-bold">
                                    <TableCell className={`${td} ${bold}`}>Makro Ortalama</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{(BSO_RF_PER_CLASS.reduce((s, c) => s + c.precision, 0) / BSO_RF_PER_CLASS.length).toFixed(2)}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{(BSO_RF_PER_CLASS.reduce((s, c) => s + c.recall, 0) / BSO_RF_PER_CLASS.length).toFixed(2)}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right ${bestCell}`}>{(BSO_RF_PER_CLASS.reduce((s, c) => s + c.f1Score, 0) / BSO_RF_PER_CLASS.length).toFixed(2)}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{BSO_RF_PER_CLASS.reduce((s, c) => s + c.support, 0).toLocaleString("tr-TR")}</TableCell>
                                    <TableCell className={td} />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 4.3 */}
                    <AcademicTable number="4.3" caption="BSO-Hibrit RF Karışıklık Matrisi (Test Seti, n = 20.644)" source="Yazarın deneysel sonuçları">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-100 dark:bg-slate-800">
                                        <TableHead className={`${hd}`}>Gerçek ↓ / Tahmin →</TableHead>
                                        {CONFUSION_MATRICES["BSO-RF"].labels.map((label) => (
                                            <TableHead key={label} className={`${hd} text-center text-[11px]`}>{label}</TableHead>
                                        ))}
                                        <TableHead className={`${hd} text-right`}>Toplam</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {CONFUSION_MATRICES["BSO-RF"].matrix.map((row, i) => (
                                        <TableRow key={i}>
                                            <TableCell className={`${td} ${bold}`}>{CONFUSION_MATRICES["BSO-RF"].labels[i]}</TableCell>
                                            {row.map((cell, j) => (
                                                <TableCell
                                                    key={j}
                                                    className={`${td} ${mono} text-center ${i === j
                                                        ? "bg-emerald-100 dark:bg-emerald-900/40 font-bold text-emerald-800 dark:text-emerald-300"
                                                        : cell > 0
                                                            ? "bg-red-50 dark:bg-red-900/15 text-red-700 dark:text-red-400"
                                                            : "text-slate-400"
                                                        }`}
                                                >
                                                    {cell.toLocaleString("tr-TR")}
                                                </TableCell>
                                            ))}
                                            <TableCell className={`${td} ${mono} ${bold} text-right`}>{row.reduce((s, c) => s + c, 0).toLocaleString("tr-TR")}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow className="bg-slate-100 dark:bg-slate-800">
                                        <TableCell className={`${td} ${bold}`}>Toplam</TableCell>
                                        {CONFUSION_MATRICES["BSO-RF"].matrix[0].map((_, j) => (
                                            <TableCell key={j} className={`${td} ${mono} ${bold} text-center`}>
                                                {CONFUSION_MATRICES["BSO-RF"].matrix.reduce((s, row) => s + row[j], 0).toLocaleString("tr-TR")}
                                            </TableCell>
                                        ))}
                                        <TableCell className={`${td} ${mono} ${bold} text-right`}>{CONFUSION_MATRICES["BSO-RF"].total.toLocaleString("tr-TR")}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </AcademicTable>

                    {/* Tablo 4.4 */}
                    <AcademicTable number="4.4" caption="Tüm Modellerin Sınıflandırma Performansı Karşılaştırması (Test Seti, n = 20.644)" source="Yazarın deneysel sonuçları">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-100 dark:bg-slate-800">
                                        <TableHead className={hd}>Model</TableHead>
                                        <TableHead className={`${hd} text-right`}>Doğ. (%)</TableHead>
                                        <TableHead className={`${hd} text-right`}>Has. (%)</TableHead>
                                        <TableHead className={`${hd} text-right`}>Duy. (%)</TableHead>
                                        <TableHead className={`${hd} text-right`}>F1 (%)</TableHead>
                                        <TableHead className={`${hd} text-right`}>F1-M (%)</TableHead>
                                        <TableHead className={`${hd} text-right`}>AUC (%)</TableHead>
                                        <TableHead className={`${hd} text-right`}>MCC</TableHead>
                                        <TableHead className={`${hd} text-right`}>Özn.</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MODEL_RESULTS.map((m, i) => (
                                        <TableRow key={m.name} className={i === 0 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                            <TableCell className={`${td} ${bold} ${i === 0 ? bestCell : ""} whitespace-nowrap`}>
                                                {m.name}
                                            </TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{m.accuracy.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{m.precision.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{m.recall.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{m.f1Score.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right ${i === 0 ? bestCell : ""}`}>{m.f1Macro.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{m.aucRoc.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{m.mcc.toFixed(4)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{m.featuresUsed}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 px-4 pb-2 italic">
                            Doğ.=Doğruluk, Has.=Hassasiyet, Duy.=Duyarlılık, F1-M=F1-Makro, AUC=AUC-ROC, MCC=Matthews Korelasyon Katsayısı, Özn.=Kullanılan öznitelik sayısı.
                            Koyu satır önerilen BSO-Hibrit RF modelini göstermektedir. XGBoost (%90.37) en yüksek ham doğruluğu elde etmekle birlikte, 39 özniteliğin tamamını
                            kullanmaktadır. BSO-Hibrit RF ise yalnızca 19 öznitelikle (%51.3 azaltma) %89.82 doğruluk elde ederek hesaplama verimliliği ve model basitliği açısından
                            önemli avantaj sağlamaktadır. Öznitelik başına verimlilik: BSO-Hibrit RF = 4.73, XGBoost = 2.32 — BSO-Hibrit bu metrikte %104 daha verimlidir.
                        </p>
                    </AcademicTable>

                    {/* Tablo 4.5 */}
                    <AcademicTable number="4.5" caption="Metasezgisel Hibrit Modellerin Karşılaştırması (BSO, PSO, GA, GWO ile RF)" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Hibrit Model</TableHead>
                                    <TableHead className={`${hd} text-right`}>Doğ. (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>F1-M (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>AUC (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>MCC</TableHead>
                                    <TableHead className={`${hd} text-right`}>Özn.</TableHead>
                                    <TableHead className={`${hd} text-right`}>Azaltma</TableHead>
                                    <TableHead className={`${hd} text-right`}>Eğitim (s)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MODEL_RESULTS.filter(m => m.featureSet && m.featureSet !== "All").map((m, i) => (
                                    <TableRow key={m.name} className={i === 0 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold} ${i === 0 ? bestCell : ""}`}>{m.name}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{m.accuracy.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right ${i === 0 ? bestCell : ""}`}>{m.f1Macro.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{m.aucRoc.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{m.mcc.toFixed(4)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{m.featuresUsed}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>%{((1 - m.featuresUsed / DATASET_STATISTICS.totalFeatures) * 100).toFixed(1)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{m.trainingTime.toFixed(3)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 4.6 */}
                    <AcademicTable number="4.6" caption="10-Katlı Tabakalı Çapraz Doğrulama Sonuçları — BSO-Hibrit RF" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-20 text-center`}>Kat (k)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Doğruluk (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Hassasiyet (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Duyarlılık (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>F1 Skoru (%)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {CROSS_VALIDATION.results.map((fold, i) => (
                                    <TableRow key={fold.fold} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} ${bold} text-center`}>{fold.fold}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{fold.accuracy.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{fold.precision.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{fold.recall.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{fold.f1Score.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-slate-100 dark:bg-slate-800 font-bold">
                                    <TableCell className={`${td} ${bold} text-center`}>μ ± σ</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right ${bestCell}`}>{CROSS_VALIDATION.mean.accuracy.toFixed(2)} ± {CROSS_VALIDATION.std.accuracy.toFixed(3)}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{CROSS_VALIDATION.mean.precision.toFixed(2)} ± {CROSS_VALIDATION.std.precision.toFixed(3)}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{CROSS_VALIDATION.mean.recall.toFixed(2)} ± {CROSS_VALIDATION.std.recall.toFixed(3)}</TableCell>
                                    <TableCell className={`${td} ${mono} ${bold} text-right`}>{CROSS_VALIDATION.mean.f1Score.toFixed(2)} ± {CROSS_VALIDATION.std.f1Score.toFixed(3)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 4.7 */}
                    <AcademicTable number="4.7" caption="Hesaplama Verimliliği Karşılaştırması: Eğitim ve Tahmin Süreleri" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Model</TableHead>
                                    <TableHead className={`${hd} text-right`}>Eğitim (s)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Tahmin (ms/örn)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Öznitelik</TableHead>
                                    <TableHead className={hd}>Öznitelik Seti</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {COMPUTATIONAL_EFFICIENCY.map((m, i) => (
                                    <TableRow key={m.model} className={i === 0 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold} ${i === 0 ? bestCell : ""} whitespace-nowrap`}>{m.model}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{m.trainingTime.toFixed(3)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{m.predictionTimeMs.toFixed(4)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{m.featuresUsed}</TableCell>
                                        <TableCell className={td}>{m.featureSet}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 4.8 */}
                    <AcademicTable number="4.8" caption="Gürültü Dayanıklılık Analizi: Farklı Gauss Gürültü Seviyelerinde BSO-Hibrit RF Performansı" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} text-right`}>Gürültü Oranı (σ)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Doğruluk (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>F1-Makro (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Performans Düşüşü (%)</TableHead>
                                    <TableHead className={hd}>Değerlendirme</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {DYNAMIC_ENVIRONMENT.noiseRobustness.map((row, i) => (
                                    <TableRow key={row.noiseLevel} className={row.noiseLevel === 0 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} text-right`}>{(row.noiseLevel * 100).toFixed(0)}%</TableCell>
                                        <TableCell className={`${td} ${mono} ${bold} text-right`}>{row.accuracy.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{row.f1Macro.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right ${row.degradation > 25 ? "text-red-600 dark:text-red-400 font-bold" : row.degradation > 0 ? "text-amber-600 dark:text-amber-400" : bestCell}`}>
                                            {row.degradation > 0 ? `−${row.degradation.toFixed(2)}` : "Referans"}
                                        </TableCell>
                                        <TableCell className={`${td} text-[12px]`}>
                                            {row.noiseLevel === 0 ? "Gürültüsüz referans performans (baseline)"
                                                : row.noiseLevel <= 0.05 ? "Ağaç tabanlı modellerde beklenen davranış — bölünme noktaları gürültüye duyarlıdır (Breiman, 2001)"
                                                    : row.noiseLevel <= 0.1 ? "Performans plato bölgesine yaklaşma — ensemble etkisi ile stabilizasyon"
                                                        : row.noiseLevel <= 0.2 ? "Gürültü artmasına rağmen 5 sınıflı rastgele tahminin (%20) 3× üzerinde performans"
                                                            : "En yüksek gürültüde bile %59+ doğruluk — rastgele tahmin (%20) üzerinde güçlü konum"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 4.9 */}
                    <AcademicTable number="4.9" caption="İstatistiksel Anlamlılık Testleri: BSO-Hibrit RF ile Diğer Modellerin Karşılaştırması (10-Katlı CV)" source="Yazarın deneysel sonuçları">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-100 dark:bg-slate-800">
                                        <TableHead className={hd}>Karşılaştırma</TableHead>
                                        <TableHead className={`${hd} text-right`}>Δ Doğ.</TableHead>
                                        <TableHead className={`${hd} text-right`}>t-İst.</TableHead>
                                        <TableHead className={`${hd} text-right`}>p-Değeri</TableHead>
                                        <TableHead className={`${hd} text-right`}>Cohen d</TableHead>
                                        <TableHead className={`${hd} text-center`}>Anl.</TableHead>
                                        <TableHead className={hd}>Yorum</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {STATISTICAL_TESTS.map((test, i) => (
                                        <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                            <TableCell className={`${td} ${bold} text-[12px] whitespace-nowrap`}>{test.comparison}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right ${test.improvement.startsWith("+") ? bestCell : "text-amber-600 dark:text-amber-400 font-bold"}`}>
                                                {test.improvement}
                                            </TableCell>
                                            <TableCell className={`${td} ${mono} text-right text-[12px]`}>{test.tStatistic.toFixed(4)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right text-[12px] ${test.pValue < 0.001 ? bestCell : ""}`}>
                                                {test.pValue === 0 ? "< 0.0001" : test.pValue < 0.001 ? test.pValue.toExponential(2) : test.pValue.toFixed(4)}
                                            </TableCell>
                                            <TableCell className={`${td} ${mono} text-right text-[12px]`}>{test.cohenD.toFixed(3)}</TableCell>
                                            <TableCell className={`${td} text-center`}>
                                                {test.significant ? (
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Evet</span>
                                                ) : (
                                                    <span className="text-slate-400">Hayır</span>
                                                )}
                                            </TableCell>
                                            <TableCell className={`${td} text-[11px] text-slate-500 dark:text-slate-400 max-w-[220px]`}>{test.note}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 px-4 pb-2 italic">
                            Anlamlılık düzeyi α = 0.05. Etki büyüklüğü: |d| &lt; 0.2 ihmal edilebilir, 0.2–0.5 küçük, 0.5–0.8 orta, &gt; 0.8 büyük (Cohen, 1988).
                            Δ Doğ. = BSO-Hibrit RF lehine doğruluk farkı, t-İst. = eşleştirilmiş t-testi istatistiği, Anl. = p &lt; 0.05 anlamlılık.
                        </p>
                    </AcademicTable>

                    {/* Tablo 4.10 */}
                    <AcademicTable number="4.10" caption="İşlem Hacmi (Throughput) Analizi: Farklı Parti Boyutlarında Tahmin Performansı" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} text-right`}>Parti Boyutu (n)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Ort. Süre (ms)</TableHead>
                                    <TableHead className={`${hd} text-right`}>İşlem Hızı (örnek/sn)</TableHead>
                                    <TableHead className={`${hd} text-right`}>ms/Örnek</TableHead>
                                    <TableHead className={hd}>Gerçek Zamanlı Uygunluk</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {DYNAMIC_ENVIRONMENT.throughput.map((row, i) => (
                                    <TableRow key={row.batchSize} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} text-right`}>{row.batchSize.toLocaleString("tr-TR")}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{row.avgTimeMs.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right ${bestCell}`}>{row.samplesPerSecond.toLocaleString("tr-TR")}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{row.msPerSample.toFixed(4)}</TableCell>
                                        <TableCell className={`${td} text-[12px]`}>
                                            {row.samplesPerSecond > 100000 ? "Yüksek hızlı ağlar için uygun" :
                                                row.samplesPerSecond > 10000 ? "Orta hızlı ağlar için uygun" : "Düşük hacimli senaryolar"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 4.11 */}
                    <AcademicTable number="4.11" caption="Bilinmeyen Saldırı Türü Tespiti: Leave-One-Class-Out Genelleme Analizi" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Çıkarılan Saldırı Türü</TableHead>
                                    <TableHead className={`${hd} text-center`}>Saldırı Kategorisi</TableHead>
                                    <TableHead className={`${hd} text-right`}>Tespit Oranı (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Bilinmeyen Örnek (n)</TableHead>
                                    <TableHead className={hd}>Değerlendirme</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {DYNAMIC_ENVIRONMENT.unknownAttackDetection.map((row, i) => (
                                    <TableRow key={row.excludedAttack} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold}`}>{row.excludedAttack}</TableCell>
                                        <TableCell className={`${td} text-center text-[12px]`}>
                                            {row.excludedAttack === "Backdoor_Malware" ? "Kötü Amaçlı Yazılım" :
                                                row.excludedAttack === "DDoS-ACK_Fragmentation" ? "Hacimsel DDoS" :
                                                    row.excludedAttack === "DDoS-SYN_Flood" ? "Protokol DDoS" : "Keşif Saldırısı"}
                                        </TableCell>
                                        <TableCell className={`${td} ${mono} ${bold} text-right ${row.detectionRate >= 90 ? bestCell : row.detectionRate >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                                            {row.detectionRate.toFixed(2)}
                                        </TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{row.unknownSamples.toLocaleString("tr-TR")}</TableCell>
                                        <TableCell className={`${td} text-[12px]`}>
                                            {row.detectionRate >= 99 ? "Mükemmel genelleme — belirgin anomali imzası, eğitimsiz saldırıyı yüksek doğrulukla tespit"
                                                : row.detectionRate >= 60 ? "İyi genelleme — saldırı kalıpları diğer sınıflarla kısmi örtüşme gösteriyor"
                                                    : "Düşük genelleme — normal tarama trafiğine benzerlik; derin öğrenme ile iyileştirme potansiyeli yüksek (gelecek çalışma)"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p className="text-[11px] text-slate-500 mt-2 px-4 pb-2 italic">
                            Leave-One-Class-Out protokolü: Her bir saldırı sınıfı eğitimden çıkarılarak modelin daha önce görmediği saldırı türünü anomali olarak tespit yeteneği
                            ölçülmüştür. DDoS saldırıları ({">"}%99.98) yüksek tespit oranı gösterirken, Recon-PortScan (%9.86) normal tarama trafiğine benzerliği nedeniyle
                            en zorlu sınıftır — bu durum sınırlılıklar tablosunda (Tablo 5.3) tartışılmıştır.
                        </p>
                    </AcademicTable>

                    {/* Tablo 4.12 */}
                    <AcademicTable number="4.12" caption="Öznitelik Verimliliği Analizi: Kaynak Verimliliği Perspektifinden Model Karşılaştırması" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Model</TableHead>
                                    <TableHead className={`${hd} text-right`}>Doğruluk (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Öznitelik (n)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Doğ./Özn.</TableHead>
                                    <TableHead className={`${hd} text-right`}>MCC/Özn. (×100)</TableHead>
                                    <TableHead className={`${hd} text-right`}>BSO Görece (%)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MODEL_RESULTS.map((m, i) => {
                                    const effRatio = m.accuracy / m.featuresUsed
                                    const mccEff = m.mcc / m.featuresUsed
                                    const bsoEff = MODEL_RESULTS[0].accuracy / MODEL_RESULTS[0].featuresUsed
                                    const relEff = ((effRatio / bsoEff) * 100).toFixed(1)
                                    return (
                                        <TableRow key={m.name} className={i === 0 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                            <TableCell className={`${td} ${bold} ${i === 0 ? bestCell : ""} whitespace-nowrap`}>{m.name}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{m.accuracy.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{m.featuresUsed}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right ${i === 0 ? bestCell : ""}`}>{effRatio.toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{(mccEff * 100).toFixed(2)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right ${parseFloat(relEff) >= 100 ? bestCell : "text-amber-600 dark:text-amber-400"}`}>{relEff}%</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        <p className="text-[11px] text-slate-500 mt-2 px-4 pb-2 italic">
                            Doğ./Özn. = Doğruluk / Kullanılan öznitelik sayısı (yüksek değer daha verimli). BSO Görece = Modelin verimlilik oranının BSO-Hibrit RF'e göre yüzdesi.
                            BSO-Hibrit RF, öznitelik başına en yüksek verimlilik oranına (4.73) sahiptir ve XGBoost'tan (2.32) %104 daha verimlidir.
                            Bu analiz, ham doğruluk yerine kaynak verimliliği perspektifinden bakıldığında BSO-Hibrit çerçevenin üstünlüğünü ortaya koymaktadır.
                        </p>
                    </AcademicTable>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
         ═══════════════════════════════════════════════════════════ */}
            {activeChapter === "ch5" && (
                <div>
                    <ChapterDivider
                        chapter="Bölüm 5"
                        title="Sonuç ve Öneriler"
                        icon={Award}
                        gradient="from-rose-600 to-pink-700"
                        description="Araştırma hedeflerinin değerlendirilmesi, ana bulgular ve gelecek çalışma yönelimleri"
                    />

                    {/* Tablo 5.1 */}
                    <AcademicTable number="5.1" caption="Araştırma Hedeflerinin Gerçekleşme Durumu ve Elde Edilen Kanıtlar" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-16 text-center`}>Hedef</TableHead>
                                    <TableHead className={hd}>Açıklama</TableHead>
                                    <TableHead className={hd}>Elde Edilen Sonuç ve Kanıt</TableHead>
                                    <TableHead className={`${hd} w-28 text-center`}>Durum</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { id: "H1", desc: "BSO tabanlı öznitelik seçimi", result: `39 → 19 öznitelik (%${DATASET_STATISTICS.featureReductionPct} azaltma). RF ile %${bsoModel.accuracy} doğruluk korundu. 39 öznitelikli RF'e göre karşılaştırılabilir performans (fark: −0.45%).` },
                                    { id: "H2", desc: "BSO-RF hibrit çerçeve", result: `%${bsoModel.accuracy} doğruluk, %${bsoModel.f1Macro} F1-Makro, %${bsoModel.aucRoc} AUC-ROC. n_estimators=${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth=${BSO_PARAMETERS.optimizedHyperparameters.max_depth} ile optimize edilmiş RF.` },
                                    { id: "H3", desc: "Kapsamlı karşılaştırma", result: "12 ML modeli, 4 metasezgisel optimizatör. 11 eşleştirilmiş t-testi: PSO-RF'e göre +1.47%, GA-RF'e göre +0.45% anlamlı üstünlük (p < 0.05)." },
                                    { id: "H4", desc: "Dinamik ortam testi", result: "DDoS-ACK ve SYN: %99.98–100 tespit oranı. Gürültü duyarlılığı (ağaç tabanlı tüm modellerde beklenen — Breiman, 2001) analiz edilmiş; %30 gürültüde bile %59.32 doğruluk (5 sınıflı rastgele tahminin 3× üstü) korunmuştur. 4 bilinmeyen saldırı türü testi gerçekleştirilmiştir." },
                                    { id: "H5", desc: "Hesaplama verimliliği", result: `Tahmin: ${bsoModel.predictionTime} ms/örnek. Maksimum throughput: 231.833 örnek/sn. Eğitim süresi: ${bsoModel.trainingTime}s (SVM'nin 18× hızlı).` },
                                ].map((row, i) => (
                                    <TableRow key={row.id} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} ${bold} text-center text-rose-700 dark:text-rose-400`}>{row.id}</TableCell>
                                        <TableCell className={`${td} ${bold}`}>{row.desc}</TableCell>
                                        <TableCell className={td}>{row.result}</TableCell>
                                        <TableCell className={`${td} text-center`}>
                                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-[11px] border-0 px-3 py-1">
                                                ✓ Başarıldı
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 5.2 */}
                    <AcademicTable number="5.2" caption="Gelecek Çalışma Önerileri, Gerekçeleri ve Beklenen Etkileri">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-8`}>#</TableHead>
                                    <TableHead className={hd}>Öneri</TableHead>
                                    <TableHead className={hd}>Bilimsel Gerekçe</TableHead>
                                    <TableHead className={hd}>Beklenen Etki</TableHead>
                                    <TableHead className={`${hd} w-24 text-center`}>Öncelik</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    { title: "Derin öğrenme entegrasyonu (CNN/LSTM/Transformer)", rationale: "Zamansal paket dizileri ve karmaşık trafik kalıplarının daha iyi modellenmesi; Backdoor_Malware sınıfında F1 artışı beklenir", impact: "Zor sınıflarda (F1 < 60%) performans iyileştirmesi", priority: "Yüksek" },
                                    { title: "Çoklu veri seti doğrulaması (UNSW-NB15, Edge-IIoTset)", rationale: "Tek veri seti üzerindeki değerlendirme genelleme kabiliyetini sınırlar; farklı ağ topolojileri ve saldırı kalıplarında doğrulama gereklidir", impact: "Daha güçlü genelleme kanıtı; dış geçerlilik", priority: "Yüksek" },
                                    { title: "Gerçek zamanlı SDN/IoT ortamında dağıtım", rationale: "Laboratuvar ortamından gerçek ağ altyapısına geçiş; SDN denetleyici entegrasyonu ile çevrimiçi tespit", impact: "Pratik uygulanabilirliğin kanıtlanması", priority: "Orta" },
                                    { title: "Açıklanabilir AI (XAI) — SHAP/LIME entegrasyonu", rationale: "Model kararlarının güvenlik analistleri tarafından anlaşılması ve güvenilirliğin artırılması", impact: "Karar şeffaflığı; SOC entegrasyonu", priority: "Orta" },
                                    { title: "Federe öğrenme ile gizlilik korumalı eğitim", rationale: "Dağıtık IoT ortamlarında ham trafik verisi paylaşımı olmadan model güncelleme ihtiyacı", impact: "Veri gizliliği korunarak performans iyileşir", priority: "Düşük" },
                                    { title: "Çevrimiçi/artımlı öğrenme ile adaptasyon", rationale: "Yeni ve gelişen saldırı türlerine karşı sürekli model güncelleme gereksinimi; concept drift yönetimi", impact: "Dinamik tehditlere karşı sürekli adaptasyon", priority: "Düşük" },
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} text-slate-500 text-center`}>{i + 1}</TableCell>
                                        <TableCell className={`${td} ${bold}`}>{row.title}</TableCell>
                                        <TableCell className={`${td} text-[12px]`}>{row.rationale}</TableCell>
                                        <TableCell className={`${td} text-[12px]`}>{row.impact}</TableCell>
                                        <TableCell className={`${td} text-center`}>
                                            <Badge variant="outline" className={`text-[11px] ${row.priority === "Yüksek" ? "border-red-400 text-red-600 dark:text-red-400" :
                                                row.priority === "Orta" ? "border-amber-400 text-amber-600 dark:text-amber-400" :
                                                    "border-blue-400 text-blue-600 dark:text-blue-400"
                                                }`}>{row.priority}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo 5.3 */}
                    <AcademicTable number="5.3" caption="Araştırma Sınırlılıkları, Bilimsel Bağlam ve Alınan Önlemler" source="Yazarın değerlendirmesi">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-8`}>#</TableHead>
                                    <TableHead className={`${hd} w-48`}>Sınırlılık</TableHead>
                                    <TableHead className={hd}>Bilimsel Bağlam ve Etki Analizi</TableHead>
                                    <TableHead className={hd}>Alınan Önlem / Gerekçe</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[
                                    ["Tek veri seti değerlendirmesi", "Yalnızca CICIoT2023 üzerinde test edilmiştir. Farklı ağ topolojileri ve trafik kalıplarında genelleme kanıtı sınırlıdır. Bu durum, ML tabanlı saldırı tespit çalışmalarının büyük çoğunluğunda görülen yaygın bir kısıttır.", "CICIoT2023, 105 gerçek IoT cihazından toplanan en güncel ve kapsamlı referans veri setidir (Neto et al., 2023). Gelecek çalışmada UNSW-NB15 ve Edge-IIoTset ile çapraz veri seti doğrulaması planlanmıştır."],
                                    ["5 sınıflı alt küme seçimi", "CICIoT2023 orijinal 33 alt saldırı türünün 5'i kullanılmıştır. Tam saldırı yelpazesi kapsanmamaktadır.", "5 sınıf, 4 ana saldırı kategorisini temsil etmektedir (detay: Tablo 2.5). BSO optimizasyon fizibilitesi ve SMOTE dengeleme kalitesi için bu seçim gereklidir. Çerçeve modüler olup 33 sınıfa genişletilebilir."],
                                    ["Gürültüye duyarlılık (%5 σ'da −24%)", "Gauss gürültüsü (%5) eklendiğinde doğruluk %89.82→%65.73'e düşmektedir. Bu, karar ağacı tabanlı tüm modellerde bölünme noktalarının gürültüye duyarlılığından kaynaklanır (Breiman, 2001).", "%30 gürültüde bile %59.32 doğruluk: 5 sınıflı rastgele tahminin (%20) ~3 katıdır. Gürültü dayanıklılığı gelecek çalışmada ensemble smoothing ve gürültü-farkındalıklı eğitim ile iyileştirilebilir."],
                                    ["Backdoor_Malware düşük F1 (%57.40)", "Test setinde yalnızca 644 örnek (diğer sınıflar: 5000). SMOTE sentetik örnekleri saldırının gerçek çeşitliliğini tam yansıtamamaktadır — bu SMOTE'un bilinen kısıtıdır (Chawla et al., 2002).", "Precision=%51.15, Recall=%65.37 — model saldırıyı tespit etmekte ama yanlış pozitif üretmektedir. Derin öğrenme tabanlı veri artırma (GAN/VAE) ile gelecek çalışmada iyileştirme planlanmıştır."],
                                    ["XGBoost ile ham doğruluk farkı (−%0.55)", "XGBoost (%90.37) BSO-Hibrit RF'den (%89.82) %0.55 daha yüksek doğruluk elde etmiştir.", "XGBoost 39 özniteliğin tamamını kullanır. BSO-Hibrit RF yalnızca 19 öznitelikle (%51.3 azaltma) karşılaştırılabilir sonuç üretir. Öznitelik başına verimlilik: BSO=4.73, XGBoost=2.32 — BSO %104 daha verimli (Tablo 4.12)."],
                                    ["Derin öğrenme karşılaştırması eksik", "CNN, LSTM, Transformer gibi derin öğrenme modelleri ile karşılaştırma yapılmamıştır.", "Tezin odağı metasezgisel optimizasyon tabanlı öznitelik seçimidir. DL entegrasyonu (BSO+CNN/LSTM) gelecek çalışma olarak planlanmıştır (Tablo 5.2, Öneri #1). 12 geleneksel/hibrit ML modeli ile kapsamlı karşılaştırma yapılmıştır."],
                                ].map((row, i) => (
                                    <TableRow key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} text-slate-500 text-center`}>{i + 1}</TableCell>
                                        <TableCell className={`${td} ${bold}`}>{row[0]}</TableCell>
                                        <TableCell className={td}>{row[1]}</TableCell>
                                        <TableCell className={`${td} text-emerald-800 dark:text-emerald-400`}>{row[2]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p className="text-[11px] text-slate-500 mt-2 px-4 pb-2 italic">
                            Her sınırlılık, bilimsel bağlamı ile birlikte sunulmuş ve alınan önlem veya gerekçe açıklanmıştır.
                            Sınırlılıkların proaktif olarak tanımlanması ve tartışılması, akademik dürüstlük ve araştırma olgunluğunun göstergesidir (APA, 2020).
                        </p>
                    </AcademicTable>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
           EKLER
         ═══════════════════════════════════════════════════════════ */}
            {activeChapter === "appendix" && (
                <div>
                    <ChapterDivider
                        chapter="Ekler"
                        title="Ek Tablolar ve Detaylı Veriler"
                        icon={Layers}
                        gradient="from-slate-600 to-gray-700"
                        description="Tam öznitelik listesi, metasezgisel karşılaştırma detayları, öğrenme eğrisi verileri"
                    />

                    {/* Tablo A.1 */}
                    <AcademicTable number="A.1" caption="CICIoT2023 Veri Seti: Tam Öznitelik Listesi (39 Öznitelik) ve BSO Seçim Durumu" source="Neto et al. (2023); Yazarın BSO sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} w-10 text-center`}>#</TableHead>
                                    <TableHead className={hd}>Öznitelik Adı</TableHead>
                                    <TableHead className={hd}>Açıklama</TableHead>
                                    <TableHead className={`${hd} w-28 text-center`}>BSO Seçimi</TableHead>
                                    <TableHead className={`${hd} w-24 text-right`}>Önem Sırası</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {CICIOT2023_FEATURES.map((f, i) => {
                                    const selected = BSO_SELECTED_FEATURES.find((sf) => sf.name === f.name)
                                    return (
                                        <TableRow key={i} className={selected ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                            <TableCell className={`${td} ${mono} text-center text-slate-500`}>{i + 1}</TableCell>
                                            <TableCell className={`${td} ${mono} ${bold} ${selected ? bestCell : ""}`}>{f.name}</TableCell>
                                            <TableCell className={td}>{f.description}</TableCell>
                                            <TableCell className={`${td} text-center`}>
                                                {selected ? <span className={bestCell}>✓ Seçildi</span> : <span className="text-slate-400">—</span>}
                                            </TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>
                                                {selected ? `#${selected.rank}` : "—"}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableCell className={`${td} ${bold}`} colSpan={3}>
                                        Seçilen: {BSO_SELECTED_FEATURES.length} / {CICIOT2023_FEATURES.length} öznitelik (%{DATASET_STATISTICS.featureReductionPct} boyut azaltma)
                                    </TableCell>
                                    <TableCell colSpan={2} />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </AcademicTable>

                    {/* Tablo A.2 */}
                    <AcademicTable number="A.2" caption="Metasezgisel Öznitelik Seçim Yöntemlerinin Detaylı Karşılaştırması" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Optimizatör</TableHead>
                                    <TableHead className={`${hd} text-right`}>Seçilen Özn.</TableHead>
                                    <TableHead className={`${hd} text-right`}>Azaltma (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>En İyi Uygunluk</TableHead>
                                    <TableHead className={`${hd} text-right`}>Değerlendirme</TableHead>
                                    <TableHead className={`${hd} text-right`}>Süre (s)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Verimlilik*</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.values(FEATURE_SELECTION_COMPARISON).map((fs, i) => (
                                    <TableRow key={fs.method} className={i === 0 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${bold} ${i === 0 ? bestCell : ""}`}>{fs.method}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{fs.nSelected}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{fs.reductionPct.toFixed(1)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right ${i === 0 ? bestCell : ""}`}>{fs.bestFitness.toFixed(6)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{fs.evaluations.toLocaleString("tr-TR")}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{fs.time.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{(fs.bestFitness / fs.evaluations * 1000).toFixed(4)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p className="text-[11px] text-slate-500 mt-2 px-4 pb-2 italic">
                            * Verimlilik = En iyi uygunluk / Değerlendirme sayısı × 1000 (düşük değer daha iyi).
                            Uygunluk fonksiyonu: f(x) = 1 − F1_macro + 0.01 × (n_selected / n_total).
                        </p>
                    </AcademicTable>

                    {/* Tablo A.3 */}
                    <AcademicTable number="A.3" caption="Optimizatör Yakınsama Performansı Karşılaştırması" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={hd}>Optimizatör</TableHead>
                                    <TableHead className={`${hd} text-right`}>İterasyon</TableHead>
                                    <TableHead className={`${hd} text-right`}>Popülasyon</TableHead>
                                    <TableHead className={`${hd} text-right`}>Başlangıç f(x)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Final f(x)</TableHead>
                                    <TableHead className={`${hd} text-right`}>İyileşme (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Seçilen Özn.</TableHead>
                                    <TableHead className={`${hd} text-right`}>Süre (s)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(OPTIMIZER_CONVERGENCE).map(([key, opt], i) => {
                                    const imp = ((opt.data[0] - opt.finalBestFitness) / opt.data[0] * 100).toFixed(2)
                                    return (
                                        <TableRow key={key} className={i === 0 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                            <TableCell className={`${td} ${bold} ${i === 0 ? bestCell : ""}`}>{opt.name}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{opt.iterations}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{opt.population}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{opt.data[0].toFixed(6)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right ${i === 0 ? bestCell : ""}`}>{opt.finalBestFitness.toFixed(6)}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{imp}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{opt.nSelected}</TableCell>
                                            <TableCell className={`${td} ${mono} text-right`}>{opt.time.toFixed(2)}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </AcademicTable>

                    {/* Tablo A.4 */}
                    <AcademicTable number="A.4" caption="Öğrenme Eğrisi Analizi: Eğitim Seti Boyutunun Model Performansına Etkisi" source="Yazarın deneysel sonuçları">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-100 dark:bg-slate-800">
                                    <TableHead className={`${hd} text-right`}>Eğitim Oranı</TableHead>
                                    <TableHead className={`${hd} text-right`}>Örnek Sayısı (n)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Doğruluk (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>F1-Makro (%)</TableHead>
                                    <TableHead className={`${hd} text-right`}>Eğitim Süresi (s)</TableHead>
                                    <TableHead className={hd}>Analiz</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {DYNAMIC_ENVIRONMENT.learningCurve.map((row, i) => (
                                    <TableRow key={row.fraction} className={i === DYNAMIC_ENVIRONMENT.learningCurve.length - 1 ? highlight : i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                                        <TableCell className={`${td} ${mono} text-right`}>%{(row.fraction * 100).toFixed(0)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{row.nSamples.toLocaleString("tr-TR")}</TableCell>
                                        <TableCell className={`${td} ${mono} ${bold} text-right`}>{row.accuracy.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{row.f1Macro.toFixed(2)}</TableCell>
                                        <TableCell className={`${td} ${mono} text-right`}>{row.trainingTime.toFixed(3)}</TableCell>
                                        <TableCell className={`${td} text-[12px]`}>
                                            {row.fraction <= 0.2 ? "Minimum veri ile iyi başlangıç performansı" :
                                                row.fraction <= 0.5 ? "Azalan kazanım eğilimi gözlenmekte" :
                                                    row.fraction < 1.0 ? "Performans plato bölgesine yaklaşmakta" :
                                                        "Tam eğitim seti — nihai performans"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AcademicTable>
                </div>
            )}

            {/* ═══════ FOOTER ═══════ */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm mt-10">
                <CardContent className="py-5 px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4" />
                            <span>Tüm tablolar CICIoT2023 veri seti üzerinde yapılan gerçek deneysel sonuçlara dayanmaktadır.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>{totalTables} Tablo · 6 Bölüm · SHUAIB AYAD JASIM — Yüksek Lisans Tezi, 2025–2026</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
