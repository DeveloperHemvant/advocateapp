import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';

const SPLASH_DURATION = 2500;

export default function SplashScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, SPLASH_DURATION);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View style={styles.blur} />
      <View style={[styles.content, { paddingHorizontal: isTablet ? 64 : 24 }]}>
        <Animated.View entering={ZoomIn.duration(800)} style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
          <MaterialIcons name="gavel" size={isTablet ? 64 : 48} color="#fff" />
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(300).duration(600)} style={[styles.title, { fontSize: isTablet ? 48 : 40 }]}>
          Advocate AI
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(500).duration(600)} style={styles.subtitle}>
          AI Assistant for Advocates
        </Animated.Text>
        <Animated.View entering={FadeIn.delay(800).duration(600)} style={styles.progressWrap}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Securing Workspace...</Text>
            <Text style={styles.progressLabel}>35%</Text>
          </View>
          <View style={[styles.progressBg, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <View style={[styles.progressFill, { width: '35%' }]} />
          </View>
        </Animated.View>
      </View>
      <Animated.View entering={FadeInDown.delay(1000).duration(600)} style={styles.footer}>
        <View style={styles.footerRow}>
          <MaterialIcons name="lock" size={14} color="rgba(255,255,255,0.4)" />
          <Text style={styles.footerText}>Enterprise Grade Security</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  blur: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: '50%',
    height: '50%',
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  content: { alignItems: 'center', zIndex: 10, maxWidth: 600, width: '100%' },
  iconWrap: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 20, fontWeight: '300', marginBottom: 48, textAlign: 'center' },
  progressWrap: { width: '100%', maxWidth: 300 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '500' },
  progressBg: { height: 6, borderRadius: 9999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 9999 },
  footer: { position: 'absolute', bottom: 48, alignItems: 'center', width: '100%' },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  footerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
