import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: boolean;
};

export function Card({ children, onPress, style, padding = true }: CardProps) {
  const { colors, spacing, radius } = useTheme();
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      style={[
        {
          backgroundColor: colors.backgroundCard,
          borderRadius: radius.xl,
          borderWidth: 1,
          borderColor: colors.borderCard,
          padding: padding ? spacing.lg : 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({});
