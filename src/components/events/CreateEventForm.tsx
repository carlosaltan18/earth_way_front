// src/features/event/components/CreateEventForm.tsx

"use client";

import { useState } from "react";
import { useCreateEvent } from "@/features/event/queries";
import type { Event } from "@/features/event/types";
import { useAuth } from "@/contexts/AuthContext";

// Importa tus componentes de UI (ShadCN)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CreateEventFormProps {
  onSuccess: () => void;
  organizationId: number;
}

type EventFormData = Omit<
  Event,
  "id" | "idOrganization" | "idOrganizer" | "participants" | "finished"
>;

export function CreateEventForm({
  onSuccess,
  organizationId,
}: CreateEventFormProps) {
  const { user } = useAuth(); // Obtiene el usuario logueado
  const createMutation = useCreateEvent(); // Inicializa el hook de mutación

  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    direction: "",
    date: "", // Formato "YYYY-MM-DD"
    latitude: 0,
    longitude: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Debes estar autenticado para crear un evento.");
      return;
    }

    const finalPayload: Omit<Event, "id"> = {
      ...formData,
      idOrganization: organizationId,
      idOrganizer: Number(user.id),
      finished: false,

      latitude: Number(formData.latitude) || 0,
      longitude: Number(formData.longitude) || 0,
    };

    createMutation.mutate(finalPayload, {
      onSuccess: () => {
        alert("Evento creado con éxito!");
        onSuccess();
      },
      onError: (error) => {
        alert(`Error al crear el evento: ${(error as Error).message}`);
      },
    });
  };

  const isLoading = createMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre del Evento */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Evento</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Reforestación Cerro Verde"
          required
          disabled={isLoading}
        />
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe los objetivos y actividades del evento..."
          required
          disabled={isLoading}
        />
      </div>

      {/* Dirección y Fecha */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="direction">Dirección</Label>
          <Input
            id="direction"
            name="direction"
            value={formData.direction}
            onChange={handleChange}
            placeholder="Ej: Cerro Verde, Lima, Perú"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Fecha del Evento</Label>
          <Input
            id="date"
            name="date"
            type="date" // Input de tipo fecha
            value={formData.date}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitud</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="0.0000"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitud</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="0.0000"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Botón de Enviar */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? "Creando Evento..." : "Crear Evento"}
      </Button>
    </form>
  );
}
