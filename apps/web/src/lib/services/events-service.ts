"use client";
import { apiClient, extractData } from "../api-client";

export interface ApiEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  location: string;
  city: string;
  startDate: string;
  endDate: string;
  isFree: boolean;
  status: string;
  views: number;
  category?: { id: string; name: string; slug: string; icon?: string };
  organizer?: {
    id: string;
    organizationName: string;
    verified: boolean;
    user?: { profile?: { fullname?: string } };
  };
  tickets?: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    remaining: number;
    quantity: number;
  }>;
  _count?: { favorites: number; orders: number; tickets: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const eventsService = {
  findAll: (params?: { page?: number; limit?: number; search?: string; city?: string; categoryId?: string; status?: string }) =>
    apiClient.get("/events", { params }).then((res) => extractData(res) as PaginatedResponse<ApiEvent>),

  findBySlug: (slug: string) =>
    apiClient.get(`/events/${slug}`).then(extractData) as Promise<ApiEvent>,

  findMy: () =>
    apiClient.get("/events/my").then(extractData) as Promise<ApiEvent[]>,

  create: (data: any) =>
    apiClient.post("/events", data).then(extractData),

  update: (id: string, data: any) =>
    apiClient.patch(`/events/${id}`, data).then(extractData),

  delete: (id: string) =>
    apiClient.delete(`/events/${id}`).then(extractData),

  getCities: () =>
    apiClient.get("/events/cities").then(extractData) as Promise<{ city: string; count: number }[]>,

  searchSuggestions: (q: string) =>
    apiClient.get("/events/search-suggestions", { params: { q } }).then(extractData) as Promise<{ suggestions: { titles: Array<{ text: string; slug: string }>; cities: string[] } }>,
};

export const categoriesService = {
  findAll: () =>
    apiClient.get("/categories").then(extractData) as Promise<Array<{ id: string; name: string; slug: string; icon?: string; _count?: { events: number } }>>,

  findOne: (id: string) =>
    apiClient.get(`/categories/${id}`).then(extractData),
};
