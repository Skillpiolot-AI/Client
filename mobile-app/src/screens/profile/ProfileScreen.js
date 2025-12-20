// Profile/Settings Screen Redesign
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Button, Input } from '../../components/ui';
import { fontSize, fontWeight, spacing, borderRadius } from '../../theme';
import authAPI from '../../services/authAPI';

// UI Reference Theme Colors
export const uiTheme = {
    primary: '#1A237E', // Navy Blue from reference
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#000000',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    helpBg: '#EEF6F6', // Light teal/blue for help box
    white: '#FFFFFF',
    error: '#EF4444',
};

const ProfileScreen = ({ navigation }) => {
    const { user, logout, updateUser } = useAuth();
    const [view, setView] = useState('settings'); // 'settings' or 'edit'
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

    const handleWhatsApp = () => {
        const phone = '+911234567890'; // Example phone
        Linking.openURL(`whatsapp://send?phone=${phone}&text=Hello, I have a query regarding SkillPilot.`);
    };

    if (view === 'edit') {
        return (
            <View style={styles.container}>
                <View style={styles.headerEdit}>
                    <TouchableOpacity onPress={() => setView('settings')}>
                        <Ionicons name="arrow-back" size={24} color={uiTheme.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitleEdit}>User Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.avatarContainerEdit}>
                        <View>
                            <Avatar source={user?.profileImage} name={user?.name} size="xxxl" />
                            <TouchableOpacity style={styles.cameraBadge}>
                                <Ionicons name="camera-outline" size={16} color={uiTheme.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        <Input
                            label="First Name"
                            value={formData.firstName}
                            onChangeText={(v) => setFormData({ ...formData, firstName: v })}
                            placeholder="John"
                            focusedColor={uiTheme.primary}
                        />
                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChangeText={(v) => setFormData({ ...formData, lastName: v })}
                            placeholder="Doe"
                            focusedColor={uiTheme.primary}
                        />
                        <Input
                            label="E-Mail"
                            value={formData.email}
                            onChangeText={(v) => setFormData({ ...formData, email: v })}
                            keyboardType="email-address"
                            placeholder="johndoe@gmail.com"
                            focusedColor={uiTheme.primary}
                        />
                        <Input
                            label="Mobile"
                            value={formData.phone}
                            onChangeText={(v) => setFormData({ ...formData, phone: v })}
                            keyboardType="phone-pad"
                            placeholder="+91-123456789"
                            focusedColor={uiTheme.primary}
                        />
                    </View>

                    <Button
                        title="SAVE"
                        variant="primary"
                        onPress={handleSave}
                        loading={loading}
                        color={uiTheme.primary}
                        style={styles.saveBtn}
                        textStyle={styles.saveBtnText}
                    />
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.mainTitle}>Settings</Text>

                {/* User Info Card */}
                <View style={styles.userCard}>
                    <View style={styles.userCardLeft}>
                        <Avatar source={user?.profileImage} name={user?.name} size="lg" />
                        <View style={styles.userInfo}>
                            <Text style={styles.welcomeLabel}>Welcome</Text>
                            <Text style={styles.userName}>Mr. {user?.name}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color={uiTheme.primary} />
                    </TouchableOpacity>
                </View>

                {/* Settings Menu */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuRow} onPress={() => setView('edit')}>
                        <View style={styles.menuRowLeft}>
                            <Ionicons name="person-circle-outline" size={22} color={uiTheme.textSecondary} />
                            <Text style={styles.menuLabel}>User Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={uiTheme.primary} />
                    </TouchableOpacity>

                    {user?.role === 'Mentor' && (
                        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('EditMentorProfile')}>
                            <View style={styles.menuRowLeft}>
                                <Ionicons name="briefcase-outline" size={22} color={uiTheme.textSecondary} />
                                <Text style={styles.menuLabel}>Mentor Settings</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={uiTheme.primary} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.menuRow}
                        onPress={async () => {
                            try {
                                Alert.alert(
                                    'Change Password',
                                    'We will send a verification code to your email to change your password. Proceed?',
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
                                                        fromProfile: true
                                                    });
                                                } catch (err) {
                                                    const data = err.response?.data;
                                                    const errorMessage = data?.message || data?.error || err.message || 'Failed to send verification code';
                                                    const diagnosticCode = data?.errorCode ? ` [Code: ${data.errorCode}]` : '';
                                                    const technicalDetail = err.response ? ` (Status: ${err.response.status}${diagnosticCode})` : ' (Network Error)';

                                                    Alert.alert(
                                                        'Error',
                                                        `${errorMessage}${technicalDetail}\n\n${data?.emailResponse || ''}`.trim()
                                                    );
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }
                                        }
                                    ]
                                );
                            } catch (err) {
                                Alert.alert('Error', 'Something went wrong');
                            }
                        }}
                    >
                        <View style={styles.menuRowLeft}>
                            <Ionicons name="lock-closed-outline" size={22} color={uiTheme.textSecondary} />
                            <Text style={styles.menuLabel}>Change Password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={uiTheme.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow}>
                        <View style={styles.menuRowLeft}>
                            <Ionicons name="help-circle-outline" size={22} color={uiTheme.textSecondary} />
                            <Text style={styles.menuLabel}>FAQs</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={uiTheme.primary} />
                    </TouchableOpacity>

                    <View style={styles.menuRow}>
                        <View style={styles.menuRowLeft}>
                            <Ionicons name="notifications-outline" size={22} color={uiTheme.textSecondary} />
                            <Text style={styles.menuLabel}>Push Notification</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#D1D5DB', true: '#4ADE80' }}
                            thumbColor={uiTheme.white}
                        />
                    </View>
                </View>

                {/* Help Box */}

            </ScrollView>

            {/* Bottom Nav Mock (Placeholder to match UI reference) */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: uiTheme.background,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 60,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: uiTheme.text,
        marginBottom: 30,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        marginBottom: 30,
    },
    userCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userInfo: {
        marginLeft: 16,
    },
    welcomeLabel: {
        fontSize: 12,
        color: uiTheme.textMuted,
        marginBottom: 2,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: uiTheme.text,
    },
    menuContainer: {
        backgroundColor: uiTheme.white,
        borderRadius: 16,
        marginBottom: 40,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: uiTheme.text,
        marginLeft: 16,
    },
    helpBox: {
        backgroundColor: uiTheme.helpBg,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    helpText: {
        fontSize: 14,
        color: uiTheme.text,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 12,
        fontWeight: '500',
    },
    whatsappLink: {
        fontSize: 14,
        fontWeight: '700',
        color: uiTheme.primary,
        textDecorationLine: 'underline',
    },
    bottomNavMock: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: uiTheme.white,
        paddingBottom: 30,
    },
    navItem: {
        alignItems: 'center',
    },
    navLabel: {
        fontSize: 10,
        color: uiTheme.textMuted,
        marginTop: 4,
    },
    navLabelActive: {
        fontSize: 10,
        color: uiTheme.primary,
        marginTop: 4,
        fontWeight: '600',
    },
    // Edit View Styles
    headerEdit: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitleEdit: {
        fontSize: 18,
        fontWeight: '700',
        color: uiTheme.text,
    },
    avatarContainerEdit: {
        alignItems: 'center',
        marginVertical: 30,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: uiTheme.white,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: uiTheme.border,
        elevation: 2,
    },
    formContainer: {
        marginBottom: 30,
    },
    saveBtn: {
        borderRadius: 30,
        height: 56,
        marginBottom: 40,
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
});

export default ProfileScreen;
