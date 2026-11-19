import data from "../reproducibility/dashboard.json"

const percent = (value: string) => `${(Number(value) * 100).toFixed(2)}%`
const count = (value: number) => value.toLocaleString("tr-TR")

export default function Page() {
  const { comparison, classes, split, features } = data
  return (
    <div className="text-slate-900">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Deney protokolü</h2>
          <p>{count(split.train_rows + split.validation_rows + split.test_rows)} satır SHA-256 ile tam öznitelik eşleşmesine göre gruplandı. Eğitim, doğrulama ve test bölümleri arasında tam satır örtüşmesi sıfırdır.</p>
          <p>Eğitim {count(split.train_rows)} · Doğrulama {count(split.validation_rows)} · Test {count(split.test_rows)}</p>
          <p>Medyan atama, sabit öznitelik taraması, ölçekleme ve SMOTE eğitim bölümünde uyarlandı. BSO, eğitim ve doğrulama ile öznitelikleri ve RF ayarlarını seçti. Dondurulan modeller aynı test bölümünde değerlendirildi.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Test sonuçları</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr>{["Model", "Öznitelik", "Azaltma", "Doğruluk", "Makro-F1", "MCC", "Ağırlıklı OvR ROC-AUC"].map(label => <th key={label} scope="col" className="border-b p-3">{label}</th>)}</tr></thead>
              <tbody>{comparison.map(model => <tr key={model.model} className="border-b">
                <th scope="row" className="p-3">{model.model}</th>
                {[model.features, percent(model.reduction), percent(model.accuracy), percent(model.macro_f1), Number(model.mcc).toFixed(4), percent(model.weighted_ovr_roc_auc)].map((value, index) => <td className="whitespace-nowrap p-3" key={index}>{value}</td>)}
              </tr>)}</tbody>
            </table>
          </div>
          <p className="text-sm text-slate-600">RF-All39, BSO ile seçilen RF hiperparametrelerini 39 öznitelikle kullanır.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">BSO-RF sınıf sonuçları</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr>{["Sınıf", "Kesinlik", "Duyarlılık", "F1", "Örnek"].map(label => <th key={label} scope="col" className="border-b p-3">{label}</th>)}</tr></thead>
              <tbody>{classes.map(row => <tr className="border-b" key={row.class}>
                <th scope="row" className="p-3">{row.class}</th>
                {[percent(row.precision), percent(row.recall), percent(row.f1), count(Number(row.support))].map((value, index) => <td className="p-3" key={index}>{value}</td>)}
              </tr>)}</tbody>
            </table>
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Seçilen {features.length} öznitelik</h2>
          <p className="leading-relaxed">{features.join(", ")}</p>
        </section>
      </div>
    </div>
  )
}
