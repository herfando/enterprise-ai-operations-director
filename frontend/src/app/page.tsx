"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import HealthCard from "@/components/HealthCard";
import DepartmentCard from "@/components/DepartmentCard";
import DecisionPanel from "@/components/DecisionPanel";
import WorkflowMonitor from "@/components/WorkflowMonitor";

import { departments } from "@/lib/data";

import { useState } from "react";
import type { Department } from "@/lib/data";
import DepartmentDetail from "@/components/DepartmentDetail";

import UploadReportModal from "@/components/UploadReportModal";

export default function Home() {
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null,
  );
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  return (
    <main className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <section className="flex-1 p-8">
        <Header />
        <div className="mb-8">
          <div
            onClick={() => setIsUploadOpen(true)}
            className="
      bg-white
      rounded-2xl
      shadow
      p-6
      border
      cursor-pointer
      hover:shadow-lg
      transition-all
      group
    "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div
                  className="
          w-14
          h-14
          rounded-xl
          bg-blue-100
          flex
          items-center
          justify-center
          text-3xl
          "
                >
                  📂
                </div>

                <div>
                  <h3
                    className="
            text-xl
            font-bold
            text-slate-900
          "
                  >
                    Enterprise Data Upload
                  </h3>

                  <p
                    className="
            text-slate-500
            mt-1
          "
                  >
                    Upload department operational data and let AI analyze
                    business performance
                  </p>
                </div>
              </div>

              <div
                className="
        bg-blue-600
        text-white
        px-5
        py-3
        rounded-xl
        font-semibold
        group-hover:bg-blue-700
        transition
        "
              >
                + Upload Report
              </div>
            </div>
          </div>
        </div>

        {/* Company Overview */}

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

        {/* Department Intelligence */}

        <h2 className="text-2xl font-bold mb-4">Department Intelligence</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              name={department.name}
              status={department.status}
              risk={department.risk}
              kpis={department.kpis}
              analysis={department.analysis}
              isSelected={selectedDepartment === department.id}
              onClick={() =>
                setSelectedDepartment(
                  selectedDepartment === department.id ? null : department.id,
                )
              }
            />
          ))}
        </div>
        <DepartmentDetail
          department={
            departments.find((dept) => dept.id === selectedDepartment) || null
          }
        />

        {/* AI Decision + Workflow */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DecisionPanel />

          <WorkflowMonitor />
        </div>

        <UploadReportModal
          open={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      </section>
    </main>
  );
}
