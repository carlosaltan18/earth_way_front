"use client";
import { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap, Marker, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPoint {
  id: string;
  type: "event" | "report";
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  category?: string;
  status?: string;
}

interface MapWithMarkersProps {
  points?: MapPoint[];
  locations?: MapPoint[];
  initialCenter: [number, number];
  onMapReady?: (map: LeafletMap) => void;
  selectedLocation?: MapPoint | null;
  onLocationSelect?: (location: MapPoint) => void;
}

// Crear iconos personalizados por categoría - Flechitas
const createCustomIcon = (category: string, isSelected: boolean) => {
  const colors: Record<string, string> = {
    reforestation: "#22c55e",
    cleanup: "#3b82f6",
    education: "#a855f7",
    conservation: "#f97316",
  };

  const color = colors[category] || "#22c55e";
  const size = isSelected ? 55 : 55; // ligeramente más grande
  const borderColor = isSelected ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)";
  const borderWidth = isSelected ? 3 : 2;

  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 40" width="${size}" height="${size}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <!-- Sombra de fondo -->
        <circle cx="15" cy="15" r="11" fill="${color}" opacity="0.15" filter="url(#shadow)"/>
        <!-- Punta de flecha (arriba) -->
        <path d="M 15 2 L 23 18 L 15 14 L 7 18 Z" fill="${color}" filter="url(#glow)"/>
        <!-- Borde blanco -->
        <path d="M 15 2 L 23 18 L 15 14 L 7 18 Z" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-linejoin="round"/>
        <!-- Círculo en el centro -->
        <circle cx="15" cy="15" r="8" fill="${color}"/>
        <circle cx="15" cy="15" r="8" fill="none" stroke="white" stroke-width="1.5" opacity="0.7"/>
        <circle cx="15" cy="15" r="4" fill="white"/>
      </svg>
    `)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size + 10],
    className: isSelected ? "selected-marker" : "",
  });
};

export default function MapWithMarkers({
  points = [],
  locations = [],
  initialCenter,
  onMapReady,
  selectedLocation,
  onLocationSelect,
}: MapWithMarkersProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const popupsRef = useRef<Map<string, L.Popup>>(new Map());

  // Usar points o locations
  const allPoints = points.length > 0 ? points : locations;

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Crear mapa
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true, // Permitir scroll con wheel
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
    });

    // Agregar tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 3,
    }).addTo(map);

    mapRef.current = map;
    onMapReady?.(map);

    // Limpiar
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Actualizar marcadores
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => marker.remove());
    popupsRef.current.forEach((popup) => popup.remove());
    markersRef.current.clear();
    popupsRef.current.clear();

    // Agregar nuevos marcadores
    allPoints.forEach((point) => {
      const isSelected = selectedLocation?.id === point.id;
      const icon = createCustomIcon(point.category || "reforestation", isSelected);

      const marker = L.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .on("click", () => {
          onLocationSelect?.(point);
          marker.openPopup();
        });

      // Crear popup
      const popupContent = `
        <div class="leaflet-popup-content-wrapper" style="max-width: 250px;">
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px; color: #1f2937;">
              ${point.title}
            </h3>
            <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">
              ${point.subtitle}
            </p>
            <div style="margin-top: 8px; display: flex; gap: 4px; flex-wrap: wrap;">
              ${
                point.category
                  ? `<span style="display: inline-block; padding: 2px 6px; background-color: #dbeafe; color: #1e40af; border-radius: 4px; font-size: 11px; font-weight: 500;">
                      ${point.category}
                    </span>`
                  : ""
              }
              ${
                point.status
                  ? `<span style="display: inline-block; padding: 2px 6px; background-color: #dcfce7; color: #166534; border-radius: 4px; font-size: 11px; font-weight: 500;">
                      ${point.status}
                    </span>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;

      const popup = L.popup()
        .setContent(popupContent)
        .setLatLng([point.lat, point.lng]);

      marker.bindPopup(popup);

      markersRef.current.set(point.id, marker);
      popupsRef.current.set(point.id, popup);

      // Abrir popup si está seleccionado
      if (isSelected) {
        setTimeout(() => {
          marker.openPopup();
        }, 100);
      }
    });
  }, [points, selectedLocation, onLocationSelect]);

  // Auto-fit bounds cuando hay puntos
  useEffect(() => {
    if (!mapRef.current || allPoints.length === 0) return;

    const map = mapRef.current;
    const bounds = L.latLngBounds(allPoints.map((p) => [p.lat, p.lng]));

    if (allPoints.length === 1) {
      map.setView([allPoints[0].lat, allPoints[0].lng], 14);
    } else {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [allPoints.length]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: "100%" }}
    >
      <style>{`
        .leaflet-container {
          font-family: inherit;
          background-color: #f3f4f6;
        }

        .leaflet-popup {
          animation: popupEnter 0.2s ease-out;
        }

        @keyframes popupEnter {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border: none;
        }

        .leaflet-popup-tip {
          background-color: white;
          border: none;
        }

        .selected-marker {
          filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6));
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
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
          font-size: 18px !important;
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
          font-size: 11px !important;
        }

        .leaflet-tile-pane img {
          filter: brightness(1.1) contrast(0.95) saturate(1.1);
        }

        /* Scroll wheel zoom activo */
        .leaflet-container {
          cursor: grab;
        }

        .leaflet-container.leaflet-touch {
          cursor: grab;
        }

        .leaflet-popup-close-button {
          color: #6b7280 !important;
          font-size: 20px !important;
          line-height: 20px !important;
          padding: 0 4px !important;
        }

        .leaflet-popup-close-button:hover {
          color: #374151 !important;
        }
      `}</style>
    </div>
  );
}