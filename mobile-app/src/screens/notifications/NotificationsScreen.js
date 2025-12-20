// NotificationsScreen - User announcements and notifications
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    RefreshControl, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSize, spacing } from '../../theme';
import api from '../../services/api';

// White Theme Colors
const whiteTheme = {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    primary: '#FF6B35',
    primaryLight: '#FF6B3520',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    border: '#E5E7EB',
    white: '#FFFFFF',
};

const NotificationsScreen = ({ navigation }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchAnnouncements();
        fetchUnreadCount();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const response = await api.get('/announcements/my');
            setAnnouncements(response.data?.announcements || []);
        } catch (error) {
            console.log('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('/announcements/unread-count');
            setUnreadCount(response.data?.unreadCount || 0);
        } catch (error) {
            console.log('Error fetching unread count:', error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchAnnouncements();
        await fetchUnreadCount();
        setRefreshing(false);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.post(`/announcements/${id}/read`);
            setAnnouncements(prev =>
                prev.map(ann => ann._id === id ? { ...ann, isRead: true } : ann)
            );
            if (unreadCount > 0) setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.log('Error marking as read:', error);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'urgent': return { name: 'alert-circle', color: whiteTheme.error };
            case 'important': return { name: 'warning', color: whiteTheme.warning };
            case 'update': return { name: 'refresh-circle', color: whiteTheme.success };
            case 'event': return { name: 'calendar', color: whiteTheme.primary };
            default: return { name: 'megaphone', color: whiteTheme.primary };
        }
    };

    const renderAnnouncement = ({ item }) => {
        const typeIcon = getTypeIcon(item.type);
        const isUnread = !item.isRead;

        return (
            <TouchableOpacity
                style={[styles.card, isUnread && styles.cardUnread]}
                onPress={() => markAsRead(item._id)}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${typeIcon.color}20` }]}>
                        <Ionicons name={typeIcon.name} size={20} color={typeIcon.color} />
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle} numberOfLines={2}>{item.subject}</Text>
                        <Text style={styles.cardTime}>{formatDate(item.sentAt)}</Text>
                    </View>
                    {isUnread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.cardDescription} numberOfLines={3}>
                    {item.shortDescription || item.description}
                </Text>
                {item.type && (
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={whiteTheme.primary} />
                <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={whiteTheme.text} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                <View style={{ width: 44 }} />
            </View>

            {/* List */}
            <FlatList
                data={announcements}
                keyExtractor={(item) => item._id}
                renderItem={renderAnnouncement}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={whiteTheme.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="notifications-off-outline" size={64} color={whiteTheme.textMuted} />
                        <Text style={styles.emptyTitle}>No Notifications</Text>
                        <Text style={styles.emptyText}>You're all caught up!</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteTheme.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: whiteTheme.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: fontSize.md,
        color: whiteTheme.textSecondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: whiteTheme.white,
        borderBottomWidth: 1,
        borderBottomColor: whiteTheme.border,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: whiteTheme.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: whiteTheme.text,
    },
    badge: {
        backgroundColor: whiteTheme.error,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: whiteTheme.white,
    },
    list: {
        padding: spacing.md,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: whiteTheme.white,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: whiteTheme.border,
    },
    cardUnread: {
        backgroundColor: `${whiteTheme.primary}08`,
        borderColor: `${whiteTheme.primary}30`,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: whiteTheme.text,
        marginBottom: 4,
    },
    cardTime: {
        fontSize: 12,
        color: whiteTheme.textMuted,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: whiteTheme.primary,
    },
    cardDescription: {
        fontSize: 14,
        color: whiteTheme.textSecondary,
        lineHeight: 20,
    },
    typeBadge: {
        alignSelf: 'flex-start',
        marginTop: spacing.sm,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: whiteTheme.surface,
        borderRadius: 12,
    },
    typeBadgeText: {
        fontSize: 11,
        color: whiteTheme.textSecondary,
        fontWeight: '500',
    },
    empty: {
        alignItems: 'center',
        padding: spacing.xxl,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: whiteTheme.text,
        marginTop: spacing.md,
    },
    emptyText: {
        fontSize: 14,
        color: whiteTheme.textSecondary,
        marginTop: 6,
    },
});

export default NotificationsScreen;
