import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { WorkflowStage } from "@/domain/workflow";
import { useWorkflowRepository } from "@/providers/WorkflowRepositoryContext";

export const workflowQueryKeys = {
  project: (projectId: string) => ["workflow", projectId] as const,
};

export function useWorkflowQuery(projectId: string | null) {
  const repository = useWorkflowRepository();
  return useQuery({
    queryKey: workflowQueryKeys.project(projectId ?? "inactive"),
    queryFn: () => repository.get(projectId!),
    enabled: Boolean(projectId),
  });
}

export function useStartWorkflowMutation() {
  const repository = useWorkflowRepository();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportType: string) => repository.start(reportType),
    onSuccess: (snapshot) => {
      queryClient.setQueryData(
        workflowQueryKeys.project(snapshot.projectId),
        snapshot,
      );
    },
  });
}

export function useAdvanceWorkflowMutation() {
  const repository = useWorkflowRepository();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      expectedStage,
    }: {
      projectId: string;
      expectedStage: WorkflowStage;
    }) => repository.advance(projectId, expectedStage, "operator"),
    onSuccess: (snapshot) => {
      queryClient.setQueryData(
        workflowQueryKeys.project(snapshot.projectId),
        snapshot,
      );
    },
  });
}
