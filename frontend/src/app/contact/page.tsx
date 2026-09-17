import React from "react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact & Inquiries | Mitul Kabir Badhon",
  description:
    "Direct communication channel to contact Mitul Kabir Badhon for software engineering inquiries, consulting, or project collaborations.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <ContactForm />
    </div>
  );
}
