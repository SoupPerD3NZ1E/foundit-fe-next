'use client';

import Link from 'next/link';
import {
  BriefcaseBusiness, FileText, BadgeDollarSign, CircleCheckBig,
  ChevronRight, User, CalendarDays, MessageCircle, MapPin,
  UserRoundSearch, ReceiptText, Star,
} from 'lucide-react';
import { useClientDashboard, DashboardOrderStatus, DashboardOrder } from '@/hooks/useClientDashboard';
import { FreelancerProfile } from '@/lib/api/freelancer';
import { fromDataOrUrl } from '@/lib/utils/imageUrl';

function formatAmount(amount: unknown): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(amount) || 0);
}

function formatDate(date?: string | null): string {
  const d = new Date(date || '');
  if (isNaN(d.getTime())) return 'No date';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name?: string | null): string {
  return String(name || 'F').trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function getStatusLabel(status: DashboardOrderStatus): string {
  switch (status) {
    case 'in-progress': return 'In Progress';
    case 'in-review': return 'In Review';
    case 'revision-requested': return 'Revision Requested';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getStatusClasses(status: DashboardOrderStatus): string {
  switch (status) {
    case 'in-progress': case 'accepted': return 'bg-[#eff6ff] text-[#2563eb]';
    case 'in-review': case 'pending': return 'bg-[#fef3c7] text-[#d97706]';
    case 'completed': return 'bg-[#dcfce7] text-[#16a34a]';
    case 'cancelled': case 'rejected': return 'bg-[#fee2e2] text-[#ef4444]';
    default: return 'bg-[#ffedd5] text-[#f97316]';
  }
}

function getTxStatusClasses(status: string): string {
  switch (status) {
    case 'PAID': return 'bg-[#dcfce7] text-[#16a34a]';
    case 'PENDING': return 'bg-[#fef3c7] text-[#d97706]';
    case 'CANCELLED': case 'FAILED': return 'bg-[#fee2e2] text-[#ef4444]';
    default: return 'bg-[#dbeafe] text-[#2563eb]';
  }
}

function getFreelancerId(f: FreelancerProfile): string | number {
  return f.id ?? f.profileId ?? f.freelancerId ?? f.freelancerProfileId ?? f.freelancerName ?? 'unknown';
}

export default function ClientDashboardPage() {
  const {
    activeOrders, orders, transactions, recommendedFreelancers,
    totalSpent, pendingPayments, completedProjects, isLoading, loadError,
  } = useClientDashboard();

  const firstChatLink = orders.find(o => o.roomId)
    ? `/client/${orders.find(o => o.roomId)!.roomId}/chat`
    : '/client/chat';

  const placeholderSlides: { id: string | number; name: string; job: string; rating: number; location: string; experience: string; price: string; avatar?: string; link: string }[] = [
    { id: 'find-design', name: 'Find a designer', job: 'UI, branding, landing pages', rating: 4.9, location: 'Available now', experience: 'Browse talent', price: 'Explore', link: '/client/browse-freelancers' },
    { id: 'find-dev', name: 'Find a developer', job: 'Web apps, APIs, dashboards', rating: 4.8, location: 'Remote', experience: 'Top services', price: 'Explore', link: '/client/browse-freelancers' },
    { id: 'find-content', name: 'Find a creator', job: 'Writing, video, marketing', rating: 4.7, location: 'Ready to hire', experience: 'Fresh profiles', price: 'Explore', link: '/client/browse-freelancers' },
  ];

  const freelancerSlides = recommendedFreelancers.length > 0
    ? recommendedFreelancers.map(f => {
        const fId = getFreelancerId(f);
        const prices = (f.activeService ?? []).map(s => Number(s.price)).filter(p => isFinite(p) && p > 0);
        const minPrice = prices.length ? Math.min(...prices) : null;
        return {
          id: fId, name: f.freelancerName, job: f.freelancerJob || 'Available freelancer',
          rating: Number(f.rating || 0), location: f.workLocation || 'Remote',
          experience: `${Number(f.yearExperience || 0)} yrs exp`,
          price: minPrice ? `$${minPrice}+` : 'View',
          avatar: fromDataOrUrl(f.profilePictureData, f.profilePictureType, f.profilePictureUrl) || undefined,
          link: fId === 'unknown' ? '/client/browse-freelancers' : `/client/freelancer-view-details/${fId}`,
        };
      })
    : placeholderSlides;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6">
      <div className="mx-auto w-full pl-16 pr-16">
        {/* Header */}
        <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-[30px] font-semibold leading-none text-[#111827]">Client Dashboard</h1>
              <p className="mt-2 text-sm text-[#6b7280]">Manage your projects, hire freelancers, and track your orders.</p>
            </div>
            <Link href="/client/browse-freelancers" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1d4ed8]">
              <UserRoundSearch className="h-4 w-4" /> Find Freelancers
            </Link>
          </div>
        </section>

        {loadError && <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</div>}

        {/* Stats */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-[#111827]">Client Overview</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: BriefcaseBusiness, bg: 'bg-[#eff6ff]', iconColor: 'text-[#2563eb]', hover: 'hover:border-[#bfdbfe]', value: activeOrders.length, label: 'Active Orders', sub: `${activeOrders.length} Active Projects`, href: '/client/my-orders' },
              { icon: FileText, bg: 'bg-[#faf5ff]', iconColor: 'text-[#a855f7]', hover: 'hover:border-[#e9d5ff]', value: orders.length, label: 'Total Projects', sub: `${orders.length} Projects Posted`, href: '/client/my-orders' },
              { icon: BadgeDollarSign, bg: 'bg-[#fffbeb]', iconColor: 'text-[#eab308]', hover: 'hover:border-[#fde68a]', value: formatAmount(pendingPayments), label: 'Pending Payments', sub: `${formatAmount(pendingPayments)} Pending`, href: '/client/dashboard' },
              { icon: CircleCheckBig, bg: 'bg-[#f0fdf4]', iconColor: 'text-[#22c55e]', hover: 'hover:border-[#bbf7d0]', value: completedProjects, label: 'Completed Projects', sub: `${completedProjects} Completed`, href: '/client/my-orders' },
            ].map(({ icon: Icon, bg, iconColor, hover, value, label, sub, href }) => (
              <Link key={label} href={href} className={`rounded-2xl border border-[#e5e7eb] bg-white p-5 transition hover:shadow-sm ${hover}`}>
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <span className="text-3xl font-semibold text-[#111827]">{value}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-[#111827]">{label}</p>
                <p className="mt-1 text-xs text-[#6b7280]">{sub}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Left column */}
          <div className="xl:col-span-8">
            {/* Active Orders */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef2ff]">
                  <BriefcaseBusiness className="h-4 w-4 text-[#2563eb]" />
                </div>
                <h2 className="text-[18px] font-semibold text-[#111827]">Active Orders</h2>
              </div>
              <Link href="/client/my-orders" className="inline-flex items-center gap-1 text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8]">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="h-96 space-y-4 overflow-y-auto pr-2">
              {isLoading && <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 text-sm text-[#6b7280]">Loading active orders...</div>}
              {!isLoading && activeOrders.map(order => (
                <div key={order.id} className="rounded-2xl border border-[#e5e7eb] bg-white p-5 transition hover:shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#111827]">{order.title}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
                        <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{order.freelancerName}</span>
                        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Due {formatDate(order.dueDate)}</span>
                        <span className="inline-flex items-center gap-1"><BadgeDollarSign className="h-3.5 w-3.5" />{formatAmount(order.price)}</span>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(order.status)}`}>{getStatusLabel(order.status)}</span>
                  </div>
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-[#6b7280]">Progress</span>
                      <span className="text-xs font-semibold text-[#2563eb]">{order.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
                      <div className="h-full rounded-full bg-[#2563eb]" style={{ width: `${order.progress}%` }} />
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Link href={`/client/my-orders/${order.id}/view-detail`} className="inline-flex items-center justify-center rounded-xl bg-[#2563eb] px-4 py-3 text-sm font-medium text-white hover:bg-[#1d4ed8]">View Details</Link>
                    <Link href={order.roomId ? `/client/${order.roomId}/chat` : '/client/chat'} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
                      <MessageCircle className="h-4 w-4" /> Message
                    </Link>
                  </div>
                </div>
              ))}
              {!isLoading && activeOrders.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-white p-10 text-center">
                  <h3 className="text-lg font-semibold text-[#111827]">No active orders</h3>
                  <p className="mt-2 text-sm text-[#6b7280]">Accepted and in-progress projects will appear here.</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-[#111827]">Quick Actions</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { href: '/client/browse-freelancers', bg: 'bg-[#ecfdf3]', icon: UserRoundSearch, iconColor: 'text-[#2563eb]', label: 'Find Freelancer', hover: 'hover:border-[#c7d2fe] hover:bg-[#f8fbff]' },
                  { href: firstChatLink, bg: 'bg-[#ecfdf3]', icon: MessageCircle, iconColor: 'text-[#22c55e]', label: 'View Messages', hover: 'hover:border-[#c7d2fe] hover:bg-[#f8fbff]' },
                  { href: '/client/browse-gigs', bg: 'bg-[#fff7ed]', icon: BriefcaseBusiness, iconColor: 'text-[#f97316]', label: 'Manage Orders', hover: 'hover:border-[#fed7aa] hover:bg-[#fff7ed]' },
                ].map(({ href, bg, icon: Icon, iconColor, label, hover }) => (
                  <Link key={label} href={href} className={`rounded-2xl border border-[#e5e7eb] bg-white p-5 text-center transition ${hover}`}>
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${bg}`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <p className="mt-4 text-sm font-medium text-[#111827]">{label}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Freelancers For You */}
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#111827]">Freelancers For You</h2>
                <Link href="/client/browse-freelancers" className="inline-flex items-center gap-1 text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8]">
                  Browse all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {freelancerSlides.map(card => (
                  <Link key={String(card.id)} href={card.link} className="block rounded-2xl border border-[#e5e7eb] bg-white p-4 transition hover:border-[#bfdbfe] hover:shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e5e7eb] bg-[#eff6ff] text-sm font-semibold text-[#2563eb]">
                        {card.avatar ? <img src={card.avatar} alt={card.name} className="h-full w-full object-cover" /> : getInitials(card.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-[#111827]">{card.name}</h3>
                        <p className="mt-1 truncate text-xs text-[#6b7280]">{card.job}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6b7280]">
                      <span className="inline-flex items-center gap-1 text-[#f59e0b]"><Star className="h-3.5 w-3.5 fill-current" />{card.rating}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{card.location}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs text-[#6b7280]">{card.experience}</span>
                      <span className="text-sm font-semibold text-[#2563eb]">{card.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4 xl:col-span-4">
            {/* Spending Summary */}
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <div className="mb-5 flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4 text-[#2563eb]" />
                <h2 className="text-lg font-semibold text-[#111827]">Spending Summary</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-xl bg-[#eef2ff] p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#2563eb]">Total Spent</p>
                  <p className="mt-3 text-lg font-semibold text-[#111827]">{formatAmount(totalSpent)}</p>
                </div>
                <div className="rounded-xl bg-[#fff7ed] p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#f97316]">In Progress</p>
                  <p className="mt-3 text-lg font-semibold text-[#111827]">{formatAmount(pendingPayments)}</p>
                  <p className="mt-2 text-xs text-[#f97316]">{activeOrders.length} active orders</p>
                </div>
                <div className="rounded-xl bg-[#f0fdf4] p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#16a34a]">Completed</p>
                  <p className="mt-3 text-lg font-semibold text-[#111827]">{formatAmount(totalSpent)}</p>
                  <p className="mt-2 text-xs text-[#16a34a]">{completedProjects} orders</p>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-[#6b7280]" />
                  <h2 className="text-lg font-semibold text-[#111827]">Recent Transactions</h2>
                </div>
                <Link href="/client/dashboard" className="text-sm font-medium text-[#2563eb] hover:text-[#1d4ed8]">View all</Link>
              </div>
              <div className="h-96 space-y-5 overflow-y-auto pr-2">
                {isLoading && <div className="text-sm text-[#6b7280]">Loading transactions...</div>}
                {!isLoading && transactions.slice(0, 6).map(t => (
                  <div key={t.id} className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#e5e7eb] bg-[#f9fafb] text-xs font-semibold text-[#374151]">
                        {t.freelancerAvatar ? <img src={t.freelancerAvatar} alt={t.freelancerName} className="h-full w-full object-cover" /> : getInitials(t.freelancerName)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#111827]">{t.title}</p>
                        <p className="mt-1 truncate text-xs text-[#6b7280]">by {t.freelancerName}</p>
                        <p className="text-xs text-[#6b7280]">{formatDate(t.date)}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-[#111827]">-{formatAmount(t.amount)}</p>
                      <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${getTxStatusClasses(t.status)}`}>{t.status}</span>
                    </div>
                  </div>
                ))}
                {!isLoading && transactions.length === 0 && (
                  <div className="py-10 text-center">
                    <h3 className="text-sm font-semibold text-[#111827]">No transactions yet</h3>
                    <p className="mt-2 text-xs text-[#6b7280]">Your payments will appear here after checkout.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
