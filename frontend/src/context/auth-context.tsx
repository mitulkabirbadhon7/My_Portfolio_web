"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, AuthResponse, LoginPayload } from "@/types";
import { api, ApiError, BASE_URL } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  login: (credentials: LoginPayload) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Calls documented GET /auth/me to fetch session user via HttpOnly cookie
  const refresh = useCallback(async (): Promise<User | null> => {
    try {
      const res = await api.get<AuthResponse>("/auth/me", { auth: true });
      const currentUser = res?.user || null;
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      console.warn(`[Auth Session] No active session at ${BASE_URL}/auth/me:`, err);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    api
      .get<AuthResponse>("/auth/me", { auth: true })
      .then((res) => {
        if (isMounted) {
          setUser(res?.user || null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn(`[Auth Initial Check] Session probe failed at ${BASE_URL}/auth/me:`, err);
          setUser(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Documented POST /auth/login
  const login = useCallback(async (credentials: LoginPayload): Promise<User> => {
    setLoading(true);
    const targetUrl = `${BASE_URL}/auth/login`;
    console.log(`[Auth Login] Submitting credentials to: ${targetUrl}`);

    try {
      const res = await api.post<AuthResponse>("/auth/login", credentials, { auth: true });
      if (!res?.user) {
        throw new ApiError("Login succeeded but user payload is missing", 500);
      }
      setUser(res.user);
      return res.user;
    } catch (err) {
      console.error(`[Auth Login Failed] Failed to connect to ${targetUrl}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Documented POST /auth/logout
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await api.post("/auth/logout", {}, { auth: true });
    } catch (err) {
      console.warn("Logout request encountered an error:", err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    authenticated: !!user,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
