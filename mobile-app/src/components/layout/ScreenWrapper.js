// Screen Wrapper Component with Safe Area
import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

const ScreenWrapper = ({
    children,
    scrollable = true,
    refreshing = false,
    onRefresh,
    style,
    contentStyle,
    edges = ['top', 'left', 'right'],
    backgroundColor = colors.background,
    ...props
}) => {
    const Container = scrollable ? ScrollView : View;

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor }, style]}
            edges={edges}
            {...props}
        >
            <Container
                style={styles.container}
                contentContainerStyle={[styles.content, contentStyle]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    onRefresh ? (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                            colors={[colors.primary]}
                        />
                    ) : undefined
                }
            >
                {children}
            </Container>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.md,
        flexGrow: 1,
    },
});

export default ScreenWrapper;
