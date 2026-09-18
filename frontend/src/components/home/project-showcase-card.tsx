"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Code2, Layers } from "lucide-react";
import { Project } from "@/types";

interface ProjectShowcaseCardProps {
  projects: Project[];
}

export function ProjectShowcaseCard({ projects }: ProjectShowcaseCardProps) {
  // Filter projects with valid cover/preview images
  const validProjects = useMemo(() => {
    return projects.filter((p) => Boolean(p.image?.trim()));
  }, [projects]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const total = validProjects.length;

  const nextSlide = useCallback(() => {
    if (total > 1) {
      setCurrentIndex((prev) => (prev + 1) % total);
    }
  }, [total]);

  // Auto-cycle through project images periodically
  useEffect(() => {
    if (total <= 1) return;

    // Faster rotation when hovered (1.8s) for dynamic preview, 3.5s when idle
    const intervalTime = isHovered ? 1800 : 3500;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [total, isHovered, nextSlide]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Cycle to next picture immediately on hover
    if (total > 1) {
      nextSlide();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const currentProject = total > 0 ? validProjects[currentIndex] : null;
  // Next project for the secondary phone mockup (or current if only 1)
  const nextProject = total > 1 ? validProjects[(currentIndex + 1) % total] : currentProject;

  return (
    <Link
      href="/projects"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="lg:col-span-7 group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 transition-all duration-300 hover:border-[#337418] hover:shadow-[0_0_24px_rgba(93,214,44,0.15)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
      aria-label="View Projects Showcase Gallery"
    >
      {/* Device Mockups Preview Area */}
      <div className="relative h-56 sm:h-64 w-full rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4 flex items-center justify-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute size-48 rounded-full bg-[#5DD62C]/10 blur-3xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

        {/* Laptop Screen Mockup */}
        <div className="relative w-72 sm:w-80 md:w-96 h-40 sm:h-44 rounded-t-xl border-2 border-[#2A2A2A] bg-[#181818] p-1.5 shadow-2xl transition-transform duration-300 group-hover:scale-105 flex flex-col">
          {/* Mockup Browser Window Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#2A2A2A] px-1.5">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#EF4444]" />
              <span className="size-2 rounded-full bg-yellow-500" />
              <span className="size-2 rounded-full bg-[#5DD62C]" />
            </div>
            {currentProject && (
              <span className="font-mono text-[9px] text-[#9E9E9E] truncate max-w-[140px]">
                {currentProject.title}
              </span>
            )}
            <span className="size-2 rounded-full bg-[#337418]/60" />
          </div>

          {/* Laptop Screen Content: Project Image Display */}
          <div className="relative flex-1 rounded overflow-hidden bg-gradient-to-br from-[#202020] to-[#0F0F0F]">
            {currentProject?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={currentProject._id}
                src={currentProject.image}
                alt={currentProject.title}
                className="size-full object-cover object-top transition-opacity duration-500 animate-in fade-in"
                loading="eager"
              />
            ) : (
              <div className="size-full flex flex-col items-center justify-center p-2 text-center">
                <Code2 className="size-6 text-[#5DD62C] mb-1" />
                <span className="text-[10px] font-mono text-[#F8F8F8]">Full-Stack Web Platforms</span>
                <span className="text-[9px] font-mono text-[#9E9E9E]">High-Performance Architectures</span>
              </div>
            )}

            {/* Subtitle / Tech pill in bottom corner of laptop */}
            {currentProject && (
              <div className="absolute bottom-1.5 left-1.5 rounded-md bg-[#0F0F0F]/85 px-2 py-0.5 text-[9px] font-mono text-[#5DD62C] backdrop-blur-xs border border-[#2A2A2A] max-w-[160px] truncate">
                {currentProject.techStack?.[0] || "Featured Project"}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Phone Mockup (Overlapping on the right) */}
        <div className="absolute right-2 sm:right-6 bottom-3 w-20 sm:w-24 h-36 sm:h-44 rounded-2xl border-2 border-[#337418] bg-[#0F0F0F] p-1 shadow-2xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 overflow-hidden flex flex-col">
          <div className="relative size-full rounded-xl overflow-hidden bg-[#181818]">
            {nextProject?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={nextProject._id}
                src={nextProject.image}
                alt={nextProject.title}
                className="size-full object-cover object-center transition-opacity duration-500 animate-in fade-in"
                loading="eager"
              />
            ) : (
              <div className="size-full flex flex-col items-center justify-center p-1 text-center">
                <Sparkles className="size-4 text-[#5DD62C] mb-1" />
                <span className="text-[8px] font-mono text-[#F8F8F8]">Mobile &amp; APIs</span>
              </div>
            )}

            {/* Mobile Notch Indicator */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-[#2A2A2A]" />
          </div>
        </div>

        {/* Active Project Pagination Dots (if multiple projects exist) */}
        {total > 1 && (
          <div className="absolute bottom-2 left-4 flex items-center gap-1.5 z-10">
            {validProjects.map((p, idx) => (
              <span
                key={p._id}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-4 h-1.5 bg-[#5DD62C]"
                    : "size-1.5 bg-[#2A2A2A] hover:bg-[#5DD62C]/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Showcase Footer Content */}
      <div className="mt-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#9E9E9E]">
              SHOWCASE
            </span>
            {total > 0 && (
              <span className="rounded-full bg-[#5DD62C]/10 border border-[#5DD62C]/30 px-2 py-0.2 text-[10px] font-mono text-[#5DD62C]">
                {currentIndex + 1} / {total}
              </span>
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8F8F8] transition-colors group-hover:text-[#5DD62C] mt-0.5">
            Projects
          </h3>
        </div>

        {/* Target / Sparkle Icon */}
        <span className="flex size-10 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#0F0F0F] text-[#9E9E9E] transition-all duration-200 group-hover:border-[#5DD62C] group-hover:text-[#5DD62C] group-hover:scale-110">
          <Sparkles className="size-4 text-[#5DD62C]" />
        </span>
      </div>
    </Link>
  );
}
