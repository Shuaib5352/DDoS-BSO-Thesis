"use client"

import { useState } from "react"
import { BookOpen, ShieldCheck } from "lucide-react"
import navigation from "../reproducibility/navigation.json"
import tables from "../reproducibility/dashboard-tables.json"
import optimizer from "../reproducibility/optimizer_result.json"
import data from "../reproducibility/dashboard.json"
import ThesisOverview from "./thesis-overview"

type TableName = keyof typeof tables

const figures: Record<string, string[]> = {
  architecture: ["complete_system_architecture"],
  methodology: ["complete_evaluation_pipeline"],
  pipeline: ["complete_evaluation_pipeline"],
  features: ["selected_feature_importance_top15"],
  convergence: ["bso_convergence"],
  algorithms: ["complete_comparison_heatmap"],
  performance: ["complete_compactness", "complete_resources"],
  heatmap: ["confusion_matrix"],
  ablation: ["complete_ablation"],
  "journal-charts": ["per_class_performance"],
  "roc-curves": ["supplementary_multiclass_roc"],
  "pr-curves": ["supplementary_multiclass_pr"],
}

const evidence: Record<string, TableName[]> = {
  "dataset-eda": ["split"],
  thesis: ["predictive_comparison", "per_class_metrics"],
  tables: ["split", "predictive_comparison", "resource_comparison"],
  features: ["selected_feature_importance"],
  ml: ["predictive_comparison"],
  ranking: ["predictive_comparison"],
  heatmap: ["confusion_matrix"],
  errors: ["confusion_matrix", "per_class_metrics"],
  ablation: ["validation_ablation"],
  statistics: ["bootstrap_95ci"],
}

const tableTitles: Record<TableName, string> = {
  split: "Sınıfa göre bölüm dağılımı",
  predictive_comparison: "Dondurulmuş test bölümünde model karşılaştırması",
  per_class_metrics: "BSO-RF sınıf bazlı metrikleri",
  selected_feature_importance: "Seçilen özniteliklerin RF önem sıralaması",
  resource_comparison: "Model boyutu ve çıkarım profili",
  confusion_matrix: "Karışıklık matrisi · satır gerçek sınıf, sütun tahmin",
  validation_ablation: "Doğrulama bölümünde ablasyon",
  bootstrap_95ci: "BSO-RF test metrikleri için %95 güven aralıkları",
}

const figureTitles: Record<string, string> = {
  complete_system_architecture: "Çevrimdışı optimizasyon ve çevrimiçi çıkarım",
  complete_evaluation_pipeline: "Grup duyarlı değerlendirme akışı",
  selected_feature_importance_top15: "Seçilen ilk 15 özniteliğin RF önemi",
  bso_convergence: "Kaydedilmiş BSO yakınsama seyri",
  complete_comparison_heatmap: "Dondurulmuş testte model karşılaştırması",
  complete_compactness: "Öznitelik sayısı ve tahmin başarımı",
  complete_resources: "Model boyutu ve çıkarım performansı",
  confusion_matrix: "BSO-RF test karışıklık matrisi",
  complete_ablation: "Doğrulama bölümünde ablasyon",
  per_class_performance: "Sınıf bazında kesinlik, duyarlılık ve F1",
  supplementary_multiclass_roc: "Sınıf bazında OvR ROC eğrileri",
  supplementary_multiclass_pr: "Sınıf bazında kesinlik–duyarlılık eğrileri",
}

const notes: Record<string, string> = {
  architecture: "Çevrimdışı BSO araması tamamlandıktan sonra aynı uydurulmuş ön işleme ve dondurulmuş RF çıkarımda kullanılır.",
  literature: "CICIoT2023 üzerindeki sonuçların karşılaştırılabilirliği sınıf kapsamı, örnekleme ve veri bölme protokolüne bağlıdır.",
  references: "Veri kaynağı: Neto ve ark., CICIoT2023. Tam kaynakça için tez metnine başvurun.",
  bolum3: "Ham satırların gruplandırılması → grup duyarlı bölümleme → eğitimde ön işleme ve SMOTE → doğrulama ile BSO → dondurulmuş test değerlendirmesi.",
  bso: "BSO, eğitim ve doğrulama bölümlerinde öznitelik maskesini ve RF ayarlarını birlikte seçer.",
  "feature-selection": data.features.join(", "),
  equations: "Öznitelik azaltma = 1 − seçilen öznitelik sayısı / 39. Makro-F1, beş sınıfın F1 değerlerinin aritmetik ortalamasıdır.",
  detection: "Dondurulmuş model, işlenmiş akış özniteliklerinden beş trafik sınıfı için tahmin üretir. Bu sekme deney protokolünü açıklar.",
  ranking: "Tablo, aynı test bölümündeki iki modeli gösterir. RF-All39, BSO ile seçilen RF hiperparametrelerini kullanır.",
  features: "Ağaç safsızlığına dayalı önem, uydurulmuş modelin öznitelik kullanımını betimler.",
  errors: "Backdoor_Malware için başlıca hata yönleri BenignTraffic ve Recon-PortScan sınıflarıdır.",
  learning: "Güncel değerlendirme için öğrenme eğrisi bu depoda arşivlenmemiştir.",
  "concept-drift": "Tezin test protokolü tam satır gruplarına dayanır. Zamansal kavram kayması bu bölümlemeden ölçülemez.",
  statistics: "Tabloda BSO-RF için saklı test bölümünden elde edilmiş bootstrap güven aralıkları yer alır.",
  tsne: "Güncel değerlendirme için t-SNE çıktısı bu depoda arşivlenmemiştir.",
  conclusion: "BSO-RF, 39 öznitelikten 23'ünü kullanarak girdileri %41,03 azaltır. Dondurulmuş testte doğruluk %87,51, makro-F1 %82,49'dur.",
  abstract: "Bu tez, CICIoT2023 örnekleminde beş sınıflı trafik tespiti için BSO ile öznitelikleri ve RF ayarlarını seçen bir yaklaşımı değerlendirir.",
  "eq-guide": "Makro-F1, sınıf F1 değerlerinin ortalamasıdır. Ağırlıklı OvR ROC-AUC, sınıf bazlı OvR AUC değerlerini sınıf desteğiyle ağırlıklandırır.",
  "chapter-org": navigation.filter(group => group.id !== "tools").map(group => group.label).join(" → "),
  defense: "Veri sızıntısı nasıl sınırlandı? Özdeş ham satırlar önce gruplandı. Ön işleme eğitimde uyarlandı ve test bölümü model seçiminden ayrıldı.",
  paragraphs: "Model karşılaştırması, dondurulmuş test bölümündeki tahmin başarımını ve kullanılan girdi sayısını birlikte ele alır.",
  "writing-guide": "Her sonuç tablosunda veri bölümü, metrik tanımı ve karşılaştırma modeli belirtilir.",
  glossary: "BSO: Yarasa Sürüsü Optimizasyonu. RF: Random Forest. OvR: Bire karşı diğerleri. MCC: Matthews korelasyon katsayısı.",
}

function EvidenceTable({ name }: { name: TableName }) {
  const [headers, ...rows] = tables[name]
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table aria-label={tableTitles[name]} className="w-full text-left text-sm">
        <caption className="caption-top bg-white px-4 py-3 text-left font-semibold">{tableTitles[name]}</caption>
        <thead><tr>{headers.map((header, index) => <th scope="col" key={index} className="border-b bg-slate-100 px-3 py-2.5 font-semibold">{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index} className="border-b border-slate-100 odd:bg-white even:bg-slate-50">
          {row.map((cell, column) => <td className="px-3 py-2.5 tabular-nums" key={column}>{cell}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
  )
}

export default function Page() {
  const [active, setActive] = useState("home")
  const selected = navigation.flatMap(group => group.tabs).find(tab => tab.id === active)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur print:static">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 md:px-8">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-white">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-sm font-bold sm:text-base">CICIoT2023 üzerinde BSO-RF ile DDoS tespiti</h1>
            <p className="text-xs text-slate-600">SHUAIB AYAD JASIM JASIM · Yüksek lisans tezi</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
      <nav aria-label="Tez bölümleri" className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 print:hidden">
        {navigation.map(group => <div key={group.id} className="grid gap-2 rounded-lg bg-slate-50 p-2.5 lg:grid-cols-[13rem_1fr] lg:items-start">
          <h2 className="flex items-center gap-2 px-1 py-1 text-sm font-semibold text-slate-700"><BookOpen className="size-4 text-indigo-600" aria-hidden="true" />{group.label}</h2>
          <div className="flex flex-wrap gap-2">
            {group.tabs.map(tab => <button type="button" key={tab.id} aria-pressed={active === tab.id}
              onClick={() => setActive(tab.id)}
              className={active === tab.id ? "rounded-lg bg-indigo-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm" : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-800"}>
              {tab.label}
            </button>)}
          </div>
        </div>)}
      </nav>
      <section className={active === "home" ? "py-7" : "my-7 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"} aria-label={selected?.label}>
        {active === "home" ? <ThesisOverview /> : <>
          <h2 className="border-b border-slate-200 pb-3 text-2xl font-bold tracking-tight">{selected?.label}</h2>
          {notes[active] && <p>{notes[active]}</p>}
          {active === "bso" && <dl className="grid grid-cols-2 gap-2">
            {Object.entries(optimizer.hyperparameters).map(([name, value]) =>
              <div key={name}><dt className="font-medium">{name}</dt><dd>{value}</dd></div>)}
          </dl>}
          {(evidence[active] ?? []).map(name => <EvidenceTable key={name} name={name} />)}
          {(figures[active] ?? []).map(file => <figure key={file} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <a href={`/thesis-figures/${file}.png`} className="block p-3 sm:p-5" aria-label={`${figureTitles[file]} · tam boyut`}>
              <img className="mx-auto h-auto max-h-[680px] max-w-full object-contain" src={`/thesis-figures/${file}.png`} alt={figureTitles[file]} loading="lazy" />
            </a>
            <figcaption className="border-t bg-slate-50 px-4 py-3 text-sm font-medium">{figureTitles[file]}</figcaption>
          </figure>)}
          {(active === "fig-index" || active === "figures") && <ul className="list-disc pl-6">
            {Object.entries(figures).map(([tab, files]) => <li key={tab}>
              <button className="underline" onClick={() => setActive(tab)}>
                {navigation.flatMap(group => group.tabs).find(item => item.id === tab)?.label} ({files.length})
              </button>
            </li>)}
          </ul>}
          {active === "export" && <button className="rounded bg-slate-900 px-3 py-2 text-white" onClick={() => window.print()}>Bu sayfayı yazdır</button>}
        </>}
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-5 text-sm text-slate-600">
        <span>SHUAIB AYAD JASIM JASIM · CICIoT2023</span>
        <a className="font-medium text-indigo-700 underline underline-offset-4" href="https://github.com/Shuaib5352/DDoS-BSO-Thesis/tree/main/reproducibility">Deney kodu ve kanıt dosyaları</a>
      </footer>
      </main>
    </div>
  )
}
