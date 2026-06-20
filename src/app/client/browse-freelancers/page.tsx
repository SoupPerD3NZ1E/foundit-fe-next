'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { FreelancerProfile } from '@/lib/api/freelancer';
import { fromDataOrUrl } from '@/lib/utils/imageUrl';

function getInitials(name?: string | null): string {
  return String(name || 'F').trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function getId(f: FreelancerProfile): string | number {
  return f.id ?? f.profileId ?? f.freelancerId ?? f.freelancerProfileId ?? 'unknown';
}

export default function BrowseFreelancersPage() {
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [filtered, setFiltered] = useState<FreelancerProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<FreelancerProfile[]>('/freelancer/active')
      .then(r => { setFreelancers(r.data); setFiltered(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(freelancers.filter(f =>
      f.freelancerName?.toLowerCase().includes(q) ||
      f.freelancerJob?.toLowerCase().includes(q) ||
      f.workLocation?.toLowerCase().includes(q)
    ));
  }, [search, freelancers]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Browse Freelancers</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Find skilled professionals for your projects.</p>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, skill, or location..."
            className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-[#111827] outline-none focus:border-[#2563eb]" />
        </div>
        {loading && <div className="text-center text-sm text-[#6b7280] py-20">Loading freelancers...</div>}
        {!loading && filtered.length === 0 && <div className="text-center text-sm text-[#6b7280] py-20">No freelancers found.</div>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(f => {
            const fId = getId(f);
            const avatar = fromDataOrUrl(f.profilePictureData, f.profilePictureType, f.profilePictureUrl) || undefined;
            const prices = (f.activeService ?? []).map(s => Number(s.price)).filter(p => isFinite(p) && p > 0);
            const minPrice = prices.length ? Math.min(...prices) : null;
            return (
              <Link key={String(fId)} href={fId === 'unknown' ? '#' : `/client/freelancer-view-details/${fId}`}
                className="block rounded-2xl border border-[#e5e7eb] bg-white p-5 transition hover:border-[#bfdbfe] hover:shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e5e7eb] bg-[#eff6ff] text-sm font-semibold text-[#2563eb]">
                    {avatar ? <img src={avatar} alt={f.freelancerName} className="h-full w-full object-cover" /> : getInitials(f.freelancerName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#111827]">{f.freelancerName}</h3>
                    <p className="mt-1 truncate text-xs text-[#6b7280]">{f.freelancerJob || 'Freelancer'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
                  <span className="inline-flex items-center gap-1 text-[#f59e0b]"><Star className="h-3.5 w-3.5 fill-current" />{Number(f.rating || 0).toFixed(1)}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{f.workLocation || 'Remote'}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#6b7280]">{Number(f.yearExperience || 0)} yrs exp</span>
                  <span className="text-sm font-semibold text-[#2563eb]">{minPrice ? `$${minPrice}+` : 'View'}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
