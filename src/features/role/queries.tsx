import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "./api";
import type { Role } from "./types";
import { userKeys } from "@/features/user/queries";

export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: () => [...roleKeys.lists()] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: number) => [...roleKeys.details(), id] as const,
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: roleKeys.list(),
    queryFn: () => roleApi.list(),
  });
};

export const useGetRole = (id: number) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.get(id),
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (role: Omit<Role, "id">) => roleApi.create(role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => roleApi.delete(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
};

export const useAddRoleToUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: number; roleName: string }) =>
      roleApi.addToUser(userId, roleName),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      qc.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useRemoveRoleFromUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: number; roleName: string }) =>
      roleApi.removeFromUser(userId, roleName),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: userKeys.detail(variables.userId) });
      qc.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};