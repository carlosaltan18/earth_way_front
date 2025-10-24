import { api, ApiError } from "@/lib/api";
import type { Report, GetReportsParams, GetReportsResponse } from "./types";

export const reportApi = {
  list: async (params?: GetReportsParams): Promise<GetReportsResponse> => {
    try {
      const response = await api.get("/report", { params });
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  get: async (id: number): Promise<Report> => {
    try {
      const response = await api.get(`/report/${id}`);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  create: async (report: Omit<Report, "id">): Promise<Report> => {
    try {
      const response = await api.post("/report", report);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  update: async (id: number, report: Partial<Report>): Promise<Report> => {
    try {
      const response = await api.put(`/report/${id}`, report);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  patch: async (id: number, data: Partial<Report>): Promise<Report> => {
    try {
      const response = await api.patch(`/report/${id}`, data);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/report/${id}`);
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },
};