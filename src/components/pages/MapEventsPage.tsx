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

interface MapEvent {
  id: string
  name: string
  category: "reforestation" | "cleanup" | "education" | "conservation"
  lat: number
  lng: number
  address: string
  date: string
  description: string
  organizationName: string
  status: "active" | "completed"
  participants: number
}

// Mock events data for map
const mockMapEvents: MapEvent[] = [
  {
    id: "1",
    name: "Reforestación Cerro Verde",
    category: "reforestation",
    lat: -12.0464,
    lng: -77.0428,
    address: "Cerro Verde, Lima, Perú",
    date: "2024-02-15",
    description: "Jornada de plantación de árboles nativos",
    organizationName: "EcoLima",
    status: "active",
    participants: 25,
  },
  {
    id: "2",
    name: "Limpieza Playa Costa Verde",
    category: "cleanup",
    lat: -12.1167,
    lng: -77.0167,
    address: "Costa Verde, Miraflores, Lima",
    date: "2024-02-20",
    description: "Actividad de limpieza y concientización ambiental",
    organizationName: "OceanGuard",
    status: "active",
    participants: 18,
  },
  {
    id: "3",
    name: "Taller de Compostaje Completado",
    category: "education",
    lat: -12.05,
    lng: -77.05,
    address: "Centro Comunitario San Isidro",
    date: "2024-01-10",
    description: "Taller educativo sobre compostaje urbano",
    organizationName: "Verde Comunitario",
    status: "completed",
    participants: 32,
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
}

const statusLabels = {
  active: "Activo",
  completed: "Completado",
}

export default function MapEventsPage() {
  const { isAuthenticated } = useAuth()
  const [events] = useState<MapEvent[]>(mockMapEvents)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null)

  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus
    return matchesCategory && matchesStatus
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mapa de Eventos</h1>
          <p className="text-gray-600 mt-2">Visualiza eventos ambientales geolocalizados</p>
        </div>

        {!isAuthenticated && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-green-700 mb-3">
                  <strong>¿Quieres participar en eventos?</strong> Regístrate para unirte a la comunidad.
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
                <CardTitle>Mapa de Eventos Ambientales</CardTitle>
                <CardDescription>Ubicaciones de eventos de reforestación y conservación</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="w-full h-[500px] bg-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
                  <div className="text-center">
                    <TreePine className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <p className="text-green-600 text-lg font-medium">Mapa de Eventos</p>
                    <p className="text-green-500 text-sm mt-2">Integración con Leaflet/Google Maps</p>
                    <p className="text-green-500 text-sm">Mostrando {filteredEvents.length} eventos</p>
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
                <CardTitle>Eventos ({filteredEvents.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredEvents.map((event) => {
                  const IconComponent = categoryIcons[event.category]
                  return (
                    <div
                      key={event.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedEvent?.id === event.id ? "border-green-500 bg-green-50" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{event.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{event.address}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs ${categoryColors[event.category]}`}>{event.category}</Badge>
                            <Badge className={`text-xs ${statusColors[event.status]}`}>
                              {statusLabels[event.status]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {filteredEvents.length === 0 && (
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
                  <div className="flex gap-2">
                    <Badge className={categoryColors[selectedEvent.category]}>{selectedEvent.category}</Badge>
                    <Badge className={statusColors[selectedEvent.status]}>{statusLabels[selectedEvent.status]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedEvent.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(selectedEvent.date).toLocaleDateString("es-ES")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{selectedEvent.participants} participantes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span>{selectedEvent.organizationName}</span>
                    </div>
                  </div>

                  {selectedEvent.status === "active" && (
                    <Button className="w-full mt-4" asChild>
                      <Link href="/events">Ver Detalles del Evento</Link>
                    </Button>
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
