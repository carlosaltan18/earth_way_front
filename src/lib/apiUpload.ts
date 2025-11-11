import axios from "axios";

export const api = axios.create({
  baseURL: " https://earth-way-back.onrender.com/api/",
});

api.interceptors.request.use(
  (config) => {
    // Leer usuario completo desde localStorage
    const storedUser = localStorage.getItem("earthway_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const token = user.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export class ApiError extends Error {
  status?: number;
  data?: any;

  static fromAxiosError(error: any) {
    const apiError = new ApiError(error.message);
    if (error.response) {
      apiError.status = error.response.status;
      apiError.data = error.response.data;
    }
    return apiError;
  }
}
