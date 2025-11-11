export type Organization = {
  id: number;
  creatorId: number;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  logo?: string; // URL del logo subido
  address?: string;
  category?: "ngo" | "government" | "private" | "community";
  members?: number;
  eventsCount?: number;
  created_at?: string;
  updated_at?: string;
};

export type GetOrganizationsParams = {
  page?: number;
  size?: number;
  search?: string;
};

export interface GetOrganizationsResponse {
  payload: Organization[];
  message: string;
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

export interface UserDto {
  id: number;
  name?: string;
  email: string;
}

// Tipo para el formulario en el dashboard
export interface DashboardOrganization {
  id: string;
  name: string;
  description: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  category: "ngo" | "government" | "private" | "community";
  members: number;
  eventsCount: number;
  founded: string;
}

// Tipo para el estado del formulario
export interface OrganizationFormState {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  creatorId: number | null;
  logo: string; // URL del logo
}