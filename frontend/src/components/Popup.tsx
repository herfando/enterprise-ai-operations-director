"use client";

import { ReactNode } from "react";

type PopupProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export default function Popup({ open, onClose, children, title }: PopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
      {" "}
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-4">
          {title && (
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-2xl text-slate-400 hover:text-slate-700"
          ></button>
        </div>

        {/* CONTENT */}

        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
