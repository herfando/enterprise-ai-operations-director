"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EnterpriseDataUpload from "@/components/EnterpriseDataUpload/EnterpriseDataUpload";
import CompanyOverview from "@/components/CompanyOverview/CompanyOverview";
import DepartmentIntelligence from "@/components/DepartmentIntelligence/DepartmentIntelligence";
import AIOperationsSection from "@/components/AIOperations/AIOperationsSection";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <section className="flex-1 p-6">
          <Header />
          <EnterpriseDataUpload />
          <CompanyOverview />
          <DepartmentIntelligence />
          <AIOperationsSection />
        </section>
      </main>
    </>
  );
}
