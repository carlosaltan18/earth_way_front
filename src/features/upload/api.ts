import { api, ApiError } from "@/lib/api";

export type UploadResponse = {
  url: string;
  filename: string;
  size: number;
};

export const uploadApi = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },
};