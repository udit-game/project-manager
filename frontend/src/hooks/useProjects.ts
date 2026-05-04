import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/projects';

export const PROJECT_KEYS = {
  all: ['projects'] as const,
  list: (page: number) => ['projects', 'list', page] as const,
};

export const useProjects = (page = 0) =>
  useQuery({
    queryKey: PROJECT_KEYS.list(page),
    queryFn: () => projectApi.list(page),
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, memberIds }: { name: string; memberIds?: string[] }) =>
      projectApi.create(name, memberIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECT_KEYS.all }),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => projectApi.remove(projectId),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECT_KEYS.all }),
  });
};

export const useAddMembers = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberIds }: { memberIds: string[] }) =>
      projectApi.addMembers(projectId, memberIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROJECT_KEYS.all }),
  });
};