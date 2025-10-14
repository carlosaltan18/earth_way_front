import { api, ApiError } from "@/lib/api";
import type { Organization, GetOrganizationsParams } from "./types";

export const organizationApi = {
  list: async (params?: GetOrganizationsParams): Promise<Organization[]> => {
    try {
      const response = await api.get("/organization", { params });
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  get: async (id: number): Promise<Organization> => {
    try {
      const response = await api.get(`/organization/${id}`);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  create: async (org: Omit<Organization, "id">): Promise<Organization> => {
    try {
      const response = await api.post("/organization", org);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  update: async (id: number, org: Partial<Organization>): Promise<Organization> => {
    try {
      const response = await api.put(`/organization/${id}`, org);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/organization/${id}`);
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  search: async (name: string): Promise<Organization[]> => {
    try {
      const response = await api.get("/organization/search", { params: { name } });
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },
};