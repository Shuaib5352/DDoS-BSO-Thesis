"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"

interface ExportPdfButtonProps {
    /** CSS selector or element ID to capture. Defaults to "#main-content" */
    targetSelector?: string
    /** Output filename (without .pdf) */
    filename?: string
    /** Button label */
    label?: string
    /** Additional CSS classes */
    className?: string
}

export default function ExportPdfButton({
    targetSelector,
    filename = "thesis-export",
    label = "PDF İndir",
    className = "",
}: ExportPdfButtonProps) {
    const [exporting, setExporting] = useState(false)

    const handleExport = async () => {
        setExporting(true)
        try {
            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
                import("html2canvas"),
                import("jspdf"),
            ])

            // Find the target element
            let target: HTMLElement | null = null
            if (targetSelector) {
                target = document.querySelector(targetSelector) as HTMLElement
            }
            // Fallback: try common containers
            if (!target) {
                target = document.querySelector("[role='tabpanel'][data-state='active']") as HTMLElement
                    || document.querySelector("main") as HTMLElement
                    || document.body
            }

            if (!target) {
                throw new Error("No content element found")
            }

            // Capture at high resolution
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
            const imgWidth = canvas.width
            const imgHeight = canvas.height

            // A4 dimensions in mm
            const pdfWidth = 210
            const pdfHeight = 297
            const margin = 10
            const contentWidth = pdfWidth - margin * 2
            const contentHeight = pdfHeight - margin * 2

            // Calculate scaling
            const ratio = contentWidth / imgWidth
            const scaledHeight = imgHeight * ratio

            // Create PDF — portrait A4
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            // If content fits one page
            if (scaledHeight <= contentHeight) {
                pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, scaledHeight)
            } else {
                // Multi-page: slice the canvas
                let yOffset = 0
                const pageImgHeight = contentHeight / ratio  // how many pixels per page
                let pageNum = 0

                while (yOffset < imgHeight) {
                    if (pageNum > 0) pdf.addPage()

                    // Create a page-sized canvas slice
                    const sliceHeight = Math.min(pageImgHeight, imgHeight - yOffset)
                    const pageCanvas = document.createElement("canvas")
                    pageCanvas.width = imgWidth
                    pageCanvas.height = sliceHeight
                    const ctx = pageCanvas.getContext("2d")
                    if (ctx) {
                        ctx.drawImage(
                            canvas,
                            0, yOffset,           // source x, y
                            imgWidth, sliceHeight, // source w, h
                            0, 0,                  // dest x, y
                            imgWidth, sliceHeight  // dest w, h
                        )
                        const sliceData = pageCanvas.toDataURL("image/jpeg", 0.95)
                        const sliceScaledH = sliceHeight * ratio
                        pdf.addImage(sliceData, "JPEG", margin, margin, contentWidth, sliceScaledH)
                    }

                    yOffset += pageImgHeight
                    pageNum++
                }
            }

            // Add footer on last page
            const pageCount = pdf.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i)
                pdf.setFontSize(7)
                pdf.setTextColor(150)
                pdf.text(
                    `BSO-Hybrid RF Thesis — SHUAIB AYAD JASIM — Page ${i}/${pageCount}`,
                    pdfWidth / 2, pdfHeight - 5,
                    { align: "center" }
                )
            }

            pdf.save(`${filename}.pdf`)
        } catch (err) {
            console.error("PDF export failed:", err)
            alert(`PDF dışa aktarma başarısız: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`)
        } finally {
            setExporting(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={exporting}
            className={`inline-flex items-center gap-1.5 text-xs h-8 px-3 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40 disabled:opacity-50 transition-colors no-print ${className}`}
        >
            {exporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
                <FileDown className="w-3.5 h-3.5" />
            )}
            {exporting ? "PDF oluşturuluyor..." : label}
        </button>
    )
}
