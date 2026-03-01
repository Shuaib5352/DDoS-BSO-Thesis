"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Image, Download, Copy, CheckCircle2, Shield, Database,
    Brain, Target, Layers, GitGraph, BarChart3, Network,
    AlertTriangle, Zap, FileText, ArrowRight, ArrowDown,
    Activity, Cpu, FlaskConical, TrendingUp, Award, PieChart,
} from "lucide-react"
import { useState } from "react"
import {
    MODEL_RESULTS, DATASET_STATISTICS, BSO_PARAMETERS,
    BSO_SELECTED_FEATURES, CROSS_VALIDATION, BSO_RF_PER_CLASS,
    CICIOT2023_ATTACK_TYPES,
} from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   Clipboard helper
   ═══════════════════════════════════════════════════════════════ */
function useCopy() {
    const [copied, setCopied] = useState<string | null>(null)
    const copy = (id: string, text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }
    return { copied, copy }
}

/* ═══════════════════════════════════════════════════════════════
   FIGURE DEFINITIONS — All figures for the thesis
   ═══════════════════════════════════════════════════════════════ */
const THESIS_FIGURES = [
    // ────────────────── BÖLÜM 1 ──────────────────
    {
        id: "sekil-1-1",
        chapter: 1,
        number: "Şekil 1.1",
        title: "DDoS Saldırı Türlerinin Taksonomisi",
        titleEn: "Taxonomy of DDoS Attack Types",
        description: "DDoS saldırılarının hacimsel, protokol ve uygulama katmanı saldırıları olarak sınıflandırılması. Bu tezde CICIoT2023 veri setinden 4 DDoS türü kullanılmıştır.",
        source: "Zargar, S.T., Joshi, J., Tipper, D. (2013). A Survey of Defense Mechanisms Against DDoS Attacks. IEEE Communications Surveys & Tutorials, 15(4), 2046–2069.",
        type: "taxonomy",
    },
    {
        id: "sekil-1-2",
        chapter: 1,
        number: "Şekil 1.2",
        title: "IoT Ağ Mimarisi ve DDoS Saldırı Vektörleri",
        titleEn: "IoT Network Architecture and DDoS Attack Vectors",
        description: "IoT cihazlarından oluşan botnet ağının DDoS saldırısı gerçekleştirme senaryosu. Algılama katmanı, ağ katmanı ve uygulama katmanı gösterilmektedir.",
        source: "Kolias, C., Kambourakis, G., Stavrou, A., Voas, J. (2017). DDoS in the IoT: Mirai and Other Botnets. IEEE Computer, 50(7), 80–84.",
        type: "architecture",
    },
    {
        id: "sekil-1-3",
        chapter: 1,
        number: "Şekil 1.3",
        title: "Makine Öğrenmesi Tabanlı Ağ Saldırı Tespit Sistemi (IDS) Genel Yapısı",
        titleEn: "General Structure of ML-Based Network Intrusion Detection System",
        description: "Ağ trafiği yakalama, özellik çıkarma, model eğitimi ve gerçek zamanlı tespit aşamalarını içeren genel IDS mimarisi.",
        source: "Buczak, A.L., Guven, E. (2016). A Survey of Data Mining and Machine Learning Methods for Cyber Security Intrusion Detection. IEEE Communications Surveys & Tutorials, 18(2), 1153–1176.",
        type: "architecture",
    },
    // ────────────────── BÖLÜM 2 ──────────────────
    {
        id: "sekil-2-1",
        chapter: 2,
        number: "Şekil 2.1",
        title: "Meta-Sezgisel Optimizasyon Algoritmalarının Sınıflandırması",
        titleEn: "Classification of Metaheuristic Optimization Algorithms",
        description: "Sürü zekası (BSO, PSO, ACO), evrimsel algoritmalar (GA, DE) ve fizik tabanlı algoritmalar (SA, GWO) olarak meta-sezgisel yöntemlerin taksonomisi.",
        source: "Yang, X.S. (2010). Nature-Inspired Metaheuristic Algorithms. 2nd Edition. Luniver Press.",
        type: "taxonomy",
    },
    {
        id: "sekil-2-2",
        chapter: 2,
        number: "Şekil 2.2",
        title: "Yarasa Algoritmasının Biyolojik İlham Kaynağı — Ekolokasyon",
        titleEn: "Biological Inspiration of Bat Algorithm — Echolocation",
        description: "Micro-yarasaların ekolokasyon mekanizması: frekans ayarlama, darbe oranı ve gürültü parametreleri ile avlanma davranışı. BSO algoritmasının temelini oluşturur.",
        source: "Yang, X.S. (2010). A New Metaheuristic Bat-Inspired Algorithm. In: Nature Inspired Cooperative Strategies for Optimization (NICSO 2010). Springer, 65–74.",
        type: "biological",
    },
    {
        id: "sekil-2-3",
        chapter: 2,
        number: "Şekil 2.3",
        title: "İlgili Çalışmaların Karşılaştırmalı Analizi",
        titleEn: "Comparative Analysis of Related Works",
        description: "Literatürdeki DDoS tespiti için meta-sezgisel tabanlı yaklaşımların veri seti, özellik seçimi yöntemi, sınıflandırıcı ve performans açısından karşılaştırması.",
        source: "Bu tez kapsamında hazırlanmıştır. Kaynak çalışmalar: Tablo 2.1'de listelenmiştir.",
        type: "comparison",
    },
    // ────────────────── BÖLÜM 3 ──────────────────
    {
        id: "sekil-3-1",
        chapter: 3,
        number: "Şekil 3.1",
        title: "Önerilen BSO-Hybrid RF Sistem Mimarisi",
        titleEn: "Proposed BSO-Hybrid RF System Architecture",
        description: "Veri toplama → ön işleme → SMOTE dengeleme → BSO optimizasyonu (eşzamanlı FS + HP) → RF sınıflandırma → değerlendirme aşamalarını içeren kapsamlı sistem mimarisi.",
        source: "Bu tez kapsamında tasarlanmıştır.",
        type: "system",
    },
    {
        id: "sekil-3-2",
        chapter: 3,
        number: "Şekil 3.2",
        title: "BSO Algoritması Sözde Kodu ve Akış Diyagramı",
        titleEn: "BSO Algorithm Pseudocode and Flowchart",
        description: "Başlatma → frekans güncelleme → hız ve konum güncelleme → yerel arama → gürültü ve darbe oranı güncelleme → yakınsama kontrolü döngüsünü gösteren akış diyagramı.",
        source: "Yang, X.S. (2010). Bat algorithm. Uyarlanmış versiyon — özellik seçimi ve HP optimizasyonu için genişletilmiştir.",
        type: "flowchart",
    },
    {
        id: "sekil-3-3",
        chapter: 3,
        number: "Şekil 3.3",
        title: "BSO Çözüm Vektörü Kodlama Yapısı",
        titleEn: "BSO Solution Vector Encoding Structure",
        description: "Her yarasa bireyinin çözüm vektörü: [x₁, x₂, ..., x₃₉ | n_estimators, max_depth, min_samples_split, max_features]. İlk 39 bit ikili (özellik seçimi), son 4 sürekli (HP).",
        source: "Bu tez kapsamında tasarlanmıştır.",
        type: "encoding",
    },
    {
        id: "sekil-3-4",
        chapter: 3,
        number: "Şekil 3.4",
        title: "SMOTE Aşırı Örnekleme Süreci",
        titleEn: "SMOTE Oversampling Process",
        description: "Azınlık sınıfı (Backdoor_Malware: 2.252 örnek) için sentetik örneklerin k-NN yöntemiyle üretilmesi. Eğitim seti: 72.252 → 87.500 dengeli örnek.",
        source: "Chawla, N.V., Bowyer, K.W., Hall, L.O., Kegelmeyer, W.P. (2002). SMOTE: Synthetic Minority Over-sampling Technique. JAIR, 16, 321–357.",
        type: "process",
    },
    {
        id: "sekil-3-5",
        chapter: 3,
        number: "Şekil 3.5",
        title: "10-Katlı Tabakalı Çapraz Doğrulama Diyagramı",
        titleEn: "10-Fold Stratified Cross-Validation Diagram",
        description: "Veri setinin 10 eşit katmana bölünmesi, her iterasyonda 9 katman eğitim ve 1 katman test olarak kullanılması. Sınıf oranları her katmanda korunur.",
        source: "Kohavi, R. (1995). A Study of Cross-Validation and Bootstrap for Accuracy Estimation. IJCAI, 14(2), 1137–1145.",
        type: "validation",
    },
    {
        id: "sekil-3-6",
        chapter: 3,
        number: "Şekil 3.6",
        title: "S1–S4 Deney Senaryoları Tasarımı",
        titleEn: "S1–S4 Experiment Scenarios Design",
        description: "S1 (baseline) → S2 (+ BSO FS) → S3 (+ BSO HP) → S4 (tam model). Her adımda yalnızca bir bileşen eklenerek sistematik ablasyon yaklaşımı.",
        source: "Bu tez kapsamında tasarlanmıştır.",
        type: "experiment",
    },
    // ────────────────── BÖLÜM 4 ──────────────────
    {
        id: "sekil-4-1",
        chapter: 4,
        number: "Şekil 4.1",
        title: "CICIoT2023 Veri Seti Sınıf Dağılımı",
        titleEn: "CICIoT2023 Dataset Class Distribution",
        description: "5 sınıfın dağılımı: DDoS-ACK_Fragmentation (53.148), DDoS-SYN_Flood (25.169), BenignTraffic (22.735), PortScan (15.162), Backdoor_Malware (2.252). Belirgin sınıf dengesizliği.",
        source: "Neto, E.C.P., et al. (2023). CICIoT2023: A Real-Time Dataset and Benchmark for Large-Scale Attacks in IoT Environment. Sensors, 23(13), 5941.",
        type: "distribution",
    },
    {
        id: "sekil-4-2",
        chapter: 4,
        number: "Şekil 4.2",
        title: "BSO Yakınsama Eğrisi (50 İterasyon)",
        titleEn: "BSO Convergence Curve (50 Iterations)",
        description: "25 yarasa × 50 iterasyon boyunca en iyi uygunluk (fitness) değerinin değişimi. Erken yakınsama (~15. iterasyon) ve ince ayar aşaması görülmektedir.",
        source: "Bu tez kapsamında deneysel olarak elde edilmiştir.",
        type: "convergence",
    },
    {
        id: "sekil-4-3",
        chapter: 4,
        number: "Şekil 4.3",
        title: "BSO Tarafından Seçilen 19 Özelliğin Önem Sıralaması",
        titleEn: "Feature Importance Ranking of 19 BSO-Selected Features",
        description: "Random Forest feature_importances_ ile hesaplanan Gini önem değerleri. En önemli: Header_Length, Tot Fwd Pkts, Protocol.",
        source: "Bu tez kapsamında deneysel olarak elde edilmiştir.",
        type: "ranking",
    },
    {
        id: "sekil-4-4",
        chapter: 4,
        number: "Şekil 4.4",
        title: "12 Model Performans Karşılaştırması (Doğruluk ve F1-Macro)",
        titleEn: "12 Model Performance Comparison (Accuracy and F1-Macro)",
        description: "BSO-Hybrid RF dahil 12 makine öğrenmesi modelinin doğruluk ve F1-Macro değerlerinin çubuk grafik karşılaştırması.",
        source: "Bu tez kapsamında deneysel olarak elde edilmiştir.",
        type: "comparison",
    },
    {
        id: "sekil-4-5",
        chapter: 4,
        number: "Şekil 4.5",
        title: "BSO-Hybrid RF Karışıklık Matrisi Isı Haritası",
        titleEn: "BSO-Hybrid RF Confusion Matrix Heatmap",
        description: "5×5 karışıklık matrisi: DDoS-ACK ve DDoS-SYN mükemmel tespit, Backdoor_Malware ve BenignTraffic arasında kısmi karışıklık.",
        source: "Bu tez kapsamında deneysel olarak elde edilmiştir.",
        type: "heatmap",
    },
    {
        id: "sekil-4-6",
        chapter: 4,
        number: "Şekil 4.6",
        title: "ROC Eğrileri — BSO-Hybrid RF ve Seçili Modeller",
        titleEn: "ROC Curves — BSO-Hybrid RF and Selected Models",
        description: "One-vs-Rest ROC eğrileri. BSO-Hybrid RF AUC = 0.9838, XGBoost AUC = 0.9881, RF AUC = 0.9844.",
        source: "Bu tez kapsamında deneysel olarak elde edilmiştir.",
        type: "roc",
    },
    {
        id: "sekil-4-7",
        chapter: 4,
        number: "Şekil 4.7",
        title: "S1–S4 Ablasyon Çalışması Sonuçları",
        titleEn: "S1–S4 Ablation Study Results",
        description: "4 senaryo boyunca Doğruluk, F1-Macro ve AUC-ROC değerlerinin karşılaştırmalı çubuk grafiği. S4 (tam model) en iyi genel performans.",
        source: "Bu tez kapsamında deneysel olarak elde edilmiştir.",
        type: "ablation",
    },
    {
        id: "sekil-4-8",
        chapter: 4,
        number: "Şekil 4.8",
        title: "10-Katlı Çapraz Doğrulama Sonuçları",
        titleEn: "10-Fold Cross-Validation Results",
        description: "Her kat için doğruluk ve F1-Skor değerleri. Ortalama: %90.98 ± 0.194 — düşük varyans yüksek kararlılık gösterir.",
        source: "Bu tez kapsamında deneysel olarak elde edilmiştir.",
        type: "cv",
    },
]

/* ═══════════════════════════════════════════════════════════════
   Figure type icon mapping
   ═══════════════════════════════════════════════════════════════ */
const figureTypeConfig: Record<string, { icon: typeof Shield; color: string; bg: string }> = {
    taxonomy: { icon: GitGraph, color: "text-blue-600", bg: "bg-blue-500/10" },
    architecture: { icon: Network, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    biological: { icon: Brain, color: "text-purple-600", bg: "bg-purple-500/10" },
    comparison: { icon: BarChart3, color: "text-teal-600", bg: "bg-teal-500/10" },
    system: { icon: Cpu, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    flowchart: { icon: Activity, color: "text-sky-600", bg: "bg-sky-500/10" },
    encoding: { icon: Zap, color: "text-amber-600", bg: "bg-amber-500/10" },
    process: { icon: Layers, color: "text-rose-600", bg: "bg-rose-500/10" },
    validation: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-500/10" },
    experiment: { icon: FlaskConical, color: "text-orange-600", bg: "bg-orange-500/10" },
    distribution: { icon: PieChart, color: "text-cyan-600", bg: "bg-cyan-500/10" },
    convergence: { icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-500/10" },
    ranking: { icon: Award, color: "text-yellow-600", bg: "bg-yellow-500/10" },
    heatmap: { icon: Target, color: "text-red-600", bg: "bg-red-500/10" },
    roc: { icon: TrendingUp, color: "text-fuchsia-600", bg: "bg-fuchsia-500/10" },
    ablation: { icon: FlaskConical, color: "text-orange-600", bg: "bg-orange-500/10" },
    cv: { icon: GitGraph, color: "text-blue-600", bg: "bg-blue-500/10" },
}

/* ═══════════════════════════════════════════════════════════════
   SVG Renderers for each figure type
   ═══════════════════════════════════════════════════════════════ */

function DDoSTaxonomySVG() {
    return (
        <svg viewBox="0 0 800 400" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#dc2626" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
                <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#22c55e" /></linearGradient>
                <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
            </defs>
            {/* Root */}
            <rect x="280" y="10" width="240" height="50" rx="12" fill="url(#grad1)" />
            <text x="400" y="38" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">DDoS Saldırı Türleri</text>
            {/* Lines */}
            <line x1="400" y1="60" x2="400" y2="90" stroke="#94a3b8" strokeWidth="2" />
            <line x1="130" y1="90" x2="670" y2="90" stroke="#94a3b8" strokeWidth="2" />
            <line x1="130" y1="90" x2="130" y2="115" stroke="#94a3b8" strokeWidth="2" />
            <line x1="400" y1="90" x2="400" y2="115" stroke="#94a3b8" strokeWidth="2" />
            <line x1="670" y1="90" x2="670" y2="115" stroke="#94a3b8" strokeWidth="2" />
            {/* Level 2 */}
            <rect x="30" y="115" width="200" height="45" rx="10" fill="url(#grad2)" />
            <text x="130" y="142" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">Hacimsel Saldırılar</text>
            <rect x="300" y="115" width="200" height="45" rx="10" fill="url(#grad3)" />
            <text x="400" y="142" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">Protokol Saldırıları</text>
            <rect x="570" y="115" width="200" height="45" rx="10" fill="url(#grad4)" />
            <text x="670" y="142" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">Uygulama Katmanı</text>
            {/* Level 3 — Volumetric */}
            <line x1="130" y1="160" x2="130" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="60" y1="185" x2="200" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            {[{ x: 60, t: "UDP Flood" }, { x: 130, t: "ICMP Flood" }, { x: 200, t: "DNS Amplif." }].map((b) => (
                <g key={b.t}>
                    <line x1={b.x} y1="185" x2={b.x} y2="200" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x={b.x - 50} y="200" width="100" height="32" rx="6" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" />
                    <text x={b.x} y="220" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="600">{b.t}</text>
                </g>
            ))}
            {/* Level 3 — Protocol */}
            <line x1="400" y1="160" x2="400" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="330" y1="185" x2="470" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            {[{ x: 330, t: "SYN Flood ✓" }, { x: 400, t: "ACK Frag. ✓" }, { x: 470, t: "Smurf" }].map((b) => (
                <g key={b.t}>
                    <line x1={b.x} y1="185" x2={b.x} y2="200" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x={b.x - 50} y="200" width="100" height="32" rx="6" fill={b.t.includes("✓") ? "#d1fae5" : "#f0fdf4"} stroke={b.t.includes("✓") ? "#34d399" : "#86efac"} strokeWidth="1.5" />
                    <text x={b.x} y="220" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="600">{b.t}</text>
                </g>
            ))}
            {/* Level 3 — Application */}
            <line x1="670" y1="160" x2="670" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="600" y1="185" x2="740" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            {[{ x: 600, t: "HTTP Flood" }, { x: 670, t: "Slowloris" }, { x: 740, t: "DNS Query" }].map((b) => (
                <g key={b.t}>
                    <line x1={b.x} y1="185" x2={b.x} y2="200" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x={b.x - 50} y="200" width="100" height="32" rx="6" fill="#f3e8ff" stroke="#c084fc" strokeWidth="1" />
                    <text x={b.x} y="220" textAnchor="middle" fill="#581c87" fontSize="10" fontWeight="600">{b.t}</text>
                </g>
            ))}
            {/* CICIoT2023 Box */}
            <rect x="200" y="270" width="400" height="50" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 3" />
            <text x="400" y="290" textAnchor="middle" fill="#1e40af" fontWeight="bold" fontSize="12">Bu Tezde Kullanılan (CICIoT2023):</text>
            <text x="400" y="308" textAnchor="middle" fill="#1e40af" fontSize="11">ACK_Fragmentation, SYN_Flood, Backdoor_Malware, BenignTraffic, PortScan</text>
            {/* Legend */}
            <rect x="250" y="340" width="12" height="12" rx="2" fill="#d1fae5" stroke="#34d399" strokeWidth="1.5" />
            <text x="268" y="351" fill="#065f46" fontSize="10">= Bu tezde kullanılan saldırı türleri</text>
        </svg>
    )
}

function SystemArchitectureSVG() {
    const steps = [
        { y: 10, label: "CICIoT2023 Veri Seti", sub: "118.466 örnek, 39 özellik, 5 sınıf", color: "#3b82f6", icon: "📊" },
        { y: 70, label: "Ön İşleme", sub: "Min-Max [0,1], eksik veri kontrolü, normalizasyon", color: "#6366f1", icon: "🔧" },
        { y: 130, label: "Veri Bölme (70/10/20)", sub: "Eğitim: 72.252 | Doğrulama: 10.322 | Test: 20.644", color: "#8b5cf6", icon: "✂️" },
        { y: 190, label: "SMOTE Dengeleme (Yalnız Eğitim)", sub: "72.252 → 87.500 dengeli örnek", color: "#a855f7", icon: "⚖️" },
        { y: 250, label: "BSO Optimizasyonu (25 yarasa × 50 iter.)", sub: "Eşzamanlı: Özellik Seçimi (39→19) + HP Ayarlama", color: "#059669", icon: "🦇" },
        { y: 310, label: "BSO-Hybrid RF Sınıflandırıcı", sub: "n_est=266, max_depth=20, min_split=7, max_feat=0.469", color: "#0d9488", icon: "🌲" },
        { y: 370, label: "Değerlendirme ve Doğrulama", sub: "7 metrik + 10-katlı CV + İstatistiksel testler + 12 model", color: "#dc2626", icon: "📈" },
    ]
    return (
        <svg viewBox="0 0 700 440" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {steps.map((step, i) => (
                <g key={i}>
                    {i > 0 && <line x1="350" y1={step.y - 8} x2="350" y2={step.y + 2} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />}
                    <rect x="50" y={step.y} width="600" height="48" rx="10" fill={step.color} fillOpacity="0.08" stroke={step.color} strokeWidth="1.5" />
                    <circle cx="80" cy={step.y + 24} r="15" fill={step.color} fillOpacity="0.15" />
                    <text x="80" y={step.y + 29} textAnchor="middle" fontSize="14">{step.icon}</text>
                    <text x="108" y={step.y + 19} fill={step.color} fontSize="13" fontWeight="bold">{step.label}</text>
                    <text x="108" y={step.y + 37} fill="#64748b" fontSize="10.5">{step.sub}</text>
                    <rect x="610" y={step.y + 10} width="28" height="28" rx="6" fill={step.color} fillOpacity="0.15" />
                    <text x="624" y={step.y + 29} textAnchor="middle" fill={step.color} fontSize="11" fontWeight="bold">{i + 1}</text>
                </g>
            ))}
            <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                </marker>
            </defs>
        </svg>
    )
}

function BSOFlowchartSVG() {
    const nodes = [
        { y: 5, w: 250, label: "Başlat: Popülasyonu Rastgele Oluştur", type: "start", color: "#3b82f6" },
        { y: 65, w: 340, label: "Her Yarasa İçin Uygunluk Hesapla: f(x)=1-F1+α·(n/N)", type: "process", color: "#8b5cf6" },
        { y: 125, w: 250, label: "Frekans ve Hız Güncelle", type: "process", color: "#6366f1" },
        { y: 185, w: 300, label: "Konum Güncelle: x_i(t+1) = x_i(t) + v_i(t)", type: "process", color: "#6366f1" },
        { y: 245, w: 220, label: "rand > r_i ?", type: "decision", color: "#f59e0b" },
        { y: 305, w: 300, label: "Yerel Arama: En İyi Çözüm Etrafında Keşif", type: "process", color: "#059669" },
        { y: 365, w: 250, label: "f(x_new) < f(x_old) ve rand < A_i ?", type: "decision", color: "#f59e0b" },
        { y: 425, w: 300, label: "Çözümü Kabul Et, Gürültü ↓ Darbe Oranı ↑", type: "process", color: "#059669" },
        { y: 485, w: 250, label: "Durdurma Kriteri Sağlandı mı?", type: "decision", color: "#dc2626" },
        { y: 545, w: 300, label: "En İyi Çözümü Döndür: 19 Özellik + 4 HP", type: "end", color: "#059669" },
    ]
    return (
        <svg viewBox="0 0 600 590" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {nodes.map((n, i) => {
                const cx = 300, rx = n.w / 2
                return (
                    <g key={i}>
                        {i > 0 && <line x1="300" y1={n.y - 8} x2="300" y2={n.y + 2} stroke="#94a3b8" strokeWidth="1.5" />}
                        {n.type === "decision" ? (
                            <g>
                                <polygon points={`${cx},${n.y + 2} ${cx + rx},${n.y + 22} ${cx},${n.y + 42} ${cx - rx},${n.y + 22}`} fill={n.color} fillOpacity="0.1" stroke={n.color} strokeWidth="1.5" />
                                <text x={cx} y={n.y + 26} textAnchor="middle" fill={n.color} fontSize="10.5" fontWeight="600">{n.label}</text>
                                {/* Evet / Hayır labels */}
                                <text x={cx + rx + 10} y={n.y + 26} fill="#059669" fontSize="9" fontWeight="bold">Evet ↓</text>
                                <text x={cx - rx - 35} y={n.y + 26} fill="#dc2626" fontSize="9" fontWeight="bold">Hayır</text>
                            </g>
                        ) : (
                            <g>
                                <rect x={cx - rx} y={n.y} width={n.w} height="40" rx={n.type === "start" || n.type === "end" ? 20 : 8} fill={n.color} fillOpacity="0.08" stroke={n.color} strokeWidth="1.5" />
                                <text x={cx} y={n.y + 24} textAnchor="middle" fill={n.color} fontSize="10.5" fontWeight="600">{n.label}</text>
                            </g>
                        )}
                    </g>
                )
            })}
        </svg>
    )
}

function SMOTEProcessSVG() {
    const classes = CICIOT2023_ATTACK_TYPES.map((a) => ({
        name: a.name.replace("DDoS-", ""),
        before: a.trainingSamples,
        after: a.smoteSamples,
        color: a.color,
    }))
    return (
        <svg viewBox="0 0 750 350" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="375" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">SMOTE Aşırı Örnekleme — Eğitim Seti Dengeleme</text>
            {/* Before SMOTE */}
            <text x="180" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748b">SMOTE Öncesi (72.252)</text>
            {classes.map((c, i) => {
                const maxH = 170, h = (c.before / 40000) * maxH, y = 230 - h
                return (
                    <g key={c.name}>
                        <rect x={60 + i * 55} y={y} width="40" height={h} rx="4" fill={c.color} fillOpacity="0.7" />
                        <text x={80 + i * 55} y="248" textAnchor="middle" fontSize="7" fill="#475569" transform={`rotate(-30, ${80 + i * 55}, 248)`}>{c.name}</text>
                        <text x={80 + i * 55} y={y - 5} textAnchor="middle" fontSize="8" fill={c.color} fontWeight="bold">{(c.before / 1000).toFixed(1)}k</text>
                    </g>
                )
            })}
            {/* Arrow */}
            <text x="375" y="155" textAnchor="middle" fontSize="30">→</text>
            <text x="375" y="175" textAnchor="middle" fontSize="10" fill="#059669" fontWeight="bold">SMOTE k-NN</text>
            {/* After SMOTE */}
            <text x="575" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748b">SMOTE Sonrası (87.500)</text>
            {classes.map((c, i) => {
                const maxH = 170, h = (c.after / 40000) * maxH, y = 230 - h
                return (
                    <g key={`after-${c.name}`}>
                        <rect x={455 + i * 55} y={y} width="40" height={h} rx="4" fill={c.color} />
                        <text x={475 + i * 55} y="248" textAnchor="middle" fontSize="7" fill="#475569" transform={`rotate(-30, ${475 + i * 55}, 248)`}>{c.name}</text>
                        <text x={475 + i * 55} y={y - 5} textAnchor="middle" fontSize="8" fill={c.color} fontWeight="bold">17.5k</text>
                    </g>
                )
            })}
            {/* Key insight */}
            <rect x="100" y="275" width="550" height="55" rx="10" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1.5" />
            <text x="375" y="298" textAnchor="middle" fontSize="11" fill="#065f46" fontWeight="bold">Kritik Etki: Backdoor_Malware 2.252 → 17.500 (×7.8 artış)</text>
            <text x="375" y="318" textAnchor="middle" fontSize="10" fill="#065f46">F1-Skor: %28.40 (SMOTE yok) → %57.40 (SMOTE ile) — %102 iyileşme</text>
        </svg>
    )
}

function CVDiagramSVG() {
    const folds = Array.from({ length: 10 }, (_, i) => i + 1)
    return (
        <svg viewBox="0 0 700 330" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="350" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">10-Katlı Tabakalı Çapraz Doğrulama</text>
            {folds.map((f, i) => {
                const y = 42 + i * 26
                return (
                    <g key={f}>
                        <text x="30" y={y + 14} fontSize="10" fill="#64748b" fontWeight="bold">K{f}</text>
                        {folds.map((_, j) => {
                            const isTest = j === i
                            return (
                                <rect key={j} x={55 + j * 56} y={y} width="50" height="20" rx="3"
                                    fill={isTest ? "#3b82f6" : "#e2e8f0"}
                                    stroke={isTest ? "#2563eb" : "#cbd5e1"}
                                    strokeWidth="1" />
                            )
                        })}
                        <text x="625" y={y + 14} fontSize="9" fill="#64748b">
                            {CROSS_VALIDATION.results[i] ? `%${CROSS_VALIDATION.results[i].accuracy}` : ""}
                        </text>
                    </g>
                )
            })}
            {/* Legend */}
            <rect x="180" y="305" width="16" height="12" rx="2" fill="#3b82f6" />
            <text x="202" y="315" fontSize="10" fill="#1e293b">Test Katmanı</text>
            <rect x="290" y="305" width="16" height="12" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <text x="312" y="315" fontSize="10" fill="#1e293b">Eğitim Katmanı</text>
            <text x="430" y="315" fontSize="10" fill="#059669" fontWeight="bold">Ort: %{CROSS_VALIDATION.mean.accuracy} ± {CROSS_VALIDATION.std.accuracy}</text>
        </svg>
    )
}

function ExperimentDesignSVG() {
    const scenarios = [
        { id: "S1", label: "Temel Model", fs: "✗ (39 özellik)", hp: "✗ (Varsayılan)", smote: "✗", acc: "87.04%", f1: "78.57%", color: "#6b7280" },
        { id: "S2", label: "+ BSO Özellik Seçimi", fs: "✓ (19 özellik)", hp: "✗ (Varsayılan)", smote: "✓", acc: "88.47%", f1: "82.35%", color: "#3b82f6" },
        { id: "S3", label: "+ BSO HP Optimizasyonu", fs: "✗ (39 özellik)", hp: "✓ (Optimized)", smote: "✓", acc: "89.74%", f1: "84.13%", color: "#f59e0b" },
        { id: "S4", label: "Tam BSO-Hybrid RF", fs: "✓ (19 özellik)", hp: "✓ (Optimized)", smote: "✓", acc: "89.82%", f1: "84.24%", color: "#22c55e" },
    ]
    return (
        <svg viewBox="0 0 750 280" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="375" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">S1–S4 Deney Senaryoları Tasarımı</text>
            {scenarios.map((s, i) => {
                const y = 40 + i * 55
                return (
                    <g key={s.id}>
                        {i > 0 && (
                            <g>
                                <line x1="375" y1={y - 12} x2="375" y2={y + 2} stroke="#94a3b8" strokeWidth="1.5" />
                                <polygon points={`375,${y + 2} 370,${y - 5} 380,${y - 5}`} fill="#94a3b8" />
                            </g>
                        )}
                        <rect x="30" y={y} width="690" height="42" rx="8" fill={s.color} fillOpacity="0.06" stroke={s.color} strokeWidth="1.5" />
                        <circle cx="58" cy={y + 21} r="14" fill={s.color} fillOpacity="0.2" />
                        <text x="58" y={y + 25} textAnchor="middle" fill={s.color} fontSize="11" fontWeight="bold">{s.id}</text>
                        <text x="90" y={y + 17} fill={s.color} fontSize="11" fontWeight="bold">{s.label}</text>
                        <text x="90" y={y + 34} fill="#64748b" fontSize="9">FS: {s.fs} | HP: {s.hp} | SMOTE: {s.smote}</text>
                        <text x="600" y={y + 17} textAnchor="end" fill={s.color} fontSize="11" fontWeight="bold">Doğ: {s.acc}</text>
                        <text x="600" y={y + 34} textAnchor="end" fill={s.color} fontSize="10">F1-M: {s.f1}</text>
                        {s.id === "S4" && (
                            <g>
                                <rect x="640" y={y + 5} width="65" height="30" rx="6" fill={s.color} />
                                <text x="672" y={y + 24} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ÖNERİLEN</text>
                            </g>
                        )}
                    </g>
                )
            })}
        </svg>
    )
}

function SolutionVectorSVG() {
    return (
        <svg viewBox="0 0 750 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="375" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">BSO Çözüm Vektörü Kodlama Yapısı</text>
            <text x="375" y="40" textAnchor="middle" fontSize="10" fill="#64748b">Her yarasa bireyi = 43 boyutlu vektör (39 ikili + 4 sürekli)</text>
            {/* Binary part */}
            <rect x="20" y="60" width="430" height="55" rx="6" fill="#3b82f6" fillOpacity="0.06" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="235" y="78" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="bold">İkili Özellik Seçimi Bölümü (39 bit)</text>
            {Array.from({ length: 13 }).map((_, i) => {
                const x = 30 + i * 32, val = BSO_SELECTED_FEATURES.some((_, idx) => idx === i) ? "1" : "0"
                return (
                    <g key={i}>
                        <rect x={x} y="88" width="28" height="22" rx="3" fill={val === "1" ? "#dbeafe" : "#f1f5f9"} stroke={val === "1" ? "#3b82f6" : "#cbd5e1"} strokeWidth="1" />
                        <text x={x + 14} y="103" textAnchor="middle" fill={val === "1" ? "#1e40af" : "#94a3b8"} fontSize="10" fontWeight={val === "1" ? "bold" : "normal"}>{val}</text>
                    </g>
                )
            })}
            <text x="448" y="103" fill="#64748b" fontSize="10">...</text>
            {/* Continuous part */}
            <rect x="470" y="60" width="260" height="55" rx="6" fill="#059669" fillOpacity="0.06" stroke="#059669" strokeWidth="1.5" />
            <text x="600" y="78" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="bold">Sürekli HP Bölümü (4 değer)</text>
            {[
                { label: "n_est", val: "266" },
                { label: "depth", val: "20" },
                { label: "split", val: "7" },
                { label: "feat", val: "0.47" },
            ].map((hp, i) => {
                const x = 480 + i * 60
                return (
                    <g key={hp.label}>
                        <rect x={x} y="88" width="52" height="22" rx="3" fill="#d1fae5" stroke="#059669" strokeWidth="1" />
                        <text x={x + 26} y="103" textAnchor="middle" fill="#065f46" fontSize="9" fontWeight="bold">{hp.val}</text>
                    </g>
                )
            })}
            {/* Labels */}
            <text x="235" y="135" textAnchor="middle" fill="#3b82f6" fontSize="10">x ∈ {"{"}0, 1{"}"}<tspan baselineShift="super" fontSize="7">39</tspan></text>
            <text x="600" y="135" textAnchor="middle" fill="#059669" fontSize="10">θ ∈ ℝ⁴ (sürekli aralık)</text>
            {/* Bottom summary */}
            <rect x="120" y="155" width="510" height="35" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 3" />
            <text x="375" y="172" textAnchor="middle" fill="#1e40af" fontSize="10" fontWeight="bold">f(x, θ) = 1 − F1_macro(RF(X_seçili, θ)) + 0.01 · (n_seçili / 39) → minimize</text>
            <text x="375" y="185" textAnchor="middle" fill="#64748b" fontSize="9">BSO bu fonksiyonu minimize ederek optimal (19 özellik, 4 HP) bileşenini bulur</text>
        </svg>
    )
}

function ClassDistributionSVG() {
    const classes = CICIOT2023_ATTACK_TYPES
    const total = DATASET_STATISTICS.totalSamples
    const totalTraining = classes.reduce((s, c) => s + c.trainingSamples, 0)
    return (
        <svg viewBox="0 0 700 250" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="350" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">CICIoT2023 Veri Seti Sınıf Dağılımı (N={total.toLocaleString()})</text>
            {classes.map((c, i) => {
                const pct = ((c.trainingSamples / totalTraining) * 100).toFixed(1)
                const barW = ((c.trainingSamples / totalTraining) * 100 / 50) * 500, y = 45 + i * 40
                return (
                    <g key={c.name}>
                        <text x="170" y={y + 18} textAnchor="end" fill="#475569" fontSize="10" fontWeight="600">{c.name.replace("DDoS-", "")}</text>
                        <rect x="180" y={y + 2} width={barW} height="26" rx="5" fill={c.color} fillOpacity="0.8" />
                        <text x={185 + barW} y={y + 20} fill="#475569" fontSize="10" fontWeight="bold">{c.trainingSamples.toLocaleString()} (%{pct})</text>
                    </g>
                )
            })}
        </svg>
    )
}

/* ═══════════════════════════════════════════════════════════════
   Figure renderer mapping
   ═══════════════════════════════════════════════════════════════ */
const SVG_RENDERERS: Record<string, () => React.ReactNode> = {
    "sekil-1-1": DDoSTaxonomySVG,
    "sekil-3-1": SystemArchitectureSVG,
    "sekil-3-2": BSOFlowchartSVG,
    "sekil-3-3": SolutionVectorSVG,
    "sekil-3-4": SMOTEProcessSVG,
    "sekil-3-5": CVDiagramSVG,
    "sekil-3-6": ExperimentDesignSVG,
    "sekil-4-1": ClassDistributionSVG,
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function ThesisFigures() {
    const { copied, copy } = useCopy()
    const [filter, setFilter] = useState<number | null>(null)

    const chapters = [1, 2, 3, 4]
    const filtered = filter === null ? THESIS_FIGURES : THESIS_FIGURES.filter((f) => f.chapter === filter)

    const downloadSVG = (id: string) => {
        const svgEl = document.getElementById(`svg-${id}`)
        if (!svgEl) return
        const svgData = new XMLSerializer().serializeToString(svgEl)
        const blob = new Blob([svgData], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${id}.svg`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-sky-500/30 bg-gradient-to-r from-sky-500/5 via-background to-blue-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sky-500/10 rounded-lg">
                                <Image className="w-6 h-6 text-sky-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Tez Şekilleri ve Diyagramları</CardTitle>
                                <CardDescription>
                                    Word dosyasına kopyalanabilir {THESIS_FIGURES.length} akademik şekil — Şekil numaraları ve kaynaklar dahil
                                </CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-sky-600 text-white">{THESIS_FIGURES.length} Şekil</Badge>
                    </div>
                </CardHeader>
            </Card>

            {/* Chapter Filter */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={filter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(null)}
                    className="text-xs"
                >
                    Tümü ({THESIS_FIGURES.length})
                </Button>
                {chapters.map((ch) => {
                    const count = THESIS_FIGURES.filter((f) => f.chapter === ch).length
                    return (
                        <Button
                            key={ch}
                            variant={filter === ch ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(ch)}
                            className="text-xs"
                        >
                            Bölüm {ch} ({count})
                        </Button>
                    )
                })}
            </div>

            {/* Figures */}
            {filtered.map((fig) => {
                const typeConf = figureTypeConfig[fig.type] || figureTypeConfig.system
                const TypeIcon = typeConf.icon
                const Renderer = SVG_RENDERERS[fig.id]
                const captionText = `${fig.number}: ${fig.title}`

                return (
                    <Card key={fig.id} id={`figure-${fig.id}`} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${typeConf.bg}`}>
                                        <TypeIcon className={`w-5 h-5 ${typeConf.color}`} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{fig.number}: {fig.title}</CardTitle>
                                        <CardDescription className="text-[11px] mt-0.5">{fig.titleEn}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="text-[10px]">Bölüm {fig.chapter}</Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-[10px] h-7 px-2"
                                        onClick={() => copy(`cap-${fig.id}`, captionText)}
                                    >
                                        {copied === `cap-${fig.id}` ? <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />}
                                        Başlık Kopyala
                                    </Button>
                                    {Renderer && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-[10px] h-7 px-2"
                                            onClick={() => downloadSVG(fig.id)}
                                        >
                                            <Download className="w-3 h-3 mr-1" />
                                            SVG İndir
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* SVG Figure */}
                            {Renderer ? (
                                <div id={`svg-${fig.id}`} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
                                    <Renderer />
                                </div>
                            ) : (
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-center">
                                    <TypeIcon className={`w-12 h-12 mx-auto mb-3 ${typeConf.color} opacity-40`} />
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{fig.title}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        Bu şekil, programdaki mevcut interaktif bileşenlerden alınabilir
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                        (İlgili sekmede ekran görüntüsü alınabilir)
                                    </p>
                                </div>
                            )}

                            {/* Description */}
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="flex items-start gap-2">
                                    <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                        <p>{fig.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Source */}
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/40">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-2 flex-1">
                                        <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div className="text-[11px] text-blue-700 dark:text-blue-300">
                                            <strong>Kaynak:</strong> {fig.source}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-[10px] h-6 px-2 text-blue-600"
                                        onClick={() => copy(`src-${fig.id}`, fig.source)}
                                    >
                                        {copied === `src-${fig.id}` ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}

            {/* Summary Footer */}
            <Card className="bg-gradient-to-r from-sky-500/5 to-blue-500/5 border-sky-500/20">
                <CardContent className="pt-4 pb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {chapters.map((ch) => (
                            <div key={ch} className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg border">
                                <div className="text-lg font-bold text-slate-800 dark:text-white">
                                    {THESIS_FIGURES.filter((f) => f.chapter === ch).length}
                                </div>
                                <div className="text-[10px] text-slate-500">Bölüm {ch}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-3">
                        Tüm şekiller APA 7 formatında numaralandırılmıştır. Başlıklar ve kaynaklar doğrudan Word dosyasına kopyalanabilir.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
