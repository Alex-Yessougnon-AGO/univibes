"use client";
import { apiClient, extractData } from "../api-client";

export const ordersService = {
  findAll: () =>
    apiClient.get("/orders").then(extractData),

  findOne: (id: string) =>
    apiClient.get(`/orders/${id}`).then(extractData),

  create: (data: { items: Array<{ ticketId: string; quantity: number }> }) =>
    apiClient.post("/orders", data).then(extractData),

  cancel: (id: string) =>
    apiClient.post(`/orders/${id}/cancel`).then(extractData),
};

export const ticketsService = {
  findByEvent: (eventId: string) =>
    apiClient.get(`/tickets/${eventId}`).then(extractData),

  create: (eventId: string, data: any) =>
    apiClient.post(`/tickets/${eventId}`, data).then(extractData),

  update: (id: string, data: any) =>
    apiClient.patch(`/tickets/${id}`, data).then(extractData),

  delete: (id: string) =>
    apiClient.delete(`/tickets/${id}`).then(extractData),
};

export const paymentsService = {
  initiate: (data: { orderId: string; provider: string }) =>
    apiClient.post("/payments/initiate", data).then(extractData),

  getStatus: (orderId: string) =>
    apiClient.get(`/payments/${orderId}`).then(extractData),
};

export const checkinService = {
  scan: (qrCode: string) =>
    apiClient.post("/checkin/scan", { qrCode }).then(extractData),

  verify: (qrCode: string) =>
    apiClient.get(`/checkin/${qrCode}`).then(extractData),
};

export const uploadService = {
  upload: (file: File, folder = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(extractData);
  },

  uploadProfile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/upload/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(extractData);
  },
};
