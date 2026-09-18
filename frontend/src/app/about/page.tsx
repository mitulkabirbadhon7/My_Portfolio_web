import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Calendar,
  Building2,
  Code2,
  Sparkles,
  ArrowRight,
  User,
  GraduationCap,
  School,
} from "lucide-react";
import { Experience, Skill, Settings } from "@/types";

export const metadata: Metadata = {
  title: "About & Career Timeline | Mitul Kabir Badhon",
  description:
    "Engineering background, career milestones, and technical capabilities of Mitul Kabir Badhon.",
};

interface EducationItem {
  id: string;
  type: "university" | "college" | "school";
  institution: string;
  degree: string;
  result: string;
  period?: string;
  image?: string;
}

// Helper to fetch Server Component initial public data
async function getAboutData(): Promise<{
  experiences: Experience[];
  skills: Skill[];
  settings: Settings | null;
}> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  let experiences: Experience[] = [];
  let skills: Skill[] = [];
  let settings: Settings | null = null;

  try {
    const resExp = await fetch(`${baseUrl}/experiences`, {
      next: { revalidate: 60 },
    });
    if (resExp.ok) {
      const json = await resExp.json();
      experiences = Array.isArray(json?.data) ? json.data : [];
    }
  } catch (err) {
    console.warn("About page fetch failed for /experiences:", err);
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
    console.warn("About page fetch failed for /skills:", err);
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
    console.warn("About page fetch failed for /settings:", err);
  }

  return { experiences, skills, settings };
}

function formatDateRange(startDate?: string, endDate?: string | null, current?: boolean): string {
  if (!startDate) return "Dates Unspecified";

  const formatMonthYear = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const startFormatted = formatMonthYear(startDate);

  if (current || !endDate) {
    return `${startFormatted} – Present`;
  }

  return `${startFormatted} – ${formatMonthYear(endDate)}`;
}

export default async function AboutPage() {
  const { experiences, skills, settings } = await getAboutData();

  // Educational milestones: University, College, School (Dynamic from Settings / Admin Panel)
  const educationData: EducationItem[] = [
    {
      id: "university",
      type: "university",
      institution: settings?.universityName || "American International University-Bangladesh (AIUB)",
      degree: settings?.universityDegree || "B.Sc. in Computer Science & Engineering",
      result: settings?.universityResult || "CGPA 3.85 / 4.00",
      period: settings?.universityYear || "2020 – 2024",
      image: settings?.universityImage,
    },
    {
      id: "college",
      type: "college",
      institution: settings?.collegeName || "Higher Secondary College",
      degree: settings?.collegeDegree || "Higher Secondary Certificate (HSC) • Science",
      result: settings?.collegeResult || "GPA 5.00 / 5.00",
      period: settings?.collegeYear || "2017 – 2019",
      image: settings?.collegeImage,
    },
    {
      id: "school",
      type: "school",
      institution: settings?.schoolName || "Secondary High School",
      degree: settings?.schoolDegree || "Secondary School Certificate (SSC) • Science",
      result: settings?.schoolResult || "GPA 5.00 / 5.00",
      period: settings?.schoolYear || "2015 – 2017",
      image: settings?.schoolImage,
    },
  ];

  // Sort experiences chronologically: current positions first, then by startDate descending
  const sortedExperiences = experiences.slice().sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category?.trim() || "General Engineering";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(skill);
    return acc;
  }, {});

  const hasSkills = Object.keys(groupedSkills).length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 space-y-16">
      {/* =========================================================================
          SECTION 1: HERO & PROFESSIONAL BIO
          ========================================================================= */}
      <section aria-label="Professional Bio" className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#337418]/60 bg-[#202020] px-3 py-1 text-xs font-mono text-[#5DD62C]">
          <span className="size-2 rounded-full bg-[#5DD62C] animate-pulse" />
          <span>About &amp; Background</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Headline and Detailed Engineering Bio */}
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8F8F8] leading-[1.15]">
              Engineering systems with precision, performance, and durability.
            </h1>

            <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#9E9E9E]">
              <p>
                I am <strong className="text-[#F8F8F8]">Mitul Kabir Badhon</strong>, a Full-Stack Software
                Engineer dedicated to constructing maintainable, resilient, and secure web applications.
                My work emphasizes distributed architectures, production-grade TypeScript backends, and
                high-contrast dark user interfaces.
              </p>
              <p>
                With a foundation spanning server-side runtime performance, relational and document database
                design, and modern client frameworks, I treat code clarity and architectural boundaries as
                first-order design requirements.
              </p>
            </div>
          </div>

          {/* Right Column: About Profile Image Box (Aligned with text block, elevated from lower position) */}
          <div className="md:col-span-5 lg:col-span-4 self-start rounded-2xl border border-[#2A2A2A] bg-[#202020] p-3 sm:p-4 shadow-lg transition-colors hover:border-[#337418]/80">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-[#337418]/60 bg-[#0F0F0F] shadow-[0_0_20px_rgba(93,214,44,0.12)]">
              {settings?.aboutProfileImage ? (
                <Image
                  src={settings.aboutProfileImage}
                  alt="Mitul Kabir Badhon"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center bg-gradient-to-b from-[#202020] to-[#0F0F0F] p-6 text-center text-[#9E9E9E]">
                  <div className="flex size-16 items-center justify-center rounded-full bg-[#337418]/20 border border-[#337418]/40 text-[#5DD62C] mb-3">
                    <User className="size-8" />
                  </div>
                  <span className="text-sm font-semibold text-[#F8F8F8]">Mitul Kabir Badhon</span>
                  <span className="text-xs font-mono text-[#5DD62C] mt-1">Software Engineer</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CAREER TIMELINE & EDUCATION
          ========================================================================= */}
      <section aria-labelledby="timeline-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-[#5DD62C]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#5DD62C]">
                Experience
              </span>
            </div>
            <h2 id="timeline-heading" className="text-2xl sm:text-3xl font-bold text-[#F8F8F8]">
              Career Timeline
            </h2>
          </div>

          <Link
            href="/cv"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#9E9E9E] hover:text-[#5DD62C] transition-colors"
          >
            <span>View CV Document</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Work Experiences (if present in database) */}
        {sortedExperiences.length > 0 && (
          <div className="relative pl-6 sm:pl-8 ml-2 sm:ml-4 border-l-2 border-[#2A2A2A] space-y-8 mb-8">
            {sortedExperiences.map((exp) => {
              const isCurrent = exp.current || !exp.endDate;
              const dateRangeText = formatDateRange(exp.startDate, exp.endDate, exp.current);

              return (
                <article
                  key={exp._id}
                  className="relative group rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_20px_rgba(93,214,44,0.1)]"
                >
                  <span
                    className={`absolute -left-[31px] sm:-left-[39px] top-6 flex size-4 items-center justify-center rounded-full border-2 bg-[#0F0F0F] transition-colors ${
                      isCurrent
                        ? "border-[#5DD62C] shadow-[0_0_8px_rgba(93,214,44,0.6)]"
                        : "border-[#9E9E9E]/60 group-hover:border-[#5DD62C]"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isCurrent ? "bg-[#5DD62C] animate-pulse" : "bg-[#9E9E9E]/80"
                      }`}
                    />
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2A2A] pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#F8F8F8] transition-colors group-hover:text-[#5DD62C]">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-[#9E9E9E] mt-0.5">
                        <Building2 className="size-3.5 text-[#5DD62C]" />
                        <span className="font-medium text-[#F8F8F8]">{exp.company}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs text-[#9E9E9E]">
                      <Calendar className="size-3.5" />
                      <span>{dateRangeText}</span>
                      {isCurrent && (
                        <span className="rounded-full bg-[#5DD62C]/15 px-2 py-0.5 text-[10px] font-semibold text-[#5DD62C] border border-[#5DD62C]/30">
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  {Array.isArray(exp.description) && exp.description.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-[#9E9E9E]">
                      {exp.description.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#5DD62C]" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Structured Vertical Education Cards Mapping over educationData */}
        <div className="space-y-6">
          {educationData.map((edu, index) => {
            const eduImage =
              edu.image ||
              (edu.type === "university"
                ? settings?.universityImage
                : edu.type === "college"
                ? settings?.collegeImage
                : settings?.schoolImage);

            const Icon =
              edu.type === "university"
                ? GraduationCap
                : edu.type === "college"
                ? Building2
                : School;

            return (
              <article
                key={edu.id || index}
                className="group rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-7 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_20px_rgba(93,214,44,0.1)] flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                {/* Left Side: Institution Name, Degree/Details, and Result */}
                <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-block rounded-full bg-[#5DD62C]/10 border border-[#5DD62C]/30 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-[#5DD62C]">
                      {edu.type}
                    </span>
                    {edu.period && (
                      <span className="text-xs font-mono text-[#9E9E9E] flex items-center gap-1">
                        <Calendar className="size-3 text-[#5DD62C]" />
                        {edu.period}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#F8F8F8] transition-colors group-hover:text-[#5DD62C]">
                    {edu.institution}
                  </h3>
                  <p className="text-sm font-medium text-[#9E9E9E]">
                    {edu.degree}
                  </p>
                  <div className="inline-flex items-center gap-1.5 rounded-md border border-[#2A2A2A] bg-[#0F0F0F] px-3 py-1 text-xs font-mono text-[#F8F8F8]">
                    <span className="text-[#9E9E9E]">Result:</span>
                    <span className="font-semibold text-[#5DD62C]">{edu.result}</span>
                  </div>
                </div>

                {/* Right Side: Square or Rectangular Image Component */}
                <div className="relative w-full sm:w-48 h-32 shrink-0 overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] transition-colors group-hover:border-[#337418]">
                  {eduImage ? (
                    <Image
                      src={eduImage}
                      alt={edu.institution}
                      fill
                      sizes="(max-width: 640px) 100vw, 192px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center p-3 text-center text-[#9E9E9E] bg-gradient-to-b from-[#202020]/50 to-[#0F0F0F]">
                      <Icon className="size-8 text-[#5DD62C]/70 mb-1.5" />
                      <span className="text-[11px] font-mono text-[#9E9E9E] uppercase">
                        {edu.type}
                      </span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SKILLS GROUPED BY CATEGORY WITH PROFICIENCY INDICATORS
          ========================================================================= */}
      <section aria-labelledby="skills-heading" className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Code2 className="size-4 text-[#5DD62C]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#5DD62C]">
              Capabilities
            </span>
          </div>
          <h2 id="skills-heading" className="text-2xl sm:text-3xl font-bold text-[#F8F8F8]">
            Categorized Skill Matrix
          </h2>
        </div>

        {hasSkills ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groupedSkills).map(([category, items]) => (
              <div
                key={category}
                className="rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#F8F8F8]">
                    {category}
                  </h3>
                  <span className="text-xs font-mono text-[#9E9E9E]">
                    {items.length} {items.length === 1 ? "Skill" : "Skills"}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {items.map((skill) => {
                    const prof = typeof skill.proficiency === "number" ? skill.proficiency : 0;
                    return (
                      <div key={skill._id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-[#F8F8F8]">{skill.name}</span>
                          <span className="font-mono text-[#5DD62C]">{prof}%</span>
                        </div>
                        <div
                          role="progressbar"
                          aria-valuenow={prof}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${skill.name} proficiency`}
                          className="h-1.5 w-full rounded-full bg-[#0F0F0F] overflow-hidden border border-[#2A2A2A]"
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#337418] to-[#5DD62C] transition-all duration-500"
                            style={{ width: `${Math.min(Math.max(prof, 0), 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#2A2A2A] bg-[#202020]/40 p-8 text-center">
            <p className="text-sm text-[#9E9E9E]">
              Skills registered in the admin dashboard will populate here grouped by engineering category.
            </p>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 4: NEXT STEPS / CTA
          ========================================================================= */}
      <section className="rounded-2xl border border-[#337418]/60 bg-gradient-to-r from-[#202020] via-[#202020] to-[#0F0F0F] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5DD62C]">
            <Sparkles className="size-3.5" />
            <span>Let&apos;s Build Together</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8F8F8]">
            Looking for a dedicated software engineer?
          </h2>
          <p className="text-sm text-[#9E9E9E] max-w-lg">
            Whether for a full-time engineering role, consulting, or technical advisory, feel free to reach out.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-5 py-2.5 text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_18px_rgba(93,214,44,0.35)]"
          >
            <span>Get in Touch</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-5 py-2.5 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#5DD62C]"
          >
            <span>Explore Projects</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
