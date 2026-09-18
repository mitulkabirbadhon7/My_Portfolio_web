"use client";

import React, { useState, useId } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/context/settings-context";
import { api, ApiError } from "@/lib/api";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  // Contact points from documented settings endpoint
  const rawEmail = settings.contactEmail?.trim();
  const contactEmail =
    rawEmail && rawEmail !== "developer@example.com" && rawEmail !== "contact@example.com"
      ? rawEmail
      : "mitulkabirbadhon7@gmail.com";

  const rawGithub = settings.githubUrl?.trim();
  const githubUrl =
    rawGithub && rawGithub !== "https://github.com" && rawGithub !== "https://github.com/your-actual-username"
      ? rawGithub
      : "https://github.com/mitulkabirbadhon7";

  const rawLinkedin = settings.linkedinUrl?.trim();
  const linkedinUrl =
    rawLinkedin && rawLinkedin !== "https://linkedin.com" && rawLinkedin !== "https://linkedin.com/in/your-actual-profile"
      ? rawLinkedin
      : "https://linkedin.com/in/mitulkabirbadhon";

  // Validation according to backend controller rules
  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    // 1. Name: non-empty
    if (!formData.name.trim()) {
      nextErrors.name = "Your name is required.";
    }

    // 2. Email: valid regex per backend controller: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nextErrors.email = "A valid email address is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = "Please provide a valid email address format.";
    }

    // 3. Message: min 10 chars, max 5000 chars per backend rules
    if (!formData.message.trim()) {
      nextErrors.message = "A message body is required.";
    } else if (formData.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters in length.";
    } else if (formData.message.length > 5000) {
      nextErrors.message = "Message exceeds maximum limit of 5000 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setGeneralError(null);
    setRateLimitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setRateLimitError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Requirement 4: Submit via shared API client to POST /api/v1/contact
      // Payload uses ONLY documented fields
      await api.post<{ success: boolean; message: string }>("/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      });

      setSubmitted(true);
      toast.success("Message sent successfully!", {
        description: "Thank you for reaching out. I will respond as soon as possible.",
      });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 429) {
          // Requirement 5: Handle 429 Rate Limit
          setRateLimitError(
            err.message ||
              "Message limit reached (5 requests per 15 minutes). Please wait a moment before sending another message."
          );
          toast.error("Rate Limit Exceeded", {
            description: "You have sent too many messages. Please try again after 15 minutes.",
          });
        } else {
          setGeneralError(err.message || "Failed to send message. Please try again.");
          toast.error("Message delivery failed", { description: err.message });
        }
      } else if (err instanceof Error) {
        setGeneralError(err.message);
        toast.error("Error", { description: err.message });
      } else {
        setGeneralError("A network error occurred. Please check your connection and retry.");
        toast.error("Network Error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    setRateLimitError(null);
    setGeneralError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* =========================================================================
          LEFT COLUMN: CONTACT INFO & SOCIALS (Requirements 7 & 8)
          ========================================================================= */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#337418]/60 bg-[#202020] px-3 py-1 text-xs font-mono text-[#5DD62C]">
            <span className="size-2 rounded-full bg-[#5DD62C] animate-pulse" />
            <span>Direct Communication</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F8F8F8]">
            Contact with me
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-[#9E9E9E]">
            Have an inquiry about full-stack engineering, systems architecture, or project advisory?
            Send me a message using this secure transmission terminal.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="space-y-4 pt-2">
          {/* Email Channel */}
          <a
            href={`mailto:${contactEmail}`}
            className="group flex items-center gap-4 rounded-xl border border-[#2A2A2A] bg-[#202020] p-4 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_18px_rgba(93,214,44,0.12)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            aria-label={`Send email to ${contactEmail}`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] text-[#5DD62C] transition-colors group-hover:border-[#5DD62C]/60">
              <Mail className="size-5" />
            </span>
            <span className="text-sm font-semibold text-[#F8F8F8] group-hover:text-[#5DD62C] transition-colors break-all">
              {contactEmail}
            </span>
            <ArrowUpRight className="ml-auto size-4 text-[#9E9E9E] group-hover:text-[#5DD62C] transition-colors" />
          </a>

          {/* GitHub Channel */}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-[#2A2A2A] bg-[#202020] p-4 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_18px_rgba(93,214,44,0.12)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
              aria-label="Visit GitHub"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] text-[#5DD62C] transition-colors group-hover:border-[#5DD62C]/60">
                <GithubIcon className="size-5" />
              </span>
              <span className="text-sm font-semibold text-[#F8F8F8] group-hover:text-[#5DD62C] transition-colors">
                GitHub
              </span>
              <ArrowUpRight className="ml-auto size-4 text-[#9E9E9E] group-hover:text-[#5DD62C] transition-colors" />
            </a>
          )}

          {/* LinkedIn Channel */}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-[#2A2A2A] bg-[#202020] p-4 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_18px_rgba(93,214,44,0.12)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
              aria-label="Visit LinkedIn"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] text-[#5DD62C] transition-colors group-hover:border-[#5DD62C]/60">
                <LinkedinIcon className="size-5" />
              </span>
              <span className="text-sm font-semibold text-[#F8F8F8] group-hover:text-[#5DD62C] transition-colors">
                LinkedIn
              </span>
              <ArrowUpRight className="ml-auto size-4 text-[#9E9E9E] group-hover:text-[#5DD62C] transition-colors" />
            </a>
          )}
        </div>

        {/* Response Guarantee Info Box */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#202020]/40 p-4 flex items-center gap-3 text-xs font-mono text-[#9E9E9E]">
          <Clock className="size-4 text-[#5DD62C] shrink-0" />
          <span>Responses typically dispatched within 24 business hours.</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT COLUMN: ACCESSIBLE CONTACT FORM (Requirements 2, 3, 4, 5, 9)
          ========================================================================= */}
      <div className="lg:col-span-7">
        <div className="relative overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 shadow-2xl">
          {/* Decorative Corner Glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#5DD62C]/10 blur-2xl" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#5DD62C]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F8F8]">
                Message Dispatch
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#9E9E9E]">
              Encrypted &amp; Rate-Limited
            </span>
          </div>

          {/* =====================================================================
              STATE: SUCCESS CONFIRMATION
              ===================================================================== */}
          {submitted ? (
            <div
              role="alert"
              aria-live="polite"
              className="py-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-[#5DD62C] bg-[#5DD62C]/10 text-[#5DD62C] shadow-[0_0_24px_rgba(93,214,44,0.3)]">
                <CheckCircle2 className="size-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#F8F8F8]">Message Delivered</h2>
                <p className="text-sm text-[#9E9E9E] max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-[#F8F8F8] font-semibold">{formData.name}</span>. Your
                  message has been securely transferred. You will receive a response shortly at{" "}
                  <span className="text-[#5DD62C] font-mono">{formData.email}</span>.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-5 py-2.5 text-xs font-medium text-[#F8F8F8] hover:border-[#5DD62C] hover:text-[#5DD62C] transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
                >
                  <RefreshCw className="size-3.5" />
                  <span>Send Another Message</span>
                </button>
              </div>
            </div>
          ) : (
            /* ===================================================================
               ACTIVE FORM
               =================================================================== */
            <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-5">
              {/* Alert: 429 Rate Limit (Requirement 5) */}
              {rateLimitError && (
                <div
                  role="alert"
                  className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 text-xs sm:text-sm text-amber-200 flex items-start gap-3"
                >
                  <AlertCircle className="size-5 shrink-0 text-amber-400 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-semibold block">Rate Limit Active</strong>
                    <p className="text-amber-300/90 leading-relaxed">{rateLimitError}</p>
                  </div>
                </div>
              )}

              {/* Alert: General / Network Error (Requirement 5) */}
              {generalError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 text-xs sm:text-sm text-red-200 flex items-start gap-3"
                >
                  <AlertCircle className="size-5 shrink-0 text-red-400 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-semibold block">Transmission Failed</strong>
                    <p className="text-red-300/90 leading-relaxed">{generalError}</p>
                  </div>
                </div>
              )}

              {/* Field 1: Name (Documented Field) */}
              <div className="space-y-1.5">
                <label
                  htmlFor={nameId}
                  className="block font-mono text-xs font-medium uppercase tracking-wider text-[#F8F8F8]"
                >
                  Your Name <span className="text-[#5DD62C]">*</span>
                </label>
                <input
                  id={nameId}
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${nameId}-error` : undefined}
                  className={`w-full rounded-xl border bg-[#0F0F0F] px-4 py-2.5 text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/60 outline-hidden transition-colors ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#2A2A2A] focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C]"
                  }`}
                />
                {errors.name && (
                  <p id={`${nameId}-error`} className="text-xs font-mono text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Field 2: Email (Documented Field) */}
              <div className="space-y-1.5">
                <label
                  htmlFor={emailId}
                  className="block font-mono text-xs font-medium uppercase tracking-wider text-[#F8F8F8]"
                >
                  Email Address <span className="text-[#5DD62C]">*</span>
                </label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? `${emailId}-error` : undefined}
                  className={`w-full rounded-xl border bg-[#0F0F0F] px-4 py-2.5 text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/60 outline-hidden transition-colors ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#2A2A2A] focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C]"
                  }`}
                />
                {errors.email && (
                  <p id={`${emailId}-error`} className="text-xs font-mono text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Field 3: Subject (Documented Field - Optional) */}
              <div className="space-y-1.5">
                <label
                  htmlFor={subjectId}
                  className="block font-mono text-xs font-medium uppercase tracking-wider text-[#F8F8F8]"
                >
                  Subject <span className="text-xs text-[#9E9E9E] lowercase font-normal">(optional)</span>
                </label>
                <input
                  id={subjectId}
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] px-4 py-2.5 text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/60 outline-hidden transition-colors focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C]"
                />
              </div>

              {/* Field 4: Message (Documented Field - Min 10 chars, Max 5000) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={messageId}
                    className="block font-mono text-xs font-medium uppercase tracking-wider text-[#F8F8F8]"
                  >
                    Message Body <span className="text-[#5DD62C]">*</span>
                  </label>
                  <span
                    className={`font-mono text-[11px] ${
                      formData.message.length > 5000 ? "text-red-400" : "text-[#9E9E9E]"
                    }`}
                  >
                    {formData.message.length} / 5000
                  </span>
                </div>
                <textarea
                  id={messageId}
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message you want to send"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? `${messageId}-error` : undefined}
                  className={`w-full rounded-xl border bg-[#0F0F0F] px-4 py-3 text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/60 outline-hidden transition-colors resize-y ${
                    errors.message
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-[#2A2A2A] focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C]"
                  }`}
                />
                {errors.message && (
                  <p id={`${messageId}-error`} className="text-xs font-mono text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button (Requirement 5: Loading state) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#337418] bg-[#5DD62C] px-6 py-3 text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_20px_rgba(93,214,44,0.35)] disabled:opacity-50 disabled:cursor-not-allowed outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center font-mono text-[11px] text-[#9E9E9E]">
                Direct inbox connection via backend relay. Protected by rate limiting.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
