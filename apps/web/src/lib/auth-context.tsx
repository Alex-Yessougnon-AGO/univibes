"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient, setAccessToken, setRefreshToken, clearTokens, getAccessToken, extractData } from "./api-client";

// =====================================================
// TYPES
// =====================================================

export interface UserProfile {
  id: string;
  email: string;
  role: "student" | "organizer" | "moderator" | "admin";
  fullname: string;
  avatarUrl?: string;
  city?: string;
  university?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  fullname: string;
  password: string;
  phone?: string;
  city?: string;
  university?: string;
}

// =====================================================
// CONTEXT
// =====================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  interface ApiTokenData {
    accessToken: string;
    refreshToken: string;
  }

  interface ApiAuthData {
    tokens: ApiTokenData;
    user: {
      id: string;
      email: string;
      role: UserProfile['role'];
      fullname?: string;
      avatarUrl?: string;
      city?: string;
      university?: string;
      profile?: { fullname?: string; avatarUrl?: string; city?: string; university?: string };
    };
  }

  interface ApiProfileData {
    id: string;
    email: string;
    role: UserProfile['role'];
    fullname?: string;
    avatarUrl?: string;
    city?: string;
    university?: string;
    profile?: { fullname?: string; avatarUrl?: string; city?: string; university?: string };
  }

  const mapUser = (data: ApiProfileData): UserProfile => ({
    id: data.id,
    email: data.email,
    role: data.role,
    fullname: data.fullname ?? data.profile?.fullname ?? '',
    avatarUrl: data.avatarUrl ?? data.profile?.avatarUrl,
    city: data.city ?? data.profile?.city,
    university: data.university ?? data.profile?.university,
  });

  const fetchUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await apiClient.get("/users/profile");
      const data = extractData<ApiProfileData>(res.data);
      setUser(mapUser(data));
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    const data = extractData<ApiAuthData>(res.data);
    setAccessToken(data.tokens.accessToken);
    setRefreshToken(data.tokens.refreshToken);
    setUser({
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      fullname: data.user.fullname ?? '',
      avatarUrl: data.user.avatarUrl,
    });
  }, []);

  const register = useCallback(async (regData: RegisterData) => {
    const res = await apiClient.post("/auth/register", regData);
    const data = extractData<ApiAuthData>(res.data);
    setAccessToken(data.tokens.accessToken);
    setRefreshToken(data.tokens.refreshToken);
    setUser({
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      fullname: data.user.fullname ?? '',
      avatarUrl: data.user.avatarUrl,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
      await apiClient.post("/auth/logout", refreshToken ? { refreshToken } : {});
    } catch {
      // Ignore logout errors
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
