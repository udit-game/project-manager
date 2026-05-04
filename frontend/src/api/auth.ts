import { api } from '../lib/axios';

export const authApi = {
  register: async (email: string, password: string) => {
    const { data } = await api.post('/auth/register', { email, password });
    return data.data as { token: string };
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data as { token: string };
  },
};