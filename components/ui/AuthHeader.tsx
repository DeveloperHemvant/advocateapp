import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

export function AuthHeader() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.replace('/(auth)/welcome')} style={styles.brandRow}>
        <View style={[styles.logoWrap, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="gavel" size={28} color="#fff" />
        </View>
        <Text style={[styles.brandName, { color: colors.primary }]}>LexAI</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={styles.help}>
        <Text style={[styles.helpText, { color: colors.textSecondary }]}>Help Center</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    width: '100%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoWrap: {
    padding: 6,
    borderRadius: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  help: {},
  helpText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
