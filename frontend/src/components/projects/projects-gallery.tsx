"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { FolderKanban, ArrowUpRight } from "lucide-react";
import { Project, ApiResponse } from "@/types";
import { api } from "@/lib/api";

const CORE_TECH_SET = new Set([
  "next.js",
  "react",
  "typescript",
  "javascript",
  "node.js",
  "express.js",
  "python",
  "php",
  "tailwind css",
  "postgresql",
  "mongodb",
  "redis",
  "docker",
  "vite",
  "rest api",
  "graphql",
  "neon",
  "zod",
]);

const CANONICAL_TECH_MAP: Record<string, string> = {
  nextjs: "Next.js",
  "next.js": "Next.js",
  next: "Next.js",
  react: "React",
  reactjs: "React",
  "react.js": "React",
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
  neon: "PostgreSQL",
  php: "PHP",
  python: "Python",
  vite: "Vite",
  zod: "Zod",
  "rest api": "REST API",
  "rest / json api": "REST API",
  "rest / json": "REST API",
  docker: "Docker",
  redis: "Redis",
  graphql: "GraphQL",
};

function normalizeCoreTechName(tech: string): string | null {
  const trimmed = tech.trim();
  const lower = trimmed.toLowerCase();

  // If in canonical map
  if (CANONICAL_TECH_MAP[lower]) {
    return CANONICAL_TECH_MAP[lower];
  }

  // Filter out non-core fluff (endpoints, sentences, icons, fonts, hosting, gateways, etc.)
  if (
    lower.includes("endpoint") ||
    lower.includes("example") ||
    lower.includes("font") ||
    lower.includes("icon") ||
    lower.includes("hosting") ||
    lower.includes("gateway") ||
    lower.includes("integration") ||
    lower.includes("radix") ||
    lower.includes("shadcn") ||
    lower.length > 25
  ) {
    return null;
  }

  if (CORE_TECH_SET.has(lower)) {
    return trimmed;
  }

  return null;
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

  const availableTech = useMemo(() => {
    const techMap = new Map<string, string>();
    projects.forEach((p) => {
      if (Array.isArray(p.techStack)) {
        p.techStack.forEach((t) => {
          if (typeof t === "string" && t.trim().length > 0) {
            const normalized = normalizeCoreTechName(t);
            if (normalized) {
              const key = normalized.toLowerCase();
              if (!techMap.has(key)) {
                techMap.set(key, normalized);
              }
            }
          }
        });
      }
    });
    return Array.from(techMap.values()).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedTech === "All") return projects;
    const targetKey = (normalizeCoreTechName(selectedTech) || selectedTech).toLowerCase();
    return projects.filter((project) => {
      if (!Array.isArray(project.techStack)) return false;
      return project.techStack.some((t) => {
        const normalized = normalizeCoreTechName(t);
        return normalized && normalized.toLowerCase() === targetKey;
      });
    });
  }, [projects, selectedTech]);

  return (
    <div className="space-y-12">
      {/* PAGE HEADER */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#5DD62C] shadow-[0_0_8px_rgba(93,214,44,0.6)]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
            Selected Works
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F8F8F8]">
          Engineering Portfolio
        </h1>

        <p className="max-w-2xl text-base sm:text-lg text-[#9E9E9E] leading-relaxed">
          Production software, backend distributed services, and high-performance web systems
          engineered with clean TypeScript, robust data models, and deliberate simplicity.
        </p>
      </div>

      {/* FILTER BY TECHNOLOGY */}
      {availableTech.length > 0 && (
        <div className="space-y-3 rounded-xl border border-[#2A2A2A] bg-[#202020] p-5">
          <div className="font-mono text-xs text-[#9E9E9E] uppercase tracking-wider">
            Filter by Technology:
          </div>
          <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Filter projects by technology">
            <button
              type="button"
              onClick={() => setSelectedTech("All")}
              className={`rounded-full px-3.5 py-1 text-xs font-mono transition-all duration-150 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] ${
                selectedTech === "All"
                  ? "bg-[#5DD62C] text-[#0F0F0F] font-semibold shadow-[0_0_12px_rgba(93,214,44,0.3)]"
                  : "bg-[#0F0F0F] text-[#9E9E9E] border border-[#2A2A2A] hover:border-[#5DD62C] hover:text-[#F8F8F8]"
              }`}
              aria-pressed={selectedTech === "All"}
            >
              All Technologies
            </button>

            {availableTech.map((tech) => {
              const isActive = selectedTech.toLowerCase() === tech.toLowerCase();
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(isActive ? "All" : tech)}
                  className={`rounded-full px-3.5 py-1 text-xs font-mono transition-all duration-150 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] ${
                    isActive
                      ? "bg-[#5DD62C] text-[#0F0F0F] font-semibold shadow-[0_0_12px_rgba(93,214,44,0.3)]"
                      : "bg-[#0F0F0F] text-[#9E9E9E] border border-[#2A2A2A] hover:border-[#5DD62C] hover:text-[#F8F8F8]"
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

      {/* LOADING SKELETON */}
      {loading && (
        <div
          aria-label="Loading projects"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-[#2A2A2A] bg-[#202020] p-5 space-y-4 animate-pulse"
            >
              <div className="aspect-[16/10] w-full rounded-lg bg-[#0F0F0F]" />
              <div className="space-y-2 pt-1">
                <div className="h-3 w-1/3 rounded bg-[#0F0F0F]" />
                <div className="h-6 w-3/4 rounded bg-[#0F0F0F]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY GALLERY */}
      {!loading && filteredProjects.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#2A2A2A] bg-[#202020]/40 p-12 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#5DD62C]">
            <FolderKanban className="size-6" />
          </div>
          <h2 className="font-serif text-xl font-medium text-[#F8F8F8]">No projects found</h2>
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

      {/* RESPONSIVE PROJECTS GRID */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const coreTechTags = (project.techStack || [])
              .map((t) => normalizeCoreTechName(t))
              .filter((t): t is string => Boolean(t));

            const subtitle = project.client
              ? `${project.client} • ${coreTechTags.slice(0, 2).join(" / ") || "WEB APP"}`.toUpperCase()
              : coreTechTags.length > 0
              ? coreTechTags.slice(0, 3).join(" • ").toUpperCase()
              : "WEB APPLICATION";

            return (
              <Link
                key={project._id}
                href={`/projects/${project.slug || project._id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#202020] p-5 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_12px_32px_-12px_rgba(93,214,44,0.18)] hover:-translate-y-1 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] mb-4">
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={`${project.title} preview`}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center p-4 text-center text-[#9E9E9E] bg-[#181818]">
                      <FolderKanban className="size-8 text-[#5DD62C]/60 mb-2" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#9E9E9E]">
                        {project.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Subtitle & Title */}
                <div className="space-y-2">
                  <div className="font-mono text-[11px] tracking-wider text-[#9E9E9E]">
                    {subtitle}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-xl font-medium tracking-tight text-[#F8F8F8] transition-colors group-hover:text-[#5DD62C]">
                      {project.title}
                    </h3>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] transition-colors group-hover:border-[#5DD62C] group-hover:text-[#5DD62C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>

                  <p className="text-xs text-[#9E9E9E] line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
