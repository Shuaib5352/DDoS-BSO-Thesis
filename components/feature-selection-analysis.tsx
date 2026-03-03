"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    Legend,
} from "recharts"
import { AlertCircle, CheckCircle2, Shield, Zap } from "lucide-react"
import { BSO_SELECTED_FEATURES, MODEL_RESULTS, DATASET_STATISTICS } from "@/lib/ciciot2023-dataset"

export default function FeatureSelectionAnalysis() {
    /* ═══════════════════════════════════════════════════════════════
       GERÇEK VERİ: BSO Tarafından Seçilen 19 Öznitelik
       Kaynak: lib/ciciot2023-dataset.ts → BSO_SELECTED_FEATURES
       Deney Tarihi: 2026-02-23 | Toplam Süre: 22.2 dk
       ═══════════════════════════════════════════════════════════════ */

    /* Öznitelik açıklamaları — CICIoT2023 veri seti gerçek alan adları */
    const featureDescriptions: Record<string, { tr: string; category: string }> = {
        "syn_count": { tr: "SYN Paket Sayısı", category: "TCP Bayrakları" },
        "Number": { tr: "Paket Sayısı", category: "Ağ Trafiği" },
        "Tot sum": { tr: "Toplam Paket Boyutu", category: "Ağ Trafiği" },
        "Rate": { tr: "Paket Hızı", category: "Ağ Trafiği" },
        "Max": { tr: "Maksimum Paket Boyutu", category: "Paket Boyutu" },
        "Header_Length": { tr: "Başlık Uzunluğu", category: "Paket Başlığı" },
        "HTTPS": { tr: "HTTPS Protokolü", category: "Protokol" },
        "Time_To_Live": { tr: "Yaşam Süresi (TTL)", category: "Paket Başlığı" },
        "psh_flag_number": { tr: "PSH Bayrağı Sayısı", category: "TCP Bayrakları" },
        "HTTP": { tr: "HTTP Protokolü", category: "Protokol" },
        "fin_flag_number": { tr: "FIN Bayrağı Sayısı", category: "TCP Bayrakları" },
        "UDP": { tr: "UDP Protokolü", category: "Protokol" },
        "DNS": { tr: "DNS Protokolü", category: "Protokol" },
        "ARP": { tr: "ARP Protokolü", category: "Protokol" },
        "LLC": { tr: "LLC Protokolü", category: "Protokol" },
        "SSH": { tr: "SSH Protokolü", category: "Protokol" },
        "DHCP": { tr: "DHCP Protokolü", category: "Protokol" },
        "IGMP": { tr: "IGMP Protokolü", category: "Protokol" },
        "cwr_flag_number": { tr: "CWR Bayrağı Sayısı", category: "TCP Bayrakları" },
    }

    /* Grafik verisi — gerçek önem değerleri */
    const chartData = BSO_SELECTED_FEATURES.map((f) => ({
        name: f.name,
        importance: +(f.importance * 100).toFixed(2),
        tr: featureDescriptions[f.name]?.tr || f.name,
    }))

    /* Gerçek model karşılaştırması: BSO-RF (19 öznitelik) vs Tüm öznitelikler (39) kullanan modeller */
    const comparisonData = [
        {
            model: "BSO-Hybrid RF",
            features: DATASET_STATISTICS.selectedFeatures,
            accuracy: MODEL_RESULTS[0].accuracy,
            f1Macro: MODEL_RESULTS[0].f1Macro,
            trainingTime: MODEL_RESULTS[0].trainingTime,
            featureSet: "BSO (19)",
            isProposed: true,
        },
        ...MODEL_RESULTS.filter((m) => m.featureSet === "All").map((m) => ({
            model: m.name,
            features: m.featuresUsed,
            accuracy: m.accuracy,
            f1Macro: m.f1Macro,
            trainingTime: m.trainingTime,
            featureSet: `Tümü (${m.featuresUsed})`,
            isProposed: false,
        })),
    ]

    return (
        <div className="space-y-6">
            {/* ════════════════════ BAŞLIK ════════════════════ */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Öznitelik Seçimi Analizi
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    BSO (Yarasa Sürüsü Optimizasyonu) algoritmasının {DATASET_STATISTICS.totalFeatures} öznitelikten {DATASET_STATISTICS.selectedFeatures}&apos;unu nasıl seçtiğini ve performansa etkisini inceleyin
                </p>
                <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300">
                    <Shield className="w-3 h-3 mr-1" /> Tüm veriler gerçek deney sonuçlarıdır (2026-02-23)
                </Badge>
            </div>

            {/* ════════════════════ ÖNEMLİ UYARI ════════════════════ */}
            <Card className="border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-900/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                        <AlertCircle className="w-5 h-5" />
                        Niçin {DATASET_STATISTICS.selectedFeatures} Öznitelik Seçildi?
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-amber-900 dark:text-amber-100 space-y-3">
                    <p>
                        <strong>BSO Optimizasyonu:</strong> {DATASET_STATISTICS.totalFeatures} öznitelikten yalnızca {DATASET_STATISTICS.selectedFeatures} tanesi seçilmiştir (%{DATASET_STATISTICS.featureReductionPct} boyut azaltma).
                        Bu seçim otomatik olarak BSO algoritması tarafından yapılmıştır:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Popülasyon:</strong> 25 yarasa ile 50 iterasyon boyunca arama yapıldı</li>
                        <li><strong>Uygunluk Fonksiyonu:</strong> 1 - F1_macro + 0.01 × (seçilen/toplam)</li>
                        <li><strong>Toplam Değerlendirme:</strong> 1.177 farklı öznitelik kombinasyonu test edildi</li>
                        <li><strong>Optimizasyon Süresi:</strong> 840.43 saniye (14 dakika)</li>
                        <li><strong>Sonuç:</strong> %{MODEL_RESULTS[0].accuracy} doğruluk, %{MODEL_RESULTS[0].f1Macro} F1-Makro</li>
                    </ul>
                </CardContent>
            </Card>

            {/* ════════════════════ ÖZNİTELİK ÖNEM GRAFİĞİ ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle>Öznitelik Önem Sıralaması (Gerçek BSO Sonuçları)</CardTitle>
                    <CardDescription>
                        BSO-Hybrid RF modelinde her özniteliğin katkı yüzdesi — Toplam: %100
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart data={chartData} layout="vertical" margin={{ left: 120 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" label={{ value: "Önem (%)", position: "insideBottomRight", offset: -5 }} />
                            <YAxis type="category" dataKey="tr" tick={{ fontSize: 11 }} width={115} />
                            <Tooltip
                                formatter={(val: number) => [`%${val.toFixed(2)}`, "Önem"]}
                                labelFormatter={(label) => `Öznitelik: ${label}`}
                            />
                            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index < 3 ? "#10b981" : index < 6 ? "#3b82f6" : index < 10 ? "#8b5cf6" : "#94a3b8"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 mt-4 justify-center text-xs">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Çok Yüksek (İlk 3)</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Yüksek (4-6)</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-500 inline-block" /> Orta (7-10)</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-400 inline-block" /> Düşük (11-19)</span>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ SEÇİLEN ÖZNİTELİKLER TABLOSU ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        BSO Tarafından Seçilen {DATASET_STATISTICS.selectedFeatures} Öznitelik
                    </CardTitle>
                    <CardDescription>
                        Gerçek önem değerleri — CICIoT2023 veri seti öznitelik adları
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white w-12">#</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Öznitelik (Orijinal)</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Açıklama</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Önem Değeri</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Kategori</th>
                                </tr>
                            </thead>
                            <tbody>
                                {BSO_SELECTED_FEATURES.map((feature, idx) => {
                                    const desc = featureDescriptions[feature.name]
                                    return (
                                        <tr
                                            key={idx}
                                            className={`border-b border-slate-200 dark:border-slate-700 ${feature.rank <= 3
                                                ? "bg-emerald-50 dark:bg-emerald-900/20"
                                                : idx % 2 === 0
                                                    ? "bg-slate-50 dark:bg-slate-800/30"
                                                    : "bg-white dark:bg-slate-900"
                                                }`}
                                        >
                                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-white text-center">
                                                {feature.rank}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-xs text-slate-700 dark:text-slate-300">
                                                {feature.name}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                                {desc?.tr || feature.name}
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        feature.rank <= 3
                                                            ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-300"
                                                            : feature.rank <= 6
                                                                ? "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200 border-blue-300"
                                                                : feature.rank <= 10
                                                                    ? "bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200 border-violet-300"
                                                                    : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200 border-slate-300"
                                                    }
                                                >
                                                    {(feature.importance * 100).toFixed(2)}%
                                                </Badge>
                                            </td>
                                            <td className="text-center py-3 px-4 text-slate-700 dark:text-slate-300">
                                                <span className="inline-block bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                                                    {desc?.category || "Diğer"}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ════════════════════ GERÇEK MODEL KARŞILAŞTIRMASI ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        BSO Seçimi (19) vs Tüm Öznitelikler (39) — Gerçek Karşılaştırma
                    </CardTitle>
                    <CardDescription>
                        Aynı test verisi üzerinde ölçülen gerçek deney sonuçları
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Model</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Öznitelik</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Doğruluk</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">F1-Makro</th>
                                    <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">Eğitim Süresi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className={`border-b border-slate-200 dark:border-slate-700 ${row.isProposed
                                            ? "bg-emerald-50 dark:bg-emerald-900/20"
                                            : idx % 2 === 0
                                                ? "bg-slate-50 dark:bg-slate-800/30"
                                                : "bg-white dark:bg-slate-900"
                                            }`}
                                    >
                                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                                            {row.model} {row.isProposed && "⭐"}
                                        </td>
                                        <td className="text-center py-3 px-4">
                                            <Badge variant={row.isProposed ? "default" : "secondary"}
                                                className={row.isProposed ? "bg-emerald-500" : ""}>
                                                {row.featureSet}
                                            </Badge>
                                        </td>
                                        <td className="text-center py-3 px-4 text-slate-700 dark:text-slate-300">
                                            %{row.accuracy}
                                        </td>
                                        <td className="text-center py-3 px-4 text-slate-700 dark:text-slate-300">
                                            %{row.f1Macro}
                                        </td>
                                        <td className="text-center py-3 px-4 text-slate-700 dark:text-slate-300">
                                            {row.trainingTime}s
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center italic">
                        Not: BSO-Hybrid RF yalnızca 19 öznitelik ile 39 öznitelik kullanan modellere karşı rekabetçi performans göstermiştir.
                    </p>
                </CardContent>
            </Card>

            {/* ════════════════════ 39 vs 19 ÖZNİTELİK KARŞILAŞTIRMA GRAFİĞİ ════════════════════ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        Şekil 4.X: 39 vs 19 Öznitelik — Model Performans Karşılaştırması
                    </CardTitle>
                    <CardDescription>
                        Aynı modelin tüm öznitelikler (39) ve BSO seçimi (19) ile elde ettiği doğruluk, F1-Macro ve AUC-ROC karşılaştırması
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {(() => {
                        /* Build chart data: BSO optimized models vs their All-feature counterparts */
                        const bsoModel = MODEL_RESULTS[0] // BSO-Hybrid RF (19 features)
                        const rfAll = MODEL_RESULTS.find((m) => m.name === "Random Forest")! // RF (39 features)
                        const xgbAll = MODEL_RESULTS.find((m) => m.name === "XGBoost")! // XGBoost (39 features)
                        const svmAll = MODEL_RESULTS.find((m) => m.name === "SVM (Linear)")! // SVM (39 features)
                        const bsoSvm = MODEL_RESULTS[1]  // BSO-SVM (19 features)

                        const grouped = [
                            { metric: "Doğruluk (%)", "BSO-RF (19)": bsoModel.accuracy, "RF (39)": rfAll.accuracy, "XGBoost (39)": xgbAll.accuracy },
                            { metric: "F1-Macro (%)", "BSO-RF (19)": bsoModel.f1Macro, "RF (39)": rfAll.f1Macro, "XGBoost (39)": xgbAll.f1Macro },
                            { metric: "AUC-ROC (%)", "BSO-RF (19)": bsoModel.aucRoc, "RF (39)": rfAll.aucRoc, "XGBoost (39)": xgbAll.aucRoc },
                            { metric: "MCC (×100)", "BSO-RF (19)": +(bsoModel.mcc * 100).toFixed(1), "RF (39)": +(rfAll.mcc * 100).toFixed(1), "XGBoost (39)": +(xgbAll.mcc * 100).toFixed(1) },
                        ]

                        return (
                            <>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={grouped} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                            <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
                                            <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} />
                                            <Tooltip formatter={(v: number) => [`${v.toFixed(2)}`, ""]} />
                                            <Legend wrapperStyle={{ fontSize: 11 }} />
                                            <Bar dataKey="BSO-RF (19)" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="RF (39)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="XGBoost (39)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-center">
                                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">BSO-RF (19 Öznitelik)</div>
                                        <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">%{bsoModel.accuracy}</div>
                                        <div className="text-[10px] text-emerald-600/70">%51.3 daha az öznitelik</div>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
                                        <div className="text-xs text-blue-600 dark:text-blue-400 font-bold">RF (39 Öznitelik)</div>
                                        <div className="text-lg font-black text-blue-700 dark:text-blue-300">%{rfAll.accuracy}</div>
                                        <div className="text-[10px] text-blue-600/70">Δ = {(bsoModel.accuracy - rfAll.accuracy).toFixed(2)}%</div>
                                    </div>
                                    <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 text-center">
                                        <div className="text-xs text-amber-600 dark:text-amber-400 font-bold">XGBoost (39 Öznitelik)</div>
                                        <div className="text-lg font-black text-amber-700 dark:text-amber-300">%{xgbAll.accuracy}</div>
                                        <div className="text-[10px] text-amber-600/70">Δ = {(bsoModel.accuracy - xgbAll.accuracy).toFixed(2)}%</div>
                                    </div>
                                </div>
                                <div className="mt-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40">
                                    <p className="text-xs text-purple-700 dark:text-purple-300">
                                        <strong>Temel Bulgu:</strong> BSO-RF sadece 19 öznitelik ile (%51.3 azaltma), 39 öznitelik kullanan RF&apos;ye karşı
                                        rekabetçi performans (Δ = +{(bsoModel.accuracy - rfAll.accuracy).toFixed(2)}%) sergiler ve XGBoost&apos;a yakın sonuçlar (Δ = {(bsoModel.accuracy - xgbAll.accuracy).toFixed(2)}%) elde eder.
                                        Bu, BSO öznitelik seçiminin gürültülü/artık öznitelikleri eleyerek modelin genelleme yeteneğini koruduğunu gösterir.
                                    </p>
                                </div>
                            </>
                        )
                    })()}
                </CardContent>
            </Card>

            {/* ════════════════════ SONUÇ VE AKADEMİK DEĞERİ ════════════════════ */}
            <Card className="border-blue-200 dark:border-blue-800/40 bg-blue-50/50 dark:bg-blue-900/20">
                <CardHeader>
                    <CardTitle className="text-blue-900 dark:text-blue-100">
                        Sonuç ve Akademik Değeri
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-900 dark:text-blue-100 space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">📊 Gerçek Deney Sonuçları:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>{DATASET_STATISTICS.totalFeatures} öznitelikten <strong>{DATASET_STATISTICS.selectedFeatures} seçilmiştir (%{DATASET_STATISTICS.featureReductionPct} azaltma)</strong></li>
                            <li>Doğruluk: <strong>%{MODEL_RESULTS[0].accuracy}</strong> | F1-Makro: <strong>%{MODEL_RESULTS[0].f1Macro}</strong></li>
                            <li>AUC-ROC: <strong>%{MODEL_RESULTS[0].aucRoc}</strong> | MCC: <strong>{MODEL_RESULTS[0].mcc}</strong></li>
                            <li>Eğitim süresi: <strong>{MODEL_RESULTS[0].trainingTime}s</strong> | Tahmin süresi: <strong>{MODEL_RESULTS[0].predictionTime}s</strong></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">💡 Akademik Çıkarımlar:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>En önemli 3 öznitelik: <strong>syn_count (%22.45)</strong>, <strong>Number (%18.34)</strong>, <strong>Tot sum (%15.41)</strong></li>
                            <li>Bu 3 öznitelik toplam önemin <strong>%56.2</strong>&apos;sini oluşturmaktadır</li>
                            <li>TCP bayrakları (syn_count, psh, fin, cwr) DDoS tespitinde kritik rol oynamaktadır</li>
                            <li>Protokol bilgileri (HTTPS, HTTP, UDP, DNS) saldırı türlerinin ayrımında etkilidir</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">🎯 Savunma Sorusu ve Cevabı:</h4>
                        <p className="text-sm">
                            <strong>Soru:</strong> &quot;Neden tam 19 öznitelik seçildi?&quot; →
                            <strong> Cevap:</strong> &quot;BSO algoritması 1.177 farklı kombinasyonu test ederek, F1-makro skorunu maksimize eden
                            ve aynı zamanda gereksiz öznitelikleri cezalandıran uygunluk fonksiyonuyla bu sayıya ulaşmıştır.
                            Sonuç: %51.3 boyut azaltma ile %89.82 doğruluk korunmuştur.&quot;
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}