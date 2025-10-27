import { api, ApiError } from "@/lib/api";
import type { Organization, GetOrganizationsParams } from "./types";
import { isAxiosError } from "axios";

interface GetOrganizationsResponse {
  payload: Organization[];
}

interface GetOrganizationResponse {
  payload: Organization;
}

export const organizationApi = {
  list: async (params?: GetOrganizationsParams): Promise<Organization[]> => {
    try {
      const response = await api.get<GetOrganizationsResponse>(
        "/organization",
        { params }
      );
      return response.data.payload;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  get: async (id: number): Promise<Organization> => {
    try {
      const response = await api.get<GetOrganizationResponse>(
        `/organization/${id}`
      );
      return response.data.payload;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  create: async (org: Omit<Organization, "id">): Promise<Organization> => {
    try {
      const response = await api.post<GetOrganizationResponse>(
        "/organization",
        org
      );
      return response.data.payload;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  update: async (
    id: number,
    org: Partial<Organization>
  ): Promise<Organization> => {
    try {
      const response = await api.put<GetOrganizationResponse>(
        `/organization/${id}`,
        org
      );
      return response.data.payload;
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
      const response = await api.get<GetOrganizationResponse>(
        "/organization/search",
        { params: { name } }
      );

      return [response.data.payload];
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        return [];
      }

      throw ApiError.fromAxiosError(err);
    }
  },
};
