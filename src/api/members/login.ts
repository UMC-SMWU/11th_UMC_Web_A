import { apiClient } from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  message?: string;
}

export function login(body: LoginRequest) {
  return apiClient.post("members/login", { json: body }).json<LoginResponse>();
}