# 🚀 DDoS-BSO Tespiti - Hızlı Başlangıç İndeksi

## ⚡ 30 Saniye'de Başla

```bash
cd C:\Users\imiss\Desktop\DDoS-BSO-Thesis
npm install
npm run desktop:dev
```

**Bitti!** ✅ Uygulanmış Electron penceresinde açılacaktır.

---

## 📂 Dosya Haritası

### 🎯 **ÖNEMLİ DOSYALAR** (Başla Buradan)

| Dosya | Amaç | Oku Eğer |
|-------|------|----------|
| **DESKTOP_APP_GUIDE_TR.md** | Ana kullanım rehberi | "Nasıl kurarım/çalıştırırım?" |
| **BUILD_GUIDE_TR.md** | Derleme ve yayınlama | "Windows EXE nasıl yapılır?" |
| **ADVANCED_USAGE_TR.md** | İleri teknikler | "Özel özellikler var mı?" |
| **SUMMARY_COMPLETION_TR.md** | Proje tamamlanma özeti | "Neleri bitirdiniz?" |
| **package.json** | Build yapılandırması | "Paket ayarlarını görmek istiyorum" |

### 🔧 **ELECTRON DOSYALARI** (Geliştirici)

| Dosya | Amaç |
|-------|------|
| `public/electron.js` | Ana Electron süreci ve pencereleri yönetir |
| `public/preload.js` | Renderer ile güvenli iletişim |
| `public/sw.js` | Service Worker (PWA & offline) |
| `public/manifest.json` | PWA bilgileri |

### 🎨 **İKONLAR** (Görünüm)

| Dosya | Boyut | Kullanım |
|-------|-------|---------|
| `public/icon.ico` | 256×256 | Windows installer & taskbar |
| `public/icon-192x192.png` | 192×192 | PWA home screen |
| `public/icon-512x512.png` | 512×512 | PWA splash screen |

### 📊 **UYGULAMA DOSYALARI** (Mantık)

| Dizin | İçerik |
|-------|--------|
| `app/` | Next.js sayfa rotaları |
| `components/` | React bileşenleri |
| `lib/` | Yardımcı fonksiyonlar & ML |
| `scripts/` | Python ML algoritmaları |
| `public/` | Statik dosyalar + Electron |

---

## 🎯 Ortak Görevler

### ✅ Görev: "Uygulamayı Hızlı Başlat"

```bash
npm run desktop:dev
```

**Yapması:** 
- Next.js web sunucusu (port 3000)
- Electron masaüstü penceresi
- Otomatik yeniden yükleme

### ✅ Görev: "Windows Installer Oluştur"

```bash
npm run desktop:build
```

**Çıktı:**
- `dist/DDoS-BSO-Tespiti-1.0.0.exe` (NSIS Installer)
- `dist/DDoS-BSO-Tespiti-1.0.0.exe` (Taşınabilir)

### ✅ Görev: "Sadece Web Uygulamasını Çalıştır"

```bash
npm run web:dev
```

**URL:** http://localhost:3000

### ✅ Görev: "Sadece Python Backend'i Çalıştır"

```bash
python scripts/real_experiment.py
```

### ✅ Görev: "Testleri Çalıştır"

```bash
python scripts/test_suite.py
```

### ✅ Görev: "Geliştirici Araçlarını Aç"

Menü → Geliştirici → Geliştirici Araçları Aç

Veya: **Ctrl+Shift+I** (kısayol)

---

## 📖 Rehber Seçim Akış Şeması

```
┌─ "Başlamanın en kolay yolu nedir?" → DESKTOP_APP_GUIDE_TR.md
│
├─ "Nasıl koru/build ederim?" → BUILD_GUIDE_TR.md
│
├─ "Gelişmiş özellikler nelerdir?" → ADVANCED_USAGE_TR.md
│
├─ "Proje özeti" → SUMMARY_COMPLETION_TR.md
│
└─ "Hızlı komut referansı" → Bu dosya (QUICK_START_INDEX_TR.md)
```

---

## 🔗 Komut Referansı

### Geliştirme Komutları

```bash
npm run web:dev          # Sadece Next.js (http://localhost:3000)
npm run electron-dev     # Sadece Electron (Next.js gerekli)
npm run desktop:dev      # İkisi birlikte (önerilen)
```

### Build Komutları

```bash
npm run web:build        # Sadece Next.js derle
npm run desktop:build    # Web + Electron + Installer
```

### Yardımcı Komutları

```bash
npm run web:export       # Statik site oluştur
npm run lint             # Kodu kontrol et
npm install              # Bağımlılıkları yükle
```

---

## 🐛 Yaygın Problemler

### ❌ "Port 3000 kullanımda"

```powershell
# Süreci bul ve sonlandır
Get-NetTCPConnection -LocalPort 3000
Stop-Process -Id [PID] -Force

# Veya sistem başlatılsın
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### ❌ "Electron açılmıyor"

1. Next.js'in çalışıyor mu? → `npm run web:dev`
2. Port 3000 açık mı? → Yukarıya bakın
3. electron.js düzgün mü? → Hataları kontrol et: **F12**

### ❌ "Build başarısız"

```bash
rm -r node_modules
rm package-lock.json
npm install
npm run desktop:build
```

### ❌ "Simgeler gösterilmiyor"

```bash
# Simgeleri yeniden oluştur
python -c "
from PIL import Image;
Image.new('RGB', (256,256), (31,41,55)).save('public/icon.ico')
"
```

---

## 📊 Temel Sistem Bilgileri

### Yazılı Gereksinimler
- Node.js: v18+
- Python: v3.8+
- Windows: 10 veya 11

### Paket Sürümleri
- Electron: 31.0.0
- Next.js: 14.2.35
- React: 19
- TypeScript: 5

### Yüklü Python Modülleri
```
scikit-learn, pandas, numpy, XGBoost, 
imbalanced-learn (SMOTE), matplotlib, scipy
```

---

## 🎓 Proje Yapısı

```
DDoS-BSO-Thesis/
├── public/
│   ├── electron.js           ← Electron ana süreci (ÖNEM: değiştirildi)
│   ├── preload.js            ← Güvenli iletişim (YENİ)
│   ├── sw.js                 ← Service Worker (YENİ)
│   ├── manifest.json         ← PWA config (YENİ)
│   └── icon-*.png/ico        ← Simgeler (YENİ)
├── app/
│   ├── layout.tsx            ← PWA setup (GÜNCELLENDI)
│   └── [sayfalar]/
├── components/               ← React bileşenleri
├── lib/                      ← Fonksiyonlar
├── scripts/
│   ├── real_experiment.py    ← ML algoritması
│   └── test_suite.py         ← Testler
├── package.json              ← GÜNCELLENDI (Electron config)
├── next.config.js
├── tsconfig.json
├── requirements.txt
├── project.config
│
├── DESKTOP_APP_GUIDE_TR.md       ← Kullanım (YENİ)
├── BUILD_GUIDE_TR.md             ← Derleme (YENİ)
├── ADVANCED_USAGE_TR.md          ← İleri (YENİ)
├── SUMMARY_COMPLETION_TR.md      ← Özet (YENİ)
└── QUICK_START_INDEX_TR.md       ← Bu dosya (YENİ)
```

**Lejant:**
- 🆕 YENİ: Electron dönüşümü için eklendi
- ✏️  GÜNCELLENDI: PWA/Desktop ayarları için değiştirildi
- ➡️  DEĞİŞMEDİ: Orijinal korundu

---

## ✅ Denetim Listesi - Hazırlık Tamamla

Tez danışmanına sunmak için:

- [ ] İndir ve Windows'ta kur: `DDoS-BSO-Tespiti-1.0.0.exe`
- [ ] Uygulama açılıyor ✓
- [ ] Tüm menüler Türkçe ✓
- [ ] Veri analizi çalışıyor ✓
- [ ] Model eğitimi işliyor ✓
- [ ] Tahminler çalışıyor ✓
- [ ] Masaüstü kısayolu var ✓
- [ ] Tüm rehberler mevcut ✓

---

## 🔐 Güvenlik Kontrol Listesi

- ✅ Context Isolation: Etkin
- ✅ Sandbox Mode: Etkin
- ✅ Node Integration: Devre dışı
- ✅ Remote Module: Devre dışı
- ✅ Preload Script: Tanımlanmış
- ✅ XSS Koruması: Etkin
- ✅ CSP Headers: Ayarlanmış

---

## 🎯 Sonraki Adımlar

### Hemen:
1. `npm run desktop:dev` çalıştır
2. DESKTOP_APP_GUIDE_TR.md oku
3. Uygulamayı test et

### Derleme:
1. `npm run desktop:build` çalıştır
2. dist/ klasöründen EXE indir
3. Danışmana gönder

### Geliştirme (isteğe bağlı):
1. `public/electron.js` değiştir
2. Yeni özellikler ekle
3. Yeniden build et

---

## 📞 Yardım

| Problem | Çözüm |
|---------|-------|
| Başlangıç hatası | `npm install` çalıştır |
| Port hatası | Süreci sonlandır, retry |
| Build hatası | Cache temizle: `rm .next` |
| Simge hatası | Icons oluştur (yukarıda) |

---

## 📚 Tüm Dökümanlar

| Dosya | Boyut | Amaç |
|-------|-------|------|
| DESKTOP_APP_GUIDE_TR.md | 2.5 KB | 📖 Başlangıç & Kurulum |
| BUILD_GUIDE_TR.md | 3 KB | 🛠️  Derleme & Yayın |
| ADVANCED_USAGE_TR.md | 3.5 KB | 🚀 İleri Kullanım |
| SUMMARY_COMPLETION_TR.md | 2.5 KB | 📊 Proje Özeti |
| QUICK_START_INDEX_TR.md | 2 KB | ⚡ Bu Dosya (Hızlı Ref) |

**Toplam:** ~14 KB Türkçe Dokümantasyon

---

## 🏆 Başarı Göstergeleri

✅ Electron uygulaması kurulu  
✅ PWA manifest yapılandırılmış  
✅ Service Worker etkin  
✅ Windows installer hazır  
✅ Türkçe yerelleştirmesi tamamlandı  
✅ Güvenlik kontrolleri uygulandı  
✅ Kapsamlı dokümantasyon  
✅ Production-ready

---

**Hazır mısın? Başlamak için çalıştır:**

```bash
npm run desktop:dev
```

**İyi çalışmalar! 🚀**

---

**İşletim Sistemi:** Windows 10/11  
**Sürüm:** 1.0.0  
**Durum:** 🟢 Üretim Hazır  
**Tarih:** 2024
