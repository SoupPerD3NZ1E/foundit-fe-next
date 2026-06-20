'use client';

import { useState, useEffect, useMemo } from 'react';
import { chatApi, HireRequestResponse, ConversationResponse } from '@/lib/api/chat';
import { paymentApi, PaymentTransactionResponse } from '@/lib/api/payment';
import { freelancerApi, FreelancerProfile } from '@/lib/api/freelancer';
import { fromDataOrUrl } from '@/lib/utils/imageUrl';

export type DashboardOrderStatus = 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'in-review' | 'completed' | 'cancelled' | 'revision-requested';

export interface DashboardOrder {
  id: number;
  title: string;
  freelancerId?: number;
  freelancerName: string;
  dueDate: string;
  price: number;
  status: DashboardOrderStatus;
  progress: number;
  projectId?: number;
  roomId?: number;
}

export interface DashboardTransaction {
  id: number;
  projectId?: number;
  title: string;
  freelancerId?: number;
  freelancerName: string;
  freelancerAvatar?: string;
  amount: number;
  status: string;
  date: string;
}

function toTimestamp(value?: string): number {
  if (!value) return 0;
  const t = new Date(value).getTime();
  return isNaN(t) ? 0 : t;
}

function toMoney(value: unknown): number {
  const n = Number(value);
  return isFinite(n) ? n : 0;
}

function toNumber(value: unknown): number | undefined {
  const n = Number(value);
  return isFinite(n) ? n : undefined;
}

function normalizeStatus(s?: string): string {
  return String(s ?? '').trim().toLowerCase().replace(/-/g, '_');
}

function toOrderStatus(status?: string, projectStatus?: string): DashboardOrderStatus {
  switch (normalizeStatus(projectStatus)) {
    case 'in_progress': return 'in-progress';
    case 'submitted': case 'delivered': return 'in-review';
    case 'completed': return 'completed';
    case 'cancelled': case 'canceled': return 'cancelled';
    case 'revision_requested': case 'revision_rejected': return 'revision-requested';
  }
  switch (normalizeStatus(status)) {
    case 'accepted': return 'accepted';
    case 'rejected': return 'rejected';
    case 'cancelled': case 'canceled': return 'cancelled';
    default: return 'pending';
  }
}

function calculateProgress(projectStatus?: string): number {
  switch (normalizeStatus(projectStatus)) {
    case 'completed': return 100;
    case 'delivered': case 'submitted': return 90;
    case 'revision_requested': case 'revision_rejected': return 85;
    case 'in_progress': return 55;
    case 'cancelled': case 'canceled': return 0;
    default: return 15;
  }
}

export function useClientDashboard() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);
  const [recommendedFreelancers, setRecommendedFreelancers] = useState<FreelancerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setLoadError('');
      try {
        const [requests, conversations, txns, freelancers] = await Promise.all([
          chatApi.getMyClientHireRequests().catch(() => [] as HireRequestResponse[]),
          chatApi.getConversations().catch(() => [] as ConversationResponse[]),
          paymentApi.getMyTransactions().catch(() => [] as PaymentTransactionResponse[]),
          freelancerApi.getActiveFreelancers().catch(() => [] as FreelancerProfile[]),
        ]);

        if (cancelled) return;

        const mappedOrders: DashboardOrder[] = [...requests]
          .sort((a, b) => toTimestamp(b.updatedAt ?? b.createdAt) - toTimestamp(a.updatedAt ?? a.createdAt))
          .map((req) => {
            const projectId = toNumber(req.projectId);
            const conv = conversations.find(c =>
              (projectId && c.projectId === projectId) ||
              (req.id && c.hireRequestId === req.id) ||
              (req.gigId !== undefined && c.gigId === req.gigId)
            );
            return {
              id: projectId ?? req.id,
              title: req.gigTitle || 'Untitled project',
              freelancerId: toNumber(req.freelancerId),
              freelancerName: req.freelancerId ? `Freelancer #${req.freelancerId}` : 'Freelancer',
              dueDate: req.deadline || req.updatedAt || req.createdAt || '',
              price: toMoney(req.projectAgreedPrice ?? req.agreedPrice),
              status: toOrderStatus(req.status, req.projectStatus),
              progress: calculateProgress(req.projectStatus),
              projectId,
              roomId: conv?.roomId,
            };
          });

        const mappedTxns: DashboardTransaction[] = [...txns]
          .sort((a, b) => toTimestamp(b.paidAt ?? b.createdAt ?? '') - toTimestamp(a.paidAt ?? a.createdAt ?? ''))
          .map((t) => {
            const projectId = toNumber(t.projectId);
            const req = requests.find(r => toNumber(r.projectId) === projectId);
            return {
              id: toNumber(t.id) ?? projectId ?? toTimestamp(t.createdAt ?? ''),
              projectId,
              title: t.projectTitle || req?.gigTitle || 'Project payment',
              freelancerId: toNumber(t.freelancerId ?? req?.freelancerId),
              freelancerName: t.freelancerName?.trim() || (req?.freelancerId ? `Freelancer #${req.freelancerId}` : 'Freelancer'),
              freelancerAvatar: fromDataOrUrl(
                typeof t.freelancerProfilePictureData === 'string' ? t.freelancerProfilePictureData : null,
                t.freelancerProfilePictureType,
                t.freelancerProfilePictureUrl,
              ) || undefined,
              amount: toMoney(t.amount),
              status: String(t.status ?? 'UNKNOWN').toUpperCase(),
              date: t.paidAt || t.createdAt || '',
            };
          });

        const shuffled = [...freelancers].sort(() => Math.random() - 0.5).slice(0, 10);

        setOrders(mappedOrders);
        setTransactions(mappedTxns);
        setRecommendedFreelancers(shuffled);
      } catch {
        if (!cancelled) setLoadError('Unable to load your dashboard right now.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const activeOrders = useMemo(() =>
    orders.filter(o => ['accepted', 'in-progress', 'in-review', 'revision-requested'].includes(o.status)),
    [orders]);

  const totalSpent = useMemo(() =>
    transactions.filter(t => t.status === 'PAID').reduce((s, t) => s + t.amount, 0),
    [transactions]);

  const pendingPayments = useMemo(() =>
    transactions.filter(t => t.status === 'PENDING').reduce((s, t) => s + t.amount, 0),
    [transactions]);

  const completedProjects = useMemo(() =>
    orders.filter(o => o.status === 'completed').length,
    [orders]);

  return {
    orders, transactions, recommendedFreelancers,
    activeOrders, totalSpent, pendingPayments, completedProjects,
    isLoading, loadError,
  };
}
