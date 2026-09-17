"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Project, ApiResponse } from "@/types";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    // Fetch projects from documented endpoint and locate the project to edit
    api
      .get<ApiResponse<Project[]> | Project[]>("/projects", { auth: true })
      .then((res) => {
        if (!isMounted) return;

        let list: Project[] = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && "data" in res && Array.isArray(res.data)) {
          list = res.data;
        }

        const found = list.find((p) => p._id === id);
        if (found) {
          setProject(found);
        } else {
          setError("Project not found with the specified ID.");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        const msg = err instanceof ApiError ? err.message : "Failed to load project details.";
        setError(msg);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-[#9E9E9E]">
        <Loader2 className="size-6 animate-spin text-[#5DD62C] mb-2" />
        <span className="font-mono text-xs">Retrieving project record...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4 max-w-xl">
        <Alert variant="destructive" className="border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]">
          <AlertTitle className="font-semibold">Unable to Load Project</AlertTitle>
          <AlertDescription className="text-xs">
            {error || "Project record could not be found."}
          </AlertDescription>
        </Alert>
        <Link
          href="/admin/projects"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] hover:bg-[#2A2A2A]",
          })}
        >
          <ArrowLeft className="size-4 mr-1.5" />
          Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectForm mode="edit" initialData={project} />
    </div>
  );
}
