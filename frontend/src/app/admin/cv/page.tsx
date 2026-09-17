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
import {
  FileText,
  Upload,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileCheck,
} from "lucide-react";

export default function AdminSettingsAndCVPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings form state
  const [contactEmail, setContactEmail] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // CV Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
                placeholder="developer@example.com"
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
    </div>
  );
}
