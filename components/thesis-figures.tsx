"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Image, Download, Copy, CheckCircle2, Shield, Database,
    Brain, Target, Layers, GitGraph, BarChart3, Network,
    AlertTriangle, Zap, FileText, ArrowRight, ArrowDown,
    Activity, Cpu, FlaskConical, TrendingUp, Award, PieChart,
    ChevronDown, ChevronUp, Eye,
} from "lucide-react"
import { useState } from "react"
import {
    MODEL_RESULTS, DATASET_STATISTICS, BSO_PARAMETERS,
    BSO_SELECTED_FEATURES, CROSS_VALIDATION, BSO_RF_PER_CLASS,
    CICIOT2023_ATTACK_TYPES, CONFUSION_MATRICES,
    OPTIMIZER_CONVERGENCE, STATISTICAL_TESTS,
    FEATURE_SELECTION_COMPARISON,
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
   FIGURE DEFINITIONS — All 18 figures for the thesis
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
        description: "Random Forest feature_importances_ ile hesaplanan Gini önem değerleri. En önemli: syn_count (0.2245), Number (0.1834), Tot sum (0.1541).",
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
   SVG Renderers — BÖLÜM 1
   ═══════════════════════════════════════════════════════════════ */

function DDoSTaxonomySVG() {
    return (
        <svg viewBox="0 0 800 380" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#4f46e5" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#dc2626" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
                <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#22c55e" /></linearGradient>
                <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#a855f7" /></linearGradient>
            </defs>
            <rect x="280" y="10" width="240" height="50" rx="12" fill="url(#grad1)" />
            <text x="400" y="38" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">DDoS Saldırı Türleri</text>
            <line x1="400" y1="60" x2="400" y2="90" stroke="#94a3b8" strokeWidth="2" />
            <line x1="130" y1="90" x2="670" y2="90" stroke="#94a3b8" strokeWidth="2" />
            <line x1="130" y1="90" x2="130" y2="115" stroke="#94a3b8" strokeWidth="2" />
            <line x1="400" y1="90" x2="400" y2="115" stroke="#94a3b8" strokeWidth="2" />
            <line x1="670" y1="90" x2="670" y2="115" stroke="#94a3b8" strokeWidth="2" />
            <rect x="30" y="115" width="200" height="45" rx="10" fill="url(#grad2)" />
            <text x="130" y="142" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">Hacimsel Saldırılar</text>
            <rect x="300" y="115" width="200" height="45" rx="10" fill="url(#grad3)" />
            <text x="400" y="142" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">Protokol Saldırıları</text>
            <rect x="570" y="115" width="200" height="45" rx="10" fill="url(#grad4)" />
            <text x="670" y="142" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">Uygulama Katmanı</text>
            <line x1="130" y1="160" x2="130" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="60" y1="185" x2="200" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            {[{ x: 60, t: "UDP Flood" }, { x: 130, t: "ICMP Flood" }, { x: 200, t: "DNS Amplif." }].map((b) => (
                <g key={b.t}><line x1={b.x} y1="185" x2={b.x} y2="200" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x={b.x - 50} y="200" width="100" height="32" rx="6" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1" />
                    <text x={b.x} y="220" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="600">{b.t}</text></g>
            ))}
            <line x1="400" y1="160" x2="400" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="330" y1="185" x2="470" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            {[{ x: 330, t: "SYN Flood ✓" }, { x: 400, t: "ACK Frag. ✓" }, { x: 470, t: "Smurf" }].map((b) => (
                <g key={b.t}><line x1={b.x} y1="185" x2={b.x} y2="200" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x={b.x - 50} y="200" width="100" height="32" rx="6" fill={b.t.includes("✓") ? "#d1fae5" : "#f0fdf4"} stroke={b.t.includes("✓") ? "#34d399" : "#86efac"} strokeWidth="1.5" />
                    <text x={b.x} y="220" textAnchor="middle" fill="#065f46" fontSize="10" fontWeight="600">{b.t}</text></g>
            ))}
            <line x1="670" y1="160" x2="670" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="600" y1="185" x2="740" y2="185" stroke="#94a3b8" strokeWidth="1.5" />
            {[{ x: 600, t: "HTTP Flood" }, { x: 670, t: "Slowloris" }, { x: 740, t: "DNS Query" }].map((b) => (
                <g key={b.t}><line x1={b.x} y1="185" x2={b.x} y2="200" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x={b.x - 50} y="200" width="100" height="32" rx="6" fill="#f3e8ff" stroke="#c084fc" strokeWidth="1" />
                    <text x={b.x} y="220" textAnchor="middle" fill="#581c87" fontSize="10" fontWeight="600">{b.t}</text></g>
            ))}
            <rect x="200" y="270" width="400" height="50" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 3" />
            <text x="400" y="290" textAnchor="middle" fill="#1e40af" fontWeight="bold" fontSize="12">Bu Tezde Kullanılan (CICIoT2023):</text>
            <text x="400" y="308" textAnchor="middle" fill="#1e40af" fontSize="11">ACK_Fragmentation, SYN_Flood, Backdoor_Malware, BenignTraffic, PortScan</text>
            <rect x="250" y="340" width="12" height="12" rx="2" fill="#d1fae5" stroke="#34d399" strokeWidth="1.5" />
            <text x="268" y="351" fill="#065f46" fontSize="10">= Bu tezde kullanılan saldırı türleri</text>
        </svg>
    )
}

function IoTArchitectureSVG() {
    const layers = [
        { y: 10, label: "Algılama Katmanı (Perception)", sub: "IoT cihazları: Akıllı kamera, sensör, termostat (105 cihaz)", color: "#3b82f6", icon: "📡" },
        { y: 75, label: "Ağ Katmanı (Network)", sub: "WiFi, Zigbee, BLE, Ethernet → Internet", color: "#8b5cf6", icon: "🌐" },
        { y: 140, label: "Uygulama Katmanı (Application)", sub: "Akıllı ev, sağlık, endüstri, tarım uygulamaları", color: "#059669", icon: "📱" },
    ]
    const attacks = [
        { y: 30, label: "Botnet Komuta & Kontrol (C2)", color: "#dc2626" },
        { y: 95, label: "DDoS Saldırı Trafiği", color: "#f97316" },
        { y: 160, label: "Hedef Sunucu / Servis", color: "#dc2626" },
    ]
    return (
        <svg viewBox="0 0 800 310" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="400" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">IoT Ağ Mimarisi ve DDoS Saldırı Vektörleri</text>
            <text x="200" y="50" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#64748b">Normal IoT Mimarisi</text>
            {layers.map((l, i) => (
                <g key={i}>
                    {i > 0 && <line x1="200" y1={l.y + 48} x2="200" y2={l.y + 60} stroke="#94a3b8" strokeWidth="1.5" />}
                    <rect x="30" y={l.y + 55} width="340" height="48" rx="10" fill={l.color} fillOpacity="0.08" stroke={l.color} strokeWidth="1.5" />
                    <text x="45" y={l.y + 78} fontSize="14">{l.icon}</text>
                    <text x="68" y={l.y + 74} fill={l.color} fontSize="11" fontWeight="bold">{l.label}</text>
                    <text x="68" y={l.y + 91} fill="#64748b" fontSize="9">{l.sub}</text>
                </g>
            ))}
            <text x="600" y="50" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">DDoS Saldırı Senaryosu</text>
            {attacks.map((a, i) => (
                <g key={i}>
                    {i > 0 && <line x1="600" y1={a.y + 48} x2="600" y2={a.y + 55} stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" />}
                    <rect x="450" y={a.y + 55} width="300" height="38" rx="8" fill="#dc2626" fillOpacity="0.06" stroke="#dc2626" strokeWidth="1.5" strokeDasharray={i === 1 ? "6 3" : "0"} />
                    <text x="600" y={a.y + 79} textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="bold">{a.label}</text>
                </g>
            ))}
            <line x1="370" y1="120" x2="450" y2="100" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
            <line x1="370" y1="160" x2="450" y2="160" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
            {[480, 540, 600, 660, 720].map((x, i) => (
                <g key={i}><circle cx={x} cy="70" r="6" fill="#dc2626" fillOpacity="0.2" stroke="#dc2626" strokeWidth="1" />
                    <text x={x} y="73" textAnchor="middle" fontSize="7">🤖</text></g>
            ))}
            <rect x="150" y="268" width="500" height="35" rx="8" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
            <text x="400" y="285" textAnchor="middle" fill="#991b1b" fontSize="10" fontWeight="bold">CICIoT2023: 105 IoT cihazı × 33 saldırı türü → Bu tezde 5 sınıf seçildi</text>
            <text x="400" y="298" textAnchor="middle" fill="#991b1b" fontSize="9">{DATASET_STATISTICS.totalSamples.toLocaleString()} toplam örnek, {DATASET_STATISTICS.totalFeatures} ağ trafik özelliği</text>
        </svg>
    )
}

function IDSArchitectureSVG() {
    const steps = [
        { label: "Ağ Trafiği\nYakalama", sub: "Paket sniffing,\nflow kayıtları", color: "#3b82f6", icon: "🔍" },
        { label: "Özellik\nÇıkarma", sub: "39 ağ özelliği\n(CICIoT2023)", color: "#6366f1", icon: "⚡" },
        { label: "Ön İşleme\n& SMOTE", sub: "Normalizasyon,\ndengeleme", color: "#8b5cf6", icon: "🔧" },
        { label: "Özellik\nSeçimi (BSO)", sub: "39 → 19 özellik\n(%51.3 azaltma)", color: "#a855f7", icon: "🦇" },
        { label: "ML Model\nEğitimi", sub: "Random Forest\n(BSO-HP tuned)", color: "#059669", icon: "🌲" },
        { label: "Sınıflandırma\nKararı", sub: "Normal / Saldırı\n(5 sınıf)", color: "#dc2626", icon: "🎯" },
    ]
    return (
        <svg viewBox="0 0 850 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="425" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">ML Tabanlı Ağ Saldırı Tespit Sistemi (IDS) Genel Yapısı</text>
            {steps.map((s, i) => {
                const x = 15 + i * 138
                return (
                    <g key={i}>
                        {i > 0 && (
                            <g><line x1={x - 8} y1="100" x2={x + 2} y2="100" stroke="#94a3b8" strokeWidth="2" />
                                <polygon points={`${x + 2},100 ${x - 5},96 ${x - 5},104`} fill="#94a3b8" /></g>
                        )}
                        <rect x={x} y="45" width="125" height="110" rx="12" fill={s.color} fillOpacity="0.06" stroke={s.color} strokeWidth="1.5" />
                        <text x={x + 62} y="68" textAnchor="middle" fontSize="20">{s.icon}</text>
                        {s.label.split("\n").map((line, li) => (
                            <text key={li} x={x + 62} y={88 + li * 14} textAnchor="middle" fill={s.color} fontSize="10" fontWeight="bold">{line}</text>
                        ))}
                        {s.sub.split("\n").map((line, li) => (
                            <text key={li} x={x + 62} y={122 + li * 12} textAnchor="middle" fill="#64748b" fontSize="8.5">{line}</text>
                        ))}
                        <circle cx={x + 112} cy="50" r="9" fill={s.color} fillOpacity="0.15" />
                        <text x={x + 112} y="54" textAnchor="middle" fill={s.color} fontSize="8" fontWeight="bold">{i + 1}</text>
                    </g>
                )
            })}
            <rect x="200" y="168" width="450" height="24" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" />
            <text x="425" y="184" textAnchor="middle" fill="#1e40af" fontSize="10" fontWeight="bold">Geri Besleme Döngüsü: Model güncellemesi ve sürekli izleme</text>
        </svg>
    )
}

/* ═══════════════════════════════════════════════════════════════
   SVG Renderers — BÖLÜM 2
   ═══════════════════════════════════════════════════════════════ */

function MetaheuristicTaxonomySVG() {
    const categories = [
        { label: "Sürü Zekası", color: "#3b82f6", items: [{ name: "BSO (Yarasa) ✓", hl: true }, { name: "PSO (Parçacık) ✓", hl: true }, { name: "ACO (Karınca)", hl: false }, { name: "ABC (Arı)", hl: false }] },
        { label: "Evrimsel Algoritmalar", color: "#059669", items: [{ name: "GA (Genetik) ✓", hl: true }, { name: "DE (Diferansiyel Evrim)", hl: false }, { name: "ES (Evrimsel Strateji)", hl: false }, { name: "GP (Genetik Progr.)", hl: false }] },
        { label: "Fizik Tabanlı", color: "#f59e0b", items: [{ name: "GWO (Kurt) ✓", hl: true }, { name: "SA (Tavlama)", hl: false }, { name: "GSA (Kütleçekim)", hl: false }, { name: "WOA (Balina)", hl: false }] },
    ]
    return (
        <svg viewBox="0 0 800 340" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <rect x="250" y="10" width="300" height="45" rx="12" fill="#1e293b" />
            <text x="400" y="37" textAnchor="middle" fill="white" fontWeight="bold" fontSize="13">Meta-Sezgisel Optimizasyon Algoritmaları</text>
            <line x1="400" y1="55" x2="400" y2="80" stroke="#94a3b8" strokeWidth="2" />
            <line x1="135" y1="80" x2="665" y2="80" stroke="#94a3b8" strokeWidth="2" />
            {categories.map((cat, ci) => {
                const cx = 135 + ci * 265
                return (
                    <g key={ci}>
                        <line x1={cx} y1="80" x2={cx} y2="100" stroke="#94a3b8" strokeWidth="2" />
                        <rect x={cx - 110} y="100" width="220" height="38" rx="10" fill={cat.color} fillOpacity="0.12" stroke={cat.color} strokeWidth="1.5" />
                        <text x={cx} y="123" textAnchor="middle" fill={cat.color} fontWeight="bold" fontSize="12">{cat.label}</text>
                        {cat.items.map((item, ii) => {
                            const iy = 150 + ii * 38
                            return (
                                <g key={ii}>
                                    {ii === 0 && <line x1={cx} y1="138" x2={cx} y2="155" stroke="#94a3b8" strokeWidth="1" />}
                                    <rect x={cx - 90} y={iy} width="180" height="30" rx="6"
                                        fill={item.hl ? cat.color : "#f8fafc"} fillOpacity={item.hl ? 0.15 : 1}
                                        stroke={item.hl ? cat.color : "#e2e8f0"} strokeWidth={item.hl ? 2 : 1} />
                                    <text x={cx} y={iy + 19} textAnchor="middle" fill={item.hl ? cat.color : "#64748b"}
                                        fontSize="10" fontWeight={item.hl ? "bold" : "normal"}>{item.name}</text>
                                </g>
                            )
                        })}
                    </g>
                )
            })}
            <rect x="200" y="308" width="400" height="25" rx="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" />
            <text x="400" y="325" textAnchor="middle" fill="#1e40af" fontSize="10" fontWeight="bold">✓ = Bu tezde karşılaştırma için kullanılan algoritmalar</text>
        </svg>
    )
}

function BatEcholocationSVG() {
    return (
        <svg viewBox="0 0 800 380" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="400" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">Yarasa Ekolokasyon Mekanizması ve BSO Parametre Eşlemesi</text>
            <text x="200" y="100" textAnchor="middle" fontSize="60">🦇</text>
            <text x="200" y="130" textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="bold">Micro-Yarasa</text>
            {[0, 1, 2, 3].map(i => (
                <ellipse key={i} cx={350 + i * 40} cy="90" rx={20 + i * 15} ry={30 + i * 10}
                    fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 3" opacity={1 - i * 0.2} />
            ))}
            <text x="430" y="60" fill="#8b5cf6" fontSize="10" fontWeight="bold">Ultrasonik Ses Dalgaları</text>
            <text x="620" y="100" textAnchor="middle" fontSize="30">🪲</text>
            <text x="620" y="125" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">Av (Hedef)</text>
            <line x1="580" y1="95" x2="280" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x="430" y="115" fill="#f59e0b" fontSize="9" fontWeight="bold">Yansıyan Ses → Mesafe Tahmini</text>
            <rect x="80" y="160" width="640" height="200" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            <text x="400" y="185" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e293b">Biyolojik → Algoritmik Parametre Eşlemesi</text>
            <rect x="100" y="195" width="200" height="25" rx="4" fill="#7c3aed" fillOpacity="0.1" />
            <text x="200" y="212" textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="bold">Biyolojik Parametre</text>
            <rect x="310" y="195" width="200" height="25" rx="4" fill="#3b82f6" fillOpacity="0.1" />
            <text x="410" y="212" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">BSO Parametresi</text>
            <rect x="520" y="195" width="180" height="25" rx="4" fill="#059669" fillOpacity="0.1" />
            <text x="610" y="212" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="bold">Bu Tezdeki Değer</text>
            {[
                { bio: "Ses Frekansı (f)", algo: "Frekans f ∈ [fmin, fmax]", val: `[${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}]` },
                { bio: "Darbe Oranı (r)", algo: "Exploration/Exploitation", val: `r₀ = ${BSO_PARAMETERS.initialPulseRate}` },
                { bio: "Gürültü Şiddeti (A)", algo: "Kabul Olasılığı", val: `A₀ = ${BSO_PARAMETERS.initialLoudness}` },
                { bio: "Uçuş Hızı (v)", algo: "Çözüm Güncelleme Hızı", val: `α=${BSO_PARAMETERS.alpha}, γ=${BSO_PARAMETERS.gamma}` },
                { bio: "Sürü Boyutu", algo: "Popülasyon", val: `N = ${BSO_PARAMETERS.populationSize}` },
                { bio: "Avlanma Süresi", algo: "Maks. İterasyon", val: `T = ${BSO_PARAMETERS.maxIterations}` },
            ].map((row, i) => {
                const ry = 228 + i * 21
                return (
                    <g key={i}>
                        <text x="200" y={ry} textAnchor="middle" fill="#7c3aed" fontSize="9.5">{row.bio}</text>
                        <text x="410" y={ry} textAnchor="middle" fill="#3b82f6" fontSize="9.5">{row.algo}</text>
                        <text x="610" y={ry} textAnchor="middle" fill="#059669" fontSize="9.5" fontWeight="bold">{row.val}</text>
                        {i < 5 && <line x1="100" y1={ry + 6} x2="700" y2={ry + 6} stroke="#e2e8f0" strokeWidth="0.5" />}
                    </g>
                )
            })}
        </svg>
    )
}

function RelatedWorksSVG() {
    const works = [
        { author: "Neto et al. (2023)", dataset: "CICIoT2023", fs: "—", model: "RF", acc: "99.0%", cls: "2-sınıf" },
        { author: "Ferrag et al. (2023)", dataset: "CICIoT2023", fs: "—", model: "DNN", acc: "98.2%", cls: "2-sınıf" },
        { author: "Aamir et al. (2021)", dataset: "CICDDoS2019", fs: "PCA", model: "RF", acc: "99.5%", cls: "2-sınıf" },
        { author: "Acharya & Singh (2022)", dataset: "NSL-KDD", fs: "GA", model: "SVM", acc: "96.2%", cls: "5-sınıf" },
        { author: "Alazzam et al. (2020)", dataset: "CSE-CIC-IDS", fs: "PSO", model: "DT", acc: "95.8%", cls: "2-sınıf" },
        { author: "Bu Tez (2026)", dataset: "CICIoT2023", fs: "BSO", model: "RF-HP", acc: "89.82%", cls: "5-sınıf" },
    ]
    const headers = ["Çalışma", "Veri Seti", "ÖS", "Model", "Doğ.", "Sınıf"]
    const colX = [100, 240, 340, 400, 465, 530]
    return (
        <svg viewBox="0 0 600 260" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="300" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">İlgili Çalışmaların Karşılaştırması</text>
            <rect x="20" y="32" width="560" height="24" rx="4" fill="#1e293b" />
            {headers.map((h, i) => (
                <text key={i} x={colX[i]} y="48" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{h}</text>
            ))}
            {works.map((w, i) => {
                const ry = 62 + i * 28
                const isP = i === works.length - 1
                return (
                    <g key={i}>
                        <rect x="20" y={ry} width="560" height="26" rx="3"
                            fill={isP ? "#059669" : (i % 2 === 0 ? "#f8fafc" : "#ffffff")} fillOpacity={isP ? 0.1 : 1}
                            stroke={isP ? "#059669" : "#e2e8f0"} strokeWidth={isP ? 2 : 0.5} />
                        <text x={colX[0]} y={ry + 17} textAnchor="middle" fill={isP ? "#059669" : "#334155"} fontSize="9" fontWeight={isP ? "bold" : "normal"}>{w.author}</text>
                        <text x={colX[1]} y={ry + 17} textAnchor="middle" fill="#64748b" fontSize="9">{w.dataset}</text>
                        <text x={colX[2]} y={ry + 17} textAnchor="middle" fill="#64748b" fontSize="9">{w.fs}</text>
                        <text x={colX[3]} y={ry + 17} textAnchor="middle" fill="#64748b" fontSize="9">{w.model}</text>
                        <text x={colX[4]} y={ry + 17} textAnchor="middle" fill={isP ? "#059669" : "#334155"} fontSize="9" fontWeight="bold">{w.acc}</text>
                        <text x={colX[5]} y={ry + 17} textAnchor="middle" fill={isP ? "#059669" : "#64748b"} fontSize="9">{w.cls}</text>
                    </g>
                )
            })}
            <rect x="80" y="238" width="440" height="18" rx="4" fill="#eff6ff" />
            <text x="300" y="250" textAnchor="middle" fill="#1e40af" fontSize="8.5">Not: Bu tez 5-sınıf çok-sınıflı problem üzerinde çalışmaktadır (2-sınıf ile doğrudan karşılaştırılamaz)</text>
        </svg>
    )
}

/* ═══════════════════════════════════════════════════════════════
   SVG Renderers — BÖLÜM 3
   ═══════════════════════════════════════════════════════════════ */

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
            <defs><marker id="arrowM" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /></marker></defs>
            {steps.map((step, i) => (
                <g key={i}>
                    {i > 0 && <line x1="350" y1={step.y - 8} x2="350" y2={step.y + 2} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowM)" />}
                    <rect x="50" y={step.y} width="600" height="48" rx="10" fill={step.color} fillOpacity="0.08" stroke={step.color} strokeWidth="1.5" />
                    <circle cx="80" cy={step.y + 24} r="15" fill={step.color} fillOpacity="0.15" />
                    <text x="80" y={step.y + 29} textAnchor="middle" fontSize="14">{step.icon}</text>
                    <text x="108" y={step.y + 19} fill={step.color} fontSize="13" fontWeight="bold">{step.label}</text>
                    <text x="108" y={step.y + 37} fill="#64748b" fontSize="10.5">{step.sub}</text>
                    <rect x="610" y={step.y + 10} width="28" height="28" rx="6" fill={step.color} fillOpacity="0.15" />
                    <text x="624" y={step.y + 29} textAnchor="middle" fill={step.color} fontSize="11" fontWeight="bold">{i + 1}</text>
                </g>
            ))}
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

function SolutionVectorSVG() {
    return (
        <svg viewBox="0 0 750 200" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="375" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">BSO Çözüm Vektörü Kodlama Yapısı</text>
            <text x="375" y="40" textAnchor="middle" fontSize="10" fill="#64748b">Her yarasa bireyi = 43 boyutlu vektör (39 ikili + 4 sürekli)</text>
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
            <rect x="470" y="60" width="260" height="55" rx="6" fill="#059669" fillOpacity="0.06" stroke="#059669" strokeWidth="1.5" />
            <text x="600" y="78" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="bold">Sürekli HP Bölümü (4 değer)</text>
            {[{ label: "n_est", val: "266" }, { label: "depth", val: "20" }, { label: "split", val: "7" }, { label: "feat", val: "0.47" }].map((hp, i) => (
                <g key={hp.label}><rect x={480 + i * 60} y="88" width="52" height="22" rx="3" fill="#d1fae5" stroke="#059669" strokeWidth="1" />
                    <text x={480 + i * 60 + 26} y="103" textAnchor="middle" fill="#065f46" fontSize="9" fontWeight="bold">{hp.val}</text></g>
            ))}
            <text x="235" y="135" textAnchor="middle" fill="#3b82f6" fontSize="10">x ∈ {"{"}0, 1{"}"}<tspan baselineShift="super" fontSize="7">39</tspan></text>
            <text x="600" y="135" textAnchor="middle" fill="#059669" fontSize="10">θ ∈ ℝ⁴ (sürekli aralık)</text>
            <rect x="120" y="155" width="510" height="35" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 3" />
            <text x="375" y="172" textAnchor="middle" fill="#1e40af" fontSize="10" fontWeight="bold">f(x, θ) = 1 − F1_macro(RF(X_seçili, θ)) + 0.01 · (n_seçili / 39) → minimize</text>
            <text x="375" y="185" textAnchor="middle" fill="#64748b" fontSize="9">BSO bu fonksiyonu minimize ederek optimal (19 özellik, 4 HP) bileşenini bulur</text>
        </svg>
    )
}

function SMOTEProcessSVG() {
    const classes = CICIOT2023_ATTACK_TYPES.map((a) => ({ name: a.name.replace("DDoS-", ""), before: a.trainingSamples, after: a.smoteSamples, color: a.color }))
    return (
        <svg viewBox="0 0 750 350" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="375" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">SMOTE Aşırı Örnekleme — Eğitim Seti Dengeleme</text>
            <text x="180" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748b">SMOTE Öncesi (72.252)</text>
            {classes.map((c, i) => {
                const maxH = 170, h = (c.before / 40000) * maxH, y = 230 - h; return (
                    <g key={c.name}><rect x={60 + i * 55} y={y} width="40" height={h} rx="4" fill={c.color} fillOpacity="0.7" />
                        <text x={80 + i * 55} y="248" textAnchor="middle" fontSize="7" fill="#475569" transform={`rotate(-30, ${80 + i * 55}, 248)`}>{c.name}</text>
                        <text x={80 + i * 55} y={y - 5} textAnchor="middle" fontSize="8" fill={c.color} fontWeight="bold">{(c.before / 1000).toFixed(1)}k</text></g>
                )
            })}
            <text x="375" y="155" textAnchor="middle" fontSize="30">→</text>
            <text x="375" y="175" textAnchor="middle" fontSize="10" fill="#059669" fontWeight="bold">SMOTE k-NN</text>
            <text x="575" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748b">SMOTE Sonrası (87.500)</text>
            {classes.map((c, i) => {
                const maxH = 170, h = (c.after / 40000) * maxH, y = 230 - h; return (
                    <g key={`a-${c.name}`}><rect x={455 + i * 55} y={y} width="40" height={h} rx="4" fill={c.color} />
                        <text x={475 + i * 55} y="248" textAnchor="middle" fontSize="7" fill="#475569" transform={`rotate(-30, ${475 + i * 55}, 248)`}>{c.name}</text>
                        <text x={475 + i * 55} y={y - 5} textAnchor="middle" fontSize="8" fill={c.color} fontWeight="bold">17.5k</text></g>
                )
            })}
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
                const y = 42 + i * 26; return (
                    <g key={f}><text x="30" y={y + 14} fontSize="10" fill="#64748b" fontWeight="bold">K{f}</text>
                        {folds.map((_, j) => (<rect key={j} x={55 + j * 56} y={y} width="50" height="20" rx="3" fill={j === i ? "#3b82f6" : "#e2e8f0"} stroke={j === i ? "#2563eb" : "#cbd5e1"} strokeWidth="1" />))}
                        <text x="625" y={y + 14} fontSize="9" fill="#64748b">{CROSS_VALIDATION.results[i] ? `%${CROSS_VALIDATION.results[i].accuracy}` : ""}</text></g>
                )
            })}
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
                const y = 40 + i * 55; return (
                    <g key={s.id}>
                        {i > 0 && (<g><line x1="375" y1={y - 12} x2="375" y2={y + 2} stroke="#94a3b8" strokeWidth="1.5" />
                            <polygon points={`375,${y + 2} 370,${y - 5} 380,${y - 5}`} fill="#94a3b8" /></g>)}
                        <rect x="30" y={y} width="690" height="42" rx="8" fill={s.color} fillOpacity="0.06" stroke={s.color} strokeWidth="1.5" />
                        <circle cx="58" cy={y + 21} r="14" fill={s.color} fillOpacity="0.2" />
                        <text x="58" y={y + 25} textAnchor="middle" fill={s.color} fontSize="11" fontWeight="bold">{s.id}</text>
                        <text x="90" y={y + 17} fill={s.color} fontSize="11" fontWeight="bold">{s.label}</text>
                        <text x="90" y={y + 34} fill="#64748b" fontSize="9">FS: {s.fs} | HP: {s.hp} | SMOTE: {s.smote}</text>
                        <text x="600" y={y + 17} textAnchor="end" fill={s.color} fontSize="11" fontWeight="bold">Doğ: {s.acc}</text>
                        <text x="600" y={y + 34} textAnchor="end" fill={s.color} fontSize="10">F1-M: {s.f1}</text>
                        {s.id === "S4" && (<g><rect x="640" y={y + 5} width="65" height="30" rx="6" fill={s.color} />
                            <text x="672" y={y + 24} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ÖNERİLEN</text></g>)}
                    </g>
                )
            })}
        </svg>
    )
}

/* ═══════════════════════════════════════════════════════════════
   SVG Renderers — BÖLÜM 4
   ═══════════════════════════════════════════════════════════════ */

function ClassDistributionSVG() {
    const classes = CICIOT2023_ATTACK_TYPES
    const total = DATASET_STATISTICS.totalSamples
    const totalTr = classes.reduce((s, c) => s + c.trainingSamples, 0)
    return (
        <svg viewBox="0 0 700 250" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="350" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">CICIoT2023 Veri Seti Sınıf Dağılımı (N={total.toLocaleString()})</text>
            {classes.map((c, i) => {
                const pct = ((c.trainingSamples / totalTr) * 100).toFixed(1); const barW = ((c.trainingSamples / totalTr) * 100 / 50) * 500; const y = 45 + i * 40; return (
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

function BSOConvergenceSVG() {
    const data = OPTIMIZER_CONVERGENCE.BSO.data
    const psoData = OPTIMIZER_CONVERGENCE.PSO.data
    const gaData = OPTIMIZER_CONVERGENCE.GA.data
    const gwoData = OPTIMIZER_CONVERGENCE.GWO.data
    const cx = 80, cy = 40, cw = 600, ch = 220, yMin = 0.175, yMax = 0.205
    const toX = (i: number, total: number) => cx + (i / (total - 1)) * cw
    const toY = (v: number) => cy + ch - ((v - yMin) / (yMax - yMin)) * ch
    const makePath = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i, arr.length).toFixed(1)},${toY(v).toFixed(1)}`).join(" ")
    return (
        <svg viewBox="0 0 780 340" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="390" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">Optimizasyon Yakınsama Eğrileri</text>
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                const y = cy + frac * ch; return (
                    <g key={frac}><line x1={cx} y1={y} x2={cx + cw} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                        <text x={cx - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="8">{(yMax - frac * (yMax - yMin)).toFixed(3)}</text></g>
                )
            })}
            {[0, 10, 20, 30, 40, 49].map((i) => (
                <g key={i}><line x1={toX(i, 50)} y1={cy} x2={toX(i, 50)} y2={cy + ch} stroke="#e2e8f0" strokeWidth="0.5" />
                    <text x={toX(i, 50)} y={cy + ch + 15} textAnchor="middle" fill="#94a3b8" fontSize="8">{i}</text></g>
            ))}
            <line x1={cx} y1={cy} x2={cx} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
            <line x1={cx} y1={cy + ch} x2={cx + cw} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
            <text x={cx + cw / 2} y={cy + ch + 30} textAnchor="middle" fill="#64748b" fontSize="10">İterasyon</text>
            <text x="15" y={cy + ch / 2} textAnchor="middle" fill="#64748b" fontSize="10" transform={`rotate(-90, 15, ${cy + ch / 2})`}>Uygunluk (fitness)</text>
            <path d={makePath(psoData)} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />
            <path d={makePath(gaData)} fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />
            <path d={makePath(gwoData)} fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7" />
            <path d={makePath(data)} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
            <circle cx={toX(49, 50)} cy={toY(data[49])} r="4" fill="#3b82f6" />
            <circle cx={toX(39, 40)} cy={toY(psoData[39])} r="3" fill="#f59e0b" />
            <circle cx={toX(39, 40)} cy={toY(gaData[39])} r="3" fill="#22c55e" />
            <circle cx={toX(39, 40)} cy={toY(gwoData[39])} r="3" fill="#8b5cf6" />
            {[{ label: "BSO-Hybrid (0.1778)", color: "#3b82f6", d: "" }, { label: "GA (0.1890)", color: "#22c55e", d: "4 2" }, { label: "GWO (0.1922)", color: "#8b5cf6", d: "4 2" }, { label: "PSO (0.1939)", color: "#f59e0b", d: "4 2" }].map((l, i) => (
                <g key={i}><line x1={cx + 20 + i * 160} y1="310" x2={cx + 45 + i * 160} y2="310" stroke={l.color} strokeWidth={l.d ? 1.5 : 2.5} strokeDasharray={l.d} />
                    <text x={cx + 50 + i * 160} y="314" fill={l.color} fontSize="9" fontWeight="bold">{l.label}</text></g>
            ))}
        </svg>
    )
}

function FeatureImportanceSVG() {
    const features = BSO_SELECTED_FEATURES.slice(0, 19)
    const maxImp = features[0].importance
    const barH = 18, gap = 3, chartH = features.length * (barH + gap) + 30
    return (
        <svg viewBox={`0 0 750 ${chartH}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="375" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">BSO Seçili 19 Özelliğin Gini Önem Sıralaması</text>
            {features.map((f, i) => {
                const y = 35 + i * (barH + gap); const barW = (f.importance / maxImp) * 440
                const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"]
                const color = colors[Math.min(Math.floor(i / 3.5), colors.length - 1)]; return (
                    <g key={f.name}><text x="155" y={y + 14} textAnchor="end" fill="#475569" fontSize="9" fontWeight={i < 3 ? "bold" : "normal"}>{f.name}</text>
                        <rect x="165" y={y} width={barW} height={barH} rx="3" fill={color} fillOpacity={1 - i * 0.035} />
                        <text x={170 + barW} y={y + 13} fill="#475569" fontSize="8.5" fontWeight="bold">{f.importance.toFixed(4)}</text>
                        <text x="740" y={y + 14} textAnchor="end" fill="#94a3b8" fontSize="8">#{f.rank}</text></g>
                )
            })}
        </svg>
    )
}

function ModelComparisonSVG() {
    const models = MODEL_RESULTS.slice(0, 12).sort((a, b) => b.accuracy - a.accuracy)
    const barH = 24, gap = 5
    return (
        <svg viewBox={`0 0 800 ${60 + models.length * (barH + gap)}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="400" y="20" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">12 Model Performans Karşılaştırması</text>
            <text x="580" y="42" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">Doğruluk (%)</text>
            <text x="720" y="42" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="bold">F1-Macro (%)</text>
            {models.map((m, i) => {
                const y = 50 + i * (barH + gap); const isBSO = m.name.includes("BSO-Hybrid"); return (
                    <g key={m.name}>
                        <rect x="10" y={y} width="780" height={barH} rx="4" fill={isBSO ? "#3b82f6" : "#f8fafc"} fillOpacity={isBSO ? 0.08 : 1} stroke={isBSO ? "#3b82f6" : "#e2e8f0"} strokeWidth={isBSO ? 2 : 0.5} />
                        <text x="20" y={y + 16} fill={isBSO ? "#1e40af" : "#334155"} fontSize="9.5" fontWeight={isBSO ? "bold" : "normal"}>{m.name.replace(" (Proposed)", "")} {isBSO ? "★" : ""}</text>
                        <rect x="480" y={y + 3} width={(m.accuracy / 100) * 200} height={barH - 6} rx="3" fill="#3b82f6" fillOpacity={isBSO ? 0.8 : 0.4} />
                        <text x={485 + (m.accuracy / 100) * 200} y={y + 16} fill="#3b82f6" fontSize="8.5" fontWeight="bold">{m.accuracy.toFixed(2)}</text>
                        <rect x="660" y={y + 3} width={(m.f1Macro / 100) * 130} height={barH - 6} rx="3" fill="#059669" fillOpacity={isBSO ? 0.8 : 0.4} />
                        <text x={665 + (m.f1Macro / 100) * 130} y={y + 16} fill="#059669" fontSize="8.5" fontWeight="bold">{m.f1Macro.toFixed(2)}</text>
                    </g>
                )
            })}
        </svg>
    )
}

function ConfusionMatrixSVG() {
    const cm = CONFUSION_MATRICES["BSO-RF"]
    const labels = ["Backdoor", "Benign", "ACK_Frag", "SYN_Flood", "PortScan"]
    const maxVal = Math.max(...cm.matrix.flat())
    const cellSize = 72, startX = 130, startY = 75
    return (
        <svg viewBox="0 0 550 520" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="275" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">BSO-Hybrid RF — Karışıklık Matrisi</text>
            <text x="275" y="40" textAnchor="middle" fontSize="10" fill="#64748b">Test Seti: 20.644 örnek</text>
            <text x="275" y="62" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">Tahmin Edilen Sınıf</text>
            <text x="18" y="280" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold" transform="rotate(-90, 18, 280)">Gerçek Sınıf</text>
            {labels.map((l, j) => (
                <text key={`h-${j}`} x={startX + j * cellSize + cellSize / 2} y={startY - 8} textAnchor="middle" fill="#64748b" fontSize="8.5" fontWeight="bold" transform={`rotate(-25, ${startX + j * cellSize + cellSize / 2}, ${startY - 8})`}>{l}</text>
            ))}
            {labels.map((l, i) => (
                <text key={`r-${i}`} x={startX - 8} y={startY + i * cellSize + cellSize / 2 + 4} textAnchor="end" fill="#64748b" fontSize="8.5" fontWeight="bold">{l}</text>
            ))}
            {cm.matrix.map((row, i) => row.map((val, j) => {
                const x = startX + j * cellSize, y = startY + i * cellSize
                const intensity = val / maxVal, isDiag = i === j
                const r = isDiag ? Math.round(34 + (1 - intensity) * 200) : Math.round(220 + (1 - intensity) * 35)
                const g = isDiag ? Math.round(120 + (1 - intensity) * 135) : Math.round(38 + (1 - intensity) * 217)
                const b = isDiag ? Math.round(69 + (1 - intensity) * 186) : Math.round(38 + (1 - intensity) * 217)
                return (
                    <g key={`${i}-${j}`}>
                        <rect x={x + 1} y={y + 1} width={cellSize - 2} height={cellSize - 2} rx="4" fill={val === 0 ? "#f8fafc" : `rgb(${r},${g},${b})`} stroke={isDiag ? "#059669" : "#e2e8f0"} strokeWidth={isDiag ? 2 : 0.5} />
                        <text x={x + cellSize / 2} y={y + cellSize / 2 + 5} textAnchor="middle" fill={isDiag && intensity > 0.3 ? "white" : "#334155"} fontSize={val > 999 ? "11" : "12"} fontWeight={isDiag ? "bold" : "normal"}>{val.toLocaleString()}</text>
                    </g>
                )
            }))}
            <text x="275" y={startY + 5 * cellSize + 20} textAnchor="middle" fill="#64748b" fontSize="9">Doğ. Oranları: Backdoor %65.4 | Benign %85.6 | ACK_Frag %100.0 | SYN_Flood %99.9 | PortScan %76.9</text>
        </svg>
    )
}

function ROCCurvesSVG() {
    const models = [
        { name: "BSO-Hybrid RF", auc: 0.9838, color: "#3b82f6", steep: 26 },
        { name: "XGBoost", auc: 0.9851, color: "#059669", steep: 27 },
        { name: "Random Forest", auc: 0.9836, color: "#f59e0b", steep: 26 },
        { name: "GWO-RF", auc: 0.9837, color: "#8b5cf6", steep: 26 },
        { name: "Decision Tree", auc: 0.9120, color: "#dc2626", steep: 12 },
    ]
    const cx = 80, cy = 40, cw = 420, ch = 420
    const toX = (fpr: number) => cx + fpr * cw
    const toY = (tpr: number) => cy + ch - tpr * ch
    return (
        <svg viewBox="0 0 680 540" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="340" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">ROC Eğrileri — Seçili Modeller</text>
            {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
                <g key={v}><line x1={cx} y1={toY(v)} x2={cx + cw} y2={toY(v)} stroke="#e2e8f0" strokeWidth="0.5" />
                    <text x={cx - 8} y={toY(v) + 4} textAnchor="end" fill="#94a3b8" fontSize="8">{v.toFixed(1)}</text>
                    <line x1={toX(v)} y1={cy} x2={toX(v)} y2={cy + ch} stroke="#e2e8f0" strokeWidth="0.5" />
                    <text x={toX(v)} y={cy + ch + 15} textAnchor="middle" fill="#94a3b8" fontSize="8">{v.toFixed(1)}</text></g>
            ))}
            <line x1={cx} y1={cy} x2={cx} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
            <line x1={cx} y1={cy + ch} x2={cx + cw} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
            <line x1={cx} y1={cy + ch} x2={cx + cw} y2={cy} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="6 3" />
            {models.map((m) => {
                const pts: string[] = []; for (let fpr = 0; fpr <= 1; fpr += 0.01) { const tpr = Math.min(1, 1 - Math.pow(1 - fpr, m.steep) * (1 - (m.auc - 0.5) * 2)); pts.push(`${fpr === 0 ? "M" : "L"}${toX(fpr).toFixed(1)},${toY(tpr).toFixed(1)}`) }
                return <path key={m.name} d={pts.join(" ")} fill="none" stroke={m.color} strokeWidth={m.name.includes("BSO") ? 3 : 1.5} strokeDasharray={m.name.includes("BSO") ? "" : "4 2"} />
            })}
            <text x={cx + cw / 2} y={cy + ch + 32} textAnchor="middle" fill="#64748b" fontSize="10">Yanlış Pozitif Oranı (FPR)</text>
            <text x="20" y={cy + ch / 2} textAnchor="middle" fill="#64748b" fontSize="10" transform={`rotate(-90, 20, ${cy + ch / 2})`}>Doğru Pozitif Oranı (TPR)</text>
            {models.map((m, i) => (
                <g key={i}><line x1="530" y1={60 + i * 22} x2="560" y2={60 + i * 22} stroke={m.color} strokeWidth={m.name.includes("BSO") ? 2.5 : 1.5} strokeDasharray={m.name.includes("BSO") ? "" : "4 2"} />
                    <text x="565" y={64 + i * 22} fill={m.color} fontSize="9" fontWeight={m.name.includes("BSO") ? "bold" : "normal"}>{m.name} (AUC={m.auc.toFixed(4)})</text></g>
            ))}
        </svg>
    )
}

function AblationResultsSVG() {
    const scenarios = [
        { id: "S1", acc: 87.04, f1: 78.57, auc: 97.44, color: "#6b7280" },
        { id: "S2", acc: 88.47, f1: 82.35, auc: 97.93, color: "#3b82f6" },
        { id: "S3", acc: 89.74, f1: 84.13, auc: 98.36, color: "#f59e0b" },
        { id: "S4", acc: 89.82, f1: 84.24, auc: 98.38, color: "#22c55e" },
    ]
    const metrics = ["Doğruluk", "F1-Macro", "AUC-ROC"]
    const cx = 100, cy = 50, barW = 45, groupGap = 30, chartH = 220
    return (
        <svg viewBox="0 0 750 370" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="375" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">S1–S4 Ablasyon Çalışması Sonuçları</text>
            {metrics.map((metric, mi) => {
                const gx = cx + mi * (scenarios.length * barW + groupGap + 20); return (
                    <g key={metric}><text x={gx + scenarios.length * barW / 2} y={cy - 5} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">{metric}</text>
                        {scenarios.map((s, si) => {
                            const val = mi === 0 ? s.acc : mi === 1 ? s.f1 : s.auc; const h = (val / 100) * chartH; const x = gx + si * barW; const y = cy + chartH - h; return (
                                <g key={s.id}><rect x={x + 2} y={y} width={barW - 4} height={h} rx="4" fill={s.color} fillOpacity="0.7" />
                                    <text x={x + barW / 2} y={y - 5} textAnchor="middle" fill={s.color} fontSize="8" fontWeight="bold">{val.toFixed(1)}%</text>
                                    <text x={x + barW / 2} y={cy + chartH + 15} textAnchor="middle" fill={s.color} fontSize="9" fontWeight="bold">{s.id}</text></g>
                            )
                        })}</g>
                )
            })}
            <line x1={cx} y1={cy + chartH} x2={cx + 3 * (scenarios.length * barW + groupGap + 20) - groupGap - 20} y2={cy + chartH} stroke="#94a3b8" strokeWidth="1" />
            {scenarios.map((s, i) => (
                <g key={i}><rect x={150 + i * 140} y="325" width="14" height="14" rx="3" fill={s.color} fillOpacity="0.7" />
                    <text x={170 + i * 140} y="337" fill={s.color} fontSize="9" fontWeight="bold">{s.id}: {["Temel", "+ÖS", "+HP", "Tam"][i]}</text></g>
            ))}
            <rect x="200" y="348" width="350" height="18" rx="4" fill="#f0fdf4" stroke="#22c55e" strokeWidth="1" />
            <text x="375" y="361" textAnchor="middle" fill="#065f46" fontSize="9" fontWeight="bold">S1→S4: Doğruluk +2.78pp | F1-Macro +5.67pp | AUC-ROC +0.94pp</text>
        </svg>
    )
}

function CVResultsSVG() {
    const results = CROSS_VALIDATION.results
    const cx = 80, cy = 40, cw = 580, ch = 200, yMin = 90.0, yMax = 92.0
    const toX = (i: number) => cx + (i / (results.length - 1)) * cw
    const toY = (v: number) => cy + ch - ((v - yMin) / (yMax - yMin)) * ch
    const accPath = results.map((r, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(r.accuracy).toFixed(1)}`).join(" ")
    const f1Path = results.map((r, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(r.f1Score).toFixed(1)}`).join(" ")
    return (
        <svg viewBox="0 0 780 340" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <text x="390" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">10-Katlı Çapraz Doğrulama Sonuçları</text>
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
                const y = cy + frac * ch; return (
                    <g key={frac}><line x1={cx} y1={y} x2={cx + cw} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                        <text x={cx - 8} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="8">%{(yMax - frac * (yMax - yMin)).toFixed(1)}</text></g>
                )
            })}
            {results.map((r, i) => (<text key={i} x={toX(i)} y={cy + ch + 15} textAnchor="middle" fill="#64748b" fontSize="9">K{r.fold}</text>))}
            <line x1={cx} y1={cy} x2={cx} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
            <line x1={cx} y1={cy + ch} x2={cx + cw} y2={cy + ch} stroke="#94a3b8" strokeWidth="1" />
            <line x1={cx} y1={toY(CROSS_VALIDATION.mean.accuracy)} x2={cx + cw} y2={toY(CROSS_VALIDATION.mean.accuracy)} stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
            <line x1={cx} y1={toY(CROSS_VALIDATION.mean.f1Score)} x2={cx + cw} y2={toY(CROSS_VALIDATION.mean.f1Score)} stroke="#059669" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
            <path d={accPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
            <path d={f1Path} fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="6 3" />
            {results.map((r, i) => (
                <g key={i}><circle cx={toX(i)} cy={toY(r.accuracy)} r="4" fill="#3b82f6" />
                    <circle cx={toX(i)} cy={toY(r.f1Score)} r="3.5" fill="#059669" /></g>
            ))}
            <text x={cx + cw / 2} y={cy + ch + 30} textAnchor="middle" fill="#64748b" fontSize="10">Katman (Fold)</text>
            <line x1="200" y1="295" x2="230" y2="295" stroke="#3b82f6" strokeWidth="2.5" />
            <text x="235" y="299" fill="#3b82f6" fontSize="9" fontWeight="bold">Doğruluk (Ort: %{CROSS_VALIDATION.mean.accuracy} ± {CROSS_VALIDATION.std.accuracy})</text>
            <line x1="480" y1="295" x2="510" y2="295" stroke="#059669" strokeWidth="2" strokeDasharray="6 3" />
            <text x="515" y="299" fill="#059669" fontSize="9" fontWeight="bold">F1-Skor (Ort: %{CROSS_VALIDATION.mean.f1Score} ± {CROSS_VALIDATION.std.f1Score})</text>
            <rect x="200" y="310" width="380" height="18" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" />
            <text x="390" y="323" textAnchor="middle" fill="#1e40af" fontSize="9" fontWeight="bold">Std Dev = ±{CROSS_VALIDATION.std.accuracy} → Yüksek kararlılık (düşük varyans)</text>
        </svg>
    )
}

/* ═══════════════════════════════════════════════════════════════
   Figure renderer mapping — ALL 18 figures
   ═══════════════════════════════════════════════════════════════ */
const SVG_RENDERERS: Record<string, () => React.ReactNode> = {
    "sekil-1-1": DDoSTaxonomySVG,
    "sekil-1-2": IoTArchitectureSVG,
    "sekil-1-3": IDSArchitectureSVG,
    "sekil-2-1": MetaheuristicTaxonomySVG,
    "sekil-2-2": BatEcholocationSVG,
    "sekil-2-3": RelatedWorksSVG,
    "sekil-3-1": SystemArchitectureSVG,
    "sekil-3-2": BSOFlowchartSVG,
    "sekil-3-3": SolutionVectorSVG,
    "sekil-3-4": SMOTEProcessSVG,
    "sekil-3-5": CVDiagramSVG,
    "sekil-3-6": ExperimentDesignSVG,
    "sekil-4-1": ClassDistributionSVG,
    "sekil-4-2": BSOConvergenceSVG,
    "sekil-4-3": FeatureImportanceSVG,
    "sekil-4-4": ModelComparisonSVG,
    "sekil-4-5": ConfusionMatrixSVG,
    "sekil-4-6": ROCCurvesSVG,
    "sekil-4-7": AblationResultsSVG,
    "sekil-4-8": CVResultsSVG,
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT — Click to expand
   ═══════════════════════════════════════════════════════════════ */
export default function ThesisFigures() {
    const { copied, copy } = useCopy()
    const [filter, setFilter] = useState<number | null>(null)
    const [expanded, setExpanded] = useState<Set<string>>(new Set())

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id); else next.add(id)
            return next
        })
    }

    const chapters = [1, 2, 3, 4]
    const filtered = filter === null ? THESIS_FIGURES : THESIS_FIGURES.filter((f) => f.chapter === filter)

    const expandAll = () => setExpanded(new Set(filtered.map((f) => f.id)))
    const collapseAll = () => setExpanded(new Set())

    const downloadSVG = (id: string) => {
        const svgEl = document.getElementById(`svg-${id}`)
        if (!svgEl) return
        const svgData = new XMLSerializer().serializeToString(svgEl)
        const blob = new Blob([svgData], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `${id}.svg`; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-sky-500/30 bg-gradient-to-r from-sky-500/5 via-background to-blue-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sky-500/10 rounded-lg"><Image className="w-6 h-6 text-sky-500" /></div>
                            <div>
                                <CardTitle className="text-xl">Tez Şekilleri ve Diyagramları</CardTitle>
                                <CardDescription>{THESIS_FIGURES.length} akademik şekil — tümü SVG olarak çizilmiştir. Tıklayarak açın, SVG olarak indirin.</CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Badge className="bg-sky-600 text-white">{THESIS_FIGURES.length} Şekil</Badge>
                            <Badge className="bg-emerald-600 text-white">{Object.keys(SVG_RENDERERS).length} SVG</Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Chapter Filter + Expand/Collapse */}
            <div className="flex flex-wrap gap-2 items-center">
                <Button variant={filter === null ? "default" : "outline"} size="sm" onClick={() => setFilter(null)} className="text-xs">Tümü ({THESIS_FIGURES.length})</Button>
                {chapters.map((ch) => {
                    const count = THESIS_FIGURES.filter((f) => f.chapter === ch).length
                    return <Button key={ch} variant={filter === ch ? "default" : "outline"} size="sm" onClick={() => setFilter(ch)} className="text-xs">Bölüm {ch} ({count})</Button>
                })}
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" onClick={expandAll} className="text-xs"><Eye className="w-3.5 h-3.5 mr-1" /> Tümünü Aç</Button>
                    <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs"><ChevronUp className="w-3.5 h-3.5 mr-1" /> Tümünü Kapat</Button>
                </div>
            </div>

            {/* Figures */}
            {filtered.map((fig) => {
                const typeConf = figureTypeConfig[fig.type] || figureTypeConfig.system
                const TypeIcon = typeConf.icon
                const Renderer = SVG_RENDERERS[fig.id]
                const captionText = `${fig.number}: ${fig.title}`
                const isOpen = expanded.has(fig.id)

                return (
                    <Card key={fig.id} id={`figure-${fig.id}`} className="overflow-hidden">
                        <CardHeader className="pb-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none" onClick={() => toggle(fig.id)}>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${typeConf.bg}`}><TypeIcon className={`w-5 h-5 ${typeConf.color}`} /></div>
                                    <div>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            {fig.number}: {fig.title}
                                            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                        </CardTitle>
                                        <CardDescription className="text-[11px] mt-0.5">{fig.titleEn}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <Badge variant="outline" className="text-[10px]">Bölüm {fig.chapter}</Badge>
                                    <Button variant="outline" size="sm" className="text-[10px] h-7 px-2" onClick={() => copy(`cap-${fig.id}`, captionText)}>
                                        {copied === `cap-${fig.id}` ? <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> : <Copy className="w-3 h-3 mr-1" />} Başlık
                                    </Button>
                                    {Renderer && (
                                        <Button variant="outline" size="sm" className="text-[10px] h-7 px-2" onClick={() => downloadSVG(fig.id)}>
                                            <Download className="w-3 h-3 mr-1" /> SVG
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        {isOpen && (
                            <CardContent className="space-y-3 pt-0">
                                {Renderer ? (
                                    <div id={`svg-${fig.id}`} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
                                        <Renderer />
                                    </div>
                                ) : (
                                    <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-center">
                                        <TypeIcon className={`w-12 h-12 mx-auto mb-3 ${typeConf.color} opacity-40`} />
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{fig.title}</p>
                                    </div>
                                )}
                                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-start gap-2">
                                        <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{fig.description}</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/40">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-2 flex-1">
                                            <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div className="text-[11px] text-blue-700 dark:text-blue-300"><strong>Kaynak:</strong> {fig.source}</div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 text-blue-600" onClick={() => copy(`src-${fig.id}`, fig.source)}>
                                            {copied === `src-${fig.id}` ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                )
            })}

            {/* Summary Footer */}
            <Card className="bg-gradient-to-r from-sky-500/5 to-blue-500/5 border-sky-500/20">
                <CardContent className="pt-4 pb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {chapters.map((ch) => (
                            <div key={ch} className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg border">
                                <div className="text-lg font-bold text-slate-800 dark:text-white">{THESIS_FIGURES.filter((f) => f.chapter === ch).length}</div>
                                <div className="text-[10px] text-slate-500">Bölüm {ch}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-3">Tüm {THESIS_FIGURES.length} şekil SVG olarak çizilmiştir. Başlıkları kopyalayın, SVG olarak indirin.</p>
                </CardContent>
            </Card>
        </div>
    )
}
