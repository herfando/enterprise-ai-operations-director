"use client";

type Props = {
  title: string;
  data: Record<string, number>;
};

export default function ParetoChart({ title, data }: Props) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

  const total = sorted.reduce((sum, item) => sum + item[1], 0);

  let cumulative = 0;

  const chartData = sorted.map(([name, value]) => {
    cumulative += value;

    return {
      name,
      value,
      percentage: ((value / total) * 100).toFixed(1),
      cumulative: ((cumulative / total) * 100).toFixed(1),
    };
  });

  return (
    <div className="border rounded-xl p-5">
      <h3 className="font-bold text-lg mb-5">{title}</h3>

      <div className="space-y-4">
        {chartData.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{item.name}</span>

              <span>{item.value.toLocaleString()} pcs</span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{
                  width: `${item.percentage}%`,
                }}
              />
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Contribution {item.percentage}% | Cumulative {item.cumulative}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
