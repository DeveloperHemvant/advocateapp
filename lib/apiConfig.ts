import Constants from 'expo-constants';
import { Platform } from 'react-native';

function defaultBaseUrl() {
  // Android emulator can't reach host machine via localhost
  if (Platform.OS === 'android') return 'http://10.0.2.2:4000/api';
  return 'http://localhost:4000/api';
}

export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  (Constants.expoConfig?.extra as any)?.apiBaseUrl ??
  defaultBaseUrl();

