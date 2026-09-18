"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Settings, ApiResponse } from "@/types";
import { api } from "@/lib/api";

export const DEFAULT_SETTINGS: Settings = {
  _id: "default",
  contactEmail: "mitulkabirbadhon7@gmail.com",
  githubUrl: "https://github.com/mitulkabirbadhon7",
  linkedinUrl: "https://linkedin.com/in/mitulkabirbadhon",
  facebookUrl: "",
  instagramUrl: "",
  clientsWorldwide: "+12",
  cvUrl: "",
  homeProfileImage: "",
  aboutProfileImage: "",
  universityImage: "",
  collegeImage: "",
  schoolImage: "",
  signatureImage: "",
  universityName: "American International University-Bangladesh (AIUB)",
  universityDegree: "B.Sc. in Computer Science & Engineering",
  universityResult: "CGPA 3.85 / 4.00",
  universityYear: "2020 – 2024",
  collegeName: "Higher Secondary College",
  collegeDegree: "Higher Secondary Certificate (HSC) • Science",
  collegeResult: "GPA 5.00 / 5.00",
  collegeYear: "2017 – 2019",
  schoolName: "Secondary High School",
  schoolDegree: "Secondary School Certificate (SSC) • Science",
  schoolResult: "GPA 5.00 / 5.00",
  schoolYear: "2015 – 2017",
};

interface SettingsContextValue {
  settings: Settings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const applySettingsData = useCallback((data?: Settings | null) => {
    if (data) {
      const rawEmail = data.contactEmail?.trim();
      const contactEmail =
        rawEmail && rawEmail !== "developer@example.com" && rawEmail !== "contact@example.com"
          ? rawEmail
          : DEFAULT_SETTINGS.contactEmail;

      const rawGithub = data.githubUrl?.trim();
      const githubUrl =
        rawGithub && rawGithub !== "https://github.com" && rawGithub !== "https://github.com/your-actual-username"
          ? rawGithub
          : DEFAULT_SETTINGS.githubUrl;

      const rawLinkedin = data.linkedinUrl?.trim();
      const linkedinUrl =
        rawLinkedin && rawLinkedin !== "https://linkedin.com" && rawLinkedin !== "https://linkedin.com/in/your-actual-profile"
          ? rawLinkedin
          : DEFAULT_SETTINGS.linkedinUrl;

      setSettings({
        _id: data._id || DEFAULT_SETTINGS._id,
        contactEmail,
        githubUrl,
        linkedinUrl,
        facebookUrl: data.facebookUrl || DEFAULT_SETTINGS.facebookUrl,
        instagramUrl: data.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
        clientsWorldwide: data.clientsWorldwide?.trim() || DEFAULT_SETTINGS.clientsWorldwide,
        cvUrl: data.cvUrl || DEFAULT_SETTINGS.cvUrl,
        homeProfileImage: data.homeProfileImage || DEFAULT_SETTINGS.homeProfileImage,
        aboutProfileImage: data.aboutProfileImage || DEFAULT_SETTINGS.aboutProfileImage,
        universityImage: data.universityImage || DEFAULT_SETTINGS.universityImage,
        collegeImage: data.collegeImage || DEFAULT_SETTINGS.collegeImage,
        schoolImage: data.schoolImage || DEFAULT_SETTINGS.schoolImage,
        signatureImage: data.signatureImage || DEFAULT_SETTINGS.signatureImage,
        universityName: data.universityName?.trim() || DEFAULT_SETTINGS.universityName,
        universityDegree: data.universityDegree?.trim() || DEFAULT_SETTINGS.universityDegree,
        universityResult: data.universityResult?.trim() || DEFAULT_SETTINGS.universityResult,
        universityYear: data.universityYear?.trim() || DEFAULT_SETTINGS.universityYear,
        collegeName: data.collegeName?.trim() || DEFAULT_SETTINGS.collegeName,
        collegeDegree: data.collegeDegree?.trim() || DEFAULT_SETTINGS.collegeDegree,
        collegeResult: data.collegeResult?.trim() || DEFAULT_SETTINGS.collegeResult,
        collegeYear: data.collegeYear?.trim() || DEFAULT_SETTINGS.collegeYear,
        schoolName: data.schoolName?.trim() || DEFAULT_SETTINGS.schoolName,
        schoolDegree: data.schoolDegree?.trim() || DEFAULT_SETTINGS.schoolDegree,
        schoolResult: data.schoolResult?.trim() || DEFAULT_SETTINGS.schoolResult,
        schoolYear: data.schoolYear?.trim() || DEFAULT_SETTINGS.schoolYear,
        updatedAt: data.updatedAt,
      });
    } else {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<Settings>>("/settings");
      applySettingsData(res?.data);
    } catch (err) {
      console.warn("Could not load remote settings; using safe defaults:", err);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  }, [applySettingsData]);

  useEffect(() => {
    let isMounted = true;

    api
      .get<ApiResponse<Settings>>("/settings")
      .then((res) => {
        if (isMounted) {
          applySettingsData(res?.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn("Could not load remote settings; using safe defaults:", err);
          setSettings(DEFAULT_SETTINGS);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [applySettingsData]);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
