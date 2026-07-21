import type { KPI } from "@/lib/data";

type Props = {
  name: string;
  status: string;
  risk: string;
  kpis: KPI[];
};

export default function DepartmentCard({ name, status, risk, kpis }: Props) {
  const riskColor =
    risk === "High"
      ? "bg-red-100 text-red-700 border-red-300"
      : risk === "Medium"
        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
        : "bg-green-100 text-green-700 border-green-300";

  const statusColor =
    status === "Critical"
      ? "text-red-600"
      : status === "Warning"
        ? "text-yellow-600"
        : "text-green-600";

  return (
    <div className="bg-white rounded-xl shadow p-5 border">
      <h3 className="text-lg font-bold text-slate-900">{name}</h3>

      <div className="mt-4 space-y-2">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex justify-between text-sm">
            <span>{kpi.label}</span>
            <span className="font-semibold">{kpi.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-between items-center">
        <span className={`font-semibold ${statusColor}`}>{status}</span>

        <span className={`px-3 py-1 rounded-full border text-sm ${riskColor}`}>
          {risk}
        </span>
      </div>
    </div>
  );
}
