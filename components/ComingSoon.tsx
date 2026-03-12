import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { logout } from '@/lib/api';

export function ComingSoon({
  title,
  subtitle,
  showLogout = true,
}: {
  title: string;
  subtitle?: string;
  showLogout?: boolean;
}) {
  const { colors } = useTheme();
  const router = useRouter();

  async function onLogout() {
    await logout();
    router.replace('/(auth)/welcome');
  }

  return (
    <ScreenContainer scroll={false} centered padding backgroundVariant="alt">
      <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.borderCard }]}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryFaded }]}>
          <MaterialIcons name="hourglass-top" size={42} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle ?? 'Coming soon. For now, please use the AI Draft tab.'}
        </Text>
        {showLogout ? (
          <View style={{ marginTop: 16, width: '100%' }}>
            <Button title="Logout" variant="outline" onPress={onLogout} />
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
  },
  iconWrap: {
    width: 82,
    height: 82,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 },
});

