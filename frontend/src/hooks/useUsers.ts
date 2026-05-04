import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/userApi';

export const USER_KEYS = {
  search: (query: string) => ['users', 'search', query] as const,
};

export const useUserSearch = (query: string) => {
  return useQuery({
    queryKey: USER_KEYS.search(query),
    queryFn: () => userApi.search(query),
    enabled: query.length >= 2, 
    staleTime: 1000 * 60 * 5,
  });
};