// Hook de React Query
import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "./api";
import { ApiError } from "@/lib/api";


export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadFile(file),
    onSuccess: (data) => {
      // Puedes agregar lógica aquí después de un upload exitoso
      console.log("Archivo subido:", data.imageUrl);
    },
    onError: (error: ApiError) => {
      console.error("Error en la carga:", error.message);
    },
  });
};
