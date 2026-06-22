"use client";
import { apiClient, extractData } from "../api-client";

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }).then(extractData),

  register: (data: { email: string; fullname: string; password: string; phone?: string; city?: string; university?: string }) =>
    apiClient.post("/auth/register", data).then(extractData),

  logout: (refreshToken?: string) =>
    apiClient.post("/auth/logout", refreshToken ? { refreshToken } : {}),

  refresh: (refreshToken: string) =>
    apiClient.post("/auth/refresh", { refreshToken }).then(extractData),

  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }).then(extractData),

  resetPassword: (token: string, password: string) =>
    apiClient.post("/auth/reset-password", { token, password }).then(extractData),

  verifyEmail: (token: string) =>
    apiClient.post("/auth/verify-email", { token }).then(extractData),

  resendVerification: () =>
    apiClient.post("/auth/resend-verification").then(extractData),
};
