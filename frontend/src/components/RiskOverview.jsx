export default function RiskOverview({ risk, mode, deviation }) {

  let modeStyle = "";
  let riskColor = "text-gray-900";

  if (mode === "LOCKDOWN") {
    modeStyle = "bg-red-600 text-white";
    riskColor = "text-red-600";
  } else if (mode === "WARNING") {
    modeStyle = "bg-orange-500 text-white";
    riskColor = "text-orange-500";
  } else {
    modeStyle = "bg-green-600 text-white";
    riskColor = "text-green-600";
  }

  const deviationPercent =
    deviation !== null ? Math.round(deviation * 100) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-8">

      <div className="flex justify-between items-center">

        {/* Network */}
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
            Network
          </p>
          <p className="text-lg font-medium">
            BSC Testnet
          </p>
        </div>

        {/* Risk Score */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
            On-Chain Risk Score
          </p>

          <p className={`text-4xl font-bold ${riskColor}`}>
            {risk}
          </p>

          {deviation !== null && (
            <p className="text-sm text-gray-500 mt-2">
              Behavioral Deviation: {deviationPercent}%
            </p>
          )}
        </div>

        {/* Mode */}
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2 text-right">
            System Mode
          </p>

          <span className={`px-4 py-2 rounded-full text-xs font-bold ${modeStyle}`}>
            {mode}
          </span>
        </div>

      </div>

    </div>
  );
}