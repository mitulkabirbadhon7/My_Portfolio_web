"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Project, Skill, Settings, ApiResponse } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Wrench,
  FileCheck,
  Globe,
  ArrowUpRight,
  RefreshCw,
  Layers,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Manual refresh callback
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [projectsRes, skillsRes, settingsRes] = await Promise.all([
        api.get<ApiResponse<Project[]>>("/projects").catch(() => null),
        api.get<ApiResponse<Skill[]> | Skill[]>("/skills").catch(() => null),
        api.get<ApiResponse<Settings>>("/settings").catch(() => null),
      ]);

      if (projectsRes?.data && Array.isArray(projectsRes.data)) {
        setProjects(projectsRes.data);
      } else if (Array.isArray(projectsRes)) {
        setProjects(projectsRes as unknown as Project[]);
      }

      if (Array.isArray(skillsRes)) {
        setSkills(skillsRes);
      } else if (skillsRes && "data" in skillsRes && Array.isArray(skillsRes.data)) {
        setSkills(skillsRes.data);
      }

      if (settingsRes?.data) {
        setSettings(settingsRes.data);
      }
    } catch (err) {
      console.error("Error reloading dashboard metrics:", err);
      setError("Failed to load some metrics from the backend API.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load effect using asynchronous resolution
  useEffect(() => {
    let isMounted = true;

    Promise.all([
      api.get<ApiResponse<Project[]>>("/projects").catch(() => null),
      api.get<ApiResponse<Skill[]> | Skill[]>("/skills").catch(() => null),
      api.get<ApiResponse<Settings>>("/settings").catch(() => null),
    ])
      .then(([projectsRes, skillsRes, settingsRes]) => {
        if (!isMounted) return;

        if (projectsRes?.data && Array.isArray(projectsRes.data)) {
          setProjects(projectsRes.data);
        } else if (Array.isArray(projectsRes)) {
          setProjects(projectsRes as unknown as Project[]);
        }

        if (Array.isArray(skillsRes)) {
          setSkills(skillsRes);
        } else if (skillsRes && "data" in skillsRes && Array.isArray(skillsRes.data)) {
          setSkills(skillsRes.data);
        }

        if (settingsRes?.data) {
          setSettings(settingsRes.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error loading dashboard metrics:", err);
        setError("Failed to load some metrics from the backend API.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const publishedCount = projects.filter((p) => p.isPublished).length;
  const draftCount = projects.length - publishedCount;
  const categoriesCount = new Set(skills.map((s) => s.category)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#9E9E9E] mt-1">
            System status and portfolio metrics from documented API endpoints.
          </p>
        </div>
        <div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] hover:bg-[#2A2A2A] hover:border-[#337418]"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-3 text-xs text-[#EF4444]">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card className="border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] transition-all hover:border-[#337418]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase font-mono text-[#9E9E9E]">
                Total Projects
              </CardDescription>
              <FolderKanban className="size-4 text-[#5DD62C]" />
            </div>
            <CardTitle className="text-3xl font-bold text-[#F8F8F8]">
              {loading ? "..." : projects.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#9E9E9E]">
              <span className="text-[#5DD62C] font-semibold">{publishedCount}</span> published •{" "}
              <span className="text-[#9E9E9E]">{draftCount}</span> drafts
            </p>
          </CardContent>
        </Card>

        {/* Technical Skills */}
        <Card className="border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] transition-all hover:border-[#337418]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase font-mono text-[#9E9E9E]">
                Active Skills
              </CardDescription>
              <Wrench className="size-4 text-[#5DD62C]" />
            </div>
            <CardTitle className="text-3xl font-bold text-[#F8F8F8]">
              {loading ? "..." : skills.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#9E9E9E]">
              Across{" "}
              <span className="text-[#5DD62C] font-semibold">
                {loading ? "..." : categoriesCount}
              </span>{" "}
              technical categories
            </p>
          </CardContent>
        </Card>

        {/* CV Status */}
        <Card className="border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] transition-all hover:border-[#337418]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase font-mono text-[#9E9E9E]">
                Public Resume / CV
              </CardDescription>
              <FileCheck className="size-4 text-[#5DD62C]" />
            </div>
            <CardTitle className="text-xl font-bold text-[#F8F8F8]">
              {loading ? "..." : settings?.cvUrl ? "Active" : "Pending"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#9E9E9E] truncate">
              {settings?.cvUrl ? "Cloudinary asset linked" : "No document configured"}
            </p>
          </CardContent>
        </Card>

        {/* Portfolio Contact */}
        <Card className="border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] transition-all hover:border-[#337418]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs uppercase font-mono text-[#9E9E9E]">
                Contact Endpoint
              </CardDescription>
              <Globe className="size-4 text-[#5DD62C]" />
            </div>
            <CardTitle className="text-xl font-bold text-[#F8F8F8] truncate">
              {loading ? "..." : settings?.contactEmail ? "Configured" : "Unset"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#9E9E9E] truncate">
              {settings?.contactEmail || "Default owner email"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#202020] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="size-4 text-[#5DD62C]" />
          <h2 className="text-base font-semibold text-[#F8F8F8]">Quick Operations</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center justify-between rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-3 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#337418] hover:text-[#5DD62C]"
          >
            <span>Manage Projects</span>
            <ArrowUpRight className="size-4" />
          </Link>

          <Link
            href="/admin/skills"
            className="flex items-center justify-between rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-3 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#337418] hover:text-[#5DD62C]"
          >
            <span>Update Skills</span>
            <ArrowUpRight className="size-4" />
          </Link>

          <Link
            href="/admin/experiences"
            className="flex items-center justify-between rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-3 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#337418] hover:text-[#5DD62C]"
          >
            <span>Review Experience</span>
            <ArrowUpRight className="size-4" />
          </Link>

          <Link
            href="/admin/cv"
            className="flex items-center justify-between rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-3 text-sm font-medium text-[#F8F8F8] transition-colors hover:border-[#337418] hover:text-[#5DD62C]"
          >
            <span>Configure CV & Links</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
