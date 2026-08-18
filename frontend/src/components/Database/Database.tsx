"use client";

import { useRouter } from "next/navigation";

const departments = [
  "Production",
  "PPIC",
  "QCQA",
  "Maintenance",
  "Warehouse",
  "Purchasing",
  "Finance",
  "Safety",
  "Sales & Marketing",
  "R&D",
];

export default function Database() {
  const router = useRouter();

  return (
    <section className="mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Enterprise Database
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage operational data stored in Snowflake.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <button
            key={department}
            onClick={() =>
              router.push(
                `/database/${department
                  .toLowerCase()
                  .replace(/ & /g, "-")
                  .replace(/ /g, "-")}`,
              )
            }
            className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">{department}</h3>

            <p className="mt-1 text-xs text-slate-500">
              View and manage operational data
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
