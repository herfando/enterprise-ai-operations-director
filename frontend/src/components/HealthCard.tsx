import { companyHealth } from "@/lib/data";

export default function HealthCard() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500 text-sm">Company Health Score</p>

      <h2 className="text-5xl font-bold mt-3 text-slate-900">
        {companyHealth.score}%
      </h2>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span>Production Efficiency</span>
          <span className="font-semibold">
            {companyHealth.productionEfficiency}%
          </span>
        </div>

        <div className="flex justify-between">
          <span>Quality</span>
          <span className="font-semibold">{companyHealth.qualityRate}%</span>
        </div>

        <div className="flex justify-between">
          <span>On-Time Delivery</span>
          <span className="font-semibold">{companyHealth.onTimeDelivery}%</span>
        </div>

        <div className="flex justify-between">
          <span>Machine Availability</span>
          <span className="font-semibold">
            {companyHealth.machineAvailability}%
          </span>
        </div>
      </div>
    </div>
  );
}
