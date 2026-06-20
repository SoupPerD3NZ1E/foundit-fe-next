import apiClient from './client';

export const FreelancerProfileService = {
  getMyProfile() { return apiClient.get('/freelancer/me/client/profile').then(r => r.data); },
  getFreelancerTransactions() { return apiClient.get('/payment/freelancer/my-transactions').then(r => r.data); },
};

// Also add to payment.ts — extend paymentApi:
// getFreelancerTransactions() already needs to exist on paymentApi
// Add this to src/lib/api/payment.ts paymentApi object:
// getFreelancerTransactions(): Promise<PaymentTransactionResponse[]> {
//   return apiClient.get<PaymentTransactionResponse[]>('/payment/freelancer/my-transactions').then(r => r.data);
// },
