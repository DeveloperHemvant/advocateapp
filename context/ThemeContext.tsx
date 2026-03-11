import React, { createContext, useContext } from 'react';
import { Colors, Spacing, BorderRadius, Layout } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ColorScheme = 'light' | 'dark';

export type Theme = {
  colorScheme: ColorScheme;
  colors: typeof Colors.light;
  spacing: typeof Spacing;
  radius: typeof BorderRadius;
  layout: typeof Layout;
  isDark: boolean;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const theme: Theme = {
    colorScheme,
    colors,
    spacing: Spacing,
    radius: BorderRadius,
    layout: Layout,
    isDark: colorScheme === 'dark',
  };
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    const scheme = useColorScheme() ?? 'light';
    return {
      colorScheme: scheme,
      colors: Colors[scheme],
      spacing: Spacing,
      radius: BorderRadius,
      layout: Layout,
      isDark: scheme === 'dark',
    };
  }
  return theme;
}
