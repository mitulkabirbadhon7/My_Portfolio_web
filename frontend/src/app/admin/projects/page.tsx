"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { Project, ApiResponse } from "@/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  FolderKanban,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete dialog state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Authenticated call retrieves all projects (both published and drafts)
      const res = await api.get<ApiResponse<Project[]> | Project[]>("/projects", { auth: true });

      if (Array.isArray(res)) {
        setProjects(res);
      } else if (res && "data" in res && Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Your session has expired. Please re-authenticate.");
        } else {
          setError(err.message || "Failed to load projects from server.");
        }
      } else {
        setError("Network error: Unable to connect to backend service.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiResponse<Project[]> | Project[]>("/projects", { auth: true })
      .then((res) => {
        if (!isMounted) return;

        if (Array.isArray(res)) {
          setProjects(res);
        } else if (res && "data" in res && Array.isArray(res.data)) {
          setProjects(res.data);
        } else {
          setProjects([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err instanceof ApiError) {
          setError(err.message || "Failed to load projects.");
        } else {
          setError("Network error: Unable to connect to backend service.");
        }
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/projects/${projectToDelete._id}`, { auth: true });
      setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
      toast.success(`Project "${projectToDelete.title}" was deleted successfully.`);
      setProjectToDelete(null);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete project. Please try again.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8]">
            Projects Management
          </h1>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Manage, publish, and curate portfolio projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchProjects}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] hover:bg-[#2A2A2A] hover:border-[#337418]"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Link
            href="/admin/projects/new"
            className={buttonVariants({
              size: "sm",
              className: "bg-[#5DD62C] font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90",
            })}
          >
            <Plus className="size-4 mr-1.5" />
            Create New Project
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm text-[#EF4444]">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Data Table / List */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#202020] overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <div className="h-6 w-48 rounded bg-[#2A2A2A] animate-pulse" />
            <div className="space-y-2">
              <div className="h-12 rounded bg-[#2A2A2A]/50 animate-pulse" />
              <div className="h-12 rounded bg-[#2A2A2A]/50 animate-pulse" />
              <div className="h-12 rounded bg-[#2A2A2A]/50 animate-pulse" />
            </div>
          </div>
        ) : projects.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-[#0F0F0F] p-4 text-[#9E9E9E] border border-[#2A2A2A] mb-3">
              <FolderKanban className="size-8" />
            </div>
            <h3 className="text-lg font-semibold text-[#F8F8F8]">No projects found</h3>
            <p className="text-sm text-[#9E9E9E] mt-1 max-w-sm">
              You haven&apos;t created any portfolio projects yet. Click below to add your first project.
            </p>
            <Link
              href="/admin/projects/new"
              className={buttonVariants({
                className: "mt-4 bg-[#5DD62C] font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90",
              })}
            >
              <Plus className="size-4 mr-1.5" />
              Create New Project
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#0F0F0F]/60 border-b border-[#2A2A2A]">
              <TableRow className="border-[#2A2A2A] hover:bg-transparent">
                <TableHead className="text-xs font-mono uppercase text-[#9E9E9E] px-4 py-3">
                  Project
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-[#9E9E9E] px-4 py-3">
                  Tech Stack
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-[#9E9E9E] px-4 py-3">
                  Status
                </TableHead>
                <TableHead className="text-xs font-mono uppercase text-[#9E9E9E] px-4 py-3">
                  Created
                </TableHead>
                <TableHead className="text-right text-xs font-mono uppercase text-[#9E9E9E] px-4 py-3">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project._id}
                  className="border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]/40"
                >
                  {/* Title & Slug */}
                  <TableCell className="px-4 py-3 align-top">
                    <div className="font-medium text-[#F8F8F8]">{project.title}</div>
                    <div className="font-mono text-xs text-[#9E9E9E] mt-0.5">/{project.slug}</div>
                  </TableCell>

                  {/* Tech Stack */}
                  <TableCell className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {project.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-md bg-[#0F0F0F] border border-[#2A2A2A] px-2 py-0.5 text-xs font-mono text-[#F8F8F8]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3 align-top">
                    {project.isPublished ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5DD62C]/40 bg-[#5DD62C]/10 px-2.5 py-0.5 text-xs font-medium text-[#5DD62C]">
                        <span className="size-1.5 rounded-full bg-[#5DD62C]" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2A2A2A] bg-[#0F0F0F] px-2.5 py-0.5 text-xs font-medium text-[#9E9E9E]">
                        <span className="size-1.5 rounded-full bg-[#9E9E9E]" />
                        Draft
                      </span>
                    )}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="px-4 py-3 align-top font-mono text-xs text-[#9E9E9E]">
                    {new Date(project.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 text-right align-top">
                    <div className="flex items-center justify-end gap-1.5">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View live demo of ${project.title}`}
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon-sm",
                            className: "text-[#9E9E9E] hover:text-[#F8F8F8] hover:bg-[#2A2A2A]",
                          })}
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}

                      <Link
                        href={`/admin/projects/edit/${project._id}`}
                        aria-label={`Edit ${project.title}`}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "icon-sm",
                          className: "text-[#9E9E9E] hover:text-[#5DD62C] hover:bg-[#2A2A2A]",
                        })}
                      >
                        <Edit className="size-4" />
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setProjectToDelete(project)}
                        aria-label={`Delete ${project.title}`}
                        className="text-[#9E9E9E] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!projectToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setProjectToDelete(null);
          }
        }}
      >
        <DialogContent className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#F8F8F8]">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-sm text-[#9E9E9E]">
              Are you sure you want to delete{" "}
              <strong className="text-[#F8F8F8]">&quot;{projectToDelete?.title}&quot;</strong>?
              This action cannot be undone and will permanently remove this project from the database.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <DialogClose
              disabled={isDeleting}
              className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-4 py-2 text-sm font-medium text-[#F8F8F8] hover:bg-[#2A2A2A]"
            >
              Cancel
            </DialogClose>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="rounded-lg bg-[#EF4444] px-4 py-2 text-sm font-semibold text-white hover:bg-[#EF4444]/90 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
