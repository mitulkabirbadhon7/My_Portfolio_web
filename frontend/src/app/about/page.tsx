import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Building2,
  Sparkles,
  ArrowRight,
  User,
  GraduationCap,
  School,
  FileDown,
} from "lucide-react";
import { Experience, Skill, Settings } from "@/types";

export const metadata: Metadata = {
  title: "About & Credentials — Mitul Kabir Badhon",
  description:
    "Engineering background, career milestones, academic credentials, and technical capabilities of Mitul Kabir Badhon.",
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

  const educationData: EducationItem[] = [
    {
      id: "university",
      type: "university",
      institution: settings?.universityName || "Daffodil International University (DIU)",
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

  const sortedExperiences = experiences.slice().sort((a, b) => {
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category?.trim() || "Core Engineering";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(skill);
    return acc;
  }, {});

  const hasSkills = Object.keys(groupedSkills).length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 space-y-20">
      {/* SECTION 1: HERO & BIO */}
      <section aria-label="Professional Bio" className="space-y-8">
        <div className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#5DD62C] shadow-[0_0_8px_rgba(93,214,44,0.6)]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
            Credentials &amp; History
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="md:col-span-7 lg:col-span-8 space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F8F8F8] leading-[1.08]">
              Engineering systems with precision, performance, and durability.
            </h1>

            <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#9E9E9E] font-sans">
              <p>
                I am <span className="font-sans font-bold text-[#F8F8F8]">Mitul Kabir</span>{" "}
                <span className="font-sans font-bold text-[#5DD62C]">Badhon</span>, a Full-Stack Software
                Engineer dedicated to constructing maintainable, resilient, and secure web applications.
                My work emphasizes distributed architectures, production-grade TypeScript backends, and
                tactile, uncluttered user interfaces.
              </p>
              <p>
                With a rigorous foundation spanning server-side runtime performance, relational and
                document database design, and modern client frameworks, I treat code clarity and
                architectural boundaries as primary requirements.
              </p>
            </div>

            {/* Signature picture from backend */}
            {settings?.signatureImage && (
              <div className="pt-2 space-y-1.5">
                <span className="block font-mono text-[11px] uppercase tracking-widest text-[#5DD62C]">
                  Signature &bull; Autograph
                </span>
                <div className="relative h-20 w-60 rounded-xl border border-[#2A2A2A] bg-[#141414] p-2 overflow-hidden shadow-inner group hover:border-[#337418] transition-colors">
                  <Image
                    src={settings.signatureImage}
                    alt="Signature of Mitul Kabir Badhon"
                    fill
                    sizes="240px"
                    className="object-contain p-1 filter brightness-110"
                    priority
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center gap-4">
              <a
                href="/cv"
                download="Mitu_Kabir_Badhon_CV.pdf"
                className="inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-5 py-2.5 text-xs font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_20px_rgba(93,214,44,0.35)]"
              >
                <FileDown className="size-4" />
                <span>Download Official CV (PDF)</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4 self-start rounded-xl border border-[#2A2A2A] bg-[#202020] p-3 shadow-2xl">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-[#0F0F0F]">
              {settings?.aboutProfileImage ? (
                <Image
                  src={settings.aboutProfileImage}
                  alt="Mitul Kabir Badhon"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover object-top filter grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-300"
                  priority
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center p-6 text-center text-[#9E9E9E] bg-gradient-to-b from-[#202020] to-[#0F0F0F]">
                  <div className="flex size-14 items-center justify-center rounded-full bg-[#5DD62C]/10 text-[#5DD62C] mb-3 border border-[#337418]/40">
                    <User className="size-7" />
                  </div>
                  <div>
                    <span className="font-sans font-bold text-lg text-[#F8F8F8]">Mitul Kabir</span>{" "}
                    <span className="font-sans font-bold text-lg text-[#5DD62C]">Badhon</span>
                  </div>
                  <span className="font-mono text-xs text-[#5DD62C] mt-1">Full-Stack Engineer</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TIMELINE & EDUCATION */}
      <section aria-labelledby="timeline-heading" className="space-y-8 border-t border-[#2A2A2A] pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 id="timeline-heading" className="font-serif text-3xl sm:text-4xl font-medium text-[#F8F8F8]">
              Career Timeline &amp; Academic Foundation
            </h2>
          </div>
        </div>

        {/* Work Experiences */}
        {sortedExperiences.length > 0 && (
          <div className="relative pl-6 sm:pl-8 ml-2 sm:ml-4 border-l border-[#2A2A2A] space-y-8 mb-10">
            {sortedExperiences.map((exp) => {
              const isCurrent = exp.current || !exp.endDate;
              const dateRangeText = formatDateRange(exp.startDate, exp.endDate, exp.current);

              return (
                <article
                  key={exp._id}
                  className="relative group rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 transition-all duration-200 hover:border-[#337418]"
                >
                  <span
                    className={`absolute -left-[31px] sm:-left-[39px] top-6 flex size-3.5 items-center justify-center rounded-full border-2 bg-[#0F0F0F] ${
                      isCurrent ? "border-[#5DD62C]" : "border-[#2A2A2A]"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isCurrent ? "bg-[#5DD62C] animate-ping" : "bg-[#9E9E9E]"
                      }`}
                    />
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#2A2A2A] pb-3">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-[#F8F8F8]">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#9E9E9E] mt-0.5">
                        <Building2 className="size-3.5 text-[#5DD62C]" />
                        <span className="font-medium text-[#F8F8F8]">{exp.company}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs text-[#9E9E9E]">
                      <Calendar className="size-3.5" />
                      <span>{dateRangeText}</span>
                      {isCurrent && (
                        <span className="rounded-full bg-[#5DD62C]/10 border border-[#337418]/60 px-2 py-0.5 text-[10px] font-semibold text-[#5DD62C]">
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  {Array.isArray(exp.description) && exp.description.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-[#9E9E9E]">
                      {exp.description.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#5DD62C] shadow-[0_0_6px_rgba(93,214,44,0.5)]" />
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

        {/* Structured Vertical Education Cards */}
        <div className="space-y-4">
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
                className="group rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-7 transition-all duration-200 hover:border-[#337418] flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="rounded-full bg-[#0F0F0F] border border-[#2A2A2A] px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-[#5DD62C]">
                      {edu.type}
                    </span>
                    {edu.period && (
                      <span className="text-xs font-mono text-[#9E9E9E] flex items-center gap-1">
                        <Calendar className="size-3 text-[#5DD62C]" />
                        {edu.period}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#F8F8F8]">
                    {edu.institution}
                  </h3>
                  <p className="text-sm text-[#9E9E9E]">{edu.degree}</p>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-2.5 py-1 text-xs font-mono text-[#F8F8F8]">
                    <span className="text-[#9E9E9E]">Result:</span>
                    <span className="font-semibold text-[#5DD62C]">{edu.result}</span>
                  </div>
                </div>

                <div className="relative w-full sm:w-44 h-28 shrink-0 overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0F0F0F]">
                  {eduImage ? (
                    <Image
                      src={eduImage}
                      alt={edu.institution}
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center p-3 text-center text-[#9E9E9E] bg-[#181818]">
                      <Icon className="size-7 text-[#5DD62C] mb-1" />
                      <span className="text-[10px] font-mono text-[#9E9E9E] uppercase">
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

      {/* SECTION 3: SKILLS MATRIX */}
      <section aria-labelledby="skills-matrix-heading" className="space-y-6 border-t border-[#2A2A2A] pt-16">
        <div className="space-y-1">
          <h2 id="skills-matrix-heading" className="font-serif text-3xl sm:text-4xl font-medium text-[#F8F8F8]">
            Categorized Technical Competencies
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
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F8F8]">
                    {category}
                  </h3>
                  <span className="text-xs font-mono text-[#9E9E9E]">
                    {items.length} {items.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((skill) => {
                    const prof = typeof skill.proficiency === "number" ? skill.proficiency : 0;
                    return (
                      <div key={skill._id} className="space-y-1">
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
                            className="h-full rounded-full bg-[#5DD62C] shadow-[0_0_6px_rgba(93,214,44,0.5)] transition-all duration-500"
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

      {/* SECTION 4: INVITATION CTA */}
      <section className="rounded-2xl border border-[#2A2A2A] bg-[#202020] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5DD62C]">
            <Sparkles className="size-3.5" />
            <span>Open to Dialogue</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#F8F8F8]">
            Looking for a dedicated software engineer?
          </h2>
          <p className="text-sm text-[#9E9E9E] max-w-lg">
            Whether for a full-time engineering role, consulting, or technical advisory, let&apos;s discuss your goals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-5 py-2.5 text-xs font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_20px_rgba(93,214,44,0.35)]"
          >
            <span>Get in Touch</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-5 py-2.5 text-xs font-medium text-[#F8F8F8] transition-colors hover:border-[#5DD62C] hover:text-[#5DD62C]"
          >
            <span>Explore Projects</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
