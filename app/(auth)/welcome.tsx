import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const { horizontalPadding, contentWidth2xl, isMediumUp, fontScale } = useResponsive();
  const router = useRouter();

  const headerPad = isMediumUp ? 32 : 24;
  const titleSize = fontScale(isMediumUp ? 48 : 36);
  const subtitleSize = fontScale(isMediumUp ? 20 : 18);
  const footerGap = isMediumUp ? 64 : 32;

  return (
    <ScreenContainer scroll centered={false} padding maxWidth="5xl">
      <View style={[styles.header, { paddingVertical: headerPad }]}>
        <View style={styles.brandRow}>
          <View style={[styles.logoWrap, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="gavel" size={28} color="#fff" />
          </View>
          <Text style={[styles.brandName, { color: colors.primary }]}>LexAI</Text>
        </View>
        <Text style={[styles.help, { color: colors.textSecondary }]}>Help Center</Text>
      </View>

      <View style={[styles.main, { maxWidth: contentWidth2xl }]}>
        <View style={[styles.heroBox, { backgroundColor: colors.primaryFaded, borderColor: colors.primary + '20' }]}>
          <MaterialIcons name="psychology" size={80} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text, fontSize: titleSize }]}>
          AI Assistant for Advocates
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: subtitleSize }]}>
          Draft cases, manage hearings, and organize legal work efficiently with our intelligent litigation partner.
        </Text>
        <View style={[styles.buttons, isMediumUp && styles.buttonsRow]}>
          <Button
            title="Create Account"
            onPress={() => router.push('/(auth)/create-account')}
            fullWidth
            style={styles.btn}
          />
          <Button
            title="Login"
            variant="secondary"
            onPress={() => router.push('/(auth)/login')}
            fullWidth
            style={styles.btn}
          />
        </View>
      </View>

      <View style={[styles.footer, { gap: footerGap, paddingVertical: 32 }]}>
        <View style={styles.trustRow}>
          <MaterialIcons name="security" size={22} color={colors.primary} />
          <Text style={[styles.trustText, { color: colors.text }]}>Enterprise Security</Text>
        </View>
        <View style={styles.trustRow}>
          <MaterialIcons name="verified-user" size={22} color={colors.primary} />
          <Text style={[styles.trustText, { color: colors.text }]}>Bar Compliant</Text>
        </View>
        <View style={styles.trustRow}>
          <MaterialIcons name="cloud-done" size={22} color={colors.primary} />
          <Text style={[styles.trustText, { color: colors.text }]}>Cloud Sync</Text>
        </View>
      </View>
      <Text style={[styles.copyright, { color: colors.textMuted }]}>
        © 2024 AI Assistant for Advocates. All legal data is encrypted and private.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoWrap: { padding: 6, borderRadius: 8 },
  brandName: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  help: { fontSize: 14, fontWeight: '500' },
  main: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    width: '100%',
  },
  heroBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: { fontWeight: '700', textAlign: 'center', marginBottom: 16, letterSpacing: -0.5 },
  subtitle: { textAlign: 'center', lineHeight: 28, marginBottom: 48, paddingHorizontal: 16 },
  buttons: { width: '100%', maxWidth: 448, gap: 16 },
  buttonsRow: { flexDirection: 'row' as const },
  btn: {},
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    opacity: 0.85,
  },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trustText: { fontSize: 14, fontWeight: '500' },
  copyright: { fontSize: 12, textAlign: 'center', marginBottom: 32 },
});
