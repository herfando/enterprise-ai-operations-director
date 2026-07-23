"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const departments = [
  "Sales & Marketing",
  "Production",
  "PPIC",
  "QCQA",
  "Maintenance",
  "Warehouse",
  "Purchasing",
  "Finance",
  "Safety (K3)",
  "Research & Development",
];

export default function UploadReportModal({ open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [department, setDepartment] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (!open) return null;

  function resetModal() {
    setStep(1);
    setDepartment("");
    setFile(null);
    onClose();
  }

  function handleContinue() {
    if (!department) {
      alert("Please select a department.");
      return;
    }

    setStep(2);
  }

  function handleProcessAI() {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    console.log({
      department,
      file,
    });

    alert("File uploaded. AI Processing started.");

    resetModal();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload Department Report</h2>

          <button onClick={resetModal} className="text-2xl">
            ✕
          </button>
        </div>

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <p className="text-slate-500 mb-5">
              Select the department that owns this report.
            </p>

            <select
              className="w-full border rounded-lg p-3"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>

              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleContinue}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <>
            <div className="mb-5">
              <p className="text-sm text-slate-500">Department</p>

              <h3 className="text-xl font-bold">{department}</h3>
            </div>

            <label
              className="
              border-2
              border-dashed
              rounded-xl
              p-12
              flex
              flex-col
              items-center
              justify-center
              cursor-pointer
              hover:bg-slate-50
              transition
              "
            >
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <p className="text-lg font-semibold">Drag & Drop File</p>

              <p className="text-slate-500 mt-2">or click to browse</p>

              <p className="text-sm mt-5 text-slate-400">
                Excel • CSV • PDF • Image
              </p>
            </label>

            {file && (
              <div className="mt-5 bg-slate-100 rounded-lg p-4">
                <p className="font-semibold">Selected File</p>

                <p>{file.name}</p>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="border px-6 py-3 rounded-lg"
              >
                ← Back
              </button>

              <button
                onClick={handleProcessAI}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Process With AI
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
