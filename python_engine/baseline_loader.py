from __future__ import annotations

import json
from pathlib import Path
import numpy as np


class FrozenBaseline:
    """
    Read-only frozen baseline for replay deviation analysis.

    - Uses Mahalanobis² distance (χ²-compatible)
    - Deterministic, audit-safe
    - No mutation, no learning at runtime
    """

    def __init__(self, filename: str = "baseline_stats_replay_v2.json"):
        base_dir = Path(__file__).resolve().parent
        path = base_dir / filename

        if not path.exists():
            raise FileNotFoundError(f"Baseline file not found: {path}")

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # -----------------------------
        # Core statistical parameters
        # -----------------------------
        self.mu = np.array(data["mu"], dtype=float)
        self.Sigma = np.array(data["Sigma"], dtype=float)

        if self.Sigma.shape[0] != self.Sigma.shape[1]:
            raise ValueError("Sigma must be a square matrix")

        if self.mu.shape[0] != self.Sigma.shape[0]:
            raise ValueError("mu / Sigma dimension mismatch")

        # Precompute inverse covariance
        self.inv_Sigma = np.linalg.inv(self.Sigma)

        # -----------------------------
        # Metadata (CRITICAL FOR UI)
        # -----------------------------
        self.dimension = int(data.get("dimension", self.mu.shape[0]))

        # ✅ THIS WAS THE BUG — NOW FIXED
        self.features = data.get("features", [])

        self.calibration_count = data.get("calibration_count", 0)
        self.phase = data.get("phase", "unknown")
        self.engine_version = data.get("engine_version", "unknown")
        self.created_at = data.get("created_at", None)

        self.reference = path.name

    # ---------------------------------
    # χ²-compatible distance
    # ---------------------------------
    def mahalanobis_squared(self, x: np.ndarray) -> float:
        """
        Mahalanobis squared distance (χ² statistic).

        This value is compared against χ²(d) thresholds
        where d = self.dimension.
        """
        if x.shape[0] != self.mu.shape[0]:
            raise ValueError("Input vector dimension mismatch")

        delta = x - self.mu
        return float(delta.T @ self.inv_Sigma @ delta)
