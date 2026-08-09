"use client";

import { useState } from "react";

import Popup from "./Popup";
import type { FeedbackModalProps } from "@/types/upload";

export default function FeedbackModal({
  open,
  onClose,
  result,
}: FeedbackModalProps) {
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  if (!open || !result) {
    return null;
  }

  const isSuccess = result.status === "success";

  const hasCortexContent = Boolean(result.cortex_content?.content);

  function handleClose() {
    setShowAIAnalysis(false);
    onClose();
  }

  return (
    <Popup
      open={open}
      onClose={handleClose}
      title={
        isSuccess
          ? "Upload Successfully Processed"
          : "Production Report Requires Review"
      }
    >
      <div className="space-y-5">
        {/* =========================================
            STATUS
        ========================================= */}

        <div
          className={`rounded-xl border p-5 ${
            isSuccess
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                isSuccess
                  ? "bg-green-600 text-white"
                  : "bg-amber-500 text-white"
              }`}
            >
              {isSuccess ? "✓" : "!"}
            </div>

            <div>
              <h3
                className={`font-bold ${
                  isSuccess ? "text-green-800" : "text-amber-800"
                }`}
              >
                {isSuccess
                  ? "Document Successfully Processed"
                  : "AI Analysis Completed"}
              </h3>

              <p
                className={`mt-1 text-sm ${
                  isSuccess ? "text-green-700" : "text-amber-700"
                }`}
              >
                {result.message}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            FILE INFORMATION
        ========================================= */}

        {(result.filename || result.department) && (
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {result.filename && (
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Document
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {result.filename}
                  </p>
                </div>
              )}

              {result.department && (
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Department
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {result.department}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================
            AI SUMMARY
        ========================================= */}

        {!isSuccess && result.ai_summary && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                AI
              </span>

              <h3 className="font-bold text-blue-900">
                {result.ai_summary.title ?? "AI Document Analysis"}
              </h3>
            </div>

            {result.ai_summary.message && (
              <p className="mt-3 text-sm leading-6 text-blue-800">
                {result.ai_summary.message}
              </p>
            )}
          </div>
        )}

        {/* =========================================
            ERROR TYPE
        ========================================= */}

        {!isSuccess && result.error_type && (
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              Validation Status
            </p>

            <p className="mt-1 font-semibold text-red-600">
              {result.error_type.replaceAll("_", " ")}
            </p>
          </div>
        )}

        {/* =========================================
            EXPECTED
        ========================================= */}

        {!isSuccess && result.expected && (
          <div>
            <p className="text-sm font-bold text-slate-800">
              Required Information
            </p>

            {Array.isArray(result.expected) ? (
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {result.expected.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {result.expected}
              </p>
            )}
          </div>
        )}

        {/* =========================================
            DETAILS
        ========================================= */}

        {!isSuccess && result.details && result.details.length > 0 && (
          <div>
            <p className="text-sm font-bold text-slate-800">System Findings</p>

            <div className="mt-2 max-h-32 overflow-y-auto rounded-xl bg-slate-50 p-4">
              <ul className="space-y-2 text-sm text-slate-600">
                {result.details.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* =========================================
            CORTEX ANALYSIS
        ========================================= */}

        {!isSuccess && hasCortexContent && (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setShowAIAnalysis(!showAIAnalysis)}
              className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
            >
              <div>
                <p className="font-semibold text-slate-800">
                  View AI Document Reading
                </p>

                <p className="text-xs text-slate-500">
                  Review the information extracted by Cortex
                </p>
              </div>

              <span className="text-lg text-slate-500">
                {showAIAnalysis ? "▲" : "▼"}
              </span>
            </button>

            {showAIAnalysis && (
              <div className="space-y-4 border-t bg-white p-4">
                {/* DETECTED TEXT */}

                {result.ai_summary?.detected_text && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Detected Content
                    </p>

                    <div className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-4 font-mono text-sm leading-6 text-slate-100">
                      {result.ai_summary.detected_text}
                    </div>
                  </div>
                )}

                {/* METADATA */}

                {result.cortex_content?.metadata && (
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Document Metadata
                    </p>

                    <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                      {result.cortex_content.metadata.pageCount !==
                        undefined && (
                        <p>
                          Pages:{" "}
                          <span className="font-semibold text-slate-800">
                            {result.cortex_content.metadata.pageCount}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================
            DATABASE RESULT
        ========================================= */}

        {isSuccess && result.database_result && (
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="mb-4 font-bold text-slate-800">
              Database Registration
            </p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-slate-500">Inserted</p>

                <p className="mt-1 text-2xl font-bold text-green-600">
                  {result.database_result.inserted_rows ?? 0}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Duplicates</p>

                <p className="mt-1 text-2xl font-bold text-orange-500">
                  {result.database_result.skipped_duplicates ?? 0}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Processed</p>

                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {result.database_result.total_processed ?? 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            CLOSE
        ========================================= */}

        <button
          type="button"
          onClick={handleClose}
          className={`w-full rounded-xl px-5 py-3 font-semibold text-white transition ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-slate-800 hover:bg-slate-900"
          }`}
        >
          Close
        </button>
      </div>
    </Popup>
  );
}
