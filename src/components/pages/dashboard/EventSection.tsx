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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  organizations,
  participantsCounts,
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
  organizations: any[];
  participantsCounts: Record<number, number>;
}) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-full sm:w-auto">
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Gestión de Eventos</CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base mt-1">Administra eventos ambientales</CardDescription>
          </div>

          {hasRole("ROLE_ORGANIZATION") && (
            <div className="w-full sm:w-auto">
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" /> Crear Evento
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">{editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}</DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">{editingEvent ? "Actualiza el evento" : "Crea un evento ambiental. Selecciona ubicación en mapa si aplica."}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label className="text-xs sm:text-sm">Organización *</Label>
                      <Select value={eventForm.idOrganization} onValueChange={(value) => setEventForm((prev: any) => ({ ...prev, idOrganization: value }))}>
                        <SelectTrigger className="text-xs sm:text-sm">
                          <SelectValue placeholder="Selecciona una organización" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id} className="text-xs sm:text-sm">
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm">Nombre del evento</Label>
                      <Input value={eventForm.name} onChange={(e) => setEventForm((prev: any) => ({ ...prev, name: e.target.value }))} placeholder="Ej: Reforestación Parque Central" className="text-xs sm:text-sm" />
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm">Descripción</Label>
                      <Textarea value={eventForm.description} onChange={(e) => setEventForm((prev: any) => ({ ...prev, description: e.target.value }))} placeholder="Describe la actividad..." rows={3} className="text-xs sm:text-sm resize-none" />
                    </div>

                    <div>
                      <Label className="text-xs sm:text-sm">Fecha</Label>
                      <Input type="date" value={eventForm.date} onChange={(e) => setEventForm((prev: any) => ({ ...prev, date: e.target.value }))} className="text-xs sm:text-sm" />
                    </div>

                    <div>
                      <Label className="mb-2 block text-xs sm:text-sm">Ubicación (opcional)</Label>
                      <MapLocationPicker selectedLocation={typeof eventForm.location === 'object' && eventForm.location ? eventForm.location : null} onLocationSelect={(location: { lat: number; lng: number } | null) => setEventForm((prev: any) => ({ ...prev, location }))} height="250px" />
                    </div>
                  </div>

                  <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                    <Button variant="outline" onClick={() => { setIsEventDialogOpen(false); setEventForm({ name: "", description: "", date: "", location: null, maxParticipants: "", category: "" }); }} disabled={isCreatingEvent || isUpdatingEvent} className="w-full sm:w-auto text-xs sm:text-sm">Cancelar</Button>
                    <Button onClick={editingEvent ? handleEditEvent : handleCreateEvent} disabled={isCreatingEvent || isUpdatingEvent} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm">
                      {editingEvent ? (isUpdatingEvent ? "Actualizando..." : "Guardar Cambios") : (isCreatingEvent ? "Creando..." : "Crear Evento")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
          <Input placeholder="Buscar eventos..." value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} className="pl-8 sm:pl-10 text-xs sm:text-sm" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          {filteredEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base flex-1 min-w-0 break-words">{event.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">{categoryLabels[event.category]}</Badge>
                        {event.finished && <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">Finalizado</Badge>}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{event.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{new Date(event.date).toLocaleDateString("es-ES")}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{participantsCounts[Number(event.id)] ?? 0} participantes{event.maxParticipants && ` / ${event.maxParticipants}`}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{(() => {
                          const org = organizations.find((o) => o.id === event.organizationId);
                          return org?.name || "Organización no encontrada";
                        })()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t sm:border-t-0 sm:pt-0">
                    {hasRole("ROLE_ORGANIZATION") && (
                      <Button variant="ghost" size="sm" onClick={() => { openEditEventDialog(event); setIsEventDialogOpen(true); }} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 h-8 w-8 sm:h-9 sm:w-9 p-0">
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-base sm:text-lg">¿Eliminar evento?</AlertDialogTitle>
                          <AlertDialogDescription className="text-xs sm:text-sm">Esta acción eliminará el evento y todas sus participaciones.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                          <AlertDialogCancel className="w-full sm:w-auto text-xs sm:text-sm">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteEvent(event.id)} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-xs sm:text-sm">Eliminar</AlertDialogAction>
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
