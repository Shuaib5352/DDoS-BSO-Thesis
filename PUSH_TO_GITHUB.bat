@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   🚀 PUSH CODE TO GITHUB - رفع الكود إلى GitHub               ║
echo ║      حل مشكلة: The repository is empty                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d "C:\Users\imiss\Desktop\DDoS-BSO-Thesis"

echo ✅ Step 1: Check Git Status
echo.
git status
echo.
pause

cls

echo ✅ Step 2: Adding all files
echo.
git add -A
echo ✓ Files added
echo.
pause

cls

echo ✅ Step 3: Committing
echo.
git commit -m "Initial commit - DDoS-BSO-Thesis Project"
echo ✓ Committed
echo.
pause

cls

echo ✅ Step 4: Checking remote
echo.
git remote -v
echo.
pause

cls

echo ✅ Step 5: Force push to GitHub (first time)
echo.
echo This will upload all your code to GitHub...
echo.

git push -u origin main --force

if !errorlevel! neq 0 (
    color 0C
    echo.
    echo ❌ Error during push!
    echo.
    echo Possible solutions:
    echo 1. Check your internet connection
    echo 2. Verify your GitHub credentials
    echo 3. Make sure the repository URL is correct
    echo.
    pause
    exit /b 1
)

color 0A
echo.
echo ✅ SUCCESS! Code pushed to GitHub
echo.
echo Next steps:
echo 1. Wait 5 seconds for GitHub to process
echo 2. Go to Vercel Dashboard
echo 3. Delete the old failed deployment
echo 4. Click "New Project" 
echo 5. Import your GitHub repo
echo 6. Deploy!
echo.
pause

exit /b 0
