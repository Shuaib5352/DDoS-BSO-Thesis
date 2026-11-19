"""Historical-style bat search, operating only on development partitions."""

from __future__ import annotations

from time import perf_counter

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score


def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-np.clip(x, -100, 100)))


def decode_hp(z):
    return {
        "n_estimators": int(50 + sigmoid(z[0]) * 350),
        "max_depth": int(5 + sigmoid(z[1]) * 30),
        "min_samples_split": int(2 + sigmoid(z[2]) * 13),
        "max_features": float(0.3 + sigmoid(z[3]) * 0.7),
    }


def search(X_train, y_train, X_val, y_val, *, seed=42, population=25,
           iterations=50, eval_rows=12000, n_jobs=4):
    rng = np.random.default_rng(seed)
    d = X_train.shape[1]
    idx = rng.choice(len(X_train), size=min(eval_rows, len(X_train)), replace=False)
    sub_x, sub_y = X_train[idx], y_train[idx]
    pos = np.zeros((population, d + 4), dtype=np.float64)
    pos[:, :d] = rng.integers(0, 2, size=(population, d))
    pos[:, d:] = rng.normal(0, 0.5, size=(population, 4))
    vel = rng.normal(0, 0.1, size=pos.shape)
    loud = np.full(population, 0.95)
    pulse = np.full(population, 0.5)
    cache = {}
    trajectory = []
    start = perf_counter()

    def fitness(candidate):
        mask = candidate[:d].astype(bool)
        if not mask.any():
            return 1.0
        hp = decode_hp(candidate[d:])
        key = (tuple(np.flatnonzero(mask)), hp["n_estimators"], hp["max_depth"],
               hp["min_samples_split"], round(hp["max_features"], 3))
        if key in cache:
            return cache[key]
        rf = RandomForestClassifier(**hp, class_weight="balanced", random_state=seed,
                                    n_jobs=n_jobs)
        rf.fit(sub_x[:, mask], sub_y)
        pred = rf.predict(X_val[:, mask])
        score = 1 - f1_score(y_val, pred, average="macro", zero_division=0) + 0.01 * mask.mean()
        cache[key] = float(score)
        return float(score)

    fit = np.array([fitness(p) for p in pos])
    best_i = int(np.argmin(fit))
    best, best_fit = pos[best_i].copy(), float(fit[best_i])
    for t in range(iterations):
        for i in range(population):
            freq = 2 * rng.random(d + 4)
            vel[i] += (pos[i] - best) * freq
            feat = (rng.random(d) < sigmoid(vel[i, :d])).astype(float)
            hp_coords = pos[i, d:] + vel[i, d:]
            if rng.random() > pulse[i]:
                feat = best[:d].copy()
                hp_coords = best[d:].copy()
                flips = rng.choice(d, size=min(max(1, int(loud.mean() * 3)), d), replace=False)
                feat[flips] = 1 - feat[flips]
                hp_coords += rng.normal(0, loud.mean() * 0.3, size=4)
            if not feat.any():
                feat[rng.integers(d)] = 1
            cand = np.concatenate([feat, hp_coords])
            cand_fit = fitness(cand)
            if cand_fit < fit[i] or rng.random() < loud[i]:
                pos[i], fit[i] = cand, cand_fit
                loud[i] *= 0.9
                pulse[i] = 0.5 * (1 - np.exp(-0.9 * t))
            if fit[i] < best_fit:
                best, best_fit = pos[i].copy(), float(fit[i])
        trajectory.append({"iteration": t + 1, "best_fitness": best_fit,
                           "selected": int(best[:d].sum()), "unique_evaluations": len(cache)})
        if t % 5 == 4 or t == iterations - 1:
            print(f"BSO seed={seed} iter={t + 1}/{iterations} fitness={best_fit:.6f} selected={int(best[:d].sum())} evals={len(cache)}", flush=True)
    return {"mask": best[:d].astype(bool), "hyperparameters": decode_hp(best[d:]),
            "fitness": best_fit, "trajectory": trajectory, "evaluations": len(cache),
            "seconds": perf_counter() - start, "seed": seed, "population": population,
            "iterations": iterations, "evaluation_rows": len(sub_x)}
