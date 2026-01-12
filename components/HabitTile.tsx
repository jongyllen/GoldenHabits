import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { Habit, isCompletedToday } from '../models/Habit';

interface HabitTileProps {
    habit: Habit;
}

export default function HabitTile({ habit }: HabitTileProps) {
    const { colors } = useTheme();
    const { toggleHabit, archiveHabit, updateProgress } = useHabits();
    const router = useRouter();

    const now = new Date();
    const todayKey = now.toDateString();
    const currentProgress = habit.progressLog?.[todayKey] || 0;
    const isCompleted = isCompletedToday(habit);

    const handleToggle = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toggleHabit(habit.id);
    };

    const handleIncrement = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        updateProgress(habit.id, 1);
    };

    const handleLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert(
            'Archive Habit',
            `Are you sure you want to archive "${habit.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Archive', style: 'destructive', onPress: () => archiveHabit(habit.id) },
            ]
        );
    };

    const handleEdit = () => {
        router.push({ pathname: '/modal', params: { id: habit.id } });
    };

    const progressPercent = habit.targetValue ? Math.min(1, currentProgress / habit.targetValue) : 0;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEdit}
            onLongPress={handleLongPress}
            style={[
                styles.container,
                { backgroundColor: colors.surface },
                colors.cardShadow
            ]}
        >
            {/* Progress Background Overlay */}
            {habit.targetValue && progressPercent > 0 && (
                <View
                    style={[
                        styles.progressOverlay,
                        {
                            width: `${progressPercent * 100}%`,
                            backgroundColor: isCompleted ? colors.primary + '1A' : colors.primary + '0D'
                        }
                    ]}
                />
            )}

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    {isCompleted ? (
                        <LinearGradient
                            colors={colors.goldGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.iconGradient}
                        >
                            <Text style={styles.iconText}>{habit.icon}</Text>
                        </LinearGradient>
                    ) : (
                        <View style={[styles.iconPlaceholder, { backgroundColor: colors.primaryContainer }]}>
                            <Text style={styles.iconText}>{habit.icon}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.onSurface }, isCompleted && styles.completedText]}>
                        {habit.title}
                    </Text>
                    <View style={styles.metaRow}>
                        {habit.targetValue ? (
                            <Text style={[styles.subtitle, { color: colors.primary, fontWeight: '700' }]}>
                                {currentProgress}/{habit.targetValue} {habit.unit}
                            </Text>
                        ) : (
                            <Text style={[styles.subtitle, { color: colors.icon }]}>
                                {habit.streak} day streak 🔥
                            </Text>
                        )}
                        {habit.reminderTime && (
                            <View style={styles.reminderBadge}>
                                <Ionicons name="notifications" size={10} color={colors.icon} />
                                <Text style={[styles.reminderText, { color: colors.icon }]}>{habit.reminderTime}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.actions}>
                    {habit.targetValue && !isCompleted && (
                        <TouchableOpacity
                            style={[styles.incrementButton, { backgroundColor: colors.primaryContainer }]}
                            onPress={handleIncrement}
                        >
                            <Ionicons name="add" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.checkbox,
                            { borderColor: isCompleted ? colors.primary : 'rgba(0,0,0,0.1)' },
                            isCompleted && { backgroundColor: colors.primary }
                        ]}
                        onPress={handleToggle}
                    >
                        {isCompleted && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        marginBottom: 12,
        marginHorizontal: 4,
        overflow: 'hidden',
    },
    progressOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        marginRight: 16,
    },
    iconGradient: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 24,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 4,
    },
    completedText: {
        opacity: 0.6,
        textDecorationLine: 'line-through',
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '500',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reminderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        opacity: 0.6,
    },
    reminderText: {
        fontSize: 11,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    incrementButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
