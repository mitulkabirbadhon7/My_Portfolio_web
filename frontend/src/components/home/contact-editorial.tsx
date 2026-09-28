"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { Settings } from "@/types";

interface ContactEditorialProps {
  settings?: Settings | null;
}

export function ContactEditorial({ settings }: ContactEditorialProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isInside, setIsInside] = useState(false);
  const [canSpotlight, setCanSpotlight] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanSpotlight(isFine && !isReduced);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canSpotlight || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const email = settings?.contactEmail || "mitulkabirbadhon7@gmail.com";
  const github = settings?.githubUrl || "https://github.com/mitulkabirbadhon7";
  const linkedin = settings?.linkedinUrl || "https://linkedin.com/in/mitulkabirbadhon";

  return (
    <section
      id="contact"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
      aria-label="Contact and Inquiries"
      className="dark-section relative overflow-hidden bg-[#0F0F0F] text-[#F8F8F8] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-24 sm:py-32"
      style={{
        paddingTop: "clamp(80px, 14vh, 160px)",
        paddingBottom: "clamp(80px, 14vh, 160px)",
      }}
    >
      {/* Exclusive Cursor Spotlight Glow (Active on this dark section only) */}
      {canSpotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: isInside ? 0.18 : 0,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(93, 214, 44, 0.45), transparent 80%)`,
          }}
        />
      )}

      {/* Decorative Hairline Top Border */}
      <div className="absolute inset-x-0 top-0 h-px bg-[#2A2A2A]" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-16">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
              Contact &amp; Collaboration
            </span>
            <span className="h-px w-12 bg-[#2A2A2A]" />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#F8F8F8] leading-[1.08] max-w-[20ch]">
            Let&apos;s build something durable.
          </h2>

          <p className="text-base sm:text-lg text-[#9E9E9E] max-w-[54ch] font-sans pt-2">
            Available for software engineering roles, distributed architecture consulting, or
            demanding web projects. Let&apos;s talk about what you&apos;re solving.
          </p>
        </div>

        {/* Large Prominent Email Link with Animated Green Underline */}
        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#9E9E9E]">
            Direct Transmission
          </span>
          <div>
            <a
              href={`mailto:${email}`}
              className="link-editorial font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#F8F8F8] hover:text-[#5DD62C] tracking-tight transition-colors duration-200"
            >
              {email}
            </a>
          </div>
        </div>

        {/* CTA Action */}
        <div className="pt-8 border-t border-[#2A2A2A] flex items-center justify-start">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-6 py-3.5 text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:bg-[#5DD62C]/90 hover:shadow-[0_0_20px_rgba(93,214,44,0.35)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <Send className="size-4" />
            <span>Open Contact Form</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
