export default function ReplaySelector({ selectedReplay, setSelectedReplay }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-8">

      <h2 className="text-xl font-semibold mb-2">
        Threat Replay Simulation
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Select a historical attack pattern to simulate behavioral risk detection.
      </p>

      <div>
        <select
          value={selectedReplay}
          onChange={(e) => setSelectedReplay(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     transition"
        >
          <option value="safe_wallet_demo.json">
            🟢 Safe Behavior — Normal Activity
          </option>

          <option value="ronin_wallet_demo.json">
            🔴 Ronin Bridge Exploit — Critical
          </option>

          <option value="coincheck_wallet_demo.json">
            🟠 Hot Wallet Drain — High
          </option>

          <option value="mtgox_wallet_demo.json">
            🟡 Exchange Liquidity Breach — Elevated
          </option>
        </select>
      </div>

    </div>
  );
}