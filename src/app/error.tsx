"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <div className="max-w-md">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="mb-4 text-2xl font-bold text-slate-100">
          Something went wrong
        </h1>
        <p className="mb-8 text-slate-400">
          We couldn&apos;t load the page. This might be a temporary issue with
          our content system.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-green px-6 py-3 font-semibold text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-green-dark hover:shadow-[0_4px_12px_var(--green-glow)]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
