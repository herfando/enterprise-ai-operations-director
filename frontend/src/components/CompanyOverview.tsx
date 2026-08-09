"use client";

import HealthCard from "@/components/HealthCard";

export default function CompanyOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <HealthCard />

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">Critical Issues</p>

        <h2 className="text-5xl font-bold mt-3">3</h2>

        <p className="text-red-500 mt-2">Require attention</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">AI Decisions Today</p>

        <h2 className="text-5xl font-bold mt-3">12</h2>

        <p className="text-blue-500 mt-2">Automated analysis</p>
      </div>
    </div>
  );
}
