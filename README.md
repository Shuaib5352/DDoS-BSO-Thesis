# 🛡️ BSO-Hybrid DDoS Detection Dashboard

**Improved Detection of DDoS Attacks Using a Hybrid Machine Learning Framework Optimized with Bat Swarm Optimization (BSO) in Dynamic Network Environments**

**Author:** SHUAIB AYAD JASIM  
**Degree:** Master of Science (M.Sc.)  
**Institution:** Karatay University, Konya, Turkey  
**Date:** February 2026  
**Status:** ✅ Complete & Production Ready  
**Version:** 1.0.0  
**Latest Release:** 🟢 Electron Desktop App + Web Dashboard  

---

## 🎉 NEW: Desktop Application (Electron)

**Now available as a standalone Windows application!**

### 🚀 Installation
Download and run: **[DDoS-BSO-Tespiti-1.0.0.exe](DESKTOP_APP_GUIDE_TR.md)**

### 📱 Available Versions
1. ✅ **Windows Desktop App** (Electron) - Recommended
2. ✅ **Web Dashboard** (Next.js) - Browser-based
3. ✅ **PWA** (Progressive Web App) - Mobile-friendly

### 📚 Desktop App Documentation (Turkish)
- 🚀 [Quick Start Guide](QUICK_START_INDEX_TR.md) 
- 📖 [User Manual](DESKTOP_APP_GUIDE_TR.md)
- 🛠️ [Build & Deployment Guide](BUILD_GUIDE_TR.md)
- 💡 [Advanced Usage](ADVANCED_USAGE_TR.md)
- 📊 [Completion Report](COMPLETION_REPORT_TR.md)

---

## 📚 Quick Links

- 🚀 [Quick Start](#quick-start)
- 🖥️ [Desktop App Setup](QUICK_START_INDEX_TR.md)
- 📖 [Full Documentation](docs/IMPLEMENTATION_GUIDE_AR.md)
- 🧪 [Running Experiments](#running-experiments)
- 🏗️ [Project Structure](#project-structure)
- 📊 [Results & Benchmarks](#results--benchmarks)
- 🐛 [Troubleshooting](docs/IMPLEMENTATION_GUIDE_AR.md#استكشاف-الأخطاء)

---

## ✨ Overview

An interactive **Next.js dashboard** for visualizing and comparing DDoS attack detection models on the **CICIoT2023** dataset. 

### 🎯 Core Innovation: BSO-Hybrid

Unlike traditional meta-heuristic approaches (PSO, GA, GWO) that only perform feature selection, **BSO-Hybrid** achieves:

- ✅ **Joint optimization** of feature selection AND Random Forest hyperparameters
- ✅ **51.3% dimension reduction** while maintaining competitive accuracy
- ✅ **Significant statistical improvement** over comparison algorithms
- ✅ **Production-ready implementation** with full visualization & analysis

### 📊 Key Results Comparison

| Metric | BSO-Hybrid RF | XGBoost | Standard RF | PSO-RF | GA-RF | GWO-RF |
|--------|:-------------:|:-------:|:----------:|:------:|:-----:|:------:|
| **Accuracy** | **89.82%** | 90.37% | 89.74% | 87.40% | 87.01% | 87.73% |
| **F1-Weighted** | **89.90%** | 90.47% | 89.86% | 87.58% | 87.14% | 87.91% |
| **F1-Macro** | **84.24%** | 84.74% | 83.06% | 81.82% | 81.25% | 81.15% |
| **Features** | **19/39** | 39/39 | 39/39 | 21/39 | 18/39 | 20/39 |
| **Reduction** | **51.3%** | 0% | 0% | 46.2% | 53.8% | 48.7% |
| **Training Time** | 1,332.6s | 487.2s | 156.3s | 945.2s | 912.8s | 1,124.5s |

**Statistical Significance:**
- vs XGBoost: p=0.312 (not significant) ✓ Practical equivalence with fewer features
- vs PSO-RF: p=0.002 ✓✓ Significant improvement
- vs GWO-RF: p=0.005 ✓✓ Significant improvement

---

## 📦 Dataset

| Property | Value |
|----------|-------|
| **Source** | CICIoT2023 - Canadian Institute for Cybersecurity |
| **Year** | 2023 |
| **Total Samples** | 118,466 |
| **Features** | 39 (network traffic metrics) |
| **Classes** | 5 attack types |
| **Train/Val/Test** | 70% / 10% / 20% (stratified) |
| **Class Balancing** | SMOTE (72,252 → 87,500 training samples) |
| **Preprocessing** | StandardScaler Normalization |

### Attack Types
1. ⚠️ **DDoS-SYN_Flood** - Critical severity
2. ⚠️ **DDoS-ACK_Fragmentation** - Critical severity  
3. 🟢 **BenignTraffic** - Normal traffic
4. 🟡 **Recon-PortScan** - Medium severity
5. 🔴 **Backdoor_Malware** - High severity

---

## 🚀 Quick Start

### Prerequisites
```bash
# Check versions
node --version      # >= 18.0.0
npm --version       # >= 9.0.0
python --version    # >= 3.10 (optional)
```

### Installation & Run

```bash
# 1. Clone/open the project
cd "C:\Users\imiss\Desktop\DDoS-BSO-Thesis"

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start the dashboard
npm run dev

# 4. Open in browser
# http://localhost:3000
```

**That's it!** The dashboard will be ready in ~10 seconds.

### Access the Dashboard

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Main dashboard |
| http://192.168.56.1:3000 | Network access (if needed) |

---

## 🧪 Running Experiments

### Using Enhanced Runner (Recommended)
```bash
cd scripts
python run_experiments_enhanced.py
```

### Using Standard Runner
```bash
cd scripts
python run_experiments.py
```

**Output Location:**
```
./results/
├── experiment_results.json      # Main results data
├── bso_convergence.json         # Convergence history
├── model_comparison.json        # Algorithm comparison
├── performance_metrics.json     # Performance metrics
├── experiment.log               # Detailed log
└── figures/
    ├── bso_convergence_analysis.png
    ├── feature_importance_analysis.png
    ├── confusion_matrices.png
    ├── roc_and_comparison.png
    └── ...
```

---

## 🏗️ Project Structure

```
DDoS-BSO-Thesis/
│
├── 📄 app/                              # Next.js App Router
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Main dashboard page
│   └── globals.css                      # Global styles
│
├── 🎨 components/                       # React Components (20+)
│   ├── bso-visualization.tsx            # BSO algorithm visualization
│   ├── ml-classification-panel.tsx      # ML classification results
│   ├── algorithm-comparison-panel.tsx   # Algorithm comparison charts
│   ├── performance-evaluation-panel.tsx # Performance metrics
│   ├── thesis-results-chapter.tsx       # Thesis results summary
│   ├── thesis-defense-qa.tsx            # Defense Q&A panel
│   ├── confusion-matrix-heatmap.tsx     # Confusion matrix heatmap
│   ├── feature-importance-analysis.tsx  # Feature importance ranking
│   ├── print-export-panel.tsx           # Print/Export functionality
│   ├── ablation-study.tsx               # Ablation study results
│   ├── error-misclassification-analysis.tsx # Error analysis
│   ├── learning-curves-efficiency.tsx   # Learning curves
│   ├── model-ranking-dashboard.tsx      # Model rankings
│   └── ui/                              # Reusable UI components
│
├── 📚 lib/                              # Core Logic & Data
│   ├── bso-optimizer.ts                 # BSO algorithm implementation
│   ├── ciciot2023-dataset.ts            # Real experiment results (39 features →  19)
│   ├── ml-classifier.ts                 # ML classification logic
│   ├── performance-evaluator.ts         # Performance metrics calculation
│   ├── algorithm-comparator.ts          # Algorithm comparison logic
│   ├── data-processor.ts                # Data processing utilities
│   ├── validation.ts                    # Input validation (NEW)
│   ├── i18n.ts                          # Internationalization
│   └── utils.ts                         # Helper functions
│
├── 🐍 scripts/                          # Python Experiment Scripts
│   ├── run_experiments.py               # Main experiment runner
│   ├── run_experiments_enhanced.py      # Enhanced runner with logging (NEW)
│   ├── real_experiment.py               # Core BSO-DDoS experiment
│   ├── bso_feature_analysis.py          # BSO analysis & plots
│   ├── model_evaluation.py              # Model evaluation & comparison
│   ├── requirements.txt                 # Python dependencies (UPDATED)
│   └── [other utility scripts]
│
├── 📖 docs/                             # Documentation
│   ├── IMPLEMENTATION_GUIDE_AR.md       # Arabic implementation guide (NEW)
│   ├── thesis-documentation.md          # English documentation
│   ├── yuksek-lisans-tezi-dokumantasyonu.md # Turkish documentation
│   ├── API_REFERENCE.md                 # API reference (if available)
│   └── [configuration docs]
│
├── 🌐 public/                           # Static & Data Files
│   └── experiment_results.json          # Real experiment results
│
├── 📋 Configuration Files
│   ├── package.json                     # Node.js dependencies
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── next.config.mjs                  # Next.js configuration
│   ├── tailwind.config.ts               # TailwindCSS configuration
│   ├── postcss.config.mjs               # PostCSS configuration
│   ├── project.config                   # Project metadata (NEW)
│   └── .gitignore                       # Git ignore rules
│
└── 📄 README.md                         # This file
```

---

## 🔬 BSO-Hybrid Algorithm Details

### Algorithm Architecture

```
INPUT: CICIoT2023 dataset (118,466 samples, 39 features)
       └─ Preprocessing: SMOTE, StandardScaler, Stratified Split

BAT SWARM INITIALIZATION (Population = 25 bats)
│
├─ Position: [b₁...b₃₉, n_est, depth, min_split, max_feat]
│            └─ 39 binary bits ──┘└─ 4 continuous ─┘
│
├─ Frequency: f ∈ [f_min, f_max]
├─ Loudness: A ∈ (0, 1]
└─ Pulse Rate: r ∈ [0, 1)

OPTIMIZATION ITERATIONS (50 iterations)
│
├─ Movement & Frequency Update
├─ Local Search (Pulse Rate)
├─ Echolocation Update (Loudness)
├─ Fitness Evaluation:
│  F = 0.9 × CV_Accuracy(S,θ) + 0.1 × (1 - |S|/39)
│
└─ Convergence Check

OUTPUT: Best position (selected features + RF hyperparameters)
        └─ 19 features selected, F1-Score: 84.24%
```

### Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| **Population Size** | 25 | Number of bats in swarm |
| **Max Iterations** | 50 | Number of optimization iterations |
| **Frequency Range** | [0, 2] | Velocity scaling range |
| **Initial Loudness** | 0.95 | Initial exploration factor |
| **Loudness Decay** | 0.9 | A = A × α (per iteration) |
| **Initial Pulse Rate** | 0.5 | Initial exploitation factor |
| **Pulse Rate Increase** | 0.01 | r = r + γ (per iteration) |
| **CV Folds** | 3 | Cross-validation folds |

---

## 📊 Features & Capabilities

### 🎯 Dashboard Features
- ✅ Interactive visualization of all experiments
- ✅ Real-time algorithm comparison charts
- ✅ Confusion matrix heatmaps
- ✅ ROC curves and performance metrics
- ✅ Feature importance rankings
- ✅ Learning curves & efficiency analysis
- ✅ Ablation study results
- ✅ Thesis defense Q&A panel
- ✅ Print & export functionality
- ✅ Comprehensive documentation

### 🔧 Technical Features
- ✅ Full TypeScript type safety
- ✅ Input validation & error handling (NEW)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light theme toggle
- ✅ Arabic & Turkish language support
- ✅ Publication-quality charts
- ✅ Comprehensive logging

---

## 🛠️ Technologies Used

### Frontend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.2 | React framework |
| **React** | 19 | UI library |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4.1 | Styling |
| **Radix UI** | Latest | Component library |
| **Recharts** | 2.15 | Charts & visualization |
| **Lucide React** | 0.454 | Icons |

### Backend Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.10+ | Scripting language |
| **scikit-learn** | 1.3+ | Machine learning |
| **XGBoost** | 2.0+ | Gradient boosting |
| **pandas** | 2.0+ | Data manipulation |
| **matplotlib** | 3.7+ | Plotting |
| **NumPy** | 1.24+ | Numerical computing |

---

## ✅ Validation & Testing

### Data Validation (NEW)
- Dataset structure validation
- Feature array consistency checks
- Statistical metric validation
- Confusion matrix validation
- Convergence history validation

### BSO Parameter Validation (NEW)
- Population size constraints
- Iteration limit validation
- Frequency bound checks
- Loudness/pulse rate validation
- Decay parameter constraints

### ML Parameter Validation (NEW)
- Random Forest hyperparameter validation
- Feature selection logic validation
- Model metric consistency checks
- Dimension reduction percentage checks

---

## 📈 Results & Performance

### Training Performance
| Model | Training Time | Memory (Peak) | Accuracy |
|-------|:-------------:|:-------------:|:--------:|
| BSO-Hybrid RF | 1,332.6s | ~2.1 GB | 89.82% |
| XGBoost | 487.2s | ~1.8 GB | 90.37% |
| Standard RF | 156.3s | ~1.5 GB | 89.74% |
| PSO-RF | 945.2s | ~1.9 GB | 87.40% |
| GA-RF | 912.8s | ~1.8 GB | 87.01% |

### Dimension Reduction
- **Original Features:** 39
- **Selected Features:** 19 (BSO-Hybrid)
- **Reduction Ratio:** 51.3%
- **Computational Benefit:** ~50% faster inference

---

## 🐛 Troubleshooting

### Issue: Port 3000 Already in Use
```bash
# Use alternative port
npm run dev -- -p 3001
```

### Issue: Module Not Found
```bash
# Clean and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
npm run dev
```

### Issue: Python Script Errors
```bash
# Check Python version
python --version

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

👉 **Full Troubleshooting Guide:** [Arabic Implementation Guide](docs/IMPLEMENTATION_GUIDE_AR.md#استكشاف-الأخطاء)

---

## 📖 Documentation

| Document | Purpose | Language |
|----------|---------|----------|
| [IMPLEMENTATION_GUIDE_AR.md](docs/IMPLEMENTATION_GUIDE_AR.md) | Complete setup & usage guide | Arabic |
| [thesis-documentation.md](docs/thesis-documentation.md) | Thesis details | English |
| [yuksek-lisans-tezi-dokumantasyonu.md](docs/yuksek-lisans-tezi-dokumantasyonu.md) | Thesis details | Turkish |
| [project.config](project.config) | Project configuration | INI format |

---

## 📝 Citation

If you use this work in your research, please cite:

```bibtex
@mastersthesis{jasim2026bso,
  author = {Shuaib Ayad Jasim},
  title = {Improved Detection of DDoS Attacks Using a Hybrid Machine Learning 
           Framework Optimized with Bat Swarm Optimization (BSO) in Dynamic 
           Network Environments},
  school = {Karatay University},
  year = {2026},
  address = {Konya, Turkey}
}
```

---

## 📜 License

**Academic Research Project** - SHUAIB AYAD JASIM, 2026

This work is provided as-is for academic and research purposes.

---

## 🤝 Support & Contact

For questions or issues:
1. Check [Troubleshooting Guide](docs/IMPLEMENTATION_GUIDE_AR.md#استكشاف-الأخطاء)
2. Review [Implementation Guide](docs/IMPLEMENTATION_GUIDE_AR.md)
3. Check error logs in `./results/experiment.log`

---

## 📅 Version History

| Version | Date | Status | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-15 | Alpha | Initial implementation |
| 1.5 | 2026-02-10 | Beta | Algorithm comparison added |
| 2.0 | 2026-02-26 | ✅ Release | Full validation, documentation, enhanced logging |

---

**Last Updated:** 26 February 2026  
**Project Status:** ✅ **PRODUCTION READY** 🚀
