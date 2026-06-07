# Cross-Validation Section Analysis

## ✅ النماذج المتوفرة في experiment_results.json:

من البحث وجدت النماذج التالية موجودة:

### 1. **BSO-Hybrid RF (Proposed)** 🔴 [REFERENCE]
- ✅ accuracy scores: 10 folds
- ✅ f1Macro scores: 10 folds
- ✅ precision scores: 10 folds
- ✅ recall scores: 10 folds

### 2. **BSO-SVM**
- ✅ accuracy scores: 10 folds
- ✅ f1Macro scores: 10 folds
- ✅ precision scores: 10 folds
- ✅ recall scores: 10 folds

### 3. **PSO-RF** (غالباً موجودة)
- ❓ Needs verification

### 4. **GA-RF** (غالباً موجودة)
- ❓ Needs verification

### 5. **GWO-RF** (غالباً موجودة)
- ❓ Needs verification

### 6. **Random Forest**
- ❓ Needs verification

### 7. **XGBoost**
- ❓ Needs verification

### 8. **SVM**
- ❓ Needs verification

## المخطط:

يجب تشغيل السكريبت الآن لنرى بالضبط أي نماذج موجودة وأي ناقصة:

```bash
cd DDoS-BSO-Thesis
python scripts/extract_cross_validation_csv.py
```

السكريبت سيطبع:
```
✓ Found X models
✓ Available metrics: accuracy, f1Macro, precision, recall

Models found:
🔴 1. BSO-Hybrid RF (Proposed)
   2. BSO-SVM
   3. ...
```

بعدها ستكون الملفات جاهزة في `public/` مباشرة.
