"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  X,
  FolderKanban,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Code2,
} from "lucide-react";
import { Project, ApiResponse } from "@/types";
import { api } from "@/lib/api";

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

export function ProjectsGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("All");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse<Project[]>>("/projects");
      if (res && Array.isArray(res.data)) {
        const published = res.data.filter((p) => p.isPublished !== false);
        setProjects(published);
      } else {
        setProjects([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load projects from server.";
      setError(msg);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiResponse<Project[]>>("/projects")
      .then((res) => {
        if (isMounted) {
          if (res && Array.isArray(res.data)) {
            const published = res.data.filter((p) => p.isPublished !== false);
            setProjects(published);
          } else {
            setProjects([]);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Failed to load projects from server.";
          setError(msg);
          setProjects([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Requirement 3 & 7: Extract unique tech stack values dynamically from actual project data
  // Do NOT invent categories or hardcode values
  const availableTech = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((p) => {
      if (Array.isArray(p.techStack)) {
        p.techStack.forEach((t) => {
          if (typeof t === "string" && t.trim().length > 0) {
            techSet.add(t.trim());
          }
        });
      }
    });
    return Array.from(techSet).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  // Requirement 2: Filter by title and description + selected tech stack
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      // Search filter (title and description)
      const matchesSearch =
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query);

      // Tech stack filter
      const matchesTech =
        selectedTech === "All" ||
        (Array.isArray(project.techStack) &&
          project.techStack.some((t) => t.trim().toLowerCase() === selectedTech.toLowerCase()));

      return matchesSearch && matchesTech;
    });
  }, [projects, searchQuery, selectedTech]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTech("All");
  };

  return (
    <div className="space-y-8">
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
          SEARCH & FILTER CONTROL BAR
          ========================================================================= */}
      <div className="space-y-4 rounded-2xl border border-[#2A2A2A] bg-[#202020] p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input (Requirement 2) */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9E9E9E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] pl-10 pr-10 py-2.5 text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/70 outline-hidden transition-colors focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C]"
              aria-label="Search projects by title or description"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search text"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#F8F8F8] transition-colors p-1"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Project Count Indicator */}
          <div className="font-mono text-xs text-[#9E9E9E] self-end sm:self-center">
            Showing <span className="font-bold text-[#5DD62C]">{filteredProjects.length}</span> of{" "}
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </div>
        </div>

        {/* Tech Stack Filter Pills (Requirements 3 & 4) */}
        {availableTech.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#2A2A2A]">
            <div className="font-mono text-xs text-[#9E9E9E] uppercase tracking-wider">
              Filter by Technology:
            </div>
            <div className="flex flex-wrap gap-2 pt-1" role="toolbar" aria-label="Technology filters">
              {/* "All" Pill */}
              <button
                type="button"
                onClick={() => setSelectedTech("All")}
                className={`rounded-lg px-3 py-1.5 text-xs transition-all duration-150 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] ${
                  selectedTech === "All"
                    ? "bg-[#5DD62C] text-[#0F0F0F] font-semibold shadow-[0_0_12px_rgba(93,214,44,0.3)]"
                    : "bg-[#202020] text-[#F8F8F8] border border-[#2A2A2A] hover:border-[#5DD62C]/50"
                }`}
                aria-pressed={selectedTech === "All"}
              >
                All Technologies
              </button>

              {/* Dynamic Tech Pills from actual data */}
              {availableTech.map((tech) => {
                const isActive = selectedTech.toLowerCase() === tech.toLowerCase();
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setSelectedTech(isActive ? "All" : tech)}
                    className={`rounded-lg px-3 py-1.5 text-xs transition-all duration-150 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] ${
                      isActive
                        ? "bg-[#5DD62C] text-[#0F0F0F] font-semibold shadow-[0_0_12px_rgba(93,214,44,0.3)]"
                        : "bg-[#202020] text-[#F8F8F8] border border-[#2A2A2A] hover:border-[#5DD62C]/50"
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
      </div>

      {/* =========================================================================
          STATE: ERROR
          ========================================================================= */}
      {error && !loading && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-950/20 p-6 text-center space-y-3"
        >
          <div className="inline-flex size-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <AlertCircle className="size-5" />
          </div>
          <h2 className="text-base font-bold text-[#F8F8F8]">Unable to load project gallery</h2>
          <p className="text-sm text-[#9E9E9E] max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={fetchProjects}
            className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#202020] px-4 py-2 text-xs font-medium text-[#F8F8F8] hover:border-[#5DD62C] hover:text-[#5DD62C] transition-colors"
          >
            <RefreshCw className="size-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          STATE: LOADING (Skeleton Grid)
          ========================================================================= */}
      {loading && (
        <div
          aria-label="Loading projects"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 space-y-4 animate-pulse"
            >
              <div className="h-44 w-full rounded-lg bg-[#2A2A2A]" />
              <div className="h-6 w-3/4 rounded bg-[#2A2A2A]" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-[#2A2A2A]/70" />
                <div className="h-4 w-5/6 rounded bg-[#2A2A2A]/70" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-5 w-14 rounded bg-[#2A2A2A]" />
                <div className="h-5 w-16 rounded bg-[#2A2A2A]" />
                <div className="h-5 w-12 rounded bg-[#2A2A2A]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          STATE: EMPTY SEARCH RESULTS
          ========================================================================= */}
      {!loading && !error && projects.length > 0 && filteredProjects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#2A2A2A] bg-[#202020]/40 p-12 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#9E9E9E]">
            <Search className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-[#F8F8F8]">No matching projects found</h2>
          <p className="text-sm text-[#9E9E9E] max-w-md mx-auto">
            No projects matched your search for &quot;<span className="text-[#5DD62C]">{searchQuery}</span>&quot;
            {selectedTech !== "All" && (
              <>
                {" "}
                with technology &quot;<span className="text-[#5DD62C]">{selectedTech}</span>&quot;
              </>
            )}
            .
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-4 py-2 text-xs font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          STATE: EMPTY DATABASE (No published projects at all)
          ========================================================================= */}
      {!loading && !error && projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#2A2A2A] bg-[#202020]/40 p-12 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#0F0F0F] border border-[#2A2A2A] text-[#5DD62C]">
            <FolderKanban className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-[#F8F8F8]">Project portfolio in preparation</h2>
          <p className="text-sm text-[#9E9E9E] max-w-md mx-auto">
            Published case studies and projects created in the administrative management portal will
            dynamically appear here with interactive live demos.
          </p>
        </div>
      )}

      {/* =========================================================================
          PROJECT CARDS GRID (Requirement 5)
          ========================================================================= */}
      {!loading && !error && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <article
              key={project._id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#202020] transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_24px_rgba(93,214,44,0.12)]"
            >
              {/* Card Image / Preview Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#0F0F0F] border-b border-[#2A2A2A]">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={`${project.title} cover preview`}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center gap-2 text-[#9E9E9E]">
                    <Code2 className="size-8 text-[#5DD62C]/60" />
                    <span className="font-mono text-xs text-[#9E9E9E]">
                      {project.slug || "case-study"}
                    </span>
                  </div>
                )}

                {/* Date Tag Badge */}
                <div className="absolute bottom-2.5 right-2.5 rounded-md bg-[#0F0F0F]/85 px-2 py-0.5 font-mono text-[10px] text-[#9E9E9E] backdrop-blur-xs border border-[#2A2A2A]">
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Card Content Body */}
              <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-[#F8F8F8] transition-colors group-hover:text-[#5DD62C]">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="outline-hidden focus-visible:underline"
                    >
                      {project.title}
                    </Link>
                  </h2>

                  <p className="line-clamp-3 text-sm leading-relaxed text-[#9E9E9E]">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Pills & Card Actions */}
                <div className="space-y-4 pt-2 border-t border-[#2A2A2A]">
                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5" aria-label="Technologies used">
                    {project.techStack?.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-[#2A2A2A] bg-[#0F0F0F] px-2 py-0.5 font-mono text-[11px] text-[#9E9E9E]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links: Details / Live Demo / Source Code */}
                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-[#5DD62C] transition-colors hover:underline"
                    >
                      <span>View Details</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>

                    <div className="flex items-center gap-3">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Source repository for ${project.title}`}
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
                          aria-label={`Live application demo for ${project.title}`}
                          className="text-[#9E9E9E] transition-colors hover:text-[#5DD62C]"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
