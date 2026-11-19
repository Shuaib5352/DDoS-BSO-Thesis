# CICIoT2023 üzerinde BSO-RF ile DDoS tespiti

**SHUAIB AYAD JASIM JASIM** · Yüksek lisans tezi araştırma deposu

CICIoT2023 örneklemindeki beş trafik sınıfı, Yarasa Sürüsü Optimizasyonu (BSO) ile öznitelik seçimi ve hiperparametre araması yapılan bir Random Forest ile sınıflandırılır.

| Model | Öznitelik | Doğruluk | Makro-F1 | Ağırlıklı F1 | MCC | Ağırlıklı OvR ROC-AUC |
|---|---:|---:|---:|---:|---:|---:|
| BSO-RF | 23 | 87.51% | 82.49% | 87.59% | 0.8382 | 97.70% |
| Tuned RF-All39 | 39 | 87.37% | 81.97% | 87.46% | 0.8363 | 97.67% |

RF-All39 uses the BSO-selected RF hyperparameters with all 39 inputs. BSO-RF reduces inputs by 41.03%. The point estimates describe a compactness–performance trade-off on the frozen test partition.

## Değerlendirme protokolü

1. SHA-256 özetleriyle 103.218 ham satır, tam öznitelik eşleşmesine göre gruplandı.
2. Tohum 42 ile grup duyarlı bölümleme yapıldı. Eğitim 72.252, doğrulama 10.322 ve test 20.644 satır içerir. Bölümler arasında tam satır örtüşmesi sıfırdır.
3. Medyan atama, sabit öznitelik taraması ve ölçekleme eğitim üzerinde uyarlandı. SMOTE yalnızca eğitimde uygulandı.
4. BSO eğitim ve doğrulama ile 23 öznitelik ve RF ayarlarını seçti. Dondurulan model, saklı test bölümünde değerlendirildi.

RF: 237 ağaç, maksimum derinlik 28, min_samples_split 8 ve max_features 0.50812. Bulgular veri kümesi içindeki tam satır gruplu değerlendirmeyle sınırlıdır.

## Çalıştırma ve kanıt dosyaları

`npm ci` ve `npm run dev` ile güncel sonuç panosunu açın. Pano, [kaydedilmiş sonuçlardan](reproducibility/) beslenir.

[Deney kodu](reproducibility/scripts/run_sealed.py), [ayrım denetimi](reproducibility/group_split.json), [sınıf metrikleri](reproducibility/per_class_metrics.csv), [kaynak profili](reproducibility/resource_comparison.csv) ve [ortam kaydı](reproducibility/environment.json) depoda yer alır. Eğitimi bağımsız olarak tekrarlamak için orijinal `sampled_numeric_data.npz` gerekir. Arşiv sonuçlarını korumak için çalıştırma çıktısını ayrı bir çalışma kopyasında üretin.

`docs/`, `scripts/` ve önceki pano bileşenleri tarihsel prototip kaynaklarıdır. Tez için güncel veri kaynağı `reproducibility/` dizinidir.
