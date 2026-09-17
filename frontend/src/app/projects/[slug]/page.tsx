import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  Code2,
  FileText,
  Clock,
} from "lucide-react";
import { Project, ApiResponse } from "@/types";

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

// Server-side data fetching helper
async function getProject(slug: string): Promise<Project | null> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/projects/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const json: ApiResponse<Project> = await res.json();
    if (!json || !json.data) {
      return null;
    }

    // Requirement 4: Do not publicly render draft projects
    if (json.data.isPublished === false) {
      return null;
    }

    return json.data;
  } catch (err) {
    console.warn(`Failed to fetch project by slug "${slug}":`, err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | Portfolio",
      description: "The requested project case study could not be located.",
    };
  }

  const title = `${project.title} | Case Study`;
  const description = project.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/projects/${project.slug}`,
      ...(project.image ? { images: [{ url: project.image, alt: project.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(project.image ? { images: [project.image] } : {}),
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  // Requirement 3 & 4: If project does not exist or is a draft, return 404
  if (!project) {
    notFound();
  }

  const createdFormatted = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 space-y-12">
      {/* =========================================================================
          NAVIGATION: BACK TO PROJECTS (Requirement 8)
          ========================================================================= */}
      <div>
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#9E9E9E] hover:text-[#5DD62C] transition-colors outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* =========================================================================
          HEADER SECTION (Requirement 5: title, description, tech stack, demo, repo)
          ========================================================================= */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#337418]/60 bg-[#202020] px-3 py-1 font-mono text-xs text-[#5DD62C]">
            <Layers className="size-3.5" />
            <span>Case Study</span>
          </span>

          <span className="inline-flex items-center gap-1 font-mono text-xs text-[#9E9E9E]">
            <Calendar className="size-3.5 text-[#5DD62C]" />
            <time dateTime={project.createdAt}>{createdFormatted}</time>
          </span>
        </div>

        {/* Project Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F8F8F8]">
          {project.title}
        </h1>

        {/* Project Short Summary */}
        <p className="max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed text-[#9E9E9E]">
          {project.description}
        </p>

        {/* Tech Stack Badges */}
        {Array.isArray(project.techStack) && project.techStack.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#9E9E9E]">
              Technologies &amp; Tools:
            </span>
            <div className="flex flex-wrap gap-2 pt-1" aria-label="Project tech stack">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-[#2A2A2A] bg-[#202020] px-3 py-1 font-mono text-xs text-[#F8F8F8] transition-colors hover:border-[#5DD62C]/60 hover:text-[#5DD62C]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Links: Live Demo & Repository */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#2A2A2A]">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-5 py-2.5 text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_18px_rgba(93,214,44,0.3)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            >
              <ExternalLink className="size-4" />
              <span>Live Application Demo</span>
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#202020] px-5 py-2.5 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#5DD62C] hover:text-[#5DD62C] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            >
              <GithubIcon className="size-4" />
              <span>View Source Code</span>
            </a>
          )}
        </div>
      </header>

      {/* =========================================================================
          HERO COVER IMAGE
          ========================================================================= */}
      {project.image ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.title} hero mockup`}
            className="h-full w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-[#2A2A2A] bg-[#202020]/40 p-8 text-center text-[#9E9E9E]">
          <div className="space-y-2">
            <Code2 className="mx-auto size-12 text-[#5DD62C]/60" />
            <p className="font-mono text-xs uppercase tracking-wider text-[#9E9E9E]">
              {project.slug}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MARKDOWN CONTENT BODY (Requirements 6 & 7: Verified renderer + sanitization)
          ========================================================================= */}
      <section aria-labelledby="project-content-heading" className="space-y-6">
        <div className="border-b border-[#2A2A2A] pb-4">
          <h2
            id="project-content-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8F8F8] flex items-center gap-2"
          >
            <FileText className="size-5 text-[#5DD62C]" />
            <span>Architecture &amp; Implementation Details</span>
          </h2>
        </div>

        {project.content && project.content.trim().length > 0 ? (
          <div className="space-y-6 text-[#F8F8F8]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h1
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8] mt-8 mb-4 border-b border-[#2A2A2A] pb-2"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8F8F8] mt-6 mb-3"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-lg sm:text-xl font-semibold text-[#F8F8F8] mt-4 mb-2"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p className="text-base leading-relaxed text-[#9E9E9E] my-3" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc list-inside space-y-2 my-4 text-[#9E9E9E]" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal list-inside space-y-2 my-4 text-[#9E9E9E]" {...props} />
                ),
                li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                a: ({ ...props }) => (
                  <a
                    className="text-[#5DD62C] underline underline-offset-2 hover:text-[#5DD62C]/80 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-2 border-[#5DD62C] bg-[#202020]/50 py-2.5 px-4 my-4 rounded-r-lg italic text-[#9E9E9E]"
                    {...props}
                  />
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className && typeof children === "string";
                  if (isInline) {
                    return (
                      <code
                        className="rounded-md border border-[#2A2A2A] bg-[#0F0F0F] px-1.5 py-0.5 font-mono text-xs text-[#5DD62C]"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="font-mono text-xs text-[#F8F8F8]" {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ ...props }) => (
                  <pre
                    className="my-4 overflow-x-auto rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4 font-mono text-xs text-[#F8F8F8]"
                    {...props}
                  />
                ),
                table: ({ ...props }) => (
                  <div className="my-6 overflow-x-auto">
                    <table
                      className="w-full border-collapse border border-[#2A2A2A] text-left text-sm text-[#9E9E9E]"
                      {...props}
                    />
                  </div>
                ),
                th: ({ ...props }) => (
                  <th
                    className="border border-[#2A2A2A] bg-[#202020] p-2.5 font-mono text-xs font-semibold text-[#F8F8F8]"
                    {...props}
                  />
                ),
                td: ({ ...props }) => (
                  <td className="border border-[#2A2A2A] p-2.5 text-xs text-[#9E9E9E]" {...props} />
                ),
                hr: () => <hr className="my-8 border-[#2A2A2A]" />,
              }}
            >
              {project.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#2A2A2A] bg-[#202020]/40 p-8 text-center space-y-2">
            <Clock className="mx-auto size-8 text-[#5DD62C]" />
            <h3 className="text-base font-semibold text-[#F8F8F8]">
              In-Depth Documentation Coming Soon
            </h3>
            <p className="text-sm text-[#9E9E9E] max-w-md mx-auto">
              A comprehensive technical write-up detailing system metrics and architecture diagrams will be
              published here.
            </p>
          </div>
        )}
      </section>

      {/* =========================================================================
          BOTTOM CALL TO ACTION & FOOTER NAV
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2A2A2A] pt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#202020] px-4 py-2.5 text-sm font-medium text-[#F8F8F8] hover:border-[#5DD62C] hover:text-[#5DD62C] transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to all projects</span>
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg border border-[#337418] bg-[#5DD62C] px-4 py-2.5 text-sm font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90 transition-colors"
        >
          <span>Discuss this project</span>
        </Link>
      </div>
    </article>
  );
}
