"use client"

import { useState } from "react"
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
    <div className="overflow-x-auto">
      <table aria-label={name.replaceAll("_", " ")} className="w-full text-left text-sm">
        <thead><tr>{headers.map((header, index) => <th scope="col" key={index} className="border-b p-2">{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index} className="border-b">
          {row.map((cell, column) => <td className="p-2" key={column}>{cell}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
  )
}

export default function Page() {
  const [active, setActive] = useState("home")
  const selected = navigation.flatMap(group => group.tabs).find(tab => tab.id === active)

  return (
    <main className="mx-auto min-h-screen max-w-6xl bg-white px-5 py-8 text-slate-900">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-sm text-slate-600">SHUAIB AYAD JASIM JASIM</p>
        <h1 className="text-3xl font-semibold">CICIoT2023 üzerinde BSO-RF ile DDoS tespiti</h1>
      </header>
      <nav aria-label="Tez bölümleri" className="space-y-3 border-b py-5 print:hidden">
        {navigation.map(group => <div key={group.id}>
          <h2 className="mb-1 text-sm font-semibold">{group.label}</h2>
          <div className="flex flex-wrap gap-2">
            {group.tabs.map(tab => <button type="button" key={tab.id} aria-pressed={active === tab.id}
              onClick={() => setActive(tab.id)}
              className={active === tab.id ? "rounded bg-slate-900 px-3 py-1 text-sm text-white" : "rounded bg-slate-100 px-3 py-1 text-sm"}>
              {tab.label}
            </button>)}
          </div>
        </div>)}
      </nav>
      <section className="space-y-5 py-7" aria-label={selected?.label}>
        {active === "home" ? <ThesisOverview /> : <>
          <h2 className="text-2xl font-semibold">{selected?.label}</h2>
          {notes[active] && <p>{notes[active]}</p>}
          {active === "bso" && <dl className="grid grid-cols-2 gap-2">
            {Object.entries(optimizer.hyperparameters).map(([name, value]) =>
              <div key={name}><dt className="font-medium">{name}</dt><dd>{value}</dd></div>)}
          </dl>}
          {(evidence[active] ?? []).map(name => <EvidenceTable key={name} name={name} />)}
          {(figures[active] ?? []).map(file => <figure key={file}>
            <img className="h-auto w-full" src={`/thesis-figures/${file}.png`} alt={selected?.label} />
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
    </main>
  )
}
