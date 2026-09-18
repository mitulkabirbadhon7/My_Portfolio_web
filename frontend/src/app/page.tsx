import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  FolderKanban,
  Send,
  Code2,
  User,
  ArrowUpRight,
} from "lucide-react";
import { Project, Skill, Settings } from "@/types";
import { LaunchChatButton } from "@/components/chat/launch-chat-button";
import { ProjectShowcaseCard } from "@/components/home/project-showcase-card";

// Helper to fetch Server Component initial public data
async function getHomeData(): Promise<{
  projects: Project[];
  skills: Skill[];
  settings: Settings | null;
}> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  let projects: Project[] = [];
  let skills: Skill[] = [];
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

  return { projects, skills, settings };
}

export default async function HomePage() {
  const { projects, settings } = await getHomeData();

  const totalProjectsCount = projects.length;

  // Compute worldwide clients count (from distinct project clients or admin settings)
  const distinctClientsCount = new Set(
    projects.map((p) => p.client?.trim()).filter(Boolean)
  ).size;
  const clientsWorldwide =
    settings?.clientsWorldwide ||
    (distinctClientsCount > 0 ? `+${distinctClientsCount}` : "+12");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 space-y-6">
      {/* Bento Grid Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* =========================================================================
            BENTO ITEM 1: HERO / INTRO / PROFILE CARD / CTAs (md:col-span-8)
            ========================================================================= */}
        <section
          aria-label="Developer Introduction"
          className="md:col-span-8 flex flex-col justify-between space-y-4 sm:space-y-6"
        >
          {/* Main Hero Card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 flex flex-col justify-between transition-all hover:border-[#337418]/80 group">
            {/* Subtle Ambient Radial Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-[#5DD62C]/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-60" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-6">
              {/* Profile Card (Left Side of Hero) */}
              <div className="w-full sm:w-64 shrink-0 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4 flex flex-col items-center justify-between text-center space-y-3">
                <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg border border-[#337418]/60 bg-[#181818] shadow-inner">
                  {settings?.homeProfileImage ? (
                    <Image
                      src={settings.homeProfileImage}
                      alt="Mitul Kabir Badhon"
                      fill
                      sizes="(max-width: 640px) 240px, 256px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center p-4 text-center text-[#9E9E9E]">
                      <div className="flex size-14 items-center justify-center rounded-full bg-[#337418]/20 border border-[#337418]/40 text-[#5DD62C] mb-2">
                        <User className="size-7" />
                      </div>
                      <span className="font-mono text-xs text-[#F8F8F8]">Mitul Kabir Badhon</span>
                    </div>
                  )}
                </div>

                {/* Key Titles alongside Profile Picture */}
                <div className="w-full space-y-1 pt-1 border-t border-[#2A2A2A]/80">
                  <div className="text-xs font-bold text-[#F8F8F8] tracking-tight">
                    Problem Solver
                  </div>
                  <div className="text-[11px] font-mono text-[#5DD62C]">
                    Backend Engineer
                  </div>
                  <div className="text-[11px] font-medium text-[#9E9E9E]">
                    Software Engineer
                  </div>
                </div>
              </div>

              {/* Text & CTAs (Right Side of Hero Card) */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#337418]/60 bg-[#0F0F0F]/80 px-3 py-1 text-xs font-mono text-[#5DD62C]">
                    <span className="size-2 rounded-full bg-[#5DD62C] animate-pulse" />
                    <span>Full-Stack Software Engineer</span>
                  </div>

                  {/* Single Accessible h1 */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F8F8F8]">
                    Mitul Kabir Badhon
                  </h1>

                  <p className="text-base sm:text-lg leading-relaxed text-[#9E9E9E]">
                    Engineering reliable web applications, distributed backend services, and interactive user
                    interfaces with high-performance architectures, clean TypeScript code, and dark minimalist aesthetics.
                  </p>
                </div>

                {/* CTAs: Explore Projects / Work With Me / Ask AI */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#2A2A2A]/80">
                  {/* CTA 1: Explore Projects */}
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-5 py-2.5 text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:bg-[#5DD62C]/90 hover:shadow-[0_0_20px_rgba(93,214,44,0.35)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
                  >
                    <FolderKanban className="size-4" />
                    <span>Explore Projects</span>
                  </Link>

                  {/* CTA 2: Work With Me */}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-5 py-2.5 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#5DD62C]/60 hover:text-[#5DD62C] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
                  >
                    <Send className="size-4" />
                    <span>Work With Me</span>
                  </Link>

                  {/* CTA 3: Ask AI */}
                  <LaunchChatButton
                    className="inline-flex items-center gap-2 rounded-lg border border-[#337418]/80 bg-[#202020] px-4 py-2.5 text-sm font-medium text-[#5DD62C] transition-all hover:bg-[#5DD62C]/10 hover:border-[#5DD62C] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] cursor-pointer"
                  >
                    <Sparkles className="size-4" />
                    <span>Ask AI</span>
                  </LaunchChatButton>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Ticker Banner */}
          <div className="relative overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] py-3 text-xs font-mono text-[#9E9E9E]">
            <div className="animate-ticker flex items-center gap-6 whitespace-nowrap">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className="flex items-center gap-6">
                  <span className="text-[#F8F8F8] font-semibold">Problem Solver</span>
                  <span className="size-1.5 rounded-full bg-[#5DD62C]" />
                  <span className="text-[#F8F8F8] font-semibold">Backend Engineer</span>
                  <span className="size-1.5 rounded-full bg-[#5DD62C]" />
                  <span className="text-[#F8F8F8] font-semibold">Software Engineer</span>
                  <span className="size-1.5 rounded-full bg-[#5DD62C]" />
                  <span className="text-[#5DD62C] font-semibold">+{totalProjectsCount} Total Projects</span>
                  <span className="size-1.5 rounded-full bg-[#5DD62C]" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            BENTO ITEM 2: RIGHT COLUMN (ASK ABOUT ME / AI CHAT & SIGNATURE CARD) (md:col-span-4)
            ========================================================================= */}
        <section
          aria-label="AI Assistant and Credentials"
          className="md:col-span-4 flex flex-col justify-between gap-4 sm:gap-6"
        >
          {/* Ask About Me / Launch AI Chat Box (Replaced Core Philosophy) */}
          <div className="relative overflow-hidden rounded-2xl border border-[#337418]/60 bg-gradient-to-b from-[#202020] to-[#0F0F0F] p-6 sm:p-7 flex flex-col justify-between transition-all hover:border-[#5DD62C]/80">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#337418] bg-[#5DD62C]/10 px-2.5 py-1 text-xs font-mono text-[#5DD62C]">
                <Sparkles className="size-3.5" />
                <span>Interactive AI</span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-[#F8F8F8]">
                Ask About Me
              </h2>

              <p className="text-sm leading-relaxed text-[#9E9E9E]">
                Have questions about my technical background, backend architectures, or problem-solving approaches?
                Chat directly with my interactive AI assistant.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
              <LaunchChatButton
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-4 py-2.5 text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_16px_rgba(93,214,44,0.3)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] cursor-pointer"
              >
                <Sparkles className="size-4" />
                <span>Launch AI Chat</span>
              </LaunchChatButton>
            </div>
          </div>

          {/* Signature Card Box (with uploaded signatureImage support) */}
          <Link
            href="/about"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-7 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_24px_rgba(93,214,44,0.15)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            {/* Ambient Radial Glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-[#5DD62C]/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />

            {/* Signature Graphic / Picture */}
            <div className="relative z-10 flex items-center justify-center py-4 min-h-[70px]">
              {settings?.signatureImage ? (
                <div className="relative h-16 w-52 sm:h-20 sm:w-60 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={settings.signatureImage}
                    alt="Mitul Kabir Badhon Signature"
                    fill
                    sizes="240px"
                    className="object-contain filter drop-shadow-[0_0_10px_rgba(93,214,44,0.3)]"
                  />
                </div>
              ) : (
                <svg
                  viewBox="0 0 240 70"
                  className="h-14 sm:h-16 w-auto text-[#5DD62C] transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(93,214,44,0.3)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 50 C 40 10, 50 15, 65 40 C 75 10, 85 45, 95 30 C 110 15, 125 55, 140 25 C 150 40, 165 20, 180 35 C 195 20, 210 40, 225 30" />
                  <path d="M50 42 C 90 42, 170 38, 220 38" />
                </svg>
              )}
            </div>

            {/* Card Footer Labels */}
            <div className="relative z-10 border-t border-[#2A2A2A] pt-4 flex items-end justify-between">
              <div className="space-y-0.5">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#9E9E9E] group-hover:text-[#5DD62C] transition-colors">
                  MORE ABOUT ME
                </span>
                <h3 className="text-xl font-bold text-[#F8F8F8]">
                  Credentials
                </h3>
              </div>

              <span className="flex size-9 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#0F0F0F] text-[#9E9E9E] group-hover:border-[#5DD62C] group-hover:text-[#5DD62C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        </section>

        {/* =========================================================================
            BENTO ITEM 3: STATS & PROJECTS SHOWCASE SECTION (md:col-span-12)
            ========================================================================= */}
        <section
          aria-labelledby="stats-showcase-heading"
          className="md:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 pt-2"
        >
          {/* Left Column: Stats & CTA (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#5DD62C]">
                Track Record &amp; Metrics
              </span>
              <h2 id="stats-showcase-heading" className="text-xl sm:text-2xl font-bold text-[#F8F8F8]">
                Clients &amp; Projects
              </h2>
            </div>

            {/* 2 Horizontal Stats (Experience removed; Worldwide Clients updatable) */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4 text-center">
              <div className="space-y-1 border-r border-[#2A2A2A] pr-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#5DD62C]">
                  {clientsWorldwide}
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#9E9E9E] leading-tight">
                  CLIENTS WORLDWIDE
                </div>
              </div>

              <div className="space-y-1 pl-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#F8F8F8]">
                  +{totalProjectsCount}
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#9E9E9E] leading-tight">
                  TOTAL PROJECTS
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-5 py-3 text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:bg-[#5DD62C]/90 hover:shadow-[0_0_20px_rgba(93,214,44,0.35)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            >
              <Send className="size-4" />
              <span>Let&apos;s Work Together</span>
            </Link>
          </div>

          {/* Right Column: Projects Showcase Card with dynamic project pictures on hover / auto-cycle (lg:col-span-7) */}
          <ProjectShowcaseCard projects={projects} />
        </section>
      </div>
    </div>
  );
}
