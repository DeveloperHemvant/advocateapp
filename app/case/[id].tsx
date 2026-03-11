import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';

const TABS = ['Overview', 'Documents', 'Team', 'Tasks'] as const;

const CASE_DETAILS = [
  { label: 'Client', value: 'Acme Corp' },
  { label: 'Opposition', value: 'Global Industries' },
  { label: 'Filing Date', value: 'Oct 12, 2023' },
  { label: 'Status', value: 'Active', isStatus: true },
];

const TIMELINE = [
  { type: 'Upcoming', title: 'Preliminary Hearing', meta: 'Nov 15, 2023 • Courtroom 4B', isPrimary: true },
  { type: 'Completed', title: 'Initial Filing Submitted', meta: 'Oct 12, 2023 • System Log', isPrimary: false },
];

const DOCUMENTS = [
  { name: 'Complaint_Final.pdf', meta: '2.4 MB • Oct 14', iconBg: 'red' as const },
  { name: 'Evidence_Log_v2.xlsx', meta: '1.1 MB • Oct 20', iconBg: 'blue' as const },
];

const TEAM = [
  { name: 'David Chen', role: 'Lead Counsel' },
  { name: 'Sarah Jenkins', role: 'Legal Assistant' },
];

const TASKS_LIST = [
  { title: 'Review opposition response', due: 'Due Yesterday', done: true },
  { title: 'Draft deposition questions', due: 'Due Friday', done: false },
  { title: 'Client meeting preparation', due: 'Due in 3 days', done: false },
];

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, spacing, radius } = useTheme();
  const { horizontalPadding } = useResponsive();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Overview');

  const caseId = id ?? 'CIV-2023-089';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.backgroundCard, borderBottomColor: colors.border, paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>Case {caseId}</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <MaterialIcons name="more-vert" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsScroll, { backgroundColor: colors.backgroundCard, borderBottomColor: colors.border }]}
        contentContainerStyle={[styles.tabsContent, { paddingHorizontal: horizontalPadding }]}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary }]}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textSecondary }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Overview' && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Case Details</Text>
              <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
                {CASE_DETAILS.map((row, idx) => (
                  <View key={row.label} style={[styles.detailRow, { borderBottomColor: colors.border, borderBottomWidth: idx < CASE_DETAILS.length - 1 ? 1 : 0 }]}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{row.label}</Text>
                    {row.isStatus ? (
                      <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
                        <Text style={[styles.statusBadgeText, { color: colors.success }]}>{row.value}</Text>
                      </View>
                    ) : (
                      <Text style={[styles.detailValue, { color: colors.text }]}>{row.value}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Case Summary</Text>
              <View style={[styles.card, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
                <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                  Intellectual property dispute regarding proprietary logistics software. The client alleges unauthorized use of patented routing algorithms by the opposition. Discovery phase is currently 60% complete with depositions scheduled for next month.
                </Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Timeline</Text>
              <View style={styles.timeline}>
                {TIMELINE.map((item, i) => (
                  <View key={i} style={styles.timelineItem}>
                    <View style={[styles.timelineDot, { backgroundColor: item.isPrimary ? colors.primary : colors.border, borderColor: colors.backgroundCard }]} />
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineType, { color: item.isPrimary ? colors.primary : colors.textSecondary }]}>{item.type}</Text>
                      <Text style={[styles.timelineTitle, { color: colors.text }]}>{item.title}</Text>
                      <Text style={[styles.timelineMeta, { color: colors.textSecondary }]}>{item.meta}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {activeTab === 'Documents' && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Documents</Text>
              <TouchableOpacity style={[styles.uploadBtn, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="upload" size={16} color="#fff" />
                <Text style={styles.uploadBtnText}>Upload</Text>
              </TouchableOpacity>
            </View>
            {DOCUMENTS.map((doc) => (
              <View key={doc.name} style={[styles.docRow, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
                <View style={[styles.docIcon, { backgroundColor: doc.iconBg === 'red' ? colors.errorBg : colors.primaryFaded }]}>
                  <MaterialIcons name="description" size={24} color={doc.iconBg === 'red' ? colors.error : colors.primary} />
                </View>
                <View style={styles.docInfo}>
                  <Text style={[styles.docName, { color: colors.text }]}>{doc.name}</Text>
                  <Text style={[styles.docMeta, { color: colors.textSecondary }]}>{doc.meta}</Text>
                </View>
                <TouchableOpacity style={styles.docAction}><MaterialIcons name="upgrade" size={20} color={colors.textMuted} /></TouchableOpacity>
                <TouchableOpacity style={styles.docAction}><MaterialIcons name="delete" size={20} color={colors.error} /></TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Team' && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Team Members</Text>
              <TouchableOpacity style={styles.addMemberBtn}>
                <MaterialIcons name="person-add" size={18} color={colors.primary} />
                <Text style={[styles.addMemberText, { color: colors.primary }]}>Add Member</Text>
              </TouchableOpacity>
            </View>
            {TEAM.map((member) => (
              <View key={member.name} style={[styles.teamRow, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
                <View style={[styles.teamAvatar, { backgroundColor: colors.primaryFaded }]}>
                  <MaterialIcons name="person" size={28} color={colors.primary} />
                </View>
                <View style={styles.teamInfo}>
                  <Text style={[styles.teamName, { color: colors.text }]}>{member.name}</Text>
                  <Text style={[styles.teamRole, { color: colors.textSecondary }]}>{member.role}</Text>
                </View>
                <TouchableOpacity><MaterialIcons name="mail" size={22} color={colors.primary} /></TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Tasks' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tasks</Text>
            {TASKS_LIST.map((task) => (
              <View key={task.title} style={[styles.taskRow, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
                <View style={[styles.checkbox, { borderColor: colors.border }]} />
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, { color: colors.text }, task.done && styles.taskDone]}>{task.title}</Text>
                  <Text style={[styles.taskDue, { color: colors.textSecondary }]}>{task.due}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', marginLeft: 8 },
  moreBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  tabsScroll: { borderBottomWidth: 1 },
  tabsContent: { flexDirection: 'row' },
  tab: { paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabText: { fontSize: 14, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
  statusBadgeText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  summaryText: { fontSize: 14, lineHeight: 22 },
  timeline: { paddingLeft: 24 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  timelineDot: { width: 16, height: 16, borderRadius: 8, position: 'absolute', left: -24, top: 4, borderWidth: 4 },
  timelineContent: { flex: 1, marginLeft: 8 },
  timelineType: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  timelineTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  timelineMeta: { fontSize: 12 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  uploadBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  docRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  docIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  docInfo: { flex: 1 },
  docName: { fontSize: 14, fontWeight: '700' },
  docMeta: { fontSize: 12 },
  docAction: { padding: 8 },
  addMemberBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addMemberText: { fontSize: 14, fontWeight: '700' },
  teamRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  teamAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 14, fontWeight: '700' },
  teamRole: { fontSize: 12 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '600' },
  taskDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
  taskDue: { fontSize: 12, marginTop: 2 },
});
