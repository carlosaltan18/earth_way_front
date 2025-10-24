import { api, ApiError } from "@/lib/api";
import type { UserType as User, GetUsersParams, ChangePasswordPayload, PaginatedUsersResponse } from "./types";

export const userApi = {
  getUsers: async (params?: GetUsersParams): Promise<PaginatedUsersResponse> => {
    try {
      const response = await api.get("/user/get-user", { params });
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  getUser: async (idUser: number): Promise<User> => {
    try {
      const response = await api.get(`/user/get-user/${idUser}`);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  updateCurrentUser: async (user: Partial<User>): Promise<User> => {
    try {
      const response = await api.put("/user/update", user);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  updateUserById: async (idUser: number, user: Partial<User>): Promise<User> => {
    try {
      const response = await api.put(`/user/update/${idUser}`, user);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    try {
      await api.post("/user/change-password", payload);
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  deleteCurrentUser: async (): Promise<void> => {
    try {
      await api.delete("/user/delete");
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

};