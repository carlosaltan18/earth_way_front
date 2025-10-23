import { api, ApiError } from "@/lib/api";
import type { Role } from "./types";

export const roleApi = {
  list: async (): Promise<Role[]> => {
    try {
      const response = await api.get("/role");
      return response.data.roles; 
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },


  get: async (id: number): Promise<Role> => {
    try {
      const response = await api.get(`/role/${id}`);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  create: async (role: Omit<Role, "id">): Promise<Role> => {
    try {
      const response = await api.post("/role", role);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  delete: async (name: string): Promise<void> => {
    try {
      await api.delete("/role", { data: { name } });
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  addToUser: async (userId: number, roleName: string): Promise<void> => {
    try {
      await api.post(`/role/user/${userId}/add`, null, { params: { roleName } });
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  removeFromUser: async (userId: number, roleName: string): Promise<void> => {
    try {
      await api.post(`/role/user/${userId}/remove`, null, { params: { roleName } });
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },
};