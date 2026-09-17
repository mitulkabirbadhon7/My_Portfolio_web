"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected client-side error boundaries for telemetry
    console.error("[Application Error Boundary Caught]:", error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-red-500/40 bg-[#202020] p-8 sm:p-12 shadow-2xl">
        {/* Glow ambient error background element */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full bg-red-500/10 blur-3xl"
        />

        {/* Error Icon */}
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-red-500/40 bg-[#0F0F0F] text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <AlertTriangle className="size-8 stroke-[1.75]" />
        </div>

        {/* Status Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-[#0F0F0F] px-3.5 py-1 text-xs font-semibold text-red-300">
          <span className="size-1.5 rounded-full bg-red-400 animate-pulse" />
          <span>System Exception</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold tracking-tight text-[#F8F8F8] sm:text-3xl">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#9E9E9E]">
          An unexpected error occurred while processing this view. You can attempt to recover by
          refreshing the state or navigating back home.
        </p>

        {/* Error Digest (if available) */}
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-[#737373]">
            Incident ID: <span className="text-[#9E9E9E]">{error.digest}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-5 py-2.5 text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_16px_rgba(93,214,44,0.3)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <RotateCcw className="size-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-5 py-2.5 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#5DD62C]/60 hover:text-[#5DD62C] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <Home className="size-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
