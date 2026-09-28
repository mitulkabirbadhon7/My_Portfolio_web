"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderGit2, ExternalLink } from "lucide-react";
import { Project } from "@/types";

interface BentoProjectsProps {
  projects?: Project[];
}

interface ProjectDisplayItem {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link: string;
  repoUrl?: string;
  image?: string;
  size: "large" | "medium" | "small";
}

// Restrained 3D Card Tilt Component (max 3 degrees, inner content counter-shifts)
function BentoCard({
  item,
  className = "",
}: {
  item: ProjectDisplayItem;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanTilt(isFine && !isReduced);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 3 degrees tilt
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
      className={`group relative ${className}`}
    >
      <div
        className="h-full w-full rounded-xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-7 flex flex-col justify-between transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-[#337418] group-hover:-translate-y-1 group-hover:shadow-[0_12px_32px_-12px_rgba(93,214,44,0.18)]"
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
            : "rotateX(0deg) rotateY(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Inner Content (Counter-shifts slightly for parallax depth) */}
        <div
          className="flex flex-col h-full justify-between space-y-6 transition-transform duration-200"
          style={{
            transform: isHovered
              ? `translate3d(${-rotate.y * 0.8}px, ${-rotate.x * 0.8}px, 0)`
              : "none",
          }}
        >
          {/* Card Top: Tags and Arrow */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {item.techStack.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[#0F0F0F] px-2.5 py-0.5 font-mono text-[11px] text-[#9E9E9E] border border-[#2A2A2A]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Sliding Diagonal Arrow */}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-[#5DD62C] group-hover:text-[#5DD62C] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="size-4" />
            </span>
          </div>

          {/* Optional Image for Large/Medium cards if available */}
          {item.image && (item.size === "large" || item.size === "medium") && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0F0F0F]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-102"
              />
            </div>
          )}

          {/* Card Bottom: Title & Description */}
          <div className="space-y-2 pt-2">
            <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#F8F8F8] transition-colors duration-200 group-hover:text-[#5DD62C]">
              <Link href={item.link} className="outline-hidden focus-visible:underline">
                {item.title}
              </Link>
            </h3>
            <p className="text-sm text-[#9E9E9E] leading-relaxed line-clamp-3">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BentoProjects({ projects = [] }: BentoProjectsProps) {
  // Real projects list from Mitul's actual work
  const published = projects.filter((p) => p.isPublished !== false);

  // If projects from API exist, map them with varying bento sizes
  const bentoItems: ProjectDisplayItem[] = [
    {
      id: published[0]?._id || "1",
      title: published[0]?.title || "Dynamic Portfolio & Systems Engine",
      description:
        published[0]?.description ||
        "Production-grade distributed web application with Next.js 16, TypeScript, MongoDB architecture, and autonomous AI chat capabilities.",
      techStack: published[0]?.techStack || ["Next.js 16", "TypeScript", "MongoDB", "Express"],
      link: published[0]?.slug ? `/projects/${published[0].slug}` : "/projects",
      image: published[0]?.image,
      size: "large",
    },
    {
      id: published[1]?._id || "2",
      title: published[1]?.title || "Distributed Task & API Service",
      description:
        published[1]?.description ||
        "High-performance REST API service featuring rate-limiting, secure JWT authentication, and structured schema validations with Zod.",
      techStack: published[1]?.techStack || ["Node.js", "Express", "TypeScript", "Zod"],
      link: published[1]?.slug ? `/projects/${published[1].slug}` : "/projects",
      image: published[1]?.image,
      size: "medium",
    },
    {
      id: published[2]?._id || "3",
      title: published[2]?.title || "Interactive Gemini AI Knowledge Bot",
      description:
        published[2]?.description ||
        "Intelligent real-time conversational agent grounded in personal engineering background with streaming markdown response generation.",
      techStack: published[2]?.techStack || ["Gemini API", "React 19", "WebSockets"],
      link: published[2]?.slug ? `/projects/${published[2].slug}` : "/projects",
      image: published[2]?.image,
      size: "medium",
    },
    {
      id: published[3]?._id || "4",
      title: published[3]?.title || "Full-Stack System Architecture & DB",
      description:
        published[3]?.description ||
        "Normalized document schemas, Cloudinary asset storage pipelines, and resilient multi-container Docker deployment setups.",
      techStack: published[3]?.techStack || ["PostgreSQL", "Docker", "Linux"],
      link: published[3]?.slug ? `/projects/${published[3].slug}` : "/projects",
      size: "small",
    },
    {
      id: published[4]?._id || "5",
      title: published[4]?.title || "Performance Optimization & UI Tooling",
      description:
        published[4]?.description ||
        "Editorial styling system, zero layout shift components, and micro-interactions optimized for 60fps GPU acceleration.",
      techStack: published[4]?.techStack || ["Tailwind CSS", "Web Vitals", "Next.js"],
      link: published[4]?.slug ? `/projects/${published[4].slug}` : "/projects",
      size: "small",
    },
  ];

  return (
    <section
      id="projects"
      aria-label="Selected Projects Bento Grid"
      className="border-t border-[#2A2A2A] py-20 sm:py-28"
      style={{
        paddingTop: "clamp(70px, 12vh, 140px)",
        paddingBottom: "clamp(70px, 12vh, 140px)",
      }}
    >
      <div className="space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
                Selected Work
              </span>
              <span className="h-px w-12 bg-[#2A2A2A]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F8F8F8]">
              Engineered with intent.
            </h2>
          </div>

          <Link
            href="/projects"
            className="link-editorial text-sm font-semibold text-[#F8F8F8] hover:text-[#5DD62C] inline-flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>View complete project index</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        {/* Bento Grid: 1 Large (8-col or 12-col), 2 Medium (6-col each), 2 Small (6-col each) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Card 1: Large Featured (md:col-span-8) */}
          <BentoCard item={bentoItems[0]} className="md:col-span-8" />

          {/* Card 2: Medium (md:col-span-4) */}
          <BentoCard item={bentoItems[1]} className="md:col-span-4" />

          {/* Card 3: Medium (md:col-span-6) */}
          <BentoCard item={bentoItems[2]} className="md:col-span-6" />

          {/* Card 4: Small (md:col-span-3) */}
          <BentoCard item={bentoItems[3]} className="md:col-span-3" />

          {/* Card 5: Small (md:col-span-3) */}
          <BentoCard item={bentoItems[4]} className="md:col-span-3" />
        </div>
      </div>
    </section>
  );
}
