import apiClient from './client';
import type { AccountStatusResponse, AccountReport } from '@/types/account';

export const accountApi = {
  getAccountStatus(): Promise<AccountStatusResponse> {
    return apiClient
      .get<AccountStatusResponse>('/account/status')
      .then((res) => res.data);
  },

  submitReport(payload: {
    subject: string;
    message: string;
  }): Promise<AccountReport> {
    return apiClient
      .post<AccountReport>('/account/reports', payload)
      .then((res) => res.data);
  },

  myReports(): Promise<AccountReport[]> {
    return apiClient
      .get<AccountReport[]>('/account/reports')
      .then((res) => res.data);
  },
};
