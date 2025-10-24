"use client";
import { useState, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Map as LeafletMap } from "leaflet";
import { useAuth } from "@/contexts/AuthContext";
import { useGetEvents } from "@/features/event/queries";
import { useGetReports } from "@/features/report/queries";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Calendar, Users, TreePine, Trash2, GraduationCap, Shield } from "lucide-react";

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
  const [mapReady, setMapReady] = useState(false);

  // Filters and selected event state (for sidebar)
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);

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

  // Minimal event shape used by the UI
  interface MapEvent {
    id: string;
    name?: string;
    direction?: string;
    description?: string;
    latitude?: number | string;
    longitude?: number | string;
    date?: string;
    organizationName?: string;
    status?: string;
    participants?: number;
  }

  type Point = {
    id: string;
    type: "event" | "report";
    title?: string;
    subtitle?: string;
    lat: number;
    lng: number;
    raw?: MapEvent;
  };

  // Crear puntos del mapa (tipado seguro y flexible según la forma de respuesta)
  const points = useMemo<Point[]>(() => {
    if (!queryEvents.data) return [];
    const raw = queryEvents.data;
    // soportar diferentes formas: array directo, { payload: [...] } o { items: [...] }
    const items: any[] = Array.isArray(raw)
      ? raw
      : (raw as any)?.payload ?? (raw as any)?.items ?? [];

    const eventPoints = items
      .filter((e) => e?.latitude != null && e?.longitude != null)
      .map((e) => ({
        id: `event-${e.id}`,
        type: "event" as const,
        title: e.name || "Evento sin nombre",
        subtitle: e.direction || e.description || "",
        lat: Number(e.latitude),
        lng: Number(e.longitude),
        raw: e as MapEvent,
      }));

    return eventPoints;
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

  // Callback para cuando el mapa esté listo
  const handleMapReady = useCallback((map: LeafletMap) => {
    if (mapInstanceRef.current) return;
    mapInstanceRef.current = map;
    setMapReady(true);
  }, []);

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
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mapa Interactivo</h1>
          <p className="text-gray-600 mt-2">Visualiza eventos y reportes ambientales geolocalizados.</p>
        </div>

        {!isAuthenticated && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-green-700 mb-3">
                  <strong>¿Quieres participar en eventos?</strong> Regístrate para unirte a la comunidad.
                </p>
                <div className="flex justify-center gap-3">
                  <Button asChild variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent">
                    <a href="/auth/login">Iniciar Sesión</a>
                  </Button>
                  <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                    <a href="/auth/register">Registrarse</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Mapa de Eventos y Reportes</CardTitle>
                <CardDescription>Ubicaciones de eventos, reportes de reforestación y conservación</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full h-[500px] bg-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
                  <MapComponentDynamic points={points} initialCenter={initialCenter} onMapReady={handleMapReady} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="reforestation">Reforestación</SelectItem>
                      <SelectItem value="cleanup">Limpieza</SelectItem>
                      <SelectItem value="education">Educación</SelectItem>
                      <SelectItem value="conservation">Conservación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Estado</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="completed">Completados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Eventos ({points.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {points.map((p) => {
                  return (
                    <div key={p.id} className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${selectedEvent?.id === p.raw?.id ? "border-green-500 bg-green-50" : "border-gray-200"}`} onClick={() => { setSelectedEvent(p.raw ?? null); focusOn(p.lat, p.lng); }}>
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{p.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{p.subtitle}</p>
                          <p className="text-xs text-gray-500 mt-1">Coordenadas: {p.lat.toFixed(4)}, {p.lng.toFixed(4)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {points.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay eventos que coincidan con los filtros</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Event Details */}
            {selectedEvent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedEvent.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedEvent.direction}</span>
                    </div>
                    {selectedEvent.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(selectedEvent.date).toLocaleDateString("es-ES")}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{selectedEvent.participants ?? 0} participantes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span>{selectedEvent.organizationName}</span>
                    </div>
                  </div>

                  {selectedEvent.status === "active" && (
                    <Button className="w-full mt-4" asChild>
                      <a href="/events">Ver Detalles del Evento</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
