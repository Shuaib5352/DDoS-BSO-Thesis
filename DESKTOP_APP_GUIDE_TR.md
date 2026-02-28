# DDoS-BSO Tespiti - Masaüstü Uygulaması

## 📋 Genel Bakış

DDoS-BSO Tespiti, BSO-Hibrit Algoritmasını kullanarak DDoS saldırılarını algılamak için tasarlanmış ileri bir makine öğrenmesi uygulamasıdır. Bu masaüstü sürümü, Windows işletim sisteminde kolaylıkla kurulabilir ve çalıştırılabilir.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- **Node.js** 18.0 veya daha yüksek
- **Python** 3.8 veya daha yüksek (API sunucusu için)
- **npm** veya **yarn** paket yöneticisi

### Kurulum

```bash
# Depoyu klonla
git clone https://github.com/yourusername/ddos-bso-thesis.git
cd ddos-bso-thesis

# Bağımlılıkları yükle
npm install

# Python ortamını hazırla (isteğe bağlı)
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Geliştirme Modunda Çalıştırma

```bash
# Web sunucusu + Electron uygulamasını birlikte başlat
npm run desktop:dev

# Veya sadece web uygulamasını başlat
npm run web:dev

# Veya sadece Electron uygulamasını başlat (port 3000'de çalışan Next.js gerekir)
npm run electron-dev
```

### Ürün Derleme (EXE Oluşturma)

```bash
# Windows installer'ı oluştur
npm run desktop:build

# Taşınabilir EXE oluştur
npm run desktop:build
```

Derlenmiş dosyalar `dist/` klasöründe yer alacak:
- `DDoS-BSO-Tespiti-1.0.0.exe` - NSIS Installer
- `DDoS-BSO-Tespiti-1.0.0.exe` - Taşınabilir sürüm

## 📁 Proje Yapısı

```
ddos-bso-thesis/
├── app/                    # Next.js uygulama dizini
│   ├── layout.tsx         # Ana layout (PWA config'i içerir)
│   ├── page.tsx           # Ana sayfa
│   └── [routes]/          # Sayfalar ve rotalar
├── components/            # React bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
├── public/
│   ├── electron.js        # Electron ana işlem
│   ├── preload.js         # Electron preload script
│   ├── sw.js              # Service Worker (PWA)
│   ├── manifest.json      # PWA manifest
│   ├── icon.ico           # Windows simgesi
│   ├── icon-192x192.png   # PWA simgesi (192x192)
│   └── icon-512x512.png   # PWA simgesi (512x512)
├── scripts/               # Python betikleri
│   ├── real_experiment.py # ML algoritması ve veri analizi
│   └── test_suite.py      # Unit testleri
├── package.json           # Node.js bağımlılıkları ve build config
├── next.config.js         # Next.js konfigürasyonu
├── tsconfig.json          # TypeScript konfigürasyonu
└── requirements.txt       # Python bağımlılıkları
```

## 🔧 Konfigürasyon

### Electron Ayarları

`public/electron.js` dosyasında temel ayarlar yapılabilir:

```javascript
// Pencere boyutu
width: 1400,
height: 900,

// Minimum boyutlar
minWidth: 800,
minHeight: 600
```

### PyBuilder NSIS Kurulumu

`package.json` dosyasının `build` bölümünde kurulum seçenekleri bulunmaktadır:

```json
"nsis": {
  "oneClick": false,
  "allowToChangeInstallationDirectory": true,
  "createDesktopShortcut": true
}
```

## 🧪 Test Etme

### Birim Testleri Çalıştır

```bash
python scripts/test_suite.py
```

### Uygulamayı Test Et

1. **Geliştirme Modunda:**
   ```bash
   npm run desktop:dev
   ```
   Windows PC'de uygulamayı test edebilirsiniz.

2. **Yerleşik Kurulum:**
   ```bash
   npm run desktop:build
   ```
   Oluşturulan `DDoS-BSO-Tespiti-1.0.0.exe` dosyasını çalıştırın.

## 📊 Veri Seti ve Algoritma

### Veri Seti
- **Kaynak:** CICIoT2023 veri seti
- **Örnekler:** 118.466
- **Özellikler:** 39
- **Hedef:** DDoS Saldırısı vs Normal Trafik

### BSO-Hibrit Algoritması

1. **Özellik Seçimi:** Bees Swarm Optimization (BSO)
2. **Hiperparametre Optimizasyonu:** BSO + Random Forest
3. **Sınıflandırma:** Random Forest (RF)

**Sonuçlar:**
- Özellik Sayısında %51,3 azalma
- Yüksek doğruluk ve hassasiyet oranları

## 🔐 Güvenlik

- **Context Isolation:** Etkinleştirildi
- **Sandbox Mode:** Aktif
- **NodeIntegration:** Devre dışı
- **Preload Script:** Güvenli API'ler sağlar

## 📱 PWA Özellikleri

Uygulama Progressive Web App olarak da çalışabilir:
- Çevrimdışı çalışma desteği
- Kurulabilir (masaüstü/telefon)
- Push bildirimleri
- Hızlı yükleme (Service Worker caching)

## 🐛 Sorun Giderme

### Port 3000 Zaten Kullanımda

```bash
# Farklı port kullan
set PORT=3001
npm run web:dev
```

### Electron Başlatılamıyor

1. Next.js sunucusunun çalışıp çalışmadığını kontrol edin:
   ```bash
   npm run web:dev
   ```

2. Port'u kontrol edin:
   ```bash
   netstat -ano | findstr :3000
   ```

### Build Hatası

```bash
# Cache'i temizle
rimraf .next
npm run desktop:build
```

## 📝 Lisans

Bu proje akademik tez projesidir. Kullanım izni için lütfen yöneticiye başvurun.

## 👤 Yazar

**shuaib ayad jasimد** - DDoS-BSO Tespiti Tez Projesi

## 📞 İletişim

_x9sl instagram.

---

**Sürüm:** 1.0.0  
**Son Güncelleme:** 2024  
**Durum:** Üretim Hazır ✅
