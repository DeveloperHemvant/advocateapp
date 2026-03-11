import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'newadv_access_token';
const REFRESH_KEY = 'newadv_refresh_token';

export type Session = {
  accessToken: string;
  refreshToken: string;
};

export async function getSession(): Promise<Session | null> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_KEY),
    SecureStore.getItemAsync(REFRESH_KEY),
  ]);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export async function setSession(session: Session): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_KEY, session.accessToken),
    SecureStore.setItemAsync(REFRESH_KEY, session.refreshToken),
  ]);
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
  ]);
}

