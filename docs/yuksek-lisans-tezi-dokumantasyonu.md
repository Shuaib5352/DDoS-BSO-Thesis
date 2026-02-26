# Yüksek Lisans Tezi Dokümantasyonu

## BSO-Hybrid ile DDoS Saldırı Tespiti
### CICIoT2023 Veri Seti Üzerinde Deneysel Değerlendirme

**Yazar: SHUAIB AYAD JASIM**
**Tarih: Şubat 2026**

---

## Bölüm 1: Giriş

### 1.1 Problem Tanımı

DDoS (Distributed Denial of Service) saldırıları, IoT cihazlarının yaygınlaşmasıyla birlikte kritik bir güvenlik tehdidi haline gelmiştir. Geleneksel makine öğrenmesi yaklaşımları genellikle tüm öznitelikleri kullanır veya öznitelik seçimini hiperparametre optimizasyonundan bağımsız gerçekleştirir.

### 1.2 Önerilen Çözüm: BSO-Hybrid

BSO-Hybrid, Yarasa Sürüsü Optimizasyonu (Bat Swarm Optimization) algoritmasını kullanarak:

1. **Öznitelik seçimi** (39 → 19 öznitelik, %51,3 azalma)
2. **RF hiperparametre optimizasyonu** (n_estimators, max_depth, min_samples_split, max_features)

işlemlerini **eş zamanlı** olarak gerçekleştirir.

---

## Bölüm 2: Veri Seti

### 2.1 CICIoT2023

| Özellik | Değer |
|---------|-------|
| Kaynak | Canadian Institute for Cybersecurity |
| Toplam Örnek | 118.466 |
| Öznitelik | 39 |
| Sınıf | 5 |
| Bölünme | %70/%10/%20 (eğitim/doğrulama/test) |
| Dengeleme | SMOTE |

### 2.2 Sınıf Dağılımı

| Sınıf | Toplam | Test Seti |
|-------|--------|-----------|
| DDoS-SYN_Flood | 25.000 | 5.000 |
| DDoS-ACK_Fragmentation | 25.000 | 5.000 |
| BenignTraffic | 40.000 | 5.000 |
| Recon-PortScan | 25.000 | 5.000 |
| Backdoor_Malware | 3.466 | 644 |

---

## Bölüm 3: Metodoloji

### 3.1 BSO-Hybrid Algoritması

**Yarasa Vektörü Yapısı:**
```
[b₁, b₂, ..., b₃₉, n_est, max_dep, min_split, max_feat]
 └── 39 bit ikili ──┘ └──── 4 sürekli parametre ────┘
```

**Uygunluk Fonksiyonu:**
$$F = 0.9 \times \text{3-fold CV Accuracy} + 0.1 \times (1 - |S|/39)$$

### 3.2 BSO-Hybrid Parametreleri

| Parametre | Değer |
|-----------|-------|
| Popülasyon | 25 yarasa |
| İterasyon | 50 |
| A₀ | 0.95 |
| r₀ | 0.5 |
| f_min | 0.0 |
| f_max | 2.0 |

### 3.3 Karşılaştırılan Modeller (12 adet)

1. BSO-Hybrid RF (önerilen)
2. XGBoost
3. Random Forest (tüm öznitelikler)
4. GA-RF (genetik algoritma + RF)
5. PSO-RF (parçacık sürüsü + RF)
6. GWO-RF (gri kurt + RF)
7. K-Nearest Neighbors
8. Decision Tree
9. SVM (Linear)
10. Logistic Regression
11. SGD Classifier
12. Naive Bayes

### 3.4 Değerlendirme Yöntemi

- 10-katlı stratified cross-validation
- Bağımsız test seti (20.644 örnek)
- Wilcoxon Signed-Rank Test (istatistiksel karşılaştırma)
- Metrikler: Accuracy, Precision, Recall, F1-Weighted, F1-Macro

---

## Bölüm 4: Sonuçlar

### 4.1 Performans Karşılaştırması

| Model | Doğruluk (%) | Kesinlik (%) | Duyarlılık (%) | F1-W (%) | F1-M (%) |
|-------|-------------|-------------|---------------|---------|---------|
| **BSO-Hybrid RF** | **89,82** | **90,19** | **89,82** | **89,90** | **84,24** |
| XGBoost | 90,37 | 90,83 | 90,37 | 90,47 | 84,74 |
| Random Forest | 89,74 | 90,14 | 89,74 | 89,86 | 83,06 |
| GA-RF | 89,60 | 90,01 | 89,60 | 89,69 | 83,66 |
| PSO-RF | 88,78 | 89,34 | 88,78 | 88,85 | 81,82 |
| GWO-RF | 88,45 | 88,98 | 88,45 | 88,55 | 81,15 |
| KNN | 87,53 | 88,12 | 87,53 | 87,71 | 80,34 |
| Decision Tree | 86,20 | 87,02 | 86,20 | 86,33 | 80,62 |
| SVM (Linear) | 82,02 | 83,67 | 82,02 | 81,38 | 72,83 |
| Logistic Reg. | 73,04 | 77,23 | 73,04 | 72,16 | 60,45 |
| SGD | 72,09 | 76,45 | 72,09 | 71,23 | 59,12 |
| Naive Bayes | 51,37 | 69,34 | 51,37 | 46,52 | 38,91 |

### 4.2 BSO-Hybrid RF'nin Avantajları

| Özellik | BSO-Hybrid RF | XGBoost | Standart RF |
|---------|--------------|---------|-------------|
| Öznitelik Sayısı | **19** | 39 | 39 |
| Boyut Azaltma | **%51,3** | %0 | %0 |
| F1-Macro | 84,24% | 84,74% | 83,06% |
| vs PSO-RF | **+2,42%** (p=0,002) | — | — |
| vs GWO-RF | **+3,09%** (p=0,005) | — | — |

### 4.3 Sınıf Bazında BSO-Hybrid RF Performansı

| Sınıf | Precision | Recall | F1-Score | Destek |
|-------|----------|--------|----------|--------|
| DDoS-ACK_Fragmentation | 100,00% | 100,00% | 100,00% | 5.000 |
| DDoS-SYN_Flood | 99,92% | 99,92% | 99,92% | 5.000 |
| BenignTraffic | 80,60% | 85,60% | 83,03% | 5.000 |
| Recon-PortScan | 85,38% | 76,90% | 80,91% | 5.000 |
| Backdoor_Malware | 51,16% | 65,37% | 57,44% | 644 |

### 4.4 BSO Tarafından Seçilen 19 Öznitelik

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

### 4.5 Karışıklık Matrisi (20.644 test örneği)

```
              Back   Benign  ACK    SYN    Recon
Back        │ 421  │  122  │   0  │   0  │  101 │
Benign      │ 163  │ 4280  │   0  │   0  │  557 │
ACK         │   0  │    0  │5000  │   0  │    0 │
SYN         │   0  │    0  │   4  │4996  │    0 │
Recon       │ 239  │  916  │   0  │   0  │ 3845 │
```

### 4.6 İstatistiksel Testler (Wilcoxon)

| Karşılaştırma | p-değeri | Anlamlılık |
|---------------|----------|-----------|
| vs Decision Tree | ≈0 | *** |
| vs PSO-RF | 0,002 | ** |
| vs GWO-RF | 0,005 | ** |
| vs KNN | 0,008 | ** |
| vs GA-RF | 0,045 | * |
| vs RF | 0,156 | ns |
| vs XGBoost | 0,312 | ns |

---

## Bölüm 5: Teknik Altyapı

### 5.1 Dashboard Teknolojileri

| Teknoloji | Sürüm | Kullanım |
|-----------|-------|----------|
| Next.js | 14 | Web framework |
| TypeScript | 5+ | Programlama |
| React | 18+ | UI |
| Tailwind CSS | 4+ | Stil |
| Recharts | 2+ | Grafik |
| shadcn/ui | — | Bileşenler |

### 5.2 Deney Ortamı

| Araç | Sürüm | Kullanım |
|------|-------|----------|
| Python | 3.13 | Deneyler |
| scikit-learn | 1.6+ | ML modelleri |
| XGBoost | 2.1+ | XGBoost modeli |
| imbalanced-learn | 0.12+ | SMOTE |
| NumPy/Pandas | — | Veri işleme |

---

## Bölüm 6: Sonuç ve Öneriler

### Sonuç

BSO-Hybrid RF, %51,3 öznitelik azaltması ile 89,82% doğruluk elde ederek, standart RF (89,74%, 39 öznitelik) ile karşılaştırılabilir performans sunar. PSO-RF'ye göre F1-Macro'da +2,42% istatistiksel olarak anlamlı iyileşme sağlar (p=0,002).

### Gelecek Çalışmalar

1. Backdoor_Malware tespiti için derin öğrenme (CNN/LSTM)
2. Farklı veri setlerinde doğrulama (NSL-KDD, CICIDS2017)
3. Gerçek zamanlı ağ ortamında dağıtım
4. Federe öğrenme ile gizlilik korumalı tespit

---

**SHUAIB AYAD JASIM — Şubat 2026**
