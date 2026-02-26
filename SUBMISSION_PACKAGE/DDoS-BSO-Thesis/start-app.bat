@echo off
REM تشغيل تطبيق DDoS-BSO Tespiti
cd /d "%~dp0"

REM إيقاف أي عمليات قديمة
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

REM بدء خادم Next.js في الخلفية
start "" cmd /c "npx next dev --port 8888"

REM انتظار تشغيل الخادم
timeout /t 5 /nobreak >nul

REM فتح تطبيق Electron
start "" ".\node_modules\.bin\electron.cmd" public/electron.js

exit
