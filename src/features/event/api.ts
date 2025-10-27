import { api, ApiError } from "@/lib/api";
import type {
  Event,
  GetEventsParams,
  PaginatedEventsResponse,
  Participant,
} from "./types";
import { AxiosError } from "axios";
import { PaginatedUsersResponse } from "../user/types";

interface GetEventResponse {
  payload: Event;
}

export const eventApi = {
  list: async (params?: GetEventsParams): Promise<PaginatedEventsResponse> => {
    try {
      const response = await api.get<PaginatedEventsResponse>("/event/", {
        params,
      });
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  get: async (idEvent: number): Promise<Event> => {
    try {
      const response = await api.get<GetEventResponse>(`/event/${idEvent}`);
      return response.data.payload;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  create: async (event: Omit<Event, "id">): Promise<Event> => {
    try {
      const response = await api.post<GetEventResponse>("/event/create", event);
      return response.data.payload;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  update: async (
    idEvent: number,
    eventData: Partial<Event>
  ): Promise<Event> => {
    try {
      const response = await api.put<GetEventResponse>(
        `/event/${idEvent}`,
        eventData
      );
      return response.data.payload;
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

  finalize: async (idEvent: number): Promise<Event> => {
    try {
      const response = await api.post<GetEventResponse>(`/event/${idEvent}`, {
        finished: true,
      });
      return response.data.payload;
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
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },
};
