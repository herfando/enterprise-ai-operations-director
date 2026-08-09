"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import EnterpriseDataUpload from "@/components/EnterpriseDataUpload";
import CompanyOverview from "@/components/CompanyOverview";
import DepartmentIntelligence from "@/components/DepartmentIntelligence";
import AIOperationsSection from "@/components/AIOperationsSection";

export default function Home() {
  return (
    <>
      <Sidebar />
      <Header />
      <EnterpriseDataUpload />
      <CompanyOverview />
      <DepartmentIntelligence />
      <AIOperationsSection />
    </>
  );
}
