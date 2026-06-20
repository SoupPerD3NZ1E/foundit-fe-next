'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { House, Search, SquarePlus, ClipboardList, CreditCard as CreditCardIcon, MessageSquareMore, Bell, ChevronDown, ChevronRight, User, Settings, CreditCard, LogOut } from 'lucide-react';
import { storage } from '@/lib/auth/storage';

type MenuKey = 'dashboard' | 'my-work' | 'my-services' | 'incoming-requests' | 'payments';

const navItems: { key: MenuKey; label: string; icon: any; href: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: House, href: '/freelancer/dashboard' },
  { key: 'my-work', label: 'My Work', icon: Search, href: '/freelancer/active-work' },
  { key: 'my-services', label: 'My Services', icon: SquarePlus, href: '/freelancer/my-services' },
  { key: 'incoming-requests', label: 'Incoming Requests', icon: ClipboardList, href: '/freelancer/hire-requests' },
  { key: 'payments', label: 'Payments', icon: CreditCardIcon, href: '/freelancer/earnings' },
];

export default function FreelancerHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [panelOpen, setPanelOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Freelancer');
  const [initials, setInitials] = useState('FL');
  const panelRef = useRef<HTMLDivElement>(null);
  const activeKey = navItems.find(n => pathname.startsWith(n.href))?.key ?? 'dashboard';

  useEffect(() => {
    const token = storage.getToken();
    if (!token) return;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return;
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
      const payload = JSON.parse(atob(padded));
      const name = payload.freelancerName ?? payload.fullName ?? payload.name ?? payload.preferred_username ?? payload.sub ?? 'Freelancer';
      setDisplayName(name);
      setInitials(name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase());
    } catch {}
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setPanelOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const logout = () => { storage.logout(); setPanelOpen(false); router.replace('/auth/sign-in'); };
  const navClass = (key: MenuKey) => key === activeKey
    ? 'inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#eef2ff] px-4 py-3 text-[15px] font-medium text-[#2563eb]'
    : 'inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-[15px] font-medium text-[#4b5563] transition hover:bg-[#f9fafb]';

  return (
    <header className="mx-auto flex w-full h-16 border-b border-b-gray-300 justify-between items-center px-6 py-4 lg:px-10 sticky top-0 z-50 bg-white">
      <div className="w-32 h-16 flex items-center">
        <Image src="/assets/images/logo.png" alt="FOUNDIT" width={128} height={64} className="object-contain" />
      </div>
      <div className="flex items-center gap-8">
        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map(({ key, label, icon: Icon, href }) => (
            <Link key={key} href={href} className={navClass(key)}><Icon className="h-4 w-4" />{label}</Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-5">
        <div className="hidden h-12 w-px bg-[#e5e7eb] lg:block" />
        <Link href="/freelancer/chat" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f9fafb] hover:text-[#111827]"><MessageSquareMore className="h-5 w-5" /></Link>
        <Link href="/freelancer/notification" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f9fafb] hover:text-[#111827]"><Bell className="h-5 w-5" /></Link>
        <div className="relative" ref={panelRef}>
          <button type="button" onClick={() => setPanelOpen(v => !v)}
            className={`flex items-center gap-3 rounded-xl px-2 py-1.5 border transition-all duration-200 ${panelOpen ? 'border-gray-200 bg-white shadow-md' : 'border-transparent hover:border-gray-200 hover:shadow-sm hover:bg-[#f9fafb]'}`}>
            <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500 shadow-sm shrink-0">{initials}</div>
            <div className="hidden text-left sm:block pr-1">
              <p className="text-[15px] font-semibold leading-5 text-[#111827] whitespace-nowrap">{displayName}</p>
              <p className="text-sm leading-5 text-[#6b7280]">Freelancer</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-300 ${panelOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className={`absolute top-[calc(100%+10px)] right-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 transition-all duration-200 origin-top-right ${panelOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-600 px-5 pt-5 pb-6">
              <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-white/5" />
              <div className="relative flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500 shrink-0">{initials}</div>
                <div><p className="text-[15px] font-semibold text-white leading-5">{displayName}</p><p className="text-sm text-slate-300 mt-0.5">Freelancer</p></div>
              </div>
            </div>
            <div className="p-2">
              {[
                { key: 'profile', label: 'My Profile', desc: 'View & edit your details', icon: User, href: '/freelancer/profile' },
                { key: 'settings', label: 'Settings', desc: 'Preferences & security', icon: Settings, href: '/freelancer/setting' },
                { key: 'ekyc', label: 'eKYC', desc: 'Identity verification', icon: CreditCard, href: '/index/ekyc' },
              ].map(({ key, label, desc, icon: Icon, href }) => (
                <Link key={key} href={href} onClick={() => setPanelOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-gray-50">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500"><Icon className="h-5 w-5" /></span>
                  <div className="flex-1 min-w-0 text-left"><p className="text-[14px] font-semibold text-gray-800 leading-5">{label}</p><p className="text-[12px] text-gray-400 mt-0.5 leading-4">{desc}</p></div>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </Link>
              ))}
            </div>
            <div className="px-2 pb-3">
              <div className="mx-2 mb-2 h-px bg-gray-100" />
              <button type="button" onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-rose-50">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><LogOut className="h-5 w-5" /></span>
                <div className="flex-1 text-left"><p className="text-[14px] font-semibold text-rose-500 leading-5">Logout</p><p className="text-[12px] text-rose-300 mt-0.5 leading-4">End your session</p></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
