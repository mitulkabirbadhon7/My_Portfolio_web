"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileDown, ArrowUpRight } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Track scroll position past ~80px for sticky frosted glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle ESC key to close mobile menu & body scroll lock
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
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? "border-b border-[#2A2A2A] bg-[#0F0F0F]/85 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Sleek Brand Logo: MKB Emblem & Responsive Typography */}
        <Link
          href="/"
          className="group flex items-center gap-2 sm:gap-2.5 outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] focus-visible:rounded-lg px-1 py-0.5 min-w-0"
          aria-label="Mitul Kabir Badhon — Home"
        >
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#141414] transition-all duration-200 group-hover:border-[#5DD62C]/60 group-hover:shadow-[0_0_14px_rgba(93,214,44,0.25)]">
            <span className="font-mono text-xs font-bold tracking-tighter text-[#F8F8F8]">
              MK<span className="text-[#5DD62C]">B</span>
            </span>
            <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-[#5DD62C] shadow-[0_0_6px_rgba(93,214,44,0.8)]" />
          </div>
          <div className="flex items-center gap-1 font-sans font-bold text-xs sm:text-base tracking-tight whitespace-nowrap">
            <span className="text-[#F8F8F8]">Mitul Kabir</span>
            <span className="text-[#5DD62C]">Badhon</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_ROUTES.map((route) => {
            const active = isRouteActive(route.href);
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`group relative py-1 text-sm transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C] focus-visible:rounded-xs ${
                  active ? "text-[#F8F8F8] font-semibold" : "text-[#9E9E9E] hover:text-[#F8F8F8]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span>{route.label}</span>
                {/* Left-origin growing green underline */}
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-[#5DD62C] shadow-[0_0_8px_rgba(93,214,44,0.5)] transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left ${
                    active ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop & Mobile Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Outlined CV Button with Wipe-Up Green Fill */}
          <a
            href="/cv"
            download="Mitu_Kabir_Badhon_CV.pdf"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-[#337418] bg-[#202020] px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-[#5DD62C] transition-colors duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            aria-label="Download Curriculum Vitae"
          >
            {/* Wipe-in green background from bottom */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[#5DD62C] translate-y-full transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
            />
            {/* Button text and icon sitting above wiper */}
            <span className="relative z-10 flex items-center gap-1 sm:gap-1.5 transition-colors duration-200 group-hover:text-[#0F0F0F]">
              <FileDown className="size-3 sm:size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span>CV</span>
              <span className="hidden sm:inline">Download</span>
            </span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex md:hidden items-center justify-center rounded-md border border-[#2A2A2A] bg-[#202020] p-1.5 sm:p-2 text-[#F8F8F8] hover:border-[#5DD62C] hover:text-[#5DD62C] transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Clean Slide-Down Mobile Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="md:hidden border-b border-[#2A2A2A] bg-[#141414]/95 backdrop-blur-xl px-4 py-3 sm:px-6 sm:py-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          <div className="flex flex-col space-y-1">
            {NAV_ROUTES.map((route) => {
              const active = isRouteActive(route.href);
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm font-medium tracking-wide transition-colors duration-150 ${
                    active
                      ? "bg-[#202020] text-[#5DD62C] font-semibold"
                      : "text-[#9E9E9E] hover:bg-[#1A1A1A] hover:text-[#F8F8F8]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{route.label}</span>
                  {active && (
                    <span className="size-1.5 rounded-full bg-[#5DD62C] shadow-[0_0_6px_rgba(93,214,44,0.8)]" />
                  )}
                </Link>
              );
            })}

            <div className="pt-2.5 mt-1 border-t border-[#2A2A2A] flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 px-1">
              <a
                href="/cv"
                download="Mitu_Kabir_Badhon_CV.pdf"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#5DD62C] hover:underline"
              >
                <FileDown className="size-3" />
                <span>Download CV (PDF)</span>
              </a>

              <a
                href={`mailto:${settings.contactEmail || "mitulkabirbadhon7@gmail.com"}`}
                className="text-[11px] font-mono text-[#9E9E9E] hover:text-[#F8F8F8] truncate max-w-[200px]"
              >
                {settings.contactEmail || "mitulkabirbadhon7@gmail.com"}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
