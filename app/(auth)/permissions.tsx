import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const PERMISSIONS = [
  { id: 'notifications', title: 'Notifications', desc: 'Receive real-time alerts about account activity and security updates.', icon: 'notifications-active' as const },
  { id: 'reminders', title: 'Case Reminders', desc: 'Automated nudges for pending tasks and upcoming deadlines.', icon: 'event-note' as const },
  { id: 'documents', title: 'Document Access', desc: 'Securely sync your files to enable collaborative editing and versioning.', icon: 'folder' as const },
];

export default function PermissionsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [toggles, setToggles] = useState({ notifications: true, reminders: true, documents: false });

  const setToggle = (id: keyof typeof toggles, value: boolean) => setToggles((p) => ({ ...p, [id]: value }));

  return (
    <ScreenContainer scroll centered padding>
      <View style={styles.wrap}>
        <Card style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primaryFaded }]}>
            <MaterialIcons name="verified-user" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Enable Smart Features</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Personalize your experience and stay informed with intelligent updates tailored to your workflow.
          </Text>
          <View style={styles.list}>
            {PERMISSIONS.map((p) => (
              <View key={p.id} style={styles.row}>
                <View style={styles.rowContent}>
                  <View style={styles.rowTitle}>
                    <MaterialIcons name={p.icon} size={20} color={colors.primary} />
                    <Text style={[styles.rowTitleText, { color: colors.text }]}>{p.title}</Text>
                  </View>
                  <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{p.desc}</Text>
                </View>
                <Switch
                  value={toggles[p.id as keyof typeof toggles]}
                  onValueChange={(v) => setToggle(p.id as keyof typeof toggles, v)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
          <View style={[styles.infoBox, { backgroundColor: colors.primaryFaded, borderColor: colors.primary + '20' }]}>
            <MaterialIcons name="info" size={18} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Your data is protected by bank-grade encryption. You can change these settings anytime in your profile.
            </Text>
          </View>
          <Button title="Get Started" onPress={() => router.replace('/(tabs)')} fullWidth style={styles.btn} />
          <Button title="Maybe later" variant="ghost" onPress={() => router.replace('/(tabs)')} fullWidth />
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', paddingVertical: 24 },
  card: { padding: 32 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24, paddingHorizontal: 16 },
  list: { marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  rowContent: { flex: 1, marginRight: 16 },
  rowTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  rowTitleText: { fontSize: 16, fontWeight: '600' },
  rowDesc: { fontSize: 12 },
  infoBox: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 8, borderWidth: 1, marginBottom: 24 },
  infoText: { flex: 1, fontSize: 10, lineHeight: 16 },
  btn: { marginBottom: 12 },
});
