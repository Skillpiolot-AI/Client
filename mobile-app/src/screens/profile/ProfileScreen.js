// Profile/Settings Screen — Centralized-theme refactor
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Switch, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Button, Input, ThemePicker } from '../../components/ui';
import { colors, fontSize, fontWeight, spacing, borderRadius, shadows } from '../../theme';
import authAPI from '../../services/authAPI';

const ProfileScreen = ({ navigation }) => {
    const { user, logout, updateUser } = useAuth();
    const insets = useSafeAreaInsets();
    const [view, setView] = useState('settings'); // 'settings' | 'edit'
    const [loading, setLoading] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [formData, setFormData] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const handleSave = async () => {
        setLoading(true);
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const result = await updateUser({ ...formData, name: fullName });
        if (result.success) {
            setView('settings');
            Alert.alert('Success', 'Profile updated successfully');
        } else {
            Alert.alert('Error', result.error);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: logout, style: 'destructive' },
        ]);
    };

    const handleChangePassword = () => {
        Alert.alert(
            'Change Password',
            'We will send a verification code to your email. Proceed?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send Code',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await authAPI.forgotPassword(user.email);
                            navigation.navigate('OtpVerification', {
                                email: user.email,
                                fromProfile: true,
                            });
                        } catch (err) {
                            const data = err.response?.data;
                            const msg = data?.message || data?.error || err.message || 'Failed to send code';
                            Alert.alert('Error', msg);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    // ── Edit Profile View ─────────────────────────
    if (view === 'edit') {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.editHeader}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => setView('settings')}
                        activeOpacity={0.75}
                    >
                        <Ionicons name="chevron-back" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.editHeaderTitle}>Edit Profile</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.editScrollContent}>
                    {/* Avatar */}
                    <View style={styles.editAvatarWrap}>
                        <Avatar source={user?.profileImage} name={user?.name} size="xxxl" />
                        <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8}>
                            <Ionicons name="camera-outline" size={15} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>
                        <Input
                            label="First Name"
                            value={formData.firstName}
                            onChangeText={(v) => setFormData({ ...formData, firstName: v })}
                            placeholder="John"
                            icon="person-outline"
                        />
                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChangeText={(v) => setFormData({ ...formData, lastName: v })}
                            placeholder="Doe"
                            icon="person-outline"
                        />
                        <Input
                            label="Email"
                            value={formData.email}
                            onChangeText={(v) => setFormData({ ...formData, email: v })}
                            keyboardType="email-address"
                            placeholder="john@example.com"
                            icon="mail-outline"
                            autoCapitalize="none"
                        />
                        <Input
                            label="Phone"
                            value={formData.phone}
                            onChangeText={(v) => setFormData({ ...formData, phone: v })}
                            keyboardType="phone-pad"
                            placeholder="+91 9876543210"
                            icon="call-outline"
                        />
                    </View>

                    <Button
                        title="Save Changes"
                        variant="primary"
                        onPress={handleSave}
                        loading={loading}
                        size="lg"
                        style={styles.saveBtn}
                    />
                </ScrollView>
            </View>
        );
    }

    // ── Settings View ─────────────────────────────
    const menuItems = [
        {
            icon: 'person-circle-outline',
            label: 'User Profile',
            onPress: () => setView('edit'),
            show: true,
        },
        {
            icon: 'briefcase-outline',
            label: 'Mentor Settings',
            onPress: () => navigation.navigate('EditMentorProfile'),
            show: user?.role === 'Mentor',
        },
        {
            icon: 'lock-closed-outline',
            label: 'Change Password',
            onPress: handleChangePassword,
            show: true,
        },
        {
            icon: 'help-circle-outline',
            label: 'FAQs',
            onPress: () => {},
            show: true,
        },
    ].filter((item) => item.show);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.pageTitle}>Settings</Text>

                {/* User card */}
                <View style={styles.userCard}>
                    <Avatar source={user?.profileImage} name={user?.name} size="lg" />
                    <View style={styles.userInfo}>
                        <Text style={styles.welcomeLabel}>Welcome back</Text>
                        <Text style={styles.userName} numberOfLines={1}>
                            {user?.name || user?.email?.split('@')[0]}
                        </Text>
                        {user?.role && (
                            <View style={styles.rolePill}>
                                <Text style={styles.roleText}>{user.role}</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.75}>
                        <Ionicons name="log-out-outline" size={22} color={colors.error} />
                    </TouchableOpacity>
                </View>

                {/* Menu */}
                <View style={styles.menuCard}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[
                                styles.menuRow,
                                index < menuItems.length - 1 && styles.menuRowBorder,
                            ]}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuRowLeft}>
                                <View style={styles.menuIconWrap}>
                                    <Ionicons name={item.icon} size={20} color={colors.primary} />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Notifications Toggle */}
                <View style={styles.menuCard}>
                    <View style={styles.menuRow}>
                        <View style={styles.menuRowLeft}>
                            <View style={styles.menuIconWrap}>
                                <Ionicons name="notifications-outline" size={20} color={colors.primary} />
                            </View>
                            <Text style={styles.menuLabel}>Push Notifications</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: colors.border, true: colors.success }}
                            thumbColor={colors.white}
                        />
                    </View>
                </View>

                {/* Theme Picker */}
                <ThemePicker />

                {/* Help box */}
                <View style={styles.helpCard}>
                    <Ionicons name="chatbubbles-outline" size={28} color={colors.primary} />
                    <Text style={styles.helpTitle}>Need help?</Text>
                    <Text style={styles.helpText}>
                        Contact our support team on WhatsApp for quick assistance.
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            Linking.openURL(
                                'whatsapp://send?phone=+911234567890&text=Hello, I have a query regarding SkillPilot.'
                            )
                        }
                        style={styles.whatsappBtn}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="logo-whatsapp" size={18} color={colors.white} />
                        <Text style={styles.whatsappBtnText}>Chat on WhatsApp</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
    },
    pageTitle: {
        fontSize: fontSize.xxxl,
        fontWeight: fontWeight.extrabold,
        color: colors.text,
        marginBottom: spacing.lg,
    },
    // ── User Card ─────────────────────────────────
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    userInfo: {
        flex: 1,
        gap: 3,
    },
    welcomeLabel: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
    },
    userName: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    rolePill: {
        alignSelf: 'flex-start',
        backgroundColor: colors.primaryBg,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        marginTop: 2,
    },
    roleText: {
        fontSize: fontSize.xs,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    logoutBtn: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.errorBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // ── Menu Card ─────────────────────────────────
    menuCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        marginBottom: spacing.md,
        ...shadows.sm,
        overflow: 'hidden',
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
    },
    menuRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    menuRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    menuIconWrap: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuLabel: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.medium,
        color: colors.text,
    },
    // ── Help Card ─────────────────────────────────
    helpCard: {
        backgroundColor: colors.infoBg,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.info + '25',
    },
    helpTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    helpText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    whatsappBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: '#25D366',
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
        marginTop: spacing.xs,
    },
    whatsappBtnText: {
        color: colors.white,
        fontWeight: fontWeight.semibold,
        fontSize: fontSize.md,
    },
    // ── Edit View ─────────────────────────────────
    editHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    editHeaderTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.text,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    placeholder: {
        width: 40,
    },
    editScrollContent: {
        padding: spacing.md,
    },
    editAvatarWrap: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        position: 'relative',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: spacing.xl,
        right: '40%',
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.xs,
    },
    formSection: {
        marginBottom: spacing.md,
    },
    saveBtn: {
        marginBottom: spacing.xxl,
    },
});

export default ProfileScreen;
