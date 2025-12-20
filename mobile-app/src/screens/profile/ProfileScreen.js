// Profile Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Card, Avatar, Button, Input, Badge } from '../../components/ui';
import { Header } from '../../components/layout';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../theme';

const ProfileScreen = ({ navigation }) => {
    const { user, logout, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
    });

    const handleSave = async () => {
        setLoading(true);
        const result = await updateUser(formData);
        if (result.success) {
            setEditing(false);
            Alert.alert('Success', 'Profile updated');
        } else {
            Alert.alert('Error', result.error);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel' },
            { text: 'Logout', onPress: logout, style: 'destructive' },
        ]);
    };

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', action: () => setEditing(true) },
        { icon: 'notifications-outline', label: 'Notifications', action: () => { } },
        { icon: 'shield-outline', label: 'Privacy & Security', action: () => { } },
        { icon: 'help-circle-outline', label: 'Help & Support', action: () => { } },
        { icon: 'information-circle-outline', label: 'About', action: () => { } },
    ];

    return (
        <View style={styles.container}>
            <Header title="Profile" showBack />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.header}>
                    <Avatar source={user?.profileImage} name={user?.name} size="xxl" style={styles.avatar} />
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    <Badge text={user?.role || 'User'} variant="primary" style={styles.badge} />
                </LinearGradient>

                {editing ? (
                    <View style={styles.editForm}>
                        <Input label="Name" value={formData.name} onChangeText={(v) => setFormData({ ...formData, name: v })} />
                        <Input label="Email" value={formData.email} onChangeText={(v) => setFormData({ ...formData, email: v })} keyboardType="email-address" />
                        <Input label="Phone" value={formData.phone} onChangeText={(v) => setFormData({ ...formData, phone: v })} keyboardType="phone-pad" />
                        <Input label="Bio" value={formData.bio} onChangeText={(v) => setFormData({ ...formData, bio: v })} multiline />
                        <View style={styles.editButtons}>
                            <Button title="Cancel" variant="outline" onPress={() => setEditing(false)} style={styles.editBtn} />
                            <Button title="Save" variant="gradient" loading={loading} onPress={handleSave} style={styles.editBtn} />
                        </View>
                    </View>
                ) : (
                    <>
                        {/* Stats */}
                        <View style={styles.stats}>
                            <View style={styles.stat}><Text style={styles.statNum}>{user?.assessments || 0}</Text><Text style={styles.statLabel}>Assessments</Text></View>
                            <View style={styles.stat}><Text style={styles.statNum}>{user?.sessions || 0}</Text><Text style={styles.statLabel}>Sessions</Text></View>
                            <View style={styles.stat}><Text style={styles.statNum}>{user?.courses || 0}</Text><Text style={styles.statLabel}>Courses</Text></View>
                        </View>

                        {/* Menu */}
                        <View style={styles.menu}>
                            {menuItems.map((item, i) => (
                                <TouchableOpacity key={i} style={styles.menuItem} onPress={item.action}>
                                    <Ionicons name={item.icon} size={22} color={colors.primary} />
                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Logout */}
                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={22} color={colors.error} />
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { alignItems: 'center', padding: spacing.xl, paddingTop: spacing.lg },
    avatar: { borderWidth: 4, borderColor: colors.white },
    name: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.white, marginTop: spacing.md },
    email: { fontSize: fontSize.md, color: colors.white + 'CC' },
    badge: { marginTop: spacing.sm },
    stats: { flexDirection: 'row', justifyContent: 'space-around', padding: spacing.lg, backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: -spacing.lg, borderRadius: borderRadius.xl },
    stat: { alignItems: 'center' },
    statNum: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary },
    statLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
    menu: { margin: spacing.md },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
    menuLabel: { flex: 1, marginLeft: spacing.md, fontSize: fontSize.md, color: colors.text },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: spacing.md, padding: spacing.md, backgroundColor: colors.error + '20', borderRadius: borderRadius.lg },
    logoutText: { marginLeft: spacing.sm, fontSize: fontSize.md, color: colors.error, fontWeight: fontWeight.semibold },
    editForm: { padding: spacing.md },
    editButtons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
    editBtn: { flex: 1 },
});

export default ProfileScreen;
