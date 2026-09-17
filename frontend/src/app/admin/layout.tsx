"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Briefcase,
  FileText,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Skills", href: "/admin/skills", icon: Wrench },
  { name: "Experiences", href: "/admin/experiences", icon: Briefcase },
  { name: "CV Management", href: "/admin/cv", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, authenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Auth navigation protection: redirect unauthenticated users to /admin/login
  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }
    if (!loading && !authenticated) {
      router.replace("/admin/login");
    }
  }, [pathname, loading, authenticated, router]);

  // Public admin login page bypasses the protected shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Accessible loading skeleton while verifying auth
  if (loading) {
    return (
      <div
        role="status"
        aria-label="Verifying admin credentials"
        className="flex min-h-screen bg-[#0F0F0F] text-[#F8F8F8]"
      >
        <aside className="hidden md:flex w-64 flex-col border-r border-[#2A2A2A] bg-[#202020] p-4 space-y-4">
          <div className="h-8 w-3/4 rounded bg-[#2A2A2A] animate-pulse" />
          <div className="space-y-2 pt-4">
            <div className="h-10 rounded bg-[#2A2A2A] animate-pulse" />
            <div className="h-10 rounded bg-[#2A2A2A] animate-pulse" />
            <div className="h-10 rounded bg-[#2A2A2A] animate-pulse" />
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="h-16 border-b border-[#2A2A2A] bg-[#202020] px-6 flex items-center justify-between">
            <div className="h-6 w-32 rounded bg-[#2A2A2A] animate-pulse" />
            <div className="h-8 w-24 rounded bg-[#2A2A2A] animate-pulse" />
          </header>
          <main className="flex-1 p-6">
            <div className="h-32 rounded-xl bg-[#202020] border border-[#2A2A2A] animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  // If not authenticated, keep shell hidden while redirecting
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] text-[#9E9E9E]">
        Redirecting to login...
      </div>
    );
  }

  // If authenticated without admin role, block admin controls
  if (user?.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F0F0F] p-4 text-[#F8F8F8]">
        <div className="max-w-md w-full rounded-xl border border-[#EF4444]/30 bg-[#202020] p-6 text-center space-y-4">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-[#EF4444]/20 text-[#EF4444]">
            <ShieldAlert className="size-6" />
          </div>
          <h1 className="text-xl font-bold text-[#F8F8F8]">Access Denied</h1>
          <p className="text-sm text-[#9E9E9E]">
            Your account does not possess the administrative privileges required to access this portal.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => logout().then(() => router.replace("/admin/login"))}
              className="bg-[#EF4444] text-white hover:bg-[#EF4444]/90"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F0F0F] text-[#F8F8F8]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[#2A2A2A] bg-[#202020]">
        <div className="flex h-16 items-center gap-2 border-b border-[#2A2A2A] px-6">
          <span className="inline-block size-3 rounded-full bg-[#5DD62C] animate-pulse" />
          <span className="font-mono text-sm font-bold tracking-wider text-[#F8F8F8]">
            ADMIN PORTAL
          </span>
        </div>

        <nav aria-label="Admin Navigation" className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#5DD62C]/10 text-[#5DD62C] border-l-2 border-[#5DD62C]"
                    : "text-[#9E9E9E] hover:bg-[#2A2A2A] hover:text-[#F8F8F8]"
                }`}
              >
                <Icon className={`size-4 ${isActive ? "text-[#5DD62C]" : "text-[#9E9E9E]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#2A2A2A] p-4 text-xs text-[#9E9E9E]">
          <p className="font-mono">v1.0.0 • Production</p>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col border-r border-[#2A2A2A] bg-[#202020] p-4">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
              <div className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full bg-[#5DD62C]" />
                <span className="font-mono text-sm font-bold text-[#F8F8F8]">ADMIN PORTAL</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation"
                className="text-[#9E9E9E] hover:text-[#F8F8F8]"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav aria-label="Mobile Navigation" className="flex-1 space-y-1 pt-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? "bg-[#5DD62C]/10 text-[#5DD62C] border-l-2 border-[#5DD62C]"
                        : "text-[#9E9E9E] hover:bg-[#2A2A2A] hover:text-[#F8F8F8]"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#2A2A2A] bg-[#202020]/95 px-4 sm:px-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar menu"
              className="inline-flex md:hidden rounded-lg p-2 text-[#9E9E9E] hover:bg-[#2A2A2A] hover:text-[#F8F8F8]"
            >
              <Menu className="size-5" />
            </button>
            <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider text-[#9E9E9E]">
              Portfolio Control Surface
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-[#F8F8F8]">{user.name}</div>
              <div className="flex items-center justify-end gap-1.5">
                <span className="size-1.5 rounded-full bg-[#5DD62C]" />
                <span className="font-mono text-xs text-[#5DD62C] uppercase">{user.role}</span>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              size="sm"
              className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] hover:bg-[#2A2A2A] hover:text-[#EF4444] transition-colors"
            >
              <LogOut className="size-3.5 mr-1.5" />
              {isLoggingOut ? "Exiting..." : "Logout"}
            </Button>
          </div>
        </header>

        {/* Dynamic child view */}
        <main className="flex-1 bg-[#0F0F0F] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
