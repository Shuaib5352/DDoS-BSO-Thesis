#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build Submission Package - Create ZIP for Submission
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime

try:
    # معلومات المشروع
    PROJECT_NAME = "DDoS-BSO-Thesis"
    VERSION = "1.0.0"
    AUTHOR = "Gossek Muhammed"
    TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")

    # المسارات
    BASE_DIR = Path.cwd()
    OUTPUT_DIR = BASE_DIR / "SUBMISSION_PACKAGE"
    ZIP_NAME = f"{PROJECT_NAME}_v{VERSION}_{TIMESTAMP}"

    # الملفات المطلوب تضمينها
    INCLUDE_FILES = [
        "README.md",
        "HOW_TO_RUN_TR.md",
        "EXECUTIVE_SUMMARY.md",
        "DEGERLENDIRME_RAPORU_TR.md",
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "next.config.js",
        "Thesis_Professional_v2.docx",
        "start-app.bat",
        ".gitignore",
    ]

    # المجلدات المطلوب تضمينها
    INCLUDE_DIRS = [
        "app",
        "components",
        "public",
        "styles",
        "lib",
        "types",
    ]

    # المجلدات المستبعدة
    EXCLUDE_DIRS = [
        "node_modules",
        ".next",
        ".git",
        "dist",
        "build",
        "__pycache__",
        ".venv",
    ]

    print("\n=== SUBMISSION PACKAGE BUILDER ===\n")

    # اليرة 1: إنشاء المجلد
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[1] Created package directory")

    # نسخ الملفات
    print(f"[2] Copying files...")

    PACKAGE_DIR = OUTPUT_DIR / PROJECT_NAME

    for file in INCLUDE_FILES:
        src = BASE_DIR / file
        if src.exists():
            dst = PACKAGE_DIR / file
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            size = src.stat().st_size / 1024
            print(f"    OK - {file} ({size:.1f} KB)")
        else:
            print(f"    SKIP - {file} (not found)")

    # نسخ المجلدات
    print(f"[3] Copying directories...")

    for directory in INCLUDE_DIRS:
        src_dir = BASE_DIR / directory

        if not src_dir.exists():
            print(f"    SKIP - {directory}")
            continue

        def ignore_func(directory, contents):
            ignored = []
            for item in contents:
                if item in EXCLUDE_DIRS or item.endswith(".pyc"):
                    ignored.append(item)
            return ignored

        dst_dir = PACKAGE_DIR / directory
        shutil.copytree(src_dir, dst_dir, ignore=ignore_func, dirs_exist_ok=True)
        print(f"    OK - {directory}/")

    # إنشاء ملفات إضافية
    print(f"[4] Creating supplementary files...")

    # PROJECT_INFO.json
    INFO_FILE = PACKAGE_DIR / "PROJECT_INFO.json"
    info_data = {
        "project_name": "DDoS Attack Detection - BSO-Hybrid Framework",
        "version": VERSION,
        "author": AUTHOR,
        "created": datetime.now().isoformat(),
        "tech_stack": {
            "frontend": "Next.js 14.2.35, React 19, TypeScript 5",
            "desktop": "Electron 31.0.0",
        }
    }
    with open(INFO_FILE, 'w', encoding='utf-8') as f:
        json.dump(info_data, f, ensure_ascii=False, indent=2)
    print(f"    OK - PROJECT_INFO.json")

    # KURULUM_REHBERI.md (Installation Guide)
    INSTALL_GUIDE = PACKAGE_DIR / "KURULUM_REHBERI.md"
    install_guide = """# Installation Guide

## Quick Start

### 1. Extract the package
```bash
unzip DDoS-BSO-Thesis_*.zip
cd DDoS-BSO-Thesis
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run web application
```bash
npm run web:dev
```
Then open: http://localhost:8888

### 4. Run desktop application
```bash
npm run desktop:dev
```

## Requirements
- Node.js 18+
- 2GB RAM
- 500MB disk space

## File Structure
- `app/` - Next.js pages
- `components/` - React components (20+)
- `public/` - Static files and Electron
- `Thesis_Professional_v2.docx` - Master thesis document (60-70 pages)
- `README.md` - Documentation
- `EXECUTIVE_SUMMARY.md` - English summary
- `DEGERLENDIRME_RAPORU_TR.md` - Turkish evaluation

## Features
- 20+ data analysis components
- 100+ interactive charts
- Real-time metrics
- Turkish/English interface
- Dark/Light theme support
- Desktop app (Electron)

## Support Files
1. Read: README.md (documentation)
2. Run: npm install && npm run web:dev
3. Test: Open http://localhost:8888
4. Review: Thesis_Professional_v2.docx
5. Study: EXECUTIVE_SUMMARY.md

Good luck with your defense!
"""
    with open(INSTALL_GUIDE, 'w', encoding='utf-8') as f:
        f.write(install_guide)
    print(f"    OK - KURULUM_REHBERI.md")

    # Create ZIP
    print(f"[5] Creating ZIP file...")
    ZIP_PATH = OUTPUT_DIR / ZIP_NAME

    try:
        shutil.make_archive(str(ZIP_PATH), 'zip', str(OUTPUT_DIR), PROJECT_NAME)
        zip_size = (ZIP_PATH.with_suffix('.zip')).stat().st_size / (1024 * 1024)
        print(f"    OK - {ZIP_NAME}.zip ({zip_size:.1f} MB)")
    except Exception as e:
        print(f"    ERROR - {e}")

    print(f"\n=== COMPLETED SUCCESSFULLY ===\n")
    print(f"Package location: {OUTPUT_DIR / PROJECT_NAME}")
    print(f"ZIP file: {ZIP_PATH}.zip")
    print(f"\nNext steps:")
    print(f"1. Open KURULUM_REHBERI.md for installation")
    print(f"2. Test: npm install && npm run web:dev")
    print(f"3. Share the ZIP file")

except Exception as e:
    print(f"\nERROR: {e}")
    import traceback
    traceback.print_exc()
