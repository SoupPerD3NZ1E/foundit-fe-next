'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BriefcaseBusiness, CodeXml, Check, Sparkles } from 'lucide-react';
import { roleApi } from '@/lib/api/role';
import { storage } from '@/lib/auth/storage';
import { RoleEnum } from '@/types/auth';

export const dynamic = 'force-dynamic';

export default function ChooseRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleEnum | null>(null);

  const continueSetup = async () => {
    if (!selectedRole) return;

    const email = localStorage.getItem('pending_email');

    if (!email) {
      router.replace('/auth/sign-in');
      return;
    }

    storage.setSelectedRole(selectedRole);

    try {
      await roleApi.chooseRole({ email, role: selectedRole });
      localStorage.removeItem('pending_email');
      router.replace(`/auth/sign-in?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('Role update failed:', err);
    }
  };

  return (
    <div className="h-screen bg-[#f8f8f8] px-6 py-6">
      <div className="mx-auto flex w-full flex-col items-center overflow-y-auto">
        <div className="mb-16 mt-2 p-12">
          <Image
            src="/assets/images/logo.png"
            alt="FOUND IT"
            width={120}
            height={32}
            className="h-8 w-full object-contain"
          />
        </div>

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e9f8ef]">
          <Sparkles className="h-6 w-6 text-[#0db14b]" />
        </div>

        <p className="mb-2 text-[24px] font-medium text-[#111827]">
          Nice! Your feed is tuned.
        </p>

        <h1 className="mb-10 text-center text-[18px] font-normal text-[#64748b]">
          Now let's set you up so you can start right away
        </h1>

        <div className="mb-14 grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Client */}
          <button
            type="button"
            onClick={() => setSelectedRole(RoleEnum.CLIENT)}
            className={`relative w-full rounded-2xl border bg-white p-5 text-left transition cursor-pointer ${
              selectedRole === RoleEnum.CLIENT
                ? 'border-[#16a34a] shadow-sm'
                : 'border-[#d9dde3] hover:border-[#bfc6cf]'
            }`}
          >
            {selectedRole === RoleEnum.CLIENT && (
              <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#16a34a]">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ff]">
              <BriefcaseBusiness className="h-5 w-5 text-[#2563eb]" />
            </div>
            <h2 className="mb-2 text-[16px] font-medium text-[#111827]">I want to hire</h2>
            <p className="mb-4 text-[14px] leading-6 text-[#475569]">
              Find and collaborate<br />with top talent
            </p>
            <span className="text-[13px] text-[#94a3b8]">5 quick steps</span>
          </button>

          {/* Freelancer */}
          <button
            type="button"
            onClick={() => setSelectedRole(RoleEnum.FREELANCER)}
            className={`relative w-full rounded-2xl border bg-white p-5 text-left transition cursor-pointer ${
              selectedRole === RoleEnum.FREELANCER
                ? 'border-[#16a34a] shadow-sm'
                : 'border-[#d9dde3] hover:border-[#bfc6cf]'
            }`}
          >
            {selectedRole === RoleEnum.FREELANCER && (
              <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#16a34a]">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8ee]">
              <CodeXml className="h-5 w-5 text-[#16a34a]" />
            </div>
            <h2 className="mb-2 text-[16px] font-medium text-[#111827]">I want to freelance</h2>
            <p className="mb-4 text-[14px] leading-6 text-[#475569]">
              Offer services and<br />build your profile
            </p>
            <span className="text-[13px] text-[#94a3b8]">6 quick steps</span>
          </button>
        </div>

        <button
          type="button"
          onClick={continueSetup}
          disabled={!selectedRole}
          className={`mb-4 h-11 w-full max-w-xs rounded-lg px-6 text-[14px] font-medium text-white transition ${
            selectedRole
              ? 'bg-[#00A63E] hover:bg-[#77ce8d] cursor-pointer'
              : 'cursor-not-allowed bg-[#b7e6c2]'
          }`}
        >
          Continue to setup
        </button>

        <p className="text-center text-[14px] text-[#7c8898]">
          Takes about 2 minutes · You can finish later
        </p>
      </div>
    </div>
  );
}
