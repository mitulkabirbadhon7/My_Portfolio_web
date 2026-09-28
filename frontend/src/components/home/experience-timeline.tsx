"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Building2 } from "lucide-react";
import { Experience, Settings } from "@/types";

interface ExperienceTimelineProps {
  experiences?: Experience[];
  settings?: Settings | null;
}

interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  organization: string;
  description: string[];
  type: "experience" | "education";
  isCurrent?: boolean;
}

export function ExperienceTimeline({
  experiences = [],
  settings,
}: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineFillPercent, setLineFillPercent] = useState(0);

  // Scroll-linked progressive vertical line fill in forest green
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start filling when container enters bottom, reach 100% when near top
      const totalDistance = rect.height + windowHeight * 0.2;
      const scrolledPast = windowHeight * 0.7 - rect.top;
      const progress = Math.min(Math.max(scrolledPast / totalDistance, 0), 1);

      setLineFillPercent(progress * 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Map real database experiences + academic milestones
  const milestones: TimelineMilestone[] = [];

  // Add DB experiences if present
  experiences.forEach((exp) => {
    milestones.push({
      id: exp._id,
      year: exp.current ? "Present" : exp.startDate?.slice(0, 4) || "2024",
      title: exp.role,
      organization: exp.company,
      description: Array.isArray(exp.description) ? exp.description : [exp.description],
      type: "experience",
      isCurrent: exp.current,
    });
  });

  // If no DB experiences yet, display Mitul's real foundational milestones & education
  if (milestones.length === 0) {
    milestones.push(
      {
        id: "aiub",
        year: settings?.universityYear || "2020 — 2024",
        title: settings?.universityDegree || "B.Sc. in Computer Science & Engineering",
        organization:
          settings?.universityName ||
          "Daffodil International University (DIU)",
        description: [
          `Graduated with academic distinction (${settings?.universityResult || "CGPA 3.85 / 4.00"}).`,
          "Focused on distributed systems, data structures, algorithms, and high-performance software architecture.",
          "Led team capstone engineering projects spanning modern web architectures and relational databases.",
        ],
        type: "education",
        isCurrent: false,
      },
      {
        id: "hsc",
        year: settings?.collegeYear || "2017 — 2019",
        title: settings?.collegeDegree || "Higher Secondary Certificate (HSC) • Science",
        organization: settings?.collegeName || "Higher Secondary College",
        description: [
          `Achieved top academic score (${settings?.collegeResult || "GPA 5.00 / 5.00"}).`,
          "Extensive foundation in advanced mathematics, physics, and computational logic.",
        ],
        type: "education",
        isCurrent: false,
      },
      {
        id: "ssc",
        year: settings?.schoolYear || "2015 — 2017",
        title: settings?.schoolDegree || "Secondary School Certificate (SSC) • Science",
        organization: settings?.schoolName || "Secondary High School",
        description: [
          `Graduated with honors (${settings?.schoolResult || "GPA 5.00 / 5.00"}).`,
          "Initial programming discovery with algorithmic problem-solving and computer science fundamentals.",
        ],
        type: "education",
        isCurrent: false,
      }
    );
  }

  return (
    <section
      id="experience"
      aria-label="Experience & Academic Timeline"
      className="border-t border-[#2A2A2A] py-20 sm:py-28"
      style={{
        paddingTop: "clamp(70px, 12vh, 140px)",
        paddingBottom: "clamp(70px, 12vh, 140px)",
      }}
    >
      <div className="space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
                Progression &amp; Timeline
              </span>
              <span className="h-px w-12 bg-[#2A2A2A]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F8F8F8]">
              Milestones along the way.
            </h2>
          </div>

          <Link
            href="/about"
            className="link-editorial text-sm font-semibold text-[#F8F8F8] hover:text-[#5DD62C] inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>Detailed career biography</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Timeline Container with Dynamic Scroll-Linked Vertical Line */}
        <div ref={containerRef} className="relative pl-6 sm:pl-10 ml-2 sm:ml-4 space-y-12">
          {/* Base Inactive Vertical Line */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-3 bottom-3 w-[1.5px] bg-[#2A2A2A]"
          />

          {/* Active Green Fill Line (Tied to scroll progress) */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-3 w-[1.5px] bg-[#5DD62C] shadow-[0_0_8px_rgba(93,214,44,0.6)] transition-[height] duration-150 ease-out"
            style={{
              height: `${lineFillPercent}%`,
              maxHeight: "calc(100% - 1.5rem)",
            }}
          />

          {/* Milestone Items */}
          {milestones.map((item, index) => {
            return (
              <article key={item.id || index} className="relative group">
                {/* Node Dot on the timeline */}
                <div
                  className={`absolute -left-[30px] sm:-left-[46px] top-1.5 flex size-3 sm:size-3.5 items-center justify-center rounded-full border-2 bg-[#0F0F0F] transition-colors duration-250 ${
                    item.isCurrent
                      ? "border-[#5DD62C] bg-[#5DD62C]"
                      : "border-[#2A2A2A] group-hover:border-[#5DD62C]"
                  }`}
                >
                  {item.isCurrent && (
                    <span className="size-1 rounded-full bg-[#0F0F0F] animate-ping" />
                  )}
                </div>

                {/* Milestone Content Card */}
                <div className="rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-7 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_4px_24px_-10px_rgba(93,214,44,0.12)] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-[#2A2A2A] pb-3">
                    <div className="space-y-1">
                      <span className="font-mono text-xs uppercase tracking-wider text-[#5DD62C] font-semibold">
                        {item.organization}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#F8F8F8]">
                        {item.title}
                      </h3>
                    </div>

                    <span className="font-mono text-xs text-[#9E9E9E] shrink-0">
                      {item.year}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm text-[#9E9E9E] pt-1">
                    {item.description.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="size-1.5 rounded-full bg-[#5DD62C] shrink-0 mt-2 shadow-[0_0_6px_rgba(93,214,44,0.5)]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
