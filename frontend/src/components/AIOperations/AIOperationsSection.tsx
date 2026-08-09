"use client";

import { useState } from "react";

import DecisionPanel from "@/components/AIOperations/DecisionPanel";
import WorkflowMonitor from "@/components/AIOperations/WorkflowMonitor";

export default function AIOperationsSection() {
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);
  const [hasWorkflowStarted, setHasWorkflowStarted] = useState(false);

  const handleExecuteWorkflow = () => {
    setHasWorkflowStarted(true);
    setIsWorkflowOpen(true);

    setTimeout(() => {
      document.getElementById("workflows")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleOpenWorkflow = () => {
    setIsWorkflowOpen(true);

    setTimeout(() => {
      document.getElementById("workflows")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div
      id="ai-decisions"
      className="
        mt-8
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        items-start
      "
    >
      <DecisionPanel onExecuteWorkflow={handleExecuteWorkflow} />

      <div id="workflows" className="w-full">
        {!hasWorkflowStarted ? (
          <div className="min-h-25" />
        ) : isWorkflowOpen ? (
          <WorkflowMonitor
            visible={true}
            onClose={() => setIsWorkflowOpen(false)}
          />
        ) : (
          <button
            type="button"
            onClick={handleOpenWorkflow}
            className="
              cursor-pointer
              w-full
              rounded-2xl
              border
              bg-white
              p-6
              text-left
              shadow
              transition
              hover:shadow-lg
            "
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Workflow Monitor
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Workflow is currently closed.
                </p>
              </div>

              <span
                className="
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2
                  font-semibold
                  text-white
                "
              >
                Open Workflow
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
