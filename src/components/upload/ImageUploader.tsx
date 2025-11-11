"use client";

import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUploadFile } from "@/features/upload/queries";
import Image from "next/image";

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  placeholder?: string;
}

export default function ImageUploader({
  onImageSelected,
  currentImage,
  label = "Logo de la Organización",
  placeholder = "Sube una imagen para el logo",
}: ImageUploaderProps) {
  const { toast } = useToast();
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor sube un archivo de imagen válido",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar 5MB",
        variant: "destructive",
      });
      return;
    }

    // Crear preview local mientras se sube
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    uploadFile(file, {
      onSuccess: (data) => {
        toast({
          title: "Imagen subida",
          description: "El logo ha sido subido exitosamente",
        });
        // ✅ Cambio: usar imageUrl en lugar de url
        onImageSelected(data.imageUrl);
      },
      onError: (error: Error) => {
        toast({
          title: "Error al subir",
          description: error.message || "No se pudo subir la imagen",
          variant: "destructive",
        });
        setPreview(currentImage || null);
      },
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelected("");
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
          />
          <button
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors disabled:bg-gray-400"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Loading State con Preview */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
                <p className="text-xs text-white">Subiendo...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          } ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-sm text-gray-600">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-500">
                  Arrastra y suelta o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Máximo 5MB • PNG, JPG, WEBP
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}