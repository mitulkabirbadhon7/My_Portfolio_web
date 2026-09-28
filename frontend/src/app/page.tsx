import React from "react";
import type { Metadata } from "next";
import { Project, Skill, Experience, Settings } from "@/types";
import { HeroEditorial } from "@/components/home/hero-editorial";
import { AboutBrief } from "@/components/home/about-brief";
import { SkillsMarquee } from "@/components/home/skills-marquee";
import { BentoProjects } from "@/components/home/bento-projects";
import { ExperienceTimeline } from "@/components/home/experience-timeline";
import { ContactEditorial } from "@/components/home/contact-editorial";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export const metadata: Metadata = {
  title: "Mitul Kabir Badhon — Software Engineer & Systems Architect",
  description:
    "Personal portfolio and engineering log of Mitul Kabir Badhon. High-performance backends, clean TypeScript architecture, and deliberate digital craftsmanship.",
};

// Helper to fetch Server Component initial public data
async function getHomeData(): Promise<{
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  settings: Settings | null;
}> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  let projects: Project[] = [];
  let skills: Skill[] = [];
  let experiences: Experience[] = [];
  let settings: Settings | null = null;

  try {
    const resProjects = await fetch(`${baseUrl}/projects`, {
      next: { revalidate: 60 },
    });
    if (resProjects.ok) {
      const json = await resProjects.json();
      projects = Array.isArray(json?.data) ? json.data : [];
    }
  } catch (err) {
    console.warn("Home server fetch failed for /projects:", err);
  }

  try {
    const resSkills = await fetch(`${baseUrl}/skills`, {
      next: { revalidate: 60 },
    });
    if (resSkills.ok) {
      const json = await resSkills.json();
      skills = Array.isArray(json?.data) ? json.data : [];
    }
  } catch (err) {
    console.warn("Home server fetch failed for /skills:", err);
  }

  try {
    const resExp = await fetch(`${baseUrl}/experiences`, {
      next: { revalidate: 60 },
    });
    if (resExp.ok) {
      const json = await resExp.json();
      experiences = Array.isArray(json?.data) ? json.data : [];
    }
  } catch (err) {
    console.warn("Home server fetch failed for /experiences:", err);
  }

  try {
    const resSettings = await fetch(`${baseUrl}/settings`, {
      next: { revalidate: 60 },
    });
    if (resSettings.ok) {
      const json = await resSettings.json();
      settings = json?.data || null;
    }
  } catch (err) {
    console.warn("Home server fetch failed for /settings:", err);
  }

  return { projects, skills, experiences, settings };
}

export default async function HomePage() {
  const { projects, skills, experiences, settings } = await getHomeData();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 overflow-x-clip">
      {/* 01: Hero Section with Asymmetrical Typography & Parallax Portrait */}
      <HeroEditorial settings={settings} />

      {/* 02: About Statement + Currently Human Touch */}
      <ScrollReveal>
        <AboutBrief settings={settings} />
      </ScrollReveal>

      {/* 03: Skills & Tools Dual-Row Counter Marquee */}
      <ScrollReveal>
        <SkillsMarquee skills={skills} />
      </ScrollReveal>

      {/* 04: Bento Grid of Projects with 3D Tilt & Green Glow */}
      <ScrollReveal>
        <BentoProjects projects={projects} />
      </ScrollReveal>

      {/* 05: Experience & Academic Progression Timeline */}
      <ScrollReveal>
        <ExperienceTimeline experiences={experiences} settings={settings} />
      </ScrollReveal>

      {/* 06: Dark Contact Section with Mouse Cursor Spotlight */}
      <ScrollReveal>
        <ContactEditorial settings={settings} />
      </ScrollReveal>
    </div>
  );
}
