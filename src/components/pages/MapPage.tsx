"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Users, TreePine, Trash2, GraduationCap, Shield } from "lucide-react"

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

// Mock map data
const mockLocations: MapLocation[] = [
  {
    id: "1",
    name: "Reforestación Cerro Verde",
    type: "event",
    category: "reforestation",
    lat: -12.0464,
    lng: -77.0428,
    address: "Cerro Verde, Lima, Perú",
    date: "2024-02-15",
    description: "Jornada de plantación de árboles nativos",
    organizationName: "EcoLima",
    status: "active",
  },
  {
    id: "2",
    name: "Limpieza Playa Costa Verde",
    type: "event",
    category: "cleanup",
    lat: -12.1167,
    lng: -77.0167,
    address: "Costa Verde, Miraflores, Lima",
    date: "2024-02-20",
    description: "Actividad de limpieza y concientización ambiental",
    organizationName: "OceanGuard",
    status: "active",
  },
  {
    id: "3",
    name: "Deforestación Ilegal Detectada",
    type: "report",
    category: "conservation",
    lat: -12.2,
    lng: -77.1,
    address: "Zona Protegida Norte",
    date: "2024-01-25",
    description: "Reporte de tala ilegal en zona protegida",
    status: "pending",
  },
  {
    id: "4",
    name: "Contaminación Río Rímac",
    type: "report",
    category: "cleanup",
    lat: -12.03,
    lng: -77.08,
    address: "Río Rímac, Sector Industrial",
    date: "2024-01-20",
    description: "Vertido de residuos industriales detectado",
    status: "pending",
  },
]

const categoryIcons = {
  reforestation: TreePine,
  cleanup: Trash2,
  education: GraduationCap,
  conservation: Shield,
}

const categoryColors = {
  reforestation: "bg-green-100 text-green-800",
  cleanup: "bg-blue-100 text-blue-800",
  education: "bg-purple-100 text-purple-800",
  conservation: "bg-orange-100 text-orange-800",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
}

const statusLabels = {
  active: "Activo",
  completed: "Completado",
  pending: "Pendiente",
}

export default function MapPage() {
  const { user, isAuthenticated } = useAuth()
  const [locations, setLocations] = useState<MapLocation[]>(mockLocations)
  const [selectedType, setSelectedType] = useState<"all" | "event" | "report">("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)

  const filteredLocations = locations.filter((location) => {
    const matchesType = selectedType === "all" || location.type === selectedType
    const matchesCategory = selectedCategory === "all" || location.category === selectedCategory
    return matchesType && matchesCategory
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mapa Interactivo</h1>
          <p className="text-gray-600 mt-2">Visualiza eventos ambientales y reportes geolocalizados en tiempo real</p>
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
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Mapa de Eventos y Reportes</CardTitle>
                <CardDescription>Mapa interactivo con ubicaciones de eventos y reportes ambientales</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">Mapa Interactivo</p>
                    <p className="text-gray-400 text-sm mt-2">Aquí se integraría Leaflet o Google Maps</p>
                    <p className="text-gray-400 text-sm">Mostrando {filteredLocations.length} ubicaciones</p>
                  </div>
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
                  <label className="text-sm font-medium mb-2 block">Tipo</label>
                  <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
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
              </CardContent>
            </Card>

            {/* Locations List */}
            <Card>
              <CardHeader>
                <CardTitle>Ubicaciones ({filteredLocations.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredLocations.map((location) => {
                  const IconComponent = categoryIcons[location.category]
                  return (
                    <div
                      key={location.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedLocation?.id === location.id ? "border-green-500 bg-green-50" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{location.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{location.address}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs ${categoryColors[location.category]}`}>
                              {location.category}
                            </Badge>
                            <Badge className={`text-xs ${statusColors[location.status]}`}>
                              {statusLabels[location.status]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredLocations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay ubicaciones que coincidan con los filtros</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Location Details */}
            {selectedLocation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedLocation.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={categoryColors[selectedLocation.category]}>{selectedLocation.category}</Badge>
                    <Badge className={statusColors[selectedLocation.status]}>
                      {statusLabels[selectedLocation.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{selectedLocation.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedLocation.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(selectedLocation.date).toLocaleDateString("es-ES")}</span>
                    </div>
                    {selectedLocation.organizationName && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{selectedLocation.organizationName}</span>
                      </div>
                    )}
                  </div>

                  {selectedLocation.type === "event" && selectedLocation.status === "active" && (
                    <Button className="w-full mt-4">Ver Detalles del Evento</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
