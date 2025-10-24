"use client";
import { useState, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Map as LeafletMap } from "leaflet";
import { useAuth } from "@/contexts/AuthContext";
import { useGetEvents } from "@/features/event/queries";
import { useGetReports } from "@/features/report/queries";

// Importación dinámica
const MapComponentDynamic = dynamic(
  () => import("@/components/map/MapWithMarkers"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-600 mt-3">Inicializando mapa...</p>
        </div>
      </div>
    ),
  }
);

/* const MapComponentDynamic = function MapComponentDynamic(props: any) {
  return(
    <div>hola</div>
  )
} */

export default function MapPage() {
  const { user, isAuthenticated } = useAuth();
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  // Obtener datos
  const queryEvents = useGetEvents();
  /* const { data: reportsResponse, isLoading: loadingReports } =
    useGetReports?.() ?? { data: undefined, isLoading: false }; */

  // Normalizar datos

  /* const reports = useMemo(() => {
    if (!reportsResponse) return [];
    return Array.isArray(reportsResponse)
      ? reportsResponse
      : (reportsResponse as any)?.items ?? [];
  }, [reportsResponse]); */

  // Crear puntos del mapa
  const points = useMemo(() => {
    if (!queryEvents.data) return [];
    console.log("Datos de eventos:", queryEvents.data);
    const eventPoints = queryEvents.data.payload
      .filter((e: any) => e?.latitude != null && e?.longitude != null)
      .map((e: any) => ({
        id: `event-${e.id}`,
        type: "event" as const,
        title: e.name || "Evento sin nombre",
        subtitle: e.direction || e.description || "",
        lat: Number(e.latitude),
        lng: Number(e.longitude),
        raw: e,
      }));

    /* const reportPoints = reports
      .filter((r: any) => r?.latitude != null && r?.longitude != null)
      .map((r: any) => ({
        id: `report-${r.id}`,
        type: "report" as const,
        title: r.title || `Reporte ${r.id}`,
        subtitle: r.description || "",
        lat: Number(r.latitude),
        lng: Number(r.longitude),
        raw: r,
      })); */

    return [...eventPoints];
  }, [queryEvents.data]);

  // Centro inicial
  const initialCenter: [number, number] = useMemo(() => {
    if (points.length > 0) {
      return [points[0].lat, points[0].lng];
    }
    // Coordenadas de Lima, Perú por defecto
    return [-12.0464, -77.0428];
  }, [points]);

  // Callback para cuando el mapa esté listo
  /* const handleMapReady = useCallback((map: LeafletMap) => {
    mapInstanceRef.current = map;
    setMapReady(true);
    console.log("Mapa inicializado correctamente");
  }, []); */

  // Función para enfocar en un punto
  const focusOn = useCallback((lat: number, lng: number, zoom = 15) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], zoom, {
        animate: true,
        duration: 0.5,
      });
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Lista lateral */}
      <aside className="w-80 overflow-y-auto border-r bg-white shadow-sm">
        <div className="p-4">
          <div className="mb-4">
            <h2 className="font-bold text-xl text-gray-900">
              Mapa Interactivo
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Ubicaciones ({points.length})
            </p>
          </div>

          {queryEvents.isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="text-gray-500 mt-3">Cargando datos...</p>
            </div>
          ) : points.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p className="text-gray-500 mt-3">
                No hay ubicaciones disponibles
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {points.map((p) => (
                <button
                  key={p.id}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-500 transition-all duration-200 group"
                  onClick={() => focusOn(p.lat, p.lng)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 p-2 rounded-lg ${
                        p.type === "event" ? "bg-blue-100" : "bg-orange-100"
                      }`}
                    >
                      <svg
                        className={`h-4 w-4 ${
                          p.type === "event"
                            ? "text-blue-600"
                            : "text-orange-600"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                        {p.title}
                      </div>
                      {p.subtitle && (
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {p.subtitle}
                        </div>
                      )}
                      <div
                        className={`inline-block text-xs font-medium mt-2 px-2 py-1 rounded ${
                          p.type === "event"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {p.type === "event" ? "Evento" : "Reporte"}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Mapa */}
      <main className="flex-1 relative">
        <MapComponentDynamic
          points={points}
          initialCenter={initialCenter}
          onMapReady={() => {}}
        />
      </main>
    </div>
  );
}
