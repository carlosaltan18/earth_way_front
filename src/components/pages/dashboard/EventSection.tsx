"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, Users, Building, Edit, Trash2, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

const MapLocationPicker = dynamic(() => import("@/components/map/MapLocationPicker"), { ssr: false }) as any;

export default function EventSection({
  events,
  eventSearch,
  setEventSearch,
  filteredEvents,
  openEditEventDialog,
  setIsEventDialogOpen,
  handleDeleteEvent,
  hasRole,
  categoryLabels,
  isEventDialogOpen,
  eventForm,
  setEventForm,
  handleCreateEvent,
  handleEditEvent,
  isCreatingEvent,
  isUpdatingEvent,
  isDeletingEvent,
  editingEvent,
}: {
  events: any[];
  eventSearch: string;
  setEventSearch: (v: string) => void;
  filteredEvents: any[];
  openEditEventDialog: (e: any) => void;
  setIsEventDialogOpen: (b: boolean) => void;
  handleDeleteEvent: (id: string) => void;
  hasRole: (role: string) => boolean;
  categoryLabels: Record<string, string>;
  isEventDialogOpen: boolean;
  eventForm: any;
  setEventForm: (f: any) => void;
  handleCreateEvent: () => void;
  handleEditEvent: () => void;
  isCreatingEvent: boolean;
  isUpdatingEvent: boolean;
  isDeletingEvent: boolean;
  editingEvent: any | null;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Gestión de Eventos</CardTitle>
            <CardDescription className="text-sm sm:text-base">Administra eventos ambientales</CardDescription>
          </div>

          {hasRole("ROLE_ORGANIZATION") && (
            <div>
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" /> Crear Evento</Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}</DialogTitle>
                    <DialogDescription>{editingEvent ? "Actualiza el evento" : "Crea un evento ambiental. Selecciona ubicación en mapa si aplica."}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Nombre del evento</Label>
                      <Input value={eventForm.name} onChange={(e) => setEventForm((prev: any) => ({ ...prev, name: e.target.value }))} placeholder="Ej: Reforestación Parque Central" />
                    </div>

                    <div>
                      <Label>Descripción</Label>
                      <Textarea value={eventForm.description} onChange={(e) => setEventForm((prev: any) => ({ ...prev, description: e.target.value }))} placeholder="Describe la actividad..." rows={4} />
                    </div>

                    <div>
                      <Label>Fecha</Label>
                      <Input type="date" value={eventForm.date} onChange={(e) => setEventForm((prev: any) => ({ ...prev, date: e.target.value }))} />
                    </div>

                    <div>
                      <Label className="mb-2 block">Ubicación (opcional)</Label>
                      <MapLocationPicker selectedLocation={typeof eventForm.location === 'object' && eventForm.location ? eventForm.location : null} onLocationSelect={(location: { lat: number; lng: number } | null) => setEventForm((prev: any) => ({ ...prev, location }))} height="300px" />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => { setIsEventDialogOpen(false); setEventForm({ name: "", description: "", date: "", location: null, maxParticipants: "", category: "" }); }} disabled={isCreatingEvent || isUpdatingEvent}>Cancelar</Button>
                    <Button onClick={editingEvent ? handleEditEvent : handleCreateEvent} disabled={isCreatingEvent || isUpdatingEvent} className="bg-blue-600 hover:bg-blue-700">
                      {editingEvent ? (isUpdatingEvent ? "Actualizando..." : "Guardar Cambios") : (isCreatingEvent ? "Creando..." : "Crear Evento")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Buscar eventos..." value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-2">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base">{event.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="text-xs sm:text-sm">{categoryLabels[event.category]}</Badge>
                        {event.finished && <Badge variant="secondary" className="text-xs sm:text-sm">Finalizado</Badge>}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 sm:line-clamp-none">{event.description}</p>

                    <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 flex-shrink-0" />{new Date(event.date).toLocaleDateString("es-ES")}</div>
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0" /><span className="line-clamp-1">{event.location}</span></div>
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 flex-shrink-0" />{event.participants} participantes{event.maxParticipants && ` / ${event.maxParticipants}`}</div>
                      <div className="flex items-center gap-2"><Building className="h-4 w-4 flex-shrink-0" /><span className="line-clamp-1">{event.organizationName}</span></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {hasRole("ROLE_ORGANIZATION") && (
                      <Button variant="ghost" size="sm" onClick={() => { openEditEventDialog(event); setIsEventDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                          <AlertDialogDescription>Esta acción eliminará el evento y todas sus participaciones.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteEvent(event.id)} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
