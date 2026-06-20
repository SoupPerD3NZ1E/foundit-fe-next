'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/auth/storage';
import ClientHeader from '@/components/client/ClientHeader';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!storage.isLoggedIn()) {
      router.replace('/auth/sign-in');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ClientHeader />
      {children}
    </div>
  );
}
