"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Loader2, CheckCircle2 } from "lucide-react"

interface ExportPngButtonProps {
    /** ID of the DOM element to capture */
    targetId: string
    /** Filename (without .png extension) */
    filename: string
    /** Label text on the button */
    label?: string
    /** Pixel ratio for high-res export (default 3 = ~300 DPI) */
    pixelRatio?: number
    /** Additional CSS class */
    className?: string
    /** Button variant */
    variant?: "outline" | "default" | "secondary" | "ghost" | "destructive" | "link"
    /** Button size */
    size?: "sm" | "default" | "lg" | "icon"
}

export default function ExportPngButton({
    targetId,
    filename,
    label = "PNG",
    pixelRatio = 3,
    className = "",
    variant = "outline",
    size = "sm",
}: ExportPngButtonProps) {
    const [status, setStatus] = useState<"idle" | "exporting" | "done">("idle")

    const handleExport = useCallback(async () => {
        const node = document.getElementById(targetId)
        if (!node) return

        setStatus("exporting")
        try {
            const { toPng } = await import("html-to-image")
            const dataUrl = await toPng(node, {
                pixelRatio,
                backgroundColor: "#ffffff",
                cacheBust: true,
                style: {
                    transform: "scale(1)",
                    transformOrigin: "top left",
                },
            })

            // Download
            const link = document.createElement("a")
            link.download = `${filename}.png`
            link.href = dataUrl
            link.click()

            setStatus("done")
            setTimeout(() => setStatus("idle"), 2000)
        } catch (err) {
            console.error("PNG export failed:", err)
            setStatus("idle")
        }
    }, [targetId, filename, pixelRatio])

    return (
        <Button
            variant={variant}
            size={size}
            className={`text-[10px] h-7 px-2 ${className}`}
            onClick={handleExport}
            disabled={status === "exporting"}
        >
            {status === "exporting" ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : status === "done" ? (
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
            ) : (
                <Camera className="w-3 h-3 mr-1" />
            )}
            {status === "done" ? "✓" : label}
        </Button>
    )
}


/**
 * Export all matching elements as a batch download
 */
export function ExportAllPngButton({
    targetSelector,
    filenamePrefix,
    label = "Tümünü PNG Olarak İndir",
    pixelRatio = 3,
}: {
    targetSelector: string
    filenamePrefix: string
    label?: string
    pixelRatio?: number
}) {
    const [status, setStatus] = useState<"idle" | "exporting" | "done">("idle")
    const [progress, setProgress] = useState("")

    const handleExportAll = useCallback(async () => {
        const nodes = document.querySelectorAll(targetSelector)
        if (nodes.length === 0) return

        setStatus("exporting")
        try {
            const { toPng } = await import("html-to-image")

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i] as HTMLElement
                setProgress(`${i + 1}/${nodes.length}`)

                const dataUrl = await toPng(node, {
                    pixelRatio,
                    backgroundColor: "#ffffff",
                    cacheBust: true,
                })

                const link = document.createElement("a")
                const id = node.id || `${filenamePrefix}_${String(i + 1).padStart(2, "0")}`
                link.download = `${id}.png`
                link.href = dataUrl
                link.click()

                // Small delay between downloads
                await new Promise((r) => setTimeout(r, 300))
            }

            setStatus("done")
            setProgress("")
            setTimeout(() => setStatus("idle"), 3000)
        } catch (err) {
            console.error("Batch PNG export failed:", err)
            setStatus("idle")
            setProgress("")
        }
    }, [targetSelector, filenamePrefix, pixelRatio])

    return (
        <Button
            variant="default"
            size="sm"
            className="text-xs h-8 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            onClick={handleExportAll}
            disabled={status === "exporting"}
        >
            {status === "exporting" ? (
                <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    İndiriliyor... {progress}
                </>
            ) : status === "done" ? (
                <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-white" />
                    Tamamlandı!
                </>
            ) : (
                <>
                    <Camera className="w-3.5 h-3.5 mr-1.5" />
                    {label}
                </>
            )}
        </Button>
    )
}
