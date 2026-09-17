"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, authenticated, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated on mount, redirect to dashboard
  useEffect(() => {
    if (!authLoading && authenticated && user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [authLoading, authenticated, user, router]);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const loggedInUser = await login({
        email: email.trim(),
        password,
      });

      // Role check for UX guard (backend independently enforces authorization)
      if (loggedInUser?.role !== "admin") {
        setServerError("Access denied. Admin privileges are required to access this portal.");
        return;
      }

      router.push("/admin/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setServerError("Invalid email or password. Please verify your credentials.");
        } else if (err.status === 403) {
          setServerError("Access forbidden. Admin role is required.");
        } else {
          setServerError(err.message || "An unexpected authentication error occurred.");
        }
      } else if (err instanceof Error) {
        setServerError(
          err.message.includes("fetch") || err.message.includes("Network")
            ? "Network connection error. Unable to connect to backend server."
            : err.message
        );
      } else {
        setServerError("Authentication failed. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F0F0F] p-4 text-[#F8F8F8]">
        <div className="flex items-center gap-3">
          <span className="inline-block size-3 animate-ping rounded-full bg-[#5DD62C]" />
          <span className="font-mono text-sm text-[#9E9E9E]">Verifying session...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F0F0F] p-4 text-[#F8F8F8]">
      <div className="w-full max-w-md">
        <Card className="rounded-xl border border-[#337418] bg-[#202020] text-[#F8F8F8] shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2.5 rounded-full bg-[#5DD62C]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#5DD62C]">
                Security Gateway
              </span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-[#F8F8F8]">
              Admin Login
            </CardTitle>
            <CardDescription className="text-sm text-[#9E9E9E]">
              Authenticate with your credentials to manage the portfolio.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-4">
              {serverError && (
                <Alert
                  variant="destructive"
                  className="border border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]"
                >
                  <AlertTitle className="font-semibold">Authentication Error</AlertTitle>
                  <AlertDescription className="text-xs text-[#EF4444]/90">
                    {serverError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-xs font-medium text-[#F8F8F8]">
                  Email Address
                </Label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  value={email}
                  disabled={isSubmitting}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "admin-email-error" : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                />
                {fieldErrors.email && (
                  <p id="admin-email-error" role="alert" className="text-xs text-[#EF4444]">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-xs font-medium text-[#F8F8F8]">
                  Password
                </Label>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  disabled={isSubmitting}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "admin-password-error" : undefined}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  className="rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] text-[#F8F8F8] placeholder:text-[#9E9E9E] focus-visible:border-[#5DD62C] focus-visible:ring-[#5DD62C]"
                />
                {fieldErrors.password && (
                  <p id="admin-password-error" role="alert" className="text-xs text-[#EF4444]">
                    {fieldErrors.password}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#5DD62C] font-semibold text-[#0F0F0F] transition-all hover:bg-[#5DD62C]/90 focus-visible:ring-2 focus-visible:ring-[#5DD62C] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-[#0F0F0F] border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
