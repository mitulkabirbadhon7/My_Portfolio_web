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

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim()) {
      errs.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    } else if (formData.name.trim().length > 100) {
      errs.name = "Name cannot exceed 100 characters.";
    }

    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please provide a valid email address.";
    }

    if (formData.subject.trim().length > 200) {
      errs.subject = "Subject cannot exceed 200 characters.";
    }

    if (!formData.message.trim()) {
      errs.message = "Message body is required.";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters long.";
    } else if (formData.message.trim().length > 5000) {
      errs.message = "Message cannot exceed 5000 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (rateLimitError) setRateLimitError(null);
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);
    setGeneralError(null);

    if (!validate()) {
      toast.error("Please resolve the issues highlighted in the form.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      });

      setSubmitted(true);
      toast.success("Message dispatched successfully. I will get back to you soon!");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 429) {
          const rateMsg =
            err.message ||
            "Rate limit reached. You can send up to 5 messages per 15 minutes. Please try again later.";
          setRateLimitError(rateMsg);
          toast.error("Rate limit reached. Please wait before transmitting again.");
        } else if (err.status === 400 && err.data && typeof err.data === "object") {
          const dataObj = err.data as Record<string, unknown>;
          if (Array.isArray(dataObj.errors)) {
            const backendFieldErrors: FormErrors = {};
            dataObj.errors.forEach((eItem: { field?: string; message?: string }) => {
              if (eItem.field && eItem.message) {
                backendFieldErrors[eItem.field as keyof FormErrors] = eItem.message;
              }
            });
            setErrors(backendFieldErrors);
            toast.error("Form validation failed. Please check the inputs.");
          } else {
            const msg = err.message || "Failed to submit message. Please check the inputs.";
            setGeneralError(msg);
            toast.error(msg);
          }
        } else {
          const msg = err.message || "An unexpected error occurred while sending your message.";
          setGeneralError(msg);
          toast.error(msg);
        }
      } else {
        const msg = "Unable to connect to the backend dispatch server. Please try again later.";
        setGeneralError(msg);
        toast.error(msg);
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
      {/* LEFT COLUMN: CONTACT INFO & SOCIALS */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#337418]/60 bg-[#202020] px-3 py-1">
            <span className="size-2 rounded-full bg-[#5DD62C] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
              Direct Inquiries
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#F8F8F8]">
            Let&apos;s start a conversation.
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-[#9E9E9E]">
            Have an inquiry about full-stack software development, distributed systems architecture,
            or engineering leadership? Send me a message using this secure transmission terminal.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="space-y-3 pt-2">
          {/* Email Channel */}
          <a
            href={`mailto:${contactEmail}`}
            className="group flex items-center gap-4 rounded-xl border border-[#2A2A2A] bg-[#202020] p-4 transition-all duration-200 hover:border-[#337418] hover:shadow-[0_0_18px_rgba(93,214,44,0.12)] outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
            aria-label={`Send email to ${contactEmail}`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] text-[#5DD62C] transition-colors group-hover:border-[#5DD62C]/60">
              <Mail className="size-4" />
            </span>
            <span className="text-sm font-medium text-[#F8F8F8] group-hover:text-[#5DD62C] transition-colors break-all">
              {contactEmail}
            </span>
            <ArrowUpRight className="ml-auto size-4 text-[#9E9E9E] group-hover:text-[#5DD62C] transition-colors" />
          </a>
        </div>

        {/* Response Guarantee Info Box */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#202020]/60 p-4 flex items-center gap-3 text-xs font-mono text-[#9E9E9E]">
          <Clock className="size-4 text-[#5DD62C] shrink-0" />
          <span>Responses typically dispatched within 24 business hours.</span>
        </div>
      </div>

      {/* RIGHT COLUMN: ACCESSIBLE CONTACT FORM */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#202020] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#5DD62C]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F8F8F8]">
                Message Dispatch
              </span>
            </div>
          </div>

          {/* SUCCESS CONFIRMATION */}
          {submitted ? (
            <div
              role="alert"
              aria-live="polite"
              className="py-10 text-center space-y-6 animate-in fade-in duration-200"
            >
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[#337418] bg-[#5DD62C]/10 text-[#5DD62C] shadow-[0_0_20px_rgba(93,214,44,0.2)]">
                <CheckCircle2 className="size-7" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-medium text-[#F8F8F8]">Message Delivered</h2>
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
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor={nameId}
                  className="block font-mono text-xs uppercase tracking-wider text-[#F8F8F8]"
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
                  className={`w-full rounded-xl border bg-[#0F0F0F] px-4 py-2.5 text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/50 outline-hidden transition-colors ${
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

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor={emailId}
                  className="block font-mono text-xs uppercase tracking-wider text-[#F8F8F8]"
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
                  className={`w-full rounded-xl border bg-[#0F0F0F] px-4 py-2.5 text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/50 outline-hidden transition-colors ${
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

              {/* Subject */}
              <div className="space-y-1.5">
                <label
                  htmlFor={subjectId}
                  className="block font-mono text-xs uppercase tracking-wider text-[#F8F8F8]"
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
                  className="w-full rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] px-4 py-2.5 text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/50 outline-hidden transition-colors focus:border-[#5DD62C] focus:ring-1 focus:ring-[#5DD62C]"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={messageId}
                    className="block font-mono text-xs uppercase tracking-wider text-[#F8F8F8]"
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
                  placeholder="Enter your message"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? `${messageId}-error` : undefined}
                  className={`w-full rounded-xl border bg-[#0F0F0F] px-4 py-3 text-sm text-[#F8F8F8] placeholder-[#9E9E9E]/50 outline-hidden transition-colors resize-y ${
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

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#337418] bg-[#5DD62C] px-6 py-3.5 text-sm font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 hover:shadow-[0_0_20px_rgba(93,214,44,0.35)] disabled:opacity-50 disabled:cursor-not-allowed outline-hidden focus-visible:ring-2 focus-visible:ring-[#5DD62C]"
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
