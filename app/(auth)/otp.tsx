import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AppHeader } from '@/components/ui/AppHeader';
import { ApiError } from '@/lib/apiClient';
import { loginWithOtp, requestOtp } from '@/lib/api';

export default function OTPScreen() {
  const { colors, radius } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = (params.phone as string | undefined) || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!phone) return;
    // fire-and-forget OTP request; backend uses static 123456 when SMS is not configured
    requestOtp(phone).catch(() => undefined);
  }, [phone]);

  async function onVerify() {
    if (!phone) {
      setError('Missing phone number. Go back and enter your mobile first.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await loginWithOtp({ phone, otp });
      router.replace('/(tabs)');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Invalid or expired OTP';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scroll centered padding maxWidth="md">
      <View style={styles.wrap}>
        <AppHeader title="Verify Mobile" showBack />
        <Card style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primaryFaded }]}>
            <MaterialIcons name="vibration" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Verify Mobile</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter the 6-digit code sent to your mobile.
          </Text>
          {error ? (
            <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
          ) : null}
          <View style={styles.otpRow}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <TextInput
                key={i}
                style={[styles.otpInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text, borderRadius: radius.md }]}
                value={otp[i] ?? ''}
                onChangeText={(t) => setOtp((prev) => (prev + t.replace(/\D/g, '')).slice(0, 6))}
                keyboardType="number-pad"
                maxLength={1}
              />
            ))}
          </View>
          <Button
            title={loading ? 'Verifying…' : 'Verify OTP'}
            onPress={onVerify}
            fullWidth
            style={styles.btn}
            disabled={loading || otp.length !== 6}
          />
          <Text style={[styles.resend, { color: colors.textSecondary }]}>
            Didn’t receive the code? <Text style={{ color: colors.primary, fontWeight: '600' }}>Resend OTP</Text>
          </Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', paddingVertical: 16 },
  card: { padding: 32, alignItems: 'center', marginTop: 16 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 32, justifyContent: 'center' },
  otpInput: { width: 44, height: 52, textAlign: 'center', fontSize: 18, fontWeight: '600', borderWidth: 1 },
  btn: { marginBottom: 16 },
  resend: { fontSize: 14, textAlign: 'center' },
  error: { marginTop: 8, fontSize: 14 },
});
