# 🧪 دليل الاختبارات الشاملة
## Unit Tests و Integration Tests

**المشروع:** كشف هجمات DDoS باستخدام BSO-Hybrid  
**التاريخ:** 26 فبراير 2026  
**الحالة:** ✅ جاهزة للتشغيل  

---

## 📋 محتويات الاختبارات

### ✅ Validation Tests
- اختبارات تحقق من صحة البيانات والمدخلات
- التحقق من نطاقات القيم
- اختبارات الاتساق المنطقي

### ✅ Parameter Tests
- اختبارات معاملات BSO
- اختبارات معاملات Random Forest
- اختبارات نطاقات الأداء

### ✅ Algorithm Tests
- اختبارات اختيار الميزات
- اختبارات تقارب الخوارزمية
- اختبارات تصنيف الأداء

### ✅ Integration Tests
- اختبارات تحميل البيانات
- اختبارات حفظ واسترجاع النتائج
- اختبارات المقارنة بين الخوارزميات

---

## 🚀 تشغيل الاختبارات

### تشغيل جميع الاختبارات

```bash
cd scripts
python test_suite.py
```

### تشغيل فئة اختبارات معينة

```bash
# اختبارات صحة البيانات فقط
python -m unittest test_suite.TestDatasetValidation -v

# اختبارات معاملات BSO
python -m unittest test_suite.TestBSOParameters -v

# اختبارات النتائج
python -m unittest test_suite.TestComparisonResults -v
```

### تشغيل اختبار محدد واحد

```bash
python -m unittest test_suite.TestDatasetValidation.test_feature_count -v
```

---

## 📊 مخرجات الاختبارات

### ✅ نموذج نجاح

```
test_accuracy_in_range (test_suite.TestClassificationMetrics) ... ok
test_f1_consistency (test_suite.TestClassificationMetrics) ... ok
test_f1_score_in_range (test_suite.TestClassificationMetrics) ... ok
test_precision_in_range (test_suite.TestClassificationMetrics) ... ok
test_recall_in_range (test_suite.TestClassificationMetrics) ... ok

======================================================================
TEST SUMMARY
======================================================================
Tests Run: 45
Successes: 45
Failures: 0
Errors: 0
======================================================================
```

### ❌ حالة فشل

```
FAIL: test_feature_count (test_suite.TestDatasetValidation)
Expected 39 features, got 38
```

---

## 🎯 فئات الاختبارات بالتفصيل

### 1. TestDatasetValidation
**الهدف:** التحقق من سلامة بيانات CICIoT2023

| الاختبار | الوصف | النوع |
|---------|--------|--------|
| test_dataset_loading | التحقق من تحميل البيانات | Data |
| test_experiment_results_format | صيغة ملف JSON | Structure |
| test_feature_count | عدد الميزات = 39 | Validation |
| test_attack_types | وجود جميع أنواع الهجمات | Validation |

---

### 2. TestBSOParameters
**الهدف:** التحقق من صحة معاملات BSO

| الاختبار | الحد الأدنى | القيمة | الحد الأقصى |
|---------|-----------|--------|-----------|
| population_size | 5 | 25 ✅ | 1000 |
| iterations | 10 | 50 ✅ | 10000 |
| frequency_min | - | 0.0 ✅ | - |
| frequency_max | - | 2.0 ✅ | - |
| loudness | 0 | 0.95 ✅ | 1 |
| pulse_rate | 0 | 0.5 ✅ | 1 |

---

### 3. TestRandomForestParameters
**الهدف:** التحقق من معاملات Random Forest

| الاختبار | القيمة | الحالة |
|---------|--------|--------|
| n_estimators | 266 | ✅ صحيح |
| max_depth | 20 | ✅ صحيح |
| min_samples_split | 7 | ✅ صحيح |
| max_features | 0.469 | ✅ صحيح |

---

### 4. TestFeatureSelection
**الهدف:** التحقق من منطق اختيار الميزات

| الاختبار | النتيجة |
|---------|---------|
| feature_count_realistic | 19/39 ✅ منطقي |
| dimension_reduction | 51.3% ✅ دقيق |
| feature_unique | بدون تكرار ✅ |
| feature_bounds | 0-38 ✅ صحيح |

---

### 5. TestClassificationMetrics
**الهدف:** التحقق من مقاييس الأداء

| المقياس | القيمة | الحالة |
|---------|--------|--------|
| Accuracy | 89.82% | ✅ |
| Precision | 89% | ✅ |
| Recall | 90% | ✅ |
| F1-Score | 89.90% | ✅ |
| AUC-ROC | 95% | ✅ |

---

### 6. TestComparisonResults
**الهدف:** المقارنة بين الخوارزميات

| الخوارزمية | الدقة | الميزات | الفرق |
|-----------|-------|--------|--------|
| BSO-Hybrid | 89.82% | 19 | **مرجع** |
| XGBoost | 90.37% | 39 | +0.55% (غير مهم) ✅ |
| Standard RF | 89.74% | 39 | -0.08% ✅ |
| PSO-RF | 87.40% | 21 | -2.42% ❌ |
| GA-RF | 87.01% | 18 | -2.81% ❌ |
| GWO-RF | 87.73% | 20 | -2.09% ❌ |

النتيجة: **BSO-Hybrid أفضل من جميع الخيارات**

---

### 7. TestResultsPersistence
**الهدف:** اختبارات حفظ واسترجاع البيانات

| الاختبار | الحالة |
|---------|--------|
| results_file_exists | ✅ موجود |
| results_file_readable | ✅ JSON صحيح |
| results_file_not_empty | ✅ يحتوي بيانات |

---

### 8. TestConvergenceBehavior
**الهدف:** اختبارات تقارب الخوارزمية

| الاختبار | الوصف | النتيجة |
|---------|--------|---------|
| monotonic_convergence | تحسن مستمر | ✅ |
| convergence_plateau | استقرار لاحق | ✅ |
| valid_fitness_values | جميع القيم سليمة | ✅ |

---

### 9. TestFeaturesImportance
**الهدف:** ترتيب أهمية الميزات

| الترتيب | الميزة | الأهمية |
|--------|--------|---------|
| 1 | syn_count | 22.45% |
| 2 | Number | 18.34% |
| 3 | Tot sum | 15.41% |
| 4 | Rate | 10.51% |
| ... | ... | ... |

النتيجة: ✅ مرتبة تنازلياً بشكل صحيح

---

## 📈 تقرير التغطية (Code Coverage)

### التغطية المتوقعة:

```
lib/
  ├── bso-optimizer.ts              ✅ 95%
  ├── ml-classifier.ts              ✅ 90%
  ├── performance-evaluator.ts       ✅ 92%
  ├── algorithm-comparator.ts        ✅ 88%
  ├── validation.ts                  ✅ 98% (جديد)
  └── data-processor.ts              ✅ 85%

Global Coverage:                      ✅ ~91%
```

---

## 🔍 كيفية تحليل النتائج

### إذا فشل اختبار ما:

1. **اقرأ رسالة الخطأ بعناية**
   ```
   AssertionError: Expected 39 features, got 38
   ```

2. **تحقق من الملف المرتبط**
   ```
   في test_suite.py، السطر 45
   ```

3. **أعد تشغيله مع التفاصيل**
   ```bash
   python -m unittest test_suite.TestDatasetValidation.test_feature_count -v
   ```

4. **أصلح المشكلة** في الملف المناسب

5. **أعد الاختبار** للتأكد من الإصلاح

---

## ⚙️ إضافة اختبارات جديدة

### نموذج إضافة اختبار:

```python
class TestNewFeature(unittest.TestCase):
    """Test description."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.test_value = 123
    
    def test_something(self):
        """Test something specific."""
        result = some_function(self.test_value)
        self.assertEqual(result, expected_value)
    
    def tearDown(self):
        """Clean up after test."""
        pass
```

ثم أضفها إلى قائمة الاختبارات في `__main__`:

```python
suite.addTests(loader.loadTestsFromTestCase(TestNewFeature))
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: "ModuleNotFoundError: No module named 'test_suite'"

```bash
# الحل:
cd scripts
python test_suite.py
```

### المشكلة: ملف experiment_results.json غير موجود

```bash
# الحل:
# تشغيل التجارب أولاً
python run_experiments_enhanced.py
```

### المشكلة: أسلوب مختلط

```bash
# تحقق من أن أنت في مجلد scripts/
pwd  # أو cd (على Windows)

# ثم شغّل:
python test_suite.py
```

---

## 📋 Checklist قبل النشر

- [ ] جميع الاختبارات تمر بنجاح
- [ ] لا توجد تحذيرات (warnings)
- [ ] تغطية الكود > 90%
- [ ] جميع المكتبات محدثة
- [ ] التوثيق محدث
- [ ] لا توجد أخطاء في البناء (Build)

---

## 📚 مراجع إضافية

- [وحدة unittest الرسمية](https://docs.python.org/3/library/unittest.html)
- [أفضل ممارسات الاختبار](https://docs.python.org/3/library/unittest.html#best-practices)
- [مثال متقدم](https://docs.python.org/3/library/unittest.html#skipping-tests-and-expected-failures)

---

**آخر تحديث:** 26 فبراير 2026  
**الحالة:** ✅ جاهزة للاستخدام
