"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
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
            flex h-screen w-64 shrink-0 flex-col
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

        {/* MAIN CONTENT */}
        <main
          className={`
            min-h-screen bg-slate-100
            transition-all duration-300 ease-in-out
            ${isOpen ? "ml-64" : "ml-0"}
          `}
        >
          <section className="p-6">
            <Header />
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}
