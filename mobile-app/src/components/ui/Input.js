// Custom Input Component
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, fontSize, fontWeight, spacing } from '../../theme';

const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    error,
    icon,
    rightIcon,
    onRightIconPress,
    multiline = false,
    numberOfLines = 1,
    editable = true,
    style,
    inputStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = secureTextEntry;

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.focused,
                    error && styles.error,
                    !editable && styles.disabled,
                ]}
            >
                {icon && (
                    <View style={styles.iconLeft}>
                        {icon}
                    </View>
                )}

                <TextInput
                    style={[
                        styles.input,
                        icon && styles.inputWithIcon,
                        (rightIcon || isPassword) && styles.inputWithRightIcon,
                        multiline && styles.multiline,
                        inputStyle,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isPassword && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    editable={editable}
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        style={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}

                {rightIcon && !isPassword && (
                    <TouchableOpacity
                        style={styles.iconRight}
                        onPress={onRightIconPress}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    focused: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    error: {
        borderColor: colors.error,
    },
    disabled: {
        backgroundColor: colors.surfaceLight,
        opacity: 0.7,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: fontSize.md,
        paddingVertical: spacing.md - 4,
        paddingHorizontal: spacing.md,
    },
    inputWithIcon: {
        paddingLeft: 0,
    },
    inputWithRightIcon: {
        paddingRight: 0,
    },
    multiline: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: spacing.md,
    },
    iconLeft: {
        paddingLeft: spacing.md,
    },
    iconRight: {
        paddingRight: spacing.md,
        paddingLeft: spacing.sm,
    },
    errorText: {
        fontSize: fontSize.xs,
        color: colors.error,
        marginTop: spacing.xs,
    },
});

export default Input;
