"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { Skill, ApiResponse } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Wrench,
  AlertCircle,
  Save,
  Sparkles,
} from "lucide-react";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add / Edit Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [proficiency, setProficiency] = useState<number>(80);
  const [icon, setIcon] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete Dialog state
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<ApiResponse<Skill[]> | Skill[]>("/skills");
      if (Array.isArray(res)) {
        setSkills(res);
      } else if (res && "data" in res && Array.isArray(res.data)) {
        setSkills(res.data);
      } else {
        setSkills([]);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load skills from server.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiResponse<Skill[]> | Skill[]>("/skills")
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res)) {
          setSkills(res);
        } else if (res && "data" in res && Array.isArray(res.data)) {
          setSkills(res.data);
        } else {
          setSkills([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof ApiError ? err.message : "Failed to load skills.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateDialog = () => {
    setEditingSkill(null);
    setName("");
    setCategory("");
    setProficiency(80);
    setIcon("");
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency);
    setIcon(skill.icon || "");
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Skill name is required.";
    }

    if (!category.trim()) {
      errors.category = "Category is required.";
    }

    if (proficiency < 1 || proficiency > 100 || isNaN(proficiency)) {
      errors.proficiency = "Proficiency must be a number between 1 and 100.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSaving) return;

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      category: category.trim(),
      proficiency: Number(proficiency),
      icon: icon.trim(),
    };

    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, payload, { auth: true });
        setSkills((prev) =>
          prev.map((s) => (s._id === editingSkill._id ? { ...s, ...payload } : s))
        );
        toast.success(`Skill "${name}" updated successfully.`);
      } else {
        const res = await api.post<ApiResponse<Skill> | Skill>("/skills", payload, { auth: true });
        const newSkill =
          res && "data" in res && res.data ? res.data : (res as Skill);
        if (newSkill?._id) {
          setSkills((prev) => [...prev, newSkill]);
        } else {
          // Re-fetch to ensure full object synchronization
          fetchSkills();
        }
        toast.success(`Skill "${name}" created successfully.`);
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save skill.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!skillToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await api.delete(`/skills/${skillToDelete._id}`, { auth: true });
      setSkills((prev) => prev.filter((s) => s._id !== skillToDelete._id));
      toast.success(`Skill "${skillToDelete.name}" deleted.`);
      setSkillToDelete(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete skill.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Group skills by category
  const categories = Array.from(new Set(skills.map((s) => s.category))).sort();

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8]">
            Skills Management
          </h1>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Configure technical competencies and categories displayed on the portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchSkills}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] hover:bg-[#2A2A2A]"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={openCreateDialog}
            size="sm"
            className="bg-[#5DD62C] font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90"
          >
            <Plus className="size-4 mr-1.5" />
            Add Skill
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm text-[#EF4444]">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 rounded-xl bg-[#202020] border border-[#2A2A2A] animate-pulse" />
          <div className="h-48 rounded-xl bg-[#202020] border border-[#2A2A2A] animate-pulse" />
        </div>
      ) : skills.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#202020] p-12 text-center">
          <div className="rounded-full bg-[#0F0F0F] p-4 text-[#9E9E9E] border border-[#2A2A2A] mb-3">
            <Wrench className="size-8" />
          </div>
          <h3 className="text-lg font-semibold text-[#F8F8F8]">No skills recorded</h3>
          <p className="text-sm text-[#9E9E9E] mt-1 max-w-sm">
            Add your technical capabilities, grouped by categories like Frontend, Backend, or Tools.
          </p>
          <Button
            onClick={openCreateDialog}
            className="mt-4 bg-[#5DD62C] font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90"
          >
            <Plus className="size-4 mr-1.5" />
            Add First Skill
          </Button>
        </div>
      ) : (
        /* Categorized Skills Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const catSkills = skills
              .filter((s) => s.category === cat)
              .sort((a, b) => b.proficiency - a.proficiency);

            return (
              <Card
                key={cat}
                className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] overflow-hidden"
              >
                <CardHeader className="border-b border-[#2A2A2A] bg-[#0F0F0F]/40 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-[#5DD62C]" />
                      <CardTitle className="text-base font-bold text-[#F8F8F8]">{cat}</CardTitle>
                    </div>
                    <span className="font-mono text-xs text-[#9E9E9E]">
                      {catSkills.length} {catSkills.length === 1 ? "skill" : "skills"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="divide-y divide-[#2A2A2A] p-0">
                  {catSkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-[#2A2A2A]/40"
                    >
                      <div className="space-y-1 flex-1 pr-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[#F8F8F8]">{skill.name}</span>
                          <span className="font-mono text-xs text-[#5DD62C]">
                            {skill.proficiency}%
                          </span>
                        </div>
                        {/* Proficiency Bar */}
                        <div className="h-1.5 w-full rounded-full bg-[#0F0F0F] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#5DD62C] transition-all"
                            style={{ width: `${Math.min(100, Math.max(0, skill.proficiency))}%` }}
                          />
                        </div>
                        {skill.icon && (
                          <span className="font-mono text-[10px] text-[#9E9E9E] block">
                            Icon: {skill.icon}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditDialog(skill)}
                          aria-label={`Edit ${skill.name}`}
                          className="text-[#9E9E9E] hover:text-[#5DD62C] hover:bg-[#2A2A2A]"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setSkillToDelete(skill)}
                          aria-label={`Delete ${skill.name}`}
                          className="text-[#9E9E9E] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Skill Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
          <form onSubmit={handleSaveSkill} noValidate>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#F8F8F8]">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#9E9E9E]">
                Configured with documented skill fields (name, category, proficiency, icon).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="skill-name" className="text-xs font-medium text-[#F8F8F8]">
                  Skill Name <span className="text-[#5DD62C]">*</span>
                </Label>
                <Input
                  id="skill-name"
                  value={name}
                  disabled={isSaving}
                  placeholder="e.g. TypeScript, React, Docker"
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                />
                {formErrors.name && (
                  <p role="alert" className="text-xs text-[#EF4444]">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skill-category" className="text-xs font-medium text-[#F8F8F8]">
                  Category <span className="text-[#5DD62C]">*</span>
                </Label>
                <Input
                  id="skill-category"
                  value={category}
                  disabled={isSaving}
                  placeholder="e.g. Frontend, Backend, DevOps, Tools"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (formErrors.category) setFormErrors((prev) => ({ ...prev, category: "" }));
                  }}
                  className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                />
                {formErrors.category && (
                  <p role="alert" className="text-xs text-[#EF4444]">
                    {formErrors.category}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="skill-proficiency" className="text-xs font-medium text-[#F8F8F8]">
                    Proficiency (1-100) <span className="text-[#5DD62C]">*</span>
                  </Label>
                  <span className="font-mono text-xs text-[#5DD62C]">{proficiency}%</span>
                </div>
                <Input
                  id="skill-proficiency"
                  type="number"
                  min={1}
                  max={100}
                  value={proficiency}
                  disabled={isSaving}
                  onChange={(e) => {
                    setProficiency(Number(e.target.value));
                    if (formErrors.proficiency) setFormErrors((prev) => ({ ...prev, proficiency: "" }));
                  }}
                  className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                />
                {formErrors.proficiency && (
                  <p role="alert" className="text-xs text-[#EF4444]">
                    {formErrors.proficiency}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="skill-icon" className="text-xs font-medium text-[#F8F8F8]">
                  Icon Class or URL
                </Label>
                <Input
                  id="skill-icon"
                  value={icon}
                  disabled={isSaving}
                  placeholder="e.g. devicon-typescript-plain or https://..."
                  onChange={(e) => setIcon(e.target.value)}
                  className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                />
              </div>
            </div>

            <DialogFooter className="border-t border-[#2A2A2A] pt-3">
              <DialogClose
                disabled={isSaving}
                className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-4 py-2 text-xs font-medium text-[#F8F8F8] hover:bg-[#2A2A2A]"
              >
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-[#5DD62C] px-4 py-2 text-xs font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90 disabled:opacity-50"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Save className="size-3.5" />
                    {editingSkill ? "Save Changes" : "Create Skill"}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!skillToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setSkillToDelete(null);
        }}
      >
        <DialogContent className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#F8F8F8]">
              Delete Skill
            </DialogTitle>
            <DialogDescription className="text-sm text-[#9E9E9E]">
              Are you sure you want to remove{" "}
              <strong className="text-[#F8F8F8]">&quot;{skillToDelete?.name}&quot;</strong>? This
              skill will be removed from your portfolio.
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
              {isDeleting ? "Deleting..." : "Delete Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
