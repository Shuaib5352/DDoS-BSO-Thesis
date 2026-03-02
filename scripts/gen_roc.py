import json, numpy as np

f = open(r'C:\Users\imiss\Downloads\b_dSd45QWSjWy\public\experiment_results.json')
d = json.load(f)
mr = d['modelResults']

lines = []
lines.append("// Real macro-averaged ROC curve data (computed from per-class ROC in experiment_results.json)")
lines.append("export const ROC_CURVE_DATA: { model: string; fpr: number; tpr: number; auc: number }[] = [")

for name in mr:
    roc = mr[name].get('rocData', None)
    if not roc:
        continue
    
    all_fpr = np.linspace(0, 1, 51)
    tpr_interp = []
    aucs = []
    for cls_data in roc:
        fpr_arr = np.array(cls_data['fpr'])
        tpr_arr = np.array(cls_data['tpr'])
        aucs.append(cls_data['auc'])
        interp_tpr = np.interp(all_fpr, fpr_arr, tpr_arr)
        interp_tpr[0] = 0.0
        tpr_interp.append(interp_tpr)
    
    mean_tpr = np.mean(tpr_interp, axis=0)
    mean_tpr[-1] = 1.0
    mean_auc = round(float(np.mean(aucs)), 4)
    
    for i in range(len(all_fpr)):
        fpr_v = round(float(all_fpr[i]), 3)
        tpr_v = round(float(mean_tpr[i]), 4)
        lines.append(f'  {{ model: "{name}", fpr: {fpr_v}, tpr: {tpr_v}, auc: {mean_auc} }},')

lines.append("]")

with open(r'C:\Users\imiss\Desktop\roc_output.ts', 'w') as out:
    out.write("\n".join(lines))

print(f"Done! {len(lines)} lines written to roc_output.ts")
