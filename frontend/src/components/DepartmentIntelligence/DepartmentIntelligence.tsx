"use client";

import { useState } from "react";

import { departments } from "@/lib/data";

import DepartmentCard from "@/components/DepartmentIntelligence/DepartmentCard";
import DepartmentDetail from "@/components/DepartmentIntelligence/DepartmentDetail";

export default function DepartmentIntelligence() {
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null,
  );

  const selectedDepartmentData =
    departments.find((dept) => dept.id === selectedDepartment) || null;

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Department Intelligence</h2>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-5
          gap-4
          mb-8
        "
      >
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

      <DepartmentDetail department={selectedDepartmentData} />
    </>
  );
}
