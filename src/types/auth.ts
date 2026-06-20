export enum RoleEnum {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  FREELANCER = 'FREELANCER',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  role?: RoleEnum;
}

export interface SignUpResponse {
  username: string;
  email: string;
  role?: RoleEnum;
}
