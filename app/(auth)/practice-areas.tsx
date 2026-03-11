import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { AppHeader } from '@/components/ui/AppHeader';

const AREAS = [
  { id: 'civil', label: 'Civil', icon: 'gavel' },
  { id: 'criminal', label: 'Criminal', icon: 'balance' },
  { id: 'corporate', label: 'Corporate', icon: 'business' },
  { id: 'family', label: 'Family', icon: 'people' },
  { id: 'property', label: 'Property', icon: 'home' },
  { id: 'labour', label: 'Labour', icon: 'engineering' },
];

export default function PracticeAreasScreen() {
  const { colors, radius } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(['civil']);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <ScreenContainer scroll padding>
      <View style={styles.wrap}>
        <AppHeader title="Onboarding" showBack />
        <View style={styles.progress}>
          <View style={[styles.progressDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.progressDotSmall, { backgroundColor: colors.primary + '30' }]} />
          <View style={[styles.progressDotSmall, { backgroundColor: colors.primary + '30' }]} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>What is your specialty?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Select the practice areas you specialize in.</Text>
        <View style={styles.grid}>
          {AREAS.map((a) => {
            const isSelected = selected.includes(a.id);
            return (
              <TouchableOpacity
                key={a.id}
                onPress={() => toggle(a.id)}
                style={[styles.chip, { backgroundColor: isSelected ? colors.primaryFaded : colors.inputBg, borderColor: isSelected ? colors.primary : colors.border, borderWidth: isSelected ? 2 : 1, borderRadius: radius.lg }]}
              >
                <MaterialIcons name={a.icon as any} size={22} color={isSelected ? colors.primary : colors.textMuted} />
                <Text style={[styles.chipLabel, { color: colors.text }]}>{a.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Button title="Next" onPress={() => router.push('/(auth)/professional-details')} fullWidth rightIcon={<MaterialIcons name="arrow-forward" size={20} color="#fff" />} style={styles.nextBtn} />
        <Text style={[styles.stepText, { color: colors.textMuted }]}>Step 1 of 3</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', paddingVertical: 16 },
  progress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 },
  progressDot: { width: 32, height: 8, borderRadius: 4 },
  progressDotSmall: { width: 8, height: 8, borderRadius: 4 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  subtitle: { fontSize: 16, marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16, minWidth: '47%' },
  chipLabel: { fontSize: 14, fontWeight: '600' },
  nextBtn: { marginBottom: 8 },
  stepText: { fontSize: 12, textAlign: 'center' },
});
