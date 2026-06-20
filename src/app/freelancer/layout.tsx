'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/auth/storage';
import FreelancerHeader from '@/components/client/FreelancerHeader';

export default function FreelancerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!storage.isLoggedIn()) router.replace('/auth/sign-in');
  }, [router]);
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <FreelancerHeader />
      {children}
    </div>
  );
}
