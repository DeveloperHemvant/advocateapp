import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';

const TEAM_AVATARS = [
  { name: 'Lead', isLead: true },
  { name: 'Marcus', isLead: false },
  { name: 'Sarah', isLead: false },
  { name: 'James', isLead: false },
  { name: 'Invite', isInvite: true },
];

export default function NewCaseScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { horizontalPadding, contentWidth2xl, isTablet } = useResponsive();

  return (
    <View style={[styles.outer, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border, paddingHorizontal: horizontalPadding }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: 'transparent' }]}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Create New Case</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.cancelBtn, { color: colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.maxWrap, { maxWidth: contentWidth2xl }]}>
          {/* Case Details */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <MaterialIcons name="description" size={22} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Case Details</Text>
            </View>
            <View style={[styles.grid, isTablet && styles.gridRow]}>
              <View style={styles.fullRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Case Title</Text>
                <TextInput
                  placeholder="e.g. Smith vs. TechCorp Intellectual Property"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.backgroundCard, borderColor: colors.primary + '30', color: colors.text }]}
                />
              </View>
              <View style={[styles.halfRow, isTablet && { width: '48%' }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Client Name</Text>
                <TextInput placeholder="Full legal name" placeholderTextColor={colors.textMuted} style={[styles.input, { backgroundColor: colors.backgroundCard, borderColor: colors.primary + '30', color: colors.text }]} />
              </View>
              <View style={[styles.halfRow, isTablet && { width: '48%' }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Case Type</Text>
                <View style={[styles.selectWrap, { backgroundColor: colors.backgroundCard, borderColor: colors.primary + '30' }]}>
                  <Text style={[styles.selectPlaceholder, { color: colors.textMuted }]}>Select category</Text>
                  <MaterialIcons name="expand-more" size={22} color={colors.textMuted} style={styles.selectIcon} />
                </View>
              </View>
              <View style={[styles.halfRow, isTablet && { width: '48%' }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Opposition Name</Text>
                <TextInput placeholder="Counterparty name" placeholderTextColor={colors.textMuted} style={[styles.input, { backgroundColor: colors.backgroundCard, borderColor: colors.primary + '30', color: colors.text }]} />
              </View>
              <View style={[styles.halfRow, isTablet && { width: '48%' }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Opposition Lawyer (Optional)</Text>
                <TextInput placeholder="Representing counsel" placeholderTextColor={colors.textMuted} style={[styles.input, { backgroundColor: colors.backgroundCard, borderColor: colors.primary + '30', color: colors.text }]} />
              </View>
            </View>
          </View>

          {/* Court Information */}
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <MaterialIcons name="gavel" size={22} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Court Information</Text>
            </View>
            <View style={[styles.grid, isTablet && styles.gridRow]}>
              <View style={styles.fullRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Court Name</Text>
                <View style={[styles.inputWrap, { backgroundColor: colors.backgroundCard, borderColor: colors.primary + '30' }]}>
                  <MaterialIcons name="account-balance" size={22} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput placeholder="e.g. Superior Court of California" placeholderTextColor={colors.textMuted} style={[styles.inputWithIcon, { color: colors.text }]} />
                </View>
              </View>
              <View style={[styles.halfRow, isTablet && { width: '48%' }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Courtroom Number</Text>
                <View style={[styles.inputWrap, { backgroundColor: colors.backgroundCard, borderColor: colors.primary + '30' }]}>
                  <MaterialIcons name="tag" size={22} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput placeholder="e.g. Dept. 45" placeholderTextColor={colors.textMuted} style={[styles.inputWithIcon, { color: colors.text }]} />
                </View>
              </View>
              <View style={[styles.halfRow, isTablet && { width: '48%' }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Presiding Judge(s)</Text>
                <View style={[styles.inputWrap, { backgroundColor: colors.backgroundCard, borderColor: colors.primary + '30' }]}>
                  <MaterialIcons name="person" size={22} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput placeholder="Hon. Jane Doe" placeholderTextColor={colors.textMuted} style={[styles.inputWithIcon, { color: colors.text }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Assign Team */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <View style={styles.sectionHead}>
                <MaterialIcons name="group" size={22} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Assign Team Member</Text>
              </View>
              <TouchableOpacity><Text style={[styles.linkText, { color: colors.primary }]}>Add New</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.teamScroll} contentContainerStyle={styles.teamScrollContent}>
              {TEAM_AVATARS.map((t) => (
                <View key={t.name} style={styles.avatarWrap}>
                  <View style={[styles.avatarCircle, t.isLead ? { borderColor: colors.primary, borderWidth: 2 } : t.isInvite ? { borderStyle: 'dashed', borderColor: colors.primary + '30', backgroundColor: colors.backgroundCard } : { borderColor: colors.border }]}>
                    {t.isInvite ? (
                      <MaterialIcons name="person-add" size={28} color={colors.primary + '80'} />
                    ) : (
                      <MaterialIcons name="person" size={28} color={t.isLead ? colors.primary : colors.textSecondary} />
                    )}
                  </View>
                  <Text style={[styles.avatarLabel, { color: t.isLead ? colors.primary : colors.textSecondary }]}>{t.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Initial Documents & Task */}
          <View style={styles.twoCol}>
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <MaterialIcons name="upload-file" size={22} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Initial Documents</Text>
              </View>
              <TouchableOpacity style={[styles.uploadZone, { borderColor: colors.primary + '30', backgroundColor: colors.primaryFaded }]}>
                <MaterialIcons name="cloud-upload" size={40} color={colors.primary} />
                <Text style={[styles.uploadZoneTitle, { color: colors.text }]}>Click to upload files</Text>
                <Text style={[styles.uploadZoneSub, { color: colors.textSecondary }]}>PDF, DOCX or PNG (max. 10MB)</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <MaterialIcons name="task-alt" size={22} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Initial Task</Text>
              </View>
              <TextInput
                placeholder="Assign the first immediate action..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                style={[styles.textarea, { backgroundColor: colors.backgroundCard, borderColor: colors.primary + '30', color: colors.text }]}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.background + 'e6', borderTopColor: colors.border, paddingHorizontal: horizontalPadding }]}>
        <View style={[styles.footerInner, { maxWidth: contentWidth2xl }]}>
          <TouchableOpacity style={[styles.createBtn, { backgroundColor: colors.primary }]} onPress={() => router.back()} activeOpacity={0.9}>
            <MaterialIcons name="add-circle" size={22} color="#fff" />
            <Text style={styles.createBtnText}>Create Case</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  cancelBtn: { fontSize: 14, fontWeight: '600', paddingVertical: 8, paddingHorizontal: 16 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 24 },
  maxWrap: { width: '100%', alignSelf: 'center' },
  section: { marginBottom: 32 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  linkText: { fontSize: 14, fontWeight: '500' },
  grid: { gap: 16 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  fullRow: { width: '100%', marginBottom: 4 },
  halfRow: { marginBottom: 4 },
  label: { fontSize: 14, marginBottom: 6, opacity: 0.9 },
  input: { height: 56, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 16 },
  inputWrap: { height: 56, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 16, zIndex: 1 },
  inputWithIcon: { flex: 1, paddingLeft: 48, paddingRight: 16, fontSize: 16 },
  selectWrap: { height: 56, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  selectPlaceholder: { flex: 1, fontSize: 16 },
  selectIcon: { position: 'absolute', right: 16 },
  teamScroll: { marginHorizontal: -4 },
  teamScrollContent: { flexDirection: 'row', gap: 16, paddingVertical: 8 },
  avatarWrap: { alignItems: 'center', width: 72 },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarLabel: { fontSize: 12, fontWeight: '500' },
  twoCol: { gap: 24 },
  uploadZone: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 12, padding: 24, alignItems: 'center', justifyContent: 'center' },
  uploadZoneTitle: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  uploadZoneSub: { fontSize: 12, marginTop: 4 },
  textarea: { height: 128, borderRadius: 12, borderWidth: 1, padding: 16, fontSize: 16, textAlignVertical: 'top' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingVertical: 16, borderTopWidth: 1 },
  footerInner: { width: '100%', alignSelf: 'center' },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 12, shadowColor: '#1e3b8a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
