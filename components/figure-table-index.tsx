"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    BookOpen, BarChart3, Table2, Search, Copy, Check,
    FileText, Layers, Target, Grid3X3, FlaskConical,
    TrendingUp, Activity, Eye, GitCompare, Shuffle,
    BarChart2, AlertTriangle, Gauge, Info, Library,
} from "lucide-react"

/* ═══════════════════════════════════════════════════════════════
   Academic Figure & Table Registry
   Numbering follows standard thesis convention:
   - Canonical: thesis-figures.tsx (Şekil 1.1–4.8)
   - Canonical: thesis-tables.tsx  (Tablo 1.1–A.4)
   - Interactive: extends from Şekil 4.9+
   ═══════════════════════════════════════════════════════════════ */

interface FigureEntry {
    id: string
    chapter: number | string
    number: string
    title: string
    titleEn: string
    type: "figure" | "table"
    source: "canonical" | "interactive"
    tab: string
    tabLabel: string
    component: string
    description: string
}

const FIGURE_REGISTRY: FigureEntry[] = [
    // ═══ BÖLÜM 1 — GİRİŞ ═══
    { id: "s1.1", chapter: 1, number: "Şekil 1.1", title: "DDoS Saldırı Türlerinin Taksonomisi", titleEn: "Taxonomy of DDoS Attack Types", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Volumetrik, protokol ve uygulama katmanı saldırı sınıflandırması" },
    { id: "s1.2", chapter: 1, number: "Şekil 1.2", title: "IoT Ağ Mimarisi ve DDoS Saldırı Vektörleri", titleEn: "IoT Network Architecture and DDoS Attack Vectors", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "IoT cihaz katmanları ve saldırı yüzeyleri" },
    { id: "s1.3", chapter: 1, number: "Şekil 1.3", title: "ML Tabanlı Ağ Saldırı Tespit Sistemi Genel Yapısı", titleEn: "General Architecture of ML-Based Network IDS", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Veri toplama → Ön işleme → Öznitelik seçimi → Sınıflandırma" },

    // ═══ BÖLÜM 2 — LİTERATÜR ═══
    { id: "s2.1", chapter: 2, number: "Şekil 2.1", title: "Meta-Sezgisel Optimizasyon Algoritmalarının Sınıflandırması", titleEn: "Classification of Metaheuristic Optimization Algorithms", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Evrimsel, sürü zekası ve fizik tabanlı yöntemler" },
    { id: "s2.2", chapter: 2, number: "Şekil 2.2", title: "Yarasa Algoritmasının Biyolojik İlham Kaynağı", titleEn: "Biological Inspiration of Bat Algorithm — Echolocation", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Ekolokasyon mekanizması ve BSO parametreleri" },
    { id: "s2.3", chapter: 2, number: "Şekil 2.3", title: "İlgili Çalışmaların Karşılaştırmalı Analizi", titleEn: "Comparative Analysis of Related Works", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Mevcut çalışmalar vs önerilen yöntem" },

    // ═══ BÖLÜM 3 — YÖNTEM ═══
    { id: "s3.1", chapter: 3, number: "Şekil 3.1", title: "Önerilen BSO-Hybrid RF Sistem Mimarisi", titleEn: "Proposed BSO-Hybrid RF System Architecture", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "6 aşamalı ardışık düzen: veri → ön işleme → BSO → seçim → eğitim → değerlendirme" },
    { id: "s3.2", chapter: 3, number: "Şekil 3.2", title: "BSO Algoritması Sözde Kodu ve Akış Diyagramı", titleEn: "BSO Algorithm Pseudocode and Flowchart", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Başlatma → Frekans → Hız → Konum → Darbe → Ses güncellemesi" },
    { id: "s3.3", chapter: 3, number: "Şekil 3.3", title: "BSO Çözüm Vektörü Kodlama Yapısı", titleEn: "BSO Solution Vector Encoding Structure", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "39 boyutlu ikili vektör → seçilen öznitelikler" },
    { id: "s3.4", chapter: 3, number: "Şekil 3.4", title: "SMOTE Aşırı Örnekleme Süreci", titleEn: "SMOTE Oversampling Process", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Azınlık sınıfları için sentetik örnek üretimi" },
    { id: "s3.5", chapter: 3, number: "Şekil 3.5", title: "10-Katlı Tabakalı Çapraz Doğrulama Diyagramı", titleEn: "10-Fold Stratified Cross-Validation Diagram", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Her katta SMOTE → eğitim → doğrulama" },
    { id: "s3.6", chapter: 3, number: "Şekil 3.6", title: "S1–S4 Deney Senaryoları Tasarımı", titleEn: "S1–S4 Experiment Scenario Design", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Ablasyon senaryoları: SMOTE ±, BSO ±, RF ±" },

    // ═══ BÖLÜM 4 — BULGULAR (Canonical) ═══
    { id: "s4.1", chapter: 4, number: "Şekil 4.1", title: "CICIoT2023 Veri Seti Sınıf Dağılımı", titleEn: "CICIoT2023 Dataset Class Distribution", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "5 sınıf: Backdoor, Benign, ACK, SYN, PortScan" },
    { id: "s4.2", chapter: 4, number: "Şekil 4.2", title: "BSO Yakınsama Eğrisi (50 İterasyon)", titleEn: "BSO Convergence Curve (50 Iterations)", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "4 optimizatörün uygunluk değeri karşılaştırması" },
    { id: "s4.3", chapter: 4, number: "Şekil 4.3", title: "BSO Tarafından Seçilen 19 Özniteliğin Önem Sıralaması", titleEn: "Importance Ranking of 19 BSO-Selected Features", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Gini impürite tabanlı öznitelik önemi" },
    { id: "s4.4", chapter: 4, number: "Şekil 4.4", title: "12 Model Performans Karşılaştırması", titleEn: "12-Model Performance Comparison (Accuracy & F1-Macro)", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Doğruluk ve F1-Macro gruplu çubuk grafik" },
    { id: "s4.5", chapter: 4, number: "Şekil 4.5", title: "BSO-Hybrid RF Karışıklık Matrisi Isı Haritası", titleEn: "BSO-Hybrid RF Confusion Matrix Heatmap", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "5×5 normalize edilmiş karışıklık matrisi" },
    { id: "s4.6", chapter: 4, number: "Şekil 4.6", title: "ROC Eğrileri — BSO-Hybrid RF ve Seçili Modeller", titleEn: "ROC Curves — BSO-Hybrid RF and Selected Models", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "6 model için makro-ortalama ROC eğrisi" },
    { id: "s4.7", chapter: 4, number: "Şekil 4.7", title: "S1–S4 Ablasyon Çalışması Sonuçları", titleEn: "S1–S4 Ablation Study Results", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Her bileşenin katkı analizi" },
    { id: "s4.8", chapter: 4, number: "Şekil 4.8", title: "10-Katlı Çapraz Doğrulama Sonuçları", titleEn: "10-Fold Cross-Validation Results", type: "figure", source: "canonical", tab: "figures", tabLabel: "Tez Şekilleri", component: "thesis-figures.tsx", description: "Katlama bazlı doğruluk ve F1 değerleri" },

    // ═══ BÖLÜM 4 — BULGULAR (Interactive — Şekil 4.9+) ═══
    { id: "s4.9", chapter: 4, number: "Şekil 4.9", title: "Sınıf Bazlı Performans Çubuk Grafiği — BSO-Hibrit RF", titleEn: "Per-Class Performance Bar Chart — BSO-Hybrid RF", type: "figure", source: "interactive", tab: "journal-charts", tabLabel: "Yayın Şekilleri", component: "journal-publication-charts.tsx", description: "5 sınıf × Kesinlik/Duyarlılık/F1" },
    { id: "s4.10", chapter: 4, number: "Şekil 4.10", title: "Hesaplama Verimliliği — Eğitim Süresi Karşılaştırması", titleEn: "Computational Efficiency — Training Time Comparison", type: "figure", source: "interactive", tab: "journal-charts", tabLabel: "Yayın Şekilleri", component: "journal-publication-charts.tsx", description: "12 model eğitim süreleri (saniye)" },
    { id: "s4.11", chapter: 4, number: "Şekil 4.11", title: "Öznitelik Sayısı vs Doğruluk Dağılım Grafiği", titleEn: "Features vs Accuracy Scatter Plot", type: "figure", source: "interactive", tab: "journal-charts", tabLabel: "Yayın Şekilleri", component: "journal-publication-charts.tsx", description: "12 model — daire boyutu = eğitim süresi" },
    { id: "s4.12", chapter: 4, number: "Şekil 4.12", title: "Çok Metrikli Model Karşılaştırması — Radar Grafiği", titleEn: "Multi-Metric Model Comparison — Radar Chart", type: "figure", source: "interactive", tab: "journal-charts", tabLabel: "Yayın Şekilleri", component: "journal-publication-charts.tsx", description: "6 model × 6 metrik (doğruluk, kesinlik, duyarlılık, F1, AUC, MCC)" },
    { id: "s4.13", chapter: 4, number: "Şekil 4.13", title: "10-Katlı CV Ortalama Doğruluk Karşılaştırması", titleEn: "10-Fold CV Mean Accuracy Comparison", type: "figure", source: "interactive", tab: "journal-charts", tabLabel: "Yayın Şekilleri", component: "journal-publication-charts.tsx", description: "12 modelin CV ortalama doğrulukları" },
    { id: "s4.14", chapter: 4, number: "Şekil 4.14", title: "Sınıf Bazlı ROC Eğrileri (One-vs-Rest)", titleEn: "Per-Class ROC Curves (One-vs-Rest)", type: "figure", source: "interactive", tab: "roc-curves", tabLabel: "ROC Eğrileri", component: "per-class-roc-curves.tsx", description: "6 model × 5 sınıf ROC eğrisi + AUC değerleri" },
    { id: "s4.15", chapter: 4, number: "Şekil 4.15", title: "Kesinlik-Duyarlılık Eğrileri (Precision-Recall)", titleEn: "Precision-Recall Curves", type: "figure", source: "interactive", tab: "pr-curves", tabLabel: "PR Eğrileri", component: "precision-recall-curves.tsx", description: "6 model × 5 sınıf + mikro-ortalama PR eğrisi" },
    { id: "s4.16", chapter: 4, number: "Şekil 4.16", title: "t-SNE 2D Boyut İndirgeme Görselleştirmesi", titleEn: "t-SNE 2D Dimensionality Reduction Visualization", type: "figure", source: "interactive", tab: "tsne", tabLabel: "t-SNE", component: "tsne-visualization.tsx", description: "5000 nokta, 19 BSO öznitelik, perplexity 30/50" },
    { id: "s4.17", chapter: 4, number: "Şekil 4.17", title: "Karışıklık Matrisi Isı Haritası — İnteraktif", titleEn: "Confusion Matrix Heatmap — Interactive", type: "figure", source: "interactive", tab: "heatmap", tabLabel: "Karışıklık Matrisi", component: "confusion-matrix-heatmap.tsx", description: "12 model seçici ile 5×5 karışıklık matrisi" },
    { id: "s4.18", chapter: 4, number: "Şekil 4.18", title: "4 Optimizatör Yakınsama Eğrisi Karşılaştırması", titleEn: "4-Optimizer Convergence Curve Comparison", type: "figure", source: "interactive", tab: "convergence", tabLabel: "Yakınsama", component: "optimizer-convergence-comparison.tsx", description: "BSO/PSO/GA/GWO uygunluk değeri × iterasyon" },
    { id: "s4.19", chapter: 4, number: "Şekil 4.19", title: "Ablasyon Çalışması — Doğruluk ve F1 Çubuk Grafiği", titleEn: "Ablation Study — Accuracy and F1 Bar Chart", type: "figure", source: "interactive", tab: "ablation", tabLabel: "Ablasyon", component: "ablation-study.tsx", description: "S1–S4 + SMOTE varyantları performans karşılaştırması" },
    { id: "s4.20", chapter: 4, number: "Şekil 4.20", title: "Gürültü Dayanıklılık Analizi", titleEn: "Noise Robustness Analysis", type: "figure", source: "interactive", tab: "concept-drift", tabLabel: "Dinamik Ortam", component: "concept-drift-simulation.tsx", description: "Gauss gürültü seviyesi vs doğruluk/F1 degradasyon" },
    { id: "s4.21", chapter: 4, number: "Şekil 4.21", title: "Bilinmeyen Saldırı Türü Tespiti", titleEn: "Unknown Attack Type Detection", type: "figure", source: "interactive", tab: "concept-drift", tabLabel: "Dinamik Ortam", component: "concept-drift-simulation.tsx", description: "Leave-One-Class-Out genelleme oranları" },
    { id: "s4.22", chapter: 4, number: "Şekil 4.22", title: "İşlem Hacmi ve Öğrenme Eğrisi", titleEn: "Throughput and Learning Curve", type: "figure", source: "interactive", tab: "concept-drift", tabLabel: "Dinamik Ortam", component: "concept-drift-simulation.tsx", description: "Parti boyutu vs hız; eğitim boyutu vs doğruluk" },
    { id: "s4.23", chapter: 4, number: "Şekil 4.23", title: "10-Katlı CV Katlama Bazlı Sonuçlar", titleEn: "10-Fold CV Per-Fold Results", type: "figure", source: "interactive", tab: "statistics", tabLabel: "İstatistiksel Testler", component: "statistical-significance.tsx", description: "4 metrik (doğruluk/kesinlik/duyarlılık/F1) × 10 katlama" },
    { id: "s4.24", chapter: 4, number: "Şekil 4.24", title: "Hata Oranı Sınıf Bazlı Analiz", titleEn: "Error Rate Per-Class Analysis", type: "figure", source: "interactive", tab: "errors", tabLabel: "Hata Analizi", component: "error-misclassification-analysis.tsx", description: "FPR vs FNR sınıf bazlı karşılaştırma" },
    { id: "s4.25", chapter: 4, number: "Şekil 4.25", title: "Öznitelik Önem Sıralaması — 39 Öznitelik", titleEn: "Feature Importance Ranking — 39 Features", type: "figure", source: "interactive", tab: "features", tabLabel: "Öznitelik Önemi", component: "feature-importance-analysis.tsx", description: "Tüm özniteliklerin Gini impürite sıralaması" },
    { id: "s4.26", chapter: 4, number: "Şekil 4.26", title: "Model Sıralaması — Bileşik Skor", titleEn: "Model Ranking — Composite Score", type: "figure", source: "interactive", tab: "ranking", tabLabel: "Model Sıralaması", component: "model-ranking-dashboard.tsx", description: "12 model çok metrikli bileşik puan sıralaması" },

    // ═══ BÖLÜM 3 — YÖNTEM (Interactive) ═══
    { id: "s3.7", chapter: 3, number: "Şekil 3.7", title: "BSO Yakınsama Eğrisi — Detaylı İnteraktif", titleEn: "BSO Convergence Curve — Detailed Interactive", type: "figure", source: "interactive", tab: "bso", tabLabel: "BSO Optimizasyonu", component: "bso-visualization.tsx", description: "En iyi/ortalama uygunluk + çeşitlilik eğrisi" },
    { id: "s3.8", chapter: 3, number: "Şekil 3.8", title: "BSO Yarasa Sürüsü Son Pozisyonları", titleEn: "BSO Bat Swarm Final Positions", type: "figure", source: "interactive", tab: "bso", tabLabel: "BSO Optimizasyonu", component: "bso-visualization.tsx", description: "2D projeksiyon — her yarasa bir çözüm noktası" },
    { id: "s3.9", chapter: 3, number: "Şekil 3.9", title: "SMOTE Öncesi/Sonrası Sınıf Dağılımı", titleEn: "Class Distribution Before/After SMOTE", type: "figure", source: "interactive", tab: "dataset-eda", tabLabel: "Veri Keşfi", component: "dataset-eda.tsx", description: "Dengesiz → dengeli sınıf dönüşümü" },
    { id: "s3.10", chapter: 3, number: "Şekil 3.10", title: "Sistem Mimarisi Diyagramı — Büyük", titleEn: "System Architecture Diagram — Large", type: "figure", source: "interactive", tab: "architecture", tabLabel: "Sistem Mimarisi", component: "system-architecture-diagram.tsx", description: "6 aşamalı tam sistem diyagramı (indirilebilir)" },
]

const TABLE_REGISTRY: FigureEntry[] = [
    // ═══ BÖLÜM 1 ═══
    { id: "t1.1", chapter: 1, number: "Tablo 1.1", title: "DDoS Saldırı Tespitinde Mevcut Araştırma Problemleri", titleEn: "Current Research Problems in DDoS Attack Detection", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Problemler ve önerilen çözümler" },
    { id: "t1.2", chapter: 1, number: "Tablo 1.2", title: "Araştırma Hedefleri ve Araştırma Soruları", titleEn: "Research Objectives and Research Questions", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Hedefler, sorular ve ulaşılan sonuçlar" },
    { id: "t1.3", chapter: 1, number: "Tablo 1.3", title: "Bilimsel ve Pratik Katkılar", titleEn: "Scientific and Practical Contributions", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Bu tezin katkıları" },
    { id: "t1.4", chapter: 1, number: "Tablo 1.4", title: "Tez Organizasyonu ve Bölüm İçerikleri", titleEn: "Thesis Organization and Chapter Contents", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "5 bölüm yapısı" },

    // ═══ BÖLÜM 2 ═══
    { id: "t2.1", chapter: 2, number: "Tablo 2.1", title: "CICIoT2023 Trafik Sınıfları ve Örneklem Dağılımları", titleEn: "CICIoT2023 Traffic Classes and Sample Distribution", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "5 sınıf detaylı bilgileri" },
    { id: "t2.2", chapter: 2, number: "Tablo 2.2", title: "Referans Veri Setlerinin Karşılaştırması", titleEn: "Comparison of Benchmark Datasets", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "CICIoT2023 vs diğer veri setleri" },
    { id: "t2.3", chapter: 2, number: "Tablo 2.3", title: "Güncel Çalışmalar ile Karşılaştırma", titleEn: "Comparison with Recent Studies", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Önerilen yöntem vs mevcut çalışmalar" },
    { id: "t2.4", chapter: 2, number: "Tablo 2.4", title: "Metasezgisel Algoritmaların Karşılaştırması", titleEn: "Comparison of Metaheuristic Algorithms", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "BSO, PSO, GA, GWO" },
    { id: "t2.5", chapter: 2, number: "Tablo 2.5", title: "5 Sınıf Seçiminin Bilimsel Gerekçesi", titleEn: "Scientific Justification for 5-Class Selection", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Neden 5 sınıf seçildi" },

    // ═══ BÖLÜM 3 ═══
    { id: "t3.1", chapter: 3, number: "Tablo 3.1", title: "CICIoT2023 Veri Seti Genel İstatistikleri", titleEn: "CICIoT2023 Dataset General Statistics", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "103.218 örnek, 39 öznitelik, 5 sınıf" },
    { id: "t3.2", chapter: 3, number: "Tablo 3.2", title: "Veri Ön İşleme Pipeline Adımları", titleEn: "Data Preprocessing Pipeline Steps", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "7 adımlık ön işleme süreci" },
    { id: "t3.3", chapter: 3, number: "Tablo 3.3", title: "BSO ile Seçilen 19 Öznitelik", titleEn: "19 Features Selected by BSO", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Öznitelik adı, önem değeri, kategori" },
    { id: "t3.4", chapter: 3, number: "Tablo 3.4", title: "BSO Algoritması Parametreleri", titleEn: "BSO Algorithm Parameters", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Pop=25, İter=50, α=0.9, γ=0.9" },
    { id: "t3.5", chapter: 3, number: "Tablo 3.5", title: "BSO ile Optimize Edilen RF Hiperparametreleri", titleEn: "RF Hyperparameters Optimized by BSO", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "n_estimators, max_depth, vb." },
    { id: "t3.6", chapter: 3, number: "Tablo 3.6", title: "BSO-Hibrit RF Çerçeve Ardışık Düzeni", titleEn: "BSO-Hybrid RF Framework Pipeline", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Aşama bazlı veri akışı" },

    // ═══ BÖLÜM 4 ═══
    { id: "t4.1", chapter: 4, number: "Tablo 4.1", title: "Deneysel Ortam Yapılandırması", titleEn: "Experimental Environment Configuration", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Donanım ve yazılım özellikleri" },
    { id: "t4.2", chapter: 4, number: "Tablo 4.2", title: "BSO-Hibrit RF Sınıf Bazlı Sınıflandırma Raporu", titleEn: "BSO-Hybrid RF Per-Class Classification Report", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "5 sınıf × kesinlik/duyarlılık/F1/destek" },
    { id: "t4.3", chapter: 4, number: "Tablo 4.3", title: "BSO-Hibrit RF Karışıklık Matrisi", titleEn: "BSO-Hybrid RF Confusion Matrix", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "5×5 sınıflandırma sonuçları" },
    { id: "t4.4", chapter: 4, number: "Tablo 4.4", title: "Tüm Modellerin Performans Karşılaştırması", titleEn: "All Models Performance Comparison", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "12 model × 10 metrik" },
    { id: "t4.5", chapter: 4, number: "Tablo 4.5", title: "Metasezgisel Hibrit Modellerin Karşılaştırması", titleEn: "Metaheuristic Hybrid Models Comparison", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "BSO/PSO/GA/GWO-RF" },
    { id: "t4.6", chapter: 4, number: "Tablo 4.6", title: "10-Katlı CV Sonuçları — BSO-Hibrit RF", titleEn: "10-Fold CV Results — BSO-Hybrid RF", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "10 katlama × 4 metrik" },
    { id: "t4.7", chapter: 4, number: "Tablo 4.7", title: "Hesaplama Verimliliği Karşılaştırması", titleEn: "Computational Efficiency Comparison", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Eğitim ve tahmin süreleri" },
    { id: "t4.8", chapter: 4, number: "Tablo 4.8", title: "Gürültü Dayanıklılık Analizi", titleEn: "Noise Robustness Analysis", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "7 gürültü seviyesi × doğruluk/F1" },
    { id: "t4.9", chapter: 4, number: "Tablo 4.9", title: "İstatistiksel Anlamlılık Testleri", titleEn: "Statistical Significance Tests", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "11 ikili karşılaştırma (t, p, d, Wilcoxon)" },
    { id: "t4.10", chapter: 4, number: "Tablo 4.10", title: "İşlem Hacmi Analizi", titleEn: "Throughput Analysis", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Parti boyutu vs hız" },
    { id: "t4.11", chapter: 4, number: "Tablo 4.11", title: "Bilinmeyen Saldırı Türü Tespiti", titleEn: "Unknown Attack Type Detection", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Leave-One-Class-Out sonuçları" },
    { id: "t4.12", chapter: 4, number: "Tablo 4.12", title: "Öznitelik Verimliliği Analizi", titleEn: "Feature Efficiency Analysis", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Kaynak verimliliği perspektifi" },
    { id: "t4.13", chapter: 4, number: "Tablo 4.13", title: "AP Karşılaştırması — 6 Model × 6 Sınıf", titleEn: "AP Comparison — 6 Models × 6 Classes", type: "table", source: "interactive", tab: "pr-curves", tabLabel: "PR Eğrileri", component: "precision-recall-curves.tsx", description: "Average Precision değerleri karşılaştırması" },
    { id: "t4.14", chapter: 4, number: "Tablo 4.14", title: "Tekrarlanabilirlik Bilgileri", titleEn: "Reproducibility Information", type: "table", source: "interactive", tab: "journal-charts", tabLabel: "Yayın Şekilleri", component: "journal-publication-charts.tsx", description: "Donanım, yazılım, parametre detayları" },

    // ═══ BÖLÜM 5 ═══
    { id: "t5.1", chapter: 5, number: "Tablo 5.1", title: "Araştırma Hedeflerinin Gerçekleşme Durumu", titleEn: "Research Objectives Achievement Status", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Hedef bazlı kanıt ve sonuçlar" },
    { id: "t5.2", chapter: 5, number: "Tablo 5.2", title: "Gelecek Çalışma Önerileri", titleEn: "Future Work Recommendations", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Gerekçe ve beklenen etki" },
    { id: "t5.3", chapter: 5, number: "Tablo 5.3", title: "Araştırma Sınırlılıkları", titleEn: "Research Limitations", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Sınırlılıklar ve alınan önlemler" },

    // ═══ EKLER ═══
    { id: "tA.1", chapter: "A", number: "Tablo A.1", title: "CICIoT2023 Tam Öznitelik Listesi", titleEn: "CICIoT2023 Full Feature List", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "39 öznitelik × BSO seçim durumu" },
    { id: "tA.2", chapter: "A", number: "Tablo A.2", title: "Öznitelik Seçim Yöntemlerinin Karşılaştırması", titleEn: "Feature Selection Methods Comparison", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "BSO/PSO/GA/GWO detaylı" },
    { id: "tA.3", chapter: "A", number: "Tablo A.3", title: "Optimizatör Yakınsama Performansı", titleEn: "Optimizer Convergence Performance", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "4 optimizatör × 9 metrik" },
    { id: "tA.4", chapter: "A", number: "Tablo A.4", title: "Öğrenme Eğrisi Analizi", titleEn: "Learning Curve Analysis", type: "table", source: "canonical", tab: "tables", tabLabel: "Tez Tabloları", component: "thesis-tables.tsx", description: "Eğitim boyutu vs performans" },
]

/* ═══════════════════════════════════════════════════════════════
   Copy to clipboard helper
   ═══════════════════════════════════════════════════════════════ */
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }
    return (
        <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Kopyala: ${text}`}
        >
            {copied
                ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                : <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />}
        </button>
    )
}

/* ═══════════════════════════════════════════════════════════════
   CHAPTER GROUPING
   ═══════════════════════════════════════════════════════════════ */
const CHAPTER_INFO: Record<string, { label: string; color: string; bg: string }> = {
    "1": { label: "Bölüm 1 · Giriş", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40" },
    "2": { label: "Bölüm 2 · Literatür", color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/40" },
    "3": { label: "Bölüm 3 · Yöntem", color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/40" },
    "4": { label: "Bölüm 4 · Bulgular ve Değerlendirme", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40" },
    "5": { label: "Bölüm 5 · Sonuç", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40" },
    "A": { label: "Ekler", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40" },
}

/* ═══════════════════════════════════════════════════════════════
   Entry Row Component
   ═══════════════════════════════════════════════════════════════ */
function EntryRow({ entry }: { entry: FigureEntry }) {
    const isFigure = entry.type === "figure"
    return (
        <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            {/* Number badge */}
            <Badge className={`min-w-[80px] justify-center text-[10px] font-mono font-bold border-0 ${isFigure
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                }`}>
                {entry.number}
            </Badge>

            {/* Title & description */}
            <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {entry.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate italic">
                    {entry.titleEn}
                </div>
            </div>

            {/* Source badge */}
            <Badge className={`text-[9px] border-0 ${entry.source === "canonical"
                    ? "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300"
                    : "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300"
                }`}>
                {entry.source === "canonical" ? "Kanonik" : "İnteraktif"}
            </Badge>

            {/* Tab indicator */}
            <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[9px] border-0 min-w-[90px] justify-center">
                📑 {entry.tabLabel}
            </Badge>

            {/* Copy button */}
            <CopyButton text={entry.number} />
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function FigureTableIndex() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    const allEntries = useMemo(() => {
        const sorted = [...FIGURE_REGISTRY, ...TABLE_REGISTRY].sort((a, b) => {
            const chA = String(a.chapter)
            const chB = String(b.chapter)
            if (chA !== chB) {
                if (chA === "A") return 1
                if (chB === "A") return -1
                return Number(chA) - Number(chB)
            }
            // Within same chapter, sort by number
            return a.number.localeCompare(b.number, "tr", { numeric: true })
        })
        return sorted
    }, [])

    const filtered = useMemo(() => {
        let entries = allEntries
        if (activeTab === "figures") entries = entries.filter(e => e.type === "figure")
        else if (activeTab === "tables") entries = entries.filter(e => e.type === "table")
        else if (activeTab === "canonical") entries = entries.filter(e => e.source === "canonical")
        else if (activeTab === "interactive") entries = entries.filter(e => e.source === "interactive")

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            entries = entries.filter(e =>
                e.number.toLowerCase().includes(q) ||
                e.title.toLowerCase().includes(q) ||
                e.titleEn.toLowerCase().includes(q) ||
                e.description.toLowerCase().includes(q) ||
                e.tabLabel.toLowerCase().includes(q)
            )
        }
        return entries
    }, [allEntries, activeTab, searchQuery])

    // Group by chapter
    const grouped = useMemo(() => {
        const groups: Record<string, FigureEntry[]> = {}
        for (const e of filtered) {
            const ch = String(e.chapter)
            if (!groups[ch]) groups[ch] = []
            groups[ch].push(e)
        }
        return groups
    }, [filtered])

    const totalFigures = FIGURE_REGISTRY.length
    const totalTables = TABLE_REGISTRY.length

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-0 overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900" />
                <CardContent className="relative pt-6 pb-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Şekil ve Tablo Dizini
                        </h2>
                        <p className="text-xs text-white/80 max-w-2xl mx-auto">
                            Tezdeki tüm şekil ve tabloların akademik numaralandırma ile düzenlenmiş tam kataloğu —
                            numara kopyalama ve konum bilgisi ile tez yazımını kolaylaştırır
                        </p>
                        <div className="flex items-center justify-center gap-4 pt-2">
                            <Badge className="bg-blue-500/20 text-blue-200 border-0 text-xs">
                                {totalFigures} Şekil
                            </Badge>
                            <Badge className="bg-emerald-500/20 text-emerald-200 border-0 text-xs">
                                {totalTables} Tablo
                            </Badge>
                            <Badge className="bg-white/10 text-white/80 border-0 text-xs">
                                Toplam {totalFigures + totalTables} Öğe
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search + Filters */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Şekil veya tablo ara... (ör: ROC, BSO, karışıklık)"
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                        </div>

                        {/* Filter tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="h-auto p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl gap-0.5">
                                <TabsTrigger value="all" className="text-[10px] px-3 py-1.5 rounded-lg data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                                    Tümü ({totalFigures + totalTables})
                                </TabsTrigger>
                                <TabsTrigger value="figures" className="text-[10px] px-3 py-1.5 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                                    Şekiller ({totalFigures})
                                </TabsTrigger>
                                <TabsTrigger value="tables" className="text-[10px] px-3 py-1.5 rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                                    Tablolar ({totalTables})
                                </TabsTrigger>
                                <TabsTrigger value="canonical" className="text-[10px] px-3 py-1.5 rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                                    Kanonik
                                </TabsTrigger>
                                <TabsTrigger value="interactive" className="text-[10px] px-3 py-1.5 rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                                    İnteraktif
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            {Object.keys(grouped).length === 0 ? (
                <Card className="border border-slate-200/80 dark:border-slate-700/80">
                    <CardContent className="pt-8 pb-8 text-center text-slate-400 text-sm">
                        Arama kriterlerine uygun öğe bulunamadı.
                    </CardContent>
                </Card>
            ) : (
                Object.entries(grouped).map(([ch, entries]) => {
                    const info = CHAPTER_INFO[ch] || { label: `Bölüm ${ch}`, color: "text-slate-700", bg: "bg-slate-50 border-slate-200" }
                    const figCount = entries.filter(e => e.type === "figure").length
                    const tabCount = entries.filter(e => e.type === "table").length

                    return (
                        <Card key={ch} className={`border ${info.bg} shadow-sm`}>
                            <CardContent className="pt-4 pb-4">
                                {/* Chapter header */}
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className={`text-sm font-bold ${info.color}`}>
                                        {info.label}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {figCount > 0 && (
                                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[10px] border-0">
                                                {figCount} Şekil
                                            </Badge>
                                        )}
                                        {tabCount > 0 && (
                                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 text-[10px] border-0">
                                                {tabCount} Tablo
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Entries */}
                                <div className="space-y-0.5">
                                    {entries.map((entry) => (
                                        <EntryRow key={entry.id} entry={entry} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })
            )}

            {/* LaTeX Reference Helper */}
            <Card className="border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <CardContent className="pt-5 pb-5">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        LaTeX Referans Rehberi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Şekil referansı:</div>
                            <code className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-950/30 px-2 py-1 rounded block">
                                {`\\ref{fig:4.14} → Şekil 4.14`}
                            </code>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Tablo referansı:</div>
                            <code className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded block">
                                {`\\ref{tab:4.9} → Tablo 4.9`}
                            </code>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Şekil başlığı:</div>
                            <code className="text-[10px] text-violet-600 dark:text-violet-400 font-mono bg-violet-50 dark:bg-violet-950/30 px-2 py-1 rounded block">
                                {`\\caption{Sınıf Bazlı ROC Eğrileri}`}
                            </code>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Etiket:</div>
                            <code className="text-[10px] text-rose-600 dark:text-rose-400 font-mono bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded block">
                                {`\\label{fig:roc-per-class}`}
                            </code>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Usage tip */}
            <Card className="border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/50 dark:bg-indigo-950/20">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed">
                            <strong>Kullanım:</strong> Her öğenin yanındaki <Copy className="w-3 h-3 inline" /> simgesine tıklayarak
                            akademik numarayı (ör. &quot;Şekil 4.14&quot;) panoya kopyalayabilirsiniz. <strong>Kanonik</strong> öğeler
                            &quot;Tez Şekilleri&quot; ve &quot;Tez Tabloları&quot; sekmelerindeki yüksek çözünürlüklü SVG/IEEE formatlı
                            versiyonlardır. <strong>İnteraktif</strong> öğeler ilgili analiz sekmelerindeki Recharts görselleştirmeleridir.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
