"use client";

import { useState } from "react";
import UploadReportModal from "@/components/EnterpriseDataUpload/UploadReportModal";

export default function EnterpriseDataUpload() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <>
      <div className="mb-8">
        <div
          onClick={() => setIsUploadOpen(true)}
          className="
            bg-white
            rounded-2xl
            shadow
            p-6
            border
            cursor-pointer
            hover:shadow-lg
            transition-all
            group
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div
                className="
                  w-14
                  h-14
                  rounded-xl
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  text-3xl
                "
              >
                📂
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Enterprise Data Upload
                </h3>

                <p className="text-slate-500 mt-1">
                  Upload department operational data and let AI analyze business
                  performance
                </p>
              </div>
            </div>

            <div
              className="
                bg-blue-600
                text-white
                px-5
                py-3
                rounded-xl
                font-semibold
                group-hover:bg-blue-700
                transition
              "
            >
              + Upload Report
            </div>
          </div>
        </div>
      </div>

      <UploadReportModal
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </>
  );
}
