'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, User, DollarSign, BriefcaseBusiness, Eye, Star, Box, ShoppingBag, PlusSquare, ChevronRight, LayoutGrid, FileText, Wallet, X } from 'lucide-react';
import { useFreelancerDashboard, DashboardService, DashboardOrder, PendingPayment } from '@/hooks/useFreelancerDashboard';
import apiClient from '@/lib/api/client';

function fmtCurrency(v: number): string {
  return Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function svcStatusClass(s: string): string {
  return s === 'Active' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fef3c7] text-[#d97706]';
}

function orderStatusClass(s: string): string {
  return s === 'In Progress' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#fef3c7] text-[#d97706]';
}

export default function FreelancerDashboardPage() {
  const { services, orders, pendingPayments, earningsSummary, totalEarnings, profileViews, avgRating, loadingOrders, dashboardError } = useFreelancerDashboard();
  const [confirmingId, setConfirmingId] = useState('');
  const [downloadingId, setDownloadingId] = useState('');
  const [localError, setLocalError] = useState('');
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawSpeed, setWithdrawSpeed] = useState<'instant' | 'standard'>('instant');
  const [withdrawError, setWithdrawError] = useState('');

  const previewServices = services.slice(0, 6);

  const stats = [
    { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, badge: '+12%', iconBg: 'bg-[#dcfce7]', iconColor: 'text-[#16a34a]', icon: DollarSign },
    { label: 'Active Orders', value: String(orders.length), badge: '2 new', iconBg: 'bg-[#f3e8ff]', iconColor: 'text-[#9333ea]', icon: BriefcaseBusiness },
    { label: 'Profile Views', value: profileViews.toLocaleString(), badge: '+5%', iconBg: 'bg-[#e0e7ff]', iconColor: 'text-[#4f46e5]', icon: Eye },
    { label: 'Avg. Rating', value: avgRating > 0 ? avgRating.toFixed(1) : '0.0', badge: 'Top Rated', iconBg: 'bg-[#fef3c7]', iconColor: 'text-[#d97706]', icon: Star },
  ];

  const confirmPayment = async (payment: PendingPayment) => {
    if (!payment.tranId || confirmingId) return;
    setConfirmingId(payment.tranId); setLocalError('');
    try {
      await apiClient.post(`/payment/freelancer/${encodeURIComponent(payment.tranId)}/confirm`, {});
      window.location.reload();
    } catch (e: any) {
      setLocalError(e.response?.data?.message || 'Unable to confirm payment.');
      setConfirmingId('');
    }
  };

  const downloadProof = async (payment: PendingPayment) => {
    if (!payment.tranId || downloadingId) return;
    setDownloadingId(payment.tranId);
    try {
      const res = await apiClient.get(`/payment/freelancer/${encodeURIComponent(payment.tranId)}/proof`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = payment.proofFileName || `${payment.tranId}-proof`; a.click();
      URL.revokeObjectURL(url);
    } catch { setLocalError('Unable to download proof.'); }
    setDownloadingId('');
  };

  const formatLastPaid = () => {
    if (!earningsSummary.lastPaidAt || earningsSummary.lastPaidAmount <= 0) return 'No paid earnings yet';
    return `$${fmtCurrency(earningsSummary.lastPaidAmount)} - ${new Date(earningsSummary.lastPaidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-6">
      <div className="mx-auto w-full space-y-6 pl-16 pr-16">
        {/* Header */}
        <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-[30px] font-semibold leading-none text-[#111827]">Freelancer Dashboard</h1>
              <p className="mt-1 text-sm text-[#6b7280]">Manage your services, track earnings, and grow your freelance business.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/freelancer/create-new-service" className="inline-flex items-center gap-2 rounded-xl bg-[#16a34a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#15803d]">
                <Plus className="h-4 w-4" /> Post a Gig
              </Link>
              <Link href="/freelancer/profile" className="inline-flex items-center gap-2 rounded-xl border border-[#d1d5db] bg-white px-4 py-2.5 text-sm font-semibold text-[#16a34a] hover:bg-[#f9fafb]">
                <User className="h-4 w-4" /> View Profile
              </Link>
            </div>
          </div>
        </section>

        {(dashboardError || localError) && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{dashboardError || localError}</div>
        )}

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, badge, iconBg, iconColor, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <span className="rounded-full bg-[#f3f4f6] px-2.5 py-1 text-[11px] font-medium text-[#6b7280]">{badge}</span>
              </div>
              <p className="mt-4 text-sm text-[#6b7280]">{label}</p>
              <h3 className="mt-1 text-[20px] font-bold text-[#111827]">{value}</h3>
            </div>
          ))}
        </section>

        {/* Services + Earnings */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="flex h-[620px] flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eef2f7] px-5 py-4">
                <div className="flex items-center gap-2"><Box className="h-5 w-5 text-[#16a34a]" /><h2 className="text-[16px] font-bold text-[#111827]">My Active Services</h2></div>
                <Link href="/freelancer/my-services" className="text-sm font-semibold text-[#16a34a] hover:opacity-80">View All</Link>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[#eef2f7]">
                {previewServices.length === 0 && (
                  <div className="flex h-full items-center justify-center text-sm font-medium text-[#6b7280]">No gig available yet.</div>
                )}
                {previewServices.map((svc, i) => (
                  <div key={i} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <img src={svc.image} alt={svc.title} className="h-12 w-12 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-[#111827]">{svc.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6b7280]">
                          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{svc.views} views</span>
                          <span className="inline-flex items-center gap-1"><ShoppingBag className="h-3.5 w-3.5" />{svc.orders} orders</span>
                          <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-[#f59e0b]" />{svc.rating}</span>
                          <span className="font-semibold text-[#374151]">${svc.price}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${svcStatusClass(svc.status)}`}>{svc.status}</span>
                  </div>
                ))}
              </div>
              <div className="p-4">
                <Link href="/freelancer/create-new-service" className="flex items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#15803d]">
                  <PlusSquare className="h-4 w-4" /> Add New Service
                </Link>
              </div>
            </div>
          </div>

          {/* Earnings Summary */}
          <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-[#eef2f7] px-5 py-4">
              <DollarSign className="h-5 w-5 text-[#16a34a]" /><h2 className="text-[16px] font-bold text-[#111827]">Earnings Summary</h2>
            </div>
            <div className="divide-y divide-[#eef2f7]">
              {[
                { label: 'This Month', value: `$${fmtCurrency(earningsSummary.thisMonth)}`, sub: 'Paid client orders this month', subColor: 'text-[#22c55e]' },
                { label: 'Pending Clearance', value: `$${fmtCurrency(earningsSummary.pendingClearance)}`, sub: 'Awaiting client approval', subColor: 'text-[#6b7280]' },
                { label: 'Available for Withdrawal', value: `$${fmtCurrency(earningsSummary.availableForWithdrawal)}`, sub: 'Ready to withdraw', subColor: 'text-[#6b7280]' },
                { label: 'Last Paid Earning', value: formatLastPaid(), sub: '', subColor: '' },
              ].map(({ label, value, sub, subColor }) => (
                <div key={label} className="px-5 py-5">
                  <p className="text-sm text-[#6b7280]">{label}</p>
                  <h3 className="mt-1 text-[20px] font-bold text-[#111827]">{value}</h3>
                  {sub && <p className={`mt-1 text-sm ${subColor}`}>{sub}</p>}
                </div>
              ))}
            </div>
            <div className="p-5">
              <Link href="/freelancer/earnings" className="inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#16a34a] hover:opacity-80">
                View Earnings History <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-amber-100 bg-amber-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-amber-700" />
                <div>
                  <h2 className="text-[16px] font-bold text-[#111827]">Payments Waiting for Confirmation</h2>
                  <p className="text-sm text-amber-800">Check your bank app, review proof, then confirm only received payments.</p>
                </div>
              </div>
              <Link href="/freelancer/earnings" className="inline-flex items-center gap-2 self-start rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50">
                View All Payments <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-[#eef2f7]">
              {pendingPayments.map(payment => (
                <div key={payment.tranId} className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#111827]">{payment.projectTitle}</h3>
                    <p className="mt-1 text-sm text-[#6b7280]">{payment.clientName} submitted {payment.currency} payment</p>
                    <div className="mt-2 space-y-1 text-xs text-[#6b7280]">
                      <p>Transaction ID: <span className="font-medium text-[#111827]">{payment.tranId}</span></p>
                      {payment.proofReference && <p>Reference: <span className="font-medium text-[#111827]">{payment.proofReference}</span></p>}
                      {payment.submittedAt && <p>Submitted: {new Date(payment.submittedAt).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                    <span className="text-[22px] font-bold text-[#111827]">${fmtCurrency(payment.amount)}</span>
                    {payment.hasProofFile && (
                      <button type="button" onClick={() => downloadProof(payment)} disabled={downloadingId === payment.tranId}
                        className="rounded-xl border border-[#d1d5db] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] hover:bg-[#f9fafb] disabled:opacity-60">
                        {downloadingId === payment.tranId ? 'Opening...' : 'View Proof'}
                      </button>
                    )}
                    <button type="button" onClick={() => confirmPayment(payment)} disabled={confirmingId === payment.tranId}
                      className="rounded-xl bg-[#16a34a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#15803d] disabled:opacity-60">
                      {confirmingId === payment.tranId ? 'Confirming...' : 'Confirm Payment'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Active Orders */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#eef2f7] px-5 py-4">
                <div className="flex items-center gap-2"><LayoutGrid className="h-5 w-5 text-[#6b7280]" /><h2 className="text-[16px] font-bold text-[#111827]">Active Orders</h2></div>
                <Link href="/freelancer/active-work" className="text-sm font-semibold text-[#16a34a] hover:opacity-80">View All</Link>
              </div>
              <div className="divide-y divide-[#eef2f7]">
                {loadingOrders && <div className="px-5 py-8 text-center text-sm text-[#6b7280]">Loading active orders...</div>}
                {!loadingOrders && orders.length === 0 && <div className="px-5 py-8 text-center text-sm text-[#6b7280]">No in-progress hire requests yet.</div>}
                {orders.map((order, i) => (
                  <div key={i} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dcfce7]"><FileText className="h-5 w-5 text-[#22c55e]" /></div>
                      <div>
                        <h3 className="text-sm font-semibold text-[#111827]">{order.title}</h3>
                        <p className="mt-1 text-sm text-[#6b7280]">{order.client} <span className="mx-1">•</span> Due: {order.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                      <span className="text-[20px] font-bold text-[#111827]">${fmtCurrency(order.price)}</span>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${orderStatusClass(order.status)}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div />
        </section>
      </div>
    </div>
  );
}
