#!/bin/bash
# Deploy to GitHub for Vercel
# Script to make deployment easier

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║          Automated Deployment to GitHub & Vercel             ║"
echo "║          انتشار تلقائي إلى GitHub و Vercel                 ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    echo "Install from: https://git-scm.com"
    exit 1
fi

echo "Step 1: Check project structure..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi
echo "✓ package.json found"

if [ ! -d "app" ]; then
    echo "❌ app directory not found!"
    exit 1
fi
echo "✓ app directory found"

echo ""
echo "Step 2: Initialize git repository..."

# Check if git is already initialized
if [ -d ".git" ]; then
    echo "✓ Git repository already exists"
else
    git init
    echo "✓ Git repository initialized"
fi

echo ""
echo "Step 3: Adding all files..."
git add .
echo "✓ Files added to staging area"

echo ""
echo "Step 4: Creating commit..."
git commit -m "Master Thesis Project - DDoS Detection with BSO" 2>/dev/null || echo "ℹ Files already committed"
echo "✓ Commit created"

echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "🎯 NEXT STEPS:"
echo ""
echo "1. Copy your GitHub username below:"
echo "   https://github.com/YOUR_USERNAME/DDoS-BSO-Thesis"
echo ""
echo "2. Create a new repository on GitHub:"
echo "   🌐 https://github.com/new"
echo "   - Name: DDoS-BSO-Thesis"
echo "   - Select: Public"
echo "   - Click: Create Repository"
echo ""
echo "3. Add GitHub remote (replace YOUR_USERNAME):"
echo "   git remote remove origin 2>/dev/null"
echo "   git remote add origin https://github.com/YOUR_USERNAME/DDoS-BSO-Thesis.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Deploy to Vercel:"
echo "   🌐 https://vercel.com"
echo "   - Sign Up with GitHub"
echo "   - Dashboard → New Project"
echo "   - Import from GitHub"
echo "   - Select: DDoS-BSO-Thesis"
echo "   - Deploy!"
echo ""
echo "✨ Your live link:"
echo "   https://your-project-name.vercel.app"
echo ""
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "📝 Manual push command:"
echo ""
echo "git remote add origin https://github.com/YOUR_USERNAME/DDoS-BSO-Thesis.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo "═════════════════════════════════════════════════════════════════"
