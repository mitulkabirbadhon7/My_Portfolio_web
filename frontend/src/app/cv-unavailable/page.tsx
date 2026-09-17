import { Metadata } from "next";
import Link from "next/link";
import { FileQuestion, ArrowLeft, Mail, FolderKanban } from "lucide-react";

export const metadata: Metadata = {
  title: "CV Currently Unavailable | Portfolio",
  description:
    "The requested Curriculum Vitae is currently being updated. Reach out directly or explore selected projects in the meantime.",
};

export default function CvUnavailablePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 text-center">
      <div className="relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] p-8 sm:p-12 shadow-2xl">
        {/* Glow ambient background element */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-48 rounded-full bg-[#5DD62C]/10 blur-3xl"
        />

        {/* Icon */}
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-[#337418] bg-[#0F0F0F] text-[#5DD62C] shadow-[0_0_20px_rgba(93,214,44,0.15)]">
          <FileQuestion className="size-8 stroke-[1.75]" />
        </div>

        {/* Status Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#337418]/60 bg-[#0F0F0F] px-3.5 py-1 text-xs font-semibold text-[#5DD62C]">
          <span className="size-1.5 rounded-full bg-[#5DD62C] animate-pulse" />
          <span>Document In Revision</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8]">
          Curriculum Vitae Unavailable
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#9E9E9E]">
          The official resume is currently undergoing routine revisions with recent architectural
          milestones, project case studies, and updated skills. In the meantime, you can explore
          my technical background and verified works below.
        </p>

        {/* Alternative CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/projects"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-5 py-2.5 text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_15px_rgba(93,214,44,0.3)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <FolderKanban className="size-4" />
            <span>Explore Projects</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-5 py-2.5 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#5DD62C]/60 hover:text-[#5DD62C] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <Mail className="size-4" />
            <span>Request via Contact</span>
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-[#2A2A2A]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#9E9E9E] transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Portfolio Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
