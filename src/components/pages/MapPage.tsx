"use client";
import { useState, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Map as LeafletMap } from "leaflet";
import { useAuth } from "@/contexts/AuthContext";
import { useGetEvents } from "@/features/event/queries";
import { useGetReports } from "@/features/report/queries";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, TreePine, Trash2, GraduationCap, Shield, User, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

// Importación dinámica del mapa
const MapComponentDynamic = dynamic(
  () => import("@/components/map/MapWithMarkers"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-500 mt-3">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
) as any;

interface MapPoint {
  id: string;
  type: "event" | "report";
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  category?: Category;
  status?: Status;
  date?: string;
  organizationName?: string;
  author?: string;
  done?: boolean;
  raw: any;
}

type Category = "reforestation" | "cleanup" | "education" | "conservation";
type Status = "active" | "completed" | "pending";

const categoryIcons: Record<Category, any> = {
  reforestation: TreePine,
  cleanup: Trash2,
  education: GraduationCap,
  conservation: Shield,
};

const categoryColors: Record<Category, string> = {
  reforestation: "bg-green-100 text-green-800",
  cleanup: "bg-blue-100 text-blue-800",
  education: "bg-purple-100 text-purple-800",
  conservation: "bg-orange-100 text-orange-800",
};

const statusColors: Record<Status, string> = {
  active: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<Status, string> = {
  active: "Activo",
  completed: "Completado",
  pending: "Pendiente",
};

export default function MapPage() {
  const { user, isAuthenticated } = useAuth();
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [filterType, setFilterType] = useState<"all" | "event" | "report">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Obtener datos
  const queryEvents = useGetEvents();
  const queryReports = useGetReports();

  // Crear puntos del mapa
  const points = useMemo(() => {
    const eventPoints = queryEvents.data?.payload
      ? queryEvents.data.payload
          .filter((e: any) => e?.latitude != null && e?.longitude != null)
          .map((e: any) => ({
            id: `event-${e.id}`,
            type: "event" as const,
            title: e.name || "Evento sin nombre",
            subtitle: e.direction || e.description || "",
            lat: Number(e.latitude),
            lng: Number(e.longitude),
            category: e.category || "reforestation",
            status: e.status || "active",
            date: e.date,
            organizationName: e.organizationName,
            raw: e,
          }))
      : [];

    const reportPoints = queryReports.data?.content
      ? queryReports.data.content
          .filter((r: any) => r?.location?.latitude != null && r?.location?.longitude != null)
          .map((r: any) => ({
            id: `report-${r.id}`,
            type: "report" as const,
            title: r.title || "Reporte sin título",
            subtitle: r.description || "",
            lat: Number(r.location.latitude),
            lng: Number(r.location.longitude),
            date: r.date,
            author: r.author,
            done: r.done,
            raw: r,
          }))
      : [];

    return [...eventPoints, ...reportPoints];
  }, [queryEvents.data, queryReports.data]);

  // Filtrar puntos
  const filteredPoints = useMemo(() => {
    return points.filter((p) => {
      const typeMatch = filterType === "all" || p.type === filterType;
      //const categoryMatch = filterCategory === "all" || p.category === filterCategory;
      return typeMatch;
    });
  }, [points, filterType, filterCategory]);

  // Centro inicial
  const initialCenter: [number, number] = useMemo(() => {
    if (points.length > 0) {
      return [points[0].lat, points[0].lng];
    }
    return [-12.0464, -77.0428];
  }, [points]);

  // Enfocar en un punto
  const focusOn = useCallback((lat: number, lng: number, zoom = 15) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], zoom, {
        animate: true,
        duration: 0.5,
      });
    }
  }, []);

  const handlePointSelect = useCallback((point: MapPoint) => {
    setSelectedPoint(point);
    focusOn(point.lat, point.lng);
  }, [focusOn]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mapa Interactivo</h1>
          <p className="text-gray-600 mt-2">
            Visualiza eventos ambientales geolocalizados en tiempo real
          </p>
        </div>

        {!isAuthenticated && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-green-700 mb-3">
                  <strong>¿Quieres reportar eventos ambientales?</strong> Regístrate para contribuir con la comunidad.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
                  >
                    <Link href="/auth/login">Iniciar Sesión</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                    <Link href="/auth/register">Registrarse</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa Principal */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Mapa de Eventos y Reportes</CardTitle>
                <CardDescription>Ubicaciones de actividades ambientales</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0 border-t overflow-hidden">
                <MapComponentDynamic
                  points={filteredPoints}
                  initialCenter={initialCenter}
                  onMapReady={(map: LeafletMap) => {
                    mapInstanceRef.current = map;
                  }}
                  selectedLocation={selectedPoint}
                  onLocationSelect={handlePointSelect}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo</label>
                  <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="event">Eventos</SelectItem>
                      <SelectItem value="report">Reportes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Ubicaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ubicaciones ({filteredPoints.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {(queryEvents.isLoading || queryReports.isLoading) ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="text-gray-500 mt-3 text-sm">Cargando datos...</p>
                  </div>
                ) : filteredPoints.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay ubicaciones disponibles</p>
                  </div>
                ) : (
                  filteredPoints.map((point) => {
                    //const category = (point.category || "reforestation") as Category;
                    //const IconComponent = point.type === "event" ? categoryIcons[category] : MapPin;
                    return (
                      <div
                        key={point.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedPoint?.id === point.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => handlePointSelect(point)}
                      >
                        <div className="flex items-start gap-3">
                          {/* <div className="p-2 rounded-lg bg-gray-100">
                            <IconComponent className="h-4 w-4 text-gray-600" />
                          </div> */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{point.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{point.subtitle}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {point.type === "event" && point.category && (
                                <Badge className={`text-xs ${categoryColors[point.category as Category]}`}>
                                  {point.category}
                                </Badge>
                              )}
                              {point.type === "event" && point.status && (
                                <Badge className={`text-xs ${statusColors[point.status as Status]}`}>
                                  {statusLabels[point.status as Status]}
                                </Badge>
                              )}
                              {point.type === "report" && (
                                <>
                                  <Badge className="text-xs bg-blue-100 text-blue-800">
                                    Reporte
                                  </Badge>
                                  {point.done !== undefined && (
                                    <Badge className={`text-xs ${point.done ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                      {point.done ? "Resuelto" : "Pendiente"}
                                    </Badge>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Detalles de la Ubicación Seleccionada */}
            {selectedPoint && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedPoint.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    {selectedPoint.type === "event" && selectedPoint.category && (
                      <Badge className={categoryColors[selectedPoint.category]}>
                        {selectedPoint.category}
                      </Badge>
                    )}
                    {selectedPoint.type === "event" && selectedPoint.status && (
                      <Badge className={statusColors[selectedPoint.status]}>
                        {statusLabels[selectedPoint.status]}
                      </Badge>
                    )}
                    {selectedPoint.type === "report" && (
                      <>
                        <Badge className="bg-blue-100 text-blue-800">
                          Reporte
                        </Badge>
                        {selectedPoint.done !== undefined && (
                          <Badge className={selectedPoint.done ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {selectedPoint.done ? "Resuelto" : "Pendiente"}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{selectedPoint.subtitle}</p>

                  <div className="space-y-2 text-sm">
                    {selectedPoint.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(selectedPoint.date).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    )}
                    {selectedPoint.type === "event" && selectedPoint.organizationName && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{selectedPoint.organizationName}</span>
                      </div>
                    )}
                    {selectedPoint.type === "report" && selectedPoint.author && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{selectedPoint.author}</span>
                      </div>
                    )}
                    {selectedPoint.type === "report" && selectedPoint.done !== undefined && (
                      <div className="flex items-center gap-2">
                        {selectedPoint.done ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className={selectedPoint.done ? "text-green-600" : "text-yellow-600"}>
                          {selectedPoint.done ? "Reporte resuelto" : "Esperando resolución"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {selectedPoint.type === "event" && selectedPoint.status === "active" && (
                    <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      Ver Detalles del Evento
                    </Button>
                  )}
                  {selectedPoint.type === "report" && (
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      Ver Detalles del Reporte
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