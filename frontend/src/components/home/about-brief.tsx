"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Server, Database, Cpu, Wrench } from "lucide-react";
import { Settings } from "@/types";

interface AboutBriefProps {
  settings?: Settings | null;
}

export function AboutBrief({ settings }: AboutBriefProps) {
  return (
    <section
      id="about"
      aria-label="About Mitul Kabir Badhon"
      className="border-t border-[#2A2A2A] py-16 sm:py-24"
      style={{
        paddingTop: "clamp(60px, 10vh, 120px)",
        paddingBottom: "clamp(60px, 10vh, 120px)",
      }}
    >
      <div className="space-y-10">
        {/* Section Index & Subtitle */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
            Core Stack &amp; Focus
          </span>
          <span className="h-px w-12 bg-[#2A2A2A]" />
        </div>

        {/* Asymmetrical 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Statement (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F8F8F8] leading-[1.15]">
                {settings?.philosophyHeadline || "Architecture over fluff. Systems that scale."}
              </h2>

              <p className="text-base sm:text-lg text-[#9E9E9E] leading-relaxed font-sans max-w-[56ch]">
                {settings?.philosophyBio || "Full-stack engineer specialized in production TypeScript services, distributed backends, and responsive client architectures."}
              </p>
            </div>

            {/* Feature Highlights Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4 space-y-1.5 transition-colors hover:border-[#337418]">
                <div className="flex items-center gap-2 text-[#5DD62C]">
                  <Server className="size-4" />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold">Backend Engines</span>
                </div>
                <p className="font-mono text-xs text-[#9E9E9E]">Node.js • Express • Next.js 16 SSR</p>
              </div>

              <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4 space-y-1.5 transition-colors hover:border-[#337418]">
                <div className="flex items-center gap-2 text-[#5DD62C]">
                  <Database className="size-4" />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold">Data &amp; Persistence</span>
                </div>
                <p className="font-mono text-xs text-[#9E9E9E]">PostgreSQL • MongoDB • Redis</p>
              </div>

              <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4 space-y-1.5 transition-colors hover:border-[#337418]">
                <div className="flex items-center gap-2 text-[#5DD62C]">
                  <Cpu className="size-4" />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold">Architecture</span>
                </div>
                <p className="font-mono text-xs text-[#9E9E9E]">REST APIs • WebSockets • Zod Types</p>
              </div>

              <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4 space-y-1.5 transition-colors hover:border-[#337418]">
                <div className="flex items-center gap-2 text-[#5DD62C]">
                  <Wrench className="size-4" />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold">Operations</span>
                </div>
                <p className="font-mono text-xs text-[#9E9E9E]">Docker • CI/CD • Vitest • Linux</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Link
                href="/about"
                className="link-editorial text-sm font-semibold tracking-wide text-[#F8F8F8] hover:text-[#5DD62C] inline-flex items-center gap-1 transition-colors"
              >
                <span>Full background &amp; education history</span>
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

          {/* Right Column: "Currently" Live Telemetry Card (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-[#F8F8F8] font-semibold">
                  Current Execution
                </span>
                <span className="font-mono text-[11px] text-[#5DD62C]">STATUS // ACTIVE</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#9E9E9E]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5DD62C] shrink-0" />
                  <span>High-throughput TypeScript APIs &amp; schema design</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5DD62C] shrink-0" />
                  <span>Next.js 16 streaming server components &amp; performance</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5DD62C] shrink-0" />
                  <span>Distributed caching &amp; database modeling</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-mono text-[#9E9E9E]">
                <span>Availability:</span>
                <span className="text-[#5DD62C] font-medium">Engineering roles &amp; consulting</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
