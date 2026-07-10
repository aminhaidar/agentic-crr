import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreatedReportReference } from "@/application/ports/ReportRepository";
import type { CreateReportFormValues } from "@/domain/report";
import { useReportRepository } from "@/providers/ReportRepositoryContext";

export const reportQueryKeys = {
  all: ["reports"] as const,
  list: () => [...reportQueryKeys.all, "list"] as const,
  types: () => [...reportQueryKeys.all, "types"] as const,
};

export function useReportTypesQuery() {
  const repository = useReportRepository();

  return useQuery({
    queryKey: reportQueryKeys.types(),
    queryFn: () => repository.listTypes(),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useReportsQuery() {
  const repository = useReportRepository();

  return useQuery({
    queryKey: reportQueryKeys.list(),
    queryFn: () => repository.list(),
  });
}

export function useCreateReportMutation() {
  const repository = useReportRepository();
  const queryClient = useQueryClient();

  return useMutation<CreatedReportReference, Error, CreateReportFormValues>({
    mutationFn: (values) => repository.create(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: reportQueryKeys.list() });
    },
  });
}
