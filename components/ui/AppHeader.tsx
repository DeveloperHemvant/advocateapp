import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

type AppHeaderProps = {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
};

export function AppHeader({ title, showBack, rightAction, onBack }: AppHeaderProps) {
  const { colors, spacing } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  return (
    <View style={[styles.header, { paddingVertical: spacing.lg }]}>
      <View style={styles.side}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
      {title ? (
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
      ) : null}
      <View style={styles.side}>{rightAction ?? <View style={{ width: 40 }} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: { minWidth: 40, alignItems: 'flex-start' },
  backBtn: { padding: 4 },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', paddingHorizontal: 8 },
});
