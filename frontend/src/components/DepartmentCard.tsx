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
  analysis,
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
    bg-white rounded-xl shadow p-5 border cursor-pointer
    transition-all duration-300
    ${isSelected ? "md:col-span-2 lg:col-span-2" : ""}
  `}
    >
      <h3 className="text-lg font-bold text-slate-900">{name}</h3>

      <div className="mt-4 space-y-2">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex justify-between text-sm">
            <span>{kpi.label}</span>
            <span className="font-semibold">{kpi.value}</span>
          </div>
        ))}
      </div>

      {isSelected && (
        <div className="mt-6 border-t pt-5">
          <h4 className="font-bold text-lg mb-3">Operational Analysis</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.issues?.map((item: string) => (
              <div key={item} className="bg-red-50 p-3 rounded">
                {item}
              </div>
            ))}
          </div>

          <h4 className="font-bold mt-5 mb-3">Root Cause</h4>

          {analysis.rootCause?.map((item: string) => (
            <p key={item}>• {item}</p>
          ))}

          {analysis.machines && (
            <>
              <h4 className="font-bold mt-5 mb-3">Machine Monitoring</h4>

              {analysis.machines.map((machine: any) => (
                <div
                  key={machine.name}
                  className="bg-slate-50 p-3 rounded mb-2"
                >
                  <b>{machine.name}</b>

                  <p>Status: {machine.status}</p>

                  <p>Downtime: {machine.downtime}</p>

                  <p>Reason: {machine.reason}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <div className="mt-5 flex justify-between items-center">
        <span className={`font-semibold ${statusColor}`}>{status}</span>

        <span className={`px-3 py-1 rounded-full border text-sm ${riskColor}`}>
          {risk}
        </span>
      </div>
    </div>
  );
}
