'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';
import { paymentApi, PaymentTransactionResponse } from '@/lib/api/payment';
import { FreelancerProfileService } from '@/lib/api/freelancerProfile';

export type ServiceStatus = 'Active' | 'Paused';
export type OrderStatus = 'In Progress' | 'In Review';

export interface DashboardService {
  title: string; views: number; orders: number; rating: number; price: number;
  status: ServiceStatus; image: string;
}

export interface DashboardOrder {
  title: string; client: string; dueDate: string; price: number; status: OrderStatus;
}

export interface EarningsSummary {
  thisMonth: number; pendingClearance: number; availableForWithdrawal: number;
  lastPaidAmount: number; lastPaidAt: string;
}

export interface PendingPayment {
  tranId: string; projectTitle: string; clientName: string; amount: number;
  currency: string; submittedAt: string; proofReference?: string | null;
  proofFileName?: string | null; hasProofFile?: boolean | null;
}

interface ProjectResponse {
  id: number; clientId?: number; clientName?: string; gigId?: number;
  gigTitle?: string; projectTitle?: string; agreedPrice?: number;
  deadline?: string; status?: string; createdAt?: string; updatedAt?: string;
}

interface HireRequestResponse {
  id: number; clientId?: number; clientName?: string; gigTitle?: string;
  projectId?: number; agreedPrice?: number; projectAgreedPrice?: number;
  projectStatus?: string; deadline?: string; createdAt?: string; updatedAt?: string;
}

function toTs(v?: string | null): number {
  if (!v) return 0;
  const t = new Date(v).getTime();
  return isNaN(t) ? 0 : t;
}

function isActive(s?: string): boolean {
  return ['IN_PROGRESS','SUBMITTED','DELIVERED','REVISION_REQUESTED','REVISION_REJECTED'].includes(String(s ?? '').toUpperCase());
}

export function useFreelancerDashboard() {
  const [services, setServices] = useState<DashboardService[]>([]);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary>({ thisMonth: 0, pendingClearance: 0, availableForWithdrawal: 0, lastPaidAmount: 0, lastPaidAt: '' });
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [profileViews, setProfileViews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setDashboardError('');
      try {
        const [profileRes, sidebarRes, reviewsRes, projectsRes, hireRes, txnsRes] = await Promise.all([
          apiClient.get('/freelancer/me/client/profile').then(r => r.data).catch(() => null),
          apiClient.get('/freelancer/me/get-rightSideBar').then(r => r.data).catch(() => null),
          apiClient.get('/freelancer/me/reviews').then(r => r.data).catch(() => []),
          apiClient.get<ProjectResponse[]>('/freelancer/view-project').then(r => r.data).catch(() => []),
          apiClient.get<HireRequestResponse[]>('/freelancer/view-hire-request').then(r => r.data).catch(() => []),
          paymentApi.getFreelancerTransactions().catch(() => []),
        ]);
        if (cancelled) return;

        // Services
        const active = (profileRes as any)?.activeService ?? [];
        setServices(active.map((s: any) => ({
          title: String(s.serviceTitle ?? s.title ?? s.packageDescription ?? 'Untitled service'),
          views: Number(s.views ?? s.viewCount ?? 0),
          orders: Number(s.orders ?? 0),
          rating: Number(s.rating ?? 0),
          price: Number(s.price ?? 0),
          status: String(s.status ?? 'Active').toLowerCase() === 'paused' ? 'Paused' : 'Active',
          image: s.gigMainImageData
            ? `data:${s.gigMainImageContentType ?? 'image/jpeg'};base64,${s.gigMainImageData}`
            : 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=200&q=80',
        })));

        setProfileViews(Number((sidebarRes as any)?.viewCount ?? 0));

        const reviews = Array.isArray(reviewsRes) ? reviewsRes : [];
        const profileRating = Number((profileRes as any)?.rating ?? 0);
        const reviewAvg = reviews.length
          ? reviews.map((r: any) => Number(r.rating ?? 0)).filter(isFinite).reduce((a: number, b: number) => a + b, 0) / reviews.length
          : 0;
        setAvgRating(profileRating > 0 ? profileRating : reviewAvg);

        // Orders
        const paid = (txnsRes as PaymentTransactionResponse[]).filter(t => String(t.status ?? '').toUpperCase() === 'PAID');
        const paidIds = new Set(paid.map(t => Number(t.projectId)).filter(isFinite));

        const activeProjects = (projectsRes as ProjectResponse[])
          .filter(p => isActive(p.status))
          .sort((a, b) => toTs(b.updatedAt ?? b.createdAt) - toTs(a.updatedAt ?? a.createdAt));

        const inProgressHire = (hireRes as HireRequestResponse[])
          .filter(r => String(r.projectStatus ?? '').toUpperCase() === 'IN_PROGRESS')
          .sort((a, b) => toTs(b.updatedAt ?? b.createdAt) - toTs(a.updatedAt ?? a.createdAt));

        const mappedOrders: DashboardOrder[] = inProgressHire.length
          ? inProgressHire.map(r => ({
              title: r.gigTitle || `Hire Request #${r.id}`,
              client: r.clientName || (r.clientId ? `Client #${r.clientId}` : 'Client'),
              dueDate: r.deadline ? new Date(r.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline',
              price: Number(r.projectAgreedPrice ?? r.agreedPrice ?? 0),
              status: 'In Progress',
            }))
          : activeProjects.filter(p => p.status === 'IN_PROGRESS').map(p => ({
              title: p.projectTitle || p.gigTitle || `Project #${p.id}`,
              client: p.clientName || (p.clientId ? `Client #${p.clientId}` : 'Client'),
              dueDate: p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline',
              price: Number(p.agreedPrice ?? 0),
              status: paidIds.has(p.id) ? 'In Review' : 'In Progress',
            }));
        setOrders(mappedOrders);

        // Payments
        const pending = (txnsRes as PaymentTransactionResponse[])
          .filter(t => String(t.status ?? '').toUpperCase() === 'PAYMENT_SUBMITTED')
          .map(t => ({
            tranId: t.tranId ?? '',
            projectTitle: t.projectTitle || (t.projectId ? `Project #${t.projectId}` : 'Project payment'),
            clientName: t.clientName || 'Client',
            amount: Number(t.amount ?? 0),
            currency: t.currency ?? 'USD',
            submittedAt: t.submittedAt ?? t.createdAt ?? '',
            proofReference: t.proofReference,
            proofFileName: t.proofFileName,
            hasProofFile: t.hasProofFile,
          }))
          .sort((a, b) => toTs(b.submittedAt) - toTs(a.submittedAt));
        setPendingPayments(pending);

        // Earnings
        const total = paid.reduce((s, t) => s + Number(t.amount ?? 0), 0);
        setTotalEarnings(total);
        const now = new Date();
        const thisMonth = paid.filter(t => {
          const d = t.paidAt ? new Date(t.paidAt) : null;
          return d && !isNaN(d.getTime()) && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }).reduce((s, t) => s + Number(t.amount ?? 0), 0);
        const pendingClearance = activeProjects.filter(p => !paidIds.has(p.id)).reduce((s, p) => s + Number(p.agreedPrice ?? 0), 0);
        const lastPaid = [...paid].sort((a, b) => toTs(b.paidAt ?? b.createdAt) - toTs(a.paidAt ?? a.createdAt))[0];
        setEarningsSummary({ thisMonth, pendingClearance, availableForWithdrawal: total, lastPaidAmount: Number(lastPaid?.amount ?? 0), lastPaidAt: lastPaid?.paidAt ?? lastPaid?.createdAt ?? '' });
        setLoadingOrders(false);
      } catch {
        if (!cancelled) { setDashboardError('Unable to load dashboard.'); setLoadingOrders(false); }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return { services, orders, pendingPayments, earningsSummary, totalEarnings, profileViews, avgRating, loadingOrders, dashboardError };
}
