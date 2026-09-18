"use client";

import React from "react";
import Link from "next/link";
import { useSettings } from "@/context/settings-context";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function Footer() {
  const { settings } = useSettings();

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "ABOUT", href: "/about" },
    { label: "WORKS", href: "/projects" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <footer className="w-full border-t border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] py-14">
      <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-center space-y-6 text-center">
        {/* Navigation Links */}
        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm font-mono tracking-widest uppercase text-[#9E9E9E]"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-[#5DD62C] outline-hidden focus-visible:ring-1 focus-visible:ring-[#5DD62C] px-1 py-0.5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-4 pt-1">
          <a
            href={settings.instagramUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex size-11 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#202020] text-[#9E9E9E] transition-all hover:border-[#5DD62C] hover:text-[#5DD62C] hover:shadow-[0_0_15px_rgba(93,214,44,0.3)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <InstagramIcon className="size-4" />
          </a>

          <a
            href={settings.facebookUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex size-11 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#202020] text-[#9E9E9E] transition-all hover:border-[#5DD62C] hover:text-[#5DD62C] hover:shadow-[0_0_15px_rgba(93,214,44,0.3)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <FacebookIcon className="size-4" />
          </a>
        </div>

        {/* Copyright Text */}
        <p className="font-mono text-xs sm:text-sm text-[#9E9E9E] pt-2">
          &copy; All rights reserved by Mitul Kabir Badhon
        </p>
      </div>
    </footer>
  );
}
