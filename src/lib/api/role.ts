import apiClient from './client';
import type { RoleEnum } from '@/types/auth';

export interface ChooseRoleRequest {
  email: string;
  role: RoleEnum;
}

export interface ChooseRoleResponse {
  message?: string;
}

export const roleApi = {
  chooseRole(request: ChooseRoleRequest): Promise<ChooseRoleResponse> {
    if (!request.role || !request.email) {
      return Promise.reject(new Error('Email and role are required'));
    }
    return apiClient
      .put<ChooseRoleResponse>('/role/update-role', request)
      .then((res) => res.data);
  },
};
