"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Settings } from "@/types";
import { MagneticButton } from "@/components/motion/magnetic-button";

interface HeroEditorialProps {
  settings?: Settings | null;
}

export function HeroEditorial({ settings }: HeroEditorialProps) {
  const [scrollY, setScrollY] = useState(0);

  // Subtle gentle parallax for hero portrait (max ±24px, disabled if prefers-reduced-motion)
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = Math.min(Math.max(scrollY * 0.08, -24), 24);

  return (
    <section
      aria-label="Introduction"
      className="relative min-h-[82vh] flex flex-col justify-between pt-12 pb-16 sm:pt-16 sm:pb-24 overflow-hidden"
      style={{
        paddingTop: "clamp(60px, 10vh, 120px)",
        paddingBottom: "clamp(60px, 10vh, 120px)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Asymmetrical Typography (col-span-7) */}
        <div className="lg:col-span-7 space-y-8 z-10">
          {/* Status kicker */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#337418]/60 bg-[#202020] px-3 py-1">
            <span className="size-2 rounded-full bg-[#5DD62C] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
              Software Engineer &bull; Systems &bull; Web
            </span>
          </div>

          {/* Large Name */}
          <div className="space-y-4">
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-bold tracking-tight leading-[1.06]">
              <span className="text-[#F8F8F8]">Mitul Kabir </span>
              <span className="text-[#5DD62C] drop-shadow-[0_0_24px_rgba(93,214,44,0.35)]">Badhon</span>
            </h1>

            <p className="text-base sm:text-lg text-[#9E9E9E] max-w-[56ch] leading-relaxed font-sans pt-2">
              Building resilient backend architectures, production TypeScript systems, and calm,
              responsive digital interfaces with rigorous craft.
            </p>
          </div>

          {/* Dual Actions with Magnetic Physics */}
          <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6">
            <MagneticButton strength={6}>
              <Link
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-6 py-3.5 text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:bg-[#5DD62C]/90 hover:shadow-[0_0_20px_rgba(93,214,44,0.35)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
              >
                <span>Selected Projects</span>
                <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              </Link>
            </MagneticButton>

            <MagneticButton strength={6}>
              <Link
                href="#contact"
                className="group inline-flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] bg-[#202020] px-5 py-3.5 text-sm font-medium text-[#F8F8F8] transition-all duration-200 hover:border-[#5DD62C] hover:text-[#5DD62C] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
              >
                <span>Get in Touch</span>
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </MagneticButton>
          </div>
        </div>

        {/* Right Column: Off-Center Asymmetrical Portrait (col-span-5) */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <div
            className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#202020] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] lg:translate-x-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#337418]"
            style={{
              transform: `translate3d(0, ${parallaxOffset}px, 0)`,
            }}
          >
            <div className="relative size-full overflow-hidden rounded-lg bg-[#0F0F0F]">
              {settings?.homeProfileImage ? (
                <Image
                  src={settings.homeProfileImage}
                  alt="Mitul Kabir Badhon"
                  fill
                  sizes="(max-width: 768px) 340px, 380px"
                  className="object-cover object-top transition-transform duration-500 hover:scale-102"
                  priority
                />
              ) : (
                <div className="size-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#202020] to-[#0F0F0F]">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#5DD62C]">
                    Profile
                  </span>
                  <div className="space-y-1 font-sans">
                    <span className="font-bold text-2xl text-[#F8F8F8]">
                      Mitul Kabir{" "}
                    </span>
                    <span className="font-bold text-2xl text-[#5DD62C]">
                      Badhon
                    </span>
                    <p className="font-mono text-xs text-[#9E9E9E] pt-1">Dhaka, Bangladesh</p>
                  </div>
                  <div className="border-t border-[#2A2A2A] pt-3 text-[11px] font-mono text-[#9E9E9E]">
                    Available for senior engineering roles
                  </div>
                </div>
              )}
            </div>

            {/* Editorial stamp/note on edge */}
            <div className="absolute -bottom-2 -left-2 bg-[#0F0F0F] border border-[#337418] text-[#5DD62C] px-3 py-1 font-mono text-[10px] uppercase tracking-wider rounded-md hidden sm:block shadow-md">
              Full-Stack &bull; 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
