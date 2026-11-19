import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CICIoT2023 üzerinde BSO-RF ile DDoS tespiti",
  description: "Tam satır gruplu değerlendirme ve 23 öznitelikli Random Forest sonuçları.",
  authors: [{ name: "SHUAIB AYAD JASIM JASIM" }],
  icons: { icon: "/icon.svg" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="tr"><body>{children}</body></html>
}
