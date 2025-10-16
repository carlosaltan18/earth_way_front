export type UserType = {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  roles: string[];
  created_at: string;
  updated_at: string;
};

export type GetUsersParams = {
  page?: number;
  size?: number;
  email?: string;
};

export type ChangePasswordPayload = {
  newPassword: string;
  confirmPassword: string;
};