"use client";

import React, { useRef, useState, useEffect } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms delay
}

/**
 * ScrollReveal: Reveals elements with translateY(24px) -> 0 and opacity 0 -> 1
 * using IntersectionObserver with threshold: 0.15 and rootMargin: "0px 0px -10% 0px".
 * Animates ONCE and never re-animates on scroll up.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      setPrefersReduced(true);
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Animate once
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ${
        prefersReduced
          ? "opacity-100 transform-none"
          : "duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      } ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none"
      } ${className}`}
      style={{
        transitionDelay: prefersReduced ? "0ms" : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
