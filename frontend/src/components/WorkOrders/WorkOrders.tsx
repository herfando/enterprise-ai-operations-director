"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type WorkOrder = {
  work_order_id: string;
  request_id: string;
  status: string;
  priority: string;
  maintenance_type: string;
  requester_department: string;
  maintenance_department: string;
  machine_name: string;
  product_name: string;
};

const workOrders: WorkOrder[] = [
  {
    work_order_id: "WO-PROD-20260817-132932",
    request_id: "MR-PROD-20260817-120022",
    status: "Open",
    priority: "P1",
    maintenance_type: "Corrective",
    requester_department: "Production",
    maintenance_department: "Maintenance",
    machine_name: "Injection Molding Machine 03",
    product_name: "PolyPack PP Cup 300ml, ProCup PP Cup 180ml",
  },
];

export default function WorkOrders() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadFile = async (requestId: string, type: "excel" | "pdf") => {
    try {
      setDownloading(`${requestId}-${type}`);

      const endpoint =
        type === "excel"
          ? `/production/work-order/download?request_id=${encodeURIComponent(
              requestId,
            )}`
          : `/production/work-order/download/pdf?request_id=${encodeURIComponent(
              requestId,
            )}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error("Failed to download Work Order");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        type === "excel"
          ? `${requestId}_Maintenance_Work_Order.xlsx`
          : `${requestId}_Maintenance_Work_Order.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Work Order download error:", error);

      alert("Failed to download Work Order.");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <section id="work-orders" className="mt-8">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">Work Orders</h2>

        <p className="text-sm text-slate-500">
          Operational work orders generated from enterprise decisions.
        </p>
      </div>

      {/* WORK ORDER LIST */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-[2fr_1fr_1fr_2fr_80px_100px_120px_120px] items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Work Order</span>
          <span>Requester</span>
          <span>Executor</span>
          <span>Machine</span>
          <span>Priority</span>
          <span>Status</span>
          <span className="text-center">Excel</span>
          <span className="text-center">PDF</span>
        </div>

        {/* WORK ORDERS */}
        {workOrders.map((workOrder) => (
          <div
            key={workOrder.work_order_id}
            className="grid grid-cols-[2fr_1fr_1fr_2fr_80px_100px_120px_120px] items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0"
          >
            {/* WORK ORDER */}
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {workOrder.work_order_id}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Request: {workOrder.request_id}
              </p>
            </div>

            {/* REQUESTER */}
            <div>
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                {workOrder.requester_department}
              </span>
            </div>

            {/* EXECUTOR */}
            <div>
              <span className="rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                {workOrder.maintenance_department}
              </span>
            </div>

            {/* MACHINE */}
            <div>
              <p className="text-sm text-slate-700">{workOrder.machine_name}</p>

              <p className="mt-1 truncate text-xs text-slate-400">
                {workOrder.maintenance_type}
              </p>
            </div>

            {/* PRIORITY */}
            <div>
              <span
                className={`rounded-md px-2 py-1 text-xs font-bold ${
                  workOrder.priority === "P1"
                    ? "bg-red-50 text-red-700"
                    : workOrder.priority === "P2"
                      ? "bg-orange-50 text-orange-700"
                      : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {workOrder.priority}
              </span>
            </div>

            {/* STATUS */}
            <div>
              <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                {workOrder.status}
              </span>
            </div>

            {/* EXCEL */}
            <div className="text-center">
              <button
                onClick={() => downloadFile(workOrder.request_id, "excel")}
                disabled={downloading === `${workOrder.request_id}-excel`}
                className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {downloading === `${workOrder.request_id}-excel`
                  ? "Downloading..."
                  : "Download"}
              </button>
            </div>

            {/* PDF */}
            <div className="text-center">
              <button
                onClick={() => downloadFile(workOrder.request_id, "pdf")}
                disabled={downloading === `${workOrder.request_id}-pdf`}
                className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {downloading === `${workOrder.request_id}-pdf`
                  ? "Downloading..."
                  : "Download"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
