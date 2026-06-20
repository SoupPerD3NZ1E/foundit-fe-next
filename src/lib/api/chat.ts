import apiClient from './client';

export interface HireRequestResponse {
  id: number;
  clientId: number;
  clientName: string;
  freelancerId: number;
  gigId: number;
  gigTitle?: string;
  agreedPrice?: number;
  projectAgreedPrice?: number;
  projectStatus?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  projectId?: number;
  createdAt?: string;
  updatedAt?: string;
  deadline?: string;
}

export interface ConversationResponse {
  roomId: number;
  roomKey: string;
  otherUserId: number;
  otherUsername: string;
  hireRequestId?: number;
  projectId?: number;
  gigId?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export const chatApi = {
  getMyClientHireRequests(): Promise<HireRequestResponse[]> {
    return apiClient.get<HireRequestResponse[]>('/client/hire-requests').then(r => r.data);
  },
  getConversations(): Promise<ConversationResponse[]> {
    return apiClient.get<ConversationResponse[]>('/api/chat/conversations').then(r => r.data);
  },
};
