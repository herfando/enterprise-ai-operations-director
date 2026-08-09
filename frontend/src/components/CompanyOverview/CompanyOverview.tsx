"use client";

import { useEffect, useState } from "react";

import HealthCard from "@/components/CompanyOverview/HealthCard";

type AIDecisionResponse = {
  status: string;
  department?: string;
  start_date?: string;
  end_date?: string;

  decision?: {
    title?: string;
    severity?: string;
    priority?: string;
    confidence?: number;
    executive_summary?: string;
    primary_problem?: string;
    why_first?: string;
    evidence?: string[];
    business_impact?: string;
    immediate_actions?: string[];
    follow_up_actions?: string[];
    recommendation?: string;
    expected_impact?: string;
  };

  ai_database?: {
    status?: string;
    decision_id?: number;
    error?: string;
  };
};

export default function CompanyOverview() {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const [aiDecision, setAiDecision] = useState<AIDecisionResponse | null>(null);

  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    async function fetchAIDecision() {
      try {
        setAiLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/production/decision?start_date=${startDate}&end_date=${endDate}`,
        );

        if (!res.ok) {
          throw new Error(`AI decision request failed: ${res.status}`);
        }

        const data: AIDecisionResponse = await res.json();

        console.log("AI DECISION:", data);

        setAiDecision(data);
      } catch (error) {
        console.error("AI decision fetch error:", error);

        setAiDecision(null);
      } finally {
        setAiLoading(false);
      }
    }

    fetchAIDecision();
  }, [startDate, endDate]);

  const decision = aiDecision?.decision;

  const hasCriticalIssue = Boolean(decision?.primary_problem);

  return (
    <>
      {/* ================================================= */}
      {/* COMPANY HEALTH */}
      {/* ================================================= */}
      <div className="flex gap-6">
        <HealthCard
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        {/* ================================================= */}
        {/* CRITICAL ISSUES */}
        {/* ================================================= */}

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Critical Issues</p>

          <h2 className="text-5xl font-bold mt-3">
            {aiLoading ? "..." : hasCriticalIssue ? 1 : 0}
          </h2>

          <p
            className={`mt-2 ${
              hasCriticalIssue ? "text-red-500" : "text-green-500"
            }`}
          >
            {aiLoading
              ? "Analyzing..."
              : hasCriticalIssue
                ? decision?.primary_problem
                : "No critical issues"}
          </p>
        </div>

        {/* ================================================= */}
        {/* AI DECISIONS */}
        {/* ================================================= */}

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">AI Decisions</p>

          <h2 className="text-5xl font-bold mt-3">
            {aiLoading ? "..." : aiDecision?.status === "success" ? 1 : 0}
          </h2>

          <p className="text-blue-500 mt-2">
            {aiLoading
              ? "Analyzing..."
              : aiDecision?.status === "success"
                ? decision?.title || "AI decision generated"
                : "No AI decision"}
          </p>
        </div>
      </div>
    </>
  );
}
