import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useEffect, useState, useRef } from "react";

export default function RiskTrendChart({ risk }) {
  const [animatedRisk, setAnimatedRisk] = useState(risk);
  const previousRiskRef = useRef(risk);

  useEffect(() => {
    const start = previousRiskRef.current;
    const end = risk;

    const duration = 500;
    let startTime = null;

    function animate(time) {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(start + (end - start) * progress);

      setAnimatedRisk(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousRiskRef.current = end;
      }
    }

    requestAnimationFrame(animate);
  }, [risk]);

  const data = [
    { t: 1, value: 10 },
    { t: 2, value: 12 },
    { t: 3, value: 9 },
    { t: 4, value: 11 },
    { t: 5, value: 10 },
    { t: 6, value: animatedRisk }
  ];

  const lineColor =
    risk >= 80
      ? "#dc2626"
      : risk >= 50
      ? "#f59e0b"
      : "#16a34a";

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border p-3 transition-all duration-300 ${
        risk >= 80 ? "ring-2 ring-red-300" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Risk Trend
        </h2>

        <span className="text-xs text-gray-400 uppercase tracking-wide">
          Behavior Timeline
        </span>
      </div>

      {/* Compact Height for Side-by-Side Layout */}
      <ResponsiveContainer width="100%" height={170}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2.5}
            dot={{
              r: 3,
              strokeWidth: 2,
              fill: lineColor
            }}
            activeDot={{
              r: 5,
              stroke: lineColor,
              strokeWidth: 2
            }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}