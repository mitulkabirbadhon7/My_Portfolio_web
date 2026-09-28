"use client";

import React, { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "01", name: "Overview" },
  { id: "about", label: "02", name: "About" },
  { id: "skills", label: "03", name: "Skills" },
  { id: "projects", label: "04", name: "Projects" },
  { id: "experience", label: "05", name: "Timeline" },
  { id: "contact", label: "06", name: "Contact" },
];

export function StickySectionIndex() {
  const [activeSection, setActiveSection] = useState("01");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      const aboutEl = document.getElementById("about");
      const skillsEl = document.getElementById("skills");
      const projectsEl = document.getElementById("projects");
      const experienceEl = document.getElementById("experience");
      const contactEl = document.getElementById("contact");

      if (contactEl && scrollPosition >= contactEl.offsetTop) {
        setActiveSection("06");
      } else if (experienceEl && scrollPosition >= experienceEl.offsetTop) {
        setActiveSection("05");
      } else if (projectsEl && scrollPosition >= projectsEl.offsetTop) {
        setActiveSection("04");
      } else if (skillsEl && scrollPosition >= skillsEl.offsetTop) {
        setActiveSection("03");
      } else if (aboutEl && scrollPosition >= aboutEl.offsetTop) {
        setActiveSection("02");
      } else {
        setActiveSection("01");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      aria-label="Section Indicator"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 pointer-events-none select-none"
    >
      <div className="font-mono text-xs text-[#F8F8F8] font-semibold flex items-center gap-1">
        <span className="text-[#5DD62C]">{activeSection}</span>
        <span className="text-[#2A2A2A]">/</span>
        <span className="text-[#9E9E9E]">06</span>
      </div>

      <div className="h-16 w-px bg-[#2A2A2A] relative">
        <div
          className="w-px bg-[#5DD62C] shadow-[0_0_8px_rgba(93,214,44,0.6)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            height: "25%",
            transform: `translateY(${
              (parseInt(activeSection, 10) - 1) * 12
            }px)`,
          }}
        />
      </div>
    </aside>
  );
}
