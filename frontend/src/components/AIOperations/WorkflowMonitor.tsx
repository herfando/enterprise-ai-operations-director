"use client";

type WorkflowMonitorProps = {
  visible: boolean;
  onClose: () => void;
};

export default function WorkflowMonitor({
  visible,
  onClose,
}: WorkflowMonitorProps) {
  if (!visible) {
    return null;
  }

  return (
    <section id="workflows" className="bg-white rounded-2xl shadow p-6 border">
      {/* HEADER */}{" "}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h2 className="text-xl font-bold text-slate-900">
            Workflow Monitor{" "}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Production Recovery Workflow
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 cursor-pointer hover:text-slate-700 text-xl"
        >
          ×
        </button>
      </div>
      {/* WORKFLOW STATUS */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-900">Maintenance Recovery</p>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            In Progress
          </span>
        </div>

        <div className="mt-4 w-full rounded-full bg-slate-200 h-3">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: "75%" }}
          />
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Workflow execution in progress
        </p>
      </div>
      {/* WORKFLOW STEPS */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
          <span>✓</span>
          <span className="text-sm font-medium">Production issue detected</span>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
          <span>✓</span>
          <span className="text-sm font-medium">AI decision generated</span>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
          <span>●</span>
          <span className="text-sm font-medium">
            Maintenance workflow initiated
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
          <span>○</span>
          <span className="text-sm font-medium text-slate-500">
            Work order execution
          </span>
        </div>
      </div>
    </section>
  );
}
