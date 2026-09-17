import React from "react";
import type { Metadata } from "next";
import { SupportView } from "@/components/support/support-view";

export const metadata: Metadata = {
  title: "Support & Sponsorship | Mitul Kabir Badhon",
  description:
    "Support independent software development and open-source contributions by Mitul Kabir Badhon via manual bKash transfer or sponsorship.",
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <SupportView />
    </div>
  );
}
