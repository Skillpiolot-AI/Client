// screens/admin/SystemSettingsScreen.js — Phase 5
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Switch,
    TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/adminAPI';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';

const SettingRow = ({ label, sub, value, onToggle }) => (
    <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{label}</Text>
            {sub ? <Text style={styles.settingSub}>{sub}</Text> : null}
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            thumbColor={value ? colors.white : colors.surfaceAlt}
            trackColor={{ false: colors.border, true: colors.primary }}
        />
    </View>
);

const InputRow = ({ label, sub, value, onChange, keyboardType }) => (
    <View style={styles.inputRow}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sub ? <Text style={styles.settingSub}>{sub}</Text> : null}
        <TextInput
            style={styles.input}
            value={String(value ?? '')}
            onChangeText={onChange}
            keyboardType={keyboardType || 'default'}
            placeholderTextColor={colors.textMuted}
        />
    </View>
);

const SystemSettingsScreen = ({ navigation }) => {
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
            setSettings((prev) => ({ ...prev, ...s }));
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        setSaving(true);
        try {
            await adminAPI.updateSystemSettings(settings);
            Alert.alert('Saved', 'Settings updated successfully.');
        } catch {
            Alert.alert('Error', 'Could not save settings. Please try again.');
        } finally { setSaving(false); }
    };

    if (loading) return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>System Settings</Text>
            </View>
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        </SafeAreaView>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>System Settings</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
                {/* Toggles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Feature Flags</Text>
                    <View style={styles.settingCard}>
                        <SettingRow
                            label="Free Sessions"
                            sub="Allow first session with any mentor for free"
                            value={settings.freeSessions}
                            onToggle={(v) => setSettings((p) => ({ ...p, freeSessions: v }))}
                        />
                        <View style={styles.divider} />
                        <SettingRow
                            label="Maintenance Mode"
                            sub="Restrict access to all authenticated users"
                            value={settings.maintenanceMode}
                            onToggle={(v) => setSettings((p) => ({ ...p, maintenanceMode: v }))}
                        />
                    </View>
                </View>

                {/* Inputs */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Session Limits</Text>
                    <View style={styles.settingCard}>
                        <InputRow
                            label="Max Sessions Per Week"
                            sub="Maximum bookings a mentee can make per week"
                            value={settings.maxSessionsPerWeek}
                            onChange={(v) => setSettings((p) => ({ ...p, maxSessionsPerWeek: parseInt(v) || 0 }))}
                            keyboardType="number-pad"
                        />
                        <View style={styles.divider} />
                        <InputRow
                            label="Default Session Duration"
                            sub="Duration in minutes (e.g. 30, 45, 60)"
                            value={settings.defaultSessionDuration}
                            onChange={(v) => setSettings((p) => ({ ...p, defaultSessionDuration: parseInt(v) || 0 }))}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
                    {saving
                        ? <ActivityIndicator color={colors.white} />
                        : <Text style={styles.saveBtnText}>Save Changes</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
    backBtn: { width: 40, height: 40, borderRadius: borderRadius.lg, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
    headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
    body: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxxl || 60 },
    section: { gap: spacing.sm },
    sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
    settingCard: { backgroundColor: colors.card, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden', ...shadows.xs },
    settingRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
    settingInfo: { flex: 1 },
    settingLabel: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
    settingSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
    divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
    inputRow: { padding: spacing.md, gap: spacing.xs },
    input: { borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.md, color: colors.text, marginTop: spacing.xs },
    saveBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.xl, height: 52, alignItems: 'center', justifyContent: 'center' },
    saveBtnText: { color: colors.white, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
});

export default SystemSettingsScreen;
