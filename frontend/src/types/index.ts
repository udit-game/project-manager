export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedToId: string;
  assignedToEmail: string;
  dueDate: string;
  overdue: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: 'ADMIN' | 'MEMBER';
  taskCount: number;
}

export interface Paginated<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  page: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string; code: string };
}

export interface AuthUser {
  token: string;
  email: string;
}