import { api, ApiError } from "@/lib/apiUpload";

// Corresponde exactamente con lo que devuelve tu backend
export type UploadResponse = {
  imageUrl: string;
  message: string;
};

export const uploadApi = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Axios automáticamente deserializa el JSON
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },
};

