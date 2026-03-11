import { useWindowDimensions } from 'react-native';
import { Platform } from 'react-native';
import { Layout } from '@/constants/theme';

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isTablet = width >= BREAKPOINTS.md;
  const isDesktop = isWeb && width >= BREAKPOINTS.lg;
  const isSmallScreen = width < BREAKPOINTS.sm;
  const isMediumUp = width >= BREAKPOINTS.md;

  const horizontalPadding = isSmallScreen ? 16 : isMediumUp ? 32 : 24;
  const contentWidthMd = Math.min(width - horizontalPadding * 2, Layout.maxContentWidth);
  const contentWidth2xl = Math.min(width - horizontalPadding * 2, Layout.maxContentWidthWide);
  const contentWidth5xl = Math.min(width - horizontalPadding * 2, Layout.maxContentWidth5xl);

  const scale = width < BREAKPOINTS.sm ? 1 : Math.min(1.15, 0.9 + width / 1200);
  const fontScale = (size: number) => Math.round(size * Math.min(scale, 1.2));

  return {
    width,
    height,
    isWeb,
    isTablet,
    isDesktop,
    isSmallScreen,
    isMediumUp,
    horizontalPadding,
    contentWidthMd,
    contentWidth2xl,
    contentWidth5xl,
    scale,
    fontScale,
    breakpoints: BREAKPOINTS,
  };
}
