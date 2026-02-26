import csv
import json
from pathlib import Path
from datetime import datetime

import numpy as np

# --------------------------------------------------
# Portable Paths (No Absolute Windows Paths)
# --------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "logs" / "fusion_calibration.csv"
OUT_PATH = BASE_DIR / "baseline_stats_replay_v2.json"

# --------------------------------------------------
# Load calibration rows (3D: stability, chaos, entropy)
# --------------------------------------------------
X = []

if not CSV_PATH.exists():
    raise FileNotFoundError(f"Calibration CSV not found: {CSV_PATH}")

with open(CSV_PATH, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row.get("bucket") != "calibration":
            continue
        try:
            x = [
                float(row["stability"]),
                float(row["chaos"]),
                float(row["entropy"]),
            ]
            X.append(x)
        except Exception:
            continue

X = np.array(X)

if X.shape[0] < 30:
    raise RuntimeError(f"Not enough calibration samples: {X.shape[0]}")

# --------------------------------------------------
# Compute baseline statistics
# --------------------------------------------------
mu = X.mean(axis=0)
Sigma = np.cov(X, rowvar=False)

# Regularization (important for numerical stability)
Sigma += 1e-6 * np.eye(Sigma.shape[0])

# --------------------------------------------------
# Save baseline file
# --------------------------------------------------
baseline = {
    "mu": mu.tolist(),
    "Sigma": Sigma.tolist(),
    "dimension": 3,
    "features": ["stability", "chaos", "entropy"],
    "calibration_count": int(X.shape[0]),
    "created_at": datetime.utcnow().isoformat() + "Z",
    "phase": "baseline_frozen",
    "engine_version": "replay_v2",
}

with open(OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(baseline, f, indent=2)

print(f"[OK] baseline_stats_replay_v2.json created at {OUT_PATH}")
print("mu =", mu)
print("Sigma diag =", np.diag(Sigma))
print("samples =", X.shape[0])