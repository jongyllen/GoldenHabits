import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../../context/HabitContext';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
    const { themeMode, setThemeMode, colors, isDark } = useTheme();
    const { debugShiftDates, resetAllData } = useHabits();

    const handleResetData = () => {
        Alert.alert(
            'Reset All Data',
            'This will permanently delete all your habits and progress. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset Everything',
                    style: 'destructive',
                    onPress: async () => {
                        await resetAllData();
                        Alert.alert('Success', 'All data has been cleared.');
                    }
                },
            ]
        );
    };

    const handleSimulateDay = async () => {
        await debugShiftDates();
        Alert.alert('Success', 'Time shifted! Check your stats.');
    };

    const ThemeOption = ({ mode, label, icon }: { mode: 'light' | 'dark' | 'system', label: string, icon: any }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                styles.settingItem,
                { backgroundColor: colors.surface },
                themeMode === mode && { borderColor: colors.primary, borderWidth: 2 },
                !(themeMode === mode) && { borderColor: colors.primaryContainer, borderWidth: 1 }
            ]}
            onPress={() => setThemeMode(mode)}
        >
            <Ionicons name={icon} size={22} color={themeMode === mode ? colors.primary : colors.icon} />
            <Text style={[styles.settingText, { color: colors.onSurface }, themeMode === mode && { fontWeight: '700' }]}>
                {label}
            </Text>
            {themeMode === mode && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={[styles.headerSubtitle, { color: colors.primary }]}>PREFERENCES</Text>
                    <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Settings</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Appearance</Text>
                    <View style={styles.themeGrid}>
                        <ThemeOption mode="light" label="Light" icon="sunny-outline" />
                        <ThemeOption mode="dark" label="Dark" icon="moon-outline" />
                        <ThemeOption mode="system" label="System" icon="contrast-outline" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Developer Tools</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.actionButton, { backgroundColor: colors.surface }, colors.cardShadow]}
                        onPress={handleSimulateDay}
                    >
                        <Ionicons name="time-outline" size={20} color={colors.primary} />
                        <Text style={[styles.actionButtonText, { color: colors.onSurface }]}>Simulate Next Day</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.actionButton, { backgroundColor: colors.surface, marginTop: 12 }, colors.cardShadow]}
                        onPress={handleResetData}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FF4444" />
                        <Text style={[styles.actionButtonText, { color: "#FF4444" }]}>Reset All Data</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.icon }]}>Golden Habits v1.0.0</Text>
                    <Text style={[styles.footerText, { color: colors.icon, marginTop: 4 }]}>Stay consistent, stay golden. ✨</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    themeGrid: {
        gap: 12,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        gap: 12,
    },
    settingText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        gap: 12,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
        opacity: 0.6,
    },
    footerText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
