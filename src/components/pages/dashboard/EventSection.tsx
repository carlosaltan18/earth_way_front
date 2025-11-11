"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, Users, Building, Edit, Trash2, Plus } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

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
              <Button onClick={() => setIsEventDialogOpen(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" /> Crear Evento
              </Button>
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
