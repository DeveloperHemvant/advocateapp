import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { ScreenContainer } from '@/components/ui/ScreenContainer';

export default function ResearchScreen() {
  const { colors } = useTheme();
  return (
    <ScreenContainer scroll padding>
      <View style={styles.hero}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryFaded }]}>
          <MaterialIcons name="search" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Legal Research</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Search case law and legal resources (static placeholder).
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 48 },
  iconWrap: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center' },
});
