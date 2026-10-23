"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Settings } from "@/types";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { TechPortrait } from "@/components/home/tech-portrait";

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
          {/* Status kicker (No green dot as requested) */}
          <div className="inline-flex items-center rounded-full border border-[#337418]/60 bg-[#202020] px-3.5 py-1">
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
              Production backend systems • Distributed architectures • High-performance TypeScript.
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

        {/* Right Column: Off-Center Asymmetrical Portrait with Tech HUD Animation (col-span-5) */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
          <TechPortrait
            imageUrl={settings?.homeProfileImage}
            alt="Mitul Kabir Badhon"
            parallaxOffset={parallaxOffset}
          />
        </div>
      </div>
    </section>
  );
}
