import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Button } from '@/components/ui/Button';
import type { AdvocateUser } from '@/lib/api';
import { getMe, logout, updateMe } from '@/lib/api';
import { useResponsive } from '@/hooks/use-responsive';

type Preferences = {
  notificationsEnabled: boolean;
  caseUpdatesPush: boolean;
  marketingEmails: boolean;
  teamSharingEnabled: boolean;
  showOnlineStatus: boolean;
};

const PREFS_KEY = 'advocate_profile_prefs_v1';
const AVATAR_KEY = 'advocate_profile_avatar_uri_v1';

const DEFAULT_PREFS: Preferences = {
  notificationsEnabled: true,
  caseUpdatesPush: true,
  marketingEmails: false,
  teamSharingEnabled: true,
  showOnlineStatus: true,
};

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { contentWidthMd } = useResponsive();
  const [user, setUser] = useState<AdvocateUser | null>(null);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [me, stored] = await Promise.all([
          getMe().catch(() => null),
          AsyncStorage.getItem(PREFS_KEY),
          AsyncStorage.getItem(AVATAR_KEY),
        ]);
        if (!mounted) return;
        if (me) {
          setUser(me);
          setFullName(me.fullName || '');
          setPhone(me.phone || '');
          setCity(me.city || '');
          setState(me.state || '');
        }
        const [, prefsRaw, avatarRaw] = [me, stored, await AsyncStorage.getItem(AVATAR_KEY)];
        if (prefsRaw) {
          try {
            const parsed = JSON.parse(prefsRaw);
            setPrefs({ ...DEFAULT_PREFS, ...parsed });
          } catch {
            setPrefs(DEFAULT_PREFS);
          }
        }
        if (avatarRaw) {
          setAvatarUri(avatarRaw);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function onSaveProfile() {
    if (!user) return;
    setError(null);
    setSaving(true);
    try {
      const updated = await updateMe({
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim() || null,
        state: state.trim() || null,
      });
      setUser(updated);
      setIsEditingProfile(false);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  async function onSavePrefs(next: Preferences) {
    setPrefs(next);
    try {
      await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  async function onLogout() {
    await logout();
    router.replace('/(auth)/welcome');
  }

  const statusLabel =
    user?.profileStatus === 'APPROVED'
      ? 'Verified advocate'
      : user?.profileStatus === 'PENDING'
        ? 'Awaiting verification'
        : 'Profile not verified';

  async function handleChangeAvatar(source: 'camera' | 'library') {
    try {
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Camera permission is needed to take a photo.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0]?.uri) {
          const uri = result.assets[0].uri;
          setAvatarUri(uri);
          await AsyncStorage.setItem(AVATAR_KEY, uri);
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Photo library permission is needed to pick an image.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        if (!result.canceled && result.assets?.[0]?.uri) {
          const uri = result.assets[0].uri;
          setAvatarUri(uri);
          await AsyncStorage.setItem(AVATAR_KEY, uri);
        }
      }
    } catch {
      Alert.alert('Image error', 'Could not update profile photo. Please try again.');
    }
  }

  function onPressChangePhoto() {
    Alert.alert('Profile photo', 'Update your profile picture', [
      { text: 'Take photo', onPress: () => handleChangeAvatar('camera') },
      { text: 'Choose from gallery', onPress: () => handleChangeAvatar('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <ScreenContainer scroll   backgroundVariant="alt">
      <View style={[styles.content, { width: contentWidthMd }]}>
        <View style={styles.hero}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryFaded }]}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <MaterialIcons name="person" size={48} color={colors.primary} />
          )}
          <TouchableOpacity style={styles.avatarCamera} onPress={onPressChangePhoto}>
            <MaterialIcons name="photo-camera" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {user?.fullName || 'Your name'}
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
          {user?.profileStatus === 'APPROVED' ? 'Advocate' : 'Advocate (pending verification)'}
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.primaryFaded }]}>
          <MaterialIcons
            name={user?.profileStatus === 'APPROVED' ? 'verified-user' : 'schedule'}
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.badgeText, { color: colors.primary }]}>{statusLabel}</Text>
        </View>
        </View>

      {error ? (
        <View style={[styles.errorBox, { borderColor: colors.error, backgroundColor: colors.errorBg }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      ) : null}

      {/* Profile details / edit */}
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.backgroundCard }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Contact details</Text>
          <TouchableOpacity onPress={() => setIsEditingProfile((prev) => !prev)}>
            <Text style={[styles.editLink, { color: colors.primary }]}>
              {isEditingProfile ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>
        {isEditingProfile ? (
          <>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Full name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
                placeholderTextColor={colors.textMuted}
                style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
              />
            </View>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Mobile</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+91..."
                keyboardType="phone-pad"
                placeholderTextColor={colors.textMuted}
                style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
              />
            </View>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor={colors.textMuted}
                style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
              />
            </View>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>State</Text>
              <TextInput
                value={state}
                onChangeText={setState}
                placeholder="State"
                placeholderTextColor={colors.textMuted}
                style={[styles.fieldInput, { color: colors.text, borderColor: colors.border }]}
              />
            </View>
            <View style={{ marginTop: 12 }}>
              <Button
                title={saving ? 'Saving…' : 'Save changes'}
                onPress={onSaveProfile}
                fullWidth
                disabled={saving || !fullName.trim()}
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <MaterialIcons name="mail" size={18} color={colors.icon} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email address</Text>
                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                  {user?.email || 'Not set'}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="phone-android" size={18} color={colors.icon} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone number</Text>
                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
                  {user?.phone || phone || 'Not set'}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="place" size={18} color={colors.icon} />
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Office location</Text>
                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>
                  {city || state
                    ? `${city || ''}${city && state ? ', ' : ''}${state || ''}`
                    : 'Add your city and state'}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Team & app settings */}
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Team & app settings</Text>
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <MaterialIcons name="group" size={20} color={colors.icon} />
            <View>
              <Text style={[styles.rowTitle, { color: colors.text }]}>Team members</Text>
              <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                Manage assistants & shared access (coming soon)
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <MaterialIcons name="tune" size={20} color={colors.icon} />
            <View>
              <Text style={[styles.rowTitle, { color: colors.text }]}>App settings</Text>
              <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                Appearance, language & defaults
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Notifications */}
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Notifications</Text>
        <View style={styles.switchRow}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Enable notifications</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Push & email alerts for important updates
            </Text>
          </View>
          <Switch
            value={prefs.notificationsEnabled}
            onValueChange={(value) => onSavePrefs({ ...prefs, notificationsEnabled: value })}
          />
        </View>
        <View style={styles.switchRow}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Case updates</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Hearing reminders & task updates
            </Text>
          </View>
          <Switch
            value={prefs.caseUpdatesPush}
            onValueChange={(value) => onSavePrefs({ ...prefs, caseUpdatesPush: value })}
          />
        </View>
        <View style={styles.switchRow}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Product emails</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Occasional tips & feature announcements
            </Text>
          </View>
          <Switch
            value={prefs.marketingEmails}
            onValueChange={(value) => onSavePrefs({ ...prefs, marketingEmails: value })}
          />
        </View>
      </View>

      {/* Privacy & security */}
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.backgroundCard }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Privacy & security</Text>
        <View style={styles.switchRow}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Share with team</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Allow trusted team members to view shared cases
            </Text>
          </View>
          <Switch
            value={prefs.teamSharingEnabled}
            onValueChange={(value) => onSavePrefs({ ...prefs, teamSharingEnabled: value })}
          />
        </View>
        <View style={styles.switchRow}>
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Show online status</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              Let colleagues know when you’re active
            </Text>
          </View>
          <Switch
            value={prefs.showOnlineStatus}
            onValueChange={(value) => onSavePrefs({ ...prefs, showOnlineStatus: value })}
          />
        </View>
      </View>

      <View style={{ marginTop: 12, marginBottom: 16 }}>
        <Button title="Log out" variant="outline" onPress={onLogout} fullWidth />
      </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  avatarCamera: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  name: { fontSize: 22, fontWeight: '700', marginBottom: 2 },
  email: { fontSize: 14, marginBottom: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  editLink: { fontSize: 13, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '600' },
  rowSubtitle: { fontSize: 12, marginTop: 2 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
  },
  fieldRow: { marginBottom: 10 },
  fieldLabel: { fontSize: 12, marginBottom: 4 },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  errorText: { fontSize: 13, fontWeight: '600' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '500' },
});
