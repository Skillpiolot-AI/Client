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
    focusedColor,
    hint,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = secureTextEntry;
    const activeColor = focusedColor || colors.primary;

    return (
        <View style={[styles.container, style]}>
            {label && (
                <Text style={[styles.label, isFocused && { color: activeColor }]}>
                    {label}
                </Text>
            )}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && { borderColor: activeColor, borderWidth: 1.5 },
                    error && styles.errorBorder,
                    !editable && styles.disabled,
                ]}
            >
                {icon && (
                    <View style={styles.iconLeft}>
                        {typeof icon === 'string' ? (
                            <Ionicons
                                name={icon}
                                size={19}
                                color={isFocused ? activeColor : colors.textMuted}
                            />
                        ) : icon}
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
                    selectionColor={activeColor}
                    {...props}
                />

                {isPassword && (
                    <TouchableOpacity
                        style={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}

                {rightIcon && !isPassword && (
                    <TouchableOpacity style={styles.iconRight} onPress={onRightIconPress}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {hint && !error && <Text style={styles.hint}>{hint}</Text>}
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
        fontWeight: fontWeight.semibold,
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
        minHeight: 50,
    },
    errorBorder: {
        borderColor: colors.error,
        borderWidth: 1.5,
    },
    disabled: {
        backgroundColor: colors.surfaceAlt,
        opacity: 0.7,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: fontSize.md,
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
    },
    inputWithIcon: {
        paddingLeft: spacing.xs,
    },
    inputWithRightIcon: {
        paddingRight: spacing.xs,
    },
    multiline: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: spacing.md,
    },
    iconLeft: {
        paddingLeft: spacing.md,
        paddingRight: spacing.xs,
    },
    iconRight: {
        paddingRight: spacing.md,
        paddingLeft: spacing.sm,
    },
    hint: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    errorText: {
        fontSize: fontSize.xs,
        color: colors.error,
        marginTop: spacing.xs,
    },
});

export default Input;
