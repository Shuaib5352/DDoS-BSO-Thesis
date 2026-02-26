"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ScatterChart, Scatter, ZAxis,
} from "recharts"
import { AlertTriangle, TrendingDown, Search, Shield, Target, XCircle } from "lucide-react"
import {
    CONFUSION_MATRICES,
    BSO_RF_PER_CLASS,
    MODEL_RESULTS,
    CICIOT2023_ATTACK_TYPES,
} from "@/lib/ciciot2023-dataset"

// ─── Calculate misclassification patterns from confusion matrices ─────────────
const CLASS_LABELS = ["Backdoor_Malware", "BenignTraffic", "DDoS-ACK_Frag", "DDoS-SYN_Flood", "Recon-PortScan"]
const CLASS_SHORT = ["Backdoor", "Benign", "ACK_Frag", "SYN_Flood", "PortScan"]

// Misclassification pairs for BSO-RF
function getMisclassificationPairs(modelKey: string) {
    const cm = CONFUSION_MATRICES[modelKey]
    if (!cm) return []
    const pairs: { from: string; to: string; count: number; pct: number }[] = []

    for (let i = 0; i < cm.matrix.length; i++) {
        const rowTotal = cm.matrix[i].reduce((s, v) => s + v, 0)
        for (let j = 0; j < cm.matrix[i].length; j++) {
            if (i !== j && cm.matrix[i][j] > 0) {
                pairs.push({
                    from: CLASS_SHORT[i],
                    to: CLASS_SHORT[j],
                    count: cm.matrix[i][j],
                    pct: Math.round((cm.matrix[i][j] / rowTotal) * 10000) / 100,
                })
            }
        }
    }
    return pairs.sort((a, b) => b.count - a.count)
}

const bsoMisclassPairs = getMisclassificationPairs("BSO-RF")
const xgbMisclassPairs = getMisclassificationPairs("XGBoost")

// Per-class error rates for all models
function getPerClassErrors(modelKey: string) {
    const cm = CONFUSION_MATRICES[modelKey]
    if (!cm) return []
    return cm.matrix.map((row, i) => {
        const total = row.reduce((s, v) => s + v, 0)
        const correct = row[i]
        const errors = total - correct
        return {
            class: CLASS_SHORT[i],
            errorRate: Math.round((errors / total) * 10000) / 100,
            correctRate: Math.round((correct / total) * 10000) / 100,
            total,
            correct,
            errors,
        }
    })
}

// Compare error rates across key models
const modelKeys = ["BSO-RF", "XGBoost", "RF", "DT", "SVM", "NB"]
const modelNames: Record<string, string> = {
    "BSO-RF": "BSO-Hybrid RF",
    "XGBoost": "XGBoost",
    "RF": "Random Forest",
    "DT": "Decision Tree",
    "SVM": "SVM",
    "NB": "Naive Bayes",
}

const perClassErrorComparison = CLASS_SHORT.map((cls, i) => {
    const row: Record<string, number | string> = { class: cls }
    modelKeys.forEach((key) => {
        const errors = getPerClassErrors(key)
        row[key] = errors[i]?.errorRate || 0
    })
    return row
})

// FPR and FNR per class for BSO-RF
function calculateFPRFNR(modelKey: string) {
    const cm = CONFUSION_MATRICES[modelKey]
    if (!cm) return []
    const n = cm.matrix.length
    return CLASS_SHORT.map((cls, i) => {
        const TP = cm.matrix[i][i]
        const FN = cm.matrix[i].reduce((s, v) => s + v, 0) - TP
        let FP = 0
        for (let j = 0; j < n; j++) {
            if (j !== i) FP += cm.matrix[j][i]
        }
        let TN = 0
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (r !== i && c !== i) TN += cm.matrix[r][c]
            }
        }
        return {
            class: cls,
            TP,
            FP,
            FN,
            TN,
            FPR: Math.round((FP / (FP + TN)) * 10000) / 100,
            FNR: Math.round((FN / (FN + TP)) * 10000) / 100,
            precision: Math.round((TP / (TP + FP)) * 10000) / 100,
            recall: Math.round((TP / (TP + FN)) * 10000) / 100,
        }
    })
}

const bsoFPRFNR = calculateFPRFNR("BSO-RF")
const xgbFPRFNR = calculateFPRFNR("XGBoost")

// Error improvement from BSO optimization
const errorImprovement = CLASS_SHORT.map((cls, i) => {
    const bsoErr = getPerClassErrors("BSO-RF")[i]?.errorRate || 0
    const rfErr = getPerClassErrors("RF")[i]?.errorRate || 0
    const dtErr = getPerClassErrors("DT")[i]?.errorRate || 0
    return {
        class: cls,
        bsoError: bsoErr,
        rfError: rfErr,
        dtError: dtErr,
        vsRF: Math.round((rfErr - bsoErr) * 100) / 100,
        vsDT: Math.round((dtErr - bsoErr) * 100) / 100,
    }
})

const modelColors: Record<string, string> = {
    "BSO-RF": "#22c55e",
    "XGBoost": "#f59e0b",
    "RF": "#3b82f6",
    "DT": "#ef4444",
    "SVM": "#8b5cf6",
    "NB": "#ec4899",
}

export default function ErrorMisclassificationAnalysis() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-red-500/30 bg-gradient-to-r from-red-500/5 to-orange-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Hata ve Yanlış Sınıflandırma Analizi</CardTitle>
                                <CardDescription>
                                    BSO-Hybrid RF sınıflandırma sonuçlarının kapsamlı hata analizi
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-red-600">
                                {CONFUSION_MATRICES["BSO-RF"].total.toLocaleString()} Test Örneği
                            </Badge>
                            <Badge className="bg-emerald-600">
                                {MODEL_RESULTS[0].accuracy}% Genel Doğruluk
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* 1. Per-Class Performance Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        Tablo 7.1: BSO-Hybrid RF — Sınıf Bazında Performans ve Hata Analizi
                    </CardTitle>
                    <CardDescription>
                        Tüm 5 saldırı sınıfı için detaylı sınıf bazında precision, recall, F1, FPR, FNR
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">Sınıf</th>
                                    <th className="text-right p-2 font-bold">Precision %</th>
                                    <th className="text-right p-2 font-bold">Recall %</th>
                                    <th className="text-right p-2 font-bold">F1-Score %</th>
                                    <th className="text-right p-2 font-bold">Destek</th>
                                    <th className="text-right p-2 font-bold">FPR %</th>
                                    <th className="text-right p-2 font-bold">FNR %</th>
                                    <th className="text-center p-2 font-bold">Değerlendirme</th>
                                </tr>
                            </thead>
                            <tbody>
                                {BSO_RF_PER_CLASS.map((cls, i) => {
                                    const fprfnr = bsoFPRFNR[i]
                                    const assessment = cls.f1Score >= 99 ? "Mükemmel" : cls.f1Score >= 80 ? "İyi" : cls.f1Score >= 60 ? "Orta" : "Zayıf"
                                    const assessColor = cls.f1Score >= 99 ? "bg-emerald-600" : cls.f1Score >= 80 ? "bg-blue-600" : cls.f1Score >= 60 ? "bg-amber-600" : "bg-red-600"
                                    return (
                                        <tr key={cls.className} className="border-b border-border/50 hover:bg-muted/30">
                                            <td className="p-2 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CICIOT2023_ATTACK_TYPES[i]?.color }} />
                                                    {cls.className}
                                                </div>
                                            </td>
                                            <td className="p-2 text-right font-mono">{cls.precision.toFixed(2)}</td>
                                            <td className="p-2 text-right font-mono">{cls.recall.toFixed(2)}</td>
                                            <td className="p-2 text-right font-mono font-bold">{cls.f1Score.toFixed(2)}</td>
                                            <td className="p-2 text-right text-muted-foreground">{cls.support.toLocaleString()}</td>
                                            <td className="p-2 text-right font-mono text-red-400">{fprfnr?.FPR.toFixed(2)}</td>
                                            <td className="p-2 text-right font-mono text-amber-400">{fprfnr?.FNR.toFixed(2)}</td>
                                            <td className="p-2 text-center">
                                                <Badge className={`${assessColor} text-xs`}>{assessment}</Badge>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Top Misclassification Pairs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-500" />
                            Tablo 7.2: En Sık Yanlış Sınıflandırma Çiftleri — BSO-RF
                        </CardTitle>
                        <CardDescription>En sık yanlış sınıflandırma kalıpları</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {bsoMisclassPairs.slice(0, 10).map((pair, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-border/50 hover:bg-muted/30">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Badge variant="outline" className="text-xs font-mono">{pair.from}</Badge>
                                        <span className="text-red-500 font-bold">→</span>
                                        <Badge variant="outline" className="text-xs font-mono">{pair.to}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-mono font-bold">{pair.count.toLocaleString()}</span>
                                        <div className="w-20 bg-muted rounded-full h-2">
                                            <div
                                                className="bg-red-500 h-2 rounded-full"
                                                style={{ width: `${Math.min(pair.pct * 2, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-red-400 font-mono w-12 text-right">{pair.pct}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Search className="w-5 h-5 text-amber-500" />
                            Hata Kalıbı Analizi
                        </CardTitle>
                        <CardDescription>Yanlış sınıflandırma analizinden temel çıkarımlar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                                <h4 className="font-bold text-sm text-red-500 mb-1">⚠ En Zor Sınıf: Backdoor_Malware</h4>
                                <p className="text-xs text-muted-foreground">
                                    F1-Score: {BSO_RF_PER_CLASS[0].f1Score}% — Yalnızca {CICIOT2023_ATTACK_TYPES[0].testingSamples} test örneği
                                    (en küçük sınıf). Benzer ağ kalıpları nedeniyle sıklıkla BenignTraffic veya Recon-PortScan olarak yanlış sınıflandırılır.
                                </p>
                            </div>

                            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                                <h4 className="font-bold text-sm text-amber-500 mb-1">⚠ Karışıklık: Benign ↔ PortScan</h4>
                                <p className="text-xs text-muted-foreground">
                                    {bsoMisclassPairs.find((p) => p.from === "PortScan" && p.to === "Benign")?.count || 0} PortScan örnekleri
                                    Benign olarak yanlış sınıflandırılır. Keşif trafiği, normal göz atma ile paket özelliklerini paylaşır.
                                </p>
                            </div>

                            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                                <h4 className="font-bold text-sm text-emerald-500 mb-1">✓ En İyi Performans: DDoS Türleri</h4>
                                <p className="text-xs text-muted-foreground">
                                    DDoS-ACK_Fragmentation (F1: {BSO_RF_PER_CLASS[2].f1Score}%) ve DDoS-SYN_Flood (F1: {BSO_RF_PER_CLASS[3].f1Score}%)
                                    son derece belirgin trafik kalıpları nedeniyle neredeyse mükemmel tespit oranlarına sahiptir.
                                </p>
                            </div>

                            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                <h4 className="font-bold text-sm text-blue-500 mb-1">ℹ Sınıf Dengesizliği Etkisi</h4>
                                <p className="text-xs text-muted-foreground">
                                    SMOTE aşırı örneklemeye rağmen (Backdoor_Malware için 2.252 → 17.500),
                                    azınlık sınıfı hâlâ daha düşük performans göstermektedir. Sentetik örnekler yardımcı olur ancak gerçek veri çeşitliliğinin tamamen yerini alamaz.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. Per-Class Error Rate Comparison Across Models */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-blue-500" />
                        Şekil 7.1: Modeller Arası Sınıf Bazında Hata Oranı Karşılaştırması
                    </CardTitle>
                    <CardDescription>
                        6 temel model için her saldırı sınıfının hata oranı (%)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={perClassErrorComparison}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="class" tick={{ fontSize: 11 }} />
                                <YAxis label={{ value: "Hata Oranı (%)", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} />
                                <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
                                <Legend />
                                {modelKeys.map((key) => (
                                    <Bar key={key} dataKey={key} name={modelNames[key]} fill={modelColors[key]} opacity={0.85} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 p-3 bg-blue-500/10 rounded-lg text-sm">
                        <strong>Temel Gözlem:</strong> BSO-Hybrid RF, BenignTraffic ve DDoS sınıfları için en düşük hata oranlarını gösterir.
                        Naive Bayes, BenignTraffic (%90,26) ve Recon-PortScan (%62,12) için en yüksek hata oranına sahiptir;
                        bu durum karmaşık trafik kalıpları için doğrusal olmayan modellerin gerekliliğini doğrular.
                    </div>
                </CardContent>
            </Card>

            {/* 4. FPR vs FNR Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-500" />
                        Şekil 7.2: Yanlış Pozitif Oranı vs Yanlış Negatif Oranı — BSO-RF
                    </CardTitle>
                    <CardDescription>
                        Sınıf bazında FPR (yanlış alarmlar) ve FNR (kaçırılan saldırılar) arasındaki denge
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bsoFPRFNR} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis type="number" domain={[0, 'auto']} tickFormatter={(v: number) => `${v}%`} />
                                    <YAxis type="category" dataKey="class" width={80} tick={{ fontSize: 10 }} />
                                    <Tooltip formatter={(value: number) => [`${value}%`, ""]} />
                                    <Legend />
                                    <Bar dataKey="FPR" name="Yanlış Pozitif Oranı" fill="#ef4444" opacity={0.8} />
                                    <Bar dataKey="FNR" name="Yanlış Negatif Oranı" fill="#f59e0b" opacity={0.8} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm">Detaylı FPR/FNR Analizi</h4>
                            {bsoFPRFNR.map((cls) => (
                                <div key={cls.class} className="p-2.5 rounded-lg border border-border/50 text-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold">{cls.class}</span>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="text-xs text-red-400">FPR: {cls.FPR}%</Badge>
                                            <Badge variant="outline" className="text-xs text-amber-400">FNR: {cls.FNR}%</Badge>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        TP: {cls.TP.toLocaleString()} | FP: {cls.FP.toLocaleString()} | FN: {cls.FN.toLocaleString()} | TN: {cls.TN.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 5. BSO-RF vs XGBoost Error Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-500" />
                        Tablo 7.3: Hata Oranı İyileştirmesi — BSO-RF vs Temel Modeller
                    </CardTitle>
                    <CardDescription>
                        BSO optimizasyonunun standart modellere kıyasla hataları nasıl azalttığı
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">Sınıf</th>
                                    <th className="text-right p-2 font-bold">BSO-RF Hata %</th>
                                    <th className="text-right p-2 font-bold">RF Hata %</th>
                                    <th className="text-right p-2 font-bold">DT Hata %</th>
                                    <th className="text-center p-2 font-bold">vs RF</th>
                                    <th className="text-center p-2 font-bold">vs DT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errorImprovement.map((row) => (
                                    <tr key={row.class} className="border-b border-border/50 hover:bg-muted/30">
                                        <td className="p-2 font-medium">{row.class}</td>
                                        <td className="p-2 text-right font-mono font-bold">{row.bsoError}%</td>
                                        <td className="p-2 text-right font-mono">{row.rfError}%</td>
                                        <td className="p-2 text-right font-mono">{row.dtError}%</td>
                                        <td className="p-2 text-center">
                                            <Badge className={`text-xs ${row.vsRF > 0 ? "bg-emerald-600" : row.vsRF < 0 ? "bg-red-600" : "bg-gray-500"}`}>
                                                {row.vsRF > 0 ? `↓ ${row.vsRF}%` : row.vsRF < 0 ? `↑ ${Math.abs(row.vsRF)}%` : "="}
                                            </Badge>
                                        </td>
                                        <td className="p-2 text-center">
                                            <Badge className={`text-xs ${row.vsDT > 0 ? "bg-emerald-600" : row.vsDT < 0 ? "bg-red-600" : "bg-gray-500"}`}>
                                                {row.vsDT > 0 ? `↓ ${row.vsDT}%` : row.vsDT < 0 ? `↑ ${Math.abs(row.vsDT)}%` : "="}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg text-sm">
                        <strong>Özet:</strong> BSO-Hybrid RF, tüm sınıflarda Karar Ağacına kıyasla hata oranlarını tutarlı biçimde azaltır;
                        en önemli iyileşme BenignTraffic tespitindedir.
                        Standart RF'ye karşı BSO, <strong>%51,3 daha az özellik ile</strong> benzer hata oranlarına ulaşır;
                        bu da verimli özellik kullanımının göstergesidir.
                    </div>
                </CardContent>
            </Card>

            {/* 6. Hardest Samples Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Temel Zorluklar ve Öneriler
                    </CardTitle>
                    <CardDescription>Kalıcı sınıflandırma zorlukları ve potansiyel çözümlerin analizi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-red-500">Tespit Edilen Zorluklar</h4>
                            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                                <div className="font-medium text-sm mb-1">1. Backdoor_Malware Tespiti</div>
                                <p className="text-xs text-muted-foreground">
                                    Yalnızca {BSO_RF_PER_CLASS[0].precision}% precision, küçük sınıf boyutu nedeniyle (644 test örneği).
                                    Backdoor trafiği normal davranışı taklit eder, bu da tespiti doğası gereği zorlaştırır.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                                <div className="font-medium text-sm mb-1">2. Benign ↔ PortScan Karışıklığı</div>
                                <p className="text-xs text-muted-foreground">
                                    {bsoMisclassPairs.find((p) => p.from === "PortScan" && p.to === "Benign")?.count || 0} PortScan
                                    Benign olarak yanlış sınıflandırılır. Düşük hızlı port taraması normal bağlantı girişimlerine benzer.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                                <div className="font-medium text-sm mb-1">3. Sınıf Dengesizliği Kalıntıları</div>
                                <p className="text-xs text-muted-foreground">
                                    SMOTE'a rağmen, F1-Macro ({MODEL_RESULTS[0].f1Macro}%) F1-Weighted'dan
                                    ({MODEL_RESULTS[0].f1Score}%) düşüktür; bu sınıf bazında eşit olmayan performansı gösterir.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-emerald-500">Gelecek Çalışmalar İçin Öneriler</h4>
                            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                                <div className="font-medium text-sm mb-1">1. Topluluk Yaklaşımı</div>
                                <p className="text-xs text-muted-foreground">
                                    BSO-RF'yi azınlık sınıfları için özel modellerle birleştirin.
                                    Kademeli bir sınıflandırıcı önce DDoS'u DDoS olmayandan ayırabilir, ardından alt türleri detaylı sınıflandırabilir.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                                <div className="font-medium text-sm mb-1">2. Maliyet Duyarlı Öğrenme</div>
                                <p className="text-xs text-muted-foreground">
                                    Azınlık sınıflarına (Backdoor_Malware) daha yüksek yanlış sınıflandırma maliyetleri atayın;
                                    kritik saldırı kategorilerinde yanlış negatifleri cezalandırmak için.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                                <div className="font-medium text-sm mb-1">3. Gelişmiş Özellik Mühendisliği</div>
                                <p className="text-xs text-muted-foreground">
                                    Backdoor_Malware'ı BenignTraffic'ten daha iyi ayırt etmek için zamansal özellikler
                                    (oturum süresi, patlama tespiti) ve davranışsal özellikler ekleyin.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                                <div className="font-medium text-sm mb-1">4. Derin Öğrenme Hibrit</div>
                                <p className="text-xs text-muted-foreground">
                                    BSO özellik seçimini, ağ trafiği akışlarındaki zamansal kalıpları yakalayabilen
                                    LSTM/CNN modelleriyle entegre edin.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
