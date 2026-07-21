import { aiDecision } from "@/lib/data";

export default function DecisionPanel() {
  return (
    <div className="bg-white rounded-xl shadow p-6 border">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">
          🧠 AI Decision Center
        </h2>

        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
          {aiDecision.severity}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-gray-500 text-sm">Current Issue</p>

        <h3 className="text-xl font-bold mt-1 text-slate-900">
          {aiDecision.title}
        </h3>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">AI Confidence</p>

            <p className="text-2xl font-bold">{aiDecision.confidence}%</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Estimated Loss</p>

            <p className="text-2xl font-bold text-red-600">
              {aiDecision.estimatedLoss}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-500 text-sm">Business Impact</p>

          <p className="font-semibold mt-1">{aiDecision.businessImpact}</p>
        </div>

        <div className="mt-6">
          <p className="text-gray-500 text-sm">AI Recommendation</p>

          <div className="mt-3 bg-blue-50 p-4 rounded-lg text-blue-900">
            {aiDecision.recommendation}
          </div>
        </div>

        <button
          className="
          mt-6 
          bg-blue-600 
          hover:bg-blue-700 
          text-white 
          px-5 
          py-2 
          rounded-lg
          font-semibold
          "
        >
          Execute Workflow
        </button>
      </div>
    </div>
  );
}
