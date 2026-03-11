import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ApiError } from '@/lib/apiClient';
import { loginAdvocate } from '@/lib/api';

export default function LoginScreen() {
  const { colors, spacing } = useTheme();
  const { fontScale } = useResponsive();
  const router = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onLogin() {
    setError(null);
    setLoading(true);
    try {
      await loginAdvocate({ emailOrPhone, password });
      router.replace('/(tabs)');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scroll centered padding maxWidth="md" backgroundVariant="alt">
      <View style={[styles.wrap, { paddingVertical: spacing.xxl }]}>
        <Card style={[styles.card, { padding: spacing.xxxl }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrap, { backgroundColor: colors.primaryFaded }]}>
              <MaterialIcons name="shield" size={24} color={colors.primary} />
            </View>
            <TouchableOpacity onPress={() => {}}>
              <Text style={[styles.helpLink, { color: colors.primary }]}>Help Center</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.title, { color: colors.text, fontSize: fontScale(30) }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your credentials to access your dashboard
          </Text>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.errorBg, borderColor: colors.error }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Email or Mobile"
              placeholder="you@example.com or +91..."
              leftIcon="smartphone"
              keyboardType="email-address"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              autoCapitalize="none"
            />
            <View style={styles.passwordRow}>
              <Input
                label="Password"
                placeholder="••••••••"
                leftIcon="lock"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.forgot}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <Button
              title="Login"
              onPress={onLogin}
              fullWidth
              loading={loading}
              disabled={!emailOrPhone.trim() || !password || loading}
              rightIcon={<MaterialIcons name="arrow-forward" size={20} color="#fff" />}
              style={styles.loginBtn}
            />
            <Button
              title="Login with OTP"
              variant="secondary"
              onPress={() =>
                router.push({
                  pathname: '/(auth)/otp',
                  params: { phone: emailOrPhone },
                })
              }
              fullWidth
            />
          </View>

          <View style={[styles.footerLink, { borderTopColor: colors.border }]}>
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/create-account')}>
                <Text style={[styles.link, { color: colors.primary }]}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
        <View style={styles.legal}>
          <TouchableOpacity><Text style={[styles.legalLink, { color: colors.textMuted }]}>Privacy Policy</Text></TouchableOpacity>
          <TouchableOpacity><Text style={[styles.legalLink, { color: colors.textMuted }]}>Terms of Service</Text></TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  card: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  iconWrap: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  helpLink: { fontSize: 14, fontWeight: '600' },
  title: { fontWeight: '700', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, marginBottom: 24 },
  errorBox: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { fontSize: 14, fontWeight: '600' },
  form: { marginTop: 8 },
  passwordRow: { marginTop: -4 },
  forgot: { alignSelf: 'flex-end', marginBottom: 8 },
  forgotText: { fontSize: 12, fontWeight: '600' },
  loginBtn: { marginTop: 8, marginBottom: 12 },
  footerLink: { borderTopWidth: 1, marginTop: 16, paddingTop: 24, alignItems: 'center' },
  footerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' },
  footerText: { fontSize: 14 },
  link: { fontWeight: '700' },
  legal: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 32 },
  legalLink: { fontSize: 14 },
});
