import type { KPI } from "@/lib/data";

type Props = {
  name: string;
  status: string;
  risk: string;
  kpis: KPI[];
  analysis: any;
  isSelected: boolean;
  onClick: () => void;
};

export default function DepartmentCard({
  name,
  status,
  risk,
  kpis,
  isSelected,
  onClick,
}: Props) {
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
    <div
      onClick={onClick}
      className={`
        bg-white
        rounded-xl
        shadow
        p-5
        border
        cursor-pointer
        transition-all
        duration-300
        hover:shadow-lg

        ${isSelected ? "ring-2 ring-blue-500" : ""}
      `}
    >
      {/* HEADER */}

      <h3 className="text-lg font-bold text-slate-900">{name}</h3>

      {/* KPI SUMMARY */}

      <div className="mt-4 space-y-2">
        {kpis.slice(0, 3).map((kpi) => (
          <div key={kpi.label} className="flex justify-between text-sm">
            <span className="text-slate-500">{kpi.label}</span>

            <span className="font-semibold">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* CLICK INDICATOR */}

      {isSelected && (
        <div className="mt-5 border-t pt-4 text-center">
          <span className="text-blue-600 font-semibold">
            View Intelligence Detail →
          </span>
        </div>
      )}

      {/* STATUS */}

      <div className="mt-5 flex justify-between items-center">
        <span className={`font-semibold ${statusColor}`}>{status}</span>

        <span
          className={`
            px-3
            py-1
            rounded-full
            border
            text-sm
            ${riskColor}
          `}
        >
          {risk}
        </span>
      </div>
    </div>
  );
}
