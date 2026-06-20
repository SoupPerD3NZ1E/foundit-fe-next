'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { storage } from '@/lib/auth/storage';
import { extractRoleFromJwt } from '@/lib/auth/jwt';
import type { LoginRequest, SignUpRequest } from '@/types/auth';

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const login = async (payload: LoginRequest) => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      const response = await authApi.login(payload);
      storage.setToken(response.token);

      let role = extractRoleFromJwt(response.token);

      // Fallback to locally stored role (mirrors LoginService logic)
      if (!role) {
        const localRole = storage.getSelectedRole();
        if (localRole) {
          role = localRole;
          storage.setRole(localRole);
        }
      }

      if (!role) {
        router.replace('/index');
        return;
      }

      const normalizedRole = role.trim().toUpperCase();
      if (normalizedRole.includes('ADMIN')) {
        router.replace('/admin');
        return;
      }
      if (normalizedRole.includes('FREELANCER')) {
        router.replace('/freelancer');
        return;
      }
      if (normalizedRole.includes('CLIENT')) {
        router.replace('/client');
        return;
      }

      router.replace('/');
    } catch {
      setErrorMessage('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (payload: SignUpRequest): Promise<boolean> => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      await authApi.signUp(payload);
      localStorage.setItem('pending_email', payload.email);
      router.replace('/index');
      return true;
    } catch (error: unknown) {
      setErrorMessage(readSignupError(error));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storage.logout();
    router.replace('/');
  };

  return { login, signUp, logout, isLoading, errorMessage, setErrorMessage };
}

function readSignupError(error: unknown): string {
  const err = error as { response?: { data?: unknown } };
  const body = err?.response?.data;
  if (typeof body === 'string' && body.trim()) return body;
  if (body && typeof body === 'object' && 'message' in body) {
    return String((body as { message: unknown }).message);
  }
  return 'Signup failed. Please check your information and try again.';
}
