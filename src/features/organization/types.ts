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