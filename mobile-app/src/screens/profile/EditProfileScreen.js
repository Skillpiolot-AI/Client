// EditProfileScreen.js — Comprehensive profile editing with photo upload
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const BRAND = '#5B5FEF';

const InputField = ({ label, value, onChangeText, placeholder, multiline, keyboardType, theme }) => (
    <View style={{ marginBottom: 16 }}>
        <Text style={[iStyles.label, { color: theme.textSecondary }]}>{label}</Text>
        <TextInput
            style={[iStyles.input, { backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border, ...(multiline && { height: 90, textAlignVertical: 'top', paddingTop: 12 }) }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.textMuted}
            multiline={multiline}
            autoCapitalize="none"
            keyboardType={keyboardType || 'default'}
        />
    </View>
);

export default function EditProfileScreen({ navigation }) {
    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('Personal');

    const [form, setForm] = useState({
        firstName: '', lastName: '', bio: '',
        country: '', phoneNumber: '',
        github: '', linkedin: '', portfolio: '', twitter: '',
        skills: '',
    });
    const [avatarUri, setAvatarUri] = useState(null);

    const tabs = ['Personal', 'Social', 'Skills'];

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get('/profile/me');
                const p = res.data?.profile;
                if (p) {
                    setForm({
                        firstName: p.firstName || '',
                        lastName: p.lastName || '',
                        bio: p.bio || '',
                        country: p.country || '',
                        phoneNumber: p.phoneNumber || '',
                        github: p.socialLinks?.github || '',
                        linkedin: p.socialLinks?.linkedin || '',
                        portfolio: p.socialLinks?.portfolio || '',
                        twitter: p.socialLinks?.twitter || '',
                        skills: (p.skills || []).join(', '),
                    });
                    if (p.user?.imageUrl) setAvatarUri(p.user.imageUrl);
                }
            } catch (e) { console.log('Profile load error', e); }
        };
        loadProfile();
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission required', 'Please allow photo library access'); return; }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('photo', { uri, type: 'image/jpeg', name: 'profile.jpg' });
                const res = await api.post('/profile/photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                setAvatarUri(res.data.imageUrl);
                Alert.alert('✅ Photo updated!');
            } catch (e) { Alert.alert('Failed to upload photo'); }
            finally { setUploading(false); }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/profile/personal', {
                firstName: form.firstName, lastName: form.lastName,
                bio: form.bio, country: form.country, phoneNumber: form.phoneNumber,
            });
            await api.put('/profile/social-links', {
                github: form.github, linkedin: form.linkedin,
                portfolio: form.portfolio, twitter: form.twitter,
            });
            await api.put('/profile/skills', {
                skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
            });
            if (user) updateUser({ name: `${form.firstName} ${form.lastName}` });
            Alert.alert('✅ Profile Saved!', 'Your profile has been updated.');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        } finally { setSaving(false); }
    };

    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
    const F = (p) => <InputField theme={theme} {...p} onChangeText={(v) => set(p.key, v)} value={form[p.key]} />;

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={22} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                    disabled={saving}
                >
                    {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                        ) : (
                            <View style={[styles.avatarPlaceholder, { backgroundColor: '#EEF2FF' }]}>
                                <Text style={styles.avatarInitial}>{(user?.name || 'U')[0].toUpperCase()}</Text>
                            </View>
                        )}
                        {uploading ? (
                            <View style={styles.uploadingOverlay}>
                                <ActivityIndicator color="#fff" />
                            </View>
                        ) : (
                            <View style={styles.cameraBtn}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                    <Text style={[styles.avatarHint, { color: theme.textMuted }]}>Tap to change photo</Text>
                </View>

                {/* Tabs */}
                <View style={[styles.tabsRow, { borderBottomColor: theme.border }]}>
                    {tabs.map(tab => (
                        <TouchableOpacity key={tab} style={styles.tabBtn} onPress={() => setActiveTab(tab)}>
                            <Text style={[styles.tabText, { color: activeTab === tab ? BRAND : theme.textMuted }]}>{tab}</Text>
                            {activeTab === tab && <View style={styles.tabUnderline} />}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.formContent}>
                    {activeTab === 'Personal' && (
                        <>
                            <F key="firstName" label="First Name" placeholder="John" keyField="firstName" />
                            <F key="lastName" label="Last Name" placeholder="Doe" keyField="lastName" />
                            <F key="bio" label="Bio" placeholder="Tell us about yourself..." multiline keyField="bio" />
                            <F key="country" label="Country" placeholder="India" keyField="country" />
                            <F key="phoneNumber" label="Phone Number" placeholder="+91 9876543210" keyboardType="phone-pad" keyField="phoneNumber" />
                        </>
                    )}
                    {activeTab === 'Social' && (
                        <>
                            <F key="github" label="GitHub" placeholder="https://github.com/username" keyField="github" />
                            <F key="linkedin" label="LinkedIn" placeholder="https://linkedin.com/in/username" keyField="linkedin" />
                            <F key="portfolio" label="Portfolio" placeholder="https://yourportfolio.com" keyField="portfolio" />
                            <F key="twitter" label="Twitter / X" placeholder="https://twitter.com/username" keyField="twitter" />
                        </>
                    )}
                    {activeTab === 'Skills' && (
                        <>
                            <Text style={[iStyles.label, { color: theme.textSecondary, marginBottom: 8 }]}>
                                Skills (comma-separated)
                            </Text>
                            <TextInput
                                style={[iStyles.input, { backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border, height: 100, textAlignVertical: 'top', paddingTop: 12 }]}
                                value={form.skills}
                                onChangeText={(v) => set('skills', v)}
                                placeholder="e.g. React Native, Python, Machine Learning"
                                placeholderTextColor={theme.textMuted}
                                multiline
                            />
                            {form.skills.length > 0 && (
                                <View style={styles.skillChips}>
                                    {form.skills.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                                        <View key={i} style={[styles.chip, { backgroundColor: '#EEF2FF' }]}>
                                            <Text style={{ fontSize: 12, color: BRAND, fontWeight: '600' }}>{s}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

const iStyles = StyleSheet.create({
    label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
    input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 48, fontSize: 14 },
});

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '700' },
    saveBtn: { backgroundColor: BRAND, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, minWidth: 60, alignItems: 'center' },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    avatarSection: { alignItems: 'center', paddingVertical: 24 },
    avatarWrap: { position: 'relative', width: 96, height: 96 },
    avatarImg: { width: 96, height: 96, borderRadius: 48 },
    avatarPlaceholder: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
    avatarInitial: { fontSize: 36, fontWeight: '800', color: BRAND },
    uploadingOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 48, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
    avatarHint: { fontSize: 12, marginTop: 8 },
    tabsRow: { flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: 16 },
    tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 },
    tabText: { fontSize: 14, fontWeight: '600' },
    tabUnderline: { position: 'absolute', bottom: -1, left: '20%', right: '20%', height: 2, backgroundColor: BRAND, borderRadius: 1 },
    formContent: { padding: 20 },
    skillChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 30 },
});
