import React from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateEvent,
  useUpdateEvent,
  eventKeys,
} from "@/features/event/queries";
import { formValuesToDto, type EventFormValues } from "@/features/event/mapper";
import { useToast } from "@/hooks/use-toast";
import type { EventDto } from "@/types/event";

type Props = {
  initial?: Partial<EventDto>;
  onClose: () => void;
  organizationId?: number | null;
  organizerId?: number | null;
};

export default function EventForm({
  initial,
  onClose,
  organizationId,
  organizerId,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      direction: initial?.direction ?? "",
      date: initial?.date ?? "",
      latitude: initial?.latitude ?? "",
      longitude: initial?.longitude ?? "",
      finished: initial?.finished ?? false,
    },
  });

  const qc = useQueryClient();
  const { toast } = useToast();
  const create = useCreateEvent();
  const update = useUpdateEvent();

  const invalidateEvents = () => {
    try {
      const listKey =
        typeof (eventKeys as any)?.list === "function"
          ? (eventKeys as any).list()
          : (eventKeys as any)?.list ?? ["events"];
      // usar el overload con filtro para que TypeScript acepte el tipo
      qc.invalidateQueries({ queryKey: listKey as readonly unknown[] });
    } catch {
      qc.invalidateQueries({ queryKey: ["events"] });
    }
  };

  const onSubmit = (values: EventFormValues) => {
    const dto = formValuesToDto(values) as Partial<EventDto>;
    if (organizationId != null) dto.idOrganization = organizationId;
    if (organizerId != null) dto.idOrganizer = organizerId;

    // validación simple: fecha futura
    const today = new Date();
    const submitted = new Date(dto.date as string);
    if (submitted <= today) {
      toast({ title: "La fecha debe ser futura", variant: "destructive" });
      return;
    }

    if (initial?.id) {
      update.mutate(
        { id: initial.id, payload: dto } as any,
        {
          onSuccess: () => {
            invalidateEvents();
            toast({ title: "Evento actualizado" });
            onClose();
          },
          onError: (e: any) =>
            toast({
              title: "Error",
              description: e?.message ?? "No se pudo actualizar",
              variant: "destructive",
            }),
        }
      );
    } else {
      create.mutate(
        dto as any,
        {
          onSuccess: () => {
            invalidateEvents();
            toast({ title: "Evento creado" });
            onClose();
          },
          onError: (e: any) =>
            toast({
              title: "Error",
              description: e?.message ?? "No se pudo crear",
              variant: "destructive",
            }),
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        {...register("name", { required: true })}
        placeholder="Nombre"
        className="w-full"
      />
      {errors.name && <span className="text-red-600 text-sm">Requerido</span>}

      <textarea
        {...register("description", { required: true })}
        placeholder="Descripción"
        className="w-full"
      />

      <input
        {...register("direction", { required: true })}
        placeholder="Dirección"
        className="w-full"
      />

      <input
        type="date"
        {...register("date", { required: true })}
        className="w-full"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          {...register("latitude")}
          placeholder="Latitud"
          className="w-full"
        />
        <input
          {...register("longitude")}
          placeholder="Longitud"
          className="w-full"
        />
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("finished")} />
        Finalizado
      </label>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn-outline">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {initial?.id ? "Guardar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
