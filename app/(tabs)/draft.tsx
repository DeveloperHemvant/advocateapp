import React, { useMemo, useState, useEffect } from 'react';
import { 
  Alert, View, Text, StyleSheet, TouchableOpacity, TextInput, 
  Modal, ScrollView, ActivityIndicator, FlatList 
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/use-responsive';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { generateAiDraft } from '@/lib/ai';
import { apiFetch } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
type DraftDocument = {
  id: string;
  documentType: string;
  title?: string | null;
  content: string;
  courtName?: string;
  clientName?: string;
  section?: string;
  facts?: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'approved' | 'archived';
};

type HistoryItem = {
  id: string;
  documentType: string;
  title?: string | null;
  approvedAt: string;
};

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

const STORAGE_KEY = '@legal_drafts';

export default function DraftScreen() {
  const { colors, spacing, radius } = useTheme();
  const { horizontalPadding, contentWidthMd, isTablet, fontScale } = useResponsive();
  const isDark = colors.background === '#121620' || colors.backgroundCard === '#0F172A';

  // State
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [courtName, setCourtName] = useState('');
  const [clientName, setClientName] = useState('');
  const [section, setSection] = useState('');
  const [facts, setFacts] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [drafts, setDrafts] = useState<DraftDocument[]>([]);
  const [selectedDraft, setSelectedDraft] = useState<DraftDocument | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [lastRequestAt, setLastRequestAt] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState<DraftDocument | null>(null);

  const containerMaxWidth = contentWidthMd;
  const sectionPadding = horizontalPadding;

  const docTypeOptions = useMemo(
    () => [
      { id: 'bail_application', label: 'Bail application' },
      { id: 'petition', label: 'Petition' },
      { id: 'legal_notice', label: 'Legal notice' },
      { id: 'affidavit', label: 'Affidavit' },
      { id: 'agreement', label: 'Agreement' },
      { id: 'written_statement', label: 'Written statement' },
    ],
    [],
  );

  // Load drafts from storage on mount
  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDrafts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const saveDrafts = async (newDrafts: DraftDocument[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDrafts));
      setDrafts(newDrafts);
    } catch (error) {
      console.error('Failed to save drafts:', error);
    }
  };

  const generateDraftId = () => `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleDocumentSelect = (type: string) => {
    setDocumentType(type);
    setEditingDraft(null);
    setCourtName('');
    setClientName('');
    setSection('');
    setFacts('');
    setDraft('');
    setError(null);
    setShowModal(true);
  };

  async function onGenerate() {
    if (!documentType) {
      Alert.alert('Select document type', 'Choose a document type before generating a draft.');
      return;
    }
    if (!facts.trim()) {
      Alert.alert('Add case facts', 'Please add case facts / instructions.');
      return;
    }
    
    setError(null);
    setDraft('');
    setLoading(true);
    setLastRequestAt(Date.now());
    
    try {
      const resp = await generateAiDraft({
        document_type: documentType,
        court_name: courtName || undefined,
        client_name: clientName || undefined,
        section: section || undefined,
        case_facts: facts,
      });
      
      const gotDraft = String(resp?.draft || '');
      if (!gotDraft.trim()) {
        const validationErrors = (resp as any)?.validation?.errors;
        const msg =
          Array.isArray(validationErrors) && validationErrors.length
            ? String(validationErrors.join('\n'))
            : 'No draft returned. Check AI service connectivity.';
        setError(msg);
        Alert.alert('No draft generated', msg);
        setDraft('');
        return;
      }
      
      setDraft(gotDraft);
      
      // Save to local storage
      const newDraft: DraftDocument = {
        id: generateDraftId(),
        documentType: documentType,
        title: `${docTypeOptions.find(opt => opt.id === documentType)?.label || documentType} - ${new Date().toLocaleDateString()}`,
        content: gotDraft,
        courtName: courtName || undefined,
        clientName: clientName || undefined,
        section: section || undefined,
        facts: facts,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
      };
      
      const updatedDrafts = [newDraft, ...drafts];
      await saveDrafts(updatedDrafts);
      
      // Add to recent activity
      const activityItem: HistoryItem = {
        id: newDraft.id,
        documentType: documentType,
        title: newDraft.title,
        approvedAt: new Date().toISOString(),
      };
      setHistoryItems(prev => [activityItem, ...prev].slice(0, 10));
      
    } catch (e: any) {
      const msg = e?.message ?? 'Failed to generate draft';
      setError(msg);
      Alert.alert('Draft generation failed', msg);
    } finally {
      setLoading(false);
    }
  }

  function buildDraftHtml(content: string, metadata: any) {
    const safeText = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            @page { size: A4; margin: 2.5cm; }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #111827;
            }
            h1 {
              text-align: center;
              font-size: 16pt;
              margin-bottom: 16px;
              text-transform: uppercase;
            }
            .meta {
              font-size: 10pt;
              color: #4b5563;
              margin-bottom: 16px;
              padding: 8px;
              background: #f3f4f6;
              border-radius: 4px;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              font-family: "Times New Roman", serif;
              font-size: 12pt;
              margin: 0;
              padding: 16px;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <h1>Legal Draft</h1>
          <div class="meta">
            <strong>Document type:</strong> ${metadata.documentType || '-'}<br/>
            <strong>Court:</strong> ${metadata.courtName || '-'}<br/>
            <strong>Client:</strong> ${metadata.clientName || '-'}<br/>
            <strong>Section:</strong> ${metadata.section || '-'}<br/>
            <strong>Generated:</strong> ${new Date().toLocaleString()}
          </div>
          <pre>${safeText}</pre>
        </body>
      </html>
    `;
  }

  async function onDownloadPdf(draftDoc?: DraftDocument) {
    const content = draftDoc?.content || draft;
    if (!content?.trim()) {
      Alert.alert('Nothing to export', 'Generate and edit your draft before downloading.');
      return;
    }

    try {
      const metadata = draftDoc || {
        documentType,
        courtName,
        clientName,
        section,
      };
      
      const html = buildDraftHtml(content, metadata);
      
      // Generate PDF file
      const { uri } = await Print.printToFileAsync({ html });
      
      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save or Share PDF',
          UTI: 'com.adobe.pdf',
        });
      } else {
        // Fallback to printing
        await Print.printAsync({ html });
      }
    } catch (e: any) {
      Alert.alert('PDF error', e?.message ?? 'Failed to generate PDF');
    }
  }

  const handleEditDraft = (draft: DraftDocument) => {
    setEditingDraft(draft);
    setDocumentType(draft.documentType);
    setCourtName(draft.courtName || '');
    setClientName(draft.clientName || '');
    setSection(draft.section || '');
    setFacts(draft.facts || '');
    setDraft(draft.content);
    setShowModal(true);
  };

  const handleUpdateDraft = async () => {
    if (!editingDraft) return;
    
    const updatedDraft: DraftDocument = {
      ...editingDraft,
      content: draft,
      courtName: courtName || undefined,
      clientName: clientName || undefined,
      section: section || undefined,
      facts: facts,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedDrafts = drafts.map(d => 
      d.id === editingDraft.id ? updatedDraft : d
    );
    
    await saveDrafts(updatedDrafts);
    setShowModal(false);
    setEditingDraft(null);
    Alert.alert('Success', 'Draft updated successfully');
  };

  const handleDeleteDraft = (draftId: string) => {
    Alert.alert(
      'Delete Draft',
      'Are you sure you want to delete this draft?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedDrafts = drafts.filter(d => d.id !== draftId);
            await saveDrafts(updatedDrafts);
            setHistoryItems(prev => prev.filter(h => h.id !== draftId));
          }
        }
      ]
    );
  };

  async function loadHistory() {
    try {
      setHistoryLoading(true);
      // Convert saved drafts to history items
      const historyFromDrafts = drafts
        .filter(d => d.status === 'approved')
        .map(d => ({
          id: d.id,
          documentType: d.documentType,
          title: d.title,
          approvedAt: d.updatedAt,
        }));
      setHistoryItems(historyFromDrafts);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setHistoryLoading(false);
    }
  }

  const renderDraftModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setShowModal(false);
        setEditingDraft(null);
      }}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { 
          backgroundColor: colors.backgroundCard,
          width: isTablet ? '80%' : '95%',
          maxWidth: 800,
        }]}>
          <View style={[styles.modalHeader, { 
            borderBottomColor: colors.border,
            paddingHorizontal: sectionPadding,
          }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingDraft ? 'Edit Draft' : 'Generate New Draft'}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                setShowModal(false);
                setEditingDraft(null);
              }}
              hitSlop={12}
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: sectionPadding, paddingBottom: 40 }}
          >
            <View style={{ marginTop: spacing.lg }}>
              <View style={{ marginBottom: spacing.md }}>
                <Text style={{ color: colors.textSecondary, fontWeight: '700', marginBottom: 6 }}>
                  Document type
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {docTypeOptions.map((opt) => {
                    const active = opt.id === documentType;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        onPress={() => setDocumentType(opt.id)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: active ? colors.primary : colors.border,
                          backgroundColor: active ? colors.primaryFaded : colors.backgroundCard,
                        }}
                      >
                        <Text
                          style={{
                            color: active ? colors.primary : colors.text,
                            fontWeight: '700',
                            fontSize: 12,
                          }}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <Input label="Court name (optional)" value={courtName} onChangeText={setCourtName} />
              <Input label="Client name (optional)" value={clientName} onChangeText={setClientName} />
              <Input label="Section (optional)" value={section} onChangeText={setSection} />
              <Input
                label="Case facts / instructions"
                value={facts}
                onChangeText={setFacts}
                multiline
                style={{ minHeight: 100, textAlignVertical: 'top' as any }}
              />

              {error ? (
                <View style={{ marginBottom: spacing.md }}>
                  <Text style={{ color: colors.error, fontWeight: '700' }}>{error}</Text>
                </View>
              ) : null}

              {loading && (
                <View style={{ marginBottom: spacing.sm }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    Draft is in queue. Please wait a few seconds while we prepare your document
                    {lastRequestAt ? ` • started at ${new Date(lastRequestAt).toLocaleTimeString()}` : ''}.
                  </Text>
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 8, marginTop: spacing.sm }}>
                <Button
                  title={loading ? 'Generating…' : editingDraft ? 'Update Draft' : 'Generate draft'}
                  onPress={editingDraft ? handleUpdateDraft : onGenerate}
                  loading={loading}
                  disabled={loading}
                  fullWidth
                />
              </View>

              {draft ? (
                <View
                  style={{
                    marginTop: spacing.lg,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: radius.lg,
                    backgroundColor: colors.backgroundCard,
                    padding: spacing.lg,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: spacing.sm,
                    }}
                  >
                    <Text style={{ fontWeight: '700', color: colors.text }}>Generated draft</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => onDownloadPdf()}
                        style={[styles.iconButton, { backgroundColor: colors.primaryFaded }]}
                      >
                        <MaterialIcons name="picture-as-pdf" size={20} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          // Copy to clipboard
                        }}
                        style={[styles.iconButton, { backgroundColor: colors.inputBg }]}
                      >
                        <MaterialIcons name="content-copy" size={20} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    multiline
                    style={{
                      minHeight: 200,
                      maxHeight: 400,
                      textAlignVertical: 'top',
                      color: colors.text,
                      fontSize: 14,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: radius.md,
                      padding: spacing.md,
                      backgroundColor: colors.inputBg,
                    }}
                  />
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { 
            borderTopColor: colors.border,
            paddingHorizontal: sectionPadding,
          }]}>
            <Button
              title="Close"
              variant="outline"
              onPress={() => {
                setShowModal(false);
                setEditingDraft(null);
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderDraftViewModal = () => (
    <Modal
      visible={showDraftModal && selectedDraft !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setShowDraftModal(false);
        setSelectedDraft(null);
      }}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { 
          backgroundColor: colors.backgroundCard,
          width: isTablet ? '80%' : '95%',
          maxWidth: 800,
        }]}>
          <View style={[styles.modalHeader, { 
            borderBottomColor: colors.border,
            paddingHorizontal: sectionPadding,
          }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedDraft?.title || 'Draft Preview'}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                {selectedDraft && new Date(selectedDraft.createdAt).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => {
                setShowDraftModal(false);
                setSelectedDraft(null);
              }}
              hitSlop={12}
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: sectionPadding }}
          >
            {selectedDraft && (
              <View>
                <View style={[styles.metadataCard, { backgroundColor: colors.inputBg, marginBottom: spacing.lg }]}>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 8 }}>
                    <Text style={{ fontWeight: '700' }}>Document Type:</Text> {selectedDraft.documentType}
                  </Text>
                  {selectedDraft.courtName && (
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>
                      <Text style={{ fontWeight: '700' }}>Court:</Text> {selectedDraft.courtName}
                    </Text>
                  )}
                  {selectedDraft.clientName && (
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>
                      <Text style={{ fontWeight: '700' }}>Client:</Text> {selectedDraft.clientName}
                    </Text>
                  )}
                  {selectedDraft.section && (
                    <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 4 }}>
                      <Text style={{ fontWeight: '700' }}>Section:</Text> {selectedDraft.section}
                    </Text>
                  )}
                </View>

                <Text style={[styles.draftContent, { 
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.inputBg,
                }]}>
                  {selectedDraft.content}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={[styles.modalFooter, { 
            borderTopColor: colors.border,
            paddingHorizontal: sectionPadding,
            gap: 8,
          }]}>
            <Button
              title="Edit"
              onPress={() => {
                setShowDraftModal(false);
                handleEditDraft(selectedDraft!);
              }}
              variant="outline"
              style={{ flex: 1 }}
            />
            <Button
              title="Download PDF"
              onPress={() => {
                setShowDraftModal(false);
                onDownloadPdf(selectedDraft!);
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.outer, { backgroundColor: colors.backgroundAlt }]}>
      <ScreenContainer scroll centered={false} padding maxWidth="full" backgroundVariant="alt">
        <View style={[styles.container, { 
          maxWidth: containerMaxWidth, 
          alignSelf: 'center', 
          width: '100%', 
          backgroundColor: colors.backgroundCard,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8 
        }]}>
          {/* Header */}
          <View style={[styles.header, { 
            backgroundColor: colors.backgroundCard, 
            borderBottomColor: colors.border, 
            paddingHorizontal: sectionPadding, 
            paddingVertical: spacing.lg 
          }]}>
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
            {/* My Drafts Section */}
            {drafts.length > 0 && (
              <View style={[styles.section, { paddingHorizontal: sectionPadding, paddingTop: spacing.lg }]}>
                <View style={styles.sectionHead}>
                  <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontScale(18) }]}>My Drafts</Text>
                  <TouchableOpacity onPress={loadDrafts}>
                    <MaterialIcons name="refresh" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={drafts.slice(0, 3)}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: spacing.md, paddingVertical: 4 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.draftCard, { 
                        backgroundColor: colors.inputBg,
                        borderColor: colors.border,
                        width: 200 
                      }]}
                      onPress={() => {
                        setSelectedDraft(item);
                        setShowDraftModal(true);
                      }}
                    >
                      <View style={styles.draftCardHeader}>
                        <MaterialIcons 
                          name="description" 
                          size={20} 
                          color={colors.primary} 
                        />
                        <TouchableOpacity
                          onPress={() => handleDeleteDraft(item.id)}
                          hitSlop={8}
                        >
                          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.draftCardTitle, { color: colors.text }]} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={[styles.draftCardDate, { color: colors.textSecondary }]}>
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

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
                    <TouchableOpacity 
                      style={[styles.startDraftBtn, { backgroundColor: colors.primary }]} 
                      activeOpacity={0.85}
                      onPress={() => handleDocumentSelect('written_statement')}
                    >
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
                  const mappedType =
                    d.id === 'petition'
                      ? 'petition'
                      : d.id === 'notice'
                      ? 'legal_notice'
                      : d.id === 'agreement'
                      ? 'agreement'
                      : 'written_statement';
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
                      onPress={() => handleDocumentSelect(mappedType)}
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
                <TouchableOpacity onPress={loadHistory}>
                  <Text style={[styles.viewAllLink, { color: colors.primary }]}>Refresh</Text>
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

              {/* Your saved drafts */}
              <View style={{ marginTop: spacing.lg }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text style={{ fontWeight: '700', color: colors.text }}>Your saved drafts</Text>
                  <TouchableOpacity onPress={loadHistory}>
                    <Text style={{ color: colors.primary, fontSize: 12 }}>
                      {historyLoading ? 'Loading…' : 'Refresh'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {historyItems.length > 0 ? (
                  historyItems.slice(0, 5).map((h) => (
                    <TouchableOpacity
                      key={h.id}
                      style={[styles.historyItem, { borderBottomColor: colors.border }]}
                      onPress={() => {
                        const draft = drafts.find(d => d.id === h.id);
                        if (draft) {
                          setSelectedDraft(draft);
                          setShowDraftModal(true);
                        }
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                          {h.title || h.documentType}
                        </Text>
                        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                          {new Date(h.approvedAt).toLocaleString()}
                        </Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ fontSize: 11, color: colors.textSecondary, textAlign: 'center', paddingVertical: 20 }}>
                    No saved drafts yet. Generate your first draft!
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScreenContainer>

      {/* Modals */}
      {renderDraftModal()}
      {renderDraftViewModal()}
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
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Draft card styles
  draftCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  draftCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  draftCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  draftCardDate: {
    fontSize: 11,
  },
  metadataCard: {
    padding: 12,
    borderRadius: 8,
  },
  draftContent: {
    fontSize: 14,
    lineHeight: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
});