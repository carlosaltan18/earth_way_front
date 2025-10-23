// Tipo para el rol del backend
export type RoleObject = {
  id: number;
  name: string;
};

// Tipo del usuario del backend
export type UserType = {
  id: number;
  name: string;
  surname: string;
  email: string;
  password?: string;
  phone: string;
  roles: RoleObject[]; // Ahora es un array de objetos
  enabled?: boolean;
  username?: string;
  authorities?: Array<{ authority: string }>;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  created_at?: string;
  updated_at?: string;
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

// Tipo para la respuesta paginada de la API (estructura real)
export type PaginatedUsersResponse = {
  payload: UserType[];
  totalPages: number;
  message: string;
  currentPage: number;
  users: UserType[]; // Duplicado en la respuesta
  totalElements: number;
};

