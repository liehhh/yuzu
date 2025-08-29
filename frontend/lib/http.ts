// frontend/lib/http.ts
import { API_URL } from "./api";
import { getSession } from "./auth";

type Method = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  method: Method,
  path: string,
  body?: any,
  params?: Record<string, string>
): Promise<T> {
  const session = await getSession().catch(() => null);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // DRF TokenAuthentication header
  if (session?.authToken) {
    headers["Authorization"] = `Token ${session.authToken}`;
  }

  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${API_URL}${path}${qs}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export function get<T = any>(path: string, params?: Record<string, string>) {
  return request<T>("GET", path, undefined, params);
}

export function post<T = any>(path: string, body: any) {
  return request<T>("POST", path, body);
}

export function put<T = any>(path: string, body: any) {
  return request<T>("PUT", path, body);
}
