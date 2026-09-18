"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { Project } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Sparkles } from "lucide-react";

interface ProjectFormProps {
  initialData?: Project;
  mode: "create" | "edit";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(initialData?.slug));
  const [description, setDescription] = useState(initialData?.description || "");
  const [client, setClient] = useState(initialData?.client || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [techStackInput, setTechStackInput] = useState(
    initialData?.techStack ? initialData.techStack.join(", ") : ""
  );
  const [image, setImage] = useState(initialData?.image || "");
  const [demoUrl, setDemoUrl] = useState(initialData?.demoUrl || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repoUrl || "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (fieldErrors.title) {
      setFieldErrors((prev) => ({ ...prev, title: "" }));
    }

    // Auto-generate slug if not manually edited or if slug was empty
    if (!isSlugManuallyEdited || !slug.trim()) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value;
    setSlug(newSlug);

    if (!newSlug.trim()) {
      setIsSlugManuallyEdited(false);
    } else {
      setIsSlugManuallyEdited(true);
    }

    if (fieldErrors.slug) {
      setFieldErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleAutoSlug = () => {
    const generated = slugify(title);
    setSlug(generated);
    setIsSlugManuallyEdited(false);
    toast.info("Slug regenerated from title.");
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Project title is required.";
    }

    if (!slug.trim()) {
      errors.slug = "Project slug is required.";
    }

    if (!description.trim()) {
      errors.description = "Short description is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    // Prevent duplicate submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      client: client.trim(),
      content: content.trim(),
      techStack,
      image: image.trim(),
      demoUrl: demoUrl.trim(),
      repoUrl: repoUrl.trim(),
      isPublished,
    };

    try {
      if (mode === "create") {
        await api.post("/projects", payload, { auth: true });
        toast.success("Project created successfully!");
      } else {
        if (!initialData?._id) {
          throw new Error("Missing project ID for update operation.");
        }
        await api.put(`/projects/${initialData._id}`, payload, { auth: true });
        toast.success("Project updated successfully!");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        toast.error(err.message);
      } else if (err instanceof Error) {
        setFormError(err.message);
        toast.error(err.message);
      } else {
        setFormError("An unexpected error occurred while saving the project.");
        toast.error("Failed to save project.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 max-w-3xl">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-xs font-mono text-[#9E9E9E] hover:text-[#5DD62C] transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1" />
          Back to Projects
        </Link>
        <div className="font-mono text-xs uppercase tracking-wider text-[#5DD62C]">
          {mode === "create" ? "New Record" : `Editing: ${initialData?.slug}`}
        </div>
      </div>

      <Card className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#F8F8F8]">
            {mode === "create" ? "Create New Project" : "Edit Project Details"}
          </CardTitle>
          <CardDescription className="text-xs text-[#9E9E9E]">
            Fields are synchronized strictly with documented database models.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {formError && (
            <Alert variant="destructive" className="border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]">
              <AlertTitle className="text-xs font-semibold">Error Saving Project</AlertTitle>
              <AlertDescription className="text-xs text-[#EF4444]/90">
                {formError}
              </AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="project-title" className="text-xs font-medium text-[#F8F8F8]">
              Project Title <span className="text-[#5DD62C]">*</span>
            </Label>
            <Input
              id="project-title"
              name="title"
              value={title}
              disabled={isSubmitting}
              placeholder="e.g. Modern AI Portfolio Platform"
              onChange={handleTitleChange}
              aria-invalid={!!fieldErrors.title}
              aria-describedby={fieldErrors.title ? "project-title-error" : undefined}
              className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
            />
            {fieldErrors.title && (
              <p id="project-title-error" role="alert" className="text-xs text-[#EF4444]">
                {fieldErrors.title}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="project-slug" className="text-xs font-medium text-[#F8F8F8]">
                Unique Slug <span className="text-[#5DD62C]">*</span>
              </Label>
              <button
                type="button"
                onClick={handleAutoSlug}
                className="inline-flex items-center gap-1 text-xs font-mono text-[#5DD62C] hover:underline"
              >
                <Sparkles className="size-3" />
                Regenerate from Title
              </button>
            </div>
            <Input
              id="project-slug"
              name="slug"
              value={slug}
              disabled={isSubmitting}
              placeholder="e.g. modern-ai-portfolio-platform"
              onChange={handleSlugChange}
              aria-invalid={!!fieldErrors.slug}
              aria-describedby={fieldErrors.slug ? "project-slug-error" : undefined}
              className="font-mono text-xs border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
            />
            {fieldErrors.slug && (
              <p id="project-slug-error" role="alert" className="text-xs text-[#EF4444]">
                {fieldErrors.slug}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="project-description" className="text-xs font-medium text-[#F8F8F8]">
              Short Summary Description <span className="text-[#5DD62C]">*</span>
            </Label>
            <Textarea
              id="project-description"
              name="description"
              rows={3}
              value={description}
              disabled={isSubmitting}
              placeholder="Brief overview of project architecture and impact..."
              onChange={(e) => {
                setDescription(e.target.value);
                if (fieldErrors.description) {
                  setFieldErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              aria-invalid={!!fieldErrors.description}
              aria-describedby={fieldErrors.description ? "project-description-error" : undefined}
              className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
            />
            {fieldErrors.description && (
              <p id="project-description-error" role="alert" className="text-xs text-[#EF4444]">
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5">
            <Label htmlFor="project-techstack" className="text-xs font-medium text-[#F8F8F8]">
              Tech Stack <span className="text-xs text-[#9E9E9E] font-normal">(Comma-separated tags)</span>
            </Label>
            <Input
              id="project-techstack"
              name="techStack"
              value={techStackInput}
              disabled={isSubmitting}
              placeholder="Next.js, TypeScript, Tailwind CSS, Express, MongoDB"
              onChange={(e) => setTechStackInput(e.target.value)}
              className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
            />
          </div>

          {/* Client / Organization */}
          <div className="space-y-1.5">
            <Label htmlFor="project-client" className="text-xs font-medium text-[#F8F8F8]">
              Client / Organization <span className="text-xs text-[#9E9E9E] font-normal">(Optional, for Worldwide Clients tracking)</span>
            </Label>
            <Input
              id="project-client"
              name="client"
              value={client}
              disabled={isSubmitting}
              placeholder="e.g. Enterprise Client, FinTech Global, Acme Corp"
              onChange={(e) => setClient(e.target.value)}
              className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
            />
          </div>

          {/* URLs Grid: Image, Demo URL, Repo URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="project-image" className="text-xs font-medium text-[#F8F8F8]">
                Image URL
              </Label>
              <Input
                id="project-image"
                name="image"
                type="url"
                value={image}
                disabled={isSubmitting}
                placeholder="https://res.cloudinary.com/..."
                onChange={(e) => setImage(e.target.value)}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] text-xs focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="project-demourl" className="text-xs font-medium text-[#F8F8F8]">
                Demo URL
              </Label>
              <Input
                id="project-demourl"
                name="demoUrl"
                type="url"
                value={demoUrl}
                disabled={isSubmitting}
                placeholder="https://demo.example.com"
                onChange={(e) => setDemoUrl(e.target.value)}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] text-xs focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="project-repourl" className="text-xs font-medium text-[#F8F8F8]">
                Repository URL
              </Label>
              <Input
                id="project-repourl"
                name="repoUrl"
                type="url"
                value={repoUrl}
                disabled={isSubmitting}
                placeholder="https://github.com/..."
                onChange={(e) => setRepoUrl(e.target.value)}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] text-xs focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
              />
            </div>
          </div>

          {/* Content (Markdown) */}
          <div className="space-y-1.5">
            <Label htmlFor="project-content" className="text-xs font-medium text-[#F8F8F8]">
              Project Content <span className="text-xs text-[#9E9E9E] font-normal">(Optional Markdown / Detailed Story)</span>
            </Label>
            <Textarea
              id="project-content"
              name="content"
              rows={6}
              value={content}
              disabled={isSubmitting}
              placeholder="Detailed project background, technical decisions, and architecture diagrams..."
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-xs border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
            />
          </div>

          {/* Published Checkbox */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#2A2A2A]">
            <input
              id="project-published"
              name="isPublished"
              type="checkbox"
              checked={isPublished}
              disabled={isSubmitting}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="size-4 rounded border-[#2A2A2A] bg-[#0F0F0F] accent-[#5DD62C] cursor-pointer"
            />
            <Label htmlFor="project-published" className="text-xs text-[#F8F8F8] cursor-pointer">
              Publish project publicly <span className="text-[#9E9E9E]">(Visible on main portfolio)</span>
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-[#2A2A2A] pt-4">
          <Link
            href="/admin/projects"
            className={buttonVariants({
              variant: "outline",
              className: "border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] hover:bg-[#2A2A2A]",
            })}
          >
            Cancel
          </Link>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#5DD62C] font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90 focus-visible:ring-2 focus-visible:ring-[#5DD62C] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-[#0F0F0F] border-t-transparent" />
                Saving Project...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="size-4" />
                {mode === "create" ? "Create Project" : "Save Changes"}
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
