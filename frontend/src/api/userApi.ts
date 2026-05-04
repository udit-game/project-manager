import { api } from '../lib/axios';

export interface UserMinimal {
  id: string;
  email: string;
}

export const userApi = {
  search: async (query: string) => {
    const { data } = await api.get<{ data: UserMinimal[] }>(`/users/search`, {
      params: { query },
    });
    return data.data;
  },
};