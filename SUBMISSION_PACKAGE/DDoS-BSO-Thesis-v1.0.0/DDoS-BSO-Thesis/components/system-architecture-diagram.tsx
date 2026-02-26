"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Download, Sparkles } from "lucide-react"
import { DATASET_STATISTICS, BSO_PARAMETERS, MODEL_RESULTS, BSO_SELECTED_FEATURES } from "@/lib/ciciot2023-dataset"
import { useRef, useCallback } from "react"

// ──────────────────────────────────────────────────────────────
// Professional SVG System Architecture Diagram — Turkish
// Designed for Master's Thesis — Academic Quality
// ──────────────────────────────────────────────────────────────

const COLORS = {
    dataCollection: { fill: "#EEF2FF", stroke: "#4F46E5", text: "#312E81", headerFill: "#4F46E5", lightBg: "#E0E7FF" },
    preprocessing: { fill: "#FDF4FF", stroke: "#9333EA", text: "#581C87", headerFill: "#9333EA", lightBg: "#F3E8FF" },
    smote: { fill: "#FFFBEB", stroke: "#D97706", text: "#78350F", headerFill: "#D97706", lightBg: "#FEF3C7" },
    bso: { fill: "#ECFDF5", stroke: "#059669", text: "#064E3B", headerFill: "#059669", lightBg: "#D1FAE5" },
    training: { fill: "#FFF1F2", stroke: "#E11D48", text: "#881337", headerFill: "#E11D48", lightBg: "#FFE4E6" },
    evaluation: { fill: "#EFF6FF", stroke: "#2563EB", text: "#1E3A5F", headerFill: "#2563EB", lightBg: "#DBEAFE" },
    arrow: "#475569",
    feedback: "#DC2626",
}

export default function SystemArchitectureDiagram() {
    const svgRef = useRef<SVGSVGElement>(null)

    const handleDownloadSVG = useCallback(() => {
        if (!svgRef.current) return
        const svgData = new XMLSerializer().serializeToString(svgRef.current)
        const blob = new Blob([svgData], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "sistem-mimarisi-bso-hibrit-rf.svg"
        a.style.display = "none"
        document.body.appendChild(a)
        a.click()
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 100)
    }, [])

    const handleDownloadPNG = useCallback(() => {
        if (!svgRef.current) return
        const svgData = new XMLSerializer().serializeToString(svgRef.current)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        const img = new window.Image()
        img.onload = () => {
            canvas.width = img.width * 3
            canvas.height = img.height * 3
            ctx.scale(3, 3)
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
            canvas.toBlob((blob) => {
                if (!blob) return
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "sistem-mimarisi-bso-hibrit-rf.png"
                a.style.display = "none"
                document.body.appendChild(a)
                a.click()
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 100)
            }, "image/png")
        }
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    }, [])

    const W = 920
    const H = 1460

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 via-blue-500/5 to-violet-500/5 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500" />
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/20">
                                <GitBranch className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Sistem Mimarisi Diyagramı</CardTitle>
                                <CardDescription>
                                    Önerilen BSO-Hibrit RF Sistemi — Akademik Kalitede SVG Diyagramı
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-0 shadow-sm">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Şekil 3.1
                            </Badge>
                            <button onClick={handleDownloadSVG}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 transition-colors shadow-sm">
                                <Download className="w-3.5 h-3.5" /> SVG İndir
                            </button>
                            <button onClick={handleDownloadPNG}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-colors shadow-sm">
                                <Download className="w-3.5 h-3.5" /> PNG (Yüksek Çöz.)
                            </button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* SVG Diagram */}
            <Card className="border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-white overflow-x-auto shadow-lg">
                <CardContent className="pt-6 flex justify-center">
                    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width={W} height={H}
                        className="max-w-full h-auto" xmlns="http://www.w3.org/2000/svg"
                        style={{ background: "white" }}>
                        <defs>
                            <marker id="ah" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#334155" />
                            </marker>
                            <marker id="ah-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.feedback} />
                            </marker>
                            <filter id="ds" x="-3%" y="-3%" width="106%" height="106%">
                                <feDropShadow dx="1" dy="2" stdDeviation="3" floodOpacity="0.08" />
                            </filter>
                            <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4F46E5" />
                                <stop offset="50%" stopColor="#2563EB" />
                                <stop offset="100%" stopColor="#0891B2" />
                            </linearGradient>
                            <linearGradient id="timelineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#4F46E5" />
                                <stop offset="25%" stopColor="#9333EA" />
                                <stop offset="50%" stopColor="#059669" />
                                <stop offset="75%" stopColor="#E11D48" />
                                <stop offset="100%" stopColor="#2563EB" />
                            </linearGradient>
                        </defs>

                        {/* ──── Background Decoration ──── */}
                        <rect x="0" y="0" width={W} height={H} fill="#FAFBFC" />
                        <rect x="10" y="10" width={W - 20} height={H - 20} rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />

                        {/* ──── Title Block ──── */}
                        <rect x="30" y="22" width={W - 60} height="55" rx="8" fill="url(#titleGrad)" />
                        <text x={W / 2} y="46" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white"
                            fontFamily="'Segoe UI','Helvetica Neue',sans-serif">
                            Şekil 3.1: Önerilen BSO-Hibrit RF Sistem Mimarisi
                        </text>
                        <text x={W / 2} y="65" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.85)"
                            fontFamily="'Segoe UI',sans-serif">
                            Dinamik Ağ Ortamlarında Geliştirilmiş DDoS Saldırı Tespiti İçin
                        </text>

                        {/* Timeline bar on left */}
                        <rect x="18" y="90" width="4" height={H - 120} rx="2" fill="url(#timelineGrad)" opacity="0.3" />

                        {/* ══════════ AŞAMA 1: VERİ TOPLAMA ══════════ */}
                        <g filter="url(#ds)">
                            <rect x="55" y="95" width="810" height="118" rx="10" fill={COLORS.dataCollection.fill} stroke={COLORS.dataCollection.stroke} strokeWidth="2" />
                            <rect x="55" y="95" width="810" height="34" rx="10" fill={COLORS.dataCollection.headerFill} />
                            <rect x="55" y="119" width="810" height="10" fill={COLORS.dataCollection.headerFill} />
                        </g>
                        <circle cx="80" cy="112" r="12" fill="white" />
                        <text x="80" y="116.5" textAnchor="middle" fontSize="13" fontWeight="bold" fill={COLORS.dataCollection.stroke}>1</text>
                        <text x="100" y="110" fontSize="13" fontWeight="bold" fill="white" fontFamily="'Segoe UI',sans-serif">Aşama 1: Veri Toplama</text>
                        <text x="100" y="124" fontSize="9" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Aşama 1: CICIoT2023 Veri Seti</text>

                        <text x="72" y="152" fontSize="10.5" fill={COLORS.dataCollection.text} fontFamily="sans-serif">
                            • CICIoT2023 Veri Seti — {DATASET_STATISTICS.totalSamples.toLocaleString()} ağ trafiği örneği, {DATASET_STATISTICS.totalFeatures} öznitelik
                        </text>
                        <text x="72" y="170" fontSize="10.5" fill={COLORS.dataCollection.text} fontFamily="sans-serif">
                            • {DATASET_STATISTICS.classes} trafik sınıfı: BenignTraffic, DDoS-ACK_Fragmentation, DDoS-SYN_Flood, Backdoor_Malware, Recon-PortScan
                        </text>
                        <text x="72" y="188" fontSize="10.5" fill={COLORS.dataCollection.text} fontFamily="sans-serif">
                            • Paket düzeyinde ve akış düzeyinde istatistiksel öznitelikler (süre, bayt, paket, bayrak, IAT)
                        </text>

                        {/* Dataset splits */}
                        <rect x="610" y="144" width="80" height="24" rx="5" fill="white" stroke={COLORS.dataCollection.stroke} strokeWidth="1.2" />
                        <text x="650" y="160" textAnchor="middle" fontSize="9" fill={COLORS.dataCollection.text} fontWeight="600">Eğitim: %70</text>
                        <rect x="698" y="144" width="80" height="24" rx="5" fill="white" stroke={COLORS.dataCollection.stroke} strokeWidth="1.2" />
                        <text x="738" y="160" textAnchor="middle" fontSize="9" fill={COLORS.dataCollection.text} fontWeight="600">Test: %20</text>
                        <rect x="786" y="144" width="68" height="24" rx="5" fill="white" stroke={COLORS.dataCollection.stroke} strokeWidth="1.2" />
                        <text x="820" y="160" textAnchor="middle" fontSize="9" fill={COLORS.dataCollection.text} fontWeight="600">Doğ: %10</text>

                        {/* Arrow 1→2 */}
                        <line x1={W / 2} y1="213" x2={W / 2} y2="243" stroke={COLORS.arrow} strokeWidth="2" markerEnd="url(#ah)" />
                        <rect x={W / 2 - 60} y="220" width="120" height="16" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.8" />
                        <text x={W / 2} y="231" textAnchor="middle" fontSize="8" fill="#64748B" fontWeight="500">Ham 39 öznitelik</text>

                        {/* ══════════ AŞAMA 2: ÖN İŞLEME ══════════ */}
                        <g filter="url(#ds)">
                            <rect x="55" y="248" width="810" height="125" rx="10" fill={COLORS.preprocessing.fill} stroke={COLORS.preprocessing.stroke} strokeWidth="2" />
                            <rect x="55" y="248" width="810" height="34" rx="10" fill={COLORS.preprocessing.headerFill} />
                            <rect x="55" y="272" width="810" height="10" fill={COLORS.preprocessing.headerFill} />
                        </g>
                        <circle cx="80" cy="265" r="12" fill="white" />
                        <text x="80" y="269.5" textAnchor="middle" fontSize="13" fontWeight="bold" fill={COLORS.preprocessing.stroke}>2</text>
                        <text x="100" y="263" fontSize="13" fontWeight="bold" fill="white" fontFamily="'Segoe UI',sans-serif">Aşama 2: Veri Ön İşleme</text>
                        <text x="100" y="277" fontSize="9" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Aşama 2: Temizleme, Kodlama, Normalizasyon</text>

                        {/* Process flow boxes */}
                        <rect x="75" y="293" width="145" height="32" rx="6" fill="white" stroke={COLORS.preprocessing.stroke} strokeWidth="1.3" />
                        <text x="147" y="313" textAnchor="middle" fontSize="9.5" fill={COLORS.preprocessing.text} fontWeight="600">Eksik Değer Temizleme</text>

                        <line x1="220" y1="309" x2="238" y2="309" stroke={COLORS.arrow} strokeWidth="1.5" markerEnd="url(#ah)" />

                        <rect x="243" y="293" width="140" height="32" rx="6" fill="white" stroke={COLORS.preprocessing.stroke} strokeWidth="1.3" />
                        <text x="313" y="313" textAnchor="middle" fontSize="9.5" fill={COLORS.preprocessing.text} fontWeight="600">Tekrar Kaldırma</text>

                        <line x1="383" y1="309" x2="401" y2="309" stroke={COLORS.arrow} strokeWidth="1.5" markerEnd="url(#ah)" />

                        <rect x="406" y="293" width="130" height="32" rx="6" fill="white" stroke={COLORS.preprocessing.stroke} strokeWidth="1.3" />
                        <text x="471" y="313" textAnchor="middle" fontSize="9.5" fill={COLORS.preprocessing.text} fontWeight="600">Etiket Kodlama</text>

                        <line x1="536" y1="309" x2="554" y2="309" stroke={COLORS.arrow} strokeWidth="1.5" markerEnd="url(#ah)" />

                        <rect x="559" y="293" width="170" height="32" rx="6" fill="white" stroke={COLORS.preprocessing.stroke} strokeWidth="1.3" />
                        <text x="644" y="307" textAnchor="middle" fontSize="9" fill={COLORS.preprocessing.text} fontWeight="600">Min-Max Normalizasyon</text>
                        <text x="644" y="320" textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="monospace">x&apos; = (x−xₘᵢₙ)/(xₘₐₓ−xₘᵢₙ)</text>

                        <rect x="740" y="293" width="112" height="32" rx="6" fill={COLORS.preprocessing.lightBg} stroke={COLORS.preprocessing.stroke} strokeWidth="1.3" />
                        <text x="796" y="313" textAnchor="middle" fontSize="9.5" fill={COLORS.preprocessing.text} fontWeight="700">Tabakalı Bölme</text>

                        <text x="147" y="348" fontSize="9.5" fill={COLORS.preprocessing.text} fontFamily="sans-serif">
                            • Tabakalı eğitim/doğrulama/test bölmesi (%70/%10/%20) — sınıf dağılımı korunarak
                        </text>
                        <text x="147" y="362" fontSize="9.5" fill={COLORS.preprocessing.text} fontFamily="sans-serif">
                            • Ayrılmış test seti: 23.693 örnek (eğitim veya optimizasyon sırasında hiç görülmez)
                        </text>

                        {/* Arrow 2→3 */}
                        <line x1={W / 2} y1="373" x2={W / 2} y2="400" stroke={COLORS.arrow} strokeWidth="2" markerEnd="url(#ah)" />
                        <rect x={W / 2 - 75} y="379" width="150" height="16" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.8" />
                        <text x={W / 2} y="390" textAnchor="middle" fontSize="8" fill="#64748B" fontWeight="500">Temiz normalize veri</text>

                        {/* ══════════ AŞAMA 3: SMOTE ══════════ */}
                        <g filter="url(#ds)">
                            <rect x="120" y="405" width="680" height="100" rx="10" fill={COLORS.smote.fill} stroke={COLORS.smote.stroke} strokeWidth="2" />
                            <rect x="120" y="405" width="680" height="34" rx="10" fill={COLORS.smote.headerFill} />
                            <rect x="120" y="429" width="680" height="10" fill={COLORS.smote.headerFill} />
                        </g>
                        <circle cx="145" cy="422" r="12" fill="white" />
                        <text x="145" y="426.5" textAnchor="middle" fontSize="13" fontWeight="bold" fill={COLORS.smote.stroke}>3</text>
                        <text x="165" y="420" fontSize="13" fontWeight="bold" fill="white" fontFamily="'Segoe UI',sans-serif">Aşama 3: Sınıf Dengeleme (SMOTE)</text>
                        <text x="165" y="434" fontSize="9" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Aşama 3: SMOTE ile Azınlık Sınıf Dengeleme</text>

                        <text x="137" y="460" fontSize="10.5" fill={COLORS.smote.text} fontFamily="sans-serif">
                            • SMOTE yalnızca eğitim setine uygulandı (k=5 en yakın komşu)
                        </text>
                        <text x="137" y="478" fontSize="10.5" fill={COLORS.smote.text} fontFamily="sans-serif">
                            • Eğitim örnekleri: 72.252 → 87.500 ({DATASET_STATISTICS.classes} sınıf arasında dengeli)
                        </text>

                        {/* Before/After */}
                        <rect x="560" y="452" width="95" height="24" rx="5" fill="white" stroke={COLORS.smote.stroke} strokeWidth="1" />
                        <text x="607" y="468" textAnchor="middle" fontSize="8.5" fill={COLORS.smote.text} fontWeight="600">Önce: 72.252</text>
                        <line x1="655" y1="464" x2="673" y2="464" stroke={COLORS.arrow} strokeWidth="1.5" markerEnd="url(#ah)" />
                        <rect x="678" y="452" width="95" height="24" rx="5" fill="#D1FAE5" stroke="#059669" strokeWidth="1.2" />
                        <text x="725" y="468" textAnchor="middle" fontSize="8.5" fill="#064E3B" fontWeight="700">Sonra: 87.500</text>

                        {/* Arrow 3→4 */}
                        <line x1={W / 2} y1="505" x2={W / 2} y2="533" stroke={COLORS.arrow} strokeWidth="2" markerEnd="url(#ah)" />
                        <rect x={W / 2 - 80} y="510" width="160" height="16" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.8" />
                        <text x={W / 2} y="521" textAnchor="middle" fontSize="8" fill="#64748B" fontWeight="500">Dengeli eğitim verisi</text>

                        {/* ══════════ AŞAMA 4: BSO OPTİMİZASYONU ══════════ */}
                        <g filter="url(#ds)">
                            <rect x="35" y="538" width="850" height="370" rx="10" fill={COLORS.bso.fill} stroke={COLORS.bso.stroke} strokeWidth="2.5" />
                            <rect x="35" y="538" width="850" height="36" rx="10" fill={COLORS.bso.headerFill} />
                            <rect x="35" y="564" width="850" height="10" fill={COLORS.bso.headerFill} />
                        </g>
                        <circle cx="60" cy="556" r="12" fill="white" />
                        <text x="60" y="560.5" textAnchor="middle" fontSize="13" fontWeight="bold" fill={COLORS.bso.stroke}>4</text>
                        <text x="80" y="554" fontSize="13" fontWeight="bold" fill="white" fontFamily="'Segoe UI',sans-serif">Aşama 4: BSO-Hibrit Optimizasyon (Yarasa Sürüsü Optimizasyonu)</text>
                        <text x="80" y="568" fontSize="9" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Aşama 4: Öznitelik Seçimi + Hiper-Parametre Ayarlama</text>

                        {/* Parameters Box */}
                        <rect x="52" y="586" width="240" height="140" rx="8" fill="white" stroke={COLORS.bso.stroke} strokeWidth="1.5" />
                        <rect x="52" y="586" width="240" height="24" rx="8" fill={COLORS.bso.lightBg} />
                        <rect x="52" y="604" width="240" height="6" fill={COLORS.bso.lightBg} />
                        <text x="172" y="603" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={COLORS.bso.text}>BSO Parametreleri</text>
                        {[
                            `Popülasyon (N) = ${BSO_PARAMETERS.populationSize}`,
                            `Maks İterasyon (T) = ${BSO_PARAMETERS.maxIterations}`,
                            `Frekans: f ∈ [${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}]`,
                            `Ses Yüksekliği (A₀) = ${BSO_PARAMETERS.initialLoudness}`,
                            `Darbe Oranı (r₀) = ${BSO_PARAMETERS.initialPulseRate}`,
                            `α = ${BSO_PARAMETERS.alpha}, γ = ${BSO_PARAMETERS.gamma}`,
                        ].map((p, i) => (
                            <text key={i} x="62" y={625 + i * 15} fontSize="9.5" fill="#334155" fontFamily="'Consolas','Courier New',monospace">{p}</text>
                        ))}

                        {/* Search Space Box */}
                        <rect x="306" y="586" width="255" height="140" rx="8" fill="white" stroke={COLORS.bso.stroke} strokeWidth="1.5" />
                        <rect x="306" y="586" width="255" height="24" rx="8" fill={COLORS.bso.lightBg} />
                        <rect x="306" y="604" width="255" height="6" fill={COLORS.bso.lightBg} />
                        <text x="433" y="603" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={COLORS.bso.text}>Ortak Arama Uzayı</text>
                        {[
                            `Öznitelik Maskesi: x ∈ {0,1}^${DATASET_STATISTICS.totalFeatures}`,
                            "n_estimators ∈ [50, 500]",
                            "max_depth ∈ [5, 50]",
                            "min_samples_split ∈ [2, 20]",
                            "max_features ∈ [0.1, 1.0]",
                            "Uygunluk: F1-makro skoru",
                        ].map((p, i) => (
                            <text key={i} x="316" y={625 + i * 15} fontSize="9.5" fill="#334155" fontFamily="'Consolas','Courier New',monospace">{p}</text>
                        ))}

                        {/* Optimization Loop Box */}
                        <rect x="575" y="586" width="295" height="140" rx="8" fill="white" stroke={COLORS.bso.stroke} strokeWidth="1.5" />
                        <rect x="575" y="586" width="295" height="24" rx="8" fill={COLORS.bso.lightBg} />
                        <rect x="575" y="604" width="295" height="6" fill={COLORS.bso.lightBg} />
                        <text x="722" y="603" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={COLORS.bso.text}>İteratif Optimizasyon Döngüsü</text>
                        {[
                            "1. Rastgele yarasa pozisyonları başlat",
                            "2. Uygunluk değerlendir (RF → F1-makro)",
                            "3. fᵢ = fₘᵢₙ + (fₘₐₓ - fₘᵢₙ) × β",
                            "4. vᵢ(t+1) = vᵢ(t) + (xᵢ - x*) × fᵢ",
                            "5. Yerel arama: x = x_best + ε·A(t)",
                            "6. İterasyon 44'te yakınsama",
                        ].map((p, i) => (
                            <text key={i} x="585" y={625 + i * 15} fontSize="9.5" fill="#334155" fontFamily="'Consolas','Courier New',monospace">{p}</text>
                        ))}

                        {/* Sub-box arrows */}
                        <line x1="292" y1="656" x2="302" y2="656" stroke={COLORS.arrow} strokeWidth="1.5" markerEnd="url(#ah)" />
                        <line x1="561" y1="656" x2="571" y2="656" stroke={COLORS.arrow} strokeWidth="1.5" markerEnd="url(#ah)" />

                        {/* Convergence Info */}
                        <rect x="52" y="740" width="240" height="50" rx="8" fill="white" stroke={COLORS.bso.stroke} strokeWidth="1.2" />
                        <text x="172" y="758" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={COLORS.bso.text}>Yakınsama Bilgisi</text>
                        <text x="62" y="775" fontSize="9" fill="#475569" fontFamily="monospace">İter 44/{BSO_PARAMETERS.maxIterations} | En iyi F1: {MODEL_RESULTS[0].f1Macro}%</text>

                        {/* Selected Features Info */}
                        <rect x="306" y="740" width="255" height="50" rx="8" fill="white" stroke={COLORS.bso.stroke} strokeWidth="1.2" />
                        <text x="433" y="758" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={COLORS.bso.text}>Seçilen Öznitelikler</text>
                        <text x="316" y="775" fontSize="9" fill="#475569" fontFamily="monospace">{BSO_SELECTED_FEATURES.length}/{DATASET_STATISTICS.totalFeatures} öznitelik (%{DATASET_STATISTICS.featureReductionPct} azalma)</text>

                        {/* Optimal HP */}
                        <rect x="575" y="740" width="295" height="50" rx="8" fill="white" stroke={COLORS.bso.stroke} strokeWidth="1.2" />
                        <text x="722" y="758" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill={COLORS.bso.text}>Optimal Hiper-Parametreler</text>
                        <text x="585" y="775" fontSize="9" fill="#475569" fontFamily="monospace">n_est=266 | depth=20 | split=7 | feat=0.469</text>

                        {/* BSO Output Result */}
                        <rect x="90" y="810" width="740" height="52" rx="8" fill="white" stroke={COLORS.bso.stroke} strokeWidth="2" />
                        <rect x="90" y="810" width="740" height="18" rx="8" fill={COLORS.bso.lightBg} />
                        <rect x="90" y="822" width="740" height="6" fill={COLORS.bso.lightBg} />
                        <text x={W / 2} y="824" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={COLORS.bso.text}>
                            BSO Optimizasyon Çıktısı — Optimal Çözüm
                        </text>
                        <text x={W / 2} y="845" textAnchor="middle" fontSize="9.5" fill="#334155">
                            Seçilen: {BSO_SELECTED_FEATURES.length}/{DATASET_STATISTICS.totalFeatures} öznitelik ({((1 - BSO_SELECTED_FEATURES.length / DATASET_STATISTICS.totalFeatures) * 100).toFixed(1)}% azalma) | n_estimators=266 | max_depth=20 | min_samples_split=7 | max_features=0.469
                        </text>
                        <text x={W / 2} y="858" textAnchor="middle" fontSize="8" fill="#94A3B8" fontStyle="italic">
                            İterasyon 44 / {BSO_PARAMETERS.maxIterations} — F1-makro: %{MODEL_RESULTS[0].f1Macro}
                        </text>

                        {/* Feedback loop */}
                        <path d="M 870 656 Q 895 656, 895 750 Q 895 840, 870 845 L 835 845"
                            fill="none" stroke={COLORS.feedback} strokeWidth="1.5" strokeDasharray="6,3"
                            markerEnd="url(#ah-red)" />
                        <text x="903" y="755" fill={COLORS.feedback} fontSize="8" fontWeight="500"
                            transform={`rotate(90,903,755)`} textAnchor="middle">En iyi güncelle</text>

                        {/* Arrow 4→5 */}
                        <line x1={W / 2} y1="908" x2={W / 2} y2="938" stroke={COLORS.arrow} strokeWidth="2" markerEnd="url(#ah)" />
                        <rect x={W / 2 - 100} y="914" width="200" height="16" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.8" />
                        <text x={W / 2} y="925" textAnchor="middle" fontSize="8" fill="#64748B" fontWeight="500">Optimize {BSO_SELECTED_FEATURES.length} öznitelik &amp; hiper-parametreler</text>

                        {/* ══════════ AŞAMA 5: MODEL EĞİTİMİ ══════════ */}
                        <g filter="url(#ds)">
                            <rect x="55" y="943" width="810" height="150" rx="10" fill={COLORS.training.fill} stroke={COLORS.training.stroke} strokeWidth="2" />
                            <rect x="55" y="943" width="810" height="34" rx="10" fill={COLORS.training.headerFill} />
                            <rect x="55" y="967" width="810" height="10" fill={COLORS.training.headerFill} />
                        </g>
                        <circle cx="80" cy="960" r="12" fill="white" />
                        <text x="80" y="964.5" textAnchor="middle" fontSize="13" fontWeight="bold" fill={COLORS.training.stroke}>5</text>
                        <text x="100" y="958" fontSize="13" fontWeight="bold" fill="white" fontFamily="'Segoe UI',sans-serif">Aşama 5: Model Eğitimi ve Karşılaştırmalı Analiz</text>
                        <text x="100" y="972" fontSize="9" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Aşama 5: 12 Model Eğitimi ve Karşılaştırması</text>

                        {/* 3 model category boxes */}
                        <rect x="72" y="990" width="230" height="90" rx="8" fill="white" stroke={COLORS.training.stroke} strokeWidth="1.5" />
                        <rect x="72" y="990" width="230" height="22" rx="8" fill={COLORS.training.lightBg} />
                        <rect x="72" y="1006" width="230" height="6" fill={COLORS.training.lightBg} />
                        <text x="187" y="1006" textAnchor="middle" fontSize="10" fontWeight="bold" fill={COLORS.training.text}>Önerilen Model</text>
                        <text x="87" y="1027" fontSize="10" fill={COLORS.training.text} fontWeight="bold">★ BSO-Hibrit RF</text>
                        <text x="97" y="1042" fontSize="8.5" fill="#64748B">RF + BSO öznitelik seçimi</text>
                        <text x="97" y="1056" fontSize="8.5" fill="#64748B">+ hiper-parametre optimizasyonu</text>
                        <text x="97" y="1070" fontSize="8.5" fill="#64748B">{BSO_SELECTED_FEATURES.length} öznitelik, optimize parametreler</text>

                        <rect x="316" y="990" width="230" height="90" rx="8" fill="white" stroke="#059669" strokeWidth="1.5" />
                        <rect x="316" y="990" width="230" height="22" rx="8" fill="#D1FAE5" />
                        <rect x="316" y="1006" width="230" height="6" fill="#D1FAE5" />
                        <text x="431" y="1006" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#064E3B">Optimize Temel Modeller (4)</text>
                        {["BSO-SVM", "PSO-RF", "GA-RF", "GWO-RF"].map((m, i) => (
                            <text key={i} x="331" y={1027 + i * 14} fontSize="9" fill="#334155">• {m}</text>
                        ))}

                        <rect x="560" y="990" width="290" height="90" rx="8" fill="white" stroke="#2563EB" strokeWidth="1.5" />
                        <rect x="560" y="990" width="290" height="22" rx="8" fill="#DBEAFE" />
                        <rect x="560" y="1006" width="290" height="6" fill="#DBEAFE" />
                        <text x="705" y="1006" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E3A5F">Bireysel ML Modelleri (7)</text>
                        {["RF, SVM, Karar Ağacı", "KNN, Naive Bayes", "Lojistik Regresyon, XGBoost"].map((m, i) => (
                            <text key={i} x="575" y={1027 + i * 14} fontSize="9" fill="#334155">• {m}</text>
                        ))}

                        {/* Arrow 5→6 */}
                        <line x1={W / 2} y1="1093" x2={W / 2} y2="1123" stroke={COLORS.arrow} strokeWidth="2" markerEnd="url(#ah)" />
                        <rect x={W / 2 - 90} y="1099" width="180" height="16" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.8" />
                        <text x={W / 2} y="1110" textAnchor="middle" fontSize="8" fill="#64748B" fontWeight="500">Ayrılmış test setinde tahminler</text>

                        {/* ══════════ AŞAMA 6: DEĞERLENDİRME ══════════ */}
                        <g filter="url(#ds)">
                            <rect x="35" y="1128" width="850" height="220" rx="10" fill={COLORS.evaluation.fill} stroke={COLORS.evaluation.stroke} strokeWidth="2" />
                            <rect x="35" y="1128" width="850" height="34" rx="10" fill={COLORS.evaluation.headerFill} />
                            <rect x="35" y="1152" width="850" height="10" fill={COLORS.evaluation.headerFill} />
                        </g>
                        <circle cx="60" cy="1145" r="12" fill="white" />
                        <text x="60" y="1149.5" textAnchor="middle" fontSize="13" fontWeight="bold" fill={COLORS.evaluation.stroke}>6</text>
                        <text x="80" y="1143" fontSize="13" fontWeight="bold" fill="white" fontFamily="'Segoe UI',sans-serif">Aşama 6: Performans Değerlendirmesi ve İstatistiksel Analiz</text>
                        <text x="80" y="1157" fontSize="9" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Aşama 6: İstatistiksel Testler ve Metrik Değerlendirme</text>

                        {/* Metrics list */}
                        <text x="55" y="1183" fontSize="10" fill={COLORS.evaluation.text} fontFamily="sans-serif">
                            • Metrikler: Doğruluk, Kesinlik, Duyarlılık, F1-Ağırlıklı, F1-Makro, AUC-ROC, MCC, Özgüllük
                        </text>
                        <text x="55" y="1200" fontSize="10" fill={COLORS.evaluation.text} fontFamily="sans-serif">
                            • İstatistiksel Testler: Eşleştirilmiş t-testi (p&lt;0.05), Wilcoxon işaretli-sıra, Cohen&apos;s d etki büyüklüğü
                        </text>
                        <text x="55" y="1217" fontSize="10" fill={COLORS.evaluation.text} fontFamily="sans-serif">
                            • Görselleştirme: Karışıklık matrisleri (5×5), ROC eğrileri, yakınsama grafikleri, öznitelik önemi
                        </text>
                        <text x="55" y="1234" fontSize="10" fill={COLORS.evaluation.text} fontFamily="sans-serif">
                            • Çapraz doğrulama: Güçlü performans tahmini için 10 katlı tabakalı çapraz doğrulama
                        </text>

                        {/* Result boxes */}
                        <rect x="52" y="1248" width="140" height="42" rx="8" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" />
                        <text x="122" y="1264" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#064E3B">Doğruluk</text>
                        <text x="122" y="1282" textAnchor="middle" fontSize="14" fontWeight="900" fill="#059669">%{MODEL_RESULTS[0].accuracy}</text>

                        <rect x="202" y="1248" width="140" height="42" rx="8" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" />
                        <text x="272" y="1264" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#064E3B">F1-Ağırlıklı</text>
                        <text x="272" y="1282" textAnchor="middle" fontSize="14" fontWeight="900" fill="#059669">%{MODEL_RESULTS[0].f1Score}</text>

                        <rect x="352" y="1248" width="140" height="42" rx="8" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" />
                        <text x="422" y="1264" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#064E3B">F1-Makro</text>
                        <text x="422" y="1282" textAnchor="middle" fontSize="14" fontWeight="900" fill="#059669">%{MODEL_RESULTS[0].f1Macro}</text>

                        <rect x="502" y="1248" width="140" height="42" rx="8" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" />
                        <text x="572" y="1264" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#064E3B">AUC-ROC</text>
                        <text x="572" y="1282" textAnchor="middle" fontSize="14" fontWeight="900" fill="#059669">%{MODEL_RESULTS[0].aucRoc}</text>

                        <rect x="652" y="1248" width="220" height="42" rx="8" fill={COLORS.training.lightBg} stroke={COLORS.training.stroke} strokeWidth="1.5" />
                        <text x="762" y="1264" textAnchor="middle" fontSize="9" fontWeight="bold" fill={COLORS.training.text}>Öznitelik Azaltma</text>
                        <text x="762" y="1282" textAnchor="middle" fontSize="14" fontWeight="900" fill={COLORS.training.stroke}>{BSO_SELECTED_FEATURES.length}/{DATASET_STATISTICS.totalFeatures} (%{DATASET_STATISTICS.featureReductionPct})</text>

                        {/* MCC */}
                        <rect x="52" y="1298" width="140" height="36" rx="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.2" />
                        <text x="122" y="1313" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1E3A5F">MCC</text>
                        <text x="122" y="1328" textAnchor="middle" fontSize="12" fontWeight="800" fill="#2563EB">{MODEL_RESULTS[0].mcc}</text>

                        <rect x="202" y="1298" width="140" height="36" rx="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.2" />
                        <text x="272" y="1313" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1E3A5F">Kesinlik</text>
                        <text x="272" y="1328" textAnchor="middle" fontSize="12" fontWeight="800" fill="#2563EB">%{MODEL_RESULTS[0].precision}</text>

                        <rect x="352" y="1298" width="140" height="36" rx="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.2" />
                        <text x="422" y="1313" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1E3A5F">Duyarlılık</text>
                        <text x="422" y="1328" textAnchor="middle" fontSize="12" fontWeight="800" fill="#2563EB">%{MODEL_RESULTS[0].recall}</text>

                        <rect x="502" y="1298" width="370" height="36" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
                        <text x="687" y="1313" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350F">Karşılaştırılan Modeller</text>
                        <text x="687" y="1328" textAnchor="middle" fontSize="10" fontWeight="700" fill="#D97706">12 model: BSO-RF en iyi performansı gösterdi</text>

                        {/* ──── Bottom Caption ──── */}
                        <rect x="30" y="1360" width={W - 60} height="55" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                        <text x={W / 2} y="1380" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="'Segoe UI',sans-serif" fontWeight="600">
                            Tüm sonuçlar CICIoT2023 veri seti üzerindeki gerçek deneylerden ({DATASET_STATISTICS.totalSamples.toLocaleString()} örnek)
                        </text>
                        <text x={W / 2} y="1396" textAnchor="middle" fontSize="9" fill="#64748B" fontFamily="sans-serif">
                            Araştırma Süresi: 8 ay (Ekim 2025 – Haziran 2026) | Deney Çalışma Süresi: 4 saat 42 dakika
                        </text>
                        <text x={W / 2} y="1410" textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="sans-serif">
                            SHUAIB AYAD JASIM — Yüksek Lisans Tezi — Dinamik Ağ Ortamlarında BSO-Hibrit RF ile DDoS Tespiti
                        </text>

                        {/* Phase labels on right */}
                        {[
                            { y: 155, label: "VERİ" },
                            { y: 310, label: "ÖN İŞLEM" },
                            { y: 455, label: "DENGE" },
                            { y: 720, label: "OPTİMİZE" },
                            { y: 1020, label: "EĞİTİM" },
                            { y: 1220, label: "DEĞER." },
                        ].map((item) => (
                            <text key={item.label} x={W - 20} y={item.y} fill="#CBD5E1" fontSize="8" fontWeight="700"
                                fontFamily="sans-serif" letterSpacing="0.1em"
                                transform={`rotate(90,${W - 20},${item.y})`} textAnchor="middle">{item.label}</text>
                        ))}
                    </svg>
                </CardContent>
            </Card>

            {/* Legend Card */}
            <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
                <CardContent className="pt-6">
                    <div className="font-bold text-sm mb-3 flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
                            <GitBranch className="w-3.5 h-3.5 text-white" />
                        </div>
                        Diyagram Açıklaması
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { label: "Veri Toplama", color: COLORS.dataCollection.stroke },
                            { label: "Ön İşleme", color: COLORS.preprocessing.stroke },
                            { label: "SMOTE Dengeleme", color: COLORS.smote.stroke },
                            { label: "BSO Optimizasyonu", color: COLORS.bso.stroke },
                            { label: "Model Eğitimi", color: COLORS.training.stroke },
                            { label: "Değerlendirme", color: COLORS.evaluation.stroke },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md shadow-sm border border-white/50" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <svg width="24" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#475569" strokeWidth="2" /><polygon points="18 2, 24 5, 18 8" fill="#334155" /></svg>
                            <span>Veri akışı</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <svg width="24" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4,2" /></svg>
                            <span>Geri bildirim / iterasyon döngüsü</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <svg width="24" height="14"><rect x="0" y="2" width="24" height="10" rx="3" fill="white" stroke="#CBD5E1" strokeWidth="1" /></svg>
                            <span>Alt işlem</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
