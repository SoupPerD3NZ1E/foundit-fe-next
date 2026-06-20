import apiClient from './client';
import type { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from '@/types/auth';

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return apiClient
      .post<LoginResponse>('/auth/login', payload)
      .then((res) => res.data);
  },

  signUp(payload: SignUpRequest): Promise<SignUpResponse> {
    return apiClient
      .post<SignUpResponse>('/auth/register', payload)
      .then((res) => res.data);
  },

  continueWithGoogle(): void {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  },
};
