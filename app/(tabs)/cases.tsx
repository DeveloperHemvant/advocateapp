import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';
import { ScreenContainer } from '@/components/ui/ScreenContainer';

const FILTERS = ['Active', 'Pending', 'Closed', 'Archived'];
const CASE_LIST = [
  { id: 'L-98432', title: 'Acme vs Zenith', status: 'Active', hearing: 'Oct 24, 2023', lead: 'J. Doe' },
  { id: 'C-22109', title: 'State vs Thompson', status: 'Active', hearing: 'Nov 02, 2023', lead: 'M. Ross' },
  { id: 'P-88271', title: 'Miller Estates Registry', status: 'Pending', hearing: 'TBD', lead: 'S. Lee' },
];

export default function CasesScreen() {
  const { colors } = useTheme();
  const { horizontalPadding } = useResponsive();
  const [activeFilter, setActiveFilter] = React.useState('Active');
  const router = useRouter();

  return (
    <ScreenContainer scroll centered={false} padding maxWidth="full">
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={[styles.logo, { backgroundColor: colors.primaryFaded }]}>
            <MaterialIcons name="gavel" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.brand, { color: colors.text }]}>LegalConnect</Text>
        </View>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.inputBg }]}>
          <MaterialIcons name="notifications" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={[styles.search, { backgroundColor: colors.backgroundCard, borderColor: colors.border }]}>
        <MaterialIcons name="search" size={22} color={colors.textMuted} />
        <Text style={[styles.searchPlaceholder, { color: colors.textMuted }]}>Search cases by title or ID</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={[styles.filtersContent, { paddingLeft: horizontalPadding, paddingRight: horizontalPadding }]}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterChip, activeFilter === f ? { backgroundColor: colors.primary } : { backgroundColor: colors.inputBg }]}
          >
            <Text style={[styles.filterText, { color: activeFilter === f ? '#fff' : colors.text }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {CASE_LIST.map((c) => (
        <TouchableOpacity key={c.id} onPress={() => router.push(`/case/${c.id}`)} activeOpacity={0.85} style={[styles.caseCard, { backgroundColor: colors.backgroundCard, borderColor: colors.borderCard }]}>
          <View style={styles.caseCardTop}>
            <View>
              <Text style={[styles.caseTitle, { color: colors.text }]}>{c.title}</Text>
              <Text style={[styles.caseId, { color: colors.textSecondary }]}>ID: #{c.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.successBg }]}>
              <Text style={[styles.statusText, { color: colors.success }]}>{c.status}</Text>
            </View>
          </View>
          <View style={[styles.caseMeta, { borderTopColor: colors.border }]}>
            <View style={styles.metaRow}>
              <MaterialIcons name="calendar-today" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>Hearing: {c.hearing}</Text>
            </View>
            <View style={styles.metaRow}>
              <MaterialIcons name="person" size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>Lead: {c.lead}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 88 }} />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/case/new')}
        activeOpacity={0.9}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { padding: 8, borderRadius: 8 },
  brand: { fontSize: 22, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, height: 48, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  searchPlaceholder: { fontSize: 16 },
  filters: { marginBottom: 16 },
  filtersContent: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 0 },
  filterChip: { height: 36, minHeight: 36, paddingHorizontal: 20, paddingVertical: 0, borderRadius: 9999, justifyContent: 'center', alignItems: 'center' },
  filterText: { fontSize: 14, fontWeight: '600' },
  caseCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  caseCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  caseTitle: { fontSize: 18, fontWeight: '700' },
  caseId: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  caseMeta: { flexDirection: 'row', gap: 16, paddingTop: 12, marginTop: 12, borderTopWidth: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 14 },
  fab: {
    position: 'absolute',
    bottom: 96,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e3b8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});
