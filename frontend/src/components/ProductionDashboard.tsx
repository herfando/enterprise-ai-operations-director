"use client";

import { useEffect, useState } from "react";

export default function ProductionDashboard() {
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-06");

  const [data, setData] = useState<any>(null);

  async function fetchDashboard() {
    try {
      const res = await fetch(
        `http://localhost:8000/production/dashboard?start_date=${startDate}&end_date=${endDate}`,
      );

      const json = await res.json();

      setData(json);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, [startDate, endDate]);

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        Loading Production Dashboard...
      </div>
    );
  }

  function ParetoChart({ title, data }: { title: string; data: any[] }) {
    if (!data || data.length === 0) {
      return (
        <div className="border rounded-xl p-5">
          <h3 className="font-bold text-lg mb-4">{title}</h3>

          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    return (
      <div className="border rounded-xl p-5">
        <h3 className="font-bold text-lg mb-5">{title}</h3>

        <div className="space-y-5">
          {data.map((item: any) => (
            <div key={item.name}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{item.name}</span>

                <span className="font-bold">
                  {Number(item.value).toLocaleString()} pcs
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-5">
                <div
                  className="bg-blue-600 h-5 rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-xs text-slate-500">
                  Contribution: {item.percentage}%
                </span>

                <span className="text-xs text-slate-500">
                  Cumulative: {item.cumulative_percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            🏭 Production Intelligence Dashboard
          </h2>

          <p className="text-sm text-gray-500">
            Period: {data.start_date} - {data.end_date}
          </p>
        </div>

        <div className="flex gap-3">
          <div>
            <p className="text-xs text-gray-500">Start Date</p>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">End Date</p>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* OEE */}

      <h3 className="font-bold text-lg mb-3">OEE Performance</h3>

      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {Object.entries(data.oee).map(([key, value]: any) => (
          <div key={key} className="bg-slate-50 rounded-xl p-4">
            <p className="text-gray-500 capitalize">{key}</p>

            <p className="text-3xl font-bold">{value}%</p>
          </div>
        ))}
      </div>

      {/* SUMMARY */}

      <h3 className="font-bold text-lg mb-3">Production Summary</h3>

      <div className="grid md:grid-cols-5 gap-4 mb-8">
        {Object.entries(data.summary).map(([key, value]: any) => (
          <div key={key} className="border rounded-xl p-4">
            <p className="text-gray-500">{key}</p>

            <p className="font-bold text-xl">
              {Number(value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* PARETO */}

      <h3 className="font-bold text-xl mb-4">Production Pareto Analysis</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <ParetoChart
          title="Pareto Production Machine"
          data={data.production_by_machine}
        />

        <ParetoChart
          title="Pareto Operator"
          data={data.production_by_operator}
        />

        <ParetoChart title="Pareto Shift" data={data.production_by_shift} />

        <ParetoChart title="Pareto Group" data={data.production_by_group} />

        <ParetoChart title="Pareto Product" data={data.production_by_product} />

        <ParetoChart title="Material Usage" data={data.material_by_name} />
      </div>
    </div>
  );
}
