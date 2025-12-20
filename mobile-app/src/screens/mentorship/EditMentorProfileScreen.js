import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import mentorshipAPI from '../../services/mentorshipAPI';
import { Button, Input } from '../../components/ui';
import { uiTheme } from '../profile/ProfileScreen';

const EditMentorProfileScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bio: user?.mentorProfile?.bio || '',
        tagline: user?.mentorProfile?.tagline || '',
        expertise: user?.mentorProfile?.expertise?.join(', ') || '',
        sessionsPerWeek: String(user?.mentorProfile?.sessionsPerWeek || 1),
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = {
                ...formData,
                expertise: formData.expertise.split(',').map(s => s.trim()),
                sessionsPerWeek: parseInt(formData.sessionsPerWeek),
            };
            await mentorshipAPI.requestProfileUpdate(data);
            Alert.alert('Success', 'Update request submitted for admin review.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to submit update request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#1A237E" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mentor Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Public Information</Text>
                <Input
                    label="Tagline"
                    value={formData.tagline}
                    onChangeText={(v) => setFormData({ ...formData, tagline: v })}
                    placeholder="Expert in AI & ML"
                />
                <Input
                    label="Bio"
                    value={formData.bio}
                    onChangeText={(v) => setFormData({ ...formData, bio: v })}
                    placeholder="Tell us about your experience..."
                    multiline
                    numberOfLines={4}
                />
                <Input
                    label="Expertise (comma separated)"
                    value={formData.expertise}
                    onChangeText={(v) => setFormData({ ...formData, expertise: v })}
                    placeholder="React, Node.js, Python"
                />

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Availability Settings</Text>
                <Input
                    label="Sessions Per Week"
                    value={formData.sessionsPerWeek}
                    onChangeText={(v) => setFormData({ ...formData, sessionsPerWeek: v })}
                    keyboardType="numeric"
                    placeholder="5"
                />

                <Button
                    title="SUBMIT FOR REVIEW"
                    onPress={handleSave}
                    loading={loading}
                    color="#1A237E"
                    style={styles.saveBtn}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A237E',
        marginBottom: 16,
    },
    saveBtn: {
        marginTop: 30,
        borderRadius: 12,
        height: 56,
        marginBottom: 40,
    },
});

export default EditMentorProfileScreen;
