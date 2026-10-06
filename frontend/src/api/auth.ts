import { api } from "./client";

export interface MeResponse {
  username: string;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ ok: boolean }>("/api/auth/login", { username, password }),

  logout: () => api.post<{ ok: boolean }>("/api/auth/logout", {}),

  me: () => api.get<MeResponse>("/api/auth/me"),
};
