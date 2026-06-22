"use client";
import { apiClient, extractData } from "../api-client";

export const usersService = {
  getProfile: () =>
    apiClient.get("/users/profile").then(extractData),

  getPublicProfile: (id: string) =>
    apiClient.get(`/users/${id}`).then(extractData),

  updateProfile: (data: any) =>
    apiClient.patch("/users/profile", data).then(extractData),

  deleteAccount: () =>
    apiClient.delete("/users/account").then(extractData),
};

export const favoritesService = {
  findAll: () =>
    apiClient.get("/favorites").then(extractData),

  add: (eventId: string) =>
    apiClient.post(`/favorites/${eventId}`).then(extractData),

  remove: (eventId: string) =>
    apiClient.delete(`/favorites/${eventId}`).then(extractData),

  toggle: (eventId: string) =>
    apiClient.post(`/favorites/toggle/${eventId}`).then(extractData),
};

export const notificationsService = {
  findAll: (unreadOnly = false) =>
    apiClient.get("/notifications", { params: { unreadOnly: unreadOnly ? "true" : undefined } }).then(extractData),

  unreadCount: () =>
    apiClient.get("/notifications/unread-count").then(extractData),

  markRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`).then(extractData),

  markAllRead: () =>
    apiClient.patch("/notifications/read-all").then(extractData),
};
