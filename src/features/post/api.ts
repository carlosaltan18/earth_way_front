import { api, ApiError } from "@/lib/api";
import type { Post, PostsApiResponse } from "./types";

export const postApi = {
  list: async (): Promise<PostsApiResponse> => {
    try {
      const response = await api.get("/post/listPost");
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  create: async (post: Omit<Post, "id">): Promise<Post> => {
    try {
      const response = await api.post("/post/post-post", post);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  update: async (id: number, userId: number, post: Omit<Post, "id">): Promise<Post> => {
    try {
      const response = await api.put(`/post/put-post/${id}`, post, { params: { userId } });
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  deleteByUser: async (id: number, userId: number): Promise<void> => {
    try {
      await api.delete(`/post/delete-post/user/${id}`, { params: { userId } });
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  deleteByAdmin: async (id: number): Promise<void> => {
    try {
      await api.delete(`/post/delete-post/admin/${id}`);
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },
};