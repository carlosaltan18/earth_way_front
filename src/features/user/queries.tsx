import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./api";
import type { UserType as User, GetUsersParams, ChangePasswordPayload, PaginatedUsersResponse } from "./types";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params?: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// Queries
export const useGetUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.getUsers(params),
  });
};

export const useGetUser = (idUser: number) => {
  return useQuery({
    queryKey: userKeys.detail(idUser),
    queryFn: () => userApi.getUser(idUser),
    enabled: !!idUser,
  });
};

// Mutations
export const useUpdateCurrentUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (user: Partial<User>) => userApi.updateCurrentUser(user),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateUserById = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ idUser, user }: { idUser: number; user: Partial<User> }) =>
      userApi.updateUserById(idUser, user),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: userKeys.detail(variables.idUser) });
      qc.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => userApi.changePassword(payload),
  });
};

export const useDeleteCurrentUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.deleteCurrentUser(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};