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

export default function Home() {
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  return (
    <main className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <section className="flex-1 p-8">
        <Header />

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
              onClick={() => setSelectedDepartment(department)}
            />
          ))}
        </div>

        {/* AI Decision + Workflow */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DecisionPanel />

          <WorkflowMonitor />
        </div>
      </section>
    </main>
  );
}
