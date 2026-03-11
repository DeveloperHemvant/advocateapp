import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';
import { ScreenContainer } from '@/components/ui/ScreenContainer';

const STATS = [
  { label: 'Active Cases', value: '24', icon: 'folder-open', color: 'primary' as const },
  { label: "Today's Hearings", value: '5', icon: 'gavel', color: 'accent' as const },
  { label: 'Pending Tasks', value: '12', icon: 'checklist', color: 'secondary' as const },
  { label: 'AI Drafts', value: '8', icon: 'description', color: 'muted' as const },
];

const QUICK_ACTIONS = [
  { label: 'AI Draft', icon: 'bolt' },
  { label: 'New Case', icon: 'add-box' },
  { label: 'Add Hearing', icon: 'event' },
  { label: 'Research', icon: 'travel-explore' },
  { label: 'Upload', icon: 'upload-file' },
];

const HEARINGS = [
  { title: 'State vs. Anderson', time: '10:30 AM', court: 'Supreme Court of NY • Room 402', client: 'Robert Anderson' },
  { title: 'Miller Estate Dispute', time: '02:15 PM', court: 'Civil District Court', client: 'Julia Miller' },
];

const RECENT_CASES = [
  { title: 'Acme Corp vs. Zenith Tech', date: 'Sep 14 • Commercial Court', status: 'Active', statusColor: 'green' },
  { title: 'Property Claim - West End', date: 'Tomorrow • High Court', status: 'Upcoming', statusColor: 'amber' },
];

const TASKS = [
  { title: 'Review Settlement Proposal', meta: 'Acme Corp vs. Zenith • Today', priority: 'High' },
  { title: 'File Rejoinder Affidavit', meta: 'State vs. Anderson • 2 days', priority: null },
];

const DRAFTS = [
  { name: 'NDA_Template_Final.docx', meta: 'Acme Corp • 2h ago' },
  { name: 'Divorce_Petition_V2.pdf', meta: 'Miller Estate • Yesterday' },
];

export default function DashboardScreen() {
  const { colors, spacing } = useTheme();
  const { horizontalPadding, isTablet } = useResponsive();
  const statCardWidth = isTablet ? '23%' : '47%';

  return (
    <ScreenContainer scroll centered={false} padding maxWidth="full">
      <View style={[styles.header, { paddingBottom: spacing.lg }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryFaded }]}>
            <MaterialIcons name="person" size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Hello Advocate Sarah</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Legal workspace overview</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.inputBg }]}>
          <MaterialIcons name="notifications" size={24} color={colors.text} />
          <View style={[styles.badge, { backgroundColor: colors.accent, borderColor: colors.background, borderWidth: 2 }]} />
        </TouchableOpacity>
      </View>

      <View style={[styles.statsGrid, { gap: spacing.md }]}>
        {STATS.map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: colors.backgroundCard, borderColor: colors.borderCard, minWidth: isTablet ? undefined : 140, width: isTablet ? statCardWidth : '48%' }]}>
            <View style={[styles.statIcon, { backgroundColor: s.color === 'primary' ? colors.primaryFaded : s.color === 'accent' ? colors.warningBg : s.color === 'secondary' ? colors.primaryFaded : colors.inputBg }]}>
              <MaterialIcons name={s.icon as any} size={18} color={s.color === 'primary' || s.color === 'secondary' ? colors.primary : s.color === 'accent' ? colors.accent : colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[styles.ctaCard, { backgroundColor: colors.primary }]}>
        <View style={styles.ctaContent}>
          <Text style={styles.ctaTitle}>Generate Legal Draft</Text>
          <Text style={styles.ctaSubtitle}>Create complex legal documents instantly using AI case law models.</Text>
          <View style={[styles.ctaBtn, { backgroundColor: '#fff' }]}>
            <MaterialIcons name="auto-awesome" size={16} color={colors.primary} />
            <Text style={[styles.ctaBtnText, { color: colors.primary }]}>Start Draft</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll} contentContainerStyle={[styles.quickContent, { paddingLeft: horizontalPadding, paddingRight: horizontalPadding }]}>
        {QUICK_ACTIONS.map((a) => (
          <TouchableOpacity key={a.label} style={[styles.quickItem, { backgroundColor: colors.backgroundCard, borderColor: colors.borderCard }]}>
            <View style={[styles.quickIcon, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
              <MaterialIcons name={a.icon as any} size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickLabel, { color: colors.text }]}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today’s Hearings</Text>
        <TouchableOpacity><Text style={[styles.sectionLink, { color: colors.primary }]}>View All</Text></TouchableOpacity>
      </View>
      {HEARINGS.map((h) => (
        <View key={h.title} style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.borderCard }]}>
          <View style={styles.cardRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{h.title}</Text>
            <View style={[styles.timeBadge, { backgroundColor: colors.primaryFaded }]}><Text style={[styles.timeText, { color: colors.primary }]}>{h.time}</Text></View>
          </View>
          <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>{h.court}</Text>
          <View style={styles.clientRow}>
            <MaterialIcons name="person" size={14} color={colors.textMuted} />
            <Text style={[styles.clientText, { color: colors.textSecondary }]}>{h.client}</Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity style={[styles.cardBtn, { backgroundColor: colors.inputBg }]}><Text style={[styles.cardBtnText, { color: colors.text }]}>View Case</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.cardBtnPrimary, { backgroundColor: colors.primary }]}><Text style={styles.cardBtnPrimaryText}>Remind</Text></TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Cases</Text>
      {RECENT_CASES.map((c) => (
        <View key={c.title} style={[styles.caseRow, { backgroundColor: colors.backgroundCard, borderColor: colors.borderCard }]}>
          <View style={[styles.caseIcon, { backgroundColor: colors.primaryFaded }]}><MaterialIcons name="balance" size={20} color={colors.primary} /></View>
          <View style={styles.caseContent}>
            <View style={styles.caseRowTop}>
              <Text style={[styles.caseTitle, { color: colors.text }]} numberOfLines={1}>{c.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: c.statusColor === 'green' ? colors.successBg : colors.warningBg }]}><Text style={[styles.statusText, { color: c.statusColor === 'green' ? colors.success : colors.warning }]}>{c.status}</Text></View>
            </View>
            <Text style={[styles.caseMeta, { color: colors.textSecondary }]}>{c.date}</Text>
          </View>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Tasks</Text>
      <View style={[styles.tasksCard, { backgroundColor: colors.backgroundCard, borderColor: colors.borderCard }]}>
      {TASKS.map((t) => (
        <View key={t.title} style={[styles.taskRow, { borderBottomColor: colors.border }]}>
          <View style={[styles.checkbox, { borderColor: colors.border }]} />
          <View style={styles.taskContent}>
            <View style={styles.taskRowTop}>
              <Text style={[styles.taskTitle, { color: colors.text }]}>{t.title}</Text>
              {t.priority ? <View style={[styles.priorityBadge, { backgroundColor: colors.errorBg }]}><Text style={[styles.priorityText, { color: colors.error }]}>{t.priority}</Text></View> : null}
            </View>
            <Text style={[styles.taskMeta, { color: colors.textSecondary }]}>{t.meta}</Text>
          </View>
        </View>
      ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent AI Drafts</Text>
      {DRAFTS.map((d) => (
        <View key={d.name} style={[styles.draftRow, { backgroundColor: colors.backgroundCard, borderColor: colors.borderCard }]}>
          <View style={[styles.draftIcon, { backgroundColor: colors.inputBg }]}><MaterialIcons name="description" size={20} color={colors.textSecondary} /></View>
          <View style={styles.draftContent}>
            <Text style={[styles.draftTitle, { color: colors.text }]} numberOfLines={1}>{d.name}</Text>
            <Text style={[styles.draftMeta, { color: colors.textSecondary }]}>{d.meta}</Text>
          </View>
          <TouchableOpacity><MaterialIcons name="more-vert" size={20} color={colors.textMuted} /></TouchableOpacity>
        </View>
      ))}

      <View style={{ height: 96 }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  greeting: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, width: '48%', minWidth: 140 },
  statIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  statValue: { fontSize: 20, fontWeight: '700' },
  ctaCard: { borderRadius: 12, padding: 20, marginBottom: 20 },
  ctaContent: {},
  ctaTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  ctaSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 12 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  ctaBtnText: { fontSize: 12, fontWeight: '700' },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionLink: { fontSize: 12, fontWeight: '600' },
  quickScroll: { marginBottom: 20 },
  quickContent: { flexDirection: 'row', gap: 12, paddingBottom: 8 },
  quickItem: { alignItems: 'center', width: 80 },
  quickIcon: { width: 48, height: 48, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  timeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  timeText: { fontSize: 10, fontWeight: '700' },
  cardMeta: { fontSize: 12, marginBottom: 8 },
  clientRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  clientText: { fontSize: 11 },
  cardActions: { flexDirection: 'row', gap: 8 },
  cardBtn: { flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
  cardBtnText: { fontSize: 12, fontWeight: '600' },
  cardBtnPrimary: { flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
  cardBtnPrimaryText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  caseRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  caseIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  caseContent: { flex: 1, minWidth: 0 },
  caseRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  caseTitle: { fontSize: 13, fontWeight: '700', flex: 1 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  caseMeta: { fontSize: 11 },
  tasksCard: { borderRadius: 12, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderBottomWidth: 1 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, marginTop: 2 },
  taskContent: { flex: 1 },
  taskRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  taskTitle: { fontSize: 13, fontWeight: '700' },
  priorityBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priorityText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  taskMeta: { fontSize: 11 },
  draftRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, marginBottom: 4 },
  draftIcon: { width: 32, height: 32, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  draftContent: { flex: 1, minWidth: 0 },
  draftTitle: { fontSize: 13, fontWeight: '700' },
  draftMeta: { fontSize: 10 },
});
