import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="create-account" />
      <Stack.Screen name="user-type" />
      <Stack.Screen name="practice-areas" />
      <Stack.Screen name="professional-details" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
