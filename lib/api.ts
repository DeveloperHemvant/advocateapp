import { apiFetch } from './apiClient';
import { clearSession, setSession } from './authStorage';

export type AdvocateProfileStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type AdvocateUser = {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: 'ADVOCATE';
  profileStatus: AdvocateProfileStatus;
  barId?: string | null;
  experienceYears?: number | null;
  practiceAreas: string[];
  city?: string | null;
  state?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function registerAdvocate(input: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  barId?: string;
  experienceYears?: number;
  practiceAreas?: string[];
  city?: string;
  state?: string;
}) {
  return apiFetch<{
    id: string;
    email: string;
    fullName: string;
    phone?: string | null;
    role: 'ADVOCATE';
    profileStatus: AdvocateProfileStatus;
    createdAt: string;
  }>('/auth/register', { method: 'POST', body: JSON.stringify(input), skipAuth: true });
}

export async function loginAdvocate(input: { emailOrPhone: string; password: string }) {
  const data = await apiFetch<{
    accessToken: string;
    refreshToken: string;
    user: AdvocateUser;
  }>('/auth/login', { method: 'POST', body: JSON.stringify(input), skipAuth: true });

  await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

export async function requestOtp(phone: string) {
  await apiFetch<void>('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ phone }),
    skipAuth: true,
  });
}

export async function loginWithOtp(input: { phone: string; otp: string }) {
  const data = await apiFetch<{
    accessToken: string;
    refreshToken: string;
    user: AdvocateUser;
  }>('/auth/otp/verify', { method: 'POST', body: JSON.stringify(input), skipAuth: true });

  await setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

export async function logout() {
  const session = await (await import('./authStorage')).getSession();
  if (!session) return;
  try {
    await apiFetch<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
  } finally {
    await clearSession();
  }
}

export async function getMe() {
  return apiFetch<AdvocateUser>('/advocates/me');
}

export async function updateMe(input: Partial<Pick<AdvocateUser, 'fullName' | 'phone' | 'barId' | 'experienceYears' | 'practiceAreas' | 'city' | 'state'>>) {
  return apiFetch<AdvocateUser>('/advocates/me', { method: 'PUT', body: JSON.stringify(input) });
}

