import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { eventApi } from "./api";
import type { Event, GetEventsParams, PaginatedEventsResponse } from "./types";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (params?: GetEventsParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
  participants: (eventId: number) =>
    [...eventKeys.all, "participants", eventId] as const,
  participantsCount: (eventId: number) =>
    [...eventKeys.all, "participants-count", eventId] as const,
};

export const useGetEvents = (params?: GetEventsParams) => {
  return useQuery<PaginatedEventsResponse, Error>({
    queryKey: eventKeys.list(params),
    queryFn: () => eventApi.list(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetEvent = (idEvent: number) => {
  return useQuery({
    queryKey: eventKeys.detail(idEvent),
    queryFn: () => eventApi.get(idEvent),
    enabled: !!idEvent,
  });
};

export const useCreateEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (event: Omit<Event, "id">) => eventApi.create(event),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useUpdateEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      idEvent,
      event,
    }: {
      idEvent: number;
      event: Omit<Event, "id">;
    }) => eventApi.update(idEvent, event),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: eventKeys.detail(variables.idEvent) });
      qc.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

export const useDeleteEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (idEvent: number) => eventApi.delete(idEvent),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

// Participants - Sin pasar participantId como parámetro
export const useAddParticipant = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => eventApi.addParticipant(eventId),
    onSuccess: (_, eventId) => {
      qc.invalidateQueries({ queryKey: eventKeys.participants(eventId) });
      qc.invalidateQueries({ queryKey: eventKeys.participantsCount(eventId) });
    },
  });
};

export const useGetParticipants = (eventId: number) => {
  return useQuery({
    queryKey: eventKeys.participants(eventId),
    queryFn: () => eventApi.getParticipants(eventId),
    enabled: !!eventId,
  });
};

export const useDeleteParticipant = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => eventApi.deleteParticipant(eventId),
    onSuccess: (_, eventId) => {
      qc.invalidateQueries({ queryKey: eventKeys.participants(eventId) });
      qc.invalidateQueries({ queryKey: eventKeys.participantsCount(eventId) });
    },
  });
};

export const useCountParticipants = (eventId: number) => {
  return useQuery({
    queryKey: eventKeys.participantsCount(eventId),
    queryFn: () => eventApi.countParticipants(eventId),
    enabled: !!eventId,
  });
};
