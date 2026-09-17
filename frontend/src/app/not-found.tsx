import React from "react";
import Link from "next/link";
import { Home, FolderKanban, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#202020] p-8 sm:p-12 shadow-2xl">
        {/* Glow ambient background element */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full bg-[#5DD62C]/10 blur-3xl"
        />

        {/* 404 Badge */}
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#337418] bg-[#0F0F0F] px-4 py-1.5 text-xs font-semibold text-[#5DD62C] shadow-[0_0_15px_rgba(93,214,44,0.15)]">
          <span className="size-2 rounded-full bg-[#5DD62C] animate-ping" />
          <span>Error 404</span>
        </div>

        {/* Display Code */}
        <p className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-[#F8F8F8]">
          4<span className="text-[#5DD62C]">0</span>4
        </p>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#F8F8F8] sm:text-3xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#9E9E9E]">
          The route or resource you are looking for does not exist, has been moved, or is temporarily
          unavailable.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-5 py-2.5 text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_16px_rgba(93,214,44,0.3)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <Home className="size-4" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/projects"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-5 py-2.5 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#5DD62C]/60 hover:text-[#5DD62C] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <FolderKanban className="size-4" />
            <span>View Projects</span>
          </Link>
        </div>

        {/* Subtle helper */}
        <div className="mt-8 pt-6 border-t border-[#2A2A2A]">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9E9E9E] transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
          >
            <Search className="size-3.5" />
            <span>Looking for something specific? Contact me</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
