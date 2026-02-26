# DDoS-BSO Masaüstü Uygulaması - Derleme ve Kurulum Rehberi

## 🏗️ Derleme Süreci

### 1. Ön Koşullar Kontrol Edin

```bash
node --version      # v18 veya üzeri
npm --version       # v9 veya üzeri
python --version    # 3.8 veya üzeri
```

### 2. Proje Bağımlılıklarını Yükle

```bash
cd C:\Users\imiss\Desktop\DDoS-BSO-Thesis
npm install
```

Bağımlılıklar:
- **Electron:** Masaüstü uygulaması çerçevesi
- **Electron-Builder:** Installer oluşturma aracı
- **Concurrently:** Paralel komut çalıştırma
- **Wait-on:** URL hazır olduğunda bekleme
- **Next.js & React:** Web uygulaması

### 3. Geliştirme Modunda Test Et

```bash
# Terminal 1: Web sunucusu başlat
npm run web:dev

# Terminal 2: Electron uygulamasını başlat
npm run electron-dev
```

Veya her ikisini birlikte:
```bash
npm run desktop:dev
```

### 4. Masaüstü Uygulamasını Derle

#### Seçenek A: NSIS Installer + Taşınabilir EXE
```bash
npm run desktop:build
```

Bu komut:
1. Next.js uygulamasını derler (`next build`)
2. Statik dosyaları çıktı klasörüne aktarır
3. Electron-Builder ile Windows installerı oluşturur
4. İki dosya üretir:
   - `dist/DDoS-BSO-Tespiti-1.0.0.exe` (NSIS Installer)
   - `dist/DDoS-BSO-Tespiti-1.0.0.exe` (Taşınabilir)

#### Seçenek B: Yalnızca Taşınabilir EXE
```bash
npm run electron-build
```

### 5. Derleme Çıktıları

Başarılı derleme sonrası `dist/` klasöründe:

```
dist/
├── DDoS-BSO-Tespiti-1.0.0.exe         # NSIS Kurulum Sihirbazı
├── DDoS-BSO-Tespiti-1.0.0.exe         # Taşınabilir Sürüm
├── builder-effective-config.yaml      # Derleme Konfigürasyonu
└── win-unpacked/                      # Derlenmiş uygulama dosyaları
```

## 📦 Kurulum Yöntemleri

### Yöntem 1: NSIS Installer (Önerilen)

1. `dist/` klasöründen `DDoS-BSO-Tespiti-1.0.0.exe` çalıştırın
2. Kurulum Sihirbazını izleyin:
   - Dil seçin
   - Kurulum dizinini belirleyin
   - Masaüstü kısayolu oluşturmayı seçin
   - Başlat Menüsü girdisi oluşturmayı seçin
3. Kurulumu tamamlayın
4. Uygulamayı Başlat Menüsünden çalıştırın

### Yöntem 2: Taşınabilir Sürüm

1. Yüksek Privilege ile `DDoS-BSO-Tespiti-1.0.0.exe` çalıştırın
2. Uygulama hemen kullanılmaya başlayabilir
3. Hiçbir kurulum gerekli değildir

### Yöntem 3: Kaynak Kodundan Doğrudan Çalıştırma

```bash
npm run desktop:dev
```

## 🔍 Derleme Sorun Giderme

### Hata: "electron-builder" bulunamadı

```bash
npm install --save-dev electron-builder
npm run desktop:build
```

### Hata: Port 3000 zaten kullanımda

```bash
# Windows'ta port'u kontrol et
Get-NetTCPConnection -LocalPort 3000

# Süreci sonlandır
Stop-Process -Id [PID] -Force

# Veya farklı port kullan
set PORT=3001
npm run web:dev

# electron.js'de NEXT_URL'i güncelle
```

### Hata: "Next.js kurulum başarısız"

```bash
# Cache'i temizle
rimraf .next
rimraf node_modules
npm install

# Yeniden derle
npm run desktop:build
```

### Hata: Simge dosyası bulunamadı

```bash
# Simgeleri yeniden oluştur
python scripts/create_icons.py

# Veya web'den indir ve public/ klasörüne kaydet
```

## 📊 Derleme İstatistikleri

Örnek derleme çıktıları:

```
✓ Web uygulaması derlenmiş
  - Optimizasyon: İstatik halı oluşturma tamamlandı
  - Performans: ~3MB paket boyutu

✓ Electron paketi oluşturulmuş
  - Boyut: ~150-200MB (tüm bağımlılıklar dahil)
  - Sıkıştırma: NSIS otomatik sıkıştırması

✓ Installer oluşturulmuş
  - Dosya: DDoS-BSO-Tespiti-1.0.0.exe
  - Boyut: ~100-150MB
  - Kurulum süresi: ~2-5 dakika (ağ hızına bağlı)
```

## 🚀 Dağıtım Seçenekleri

### Windows Registry Kayıt Defteri

Installer otomatik olarak aşağıdaları ekler:
```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\DDoS-BSO Tespiti
```

### Başlat Menüsü

`C:\ProgramData\Microsoft\Windows\Start Menu\Programs\DDoS-BSO Tespiti\`

### Masaüstü Kısayolu

`C:\Users\[Kullanıcı]\Desktop\DDoS-BSO Tespiti.lnk`

## 🔐 İmzalama (İsteğe Bağlı)

Kod imzalamak için:

```bash
# Sertifika oluştur
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365

# package.json'a ekle
{
  "build": {
    "win": {
      "certificateFile": "cert.pem",
      "certificatePassword": "password"
    }
  }
}
```

## 📝 Otomasyonlar

### GitHub Actions Kurulumu (isteğe bağlı)

`.github/workflows/electron-build.yml`:

```yaml
name: Electron Build
on: [push, pull_request]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run desktop:build
      - uses: actions/upload-artifact@v3
        with:
          name: installers
          path: dist/*.exe
```

## 💾 Sürüm Güncelleme

Yeni sürüm için:

```bash
# package.json'da sürümü güncelle
"version": "1.0.1"

# Yeniden derle
npm run desktop:build
```

Yeni dosya: `dist/DDoS-BSO-Tespiti-1.0.1.exe`

## ✅ Derleme Kontrol Listesi

Üretime göndermeden önce:

- [ ] Node.js ve npm kurulu
- [ ] `npm install` başarıyla tamamlandı
- [ ] `npm run web:dev` çalışıyor
- [ ] `npm run desktop:dev` Electron'u açıyor
- [ ] Tüm özellikler test edildi
- [ ] Hiçbir hata konsol'da gösterilmiyor
- [ ] Derleme: `npm run desktop:build` başarılı
- [ ] Installer çalışıyor ve başarıyla yüklenebiliyor
- [ ] Uygulamayı Başlat Menüsünden başlatabiliyoruz
- [ ] Masaüstü kısayolu çalışıyor

---

**Destek:** Sorun yaşanırsa DESKTOP_APP_GUIDE_TR.md dosyasına bakın.
