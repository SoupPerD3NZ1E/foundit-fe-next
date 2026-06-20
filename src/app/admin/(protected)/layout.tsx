'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/auth/storage';
import { Bell, CircleUserRound, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = storage.getToken();
    if (!token) { router.replace('/admin/login'); return; }
    try {
      const parts = token.split('.');
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
      const payload = JSON.parse(atob(padded));
      const authorities = Array.isArray(payload.authorities) ? payload.authorities.join(',') : String(payload.role ?? payload.roles ?? payload.authority ?? '');
      if (!authorities.toUpperCase().includes('ADMIN')) { storage.logout(); router.replace('/admin/login'); }
    } catch { router.replace('/admin/login'); }
  }, [router]);

  const logout = () => { storage.logout(); router.replace('/admin/login'); };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <header className="flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-6">
        <h1 className="text-[18px] font-semibold text-[#222]">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#374151] hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(v => !v)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-[#374151] hover:bg-gray-200">
              <CircleUserRound className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
                <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-[#dc2626] hover:bg-[#fef2f2]">
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
