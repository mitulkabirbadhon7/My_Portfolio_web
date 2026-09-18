"use client";

import React from "react";

interface LaunchChatButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function LaunchChatButton({ children, className }: LaunchChatButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dispatch global custom event that ChatWidget listens to
    window.dispatchEvent(new CustomEvent("open-ai-chat"));

    // Also update window hash smoothly
    if (typeof window !== "undefined") {
      try {
        window.history.replaceState(null, "", "#chat");
      } catch {
        // Safe fallback
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label="Launch interactive AI assistant"
    >
      {children}
    </button>
  );
}
