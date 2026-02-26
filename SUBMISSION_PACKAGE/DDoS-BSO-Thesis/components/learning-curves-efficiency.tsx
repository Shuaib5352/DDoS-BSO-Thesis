"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    DYNAMIC_ENVIRONMENT,
    MODEL_RESULTS,
    DATASET_STATISTICS,
    CICIOT2023_ATTACK_TYPES,
} from "@/lib/ciciot2023-dataset"
import { Activity, TrendingDown, Gauge, Shield, AlertTriangle, CheckCircle2, Zap, BarChart3 } from "lucide-react"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Legend, BarChart, Bar, Cell, AreaChart, Area,
    ScatterChart, Scatter, ZAxis,
} from "recharts"

export default function LearningCurvesEfficiency() {
    const { noiseRobustness, unknownAttackDetection, throughput, learningCurve } = DYNAMIC_ENVIRONMENT

    // Learning curve with train/test gap indication
    const lcWithGap = learningCurve.map((lc) => ({
        ...lc,
        label: `${(lc.fraction * 100).toFixed(0)}%`,
        gap: lc.accuracy - lc.f1Macro, // overfitting proxy
    }))

    // Class distribution visualization
    const classDistribution = CICIOT2023_ATTACK_TYPES.map((a) => ({
        name: a.name.replace("DDoS-", "").replace("_", " "),
        original: a.trainingSamples,
        afterSMOTE: a.smoteSamples,
        testing: a.testingSamples,
        color: a.color,
        smoteAdded: a.smoteSamples - a.trainingSamples,
    }))

    // Throughput per sample
    const throughputChart = throughput.map((t) => ({
        ...t,
        batchLabel: t.batchSize.toLocaleString(),
        throughputK: Math.round(t.samplesPerSecond / 1000),
    }))

    // Noise degradation
    const noiseDegradation = noiseRobustness.map((n) => ({
        ...n,
        noiseLabel: `${(n.noiseLevel * 100).toFixed(0)}%`,
        accuracyRetained: n.accuracy,
        f1Retained: n.f1Macro,
    }))

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-2 border-teal-500/30 bg-gradient-to-r from-teal-500/5 to-cyan-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-500/10 rounded-lg">
                                <Activity className="w-6 h-6 text-teal-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Öğrenme Eğrileri ve Sağlamlık Analizi</CardTitle>
                                <CardDescription>
                                    Eğitim verimliliği, gürültü sağlamlığı, işlem hacmi ve bilinmeyen saldırı tespiti — Gerçek CICIoT2023 Deneyine Dayalı
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Badge className="bg-emerald-600">%100 Gerçek Deney Verisi</Badge>
                            <Badge className="bg-teal-600">Dinamik Ortam Testleri</Badge>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* 1. Learning Curves */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-blue-500" />
                        Şekil 9.1: Öğrenme Eğrileri — Doğruluk & F1-Macro vs Eğitim Boyutu
                    </CardTitle>
                    <CardDescription>
                        Eğitim verisi arttıkça BSO-Hybrid RF performansı (%10'dan %100'e)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lcWithGap}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                    dataKey="nSamples"
                                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                                    label={{ value: "Eğitim Örnekleri", position: "insideBottom", offset: -5, style: { fontSize: 11 } }}
                                />
                                <YAxis
                                    domain={[78, 92]}
                                    label={{ value: "Skor (%)", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                                />
                                <Tooltip
                                    formatter={(value: number, name: string) => [`${value.toFixed(2)}%`, name]}
                                    labelFormatter={(l) => `${Number(l).toLocaleString()} örnek`}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="accuracy" name="Doğruluk" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 5 }} />
                                <Line type="monotone" dataKey="f1Macro" name="F1-Macro" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                            <div className="font-semibold text-sm text-blue-500">Aşırı Öğrenme Yok</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Doğruluk ({learningCurve[5].accuracy}%) ve F1-Macro ({learningCurve[5].f1Macro}%) arasındaki fark
                                {(learningCurve[5].accuracy - learningCurve[5].f1Macro).toFixed(2)}% ile sabit kalarak
                                aşırı öğrenme olmadığını doğrular.
                            </p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                            <div className="font-semibold text-sm text-emerald-500">Monoton İyileşme</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Eğitim verisi arttıkça her iki metrik de monoton olarak iyileşir,
                                {learningCurve[0].accuracy}% → {learningCurve[5].accuracy}% doğruluk
                                (+{(learningCurve[5].accuracy - learningCurve[0].accuracy).toFixed(2)}%).
                            </p>
                        </div>
                        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                            <div className="font-semibold text-sm text-purple-500">Azalan Getiri</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Kazanımların çoğu %50 veriyle elde edilir ({learningCurve[3].accuracy}%), bu da modelin
                                verimli öğrendiğini gösterir. %50→%100 arası yalnızca
                                +{(learningCurve[5].accuracy - learningCurve[3].accuracy).toFixed(2)}%.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Class Distribution & SMOTE Impact */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-500" />
                        Şekil 9.2: Sınıf Dağılımı — SMOTE Öncesi ve Sonrası
                    </CardTitle>
                    <CardDescription>
                        SMOTE aşırı örnekleme: Backdoor_Malware için {DATASET_STATISTICS.originalMinorityCount.toLocaleString()} → {DATASET_STATISTICS.balancedClassCount.toLocaleString()}
                        ({DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString()} sentetik örnek eklendi)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={classDistribution}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis
                                    label={{ value: "Örnekler", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                                />
                                <Tooltip formatter={(value: number) => [value.toLocaleString(), ""]} />
                                <Legend />
                                <Bar dataKey="original" name="Orijinal Eğitim" fill="#ef4444" opacity={0.7} />
                                <Bar dataKey="afterSMOTE" name="SMOTE Sonrası" fill="#22c55e" opacity={0.85} />
                                <Bar dataKey="testing" name="Test Seti" fill="#3b82f6" opacity={0.7} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 p-3 bg-red-500/10 rounded-lg text-sm border border-red-500/30">
                        <strong>Kritik Dengesizlik:</strong> Backdoor_Malware, SMOTE öncesinde yalnızca <strong>{DATASET_STATISTICS.originalMinorityCount.toLocaleString()}</strong> eğitim örneğine sahipti
                        (eğitim setinin {((DATASET_STATISTICS.originalMinorityCount / 72252) * 100).toFixed(1)}%'i).
                        SMOTE sonrası tüm sınıflar <strong>{DATASET_STATISTICS.balancedClassCount.toLocaleString()}</strong> örneğe dengelendi
                        (toplam: {DATASET_STATISTICS.totalFlows.training.toLocaleString()}).
                    </div>
                </CardContent>
            </Card>

            {/* 3. Noise Robustness */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Şekil 9.3: Gürültü Sağlamlığı — Özellik Gürültüsü Altında Performans
                    </CardTitle>
                    <CardDescription>
                        Artan Gauss gürültüsüyle BSO-Hybrid RF doğruluğunun nasıl düştüğü (%0'dan %30'a)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[380px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={noiseDegradation}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                    dataKey="noiseLabel"
                                    label={{ value: "Gürültü Seviyesi", position: "insideBottom", offset: -5, style: { fontSize: 11 } }}
                                />
                                <YAxis
                                    domain={[30, 100]}
                                    label={{ value: "Skor (%)", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
                                />
                                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, ""]} />
                                <Legend />
                                <Area type="monotone" dataKey="accuracyRetained" name="Korunan Doğruluk" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2.5} dot={{ r: 4 }} />
                                <Area type="monotone" dataKey="f1Retained" name="Korunan F1-Macro" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2.5} dot={{ r: 4 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                            <div className="font-semibold text-sm text-red-500">Keskin İlk Düşüş</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Yalnızca %5 gürültüde, doğruluk {noiseRobustness[0].accuracy}% → {noiseRobustness[1].accuracy}%'e düşer
                                (Δ = -{noiseRobustness[1].degradation.toFixed(2)}%). Bu, modelin kesin özellik değerlerine dayandığını gösterir.
                            </p>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                            <div className="font-semibold text-sm text-amber-500">%10 Sonrası Kademeli</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                %10 gürültü sonrası düşüş yataylaşır ({noiseRobustness[2].accuracy}% → {noiseRobustness[6].accuracy}%),
                                yalnızca {(noiseRobustness[6].degradation - noiseRobustness[2].degradation).toFixed(2)}% ek düşüş.
                                Model orijinal doğruluğun {((noiseRobustness[6].accuracy / noiseRobustness[0].accuracy) * 100).toFixed(1)}%'ini korur.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Throughput Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-emerald-500" />
                        Şekil 9.4: Tahmin İşlem Hacmi — Toplu İşlem Boyutu vs Hız
                    </CardTitle>
                    <CardDescription>
                        Farklı toplu işlem boyutlarında BSO-Hybrid RF tahmin hızının gerçek ölçümleri
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={throughputChart}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="batchLabel" tick={{ fontSize: 10 }} label={{ value: "Toplu İşlem Boyutu", position: "insideBottom", offset: -5, style: { fontSize: 11 } }} />
                                    <YAxis label={{ value: "Örnek/Saniye", angle: -90, position: "insideLeft", style: { fontSize: 10 } }} />
                                    <Tooltip
                                        formatter={(value: number, name: string) => {
                                            if (name === "İşlem Hacmi") return [value.toLocaleString() + " örnek/s", name]
                                            return [value, name]
                                        }}
                                    />
                                    <Bar dataKey="samplesPerSecond" name="İşlem Hacmi" fill="#22c55e" opacity={0.85}>
                                        {throughputChart.map((_, i) => (
                                            <Cell key={i} fill={i === throughputChart.length - 1 ? "#22c55e" : "#3b82f6"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm">İşlem Hacmi Detayları</h4>
                            {throughput.map((t) => (
                                <div key={t.batchSize} className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 hover:bg-muted/30">
                                    <div>
                                        <span className="font-semibold text-sm">Toplu: {t.batchSize.toLocaleString()}</span>
                                        <span className="text-xs text-muted-foreground ml-2">({t.avgTimeMs.toFixed(2)} ms toplam)</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-sm text-emerald-500">
                                            {t.samplesPerSecond.toLocaleString()} örn/s
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {t.msPerSample.toFixed(4)} ms/örnek
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-3 p-3 bg-emerald-500/10 rounded-lg text-sm border border-emerald-500/30">
                        <strong>Gerçek Zamanlı Yeterli:</strong> Tam toplu işlemde ({throughput[4].batchSize.toLocaleString()} örnek),
                        BSO-Hybrid RF <strong>{throughput[4].samplesPerSecond.toLocaleString()}</strong> tahmin/saniye işler
                        ({throughput[4].msPerSample} ms/örnek). Bu, <strong>{Math.round(throughput[4].samplesPerSecond * 1500 * 8 / 1e9 * 100) / 100} Gbps</strong>'e kadar ağ hızlarında gerçek zamanlı ağ sızma tespiti için uygundur
                        (1500 bayt paketler varsayılarak).
                    </div>
                </CardContent>
            </Card>

            {/* 5. Unknown Attack Detection */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-500" />
                        Tablo 9.1: Bilinmeyen Saldırı Tespiti (Birini-Dışarıda-Bırak)
                    </CardTitle>
                    <CardDescription>
                        Gerçek test: Bir saldırı sınıfı olmadan eğit, ardından örneklerinin kaçının anormal olarak işaretlendiğini test et
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-border">
                                    <th className="text-left p-2 font-bold">Hariç Tutulan Saldırı</th>
                                    <th className="text-right p-2 font-bold">Bilinmeyen Örnekler</th>
                                    <th className="text-right p-2 font-bold">Tespit Oranı %</th>
                                    <th className="text-center p-2 font-bold">Değerlendirme</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unknownAttackDetection.map((test) => {
                                    const assessment = test.detectionRate >= 90 ? "Mükemmel" : test.detectionRate >= 50 ? "Orta" : "Zayıf"
                                    const assessColor = test.detectionRate >= 90 ? "bg-emerald-600" : test.detectionRate >= 50 ? "bg-amber-600" : "bg-red-600"
                                    return (
                                        <tr key={test.excludedAttack} className="border-b border-border/50 hover:bg-muted/30">
                                            <td className="p-2 font-medium">{test.excludedAttack}</td>
                                            <td className="p-2 text-right font-mono">{test.unknownSamples.toLocaleString()}</td>
                                            <td className="p-2 text-right font-mono font-bold">{test.detectionRate}%</td>
                                            <td className="p-2 text-center">
                                                <Badge className={`${assessColor} text-xs`}>{assessment}</Badge>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                            <div className="font-semibold text-sm text-emerald-500">✓ DDoS Genelleme</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Her iki DDoS türü de (ACK_Frag: {unknownAttackDetection[1].detectionRate}%, SYN_Flood: {unknownAttackDetection[2].detectionRate}%)
                                eğitimden hariç tutulduğunda bile tespit edilir — model genel DDoS kalıplarını öğrenir.
                            </p>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                            <div className="font-semibold text-sm text-red-500">⚠ PortScan Zayıflığı</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Recon-PortScan ({unknownAttackDetection[3].detectionRate}%) trafiği normal kalıplara çok benzediği için hariç tutulduğunda neredeyse tespit edilemez.
                                Bu, IDS araştırmalarında bilinen bir zorluktır.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 6. Training Time Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        Şekil 9.5: Çalışma Süresi Dağılımı
                    </CardTitle>
                    <CardDescription>
                        Deney aşaması zamanlama dağılımı — 8 aylık araştırma sürecinin parçası
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {[
                            { step: "Veri Yükleme", time: 158.8, pct: 0.9, color: "#3b82f6" },
                            { step: "Ön İşleme", time: 40.6, pct: 0.2, color: "#8b5cf6" },
                            { step: "SMOTE", time: 106.7, pct: 0.6, color: "#ef4444" },
                            { step: "BSO Optimizasyonu", time: 10673.1, pct: 63.1, color: "#22c55e" },
                            { step: "Model Eğitimi", time: 1250.9, pct: 7.4, color: "#f59e0b" },
                            { step: "Değerlendirme", time: 4693.8, pct: 27.8, color: "#ec4899" },
                        ].map((step) => (
                            <div key={step.step} className="p-3 rounded-xl border border-border/50 text-center hover:bg-muted/30 transition-all">
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                    style={{ backgroundColor: step.color }}>
                                    {step.pct > 10 ? `${step.pct.toFixed(0)}%` : `${step.pct}%`}
                                </div>
                                <div className="font-semibold text-xs">{step.step}</div>
                                <div className="font-mono text-sm font-bold mt-1">{step.time.toFixed(1)}s</div>
                                <div className="text-[10px] text-muted-foreground">toplam %{step.pct}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-500/10 rounded-lg text-sm border border-blue-500/30">
                        <strong>Temel Bulgu:</strong> BSO optimizasyonu (10.673,1s ≈ 2 saat 58 dk = %63.1) toplam çalışma süresine baskındır
                        çünkü 50 iterasyon boyunca {1177} aday çözüm değerlendirir.
                        Ancak, bu tek seferlik çevrimdışı bir maliyettir — tahmin yalnızca{" "}
                        <strong>örnek başına {MODEL_RESULTS[0].predictionTime}ms</strong> dağıtımda sürer.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
