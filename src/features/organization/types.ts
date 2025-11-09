export type Organization = {
  id: number;
  creatorId: number;
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
};

export type GetOrganizationsParams = {
  page?: number;
  size?: number;
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
