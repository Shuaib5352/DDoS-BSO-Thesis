export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="text-center space-y-6">
                {/* Spinner */}
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                        Yükleniyor...
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        DDoS Tespit Paneli hazırlanıyor
                    </p>
                </div>

                {/* Skeleton bars */}
                <div className="max-w-xs mx-auto space-y-3 pt-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-4/5" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse w-3/5" />
                </div>
            </div>
        </div>
    )
}
