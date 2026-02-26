export default function AttackIntelligence({ attackInfo }) {
  if (!attackInfo) return null;

  const {
    label = "Unknown Pattern",
    severity = "LOW",
    explanation = "No threat analysis available."
  } = attackInfo;

  let borderStyle = "";
  let badgeStyle = "";
  let bgStyle = "";

  if (severity === "CRITICAL") {
    borderStyle = "border-red-600";
    badgeStyle = "bg-red-600 text-white";
    bgStyle = "bg-red-100";
  } else if (severity === "HIGH") {
    borderStyle = "border-orange-500";
    badgeStyle = "bg-orange-500 text-white";
    bgStyle = "bg-orange-50";
  } else {
    borderStyle = "border-green-500";
    badgeStyle = "bg-green-600 text-white";
    bgStyle = "bg-green-50";
  }

  return (
    <div className={`border-l-4 ${borderStyle} ${bgStyle} rounded-xl p-8 shadow-sm transition-all duration-300`}>
      
      <h2 className="text-xl font-semibold mb-6 tracking-wide">
        Attack Intelligence
      </h2>

      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
            Detected Pattern
          </p>
          <p className="text-lg font-semibold">
            {label}
          </p>
        </div>

        <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${badgeStyle}`}>
          {severity}
        </span>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
          Threat Analysis
        </p>
        <p className="text-gray-800 leading-relaxed text-sm">
          {explanation}
        </p>
      </div>
    </div>
  );
}