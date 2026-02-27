"use client"

import Link from "next/link"
import { Shield, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
            <div className="text-center space-y-8 max-w-xl">
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center">
                            <Shield className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                            <span className="text-2xl font-black text-red-500">!</span>
                        </div>
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tight">404</h1>
                    <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                        Sayfa Bulunamadı
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                        Tez paneline geri dönmek için aşağıdaki butonu kullanabilirsiniz.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                        <Home className="w-4 h-4" />
                        Ana Sayfaya Dön
                    </Link>
                    <button
                        onClick={() => typeof window !== "undefined" && window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Geri Git
                    </button>
                </div>

                {/* Footer */}
                <p className="text-[10px] text-slate-400 dark:text-slate-600">
                    DDoS Saldırılarının Geliştirilmiş Tespiti — BSO-Hibrit RF Çerçevesi
                </p>
            </div>
        </div>
    )
}
