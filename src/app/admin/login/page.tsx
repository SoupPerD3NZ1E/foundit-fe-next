'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, LockKeyhole, ShieldCheck } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { storage } from '@/lib/auth/storage';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await apiClient.post<{ token: string }>('/auth/login', { email, password });
      const token = res.data.token;
      const parts = token.split('.');
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
      const payload = JSON.parse(atob(padded));
      const authorities = Array.isArray(payload.authorities) ? payload.authorities.join(',') : String(payload.role ?? payload.roles ?? payload.authority ?? '');
      if (!authorities.toUpperCase().includes('ADMIN')) { setError('This account does not have admin access.'); setLoading(false); return; }
      storage.setToken(token);
      storage.setRole('ADMIN');
      router.replace('/admin/dashboard');
    } catch { setError('Invalid admin email or password.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <section className="w-full rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfdf5]">
              <ShieldCheck className="h-6 w-6 text-[#16a34a]" />
            </div>
            <h1 className="text-2xl font-semibold text-[#111827]">Admin Login</h1>
            <p className="mt-2 text-sm text-[#6b7280]">Sign in with an administrator account.</p>
          </div>
          {error && <div className="mb-5 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-medium text-[#dc2626]">{error}</div>}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#374151]">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:bg-white"
                placeholder="admin@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#374151]">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="h-11 w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 pr-11 text-sm text-[#111827] outline-none focus:border-[#16a34a] focus:bg-white"
                  placeholder="Enter password" />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#6b7280] hover:bg-[#f3f4f6]">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#16a34a] px-4 text-sm font-semibold text-white hover:bg-[#15803d] disabled:opacity-70">
              <LockKeyhole className="h-4 w-4" />
              {loading ? 'Signing in...' : 'Sign in as Admin'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
