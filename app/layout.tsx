import type React from "react"
import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

import { Inter, JetBrains_Mono } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DDoS Tespiti - BSO-Hibrit Framework | Yüksek Lisans Tezi",
  description:
    "Yarasa Sürüsü Optimizasyonu (BSO) ile Optimize Edilmiş Hibrit Makine Öğrenmesi Çerçevesi Kullanılarak DDoS Saldırılarının Geliştirilmiş Tespiti. CICIoT2023 Veri Seti - %89.82 Doğruluk ve %51.3 Öznitelik Azaltma.",
  authors: [{ name: "SHUAIB AYAD JASIM" }],
  keywords: [
    "DDoS Tespiti",
    "Makine Öğrenmesi",
    "BSO Optimizasyonu",
    "Random Forest",
    "IoT Güvenliği",
    "CICIoT2023",
    "Siber Güvenlik"
  ],
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DDoS-BSO Tespiti"
  },
  formatDetection: {
    telephone: false
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  themeColor: "#1f2937",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DDoS-BSO" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>{children}</Suspense>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker başarıyla kaydedildi:', registration);
                    },
                    function(err) {
                      console.log('Service Worker kaydı başarısız:', err);
                    }
                  );
                });
              }
            `
          }}
        />
      </body>
    </html>
  )
}
