"use client";

import Popup from "./Popup";

type FeedbackResult = {
  status: "success" | "error" | "failed";
  department?: string;
  filename?: string;
  error_type?: string;
  message?: string;
  expected?: string | string[];
  details?: string[];
  database_result?: {
    status?: string;
    inserted_rows?: number;
    skipped_duplicates?: number;
    total_processed?: number;
    message?: string;
    error?: string;
  };
};

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
  result: FeedbackResult | null;
};

export default function FeedbackModal({
  open,
  onClose,
  result,
}: FeedbackModalProps) {
  if (!result) return null;

  const isSuccess = result.status === "success";

  return (
    <Popup
      open={open}
      onClose={onClose}
      title={isSuccess ? "Upload Successful" : "Upload Failed"}
    >
      {" "}
      <div className="space-y-5">
        {/* STATUS */}

        <div
          className={`rounded-xl p-4 ${
            isSuccess ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          <p className="font-bold text-lg">
            {isSuccess
              ? "✓ File processed successfully"
              : "✕ File cannot be processed"}
          </p>

          {result.message && <p className="mt-2 text-sm">{result.message}</p>}
        </div>
        {/* FILE INFO */}
        {(result.filename || result.department) && (
          <div className="rounded-xl bg-slate-50 p-4 space-y-2">
            {result.filename && (
              <div>
                <p className="text-xs text-slate-500">File</p>

                <p className="font-semibold text-slate-800 break-all">
                  {result.filename}
                </p>
              </div>
            )}

            {result.department && (
              <div>
                <p className="text-xs text-slate-500">Department</p>

                <p className="font-semibold text-slate-800">
                  {result.department}
                </p>
              </div>
            )}
          </div>
        )}
        {/* ERROR TYPE */}
        {!isSuccess && result.error_type && (
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Error Type
            </p>

            <p className="mt-1 font-semibold text-red-600">
              {result.error_type.replaceAll("_", " ")}
            </p>
          </div>
        )}
        {/* EXPECTED */}
        {!isSuccess && result.expected && (
          <div>
            <p className="text-sm font-bold text-slate-800">Expected</p>

            {Array.isArray(result.expected) ? (
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                {result.expected.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-600">{result.expected}</p>
            )}
          </div>
        )}
        {/* DETAILS */}
        {!isSuccess && result.details && result.details.length > 0 && (
          <div>
            <p className="text-sm font-bold text-slate-800">Details</p>

            <div className="mt-2 max-h-40 overflow-y-auto rounded-lg bg-slate-50 p-3">
              <ul className="space-y-2 text-sm text-slate-600">
                {result.details.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* DATABASE RESULT */}
        {isSuccess && result.database_result && (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="mb-3 font-bold text-slate-800">Database Result</p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-slate-500">Inserted</p>

                <p className="text-xl font-bold text-green-600">
                  {result.database_result.inserted_rows ?? 0}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Duplicate</p>

                <p className="text-xl font-bold text-orange-500">
                  {result.database_result.skipped_duplicates ?? 0}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Processed</p>

                <p className="text-xl font-bold text-slate-800">
                  {result.database_result.total_processed ?? 0}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className={`w-full rounded-xl px-5 py-3 font-semibold text-white ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          Close
        </button>
      </div>
    </Popup>
  );
}
