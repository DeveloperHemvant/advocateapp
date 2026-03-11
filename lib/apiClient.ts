import { API_BASE_URL } from './apiConfig';
import { clearSession, getSession, setSession } from './authStorage';

type ApiErrorShape = { error?: string; details?: any };

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function parseJsonSafe(res: Response) {
  const txt = await res.text();
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const session = await getSession();
  if (!session) return null;

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });

  if (!res.ok) {
    await clearSession();
    return null;
  }

  const data = (await parseJsonSafe(res)) as any;
  if (!data?.accessToken || !data?.refreshToken) {
    await clearSession();
    return null;
  }

  await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data.accessToken;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const session = init?.skipAuth ? null : await getSession();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as any),
  };
  if (session?.accessToken) headers.Authorization = `Bearer ${session.accessToken}`;

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401 && !init?.skipAuth) {
    const nextAccess = await refreshAccessToken();
    if (nextAccess) {
      headers.Authorization = `Bearer ${nextAccess}`;
      const retry = await fetch(url, { ...init, headers });
      if (retry.ok) return (await parseJsonSafe(retry)) as T;
      const body = (await parseJsonSafe(retry)) as ApiErrorShape;
      throw new ApiError(body?.error ?? 'Request failed', retry.status, body?.details);
    }
  }

  if (!res.ok) {
    const body = (await parseJsonSafe(res)) as ApiErrorShape;
    throw new ApiError(body?.error ?? 'Request failed', res.status, body?.details);
  }

  return (await parseJsonSafe(res)) as T;
}

