'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storage } from '@/lib/auth/storage';
import { extractRoleFromJwt } from '@/lib/auth/jwt';

function extractEmailFromJwt(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded));
    return payload.email || payload.sub || null;
  } catch {
    return null;
  }
}

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setErrorMessage('Google sign-in failed. Please try again.');
      return;
    }

    storage.setToken(token);

    const email = extractEmailFromJwt(token);
    if (email && !localStorage.getItem('pending_email')) {
      localStorage.setItem('pending_email', email);
    }

    let role = extractRoleFromJwt(token);

    if (!role) {
      const localRole = storage.getSelectedRole();
      if (localRole) {
        role = localRole;
        storage.setRole(localRole);
      } else {
        router.replace('/index');
        return;
      }
    } else {
      storage.setRole(role);
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
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#f8f8f8] px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[60vh] w-full place-items-center">
        <div className="w-full max-w-md text-center">
          {!errorMessage ? (
            <p className="text-sm font-medium text-gray-700">Signing you in with Google…</p>
          ) : (
            <p className="text-sm font-medium text-red-600">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f8f8]" />}>
      <GoogleCallbackInner />
    </Suspense>
  );
}
