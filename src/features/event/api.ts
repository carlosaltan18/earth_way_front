import { api, ApiError } from "@/lib/api";
import type { Event, GetEventsParams, PaginatedEventsResponse, Participant } from "./types";
import { PaginatedUsersResponse } from "../user/types";

export const eventApi = {
  list: async (params?: GetEventsParams): Promise<PaginatedEventsResponse> => {
    try {
      const response = await api.get("/event", { params });
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  get: async (idEvent: number): Promise<Event> => {
    try {
      const response = await api.get(`/event/${idEvent}`);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  create: async (event: Omit<Event, "id">): Promise<Event> => {
    try {
      const response = await api.post("/event/create", event);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  update: async (idEvent: number, event: Omit<Event, "id">): Promise<Event> => {
    try {
      const response = await api.put(`/event/${idEvent}`, event);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  delete: async (idEvent: number): Promise<void> => {
    try {
      await api.delete(`/event/${idEvent}`);
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  // Participants
  addParticipant: async (eventId: number): Promise<void> => {
    try {
      await api.post(`/event/${eventId}/participants`);
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  getParticipants: async (eventId: number): Promise<Participant[]> => {
    try {
      const response = await api.get(`/event/${eventId}/participants`);
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  deleteParticipant: async (eventId: number): Promise<void> => {
    try {
      await api.delete(`/event/${eventId}/participants`);
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  countParticipants: async (eventId: number): Promise<number> => {
    try {
      const response = await api.get(`/event/${eventId}/participants/count`);
      const d = response.data;
      // Normalize different possible response shapes coming from the backend
      if (typeof d === "number") return d;
      if (d && typeof d.payload !== "undefined") return Number(d.payload);
      if (d && typeof d.count !== "undefined") return Number(d.count);
      // Fallback: attempt to coerce to number
      const coerced = Number(d);
      return Number.isNaN(coerced) ? 0 : coerced;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },
};