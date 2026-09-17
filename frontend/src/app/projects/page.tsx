import React from "react";
import type { Metadata } from "next";
import { ProjectsGallery } from "@/components/projects/projects-gallery";

export const metadata: Metadata = {
  title: "Selected Projects | Mitul Kabir Badhon",
  description:
    "Explore case studies, open-source software, and production web applications engineered by Mitul Kabir Badhon.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <ProjectsGallery />
    </div>
  );
}
