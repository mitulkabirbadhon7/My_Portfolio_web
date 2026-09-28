"use client";

import React, { useRef, useState, useEffect } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // max offset in px, default 8
}

/**
 * MagneticButton: subtly attracts towards the cursor within ~8px on hover,
 * snapping back smoothly with expo-out easing upon mouseleave.
 * Only activates on fine pointer devices and respects prefers-reduced-motion.
 */
export function MagneticButton({
  children,
  className = "",
  strength = 8,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanHover(isFine && !isReduced);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    setPosition({
      x: deltaX * strength,
      y: deltaY * strength,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform ${
        isHovered
          ? "duration-100 ease-out"
          : "duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      } ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
}
