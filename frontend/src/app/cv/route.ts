import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { ApiResponse, Settings } from "@/types";

export const dynamic = "force-dynamic";

/**
 * Route handler for /cv
 * Dynamically queries the documented settings endpoint and performs an HTTP 302 redirect
 * to the latest uploaded CV asset, or to /cv-unavailable if no document is linked.
 */
export async function GET(request: Request) {
  // Documented field name in docs/API_DOCUMENTATION.md under ## Settings & CV Endpoints: "cvUrl"
  const DOCUMENTED_CV_FIELD = "cvUrl" as const;

  try {
    const response = await api.get<ApiResponse<Settings>>("/settings", {
      cache: "no-store",
    });

    const settingsData = response?.data;
    const rawRecord = settingsData as Record<string, unknown> | undefined;
    const rawCvValue = rawRecord?.[DOCUMENTED_CV_FIELD] ?? settingsData?.cvUrl;

    const cvUrl = typeof rawCvValue === "string" ? rawCvValue.trim() : "";

    // If the documented CV URL field exists and contains a usable URL: stream as PDF attachment or redirect
    if (cvUrl && (cvUrl.startsWith("http://") || cvUrl.startsWith("https://"))) {
      try {
        const fileRes = await fetch(cvUrl);
        if (fileRes.ok) {
          const buffer = await fileRes.arrayBuffer();
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": 'attachment; filename="Mitu_Kabir_Badhon_CV.pdf"',
              "Cache-Control": "public, max-age=3600",
            },
          });
        }
      } catch (streamErr) {
        console.warn("[CV Route] Direct stream fallback to redirect:", streamErr);
      }
      return NextResponse.redirect(cvUrl, { status: 302 });
    }

    // If no CV URL is present: redirect to /cv-unavailable
    const fallbackUrl = new URL("/cv-unavailable", request.url);
    return NextResponse.redirect(fallbackUrl, { status: 302 });
  } catch (error) {
    console.error("[CV Route] Error retrieving CV URL from settings endpoint:", error);
    const fallbackUrl = new URL("/cv-unavailable", request.url);
    return NextResponse.redirect(fallbackUrl, { status: 302 });
  }
}
