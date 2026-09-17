import React from "react";

export default function RootLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8 animate-pulse"
    >
      <span className="sr-only">Loading portfolio overview...</span>

      {/* Bento Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12">
        {/* Hero Section Skeleton (8 cols) */}
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-10 md:col-span-8 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            {/* Status pill placeholder */}
            <div className="h-6 w-36 rounded-full bg-[#2A2A2A]" />
            {/* Main title lines */}
            <div className="space-y-3">
              <div className="h-10 w-3/4 rounded-xl bg-[#2A2A2A]" />
              <div className="h-8 w-1/2 rounded-xl bg-[#2A2A2A]" />
            </div>
            {/* Bio lines */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded-md bg-[#2A2A2A]" />
              <div className="h-4 w-5/6 rounded-md bg-[#2A2A2A]" />
              <div className="h-4 w-2/3 rounded-md bg-[#2A2A2A]" />
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="h-10 w-36 rounded-lg bg-[#2A2A2A]" />
            <div className="h-10 w-32 rounded-lg bg-[#2A2A2A]" />
            <div className="h-10 w-28 rounded-lg bg-[#2A2A2A]" />
          </div>
        </div>

        {/* Engineering Pillars Skeleton (4 cols) */}
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 md:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded-md bg-[#2A2A2A]" />
            <div className="h-6 w-40 rounded-lg bg-[#2A2A2A]" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-[#2A2A2A] bg-[#161616] p-3"
              >
                <div className="size-8 rounded-lg bg-[#2A2A2A]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 rounded-md bg-[#2A2A2A]" />
                  <div className="h-3 w-32 rounded-md bg-[#2A2A2A]" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-4 w-32 rounded-md bg-[#2A2A2A]" />
        </div>

        {/* Skills Bento Item (12 cols) */}
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 md:col-span-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 rounded-lg bg-[#2A2A2A]" />
            <div className="h-4 w-28 rounded-md bg-[#2A2A2A]" />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-[#2A2A2A]" />
            ))}
          </div>
        </div>

        {/* Projects Preview Skeleton (12 cols) */}
        <div className="md:col-span-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-7 w-44 rounded-lg bg-[#2A2A2A]" />
            <div className="h-5 w-28 rounded-md bg-[#2A2A2A]" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] p-5 space-y-4"
              >
                <div className="h-36 w-full rounded-xl bg-[#161616]" />
                <div className="space-y-2">
                  <div className="h-5 w-3/4 rounded-lg bg-[#2A2A2A]" />
                  <div className="h-3.5 w-full rounded-md bg-[#2A2A2A]" />
                  <div className="h-3.5 w-2/3 rounded-md bg-[#2A2A2A]" />
                </div>
                <div className="flex gap-1.5 pt-2">
                  <div className="h-5 w-14 rounded-md bg-[#2A2A2A]" />
                  <div className="h-5 w-16 rounded-md bg-[#2A2A2A]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
