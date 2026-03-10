"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Database, Settings, BarChart3, Zap, CheckCircle2, Copy, Check, ChevronDown, ChevronRight,
    FileText, Table2, Calculator, BookOpen, FlaskConical, Layers, TrendingUp, Target, Brain
} from "lucide-react"
import {
    DATASET_STATISTICS, CICIOT2023_ATTACK_TYPES, BSO_SELECTED_FEATURES, BSO_PARAMETERS,
    MODEL_RESULTS, CROSS_VALIDATION, CICIOT2023_FEATURES, STATISTICAL_TESTS, FEATURE_SELECTION_COMPARISON
} from "@/lib/ciciot2023-dataset"

/* ═══════════════════════════════════════════════════════════════
   BÖLÜM 3 — ARAŞTIRMA YÖNTEMİ (Konsolide Görünüm)
   Tüm şekiller, tablolar, denklemler ve metinler tek sayfada
   ═══════════════════════════════════════════════════════════════ */

// ─── Section navigation ────────────────────────────────────────
const SECTIONS = [
    { id: "overview", label: "3.0 Genel Bakış", icon: BookOpen },
    { id: "dataset", label: "3.1 Veri Seti", icon: Database },
    { id: "preprocess", label: "3.2 Ön İşleme", icon: Settings },
    { id: "bso", label: "3.3 BSO Algoritması", icon: Zap },
    { id: "hybrid", label: "3.4 BSO-Hybrid RF", icon: Brain },
    { id: "experiment", label: "3.5 Deney Tasarımı", icon: FlaskConical },
    { id: "metrics", label: "3.6 Metrikler", icon: Target },
    { id: "all-figures", label: "Tüm Şekiller", icon: FileText },
    { id: "all-tables", label: "Tüm Tablolar", icon: Table2 },
    { id: "all-equations", label: "Tüm Denklemler", icon: Calculator },
]

// ─── Copy helper ──────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <button onClick={handleCopy} className="p-1 hover:bg-gray-200 rounded transition" title="Kopyala">
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
        </button>
    )
}

// ─── Data Row ─────────────────────────────────────────────────
function DataRow({ label, value, copyable = true }: { label: string; value: string; copyable?: boolean }) {
    return (
        <div className="flex items-center justify-between py-1.5 px-3 hover:bg-gray-50 rounded group">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex items-center gap-1.5">
                <span className="text-sm font-mono font-medium">{value}</span>
                {copyable && <span className="opacity-0 group-hover:opacity-100 transition"><CopyButton text={value} /></span>}
            </div>
        </div>
    )
}

// ─── Collapsible Section ──────────────────────────────────────
function CollapsibleSection({ title, badge, defaultOpen = true, children }: {
    title: string; badge?: string; defaultOpen?: boolean; children: React.ReactNode
}) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="border rounded-xl overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex items-center gap-2">
                    {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="font-semibold text-sm">{title}</span>
                </div>
                {badge && <Badge variant="outline" className="text-xs">{badge}</Badge>}
            </button>
            {open && <div className="p-4 border-t bg-white">{children}</div>}
        </div>
    )
}

// ─── Equation Card ────────────────────────────────────────────
function EquationCard({ num, title, latex, usage }: { num: string; title: string; latex: string; usage: string }) {
    return (
        <div className="border rounded-lg p-3 hover:border-purple-300 transition space-y-2">
            <div className="flex items-center gap-2">
                <Badge className="bg-purple-500 text-white text-xs shrink-0">{num}</Badge>
                <span className="text-sm font-medium">{title}</span>
            </div>
            <div className="font-mono text-xs bg-gray-50 rounded px-3 py-2 overflow-x-auto flex items-center justify-between">
                <code>${latex}$</code>
                <CopyButton text={`${num}: $${latex}$`} />
            </div>
            <p className="text-xs text-gray-500"><strong className="text-purple-600">Kullanım:</strong> {usage}</p>
        </div>
    )
}

// ─── Figure Reference Card ────────────────────────────────────
function FigureCard({ num, title, titleEN, desc, component }: {
    num: string; title: string; titleEN: string; desc: string; component: string
}) {
    return (
        <div className="border rounded-lg p-3 hover:border-blue-300 transition">
            <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-blue-500 text-white text-xs shrink-0">{num}</Badge>
                <span className="text-sm font-medium">{title}</span>
                <CopyButton text={num} />
            </div>
            <p className="text-xs text-gray-500 italic">{titleEN}</p>
            <p className="text-xs text-gray-600 mt-1">{desc}</p>
            <p className="text-xs text-gray-400 mt-1">Kaynak: <code className="bg-gray-100 px-1 rounded">{component}</code></p>
        </div>
    )
}

// ─── Table Reference Card ─────────────────────────────────────
function TableCard({ num, title, titleEN, desc }: {
    num: string; title: string; titleEN: string; desc: string
}) {
    return (
        <div className="border rounded-lg p-3 hover:border-emerald-300 transition">
            <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-500 text-white text-xs shrink-0">{num}</Badge>
                <span className="text-sm font-medium">{title}</span>
                <CopyButton text={num} />
            </div>
            <p className="text-xs text-gray-500 italic">{titleEN}</p>
            <p className="text-xs text-gray-600 mt-1">{desc}</p>
        </div>
    )
}

const bso = MODEL_RESULTS[0]
const xgb = MODEL_RESULTS.find(m => m.name === "XGBoost")!
const dt = MODEL_RESULTS.find(m => m.name === "Decision Tree")!
const rf = MODEL_RESULTS.find(m => m.name === "Random Forest (Default)")!

export default function Chapter3Consolidated() {
    const [activeSection, setActiveSection] = useState("overview")

    return (
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/30 to-purple-50/20">
            <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                        Bölüm 3 — Araştırma Yöntemi (Konsolide)
                    </CardTitle>
                    <div className="flex flex-wrap gap-1.5">
                        <Badge className="bg-blue-500 text-white">10 Şekil</Badge>
                        <Badge className="bg-emerald-500 text-white">6 Tablo</Badge>
                        <Badge className="bg-purple-500 text-white">9 Denklem</Badge>
                        <Badge className="bg-amber-500 text-white">8 Alt Bölüm</Badge>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Tez Bölüm 3 için gereken tüm şekiller, tablolar, denklemler, istatistikler ve metin içeriği tek sayfada.
                    Her bölümün yanında ilgili şekil/tablo/denklem referansları belirtilmiştir.
                </p>
            </CardHeader>

            <CardContent>
                {/* Section Navigation */}
                <div className="flex flex-wrap gap-1.5 mb-4 p-2 bg-gray-50 rounded-xl">
                    {SECTIONS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${activeSection === s.id
                                ? "bg-indigo-600 text-white shadow"
                                : "bg-white text-gray-600 hover:bg-indigo-50 border"
                                }`}
                        >
                            <s.icon className="h-3.5 w-3.5" />
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* ═══ 3.0 GENEL BAKIŞ ═══ */}
                {activeSection === "overview" && (
                    <div className="space-y-4">
                        <CollapsibleSection title="Bölüm 3 Yol Haritası" badge="8 bölüm">
                            <div className="space-y-2">
                                {[
                                    { num: "3.1", title: "Veri Seti: CICIoT2023", ref: "Tablo 3.1, Şekil 3.9", desc: "103.218 örnek, 39 özellik, 5 sınıf — veri setinin tanıtımı ve seçim gerekçesi" },
                                    { num: "3.2", title: "Veri Ön İşleme", ref: "Tablo 3.2, Şekil 3.4, Denklem 2.9–2.10", desc: "Eksik veri, normalizasyon, veri bölme, SMOTE dengeleme (72.252→87.500)" },
                                    { num: "3.3", title: "BSO Algoritması", ref: "Tablo 3.4, Şekil 3.2, Denklem 3.1–3.5", desc: "Yarasa sürüsü optimizasyonu — frekans, hız, konum, ses, darbe oranı güncellemeleri" },
                                    { num: "3.4", title: "BSO-Hybrid RF Çerçevesi", ref: "Tablo 3.3, 3.5, 3.6, Şekil 3.1, 3.3, Denklem 3.6–3.9", desc: "43 boyutlu çözüm vektörü, fitness fonksiyonu, eşzamanlı FS+HP optimizasyonu" },
                                    { num: "3.5", title: "Deney Tasarımı (S1–S4)", ref: "Şekil 3.6", desc: "4 ablasyon senaryosu + 12 model karşılaştırması + 10-katlı CV" },
                                    { num: "3.6", title: "Değerlendirme Metrikleri", ref: "Şekil 3.5, Denklem 2.1–2.8", desc: "7 metrik: Accuracy, Precision, Recall, F1-Macro, AUC-ROC, FPR, MCC" },
                                ].map(s => (
                                    <div key={s.num} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-indigo-50/50 transition">
                                        <Badge className="bg-indigo-600 text-white shrink-0 mt-0.5">{s.num}</Badge>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm">{s.title}</span>
                                                <span className="text-xs text-indigo-600 font-mono">→ {s.ref}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-0.5">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: "Veri Seti", value: "103.218 örnek", color: "bg-blue-50 border-blue-200 text-blue-700" },
                                { label: "BSO Seçim", value: "19/39 özellik", color: "bg-purple-50 border-purple-200 text-purple-700" },
                                { label: "Doğruluk", value: `%${bso.accuracy}`, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                                { label: "Fitness", value: `${FEATURE_SELECTION_COMPARISON.BSO.bestFitness}`, color: "bg-amber-50 border-amber-200 text-amber-700" },
                            ].map(s => (
                                <div key={s.label} className={`${s.color} border rounded-xl p-3 text-center`}>
                                    <p className="text-xs font-medium opacity-70">{s.label}</p>
                                    <p className="text-lg font-bold">{s.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ 3.1 VERİ SETİ ═══ */}
                {activeSection === "dataset" && (
                    <div className="space-y-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800">
                            <strong>İlgili Öğeler:</strong> Tablo 3.1 (Genel İstatistikler) · Şekil 3.9 (Sınıf Dağılımı) · Şekil 3.10 (Sistem Mimarisi)
                        </div>

                        <CollapsibleSection title="Tablo 3.1 — CICIoT2023 Veri Seti Genel İstatistikleri" badge="Kopyala">
                            <div className="divide-y">
                                <DataRow label="Veri Seti Adı" value="CICIoT2023 (Neto vd., 2023)" />
                                <DataRow label="Kaynak" value="Canadian Institute for Cybersecurity" />
                                <DataRow label="Toplam Örnek (alt örnekleme sonrası)" value={DATASET_STATISTICS.totalSamples.toLocaleString("tr-TR")} />
                                <DataRow label="Toplam Özellik" value={DATASET_STATISTICS.totalFeatures.toString()} />
                                <DataRow label="Sınıf Sayısı" value={DATASET_STATISTICS.classes.toString()} />
                                <DataRow label="CSV Dosya Sayısı" value="19" />
                                <DataRow label="Bölme Oranı" value={DATASET_STATISTICS.splitRatio} />
                                <DataRow label="Eğitim (SMOTE öncesi)" value={(DATASET_STATISTICS.preSMOTETraining ?? 72252).toLocaleString("tr-TR")} />
                                <DataRow label="Eğitim (SMOTE sonrası)" value={DATASET_STATISTICS.totalFlows.training.toLocaleString("tr-TR")} />
                                <DataRow label="Doğrulama" value={DATASET_STATISTICS.totalFlows.validation.toLocaleString("tr-TR")} />
                                <DataRow label="Test" value={DATASET_STATISTICS.totalFlows.testing.toLocaleString("tr-TR")} />
                                <DataRow label="SMOTE Sentetik Örnek" value={DATASET_STATISTICS.smoteSyntheticSamples.toLocaleString("tr-TR")} />
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Sınıf Dağılımı (5 Sınıf)" badge="Şekil 3.9">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold">Sınıf</th>
                                        <th className="px-3 py-2 text-right font-semibold">Eğitim (Öncesi)</th>
                                        <th className="px-3 py-2 text-right font-semibold">SMOTE Sonrası</th>
                                        <th className="px-3 py-2 text-right font-semibold">Test</th>
                                        <th className="px-3 py-2 text-center font-semibold">Ciddiyet</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {CICIOT2023_ATTACK_TYPES.map((a, i) => (
                                        <tr key={a.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                                            <td className="px-3 py-2 font-medium flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                                                {a.name}
                                            </td>
                                            <td className="px-3 py-2 text-right font-mono">{a.trainingSamples.toLocaleString("tr-TR")}</td>
                                            <td className="px-3 py-2 text-right font-mono font-bold">{a.smoteSamples.toLocaleString("tr-TR")}</td>
                                            <td className="px-3 py-2 text-right font-mono">{a.testingSamples.toLocaleString("tr-TR")}</td>
                                            <td className="px-3 py-2 text-center">
                                                <Badge variant="outline" className="text-xs">{a.severity}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-indigo-50 font-bold">
                                        <td className="px-3 py-2">TOPLAM</td>
                                        <td className="px-3 py-2 text-right font-mono">72.252</td>
                                        <td className="px-3 py-2 text-right font-mono">87.500</td>
                                        <td className="px-3 py-2 text-right font-mono">20.644</td>
                                        <td />
                                    </tr>
                                </tbody>
                            </table>
                        </CollapsibleSection>

                        <CollapsibleSection title="39 Orijinal Özellik Listesi" badge="Tablo" defaultOpen={false}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs">
                                {CICIOT2023_FEATURES.map((f, i) => (
                                    <div key={f.name} className="flex items-center gap-1.5 p-1.5 rounded hover:bg-gray-50">
                                        <span className="text-gray-400 font-mono w-5 text-right">{i + 1}.</span>
                                        <span className={BSO_SELECTED_FEATURES.some(s => s.name === f.name) ? "font-bold text-indigo-700" : "text-gray-600"}>
                                            {f.name}
                                        </span>
                                        {BSO_SELECTED_FEATURES.some(s => s.name === f.name) && <Badge className="bg-indigo-100 text-indigo-700 text-[10px]">BSO</Badge>}
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">* Koyu renkli olanlar BSO tarafından seçilen 19 özellik</p>
                        </CollapsibleSection>
                    </div>
                )}

                {/* ═══ 3.2 ÖN İŞLEME ═══ */}
                {activeSection === "preprocess" && (
                    <div className="space-y-4">
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-800">
                            <strong>İlgili Öğeler:</strong> Tablo 3.2 (Pipeline) · Şekil 3.4 (SMOTE) · Denklem 2.9 (SMOTE formülü) · Denklem 2.10 (Z-score)
                        </div>

                        <CollapsibleSection title="Tablo 3.2 — Veri Ön İşleme Pipeline Adımları" badge="7 adım">
                            <div className="space-y-2">
                                {[
                                    { step: 1, title: "Veri Toplama", input: "19 CSV dosyası (CICIoT2023)", output: "103.218 örnek × 39 özellik", tool: "pandas" },
                                    { step: 2, title: "Eksik Veri Kontrolü", input: "103.218 × 39 DataFrame", output: "Eksik değer bulunmadı", tool: "pandas.isnull()" },
                                    { step: 3, title: "Tekrarlanan Veri Temizliği", input: "103.218 satır", output: "Tekrarlanan satırlar kaldırıldı", tool: "pandas.drop_duplicates()" },
                                    { step: 4, title: "Tabakalı Veri Bölme", input: "103.218 örnek", output: "72.252 eğitim / 10.322 doğrulama / 20.644 test", tool: "StratifiedShuffleSplit" },
                                    { step: 5, title: "SMOTE Dengeleme", input: "72.252 eğitim (dengesiz)", output: "87.500 eğitim (dengeli, 5×17.500)", tool: "imblearn SMOTE" },
                                    { step: 6, title: "Normalizasyon", input: "Ham özellik değerleri", output: "z-score: μ=0, σ=1", tool: "StandardScaler" },
                                    { step: 7, title: "Özellik Matrisi Hazırlama", input: "Normalize veri", output: "X_train, X_val, X_test matrisleri", tool: "NumPy" },
                                ].map(s => (
                                    <div key={s.step} className="flex items-start gap-3 p-3 border rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold shrink-0">{s.step}</div>
                                        <div className="flex-1 text-sm">
                                            <p className="font-semibold">{s.title}</p>
                                            <p className="text-xs text-gray-500">Girdi: {s.input}</p>
                                            <p className="text-xs text-gray-500">Çıktı: <span className="font-medium text-gray-700">{s.output}</span></p>
                                            <p className="text-xs text-gray-400">Araç: <code className="bg-gray-100 px-1 rounded">{s.tool}</code></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="SMOTE Detayları (Şekil 3.4)" badge="Denklem 2.9">
                            <div className="space-y-3">
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-sm font-semibold mb-1">SMOTE Formülü (Denklem 2.9):</p>
                                    <code className="text-xs font-mono">x_new = x_i + λ × (x_nn - x_i), λ ∈ [0, 1]</code>
                                </div>
                                <div className="divide-y">
                                    <DataRow label="SMOTE Uygulaması" value="Yalnızca eğitim seti" />
                                    <DataRow label="Eğitim Öncesi" value="72.252 örnek (dengesiz)" />
                                    <DataRow label="Eğitim Sonrası" value="87.500 örnek (dengeli)" />
                                    <DataRow label="Sentetik Örnek" value="15.248 adet" />
                                    <DataRow label="Sınıf Başına" value="17.500 örnek" />
                                    <DataRow label="En Çok Artış" value="Backdoor_Malware: 2.252 → 17.500 (×7,8)" />
                                    <DataRow label="Veri Sızıntısı" value="Önlendi — SMOTE yalnızca eğitim setine" />
                                </div>
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Normalizasyon (Denklem 2.10)" badge="StandardScaler">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-semibold mb-1">Z-Score Standardization:</p>
                                <code className="text-xs font-mono">x_norm = (x - μ) / σ → μ=0, σ=1</code>
                                <p className="text-xs text-gray-500 mt-2">StandardScaler eğitim setine fit edilir, doğrulama ve test setlerine transform uygulanır (veri sızıntısı önlenir).</p>
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {/* ═══ 3.3 BSO ALGORİTMASI ═══ */}
                {activeSection === "bso" && (
                    <div className="space-y-4">
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                            <strong>İlgili Öğeler:</strong> Tablo 3.4 (BSO Parametreleri) · Şekil 3.2 (Sözde Kod) · Şekil 3.7 (Yakınsama Eğrisi) · Denklem 3.1–3.5
                        </div>

                        <CollapsibleSection title="Tablo 3.4 — BSO Algoritması Parametreleri" badge="Kopyala">
                            <div className="divide-y">
                                <DataRow label="Popülasyon Boyutu" value={BSO_PARAMETERS.populationSize.toString()} />
                                <DataRow label="Maksimum İterasyon" value={BSO_PARAMETERS.maxIterations.toString()} />
                                <DataRow label="Frekans Aralığı [f_min, f_max]" value={`[${BSO_PARAMETERS.frequencyMin}, ${BSO_PARAMETERS.frequencyMax}]`} />
                                <DataRow label="Başlangıç Ses Yüksekliği (A₀)" value={BSO_PARAMETERS.initialLoudness.toString()} />
                                <DataRow label="Başlangıç Darbe Oranı (r₀)" value={BSO_PARAMETERS.initialPulseRate.toString()} />
                                <DataRow label="α (ses sönümleme)" value="0.9" />
                                <DataRow label="γ (darbe artış)" value="0.9" />
                                <DataRow label="Boyut Sayısı" value="39 (ikili — özellik seçimi)" />
                                <DataRow label="Toplam Değerlendirme" value={BSO_PARAMETERS.totalEvaluations.toLocaleString("tr-TR")} />
                                <DataRow label="Optimizasyon Süresi" value={`${BSO_PARAMETERS.optimizationTime.toFixed(2)} saniye`} />
                                <DataRow label="En İyi Fitness Değeri" value={FEATURE_SELECTION_COMPARISON.BSO.bestFitness.toString()} />
                                <DataRow label="Seçilen Özellik Sayısı" value={`${BSO_SELECTED_FEATURES.length} / ${DATASET_STATISTICS.totalFeatures}`} />
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="BSO Denklemleri (Denklem 3.1–3.5)" badge="5 denklem">
                            <div className="space-y-3">
                                <EquationCard num="Denklem 3.1" title="Frekans Güncelleme" latex="f_i = f_{min} + (f_{max} - f_{min}) \\times \\beta, \\quad \\beta \\in [0, 1]" usage="Her iterasyonda yarasa hızının belirlenmesi" />
                                <EquationCard num="Denklem 3.2" title="Hız Güncelleme" latex="v_i^{(t+1)} = v_i^{(t)} + (x_i^{(t)} - x_{best}) \\times f_i" usage="En iyi çözüme doğru hareket" />
                                <EquationCard num="Denklem 3.3" title="Konum Güncelleme" latex="x_i^{(t+1)} = x_i^{(t)} + v_i^{(t+1)}" usage="Yeni çözüm pozisyonu" />
                                <EquationCard num="Denklem 3.4" title="Ses Yüksekliği Azaltma" latex="A_i^{(t+1)} = \\alpha \\times A_i^{(t)}, \\quad \\alpha \\in (0, 1)" usage="Keşif → sömürü geçişi (A₀=0.95)" />
                                <EquationCard num="Denklem 3.5" title="Darbe Oranı Artışı" latex="r_i^{(t+1)} = r_i^{(0)} \\times (1 - e^{-\\gamma t})" usage="Yerel arama yoğunluğunun artırılması (r₀=0.5)" />
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="BSO Yakınsama Bilgisi (Şekil 3.7)" badge="50 iteration">
                            <div className="divide-y">
                                <DataRow label="Başlangıç Fitness (İter. 0)" value="0.184825 (27 özellik)" />
                                <DataRow label="İter. 9" value="0.180983 (25 özellik)" />
                                <DataRow label="İter. 20" value="0.179427 (21 özellik)" />
                                <DataRow label="İter. 36" value="0.179301 (20 özellik)" />
                                <DataRow label="Son Fitness (İter. 44–49)" value="0.177801 (19 özellik)" />
                                <DataRow label="Toplam İyileşme" value="%3.8 fitness azaltma" />
                            </div>
                            <div className="mt-3 p-3 bg-indigo-50 rounded-lg text-xs">
                                <p className="font-semibold text-indigo-800 mb-1">Meta-sezgisel Karşılaştırma:</p>
                                <table className="w-full text-xs">
                                    <thead><tr className="text-gray-600"><th className="text-left py-1">Optimizatör</th><th className="text-right">Fitness</th><th className="text-right">Özellik</th><th className="text-right">Süre(s)</th></tr></thead>
                                    <tbody>
                                        <tr className="font-bold text-indigo-700"><td>BSO ★</td><td className="text-right">0.177801</td><td className="text-right">19</td><td className="text-right">840.43</td></tr>
                                        <tr><td>GA</td><td className="text-right">0.188982</td><td className="text-right">21</td><td className="text-right">60.47</td></tr>
                                        <tr><td>GWO</td><td className="text-right">0.192181</td><td className="text-right">23</td><td className="text-right">70.23</td></tr>
                                        <tr><td>PSO</td><td className="text-right">0.193895</td><td className="text-right">18</td><td className="text-right">68.91</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {/* ═══ 3.4 BSO-HYBRID RF ═══ */}
                {activeSection === "hybrid" && (
                    <div className="space-y-4">
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                            <strong>İlgili Öğeler:</strong> Tablo 3.3, 3.5, 3.6 · Şekil 3.1, 3.3 · Denklem 3.6–3.9
                        </div>

                        <CollapsibleSection title="Denklemler (3.6–3.9)" badge="4 denklem">
                            <div className="space-y-3">
                                <EquationCard num="Denklem 3.6" title="Çözüm Vektörü Kodlaması" latex="\\vec{x}_i = [b_1, \\ldots, b_{39} \\;|\\; n_{est}, d_{max}, s_{min}, f_{max}]" usage="39 ikili + 4 sürekli = 43 boyutlu çözüm vektörü" />
                                <EquationCard num="Denklem 3.7" title="Fitness Fonksiyonu (EN KRİTİK)" latex="f(\\vec{x}) = (1 - F1_{macro}) + 0.01 \\times \\frac{n_{selected}}{n_{total}}" usage="F1-Macro performansı + kompaktlık cezası (α=0.01)" />
                                <EquationCard num="Denklem 3.8" title="HP Parametre Aralıkları" latex="n_{est} \\in [50,400], \\; d_{max} \\in [5,35], \\; s_{min} \\in [2,15], \\; f_{max} \\in [0.3,1.0]" usage="BSO&apos;nun optimize ettiği RF parametre sınırları" />
                                <EquationCard num="Denklem 3.9" title="Formal Tanım" latex="\\text{BSO-Hybrid RF} = \\underset{\\vec{x}}{\\arg\\min} \\; f(\\vec{x})" usage="Hibrit çerçevenin matematiksel tanımı" />
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Tablo 3.3 — BSO ile Seçilen 19 Özellik" badge="Önem sırasına göre">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr><th className="px-2 py-1.5 text-left">#</th><th className="px-2 py-1.5 text-left">Özellik</th><th className="px-2 py-1.5 text-right">Önem Değeri</th><th className="px-2 py-1.5 text-right">Kümülatif %</th></tr>
                                </thead>
                                <tbody className="divide-y">
                                    {(() => {
                                        let cumulative = 0
                                        const totalImportance = BSO_SELECTED_FEATURES.reduce((s, f) => s + f.importance, 0)
                                        return BSO_SELECTED_FEATURES.map((f, i) => {
                                            cumulative += f.importance
                                            const pct = (cumulative / totalImportance * 100).toFixed(1)
                                            return (
                                                <tr key={f.name} className={i < 5 ? "bg-indigo-50/50 font-medium" : ""}>
                                                    <td className="px-2 py-1.5 text-gray-400 font-mono">{f.rank}</td>
                                                    <td className="px-2 py-1.5">{f.name}</td>
                                                    <td className="px-2 py-1.5 text-right font-mono">{f.importance.toFixed(6)}</td>
                                                    <td className="px-2 py-1.5 text-right font-mono text-gray-500">{pct}%</td>
                                                </tr>
                                            )
                                        })
                                    })()}
                                </tbody>
                            </table>
                        </CollapsibleSection>

                        <CollapsibleSection title="Tablo 3.5 — Optimize Edilen RF Hiperparametreleri" badge="BSO sonucu">
                            <div className="divide-y">
                                <DataRow label="n_estimators (ağaç sayısı)" value={BSO_PARAMETERS.optimizedHyperparameters.n_estimators.toString()} />
                                <DataRow label="max_depth (maks. derinlik)" value={BSO_PARAMETERS.optimizedHyperparameters.max_depth.toString()} />
                                <DataRow label="min_samples_split (min. bölme)" value={BSO_PARAMETERS.optimizedHyperparameters.min_samples_split.toString()} />
                                <DataRow label="max_features (maks. özellik oranı)" value={BSO_PARAMETERS.optimizedHyperparameters.max_features.toString()} />
                                <DataRow label="Kullanılan Özellik Sayısı" value="19 / 39 (%51.3 azaltma)" />
                                <DataRow label="En İyi Fitness" value={FEATURE_SELECTION_COMPARISON.BSO.bestFitness.toString()} />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {/* ═══ 3.5 DENEY TASARIMI ═══ */}
                {activeSection === "experiment" && (
                    <div className="space-y-4">
                        <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-800">
                            <strong>İlgili Öğeler:</strong> Şekil 3.5, 3.6 · Tablo 3.6
                        </div>

                        <CollapsibleSection title="S1–S4 Ablasyon Senaryoları (Şekil 3.6)" badge="4 senaryo">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr><th className="px-3 py-2 text-left">Senaryo</th><th className="px-3 py-2 text-left">Açıklama</th><th className="px-3 py-2 text-left">Model</th><th className="px-3 py-2 text-right">F1-Macro</th></tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr><td className="px-3 py-2 font-mono font-bold">S1</td><td className="px-3 py-2">Temel (SMOTE yok, BSO yok)</td><td className="px-3 py-2">Decision Tree</td><td className="px-3 py-2 text-right font-mono">%{dt.f1Macro}</td></tr>
                                    <tr><td className="px-3 py-2 font-mono font-bold">S2</td><td className="px-3 py-2">SMOTE + BSO-FS (yalnız özellik seçimi)</td><td className="px-3 py-2">BSO-SVM</td><td className="px-3 py-2 text-right font-mono">%74.03</td></tr>
                                    <tr><td className="px-3 py-2 font-mono font-bold">S3</td><td className="px-3 py-2">SMOTE + varsayılan RF (39 özellik)</td><td className="px-3 py-2">Random Forest</td><td className="px-3 py-2 text-right font-mono">%{rf.f1Macro}</td></tr>
                                    <tr className="bg-indigo-50 font-bold"><td className="px-3 py-2 font-mono">S4</td><td className="px-3 py-2">SMOTE + BSO-FS + BSO-HP (tam hibrit)</td><td className="px-3 py-2">BSO-Hybrid RF</td><td className="px-3 py-2 text-right font-mono">%{bso.f1Macro}</td></tr>
                                </tbody>
                            </table>
                        </CollapsibleSection>

                        <CollapsibleSection title="12 Model Karşılaştırması" badge="Tablo 3.6 veri akışı">
                            <table className="w-full text-xs">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-2 py-1.5 text-left">Model</th>
                                        <th className="px-2 py-1.5 text-right">Acc %</th>
                                        <th className="px-2 py-1.5 text-right">F1-M %</th>
                                        <th className="px-2 py-1.5 text-right">AUC %</th>
                                        <th className="px-2 py-1.5 text-right">Özellik</th>
                                        <th className="px-2 py-1.5 text-right">Süre(s)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {MODEL_RESULTS.map((m, i) => (
                                        <tr key={m.name} className={i === 0 ? "bg-indigo-50 font-bold" : ""}>
                                            <td className="px-2 py-1.5">{i === 0 ? "★ " : ""}{m.name.replace(" (Proposed)", "")}</td>
                                            <td className="px-2 py-1.5 text-right font-mono">{m.accuracy}</td>
                                            <td className="px-2 py-1.5 text-right font-mono">{m.f1Macro}</td>
                                            <td className="px-2 py-1.5 text-right font-mono">{m.aucRoc}</td>
                                            <td className="px-2 py-1.5 text-right font-mono">{m.featuresUsed}</td>
                                            <td className="px-2 py-1.5 text-right font-mono">{m.trainingTime?.toFixed(2) ?? "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CollapsibleSection>

                        <CollapsibleSection title="10-Katlı Çapraz Doğrulama Sonuçları (Şekil 3.5)" badge="BSO-Hybrid RF">
                            <div className="divide-y mb-3">
                                <DataRow label="Ortalama Doğruluk" value={`%${CROSS_VALIDATION.mean.accuracy.toFixed(2)} ± ${CROSS_VALIDATION.std.accuracy}`} />
                                <DataRow label="Ortalama F1-Macro" value={`%${CROSS_VALIDATION.mean.f1Score.toFixed(2)} ± ${CROSS_VALIDATION.std.f1Score}`} />
                            </div>
                            {CROSS_VALIDATION.results && (
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50">
                                        <tr><th className="px-2 py-1">Kat</th><th className="px-2 py-1 text-right">Doğ.</th><th className="px-2 py-1 text-right">Kesin.</th><th className="px-2 py-1 text-right">Duyar.</th><th className="px-2 py-1 text-right">F1</th></tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {CROSS_VALIDATION.results.map((f, i) => (
                                            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50/50"}>
                                                <td className="px-2 py-1 font-mono text-gray-400">{f.fold}</td>
                                                <td className="px-2 py-1 text-right font-mono">{f.accuracy}</td>
                                                <td className="px-2 py-1 text-right font-mono">{f.precision}</td>
                                                <td className="px-2 py-1 text-right font-mono">{f.recall}</td>
                                                <td className="px-2 py-1 text-right font-mono">{f.f1Score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </CollapsibleSection>

                        <CollapsibleSection title="Deney Ortamı" badge="Tekrarlanabilirlik">
                            <div className="divide-y">
                                <DataRow label="Python Sürümü" value="3.11.7" />
                                <DataRow label="ML Kütüphanesi" value="scikit-learn 1.3.2" />
                                <DataRow label="XGBoost Sürümü" value="xgboost 2.0.2" />
                                <DataRow label="Dengeleme" value="imbalanced-learn 0.11.0 (SMOTE)" />
                                <DataRow label="Rastgele Tohum" value="random_state = 42" />
                                <DataRow label="Toplam Süre" value="1.332,6 saniye (≈22,2 dk)" />
                                <DataRow label="Deney Tarihi" value="23 Şubat 2026" />
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {/* ═══ 3.6 METRİKLER ═══ */}
                {activeSection === "metrics" && (
                    <div className="space-y-4">
                        <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-xs text-teal-800">
                            <strong>İlgili Öğeler:</strong> Denklem 2.1–2.8 (Bölüm 2&apos;de tanımlanır, Bölüm 3&apos;te referans verilir)
                        </div>

                        <CollapsibleSection title="7 Değerlendirme Metriği" badge="Denklem 2.1–2.8">
                            <div className="space-y-2">
                                {[
                                    { name: "Accuracy", formula: "(TP+TN) / (TP+TN+FP+FN)", value: `%${bso.accuracy}`, desc: "Genel doğruluk" },
                                    { name: "Precision", formula: "TP / (TP+FP)", value: `%${bso.precision}`, desc: "DDoS alarm doğruluğu" },
                                    { name: "Recall", formula: "TP / (TP+FN)", value: `%${bso.recall}`, desc: "Saldırı yakalama oranı" },
                                    { name: "F1-Macro", formula: "(1/C) × ΣF1_c", value: `%${bso.f1Macro}`, desc: "Dengesiz sınıflarda performans" },
                                    { name: "F1-Weighted", formula: "Σ(w_c × F1_c)", value: `%${bso.f1Score}`, desc: "Ağırlıklı genel performans" },
                                    { name: "AUC-ROC", formula: "Area Under ROC Curve", value: `%${bso.aucRoc}`, desc: "Sınıflandırma yeteneği" },
                                    { name: "MCC", formula: "(TP×TN - FP×FN) / √(...)", value: `${bso.mcc.toFixed(4)}`, desc: "Çok sınıflı uyum [-1,+1]" },
                                ].map(m => (
                                    <div key={m.name} className="flex items-center justify-between p-2 border rounded-lg hover:bg-teal-50/50">
                                        <div>
                                            <span className="font-semibold text-sm">{m.name}</span>
                                            <span className="text-xs text-gray-500 ml-2">{m.formula}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-teal-500 text-white">{m.value}</Badge>
                                            <CopyButton text={`${m.name}: ${m.value}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="İstatistiksel Doğrulama Yöntemleri" badge="Bölüm 4 detayları">
                            <div className="space-y-1.5 text-sm">
                                <p>• <strong>10-Katlı Tabakalı CV:</strong> %{CROSS_VALIDATION.mean.accuracy.toFixed(2)} ± {CROSS_VALIDATION.std.accuracy}</p>
                                <p>• <strong>Eşleştirilmiş t-testi:</strong> BSO-RF vs 11 model (p valorları Bölüm 4&apos;te)</p>
                                <p>• <strong>Wilcoxon İşaret Sıra Testi:</strong> Parametrik olmayan doğrulama</p>
                                <p>• <strong>Cohen&apos;s d:</strong> Etki büyüklüğü (0.2=küçük, 0.5=orta, 0.8=büyük)</p>
                                <p>• <strong>%95 Güven Aralığı:</strong> μ ± 1.96 × (σ/√n)</p>
                            </div>
                        </CollapsibleSection>
                    </div>
                )}

                {/* ═══ TÜM ŞEKİLLER ═══ */}
                {activeSection === "all-figures" && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">Bölüm 3 için gereken tüm 10 şekil. Her şeklin ilgili tez bölümü ve dashboard bileşeni belirtilmiştir.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <FigureCard num="Şekil 3.1" title="Önerilen BSO-Hybrid RF Sistem Mimarisi" titleEN="Proposed BSO-Hybrid RF System Architecture" desc="6 aşamalı ardışık düzen: veri → ön işleme → BSO → seçim → eğitim → değerlendirme" component="thesis-figures.tsx" />
                            <FigureCard num="Şekil 3.2" title="BSO Algoritması Sözde Kodu ve Akış Diyagramı" titleEN="BSO Algorithm Pseudocode and Flowchart" desc="Başlatma → Frekans → Hız → Konum → Darbe → Ses güncellemesi" component="thesis-figures.tsx" />
                            <FigureCard num="Şekil 3.3" title="BSO Çözüm Vektörü Kodlama Yapısı" titleEN="BSO Solution Vector Encoding Structure" desc="39 boyutlu ikili + 4 sürekli HP vektör yapısı" component="thesis-figures.tsx" />
                            <FigureCard num="Şekil 3.4" title="SMOTE Aşırı Örnekleme Süreci" titleEN="SMOTE Oversampling Process" desc="k-NN tabanlı sentetik örnek üretimi (72.252→87.500)" component="thesis-figures.tsx" />
                            <FigureCard num="Şekil 3.5" title="10-Katlı Tabakalı Çapraz Doğrulama" titleEN="10-Fold Stratified Cross-Validation" desc="Her katta SMOTE → eğitim → doğrulama döngüsü" component="thesis-figures.tsx" />
                            <FigureCard num="Şekil 3.6" title="S1–S4 Deney Senaryoları" titleEN="S1–S4 Experiment Scenario Design" desc="4 ablasyon senaryosu: SMOTE±, BSO±, RF±" component="thesis-figures.tsx" />
                            <FigureCard num="Şekil 3.7" title="BSO Yakınsama Eğrisi (İnteraktif)" titleEN="BSO Convergence Curve — Interactive" desc="En iyi/ortalama fitness + çeşitlilik eğrisi (50 iterasyon)" component="bso-visualization.tsx" />
                            <FigureCard num="Şekil 3.8" title="BSO Yarasa Sürüsü Pozisyonları" titleEN="BSO Bat Swarm Final Positions" desc="2D projeksiyon — 25 yarasa çözüm noktası" component="bso-visualization.tsx" />
                            <FigureCard num="Şekil 3.9" title="SMOTE Öncesi/Sonrası Dağılım" titleEN="Class Distribution Before/After SMOTE" desc="Dengesiz→dengeli sınıf dönüşümü görselleştirmesi" component="dataset-eda.tsx" />
                            <FigureCard num="Şekil 3.10" title="Sistem Mimarisi (Büyük)" titleEN="System Architecture Diagram — Large" desc="İndirilebilir tam sistem diyagramı" component="system-architecture-diagram.tsx" />
                        </div>
                    </div>
                )}

                {/* ═══ TÜM TABLOLAR ═══ */}
                {activeSection === "all-tables" && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">Bölüm 3 için gereken tüm 6 tablo. Verilerin tamamı bu bölümlerde sunulmuştur.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <TableCard num="Tablo 3.1" title="CICIoT2023 Genel İstatistikleri" titleEN="CICIoT2023 Dataset General Statistics" desc="103.218 örnek, 39 öznitelik, 5 sınıf, bölme oranları — Bölüm 3.1'de" />
                            <TableCard num="Tablo 3.2" title="Veri Ön İşleme Pipeline" titleEN="Data Preprocessing Pipeline Steps" desc="7 adımlık ön işleme süreci — Bölüm 3.2'de" />
                            <TableCard num="Tablo 3.3" title="BSO Seçilen 19 Özellik" titleEN="19 Features Selected by BSO" desc="Önem sırasına göre 19 özellik — Bölüm 3.4'te" />
                            <TableCard num="Tablo 3.4" title="BSO Parametreleri" titleEN="BSO Algorithm Parameters" desc="Pop=25, İter=50, A₀=0.95, r₀=0.5, α=0.9, γ=0.9 — Bölüm 3.3'te" />
                            <TableCard num="Tablo 3.5" title="Optimize RF Hiperparametreleri" titleEN="RF Hyperparameters Optimized by BSO" desc="n_est=266, max_depth=20, min_split=7, max_feat=0.469 — Bölüm 3.4'te" />
                            <TableCard num="Tablo 3.6" title="BSO-Hybrid RF Pipeline" titleEN="BSO-Hybrid RF Framework Pipeline" desc="Aşama bazlı veri akışı — Bölüm 3.4'te" />
                        </div>
                    </div>
                )}

                {/* ═══ TÜM DENKLEMLER ═══ */}
                {activeSection === "all-equations" && (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">Bölüm 3 için gereken tüm 9 denklem. LaTeX kodları kopyalanabilir.</p>
                        <div className="space-y-3">
                            <EquationCard num="Denklem 3.1" title="Frekans Güncelleme" latex="f_i = f_{min} + (f_{max} - f_{min}) \\times \\beta, \\quad \\beta \\in [0, 1]" usage="BSO frekans — Bölüm 3.3" />
                            <EquationCard num="Denklem 3.2" title="Hız Güncelleme" latex="v_i^{(t+1)} = v_i^{(t)} + (x_i^{(t)} - x_{best}) \\times f_i" usage="BSO hız — Bölüm 3.3" />
                            <EquationCard num="Denklem 3.3" title="Konum Güncelleme" latex="x_i^{(t+1)} = x_i^{(t)} + v_i^{(t+1)}" usage="BSO konum — Bölüm 3.3" />
                            <EquationCard num="Denklem 3.4" title="Ses Yüksekliği Azaltma" latex="A_i^{(t+1)} = \\alpha \\times A_i^{(t)}, \\quad \\alpha \\in (0, 1)" usage="BSO loudness — Bölüm 3.3" />
                            <EquationCard num="Denklem 3.5" title="Darbe Oranı Artışı" latex="r_i^{(t+1)} = r_i^{(0)} \\times (1 - e^{-\\gamma t})" usage="BSO pulse rate — Bölüm 3.3" />
                            <EquationCard num="Denklem 3.6" title="Çözüm Vektörü (43 Boyut)" latex="\\vec{x}_i = [b_1, \\ldots, b_{39} \\;|\\; n_{est}, d_{max}, s_{min}, f_{max}]" usage="Hybrit kodlama — Bölüm 3.4" />
                            <EquationCard num="Denklem 3.7" title="Fitness Fonksiyonu ★" latex="f(\\vec{x}) = (1 - F1_{macro}) + 0.01 \\times \\frac{n_{selected}}{n_{total}}" usage="Ana hedef fonksiyonu — Bölüm 3.4" />
                            <EquationCard num="Denklem 3.8" title="HP Parametre Aralıkları" latex="n_{est} \\in [50,400], \\; d_{max} \\in [5,35], \\; s_{min} \\in [2,15], \\; f_{max} \\in [0.3,1.0]" usage="RF arama alanı — Bölüm 3.4" />
                            <EquationCard num="Denklem 3.9" title="Formal Optimizasyon Tanımı" latex="\\text{BSO-Hybrid RF} = \\underset{\\vec{x}}{\\arg\\min} \\; f(\\vec{x})" usage="Matematiksel tanım — Bölüm 3.4" />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
