import { api } from '../lib/axios';
import type { Paginated, TaskDto, TaskStatus } from '../types';

export const taskApi = {
  list: async (
    projectId: string,
    params: { status?: TaskStatus; assignedTo?: string; page?: number; size?: number }
  ): Promise<Paginated<TaskDto>> => {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.assignedTo) q.set('assignedTo', params.assignedTo);
    q.set('page', String(params.page ?? 0));
    q.set('size', String(params.size ?? 20));
    const { data } = await api.get(`/task/${projectId}?${q}`);
    return data.data;
  },

  myTasks: async (params: { status?: TaskStatus; page?: number; size?: number }): Promise<Paginated<TaskDto>> => {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    q.set('page', String(params.page ?? 0));
    q.set('size', String(params.size ?? 20));
    const { data } = await api.get(`/task/my-tasks?${q}`);
    return data.data;
  },

  myProjects: async (page = 0, size = 10) => {
    const { data } = await api.get(`/task/my-projects?page=${page}&size=${size}`);
    return data.data as Paginated<{ id: string; name: string }>;
  },

  create: async (
    projectId: string,
    payload: { title: string; description?: string; assignedToUserId?: string; dueDate?: string }
  ): Promise<TaskDto> => {
    const { data } = await api.post(`/task/${projectId}`, payload);
    return data.data;
  },

  update: async (
    projectId: string,
    taskId: string,
    payload: Partial<{ title: string; description: string; assignedToUserId: string; dueDate: string; status: TaskStatus }>
  ): Promise<TaskDto> => {
    const { data } = await api.post(`/task/${projectId}/${taskId}`, payload);
    return data.data;
  },

  remove: async (projectId: string, taskId: string) => {
    await api.delete(`/task/${projectId}/${taskId}`);
  },
};