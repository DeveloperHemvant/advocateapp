import React from 'react';
import { View, ViewStyle, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';

export type MaxWidthVariant = 'md' | '2xl' | '5xl' | 'full';

type ScreenContainerProps = {
  children: React.ReactNode;
  scroll?: boolean;
  centered?: boolean;
  padding?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  maxWidth?: MaxWidthVariant | boolean;
  /** Use backgroundAlt (e.g. #f6f6f8 on login) to match stitch */
  backgroundVariant?: 'default' | 'alt';
};

export function ScreenContainer({
  children,
  scroll = true,
  centered = false,
  padding = true,
  style,
  contentContainerStyle,
  maxWidth = 'md',
  backgroundVariant = 'default',
}: ScreenContainerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { horizontalPadding, contentWidthMd, contentWidth2xl, contentWidth5xl } = useResponsive();

  const padH = padding ? Math.max(insets.left, horizontalPadding) : 0;
  const padHR = padding ? Math.max(insets.right, horizontalPadding) : 0;
  const bgColor = backgroundVariant === 'alt' ? colors.backgroundAlt : colors.background;

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: bgColor,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: padH,
    paddingRight: padHR,
  };

  const resolvedMaxWidth =
    maxWidth === true ? contentWidthMd
    : maxWidth === false || maxWidth === 'full' ? undefined
    : maxWidth === '2xl' ? contentWidth2xl
    : maxWidth === '5xl' ? contentWidth5xl
    : contentWidthMd;

  const contentStyle: ViewStyle = {
    flexGrow: scroll ? 1 : undefined,
    justifyContent: centered ? 'center' : undefined,
    alignItems: resolvedMaxWidth ? 'center' : undefined,
    maxWidth: resolvedMaxWidth,
    width: '100%',
  };

  if (scroll) {
    return (
      <KeyboardAvoidingView
        style={[containerStyle, style]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[contentStyle, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  return (
    <View style={[containerStyle, contentStyle, contentContainerStyle, style]}>{children}</View>
  );
}
