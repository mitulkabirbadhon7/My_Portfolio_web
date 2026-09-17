"use client";

import React from "react";
import Link from "next/link";
import { Mail, ArrowUpRight, Code2 } from "lucide-react";
import { useSettings } from "@/context/settings-context";

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

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const githubHref = settings.githubUrl || "https://github.com/mitulkabirbadhon7";
  const linkedinHref = settings.linkedinUrl || "https://linkedin.com";
  const emailHref = settings.contactEmail
    ? `mailto:${settings.contactEmail}`
    : "mailto:mitulkabirbadhon7@gmail.com";

  return (
    <footer className="w-full border-t border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#202020]">
                <Code2 className="size-4 text-[#5DD62C]" />
              </span>
              <span className="font-mono text-base font-bold tracking-tight text-[#F8F8F8]">
                Mitul Kabir Badhon
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#9E9E9E]">
              Full-Stack Software Engineer specializing in modern web architecture, distributed systems,
              and performant digital experiences. Built with precision and dark minimalist aesthetics.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5DD62C] opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#5DD62C]" />
              </span>
              <span className="font-mono text-xs text-[#9E9E9E]">
                All systems operational • Open to select opportunities
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F8F8]">
              Index
            </h3>
            <ul className="space-y-2 text-sm text-[#9E9E9E]">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                >
                  About & Career
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                >
                  Selected Works
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/cv"
                  className="transition-colors hover:text-[#5DD62C] inline-flex items-center gap-1 outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                >
                  <span>Curriculum Vitae</span>
                  <ArrowUpRight className="size-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect & Socials */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F8F8]">
              Connect
            </h3>
            <ul className="space-y-2 text-sm text-[#9E9E9E]">
              {githubHref && (
                <li>
                  <a
                    href={githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon className="size-4 transition-transform group-hover:scale-110" />
                    <span>GitHub</span>
                    <ArrowUpRight className="size-3 text-[#9E9E9E] group-hover:text-[#5DD62C]" />
                  </a>
                </li>
              )}

              {linkedinHref && (
                <li>
                  <a
                    href={linkedinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedinIcon className="size-4 transition-transform group-hover:scale-110" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="size-3 text-[#9E9E9E] group-hover:text-[#5DD62C]" />
                  </a>
                </li>
              )}

              <li>
                <a
                  href={emailHref}
                  className="group inline-flex items-center gap-2 transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C]"
                  aria-label="Send direct email"
                >
                  <Mail className="size-4 transition-transform group-hover:scale-110" />
                  <span>Email</span>
                  <ArrowUpRight className="size-3 text-[#9E9E9E] group-hover:text-[#5DD62C]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Dynamic Year */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2A2A2A] pt-8 text-xs text-[#9E9E9E]">
          <p className="font-mono">
            &copy; {currentYear} Mitul Kabir. All rights reserved.
          </p>

          <p className="flex items-center gap-1 font-mono">
            Crafted with Next.js, TypeScript &amp; Electric Green
          </p>
        </div>
      </div>
    </footer>
  );
}
