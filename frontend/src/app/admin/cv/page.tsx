"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { Settings, ApiResponse } from "@/types";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSettings } from "@/context/settings-context";
import {
  FileText,
  Upload,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileCheck,
  ImageIcon,
  User,
  GraduationCap,
  Building,
  School,
  PenTool,
  X,
} from "lucide-react";

type ImageFieldKey =
  | "homeProfileImage"
  | "aboutProfileImage"
  | "universityImage"
  | "collegeImage"
  | "schoolImage"
  | "signatureImage";

interface ImageConfig {
  key: ImageFieldKey;
  label: string;
  description: string;
  location: string;
  icon: React.ComponentType<{ className?: string }>;
}

const IMAGE_CONFIGS: ImageConfig[] = [
  {
    key: "homeProfileImage",
    label: "Home Page Profile Picture",
    description: "Main profile portrait shown in the hero section profile card.",
    location: "Home Page (/) • Hero Profile Card",
    icon: User,
  },
  {
    key: "aboutProfileImage",
    label: "About Page Profile Picture",
    description: "Bio photo featured at the top of the About page.",
    location: "About Page (/about) • Bio Section",
    icon: User,
  },
  {
    key: "signatureImage",
    label: "Signature Picture",
    description: "Your official signature picture displayed inside the Credentials card.",
    location: "Home Page (/) • Credentials / Signature Card",
    icon: PenTool,
  },
  {
    key: "universityImage",
    label: "University Image",
    description: "Campus or degree emblem for your University milestone.",
    location: "About Page (/about) • Career Timeline (University)",
    icon: GraduationCap,
  },
  {
    key: "collegeImage",
    label: "College Image",
    description: "Campus photo or logo for your College / Higher Secondary milestone.",
    location: "About Page (/about) • Career Timeline (College)",
    icon: Building,
  },
  {
    key: "schoolImage",
    label: "School Image",
    description: "Campus photo or logo for your School / Secondary milestone.",
    location: "About Page (/about) • Career Timeline (School)",
    icon: School,
  },
];

export default function AdminSettingsAndCVPage() {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings form state
  const [contactEmail, setContactEmail] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [clientsWorldwide, setClientsWorldwide] = useState("+12");

  // Educational Milestones state
  const [universityName, setUniversityName] = useState("");
  const [universityDegree, setUniversityDegree] = useState("");
  const [universityResult, setUniversityResult] = useState("");
  const [universityYear, setUniversityYear] = useState("");

  const [collegeName, setCollegeName] = useState("");
  const [collegeDegree, setCollegeDegree] = useState("");
  const [collegeResult, setCollegeResult] = useState("");
  const [collegeYear, setCollegeYear] = useState("");

  const [schoolName, setSchoolName] = useState("");
  const [schoolDegree, setSchoolDegree] = useState("");
  const [schoolResult, setSchoolResult] = useState("");
  const [schoolYear, setSchoolYear] = useState("");

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // CV Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Image Upload state
  const [selectedImages, setSelectedImages] = useState<Record<ImageFieldKey, File | null>>({
    homeProfileImage: null,
    aboutProfileImage: null,
    signatureImage: null,
    universityImage: null,
    collegeImage: null,
    schoolImage: null,
  });
  const [imagePreviews, setImagePreviews] = useState<Record<ImageFieldKey, string | null>>({
    homeProfileImage: null,
    aboutProfileImage: null,
    signatureImage: null,
    universityImage: null,
    collegeImage: null,
    schoolImage: null,
  });
  const [imageErrors, setImageErrors] = useState<Record<ImageFieldKey, string | null>>({
    homeProfileImage: null,
    aboutProfileImage: null,
    signatureImage: null,
    universityImage: null,
    collegeImage: null,
    schoolImage: null,
  });
  const [uploadingImageKey, setUploadingImageKey] = useState<ImageFieldKey | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<ApiResponse<Settings>>("/settings");
      if (res?.data) {
        setSettings(res.data);
        setContactEmail(res.data.contactEmail || "");
        setGithubUrl(res.data.githubUrl || "");
        setLinkedinUrl(res.data.linkedinUrl || "");
        setFacebookUrl(res.data.facebookUrl || "");
        setInstagramUrl(res.data.instagramUrl || "");
        setClientsWorldwide(res.data.clientsWorldwide || "+12");

        setUniversityName(res.data.universityName || "American International University-Bangladesh (AIUB)");
        setUniversityDegree(res.data.universityDegree || "B.Sc. in Computer Science & Engineering");
        setUniversityResult(res.data.universityResult || "CGPA 3.85 / 4.00");
        setUniversityYear(res.data.universityYear || "2020 – 2024");

        setCollegeName(res.data.collegeName || "Higher Secondary College");
        setCollegeDegree(res.data.collegeDegree || "Higher Secondary Certificate (HSC) • Science");
        setCollegeResult(res.data.collegeResult || "GPA 5.00 / 5.00");
        setCollegeYear(res.data.collegeYear || "2017 – 2019");

        setSchoolName(res.data.schoolName || "Secondary High School");
        setSchoolDegree(res.data.schoolDegree || "Secondary School Certificate (SSC) • Science");
        setSchoolResult(res.data.schoolResult || "GPA 5.00 / 5.00");
        setSchoolYear(res.data.schoolYear || "2015 – 2017");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiResponse<Settings>>("/settings")
      .then((res) => {
        if (!isMounted) return;
        if (res?.data) {
          setSettings(res.data);
          setContactEmail(res.data.contactEmail || "");
          setGithubUrl(res.data.githubUrl || "");
          setLinkedinUrl(res.data.linkedinUrl || "");
          setFacebookUrl(res.data.facebookUrl || "");
          setInstagramUrl(res.data.instagramUrl || "");
          setClientsWorldwide(res.data.clientsWorldwide || "+12");

          setUniversityName(res.data.universityName || "American International University-Bangladesh (AIUB)");
          setUniversityDegree(res.data.universityDegree || "B.Sc. in Computer Science & Engineering");
          setUniversityResult(res.data.universityResult || "CGPA 3.85 / 4.00");
          setUniversityYear(res.data.universityYear || "2020 – 2024");

          setCollegeName(res.data.collegeName || "Higher Secondary College");
          setCollegeDegree(res.data.collegeDegree || "Higher Secondary Certificate (HSC) • Science");
          setCollegeResult(res.data.collegeResult || "GPA 5.00 / 5.00");
          setCollegeYear(res.data.collegeYear || "2017 – 2019");

          setSchoolName(res.data.schoolName || "Secondary High School");
          setSchoolDegree(res.data.schoolDegree || "Secondary School Certificate (SSC) • Science");
          setSchoolResult(res.data.schoolResult || "GPA 5.00 / 5.00");
          setSchoolYear(res.data.schoolYear || "2015 – 2017");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof ApiError ? err.message : "Failed to load settings.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = files[0];

    // Client-side validation: PDF only
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setFileError("Invalid format. Only PDF files are accepted for CV uploads.");
      setSelectedFile(null);
      return;
    }

    // Client-side validation: 5MB ceiling from documented upload limits
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileError("File exceeds the maximum allowed size of 5 MB.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleImageSelect = (key: ImageFieldKey, e: React.ChangeEvent<HTMLInputElement>) => {
    setImageErrors((prev) => ({ ...prev, [key]: null }));
    const files = e.target.files;
    if (!files || files.length === 0) {
      setSelectedImages((prev) => ({ ...prev, [key]: null }));
      setImagePreviews((prev) => ({ ...prev, [key]: null }));
      return;
    }

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setImageErrors((prev) => ({
        ...prev,
        [key]: "Invalid file format. Please upload an image (PNG, JPEG, WebP, GIF, SVG, AVIF).",
      }));
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setImageErrors((prev) => ({
        ...prev,
        [key]: "Image exceeds maximum allowed size of 5 MB.",
      }));
      return;
    }

    setSelectedImages((prev) => ({ ...prev, [key]: file }));
    const objectUrl = URL.createObjectURL(file);
    setImagePreviews((prev) => ({ ...prev, [key]: objectUrl }));
  };

  const handleClearSelectedImage = (key: ImageFieldKey) => {
    setSelectedImages((prev) => ({ ...prev, [key]: null }));
    setImagePreviews((prev) => ({ ...prev, [key]: null }));
    setImageErrors((prev) => ({ ...prev, [key]: null }));
    const input = document.getElementById(`image-input-${key}`) as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleUploadImage = async (key: ImageFieldKey) => {
    const file = selectedImages[key];
    if (!file || uploadingImageKey) return;

    setUploadingImageKey(key);
    setImageErrors((prev) => ({ ...prev, [key]: null }));

    try {
      const formData = new FormData();
      formData.append(key, file);

      const res = await api.post<ApiResponse<Settings>>("/settings/images", formData, {
        auth: true,
      });

      if (res?.data) {
        setSettings(res.data);
        await refreshSettings();
        toast.success(`Image asset uploaded and synchronized successfully.`);
        handleClearSelectedImage(key);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to upload image asset.";
      setImageErrors((prev) => ({ ...prev, [key]: msg }));
      toast.error(msg);
    } finally {
      setUploadingImageKey(null);
    }
  };

  const handleUploadCV = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setFileError(null);

    try {
      const formData = new FormData();
      // Documented multipart form field name is 'cv'
      formData.append("cv", selectedFile);

      const res = await api.post<ApiResponse<Settings>>("/settings/cv", formData, {
        auth: true,
      });

      if (res?.data?.cvUrl) {
        setSettings(res.data);
        toast.success("CV uploaded successfully and synchronized with Cloudinary.");
        setSelectedFile(null);
        // Reset file input
        const input = document.getElementById("cv-file-input") as HTMLInputElement;
        if (input) input.value = "";
      } else {
        fetchSettings();
        toast.success("CV upload completed.");
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to upload CV file.";
      setFileError(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingSettings) return;

    setIsSavingSettings(true);
    try {
      const payload = {
        contactEmail: contactEmail.trim(),
        githubUrl: githubUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        facebookUrl: facebookUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        clientsWorldwide: clientsWorldwide.trim(),
        universityName: universityName.trim(),
        universityDegree: universityDegree.trim(),
        universityResult: universityResult.trim(),
        universityYear: universityYear.trim(),
        collegeName: collegeName.trim(),
        collegeDegree: collegeDegree.trim(),
        collegeResult: collegeResult.trim(),
        collegeYear: collegeYear.trim(),
        schoolName: schoolName.trim(),
        schoolDegree: schoolDegree.trim(),
        schoolResult: schoolResult.trim(),
        schoolYear: schoolYear.trim(),
      };

      const res = await api.put<ApiResponse<Settings>>("/settings", payload, {
        auth: true,
      });

      if (res?.data) {
        setSettings(res.data);
      }
      toast.success("Portfolio settings updated successfully.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div className="h-8 w-48 rounded bg-[#202020] animate-pulse" />
        <div className="h-48 rounded-xl bg-[#202020] border border-[#2A2A2A] animate-pulse" />
        <div className="h-48 rounded-xl bg-[#202020] border border-[#2A2A2A] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F8F8F8]">
            Settings &amp; CV Management
          </h1>
          <p className="text-sm text-[#9E9E9E] mt-1">
            Configure global portfolio contact points and manage your public CV document.
          </p>
        </div>

        <Button
          onClick={fetchSettings}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] hover:bg-[#2A2A2A]"
        >
          <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-sm text-[#EF4444]">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CV Upload Section */}
      <Card className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-[#5DD62C]" />
              <CardTitle className="text-lg font-bold text-[#F8F8F8]">Curriculum Vitae (CV)</CardTitle>
            </div>
            {settings?.cvUrl ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5DD62C]/30 bg-[#5DD62C]/10 px-2.5 py-0.5 text-xs font-mono text-[#5DD62C]">
                <CheckCircle2 className="size-3" />
                Configured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2A2A2A] bg-[#0F0F0F] px-2.5 py-0.5 text-xs font-mono text-[#9E9E9E]">
                No CV Uploaded
              </span>
            )}
          </div>
          <CardDescription className="text-xs text-[#9E9E9E]">
            Upload your professional resume as a PDF. Document is stored securely and streamed to visitors.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current CV status */}
          {settings?.cvUrl && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] p-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileCheck className="size-4 text-[#5DD62C] shrink-0" />
                <span className="truncate font-mono text-[#9E9E9E]">{settings.cvUrl}</span>
              </div>
              <a
                href={settings.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#5DD62C] hover:underline shrink-0"
              >
                <span>View Current PDF</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          )}

          {/* Upload Form */}
          <form onSubmit={handleUploadCV} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="cv-file-input" className="text-xs font-medium text-[#F8F8F8]">
                Select PDF File <span className="text-[#9E9E9E] font-normal">(Max 5 MB)</span>
              </Label>
              <Input
                id="cv-file-input"
                name="cv"
                type="file"
                accept="application/pdf"
                disabled={isUploading}
                onChange={handleFileSelect}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-xs file:border-0 file:bg-[#202020] file:text-[#F8F8F8] file:text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:cursor-pointer"
              />
            </div>

            {fileError && (
              <Alert variant="destructive" className="border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444] py-2">
                <AlertDescription className="text-xs">{fileError}</AlertDescription>
              </Alert>
            )}

            {selectedFile && !fileError && (
              <div className="flex items-center justify-between rounded-md bg-[#0F0F0F] border border-[#2A2A2A] p-2 text-xs font-mono text-[#9E9E9E]">
                <span>{selectedFile.name}</span>
                <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="bg-[#5DD62C] font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90 disabled:opacity-50"
            >
              {isUploading ? (
                <span className="flex items-center gap-1.5">
                  <span className="size-3.5 animate-spin rounded-full border-2 border-[#0F0F0F] border-t-transparent" />
                  Uploading CV...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Upload className="size-3.5" />
                  Upload PDF to Cloudinary
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Website Section & Profile Images Section */}
      <Card className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="size-5 text-[#5DD62C]" />
              <CardTitle className="text-lg font-bold text-[#F8F8F8]">
                Website Section &amp; Profile Images
              </CardTitle>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2A2A2A] bg-[#0F0F0F] px-2.5 py-0.5 text-xs font-mono text-[#9E9E9E]">
              5 Configurable Assets
            </span>
          </div>
          <CardDescription className="text-xs text-[#9E9E9E]">
            Upload customized portraits, campus emblems, and institutional graphics for different sections across the portfolio.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {IMAGE_CONFIGS.map((item) => {
              const currentCloudinaryUrl = settings ? (settings[item.key] as string | undefined) : undefined;
              const localPreviewUrl = imagePreviews[item.key];
              const displayUrl = localPreviewUrl || currentCloudinaryUrl;
              const isSelected = !!selectedImages[item.key];
              const isUploadingThis = uploadingImageKey === item.key;
              const errorForThis = imageErrors[item.key];
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4 space-y-3 transition-colors hover:border-[#337418]/60"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-[#5DD62C]" />
                        <h3 className="text-sm font-bold text-[#F8F8F8]">{item.label}</h3>
                        {currentCloudinaryUrl ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#5DD62C]/30 bg-[#5DD62C]/10 px-2 py-0.5 font-mono text-[10px] text-[#5DD62C]">
                            <CheckCircle2 className="size-2.5" />
                            Live on Cloudinary
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-[#2A2A2A] bg-[#202020] px-2 py-0.5 font-mono text-[10px] text-[#9E9E9E]">
                            Default Placeholder
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9E9E9E]">{item.description}</p>
                      <p className="text-[11px] font-mono text-[#5DD62C]/80">{item.location}</p>
                    </div>

                    {currentCloudinaryUrl && (
                      <a
                        href={currentCloudinaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#5DD62C] hover:underline self-start shrink-0 pt-0.5"
                      >
                        <span>View Asset</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>

                  {/* Image Preview & Upload Controls */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-[#2A2A2A]/60">
                    {/* Preview Box */}
                    <div className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#202020] flex items-center justify-center">
                      {displayUrl ? (
                        <img
                          src={displayUrl}
                          alt={item.label}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-center text-[#9E9E9E]">
                          <Icon className="size-6 text-[#9E9E9E]/40 mb-1" />
                          <span className="text-[9px] font-mono">No Image</span>
                        </div>
                      )}

                      {isSelected && (
                        <span className="absolute bottom-0 inset-x-0 bg-[#5DD62C] text-[#0F0F0F] text-[9px] font-mono font-bold text-center py-0.5">
                          PENDING
                        </span>
                      )}
                    </div>

                    {/* Inputs & Action Buttons */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          id={`image-input-${item.key}`}
                          type="file"
                          accept="image/*"
                          disabled={isUploadingThis}
                          onChange={(e) => handleImageSelect(item.key, e)}
                          className="border-[#2A2A2A] bg-[#202020] text-[#F8F8F8] text-xs file:border-0 file:bg-[#0F0F0F] file:text-[#F8F8F8] file:text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:cursor-pointer"
                        />
                        {isSelected && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleClearSelectedImage(item.key)}
                            title="Clear selected file"
                            className="text-[#9E9E9E] hover:text-[#EF4444]"
                          >
                            <X className="size-4" />
                          </Button>
                        )}
                      </div>

                      {errorForThis && (
                        <p role="alert" className="text-xs text-[#EF4444]">
                          {errorForThis}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[11px] text-[#9E9E9E]">
                          Max 5 MB • JPEG, PNG, WebP, GIF, SVG, AVIF
                        </span>

                        <Button
                          type="button"
                          size="sm"
                          disabled={!isSelected || isUploadingThis}
                          onClick={() => handleUploadImage(item.key)}
                          className="bg-[#5DD62C] text-xs font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90 disabled:opacity-40 h-8"
                        >
                          {isUploadingThis ? (
                            <span className="flex items-center gap-1.5">
                              <span className="size-3 animate-spin rounded-full border-2 border-[#0F0F0F] border-t-transparent" />
                              Uploading...
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Upload className="size-3.5" />
                              Upload to Cloudinary
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Global Portfolio Settings Section */}
      <Card className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
        <form onSubmit={handleSaveSettings} noValidate>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#F8F8F8]">
              Public Portfolio Settings
            </CardTitle>
            <CardDescription className="text-xs text-[#9E9E9E]">
              Only documented settings fields (contactEmail, githubUrl, linkedinUrl) are updated here.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-xs font-medium text-[#F8F8F8]">
                Contact Email Address
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={contactEmail}
                disabled={isSavingSettings}
                placeholder="mitulkabirbadhon7@gmail.com"
                onChange={(e) => setContactEmail(e.target.value)}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="github-url" className="text-xs font-medium text-[#F8F8F8]">
                GitHub Profile URL
              </Label>
              <Input
                id="github-url"
                type="url"
                value={githubUrl}
                disabled={isSavingSettings}
                placeholder="https://github.com/your-username"
                onChange={(e) => setGithubUrl(e.target.value)}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="linkedin-url" className="text-xs font-medium text-[#F8F8F8]">
                LinkedIn Profile URL
              </Label>
              <Input
                id="linkedin-url"
                type="url"
                value={linkedinUrl}
                disabled={isSavingSettings}
                placeholder="https://linkedin.com/in/your-profile"
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="facebook-url" className="text-xs font-medium text-[#F8F8F8]">
                Facebook Profile URL
              </Label>
              <Input
                id="facebook-url"
                type="url"
                value={facebookUrl}
                disabled={isSavingSettings}
                placeholder="https://facebook.com/your-username"
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="instagram-url" className="text-xs font-medium text-[#F8F8F8]">
                Instagram Profile URL
              </Label>
              <Input
                id="instagram-url"
                type="url"
                value={instagramUrl}
                disabled={isSavingSettings}
                placeholder="https://instagram.com/your-username"
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clients-worldwide" className="text-xs font-medium text-[#F8F8F8]">
                Clients Worldwide Display Value
              </Label>
              <Input
                id="clients-worldwide"
                type="text"
                value={clientsWorldwide}
                disabled={isSavingSettings}
                placeholder="+12"
                onChange={(e) => setClientsWorldwide(e.target.value)}
                className="border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] text-sm focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
              />
              <p className="text-[11px] text-[#9E9E9E]">
                Configures the &quot;CLIENTS WORLDWIDE&quot; stat on the home page. Can also be auto-calculated from client entries in projects.
              </p>
            </div>
          </CardContent>

          <CardFooter className="border-t border-[#2A2A2A] pt-4">
            <Button
              type="submit"
              disabled={isSavingSettings}
              className="bg-[#5DD62C] font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90 focus-visible:ring-2 focus-visible:ring-[#5DD62C] disabled:opacity-50"
            >
              {isSavingSettings ? (
                "Saving..."
              ) : (
                <span className="flex items-center gap-1.5">
                  <Save className="size-4" />
                  Save Settings
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Educational Milestones Management Section */}
      <Card className="border border-[#2A2A2A] bg-[#202020] text-[#F8F8F8]">
        <form onSubmit={handleSaveSettings} noValidate>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="size-5 text-[#5DD62C]" />
              <CardTitle className="text-lg font-bold text-[#F8F8F8]">
                Career Timeline: Educational Milestones
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-[#9E9E9E]">
              Edit your University, College, and School information displayed in the About page Career Timeline.
              Images for each milestone can be uploaded in the &quot;Website Section &amp; Profile Images&quot; card above.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* University Block */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2">
                <GraduationCap className="size-4 text-[#5DD62C]" />
                <h3 className="text-sm font-bold text-[#F8F8F8]">1. University Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="univ-name" className="text-xs text-[#9E9E9E]">Institution / University Name</Label>
                  <Input
                    id="univ-name"
                    value={universityName}
                    disabled={isSavingSettings}
                    onChange={(e) => setUniversityName(e.target.value)}
                    placeholder="e.g. American International University-Bangladesh (AIUB)"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="univ-degree" className="text-xs text-[#9E9E9E]">Degree / Major</Label>
                  <Input
                    id="univ-degree"
                    value={universityDegree}
                    disabled={isSavingSettings}
                    onChange={(e) => setUniversityDegree(e.target.value)}
                    placeholder="e.g. B.Sc. in Computer Science & Engineering"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="univ-result" className="text-xs text-[#9E9E9E]">Result / CGPA</Label>
                  <Input
                    id="univ-result"
                    value={universityResult}
                    disabled={isSavingSettings}
                    onChange={(e) => setUniversityResult(e.target.value)}
                    placeholder="e.g. CGPA 3.85 / 4.00"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="univ-year" className="text-xs text-[#9E9E9E]">Passing Year / Timeline</Label>
                  <Input
                    id="univ-year"
                    value={universityYear}
                    disabled={isSavingSettings}
                    onChange={(e) => setUniversityYear(e.target.value)}
                    placeholder="e.g. 2020 – 2024"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
              </div>
            </div>

            {/* College Block */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2">
                <Building className="size-4 text-[#5DD62C]" />
                <h3 className="text-sm font-bold text-[#F8F8F8]">2. College Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="col-name" className="text-xs text-[#9E9E9E]">College Name</Label>
                  <Input
                    id="col-name"
                    value={collegeName}
                    disabled={isSavingSettings}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Higher Secondary College"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="col-degree" className="text-xs text-[#9E9E9E]">Degree / Group</Label>
                  <Input
                    id="col-degree"
                    value={collegeDegree}
                    disabled={isSavingSettings}
                    onChange={(e) => setCollegeDegree(e.target.value)}
                    placeholder="e.g. Higher Secondary Certificate (HSC) • Science"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="col-result" className="text-xs text-[#9E9E9E]">Result / GPA</Label>
                  <Input
                    id="col-result"
                    value={collegeResult}
                    disabled={isSavingSettings}
                    onChange={(e) => setCollegeResult(e.target.value)}
                    placeholder="e.g. GPA 5.00 / 5.00"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="col-year" className="text-xs text-[#9E9E9E]">Passing Year / Timeline</Label>
                  <Input
                    id="col-year"
                    value={collegeYear}
                    disabled={isSavingSettings}
                    onChange={(e) => setCollegeYear(e.target.value)}
                    placeholder="e.g. 2017 – 2019"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
              </div>
            </div>

            {/* School Block */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2">
                <School className="size-4 text-[#5DD62C]" />
                <h3 className="text-sm font-bold text-[#F8F8F8]">3. School Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="sch-name" className="text-xs text-[#9E9E9E]">School Name</Label>
                  <Input
                    id="sch-name"
                    value={schoolName}
                    disabled={isSavingSettings}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Secondary High School"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sch-degree" className="text-xs text-[#9E9E9E]">Degree / Group</Label>
                  <Input
                    id="sch-degree"
                    value={schoolDegree}
                    disabled={isSavingSettings}
                    onChange={(e) => setSchoolDegree(e.target.value)}
                    placeholder="e.g. Secondary School Certificate (SSC) • Science"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sch-result" className="text-xs text-[#9E9E9E]">Result / GPA</Label>
                  <Input
                    id="sch-result"
                    value={schoolResult}
                    disabled={isSavingSettings}
                    onChange={(e) => setSchoolResult(e.target.value)}
                    placeholder="e.g. GPA 5.00 / 5.00"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sch-year" className="text-xs text-[#9E9E9E]">Passing Year / Timeline</Label>
                  <Input
                    id="sch-year"
                    value={schoolYear}
                    disabled={isSavingSettings}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    placeholder="e.g. 2015 – 2017"
                    className="border-[#2A2A2A] bg-[#202020] text-xs text-[#F8F8F8]"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-[#2A2A2A] pt-4">
            <Button
              type="submit"
              disabled={isSavingSettings}
              className="bg-[#5DD62C] font-semibold text-[#0F0F0F] hover:bg-[#5DD62C]/90 focus-visible:ring-2 focus-visible:ring-[#5DD62C] disabled:opacity-50"
            >
              {isSavingSettings ? (
                "Saving..."
              ) : (
                <span className="flex items-center gap-1.5">
                  <Save className="size-4" />
                  Save Educational Milestones
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
