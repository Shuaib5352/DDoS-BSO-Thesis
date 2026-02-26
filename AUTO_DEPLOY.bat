@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

color 0A
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     🚀 AUTOMATED DEPLOYMENT - DDoS-BSO-Thesis                 ║
echo ║     سير التشغيل التلقائي - نشر البرنامج الآلي                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM ====== STEP 0: User Input ======
echo.
echo 📋 تعليمات مهمة - Important Instructions:
echo.
echo 1. تأكد من وجود حساب GitHub عندك
echo    Make sure you have a GitHub account at https://github.com
echo.
echo 2. ستحتاج لـ 3 معلومات:
echo    You'll need 3 pieces of information:
echo    - GitHub Username
echo    - GitHub Personal Access Token (from Settings ^> Developer settings ^> Tokens)
echo    - GitHub Email
echo.
echo 3. الرابط النهائي سيكون:
echo    Your final link will be: https://your-project.vercel.app
echo.
pause

cls
color 0B

REM ====== STEP 1: GitHub Setup ======
echo.
echo ✅ Step 1/4: GitHub Setup
echo.
set /p GITHUB_USER="Enter your GitHub USERNAME: "
set /p GITHUB_TOKEN="Enter your GitHub Personal Access Token: "
set /p GITHUB_EMAIL="Enter your GitHub EMAIL: "

if "!GITHUB_USER!"=="" (
    color 0C
    echo.
    echo ❌ Error: GitHub username is required!
    pause
    exit /b 1
)

cls
color 09

REM ====== STEP 2: Initialize Git ======
echo.
echo ✅ Step 2/4: Initializing Git Repository
echo.

cd /d "C:\Users\imiss\Desktop\DDoS-BSO-Thesis"

if exist .git (
    echo Existing Git repository detected, skipping initialization...
) else (
    echo Initializing new Git repository...
    git init > nul
    echo ✓ Git initialized
)

REM Configure git with provided credentials
git config user.name "!GITHUB_USER!" > nul
git config user.email "!GITHUB_EMAIL!" > nul
git config --global credential.helper wincred > nul

echo Git configured with:
echo   User: !GITHUB_USER!
echo   Email: !GITHUB_EMAIL!
echo.

REM Add all files
echo Adding files...
git add . > nul 2>&1
echo ✓ Files added

REM Create commit
echo Committing...
git commit -m "DDoS-BSO-Thesis v1.0.0 - Ready for Deployment" > nul 2>&1
echo ✓ Committed

REM Ensure main branch
git branch -M main > nul 2>&1
echo ✓ Main branch ready

pause

cls
color 0A

REM ====== STEP 3: GitHub Remote ======
echo.
echo ✅ Step 3/4: Setting up GitHub Remote Repository
echo.

echo Instructions:
echo.
echo 1. Go to https://github.com/new
echo 2. Create NEW repository with name: DDoS-BSO-Thesis
echo 3. Copy the repository URL (should look like: https://github.com/YOUR_USERNAME/DDoS-BSO-Thesis.git)
echo 4. Paste it when prompted below
echo.

set /p REPO_URL="Paste your GitHub repository URL: "

if "!REPO_URL!"=="" (
    color 0C
    echo.
    echo ❌ Error: Repository URL is required!
    pause
    exit /b 1
)

echo.
echo Setting remote origin...
git remote remove origin > nul 2>&1
git remote add origin "!REPO_URL!" > nul
echo ✓ Remote set

echo.
echo Pushing to GitHub...
echo This may ask for your GitHub credentials - use your Personal Access Token as password
echo.

git push -u origin main

if !errorlevel! neq 0 (
    color 0C
    echo.
    echo ❌ Error pushing to GitHub!
    echo Please check:
    echo   - Repository URL is correct
    echo   - GitHub credentials are valid
    echo   - Token has 'repo' permission
    echo.
    pause
    exit /b 1
)

echo.
echo ✓ Successfully pushed to GitHub!

pause

cls
color 0B

REM ====== STEP 4: Vercel Deployment ======
echo.
echo ✅ Step 4/4: Vercel Deployment Instructions
echo.
echo.
echo 🎯 FINAL STEPS - MANUAL (Takes 2 minutes):
echo.
echo 1. Go to: https://vercel.com/new
echo.
echo 2. Click "Continue with GitHub" and sign in
echo.
echo 3. Find and import: "DDoS-BSO-Thesis"
echo.
echo 4. Click "Deploy" button
echo.
echo 5. Wait for deployment (about 30-60 seconds)
echo.
echo 6. Copy your generated link - it will look like:
echo    https://ddos-bso-thesis-abc123.vercel.app
echo.
echo 7. Share that link with your committee! 🎉
echo.
echo ════════════════════════════════════════════════════════════════
echo.

start https://vercel.com/new

echo Press any key when deployment is complete...
pause

cls
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ✅ DEPLOYMENT COMPLETE!                    ║
echo ║              🎉 رابطك جاهز - Your link is ready!             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Your applications is now deployed at:
echo   https://your-project-name.vercel.app
echo.
echo Share this link with your thesis committee!
echo.

pause
exit /b 0
