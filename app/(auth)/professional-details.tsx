import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AppHeader } from '@/components/ui/AppHeader';

export default function ProfessionalDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScreenContainer scroll padding>
      <View style={styles.wrap}>
        <AppHeader title="Professional Details" showBack />
        <View style={styles.progressWrap}>
          <Text style={[styles.progressLabel, { color: colors.primary }]}>Step 2 of 3</Text>
          <Text style={[styles.progressPct, { color: colors.textSecondary }]}>66% Complete</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { backgroundColor: colors.primary, width: '66%' }]} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Tell us about your practice</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          This information helps us tailor your experience.
        </Text>
        <View style={styles.form}>
          <Input label="Years of Experience" placeholder="Select your experience level" leftIcon="work" />
          <Input label="Primary City of Practice" placeholder="e.g. New York City" leftIcon="location-on" />
          <Input label="Courts Practiced" placeholder="e.g. Supreme Court, High Court" leftIcon="gavel" />
          <Text style={[styles.hint, { color: colors.textMuted }]}>Separate multiple courts with commas</Text>
        </View>
        <Button
          title="Continue to Step 3"
          onPress={() => router.push('/(auth)/permissions')}
          fullWidth
          rightIcon={<MaterialIcons name="arrow-forward" size={20} color="#fff" />}
          style={styles.continue}
        />
        <Button title="I'll complete this later" variant="ghost" onPress={() => router.push('/(auth)/permissions')} fullWidth />
        <View style={[styles.tip, { backgroundColor: colors.primaryFaded, borderColor: colors.primary + '20' }]}>
          <MaterialIcons name="info" size={24} color={colors.primary} />
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>Why we need this?</Text>
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              This information helps us match your profile with relevant cases and clients in your jurisdiction.
            </Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', paddingVertical: 16 },
  progressWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  progressLabel: { fontSize: 16, fontWeight: '600' },
  progressPct: { fontSize: 14 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 24 },
  progressFill: { height: '100%', borderRadius: 4 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 24 },
  form: { marginBottom: 24 },
  hint: { fontSize: 12, marginLeft: 4, marginTop: -8, marginBottom: 16 },
  continue: { marginBottom: 12 },
  tip: { flexDirection: 'row', gap: 16, padding: 16, borderRadius: 12, borderWidth: 1, marginTop: 24 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  tipText: { fontSize: 12, lineHeight: 18 },
});
