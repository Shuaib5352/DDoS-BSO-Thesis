"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield, Cpu, GitGraph, BarChart3, FileText, TrendingUp,
  FlaskConical, Printer, GitBranch, AlertTriangle, Target,
  Grid3X3, Trophy, Gauge, Database, Zap, CheckCircle2,
  BookOpen, ChevronRight, ArrowRight, GraduationCap,
  Activity, Layers, Brain, Award, Clock, Calendar,
  Sparkles, BarChart2, Network, MessageCircleQuestion, Library, ScanSearch, Workflow, Sigma,
  PieChart, List,
} from "lucide-react"
import BSOVisualization from "@/components/bso-visualization"
import MLClassificationPanel from "@/components/ml-classification-panel"
import AlgorithmComparisonPanel from "@/components/algorithm-comparison-panel"
import PerformanceEvaluationPanel from "@/components/performance-evaluation-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import { DATASET_STATISTICS, MODEL_RESULTS, BSO_PARAMETERS, BSO_SELECTED_FEATURES } from "@/lib/ciciot2023-dataset"
import DetailedResultsPanel from "@/components/detailed-results-panel"
import BSOContributionAnalysis from "@/components/bso-contribution-analysis"
import ThesisResultsChapter from "@/components/thesis-results-chapter"
import FeatureImportanceAnalysis from "@/components/feature-importance-analysis"
import SystemArchitectureDiagram from "@/components/system-architecture-diagram"
import ErrorMisclassificationAnalysis from "@/components/error-misclassification-analysis"
import AblationStudy from "@/components/ablation-study"
import PrintExportPanel from "@/components/print-export-panel"
import ConfusionMatrixHeatmap from "@/components/confusion-matrix-heatmap"
import ModelRankingDashboard from "@/components/model-ranking-dashboard"
import LearningCurvesEfficiency from "@/components/learning-curves-efficiency"
import ThesisDefenseQA from "@/components/thesis-defense-qa"
import ThesisTables from "@/components/thesis-tables"
import FeatureSelectionAnalysis from "@/components/feature-selection-analysis"
import AcademicReferences from "@/components/academic-references"
import DDoSDetectionForm from "@/components/ddos-detection-form"
import PipelineDemo from "@/components/pipeline-demo"
import MathEquations from "@/components/math-equations"
import LiteratureComparison from "@/components/literature-comparison"
import DatasetEDA from "@/components/dataset-eda"
import StatisticalSignificance from "@/components/statistical-significance"
import ThesisWritingGuide from "@/components/thesis-writing-guide"
import GlossaryNotation from "@/components/glossary-notation"

/* ═══════════════════════════════════════════════════════════════
   Force Turkish language on mount
   ═══════════════════════════════════════════════════════════════ */
function useForceTurkish() {
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("ddos-app-language", "tr")
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = "tr"
      document.documentElement.dir = "ltr"
    }
  }, [])
}

/* ═══════════════════════════════════════════════════════════════
   Tab categories — Turkish only
   ═══════════════════════════════════════════════════════════════ */
const TAB_CATEGORIES = [
  {
    id: "overview",
    label: "Genel Bakış",
    tabs: [
      { value: "home", label: "Ana Sayfa", icon: BookOpen },
      { value: "thesis", label: "Tez Sonuçları", icon: FileText },
      { value: "architecture", label: "Sistem Mimarisi", icon: GitBranch },
      { value: "defense", label: "Savunma S&C", icon: MessageCircleQuestion },
      { value: "tables", label: "Tez Tabloları", icon: FileText },
      { value: "references", label: "Kaynakça", icon: Library },
      { value: "detection", label: "DDoS Tespit", icon: ScanSearch },
      { value: "pipeline", label: "Veri Süreci", icon: Workflow },
      { value: "equations", label: "Formüller", icon: Sigma },
    ],
  },
  {
    id: "analysis",
    label: "Analiz",
    tabs: [
      { value: "bso", label: "BSO Optimizasyonu", icon: GitGraph },
      { value: "features", label: "Öznitelik Analizi", icon: Target },
      { value: "feature-selection", label: "Öznitelik Seçimi", icon: CheckCircle2 },
      { value: "ablation", label: "Ablasyon Çalışması", icon: FlaskConical },
    ],
  },
  {
    id: "models",
    label: "Modeller",
    tabs: [
      { value: "ml", label: "ML Sınıflandırma", icon: Cpu },
      { value: "algorithms", label: "Algoritmalar", icon: BarChart3 },
      { value: "ranking", label: "Model Sıralaması", icon: Trophy },
    ],
  },
  {
    id: "evaluation",
    label: "Değerlendirme",
    tabs: [
      { value: "performance", label: "Performans", icon: TrendingUp },
      { value: "heatmap", label: "Karışıklık Matrisi", icon: Grid3X3 },
      { value: "errors", label: "Hata Analizi", icon: AlertTriangle },
      { value: "learning", label: "Öğrenme Eğrileri", icon: Gauge },
    ],
  },
  {
    id: "export",
    label: "Dışa Aktar",
    tabs: [
      { value: "export", label: "Yazdır / Dışa Aktar", icon: Printer },
    ],
  },
  {
    id: "thesis-tools",
    label: "Tez Araçları",
    tabs: [
      { value: "literature", label: "İlgili Çalışmalar", icon: BookOpen },
      { value: "dataset-eda", label: "Veri Keşfi", icon: PieChart },
      { value: "statistics", label: "İstatistiksel Testler", icon: BarChart2 },
      { value: "writing-guide", label: "Yazım Rehberi", icon: GraduationCap },
      { value: "glossary", label: "Semboller", icon: List },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════════
   Active tab color map
   ═══════════════════════════════════════════════════════════════ */
const TAB_COLORS: Record<string, string> = {
  home: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-700 data-[state=active]:to-slate-800 data-[state=active]:text-white data-[state=active]:shadow-lg",
  thesis: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  architecture: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  bso: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-sky-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  features: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  ablation: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  ml: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  algorithms: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-fuchsia-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  ranking: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  performance: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  heatmap: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-violet-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  errors: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  learning: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-lime-600 data-[state=active]:to-lime-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  export: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-stone-600 data-[state=active]:to-stone-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  defense: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-rose-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  tables: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-teal-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  references: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  "feature-selection": "data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  detection: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg",
  pipeline: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white data-[state=active]:shadow-lg",
  equations: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white data-[state=active]:shadow-lg",
  literature: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg",
  "dataset-eda": "data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg",
  statistics: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg",
  "writing-guide": "data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-lg",
  glossary: "data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg",
}

/* ═══════════════════════════════════════════════════════════════
   Hero metrics
   ═══════════════════════════════════════════════════════════════ */
const KEY_METRICS = [
  { label: "Doğruluk", value: `%${MODEL_RESULTS[0].accuracy}`, icon: CheckCircle2, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-950/40", ring: "ring-emerald-500/20" },
  { label: "F1-Makro", value: `%${MODEL_RESULTS[0].f1Macro}`, icon: Target, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50 dark:bg-blue-950/40", ring: "ring-blue-500/20" },
  { label: "AUC-ROC", value: `%${MODEL_RESULTS[0].aucRoc}`, icon: TrendingUp, gradient: "from-purple-500 to-violet-600", bg: "bg-purple-50 dark:bg-purple-950/40", ring: "ring-purple-500/20" },
  { label: "Öznitelikler", value: `${DATASET_STATISTICS.selectedFeatures}/${DATASET_STATISTICS.totalFeatures}`, icon: Zap, gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50 dark:bg-amber-950/40", ring: "ring-amber-500/20" },
  { label: "Toplam Örnek", value: DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR"), icon: Database, gradient: "from-indigo-500 to-blue-600", bg: "bg-indigo-50 dark:bg-indigo-950/40", ring: "ring-indigo-500/20" },
  { label: "Karşılaştırılan", value: "12 Model", icon: Cpu, gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50 dark:bg-rose-950/40", ring: "ring-rose-500/20" },
]

/* ═══════════════════════════════════════════════════════════════
   Pipeline steps
   ═══════════════════════════════════════════════════════════════ */
const PIPELINE_STEPS = [
  { label: "CICIoT2023 Veri Seti", detail: `${DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} örnek`, icon: Database, gradient: "from-blue-500 to-blue-600" },
  { label: "Ön İşleme & SMOTE", detail: "72.252 → 87.500 dengeli", icon: Layers, gradient: "from-purple-500 to-purple-600" },
  { label: "BSO Optimizasyonu", detail: `Pop=${BSO_PARAMETERS.populationSize}, İter=${BSO_PARAMETERS.maxIterations}`, icon: Brain, gradient: "from-emerald-500 to-emerald-600" },
  { label: "Öznitelik Seçimi", detail: `${DATASET_STATISTICS.totalFeatures} → ${DATASET_STATISTICS.selectedFeatures} (%${DATASET_STATISTICS.featureReductionPct})`, icon: Target, gradient: "from-amber-500 to-amber-600" },
  { label: "BSO-Hibrit RF", detail: `Doğruluk: %${MODEL_RESULTS[0].accuracy}`, icon: Award, gradient: "from-rose-500 to-rose-600" },
]

/* ═══════════════════════════════════════════════════════════════
   Research Timeline
   ═══════════════════════════════════════════════════════════════ */
const TIMELINE = [
  { month: "Eki 2025", phase: "Literatür Taraması", desc: "DDoS tespit yöntemleri ve meta-sezgisel optimizasyon tekniklerinin kapsamlı incelenmesi", icon: BookOpen, color: "bg-blue-500" },
  { month: "Kas 2025", phase: "Veri Seti Analizi", desc: "CICIoT2023 veri setinin incelenmesi, ön işleme stratejilerinin belirlenmesi", icon: Database, color: "bg-indigo-500" },
  { month: "Ara 2025", phase: "BSO Algoritması Tasarımı", desc: "Yarasa Sürüsü Optimizasyonu algoritmasının öznitelik seçimi için uyarlanması", icon: Brain, color: "bg-purple-500" },
  { month: "Oca 2026", phase: "Hibrit Çerçeve Geliştirme", desc: "BSO-RF hibrit çerçevesinin uygulanması ve entegrasyon testleri", icon: Layers, color: "bg-emerald-500" },
  { month: "Şub 2026", phase: "Deneysel Çalışmalar", desc: "12 model ile kapsamlı karşılaştırmalı deneyler ve istatistiksel testler", icon: FlaskConical, color: "bg-amber-500" },
  { month: "Mar 2026", phase: "Sonuç Analizi", desc: "Performans değerlendirmesi, ablasyon çalışması ve hata analizi", icon: BarChart2, color: "bg-teal-500" },
  { month: "Nis 2026", phase: "Doğrulama & Test", desc: "Çapraz doğrulama, istatistiksel anlamlılık testleri ve sonuçların doğrulanması", icon: CheckCircle2, color: "bg-cyan-500" },
  { month: "May-Haz 2026", phase: "Tez Yazımı", desc: "Tez metninin yazılması, diyagramlar ve görselleştirmelerin hazırlanması", icon: FileText, color: "bg-rose-500" },
]

/* ═══════════════════════════════════════════════════════════════
   Quick navigation
   ═══════════════════════════════════════════════════════════════ */
const QUICK_NAV = [
  { tab: "thesis", title: "Bölüm 4: Sonuçlar", desc: "Tüm tablo ve şekillerle tez sonuçları", icon: FileText, accent: "indigo" },
  { tab: "architecture", title: "Sistem Mimarisi", desc: "Dışa aktarılabilir SVG diyagramı", icon: GitBranch, accent: "violet" },
  { tab: "bso", title: "BSO Analizi", desc: "Yakınsama eğrileri ve optimizasyon", icon: GitGraph, accent: "sky" },
  { tab: "ranking", title: "Model Sıralaması", desc: "Bileşik puanlama karşılaştırması", icon: Trophy, accent: "amber" },
  { tab: "heatmap", title: "Karışıklık Matrisleri", desc: "12 model için ısı haritaları", icon: Grid3X3, accent: "purple" },
  { tab: "features", title: "Öznitelik Önemi", desc: "Öznitelik sıralaması ve analizi", icon: Target, accent: "blue" },
  { tab: "feature-selection", title: "Öznitelik Seçimi", desc: "BSO ile seçim analizi ve karşılaştırması", icon: CheckCircle2, accent: "emerald" },
  { tab: "errors", title: "Hata Analizi", desc: "Yanlış sınıflandırma kalıpları", icon: AlertTriangle, accent: "red" },
  { tab: "defense", title: "Savunma S&C", desc: "Tez savunma soru-cevap hazırlığı", icon: MessageCircleQuestion, accent: "rose" },
  { tab: "export", title: "Dışa Aktar", desc: "PDF, HTML, JSON, CSV formatları", icon: Printer, accent: "stone" },
  { tab: "references", title: "Kaynakça", desc: "60+ akademik referans — APA 7", icon: Library, accent: "teal" },
  { tab: "detection", title: "DDoS Tespit", desc: "Etkileşimli trafik analiz formu", icon: ScanSearch, accent: "red" },
  { tab: "pipeline", title: "Veri Süreci", desc: "Adım adım pipeline demo", icon: Workflow, accent: "violet" },
  { tab: "equations", title: "Formüller", desc: "24 temel matematiksel denklem", icon: Sigma, accent: "indigo" },
  { tab: "literature", title: "İlgili Çalışmalar", desc: "12 çalışma karşılaştırması", icon: BookOpen, accent: "emerald" },
  { tab: "dataset-eda", title: "Veri Keşfi", desc: "Keşifsel veri analizi (EDA)", icon: PieChart, accent: "sky" },
  { tab: "statistics", title: "İstatistiksel Testler", desc: "McNemar, Wilcoxon, Cohen's d", icon: BarChart2, accent: "purple" },
  { tab: "writing-guide", title: "Yazım Rehberi", desc: "5 bölüm tez yazım kılavuzu", icon: GraduationCap, accent: "amber" },
  { tab: "glossary", title: "Semboller", desc: "53 sembol ve kısaltma tablosu", icon: List, accent: "teal" },
]

const accentMap: Record<string, { border: string; bg: string; iconBg: string }> = {
  indigo: { border: "border-indigo-200 dark:border-indigo-800/40 hover:border-indigo-400 dark:hover:border-indigo-600", bg: "hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20", iconBg: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400" },
  violet: { border: "border-violet-200 dark:border-violet-800/40 hover:border-violet-400 dark:hover:border-violet-600", bg: "hover:bg-violet-50/50 dark:hover:bg-violet-950/20", iconBg: "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400" },
  sky: { border: "border-sky-200 dark:border-sky-800/40 hover:border-sky-400 dark:hover:border-sky-600", bg: "hover:bg-sky-50/50 dark:hover:bg-sky-950/20", iconBg: "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400" },
  amber: { border: "border-amber-200 dark:border-amber-800/40 hover:border-amber-400 dark:hover:border-amber-600", bg: "hover:bg-amber-50/50 dark:hover:bg-amber-950/20", iconBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400" },
  purple: { border: "border-purple-200 dark:border-purple-800/40 hover:border-purple-400 dark:hover:border-purple-600", bg: "hover:bg-purple-50/50 dark:hover:bg-purple-950/20", iconBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400" },
  blue: { border: "border-blue-200 dark:border-blue-800/40 hover:border-blue-400 dark:hover:border-blue-600", bg: "hover:bg-blue-50/50 dark:hover:bg-blue-950/20", iconBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" },
  red: { border: "border-red-200 dark:border-red-800/40 hover:border-red-400 dark:hover:border-red-600", bg: "hover:bg-red-50/50 dark:hover:bg-red-950/20", iconBg: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400" },
  stone: { border: "border-stone-200 dark:border-stone-800/40 hover:border-stone-400 dark:hover:border-stone-600", bg: "hover:bg-stone-50/50 dark:hover:bg-stone-950/20", iconBg: "bg-stone-100 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400" },
  rose: { border: "border-rose-200 dark:border-rose-800/40 hover:border-rose-400 dark:hover:border-rose-600", bg: "hover:bg-rose-50/50 dark:hover:bg-rose-950/20", iconBg: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400" },
  emerald: { border: "border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-400 dark:hover:border-emerald-600", bg: "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20", iconBg: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" },
  teal: { border: "border-teal-200 dark:border-teal-800/40 hover:border-teal-400 dark:hover:border-teal-600", bg: "hover:bg-teal-50/50 dark:hover:bg-teal-950/20", iconBg: "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400" },
}

export default function DDoSDetectionDashboard() {
  const [activeTab, setActiveTab] = useState("home")
  useForceTurkish()

  return (
    <div className="min-h-screen mesh-bg bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* ════════════════════ HEADER ════════════════════ */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 glass-card sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity" />
                <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate tracking-tight">
                  BSO-Hibrit RF ile Geliştirilmiş DDoS Tespiti
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Yüksek Lisans Tezi — SHUAIB AYAD JASIM — CICIoT2023
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 font-medium">
                  👨‍🎓 Danışman: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Dr. Saim Ervural</span> — KTO Karatay Üniversitesi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <ThemeToggle />
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] px-3 py-1.5 shadow-md shadow-emerald-500/20 font-semibold border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                %100 Gerçek Veri
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* ════════════════════ TABS ════════════════════ */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <div className="glass-card rounded-2xl p-3 shadow-sm space-y-1.5 border border-slate-200/60 dark:border-slate-700/60">
            {TAB_CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 font-bold px-2 py-1 min-w-[100px] hidden lg:inline-block">
                  {cat.label}
                </span>
                <TabsList className="h-auto p-0.5 bg-transparent gap-1">
                  {cat.tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${TAB_COLORS[tab.value] || ""}`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            ))}
          </div>

          {/* ════════════════════ ANA SAYFA ════════════════════ */}
          <TabsContent value="home" className="space-y-8 animate-fade-in">

            {/* ─── Hero Card ─── */}
            <Card className="border-0 overflow-hidden relative shadow-2xl shadow-indigo-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 animate-gradient-shift" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-80" />
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              <CardContent className="relative pt-10 pb-10 px-6 md:px-12">
                <div className="text-center space-y-5 max-w-4xl mx-auto">
                  <div className="flex justify-center animate-slide-up">
                    <Badge className="bg-white/15 backdrop-blur-md text-white border border-white/25 text-xs px-5 py-2 flex items-center gap-2 shadow-lg">
                      <GraduationCap className="w-4 h-4" />
                      Yüksek Lisans Tezi — 2025
                    </Badge>
                  </div>
                  <h2 className="text-xl md:text-3xl font-extrabold leading-relaxed text-white tracking-tight animate-slide-up-delay-1 drop-shadow-lg">
                    Dinamik Ağ Ortamlarında Yarasa Sürüsü Optimizasyonu ile Optimize Edilmiş Hibrit Makine Öğrenmesi Çerçevesi Kullanılarak DDoS Saldırılarının Geliştirilmiş Tespiti
                  </h2>
                  <div className="flex items-center justify-center gap-4 text-sm text-white/85 animate-slide-up-delay-2 flex-wrap">
                    <span className="font-bold text-white text-base">SHUAIB AYAD JASIM</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> CICIoT2023</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Ekim 2025 – Haziran 2026</span>
                  </div>
                  <div className="flex justify-center gap-8 pt-3 animate-slide-up-delay-3">
                    {[
                      { v: `%${MODEL_RESULTS[0].accuracy}`, l: "Doğruluk" },
                      { v: `%${MODEL_RESULTS[0].f1Macro}`, l: "F1-Makro" },
                      { v: `%${MODEL_RESULTS[0].aucRoc}`, l: "AUC-ROC" },
                    ].map((s) => (
                      <div key={s.l} className="text-center">
                        <div className="text-2xl md:text-3xl font-black text-white drop-shadow-md">{s.v}</div>
                        <div className="text-[11px] text-white/70 font-medium mt-0.5">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ─── Key Performance Metrics ─── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {KEY_METRICS.map((metric, i) => (
                <Card key={metric.label} className={`border-0 shadow-md card-hover-lift overflow-hidden ring-1 ${metric.ring} ${metric.bg} animate-slide-up`} style={{ animationDelay: `${i * 70}ms` }}>
                  <CardContent className="pt-5 pb-5 text-center relative">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.gradient}`} />
                    <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${metric.gradient} mb-3 shadow-md`}>
                      <metric.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{metric.value}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                      {metric.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ─── System Pipeline ─── */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
              <CardContent className="pt-7 pb-7">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-md">
                    <Network className="w-4 h-4 text-white" />
                  </div>
                  <span>Önerilen Sistem Hattı</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-3" />
                </h3>
                <div className="flex flex-col md:flex-row items-stretch gap-2">
                  {PIPELINE_STEPS.map((step, i) => (
                    <div key={step.label} className="flex-1 flex items-center gap-2 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800/50 shadow-sm card-hover-lift relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${step.gradient}`} />
                        <div className="pl-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${step.gradient} shadow-sm`}>
                              <step.icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{step.label}</div>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{step.detail}</div>
                        </div>
                      </div>
                      {i < PIPELINE_STEPS.length - 1 && (
                        <div className="hidden md:flex flex-col items-center">
                          <ArrowRight className="w-5 h-5 text-indigo-400 dark:text-indigo-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ─── Research Overview Row ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm card-hover-lift">
                <CardContent className="pt-6 pb-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    Araştırma Özeti
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Bu araştırma, dinamik ağ ortamlarında DDoS saldırılarının tespiti için Yarasa Sürüsü Optimizasyonu (BSO) tabanlı hibrit bir makine öğrenmesi çerçevesi önermektedir. Önerilen çerçeve, Rastgele Orman (RF) modeli için öznitelik seçimi ve hiper-parametre optimizasyonunu eş zamanlı olarak gerçekleştirmektedir.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { k: "Veri Seti", v: "CICIoT2023" },
                      { k: "Toplam Örnek", v: DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR") },
                      { k: "Saldırı Türleri", v: `${DATASET_STATISTICS.classes} sınıf` },
                      { k: "Seçilen Öznitelikler", v: `${DATASET_STATISTICS.selectedFeatures}/${DATASET_STATISTICS.totalFeatures}` },
                      { k: "Bölme Oranı", v: "70/10/20" },
                      { k: "Araştırma Süresi", v: "8 ay" },
                      { k: "Araştırma Dönemi", v: "Eki 2025 – Haz 2026" },
                    ].map((item) => (
                      <div key={item.k} className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs border border-slate-100 dark:border-slate-700/50">
                        <span className="text-slate-500 dark:text-slate-400">{item.k}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm card-hover-lift">
                <CardContent className="pt-6 pb-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    Temel Katkılar
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        title: "Ortak BSO Öznitelik Seçimi ve Hiper-Parametre Ayarı",
                        desc: `Öznitelikler ${DATASET_STATISTICS.totalFeatures}'ten ${DATASET_STATISTICS.selectedFeatures}'e düşürüldü (%${DATASET_STATISTICS.featureReductionPct} azalma) ve RF parametreleri eş zamanlı olarak optimize edildi.`,
                        icon: Target,
                      },
                      {
                        title: "SMOTE Sınıf Dengeleme",
                        desc: "Adil çok sınıflı DDoS tespiti için yalnızca eğitim setine SMOTE uygulandı (72.252 → 87.500 dengeli örnek).",
                        icon: Layers,
                      },
                      {
                        title: "Kapsamlı 12 Model Karşılaştırması",
                        desc: `BSO-Hibrit RF, %${MODEL_RESULTS[0].accuracy} doğruluk ve %${MODEL_RESULTS[0].f1Macro} F1-makro ile tüm temel modelleri geride bıraktı.`,
                        icon: Trophy,
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/40 dark:to-transparent border border-slate-100 dark:border-slate-700/40">
                        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md mt-0.5">
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ─── Selected Features ─── */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  BSO Tarafından Seçilen Öznitelikler
                  <Badge className="ml-2 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 text-[10px] border-0">{BSO_SELECTED_FEATURES.length} / {DATASET_STATISTICS.totalFeatures}</Badge>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-3" />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {BSO_SELECTED_FEATURES.map((f, i) => (
                    <Badge key={f.name} className="px-3 py-1.5 text-[11px] font-mono bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-indigo-500 dark:text-indigo-400 font-bold mr-1.5">{i + 1}.</span>
                      {f.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ─── Research Timeline ─── */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
              <CardContent className="pt-7 pb-7">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-md">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  Araştırma Zaman Çizelgesi (8 Ay)
                  <Badge className="ml-2 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 text-[10px] border-0">Ekim 2025 – Haziran 2026</Badge>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-3" />
                </h3>
                <div className="relative">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-rose-500 rounded-full hidden md:block" />
                  <div className="space-y-3">
                    {TIMELINE.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                        <div className="relative flex-shrink-0 hidden md:block">
                          <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-md z-10 relative`}>
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 group hover:shadow-md transition-all duration-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-[10px] font-bold border-0 px-2">{item.month}</Badge>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.phase}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ─── Quick Navigation ─── */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl shadow-md">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
                Hızlı Erişim
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-3" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {QUICK_NAV.map((nav, i) => {
                  const colors = accentMap[nav.accent] || accentMap.indigo
                  return (
                    <Card
                      key={nav.tab}
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveTab(nav.tab)}
                      onKeyDown={(e) => { if (e.key === "Enter") setActiveTab(nav.tab) }}
                      className={`cursor-pointer border ${colors.border} ${colors.bg} transition-all duration-300 card-hover-lift active:scale-[0.98] select-none animate-slide-up`}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl ${colors.iconBg} flex-shrink-0 shadow-sm`}>
                            <nav.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{nav.title}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{nav.desc}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* ─── BSO-Hybrid RF Summary ─── */}
            <Card className="border-0 overflow-hidden shadow-lg relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDcpIi8+PC9zdmc+')] opacity-60" />
              <CardContent className="relative pt-6 pb-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    En İyi Model: BSO-Hibrit RF — Nihai Sonuçlar
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {[
                    { k: "Doğruluk", v: `%${MODEL_RESULTS[0].accuracy}` },
                    { k: "Kesinlik", v: `%${MODEL_RESULTS[0].precision}` },
                    { k: "Duyarlılık", v: `%${MODEL_RESULTS[0].recall}` },
                    { k: "F1-Ağırlıklı", v: `%${MODEL_RESULTS[0].f1Score}` },
                    { k: "F1-Makro", v: `%${MODEL_RESULTS[0].f1Macro}` },
                    { k: "AUC-ROC", v: `%${MODEL_RESULTS[0].aucRoc}` },
                    { k: "MCC", v: `${MODEL_RESULTS[0].mcc}` },
                  ].map((m) => (
                    <div key={m.k} className="text-center p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-sm hover:bg-white/25 transition-colors">
                      <div className="text-lg font-black text-white drop-shadow-sm">{m.v}</div>
                      <div className="text-[10px] text-white/75 font-semibold mt-0.5">{m.k}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ─── Thesis Contributions ─── */}
            <Card className="border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-background to-orange-500/5 shadow-md">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  Tezin Katkıları
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent dark:from-amber-700 ml-3" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      num: "1",
                      title: "BSO-Hibrit RF Çerçevesi",
                      desc: "Yarasa Sürüsü Optimizasyonu ile eşzamanlı öznitelik seçimi ve hiper-parametre ayarlaması gerçekleştiren özgün hibrit çerçeve tasarımı.",
                      color: "from-emerald-500 to-teal-500",
                    },
                    {
                      num: "2",
                      title: "%51.3 Boyut Azaltma",
                      desc: "39 öznitelikten 19'a indirme ile hesaplama karmaşıklığını azaltırken yüksek performansı (%89.82) koruma.",
                      color: "from-blue-500 to-indigo-500",
                    },
                    {
                      num: "3",
                      title: "Azınlık Sınıf İyileştirmesi",
                      desc: "SMOTE entegrasyonu ile Backdoor_Malware F1-Skoru %28.40'dan %57.40'a yükseldi — %102 artış.",
                      color: "from-purple-500 to-violet-500",
                    },
                    {
                      num: "4",
                      title: "Kapsamlı Karşılaştırma",
                      desc: "12 makine öğrenmesi modeli ile istatistiksel olarak anlamlı performans değerlendirmesi (p < 0.05).",
                      color: "from-rose-500 to-pink-500",
                    },
                  ].map((c) => (
                    <div key={c.num} className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 border border-slate-200/60 dark:border-slate-700/40">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-black text-sm shadow-sm`}>
                        {c.num}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.title}</div>
                        <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ─── Methodology Summary ─── */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <CardContent className="pt-6 pb-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-md">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Metodoloji Özeti
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-3" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Veri Ön İşleme",
                      items: [
                        "Eksik ve tekrarlanan verilerin kaldırılması",
                        "Min-Max normalizasyonu [0, 1]",
                        "Tabakalı bölme: %70 eğitim, %10 doğrulama, %20 test",
                        "SMOTE: 72.252 → 87.500 dengeli eğitim verisi",
                      ],
                      gradient: "from-blue-500 to-indigo-500",
                    },
                    {
                      title: "BSO Optimizasyonu",
                      items: [
                        "Popülasyon boyutu: 25 yarasa",
                        "Maksimum iterasyon: 50",
                        `Arama uzayı: {0,1}^${DATASET_STATISTICS.totalFeatures} × ℝ⁴`,
                        "Uygunluk fonksiyonu: F1-makro skoru",
                      ],
                      gradient: "from-emerald-500 to-teal-500",
                    },
                    {
                      title: "Değerlendirme",
                      items: [
                        "10-katlı tabakalı çapraz doğrulama",
                        "Eşleştirilmiş t-testi (p < 0.05)",
                        "Cohen's d etki büyüklüğü analizi",
                        "12 model ile kapsamlı karşılaştırma",
                      ],
                      gradient: "from-purple-500 to-violet-500",
                    },
                  ].map((section) => (
                    <div key={section.title} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className={`bg-gradient-to-r ${section.gradient} px-4 py-2.5`}>
                        <h4 className="text-xs font-bold text-white">{section.title}</h4>
                      </div>
                      <div className="p-4 space-y-2">
                        {section.items.map((item, j) => (
                          <div key={j} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════════════════════ CONTENT TABS ════════════════════ */}
          <TabsContent value="thesis" className="space-y-6 animate-fade-in"><ThesisResultsChapter /></TabsContent>
          <TabsContent value="architecture" className="space-y-6 animate-fade-in"><SystemArchitectureDiagram /></TabsContent>
          <TabsContent value="bso" className="space-y-6 animate-fade-in"><BSOVisualization /></TabsContent>
          <TabsContent value="features" className="space-y-6 animate-fade-in"><FeatureImportanceAnalysis /></TabsContent>
          <TabsContent value="ablation" className="space-y-6 animate-fade-in"><AblationStudy /></TabsContent>
          <TabsContent value="ml" className="space-y-6 animate-fade-in"><MLClassificationPanel /></TabsContent>
          <TabsContent value="algorithms" className="space-y-6 animate-fade-in"><AlgorithmComparisonPanel /></TabsContent>
          <TabsContent value="ranking" className="space-y-6 animate-fade-in"><ModelRankingDashboard /></TabsContent>
          <TabsContent value="performance" className="space-y-6 animate-fade-in">
            <BSOContributionAnalysis />
            <PerformanceEvaluationPanel />
            <DetailedResultsPanel />
          </TabsContent>
          <TabsContent value="heatmap" className="space-y-6 animate-fade-in"><ConfusionMatrixHeatmap /></TabsContent>
          <TabsContent value="errors" className="space-y-6 animate-fade-in"><ErrorMisclassificationAnalysis /></TabsContent>
          <TabsContent value="learning" className="space-y-6 animate-fade-in"><LearningCurvesEfficiency /></TabsContent>
          <TabsContent value="defense" className="space-y-6 animate-fade-in"><ThesisDefenseQA /></TabsContent>
          <TabsContent value="tables" className="space-y-6 animate-fade-in"><ThesisTables /></TabsContent>
          <TabsContent value="feature-selection" className="space-y-6 animate-fade-in"><FeatureSelectionAnalysis /></TabsContent>
          <TabsContent value="references" className="space-y-6 animate-fade-in"><AcademicReferences /></TabsContent>
          <TabsContent value="detection" className="space-y-6 animate-fade-in"><DDoSDetectionForm /></TabsContent>
          <TabsContent value="pipeline" className="space-y-6 animate-fade-in"><PipelineDemo /></TabsContent>
          <TabsContent value="equations" className="space-y-6 animate-fade-in"><MathEquations /></TabsContent>
          <TabsContent value="literature" className="space-y-6 animate-fade-in"><LiteratureComparison /></TabsContent>
          <TabsContent value="dataset-eda" className="space-y-6 animate-fade-in"><DatasetEDA /></TabsContent>
          <TabsContent value="statistics" className="space-y-6 animate-fade-in"><StatisticalSignificance /></TabsContent>
          <TabsContent value="writing-guide" className="space-y-6 animate-fade-in"><ThesisWritingGuide /></TabsContent>
          <TabsContent value="glossary" className="space-y-6 animate-fade-in"><GlossaryNotation /></TabsContent>
          <TabsContent value="export" className="space-y-6 animate-fade-in"><PrintExportPanel /></TabsContent>
        </Tabs>

        {/* ════════════════════ FOOTER ════════════════════ */}
        <footer className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="text-center md:text-left space-y-1">
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                Yüksek Lisans Tezi — DDoS Saldırılarının Geliştirilmiş Tespiti
              </p>
              <p>Dinamik Ağ Ortamlarında BSO-Hibrit RF Çerçevesi</p>
            </div>
            <div className="text-center md:text-right space-y-1">
              <p className="flex items-center gap-2 justify-center md:justify-end">
                <Database className="w-3 h-3" /> CICIoT2023 | {DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} Örnek | {DATASET_STATISTICS.classes} Sınıf
              </p>
              <p className="flex items-center gap-2 justify-center md:justify-end">
                <Award className="w-3 h-3" /> BSO-RF: %{MODEL_RESULTS[0].accuracy} Doğruluk | {BSO_SELECTED_FEATURES.length}/{DATASET_STATISTICS.totalFeatures} Öznitelik | Araştırma: 8 Ay
              </p>
            </div>
          </div>
          <div className="text-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              &copy; 2025-2026 SHUAIB AYAD JASIM — Tüm hakları saklıdır
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
