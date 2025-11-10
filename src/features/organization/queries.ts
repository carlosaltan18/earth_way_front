import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { organizationApi } from "./api";
import type {
  Organization,
  GetOrganizationsParams,
  GetOrganizationsResponse,
} from "./types";

export const organizationKeys = {
  all: ["organizations"] as const,
  lists: () => [...organizationKeys.all, "list"] as const,
  list: (params?: GetOrganizationsParams) =>
    [...organizationKeys.lists(), params] as const,
  details: () => [...organizationKeys.all, "detail"] as const,
  detail: (id: number) => [...organizationKeys.details(), id] as const,
  search: (name: string) => [...organizationKeys.all, "search", name] as const,
};

export const useGetOrganizations = (
  params?: GetOrganizationsParams,
  enabled: boolean = true
) => {
  return useQuery<GetOrganizationsResponse, Error>({
    queryKey: organizationKeys.list(params),
    queryFn: () => organizationApi.list(params),
    placeholderData: keepPreviousData,
    enabled: enabled,
  });
};

export const useGetOrganization = (id: number) => {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => organizationApi.get(id),
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (org: Omit<Organization, "id">) => organizationApi.create(org),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
};

export const useUpdateOrganization = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, org }: { id: number; org: Partial<Organization> }) =>
      organizationApi.update(id, org),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: organizationKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
};

export const useDeleteOrganization = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => organizationApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
};

export const useSearchOrganization = (name: string) => {
  return useQuery({
    queryKey: organizationKeys.search(name),
    queryFn: () => organizationApi.search(name),
    enabled: !!name,
  });
};
