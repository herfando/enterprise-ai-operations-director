"use client";

import { useEffect, useState } from "react";
import type { DecisionData, DecisionResponse } from "@/types/decision";

type DecisionPanelProps = {
  onExecuteWorkflow: () => void;
};

export default function DecisionPanel({
  onExecuteWorkflow,
}: DecisionPanelProps) {
  const [result, setResult] = useState<DecisionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadDecision() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/production/decision?start_date=2026-07-01&end_date=2026-08-08`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load production decision");
        }

        const data: DecisionResponse = await response.json();

        setResult(data);
      } catch (err) {
        console.error("Production AI Decision error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadDecision();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
            🧠
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Decision Center
            </h2>

            <p className="text-sm text-slate-500">
              Cortex AI is evaluating production performance...
            </p>
          </div>
        </div>

        <div className="mt-6 animate-pulse space-y-4">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="h-8 w-3/4 rounded bg-slate-200" />
          <div className="h-20 rounded bg-slate-100" />
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !result) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-xl">
            ⚠️
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Decision Center
            </h2>

            <p className="text-sm text-red-600">
              Production AI decision could not be loaded.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (!result.decision) {
    return (
      <section className="rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
            🧠
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            AI Decision Center
          </h2>
        </div>

        <p className="mt-5 text-sm text-slate-500">
          No production decision is available for this period.
        </p>
      </section>
    );
  }

  // =====================================================
  // PARSE CORTEX RESPONSE
  // =====================================================

  let decision: DecisionData;

  try {
    if (typeof result.decision === "string") {
      let cleaned = result.decision.trim();

      // Remove markdown code fences
      cleaned = cleaned.replace(/^```json\s*/i, "");
      cleaned = cleaned.replace(/^```\s*/i, "");
      cleaned = cleaned.replace(/```\s*$/i, "");

      // Remove single backtick wrapping
      cleaned = cleaned.replace(/^`json\s*/i, "");
      cleaned = cleaned.replace(/^`\s*/i, "");
      cleaned = cleaned.replace(/`\s*$/i, "");

      cleaned = cleaned.trim();

      decision = JSON.parse(cleaned) as DecisionData;
    } else {
      decision = result.decision;
    }
  } catch (parseError) {
    console.error("Failed to parse Cortex decision:", parseError);
    console.error("Raw decision:", result.decision);

    return (
      <section className="rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-xl">
            ⚠️
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Decision Center
            </h2>

            <p className="text-sm text-red-600">
              Cortex returned an invalid decision format.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // DISPLAY DATA
  // =====================================================

  const severity = decision.severity ?? decision.priority ?? "Review Required";

  const title =
    decision.title ??
    decision.primary_problem ??
    decision.problem ??
    "Production Performance Requires Attention";

  const confidence =
    decision.confidence !== undefined ? `${decision.confidence}%` : "—";

  const businessImpact =
    decision.business_impact ?? "Requires operational attention";

  const recommendation =
    decision.recommendation ?? "No recommendation returned by Cortex AI.";

  const immediateActions = decision.immediate_actions ?? decision.actions ?? [];

  const followUpActions = decision.follow_up_actions ?? [];

  // =====================================================
  // MAIN PANEL
  // =====================================================

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      {/* =================================================
          HEADER
      ================================================= */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
            🧠
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              AI Decision Center
            </h2>

            <p className="text-xs text-slate-500">Production • Cortex AI</p>
          </div>
        </div>

        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
          {severity}
        </span>
      </div>
      {/* =================================================
          CURRENT ISSUE
      ================================================= */}
      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500">Current Issue</p>

        <h3 className="mt-1 text-xl font-bold text-slate-900">{title}</h3>
      </div>
      {/* =================================================
          EXECUTIVE SUMMARY
      ================================================= */}
      {decision.executive_summary && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            Executive Summary
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {decision.executive_summary}
          </p>
        </div>
      )}
      {/* =================================================
          AI METRICS
      ================================================= */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-gray-500">AI Confidence</p>

          <p className="mt-1 text-2xl font-bold">{confidence}</p>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-gray-500">Priority</p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {decision.priority ?? "—"}
          </p>
        </div>
      </div>
      {/* =================================================
          BUSINESS IMPACT
      ================================================= */}
      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-gray-500">Business Impact</p>

        <p className="mt-1 text-sm font-semibold leading-6 text-red-600">
          {businessImpact}
        </p>
      </div>
      {/* =================================================
          EVIDENCE
      ================================================= */}
      {decision.evidence && decision.evidence.length > 0 && (
        <div className="mt-5">
          <h3 className="font-bold text-slate-900">Evidence</h3>

          <div className="mt-3 space-y-2">
            {decision.evidence.map((item, index) => (
              <div
                key={index}
                className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700"
              >
                • {item}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* =================================================
          WHY FIRST
      ================================================= */}
      {decision.why_first && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">Why This Issue First?</p>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            {decision.why_first}
          </p>
        </div>
      )}
      {/* =================================================
          AI RECOMMENDATION
      ================================================= */}
      <div className="mt-5">
        <p className="font-semibold text-slate-900">AI Recommendation</p>

        <div className="mt-3 rounded-lg bg-blue-50 p-4 text-blue-900">
          <p className="font-semibold leading-6">{recommendation}</p>
        </div>
      </div>
      {/* =================================================
          IMMEDIATE ACTIONS
      ================================================= */}
      {immediateActions.length > 0 && (
        <div className="mt-5">
          <p className="font-semibold text-slate-900">Immediate Actions</p>

          <div className="mt-3 space-y-2">
            {immediateActions.map((action, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {index + 1}
                </span>

                <p className="text-sm leading-6 text-slate-700">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* =================================================
          FOLLOW-UP ACTIONS
      ================================================= */}
      {followUpActions.length > 0 && (
        <div className="mt-5">
          <p className="font-semibold text-slate-900">Follow-up Actions</p>

          <div className="mt-3 space-y-2">
            {followUpActions.map((action, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
                  {index + 1}
                </span>

                <p className="text-sm leading-6 text-slate-700">{action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* =================================================
          EXPECTED IMPACT
      ================================================= */}
      {decision.expected_impact && (
        <div className="mt-5 rounded-lg bg-green-50 p-4">
          <p className="font-semibold text-green-900">Expected Impact</p>

          <p className="mt-2 text-sm leading-6 text-green-800">
            {decision.expected_impact}
          </p>
        </div>
      )}
      {/* =================================================
          EXECUTE WORKFLOW
      ================================================= */}

      <button
        type="button"
        onClick={() => {
          onExecuteWorkflow();

          setTimeout(() => {
            document.getElementById("workflows")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        }}
        className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Execute Workflow
      </button>
    </section>
  );
}
