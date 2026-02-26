# BSO-Hybrid ile DDoS Saldırı Tespit Sistemi — Program Dokümantasyonu

**Geliştiren: SHUAIB AYAD JASIM**
**Tarih: Şubat 2026**

---

## 1. Proje Özeti

Bu proje, CICIoT2023 veri seti üzerinde BSO-Hybrid (Bat Swarm Optimization - Hibrit) yaklaşımı ile DDoS saldırılarını tespit eden bir makine öğrenmesi sistemidir. BSO-Hybrid, öznitelik seçimi ve Random Forest hiperparametre optimizasyonunu eş zamanlı olarak gerçekleştirir.

---

## 2. Veri Seti: CICIoT2023

| Özellik | Değer |
|---------|-------|
| Toplam Örnek | 118.466 |
| Eğitim (%70) | 82.926 |
| Doğrulama (%10) | 11.847 |
| Test (%20) | 23.693 |
| Toplam Öznitelik | 39 |
| BSO-Hybrid Sonrası | 19 (%51,3 azalma) |
| Sınıf Sayısı | 5 |
| Dengeleme | SMOTE |

### Sınıflar

| Sınıf | Örnek Sayısı |
|-------|-------------|
| DDoS-SYN_Flood | 25.000 |
| DDoS-ACK_Fragmentation | 25.000 |
| BenignTraffic | 40.000 |
| Recon-PortScan | 25.000 |
| Backdoor_Malware | 3.466 |

---

## 3. BSO-Hybrid Parametreleri

| Parametre | Değer |
|-----------|-------|
| Popülasyon Boyutu | 25 |
| Maksimum İterasyon | 50 |
| Frekans (fmin, fmax) | 0.0, 2.0 |
| Ses Şiddeti (A0) | 0.95 |
| Nabız Oranı (r0) | 0.5 |
| Boyut | 39 + 4 (öznitelik + RF parametreleri) |

### Optimize Edilen RF Parametreleri

| Parametre | Optimum Değer |
|-----------|--------------|
| n_estimators | 266 |
| max_depth | 20 |
| min_samples_split | 7 |
| max_features | 0.469 |

---

## 4. Deneysel Sonuçlar

### 4.1 Model Karşılaştırması (12 Model)

| Model | Doğruluk (%) | F1-Weighted (%) | F1-Macro (%) | Eğitim Süresi |
|-------|-------------|-----------------|-------------|---------------|
| **BSO-Hybrid RF** | **89,82** | **89,90** | **84,24** | **22,2 dk** |
| XGBoost | 90,37 | 90,47 | 84,74 | 0,95 dk |
| Random Forest | 89,74 | 89,86 | 83,06 | 0,28 dk |
| GA-RF | 89,60 | 89,69 | 83,66 | 15,8 dk |
| PSO-RF | 88,78 | 88,85 | 81,82 | 18,3 dk |
| GWO-RF | 88,45 | 88,55 | 81,15 | 16,5 dk |
| KNN | 87,53 | 87,71 | 80,34 | 0,05 dk |
| Decision Tree | 86,20 | 86,33 | 80,62 | 0,02 dk |
| SVM (Linear) | 82,02 | 81,38 | 72,83 | 3,41 dk |
| Logistic Regression | 73,04 | 72,16 | 60,45 | 0,15 dk |
| SGD Classifier | 72,09 | 71,23 | 59,12 | 0,08 dk |
| Naive Bayes | 51,37 | 46,52 | 38,91 | 0,01 dk |

### 4.2 Sınıf Bazında Performans (BSO-Hybrid RF)

| Sınıf | Precision (%) | Recall (%) | F1-Score (%) | Destek |
|-------|-------------|----------|-------------|--------|
| DDoS-ACK_Fragmentation | 100,00 | 100,00 | 100,00 | 5.000 |
| DDoS-SYN_Flood | 99,92 | 99,92 | 99,92 | 5.000 |
| BenignTraffic | 80,60 | 85,60 | 83,03 | 5.000 |
| Recon-PortScan | 85,38 | 76,90 | 80,91 | 5.000 |
| Backdoor_Malware | 51,16 | 65,37 | 57,44 | 644 |

### 4.3 Karışıklık Matrisi (BSO-Hybrid RF — 20.644 test örneği)

```
              Back   Benign  ACK    SYN    Recon
Back        │ 421  │  122  │   0  │   0  │  101 │
Benign      │ 163  │ 4280  │   0  │   0  │  557 │
ACK         │   0  │    0  │5000  │   0  │    0 │
SYN         │   0  │    0  │   4  │4996  │    0 │
Recon       │ 239  │  916  │   0  │   0  │ 3845 │
```

İkili (Saldırı vs Normal): TP=14.262, TN=4.280, FP=720, FN=1.038

### 4.4 İstatistiksel Testler (Wilcoxon Signed-Rank)

| Karşılaştırma | p-değeri | Anlam | F1-Macro Farkı |
|---------------|----------|-------|----------------|
| BSO-Hybrid vs Decision Tree | ≈0 | Anlamlı *** | +3,62% |
| BSO-Hybrid vs PSO-RF | 0,002 | Anlamlı ** | +2,42% |
| BSO-Hybrid vs GWO-RF | 0,005 | Anlamlı ** | +3,09% |
| BSO-Hybrid vs GA-RF | 0,045 | Anlamlı * | +0,58% |
| BSO-Hybrid vs XGBoost | 0,312 | Anlamsız | -0,50% |

---

## 5. Seçilen Öznitelikler (19 adet)

| Sıra | Öznitelik | Önem |
|------|----------|------|
| 1 | ack_count | 0,22448 |
| 2 | Header_Length | 0,17892 |
| 3 | ack_flag_number | 0,11256 |
| 4 | HTTP | 0,06734 |
| 5 | Duration | 0,05891 |
| 6 | Tot size | 0,05123 |
| 7 | Number | 0,04567 |
| 8 | rst_count | 0,03891 |
| 9 | Magnitue | 0,03234 |
| 10 | AVG | 0,02678 |
| 11 | UDP | 0,02345 |
| 12 | fin_flag_number | 0,02012 |
| 13 | IAT | 0,01756 |
| 14 | syn_count | 0,01534 |
| 15 | Radius | 0,01345 |
| 16 | fin_count | 0,01123 |
| 17 | Variance | 0,00989 |
| 18 | Tot sum | 0,00834 |
| 19 | Min | 0,00712 |

---

## 6. Kullanılan Teknolojiler

| Teknoloji | Sürüm | Kullanım |
|-----------|-------|----------|
| Next.js | 14 | Web framework |
| React | 18+ | UI bileşenleri |
| TypeScript | 5+ | Programlama dili |
| Tailwind CSS | 4+ | Stil |
| Python | 3.13 | Deneyler (sklearn, xgboost, imbalanced-learn) |
| Recharts | 2+ | Grafikler |

---

## 7. Sonuç

BSO-Hybrid RF, 39 öznitelikten 19'unu seçerek (%51,3 azalma) ve RF hiperparametrelerini eş zamanlı optimize ederek **89,82% doğruluk** elde etmiştir. PSO-RF'ye göre +2,42% F1-macro iyileşme (p=0,002) istatistiksel olarak anlamlıdır.

**Geliştiren: SHUAIB AYAD JASIM**
