"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, Search, Filter, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreateEventForm } from "@/components/events/CreateEventForm";
import type { Event as ApiEvent } from "@/features/event/types";
import {
  useGetEvents,
  useDeleteEvent,
  useUpdateEvent,
  useAddParticipant,
  useDeleteParticipant,
  useGetParticipants,
} from "@/features/event/queries";
import { eventApi } from "@/features/event/api";

import { Textarea } from "@/components/ui/textarea"


// We are using the API types (ApiEvent) and React Query hooks to load real events

const categoryLabels = {
  reforestation: "Reforestación",
  cleanup: "Limpieza",
  education: "Educación",
  conservation: "Conservación",
};

const categoryColors = {
  reforestation: "bg-green-100 text-green-800",
  cleanup: "bg-blue-100 text-blue-800",
  education: "bg-purple-100 text-purple-800",
  conservation: "bg-orange-100 text-orange-800",
};

export default function EventsPage() {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "finished"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    direction: "",
    date: "",
    latitude: 0,
    longitude: 0,
    finished: false,
  });

  const userOrganizationId = user?.organizationId
    ? Number(user.organizationId)
    : undefined;

  // React Query hooks
  const { data: eventsResp, isLoading, isError } = useGetEvents();
  const deleteMutation = useDeleteEvent();
  const updateMutation = useUpdateEvent();
  const addParticipantMutation = useAddParticipant();
  const deleteParticipantMutation = useDeleteParticipant();
  
  // State to track which events the user is participating in
  const [userParticipatingEvents, setUserParticipatingEvents] = useState<Set<number>>(new Set());

  // Per-event loading states so only the clicked button shows loading
  const [joinLoadingId, setJoinLoadingId] = useState<number | null>(null);
  const [leaveLoadingId, setLeaveLoadingId] = useState<number | null>(null);
  
  // Trigger to re-check participation after mutations
  const [refreshParticipation, setRefreshParticipation] = useState(0);

  // normalize list
  const events: ApiEvent[] =
    (eventsResp && ((eventsResp as any).payload || (eventsResp as any).events)) ||
    [];

  // Load participants for each event to check if user is participating
   useEffect(() => {
    // Only attempt to check participation when we have an authenticated user id
    if (!user?.id) return;

    const checkUserParticipation = async () => {
      const participatingEvents = new Set<number>();
      
      for (const event of events) {
        const eventId = Number(event.id);
        try {
          // Use the existing API client to fetch participants (includes auth headers)
          const participants = await eventApi.getParticipants(eventId);

          if (Array.isArray(participants)) {
            const isParticipating = participants.some((p: any) => p.userId === Number(user.id) || p.id === Number(user.id));
            if (isParticipating) {
              participatingEvents.add(eventId);
            }
          }
        } catch (err) {
          console.error(`Error loading participants for event ${eventId}:`, err);
        }
      }
      
      setUserParticipatingEvents(participatingEvents);
    };

    if (events.length > 0) {
      checkUserParticipation();
    }
  }, [events, user?.id, refreshParticipation]);
 
  const filteredEvents = events.filter((event) => {
    const name = (event as any).name || "";
    const description = (event as any).description || "";
    const orgName = (event as any).organizationName || String((event as any).idOrganization || "");

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orgName.toLowerCase().includes(searchTerm.toLowerCase());

    const finished = Boolean((event as any).finished);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "upcoming" && !finished) ||
      (statusFilter === "finished" && finished);

    // Category is optional in API - if present, filter it
    const matchesCategory =
      categoryFilter === "all" || (event as any).category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const canCreateEvent = () => hasRole("ROLE_ORGANIZATION");

  const canEditEvent = (event: ApiEvent) => {
    const userOrg = user?.organizationId ? Number(user.organizationId) : undefined;
    const eventOrg = (event as any).idOrganization ? Number((event as any).idOrganization) : undefined;
    return hasRole("ROLE_ORGANIZATION") && userOrg && eventOrg && userOrg === eventOrg;
  };

  const openEditDialog = (event: ApiEvent) => {
    setEditingEvent(event);
    setFormData({
      name: (event as any).name || "",
      description: (event as any).description || "",
      direction: (event as any).direction || "",
      date: (event as any).date || "",
      latitude: (event as any).latitude || 0,
      longitude: (event as any).longitude || 0,
      finished: Boolean((event as any).finished),
    });
  };

  const handleDeleteEvent = (id: number | string) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;
    deleteMutation.mutate(Number(id), {
      onSuccess: () => {
        toast({ title: "Evento eliminado", description: "El evento fue eliminado correctamente." });
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err?.message || "No se pudo eliminar el evento.", variant: "destructive" });
      },
    });
  };

  const handleEditEvent = () => {
    if (!editingEvent) return;

    const payload: Omit<ApiEvent, "id"> = {
      name: formData.name,
      description: formData.description,
      direction: formData.direction,
      date: formData.date,
      latitude: Number(formData.latitude) || 0,
      longitude: Number(formData.longitude) || 0,
      idOrganization: (editingEvent as any).idOrganization,
      idOrganizer: (editingEvent as any).idOrganizer,
      finished: Boolean(formData.finished),
    } as any;

    updateMutation.mutate({ idEvent: Number(editingEvent.id), event: payload }, {
      onSuccess: () => {
        toast({ title: "Evento actualizado", description: "Los cambios se guardaron correctamente." });
        setEditingEvent(null);
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err?.message || "No se pudo actualizar el evento.", variant: "destructive" });
      },
    });
  };

  const handleJoinEvent = (eventId: number | string) => {
    const id = Number(eventId);
    setJoinLoadingId(id);
    addParticipantMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "¡Te uniste al evento!", description: "Ya eres participante de este evento." });
        setUserParticipatingEvents(prev => {
          const updated = new Set(prev);
          updated.add(id);
          return updated;
        });
        // Trigger re-check of participation to ensure UI is in sync
        setRefreshParticipation(prev => prev + 1);
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err?.message || "No se pudo unirse al evento.", variant: "destructive" });
      },
      onSettled: () => {
        setJoinLoadingId(null);
      }
    });
  };

  const handleLeaveEvent = (eventId: number | string) => {
    const id = Number(eventId);
    setLeaveLoadingId(id);
    deleteParticipantMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "Te retiraste del evento", description: "Ya no eres participante de este evento." });
        setUserParticipatingEvents(prev => {
          const updated = new Set(prev);
          updated.delete(id);
          return updated;
        });
        // Trigger re-check of participation to ensure UI is in sync
        setRefreshParticipation(prev => prev + 1);
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err?.message || "No se pudo retirarse del evento.", variant: "destructive" });
      },
      onSettled: () => {
        setLeaveLoadingId(null);
      }
    });
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Eventos Ambientales
            </h1>
            <p className="text-gray-600 mt-2">
              Descubre y participa en eventos de reforestación y conservación
            </p>
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

            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
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
              {filteredEvents.length} evento
              {filteredEvents.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* {canCreateEvent() && (
            <Dialog
              open={isCreateEventDialogOpen}
              onOpenChange={setIsCreateEventDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Crear Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear un nuevo evento</DialogTitle>
                  <DialogDescription>
                    Completa el formulario para crear un evento.
                  </DialogDescription>
                </DialogHeader>
                {userOrganizationId ? (
                  <CreateEventForm
                    organizationId={userOrganizationId} // Pasa el ID de la organización
                    onSuccess={() => setIsCreateEventDialogOpen(false)} // Cierra el modal
                  />
                ) : (
                  // Muestra un mensaje si no se puede obtener el ID de la organización
                  <p className="text-red-600">
                    No se pudo determinar la organización. No puedes crear
                    eventos.
                  </p>
                )}
              </DialogContent>
            </Dialog>
          )} */}

          {/* Events Grid */}
          <div className="grid gap-6">
            {filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">
                    No se encontraron eventos que coincidan con los filtros
                    seleccionados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className={`hover:shadow-md transition-shadow ${
                    event.finished ? "opacity-75" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">
                            {event.name}
                          </CardTitle>
                          {/* <Badge className={categoryColors[event.category]}>
                            {categoryLabels[event.category]}
                          </Badge> */}
                          {event.finished && (
                            <Badge variant="secondary">Finalizado</Badge>
                          )}
                        </div>
                        <CardDescription className="mb-4">
                          {event.description}
                        </CardDescription>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {(event as any).date ? new Date((event as any).date).toLocaleDateString("es-ES") : "-"}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {(event as any).direction || (event as any).location?.address || "-"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {(event as any).participants ? (event as any).participants.length : ((event as any).participantsCount ?? 0)}
                            {(event as any).maxParticipants ? ` / ${(event as any).maxParticipants}` : ""}{" "}
                            participantes
                          </div>
                          <div className="text-green-600 font-medium">
                            {(event as any).organizationName || `Org ${String((event as any).idOrganization || "")}`}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex items-center gap-2">
                        {/* {canEditEvent(event) && (
                          <>
                            <Button variant="outline" onClick={() => openEditDialog(event)}>
                              Editar
                            </Button>
                            <Button variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                              Eliminar
                            </Button>
                          </>
                        )} */}

                        <>
                          {userParticipatingEvents.has(Number(event.id)) ? (
                            <Button
                              variant="destructive"
                              onClick={() => handleLeaveEvent(event.id)}
                              disabled={leaveLoadingId === Number(event.id)}
                            >
                              {leaveLoadingId === Number(event.id) ? "Retirándose..." : "Retirarse"}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleJoinEvent(event.id)}
                              disabled={joinLoadingId === Number(event.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {joinLoadingId === Number(event.id) ? "Uniéndose..." : "Unirse"}
                            </Button>
                          )}
                        </>
                      </div>
                    </div>
                  </CardHeader>
                  {/* {event.images && event.images.length > 0 && (
                    <div className="px-6">
                      <img
                        src={event.images[0] || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    </div>
                  )} */}
                  <CardContent className="pt-0">
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Edit Dialog */}
          <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Editar Evento</DialogTitle>
                <DialogDescription>Actualiza la información del evento</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev:any) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del evento"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Dirección</label>
                  <Input
                    value={formData.direction}
                    onChange={(e) => setFormData((prev:any) => ({ ...prev, direction: e.target.value }))}
                    placeholder="Dirección o ubicación"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Fecha</label>
                    <Input type="date" value={formData.date} onChange={(e) => setFormData((prev:any) => ({ ...prev, date: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <label className="text-sm font-medium">Latitud</label>
                      <Input type="number" value={formData.latitude} onChange={(e) => setFormData((prev:any) => ({ ...prev, latitude: Number(e.target.value) }))} />
                    </div>
                    <div className="w-1/2">
                      <label className="text-sm font-medium">Longitud</label>
                      <Input type="number" value={formData.longitude} onChange={(e) => setFormData((prev:any) => ({ ...prev, longitude: Number(e.target.value) }))} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev:any) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe el evento..."
                    rows={6}
                  />
                </div>
                {/* <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingEvent(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleEditEvent}>Guardar Cambios</Button>
                </div> */}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
