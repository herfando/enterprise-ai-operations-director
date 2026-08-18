"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

export default function ProductionDashboard() {
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-06");

  const [data, setData] = useState<any>(null);

  async function fetchDashboard() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/production/dashboard?start_date=${startDate}&end_date=${endDate}`,
      );

      console.log("STATUS", res.status);
      console.log("URL", res.url);

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
      <div className="mt-6 rounded-xl bg-white p-6 shadow">
        Loading Production Dashboard...
      </div>
    );
  }

  // =====================================================
  // PARETO CHART
  // =====================================================

  function ParetoChart({ title, data }: { title: string; data: any[] }) {
    if (!data || data.length === 0) {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-lg font-bold text-slate-900">{title}</h3>

          <p className="text-sm text-slate-500">No data available</p>
        </div>
      );
    }

    // Sort quantity from highest to lowest
    const sortedData = [...data].sort(
      (a, b) => Number(b.value) - Number(a.value),
    );

    // Calculate cumulative percentage
    const total = sortedData.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0,
    );

    let cumulative = 0;

    const chartData = sortedData.map((item) => {
      const value = Number(item.value || 0);

      cumulative += value;

      return {
        name: item.name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
        cumulative: total > 0 ? (cumulative / total) * 100 : 0,
      };
    });

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* TITLE */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>

          <p className="mt-1 text-xs text-slate-500">
            Quantity distribution and cumulative contribution
          </p>
        </div>

        {/* CHART */}
        <div className="h-90 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 30,
                right: 20,
                left: 35,
                bottom: 55,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              {/* X AXIS */}
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 11 }}
                interval={0}
              />

              {/* LEFT AXIS - QUANTITY */}
              <YAxis
                yAxisId="quantity"
                orientation="left"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => value.toLocaleString()}
              />

              {/* RIGHT AXIS - PERCENTAGE */}
              <YAxis
                yAxisId="percentage"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
              />

              {/* TOOLTIP */}
              <Tooltip
                formatter={(value: any, name: any) => {
                  if (name === "value") {
                    return [Number(value).toLocaleString(), "Quantity"];
                  }

                  if (name === "cumulative") {
                    return [`${Number(value).toFixed(1)}%`, "Cumulative"];
                  }

                  return [value, name];
                }}
              />

              {/* BAR - QUANTITY */}
              <Bar
                yAxisId="quantity"
                dataKey="value"
                name="Quantity"
                barSize={35}
                fill="#1E3A5F"
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(value: any) => Number(value).toLocaleString()}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
              </Bar>

              {/* LINE - CUMULATIVE % */}
              <Line
                yAxisId="percentage"
                type="monotone"
                dataKey="cumulative"
                name="Cumulative"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  dataKey="cumulative"
                  position="top"
                  formatter={(value: any) => `${Number(value).toFixed(1)}%`}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* LEGEND */}
        <div className="mt-3 flex items-center justify-center gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[#1E3A5F]" />
            <span>Quantity</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-0.75 w-5 bg-red-600" />
            <span>Cumulative %</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="analytics" className="mt-6 rounded-xl bg-white p-6 shadow">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            🏭 Production Intelligence Dashboard
          </h2>

          <p className="text-sm text-gray-500">
            Period: {data.start_date} - {data.end_date}
          </p>
        </div>

        {/* DATE FILTER */}
        <div className="flex gap-3">
          <div>
            <p className="text-xs text-gray-500">Start Date</p>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <p className="text-xs text-gray-500">End Date</p>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          OEE
      ===================================================== */}

      <h3 className="mb-3 text-lg font-bold">OEE Performance</h3>

      <div className="mb-8 grid gap-4 md:grid-cols-5">
        {Object.entries(data.oee).map(([key, value]: any) => (
          <div key={key} className="rounded-xl bg-slate-50 p-4">
            <p className="capitalize text-gray-500">{key}</p>

            <p className="text-3xl font-bold text-slate-900">{value}%</p>
          </div>
        ))}
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <h3 className="mb-3 text-lg font-bold">Production Summary</h3>

      <div className="mb-8 grid gap-4 md:grid-cols-5">
        {Object.entries(data.summary).map(([key, value]: any) => (
          <div key={key} className="rounded-xl border p-4">
            <p className="text-gray-500">{key}</p>

            <p className="text-xl font-bold text-slate-900">
              {Number(value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* =====================================================
    PARETO ANALYSIS
    ===================================================== */}

      <h3 className="mb-2 text-xl font-bold text-slate-900">
        Production Pareto Analysis
      </h3>

      <p className="mb-5 text-sm text-slate-500">
        Pareto analysis identifies the major contributors to downtime and reject
        across machines, products, operators, groups, shifts, and materials.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 1. DOWNTIME BY MACHINE */}
        <ParetoChart
          title="Downtime by Machine"
          data={data.pareto.downtime_by_machine}
        />

        {/* 2. REJECT BY MACHINE */}
        <ParetoChart
          title="Reject by Machine"
          data={data.pareto.reject_by_machine}
        />

        {/* 3. REJECT BY PRODUCT */}
        <ParetoChart
          title="Reject by Product"
          data={data.pareto.reject_by_product}
        />

        {/* 4. REJECT BY OPERATOR */}
        <ParetoChart
          title="Reject by Operator"
          data={data.pareto.reject_by_operator}
        />

        {/* 5. REJECT BY GROUP */}
        <ParetoChart
          title="Reject by Operator Group"
          data={data.pareto.reject_by_group}
        />

        {/* 6. REJECT BY SHIFT */}
        <ParetoChart
          title="Reject by Shift"
          data={data.pareto.reject_by_shift}
        />

        {/* 7. REJECT BY MATERIAL */}
        <ParetoChart
          title="Reject by Material"
          data={data.pareto.reject_by_material}
        />
      </div>
    </div>
  );
}
