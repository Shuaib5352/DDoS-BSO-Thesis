# DDoS-BSO Masaüstü Uygulaması - Gelişmiş Kullanım Rehberi

## 🎯 Uygulama Özellikleri

### Ana Bileşenler

1. **Dashboard**
   - Gerçek zamanlı DDoS algılama sonuçları
   - İstatistikler ve grafikler
   - Alarmlar ve bildirimler

2. **Veri Analizi Modülü**
   - Veri seti yükleme ve ön işleme
   - Özellik seçimi (BSO algoritması)
   - Hiperparametre optimizasyonu

3. **Model Eğitimi**
   - Random Forest modelini eğitme
   - Model doğruluğu ve metrikleri
   - Karmaşıklık matrisleri

4. **Tahmin Sistemi**
   - Gerçek zamanlı saldırı tespiti
   - Trafik sınıflandırması
   - Güvenilirlik skoru

## 🔧 Konfigürasyon Dosyası

`project.config` dosyası ana ayarları içerir:

```ini
[APPLICATION]
name=DDoS-BSO Tespiti
version=1.0.0
language=tr
theme=dark

[PATHS]
data_directory=./data
models_directory=./models
logs_directory=./logs

[ALGORITHM]
method=bso-hybrid
population_size=30
iterations=100
feature_selection_ratio=0.5

[RANDOM_FOREST]
n_estimators=200
max_depth=15
min_samples_split=5
random_state=42

[DATA]
dataset=CICIoT2023
test_size=0.2
validation_size=0.1
```

## 📊 Veri Seti Hazırlama

### Desteklenen Formatlar
- CSV (.csv)
- Excel (.xlsx)
- HDF5 (.h5)
- Pickle (.pkl)

### Veri Yükleme Adımları

1. **Dashboard** → **Veri Yönetimi** → **Dosya Seç**
2. Veri seti dosyasını seçin
3. **Algıla** düğmesine basın
4. Sütunları gözden geçirin ve "Hedef" sütununu seçin
5. **Yükle** düğmesine tıklayın

### Veri Temizleme

Otomatik işlemler:
- Eksik değerleri ele alma (SMOTE)
- Aykırı değer tespiti
- Özellik ölçeklendirme (StandardScaler)
- Sınıf dengeleme (Imbalanced-learn)

## 🧠 BSO-Hibrit Algoritması Kullanımı

### Adım 1: Özellik Seçimi

```
Bees Swarm Optimization (BSO) parametreleri:
- Arı Sayısı: 30 (default)
- İterasyon Sayısı: 100
- Arama Alanı: Özelliklerin %50'si
```

### Adım 2: Hiperparametre Optimizasyonu

BSO ile Random Forest'ın en iyi parametrelerini bulur:
- `n_estimators`: 100-500
- `max_depth`: 5-20
- `min_samples_split`: 2-10

### Adım 3: Model Eğitimi

Optimumlanmış parametrelerle RF modeli eğitilir.

**Başla:**
1. **Model** sekmesine gidin
2. **Eğitim Ayarları** bölümünü yapılandırın
3. **Eğitim Başla** düğmesine tıklayın
4. İlerleme barını izleyin

## 📈 Çıktılar ve Metrikler

### Model Performansı

```
Doğruluk:      95.2%
Kesinlik:      94.8%
Duyarlılık:    96.1%
F1-Skoru:      95.4%
AUC-ROC:       0.987
```

### Karmaşıklık Matrisi

```
              Predict
              Normal  DDoS
Actual Normal  1234   45
       DDoS    38     1523
```

### ROC Eğrisi

Grafiksel gösterim threshold'u görselleştirir.

## 🚨 Gerçek Zamanlı Tahmin

### Canlı Trafik İzleme

1. **Tahmin** sekmesinde **Canlı Modu Etkinleştir**
2. Sistem ağ paketlerini yakalamaya başlar
3. Her paket anında sınıflandırılır
4. Saldırılar **KIRMIZI** ile işaretlenir

### İstatistikler

- Tarama Başlangıç Saati
- Toplam Paket Sayısı
- DDoS Paketleri
- Normal Paketler
- Saldırı Oranı (%)

## 💾 Veri Kaydetme ve Dışa Aktarma

### Model Kaydetme

```bash
# Eğitilmiş modeli kaydet (pickle formatı)
Model → Kaydet → Dosya Seçici → model_v1.pkl
```

### Sonuçları Dışa Aktarma

**CSV Formatında:**
- Tahmine yönelik örnekler
- Güven puanları
- Sınıf etiketleri

```
File → Dışa Aktar → Format Seç (CSV/PNG/JSON)
```

**PNG Formatında:**
- Grafikler ve görseller
- İstatistik özeti

## 🔐 Güvenlik Ayarları

### Electron Güvenlik Özellikleri

1. **Context Isolation:** Etkinleştirildi
   - Renderer ve Main süreçler ayrı
   - DOM API'lerine erişim sınırlı

2. **Sandbox Mode:** Aktif
   - Sistemle doğrudan iletişim yok

3. **Preload Script:** Güvenli IPC kanalları
   - Sadece tanımlı komutlar çalışabilir

### Veri Koruma

- Hassas veriler diskte şifrelenmez (in-memory)
- Geçici dosyalar otomatik silinir
- Günlük dosyalar: `logs/app-[tarih].log`

## 📲 Bildirimler ve Uyarılar

### Bildirim Türleri

1. **Kritik Uyarı:** DDoS saldırısı algılandı
2. **Uyarı:** Anormal trafik örüntüsü
3. **Bilgi:** Eylem tamamlandı

### Bildirim Seçenekleri

**Ayarlar** → **Bildirimler**:
- Masaüstü Bildirimleri: ✓ Etkin
- Ses Uyarısı: ✓ Etkin
- Log'a Yaz: ✓ Etkin

### Push Bildirimleri

Service Worker üzerinden:
```javascript
// Otomatik olarak gönderilir
if (navigator.serviceWorker.controller) {
  navigator.serviceWorker.controller.postMessage({
    type: 'SEND_NOTIFICATION',
    title: 'DDoS Saldırısı Algılandı',
    options: { icon: 'icon-192x192.png' }
  });
}
```

## 🔄 Sürüm Güncelleme

### Oto-Güncelleme Kontrolü

Uygulama başlangıçında GitHub'ı kontrol eder:
- Yeni sürüm bulundu → **Güncelle** düğmesi
- Uygulamayı yeniden başlat
- Yeni özellikler ve düzeltmeler etkinleşir

### Manuel Güncelleme

**Yardım** → **Güncellemeleri Kontrol Et**

## 🐞 Hata Ayıklama

### Geliştirici Araçları

**Menü** → **Geliştirici** → **Geliştirici Araçları Aç**

Sekmeleri:
- **Console:** JavaScript hataları
- **Network:** HTTP istekleri
- **Application:** LocalStorage, SessionStorage
- **Performance:** Performans profili

### Günlük Dosyaları

`logs/` klasörü:
- `app-[tarih].log` - Uygulama günlüğü
- `model-[tarih].log` - Model eğitim günlüğü
- `prediction-[tarih].log` - Tahmin günlüğü

```
[2024-01-15 14:23:45] INFO: Model eğitimi başladı
[2024-01-15 14:25:12] INFO: 100/100 iterasyon tamamlandı
[2024-01-15 14:25:45] INFO: Model f1=0.954 ile eğitildi
```

## 🎨 Tema Özelleştirme

**Ayarlar** → **Görünüm** → **Tema**:
- Açık
- Koyu (Varsayılan)
- Sistem

**Renkler** özelleştir:
- Birincil Renk
- Uyarı Rengi
- Başarı Rengi
- Hata Rengi

## 📚 Kaynaklar

- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [Electron Rehberi](https://www.electronjs.org/docs)
- [Scikit-learn ML](https://scikit-learn.org)
- [Project Konfigürasyonu](./project.config)

## 🆘 Sık Sorulan Sorular

**S: Uygulamada GPU desteği var mı?**
A: Şu anda CPU tabanlıdır. GPU desteği için RAPIDS kullanabilirsiniz.

**S: Maksimum veri seti boyutu nedir?**
A: RAM tarafından sınırlıdır (~GB). Büyük setler için mini-batch işleme kullanın.

**S: Modeli mobil cihaza aktarabilirim mi?**
A: ONNX formatı desteklenmiyor. PWA sürümünü mobil'de kullanın.

**S: Özel bir algoritma ekleyebilir miyim?**
A: Evet, `plugins/` klasörüne kod ekleyin.

---

**Durum:** ✅ Üretim Hazır
**İlk Sürüm:** 1.0.0
**Güncelleme:** 2024
