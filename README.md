# BSO-Hybrid DDoS Tespiti — Yüksek Lisans Tez Paneli

> **Dinamik Ağ Ortamlarında Yarasa Sürüsü Optimizasyonu (BSO) ile Optimize Edilmiş Hibrit Makine Öğrenmesi Çerçevesi Kullanılarak DDoS Saldırılarının Geliştirilmiş Tespiti**

| | |
|---|---|
| **Yazar** | SHUAIB AYAD JASIM |
| **Danışman** | Dr. Öğr. Üyesi Saim ERVURAL |
| **Program** | Bilgisayar Mühendisliği — Yüksek Lisans (M.Sc.) |
| **Üniversite** | KTO Karatay Üniversitesi, Konya |
| **Tarih** | 2026 |
| **Canlı Demo** | [bso-thesis.vercel.app](https://bso-thesis.vercel.app) |

---

## Proje Hakkında

Bu proje, CICIoT2023 veri seti üzerinde **BSO (Bat Swarm Optimization)** ile eşzamanlı özellik seçimi ve hiperparametre optimizasyonu yapan hibrit bir DDoS tespit sistemi sunar. Sonuçlar **30 sekmeli interaktif web paneli** ile görselleştirilmektedir.

### Temel Katkılar

- **Eşzamanlı optimizasyon**: Özellik seçimi + Random Forest HP ayarlama (tek BSO ile)
- **%51.3 boyut azaltma**: 39 → 19 özellik, performans kaybı olmadan
- **5 sınıflı tespit**: DDoS-ACK_Frag, DDoS-SYN_Flood, BenignTraffic, PortScan, Backdoor_Malware
- **12 model karşılaştırma**: BSO-RF, XGBoost, RF, SVM, DT, KNN, LR, PSO-RF, GA-RF, GWO-RF, vb.

---

## Anahtar Sonuçlar

| Metrik | BSO-Hybrid RF | XGBoost | Standart RF | PSO-RF | GA-RF | GWO-RF |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Doğruluk** | **89.82%** | 90.37% | 89.74% | 87.40% | 87.01% | 87.73% |
| **F1-Macro** | **84.24%** | 84.74% | 83.06% | 81.82% | 81.25% | 81.15% |
| **AUC-ROC** | **98.38%** | 98.81% | 98.36% | 97.82% | 97.60% | 97.40% |
| **Özellik** | **19/39** | 39/39 | 39/39 | 21/39 | 18/39 | 20/39 |

**İstatistiksel Anlamlılık (Wilcoxon):** BSO-RF vs PSO-RF p=0.002 | vs GA-RF p=0.001 | vs GWO-RF p=0.005

---

## Panel Sekmeleri (30 Adet)

| # | Sekme | Açıklama |
|---|---|---|
| 1 | Ana Sayfa | Genel bakış, zaman çizelgesi, istatistikler |
| 2 | Tez (Bölüm 4) | Sonuçlar bölümü — tablolar ve yorumlar |
| 3 | Sistem Mimarisi | Uçtan uca BSO-Hybrid RF diyagramı |
| 4 | BSO Görselleştirme | Yakınsama, parametre analizi, sürü animasyonu |
| 5 | Özellik Analizi | 19 seçili özelliğin önem sıralaması |
| 6 | Ablasyon (S1-S4) | 4 senaryo karşılaştırması |
| 7 | ML Sınıflandırma | 12 modelin detaylı sonuçları |
| 8 | Algoritma Karşılaştırma | BSO vs PSO vs GA vs GWO |
| 9 | Model Sıralama | Çok ölçütlü sıralama tablosu |
| 10 | Performans Değerlendirme | 7 metrik detaylı analiz |
| 11 | Karışıklık Matrisi | 5×5 ısı haritası |
| 12 | Hata Analizi | Yanlış sınıflandırma dağılımı |
| 13 | Öğrenme Eğrileri | Eğitim/test verimlilik analizi |
| 14 | Savunma S&C | Tez savunması soru-cevap |
| 15 | Tablolar | Tüm tez tabloları — kopyalanabilir |
| 16 | Özellik Seçimi | BSO/PSO/GA/GWO FS karşılaştırması |
| 17 | Kaynakça | IEEE/APA formatında referanslar |
| 18 | DDoS Tespit Formu | Canlı trafik sınıflandırma demo |
| 19 | Pipeline Demo | Veri akışı görselleştirmesi |
| 20 | Matematik | Tez denklemleri (KaTeX) |
| 21 | Literatür | İlgili çalışmalar karşılaştırması |
| 22 | Metodoloji | Bölüm 3 — yöntem çerçevesi |
| 23 | Veri Seti EDA | CICIoT2023 keşifsel analiz |
| 24 | İstatistik | Wilcoxon, Friedman testleri |
| 25 | Yazım Rehberi | Akademik yazım önerileri |
| 26 | Terimler Sözlüğü | Teknik terimler ve notasyonlar |
| 27 | Dışa Aktarma | Yazdırma ve PDF export |
| 28 | Sonuç (Bölüm 5) | Sonuç ve öneriler — kopyalanabilir |
| 29 | Şekiller (18 SVG) | Tüm tez şekilleri — indirilebilir |
| 30 | Bölüm Düzenleyici | Tez metin bölümleri — kopyalanabilir |

---

## Teknoloji

| Katman | Araç |
|---|---|
| Framework | Next.js 16, React 19, TypeScript 5 |
| UI | shadcn/ui, Tailwind CSS 4, Recharts |
| İkonlar | Lucide React |
| Dağıtım | Vercel (otomatik CI/CD) |
| Python Deneyleri | scikit-learn, XGBoost, SMOTE |

---

## Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusu
npm run dev

# Üretim derlemesi
npm run build
```

**Canlı:** [https://bso-thesis.vercel.app](https://bso-thesis.vercel.app)

---

## Proje Yapısı

```
├── app/                    # Next.js sayfa ve layout
│   ├── page.tsx            # Ana sayfa (30 sekme)
│   └── layout.tsx          # Root layout + metadata
├── components/             # React bileşenleri (~30 panel)
│   ├── thesis-figures.tsx  # 18 SVG akademik şekil
│   ├── thesis-chapter-organizer.tsx
│   ├── conclusion-recommendations.tsx
│   ├── ablation-study.tsx
│   └── ...
├── lib/                    # Veri ve yardımcı fonksiyonlar
│   └── ciciot2023-dataset.ts  # Tüm deneysel veriler
├── scripts/                # Python deney betikleri
│   ├── bso_ddos_experiment.py
│   └── run_experiments.py
├── docs/                   # Türkçe tez dokümantasyonu
├── public/                 # Statik dosyalar (ikon, manifest)
└── styles/                 # CSS dosyaları
```

---

## BSO Parametreleri

| Parametre | Değer |
|---|---|
| Popülasyon | 25 yarasa |
| Maks. İterasyon | 50 |
| Frekans [f_min, f_max] | [0, 2] |
| Başlangıç Gürültü (A₀) | 0.9 |
| Başlangıç Darbe Oranı (r₀) | 0.5 |
| α (loudness decay) | 0.97 |
| γ (pulse rate increase) | 0.1 |
| Toplam Değerlendirme | 1.177 |
| Optimizasyon Süresi | 840.43 sn |

---

## Lisans

Bu proje KTO Karatay Üniversitesi Yüksek Lisans Tezi kapsamında geliştirilmiştir.

**© 2026 Shuaib Ayad Jasim — Tüm hakları saklıdır.**
