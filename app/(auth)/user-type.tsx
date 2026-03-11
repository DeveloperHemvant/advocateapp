import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AppHeader } from '@/components/ui/AppHeader';

export default function UserTypeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScreenContainer scroll padding>
      <View style={styles.wrap}>
        <AppHeader title="Registration" showBack />
        <Text style={[styles.title, { color: colors.text }]}>Select Account Type</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Choose the option that best describes your legal practice</Text>
        <Card onPress={() => router.push('/(auth)/practice-areas')} style={styles.card}>
          <View style={styles.cardInner}>
            <View style={[styles.iconWrap, { backgroundColor: colors.primaryFaded }]}>
              <MaterialIcons name="person" size={32} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Individual Advocate</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>Manage your personal legal practice and client cases.</Text>
              <Button title="Select" onPress={() => router.push('/(auth)/practice-areas')} />
            </View>
          </View>
        </Card>
        <Card onPress={() => router.push('/(auth)/practice-areas')} style={styles.card}>
          <View style={styles.cardInner}>
            <View style={[styles.iconWrap, { backgroundColor: colors.primaryFaded }]}>
              <MaterialIcons name="business" size={32} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Law Firm / Legal Team</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>Collaborate with your team and manage firm-wide cases.</Text>
              <Button title="Select" onPress={() => router.push('/(auth)/practice-areas')} />
            </View>
          </View>
        </Card>
        <Button title="Continue to Registration" onPress={() => router.push('/(auth)/practice-areas')} fullWidth style={styles.continue} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  card: { padding: 24, marginBottom: 16 },
  cardInner: { flexDirection: 'row', gap: 20 },
  iconWrap: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 16, lineHeight: 22, marginBottom: 16 },
  continue: { marginBottom: 16 },
});
