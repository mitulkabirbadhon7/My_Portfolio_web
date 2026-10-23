"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Terminal } from "lucide-react";

interface TechPortraitProps {
  imageUrl?: string | null;
  alt?: string;
  parallaxOffset?: number;
}

export function TechPortrait({
  imageUrl,
  alt = "Mitul Kabir Badhon",
  parallaxOffset = 0,
}: TechPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    if (typeof window !== "undefined") {
      const isFine = window.matchMedia("(pointer: fine)").matches;
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!isFine || isReduced) return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Technical micro-tilt: max 3.5 degrees
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] group select-none"
      style={{
        perspective: 1000,
        transform: `translate3d(0, ${parallaxOffset}px, 0)`,
        transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Outer Tech Frame with Cyber Border & Glow */}
      <div
        className="relative size-full rounded-xl border border-[#2A2A2A] bg-[#141414] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-[#337418] group-hover:shadow-[0_0_30px_rgba(93,214,44,0.15)]"
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
            : "rotateX(0deg) rotateY(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Inner Container */}
        <div className="relative size-full overflow-hidden rounded-lg bg-[#0F0F0F] border border-[#202020]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={alt}
              fill
              sizes="(max-width: 768px) 340px, 380px"
              className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] filter contrast-[1.03]"
              priority
            />
          ) : (
            <div className="size-full flex flex-col justify-between p-6 bg-gradient-to-b from-[#202020] to-[#0F0F0F]">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#5DD62C]">
                SYS.ID // 0x4D4B42
              </span>
              <div className="space-y-1 font-sans">
                <span className="font-bold text-2xl text-[#F8F8F8]">Mitul Kabir </span>
                <span className="font-bold text-2xl text-[#5DD62C]">Badhon</span>
                <p className="font-mono text-xs text-[#9E9E9E] pt-1">Dhaka, Bangladesh</p>
              </div>
              <div className="border-t border-[#2A2A2A] pt-3 text-[11px] font-mono text-[#9E9E9E]">
                Available for engineering systems
              </div>
            </div>
          )}

          {/* Technical Subtle CRT / Radar Scanline Animation */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 tech-crt-grid opacity-70"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#5DD62C]/10 to-transparent tech-scan-beam"
          />

          {/* Precision Laser Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#5DD62C] to-transparent shadow-[0_0_8px_rgba(93,214,44,0.8)] tech-laser-line"
          />

          {/* Top Telemetry Header */}
          <div className="pointer-events-none absolute top-2.5 inset-x-2.5 flex items-center justify-between px-2 py-0.5 rounded bg-[#0F0F0F]/80 backdrop-blur-xs border border-[#2A2A2A]/70 text-[9px] font-mono text-[#9E9E9E] tracking-tight z-10">
            <span className="text-[#5DD62C] font-semibold">PORT: 443 // TLS</span>
            <span>DIAG: NOMINAL</span>
          </div>

          {/* Center Targeting Reticle (Snaps into focus on hover) */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-200 z-10 ${
              isHovered ? "opacity-75 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="relative size-10 flex items-center justify-center">
              <div className="absolute w-full h-[1px] bg-[#5DD62C]/60" />
              <div className="absolute h-full w-[1px] bg-[#5DD62C]/60" />
              <div className="size-3.5 rounded-full border border-[#5DD62C]/80" />
            </div>
          </div>

          {/* HUD Targeting Reticles (4 Corners) */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-8 left-2.5 size-3.5 border-t-2 border-l-2 border-[#5DD62C] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${
              isHovered
                ? "translate-x-0.5 translate-y-0.5 opacity-100 shadow-[0_0_6px_rgba(93,214,44,0.8)]"
                : "opacity-40"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-8 right-2.5 size-3.5 border-t-2 border-r-2 border-[#5DD62C] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${
              isHovered
                ? "-translate-x-0.5 translate-y-0.5 opacity-100 shadow-[0_0_6px_rgba(93,214,44,0.8)]"
                : "opacity-40"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-8 left-2.5 size-3.5 border-b-2 border-l-2 border-[#5DD62C] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${
              isHovered
                ? "translate-x-0.5 -translate-y-0.5 opacity-100 shadow-[0_0_6px_rgba(93,214,44,0.8)]"
                : "opacity-40"
            }`}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-8 right-2.5 size-3.5 border-b-2 border-r-2 border-[#5DD62C] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${
              isHovered
                ? "-translate-x-0.5 -translate-y-0.5 opacity-100 shadow-[0_0_6px_rgba(93,214,44,0.8)]"
                : "opacity-40"
            }`}
          />

          {/* Engineering Coordinates & Telemetry Stamp */}
          <div className="pointer-events-none absolute bottom-2.5 inset-x-2.5 flex items-center justify-between px-2 py-1 rounded bg-[#0F0F0F]/85 backdrop-blur-xs border border-[#2A2A2A]/80 text-[10px] font-mono text-[#9E9E9E] tracking-tight z-10">
            <span className="flex items-center gap-1.5 text-[#5DD62C]">
              <Terminal className="size-3" />
              <span>SYS.ENG</span>
            </span>
            <span className="text-[9px] text-[#9E9E9E]/90 hidden sm:inline">
              23.81°N 90.41°E
            </span>
            <span className="text-[9px] font-semibold text-[#F8F8F8] tracking-widest uppercase">
              {isHovered ? "TARGET LOCK" : "ACTIVE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
