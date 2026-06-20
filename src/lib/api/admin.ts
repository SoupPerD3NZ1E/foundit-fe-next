import apiClient from './client';

export interface AdminPendingReview {
  ekycId: number; registerId?: number | null; username?: string | null;
  email?: string | null; role?: string | null; fullName?: string | null;
  phoneNumber?: string | null; nationality?: string | null; country?: string | null;
  status?: string; failureReason?: string | null; documentId?: string | null;
}

export interface AdminEkycDetail extends AdminPendingReview {
  dateOfBirth?: string | null; gender?: string | null;
  ocrVerified?: boolean | null; faceVerified?: boolean | null;
  frontIdData?: string | number[] | null; frontIdType?: string | null;
  backIdData?: string | number[] | null; backIdType?: string | null;
  liveFaceData?: string | number[] | null; liveFaceType?: string | null;
}

export interface AdminDashboard {
  totalFreelancers: number; totalClients: number; totalUsers: number;
  totalRevenue: number; paidPaymentRecords: number; pendingRevenue: number;
  submittedPaymentRecords: number; pendingReviews: number;
  pendingReviewItems: AdminPendingReview[];
}

export const adminApi = {
  dashboard(): Promise<AdminDashboard> {
    return apiClient.get<AdminDashboard>('/admin/dashboard').then(r => r.data);
  },
  approveEkyc(id: number): Promise<void> {
    return apiClient.put(`/admin/ekyc/${id}/approve`, null).then(() => undefined);
  },
  rejectEkyc(id: number, reason = 'Rejected by admin'): Promise<void> {
    return apiClient.put(`/admin/ekyc/${id}/reject`, null, { params: { reason } }).then(() => undefined);
  },
  ekycDetail(id: number): Promise<AdminEkycDetail> {
    return apiClient.get<AdminEkycDetail>(`/admin/ekyc/${id}`).then(r => r.data);
  },
};
