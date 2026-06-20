'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { storage } from '@/lib/auth/storage';
import { roleApi } from '@/lib/api/role';
import { RoleEnum } from '@/types/auth';

export const dynamic = 'force-dynamic';

export default function ChooseRolePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<RoleEnum | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const email = storage.getPendingEmail() ?? '';
      await roleApi.chooseRole({ email, role: selected });
      storage.setRole(selected);
      storage.setSelectedRole(selected);
      router.replace(`/auth/sign-in?email=${encodeURIComponent(email)}`);
    } catch {
      setError('Failed to set role. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#111827]">Choose your role</h1>
          <p className="mt-2 text-sm text-[#6b7280]">How would you like to use FOUND IT?</p>
        </div>
        {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button type="button" onClick={() => setSelected(RoleEnum.CLIENT)}
            className={`rounded-2xl border-2 p-6 text-center transition ${selected === RoleEnum.CLIENT ? 'border-[#2563eb] bg-[#eff6ff]' : 'border-[#e5e7eb] bg-white hover:border-[#2563eb]'}`}>
            <div className="text-3xl mb-3">💼</div>
            <p className="font-semibold text-[#111827]">I want to hire</p>
            <p className="text-xs text-[#6b7280] mt-1">Find and collaborate with top talent</p>
          </button>
          <button type="button" onClick={() => setSelected(RoleEnum.FREELANCER)}
            className={`rounded-2xl border-2 p-6 text-center transition ${selected === RoleEnum.FREELANCER ? 'border-[#2563eb] bg-[#eff6ff]' : 'border-[#e5e7eb] bg-white hover:border-[#2563eb]'}`}>
            <div className="text-3xl mb-3">⚡</div>
            <p className="font-semibold text-[#111827]">I want to freelance</p>
            <p className="text-xs text-[#6b7280] mt-1">Offer services and build your profile</p>
          </button>
        </div>
        <button type="button" onClick={handleContinue} disabled={!selected || loading}
          className="w-full h-11 rounded-xl bg-[#2563eb] text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Setting up...' : 'Continue to setup'}
        </button>
      </div>
    </div>
  );
}
