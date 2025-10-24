"use client";
import { useEffect, useRef } from "react";
import L, { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapLocationPickerProps {
  initialCenter?: [number, number];
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  height?: string;
}

// Crear icono personalizado para el marcador de selección
const createMarkerIcon = () => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 40" width="40" height="40">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4"/>
          </filter>
        </defs>
        <!-- Pin principal -->
        <path d="M 15 2 C 8.92 2 4 6.92 4 13 C 4 20 15 36 15 36 C 15 36 26 20 26 13 C 26 6.92 21.08 2 15 2 Z"
              fill="#ef4444" filter="url(#shadow)"/>
        <!-- Borde blanco -->
        <path d="M 15 2 C 8.92 2 4 6.92 4 13 C 4 20 15 36 15 36 C 15 36 26 20 26 13 C 26 6.92 21.08 2 15 2 Z"
              fill="none" stroke="white" stroke-width="2"/>
        <!-- Círculo interior -->
        <circle cx="15" cy="13" r="5" fill="white"/>
      </svg>
    `)}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export default function MapLocationPicker({
  initialCenter = [14.6349, -90.5069], // Guatemala City por defecto
  selectedLocation,
  onLocationSelect,
  height = "300px",
}: MapLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear mapa
    const map = L.map(mapContainerRef.current, {
      center: selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : initialCenter,
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
    });

    // Agregar tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 3,
    }).addTo(map);

    mapRef.current = map;

    // Agregar evento de click en el mapa
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    });

    // Limpiar al desmontar
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Actualizar marcador cuando cambia la ubicación seleccionada
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Eliminar marcador anterior
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Agregar nuevo marcador si hay ubicación seleccionada
    if (selectedLocation) {
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: createMarkerIcon(),
        draggable: true,
      }).addTo(map);

      // Permitir arrastrar el marcador
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onLocationSelect({ lat: position.lat, lng: position.lng });
      });

      markerRef.current = marker;

      // Centrar el mapa en la ubicación
      map.setView([selectedLocation.lat, selectedLocation.lng], map.getZoom());
    }
  }, [selectedLocation, onLocationSelect]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="w-full rounded-lg overflow-hidden border border-gray-300"
        style={{ height }}
      />
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-md text-xs text-gray-700 z-[1000]">
        {selectedLocation
          ? `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
          : "Haz clic en el mapa para seleccionar una ubicación"}
      </div>
      <style>{`
        .leaflet-container {
          font-family: inherit;
          background-color: #f3f4f6;
        }

        .leaflet-control-zoom {
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
          background-color: white !important;
        }

        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          background-color: white !important;
          border-bottom: 1px solid #e5e7eb !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 16px !important;
          color: #059669 !important;
          font-weight: bold !important;
          transition: all 0.2s;
        }

        .leaflet-control-zoom-in:hover,
        .leaflet-control-zoom-out:hover {
          background-color: #f0fdf4 !important;
          color: #047857 !important;
        }

        .leaflet-control-zoom-out {
          border-bottom: none !important;
        }

        .leaflet-control-attribution {
          background-color: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(4px);
          border-radius: 4px;
          padding: 4px 6px !important;
          font-size: 10px !important;
        }

        .leaflet-tile-pane img {
          filter: brightness(1.1) contrast(0.95) saturate(1.1);
        }

        .leaflet-container {
          cursor: crosshair;
        }

        .leaflet-marker-draggable {
          cursor: move;
        }
      `}</style>
    </div>
  );
}
