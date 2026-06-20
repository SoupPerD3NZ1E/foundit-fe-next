'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/choose-role');
  }, [router]);
  return null;
}
