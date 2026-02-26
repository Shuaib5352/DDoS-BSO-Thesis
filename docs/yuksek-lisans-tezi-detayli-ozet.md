# Yüksek Lisans Tezi — Detaylı Özet

## Başlık
**Improved Detection of DDoS Attacks Using a Hybrid Machine Learning Framework Optimized with Bat Swarm Optimization (BSO) in Dynamic Network Environments**

**Yazar: SHUAIB AYAD JASIM**

---

## 1. Araştırma Amacı

DDoS saldırılarının IoT ortamlarında tespiti için BSO-Hybrid adlı yeni bir yaklaşım önerilmektedir. Bu yaklaşım, öznitelik seçimi ve Random Forest hiperparametre optimizasyonunu **eş zamanlı** olarak gerçekleştirir — sadece öznitelik seçimi yapan PSO, GA, GWO gibi geleneksel yöntemlerden farklıdır.

---

## 2. Veri Seti

**CICIoT2023** — Kanada Siber Güvenlik Enstitüsü (CIC) tarafından yayınlanan IoT saldırı veri seti.

- **Toplam**: 118.466 örnek
- **Öznitelik**: 39
- **Sınıf**: 5 (DDoS-SYN_Flood, DDoS-ACK_Fragmentation, BenignTraffic, Recon-PortScan, Backdoor_Malware)
- **Bölünme**: %70 eğitim, %10 doğrulama, %20 test
- **Dengeleme**: SMOTE (sadece eğitim seti üzerinde)

---

## 3. Yöntem: BSO-Hybrid

### Geleneksel Yaklaşım (PSO-RF, GA-RF, GWO-RF):
→ Yalnızca öznitelik seçimi (ikili vektör)

### Önerilen BSO-Hybrid:
→ **Eş zamanlı** öznitelik seçimi + RF hiperparametre optimizasyonu

**Yarasa vektörü**: `[39 bit öznitelik | n_estimators | max_depth | min_samples_split | max_features]`

**Uygunluk fonksiyonu**:

$$F(S, \theta) = 0.9 \times \text{CV-Accuracy}(S, \theta) + 0.1 \times \left(1 - \frac{|S|}{39}\right)$$

### BSO-Hybrid Parametreleri

| Parametre | Değer |
|-----------|-------|
| Popülasyon | 25 |
| İterasyon | 50 |
| A₀ (Ses) | 0.95 |
| r₀ (Nabız) | 0.5 |
| f_min, f_max | 0, 2 |

### Optimize Edilen RF Parametreleri

| Parametre | Optimum |
|-----------|---------|
| n_estimators | 266 |
| max_depth | 20 |
| min_samples_split | 7 |
| max_features | 0.469 |

---

## 4. Sonuçlar

### 4.1 Ana Sonuçlar

| Metrik | BSO-Hybrid RF | XGBoost | RF (tüm öznitelikler) |
|--------|--------------|---------|----------------------|
| Doğruluk | 89,82% | 90,37% | 89,74% |
| F1-Weighted | 89,90% | 90,47% | 89,86% |
| F1-Macro | 84,24% | 84,74% | 83,06% |
| Öznitelik Sayısı | **19** | 39 | 39 |
| Boyut Azaltma | **%51,3** | — | — |

### 4.2 Metaheuristik Karşılaştırma

| Optimizer | Öznitelik | F1-Macro (%) | p-değeri (vs BSO-Hybrid) |
|-----------|----------|-------------|--------------------------|
| BSO-Hybrid | 19 | 84,24 | — |
| GA-RF | 21 | 83,66 | 0,045 * |
| PSO-RF | 22 | 81,82 | 0,002 ** |
| GWO-RF | 20 | 81,15 | 0,005 ** |

### 4.3 Sınıf Bazında F1-Score

| Sınıf | F1 (%) |
|-------|--------|
| DDoS-ACK_Fragmentation | 100,00 |
| DDoS-SYN_Flood | 99,92 |
| BenignTraffic | 83,03 |
| Recon-PortScan | 80,91 |
| Backdoor_Malware | 57,44 |

### 4.4 Karışıklık Matrisi

```
              Back   Benign  ACK    SYN    Recon
Back        │ 421  │  122  │   0  │   0  │  101 │
Benign      │ 163  │ 4280  │   0  │   0  │  557 │
ACK         │   0  │    0  │5000  │   0  │    0 │
SYN         │   0  │    0  │   4  │4996  │    0 │
Recon       │ 239  │  916  │   0  │   0  │ 3845 │
```

---

## 5. Katkılar

1. **BSO-Hybrid**: İlk kez öznitelik seçimi ve RF hiperparametre optimizasyonunu eş zamanlı yapan BSO tabanlı yöntem
2. **%51,3 boyut azaltma**: 39 → 19 öznitelik, doğruluktan ödün vermeden
3. **İstatistiksel doğrulama**: Wilcoxon testleriyle PSO-RF (p=0,002) ve GWO-RF'ye (p=0,005) göre anlamlı üstünlük
4. **5 sınıflı çok sınıflı değerlendirme**: CICIoT2023 üzerinde, ikili değil

---

## 6. Sınırlılıklar

1. Backdoor_Malware F1=%57,44 (düşük — az sayıda örnek: 644)
2. XGBoost mutlak doğrulukta %0,55 daha yüksek (ancak tüm 39 özniteliği kullanıyor)
3. 22,2 dakika BSO-Hybrid eğitim süresi (çevrimdışı kullanıma uygun)

---

**SHUAIB AYAD JASIM — Şubat 2026**
