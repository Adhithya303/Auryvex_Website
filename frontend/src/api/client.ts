import { getCsrfToken } from "../hooks/useCsrf";

const STATE_CHANGING = new Set(["POST", "PATCH", "PUT", "DELETE"]);

/** Base fetch wrapper. Throws an ApiError on non-2xx responses. */
async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (STATE_CHANGING.has(method.toUpperCase())) {
    const csrf = getCsrfToken();
    if (csrf) headers["X-CSRF-Token"] = csrf;
  }

  const res = await fetch(path, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = `Request failed: ${res.status}`;
    try {
      const json = await res.json();
      detail = json.detail ?? JSON.stringify(json);
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, detail);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  get:   <T>(path: string)               => request<T>("GET",   path),
  post:  <T>(path: string, body: unknown) => request<T>("POST",  path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
};
