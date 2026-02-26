@echo off
REM Deploy to GitHub automation script for Windows
REM Windows Script to automate GitHub deployment

cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║    Automated Deployment to GitHub - Windows Version           ║
echo ║    النشر التلقائي إلى GitHub - نسخة Windows                 ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo    Download from: https://git-scm.com
    pause
    exit /b 1
)

echo ✓ Git found

REM Check project structure
if not exist "package.json" (
    echo ❌ package.json not found!
    pause
    exit /b 1
)
echo ✓ package.json found

if not exist "app" (
    echo ❌ app directory not found!
    pause
    exit /b 1
)
echo ✓ app directory found

echo.
echo Step 1: Initialize git repository...
if not exist ".git" (
    git init
    echo ✓ Git repository initialized
) else (
    echo ✓ Git repository already exists
)

echo.
echo Step 2: Adding all files...
git add .
echo ✓ Files added to staging area

echo.
echo Step 3: Creating commit...
git commit -m "Master Thesis - DDoS Detection with BSO" 2>nul
if errorlevel 0 (
    echo ✓ Commit created
) else (
    echo ℹ Files already committed
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🎯 NEXT STEPS:
echo.
echo 1️⃣  Create GitHub Repository:
echo    🌐 https://github.com/new
echo    - Repository name: DDoS-BSO-Thesis
echo    - Select: Public
echo    - Click: Create Repository
echo.
echo 2️⃣  Copy your GitHub username and run this command:
echo    (Replace YOUR_USERNAME with your actual GitHub username)
echo.
echo    git remote remove origin 2>nul
echo    git remote add origin https://github.com/YOUR_USERNAME/DDoS-BSO-Thesis.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3️⃣  Deploy to Vercel:
echo    🌐 https://vercel.com
echo    - Click: Sign Up
echo    - Choose: Continue with GitHub
echo    - Login and authorize
echo    - Dashboard → Add New Project
echo    - Select: DDoS-BSO-Thesis
echo    - Click: Deploy
echo.
echo 4️⃣  GET YOUR PERMANENT LINK:
echo    👉 https://your-project-name.vercel.app
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📝 PUSHING TO GITHUB:
echo.
echo Run these commands:
echo.
echo    git remote add origin https://github.com/YOUR_USERNAME/DDoS-BSO-Thesis.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo ✅ Git setup complete!
echo    Ready to push to GitHub and deploy to Vercel
echo.
pause
