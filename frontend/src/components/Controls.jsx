export default function Controls({ simulateAttack, testTransfer, loading }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-8">

      <h2 className="text-xl font-semibold mb-2">
        Simulation Controls
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Execute behavioral replay simulation and test on-chain enforcement logic.
      </p>

      <div className="flex gap-6 flex-wrap">

        {/* Simulate */}
        <button
          onClick={simulateAttack}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium 
                     hover:bg-red-700 transition 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Simulate Replay"}
        </button>

        {/* Transfer Test */}
        <button
          onClick={testTransfer}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium 
                     hover:bg-blue-700 transition"
        >
          Test Transfer Enforcement
        </button>

      </div>
    </div>
  );
}