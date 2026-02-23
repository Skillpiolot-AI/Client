// ScreenWrapper Layout Component
import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

const ScreenWrapper = ({
    children,
    scroll = false,
    refreshing,
    onRefresh,
    backgroundColor,
    padding = true,
    style,
    contentStyle,
    edges = ['top', 'left', 'right'],
}) => {
    const bg = backgroundColor || colors.background;

    if (scroll) {
        return (
            <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={edges}>
                <ScrollView
                    style={[{ flex: 1, backgroundColor: bg }, style]}
                    contentContainerStyle={[
                        padding && styles.content,
                        contentStyle,
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        onRefresh ? (
                            <RefreshControl
                                refreshing={refreshing || false}
                                onRefresh={onRefresh}
                                tintColor={colors.primary}
                                colors={[colors.primary]}
                            />
                        ) : undefined
                    }
                >
                    {children}
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={edges}>
            <View style={[{ flex: 1, backgroundColor: bg }, padding && styles.content, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: spacing.md,
    },
});

export default ScreenWrapper;
