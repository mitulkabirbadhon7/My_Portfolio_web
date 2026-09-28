"use client";

import React from "react";

/**
 * NoiseOverlay provides a very subtle SVG film-grain texture across the viewport.
 * Rendered at ultra-low opacity (< 0.035) to give tactile warmth without visual clutter.
 * Pointer events are disabled so all interactions pass through unhindered.
 */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.022] mix-blend-screen"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
