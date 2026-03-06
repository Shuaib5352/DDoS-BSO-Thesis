"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    CheckCircle2, Copy, BookOpen, FileText, Globe,
    GraduationCap, Shield, Target, Zap, Database,
    Award, Layers, ClipboardList,
} from "lucide-react"
import {
    MODEL_RESULTS, DATASET_STATISTICS, BSO_PARAMETERS,
    BSO_SELECTED_FEATURES, CROSS_VALIDATION,
} from "@/lib/ciciot2023-dataset"

// ============================================================================
// Real data references
// ============================================================================
const bso = MODEL_RESULTS[0]
const xgb = MODEL_RESULTS.find(m => m.name.includes("XGBoost"))!
const rf = MODEL_RESULTS.find(m => m.name === "Random Forest")!
const svm = MODEL_RESULTS.find(m => m.name.includes("SVM"))!
const dt = MODEL_RESULTS.find(m => m.name.includes("Decision Tree"))!
const cv = CROSS_VALIDATION as { mean: { accuracy: number; f1Score: number }; std: { accuracy: number; f1Score: number } }

// ============================================================================
// COPY BUTTON
// ============================================================================
function CopyBtn({ text, label = "Kopyala" }: { text: string; label?: string }) {
    const [copied, setCopied] = useState(false)
    const doCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }
    return (
        <button
            onClick={doCopy}
            className="inline-flex items-center gap-1 text-[10px] h-6 px-2 rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground no-print flex-shrink-0"
        >
            {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {copied ? "✓" : label}
        </button>
    )
}

// ============================================================================
// ABSTRACT BLOCK — shows text + copy button
// ============================================================================
function AbstractBlock({
    title,
    lang,
    text,
    keywords,
    dir = "ltr",
}: {
    title: string
    lang: string
    text: string
    keywords: string[]
    dir?: "ltr" | "rtl"
}) {
    return (
        <Card className="border-2 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-500" />
                        <CardTitle className="text-base">{title}</CardTitle>
                        <Badge variant="outline" className="text-[10px]">{lang}</Badge>
                    </div>
                    <CopyBtn text={text + "\n\nKeywords: " + keywords.join(", ")} label="Tümünü Kopyala" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div
                    dir={dir}
                    className={`text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line ${dir === "rtl" ? "text-right font-[Amiri,serif]" : ""}`}
                >
                    {text}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                    <span className="text-xs font-semibold text-slate-500">Keywords:</span>
                    {keywords.map(k => (
                        <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
                    ))}
                    <CopyBtn text={keywords.join(", ")} label="Anahtar Kelimeleri Kopyala" />
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================================================
// THESIS INFO BLOCK — title page data
// ============================================================================
function ThesisInfoBlock() {
    const infoTR = `T.C.
KTO KARATAY ÜNİVERSİTESİ
LİSANSÜSTÜ EĞİTİM ENSTİTÜSÜ
BİLGİSAYAR MÜHENDİSLİĞİ ANABİLİM DALI

YÜKSEK LİSANS TEZİ

DİNAMİK AĞ ORTAMLARINDA YARASA SÜRÜSÜ OPTİMİZASYONU (BSO) İLE OPTİMİZE EDİLMİŞ HİBRİT MAKİNE ÖĞRENMESİ ÇERÇEVESİ KULLANARAK DDoS SALDIRILARININ GELİŞTİRİLMİŞ TESPİTİ

SHUAIB AYAD JASIM

Danışman: Dr. Öğr. Üyesi SAİM ERVURAL

KONYA — 2026`

    const infoEN = `REPUBLIC OF TÜRKİYE
KTO KARATAY UNIVERSITY
GRADUATE SCHOOL OF NATURAL AND APPLIED SCIENCES
DEPARTMENT OF COMPUTER ENGINEERING

MASTER'S THESIS

IMPROVED DETECTION OF DDoS ATTACKS USING A HYBRID MACHINE LEARNING FRAMEWORK OPTIMIZED VIA BAT SWARM OPTIMIZATION (BSO) IN DYNAMIC NETWORK ENVIRONMENTS

SHUAIB AYAD JASIM

Advisor: Asst. Prof. SAİM ERVURAL

KONYA — 2026`

    return (
        <Card className="border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-yellow-500/5">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-amber-600" />
                    <CardTitle className="text-base">Tez Kapak Bilgileri</CardTitle>
                </div>
                <CardDescription>Kapak sayfası için kopyalanabilir başlık bilgileri</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Türkçe</Badge>
                        <CopyBtn text={infoTR} label="TR Kopyala" />
                    </div>
                    <pre className="text-[11px] leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg whitespace-pre-wrap font-sans text-center border">{infoTR}</pre>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">English</Badge>
                        <CopyBtn text={infoEN} label="EN Copy" />
                    </div>
                    <pre className="text-[11px] leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg whitespace-pre-wrap font-sans text-center border">{infoEN}</pre>
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ThesisAbstract() {
    // ─── ENGLISH ABSTRACT ───
    const abstractEN = `This thesis presents a novel hybrid machine learning framework for improved detection of Distributed Denial of Service (DDoS) attacks in dynamic network environments. The proposed approach integrates Bat Swarm Optimization (BSO) with Random Forest (RF) classification to simultaneously perform feature selection and hyperparameter tuning, addressing the dual challenges of high-dimensional network traffic data and evolving attack patterns.

The CICIoT2023 dataset, comprising ${DATASET_STATISTICS.totalSamples.toLocaleString("en-US")} network traffic samples across ${DATASET_STATISTICS.classes} classes (BenignTraffic, DDoS-ACK Fragmentation, DDoS-SYN Flood, Recon-PortScan, and Backdoor Malware), was used for experimental evaluation. The BSO algorithm (population=${BSO_PARAMETERS.populationSize}, iterations=${BSO_PARAMETERS.maxIterations}) selected ${BSO_SELECTED_FEATURES.length} discriminative features from the original ${DATASET_STATISTICS.totalFeatures}, achieving a ${DATASET_STATISTICS.featureReductionPct}% feature reduction while maintaining classification effectiveness. SMOTE was applied to address class imbalance, generating ${DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString("en-US")} synthetic samples (${DATASET_STATISTICS.totalFlows.training.toLocaleString("en-US")} balanced training instances).

The BSO-Hybrid RF model achieved ${bso.accuracy}% accuracy, ${bso.precision}% precision, ${bso.recall}% recall, ${bso.f1Score}% weighted F1-score, ${bso.f1Macro}% macro F1-score, and ${bso.aucRoc}% AUC-ROC on the held-out test set (n=${DATASET_STATISTICS.totalFlows.testing.toLocaleString("en-US")}). Compared to 11 baseline models, the proposed framework outperformed standard Random Forest (${rf.accuracy}%), XGBoost (${xgb.accuracy}%), SVM (${svm.accuracy}%), and Decision Tree (${dt.accuracy}%). The Matthews Correlation Coefficient (MCC) of ${bso.mcc.toFixed(4)} confirms strong multi-class agreement. Stratified 10-fold cross-validation yielded ${cv.mean.accuracy.toFixed(2)}% ± ${cv.std.accuracy}% accuracy, demonstrating model stability and generalizability.

Statistical significance was validated through paired t-tests (p < 0.001), Wilcoxon signed-rank tests, and Cohen's d effect sizes, confirming that the BSO-Hybrid RF improvements are statistically meaningful. The framework processes ${DATASET_STATISTICS.totalFlows.testing.toLocaleString("en-US")} samples in ${bso.predictionTime} ms per sample, making it suitable for real-time deployment in dynamic network environments.

The main contributions include: (1) a joint BSO-based feature selection and RF hyperparameter optimization framework, (2) comprehensive multi-class DDoS detection on the CICIoT2023 benchmark, (3) rigorous statistical validation with 12 model comparisons, and (4) an interactive Next.js thesis dashboard for reproducible analysis.`

    const keywordsEN = [
        "DDoS Detection", "Bat Swarm Optimization", "Random Forest",
        "Feature Selection", "CICIoT2023", "Network Security",
        "Machine Learning", "Hybrid Optimization", "Intrusion Detection System",
        "SMOTE",
    ]

    // ─── TURKISH ABSTRACT (ÖZET) ───
    const abstractTR = `Bu tez, dinamik ağ ortamlarında Dağıtık Hizmet Reddi (DDoS) saldırılarının geliştirilmiş tespiti için yeni bir hibrit makine öğrenmesi çerçevesi sunmaktadır. Önerilen yaklaşım, yüksek boyutlu ağ trafiği verileri ve gelişen saldırı kalıpları sorunlarını ele almak üzere Yarasa Sürüsü Optimizasyonu (BSO) ile Rastgele Orman (RF) sınıflandırmasını birleştirerek eş zamanlı öznitelik seçimi ve hiperparametre ayarı gerçekleştirmektedir.

Deneysel değerlendirme için ${DATASET_STATISTICS.classes} sınıf (BenignTraffic, DDoS-ACK Fragmentation, DDoS-SYN Flood, Recon-PortScan ve Backdoor Malware) ve ${DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} ağ trafiği örneğinden oluşan CICIoT2023 veri seti kullanılmıştır. BSO algoritması (popülasyon=${BSO_PARAMETERS.populationSize}, iterasyon=${BSO_PARAMETERS.maxIterations}), orijinal ${DATASET_STATISTICS.totalFeatures} öznitelikten ${BSO_SELECTED_FEATURES.length} ayırt edici öznitelik seçerek sınıflandırma etkinliğini korurken %${DATASET_STATISTICS.featureReductionPct} öznitelik azaltımı sağlamıştır. Sınıf dengesizliğini gidermek amacıyla SMOTE uygulanarak ${DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString("tr-TR")} sentetik örnek üretilmiştir (${DATASET_STATISTICS.totalFlows.training.toLocaleString("tr-TR")} dengeli eğitim örneği).

BSO-Hibrit RF modeli, ayrılmış test seti (n=${DATASET_STATISTICS.totalFlows.testing.toLocaleString("tr-TR")}) üzerinde %${bso.accuracy} doğruluk, %${bso.precision} kesinlik, %${bso.recall} duyarlılık, %${bso.f1Score} ağırlıklı F1-skor, %${bso.f1Macro} makro F1-skor ve %${bso.aucRoc} AUC-ROC değerleri elde etmiştir. 11 temel model ile karşılaştırıldığında, önerilen çerçeve standart Rastgele Orman (%${rf.accuracy}), XGBoost (%${xgb.accuracy}), SVM (%${svm.accuracy}) ve Karar Ağacı (%${dt.accuracy}) modellerinden üstün performans göstermiştir. ${bso.mcc.toFixed(4)} değerindeki Matthews Korelasyon Katsayısı (MCC), güçlü çok sınıflı uyumu doğrulamaktadır. Tabakalı 10-katlı çapraz doğrulama %${cv.mean.accuracy.toFixed(2)} ± %${cv.std.accuracy} doğruluk ile modelin kararlılığını ve genellenebilirliğini göstermiştir.

İstatistiksel anlamlılık, eşleştirilmiş t-testleri (p < 0.001), Wilcoxon işaretli sıra testleri ve Cohen's d etki büyüklükleri ile doğrulanmış; BSO-Hibrit RF iyileştirmelerinin istatistiksel olarak anlamlı olduğu teyit edilmiştir. Çerçeve, örnek başına ${bso.predictionTime} ms'de ${DATASET_STATISTICS.totalFlows.testing.toLocaleString("tr-TR")} örneği işleyerek dinamik ağ ortamlarında gerçek zamanlı konuşlandırmaya uygundur.

Temel katkılar şunlardır: (1) BSO tabanlı birleşik öznitelik seçimi ve RF hiperparametre optimizasyonu çerçevesi, (2) CICIoT2023 referans verisinde kapsamlı çok sınıflı DDoS tespiti, (3) 12 model karşılaştırması ile titiz istatistiksel doğrulama, ve (4) tekrarlanabilir analiz için etkileşimli Next.js tez paneli.`

    const keywordsTR = [
        "DDoS Tespiti", "Yarasa Sürüsü Optimizasyonu", "Rastgele Orman",
        "Öznitelik Seçimi", "CICIoT2023", "Ağ Güvenliği",
        "Makine Öğrenmesi", "Hibrit Optimizasyon", "Saldırı Tespit Sistemi",
        "SMOTE",
    ]

    // ─── STRUCTURED ABSTRACT (for Scopus / WoS journals) ───
    const structuredEN = `BACKGROUND: Distributed Denial of Service (DDoS) attacks remain a critical threat in dynamic network environments, with evolving attack patterns that challenge traditional detection methods. Feature selection and classifier optimization are essential for effective multi-class DDoS detection.

OBJECTIVE: To develop a hybrid machine learning framework integrating Bat Swarm Optimization (BSO) with Random Forest (RF) for joint feature selection and hyperparameter tuning in multi-class DDoS attack detection.

METHODS: The CICIoT2023 dataset (${DATASET_STATISTICS.totalSamples.toLocaleString("en-US")} samples, ${DATASET_STATISTICS.classes} classes) was used with stratified 70/10/20 train/validation/test split. BSO (population=${BSO_PARAMETERS.populationSize}, iterations=${BSO_PARAMETERS.maxIterations}) selected ${BSO_SELECTED_FEATURES.length}/${DATASET_STATISTICS.totalFeatures} features. SMOTE addressed class imbalance. The proposed BSO-Hybrid RF was benchmarked against 11 models including XGBoost, SVM, Decision Tree, and meta-heuristic variants (PSO-RF, GA-RF, GWO-RF).

RESULTS: BSO-Hybrid RF achieved ${bso.accuracy}% accuracy, ${bso.f1Score}% weighted F1-score, ${bso.aucRoc}% AUC-ROC, and MCC of ${bso.mcc.toFixed(4)} on the test set (n=${DATASET_STATISTICS.totalFlows.testing.toLocaleString("en-US")}). It outperformed all baselines including XGBoost (${xgb.accuracy}%) and standard RF (${rf.accuracy}%). Stratified 10-fold CV: ${cv.mean.accuracy.toFixed(2)}% ± ${cv.std.accuracy}%. Statistical significance confirmed via paired t-tests (p < 0.001) and Wilcoxon tests.

CONCLUSIONS: The BSO-Hybrid RF framework demonstrates significant improvements in multi-class DDoS detection accuracy while reducing feature dimensionality by ${DATASET_STATISTICS.featureReductionPct}%. The approach is suitable for real-time deployment with ${bso.predictionTime} ms per-sample prediction time.`

    const structuredKeywordsEN = [
        "DDoS Detection", "Bat Swarm Optimization", "Random Forest",
        "Feature Selection", "CICIoT2023", "Multi-class Classification",
        "Network Intrusion Detection", "SMOTE", "Hybrid Optimization",
    ]

    // ─── KISA ÖZET (Short Abstract — for conference submissions) ───
    const shortAbstractEN = `This study proposes a BSO-Hybrid Random Forest framework for multi-class DDoS detection on the CICIoT2023 dataset (${DATASET_STATISTICS.totalSamples.toLocaleString("en-US")} samples, ${DATASET_STATISTICS.classes} classes). BSO selects ${BSO_SELECTED_FEATURES.length}/${DATASET_STATISTICS.totalFeatures} features (${DATASET_STATISTICS.featureReductionPct}% reduction). The model achieves ${bso.accuracy}% accuracy, ${bso.f1Macro}% macro F1, and ${bso.aucRoc}% AUC-ROC, outperforming 11 baselines including XGBoost (${xgb.accuracy}%) and SVM (${svm.accuracy}%). Statistical tests confirm significance (p < 0.001).`

    const shortAbstractTR = `Bu çalışma, CICIoT2023 veri seti (${DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} örnek, ${DATASET_STATISTICS.classes} sınıf) üzerinde çok sınıflı DDoS tespiti için BSO-Hibrit Rastgele Orman çerçevesi önermektedir. BSO, ${DATASET_STATISTICS.totalFeatures} öznitelikten ${BSO_SELECTED_FEATURES.length} tanesini seçerek %${DATASET_STATISTICS.featureReductionPct} azaltım sağlamıştır. Model %${bso.accuracy} doğruluk, %${bso.f1Macro} makro F1 ve %${bso.aucRoc} AUC-ROC ile XGBoost (%${xgb.accuracy}) ve SVM (%${svm.accuracy}) dahil 11 modelden üstün performans göstermiştir. İstatistiksel testler anlamlılığı doğrulamıştır (p < 0.001).`

    // ─── KEY FINDINGS for quick reference ───
    const findings = [
        { icon: Target, label: "Doğruluk (Accuracy)", value: `%${bso.accuracy}`, color: "text-emerald-600" },
        { icon: Shield, label: "F1-Makro (Macro F1)", value: `%${bso.f1Macro}`, color: "text-blue-600" },
        { icon: Zap, label: "AUC-ROC", value: `%${bso.aucRoc}`, color: "text-purple-600" },
        { icon: Award, label: "MCC", value: bso.mcc.toFixed(4), color: "text-amber-600" },
        { icon: Layers, label: "Öznitelik Azaltımı", value: `${BSO_SELECTED_FEATURES.length}/${DATASET_STATISTICS.totalFeatures} (%${DATASET_STATISTICS.featureReductionPct})`, color: "text-cyan-600" },
        { icon: Database, label: "Veri Seti", value: `${DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} örnek`, color: "text-rose-600" },
    ]

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <Card className="border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 to-violet-500/5">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <BookOpen className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Tez Özeti / Thesis Abstract</CardTitle>
                            <CardDescription>
                                Tez için hazır özetler — Türkçe ve İngilizce, tam ve kısa versiyonlar
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* KEY FINDINGS STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {findings.map(f => (
                    <Card key={f.label} className="text-center p-3">
                        <f.icon className={`w-5 h-5 mx-auto mb-1 ${f.color}`} />
                        <div className={`text-lg font-bold ${f.color}`}>{f.value}</div>
                        <div className="text-[10px] text-muted-foreground">{f.label}</div>
                    </Card>
                ))}
            </div>

            {/* THESIS INFO (title page) */}
            <ThesisInfoBlock />

            {/* TABS */}
            <Tabs defaultValue="full" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-auto">
                    <TabsTrigger value="full" className="text-xs py-2">
                        <FileText className="w-3 h-3 mr-1" /> Tam Özet
                    </TabsTrigger>
                    <TabsTrigger value="structured" className="text-xs py-2">
                        <ClipboardList className="w-3 h-3 mr-1" /> Yapılandırılmış
                    </TabsTrigger>
                    <TabsTrigger value="short" className="text-xs py-2">
                        <Zap className="w-3 h-3 mr-1" /> Kısa Özet
                    </TabsTrigger>
                    <TabsTrigger value="latex" className="text-xs py-2">
                        <FileText className="w-3 h-3 mr-1" /> LaTeX
                    </TabsTrigger>
                </TabsList>

                {/* ── FULL ABSTRACT ── */}
                <TabsContent value="full" className="space-y-4 mt-4">
                    <AbstractBlock
                        title="Abstract (English)"
                        lang="EN"
                        text={abstractEN}
                        keywords={keywordsEN}
                    />
                    <AbstractBlock
                        title="Özet (Türkçe)"
                        lang="TR"
                        text={abstractTR}
                        keywords={keywordsTR}
                    />
                </TabsContent>

                {/* ── STRUCTURED ABSTRACT (Scopus/WoS) ── */}
                <TabsContent value="structured" className="space-y-4 mt-4">
                    <Card className="border-2 border-violet-500/20 bg-violet-500/5">
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">Scopus / WoS Format</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Bu yapılandırılmış özet, Scopus ve Web of Science indeksli dergiler için uygun formattadır
                                (Background → Objective → Methods → Results → Conclusions).
                            </p>
                        </CardContent>
                    </Card>
                    <AbstractBlock
                        title="Structured Abstract"
                        lang="EN — Scopus Format"
                        text={structuredEN}
                        keywords={structuredKeywordsEN}
                    />
                </TabsContent>

                {/* ── SHORT ABSTRACT (Conference) ── */}
                <TabsContent value="short" className="space-y-4 mt-4">
                    <Card className="border-2 border-sky-500/20 bg-sky-500/5">
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400">Konferans / Kısa Format</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Konferans başvuruları ve kısa özet gereksinimleri için (150-200 kelime)
                            </p>
                        </CardContent>
                    </Card>
                    <AbstractBlock
                        title="Short Abstract"
                        lang="EN"
                        text={shortAbstractEN}
                        keywords={keywordsEN.slice(0, 6)}
                    />
                    <AbstractBlock
                        title="Kısa Özet"
                        lang="TR"
                        text={shortAbstractTR}
                        keywords={keywordsTR.slice(0, 6)}
                    />
                </TabsContent>

                {/* ── LATEX READY ── */}
                <TabsContent value="latex" className="mt-4">
                    <LaTeXAbstract
                        abstractEN={abstractEN}
                        abstractTR={abstractTR}
                        keywordsEN={keywordsEN}
                        keywordsTR={keywordsTR}
                    />
                </TabsContent>
            </Tabs>

            {/* DATA SOURCE FOOTER */}
            <Card className="bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="pt-4">
                    <p className="text-[10px] text-center text-muted-foreground">
                        📊 Tüm veriler gerçek deney sonuçlarından alınmıştır — <code className="text-[9px]">scripts/real_experiment.py</code> |
                        Tarih: 2026-02-23 | CICIoT2023 | BSO-Hybrid RF v4
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

// ============================================================================
// LATEX ABSTRACT COMPONENT
// ============================================================================
function LaTeXAbstract({
    abstractEN,
    abstractTR,
    keywordsEN,
    keywordsTR,
}: {
    abstractEN: string
    abstractTR: string
    keywordsEN: string[]
    keywordsTR: string[]
}) {
    const escapeLatex = (s: string) =>
        s.replace(/%/g, "\\%").replace(/&/g, "\\&").replace(/_/g, "\\_").replace(/#/g, "\\#").replace(/\$/g, "\\$")

    const latexEN = `\\begin{abstract}
${escapeLatex(abstractEN)}

\\noindent\\textbf{Keywords:} ${keywordsEN.map(escapeLatex).join(", ")}
\\end{abstract}`

    const latexTR = `\\begin{ozet}
${escapeLatex(abstractTR)}

\\noindent\\textbf{Anahtar Kelimeler:} ${keywordsTR.map(escapeLatex).join(", ")}
\\end{ozet}`

    const [copied, setCopied] = useState<string | null>(null)
    const copy = (text: string, key: string) => {
        navigator.clipboard.writeText(text)
        setCopied(key)
        setTimeout(() => setCopied(null), 2500)
    }

    return (
        <div className="space-y-4">
            <Card className="border-2 border-rose-500/20 bg-rose-500/5">
                <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">
                        LaTeX formatında hazır <code className="text-[10px]">\begin&#123;abstract&#125;</code> blokları — doğrudan .tex dosyanıza yapıştırın
                    </p>
                </CardContent>
            </Card>

            {[
                { key: "en", title: "LaTeX — English Abstract", code: latexEN },
                { key: "tr", title: "LaTeX — Türkçe Özet", code: latexTR },
            ].map(({ key, title, code }) => (
                <Card key={key} className="border">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{title}</CardTitle>
                            <button
                                onClick={() => copy(code, key)}
                                className="inline-flex items-center gap-1 text-[10px] h-6 px-2 rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                            >
                                {copied === key ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                {copied === key ? "✓ Kopyalandı" : "Kopyala"}
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-[10px] bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {code}
                        </pre>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
