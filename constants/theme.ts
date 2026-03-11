/**
 * Advocate AI / LexAI design system.
 * Matches stitch_screens: primary #1e3b8a, background-light #f8fafc / #f6f6f8, background-dark #121620.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1e3b8a';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748b',
    background: '#f8fafc',
    backgroundAlt: '#f6f6f8',
    backgroundCard: '#ffffff',
    tint: tintColorLight,
    primary: '#1e3b8a',
    primaryFaded: 'rgba(30, 59, 138, 0.1)',
    secondary: '#2563eb',
    accent: '#f59e0b',
    accentFaded: 'rgba(245, 158, 11, 0.1)',
    icon: '#64748b',
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorLight,
    border: '#e2e8f0',
    borderCard: 'rgba(226, 232, 240, 0.6)',
    inputBg: '#f1f5f9',
    success: '#16a34a',
    successBg: '#dcfce7',
    warning: '#ea580c',
    warningBg: '#ffedd5',
    error: '#dc2626',
    errorBg: '#fee2e2',
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0F172A',
    },
  },
  dark: {
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    background: '#121620',
    backgroundAlt: '#121620',
    backgroundCard: '#0F172A',
    tint: tintColorDark,
    primary: '#3b82f6',
    primaryFaded: 'rgba(59, 130, 246, 0.2)',
    secondary: '#2563eb',
    accent: '#f59e0b',
    accentFaded: 'rgba(245, 158, 11, 0.2)',
    icon: '#94a3b8',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorDark,
    border: '#334155',
    borderCard: '#1e293b',
    inputBg: '#1e293b',
    success: '#22c55e',
    successBg: 'rgba(34, 197, 94, 0.2)',
    warning: '#f97316',
    warningBg: 'rgba(249, 115, 22, 0.2)',
    error: '#ef4444',
    errorBg: 'rgba(239, 68, 68, 0.2)',
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

/** Tailwind-style max widths (px): max-w-md=448, max-w-2xl=672, max-w-5xl=1024 */
export const Layout = {
  maxContentWidth: 448,
  maxContentWidthWide: 672,
  maxContentWidth5xl: 1024,
};
