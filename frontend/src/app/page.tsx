import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  FolderKanban,
  Send,
  ExternalLink,
  Code2,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import { Project, Skill } from "@/types";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// Requirement 4: Mandatory UI constant limit for home page featured projects
const HOME_PROJECT_LIMIT = 3;

// Helper to fetch Server Component initial public data
async function getHomeData(): Promise<{ projects: Project[]; skills: Skill[] }> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  let projects: Project[] = [];
  let skills: Skill[] = [];

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

  return { projects, skills };
}

export default async function HomePage() {
  const { projects, skills } = await getHomeData();

  // Requirement 4: Display the 3 most recent published projects
  const featuredProjects = projects
    .filter((p) => p.isPublished !== false)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, HOME_PROJECT_LIMIT);

  // Requirement 5: Group actual skills from API by category
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      {/* Bento Grid Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {/* =========================================================================
            BENTO ITEM 1: HERO / INTRO / CTAs (md:col-span-8)
            ========================================================================= */}
        <section
          aria-label="Developer Introduction"
          className="relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 md:col-span-8 flex flex-col justify-between transition-all hover:border-[#337418]/80 group"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-[#5DD62C]/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-60" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#337418]/60 bg-[#0F0F0F]/80 px-3 py-1 text-xs font-mono text-[#5DD62C]">
              <span className="size-2 rounded-full bg-[#5DD62C] animate-pulse" />
              <span>Full-Stack Software Engineer</span>
            </div>

            {/* Single Accessible h1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F8F8F8]">
              Mitul Kabir Badhon
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#9E9E9E]">
              Engineering reliable web applications, distributed backend services, and interactive user
              interfaces with high-performance architectures, clean TypeScript code, and dark minimalist aesthetics.
            </p>
          </div>

          {/* CTAs: Explore Projects / Work With Me / Ask AI */}
          <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3 sm:gap-4 pt-4 border-t border-[#2A2A2A]/80">
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
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-lg border border-[#337418]/80 bg-[#202020] px-4 py-2.5 text-sm font-medium text-[#5DD62C] transition-all hover:bg-[#5DD62C]/10 hover:border-[#5DD62C] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            >
              <Sparkles className="size-4" />
              <span>Ask AI</span>
            </Link>
          </div>
        </section>

        {/* =========================================================================
            BENTO ITEM 2: CORE ARCHITECTURE PILLARS (md:col-span-4)
            ========================================================================= */}
        <section
          aria-label="Engineering Focus"
          className="relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 md:col-span-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#5DD62C]">
                Core Philosophy
              </span>
              <Terminal className="size-4 text-[#9E9E9E]" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-[#F8F8F8]">
              Precision & Scalability
            </h2>

            <p className="text-sm leading-relaxed text-[#9E9E9E]">
              Architected from first principles with end-to-end type safety, microsecond responsiveness,
              and strict separation of concerns.
            </p>
          </div>

          <div className="mt-6 space-y-2.5 border-t border-[#2A2A2A] pt-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#F8F8F8]">
              <CheckCircle2 className="size-3.5 text-[#5DD62C]" />
              <span>Next.js App Router &amp; React 19</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#F8F8F8]">
              <CheckCircle2 className="size-3.5 text-[#5DD62C]" />
              <span>Node.js, Express &amp; MongoDB</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#F8F8F8]">
              <CheckCircle2 className="size-3.5 text-[#5DD62C]" />
              <span>Cloudinary &amp; AI LLM Integration</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BENTO ITEM 3: FEATURED PROJECTS SECTION (md:col-span-12)
            ========================================================================= */}
        <section
          aria-labelledby="featured-projects-heading"
          className="md:col-span-12 space-y-6 pt-4"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#5DD62C]" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#5DD62C]">
                  Portfolio Highlights
                </span>
              </div>
              <h2
                id="featured-projects-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8]"
              >
                Featured Projects
              </h2>
            </div>

            <Link
              href="/projects"
              className="group inline-flex items-center gap-1 text-sm font-medium text-[#9E9E9E] transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
            >
              <span>View all projects</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Featured Projects Grid: Max 3 per HOME_PROJECT_LIMIT */}
          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <article
                  key={project._id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_24px_rgba(93,214,44,0.12)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#9E9E9E]">
                        {new Date(project.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Source code for ${project.title}`}
                            className="text-[#9E9E9E] transition-colors hover:text-[#5DD62C]"
                          >
                            <GithubIcon className="size-4" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Live demo for ${project.title}`}
                            className="text-[#9E9E9E] transition-colors hover:text-[#5DD62C]"
                          >
                            <ExternalLink className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#F8F8F8] transition-colors group-hover:text-[#5DD62C]">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="outline-hidden focus-visible:underline"
                      >
                        {project.title}
                      </Link>
                    </h3>

                    <p className="line-clamp-3 text-sm leading-relaxed text-[#9E9E9E]">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#2A2A2A] space-y-4">
                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack?.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-[#0F0F0F] px-2 py-0.5 font-mono text-[11px] text-[#9E9E9E] border border-[#2A2A2A]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#5DD62C] transition-colors hover:underline"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Bento Empty State Card */
            <div className="rounded-xl border border-dashed border-[#2A2A2A] bg-[#202020]/40 p-8 sm:p-12 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#5DD62C]">
                <FolderKanban className="size-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#F8F8F8]">
                Projects are being curated
              </h3>
              <p className="mt-1 text-sm text-[#9E9E9E] max-w-md mx-auto">
                Published projects managed in the administrative dashboard will dynamically display here.
              </p>
              <div className="mt-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#202020] px-4 py-2 text-xs font-medium text-[#F8F8F8] hover:border-[#5DD62C]"
                >
                  <span>Explore Project Directory</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            BENTO ITEM 4: TECHNICAL SKILLS PILLS (md:col-span-8)
            ========================================================================= */}
        <section
          aria-labelledby="skills-matrix-heading"
          className="rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 md:col-span-8 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Code2 className="size-4 text-[#5DD62C]" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#5DD62C]">
                  Core Capabilities
                </span>
              </div>
              <h2
                id="skills-matrix-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8F8F8]"
              >
                Technical Proficiencies
              </h2>
            </div>
          </div>

          {hasSkills ? (
            <div className="space-y-6">
              {Object.entries(groupedSkills).map(([category, items]) => (
                <div key={category} className="space-y-2.5">
                  <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-[#9E9E9E]">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <div
                        key={skill._id}
                        className="group inline-flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#0F0F0F] px-3.5 py-1.5 text-xs font-medium text-[#F8F8F8] transition-all hover:border-[#5DD62C]/60 hover:text-[#5DD62C]"
                      >
                        <span>{skill.name}</span>
                        {typeof skill.proficiency === "number" && (
                          <span className="rounded-full bg-[#202020] px-1.5 py-0.5 font-mono text-[10px] text-[#5DD62C]">
                            {skill.proficiency}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#2A2A2A] bg-[#0F0F0F]/50 p-6 text-center">
              <p className="text-sm text-[#9E9E9E]">
                Technical skills recorded in the database will be grouped and displayed as interactive pills here.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["TypeScript", "React & Next.js", "Node.js", "MongoDB", "Tailwind CSS", "REST APIs"].map(
                  (sample) => (
                    <span
                      key={sample}
                      className="rounded-full border border-[#2A2A2A] bg-[#202020] px-3 py-1 font-mono text-xs text-[#9E9E9E]"
                    >
                      {sample}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            BENTO ITEM 5: ASK AI & INTERACTIVE CONVERSATION (md:col-span-4)
            ========================================================================= */}
        <section
          aria-label="Interactive AI Assistant"
          className="relative overflow-hidden rounded-2xl border border-[#337418]/60 bg-linear-to-b from-[#202020] to-[#0F0F0F] p-6 sm:p-8 md:col-span-4 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#337418] bg-[#5DD62C]/10 px-2.5 py-1 text-xs font-mono text-[#5DD62C]">
              <Sparkles className="size-3.5" />
              <span>Interactive AI</span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-[#F8F8F8]">
              Ask About My Experience
            </h2>

            <p className="text-sm leading-relaxed text-[#9E9E9E]">
              Have questions about my technical background, project architectures, or career journey?
              Chat directly with my AI support assistant.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
            <Link
              href="/support"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-4 py-2.5 text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_16px_rgba(93,214,44,0.3)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            >
              <Sparkles className="size-4" />
              <span>Launch AI Conversation</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
