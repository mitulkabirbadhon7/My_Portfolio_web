"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { useSettings } from "@/context/settings-context";

export function Footer() {
  const { settings } = useSettings();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  const github = settings.githubUrl || "https://github.com/mitulkabirbadhon7";
  const linkedin = settings.linkedinUrl || "https://linkedin.com/in/mitulkabirbadhon";
  const email = settings.contactEmail || "mitulkabirbadhon7@gmail.com";

  return (
    <footer className="w-full border-t border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        {/* Brand Name */}
        <div>
          <div className="text-xl font-bold tracking-tight font-sans">
            <span className="text-[#F8F8F8]">Mitul Kabir</span>{" "}
            <span className="text-[#5DD62C]">Badhon</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono uppercase tracking-wider text-[#9E9E9E]"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="link-editorial transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C] px-1 py-0.5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-3">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="flex size-9 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#202020] text-[#9E9E9E] transition-all hover:border-[#5DD62C] hover:text-[#5DD62C] hover:shadow-[0_0_12px_rgba(93,214,44,0.2)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <GithubIcon className="size-4" />
          </a>

          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="flex size-9 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#202020] text-[#9E9E9E] transition-all hover:border-[#5DD62C] hover:text-[#5DD62C] hover:shadow-[0_0_12px_rgba(93,214,44,0.2)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <LinkedinIcon className="size-4" />
          </a>

          <a
            href={`mailto:${email}`}
            aria-label="Send Email"
            className="flex size-9 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#202020] text-[#9E9E9E] transition-all hover:border-[#5DD62C] hover:text-[#5DD62C] hover:shadow-[0_0_12px_rgba(93,214,44,0.2)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
