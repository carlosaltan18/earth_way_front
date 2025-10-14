import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "./api";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadFile(file),
  });
};