// =============================================================
// PURPOSE: Central API base URL + tiny fetch helpers
// Reads VITE_API_URL from frontend/.env
// =============================================================

const rawBaseUrl = import.meta.env.VITE_API_URL;

if (!rawBaseUrl) {
  console.warn(
    "VITE_API_URL is not set in frontend/.env — falling back to http://127.0.0.1:8080",
  );
}

/** Base URL of the backend, without a trailing slash. */
export const API_BASE_URL = (
  rawBaseUrl || "http://127.0.0.1:8080"
).replace(/\/+$/, "");

/** Build a full URL for a backend path, e.g. apiUrl("/api/feedback"). */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** POST JSON to the backend and parse the JSON response. */
export async function apiPost<T>(
  path: string,
  body: unknown,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...extraHeaders(init) },
    body: JSON.stringify(body),
    ...init,
  });

  const text = await response.text();
  const data = (text ? JSON.parse(text) : null) as T;

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ??
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function extraHeaders(init: RequestInit): Record<string, string> {
  const headers = init.headers;
  if (!headers) return {};
  return headers instanceof Headers
    ? Object.fromEntries(headers.entries())
    : (headers as Record<string, string>);
}
