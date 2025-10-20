"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapLocation {
  id: string
  name: string
  type: "event" | "report"
  category: "reforestation" | "cleanup" | "education" | "conservation"
  lat: number
  lng: number
  address: string
  date: string
  description: string
  organizationName?: string
  status: "active" | "completed" | "pending"
}

interface MapWithMarkersProps {
  locations: MapLocation[]
  selectedLocation: MapLocation | null
  onLocationSelect: (location: MapLocation) => void
}

const categoryMarkerColors = {
  reforestation: "#22c55e",
  cleanup: "#3b82f6",
  education: "#a855f7",
  conservation: "#f97316",
}

function createMarkerIcon(category: string, isSelected: boolean = false) {
  const color = categoryMarkerColors[category as keyof typeof categoryMarkerColors] || "#22c55e"
  const size = isSelected ? 40 : 32

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        font-weight: bold;
        border: 3px solid white;
        cursor: pointer;
        box-shadow: ${isSelected ? `0 0 0 3px ${color}` : "0 2px 8px rgba(0,0,0,0.3)"};
        transition: all 0.2s ease;
      ">
        ${category.includes("event") ? "📍" : "⚠️"}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
    className: "custom-marker",
  })
}

export default function MapWithMarkers({
  locations,
  selectedLocation,
  onLocationSelect,
}: MapWithMarkersProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = L.map(mapContainer.current).setView([-12.0464, -77.0428], 12)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map.current)

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Actualizar marcadores
  useEffect(() => {
    if (!map.current) return

    // Limpiar marcadores antiguos
    Object.values(markersRef.current).forEach((marker) => marker.remove())
    markersRef.current = {}

    // Agregar nuevos marcadores
    locations.forEach((location) => {
      const icon = createMarkerIcon(
        location.category,
        selectedLocation?.id === location.id
      )

      const marker = L.marker([location.lat, location.lng], { icon }).addTo(
        map.current!
      )

      marker.bindPopup(`
        <div style="font-family: system-ui; width: 250px;">
          <h4 style="font-weight: 600; margin: 0 0 8px 0; font-size: 14px;">${location.name}</h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${location.description}</p>
          <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Dirección:</strong> ${location.address}</p>
          <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Fecha:</strong> ${new Date(location.date).toLocaleDateString("es-ES")}</p>
          ${location.organizationName ? `<p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Organización:</strong> ${location.organizationName}</p>` : ""}
        </div>
      `)

      marker.on("click", () => onLocationSelect(location))

      markersRef.current[location.id] = marker
    })
  }, [locations, selectedLocation, onLocationSelect])

  // Centrar en ubicación seleccionada
  useEffect(() => {
    if (!map.current || !selectedLocation) return

    map.current.setView(
      [selectedLocation.lat, selectedLocation.lng],
      14,
      { animate: true }
    )
  }, [selectedLocation])

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "0 0 8px 8px",
      }}
    />
  )
}