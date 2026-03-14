// Avatar Component
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, fontSize, fontWeight } from '../../theme';

const Avatar = ({
    source,
    name,
    size = 'md',
    style,
}) => {
    const getSize = () => {
        switch (size) {
            case 'xs': return 24;
            case 'sm': return 32;
            case 'md': return 48;
            case 'lg': return 64;
            case 'xl': return 96;
            case 'xxl': return 128;
            default: return 48;
        }
    };

    const dimension = getSize();
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

    if (source) {
        return (
            <Image
                source={typeof source === 'string' ? { uri: source } : source}
                style={[
                    styles.image,
                    { width: dimension, height: dimension, borderRadius: dimension / 2 },
                    style,
                ]}
            />
        );
    }

    return (
        <View
            style={[
                styles.placeholder,
                { width: dimension, height: dimension, borderRadius: dimension / 2 },
                style,
            ]}
        >
            <Text
                style={[
                    styles.initials,
                    { fontSize: dimension * 0.35 },
                ]}
            >
                {initials}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        backgroundColor: colors.surface,
    },
    placeholder: {
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        color: colors.white,
        fontWeight: fontWeight.bold,
    },
});

export default Avatar;
