export interface User {
  id: number;
  name: string;
  email: string;
  tenant_id: string;
  role: string;
}

export interface ApiKey {
  id: number;
  name: string;
  key_hash: string;
  abilities: string[];
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message?: string;
  token: string;
  token_type: string;
  user: User;
}

export interface CreateApiKeyRequest {
  name: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: any;
}