"use client";

import { useState } from "react";

import FeedbackModal from "./FeedbackModal";
import { UploadResult } from "@/types/upload";

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

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  if (!open) {
    return (
      <>
        {uploadResult && (
          <FeedbackModal
            open={feedbackOpen}
            onClose={() => {
              setFeedbackOpen(false);
              setUploadResult(null);
            }}
            result={uploadResult}
          />
        )}
      </>
    );
  }

  function resetModal() {
    setStep(1);
    setDepartment("");
    setFile(null);
    onClose();
  }

  function handleContinue() {
    if (!department) {
      return;
    }

    setStep(2);
  }

  async function handleProcessAI() {
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();

      formData.append("department", department);
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result: UploadResult = await response.json();

      console.log(result);

      setUploadResult(result);

      resetModal();

      setFeedbackOpen(true);
    } catch (error) {
      console.error(error);

      setUploadResult({
        status: "failed",
        message: "Failed to connect to backend.",
        details: [
          "Please check the backend server.",
          "Please check the API connection.",
        ],
      });

      resetModal();

      setFeedbackOpen(true);
    }
  }

  return (
    <>
      {/* UPLOAD MODAL */}

      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
          {/* HEADER */}

          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Upload Department Report</h2>

            <button
              type="button"
              onClick={resetModal}
              className="text-2xl text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          {/* STEP 1 */}

          {step === 1 && (
            <>
              <p className="mb-5 text-slate-500">
                Select the department that owns this report.
              </p>

              <select
                className="w-full rounded-lg border p-3"
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

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-white"
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
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-dashed
                  p-12
                  hover:bg-slate-50
                "
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                <p className="text-lg font-semibold">Drag & Drop File</p>

                <p className="mt-2 text-slate-500">or click to browse</p>

                <p className="mt-5 text-sm text-slate-400">
                  Excel • CSV • PDF • Image
                </p>
              </label>

              {file && (
                <div className="mt-5 rounded-lg bg-slate-100 p-4">
                  <p className="font-semibold">Selected File</p>

                  <p>{file.name}</p>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-lg border px-6 py-3"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handleProcessAI}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-white"
                >
                  Process With AI
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FEEDBACK MODAL */}

      {uploadResult && (
        <FeedbackModal
          open={feedbackOpen}
          onClose={() => {
            setFeedbackOpen(false);
            setUploadResult(null);
          }}
          result={uploadResult}
        />
      )}
    </>
  );
}
