"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10 bg-transparent">
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`w-10 h-10 transition-all duration-300 hover:scale-110 ${
        theme === "dark"
          ? "bg-slate-800 hover:bg-slate-700 border-slate-600"
          : "bg-amber-100 hover:bg-amber-200 border-amber-300"
      }`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400 transition-all duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-all duration-300 rotate-0 hover:-rotate-12" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
