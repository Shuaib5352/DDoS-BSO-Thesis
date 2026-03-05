"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   CopyLatexButton — reads an HTML table from the DOM by targetId,
   converts it to a LaTeX tabular environment, and copies to clipboard.
   ═══════════════════════════════════════════════════════════════ */
export default function CopyLatexButton({
    targetId,
    caption,
    label,
    buttonLabel = "LaTeX",
    className = "",
}: {
    targetId: string
    caption?: string
    label?: string
    buttonLabel?: string
    className?: string
}) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        const container = document.getElementById(targetId)
        if (!container) return

        const table = container.querySelector("table")
        if (!table) return

        // Parse the HTML table
        const rows: string[][] = []
        let maxCols = 0

        table.querySelectorAll("tr").forEach((tr) => {
            const cells: string[] = []
            tr.querySelectorAll("th, td").forEach((td) => {
                let text = (td as HTMLElement).innerText.trim()
                // Escape LaTeX special characters
                text = text
                    .replace(/%/g, "\\%")
                    .replace(/_/g, "\\_")
                    .replace(/&/g, "\\&")
                    .replace(/#/g, "\\#")
                    .replace(/\$/g, "\\$")
                    .replace(/±/g, "$\\pm$")
                    .replace(/→/g, "$\\rightarrow$")
                    .replace(/σ/g, "$\\sigma$")
                    .replace(/≤/g, "$\\leq$")
                    .replace(/≥/g, "$\\geq$")
                cells.push(text)
            })
            if (cells.length > maxCols) maxCols = cells.length
            rows.push(cells)
        })

        if (rows.length === 0) return

        // Determine column alignment (first col left, rest centered)
        const colSpec = "l" + "c".repeat(maxCols - 1)

        // Build LaTeX
        const lines: string[] = []
        lines.push("\\begin{table}[htbp]")
        lines.push("\\centering")
        if (caption) {
            lines.push(`\\caption{${caption}}`)
        }
        if (label) {
            lines.push(`\\label{tab:${label}}`)
        }
        lines.push(`\\begin{tabular}{${colSpec}}`)
        lines.push("\\hline")

        rows.forEach((row, i) => {
            // Pad row to maxCols
            while (row.length < maxCols) row.push("")
            const line = row.join(" & ") + " \\\\"
            lines.push(line)
            // Add hline after header row (first row)
            if (i === 0) {
                lines.push("\\hline\\hline")
            }
        })

        lines.push("\\hline")
        lines.push("\\end{tabular}")
        lines.push("\\end{table}")

        navigator.clipboard.writeText(lines.join("\n"))
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
    }

    return (
        <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1 text-[10px] h-7 px-2 rounded-md border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 no-print ${className}`}
        >
            {copied ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            ) : (
                <span className="font-mono text-[9px] font-bold">T<sub>E</sub>X</span>
            )}
            {copied ? "✓" : buttonLabel}
        </button>
    )
}
