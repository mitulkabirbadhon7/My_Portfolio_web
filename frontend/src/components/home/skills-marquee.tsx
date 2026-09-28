"use client";

import React from "react";
import { Skill } from "@/types";

interface SkillsMarqueeProps {
  skills?: Skill[];
}

const DEFAULT_ROW_1 = [
  "TypeScript",
  "Next.js 16",
  "React",
  "Node.js",
  "Express.js",
  "PostgreSQL",
  "MongoDB",
  "REST APIs",
  "Python",
  "Database Modeling",
];

const DEFAULT_ROW_2 = [
  "System Architecture",
  "Tailwind CSS",
  "Docker",
  "Redis",
  "Zod Validation",
  "Git & GitHub",
  "Linux CLI",
  "WebSockets",
  "Performance Tuning",
  "Clean Code",
];

export function SkillsMarquee({ skills = [] }: SkillsMarqueeProps) {
  // If dynamic skills exist from backend, merge or prioritize them
  const dynamicNames = skills.map((s) => s.name);
  const allSkills = dynamicNames.length > 0 ? dynamicNames : [...DEFAULT_ROW_1, ...DEFAULT_ROW_2];

  // Duplicate arrays to achieve infinite seamless loop
  const duplicatedSkills = [...allSkills, ...allSkills, ...allSkills];

  return (
    <section
      aria-label="Skills & Technologies Marquee"
      className="border-t border-[#2A2A2A] py-16 sm:py-24 w-full max-w-full overflow-hidden"
    >
      <div className="space-y-8 w-full max-w-full overflow-hidden">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
            Technical Capabilities
          </span>
          <span className="h-px w-12 bg-[#2A2A2A]" />
        </div>

        {/* Single Line Marquee Container */}
        <div className="marquee-container pt-2 w-full max-w-full overflow-hidden">
          <div className="w-full max-w-full overflow-hidden">
            <div className="marquee-track-left gap-3.5 py-1">
              {duplicatedSkills.map((skill, index) => (
                <div
                  key={`skill-${index}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-[#2A2A2A] bg-[#202020] px-5 py-2 text-xs sm:text-sm font-medium text-[#F8F8F8] transition-colors duration-200 hover:border-[#5DD62C] hover:text-[#5DD62C] select-none cursor-default shrink-0"
                >
                  <span className="size-1.5 rounded-full bg-[#5DD62C]/60 group-hover:bg-[#5DD62C] shadow-[0_0_6px_rgba(93,214,44,0.5)] transition-colors" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
