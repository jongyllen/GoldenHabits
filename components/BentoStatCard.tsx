import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface BentoStatCardProps {
    title: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap;
    subtitle?: string;
    gradient?: readonly [string, string, ...string[]];
    flex?: number;
    height?: number;
}

export default function BentoStatCard({ title, value, icon, subtitle, gradient, flex = 1, height }: BentoStatCardProps) {
    const { colors } = useTheme();

    const content = (
        <View style={styles.content}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: gradient ? 'rgba(255,255,255,0.15)' : colors.primaryContainer }]}>
                    <Ionicons name={icon} size={18} color={gradient ? '#FFF' : colors.primary} />
                </View>
                <Text style={[styles.title, { color: gradient ? 'rgba(255,255,255,0.7)' : colors.text }]}>{title}</Text>
            </View>
            <View style={styles.footer}>
                <Text style={[styles.value, { color: gradient ? '#FFF' : colors.onSurface }]}>{value}</Text>
                {subtitle && (
                    <Text style={[styles.subtitle, { color: gradient ? 'rgba(255,255,255,0.6)' : colors.icon }]}>{subtitle}</Text>
                )}
            </View>
        </View>
    );

    if (gradient) {
        return (
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.container, colors.cardShadow, { flex, height }]}
            >
                {content}
            </LinearGradient>
        );
    }

    return (
        <View style={[styles.container, colors.cardShadow, { flex, height, backgroundColor: colors.surface }]}>
            {content}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 16,
        margin: 6,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    footer: {
        marginTop: 'auto',
    },
    value: {
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
    },
});
