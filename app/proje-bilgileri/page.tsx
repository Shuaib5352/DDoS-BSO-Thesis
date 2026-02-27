import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen, Award } from "lucide-react"

export default function ProjectInfoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                        Proje Bilgileri
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        DDoS Saldırısı Tespiti - BSO ve Rastgele Orman Sınıflandırıcısı
                    </p>
                </div>

                {/* Project Main Info */}
                <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                    <CardHeader className="bg-blue-100 dark:bg-blue-900 rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                            <BookOpen className="w-6 h-6" />
                            Proje Başlığı
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            DDoS Saldırılarının Tespit Edilmesi: Yarasabotu Optimizasyon Algoritması (BSO)
                            ile Rastgele Orman Sınıflandırıcısı Kombinasyonu - CICIoT2023 Veri Seti Uygulaması
                        </p>
                    </CardContent>
                </Card>

                {/* Student Info */}
                <Card className="border-2 border-green-200 dark:border-green-800">
                    <CardHeader className="bg-green-100 dark:bg-green-900 rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                            <Award className="w-6 h-6" />
                            Öğrenci Bilgisi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <Badge className="mb-2 bg-green-600 hover:bg-green-700">Yüksek Lisans Öğrencisi</Badge>
                            <p className="text-slate-600 dark:text-slate-300 text-sm">Adı:</p>
                            <p className="text-xl font-semibold text-slate-900 dark:text-white">
                                Shuaib5352
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm">E-Posta:</p>
                            <p className="text-slate-900 dark:text-white font-mono">
                                shuaib5352@gmail.com
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm">Teslim Tarihi:</p>
                            <p className="text-slate-900 dark:text-white font-semibold">
                                27 Şubat 2026
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Advisor Info */}
                <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
                    <CardHeader className="bg-purple-100 dark:bg-purple-900 rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                            <GraduationCap className="w-6 h-6" />
                            Tez Danışmanı
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="border-l-4 border-purple-500 pl-4">
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">AD SOYAD:</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-3">
                                Dr. Saim Ervural
                            </p>

                            <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">UNVAN:</p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                Doktor / Öğretim Görevlisi
                            </p>

                            <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">ÜNİVERSİTE:</p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                KTO Karatay Üniversitesi
                            </p>

                            <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">DEPARTMAN:</p>
                            <p className="text-slate-900 dark:text-white">
                                Bilgi İşlem Müdürlüğü
                            </p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                                "Kıymetli danışmanımız, bu çalışmanın tamamlanmasında büyük rol oynamışlardır."
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Project Statistics */}
                <Card className="border-2 border-amber-200 dark:border-amber-800">
                    <CardHeader className="bg-amber-100 dark:bg-amber-900 rounded-t-lg">
                        <CardTitle className="text-amber-900 dark:text-amber-100">
                            Proje İstatistikleri
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-slate-600 dark:text-slate-300 text-sm">Doğruluk Oranı</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">89.82%</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-slate-600 dark:text-slate-300 text-sm">F1-Skoru</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">0.8992</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-slate-600 dark:text-slate-300 text-sm">AUC-ROC</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">0.9513</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-slate-600 dark:text-slate-300 text-sm">Veri Örneği</p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">118,466</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-slate-600 dark:text-slate-300 text-sm">Özellik Sayısı</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">39</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <p className="text-slate-600 dark:text-slate-300 text-sm">Sınıf Sayısı</p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">33</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Thank You Section */}
                <Card className="border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950">
                    <CardContent className="pt-6 text-center space-y-2">
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                            Değerli Danışmanımıza Teşekkürler
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                            Bu projenin başarıyla tamamlanmasından dolayı hocamıza minnettarız.
                        </p>
                    </CardContent>
                </Card>

                {/* Links */}
                <div className="flex justify-center gap-4 flex-wrap">
                    <a
                        href="https://github.com/Shuaib5352/DDoS-BSO-Thesis"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold hover:opacity-80 transition"
                    >
                        GitHub Deposu
                    </a>
                    <a
                        href="https://akademik.yok.gov.tr/AkademikArama/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Akademik Arama
                    </a>
                </div>
            </div>
        </div>
    )
}
