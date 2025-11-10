import { useQuery, useMutation, useQueryClient } from "react-query";
import { organizationApi } from "./api";
import type {
  Organization,
  GetOrganizationsParams,
  GetOrganizationsResponse,
} from "./types";

export const ORGANIZATION_QUERY_KEY = "organizations";

export const useOrganizations = (
  params: GetOrganizationsParams,
  enabled: boolean = true
) => {
  return useQuery<GetOrganizationsResponse, Error>(
    [ORGANIZATION_QUERY_KEY, params],
    () => organizationApi.list(params),
    {
      keepPreviousData: true,
    }
  );
};

// --- 2. Hook para Obtener Organización por ID (useQuery) ---

export const useOrganization = (id: number) => {
  return useQuery<Organization, Error>(
    [ORGANIZATION_QUERY_KEY, id],
    () => organizationApi.get(id),
    {
      enabled: !!id,
    }
  );
};

// --- 3. Hook para Crear Organización (useMutation) ---

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<Organization, Error, Omit<Organization, "id">>(
    organizationApi.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(ORGANIZATION_QUERY_KEY);
      },
    }
  );
};

interface UpdateOrganizationVariables {
  id: number;
  data: Partial<Organization>;
}

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<Organization, Error, UpdateOrganizationVariables>(
    ({ id, data }) => organizationApi.update(id, data),
    {
      onSuccess: (updatedOrg) => {
        queryClient.invalidateQueries(ORGANIZATION_QUERY_KEY);

        queryClient.setQueryData(
          [ORGANIZATION_QUERY_KEY, updatedOrg.id],
          updatedOrg
        );
      },
    }
  );
};

// --- 5. Hook para Eliminar Organización (useMutation) ---
export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(organizationApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(ORGANIZATION_QUERY_KEY);
    },
  });
};

// --- 6. Hook para Buscar Organizaciones por Nombre (useQuery) ---
export const useSearchOrganization = (nameQuery: string) => {
  return useQuery<Organization[], Error>(
    [ORGANIZATION_QUERY_KEY, "search", nameQuery],
    () => organizationApi.search(nameQuery),
    {
      // Solo se ejecuta si hay un término de búsqueda válido
      enabled: nameQuery.trim().length > 0,
      staleTime: 1000 * 60,
    }
  );
};
