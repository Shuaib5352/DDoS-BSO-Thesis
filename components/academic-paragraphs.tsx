"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    CheckCircle2, Copy, BookOpen, Target, Shield, TrendingUp,
    Zap, FlaskConical, Clock, Layers, Award, Database,
    AlertTriangle, Activity, Settings2, BarChart3,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import {
    MODEL_RESULTS, DATASET_STATISTICS, COMPUTATIONAL_EFFICIENCY,
    CROSS_VALIDATION, STATISTICAL_TESTS, BSO_RF_PER_CLASS, BSO_PARAMETERS,
    BSO_SELECTED_FEATURES, FEATURE_SELECTION_COMPARISON,
    DYNAMIC_ENVIRONMENT, STATE_OF_THE_ART,
} from "@/lib/ciciot2023-dataset"

// ============================================================================
// COPY BUTTON
// ============================================================================
function CopyBlock({ text, label = "Kopyala" }: { text: string; label?: string }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }
    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[10px] h-6 px-2 rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground no-print flex-shrink-0"
        >
            {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {copied ? "✓ Kopyalandı" : label}
        </button>
    )
}

// ============================================================================
// PARAGRAPH CARD
// ============================================================================
function ParagraphCard({
    titleEN,
    titleTR,
    titleAR,
    textEN,
    textTR,
    textAR,
    icon: Icon,
    color = "text-primary",
}: {
    titleEN: string
    titleTR: string
    titleAR: string
    textEN: string
    textTR: string
    textAR: string
    icon: React.ElementType
    color?: string
}) {
    const { t } = useTranslation()
    return (
        <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${color}`} />
                        {t(titleEN, titleAR, titleTR)}
                    </CardTitle>
                    <div className="flex gap-1 no-print">
                        <CopyBlock text={textEN} label="EN" />
                        <CopyBlock text={textTR} label="TR" />
                        <CopyBlock text={textAR} label="AR" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-[9px] h-4">English</Badge>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">{textEN}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-[9px] h-4">Türkçe</Badge>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">{textTR}</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800" dir="rtl">
                        <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-[9px] h-4">العربية</Badge>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">{textAR}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// ============================================================================
// DATA DERIVATIONS
// ============================================================================
const bso = MODEL_RESULTS.find(m => m.name.includes("BSO-Hybrid RF"))!
const xgb = MODEL_RESULTS.find(m => m.name === "XGBoost")!
const rf = MODEL_RESULTS.find(m => m.name === "Random Forest")!
const dt = MODEL_RESULTS.find(m => m.name === "Decision Tree")!
const nb = MODEL_RESULTS.find(m => m.name === "Naive Bayes")!
const svm = MODEL_RESULTS.find(m => m.name === "SVM (Linear)")!
const psoRf = MODEL_RESULTS.find(m => m.name === "PSO-RF")!
const gaRf = MODEL_RESULTS.find(m => m.name === "GA-RF")!
const gwoRf = MODEL_RESULTS.find(m => m.name === "GWO-RF")!
const topFeatures = BSO_SELECTED_FEATURES.slice(0, 5).map(f => f.name).join(", ")
const throughputMax = DYNAMIC_ENVIRONMENT.throughput[DYNAMIC_ENVIRONMENT.throughput.length - 1]

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function AcademicParagraphs() {
    const { t } = useTranslation()

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 via-background to-emerald-500/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {t("Academic Paragraphs — Ready to Copy",
                            "فقرات أكاديمية — جاهزة للنسخ",
                            "Akademik Paragraflar — Kopyalamaya Hazır")}
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {t("Professional academic text for Chapter 4 (Experimental Results). All numbers are from real experiments. Click EN/TR/AR to copy the paragraph in that language.",
                            "نصوص أكاديمية احترافية للفصل الرابع (النتائج التجريبية). جميع الأرقام من التجارب الحقيقية. انقر EN/TR/AR لنسخ الفقرة بتلك اللغة.",
                            "Bölüm 4 (Deneysel Sonuçlar) için profesyonel akademik metin. Tüm sayılar gerçek deneylerden alınmıştır. EN/TR/AR'ye tıklayarak ilgili dildeki paragrafı kopyalayın.")}
                    </CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="setup" className="w-full">
                <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-xl">
                    {[
                        { v: "setup", l: "4.1 Deney Kurulumu", icon: Settings2 },
                        { v: "overall", l: "4.2 Genel Sonuçlar", icon: BarChart3 },
                        { v: "perclass", l: "4.3 Sınıf Bazlı", icon: Target },
                        { v: "comparison", l: "4.4 Karşılaştırma", icon: TrendingUp },
                        { v: "bso", l: "4.5 BSO Etkisi", icon: Activity },
                        { v: "efficiency", l: "4.6 Verimlilik", icon: Clock },
                        { v: "statistical", l: "4.7 İstatistik", icon: FlaskConical },
                        { v: "discussion", l: "4.8 Tartışma", icon: BookOpen },
                    ].map(tab => (
                        <TabsTrigger key={tab.v} value={tab.v} className="text-[10px] h-7 px-2 gap-1">
                            <tab.icon className="w-3 h-3" />
                            {tab.l}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* ============================================================ */}
                {/* 4.1 EXPERIMENTAL SETUP */}
                {/* ============================================================ */}
                <TabsContent value="setup" className="space-y-4 mt-4">
                    <ParagraphCard
                        icon={Database}
                        color="text-blue-500"
                        titleEN="4.1.1 Dataset Description"
                        titleTR="4.1.1 Veri Seti Açıklaması"
                        titleAR="4.1.1 وصف مجموعة البيانات"
                        textEN={`The experiments were conducted on the CICIoT2023 dataset, a comprehensive real-world network traffic dataset comprising ${DATASET_STATISTICS.totalSamples.toLocaleString()} samples with ${DATASET_STATISTICS.totalFeatures} features extracted from 19 PCAP CSV files. The dataset contains ${DATASET_STATISTICS.classes} traffic classes: BenignTraffic, DDoS-ACK_Fragmentation, DDoS-SYN_Flood, Recon-PortScan, and Backdoor_Malware. A stratified split ratio of ${DATASET_STATISTICS.splitRatio} was applied, yielding ${DATASET_STATISTICS.totalFlows.training.toLocaleString()} training, ${DATASET_STATISTICS.totalFlows.validation.toLocaleString()} validation, and ${DATASET_STATISTICS.totalFlows.testing.toLocaleString()} testing samples. To address the class imbalance problem — particularly the minority class Backdoor_Malware with only ${DATASET_STATISTICS.originalMinorityCount.toLocaleString()} samples — SMOTE oversampling was applied to the training set, generating ${DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString()} synthetic samples and increasing the training set from 72,252 to ${DATASET_STATISTICS.totalFlows.training.toLocaleString()} balanced samples (${DATASET_STATISTICS.balancedClassCount.toLocaleString()} per class).`}
                        textTR={`Deneyler, 19 PCAP CSV dosyasından çıkarılmış ${DATASET_STATISTICS.totalFeatures} özelliğe sahip ${DATASET_STATISTICS.totalSamples.toLocaleString()} örnekten oluşan kapsamlı bir gerçek dünya ağ trafiği veri seti olan CICIoT2023 üzerinde gerçekleştirilmiştir. Veri seti ${DATASET_STATISTICS.classes} trafik sınıfı içerir: BenignTraffic, DDoS-ACK_Fragmentation, DDoS-SYN_Flood, Recon-PortScan ve Backdoor_Malware. ${DATASET_STATISTICS.splitRatio} tabakalı bölme oranı uygulanmış olup ${DATASET_STATISTICS.totalFlows.training.toLocaleString()} eğitim, ${DATASET_STATISTICS.totalFlows.validation.toLocaleString()} doğrulama ve ${DATASET_STATISTICS.totalFlows.testing.toLocaleString()} test örneği elde edilmiştir. Sınıf dengesizliği problemi — özellikle yalnızca ${DATASET_STATISTICS.originalMinorityCount.toLocaleString()} örneğe sahip azınlık sınıfı Backdoor_Malware — SMOTE aşırı örnekleme ile ele alınmış, ${DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString()} sentetik örnek üretilerek eğitim seti 72.252'den ${DATASET_STATISTICS.totalFlows.training.toLocaleString()} dengeli örneğe (sınıf başına ${DATASET_STATISTICS.balancedClassCount.toLocaleString()}) yükseltilmiştir.`}
                        textAR={`أُجريت التجارب على مجموعة بيانات CICIoT2023، وهي مجموعة بيانات شاملة لحركة مرور الشبكة في العالم الحقيقي تتكون من ${DATASET_STATISTICS.totalSamples.toLocaleString()} عينة و${DATASET_STATISTICS.totalFeatures} ميزة مستخرجة من 19 ملف PCAP CSV. تحتوي المجموعة على ${DATASET_STATISTICS.classes} أصناف: BenignTraffic وDDoS-ACK_Fragmentation وDDoS-SYN_Flood وRecon-PortScan وBackdoor_Malware. تم تطبيق نسبة تقسيم طبقي ${DATASET_STATISTICS.splitRatio}، مما أسفر عن ${DATASET_STATISTICS.totalFlows.training.toLocaleString()} عينة تدريب و${DATASET_STATISTICS.totalFlows.validation.toLocaleString()} عينة تحقق و${DATASET_STATISTICS.totalFlows.testing.toLocaleString()} عينة اختبار. لمعالجة مشكلة عدم توازن الأصناف — خاصة صنف الأقلية Backdoor_Malware الذي يحتوي على ${DATASET_STATISTICS.originalMinorityCount.toLocaleString()} عينة فقط — تم تطبيق SMOTE لتوليد ${DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString()} عينة اصطناعية وزيادة مجموعة التدريب من 72,252 إلى ${DATASET_STATISTICS.totalFlows.training.toLocaleString()} عينة متوازنة (${DATASET_STATISTICS.balancedClassCount.toLocaleString()} لكل صنف).`}
                    />

                    <ParagraphCard
                        icon={Settings2}
                        color="text-purple-500"
                        titleEN="4.1.2 BSO Algorithm Configuration"
                        titleTR="4.1.2 BSO Algoritma Yapılandırması"
                        titleAR="4.1.2 إعدادات خوارزمية BSO"
                        textEN={`The Bat Swarm Optimization (BSO) algorithm was configured with a population size of ${BSO_PARAMETERS.populationSize} bats and ${BSO_PARAMETERS.maxIterations} iterations. The frequency range was set to [${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}], with initial loudness A₀ = ${BSO_PARAMETERS.initialLoudness} and initial pulse rate r₀ = ${BSO_PARAMETERS.initialPulseRate}. The decay parameters were α = ${BSO_PARAMETERS.alpha} and γ = ${BSO_PARAMETERS.gamma}. The hybrid fitness function was defined as f(x) = ${BSO_PARAMETERS.fitnessFunction}, enabling simultaneous feature selection and Random Forest hyperparameter optimization. The optimized hyperparameters were: n_estimators = ${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth = ${BSO_PARAMETERS.optimizedHyperparameters.max_depth}, min_samples_split = ${BSO_PARAMETERS.optimizedHyperparameters.min_samples_split}, and max_features = ${BSO_PARAMETERS.optimizedHyperparameters.max_features}. The total number of fitness evaluations was ${BSO_PARAMETERS.totalEvaluations.toLocaleString()}, completed in ${BSO_PARAMETERS.optimizationTime} seconds.`}
                        textTR={`Yarasa Sürüsü Optimizasyonu (BSO) algoritması ${BSO_PARAMETERS.populationSize} yarasa popülasyonu ve ${BSO_PARAMETERS.maxIterations} iterasyonla yapılandırılmıştır. Frekans aralığı [${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}] olarak, başlangıç yüksekliği A₀ = ${BSO_PARAMETERS.initialLoudness} ve başlangıç nabız oranı r₀ = ${BSO_PARAMETERS.initialPulseRate} olarak ayarlanmıştır. Azalma parametreleri α = ${BSO_PARAMETERS.alpha} ve γ = ${BSO_PARAMETERS.gamma}'dır. Hibrit uyum fonksiyonu f(x) = ${BSO_PARAMETERS.fitnessFunction} olarak tanımlanmış olup eşzamanlı özellik seçimi ve Random Forest hiperparametre optimizasyonunu sağlar. Optimize edilen hiperparametreler: n_estimators = ${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}, max_depth = ${BSO_PARAMETERS.optimizedHyperparameters.max_depth}, min_samples_split = ${BSO_PARAMETERS.optimizedHyperparameters.min_samples_split} ve max_features = ${BSO_PARAMETERS.optimizedHyperparameters.max_features}. Toplam ${BSO_PARAMETERS.totalEvaluations.toLocaleString()} uyum değerlendirmesi ${BSO_PARAMETERS.optimizationTime} saniyede tamamlanmıştır.`}
                        textAR={`تم تهيئة خوارزمية تحسين سرب الخفافيش (BSO) بحجم سكان ${BSO_PARAMETERS.populationSize} خفاشاً و${BSO_PARAMETERS.maxIterations} تكراراً. تم ضبط نطاق التردد على [${BSO_PARAMETERS.frequencyMin}، ${BSO_PARAMETERS.frequencyMax}]، مع ارتفاع صوت أولي A₀ = ${BSO_PARAMETERS.initialLoudness} ومعدل نبض أولي r₀ = ${BSO_PARAMETERS.initialPulseRate}. كانت معلمات التناقص α = ${BSO_PARAMETERS.alpha} وγ = ${BSO_PARAMETERS.gamma}. تم تعريف دالة اللياقة الهجينة كالتالي: f(x) = ${BSO_PARAMETERS.fitnessFunction}، مما يتيح انتقاء الميزات وتحسين المعلمات الفائقة لـ Random Forest في آن واحد. المعلمات الفائقة المحسّنة: n_estimators = ${BSO_PARAMETERS.optimizedHyperparameters.n_estimators}، max_depth = ${BSO_PARAMETERS.optimizedHyperparameters.max_depth}، min_samples_split = ${BSO_PARAMETERS.optimizedHyperparameters.min_samples_split}، max_features = ${BSO_PARAMETERS.optimizedHyperparameters.max_features}. بلغ إجمالي تقييمات اللياقة ${BSO_PARAMETERS.totalEvaluations.toLocaleString()} تم إكمالها في ${BSO_PARAMETERS.optimizationTime} ثانية.`}
                    />
                </TabsContent>

                {/* ============================================================ */}
                {/* 4.2 OVERALL RESULTS */}
                {/* ============================================================ */}
                <TabsContent value="overall" className="space-y-4 mt-4">
                    <ParagraphCard
                        icon={BarChart3}
                        color="text-emerald-500"
                        titleEN="4.2.1 Classification Performance"
                        titleTR="4.2.1 Sınıflandırma Performansı"
                        titleAR="4.2.1 أداء التصنيف"
                        textEN={`The proposed BSO-Hybrid RF model achieved an overall accuracy of ${bso.accuracy}% on the test set (${DATASET_STATISTICS.totalFlows.testing.toLocaleString()} samples), with a weighted F1-score of ${bso.f1Score}%, precision of ${bso.precision}%, and recall of ${bso.recall}%. The macro-averaged F1-score was ${bso.f1Macro}%, and the AUC-ROC was ${bso.aucRoc}%. These results were obtained using only ${bso.featuresUsed} features selected by BSO from the original ${DATASET_STATISTICS.totalFeatures} features, representing a ${DATASET_STATISTICS.featureReductionPct}% dimensionality reduction. The Matthews Correlation Coefficient (MCC) was ${bso.mcc}, indicating strong agreement between predictions and ground truth. For comparison, XGBoost achieved the highest accuracy at ${xgb.accuracy}% but required all ${xgb.featuresUsed} features, while the standard Random Forest achieved ${rf.accuracy}% also using all ${rf.featuresUsed} features.`}
                        textTR={`Önerilen BSO-Hybrid RF modeli, test seti üzerinde (${DATASET_STATISTICS.totalFlows.testing.toLocaleString()} örnek) %${bso.accuracy} genel doğruluk elde etmiş olup ağırlıklı F1-skoru %${bso.f1Score}, kesinlik %${bso.precision} ve duyarlılık %${bso.recall}'dir. Makro ortalama F1-skoru %${bso.f1Macro} ve AUC-ROC %${bso.aucRoc}'dir. Bu sonuçlar, orijinal ${DATASET_STATISTICS.totalFeatures} özellikten BSO tarafından seçilen yalnızca ${bso.featuresUsed} özellik kullanılarak elde edilmiş olup %${DATASET_STATISTICS.featureReductionPct} boyutsallık azaltmasını temsil eder. Matthews Korelasyon Katsayısı (MCC) ${bso.mcc} olup tahminler ile gerçek değerler arasında güçlü uyum gösterir. Karşılaştırma için, XGBoost %${xgb.accuracy} ile en yüksek doğruluğu elde etmiş ancak tüm ${xgb.featuresUsed} özelliği gerektirirken, standart Random Forest tüm ${rf.featuresUsed} özellik kullanarak %${rf.accuracy} elde etmiştir.`}
                        textAR={`حقق نموذج BSO-Hybrid RF المقترح دقة إجمالية ${bso.accuracy}% على مجموعة الاختبار (${DATASET_STATISTICS.totalFlows.testing.toLocaleString()} عينة)، مع درجة F1 موزونة ${bso.f1Score}%، ودقة ${bso.precision}%، واستدعاء ${bso.recall}%. بلغت درجة F1 المتوسطة الكلية ${bso.f1Macro}%، وAUC-ROC ${bso.aucRoc}%. تم الحصول على هذه النتائج باستخدام ${bso.featuresUsed} ميزة فقط تم اختيارها بواسطة BSO من أصل ${DATASET_STATISTICS.totalFeatures} ميزة، مما يمثل تقليلاً بنسبة ${DATASET_STATISTICS.featureReductionPct}% في الأبعاد. بلغ معامل ارتباط ماثيوز (MCC) ${bso.mcc}، مما يشير إلى توافق قوي بين التنبؤات والقيم الحقيقية. للمقارنة، حقق XGBoost أعلى دقة بنسبة ${xgb.accuracy}% لكنه تطلب جميع الميزات الـ ${xgb.featuresUsed}، بينما حقق Random Forest القياسي ${rf.accuracy}% باستخدام جميع الميزات الـ ${rf.featuresUsed}.`}
                    />

                    <ParagraphCard
                        icon={Layers}
                        color="text-blue-500"
                        titleEN="4.2.2 Feature Selection Results"
                        titleTR="4.2.2 Özellik Seçimi Sonuçları"
                        titleAR="4.2.2 نتائج انتقاء الميزات"
                        textEN={`The BSO algorithm selected ${BSO_SELECTED_FEATURES.length} features from the original ${DATASET_STATISTICS.totalFeatures}, achieving a feature reduction of ${DATASET_STATISTICS.featureReductionPct}%. The top-5 most important features were: ${topFeatures}, with importance scores of ${BSO_SELECTED_FEATURES.slice(0, 5).map(f => f.importance.toFixed(4)).join(", ")}, respectively. The feature syn_count alone contributed ${(BSO_SELECTED_FEATURES[0].importance * 100).toFixed(1)}% of the total importance, indicating that SYN packet count is the most discriminative feature for DDoS traffic classification. Compared to other metaheuristic optimizers, BSO achieved the best fitness value of ${FEATURE_SELECTION_COMPARISON.BSO.bestFitness} using ${FEATURE_SELECTION_COMPARISON.BSO.nSelected} features, while PSO selected ${FEATURE_SELECTION_COMPARISON.PSO.nSelected} features (fitness: ${FEATURE_SELECTION_COMPARISON.PSO.bestFitness}), GA selected ${FEATURE_SELECTION_COMPARISON.GA.nSelected} features (fitness: ${FEATURE_SELECTION_COMPARISON.GA.bestFitness}), and GWO selected ${FEATURE_SELECTION_COMPARISON.GWO.nSelected} features (fitness: ${FEATURE_SELECTION_COMPARISON.GWO.bestFitness}).`}
                        textTR={`BSO algoritması orijinal ${DATASET_STATISTICS.totalFeatures} özellikten ${BSO_SELECTED_FEATURES.length} özellik seçerek %${DATASET_STATISTICS.featureReductionPct} özellik azaltma sağlamıştır. En önemli 5 özellik: ${topFeatures} olup önem puanları sırasıyla ${BSO_SELECTED_FEATURES.slice(0, 5).map(f => f.importance.toFixed(4)).join(", ")}'dir. syn_count tek başına toplam önemin %${(BSO_SELECTED_FEATURES[0].importance * 100).toFixed(1)}'ini oluşturmakta olup SYN paket sayısının DDoS trafik sınıflandırması için en ayırt edici özellik olduğunu gösterir. Diğer metasezgisel optimizörlerle karşılaştırıldığında, BSO ${FEATURE_SELECTION_COMPARISON.BSO.nSelected} özellikle ${FEATURE_SELECTION_COMPARISON.BSO.bestFitness} en iyi uyum değerine ulaşırken, PSO ${FEATURE_SELECTION_COMPARISON.PSO.nSelected} özellik (${FEATURE_SELECTION_COMPARISON.PSO.bestFitness}), GA ${FEATURE_SELECTION_COMPARISON.GA.nSelected} özellik (${FEATURE_SELECTION_COMPARISON.GA.bestFitness}) ve GWO ${FEATURE_SELECTION_COMPARISON.GWO.nSelected} özellik (${FEATURE_SELECTION_COMPARISON.GWO.bestFitness}) seçmiştir.`}
                        textAR={`اختارت خوارزمية BSO ${BSO_SELECTED_FEATURES.length} ميزة من أصل ${DATASET_STATISTICS.totalFeatures} ميزة، محققة تقليلاً بنسبة ${DATASET_STATISTICS.featureReductionPct}%. كانت أهم 5 ميزات: ${topFeatures}، بدرجات أهمية ${BSO_SELECTED_FEATURES.slice(0, 5).map(f => f.importance.toFixed(4)).join("، ")} على التوالي. ساهمت ميزة syn_count وحدها بنسبة ${(BSO_SELECTED_FEATURES[0].importance * 100).toFixed(1)}% من الأهمية الإجمالية، مما يشير إلى أن عدد حزم SYN هو الميزة الأكثر تمييزاً لتصنيف حركة DDoS. مقارنة بالمحسنات التطورية الأخرى، حقق BSO أفضل قيمة لياقة ${FEATURE_SELECTION_COMPARISON.BSO.bestFitness} باستخدام ${FEATURE_SELECTION_COMPARISON.BSO.nSelected} ميزة، بينما اختار PSO ${FEATURE_SELECTION_COMPARISON.PSO.nSelected} ميزة (${FEATURE_SELECTION_COMPARISON.PSO.bestFitness})، وGA ${FEATURE_SELECTION_COMPARISON.GA.nSelected} ميزة (${FEATURE_SELECTION_COMPARISON.GA.bestFitness})، وGWO ${FEATURE_SELECTION_COMPARISON.GWO.nSelected} ميزة (${FEATURE_SELECTION_COMPARISON.GWO.bestFitness}).`}
                    />
                </TabsContent>

                {/* ============================================================ */}
                {/* 4.3 PER-CLASS PERFORMANCE */}
                {/* ============================================================ */}
                <TabsContent value="perclass" className="space-y-4 mt-4">
                    <ParagraphCard
                        icon={Target}
                        color="text-red-500"
                        titleEN="4.3.1 Per-Class Analysis"
                        titleTR="4.3.1 Sınıf Bazlı Analiz"
                        titleAR="4.3.1 تحليل الأداء حسب الصنف"
                        textEN={`Per-class analysis of the BSO-Hybrid RF model reveals significant variation across traffic types. DDoS-ACK_Fragmentation and DDoS-SYN_Flood achieved near-perfect detection with F1-scores of ${BSO_RF_PER_CLASS[2].f1Score}% and ${BSO_RF_PER_CLASS[3].f1Score}%, respectively, indicating that these flood-based attacks exhibit highly distinctive network patterns. BenignTraffic was classified with an F1-score of ${BSO_RF_PER_CLASS[1].f1Score}% (precision: ${BSO_RF_PER_CLASS[1].precision}%, recall: ${BSO_RF_PER_CLASS[1].recall}%). Recon-PortScan achieved an F1-score of ${BSO_RF_PER_CLASS[4].f1Score}% (precision: ${BSO_RF_PER_CLASS[4].precision}%, recall: ${BSO_RF_PER_CLASS[4].recall}%). The most challenging class was Backdoor_Malware, with an F1-score of only ${BSO_RF_PER_CLASS[0].f1Score}% (precision: ${BSO_RF_PER_CLASS[0].precision}%, recall: ${BSO_RF_PER_CLASS[0].recall}%), attributable to its limited test samples (${BSO_RF_PER_CLASS[0].support}) and overlap with benign traffic patterns. The primary confusion occurred between Backdoor_Malware, BenignTraffic, and Recon-PortScan, as corroborated by the confusion matrix analysis.`}
                        textTR={`BSO-Hybrid RF modelinin sınıf bazlı analizi, trafik türleri arasında önemli farklılıklar ortaya koymaktadır. DDoS-ACK_Fragmentation ve DDoS-SYN_Flood sırasıyla %${BSO_RF_PER_CLASS[2].f1Score} ve %${BSO_RF_PER_CLASS[3].f1Score} F1-skoruyla neredeyse mükemmel tespit sağlamıştır; bu, flood tabanlı saldırıların son derece ayırt edici ağ kalıpları sergilediğini gösterir. BenignTraffic %${BSO_RF_PER_CLASS[1].f1Score} F1-skoru (kesinlik: %${BSO_RF_PER_CLASS[1].precision}, duyarlılık: %${BSO_RF_PER_CLASS[1].recall}) ile sınıflandırılmıştır. Recon-PortScan %${BSO_RF_PER_CLASS[4].f1Score} F1-skoru elde etmiştir. En zorlu sınıf, yalnızca %${BSO_RF_PER_CLASS[0].f1Score} F1-skoru ile Backdoor_Malware olmuştur (kesinlik: %${BSO_RF_PER_CLASS[0].precision}, duyarlılık: %${BSO_RF_PER_CLASS[0].recall}); bu durum sınırlı test örneklerine (${BSO_RF_PER_CLASS[0].support}) ve normal trafik kalıplarıyla örtüşmeye bağlanmaktadır. Temel karışıklık, karışıklık matrisi analiziyle de doğrulandığı üzere, Backdoor_Malware, BenignTraffic ve Recon-PortScan arasında gerçekleşmiştir.`}
                        textAR={`يكشف التحليل حسب الصنف لنموذج BSO-Hybrid RF عن تباين كبير بين أنواع حركة المرور. حققت DDoS-ACK_Fragmentation وDDoS-SYN_Flood كشفاً شبه مثالي بدرجات F1 ${BSO_RF_PER_CLASS[2].f1Score}% و${BSO_RF_PER_CLASS[3].f1Score}% على التوالي، مما يشير إلى أن هجمات الفيضان تُظهر أنماط شبكة مميزة للغاية. تم تصنيف BenignTraffic بدرجة F1 ${BSO_RF_PER_CLASS[1].f1Score}% (دقة: ${BSO_RF_PER_CLASS[1].precision}%، استدعاء: ${BSO_RF_PER_CLASS[1].recall}%). حقق Recon-PortScan درجة F1 ${BSO_RF_PER_CLASS[4].f1Score}%. كان الصنف الأكثر تحدياً هو Backdoor_Malware بدرجة F1 ${BSO_RF_PER_CLASS[0].f1Score}% فقط (دقة: ${BSO_RF_PER_CLASS[0].precision}%، استدعاء: ${BSO_RF_PER_CLASS[0].recall}%)، ويُعزى ذلك إلى عيناته المحدودة (${BSO_RF_PER_CLASS[0].support}) وتداخله مع أنماط حركة المرور العادية.`}
                    />
                </TabsContent>

                {/* ============================================================ */}
                {/* 4.4 COMPARATIVE ANALYSIS */}
                {/* ============================================================ */}
                <TabsContent value="comparison" className="space-y-4 mt-4">
                    <ParagraphCard
                        icon={TrendingUp}
                        color="text-indigo-500"
                        titleEN="4.4.1 Model Comparison"
                        titleTR="4.4.1 Model Karşılaştırması"
                        titleAR="4.4.1 مقارنة النماذج"
                        textEN={`A comprehensive comparison of 12 machine learning models was conducted on the CICIoT2023 test set. XGBoost achieved the highest accuracy (${xgb.accuracy}%) and F1-weighted score (${xgb.f1Score}%) using all ${xgb.featuresUsed} features. The proposed BSO-Hybrid RF ranked competitively at ${bso.accuracy}% accuracy with only ${bso.featuresUsed} features — a difference of merely ${(xgb.accuracy - bso.accuracy).toFixed(2)} percentage points while using ${Math.round((1 - bso.featuresUsed / xgb.featuresUsed) * 100)}% fewer features. Among metaheuristic-optimized models, BSO-Hybrid RF outperformed PSO-RF (${psoRf.accuracy}%), GA-RF (${gaRf.accuracy}%), and BSO-SVM (${MODEL_RESULTS.find(m => m.name === "BSO-SVM")!.accuracy}%), achieving comparable performance to GWO-RF (${gwoRf.accuracy}%) while using ${gwoRf.featuresUsed - bso.featuresUsed} fewer features. Traditional classifiers showed lower performance: Decision Tree (${dt.accuracy}%), K-Nearest Neighbors (${MODEL_RESULTS.find(m => m.name === "K-Nearest Neighbors")!.accuracy}%), Naive Bayes (${nb.accuracy}%), and Logistic Regression (${MODEL_RESULTS.find(m => m.name === "Logistic Regression")!.accuracy}%).`}
                        textTR={`CICIoT2023 test seti üzerinde 12 makine öğrenimi modelinin kapsamlı karşılaştırması yapılmıştır. XGBoost, tüm ${xgb.featuresUsed} özelliği kullanarak %${xgb.accuracy} doğruluk ve %${xgb.f1Score} F1-ağırlıklı skor ile en yüksek sonucu elde etmiştir. Önerilen BSO-Hybrid RF, yalnızca ${bso.featuresUsed} özellikle %${bso.accuracy} doğruluk ile rekabetçi konumdadır — bu, %${Math.round((1 - bso.featuresUsed / xgb.featuresUsed) * 100)} daha az özellik kullanırken yalnızca ${(xgb.accuracy - bso.accuracy).toFixed(2)} yüzde puanlık bir farktır. Metasezgisel optimizasyonlu modeller arasında BSO-Hybrid RF, PSO-RF (%${psoRf.accuracy}), GA-RF (%${gaRf.accuracy}) ve BSO-SVM'yi (%${MODEL_RESULTS.find(m => m.name === "BSO-SVM")!.accuracy}) geride bırakırken, ${gwoRf.featuresUsed - bso.featuresUsed} daha az özellik kullanarak GWO-RF (%${gwoRf.accuracy}) ile karşılaştırılabilir performans sergilemiştir. Geleneksel sınıflandırıcılar daha düşük performans göstermiştir: Decision Tree (%${dt.accuracy}), KNN (%${MODEL_RESULTS.find(m => m.name === "K-Nearest Neighbors")!.accuracy}), Naive Bayes (%${nb.accuracy}) ve Logistic Regression (%${MODEL_RESULTS.find(m => m.name === "Logistic Regression")!.accuracy}).`}
                        textAR={`تم إجراء مقارنة شاملة لـ 12 نموذج تعلم آلي على مجموعة اختبار CICIoT2023. حقق XGBoost أعلى دقة (${xgb.accuracy}%) ودرجة F1 موزونة (${xgb.f1Score}%) باستخدام جميع الميزات الـ ${xgb.featuresUsed}. احتل BSO-Hybrid RF المقترح مرتبة تنافسية بدقة ${bso.accuracy}% باستخدام ${bso.featuresUsed} ميزة فقط — بفارق ${(xgb.accuracy - bso.accuracy).toFixed(2)} نقطة مئوية فقط مع استخدام ميزات أقل بنسبة ${Math.round((1 - bso.featuresUsed / xgb.featuresUsed) * 100)}%. بين النماذج المحسّنة تطورياً، تفوق BSO-Hybrid RF على PSO-RF (${psoRf.accuracy}%) وGA-RF (${gaRf.accuracy}%) وBSO-SVM (${MODEL_RESULTS.find(m => m.name === "BSO-SVM")!.accuracy}%)، وحقق أداءً مماثلاً لـ GWO-RF (${gwoRf.accuracy}%) مع استخدام ${gwoRf.featuresUsed - bso.featuresUsed} ميزات أقل.`}
                    />
                </TabsContent>

                {/* ============================================================ */}
                {/* 4.5 BSO IMPACT */}
                {/* ============================================================ */}
                <TabsContent value="bso" className="space-y-4 mt-4">
                    <ParagraphCard
                        icon={Activity}
                        color="text-orange-500"
                        titleEN="4.5.1 BSO Optimization Impact"
                        titleTR="4.5.1 BSO Optimizasyon Etkisi"
                        titleAR="4.5.1 تأثير تحسين BSO"
                        textEN={`The BSO-Hybrid optimization converged to a final best fitness value of ${BSO_PARAMETERS.optimizedHyperparameters ? FEATURE_SELECTION_COMPARISON.BSO.bestFitness : 'N/A'} after ${BSO_PARAMETERS.maxIterations} iterations with ${BSO_PARAMETERS.totalEvaluations.toLocaleString()} total evaluations in ${BSO_PARAMETERS.optimizationTime} seconds. The convergence analysis shows the algorithm achieved significant improvement in the first 20 iterations, reducing the best fitness from 0.1848 to 0.1794, followed by fine-tuning in iterations 20–50 that further reduced it to ${FEATURE_SELECTION_COMPARISON.BSO.bestFitness}. The feature dimensionality was progressively reduced from 27 (iteration 0) to ${BSO_SELECTED_FEATURES.length} (final solution), demonstrating BSO's ability to efficiently prune irrelevant features while maintaining classification performance. Compared to PSO (fitness: ${FEATURE_SELECTION_COMPARISON.PSO.bestFitness}, time: ${FEATURE_SELECTION_COMPARISON.PSO.time}s), GA (fitness: ${FEATURE_SELECTION_COMPARISON.GA.bestFitness}, time: ${FEATURE_SELECTION_COMPARISON.GA.time}s), and GWO (fitness: ${FEATURE_SELECTION_COMPARISON.GWO.bestFitness}, time: ${FEATURE_SELECTION_COMPARISON.GWO.time}s), BSO required more computation time but achieved the best solution quality.`}
                        textTR={`BSO-Hybrid optimizasyonu, ${BSO_PARAMETERS.maxIterations} iterasyonda toplam ${BSO_PARAMETERS.totalEvaluations.toLocaleString()} değerlendirme ile ${BSO_PARAMETERS.optimizationTime} saniyede ${FEATURE_SELECTION_COMPARISON.BSO.bestFitness} nihai en iyi uyum değerine yakınsamıştır. Yakınsama analizi, algoritmanın ilk 20 iterasyonda önemli ilerleme kaydettiğini, en iyi uyum değerini 0.1848'den 0.1794'e düşürdüğünü, ardından 20–50 iterasyonlarda ince ayar yaparak ${FEATURE_SELECTION_COMPARISON.BSO.bestFitness}'e indirdiğini gösterir. Özellik boyutsallığı 27'den (iterasyon 0) ${BSO_SELECTED_FEATURES.length}'a (nihai çözüm) kademeli olarak azaltılmıştır, bu BSO'nun sınıflandırma performansını korurken alakasız özellikleri verimli şekilde budama yeteneğini kanıtlar. PSO (uyum: ${FEATURE_SELECTION_COMPARISON.PSO.bestFitness}, süre: ${FEATURE_SELECTION_COMPARISON.PSO.time}s), GA (uyum: ${FEATURE_SELECTION_COMPARISON.GA.bestFitness}, süre: ${FEATURE_SELECTION_COMPARISON.GA.time}s) ve GWO (uyum: ${FEATURE_SELECTION_COMPARISON.GWO.bestFitness}, süre: ${FEATURE_SELECTION_COMPARISON.GWO.time}s) ile karşılaştırıldığında, BSO daha fazla hesaplama süresi gerektirmiş ancak en iyi çözüm kalitesine ulaşmıştır.`}
                        textAR={`تقاربت تحسين BSO-Hybrid إلى أفضل قيمة لياقة نهائية ${FEATURE_SELECTION_COMPARISON.BSO.bestFitness} بعد ${BSO_PARAMETERS.maxIterations} تكراراً مع ${BSO_PARAMETERS.totalEvaluations.toLocaleString()} تقييم إجمالي في ${BSO_PARAMETERS.optimizationTime} ثانية. يُظهر تحليل التقارب أن الخوارزمية حققت تحسناً كبيراً في أول 20 تكراراً، حيث خفضت أفضل لياقة من 0.1848 إلى 0.1794، تليها ضبط دقيق في التكرارات 20-50 خفضها إلى ${FEATURE_SELECTION_COMPARISON.BSO.bestFitness}. تم تقليل أبعاد الميزات تدريجياً من 27 (التكرار 0) إلى ${BSO_SELECTED_FEATURES.length} (الحل النهائي). مقارنة بـ PSO (لياقة: ${FEATURE_SELECTION_COMPARISON.PSO.bestFitness}، وقت: ${FEATURE_SELECTION_COMPARISON.PSO.time} ثانية) وGA (${FEATURE_SELECTION_COMPARISON.GA.bestFitness}، ${FEATURE_SELECTION_COMPARISON.GA.time} ثانية) وGWO (${FEATURE_SELECTION_COMPARISON.GWO.bestFitness}، ${FEATURE_SELECTION_COMPARISON.GWO.time} ثانية)، تطلب BSO وقت حساب أكثر لكنه حقق أفضل جودة حل.`}
                    />
                </TabsContent>

                {/* ============================================================ */}
                {/* 4.6 COMPUTATIONAL EFFICIENCY */}
                {/* ============================================================ */}
                <TabsContent value="efficiency" className="space-y-4 mt-4">
                    <ParagraphCard
                        icon={Clock}
                        color="text-cyan-500"
                        titleEN="4.6.1 Computational Efficiency"
                        titleTR="4.6.1 Hesaplama Verimliliği"
                        titleAR="4.6.1 الكفاءة الحسابية"
                        textEN={`The BSO-Hybrid RF model demonstrated strong computational efficiency suitable for real-time DDoS detection. The training time was ${bso.trainingTime} seconds, and the per-sample prediction time was ${bso.predictionTime} ms, enabling a throughput of ${Math.round(1000 / bso.predictionTime).toLocaleString()} samples/second. Batch processing experiments showed scalable performance: batch size 100 achieved ${DYNAMIC_ENVIRONMENT.throughput[0].samplesPerSecond.toLocaleString()} samples/sec, batch size 1,000 achieved ${DYNAMIC_ENVIRONMENT.throughput[2].samplesPerSecond.toLocaleString()} samples/sec, and the full test set (${throughputMax.batchSize.toLocaleString()} samples) achieved ${throughputMax.samplesPerSecond.toLocaleString()} samples/sec at ${throughputMax.msPerSample} ms/sample. The reduced feature set (${bso.featuresUsed} vs ${rf.featuresUsed}) contributes to faster feature extraction in deployment while maintaining competitive accuracy. Among all models, Decision Tree had the fastest prediction (${dt.predictionTime} ms) but significantly lower accuracy (${dt.accuracy}%), while KNN had the slowest prediction (${MODEL_RESULTS.find(m => m.name === "K-Nearest Neighbors")!.predictionTime} ms) due to distance computation overhead.`}
                        textTR={`BSO-Hybrid RF modeli, gerçek zamanlı DDoS tespiti için uygun güçlü hesaplama verimliliği sergilemiştir. Eğitim süresi ${bso.trainingTime} saniye, örnek başına tahmin süresi ${bso.predictionTime} ms olup saniyede ${Math.round(1000 / bso.predictionTime).toLocaleString()} örnek işleme kapasitesi sağlar. Toplu işleme deneyleri ölçeklenebilir performans göstermiştir: 100'lük toplu boyut saniyede ${DYNAMIC_ENVIRONMENT.throughput[0].samplesPerSecond.toLocaleString()} örnek, 1.000'lik toplu boyut saniyede ${DYNAMIC_ENVIRONMENT.throughput[2].samplesPerSecond.toLocaleString()} örnek ve tam test seti (${throughputMax.batchSize.toLocaleString()} örnek) ${throughputMax.msPerSample} ms/örnek ile saniyede ${throughputMax.samplesPerSecond.toLocaleString()} örnek işlemiştir. Azaltılmış özellik seti (${bso.featuresUsed} vs ${rf.featuresUsed}), rekabetçi doğruluğu korurken dağıtımda daha hızlı özellik çıkarımına katkı sağlar. Tüm modeller arasında Decision Tree en hızlı tahmine (${dt.predictionTime} ms) sahipken doğruluğu önemli ölçüde düşüktür (%${dt.accuracy}), KNN ise mesafe hesaplama yükü nedeniyle en yavaş tahmine (${MODEL_RESULTS.find(m => m.name === "K-Nearest Neighbors")!.predictionTime} ms) sahiptir.`}
                        textAR={`أظهر نموذج BSO-Hybrid RF كفاءة حسابية قوية مناسبة للكشف الفوري عن DDoS. بلغ وقت التدريب ${bso.trainingTime} ثانية، ووقت التنبؤ لكل عينة ${bso.predictionTime} مللي ثانية، مما يتيح معالجة ${Math.round(1000 / bso.predictionTime).toLocaleString()} عينة/ثانية. أظهرت تجارب المعالجة الدفعية أداءً قابلاً للتوسع: حجم دفعة 100 حقق ${DYNAMIC_ENVIRONMENT.throughput[0].samplesPerSecond.toLocaleString()} عينة/ثانية، وحجم 1000 حقق ${DYNAMIC_ENVIRONMENT.throughput[2].samplesPerSecond.toLocaleString()} عينة/ثانية، ومجموعة الاختبار الكاملة (${throughputMax.batchSize.toLocaleString()} عينة) حققت ${throughputMax.samplesPerSecond.toLocaleString()} عينة/ثانية بمعدل ${throughputMax.msPerSample} مللي ثانية/عينة.`}
                    />
                </TabsContent>

                {/* ============================================================ */}
                {/* 4.7 STATISTICAL SIGNIFICANCE */}
                {/* ============================================================ */}
                <TabsContent value="statistical" className="space-y-4 mt-4">
                    <ParagraphCard
                        icon={FlaskConical}
                        color="text-purple-500"
                        titleEN="4.7.1 Statistical Significance"
                        titleTR="4.7.1 İstatistiksel Anlamlılık"
                        titleAR="4.7.1 الدلالة الإحصائية"
                        textEN={`Statistical significance was assessed using 10-fold stratified cross-validation with SMOTE applied inside each fold to prevent data leakage, paired t-tests, and Wilcoxon signed-rank tests at α = 0.05. The BSO-Hybrid RF achieved a mean cross-validation accuracy of ${CROSS_VALIDATION.mean.accuracy}% ± ${CROSS_VALIDATION.std.accuracy} (σ). Paired comparisons against three baseline models showed: BSO-Hybrid RF performs comparably to Random Forest (${STATISTICAL_TESTS[0].improvement}, p = ${STATISTICAL_TESTS[0].pValue}) while using ${bso.featuresUsed} vs ${rf.featuresUsed} features (51.3% reduction), significantly outperformed Decision Tree (+${STATISTICAL_TESTS[1].improvement}, p < 0.001, Cohen's d = ${STATISTICAL_TESTS[1].cohenD}), and Logistic Regression (+${STATISTICAL_TESTS[2].improvement}, p < 0.001). Note: XGBoost (${xgb.accuracy}%) achieves the highest test accuracy overall using all ${xgb.featuresUsed} features. The BSO-Hybrid RF's contribution is competitive accuracy with 51.3% dimensionality reduction, making it suitable for resource-constrained IoT environments.`}
                        textTR={`İstatistiksel anlamlılık, veri sızıntısını önlemek için SMOTE'un her katlam içinde uygulandığı 10 katlı tabakalı çapraz doğrulama, eşleştirilmiş t-testleri ve Wilcoxon işaretli sıralama testleri (α = 0.05) kullanılarak değerlendirilmiştir. BSO-Hybrid RF, %${CROSS_VALIDATION.mean.accuracy} ± ${CROSS_VALIDATION.std.accuracy} (σ) ortalama çapraz doğrulama doğruluğu elde etmiştir. Üç temel modelle karşılaştırma: BSO-Hybrid RF, Random Forest ile karşılaştırılabilir performans gösterir (${STATISTICAL_TESTS[0].improvement}, p = ${STATISTICAL_TESTS[0].pValue}) ancak ${bso.featuresUsed} özellik kullanarak %51.3 boyut azaltma sağlar, Decision Tree'yi (+${STATISTICAL_TESTS[1].improvement}, p < 0.001, Cohen d = ${STATISTICAL_TESTS[1].cohenD}) ve Logistic Regression'ı (+${STATISTICAL_TESTS[2].improvement}, p < 0.001) anlamlı şekilde geride bırakır. Not: XGBoost (%${xgb.accuracy}) tüm ${xgb.featuresUsed} özellikle en yüksek test doğruluğunu elde eder. BSO-Hybrid RF'nin katkısı, %51.3 boyut azaltmayla rekabetçi doğruluktur.`}
                        textAR={`تم تقييم الدلالة الإحصائية باستخدام التحقق المتقاطع الطبقي 10 طيات مع تطبيق SMOTE داخل كل طية لمنع تسريب البيانات، واختبارات t المزدوجة، واختبارات ويلكوكسون عند α = 0.05. حقق BSO-Hybrid RF متوسط دقة ${CROSS_VALIDATION.mean.accuracy}% ± ${CROSS_VALIDATION.std.accuracy}. أظهرت المقارنات مع ثلاثة نماذج أساسية: BSO-Hybrid RF يقارب أداء Random Forest (${STATISTICAL_TESTS[0].improvement}، p = ${STATISTICAL_TESTS[0].pValue}) مع استخدام ${bso.featuresUsed} ميزة فقط (تقليل 51.3%)، ويتفوق بشكل ملحوظ على Decision Tree (+${STATISTICAL_TESTS[1].improvement}، p < 0.001) وLogistic Regression (+${STATISTICAL_TESTS[2].improvement}، p < 0.001). ملاحظة: XGBoost (${xgb.accuracy}%) يحقق أعلى دقة اختبار باستخدام جميع الميزات الـ ${xgb.featuresUsed}. مساهمة BSO-Hybrid RF هي دقة تنافسية مع تقليل الأبعاد بنسبة 51.3%.`}
                    />
                </TabsContent>

                {/* ============================================================ */}
                {/* 4.8 DISCUSSION */}
                {/* ============================================================ */}
                <TabsContent value="discussion" className="space-y-4 mt-4">
                    <ParagraphCard
                        icon={Award}
                        color="text-emerald-500"
                        titleEN="4.8.1 Key Research Contribution"
                        titleTR="4.8.1 Temel Araştırma Katkısı"
                        titleAR="4.8.1 المساهمة البحثية الرئيسية"
                        textEN={`This study demonstrates that the BSO-Hybrid framework — combining Bat Swarm Optimization for joint feature selection and Random Forest hyperparameter tuning — achieves competitive DDoS detection performance (${bso.accuracy}% accuracy, ${bso.f1Score}% F1-weighted, ${bso.aucRoc}% AUC-ROC) on the CICIoT2023 dataset while reducing the feature space by ${DATASET_STATISTICS.featureReductionPct}% (${DATASET_STATISTICS.totalFeatures} → ${BSO_SELECTED_FEATURES.length} features). The proposed approach bridges the gap between high detection accuracy and computational efficiency — a critical requirement for resource-constrained IoT environments. The ${BSO_SELECTED_FEATURES.length}-feature model achieves only ${(xgb.accuracy - bso.accuracy).toFixed(2)} percentage points below the best full-feature model (XGBoost), making it suitable for deployment on edge devices with limited processing capabilities. The 10-fold cross-validation (${CROSS_VALIDATION.mean.accuracy}% ± ${CROSS_VALIDATION.std.accuracy}) confirms the model's generalizability, and the real-time throughput of ${throughputMax.samplesPerSecond.toLocaleString()} samples/second validates its practical applicability for network-level DDoS detection.`}
                        textTR={`Bu çalışma, Yarasa Sürüsü Optimizasyonu ile ortak özellik seçimi ve Random Forest hiperparametre ayarını birleştiren BSO-Hybrid çerçevesinin CICIoT2023 veri seti üzerinde özellik uzayını %${DATASET_STATISTICS.featureReductionPct} azaltırken (${DATASET_STATISTICS.totalFeatures} → ${BSO_SELECTED_FEATURES.length} özellik) rekabetçi DDoS tespit performansı (%${bso.accuracy} doğruluk, %${bso.f1Score} F1-ağırlıklı, %${bso.aucRoc} AUC-ROC) elde ettiğini göstermektedir. Önerilen yaklaşım, yüksek tespit doğruluğu ile hesaplama verimliliği arasındaki boşluğu kapatır — kaynak kısıtlı IoT ortamları için kritik bir gereklilik. ${BSO_SELECTED_FEATURES.length} özellikli model, en iyi tam özellikli modelin (XGBoost) yalnızca ${(xgb.accuracy - bso.accuracy).toFixed(2)} yüzde puanı altında kalarak sınırlı işlem kapasitesine sahip kenar cihazlarda dağıtıma uygundur. 10 katlı çapraz doğrulama (%${CROSS_VALIDATION.mean.accuracy} ± ${CROSS_VALIDATION.std.accuracy}) modelin genelleştirilebilirliğini, saniyede ${throughputMax.samplesPerSecond.toLocaleString()} örnek gerçek zamanlı işleme kapasitesi ise ağ düzeyinde DDoS tespiti için pratik uygulanabilirliğini doğrular.`}
                        textAR={`تُثبت هذه الدراسة أن إطار BSO-Hybrid — الذي يجمع بين تحسين سرب الخفافيش لانتقاء الميزات المشترك وضبط المعلمات الفائقة لـ Random Forest — يحقق أداء كشف DDoS تنافسياً (دقة ${bso.accuracy}%، F1 موزون ${bso.f1Score}%، AUC-ROC ${bso.aucRoc}%) على مجموعة CICIoT2023 مع تقليل فضاء الميزات بنسبة ${DATASET_STATISTICS.featureReductionPct}% (${DATASET_STATISTICS.totalFeatures} → ${BSO_SELECTED_FEATURES.length} ميزة). يسد النهج المقترح الفجوة بين دقة الكشف العالية والكفاءة الحسابية — متطلب حاسم لبيئات IoT محدودة الموارد. يحقق نموذج الـ ${BSO_SELECTED_FEATURES.length} ميزة أقل بـ ${(xgb.accuracy - bso.accuracy).toFixed(2)} نقطة مئوية فقط من أفضل نموذج كامل الميزات (XGBoost)، مما يجعله مناسباً للنشر على أجهزة الحافة. يؤكد التحقق المتقاطع 10 طيات (${CROSS_VALIDATION.mean.accuracy}% ± ${CROSS_VALIDATION.std.accuracy}) قابلية تعميم النموذج، والمعالجة الفورية ${throughputMax.samplesPerSecond.toLocaleString()} عينة/ثانية تثبت قابلية تطبيقه العملية.`}
                    />

                    <ParagraphCard
                        icon={AlertTriangle}
                        color="text-amber-500"
                        titleEN="4.8.2 Limitations & Future Work"
                        titleTR="4.8.2 Sınırlamalar ve Gelecek Çalışma"
                        titleAR="4.8.2 القيود والعمل المستقبلي"
                        textEN={`Several limitations were identified. First, the Backdoor_Malware class has a low F1-score (${BSO_RF_PER_CLASS[0].f1Score}%) due to limited samples (${BSO_RF_PER_CLASS[0].support} test) and pattern overlap with benign traffic; future work should explore GAN-based data augmentation for minority classes. Second, noise robustness degrades significantly beyond 5% feature noise (accuracy drops from ${DYNAMIC_ENVIRONMENT.noiseRobustness[0].accuracy}% to ${DYNAMIC_ENVIRONMENT.noiseRobustness[1].accuracy}% at 5% noise), suggesting the need for ensemble diversity methods or adversarial training. Third, the BSO optimization time (${BSO_PARAMETERS.optimizationTime}s) is substantially higher than PSO (${FEATURE_SELECTION_COMPARISON.PSO.time}s) and GA (${FEATURE_SELECTION_COMPARISON.GA.time}s), representing a trade-off for better solution quality. Fourth, the multi-class (5-class) results are inherently lower than binary classification results reported in prior literature — this is expected and represents a fairer, more challenging evaluation. Future research directions include deep learning integration, online/streaming detection frameworks, and deployment on Raspberry Pi or FPGA edge devices.`}
                        textTR={`Birkaç sınırlama tespit edilmiştir. Birincisi, Backdoor_Malware sınıfı sınırlı örnekler (${BSO_RF_PER_CLASS[0].support} test) ve normal trafikle kalıp örtüşmesi nedeniyle düşük F1-skoruna (%${BSO_RF_PER_CLASS[0].f1Score}) sahiptir; gelecek çalışmalarda azınlık sınıfları için GAN tabanlı veri artırma araştırılmalıdır. İkincisi, gürültü direnci %5 özellik gürültüsünü aştığında önemli ölçüde düşmektedir (doğruluk %${DYNAMIC_ENVIRONMENT.noiseRobustness[0].accuracy}'den %5 gürültüde %${DYNAMIC_ENVIRONMENT.noiseRobustness[1].accuracy}'e düşer), bu topluluk çeşitliliği veya düşmanca eğitim yöntemlerinin gerekliliğini gösterir. Üçüncüsü, BSO optimizasyon süresi (${BSO_PARAMETERS.optimizationTime}s) PSO (${FEATURE_SELECTION_COMPARISON.PSO.time}s) ve GA (${FEATURE_SELECTION_COMPARISON.GA.time}s)'den önemli ölçüde yüksektir, daha iyi çözüm kalitesi için bir takas temsil eder. Dördüncüsü, çok sınıflı (5 sınıf) sonuçlar doğası gereği önceki literatürde rapor edilen ikili sınıflandırma sonuçlarından düşüktür — bu beklenen ve daha adil bir değerlendirmeyi temsil eder. Gelecek araştırma yönleri: derin öğrenme entegrasyonu, çevrimiçi/akış tespit çerçeveleri ve Raspberry Pi veya FPGA kenar cihazlarında dağıtım.`}
                        textAR={`تم تحديد عدة قيود. أولاً، يمتلك صنف Backdoor_Malware درجة F1 منخفضة (${BSO_RF_PER_CLASS[0].f1Score}%) بسبب العينات المحدودة (${BSO_RF_PER_CLASS[0].support} اختبار) وتداخل الأنماط مع حركة المرور العادية؛ يجب استكشاف تعزيز البيانات باستخدام GAN. ثانياً، تتدهور المتانة ضد الضوضاء بشكل كبير بعد 5% (الدقة تنخفض من ${DYNAMIC_ENVIRONMENT.noiseRobustness[0].accuracy}% إلى ${DYNAMIC_ENVIRONMENT.noiseRobustness[1].accuracy}% عند 5%). ثالثاً، وقت تحسين BSO (${BSO_PARAMETERS.optimizationTime} ثانية) أعلى بكثير من PSO (${FEATURE_SELECTION_COMPARISON.PSO.time} ثانية) وGA (${FEATURE_SELECTION_COMPARISON.GA.time} ثانية). رابعاً، نتائج التصنيف متعدد الأصناف (5 أصناف) أقل بطبيعتها من نتائج التصنيف الثنائي في الأدبيات السابقة. اتجاهات البحث المستقبلية: تكامل التعلم العميق، أطر الكشف عبر الإنترنت/التدفق، والنشر على أجهزة الحافة.`}
                    />
                </TabsContent>
            </Tabs>

            {/* Footer */}
            <Card className="border border-dashed border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="py-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>
                            {t("All paragraphs use verified data from real_experiment.py — no fabricated values.",
                                "جميع الفقرات تستخدم بيانات موثقة من real_experiment.py — لا قيم ملفقة.",
                                "Tüm paragraflar real_experiment.py'den doğrulanmış veriler kullanır — uydurma değer yok.")}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
