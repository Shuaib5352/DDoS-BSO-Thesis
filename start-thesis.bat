@echo off
chcp 65001 >nul 2>&1
title BSO-Hibrit RF - DDoS Tespiti | Yüksek Lisans Tezi
color 0B

echo.
echo  ╔══════════════════════════════════════════════════════════════════╗
echo  ║                                                                ║
echo  ║   BSO-Hibrit RF ile Gelistirilmis DDoS Tespiti                ║
echo  ║   Yüksek Lisans Tezi - SHUAIB AYAD JASIM                     ║
echo  ║   CICIoT2023 Veri Seti | %%89.82 Dogruluk                     ║
echo  ║                                                                ║
echo  ╚══════════════════════════════════════════════════════════════════╝
echo.
echo  [*] Sunucu baslatiliyor...
echo  [*] Tarayicinizda acilacak: http://bso-ddos-tespiti.local:3000
echo.

cd /d "%~dp0"

:: Önceki node süreçlerini temizle
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: .next cache temizle (sorunları önlemek için)
if exist ".next\trace" (
    rmdir /s /q ".next" >nul 2>&1
    timeout /t 1 /nobreak >nul
)

:: Tarayıcıyı aç
start "" "http://bso-ddos-tespiti.local:3000"

:: Dev sunucuyu başlat (-H ile özel hostname)
echo  [✓] Sunucu aktif! Kapatmak icin bu pencereyi kapatin.
echo  ────────────────────────────────────────────────────────
echo.
npx next dev -H bso-ddos-tespiti.local -p 3000
