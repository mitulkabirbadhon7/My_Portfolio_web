"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { FolderKanban, ArrowUpRight } from "lucide-react";
import { Project, ApiResponse } from "@/types";
import { api } from "@/lib/api";

// Canonical mappings to deduplicate common variations of technologies
const CANONICAL_TECH_MAP: Record<string, string> = {
  nextjs: "Next.js",
  "next.js": "Next.js",
  next: "Next.js",
  react: "React",
  reactjs: "React",
  "react.js": "React",
  radix: "Radix UI",
  "radix ui": "Radix UI",
  radixui: "Radix UI",
  shadcn: "shadcn/ui",
  "shadcn/ui": "shadcn/ui",
  "shadcn-ui": "shadcn/ui",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  typescript: "TypeScript",
  ts: "TypeScript",
  javascript: "JavaScript",
  js: "JavaScript",
  nodejs: "Node.js",
  "node.js": "Node.js",
  node: "Node.js",
  express: "Express.js",
  expressjs: "Express.js",
  "express.js": "Express.js",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",
  php: "PHP",
  python: "Python",
  vite: "Vite",
  zod: "Zod",
  "rest api": "REST API",
  "rest / json api": "REST API",
  "rest / json": "REST API",
};

function normalizeTechName(tech: string): string {
  const trimmed = tech.trim();
  const lower = trimmed.toLowerCase();
  if (CANONICAL_TECH_MAP[lower]) {
    return CANONICAL_TECH_MAP[lower];
  }
  return trimmed;
}

export function ProjectsGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<string>("All");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<Project[]>>("/projects");
      if (res && Array.isArray(res.data)) {
        const published = res.data.filter((p) => p.isPublished !== false);
        setProjects(published);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.warn("Could not load projects from API, displaying empty gallery state:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Extract unique, deduplicated technologies from active projects
  const availableTech = useMemo(() => {
    const techMap = new Map<string, string>(); // lowercase key -> display name
    projects.forEach((p) => {
      if (Array.isArray(p.techStack)) {
        p.techStack.forEach((t) => {
          if (typeof t === "string" && t.trim().length > 0) {
            const normalized = normalizeTechName(t);
            const key = normalized.toLowerCase();
            if (!techMap.has(key)) {
              techMap.set(key, normalized);
            }
          }
        });
      }
    });
    return Array.from(techMap.values()).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  // Filter projects by selected technology
  const filteredProjects = useMemo(() => {
    if (selectedTech === "All") return projects;

    const targetKey = normalizeTechName(selectedTech).toLowerCase();

    return projects.filter((project) => {
      if (!Array.isArray(project.techStack)) return false;
      return project.techStack.some(
        (t) => normalizeTechName(t).toLowerCase() === targetKey
      );
    });
  }, [projects, selectedTech]);

  return (
    <div className="space-y-10">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#337418]/60 bg-[#202020] px-3 py-1 text-xs font-mono text-[#5DD62C]">
          <span className="size-2 rounded-full bg-[#5DD62C] animate-pulse" />
          <span>Engineering Portfolio</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8F8F8]">
          Selected Works &amp; Case Studies
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-[#9E9E9E]">
          Explore production systems, architectural prototypes, and web applications built with modern
          TypeScript, distributed services, and performance-first design.
        </p>
      </div>

      {/* =========================================================================
          FILTER BY TECHNOLOGY (Unique / Deduplicated)
          ========================================================================= */}
      {availableTech.length > 0 && (
        <div className="space-y-2.5 rounded-2xl border border-[#2A2A2A] bg-[#202020]/60 p-4 sm:p-5 backdrop-blur-xs">
          <div className="font-mono text-xs text-[#9E9E9E] uppercase tracking-wider">
            Filter by Technology:
          </div>
          <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Filter projects by technology">
            {/* "All Technologies" Pill */}
            <button
              type="button"
              onClick={() => setSelectedTech("All")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-150 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] ${
                selectedTech === "All"
                  ? "bg-[#5DD62C] text-[#0F0F0F] font-semibold shadow-[0_0_15px_rgba(93,214,44,0.35)]"
                  : "bg-[#202020] text-[#9E9E9E] border border-[#2A2A2A] hover:border-[#337418] hover:text-[#F8F8F8]"
              }`}
              aria-pressed={selectedTech === "All"}
            >
              All Technologies
            </button>

            {/* Dynamic Deduplicated Tech Pills */}
            {availableTech.map((tech) => {
              const isActive = selectedTech.toLowerCase() === tech.toLowerCase();
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(isActive ? "All" : tech)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-150 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] ${
                    isActive
                      ? "bg-[#5DD62C] text-[#0F0F0F] font-semibold shadow-[0_0_15px_rgba(93,214,44,0.35)]"
                      : "bg-[#202020] text-[#9E9E9E] border border-[#2A2A2A] hover:border-[#337418] hover:text-[#F8F8F8]"
                  }`}
                  aria-pressed={isActive}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          STATE: LOADING SKELETON
          ========================================================================= */}
      {loading && (
        <div
          aria-label="Loading projects"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-[#2A2A2A] bg-[#202020] p-4 sm:p-5 space-y-4 animate-pulse"
            >
              <div className="aspect-16/10 w-full rounded-xl bg-[#2A2A2A]" />
              <div className="space-y-2 pt-1">
                <div className="h-3 w-1/3 rounded bg-[#2A2A2A]" />
                <div className="h-6 w-3/4 rounded bg-[#2A2A2A]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          STATE: EMPTY GALLERY (Graceful & Minimalist)
          ========================================================================= */}
      {!loading && filteredProjects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#2A2A2A] bg-[#202020]/40 p-12 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#5DD62C]">
            <FolderKanban className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-[#F8F8F8]">No projects found</h2>
          <p className="text-sm text-[#9E9E9E] max-w-md mx-auto">
            {selectedTech !== "All"
              ? `No projects found matching the "${selectedTech}" technology filter.`
              : "No projects have been published yet. Case studies configured in the admin panel will appear here."}
          </p>
          {selectedTech !== "All" && (
            <button
              type="button"
              onClick={() => setSelectedTech("All")}
              className="inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-4 py-2 text-xs font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90"
            >
              Show All Projects
            </button>
          )}
        </div>
      )}

      {/* =========================================================================
          RESPONSIVE PROJECTS GRID (1 Col Mobile, 2 Cols Tablet, 3 Cols Desktop)
          ========================================================================= */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            // Subtitle in small, muted uppercase text
            const subtitle = project.client
              ? `${project.client} • ${project.techStack?.slice(0, 2).join(" / ") || "WEB APP"}`.toUpperCase()
              : Array.isArray(project.techStack) && project.techStack.length > 0
              ? project.techStack.slice(0, 3).map((t) => normalizeTechName(t)).join(" • ").toUpperCase()
              : "WEB APPLICATION";

            return (
              <Link
                key={project._id}
                href={`/projects/${project.slug || project._id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] p-4 sm:p-5 transition-all duration-300 hover:border-[#337418] hover:shadow-[0_0_24px_rgba(93,214,44,0.12)] hover:-translate-y-1 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
              >
                {/* 1. Large Image Area at the Top */}
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] mb-4">
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#202020] to-[#0F0F0F] p-4 text-center">
                      <div className="flex size-12 items-center justify-center rounded-xl bg-[#337418]/20 border border-[#337418]/40 text-[#5DD62C] mb-2 transition-transform group-hover:scale-110">
                        <FolderKanban className="size-6" />
                      </div>
                      <span className="font-mono text-xs text-[#9E9E9E]">Project Preview</span>
                    </div>
                  )}
                </div>

                {/* 2. Subtitle, 3. Bold Title, 4. Arrow/Target Icon */}
                <div className="flex items-end justify-between gap-3 pt-1">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <span className="block truncate font-mono text-[11px] font-semibold uppercase tracking-wider text-[#9E9E9E]">
                      {subtitle}
                    </span>
                    <h3 className="truncate text-xl sm:text-2xl font-bold tracking-tight text-[#F8F8F8] transition-colors group-hover:text-[#5DD62C]">
                      {project.title}
                    </h3>
                  </div>

                  {/* Subtle clickable arrow/target icon in bottom right */}
                  <div
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#0F0F0F] text-[#9E9E9E] transition-all duration-200 group-hover:border-[#5DD62C]/60 group-hover:bg-[#5DD62C] group-hover:text-[#0F0F0F] group-hover:shadow-[0_0_12px_rgba(93,214,44,0.3)]"
                  >
                    <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
