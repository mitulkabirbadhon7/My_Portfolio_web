"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Settings, ApiResponse } from "@/types";
import { api } from "@/lib/api";

export const DEFAULT_SETTINGS: Settings = {
  _id: "default",
  contactEmail: "developer@example.com",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  cvUrl: "",
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
      setSettings({
        _id: data._id || DEFAULT_SETTINGS._id,
        contactEmail: data.contactEmail?.trim() || DEFAULT_SETTINGS.contactEmail,
        githubUrl: data.githubUrl?.trim() || DEFAULT_SETTINGS.githubUrl,
        linkedinUrl: data.linkedinUrl?.trim() || DEFAULT_SETTINGS.linkedinUrl,
        cvUrl: data.cvUrl || DEFAULT_SETTINGS.cvUrl,
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

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
