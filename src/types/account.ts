export type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';
export type AccountReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';

export interface AccountStatusResponse {
  id: number;
  username: string;
  email: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  status: AccountStatus;
}

export interface AccountReport {
  id: number;
  userId: number;
  username: string | null;
  email: string | null;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN' | null;
  accountStatus: AccountStatus | null;
  subject: string;
  message: string;
  status: AccountReportStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}
