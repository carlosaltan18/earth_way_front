"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Layout from "@/components/layout/Layout"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Users, Search, Filter, Plus } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: {
    lat: number
    lng: number
    address: string
  }
  organizationId: string
  organizationName: string
  participants: string[]
  maxParticipants?: number
  finished: boolean
  category: "reforestation" | "cleanup" | "education" | "conservation"
  images?: string[]
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: "1",
    name: "Reforestación Cerro Verde",
    description:
      "Jornada de plantación de árboles nativos en el Cerro Verde. Incluye desayuno, herramientas y transporte desde el centro de la ciudad.",
    date: "2024-02-15",
    location: {
      lat: -12.0464,
      lng: -77.0428,
      address: "Cerro Verde, Lima, Perú",
    },
    organizationId: "1",
    organizationName: "EcoLima",
    participants: ["1", "2"],
    maxParticipants: 50,
    finished: false,
    category: "reforestation",
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "2",
    name: "Limpieza Playa Costa Verde",
    description:
      "Actividad de limpieza y concientización ambiental en la Costa Verde. Actividad familiar con materiales incluidos.",
    date: "2024-02-20",
    location: {
      lat: -12.1167,
      lng: -77.0167,
      address: "Costa Verde, Miraflores, Lima",
    },
    organizationId: "2",
    organizationName: "OceanGuard",
    participants: ["3"],
    maxParticipants: 30,
    finished: false,
    category: "cleanup",
    images: ["/placeholder.svg?height=300&width=500"],
  },
  {
    id: "3",
    name: "Taller de Compostaje",
    description: "Aprende técnicas de compostaje urbano y sostenibilidad doméstica. Incluye kit básico de compostaje.",
    date: "2024-01-10",
    location: {
      lat: -12.05,
      lng: -77.05,
      address: "Centro Comunitario San Isidro",
    },
    organizationId: "1",
    organizationName: "EcoLima",
    participants: ["1", "2", "3"],
    maxParticipants: 20,
    finished: true,
    category: "education",
    images: ["/placeholder.svg?height=300&width=500"],
  },
]

const categoryLabels = {
  reforestation: "Reforestación",
  cleanup: "Limpieza",
  education: "Educación",
  conservation: "Conservación",
}

const categoryColors = {
  reforestation: "bg-green-100 text-green-800",
  cleanup: "bg-blue-100 text-blue-800",
  education: "bg-purple-100 text-purple-800",
  conservation: "bg-orange-100 text-orange-800",
}

export default function EventsPage() {
  const { user, hasRole } = useAuth()
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "finished">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false)

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizationName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "upcoming" && !event.finished) ||
      (statusFilter === "finished" && event.finished)

    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleJoinEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (!event || !user) return

    if (event.participants.includes(user.id)) {
      toast({
        title: "Ya estás registrado",
        description: "Ya te has unido a este evento.",
        variant: "destructive",
      })
      return
    }

    if (event.maxParticipants && event.participants.length >= event.maxParticipants) {
      toast({
        title: "Evento lleno",
        description: "Este evento ha alcanzado el máximo de participantes.",
        variant: "destructive",
      })
      return
    }

    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, participants: [...e.participants, user.id] } : e)))

    toast({
      title: "¡Te has unido al evento!",
      description: `Te has registrado exitosamente para "${event.name}".`,
    })
  }

  const handleLeaveEvent = (eventId: string) => {
    if (!user) return

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, participants: e.participants.filter((p) => p !== user.id) } : e)),
    )

    toast({
      title: "Has salido del evento",
      description: "Tu registro ha sido cancelado exitosamente.",
    })
  }

  const isUserJoined = (event: Event) => {
    return user ? event.participants.includes(user.id) : false
  }

  const isEventFull = (event: Event) => {
    return event.maxParticipants ? event.participants.length >= event.maxParticipants : false
  }

  const canCreateEvent = () => {
    return hasRole("ROLE_ORGANIZATION")
  }

  const canEditEvent = (event: Event) => {
    return hasRole("ROLE_ORGANIZATION") && user?.organizationId === event.organizationId
  }

  const canJoinEvent = () => {
    return hasRole("ROLE_USER") || hasRole("ROLE_ORGANIZATION")
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Eventos Ambientales</h1>
            <p className="text-gray-600 mt-2">Descubre y participa en eventos de reforestación y conservación</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los eventos</SelectItem>
                <SelectItem value="upcoming">Próximos</SelectItem>
                <SelectItem value="finished">Finalizados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="reforestation">Reforestación</SelectItem>
                <SelectItem value="cleanup">Limpieza</SelectItem>
                <SelectItem value="education">Educación</SelectItem>
                <SelectItem value="conservation">Conservación</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""}
            </div>
          </div>

          {canCreateEvent() && (
            <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Crear Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear un nuevo evento</DialogTitle>
                  <DialogDescription>Completa el formulario para crear un evento.</DialogDescription>
                </DialogHeader>
                {/* ... event creation form */}
              </DialogContent>
            </Dialog>
          )}

          {/* Events Grid */}
          <div className="grid gap-6">
            {filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">
                    No se encontraron eventos que coincidan con los filtros seleccionados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className={`hover:shadow-md transition-shadow ${event.finished ? "opacity-75" : ""}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{event.name}</CardTitle>
                          <Badge className={categoryColors[event.category]}>{categoryLabels[event.category]}</Badge>
                          {event.finished && <Badge variant="secondary">Finalizado</Badge>}
                        </div>
                        <CardDescription className="mb-4">{event.description}</CardDescription>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString("es-ES")}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location.address}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.participants.length}
                            {event.maxParticipants && ` / ${event.maxParticipants}`} participantes
                          </div>
                          <div className="text-green-600 font-medium">{event.organizationName}</div>
                        </div>
                      </div>

                      {!event.finished && canJoinEvent() && (
                        <div className="ml-4">
                          {isUserJoined(event) ? (
                            <Button
                              variant="outline"
                              onClick={() => handleLeaveEvent(event.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Salir del Evento
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleJoinEvent(event.id)}
                              disabled={isEventFull(event)}
                              className={isEventFull(event) ? "opacity-50 cursor-not-allowed" : ""}
                            >
                              {isEventFull(event) ? "Evento Lleno" : "Unirse"}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  {event.images && event.images.length > 0 && (
                    <div className="px-6">
                      <img
                        src={event.images[0] || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    </div>
                  )}
                  <CardContent className="pt-0">{/* El resto del contenido permanece igual */}</CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
