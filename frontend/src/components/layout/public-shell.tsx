"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { CustomCursor } from "@/components/motion/custom-cursor";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Admin routes have their own dedicated sidebar and administrative header shell
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground relative w-full max-w-full overflow-x-clip selection:bg-[#5DD62C]/20 selection:text-[#5DD62C]">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main id="main-content" className="flex-1 w-full max-w-full overflow-x-clip">
        {children}
      </main>
      <Footer />
    </div>
  );
}
