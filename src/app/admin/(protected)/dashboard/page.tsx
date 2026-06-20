'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, UserPlus, Users, BadgeDollarSign, ReceiptText, Clock3, CircleAlert, X } from 'lucide-react';
import { adminApi, AdminDashboard, AdminPendingReview, AdminEkycDetail } from '@/lib/api/admin';

function fmtNum(v?: number | null) { return new Intl.NumberFormat().format(v ?? 0); }
function fmtUSD(v?: number | null) { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(v ?? 0); }

function imageSrc(data?: string | number[] | null, type?: string | null): string | null {
  if (!data) return null;
  const ct = type || 'image/jpeg';
  if (typeof data === 'string') return data.startsWith('data:') ? data : `data:${ct};base64,${data}`;
  let b = '';
  for (const byte of data as number[]) b += String.fromCharCode(byte);
  return `data:${ct};base64,${btoa(b)}`;
}

export default function AdminDashboardPage() {
  const [dash, setDash] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [actionId, setActionId] = useState<number | null>(null);
  const [selected, setSelected] = useState<AdminEkycDetail | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<AdminPendingReview[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await adminApi.dashboard();
      setDash(data);
      setReviews(data.pendingReviewItems ?? []);
    } catch { setError('Dashboard data could not be loaded.'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (review: AdminPendingReview) => {
    setActionId(review.ekycId); setError(''); setActionMsg('');
    try { await adminApi.approveEkyc(review.ekycId); setReviews(r => r.filter(x => x.ekycId !== review.ekycId)); setActionMsg('E-KYC approved.'); }
    catch { setError('Could not approve this E-KYC review.'); }
    setActionId(null);
  };

  const reject = async (review: AdminPendingReview) => {
    setActionId(review.ekycId); setError(''); setActionMsg('');
    try { await adminApi.rejectEkyc(review.ekycId); setReviews(r => r.filter(x => x.ekycId !== review.ekycId)); setActionMsg('E-KYC rejected.'); }
    catch { setError('Could not reject this E-KYC review.'); }
    setActionId(null);
  };

  const openDetail = async (review: AdminPendingReview) => {
    setDetailId(review.ekycId); setError('');
    try { const d = await adminApi.ekycDetail(review.ekycId); setSelected(d); }
    catch { setError('Could not load E-KYC detail.'); }
    setDetailId(null);
  };

  const stats = dash ? [
    { title: 'Total Freelancers', value: fmtNum(dash.totalFreelancers), badge: 'Live', danger: false, icon: ShoppingBag, iconBg: 'bg-[#eef2ff]', iconColor: 'text-[#4f46e5]' },
    { title: 'Total Clients', value: fmtNum(dash.totalClients), badge: 'Live', danger: false, icon: UserPlus, iconBg: 'bg-[#ecfdf5]', iconColor: 'text-[#10b981]' },
    { title: 'Total Users', value: fmtNum(dash.totalUsers), badge: 'Register', danger: false, icon: Users, iconBg: 'bg-[#f0f9ff]', iconColor: 'text-[#0284c7]' },
    { title: 'Total Earnings', value: fmtUSD(dash.totalRevenue), badge: 'Paid', danger: false, icon: BadgeDollarSign, iconBg: 'bg-[#f0fdf4]', iconColor: 'text-[#16a34a]' },
    { title: 'Paid Records', value: fmtNum(dash.paidPaymentRecords), badge: 'Payments', danger: false, icon: ReceiptText, iconBg: 'bg-[#fef3c7]', iconColor: 'text-[#d97706]' },
    { title: 'Pending Earnings', value: fmtUSD(dash.pendingRevenue), badge: `${fmtNum(dash.submittedPaymentRecords)} submitted`, danger: false, icon: Clock3, iconBg: 'bg-[#fffbeb]', iconColor: 'text-[#ca8a04]' },
    { title: 'Pending Reviews', value: fmtNum(dash.pendingReviews), badge: fmtNum(dash.pendingReviews), danger: dash.pendingReviews > 0, icon: CircleAlert, iconBg: 'bg-[#fff7ed]', iconColor: 'text-[#f97316]' },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#222]">Dashboard Overview</h1>
        <p className="mt-2 text-[15px] text-[#6b7280]">Monitor platform activity and manage key metrics</p>
      </div>

      {error && <div className="mb-4 rounded-lg border border-[#fed7aa] bg-[#fff7ed] p-4 text-sm text-[#9a3412]">{error}</div>}
      {actionMsg && <div className="mb-4 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-sm text-[#166534]">{actionMsg}</div>}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-40 rounded-2xl border border-[#e5e7eb] bg-white animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {stats.map(({ title, value, badge, danger, icon: Icon, iconBg, iconColor }) => (
            <div key={title} className="min-h-40 rounded-2xl border border-[#e5e7eb] bg-white px-5 py-5">
              <div className="mb-10 flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <span className={`inline-flex min-w-10 items-center justify-center rounded-full px-2 py-1 text-[12px] font-medium ${danger ? 'bg-[#e11d48] text-white' : 'bg-[#f3f4f6] text-[#4b5563]'}`}>{badge}</span>
              </div>
              <p className="text-[15px] text-[#6b7280]">{title}</p>
              <h2 className="mt-1 text-[24px] font-medium leading-none text-[#222]">{value}</h2>
            </div>
          ))}
        </div>
      )}

      <section className="mt-6 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
        <div className="flex flex-col gap-2 border-b border-[#e5e7eb] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-[#111827]">Pending E-KYC Reviews</h2>
            <p className="text-sm text-[#6b7280]">Identity verification requests waiting for admin review</p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-medium text-[#c2410c]">{reviews.length} pending</span>
        </div>
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="sticky top-0 bg-[#f9fafb] text-[#6b7280]">
              <tr>
                {['User','Role','Identity','Contact','Failure','Action'].map(h => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.ekycId} className="border-t border-[#e5e7eb]">
                  <td className="px-5 py-4"><p className="font-medium text-[#111827]">{r.username || 'Unknown'}</p><p className="text-xs text-[#6b7280]">{r.email || 'No email'}</p></td>
                  <td className="px-5 py-4"><span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-medium text-[#4338ca]">{r.role || 'Unknown'}</span></td>
                  <td className="px-5 py-4"><p className="font-medium text-[#111827]">{r.fullName || 'No name'}</p><p className="text-xs text-[#6b7280]">{r.nationality || '—'} · {r.country || '—'}</p></td>
                  <td className="px-5 py-4 text-[#374151]">{r.phoneNumber || 'No phone'}</td>
                  <td className="max-w-md px-5 py-4"><p className="line-clamp-2 text-[#6b7280]">{r.failureReason || 'Waiting for review'}</p></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openDetail(r)} disabled={detailId === r.ekycId} className="rounded-md border border-[#d1d5db] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] disabled:opacity-60">View</button>
                      <button onClick={() => approve(r)} disabled={actionId === r.ekycId} className="rounded-md bg-[#10b981] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60">Approve</button>
                      <button onClick={() => reject(r)} disabled={actionId === r.ekycId} className="rounded-md border border-[#fecaca] bg-white px-3 py-1.5 text-xs font-medium text-[#b91c1c] disabled:opacity-60">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && reviews.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-[#6b7280]">No E-KYC reviews are waiting.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6" onClick={() => setSelected(null)}>
          <div className="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-lg bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-[#e5e7eb] px-6 py-4">
              <div><h3 className="text-[18px] font-semibold text-[#111827]">E-KYC Review Detail</h3><p className="text-sm text-[#6b7280]">{selected.username} · {selected.email}</p></div>
              <button onClick={() => setSelected(null)} className="rounded-md px-3 py-1.5 text-sm text-[#374151] hover:bg-[#f3f4f6]"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid gap-6 px-6 py-5 lg:grid-cols-[320px_1fr]">
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-[#e5e7eb] p-4">
                  <p className="text-xs font-medium uppercase text-[#6b7280]">Identity</p>
                  <dl className="mt-3 space-y-2">
                    {[['Full name', selected.fullName],['Document ID', selected.documentId],['DOB', selected.dateOfBirth],['Gender', selected.gender],['Nationality', selected.nationality],['Country', selected.country]].map(([k,v]) => (
                      <div key={k} className="flex justify-between gap-3"><dt className="text-[#6b7280]">{k}</dt><dd className="text-right font-medium text-[#111827]">{v || 'N/A'}</dd></div>
                    ))}
                  </dl>
                </div>
                <div className="rounded-lg border border-[#e5e7eb] p-4">
                  <p className="text-xs font-medium uppercase text-[#6b7280]">Checks</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${selected.ocrVerified ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fff7ed] text-[#9a3412]'}`}>OCR {selected.ocrVerified ? 'passed' : 'review'}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${selected.faceVerified ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fff7ed] text-[#9a3412]'}`}>Face {selected.faceVerified ? 'passed' : 'review'}</span>
                  </div>
                  <p className="mt-3 max-h-32 overflow-auto rounded-md bg-[#f9fafb] p-3 text-xs text-[#6b7280]">{selected.failureReason || 'No failure reason recorded.'}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[['Front ID', selected.frontIdData, selected.frontIdType],['Back ID', selected.backIdData, selected.backIdType],['Live Face', selected.liveFaceData, selected.liveFaceType]].map(([label, data, type]) => (
                  <div key={label as string} className="rounded-lg border border-[#e5e7eb] p-3">
                    <p className="mb-2 text-sm font-medium text-[#111827]">{label as string}</p>
                    {imageSrc(data as any, type as string) ? <img src={imageSrc(data as any, type as string)!} className="aspect-[4/3] w-full rounded-md object-contain bg-[#f9fafb]" alt={label as string} /> : <p className="py-16 text-center text-sm text-[#6b7280]">No image</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
