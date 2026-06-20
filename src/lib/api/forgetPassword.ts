import apiClient from './client';

export interface SendCodeRequest {
  email: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  verifyCode: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

export const forgetPasswordApi = {
  sendCode(request: SendCodeRequest): Promise<MessageResponse> {
    return apiClient
      .post<MessageResponse>('/auth/send-code', request)
      .then((res) => res.data);
  },

  resetPassword(request: ResetPasswordRequest): Promise<MessageResponse> {
    return apiClient
      .post<MessageResponse>('/auth/reset-password', request)
      .then((res) => res.data);
  },

  resendCode(request: ResendCodeRequest): Promise<MessageResponse> {
    return apiClient
      .post<MessageResponse>('/auth/resend-code', request)
      .then((res) => res.data);
  },
};
