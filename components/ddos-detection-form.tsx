"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Shield, ShieldAlert, ShieldCheck, Activity, Loader2,
    RotateCcw, Zap, Info, AlertTriangle, CheckCircle2,
} from "lucide-react"
import { BSO_SELECTED_FEATURES, CICIOT2023_ATTACK_TYPES } from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   DDoS Tespit Formu — Etkileşimli Simülasyon
   BSO-Hibrit RF modeli ile ağ trafiği sınıflandırma
   19 BSO-seçilmiş öznitelik kullanılır
   ═══════════════════════════════════════════════════════════════ */

/** Feature metadata for the form — realistic ranges from CICIoT2023 */
const FEATURE_META: Record<string, { label: string; desc: string; min: number; max: number; defaultVal: number; unit: string }> = {
    syn_count: { label: "SYN Sayısı", desc: "TCP SYN paket sayısı", min: 0, max: 50000, defaultVal: 0, unit: "paket" },
    Number: { label: "Paket Sayısı", desc: "Toplam paket sayısı", min: 1, max: 100000, defaultVal: 10, unit: "paket" },
    "Tot sum": { label: "Toplam Boyut", desc: "Toplam paket boyutu", min: 0, max: 5000000, defaultVal: 500, unit: "bayt" },
    Rate: { label: "Hız (Rate)", desc: "Paket gönderim hızı", min: 0, max: 100000, defaultVal: 50, unit: "p/s" },
    Max: { label: "Maks. Boyut", desc: "En büyük paket boyutu", min: 0, max: 65535, defaultVal: 1500, unit: "bayt" },
    Header_Length: { label: "Başlık Uzunluğu", desc: "IP başlık uzunluğu", min: 20, max: 60, defaultVal: 20, unit: "bayt" },
    HTTPS: { label: "HTTPS", desc: "HTTPS protokolü (0/1)", min: 0, max: 1, defaultVal: 0, unit: "bayrak" },
    Time_To_Live: { label: "TTL", desc: "Yaşam süresi (Time To Live)", min: 0, max: 255, defaultVal: 64, unit: "" },
    psh_flag_number: { label: "PSH Bayrak", desc: "TCP PSH bayrağı sayısı", min: 0, max: 10000, defaultVal: 0, unit: "sayı" },
    HTTP: { label: "HTTP", desc: "HTTP protokolü (0/1)", min: 0, max: 1, defaultVal: 0, unit: "bayrak" },
    fin_flag_number: { label: "FIN Bayrak", desc: "TCP FIN bayrağı sayısı", min: 0, max: 10000, defaultVal: 0, unit: "sayı" },
    UDP: { label: "UDP", desc: "UDP protokolü (0/1)", min: 0, max: 1, defaultVal: 0, unit: "bayrak" },
    DNS: { label: "DNS", desc: "DNS protokolü (0/1)", min: 0, max: 1, defaultVal: 0, unit: "bayrak" },
    ARP: { label: "ARP", desc: "ARP protokolü (0/1)", min: 0, max: 1, defaultVal: 0, unit: "bayrak" },
    LLC: { label: "LLC", desc: "LLC protokolü (0/1)", min: 0, max: 1, defaultVal: 0, unit: "bayrak" },
    SSH: { label: "SSH", desc: "SSH protokolü (0/1)", min: 0, max: 1, defaultVal: 0, unit: "bayrak" },
    DHCP: { label: "DHCP", desc: "DHCP protokolü (0/1)", min: 0, max: 1, defaultVal: 0, unit: "bayrak" },
    IGMP: { label: "IGMP", desc: "IGMP protokolü (0/1)", min: 0, max: 1, defaultVal: 0, unit: "bayrak" },
    cwr_flag_number: { label: "CWR Bayrak", desc: "TCP CWR bayrağı sayısı", min: 0, max: 10000, defaultVal: 0, unit: "sayı" },
}

/** Pre-configured profiles matching real CICIoT2023 traffic patterns */
const PROFILES: { name: string; desc: string; icon: typeof Shield; color: string; values: Record<string, number> }[] = [
    {
        name: "Normal Trafik",
        desc: "Tipik web taraması trafiği",
        icon: ShieldCheck,
        color: "text-emerald-500",
        values: { syn_count: 2, Number: 15, "Tot sum": 4500, Rate: 12, Max: 1460, Header_Length: 20, HTTPS: 1, Time_To_Live: 64, psh_flag_number: 3, HTTP: 0, fin_flag_number: 1, UDP: 0, DNS: 1, ARP: 0, LLC: 0, SSH: 0, DHCP: 0, IGMP: 0, cwr_flag_number: 0 },
    },
    {
        name: "DDoS-SYN Flood",
        desc: "Yüksek hacimli SYN saldırısı",
        icon: ShieldAlert,
        color: "text-red-500",
        values: { syn_count: 42000, Number: 85000, "Tot sum": 3400000, Rate: 95000, Max: 60, Header_Length: 40, HTTPS: 0, Time_To_Live: 255, psh_flag_number: 0, HTTP: 0, fin_flag_number: 0, UDP: 0, DNS: 0, ARP: 0, LLC: 0, SSH: 0, DHCP: 0, IGMP: 0, cwr_flag_number: 0 },
    },
    {
        name: "DDoS-ACK Fragmentation",
        desc: "Parçalanmış ACK saldırısı",
        icon: ShieldAlert,
        color: "text-amber-500",
        values: { syn_count: 150, Number: 72000, "Tot sum": 2880000, Rate: 80000, Max: 40, Header_Length: 20, HTTPS: 0, Time_To_Live: 128, psh_flag_number: 0, HTTP: 0, fin_flag_number: 0, UDP: 0, DNS: 0, ARP: 0, LLC: 0, SSH: 0, DHCP: 0, IGMP: 0, cwr_flag_number: 0 },
    },
    {
        name: "Port Taraması",
        desc: "Recon-PortScan keşif trafiği",
        icon: AlertTriangle,
        color: "text-violet-500",
        values: { syn_count: 8000, Number: 12000, "Tot sum": 480000, Rate: 6000, Max: 44, Header_Length: 20, HTTPS: 0, Time_To_Live: 64, psh_flag_number: 0, HTTP: 0, fin_flag_number: 8000, UDP: 0, DNS: 0, ARP: 0, LLC: 0, SSH: 0, DHCP: 0, IGMP: 0, cwr_flag_number: 0 },
    },
    {
        name: "Backdoor/Malware",
        desc: "Arka kapı zararlı yazılım trafiği",
        icon: ShieldAlert,
        color: "text-rose-500",
        values: { syn_count: 5, Number: 25, "Tot sum": 12000, Rate: 8, Max: 1460, Header_Length: 20, HTTPS: 0, Time_To_Live: 128, psh_flag_number: 10, HTTP: 1, fin_flag_number: 2, UDP: 0, DNS: 1, ARP: 0, LLC: 0, SSH: 1, DHCP: 0, IGMP: 0, cwr_flag_number: 0 },
    },
]

/** Simulated classification based on real BSO-RF decision boundaries */
function classifyTraffic(values: Record<string, number>): { label: string; confidence: number; severity: string; color: string } {
    const syn = values.syn_count ?? 0
    const num = values.Number ?? 0
    const totSum = values["Tot sum"] ?? 0
    const rate = values.Rate ?? 0
    const max = values.Max ?? 0
    const fin = values.fin_flag_number ?? 0
    const psh = values.psh_flag_number ?? 0
    const ssh = values.SSH ?? 0

    // Decision logic based on real feature importance and thresholds
    // syn_count (0.224) and Number (0.183) are the two most important features

    // SYN Flood: very high syn_count + high rate
    if (syn > 10000 && rate > 20000) {
        const conf = Math.min(99.2, 85 + (syn / 50000) * 14)
        return { label: "DDoS-SYN_Flood", confidence: Math.round(conf * 100) / 100, severity: "critical", color: "#3b82f6" }
    }

    // ACK Fragmentation: moderate syn + very high packet count + small max size
    if (num > 30000 && max < 100 && rate > 10000) {
        const conf = Math.min(97.5, 80 + (num / 100000) * 17)
        return { label: "DDoS-ACK_Fragmentation", confidence: Math.round(conf * 100) / 100, severity: "critical", color: "#f59e0b" }
    }

    // Port Scan: high syn with high fin (connection probing)
    if (syn > 2000 && fin > 2000 && rate < 20000) {
        const conf = Math.min(95.8, 78 + (syn / 20000) * 17)
        return { label: "Recon-PortScan", confidence: Math.round(conf * 100) / 100, severity: "medium", color: "#8b5cf6" }
    }

    // Backdoor/Malware: low volume, SSH or unusual PSH patterns
    if (num < 100 && (ssh === 1 || psh > 5) && totSum > 5000) {
        const conf = Math.min(88.3, 70 + (psh / 20) * 18)
        return { label: "Backdoor_Malware", confidence: Math.round(conf * 100) / 100, severity: "high", color: "#ef4444" }
    }

    // Benign: low volumes, normal TTL, standard protocols
    if (syn < 500 && num < 5000 && rate < 5000) {
        const conf = Math.min(96.1, 88 + ((5000 - num) / 5000) * 8)
        return { label: "BenignTraffic", confidence: Math.round(conf * 100) / 100, severity: "info", color: "#22c55e" }
    }

    // Ambiguous / borderline — most likely DDoS variant
    if (syn > 500 || rate > 5000) {
        return { label: "DDoS-SYN_Flood", confidence: 67.4, severity: "critical", color: "#3b82f6" }
    }

    return { label: "BenignTraffic", confidence: 72.3, severity: "info", color: "#22c55e" }
}

const severityMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    info: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-300 dark:border-emerald-700", text: "text-emerald-700 dark:text-emerald-300", badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
    medium: { bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-300 dark:border-violet-700", text: "text-violet-700 dark:text-violet-300", badge: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200" },
    high: { bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-300 dark:border-red-700", text: "text-red-700 dark:text-red-300", badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    critical: { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-300 dark:border-amber-700", text: "text-amber-700 dark:text-amber-300", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
}

export default function DDoSDetectionForm() {
    const defaults: Record<string, number> = {}
    BSO_SELECTED_FEATURES.forEach((f) => {
        defaults[f.name] = FEATURE_META[f.name]?.defaultVal ?? 0
    })

    const [values, setValues] = useState<Record<string, number>>(defaults)
    const [result, setResult] = useState<ReturnType<typeof classifyTraffic> | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const updateField = useCallback((name: string, val: string) => {
        const num = val === "" ? 0 : Number(val)
        if (!Number.isNaN(num)) {
            setValues((prev) => ({ ...prev, [name]: num }))
        }
    }, [])

    const handleAnalyze = useCallback(() => {
        setIsAnalyzing(true)
        setResult(null)
        // Simulate model inference delay
        setTimeout(() => {
            setResult(classifyTraffic(values))
            setIsAnalyzing(false)
        }, 1200)
    }, [values])

    const handleReset = useCallback(() => {
        setValues(defaults)
        setResult(null)
    }, [defaults])

    const loadProfile = useCallback((profile: typeof PROFILES[0]) => {
        setValues(profile.values)
        setResult(null)
    }, [])

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Shield className="w-8 h-8 text-indigo-500" />
                    DDoS Tespit Formu
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    BSO-Hibrit RF modeli ile ağ trafiği sınıflandırma simülasyonu — 19 BSO-seçilmiş öznitelik kullanılır
                </p>
            </div>

            {/* ════════════════════ HAZIR PROFİLLER ════════════════════ */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Hazır Trafik Profilleri
                    </CardTitle>
                    <CardDescription>
                        Gerçek CICIoT2023 veri setindeki trafik desenlerine dayalı örnek profiller
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {PROFILES.map((p) => (
                            <button
                                key={p.name}
                                onClick={() => loadProfile(p)}
                                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all text-left group"
                            >
                                <p.icon className={`w-5 h-5 ${p.color} mb-1.5 group-hover:scale-110 transition-transform`} />
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{p.name}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</p>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ ÖZNİTELİK GİRİŞ FORMU ════════════════════ */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        Ağ Trafiği Öznitelikleri (19 BSO-Seçilmiş)
                    </CardTitle>
                    <CardDescription>
                        Her özniteliğin değerini girin veya yukarıdaki hazır profillerden birini seçin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {BSO_SELECTED_FEATURES.map((feat) => {
                            const meta = FEATURE_META[feat.name]
                            if (!meta) return null
                            return (
                                <div key={feat.name} className="space-y-1.5">
                                    <Label htmlFor={feat.name} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono">
                                            #{feat.rank}
                                        </Badge>
                                        {meta.label}
                                        <span className="text-[10px] text-slate-400 font-normal ml-auto">
                                            ö: %{(feat.importance * 100).toFixed(1)}
                                        </span>
                                    </Label>
                                    <Input
                                        id={feat.name}
                                        type="number"
                                        value={values[feat.name] ?? 0}
                                        onChange={(e) => updateField(feat.name, e.target.value)}
                                        min={meta.min}
                                        max={meta.max}
                                        className="h-9 text-sm font-mono"
                                        placeholder={`${meta.min}–${meta.max}`}
                                    />
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                        {meta.desc} {meta.unit && `(${meta.unit})`}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ ANALİZ BUTONLARI ════════════════════ */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            BSO-RF Modeli Çalışıyor...
                        </>
                    ) : (
                        <>
                            <Shield className="w-5 h-5" />
                            Trafiği Analiz Et
                        </>
                    )}
                </button>
                <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                    <RotateCcw className="w-4 h-4" />
                    Sıfırla
                </button>
            </div>

            {/* ════════════════════ SONUÇ PANELİ ════════════════════ */}
            {result && (
                <Card className={`border-2 ${severityMap[result.severity]?.border ?? "border-slate-300"} ${severityMap[result.severity]?.bg ?? ""} animate-fade-in`}>
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col lg:flex-row items-center gap-6">
                            {/* Result icon */}
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: `${result.color}18` }}>
                                    {result.severity === "info" ? (
                                        <ShieldCheck className="w-12 h-12" style={{ color: result.color }} />
                                    ) : (
                                        <ShieldAlert className="w-12 h-12" style={{ color: result.color }} />
                                    )}
                                </div>
                            </div>

                            {/* Result text */}
                            <div className="flex-1 text-center lg:text-left space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                                        BSO-Hibrit RF Sınıflandırma Sonucu
                                    </p>
                                    <h2 className={`text-2xl font-black ${severityMap[result.severity]?.text ?? "text-slate-800"}`}>
                                        {result.label}
                                    </h2>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                                    <Badge className={severityMap[result.severity]?.badge ?? "bg-slate-100"}>
                                        Güven: %{result.confidence}
                                    </Badge>
                                    <Badge variant="outline">
                                        {result.severity === "info" ? "Güvenli" :
                                            result.severity === "medium" ? "Orta Risk" :
                                                result.severity === "high" ? "Yüksek Risk" : "Kritik Tehdit"}
                                    </Badge>
                                    <Badge variant="outline">19 Öznitelik Kullanıldı</Badge>
                                </div>

                                {/* Confidence bar */}
                                <div className="max-w-md">
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>Güven Seviyesi</span>
                                        <span>%{result.confidence}</span>
                                    </div>
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${result.confidence}%`,
                                                backgroundColor: result.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Attack classes reference */}
                            <div className="flex-shrink-0 space-y-2">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center">Tüm Sınıflar</p>
                                {CICIOT2023_ATTACK_TYPES.map((at) => (
                                    <div
                                        key={at.name}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${at.name === result.label
                                                ? "bg-white dark:bg-slate-800 shadow-md font-bold border border-slate-200 dark:border-slate-600 scale-105"
                                                : "text-slate-500 dark:text-slate-400"
                                            }`}
                                    >
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: at.color }} />
                                        <span className={at.name === result.label ? "text-slate-800 dark:text-white" : ""}>{at.name}</span>
                                        {at.name === result.label && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ════════════════════ AÇIKLAMA NOTU ════════════════════ */}
            <Card className="border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/20">
                <CardContent className="pt-4 pb-4 flex items-start gap-3 text-blue-900 dark:text-blue-100 text-sm">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                    <div className="space-y-1">
                        <p><strong>Bu bir simülasyondur.</strong> Sınıflandırma sonuçları, BSO-Hibrit RF modelinin gerçek deney sonuçlarına dayalı karar sınırlarını taklit eder.</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            Gerçek model: CICIoT2023 veri seti | 118.466 örnek | 5 sınıf | %89.82 Doğruluk | %84.24 F1-Makro | %98.38 AUC-ROC
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
