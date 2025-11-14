"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface LogoImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
}

/**
 * Componente seguro para mostrar logos con validación de URL
 * Muestra un placeholder si la URL es inválida o la imagen falla al cargar
 */
export default function LogoImage({
  src,
  alt,
  width = 96,
  height = 96,
  className = "object-contain p-2",
  fallbackClassName = "bg-gray-100",
}: LogoImageProps) {
  const [hasError, setHasError] = useState(false);

  // Validar que sea una URL válida
  const isValidUrl = (): boolean => {
    if (!src || typeof src !== "string" || src.trim() === "") {
      return false;
    }
    try {
      new URL(src);
      return true;
    } catch {
      return false;
    }
  };

  const isValid = isValidUrl();

  if (!isValid || hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg overflow-hidden ${fallbackClassName}`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          minWidth: `${width}px`,
          minHeight: `${height}px`,
        }}
      >
        <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <div
      className="relative rounded-lg overflow-hidden flex-shrink-0"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
      }}
    >
      <Image
        src={src || ""} // Provide a fallback empty string if src is undefined
        alt={alt}
        fill
        className={className}
        onError={() => setHasError(true)}
        sizes={`(max-width: 640px) ${Math.min(width, 64)}px, ${width}px`}
      />
    </div>
  );
}