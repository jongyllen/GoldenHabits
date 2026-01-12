import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from '../constants/theme';
import { useHabits } from '../context/HabitContext';
import { Habit, isCompletedToday } from '../models/Habit';

interface HabitTileProps {
    habit: Habit;
}

export default function HabitTile({ habit }: HabitTileProps) {
    const scheme = useColorScheme() ?? 'light';
    const colors = Colors[scheme];
    const { toggleHabit, archiveHabit } = useHabits();
    const router = useRouter();
    const completed = isCompletedToday(habit);

    const handleLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
            "Archive Habit",
            `Are you sure you want to archive "${habit.title}"? You can find it in your history later.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Archive",
                    style: "destructive",
                    onPress: () => archiveHabit(habit.id)
                }
            ]
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={handleLongPress}
            style={[styles.container, { backgroundColor: colors.surface }]}
        >
            <View style={styles.leftSection}>
                <View style={[styles.iconContainer, { backgroundColor: completed ? colors.primary : colors.primaryContainer }]}>
                    <Text style={styles.iconText}>{habit.icon}</Text>
                </View>
                <View style={styles.textContainer}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: colors.onSurface }]}>{habit.title}</Text>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/modal', params: { id: habit.id } })}
                            style={styles.editButton}
                        >
                            <Ionicons name="pencil" size={14} color={colors.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.detailsRow}>
                        <Text style={[styles.streak, { color: colors.icon }]}>
                            Current Streak: {habit.streak} 🔥
                        </Text>
                        {habit.reminderTime && (
                            <View style={styles.reminderBadge}>
                                <Ionicons name="notifications-outline" size={12} color={colors.primary} />
                                <Text style={[styles.reminderText, { color: colors.primary }]}>{habit.reminderTime}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={[
                    styles.checkbox,
                    { borderColor: colors.primary },
                    completed && { backgroundColor: colors.primary }
                ]}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    toggleHabit(habit.id);
                }}
            >
                {completed && <Ionicons name="checkmark" size={20} color="#FFF" />}
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconText: {
        fontSize: 24,
    },
    textContainer: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    editButton: {
        marginLeft: 8,
        padding: 4,
        opacity: 0.6,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    reminderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    reminderText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 3,
    },
    streak: {
        fontSize: 14,
    },
    checkbox: {
        width: 32,
        height: 32,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
