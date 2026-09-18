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
          className="group flex items-center gap-2.5 sm:gap-3 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] focus-visible:rounded-md"
          aria-label="Portfolio Home"
        >
          <span className="flex size-9 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#202020] transition-colors group-hover:border-[#5DD62C]/60 group-hover:shadow-[0_0_12px_rgba(93,214,44,0.25)]">
            <span className="font-mono text-sm font-bold text-[#5DD62C]">MKB</span>
          </span>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-[#F8F8F8] transition-colors group-hover:text-[#5DD62C]">
            Badhon
          </span>
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
          <a
            href="/cv"
            download="Mitu_Kabir_Badhon_CV.pdf"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-[#337418] bg-[#5DD62C] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#0F0F0F] transition-all duration-200 hover:bg-[#5DD62C]/90 hover:shadow-[0_0_18px_rgba(93,214,44,0.35)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            aria-label="Download Curriculum Vitae"
          >
            <FileDown className="size-4 transition-transform group-hover:-translate-y-0.5" />
            <span className="tracking-wide">Download CV</span>
          </a>

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

      {/* Accessible Mobile Navigation Full-Screen Menu (Solid background) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-50 flex flex-col h-screen w-full bg-[#0a0a0a] p-6 sm:p-8 md:hidden overflow-y-auto animate-in fade-in duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-5">
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-[#5DD62C] animate-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#9E9E9E]">
                Navigation
              </span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="flex size-10 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#161616] text-[#9E9E9E] hover:border-[#5DD62C]/60 hover:text-[#F8F8F8] transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Mobile Nav Links - Large, bold, properly spaced */}
          <nav aria-label="Mobile Primary Navigation" className="flex flex-col gap-3 py-8 flex-1 justify-center">
            {NAV_ROUTES.map((route) => {
              const active = isRouteActive(route.href);
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-5 py-4 text-xl font-bold transition-all ${
                    active
                      ? "bg-[#5DD62C]/10 text-[#5DD62C] border-l-4 border-[#5DD62C]"
                      : "text-[#E0E0E0] hover:bg-[#161616] hover:text-[#5DD62C]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{route.label}</span>
                  {active && <span className="size-2 rounded-full bg-[#5DD62C]" />}
                </Link>
              );
            })}

            {/* Explicit CV Route Link in drawer */}
            <a
              href="/cv"
              download="Mitu_Kabir_Badhon_CV.pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 flex items-center justify-between rounded-xl border border-[#337418] bg-[#5DD62C] px-5 py-4 text-lg font-bold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 shadow-[0_0_20px_rgba(93,214,44,0.25)]"
            >
              <div className="flex items-center gap-3">
                <FileDown className="size-5" />
                <span>Download CV</span>
              </div>
              <ArrowUpRight className="size-5" />
            </a>
          </nav>

          {/* Drawer Footer Info */}
          <div className="border-t border-[#2A2A2A] pt-5 text-xs text-[#9E9E9E] space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-[#5DD62C]" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Available for new opportunities</span>
            </div>
            <p className="text-xs text-[#9E9E9E]/90 font-mono">
              {settings.contactEmail || "mitulkabirbadhon7@gmail.com"}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
