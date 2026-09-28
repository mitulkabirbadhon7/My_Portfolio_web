"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Settings } from "@/types";

interface AboutBriefProps {
  settings?: Settings | null;
}

export function AboutBrief({ settings }: AboutBriefProps) {
  return (
    <section
      id="about"
      aria-label="About Mitul Kabir Badhon"
      className="border-t border-[#2A2A2A] py-20 sm:py-28"
      style={{
        paddingTop: "clamp(70px, 12vh, 140px)",
        paddingBottom: "clamp(70px, 12vh, 140px)",
      }}
    >
      <div className="space-y-12">
        {/* Section Index & Subtitle */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
            Philosophy &amp; Voice
          </span>
          <span className="h-px w-12 bg-[#2A2A2A]" />
        </div>

        {/* Asymmetrical 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Main Statement (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F8F8F8] leading-[1.18]">
              {settings?.philosophyHeadline || "I build web software with an emphasis on clarity, architectural durability, and zero superfluous fluff."}
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-[#9E9E9E] leading-relaxed font-sans max-w-[62ch]">
              {settings?.philosophyBio ? (
                <p className="whitespace-pre-line">{settings.philosophyBio}</p>
              ) : (
                <>
                  <p>
                    My work centers on the intersection of dependable server architectures and thoughtful,
                    uncluttered digital interfaces. Rather than chasing every passing framework trend, I
                    focus on clean state management, predictable data pipelines, and fast, accessible frontends.
                  </p>
                  <p>
                    Studying B.Sc. in Computer Science &amp; Engineering at {settings?.universityName || "Daffodil International University (DIU)"}. When I write code, I treat maintainability, runtime stability,
                    and type safety as foundational craftsmanship, not afterthoughts.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Link
                href="/about"
                className="link-editorial text-sm font-semibold tracking-wide text-[#F8F8F8] hover:text-[#5DD62C] inline-flex items-center gap-1 transition-colors"
              >
                <span>Read background &amp; education history</span>
                <ArrowUpRight className="size-4" />
              </Link>

              {settings?.signatureImage && (
                <div className="relative h-12 w-40 rounded-lg border border-[#2A2A2A] bg-[#141414] p-1 overflow-hidden">
                  <Image
                    src={settings.signatureImage}
                    alt="Signature"
                    fill
                    sizes="160px"
                    className="object-contain p-1 filter brightness-110"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: "Currently" Human Touch Card (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#5DD62C] animate-pulse shadow-[0_0_8px_rgba(93,214,44,0.6)]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#F8F8F8] font-semibold">
                    Currently
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#9E9E9E]">Updated recently</span>
              </div>

              <ul className="space-y-3.5 text-sm text-[#9E9E9E]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5DD62C] shrink-0 mt-0.5" />
                  <span>Designing high-throughput backend APIs and database schemas with TypeScript.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5DD62C] shrink-0 mt-0.5" />
                  <span>Refining full-stack performance with Next.js 16 and streaming server components.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5DD62C] shrink-0 mt-0.5" />
                  <span>Reading about distributed consensus algorithms and systems architecture.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-mono text-[#9E9E9E]">
                <span>Status:</span>
                <span className="text-[#5DD62C] font-medium">Available for consulting / roles</span>
              </div>
            </div>

            {/* Hand-written style human note */}
            <div className="p-4 rounded-lg border border-dashed border-[#2A2A2A] bg-[#181818] text-[#9E9E9E] text-xs font-mono flex items-center justify-between">
              <span>&ldquo;Simplicity is prerequisite for reliability.&rdquo;</span>
              <span className="text-[11px] text-[#5DD62C] font-serif italic">&mdash; Edsger Dijkstra</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
