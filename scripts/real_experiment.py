#!/usr/bin/env python3
"""
=================================================================================
  MASTER'S THESIS — COMPREHENSIVE EXPERIMENT (v4 - FINAL)
  "Improved Detection of DDoS Attacks Using a Hybrid Machine Learning Framework
   Optimized with Bat Swarm Optimization (BSO) in Dynamic Network Environments"
  Author: SHUAIB AYAD JASIM
=================================================================================
  KEY INNOVATION: BSO jointly optimizes feature selection AND RF hyperparameters
  (n_estimators, max_depth, min_samples_split, max_features_fraction).
  PSO/GA/GWO are compared for feature selection only.
  This is the "Hybrid ML Framework" described in the thesis title.
=================================================================================
"""
import os, sys, json, time, warnings, traceback
import numpy as np
import pandas as pd
from datetime import datetime
from collections import OrderedDict

warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder, label_binarize
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score,
    matthews_corrcoef, roc_curve, auc
)
from scipy import stats

try:
    from imblearn.over_sampling import SMOTE
    HAS_SMOTE = True
except ImportError:
    HAS_SMOTE = False

try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

# =============================================================================
# CONFIGURATION
# =============================================================================
DATA_DIR = r'C:\Users\imiss\Downloads'
try:
    OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
except NameError:
    OUTPUT_DIR = os.path.join(r'C:\Users\imiss\Downloads\b_dSd45QWSjWy', 'public')

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

DATA_FILES = {
    'BenignTraffic': [
        'BenignTraffic.pcap.csv', 'BenignTraffic1.pcap.csv',
        'BenignTraffic2.pcap.csv', 'BenignTraffic3.pcap.csv',
    ],
    'DDoS-SYN_Flood': [
        'DDoS-SYN_Flood.pcap.csv', 'DDoS-SYN_Flood1.pcap.csv',
        'DDoS-SYN_Flood2.pcap.csv', 'DDoS-SYN_Flood3.pcap.csv',
        'DDoS-SYN_Flood4.pcap.csv', 'DDoS-SYN_Flood5.pcap.csv',
        'DDoS-SYN_Flood7.pcap.csv', 'DDoS-SYN_Flood11.pcap.csv',
        'DDoS-SYN_Flood12.pcap.csv', 'DDoS-SYN_Flood13.pcap.csv',
        'DDoS-SYN_Flood14.pcap.csv', 'DDoS-SYN_Flood15.pcap.csv',
    ],
    'DDoS-ACK_Fragmentation': ['DDoS-ACK_Fragmentation.pcap.csv'],
    'Recon-PortScan': ['Recon-PortScan.pcap.csv'],
    'Backdoor_Malware': ['Backdoor_Malware.pcap.csv'],
}

MAX_SAMPLES_PER_CLASS = 25000
CV_FOLDS = 10
FEATURE_PENALTY = 0.01

# BSO Hybrid: joint feature selection + hyperparameter optimization
BSO_POP = 25
BSO_ITER = 50
BSO_EVAL_SUBSAMPLE = 12000
BSO_EVAL_TREES = 30

# Comparison optimizers: feature selection only
COMP_POP = 20
COMP_ITER = 40
COMP_EVAL_SUBSAMPLE = 12000

# Final model
RF_FINAL_TREES = 300

BSO_CONFIG = {
    'frequency_min': 0.0, 'frequency_max': 2.0,
    'initial_loudness': 0.95, 'initial_pulse_rate': 0.5,
    'alpha': 0.9, 'gamma': 0.9,
}

# RF hyperparameter search ranges for BSO
HP_RANGES = {
    'n_estimators': (50, 400),
    'max_depth':    (5, 35),
    'min_samples_split': (2, 15),
    'max_features_frac': (0.3, 1.0),
}


# =============================================================================
# PHASE 1: DATA LOADING
# =============================================================================
def load_data():
    print("=" * 70)
    print("PHASE 1: Loading CICIoT2023 Network Traffic Data")
    print("=" * 70)
    all_frames = []
    class_counts = {}
    for label, files in DATA_FILES.items():
        label_frames = []
        for fname in files:
            fpath = os.path.join(DATA_DIR, fname)
            if not os.path.exists(fpath):
                continue
            df = pd.read_csv(fpath, low_memory=False)
            df['Label'] = label
            label_frames.append(df)
            print(f"  Loaded: {fname} ({len(df):,} samples)")
        if label_frames:
            combined = pd.concat(label_frames, ignore_index=True)
            if len(combined) > MAX_SAMPLES_PER_CLASS:
                combined = combined.sample(n=MAX_SAMPLES_PER_CLASS, random_state=RANDOM_SEED)
                print(f"  >> Capped {label} -> {MAX_SAMPLES_PER_CLASS:,}")
            class_counts[label] = len(combined)
            all_frames.append(combined)
    data = pd.concat(all_frames, ignore_index=True)
    print(f"\n  Total: {len(data):,} samples")
    for lbl, cnt in sorted(class_counts.items()):
        print(f"    {lbl}: {cnt:,}")
    return data, class_counts


# =============================================================================
# PHASE 2: PREPROCESSING + SMOTE
# =============================================================================
def preprocess(data):
    print("\n" + "=" * 70)
    print("PHASE 2: Preprocessing")
    print("=" * 70)
    feature_cols = [c for c in data.columns if c != 'Label']
    X = data[feature_cols].copy()
    y = data['Label'].copy()

    for col in X.columns:
        X[col] = pd.to_numeric(X[col], errors='coerce')
    X.replace([np.inf, -np.inf], np.nan, inplace=True)
    X.fillna(X.median(), inplace=True)

    constant_cols = [c for c in X.columns if X[c].nunique() <= 1]
    if constant_cols:
        X.drop(columns=constant_cols, inplace=True)

    feature_names = list(X.columns)
    n_features = len(feature_names)
    print(f"  Features: {n_features}")

    le = LabelEncoder()
    y_enc = le.fit_transform(y)
    class_names = list(le.classes_)
    n_classes = len(class_names)
    print(f"  Classes: {class_names}")

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 70/10/20 split
    X_trainval, X_test, y_trainval, y_test = train_test_split(
        X_scaled, y_enc, test_size=0.2, random_state=RANDOM_SEED, stratify=y_enc)
    X_train, X_val, y_train, y_val = train_test_split(
        X_trainval, y_trainval, test_size=0.125, random_state=RANDOM_SEED, stratify=y_trainval)

    # SMOTE on training data
    smote_info = {'applied': False}
    pre_smote = dict(zip(*np.unique(y_train, return_counts=True)))
    if HAS_SMOTE:
        k = min(5, min(pre_smote.values()) - 1)
        smote = SMOTE(random_state=RANDOM_SEED, k_neighbors=max(1, k))
        X_train, y_train = smote.fit_resample(X_train, y_train)
        post_smote = dict(zip(*np.unique(y_train, return_counts=True)))
        smote_info = {
            'applied': True,
            'before': {class_names[k]: int(v) for k, v in pre_smote.items()},
            'after': {class_names[k]: int(v) for k, v in post_smote.items()},
            'synthetic': len(X_train) - sum(pre_smote.values()),
        }
        print(f"  SMOTE: {sum(pre_smote.values()):,} -> {len(X_train):,} training samples")

    print(f"  Split: Train={len(X_train):,} | Val={len(X_val):,} | Test={len(X_test):,}")

    return {
        'X_train': X_train, 'X_val': X_val, 'X_test': X_test,
        'y_train': y_train, 'y_val': y_val, 'y_test': y_test,
        'X_train_full': np.vstack([X_train, X_val]),
        'y_train_full': np.concatenate([y_train, y_val]),
        'feature_names': feature_names, 'class_names': class_names,
        'label_encoder': le, 'scaler': scaler,
        'n_features': n_features, 'n_classes': n_classes,
        'smote_info': smote_info,
    }


# =============================================================================
# UTILITY: Evaluate a classifier
# =============================================================================
def evaluate_model(clf, X_train, y_train, X_test, y_test, class_names, n_classes):
    t0 = time.time()
    clf.fit(X_train, y_train)
    train_time = time.time() - t0

    t0 = time.time()
    y_pred = clf.predict(X_test)
    pred_time = (time.time() - t0) / max(1, len(X_test)) * 1000

    y_proba = None
    if hasattr(clf, 'predict_proba'):
        y_proba = clf.predict_proba(X_test)
    elif hasattr(clf, 'decision_function'):
        dec = clf.decision_function(X_test)
        if dec.ndim == 1:
            dec = np.column_stack([-dec, dec])
        exp_d = np.exp(dec - dec.max(axis=1, keepdims=True))
        y_proba = exp_d / exp_d.sum(axis=1, keepdims=True)

    acc = accuracy_score(y_test, y_pred) * 100
    prec_w = precision_score(y_test, y_pred, average='weighted', zero_division=0) * 100
    rec_w = recall_score(y_test, y_pred, average='weighted', zero_division=0) * 100
    f1_w = f1_score(y_test, y_pred, average='weighted', zero_division=0) * 100
    f1_m = f1_score(y_test, y_pred, average='macro', zero_division=0) * 100
    prec_m = precision_score(y_test, y_pred, average='macro', zero_division=0) * 100
    rec_m = recall_score(y_test, y_pred, average='macro', zero_division=0) * 100
    mcc = matthews_corrcoef(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred).tolist()
    report = classification_report(y_test, y_pred, target_names=class_names,
                                    output_dict=True, zero_division=0)

    auc_roc, roc_data = 0.0, []
    if y_proba is not None:
        try:
            y_bin = label_binarize(y_test, classes=list(range(n_classes)))
            auc_roc = roc_auc_score(y_bin, y_proba, average='weighted', multi_class='ovr') * 100
            for ci in range(n_classes):
                fpr_arr, tpr_arr, _ = roc_curve(y_bin[:, ci], y_proba[:, ci])
                step = max(1, len(fpr_arr) // 40)
                roc_data.append({
                    'class': class_names[ci],
                    'fpr': fpr_arr[::step].tolist(), 'tpr': tpr_arr[::step].tolist(),
                    'auc': round(float(auc(fpr_arr, tpr_arr)), 4),
                })
        except Exception:
            pass

    per_class = []
    for cls in class_names:
        if cls in report:
            per_class.append({
                'className': cls,
                'precision': round(report[cls]['precision'] * 100, 2),
                'recall': round(report[cls]['recall'] * 100, 2),
                'f1Score': round(report[cls]['f1-score'] * 100, 2),
                'support': int(report[cls]['support']),
            })

    return {
        'accuracy': round(acc, 2), 'precision': round(prec_w, 2),
        'recall': round(rec_w, 2), 'f1Score': round(f1_w, 2),
        'f1Macro': round(f1_m, 2), 'precisionMacro': round(prec_m, 2),
        'recallMacro': round(rec_m, 2), 'aucRoc': round(auc_roc, 2),
        'mcc': round(mcc, 4), 'trainingTime': round(train_time, 3),
        'predictionTimeMs': round(pred_time, 4),
        'confusionMatrix': cm, 'perClass': per_class, 'rocData': roc_data,
        'clf_': clf,
    }


# =============================================================================
# PHASE 3: BSO — HYBRID OPTIMIZATION (features + hyperparameters)
# =============================================================================
def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-np.clip(x, -500, 500)))


def bso_hybrid_optimize(n_features, X_train, y_train, X_val, y_val):
    """
    BSO jointly optimizes:
      - Binary feature selection (dims 0..n_features-1)
      - RF hyperparameters (dims n_features..n_features+3):
          n_estimators, max_depth, min_samples_split, max_features_frac
    Fitness = 1 - macro_F1 + beta * (n_selected / n_total)
    """
    print("\n  BSO-Hybrid: Joint Feature Selection + Hyperparameter Tuning")
    n_pop = BSO_POP
    n_iter = BSO_ITER
    n_hp = 4  # number of hyperparameters
    d = n_features + n_hp

    # Subsample for fast evaluation
    if len(X_train) > BSO_EVAL_SUBSAMPLE:
        idx = np.random.choice(len(X_train), BSO_EVAL_SUBSAMPLE, replace=False)
        X_tr_sub, y_tr_sub = X_train[idx], y_train[idx]
    else:
        X_tr_sub, y_tr_sub = X_train, y_train

    A0, r0 = BSO_CONFIG['initial_loudness'], BSO_CONFIG['initial_pulse_rate']
    alpha_d, gamma = BSO_CONFIG['alpha'], BSO_CONFIG['gamma']
    f_min, f_max = BSO_CONFIG['frequency_min'], BSO_CONFIG['frequency_max']

    cache = {}
    n_evals = [0]

    def decode_hp(bat_hp):
        """Decode continuous HP values from optimizer space to actual values."""
        hp = bat_hp.copy()
        n_est = int(HP_RANGES['n_estimators'][0] +
                     sigmoid(hp[0]) * (HP_RANGES['n_estimators'][1] - HP_RANGES['n_estimators'][0]))
        max_d = int(HP_RANGES['max_depth'][0] +
                     sigmoid(hp[1]) * (HP_RANGES['max_depth'][1] - HP_RANGES['max_depth'][0]))
        min_ss = int(HP_RANGES['min_samples_split'][0] +
                      sigmoid(hp[2]) * (HP_RANGES['min_samples_split'][1] - HP_RANGES['min_samples_split'][0]))
        max_ff = HP_RANGES['max_features_frac'][0] + \
                  sigmoid(hp[3]) * (HP_RANGES['max_features_frac'][1] - HP_RANGES['max_features_frac'][0])
        return n_est, max_d, min_ss, max_ff

    def fitness(pos):
        feat_mask = pos[:n_features]
        selected = np.where(feat_mask == 1)[0]
        if len(selected) == 0:
            return 1.0
        n_est, max_d, min_ss, max_ff = decode_hp(pos[n_features:])
        key = (tuple(selected), n_est, max_d, min_ss, round(max_ff, 3))
        if key in cache:
            return cache[key]
        n_evals[0] += 1
        clf = RandomForestClassifier(
            n_estimators=n_est, max_depth=max_d,
            min_samples_split=min_ss, max_features=max_ff,
            class_weight='balanced', random_state=RANDOM_SEED, n_jobs=-1)
        clf.fit(X_tr_sub[:, selected], y_tr_sub)
        y_pred = clf.predict(X_val[:, selected])
        f1_m = f1_score(y_val, y_pred, average='macro', zero_division=0)
        fit = 1.0 - f1_m + FEATURE_PENALTY * (len(selected) / n_features)
        cache[key] = fit
        return fit

    # Initialize population
    pos = np.zeros((n_pop, d))
    vel = np.random.randn(n_pop, d) * 0.1
    freq = np.zeros((n_pop, d))
    loud = np.full(n_pop, A0)
    pulse = np.full(n_pop, r0)

    # Initialize feature part (binary) and HP part (continuous)
    for i in range(n_pop):
        pos[i, :n_features] = (np.random.rand(n_features) > 0.5).astype(float)
        if pos[i, :n_features].sum() == 0:
            pos[i, np.random.randint(n_features)] = 1
        pos[i, n_features:] = np.random.randn(n_hp) * 0.5  # sigmoid maps to middle range

    fit_vals = np.array([fitness(p) for p in pos])
    gbi = np.argmin(fit_vals)
    gbest, gbest_fit = pos[gbi].copy(), fit_vals[gbi]
    pbest_fit = fit_vals.copy()
    convergence = []

    for t in range(n_iter):
        for i in range(n_pop):
            freq[i] = f_min + (f_max - f_min) * np.random.rand(d)
            vel[i] += (pos[i] - gbest) * freq[i]

            # Feature part: binary through sigmoid
            cand_feat = (np.random.rand(n_features) < sigmoid(vel[i, :n_features])).astype(float)
            # HP part: continuous update
            cand_hp = pos[i, n_features:] + vel[i, n_features:]

            # Local search with pulse rate
            if np.random.rand() > pulse[i]:
                cand_feat = gbest[:n_features].copy()
                cand_hp = gbest[n_features:].copy()
                n_flips = max(1, int(loud.mean() * 3))
                flip_idx = np.random.choice(n_features, size=min(n_flips, n_features), replace=False)
                cand_feat[flip_idx] = 1 - cand_feat[flip_idx]
                cand_hp += np.random.randn(n_hp) * loud.mean() * 0.3

            if cand_feat.sum() == 0:
                cand_feat[np.random.randint(n_features)] = 1

            cand = np.concatenate([cand_feat, cand_hp])
            cand_fit = fitness(cand)

            if cand_fit < fit_vals[i] or np.random.rand() < loud[i]:
                pos[i], fit_vals[i] = cand, cand_fit
                loud[i] *= alpha_d
                pulse[i] = r0 * (1 - np.exp(-gamma * t))

            if fit_vals[i] < gbest_fit:
                gbest, gbest_fit = pos[i].copy(), fit_vals[i]

        convergence.append({
            'iteration': t, 'bestFitness': round(float(gbest_fit), 6),
            'avgFitness': round(float(fit_vals.mean()), 6),
            'selectedFeatures': int(gbest[:n_features].sum()),
        })
        if t % 10 == 0:
            n_est, max_d, min_ss, max_ff = decode_hp(gbest[n_features:])
            print(f"    iter {t:3d}: fit={gbest_fit:.6f} "
                  f"feats={int(gbest[:n_features].sum())} "
                  f"RF(n={n_est},d={max_d},s={min_ss},f={max_ff:.2f})")

    # Final decode
    selected_idx = np.where(gbest[:n_features] == 1)[0]
    n_est, max_d, min_ss, max_ff = decode_hp(gbest[n_features:])

    return {
        'selectedIndices': selected_idx.tolist(),
        'nSelected': len(selected_idx),
        'reductionPct': round((1 - len(selected_idx) / n_features) * 100, 1),
        'bestFitness': float(gbest_fit),
        'convergence': convergence,
        'nEvaluations': n_evals[0],
        'bestHyperparameters': {
            'n_estimators': n_est, 'max_depth': max_d,
            'min_samples_split': min_ss, 'max_features': round(max_ff, 3),
        },
    }


# =============================================================================
# Feature-Selection-Only Optimizers (for comparison)
# =============================================================================
class FSOptimizer:
    """Feature selection only (no HP tuning)."""
    def __init__(self, n_features, X_train, y_train, X_val, y_val):
        self.n_features = n_features
        if len(X_train) > COMP_EVAL_SUBSAMPLE:
            idx = np.random.choice(len(X_train), COMP_EVAL_SUBSAMPLE, replace=False)
            self.X_tr, self.y_tr = X_train[idx], y_train[idx]
        else:
            self.X_tr, self.y_tr = X_train, y_train
        self.X_val, self.y_val = X_val, y_val
        self.cache = {}
        self.n_evals = 0
        self.convergence = []

    def fitness(self, pos):
        selected = np.where(pos == 1)[0]
        if len(selected) == 0:
            return 1.0
        key = tuple(selected)
        if key in self.cache:
            return self.cache[key]
        self.n_evals += 1
        clf = RandomForestClassifier(
            n_estimators=BSO_EVAL_TREES, max_depth=12,
            class_weight='balanced', random_state=RANDOM_SEED, n_jobs=-1)
        clf.fit(self.X_tr[:, selected], self.y_tr)
        y_pred = clf.predict(self.X_val[:, selected])
        f1_m = f1_score(self.y_val, y_pred, average='macro', zero_division=0)
        fit = 1.0 - f1_m + FEATURE_PENALTY * (len(selected) / self.n_features)
        self.cache[key] = fit
        return fit

    def ensure(self, pos):
        if pos.sum() == 0:
            pos[np.random.randint(self.n_features)] = 1
        return pos


class PSOFeatureSelect(FSOptimizer):
    def optimize(self):
        n, d = COMP_POP, self.n_features
        pos = (np.random.rand(n, d) > 0.5).astype(float)
        vel = np.random.randn(n, d) * 0.1
        fit_vals = np.array([self.fitness(self.ensure(p)) for p in pos])
        pbest, pbest_fit = pos.copy(), fit_vals.copy()
        gbi = np.argmin(fit_vals)
        gbest, gbest_fit = pos[gbi].copy(), fit_vals[gbi]
        for t in range(COMP_ITER):
            w = 0.9 - 0.5 * t / COMP_ITER
            for i in range(n):
                r1, r2 = np.random.rand(d), np.random.rand(d)
                vel[i] = w * vel[i] + 1.5 * r1 * (pbest[i] - pos[i]) + 1.5 * r2 * (gbest - pos[i])
                cand = (np.random.rand(d) < sigmoid(vel[i])).astype(float)
                cand = self.ensure(cand)
                f = self.fitness(cand)
                pos[i], fit_vals[i] = cand, f
                if f < pbest_fit[i]: pbest[i], pbest_fit[i] = cand.copy(), f
                if f < gbest_fit: gbest, gbest_fit = cand.copy(), f
            self.convergence.append({'iteration': t, 'bestFitness': round(float(gbest_fit), 6),
                                     'selectedFeatures': int(gbest.sum())})
        return np.where(gbest == 1)[0], gbest_fit


class GAFeatureSelect(FSOptimizer):
    def optimize(self):
        n, d = COMP_POP, self.n_features
        pop = np.array([self.ensure((np.random.rand(d) > 0.5).astype(float)) for _ in range(n)])
        fit_vals = np.array([self.fitness(p) for p in pop])
        gbi = np.argmin(fit_vals)
        gbest, gbest_fit = pop[gbi].copy(), fit_vals[gbi]
        for t in range(COMP_ITER):
            new_pop = []
            for _ in range(n):
                i, j = np.random.choice(n, 2, replace=False)
                new_pop.append(pop[i].copy() if fit_vals[i] < fit_vals[j] else pop[j].copy())
            for i in range(0, n - 1, 2):
                if np.random.rand() < 0.8:
                    pt = np.random.randint(1, d)
                    c1 = np.concatenate([new_pop[i][:pt], new_pop[i+1][pt:]])
                    c2 = np.concatenate([new_pop[i+1][:pt], new_pop[i][pt:]])
                    new_pop[i], new_pop[i+1] = c1, c2
            for i in range(n):
                mask = np.random.rand(d) < 0.05
                new_pop[i][mask] = 1 - new_pop[i][mask]
                new_pop[i] = self.ensure(new_pop[i])
            new_pop[0] = gbest.copy()
            pop = np.array(new_pop)
            fit_vals = np.array([self.fitness(p) for p in pop])
            bi = np.argmin(fit_vals)
            if fit_vals[bi] < gbest_fit: gbest, gbest_fit = pop[bi].copy(), fit_vals[bi]
            self.convergence.append({'iteration': t, 'bestFitness': round(float(gbest_fit), 6),
                                     'selectedFeatures': int(gbest.sum())})
        return np.where(gbest == 1)[0], gbest_fit


class GWOFeatureSelect(FSOptimizer):
    def optimize(self):
        n, d = COMP_POP, self.n_features
        pos = np.array([self.ensure((np.random.rand(d) > 0.5).astype(float)) for _ in range(n)])
        fit_vals = np.array([self.fitness(p) for p in pos])
        si = np.argsort(fit_vals)
        alpha, af = pos[si[0]].copy(), fit_vals[si[0]]
        beta, bf = pos[si[1]].copy(), fit_vals[si[1]]
        delta, df = pos[si[2]].copy(), fit_vals[si[2]]
        gbest, gbest_fit = alpha.copy(), af
        for t in range(COMP_ITER):
            a = 2 - 2 * t / COMP_ITER
            for i in range(n):
                x1 = alpha - (2*a*np.random.rand(d)-a) * np.abs(2*np.random.rand(d)*alpha - pos[i])
                x2 = beta  - (2*a*np.random.rand(d)-a) * np.abs(2*np.random.rand(d)*beta  - pos[i])
                x3 = delta - (2*a*np.random.rand(d)-a) * np.abs(2*np.random.rand(d)*delta - pos[i])
                avg = (x1 + x2 + x3) / 3
                cand = (np.random.rand(d) < sigmoid(avg)).astype(float)
                cand = self.ensure(cand)
                f = self.fitness(cand)
                pos[i], fit_vals[i] = cand, f
            si = np.argsort(fit_vals)
            if fit_vals[si[0]] < af: alpha, af = pos[si[0]].copy(), fit_vals[si[0]]
            if fit_vals[si[1]] < bf: beta, bf = pos[si[1]].copy(), fit_vals[si[1]]
            if fit_vals[si[2]] < df: delta, df = pos[si[2]].copy(), fit_vals[si[2]]
            if af < gbest_fit: gbest, gbest_fit = alpha.copy(), af
            self.convergence.append({'iteration': t, 'bestFitness': round(float(gbest_fit), 6),
                                     'selectedFeatures': int(gbest.sum())})
        return np.where(gbest == 1)[0], gbest_fit


# =============================================================================
# PHASE 3: RUN ALL OPTIMIZERS
# =============================================================================
def run_optimization(prep):
    print("\n" + "=" * 70)
    print("PHASE 3: Meta-Heuristic Optimization")
    print("=" * 70)

    X_tr, y_tr = prep['X_train'], prep['y_train']
    X_vl, y_vl = prep['X_val'], prep['y_val']
    nf = prep['n_features']

    # --- BSO-Hybrid (Proposed Method) ---
    print(f"\n  === BSO-Hybrid (pop={BSO_POP}, iter={BSO_ITER}) ===")
    t0 = time.time()
    bso_result = bso_hybrid_optimize(nf, X_tr, y_tr, X_vl, y_vl)
    bso_time = time.time() - t0
    bso_result['elapsedTime'] = round(bso_time, 2)
    bso_result['selectedFeatureNames'] = [prep['feature_names'][i] for i in bso_result['selectedIndices']]
    print(f"    DONE: {bso_result['nSelected']}/{nf} features, "
          f"fit={bso_result['bestFitness']:.6f}, time={bso_time:.1f}s")
    print(f"    Best RF config: {bso_result['bestHyperparameters']}")

    # --- Comparison optimizers (feature selection only) ---
    comp_results = {}
    for name, OptClass in [('PSO', PSOFeatureSelect), ('GA', GAFeatureSelect), ('GWO', GWOFeatureSelect)]:
        print(f"\n  === {name} (pop={COMP_POP}, iter={COMP_ITER}) ===")
        t0 = time.time()
        opt = OptClass(nf, X_tr, y_tr, X_vl, y_vl)
        sel_idx, best_fit = opt.optimize()
        elapsed = time.time() - t0
        comp_results[name] = {
            'selectedIndices': sel_idx.tolist(),
            'selectedFeatureNames': [prep['feature_names'][i] for i in sel_idx],
            'nSelected': len(sel_idx),
            'reductionPct': round((1 - len(sel_idx) / nf) * 100, 1),
            'bestFitness': float(best_fit),
            'convergence': opt.convergence,
            'elapsedTime': round(elapsed, 2),
            'nEvaluations': opt.n_evals,
        }
        print(f"    DONE: {len(sel_idx)}/{nf} features, "
              f"fit={best_fit:.6f}, time={elapsed:.1f}s")

    return bso_result, comp_results


# =============================================================================
# PHASE 4: TRAIN & EVALUATE ALL MODELS
# =============================================================================
def train_all_models(prep, bso_result, comp_results):
    print("\n" + "=" * 70)
    print("PHASE 4: Model Training & Evaluation")
    print("=" * 70)

    X_train, X_test = prep['X_train'], prep['X_test']
    y_train, y_test = prep['y_train'], prep['y_test']
    cn, nc = prep['class_names'], prep['n_classes']
    nf = prep['n_features']
    results = OrderedDict()

    # ============ 1) BSO-Hybrid RF (Proposed) ============
    bso_idx = np.array(bso_result['selectedIndices'])
    hp = bso_result['bestHyperparameters']
    print(f"\n  >> BSO-Hybrid RF (Proposed) - {len(bso_idx)} features, "
          f"RF({hp['n_estimators']},d={hp['max_depth']},s={hp['min_samples_split']},f={hp['max_features']})")
    clf = RandomForestClassifier(
        n_estimators=hp['n_estimators'], max_depth=hp['max_depth'],
        min_samples_split=hp['min_samples_split'], max_features=hp['max_features'],
        class_weight='balanced', random_state=RANDOM_SEED, n_jobs=-1)
    res = evaluate_model(clf, X_train[:, bso_idx], y_train,
                          X_test[:, bso_idx], y_test, cn, nc)
    res['name'] = 'BSO-Hybrid RF (Proposed)'
    res['featuresUsed'] = len(bso_idx)
    res['featureSet'] = 'BSO'
    results['BSO-Hybrid RF (Proposed)'] = res
    print(f"     Acc={res['accuracy']}% F1w={res['f1Score']}% F1m={res['f1Macro']}% AUC={res['aucRoc']}%")

    # ============ 2) BSO-SVM ============
    print(f"\n  >> BSO-SVM - {len(bso_idx)} features")
    clf = CalibratedClassifierCV(
        LinearSVC(max_iter=2000, class_weight='balanced', random_state=RANDOM_SEED), cv=3)
    res = evaluate_model(clf, X_train[:, bso_idx], y_train,
                          X_test[:, bso_idx], y_test, cn, nc)
    res['name'] = 'BSO-SVM'
    res['featuresUsed'] = len(bso_idx)
    res['featureSet'] = 'BSO'
    results['BSO-SVM'] = res
    print(f"     Acc={res['accuracy']}% F1w={res['f1Score']}% F1m={res['f1Macro']}% AUC={res['aucRoc']}%")

    # ============ 3) Other optimizers + RF (default params) ============
    for opt_name in ['PSO', 'GA', 'GWO']:
        idx = np.array(comp_results[opt_name]['selectedIndices'])
        label = f'{opt_name}-RF'
        print(f"\n  >> {label} - {len(idx)} features")
        clf = RandomForestClassifier(n_estimators=RF_FINAL_TREES, class_weight='balanced',
                                      random_state=RANDOM_SEED, n_jobs=-1)
        res = evaluate_model(clf, X_train[:, idx], y_train,
                              X_test[:, idx], y_test, cn, nc)
        res['name'] = label
        res['featuresUsed'] = len(idx)
        res['featureSet'] = opt_name
        results[label] = res
        print(f"     Acc={res['accuracy']}% F1w={res['f1Score']}% F1m={res['f1Macro']}% AUC={res['aucRoc']}%")

    # ============ 4) Baselines (all features, default params) ============
    baselines = [
        ('Random Forest', RandomForestClassifier(
            n_estimators=RF_FINAL_TREES, class_weight='balanced',
            random_state=RANDOM_SEED, n_jobs=-1)),
        ('SVM (Linear)', CalibratedClassifierCV(
            LinearSVC(max_iter=2000, class_weight='balanced',
                      random_state=RANDOM_SEED), cv=3)),
        ('Decision Tree', DecisionTreeClassifier(
            class_weight='balanced', random_state=RANDOM_SEED)),
        ('KNN', KNeighborsClassifier(n_neighbors=5, n_jobs=-1)),
        ('Naive Bayes', GaussianNB()),
        ('Logistic Regression', LogisticRegression(
            max_iter=2000, class_weight='balanced',
            random_state=RANDOM_SEED, n_jobs=-1)),
    ]
    if HAS_XGB:
        baselines.append(('XGBoost', XGBClassifier(
            n_estimators=200, max_depth=8, learning_rate=0.1,
            random_state=RANDOM_SEED, n_jobs=-1,
            eval_metric='mlogloss', verbosity=0)))

    for model_name, clf in baselines:
        print(f"\n  >> {model_name} - {nf} features (all)")
        res = evaluate_model(clf, X_train, y_train, X_test, y_test, cn, nc)
        res['name'] = model_name
        res['featuresUsed'] = nf
        res['featureSet'] = 'All'
        results[model_name] = res
        print(f"     Acc={res['accuracy']}% F1w={res['f1Score']}% F1m={res['f1Macro']}% AUC={res['aucRoc']}%")

    return results


# =============================================================================
# PHASE 5: CROSS-VALIDATION (simplified - only RF models for speed)
# =============================================================================
def run_cv(prep, bso_result, model_results):
    print("\n" + "=" * 70)
    print(f"PHASE 5: {CV_FOLDS}-Fold Stratified Cross-Validation")
    print("=" * 70)

    bso_idx = np.array(bso_result['selectedIndices'])
    hp = bso_result['bestHyperparameters']
    X, y = prep['X_train_full'], prep['y_train_full']
    skf = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=RANDOM_SEED)

    cv_models = [
        ('BSO-Hybrid RF (Proposed)', lambda: RandomForestClassifier(
            n_estimators=hp['n_estimators'], max_depth=hp['max_depth'],
            min_samples_split=hp['min_samples_split'], max_features=hp['max_features'],
            class_weight='balanced', random_state=RANDOM_SEED, n_jobs=-1), bso_idx),
        ('Random Forest', lambda: RandomForestClassifier(
            n_estimators=RF_FINAL_TREES, class_weight='balanced',
            random_state=RANDOM_SEED, n_jobs=-1), None),
        ('Decision Tree', lambda: DecisionTreeClassifier(
            class_weight='balanced', random_state=RANDOM_SEED), None),
        ('Logistic Regression', lambda: LogisticRegression(
            max_iter=2000, class_weight='balanced',
            random_state=RANDOM_SEED, n_jobs=-1), None),
    ]

    cv_results = {}
    for name, clf_fn, fi in cv_models:
        Xc = X[:, fi] if fi is not None else X
        acc_s, f1_s, prec_s, rec_s = [], [], [], []
        for tr_i, te_i in skf.split(Xc, y):
            clf = clf_fn()
            clf.fit(Xc[tr_i], y[tr_i])
            yp = clf.predict(Xc[te_i])
            acc_s.append(accuracy_score(y[te_i], yp) * 100)
            f1_s.append(f1_score(y[te_i], yp, average='macro', zero_division=0) * 100)
            prec_s.append(precision_score(y[te_i], yp, average='macro', zero_division=0) * 100)
            rec_s.append(recall_score(y[te_i], yp, average='macro', zero_division=0) * 100)
        cv_results[name] = {
            'folds': CV_FOLDS,
            'accuracy': {'scores': [round(s, 2) for s in acc_s],
                         'mean': round(np.mean(acc_s), 2), 'std': round(np.std(acc_s), 3)},
            'f1Macro': {'scores': [round(s, 2) for s in f1_s],
                        'mean': round(np.mean(f1_s), 2), 'std': round(np.std(f1_s), 3)},
            'precision': {'scores': [round(s, 2) for s in prec_s],
                          'mean': round(np.mean(prec_s), 2), 'std': round(np.std(prec_s), 3)},
            'recall': {'scores': [round(s, 2) for s in rec_s],
                       'mean': round(np.mean(rec_s), 2), 'std': round(np.std(rec_s), 3)},
        }
        print(f"  {name:35s}: Acc={cv_results[name]['accuracy']['mean']:.2f}% "
              f"F1m={cv_results[name]['f1Macro']['mean']:.2f}%")
    return cv_results


# =============================================================================
# PHASE 6: STATISTICAL TESTS
# =============================================================================
def run_stats(cv_results):
    print("\n" + "=" * 70)
    print("PHASE 6: Statistical Significance Tests")
    print("=" * 70)

    base = 'BSO-Hybrid RF (Proposed)'
    base_scores = cv_results[base]['f1Macro']['scores']
    tests = []

    for name, cv in cv_results.items():
        if name == base:
            continue
        other = cv['f1Macro']['scores']
        t_stat, t_p = stats.ttest_rel(base_scores, other)
        try:
            w_stat, w_p = stats.wilcoxon(base_scores, other)
        except:
            w_stat, w_p = 0, 1.0
        imp = np.mean(base_scores) - np.mean(other)
        diff = np.array(base_scores) - np.array(other)
        d = np.mean(diff) / (np.std(diff) + 1e-10)
        tests.append({
            'comparison': f'BSO-Hybrid vs {name}',
            'improvement': round(imp, 2),
            'tTest': {'tStatistic': round(t_stat, 4), 'pValue': round(t_p, 6),
                      'significant': bool(t_p < 0.05)},
            'wilcoxon': {'wStatistic': round(w_stat, 4), 'pValue': round(w_p, 6),
                         'significant': bool(w_p < 0.05)},
            'cohenD': round(d, 4),
            'effectSize': 'large' if abs(d) > 0.8 else ('medium' if abs(d) > 0.5 else 'small'),
        })
        sig = "SIG" if t_p < 0.05 else "n.s."
        print(f"  vs {name:30s}: {sig} p={t_p:.6f} imp={imp:+.2f}%  d={d:.3f}")
    return tests


# =============================================================================
# PHASE 7: DYNAMIC ENVIRONMENT TESTS
# =============================================================================
def test_dynamic(prep, bso_result):
    print("\n" + "=" * 70)
    print("PHASE 7: Dynamic Network Environment Tests")
    print("=" * 70)

    bso_idx = np.array(bso_result['selectedIndices'])
    hp = bso_result['bestHyperparameters']
    cn = prep['class_names']
    X_train, y_train = prep['X_train'], prep['y_train']
    X_test, y_test = prep['X_test'], prep['y_test']
    results = {}

    # Train BSO-Hybrid model
    clf = RandomForestClassifier(
        n_estimators=hp['n_estimators'], max_depth=hp['max_depth'],
        min_samples_split=hp['min_samples_split'], max_features=hp['max_features'],
        class_weight='balanced', random_state=RANDOM_SEED, n_jobs=-1)
    clf.fit(X_train[:, bso_idx], y_train)

    # Test 1: Noise Robustness
    print("\n  --- Noise Robustness ---")
    noise_res = []
    for noise in [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30]:
        Xn = X_test[:, bso_idx] + np.random.normal(0, noise, X_test[:, bso_idx].shape)
        yp = clf.predict(Xn)
        a = accuracy_score(y_test, yp) * 100
        f = f1_score(y_test, yp, average='macro', zero_division=0) * 100
        noise_res.append({
            'noiseLevel': noise, 'accuracy': round(a, 2), 'f1Macro': round(f, 2),
            'degradation': round(noise_res[0]['accuracy'] - a, 2) if noise_res else 0})
        print(f"    noise={noise:.0%}: Acc={a:.2f}% F1m={f:.2f}%")
    results['noiseRobustness'] = noise_res

    # Test 2: Unknown Attack Detection
    print("\n  --- Unknown Attack Detection ---")
    unknown_res = []
    benign_i = cn.index('BenignTraffic')
    attack_classes = [i for i, c in enumerate(cn) if c != 'BenignTraffic']
    for exc in attack_classes:
        m_tr = y_train != exc
        m_te_unk = y_test == exc
        clf2 = RandomForestClassifier(
            n_estimators=hp['n_estimators'], max_depth=hp['max_depth'],
            min_samples_split=hp['min_samples_split'], max_features=hp['max_features'],
            class_weight='balanced', random_state=RANDOM_SEED, n_jobs=-1)
        clf2.fit(X_train[m_tr][:, bso_idx], y_train[m_tr])
        if m_te_unk.sum() > 0:
            yp = clf2.predict(X_test[m_te_unk][:, bso_idx])
            det = (yp != benign_i).sum() / m_te_unk.sum() * 100
        else:
            det = 0
        unknown_res.append({
            'excludedAttack': cn[exc], 'detectionRate': round(det, 2),
            'unknownSamples': int(m_te_unk.sum())})
        print(f"    Exclude '{cn[exc]}': {det:.1f}% detected as attack")
    results['unknownAttackDetection'] = unknown_res

    # Test 3: Throughput
    print("\n  --- Throughput Scalability ---")
    throughput = []
    for bs in [100, 500, 1000, 5000, len(X_test)]:
        bs = min(bs, len(X_test))
        Xb = X_test[:bs, :][:, bso_idx]
        t0 = time.time()
        for _ in range(5):
            clf.predict(Xb)
        el = (time.time() - t0) / 5
        throughput.append({
            'batchSize': bs, 'avgTimeMs': round(el * 1000, 2),
            'samplesPerSecond': round(bs / el), 'msPerSample': round(el / bs * 1000, 4)})
        print(f"    batch={bs:6d}: {bs/el:,.0f} samples/sec")
    results['throughput'] = throughput

    # Test 4: Learning Curve
    print("\n  --- Learning Curve ---")
    lc = []
    for frac in [0.1, 0.2, 0.3, 0.5, 0.7, 1.0]:
        n = int(len(X_train) * frac)
        idx = np.random.choice(len(X_train), n, replace=False)
        c = RandomForestClassifier(
            n_estimators=hp['n_estimators'], max_depth=hp['max_depth'],
            min_samples_split=hp['min_samples_split'], max_features=hp['max_features'],
            class_weight='balanced', random_state=RANDOM_SEED, n_jobs=-1)
        t0 = time.time()
        c.fit(X_train[idx][:, bso_idx], y_train[idx])
        tt = time.time() - t0
        yp = c.predict(X_test[:, bso_idx])
        a = accuracy_score(y_test, yp) * 100
        f = f1_score(y_test, yp, average='macro', zero_division=0) * 100
        lc.append({'fraction': frac, 'nSamples': n, 'accuracy': round(a, 2),
                   'f1Macro': round(f, 2), 'trainingTime': round(tt, 3)})
        print(f"    {frac:.0%} ({n:,} samples): Acc={a:.2f}% F1m={f:.2f}%")
    results['learningCurve'] = lc

    return results


# =============================================================================
# PHASE 8: FEATURE IMPORTANCE
# =============================================================================
def analyze_features(prep, bso_result):
    print("\n" + "=" * 70)
    print("PHASE 8: Feature Importance")
    print("=" * 70)

    bso_idx = np.array(bso_result['selectedIndices'])
    hp = bso_result['bestHyperparameters']
    clf = RandomForestClassifier(
        n_estimators=hp['n_estimators'], max_depth=hp['max_depth'],
        min_samples_split=hp['min_samples_split'], max_features=hp['max_features'],
        class_weight='balanced', random_state=RANDOM_SEED, n_jobs=-1)
    clf.fit(prep['X_train'][:, bso_idx], prep['y_train'])

    imp = clf.feature_importances_
    fn = [prep['feature_names'][i] for i in bso_idx]
    si = np.argsort(imp)[::-1]

    selected = []
    for rank, i in enumerate(si):
        selected.append({
            'rank': rank + 1, 'name': fn[i],
            'importance': round(float(imp[i]), 6), 'originalIndex': int(bso_idx[i])})
        if rank < 10:
            print(f"  #{rank+1:2d} {fn[i]:25s}: {imp[i]:.6f}")

    # Full importance for comparison
    clf_all = RandomForestClassifier(n_estimators=RF_FINAL_TREES, class_weight='balanced',
                                      random_state=RANDOM_SEED, n_jobs=-1)
    clf_all.fit(prep['X_train'], prep['y_train'])
    all_imp = clf_all.feature_importances_
    all_feat = [{'name': prep['feature_names'][i], 'importance': round(float(all_imp[i]), 6),
                 'selectedByBSO': int(i) in bso_idx.tolist()} for i in np.argsort(all_imp)[::-1]]

    return {'bsoSelected': selected, 'allFeatures': all_feat}


# =============================================================================
# MAIN
# =============================================================================
def main():
    print("\n" + "#" * 70)
    print("  MASTER'S THESIS - COMPREHENSIVE EXPERIMENT v4")
    print("  " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print("#" * 70)
    t_start = time.time()

    data, class_counts = load_data()
    prep = preprocess(data)

    bso_result, comp_results = run_optimization(prep)
    model_results = train_all_models(prep, bso_result, comp_results)
    cv_results = run_cv(prep, bso_result, model_results)
    stat_tests = run_stats(cv_results)
    dynamic = test_dynamic(prep, bso_result)
    feat_analysis = analyze_features(prep, bso_result)

    total_time = time.time() - t_start

    # Build efficiency data
    efficiency = []
    for name, res in model_results.items():
        efficiency.append({
            'model': name, 'trainingTime': res['trainingTime'],
            'predictionTimeMs': res['predictionTimeMs'],
            'featuresUsed': res['featuresUsed'], 'featureSet': res['featureSet']})

    # State of the art comparison
    bso_main = model_results['BSO-Hybrid RF (Proposed)']
    sota = [
        {'paper': 'Neto et al. (2023)', 'dataset': 'CICIoT2023',
         'method': 'Random Forest', 'accuracy': 99.0, 'f1Score': 98.0,
         'note': 'Binary classification (benign vs attack)'},
        {'paper': 'Ferrag et al. (2023)', 'dataset': 'CICIoT2023',
         'method': 'DNN', 'accuracy': 98.2, 'f1Score': 97.5,
         'note': 'Binary classification, deep learning'},
        {'paper': 'Proposed (BSO-Hybrid RF)', 'dataset': 'CICIoT2023',
         'method': 'BSO-Hybrid RF', 'accuracy': bso_main['accuracy'],
         'f1Score': bso_main['f1Score'],
         'note': f'5-class multi-class, BSO optimization, SMOTE, {bso_main["featuresUsed"]} features'},
    ]

    # Clean results (remove clf objects)
    clean_models = OrderedDict()
    for name, res in model_results.items():
        clean_models[name] = {k: v for k, v in res.items() if k != 'clf_'}

    output = {
        'experimentInfo': {
            'title': 'Improved Detection of DDoS Attacks Using a Hybrid Machine Learning '
                     'Framework Optimized with Bat Swarm Optimization (BSO) in Dynamic '
                     'Network Environments',
            'author': 'SHUAIB AYAD JASIM',
            'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'randomSeed': RANDOM_SEED,
            'totalExperimentTime': round(total_time, 1),
        },
        'datasetStatistics': {
            'name': 'CICIoT2023 - Real Network Traffic',
            'totalFeatures': prep['n_features'],
            'selectedFeatures': bso_result['nSelected'],
            'featureNames': prep['feature_names'],
            'selectedFeatureNames': bso_result['selectedFeatureNames'],
            'classNames': prep['class_names'],
            'originalClassCounts': class_counts,
            'preprocessed': {
                'totalSamples': len(prep['X_train']) + len(prep['X_val']) + len(prep['X_test']),
                'trainingSamples': len(prep['X_train']),
                'validationSamples': len(prep['X_val']),
                'testingSamples': len(prep['X_test']),
            },
            'smoteInfo': prep['smote_info'],
        },
        'bsoParameters': {
            'population_size': BSO_POP, 'max_iterations': BSO_ITER,
            **BSO_CONFIG,
            'fitnessFunction': '1 - F1_macro + 0.01 * (n_selected / n_total)',
            'hyperparameterRanges': HP_RANGES,
            'optimizedHyperparameters': bso_result['bestHyperparameters'],
        },
        'featureSelectionComparison': {
            'BSO': {k: v for k, v in bso_result.items() if k != 'convergence'},
            **{k: {kk: vv for kk, vv in v.items() if kk != 'convergence'}
               for k, v in comp_results.items()},
        },
        'convergenceData': {
            'BSO': bso_result['convergence'],
            **{k: v['convergence'] for k, v in comp_results.items()},
        },
        'modelResults': clean_models,
        'crossValidation': cv_results,
        'statisticalTests': stat_tests,
        'dynamicEnvironment': dynamic,
        'featureImportance': feat_analysis,
        'computationalEfficiency': {'models': efficiency},
        'stateOfTheArt': sota,
    }

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_path = os.path.join(OUTPUT_DIR, 'experiment_results.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False, default=str)

    print(f"\n  Results saved to: {out_path}")
    print(f"  File size: {os.path.getsize(out_path) / 1024:.1f} KB")

    # Summary
    print("\n" + "=" * 70)
    print("  FINAL RESULTS SUMMARY")
    print("=" * 70)
    print(f"  Total time: {total_time:.1f}s ({total_time/60:.1f} min)")
    print(f"\n  BSO-Hybrid: {bso_result['nSelected']}/{prep['n_features']} features "
          f"({bso_result['reductionPct']}% reduction)")
    print(f"  Optimized RF: {bso_result['bestHyperparameters']}")
    print(f"\n  MODEL COMPARISON:")
    for name, res in model_results.items():
        print(f"    {name:35s}: Acc={res['accuracy']:6.2f}% F1m={res['f1Macro']:6.2f}% "
              f"AUC={res['aucRoc']:6.2f}% ({res['featuresUsed']}f)")
    print(f"\n  STATISTICAL SIGNIFICANCE:")
    for t in stat_tests:
        sig = "SIG" if t['tTest']['significant'] else "n.s."
        print(f"    {t['comparison']:40s}: {sig} p={t['tTest']['pValue']:.6f} {t['improvement']:+.2f}%")
    print("\n" + "#" * 70)
    print("  EXPERIMENT COMPLETE")
    print("#" * 70)


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print(f"\n\nFATAL ERROR: {e}")
        traceback.print_exc()
        sys.exit(1)
