import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportApi } from "./api";
import type { Report, GetReportsParams } from "./types";

export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: (params?: GetReportsParams) => [...reportKeys.lists(), params] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id: number) => [...reportKeys.details(), id] as const,
};

export const useGetReports = (params?: GetReportsParams) => {
  return useQuery({
    queryKey: reportKeys.list(params),
    queryFn: () => reportApi.list(params),
  });
};

export const useGetReport = (id: number) => {
  return useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => reportApi.get(id),
    enabled: !!id,
  });
};

export const useCreateReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (report: Omit<Report, "id">) => reportApi.create(report),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
};

export const useUpdateReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, report }: { id: number; report: Partial<Report> }) =>
      reportApi.update(id, report),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: reportKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
};

export const usePatchReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Report> }) => reportApi.patch(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: reportKeys.detail(variables.id) });
      qc.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
};

export const useDeleteReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reportApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reportKeys.lists() });
    },
  });
};