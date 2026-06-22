"use client";
import { apiClient, extractData } from "../api-client";

export const organizersService = {
  create: (data: { organizationName: string; description?: string }) =>
    apiClient.post("/organizers", data).then(extractData),

  getMy: () =>
    apiClient.get("/organizers/my").then(extractData),

  update: (data: any) =>
    apiClient.patch("/organizers/my", data).then(extractData),

  getDashboard: () =>
    apiClient.get("/organizers/dashboard").then(extractData),

  findById: (id: string) =>
    apiClient.get(`/organizers/${id}`).then(extractData),
};

export const adminService = {
  getDashboard: () =>
    apiClient.get("/admin/dashboard").then(extractData),

  getUsers: (page = 1, limit = 20) =>
    apiClient.get("/admin/users", { params: { page, limit } }).then(extractData),

  getUser: (id: string) =>
    apiClient.get(`/admin/users/${id}`).then(extractData),

  updateUserRole: (id: string, role: string) =>
    apiClient.patch(`/admin/users/${id}/role`, { role }).then(extractData),

  toggleUserStatus: (id: string) =>
    apiClient.patch(`/admin/users/${id}/toggle-status`).then(extractData),

  getEvents: (status?: string) =>
    apiClient.get("/admin/events", { params: { status } }).then(extractData),

  getPendingEvents: () =>
    apiClient.get("/admin/events/pending").then(extractData),

  approveEvent: (id: string) =>
    apiClient.post(`/admin/events/${id}/approve`).then(extractData),

  rejectEvent: (id: string, reason?: string) =>
    apiClient.post(`/admin/events/${id}/reject`, { reason }).then(extractData),

  getOrganizers: () =>
    apiClient.get("/admin/organizers").then(extractData),

  verifyOrganizer: (id: string) =>
    apiClient.post(`/admin/organizers/${id}/verify`).then(extractData),

  getTransactions: () =>
    apiClient.get("/admin/transactions").then(extractData),

  getBoosts: () =>
    apiClient.get("/admin/boosts").then(extractData),

  getUniversities: () =>
    apiClient.get("/admin/universities").then(extractData),

  getSettings: () =>
    apiClient.get("/admin/settings").then(extractData),

  updateSettings: (settings: any) =>
    apiClient.patch("/admin/settings", settings).then(extractData),

  getAuditLogs: (limit = 50) =>
    apiClient.get("/admin/audit-logs", { params: { limit } }).then(extractData),
};

export const boostsService = {
  create: (data: any) =>
    apiClient.post("/boosts", data).then(extractData),

  getMy: () =>
    apiClient.get("/boosts/my").then(extractData),
};

export const adsService = {
  findActive: (city?: string) =>
    apiClient.get("/ads/active", { params: { city } }).then(extractData),

  findAll: () =>
    apiClient.get("/ads").then(extractData),

  findOne: (id: string) =>
    apiClient.get(`/ads/${id}`).then(extractData),

  create: (data: any) =>
    apiClient.post("/ads", data).then(extractData),

  update: (id: string, data: any) =>
    apiClient.patch(`/ads/${id}`, data).then(extractData),

  delete: (id: string) =>
    apiClient.delete(`/ads/${id}`).then(extractData),
};
