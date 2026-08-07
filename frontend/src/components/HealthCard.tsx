"use client";

import { useEffect, useState } from "react";

export default function HealthCard() {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const [health, setHealth] = useState<any>(null);

  async function fetchHealth() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/production/dashboard?start_date=${startDate}&end_date=${endDate}`,
      );

      const data = await res.json();

      const oee = data.oee || {};

      setHealth({
        score: oee.oee ?? 0,

        productionEfficiency: oee.performance ?? 0,

        qualityRate: oee.quality ?? 0,

        machineAvailability: oee.availability ?? 0,

        totalProduction: data.summary?.total_production ?? 0,

        rejectProduct: data.summary?.reject_product ?? 0,

        goodProduct: data.summary?.good_product ?? 0,
      });
    } catch (error) {
      console.error("Health fetch error:", error);
    }
  }

  useEffect(() => {
    fetchHealth();
  }, [startDate, endDate]);

  if (!health) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        Loading Company Health...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-5">
        <p className="text-gray-500 text-sm">Company Health Score</p>

        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm w-36"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm w-36"
          />
        </div>
      </div>

      <h2 className="text-5xl font-bold text-slate-900">{health.score}%</h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span>Production Efficiency</span>

          <span className="font-semibold">{health.productionEfficiency}%</span>
        </div>

        <div className="flex justify-between">
          <span>Quality Rate</span>

          <span className="font-semibold">{health.qualityRate}%</span>
        </div>

        <div className="flex justify-between">
          <span>Machine Availability</span>

          <span className="font-semibold">{health.machineAvailability}%</span>
        </div>

        <div className="flex justify-between">
          <span>Total Production</span>

          <span className="font-semibold">
            {health.totalProduction.toLocaleString()} pcs
          </span>
        </div>

        <div className="flex justify-between">
          <span>Good Product</span>

          <span className="font-semibold">
            {health.goodProduct.toLocaleString()} pcs
          </span>
        </div>

        <div className="flex justify-between">
          <span>Reject Product</span>

          <span className="font-semibold text-red-600">
            {health.rejectProduct.toLocaleString()} pcs
          </span>
        </div>
      </div>
    </div>
  );
}
