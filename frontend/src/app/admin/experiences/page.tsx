"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { Experience, ApiResponse } from "@/types";
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
  Briefcase,
  AlertCircle,
  Save,
  Calendar,
  X,
} from "lucide-react";

function formatDateForInput(dateVal?: string | null): string {
  if (!dateVal) return "";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

function formatDateDisplay(dateVal?: string | null): string {
  if (!dateVal) return "";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add / Edit Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<string[]>([""]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Delete Dialog state
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<ApiResponse<Experience[]> | Experience[]>("/experiences");
      if (Array.isArray(res)) {
        setExperiences(res);
      } else if (res && "data" in res && Array.isArray(res.data)) {
        setExperiences(res.data);
      } else {
        setExperiences([]);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load experiences from server.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiResponse<Experience[]> | Experience[]>("/experiences")
      .then((res) => {
        if (!isMounted) return;
        if (Array.isArray(res)) {
          setExperiences(res);
        } else if (res && "data" in res && Array.isArray(res.data)) {
          setExperiences(res.data);
        } else {
          setExperiences([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof ApiError ? err.message : "Failed to load experiences.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateDialog = () => {
    setEditingExperience(null);
    setCompany("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setCurrent(false);
    setBulletPoints([""]);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (exp: Experience) => {
    setEditingExperience(exp);
    setCompany(exp.company);
    setRole(exp.role);
    setStartDate(formatDateForInput(exp.startDate));
    setEndDate(formatDateForInput(exp.endDate));
    setCurrent(Boolean(exp.current));
    setBulletPoints(exp.description && exp.description.length > 0 ? [...exp.description] : [""]);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleAddBullet = () => {
    setBulletPoints((prev) => [...prev, ""]);
  };

  const handleRemoveBullet = (index: number) => {
    setBulletPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulletChange = (index: number, val: string) => {
    setBulletPoints((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!company.trim()) {
      errors.company = "Company / organization is required.";
    }

    if (!role.trim()) {
      errors.role = "Role / title is required.";
    }

    if (!startDate) {
      errors.startDate = "Start date is required.";
    }

    if (!current && !endDate) {
      errors.endDate = "End date is required unless currently working here.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSaving) return;

    setIsSaving(true);
    const cleanedDescription = bulletPoints.map((b) => b.trim()).filter(Boolean);

    const payload = {
      company: company.trim(),
      role: role.trim(),
      startDate: new Date(startDate).toISOString(),
      endDate: current ? null : endDate ? new Date(endDate).toISOString() : null,
      current,
      description: cleanedDescription,
    };

    try {
      if (editingExperience) {
        await api.put(`/experiences/${editingExperience._id}`, payload, { auth: true });
        setExperiences((prev) =>
          prev.map((item) =>
            item._id === editingExperience._id ? { ...item, ...payload } : item
          )
        );
        toast.success(`Experience at "${company}" updated.`);
      } else {
        const res = await api.post<ApiResponse<Experience> | Experience>(
          "/experiences",
          payload,
          { auth: true }
        );
        const newExp =
          res && "data" in res && res.data ? res.data : (res as Experience);
        if (newExp?._id) {
          setExperiences((prev) => [...prev, newExp]);
        } else {
          fetchExperiences();
        }
        toast.success(`Experience at "${company}" created.`);
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save experience.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!experienceToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await api.delete(`/experiences/${experienceToDelete._id}`, { auth: true });
      setExperiences((prev) => prev.filter((item) => item._id !== experienceToDelete._id));
      toast.success(`Experience at "${experienceToDelete.company}" deleted.`);
      setExperienceToDelete(null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete experience.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Sort experiences chronologically descending (most recent first)
  const sortedExperiences = [...experiences].sort((a, b) => {
    const timeA = new Date(a.startDate).getTime();
    const timeB = new Date(b.startDate).getTime();
    return timeB - timeA;
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8]">
            Experience & Career
          </h1>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Maintain your chronological work history, roles, and achievements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchExperiences}
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
            Add Experience
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
        <div className="space-y-4">
          <div className="h-32 rounded-xl bg-[#202020] border border-[#2A2A2A] animate-pulse" />
          <div className="h-32 rounded-xl bg-[#202020] border border-[#2A2A2A] animate-pulse" />
        </div>
      ) : sortedExperiences.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#202020] p-12 text-center">
          <div className="rounded-full bg-[#0F0F0F] p-4 text-[#9E9E9E] border border-[#2A2A2A] mb-3">
            <Briefcase className="size-8" />
          </div>
          <h3 className="text-lg font-semibold text-[#F8F8F8]">No experiences recorded</h3>
          <p className="text-sm text-[#9E9E9E] mt-1 max-w-sm">
            Record positions, career achievements, and responsibilities to populate your resume section.
          </p>
          <Button
            onClick={openCreateDialog}
            className="mt-4 bg-[#5DD62C] font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90"
          >
            <Plus className="size-4 mr-1.5" />
            Add First Experience
          </Button>
        </div>
      ) : (
        /* Chronological Timeline */
        <div className="relative border-l border-[#2A2A2A] ml-4 sm:ml-6 space-y-6">
          {sortedExperiences.map((exp) => {
            const startLabel = formatDateDisplay(exp.startDate);
            const endLabel = exp.current ? "Present" : formatDateDisplay(exp.endDate);

            return (
              <div key={exp._id} className="relative pl-6 sm:pl-8">
                {/* Timeline node */}
                <div
                  className={`absolute -left-1.5 top-1.5 size-3 rounded-full border-2 ${
                    exp.current
                      ? "border-[#5DD62C] bg-[#5DD62C] ring-4 ring-[#5DD62C]/20"
                      : "border-[#2A2A2A] bg-[#202020]"
                  }`}
                />

                <Card className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-bold text-[#F8F8F8]">
                            {exp.role}
                          </CardTitle>
                          {exp.current && (
                            <span className="inline-flex items-center rounded-full bg-[#5DD62C]/10 border border-[#5DD62C]/30 px-2 py-0.5 text-[10px] font-medium text-[#5DD62C]">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-[#5DD62C] mt-0.5">
                          {exp.company}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#9E9E9E]">
                          <Calendar className="size-3.5" />
                          <span>
                            {startLabel} — {endLabel}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEditDialog(exp)}
                            aria-label={`Edit ${exp.role}`}
                            className="text-[#9E9E9E] hover:text-[#5DD62C] hover:bg-[#2A2A2A]"
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setExperienceToDelete(exp)}
                            aria-label={`Delete ${exp.role}`}
                            className="text-[#9E9E9E] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {exp.description && exp.description.length > 0 && (
                    <CardContent className="pt-2">
                      <ul className="list-disc list-inside space-y-1 text-xs text-[#9E9E9E] marker:text-[#5DD62C]">
                        {exp.description.map((bullet, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Experience Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
          <form onSubmit={handleSaveExperience} noValidate>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-[#F8F8F8]">
                {editingExperience ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#9E9E9E]">
                Documented fields: company, role, dates, current flag, and bullet description.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 max-h-[65vh] overflow-y-auto pr-1">
              <div className="space-y-1.5">
                <Label htmlFor="exp-company" className="text-xs font-medium text-[#F8F8F8]">
                  Company / Organization <span className="text-[#5DD62C]">*</span>
                </Label>
                <Input
                  id="exp-company"
                  value={company}
                  disabled={isSaving}
                  placeholder="e.g. Acme Innovations Corp"
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (formErrors.company) setFormErrors((prev) => ({ ...prev, company: "" }));
                  }}
                  className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                />
                {formErrors.company && (
                  <p role="alert" className="text-xs text-[#EF4444]">
                    {formErrors.company}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="exp-role" className="text-xs font-medium text-[#F8F8F8]">
                  Role / Position Title <span className="text-[#5DD62C]">*</span>
                </Label>
                <Input
                  id="exp-role"
                  value={role}
                  disabled={isSaving}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (formErrors.role) setFormErrors((prev) => ({ ...prev, role: "" }));
                  }}
                  className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                />
                {formErrors.role && (
                  <p role="alert" className="text-xs text-[#EF4444]">
                    {formErrors.role}
                  </p>
                )}
              </div>

              {/* Current Role Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="exp-current"
                  type="checkbox"
                  checked={current}
                  disabled={isSaving}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setCurrent(isChecked);
                    if (isChecked) {
                      setEndDate(""); // Clear end date per API contract
                      if (formErrors.endDate) setFormErrors((prev) => ({ ...prev, endDate: "" }));
                    }
                  }}
                  className="size-4 rounded border-[#2A2A2A] bg-[#0F0F0F] accent-[#5DD62C] cursor-pointer"
                />
                <Label htmlFor="exp-current" className="text-xs text-[#F8F8F8] cursor-pointer">
                  I currently work here
                </Label>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="exp-startdate" className="text-xs font-medium text-[#F8F8F8]">
                    Start Date <span className="text-[#5DD62C]">*</span>
                  </Label>
                  <Input
                    id="exp-startdate"
                    type="date"
                    value={startDate}
                    disabled={isSaving}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (formErrors.startDate)
                        setFormErrors((prev) => ({ ...prev, startDate: "" }));
                    }}
                    className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-xs focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                  />
                  {formErrors.startDate && (
                    <p role="alert" className="text-xs text-[#EF4444]">
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="exp-enddate"
                    className={`text-xs font-medium ${
                      current ? "text-[#9E9E9E]" : "text-[#F8F8F8]"
                    }`}
                  >
                    End Date {!current && <span className="text-[#5DD62C]">*</span>}
                  </Label>
                  <Input
                    id="exp-enddate"
                    type="date"
                    value={endDate}
                    disabled={current || isSaving}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (formErrors.endDate) setFormErrors((prev) => ({ ...prev, endDate: "" }));
                    }}
                    className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-xs disabled:opacity-40 focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                  />
                  {formErrors.endDate && (
                    <p role="alert" className="text-xs text-[#EF4444]">
                      {formErrors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Multi-bullet Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-[#F8F8F8]">
                    Key Achievements & Responsibilities
                  </Label>
                  <button
                    type="button"
                    onClick={handleAddBullet}
                    className="text-xs font-mono text-[#5DD62C] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="size-3" />
                    Add Bullet
                  </button>
                </div>

                <div className="space-y-2">
                  {bulletPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={point}
                        disabled={isSaving}
                        placeholder={`Achievement ${index + 1}...`}
                        onChange={(e) => handleBulletChange(index, e.target.value)}
                        className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-xs focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                      />
                      {bulletPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(index)}
                          aria-label={`Remove achievement bullet ${index + 1}`}
                          className="text-[#9E9E9E] hover:text-[#EF4444] p-1"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                    {editingExperience ? "Save Changes" : "Create Experience"}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!experienceToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setExperienceToDelete(null);
        }}
      >
        <DialogContent className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#F8F8F8]">
              Delete Experience Record
            </DialogTitle>
            <DialogDescription className="text-sm text-[#9E9E9E]">
              Are you sure you want to remove{" "}
              <strong className="text-[#F8F8F8]">
                &quot;{experienceToDelete?.role} at {experienceToDelete?.company}&quot;
              </strong>
              ? This record will be permanently deleted from the database.
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
              {isDeleting ? "Deleting..." : "Delete Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
