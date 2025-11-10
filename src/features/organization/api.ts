import { api, ApiError } from "@/lib/api";
import type {
  Organization,
  GetOrganizationsParams,
  GetOrganizationsResponse,
} from "./types";
import { isAxiosError } from "axios";

interface GetOrganizationResponse {
  payload: Organization;
}

export const organizationApi = {
  // Listar organizaciones con paginación
  list: async (
    params?: GetOrganizationsParams
  ): Promise<GetOrganizationsResponse> => {
    try {
      const response = await api.get<GetOrganizationsResponse>(
        "/organization",
        { params }
      );
      return response.data;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  // Obtener una organización por ID
  get: async (id: number): Promise<Organization> => {
    try {
      const response = await api.get<GetOrganizationResponse>(
        `/organization/${id}`
      );
      return response.data.payload;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  // Crear organización
  create: async (org: Omit<Organization, "id">): Promise<Organization> => {
    try {
      // Si hay logo, es una URL - no es FormData
      const response = await api.post<GetOrganizationResponse>(
        "/organization",
        {
          name: org.name,
          description: org.description,
          contactEmail: org.contactEmail,
          contactPhone: org.contactPhone,
          creatorId: org.creatorId,
          logo: org.logo || null, // Enviar null si no hay logo
        }
      );
      return response.data.payload;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  // Actualizar organización
  update: async (
    id: number,
    org: Partial<Organization>
  ): Promise<Organization> => {
    try {
      const response = await api.put<GetOrganizationResponse>(
        `/organization/${id}`,
        {
          name: org.name,
          description: org.description,
          contactEmail: org.contactEmail,
          contactPhone: org.contactPhone,
          creatorId: org.creatorId,
          logo: org.logo || null,
        }
      );
      return response.data.payload;
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  // Eliminar organización
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/organization/${id}`);
    } catch (err) {
      throw ApiError.fromAxiosError(err);
    }
  },

  // Buscar organizaciones por nombre
  search: async (name: string): Promise<Organization[]> => {
    try {
      const response = await api.get<GetOrganizationResponse>(
        "/organization/search",
        { params: { name } }
      );
      return [response.data.payload];
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        return [];
      }
      throw ApiError.fromAxiosError(err);
    }
  },
};