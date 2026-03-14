// SystemSettingsScreen.js — Theme-aware via useTheme()
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Switch,
    TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/adminAPI';
import { useTheme } from '../../context/ThemeContext';

const BRAND = '#5B5FEF';

export default function SystemSettingsScreen({ navigation }) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [settings, setSettings] = useState({
        freeSessions: false,
        maxSessionsPerWeek: 3,
        defaultSessionDuration: 60,
        maintenanceMode: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        try {
            const res = await adminAPI.getSystemSettings();
            const s = res?.settings || res?.data || res || {};
            setSettings(prev => ({ ...prev, ...s }));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        setSaving(true);
        try {
            await adminAPI.updateSystemSettings(settings);
            Alert.alert('Saved', 'Settings updated successfully.');
        } catch { Alert.alert('Error', 'Could not save settings.'); }
        finally { setSaving(false); }
    };

    const SettingRow = ({ label, sub, value, onToggle }) => (
        <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
                {sub ? <Text style={[styles.settingSub, { color: theme.textMuted }]}>{sub}</Text> : null}
            </View>
            <Switch value={value} onValueChange={onToggle} thumbColor="#fff" trackColor={{ false: theme.border, true: BRAND }} />
        </View>
    );

    const InputRow = ({ label, sub, value, onChange, keyboardType }) => (
        <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 6 }}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
            {sub ? <Text style={[styles.settingSub, { color: theme.textMuted }]}>{sub}</Text> : null}
            <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.surfaceAlt }]}
                value={String(value ?? '')}
                onChangeText={onChange}
                keyboardType={keyboardType || 'default'}
                placeholderTextColor={theme.textMuted}
            />
        </View>
    );

    if (loading) return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.surfaceAlt }]}>
                    <Ionicons name="arrow-back" size={20} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>System Settings</Text>
            </View>
            <ActivityIndicator color={BRAND} style={{ marginTop: 32 }} />
        </View>
    );

    return (
        <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: theme.surfaceAlt }]}>
                    <Ionicons name="arrow-back" size={20} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>System Settings</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>FEATURE FLAGS</Text>
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                    <SettingRow label="Free Sessions" sub="Allow first session with any mentor for free" value={settings.freeSessions} onToggle={v => setSettings(p => ({ ...p, freeSessions: v }))} />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <SettingRow label="Maintenance Mode" sub="Restrict access to authenticated users only" value={settings.maintenanceMode} onToggle={v => setSettings(p => ({ ...p, maintenanceMode: v }))} />
                </View>

                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>SESSION LIMITS</Text>
                <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                    <InputRow label="Max Sessions Per Week" sub="Maximum bookings a mentee can make per week" value={settings.maxSessionsPerWeek} onChange={v => setSettings(p => ({ ...p, maxSessionsPerWeek: parseInt(v) || 0 }))} keyboardType="number-pad" />
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />
                    <InputRow label="Default Session Duration" sub="Duration in minutes (e.g. 30, 45, 60)" value={settings.defaultSessionDuration} onChange={v => setSettings(p => ({ ...p, defaultSessionDuration: parseInt(v) || 0 }))} keyboardType="number-pad" />
                </View>

                <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={save} disabled={saving}>
                    {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
    backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    body: { padding: 20, gap: 14, paddingBottom: 40 },
    sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
    card: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
    settingLabel: { fontSize: 15, fontWeight: '600' },
    settingSub: { fontSize: 12, marginTop: 2 },
    divider: { height: 1, marginHorizontal: 16 },
    input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, marginTop: 4 },
    saveBtn: { backgroundColor: BRAND, borderRadius: 26, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: BRAND, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
