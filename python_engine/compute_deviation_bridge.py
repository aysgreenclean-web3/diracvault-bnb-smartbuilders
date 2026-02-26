import sys
import json
from pathlib import Path
import numpy as np

from baseline_loader import FrozenBaseline


BASE_DIR = Path(__file__).resolve().parent
BASELINE_PATH = BASE_DIR / "baseline_stats_replay_v2.json"
WALLET_DIR = BASE_DIR / "wallet"


def main():
    try:
        raw = sys.stdin.read()
        payload = json.loads(raw)

        wallet_file = payload.get("wallet_file")

        if not wallet_file:
            raise ValueError("wallet_file missing")

        wallet_path = WALLET_DIR / wallet_file

        if not wallet_path.exists():
            raise FileNotFoundError(f"{wallet_file} not found")

        with open(wallet_path, "r", encoding="utf-8") as f:
            wallet_data = json.load(f)

        # Take last behavioral vector
        last_vector = wallet_data[-1]["vector"]
        x = np.array(last_vector, dtype=float)

        baseline = FrozenBaseline(str(BASELINE_PATH))

        # Mahalanobis² deviation
        deviation = baseline.mahalanobis_squared(x)

        # -----------------------------------------
        # Risk normalization strategy
        # -----------------------------------------
        # For 3D χ²:
        # Mean ≈ 3
        # Moderate anomaly ≈ 10–20
        # Strong anomaly ≈ 50+
        #
        # We map deviation directly into 0–100 range
        # while capping extreme values.

        risk_score = min(100, int(deviation))

        result = {
            "vector": last_vector,
            "deviation": deviation,
            "riskScore": risk_score
        }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    main()