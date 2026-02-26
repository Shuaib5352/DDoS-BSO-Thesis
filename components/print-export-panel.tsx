"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Printer, Download, FileText, Image, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    // Delay cleanup to ensure download starts
    setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }, 100)
}

export default function PrintExportPanel() {
    const [exporting, setExporting] = useState<string | null>(null)
    const [lastResult, setLastResult] = useState<{ type: "success" | "error"; message: string } | null>(null)

    const showResult = (type: "success" | "error", message: string) => {
        setLastResult({ type, message })
        setTimeout(() => setLastResult(null), 4000)
    }

    const handlePrint = () => {
        try {
            setExporting("print")
            setTimeout(() => {
                window.print()
                setExporting(null)
                showResult("success", "Yazdırma penceresi başarıyla açıldı")
            }, 500)
        } catch (err) {
            setExporting(null)
            showResult("error", `Yazdırma başarısız: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`)
        }
    }

    const handleExportHTML = () => {
        try {
            setExporting("html")
            setTimeout(() => {
                try {
                    const html = document.documentElement.outerHTML
                    const blob = new Blob([html], { type: "text/html" })
                    downloadBlob(blob, "thesis-results-chapter.html")
                    setExporting(null)
                    showResult("success", "HTML dosyası başarıyla indirildi")
                } catch (err) {
                    setExporting(null)
                    showResult("error", `HTML dışa aktarma başarısız: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`)
                }
            }, 500)
        } catch (err) {
            setExporting(null)
            showResult("error", `HTML dışa aktarma başarısız: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`)
        }
    }

    const handleExportData = async () => {
        setExporting("data")
        try {
            const mod = await import("@/lib/ciciot2023-dataset")
            const data = {
                exportDate: new Date().toISOString(),
                title: "BSO-Hybrid RF Thesis Results — CICIoT2023",
                author: "SHUAIB AYAD JASIM",
                datasetStatistics: mod.DATASET_STATISTICS,
                modelResults: mod.MODEL_RESULTS,
                bsoParameters: mod.BSO_PARAMETERS,
                bsoSelectedFeatures: mod.BSO_SELECTED_FEATURES,
                confusionMatrices: mod.CONFUSION_MATRICES,
                perClassMetrics: mod.BSO_RF_PER_CLASS,
                statisticalTests: mod.STATISTICAL_TESTS,
                crossValidation: mod.CROSS_VALIDATION,
                dynamicEnvironment: mod.DYNAMIC_ENVIRONMENT,
                featureSelectionComparison: mod.FEATURE_SELECTION_COMPARISON,
                computationalEfficiency: mod.COMPUTATIONAL_EFFICIENCY,
                stateOfTheArt: mod.STATE_OF_THE_ART,
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
            downloadBlob(blob, "thesis-experiment-data.json")
            setExporting(null)
            showResult("success", "JSON verisi başarıyla dışa aktarıldı")
        } catch (err) {
            setExporting(null)
            showResult("error", `JSON dışa aktarma başarısız: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`)
        }
    }

    const handleExportCSV = async () => {
        setExporting("csv")
        try {
            const mod = await import("@/lib/ciciot2023-dataset")
            const headers = ["Model", "Accuracy", "Precision", "Recall", "F1-Weighted", "F1-Macro", "AUC-ROC", "MCC", "Features Used", "Training Time (s)", "Prediction Time (ms)", "FPR", "FNR", "Specificity"]
            const rows = mod.MODEL_RESULTS.map((m: { name: string; accuracy: number; precision: number; recall: number; f1Score: number; f1Macro: number; aucRoc: number; mcc: number; featuresUsed: number; trainingTime: number; predictionTime: number; falsePositiveRate: number; falseNegativeRate: number; specificity: number }) => [
                `"${m.name}"`, m.accuracy, m.precision, m.recall, m.f1Score, m.f1Macro,
                m.aucRoc, m.mcc, m.featuresUsed, m.trainingTime, m.predictionTime,
                m.falsePositiveRate, m.falseNegativeRate, m.specificity,
            ])
            const csv = [headers.join(","), ...rows.map((r: (string | number)[]) => r.join(","))].join("\n")
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
            downloadBlob(blob, "model-results-comparison.csv")
            setExporting(null)
            showResult("success", "CSV dosyası başarıyla dışa aktarıldı")
        } catch (err) {
            setExporting(null)
            showResult("error", `CSV dışa aktarma başarısız: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`)
        }
    }

    const exportOptions = [
        {
            id: "print",
            title: "Yazdır / PDF Olarak Kaydet",
            titleAr: "Sonuçları PDF olarak yazdır",
            description: "PDF olarak kaydetmek için tarayıcının yazdırma işlevini kullanın. Grafikler ve tablolar A4 kağıt için biçimlendirilecektir.",
            icon: Printer,
            color: "from-blue-500 to-blue-600",
            borderColor: "border-blue-500/30",
            onClick: handlePrint,
        },
        {
            id: "html",
            title: "HTML Olarak Dışa Aktar",
            titleAr: "HTML formatında dışa aktar",
            description: "Tüm sonuçların gömülü olduğu bağımsız bir HTML dosyası indirin.",
            icon: FileText,
            color: "from-purple-500 to-purple-600",
            borderColor: "border-purple-500/30",
            onClick: handleExportHTML,
        },
        {
            id: "data",
            title: "Sonuçları Dışa Aktar (JSON)",
            titleAr: "Verileri JSON olarak dışa aktar",
            description: "Python/R analizi için ham deney verilerini JSON olarak indirin.",
            icon: Download,
            color: "from-emerald-500 to-emerald-600",
            borderColor: "border-emerald-500/30",
            onClick: handleExportData,
        },
        {
            id: "csv",
            title: "Sonuçları Dışa Aktar (CSV)",
            titleAr: "Sonuçları CSV olarak dışa aktar",
            description: "Model karşılaştırma sonuçlarını Excel/Google Sheets için CSV olarak indirin.",
            icon: Image,
            color: "from-amber-500 to-amber-600",
            borderColor: "border-amber-500/30",
            onClick: handleExportCSV,
        },
    ]

    return (
        <div className="space-y-6 no-print">
            <Card className="border-2 border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-blue-500/5">
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-500/10 rounded-lg">
                                <Printer className="w-6 h-6 text-cyan-500" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Yazdır ve Dışa Aktar</CardTitle>
                                <CardDescription>
                                    Tez sonuçlarını belgeniz için yazdırın ve dışa aktarın
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Status Notification */}
            {lastResult && (
                <div className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all animate-fade-in ${lastResult.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
                    }`}>
                    {lastResult.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="font-medium text-sm">{lastResult.message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportOptions.map((option) => (
                    <Card
                        key={option.id}
                        role="button"
                        tabIndex={0}
                        aria-label={option.title}
                        className={`cursor-pointer hover:shadow-lg transition-all border-2 ${option.borderColor} hover:scale-[1.01] select-none active:scale-[0.99]`}
                        onClick={option.onClick}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); option.onClick() } }}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${option.color} text-white shadow-md`}>
                                    {exporting === option.id ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <option.icon className="w-6 h-6" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{option.title}</h3>
                                    <p className="text-xs text-muted-foreground mb-1">{option.titleAr}</p>
                                    <p className="text-sm text-muted-foreground">{option.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Print Tips */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        En İyi Baskı Kalitesi İçin İpuçları
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>En iyi PDF dışa aktarma kalitesi için <strong>Chrome</strong> veya <strong>Edge</strong> kullanın</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Grafikler için yazdırma ayarlarında <strong>&quot;Arka plan grafikleri&quot;</strong>ni etkinleştirin</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Dikey yönlendirme ile <strong>A4</strong> kağıt boyutunu seçin</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Sayfa başına daha fazla içerik için kenar boşluklarını <strong>Minimum</strong> olarak ayarlayın</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Yazdırmadan önce dışa aktarmak istediğiniz sekmeye gidin</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Sonuçların Python/R ile yeniden analizi için <strong>JSON dışa aktarımını</strong> kullanın</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
