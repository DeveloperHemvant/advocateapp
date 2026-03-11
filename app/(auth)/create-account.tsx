import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/lib/apiClient';
import { loginAdvocate, registerAdvocate } from '@/lib/api';

export default function CreateAccountScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [barId, setBarId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function onCreate() {
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerAdvocate({
        fullName,
        email,
        phone,
        password,
        barId: barId.trim() ? barId.trim() : undefined,
      });
      await loginAdvocate({ emailOrPhone: email, password });
      router.push('/(auth)/user-type');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Create account failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scroll padding maxWidth="md">
      <View style={styles.wrap}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.primaryFaded }]}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.step, { color: colors.textSecondary }]}>Step 1 of 2</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Join the professional community for legal practitioners today.
        </Text>
        <View style={styles.form}>
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.errorBg, borderColor: colors.error }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          ) : null}
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon="person"
            value={fullName}
            onChangeText={setFullName}
          />
          <Input
            label="Email Address"
            placeholder="john@example.com"
            leftIcon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Mobile Number"
            placeholder="+1 (555) 000-0000"
            leftIcon="phone-iphone"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Input
            label="Password"
            placeholder="••••••••"
            leftIcon="lock"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="Confirm Password"
            placeholder="••••••••"
            leftIcon="lock"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Input
            label="Bar Council ID (Optional)"
            placeholder="ID-12345678"
            leftIcon="badge"
            value={barId}
            onChangeText={setBarId}
          />
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAcceptedTerms((v) => !v)}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={acceptedTerms ? 'check-box' : 'check-box-outline-blank'}
              size={22}
              color={acceptedTerms ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.terms, { color: colors.textSecondary }]}>
              I agree to the Terms of Service and Privacy Policy.
            </Text>
          </TouchableOpacity>
          <Button
            title="Create Account"
            onPress={onCreate}
            fullWidth
            loading={loading}
            disabled={
              !fullName.trim() ||
              !email.trim() ||
              !phone.trim() ||
              password.length < 6 ||
              !acceptedTerms ||
              loading
            }
            style={styles.submit}
          />
        </View>
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={[styles.link, { color: colors.primary }]}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', paddingVertical: 24 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  backBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  step: { flex: 1, textAlign: 'center', fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 24 },
  form: {},
  errorBox: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { fontSize: 14, fontWeight: '600' },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 24 },
  terms: { flex: 1, fontSize: 14, lineHeight: 20 },
  submit: { marginBottom: 24 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  footerText: { fontSize: 16 },
  link: { fontWeight: '700' },
});
