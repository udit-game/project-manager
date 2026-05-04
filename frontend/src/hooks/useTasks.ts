import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/tasks';
import type { TaskStatus } from '../types';

export const TASK_KEYS = {
  all: ['tasks'] as const,
  project: (pid: string, filters: object) => ['tasks', pid, filters] as const,
  myTasks: (filters: object) => ['tasks', 'my', filters] as const,
};

export const useProjectTasks = (
  projectId: string,
  filters: { status?: TaskStatus; assignedTo?: string; page?: number }
) =>
  useQuery({
    queryKey: TASK_KEYS.project(projectId, filters),
    queryFn: () => taskApi.list(projectId, { ...filters, size: 20 }),
    enabled: !!projectId,
  });

export const useMyTasks = (filters: { status?: TaskStatus; page?: number }) =>
  useQuery({
    queryKey: TASK_KEYS.myTasks(filters),
    queryFn: () => taskApi.myTasks({ ...filters, size: 20 }),
  });

export const useCreateTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description?: string; assignedToUserId?: string; dueDate?: string }) =>
      taskApi.create(projectId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });
};

export const useUpdateTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, ...payload }: { taskId: string; status?: TaskStatus; title?: string; description?: string; assignedToUserId?: string; dueDate?: string }) =>
      taskApi.update(projectId, taskId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', projectId] });
      qc.invalidateQueries({ queryKey: ['tasks', 'my'] });
    },
  });
};

export const useDeleteTask = (projectId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => taskApi.remove(projectId, taskId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });
};