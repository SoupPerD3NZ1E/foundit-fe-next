import apiClient from './client';

export interface PaymentTransactionResponse {
  id?: number;
  tranId?: string;
  amount?: number;
  currency?: string;
  status?: 'PENDING' | 'PAYMENT_SUBMITTED' | 'PAID' | 'FAILED' | 'CANCELLED' | 'UNKNOWN' | string;
  projectId?: number;
  projectTitle?: string;
  clientName?: string;
  freelancerId?: number;
  freelancerName?: string;
  freelancerProfilePictureData?: string | number[] | null;
  freelancerProfilePictureUrl?: string | null;
  freelancerProfilePictureType?: string | null;
  createdAt?: string | null;
  paidAt?: string | null;
  submittedAt?: string | null;
  proofReference?: string | null;
  proofFileName?: string | null;
  hasProofFile?: boolean | null;
}

export const paymentApi = {
  getMyTransactions(): Promise<PaymentTransactionResponse[]> {
    return apiClient.get<PaymentTransactionResponse[]>('/payment/my-transactions').then(r => r.data);
  },
  getFreelancerTransactions(): Promise<PaymentTransactionResponse[]> {
    return apiClient.get<PaymentTransactionResponse[]>('/payment/freelancer/my-transactions').then(r => r.data);
  },
};
