"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Ensure viewport begins at top on route change unless an anchor hash is specified
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <>
      {/* Route Handshake Telemetry Bar (Fast Cyber Sweep) keyed to pathname */}
      <div
        key={`telemetry-${pathname}`}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-[#5DD62C] shadow-[0_0_10px_rgba(93,214,44,0.9)] animate-route-telemetry pointer-events-none"
      />

      {/* Page Content with Snappy GPU-accelerated Entry */}
      <div key={pathname} className="animate-page-enter w-full max-w-full">
        {children}
      </div>
    </>
  );
}
