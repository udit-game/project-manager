import { api } from '../lib/axios';
import type { Paginated, ProjectItem } from '../types';

export const projectApi = {
  list: async (page = 0, size = 10): Promise<Paginated<ProjectItem>> => {
    const { data } = await api.get(`/project?page=${page}&size=${size}`);
    return data.data;
  },
  create: async (name: string, memberIds: string[] = []) => {
    const { data } = await api.post('/project', { name, membersIds: memberIds });
    return data.data as string; // projectId
  },
  addMembers: async (projectId: string, memberIds: string[]) => {
    await api.post(`/project/${projectId}`, { memberIds });
  },
  remove: async (projectId: string) => {
    await api.delete(`/project/${projectId}`);
  },
};