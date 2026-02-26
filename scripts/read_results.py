import json
d = json.load(open(r'C:\Users\imiss\Downloads\b_dSd45QWSjWy\public\experiment_results.json', 'r', encoding='utf-8'))

print('Date:', d['experimentInfo']['date'])
print('Time:', d['experimentInfo'].get('totalExperimentTime', 'N/A'), 's')

print('\nKEY RESULTS:')
for k, v in d['modelResults'].items():
    print(f"  {k:30s}: Acc={v['accuracy']}% F1={v['f1Score']}% F1mac={v['f1Macro']}% AUC={v['aucRoc']}%")

print('\nSTATISTICAL TESTS:')
for t in d['statisticalTests']:
    print(f"  {t['comparison']:40s}: p={t['tTest']['pValue']:.6f} sig={t['tTest']['significant']} {t['improvementPct']}")

print('\nFEATURE SELECTION:')
for k, v in d['featureSelectionComparison'].items():
    print(f"  {k}: {v['nSelected']} features, fitness={v['bestFitness']:.4f}, time={v['elapsedTime']}s")

print('\nCROSS-VALIDATION:')
for k, v in d['crossValidation'].items():
    print(f"  {k:30s}: Acc={v['accuracy']['mean']}%+/-{v['accuracy']['std']} F1mac={v['f1Macro']['mean']}%")

print('\nDYNAMIC ENV - Noise:')
for nr in d['dynamicEnvironment']['noiseRobustness']:
    print(f"  noise={nr['noiseLevel']:.0%}: Acc={nr['accuracy']}% F1mac={nr['f1Macro']}%")

print('\nDYNAMIC ENV - Unknown Attack:')
for ua in d['dynamicEnvironment']['unknownAttackDetection']:
    print(f"  Exclude '{ua['excludedAttack']}': Det={ua['unknownDetectionRate']}%")

print('\nSMOTE:', d['datasetStatistics']['smoteInfo'])
