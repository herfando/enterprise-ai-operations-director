"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setIsOnline(false);
          return;
        }

        const data = await res.json();

        setIsOnline(data.status === "Backend running");
      } catch (error) {
        console.error("Backend health check error:", error);
        setIsOnline(false);
      }
    }

    checkBackend();
  }, []);

  return (
    <section className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Enterprise AI Command Center
        </h1>

        <p className="text-gray-500">
          Autonomous operational intelligence platform
        </p>
      </div>

      <div
        className={
          isOnline
            ? "bg-green-100 text-green-700 px-4 py-2 rounded-lg"
            : "bg-red-100 text-red-700 px-4 py-2 rounded-lg"
        }
      >
        {isOnline ? "System Online" : "System Offline"}
      </div>
    </section>
  );
}
