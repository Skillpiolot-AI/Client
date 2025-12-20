import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import mentorshipAPI from '../../services/mentorshipAPI';
import { Button, Input, Avatar } from '../../components/ui';
import { uiTheme } from '../profile/ProfileScreen';
import { spacing, fontSize, borderRadius } from '../../theme';

const screenWidth = Dimensions.get('window').width;

const EditMentorProfileScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Initialize state with all possible fields from model
    const [formData, setFormData] = useState({
        displayName: user?.mentorProfile?.displayName || user?.name || '',
        tagline: user?.mentorProfile?.tagline || '',
        bio: user?.mentorProfile?.bio || '',
        location: {
            city: user?.mentorProfile?.location?.city || '',
            state: user?.mentorProfile?.location?.state || '',
            country: user?.mentorProfile?.location?.country || 'India',
        },
        expertise: user?.mentorProfile?.expertise?.join(', ') || '',
        targetingDomains: user?.mentorProfile?.targetingDomains?.join(', ') || '',
        languages: user?.mentorProfile?.languages?.join(', ') || '',
        sessionsPerWeek: String(user?.mentorProfile?.sessionsPerWeek || 1),
        sessionDuration: String(user?.mentorProfile?.sessionDuration || 60),
        preferredMenteeType: user?.mentorProfile?.preferredMenteeType || [],
        linkedIn: user?.mentorProfile?.socialLinks?.linkedIn || '',
        github: user?.mentorProfile?.socialLinks?.github || '',
    });

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        calculateProgress();
    }, [formData]);

    const calculateProgress = () => {
        const fields = [
            formData.displayName,
            formData.tagline,
            formData.bio,
            formData.expertise,
            formData.targetingDomains,
            formData.location.city,
            formData.sessionsPerWeek,
            formData.preferredMenteeType.length > 0,
            formData.linkedIn,
            formData.github,
            (user?.mentorProfile?.pricingPlans?.length || 0) > 0,
            (user?.mentorProfile?.availabilitySlots?.length || 0) > 0
        ];
        const filled = fields.filter(f => {
            if (typeof f === 'string') return f.trim().length > 0;
            if (typeof f === 'boolean') return f;
            return !!f;
        }).length;
        setProgress((filled / fields.length) * 100);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = {
                ...formData,
                expertise: formData.expertise.split(',').map(s => s.trim()).filter(s => s),
                targetingDomains: formData.targetingDomains.split(',').map(s => s.trim()).filter(s => s),
                languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),
                sessionsPerWeek: parseInt(formData.sessionsPerWeek),
                sessionDuration: parseInt(formData.sessionDuration),
                socialLinks: {
                    linkedIn: formData.linkedIn,
                    github: formData.github,
                },
                preferredMenteeType: formData.preferredMenteeType
            };
            await mentorshipAPI.requestProfileUpdate(data);
            Alert.alert('Success', 'Update request submitted for admin review.');
            navigation.goBack();
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Error', 'Failed to submit update request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={uiTheme.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Progress Section */}
                <View style={styles.progressCard}>
                    <View style={styles.progressTextRow}>
                        <Text style={styles.progressLabel}>
                            {progress < 100 ? `You only need ${Math.round(100 - progress)}% more!` : 'Profile 100% Complete!'}
                        </Text>
                        <Text style={styles.progressValue}>{Math.round(progress)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressSubtext}>Complete your data, and get our voucher of free visibility!</Text>
                </View>

                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <View>
                        <Avatar source={user?.mentorProfile?.profileImage || user?.profileImage} name={formData.displayName} size="xxxl" />
                        <TouchableOpacity style={styles.cameraBadge}>
                            <Ionicons name="camera-outline" size={16} color={uiTheme.textSecondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Sections */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <Input
                        label="Display Name"
                        value={formData.displayName}
                        onChangeText={(v) => setFormData({ ...formData, displayName: v })}
                        placeholder="e.g. Naufal Gerald"
                        focusedColor={uiTheme.primary}
                    />
                    <Input
                        label="Tagline"
                        value={formData.tagline}
                        onChangeText={(v) => setFormData({ ...formData, tagline: v })}
                        placeholder="e.g. Expert in AI & ML"
                        focusedColor={uiTheme.primary}
                    />
                    <Input
                        label="Bio"
                        value={formData.bio}
                        onChangeText={(v) => setFormData({ ...formData, bio: v })}
                        placeholder="Tell us about your experience..."
                        multiline
                        numberOfLines={4}
                        focusedColor={uiTheme.primary}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Professional Details</Text>
                    <Input
                        label="Expertise (comma separated)"
                        value={formData.expertise}
                        onChangeText={(v) => setFormData({ ...formData, expertise: v })}
                        placeholder="React, Node.js, Python"
                        focusedColor={uiTheme.primary}
                    />
                    <Input
                        label="Targeting Domains"
                        value={formData.targetingDomains}
                        onChangeText={(v) => setFormData({ ...formData, targetingDomains: v })}
                        placeholder="Frontend, Backend, Fullstack"
                        focusedColor={uiTheme.primary}
                    />
                    <Input
                        label="Languages"
                        value={formData.languages}
                        onChangeText={(v) => setFormData({ ...formData, languages: v })}
                        placeholder="English, Hindi"
                        focusedColor={uiTheme.primary}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <Text style={styles.inputLabel}>Preferred Mentee Type</Text>
                    <View style={styles.menteeTypeRow}>
                        {['Fresher', 'Working Professional', 'Student', 'Career Switch'].map(type => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeChip,
                                    formData.preferredMenteeType.includes(type) && styles.typeChipActive
                                ]}
                                onPress={() => {
                                    const types = formData.preferredMenteeType.includes(type)
                                        ? formData.preferredMenteeType.filter(t => t !== type)
                                        : [...formData.preferredMenteeType, type];
                                    setFormData({ ...formData, preferredMenteeType: types });
                                }}
                            >
                                <Text style={[
                                    styles.typeChipText,
                                    formData.preferredMenteeType.includes(type) && styles.typeChipTextActive
                                ]}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Input
                        label="Sessions Per Week"
                        value={formData.sessionsPerWeek}
                        onChangeText={(v) => setFormData({ ...formData, sessionsPerWeek: v })}
                        keyboardType="numeric"
                        placeholder="5"
                        focusedColor={uiTheme.primary}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Social Presence</Text>
                    <Input
                        label="LinkedIn URL"
                        value={formData.linkedIn}
                        onChangeText={(v) => setFormData({ ...formData, linkedIn: v })}
                        placeholder="https://linkedin.com/in/..."
                        focusedColor={uiTheme.primary}
                        icon="logo-linkedin"
                    />
                    <Input
                        label="GitHub URL"
                        value={formData.github}
                        onChangeText={(v) => setFormData({ ...formData, github: v })}
                        placeholder="https://github.com/..."
                        focusedColor={uiTheme.primary}
                        icon="logo-github"
                    />
                </View>

                <Button
                    title="SUBMIT CHANGES"
                    onPress={handleSave}
                    loading={loading}
                    color={uiTheme.primary}
                    style={styles.saveBtn}
                    textStyle={styles.saveBtnText}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: uiTheme.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: uiTheme.white,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: uiTheme.text,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    progressCard: {
        backgroundColor: uiTheme.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: uiTheme.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: uiTheme.text,
    },
    progressValue: {
        fontSize: 14,
        fontWeight: '800',
        color: uiTheme.primary,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3B82F6', // Blue like the reference
        borderRadius: 4,
    },
    progressSubtext: {
        fontSize: 12,
        color: uiTheme.textSecondary,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: uiTheme.white,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: uiTheme.border,
        elevation: 2,
    },
    formSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: uiTheme.text,
        marginBottom: 20,
    },
    saveBtn: {
        borderRadius: 30,
        height: 56,
        marginBottom: 20,
        backgroundColor: '#3B82F6', // Using blue for the main action button as in reference
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: uiTheme.textSecondary,
        marginBottom: 8,
    },
    menteeTypeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    typeChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: uiTheme.border,
    },
    typeChipActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    typeChipText: {
        fontSize: 12,
        color: uiTheme.textSecondary,
        fontWeight: '500',
    },
    typeChipTextActive: {
        color: '#FFFFFF',
    },
});

export default EditMentorProfileScreen;
