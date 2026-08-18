"use client";

import Link from "next/link";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* LEFT EDGE HOT ZONE */}
      {!isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          className="fixed left-0 top-0 z-50 h-screen w-5"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-40
          flex h-screen w-64 flex-col
          bg-slate-900 p-6 text-white
          shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold">AI Operations Director</h1>

          <button
            onClick={() => setIsOpen(false)}
            className="
              rounded-md
              px-2 py-1
              text-slate-400
              hover:bg-slate-800
              hover:text-white
            "
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link href="/" className="hover:text-blue-400">
            Dashboard
          </Link>

          <Link href="/#departments" className="hover:text-blue-400">
            Departments
          </Link>

          <Link href="/#analytics" className="hover:text-blue-400">
            Analytics
          </Link>

          <Link href="/#ai-decisions" className="hover:text-blue-400">
            AI Decisions
          </Link>

          <Link href="/#workflows" className="hover:text-blue-400">
            Workflows
          </Link>

          <Link href="/#work-orders" className="hover:text-blue-400">
            Work Orders
          </Link>

          <Link href="/database" className="hover:text-blue-400">
            Database
          </Link>
        </nav>
      </aside>
    </>
  );
}
