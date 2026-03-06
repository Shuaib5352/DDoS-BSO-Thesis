"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Printer, Download, FileText, Image, CheckCircle2, Loader2, AlertCircle, Code2, Table2, Camera, FileDown } from "lucide-react"

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

    const handleExportLaTeX = async () => {
        setExporting("latex")
        try {
            const mod = await import("@/lib/ciciot2023-dataset")
            const models = mod.MODEL_RESULTS as { name: string; accuracy: number; precision: number; recall: number; f1Score: number; f1Macro: number; aucRoc: number; mcc: number; featuresUsed: number; trainingTime: number; predictionTime: number }[]
            const features = mod.BSO_SELECTED_FEATURES as { rank: number; name: string; importance: number }[]

            let latex = `% ═══════════════════════════════════════════════════════════════\n`
            latex += `% BSO-Hybrid RF Tez Tabloları — LaTeX Dışa Aktarma\n`
            latex += `% Oluşturulma Tarihi: ${new Date().toISOString()}\n`
            latex += `% Yazar: SHUAIB AYAD JASIM\n`
            latex += `% ═══════════════════════════════════════════════════════════════\n\n`

            // Table 1: Model Comparison
            latex += `% ─── Tablo 4.1: Model Karşılaştırma Sonuçları ───\n`
            latex += `\\begin{table}[htbp]\n`
            latex += `\\centering\n`
            latex += `\\caption{CICIoT2023 Veri Seti Üzerinde Model Karşılaştırma Sonuçları}\n`
            latex += `\\label{tab:model-comparison}\n`
            latex += `\\resizebox{\\textwidth}{!}{%\n`
            latex += `\\begin{tabular}{lcccccccc}\n`
            latex += `\\hline\n`
            latex += `\\textbf{Model} & \\textbf{Doğruluk} & \\textbf{Kesinlik} & \\textbf{Duyarlılık} & \\textbf{F1-Ağ.} & \\textbf{F1-Makro} & \\textbf{AUC-ROC} & \\textbf{MCC} & \\textbf{Öznitelik} \\\\\n`
            latex += `\\hline\n`
            models.forEach((m) => {
                const name = m.name.replace("(Proposed)", "(Önerilen)").replace(/ /g, "~")
                latex += `${name} & ${m.accuracy} & ${m.precision} & ${m.recall} & ${m.f1Score} & ${m.f1Macro} & ${m.aucRoc} & ${m.mcc.toFixed(4)} & ${m.featuresUsed} \\\\\n`
            })
            latex += `\\hline\n`
            latex += `\\end{tabular}}\n`
            latex += `\\end{table}\n\n`

            // Table 2: BSO Selected Features
            latex += `% ─── Tablo 4.2: BSO Seçilmiş Öznitelikler ───\n`
            latex += `\\begin{table}[htbp]\n`
            latex += `\\centering\n`
            latex += `\\caption{BSO Algoritması ile Seçilen 19 Öznitelik}\n`
            latex += `\\label{tab:bso-features}\n`
            latex += `\\begin{tabular}{clc}\n`
            latex += `\\hline\n`
            latex += `\\textbf{Sıra} & \\textbf{Öznitelik Adı} & \\textbf{Önem Değeri} \\\\\n`
            latex += `\\hline\n`
            features.forEach((f) => {
                const name = f.name.replace(/_/g, "\\_")
                latex += `${f.rank} & ${name} & ${f.importance.toFixed(6)} \\\\\n`
            })
            latex += `\\hline\n`
            latex += `\\end{tabular}\n`
            latex += `\\end{table}\n\n`

            // Table 3: Cross-Validation Results
            const cv = mod.CROSS_VALIDATION as { results: { fold: number; accuracy: number; precision: number; recall: number; f1Score: number }[], mean: { accuracy: number; precision: number; recall: number; f1Score: number }, std: { accuracy: number; precision: number; recall: number; f1Score: number } }
            latex += `% ─── Tablo 4.3: 10-Katlı Çapraz Doğrulama Sonuçları ───\n`
            latex += `\\begin{table}[htbp]\n`
            latex += `\\centering\n`
            latex += `\\caption{BSO-Hybrid RF 10-Katlı Tabakalı Çapraz Doğrulama Sonuçları}\n`
            latex += `\\label{tab:cross-validation}\n`
            latex += `\\begin{tabular}{ccccc}\n`
            latex += `\\hline\n`
            latex += `\\textbf{Katlama} & \\textbf{Doğruluk (\\%)} & \\textbf{Kesinlik (\\%)} & \\textbf{Duyarlılık (\\%)} & \\textbf{F1-Skor (\\%)} \\\\\n`
            latex += `\\hline\n`
            cv.results.forEach((r) => {
                latex += `K${r.fold} & ${r.accuracy.toFixed(2)} & ${r.precision.toFixed(2)} & ${r.recall.toFixed(2)} & ${r.f1Score.toFixed(2)} \\\\\n`
            })
            latex += `\\hline\n`
            latex += `\\textbf{Ort.} & ${cv.mean.accuracy.toFixed(2)} $\\pm$ ${cv.std.accuracy} & ${cv.mean.precision.toFixed(2)} $\\pm$ ${cv.std.precision} & ${cv.mean.recall.toFixed(2)} $\\pm$ ${cv.std.recall} & ${cv.mean.f1Score.toFixed(2)} $\\pm$ ${cv.std.f1Score} \\\\\n`
            latex += `\\hline\n`
            latex += `\\end{tabular}\n`
            latex += `\\end{table}\n`

            const blob = new Blob([latex], { type: "text/x-tex;charset=utf-8" })
            downloadBlob(blob, "thesis-tables.tex")
            setExporting(null)
            showResult("success", "LaTeX tabloları başarıyla dışa aktarıldı (3 tablo)")
        } catch (err) {
            setExporting(null)
            showResult("error", `LaTeX dışa aktarma başarısız: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`)
        }
    }

    const handleExportFeaturesCSV = async () => {
        setExporting("features-csv")
        try {
            const mod = await import("@/lib/ciciot2023-dataset")
            const features = mod.BSO_SELECTED_FEATURES as { rank: number; name: string; importance: number; originalIndex: number }[]
            const headers = ["Rank", "Feature Name", "Importance", "Original Index", "Contribution (%)"]
            const totalImp = features.reduce((s, f) => s + f.importance, 0)
            const rows = features.map((f) => [
                f.rank, `"${f.name}"`, f.importance.toFixed(6), f.originalIndex, ((f.importance / totalImp) * 100).toFixed(2),
            ])
            const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" })
            downloadBlob(blob, "bso-selected-features.csv")
            setExporting(null)
            showResult("success", "Öznitelik CSV dosyası başarıyla dışa aktarıldı")
        } catch (err) {
            setExporting(null)
            showResult("error", `Öznitelik CSV dışa aktarma başarısız: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`)
        }
    }

    const handleExportFiguresPNG = () => {
        // Dispatch event to page.tsx which will switch tabs and capture
        window.dispatchEvent(new CustomEvent("export-png-request", { detail: { type: "figures" } }))
        showResult("success", "Şekiller sekmesine geçiliyor ve PNG oluşturuluyor... Lütfen bekleyin.")
    }

    const handleExportTablesPNG = () => {
        // Dispatch event to page.tsx which will switch tabs and capture
        window.dispatchEvent(new CustomEvent("export-png-request", { detail: { type: "tables" } }))
        showResult("success", "Tablolar sekmesine geçiliyor ve PNG oluşturuluyor... Lütfen bekleyin.")
    }

    const handleExportPDF = async () => {
        setExporting("pdf")
        try {
            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
                import("html2canvas"),
                import("jspdf"),
            ])

            const target =
                (document.querySelector("[role='tabpanel'][data-state='active']") as HTMLElement) ||
                (document.querySelector("main") as HTMLElement) ||
                document.body

            const canvas = await html2canvas(target, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                windowWidth: target.scrollWidth,
                windowHeight: target.scrollHeight,
            })

            const imgData = canvas.toDataURL("image/jpeg", 0.95)
            const pdfW = 210
            const pdfH = 297
            const margin = 10
            const cW = pdfW - margin * 2
            const ratio = cW / canvas.width
            const cH = pdfH - margin * 2
            const pagePixH = cH / ratio

            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
            let yOff = 0
            let pg = 0
            while (yOff < canvas.height) {
                if (pg > 0) pdf.addPage()
                const sliceH = Math.min(pagePixH, canvas.height - yOff)
                const sliceCanvas = document.createElement("canvas")
                sliceCanvas.width = canvas.width
                sliceCanvas.height = sliceH
                const ctx = sliceCanvas.getContext("2d")
                if (ctx) {
                    ctx.drawImage(canvas, 0, yOff, canvas.width, sliceH, 0, 0, canvas.width, sliceH)
                    pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.95), "JPEG", margin, margin, cW, sliceH * ratio)
                }
                yOff += pagePixH
                pg++
            }
            const total = pdf.getNumberOfPages()
            for (let i = 1; i <= total; i++) {
                pdf.setPage(i)
                pdf.setFontSize(7)
                pdf.setTextColor(150)
                pdf.text(`BSO-Hybrid RF Thesis — SHUAIB AYAD JASIM — Page ${i}/${total}`, pdfW / 2, pdfH - 5, { align: "center" })
            }
            pdf.save("thesis-active-tab.pdf")
            setExporting(null)
            showResult("success", `PDF başarıyla oluşturuldu (${total} sayfa)`)
        } catch (err) {
            setExporting(null)
            showResult("error", `PDF dışa aktarma başarısız: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`)
        }
    }

    const exportOptions = [
        {
            id: "pdf",
            title: "PDF Olarak İndir (Aktif Sekme)",
            titleAr: "Açık olan sekmeyi yüksek kalitede PDF olarak indir",
            description: "Şu an açık olan sekmeyi yüksek çözünürlüklü A4 PDF dosyasına dönüştürüp indirin. Tüm grafikler ve tablolar dahildir.",
            icon: FileDown,
            color: "from-red-500 to-rose-600",
            borderColor: "border-red-500/30",
            onClick: handleExportPDF,
        },
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
        {
            id: "latex",
            title: "LaTeX Tabloları Dışa Aktar",
            titleAr: "Tabloları LaTeX formatında dışa aktar",
            description: "Tez için hazır 3 tablo: model karşılaştırma, BSO öznitelikleri ve çapraz doğrulama sonuçları (.tex dosyası).",
            icon: Code2,
            color: "from-rose-500 to-rose-600",
            borderColor: "border-rose-500/30",
            onClick: handleExportLaTeX,
        },
        {
            id: "features-csv",
            title: "Öznitelik Tablosu (CSV)",
            titleAr: "BSO seçilmiş öznitelikleri CSV olarak dışa aktar",
            description: "BSO tarafından seçilen 19 özniteliğin önem değerleri ve sıralamasını CSV olarak indirin.",
            icon: Table2,
            color: "from-teal-500 to-teal-600",
            borderColor: "border-teal-500/30",
            onClick: handleExportFeaturesCSV,
        },
        {
            id: "figures-png",
            title: "Şekilleri PNG Olarak İndir",
            titleAr: "Tüm şekilleri yüksek çözünürlüklü PNG olarak indir",
            description: "Açık olan tüm şekilleri 300 DPI yüksek çözünürlüklü PNG formatında indirin. Önce Şekiller sekmesinde şekilleri açın.",
            icon: Camera,
            color: "from-sky-500 to-cyan-600",
            borderColor: "border-sky-500/30",
            onClick: handleExportFiguresPNG,
        },
        {
            id: "tables-png",
            title: "Tabloları PNG Olarak İndir",
            titleAr: "Görünen tabloları yüksek çözünürlüklü PNG olarak indir",
            description: "Görünen tüm tabloları 300 DPI yüksek çözünürlüklü PNG formatında indirin. Önce Tablolar sekmesine gidin.",
            icon: Camera,
            color: "from-indigo-500 to-violet-600",
            borderColor: "border-indigo-500/30",
            onClick: handleExportTablesPNG,
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
