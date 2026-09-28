"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * CustomCursor: Desktop-only custom cursor with:
 * - 8px inner dot that tracks cursor position
 * - 32px outer outlined ring that follows with slight lag
 * - Scales to 1.6x and shifts border to accent green when hovering interactive elements
 * - Completely disabled on touch devices and when prefers-reduced-motion is active
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on non-touch devices with fine pointer and no reduced-motion preference
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if current target or parent is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest(
            "a, button, input, textarea, select, [role='button'], .link-editorial, [tabindex]:not([tabindex='-1'])"
          )
        );
        setIsInteractive(interactive);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Render loop for ring lag
    const render = () => {
      // Linear interpolation for smooth trailing ring
      const factor = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * factor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * factor;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${
          isInteractive ? 1.6 : 1
        })`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible, isInteractive]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 8px Inner Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 size-2 rounded-full transition-colors duration-150 ${
          isInteractive ? "bg-[#5DD62C]" : "bg-[#F8F8F8]"
        }`}
        style={{ willChange: "transform" }}
      />

      {/* 32px Outer Ring with Lag */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 size-8 rounded-full border transition-[border-color,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isInteractive
            ? "border-[#5DD62C] bg-[#5DD62C]/15 shadow-[0_0_12px_rgba(93,214,44,0.35)]"
            : "border-[#F8F8F8]/30 bg-transparent"
        }`}
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
