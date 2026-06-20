'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Star } from 'lucide-react';
import apiClient from '@/lib/api/client';

interface Gig {
  gigId?: number | string;
  id?: number | string;
  freelancerId?: number | string;
  freelancerName?: string;
  serviceTitle: string;
  category: string;
  price: number | string;
  rating?: number;
  gigMainImageData?: string;
  gigMainImageUrl?: string;
  gigMainImageContentType?: string;
}

export default function BrowseGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filtered, setFiltered] = useState<Gig[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<Gig[]>('/gig/active')
      .then(r => { setGigs(r.data); setFiltered(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(gigs.filter(g =>
      g.serviceTitle?.toLowerCase().includes(q) ||
      g.category?.toLowerCase().includes(q) ||
      g.freelancerName?.toLowerCase().includes(q)
    ));
  }, [search, gigs]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Browse Gigs</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Explore services offered by our freelancers.</p>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search gigs by title, category, or freelancer..."
            className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-[#111827] outline-none focus:border-[#2563eb]" />
        </div>
        {loading && <div className="text-center text-sm text-[#6b7280] py-20">Loading gigs...</div>}
        {!loading && filtered.length === 0 && <div className="text-center text-sm text-[#6b7280] py-20">No gigs found.</div>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((g, i) => {
            const gigId = g.gigId ?? g.id;
            const imageUrl = g.gigMainImageData
              ? `data:${g.gigMainImageContentType || 'image/jpeg'};base64,${g.gigMainImageData}`
              : g.gigMainImageUrl || 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&q=80';
            return (
              <Link key={i} href={gigId ? `/client/gig/${gigId}` : '#'}
                className="block rounded-2xl border border-[#e5e7eb] bg-white overflow-hidden transition hover:border-[#bfdbfe] hover:shadow-sm">
                <img src={imageUrl} alt={g.serviceTitle} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <span className="text-xs font-medium text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-full">{g.category}</span>
                  <h3 className="mt-2 text-sm font-semibold text-[#111827] line-clamp-2">{g.serviceTitle}</h3>
                  <p className="mt-1 text-xs text-[#6b7280]">by {g.freelancerName || 'Freelancer'}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs text-[#f59e0b]"><Star className="h-3.5 w-3.5 fill-current" />{Number(g.rating || 0).toFixed(1)}</span>
                    <span className="text-sm font-semibold text-[#111827]">${Number(g.price || 0)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
