"use client";
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";

// Fix para los iconos de Leaflet
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });
}

type Point = {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  subtitle?: string;
  type?: string;
};

interface MapControllerProps {
  onMapReady: (map: LeafletMap) => void;
}

function MapController({ onMapReady }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  return null;
}

interface MapWithMarkersProps {
  points: Point[];
  initialCenter: [number, number];
  onMapReady?: (map: LeafletMap) => void;
}

export default function MapWithMarkers({
  points,
  initialCenter,
  onMapReady,
}: MapWithMarkersProps) {
  const handleMapReady = (map: LeafletMap) => {
    if (onMapReady) {
      onMapReady(map);
    }
  };

  return (
    <div style={{ height: "500px", width: "500px" }}>
      <MapContainer
        style={{ height: "100%" }}
        center={initialCenter}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng] as [number, number]}>
            <Popup>
              <strong>{p.title}</strong>
              <div className="text-xs text-gray-600">{p.subtitle}</div>
              <div className="text-xs mt-1">{p.type}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
