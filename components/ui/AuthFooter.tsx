import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function AuthFooter() {
  const { colors } = useTheme();
  return (
    <View style={styles.legal}>
        <TouchableOpacity><Text style={[styles.legalLink, { color: colors.textMuted }]}>Privacy Policy</Text></TouchableOpacity>
        <TouchableOpacity><Text style={[styles.legalLink, { color: colors.textMuted }]}>Terms of Service</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    legal: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 32 },
    legalLink: { fontSize: 14 },
});
