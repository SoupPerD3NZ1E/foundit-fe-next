import apiClient from './client';

export interface GigResponseDTO {
  gigId?: number | string;
  id?: number | string;
  freelancerId?: number | string;
  freelancerName?: string;
  serviceTitle: string;
  category: string;
  serviceDescription: string;
  tags: string[];
  paymentChoice: string;
  price: number | string;
  deliveryDate: number;
  rivision: number;
  packageDescription: string;
  status?: string;
  rating?: number;
  reviews?: number;
  gigMainImageData?: string;
  gigMainImageUrl?: string;
  gigMainImageContentType?: string;
}

export interface FreelancerProfile {
  id?: number;
  profileId?: number;
  freelancerId?: number;
  freelancerProfileId?: number;
  freelancerName: string;
  freelancerJob: string;
  rating: number;
  workLocation: string;
  yearExperience: number;
  about: string;
  skill: string[];
  activeService: GigResponseDTO[];
  profilePictureData?: string;
  profilePictureUrl?: string;
  profilePictureType?: string;
  reviews?: number;
  profileViews?: number;
}

export const freelancerApi = {
  getActiveFreelancers(): Promise<FreelancerProfile[]> {
    return apiClient.get<FreelancerProfile[]>('/freelancer/active').then(r => r.data);
  },
  getProfile(id: number): Promise<FreelancerProfile> {
    return apiClient.get<FreelancerProfile>(`/freelancer/${id}/client/profile`).then(r => r.data);
  },
};
