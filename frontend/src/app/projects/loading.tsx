import React from "react";

export default function ProjectsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 space-y-8 animate-pulse"
    >
      <span className="sr-only">Loading projects gallery...</span>

      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-28 rounded-md bg-[#2A2A2A]" />
        <div className="h-10 w-72 rounded-xl bg-[#2A2A2A]" />
        <div className="h-4 w-96 max-w-full rounded-md bg-[#2A2A2A]" />
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="space-y-4 rounded-2xl border border-[#2A2A2A] bg-[#202020] p-4 sm:p-6">
        {/* Search input placeholder */}
        <div className="h-11 w-full rounded-xl bg-[#161616]" />

        {/* Tech stack filter pills placeholder */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="h-4 w-20 rounded-md bg-[#2A2A2A] mr-1" />
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-[#161616]" />
          ))}
        </div>
      </div>

      {/* Project Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020]"
          >
            {/* Image Skeleton */}
            <div className="h-48 w-full bg-[#161616]" />

            {/* Card Content Skeleton */}
            <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
              <div className="space-y-2.5">
                {/* Tech pills */}
                <div className="flex flex-wrap gap-1.5">
                  <div className="h-5 w-16 rounded-md bg-[#2A2A2A]" />
                  <div className="h-5 w-20 rounded-md bg-[#2A2A2A]" />
                  <div className="h-5 w-14 rounded-md bg-[#2A2A2A]" />
                </div>
                {/* Title */}
                <div className="h-6 w-3/4 rounded-lg bg-[#2A2A2A]" />
                {/* Description lines */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-3.5 w-full rounded-md bg-[#2A2A2A]" />
                  <div className="h-3.5 w-5/6 rounded-md bg-[#2A2A2A]" />
                </div>
              </div>

              {/* Action bar skeleton */}
              <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A]">
                <div className="h-4 w-28 rounded-md bg-[#2A2A2A]" />
                <div className="size-5 rounded-md bg-[#2A2A2A]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
