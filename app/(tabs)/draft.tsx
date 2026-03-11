import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';
import { ScreenContainer } from '@/components/ui/ScreenContainer';

const DOCUMENT_TYPES = [
  { id: 'petition', label: 'Petition', icon: 'description' as const, iconColor: 'primary' as const, bgKey: 'petition' as const },
  { id: 'notice', label: 'Legal Notice', icon: 'article' as const, iconColor: 'indigo' as const, bgKey: 'notice' as const },
  { id: 'agreement', label: 'Agreement', icon: 'handshake' as const, iconColor: 'purple' as const, bgKey: 'agreement' as const },
  { id: 'other', label: 'Other', icon: 'more-horiz' as const, iconColor: 'slate' as const, bgKey: 'other' as const },
];

const RECENT_ACTIVITY = [
  {
    id: '1',
    title: 'Divorce Petition - Sharma vs Sharma',
    time: '24 mins ago',
    status: 'Analyzing Facts...',
    statusColor: 'blue' as const,
    icon: 'auto-stories' as const,
    iconBg: 'primary' as const,
  },
  {
    id: '2',
    title: 'Eviction Notice - Greenview Apts',
    time: '2 hours ago',
    status: 'Draft Ready',
    statusColor: 'green' as const,
    icon: 'check-circle' as const,
    iconBg: 'green' as const,
  },
  {
    id: '3',
    title: 'Service Agreement - Tech Corp',
    time: 'Yesterday',
    status: 'Waiting for Review',
    statusColor: 'slate' as const,
    icon: 'edit-note' as const,
    iconBg: 'amber' as const,
  },
];

function getDocTypeColors(
  bgKey: string,
  isDark: boolean
): { bg: string; icon: string } {
  if (isDark) {
    const darkMap: Record<string, { bg: string; icon: string }> = {
      petition: { bg: 'rgba(30,59,138,0.3)', icon: '#3b82f6' },
      notice: { bg: 'rgba(99,102,241,0.25)', icon: '#818cf8' },
      agreement: { bg: 'rgba(168,85,247,0.25)', icon: '#a78bfa' },
      other: { bg: 'rgba(30,41,59,0.8)', icon: '#94a3b8' },
    };
    return darkMap[bgKey] ?? darkMap.other;
  }
  const lightMap: Record<string, { bg: string; icon: string }> = {
    petition: { bg: 'rgba(30,59,138,0.08)', icon: '#1e3b8a' },
    notice: { bg: '#e0e7ff', icon: '#4f46e5' },
    agreement: { bg: '#f3e8ff', icon: '#7c3aed' },
    other: { bg: '#f1f5f9', icon: '#64748b' },
  };
  return lightMap[bgKey] ?? lightMap.other;
}

function getActivityIconBg(
  iconBg: string,
  isDark: boolean
): string {
  if (isDark) {
    const m: Record<string, string> = {
      primary: 'rgba(59,130,246,0.3)',
      green: 'rgba(34,197,94,0.3)',
      amber: 'rgba(245,158,11,0.3)',
    };
    return m[iconBg] ?? 'rgba(30,41,59,0.5)';
  }
  const m: Record<string, string> = {
    primary: 'rgba(30,59,138,0.2)',
    green: '#dcfce7',
    amber: '#ffedd5',
  };
  return m[iconBg] ?? '#f1f5f9';
}

function getStatusColor(statusColor: string, colors: Record<string, string>): string {
  const m: Record<string, string> = {
    blue: colors.primary,
    green: colors.success,
    slate: colors.textSecondary,
  };
  return m[statusColor] ?? colors.textSecondary;
}

export default function DraftScreen() {
  const { colors, spacing, radius } = useTheme();
  const { horizontalPadding, contentWidthMd, isTablet, fontScale } = useResponsive();
  const isDark = colors.background === '#121620' || colors.backgroundCard === '#0F172A';

  const containerMaxWidth = contentWidthMd;
  const sectionPadding = horizontalPadding;

  return (
    <View style={[styles.outer, { backgroundColor: colors.backgroundAlt }]}>
      <ScreenContainer scroll centered={false} padding maxWidth="full" backgroundVariant="alt">
        <View style={[styles.container, { maxWidth: containerMaxWidth, alignSelf: 'center', width: '100%', backgroundColor: colors.backgroundCard, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 8 }]}>
          {/* Header - sticky style */}
          <View style={[styles.header, { backgroundColor: colors.backgroundCard, borderBottomColor: colors.border, paddingHorizontal: sectionPadding, paddingVertical: spacing.lg }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIcon, { backgroundColor: colors.primaryFaded }]}>
                <MaterialIcons name="gavel" size={22} color={colors.primary} />
              </View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>AI Drafting</Text>
            </View>
            <TouchableOpacity style={[styles.notifBtn, { backgroundColor: colors.inputBg }]} hitSlop={12}>
              <MaterialIcons name="notifications" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={{ paddingBottom: 100 }}>
            {/* Suggested for You */}
            <View style={[styles.section, { paddingHorizontal: sectionPadding, paddingTop: spacing.lg }]}>
              <View style={styles.sectionHead}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontScale(18) }]}>Suggested for You</Text>
                <View style={[styles.pill, { backgroundColor: colors.primaryFaded }]}>
                  <Text style={[styles.pillText, { color: colors.primary }]}>AI Priority</Text>
                </View>
              </View>
              <View style={[styles.suggestedCard, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
                <View style={[styles.suggestedCardInner, { padding: spacing.xl }]}>
                  <View style={styles.suggestedTop}>
                    <View>
                      <View style={styles.urgentRow}>
                        <View style={[styles.urgentDot, { backgroundColor: colors.error }]} />
                        <Text style={[styles.urgentLabel, { color: colors.error }]}>Urgent Requirement</Text>
                      </View>
                      <Text style={[styles.suggestedTitle, { color: colors.text }]}>Draft Rejoinder for Case #102</Text>
                      <Text style={[styles.suggestedMeta, { color: colors.textSecondary }]}>Hearing in 2 days • Court Room 4B</Text>
                    </View>
                  </View>
                  <View style={[styles.suggestedActions, { marginTop: spacing.lg }]}>
                    <TouchableOpacity style={[styles.startDraftBtn, { backgroundColor: colors.primary }]} activeOpacity={0.85}>
                      <MaterialIcons name="auto-awesome" size={18} color="#fff" />
                      <Text style={styles.startDraftBtnText}>Start AI Drafting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.visibilityBtn, { borderColor: colors.border }]}>
                      <MaterialIcons name="visibility" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.gradientBar, { backgroundColor: colors.primary }]} />
              </View>
            </View>

            {/* New Document */}
            <View style={[styles.section, { paddingHorizontal: sectionPadding, paddingTop: spacing.xxl }]}>
              <Text style={[styles.sectionTitleStandalone, { color: colors.text, fontSize: fontScale(18) }]}>New Document</Text>
              <View style={[styles.docGrid, { gap: spacing.md, marginTop: spacing.lg }]}>
                {DOCUMENT_TYPES.map((d) => {
                  const { bg, icon: iconColor } = getDocTypeColors(d.bgKey, isDark);
                  return (
                    <TouchableOpacity
                      key={d.id}
                      style={[
                        styles.docTile,
                        {
                          backgroundColor: colors.backgroundCard,
                          borderColor: colors.border,
                          width: isTablet ? '23%' : '47%',
                          minWidth: isTablet ? undefined : 140,
                        },
                      ]}
                      activeOpacity={0.85}
                    >
                      <View style={[styles.docTileIcon, { backgroundColor: bg }]}>
                        <MaterialIcons name={d.icon} size={24} color={iconColor} />
                      </View>
                      <Text style={[styles.docTileLabel, { color: colors.text }]}>{d.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Recent Draft Activity */}
            <View style={[styles.section, { paddingHorizontal: sectionPadding, paddingTop: spacing.xxl }]}>
              <View style={styles.sectionHead}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontScale(18) }]}>Recent Draft Activity</Text>
                <TouchableOpacity>
                  <Text style={[styles.viewAllLink, { color: colors.primary }]}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.activityList, { gap: spacing.md, marginTop: spacing.lg }]}>
                {RECENT_ACTIVITY.map((a) => (
                  <View
                    key={a.id}
                    style={[styles.activityCard, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
                  >
                    <View style={[styles.activityIconWrap, { backgroundColor: getActivityIconBg(a.iconBg, isDark) }]}>
                      <MaterialIcons
                        name={a.icon}
                        size={24}
                        color={a.iconBg === 'primary' ? colors.primary : a.iconBg === 'green' ? colors.success : colors.accent}
                      />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={[styles.activityTitle, { color: colors.text }]} numberOfLines={1}>{a.title}</Text>
                      <View style={styles.activityMeta}>
                        <Text style={[styles.activityTime, { color: colors.textSecondary }]}>{a.time}</Text>
                        <View style={[styles.activityDot, { backgroundColor: colors.textMuted }]} />
                        <Text style={[styles.activityStatus, { color: getStatusColor(a.statusColor, colors) }]}>{a.status}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { padding: 8, borderRadius: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  notifBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  section: {},
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontWeight: '700' },
  sectionTitleStandalone: { fontWeight: '700' },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
  pillText: { fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  suggestedCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  suggestedCardInner: {},
  suggestedTop: {},
  urgentRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  urgentDot: { width: 8, height: 8, borderRadius: 4 },
  urgentLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  suggestedTitle: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  suggestedMeta: { fontSize: 14, marginTop: 4 },
  suggestedActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  startDraftBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 8 },
  startDraftBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  visibilityBtn: { width: 44, height: 44, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  gradientBar: { height: 4, width: '100%' },
  docGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  docTile: {
    width: '47%',
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  docTileIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  docTileLabel: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  viewAllLink: { fontSize: 14, fontWeight: '600' },
  activityList: {},
  activityCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 12, borderRadius: 12, borderWidth: 1 },
  activityIconWrap: { width: 48, height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  activityContent: { flex: 1, minWidth: 0 },
  activityTitle: { fontSize: 14, fontWeight: '700' },
  activityMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  activityTime: { fontSize: 12 },
  activityDot: { width: 4, height: 4, borderRadius: 2 },
  activityStatus: { fontSize: 12, fontWeight: '500' },
});
