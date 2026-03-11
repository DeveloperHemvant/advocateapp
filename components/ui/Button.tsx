import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const { colors, spacing, radius } = useTheme();

  const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxl,
        borderRadius: radius.lg,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      },
      text: { color: '#fff', fontWeight: '700', fontSize: 16 },
    },
    secondary: {
      container: {
        backgroundColor: colors.primaryFaded,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxl,
        borderRadius: radius.lg,
      },
      text: { color: colors.primary, fontWeight: '600', fontSize: 16 },
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.border,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxl,
        borderRadius: radius.lg,
      },
      text: { color: colors.text, fontWeight: '600', fontSize: 16 },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
      },
      text: { color: colors.textSecondary, fontWeight: '500', fontSize: 14 },
    },
  };

  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        v.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text style={[v.text, textStyle]}>{title}</Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.6 },
});
