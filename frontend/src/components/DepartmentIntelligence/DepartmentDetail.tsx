import type { Department } from "@/lib/data";
import ProductionDashboard from "@/components/CompanyOverview/ProductionDashboard";

type Props = {
  department: Department | null;
};

export default function DepartmentDetail({ department }: Props) {
  if (!department) {
    return (
      <div className="bg-white rounded-xl shadow p-6 my-6">
        <p className="text-slate-500">
          Select a department to view intelligence detail
        </p>
      </div>
    );
  }

  const isProduction = department.name === "Production";

  return (
    <section className="bg-white rounded-xl shadow p-6 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {department.name}
          </h2>

          <p className="text-slate-500">AI Operational Intelligence Detail</p>
        </div>

        <div className="flex gap-3">
          <span className="px-3 py-1 rounded-full bg-slate-100">
            {department.status}
          </span>

          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">
            Risk {department.risk}
          </span>
        </div>
      </div>

      {/* ===========================
          REAL PRODUCTION DASHBOARD
      ============================ */}

      {isProduction && <ProductionDashboard />}

      {/* ===========================
          OTHER DEPARTMENT KPI
      ============================ */}

      {!isProduction && (
        <>
          <h3 className="text-lg font-bold mb-3">KPI Performance</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {department.kpis.map((kpi) => (
              <div key={kpi.label} className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm text-slate-500">{kpi.label}</p>

                <p className="text-xl font-bold">{kpi.value}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===========================
          OTHER DEPARTMENT ANALYSIS
      ============================ */}

      {!isProduction && (
        <div className="grid md:grid-cols-3 gap-5">
          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-3">Issues Detected</h4>

            {department.analysis.issues?.map((item: string) => (
              <p key={item} className="text-sm mb-2">
                • {item}
              </p>
            ))}
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-3">Root Cause</h4>

            {department.analysis.rootCause?.map((item: string) => (
              <p key={item} className="text-sm mb-2">
                • {item}
              </p>
            ))}
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-bold mb-3">AI Recommendation</h4>

            {department.analysis.recommendation?.map((item: string) => (
              <p key={item} className="text-sm mb-2">
                • {item}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ===========================
          OTHER DEPARTMENT MACHINE
      ============================ */}

      {!isProduction && department.analysis.machines && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-3">Machine Monitoring</h3>

          <div className="grid md:grid-cols-2 gap-4">
            {department.analysis.machines.map((machine: any) => (
              <div key={machine.name} className="border rounded-lg p-4">
                <p className="font-bold">{machine.name}</p>

                <p>Status: {machine.status || machine.condition}</p>

                {machine.downtime && <p>Downtime: {machine.downtime}</p>}

                {machine.reason && <p>Reason: {machine.reason}</p>}

                {machine.issue && <p>Issue: {machine.issue}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
