"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileDown, ArrowUpRight, Sparkles } from "lucide-react";
import { useSettings } from "@/context/settings-context";

interface NavRoute {
  label: string;
  href: string;
}

const NAV_ROUTES: NavRoute[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on route change during render (React recommended pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      // Auto focus close button for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2A2A2A] bg-[#0F0F0F]/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity / Monogram */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] focus-visible:rounded-md"
          aria-label="Portfolio Home"
        >
          <span className="flex size-9 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#202020] transition-colors group-hover:border-[#5DD62C]/60 group-hover:shadow-[0_0_12px_rgba(93,214,44,0.25)]">
            <span className="font-mono text-sm font-bold text-[#5DD62C]">MK</span>
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-[#F8F8F8] transition-colors group-hover:text-[#5DD62C]">
              Mitul Kabir
            </span>
            <span className="font-mono text-[10px] text-[#9E9E9E] flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-[#5DD62C] animate-pulse" />
              Full-Stack Eng
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-1 rounded-full border border-[#2A2A2A] bg-[#202020]/60 p-1.5 backdrop-blur-xs"
        >
          {NAV_ROUTES.map((route) => {
            const active = isRouteActive(route.href);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] ${
                  active
                    ? "bg-[#5DD62C]/15 text-[#5DD62C] shadow-[0_0_15px_rgba(93,214,44,0.15)]"
                    : "text-[#9E9E9E] hover:text-[#F8F8F8] hover:bg-[#2A2A2A]/50"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Items: Download CV CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Download CV CTA (Desktop & Mobile) */}
          <Link
            href="/cv"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-[#337418] bg-[#5DD62C] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:bg-[#5DD62C]/90 hover:shadow-[0_0_18px_rgba(93,214,44,0.35)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            aria-label="Download Curriculum Vitae"
          >
            <FileDown className="size-4 transition-transform group-hover:-translate-y-0.5" />
            <span className="tracking-wide">Download CV</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Open navigation menu"
            className="inline-flex md:hidden items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#202020] p-2 text-[#9E9E9E] hover:border-[#5DD62C]/50 hover:text-[#F8F8F8] transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-50 flex md:hidden"
        >
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Surface */}
          <div className="relative ml-auto flex w-full max-w-xs flex-col border-l border-[#2A2A2A] bg-[#0F0F0F] p-6 shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#5DD62C]" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#9E9E9E]">
                  Navigation
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="rounded-md p-1.5 text-[#9E9E9E] hover:bg-[#202020] hover:text-[#F8F8F8] transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav aria-label="Mobile Primary Navigation" className="flex flex-col gap-1 py-6">
              {NAV_ROUTES.map((route) => {
                const active = isRouteActive(route.href);
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-all ${
                      active
                        ? "bg-[#5DD62C]/10 text-[#5DD62C] font-semibold border-l-2 border-[#5DD62C]"
                        : "text-[#9E9E9E] hover:bg-[#202020] hover:text-[#F8F8F8]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{route.label}</span>
                    {active && <span className="size-1.5 rounded-full bg-[#5DD62C]" />}
                  </Link>
                );
              })}

              {/* Explicit CV Route Link in drawer */}
              <Link
                href="/cv"
                onClick={() => setMobileMenuOpen(false)}
                className={`mt-2 flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-all ${
                  pathname === "/cv"
                    ? "bg-[#5DD62C]/10 text-[#5DD62C] font-semibold border-l-2 border-[#5DD62C]"
                    : "text-[#9E9E9E] hover:bg-[#202020] hover:text-[#F8F8F8]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileDown className="size-4 text-[#5DD62C]" />
                  <span>Download CV</span>
                </div>
                <ArrowUpRight className="size-4 text-[#9E9E9E]" />
              </Link>
            </nav>

            {/* Drawer Footer Info */}
            <div className="mt-auto border-t border-[#2A2A2A] pt-4 text-xs text-[#9E9E9E] space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-[#5DD62C]" />
                <span className="font-mono">Available for projects</span>
              </div>
              <p className="text-[11px] text-[#9E9E9E]/80">
                {settings.contactEmail || "mitulkabirbadhon7@gmail.com"}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
