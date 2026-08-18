"use client";

import EnterpriseDataUpload from "@/components/EnterpriseDataUpload/EnterpriseDataUpload";
import CompanyOverview from "@/components/CompanyOverview/CompanyOverview";
import DepartmentIntelligence from "@/components/DepartmentIntelligence/DepartmentIntelligence";
import AIOperationsSection from "@/components/AIOperations/AIOperationsSection";
import WorkOrders from "@/components/WorkOrders/WorkOrders";

export default function Home() {
  return (
    <>
      <EnterpriseDataUpload />
      <CompanyOverview />
      <DepartmentIntelligence />
      <AIOperationsSection />
      <WorkOrders />
    </>
  );
}
