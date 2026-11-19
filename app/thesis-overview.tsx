import data from "../reproducibility/dashboard.json"

const percent = (value: string) => `${(Number(value) * 100).toFixed(2)}%`
const count = (value: number) => value.toLocaleString("tr-TR")

export default function ThesisOverview() {
  const { comparison, classes, split, features } = data
  const model = comparison[0]
  const summary = [
    ["Doğruluk", percent(model.accuracy)],
    ["Makro-F1", percent(model.macro_f1)],
    ["Ağırlıklı OvR ROC-AUC", percent(model.weighted_ovr_roc_auc)],
    ["Öznitelik sayısı", `${features.length}/${comparison[1].features}`],
    ["Girdi azaltma", percent(model.reduction)],
    ["Test örnekleri", count(split.test_rows)],
  ]
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 p-6 text-white shadow-sm sm:p-9">
        <p className="text-sm font-medium text-indigo-200">CICIoT2023 · Beş trafik sınıfı</p>
        <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">BSO ile öznitelik seçimi ve Random Forest optimizasyonu</h2>
        <p className="mt-3 max-w-2xl text-indigo-100">Dondurulmuş test bölümünde 23 öznitelikli BSO-RF ve 39 öznitelikli RF karşılaştırması.</p>
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {summary.map(([label, value]) => <div key={label} className="rounded-xl border border-white/20 bg-white/10 p-3">
            <dt className="text-xs text-indigo-100">{label}</dt>
            <dd className="mt-1 text-xl font-bold tabular-nums">{value}</dd>
          </div>)}
        </dl>
      </section>
      <div className="grid gap-5">
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-2xl font-semibold">Deney protokolü</h2>
          <p>{count(split.train_rows + split.validation_rows + split.test_rows)} satır SHA-256 ile tam öznitelik eşleşmesine göre gruplandı. Eğitim, doğrulama ve test bölümleri arasında tam satır örtüşmesi sıfırdır.</p>
          <p>Eğitim {count(split.train_rows)} · Doğrulama {count(split.validation_rows)} · Test {count(split.test_rows)}</p>
          <p>Medyan atama, sabit öznitelik taraması, ölçekleme ve SMOTE eğitim bölümünde uyarlandı. BSO, eğitim ve doğrulama ile öznitelikleri ve RF ayarlarını seçti. Dondurulan modeller aynı test bölümünde değerlendirildi.</p>
        </section>
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-2xl font-semibold">Test sonuçları</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr>{["Model", "Öznitelik", "Azaltma", "Doğruluk", "Makro-F1", "MCC", "Ağırlıklı OvR ROC-AUC"].map(label => <th key={label} scope="col" className="border-b bg-slate-100 p-3">{label}</th>)}</tr></thead>
              <tbody>{comparison.map(model => <tr key={model.model} className="border-b border-slate-100 even:bg-slate-50">
                <th scope="row" className="p-3">{model.model}</th>
                {[model.features, percent(model.reduction), percent(model.accuracy), percent(model.macro_f1), Number(model.mcc).toFixed(4), percent(model.weighted_ovr_roc_auc)].map((value, index) => <td className="whitespace-nowrap p-3" key={index}>{value}</td>)}
              </tr>)}</tbody>
            </table>
          </div>
          <p className="text-sm text-slate-600">RF-All39, BSO ile seçilen RF hiperparametrelerini 39 öznitelikle kullanır.</p>
        </section>
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-2xl font-semibold">BSO-RF sınıf sonuçları</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr>{["Sınıf", "Kesinlik", "Duyarlılık", "F1", "Örnek"].map(label => <th key={label} scope="col" className="border-b bg-slate-100 p-3">{label}</th>)}</tr></thead>
              <tbody>{classes.map(row => <tr className="border-b border-slate-100 even:bg-slate-50" key={row.class}>
                <th scope="row" className="p-3">{row.class}</th>
                {[percent(row.precision), percent(row.recall), percent(row.f1), count(Number(row.support))].map((value, index) => <td className="p-3" key={index}>{value}</td>)}
              </tr>)}</tbody>
            </table>
          </div>
        </section>
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-2xl font-semibold">Seçilen {features.length} öznitelik</h2>
          <p className="leading-relaxed">{features.join(", ")}</p>
        </section>
      </div>
    </div>
  )
}
