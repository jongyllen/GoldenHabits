import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from '../constants/theme';
import { useHabits } from '../context/HabitContext';
import { Habit, isCompletedToday } from '../models/Habit';

interface HabitTileProps {
    habit: Habit;
}

export default function HabitTile({ habit }: HabitTileProps) {
    const scheme = useColorScheme() ?? 'light';
    const colors = Colors[scheme];
    const { toggleHabit } = useHabits();
    const completed = isCompletedToday(habit);

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
            <View style={styles.leftSection}>
                <View style={[styles.iconContainer, { backgroundColor: completed ? colors.primary : colors.primaryContainer }]}>
                    <Text style={styles.iconText}>{habit.icon}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.onSurface }]}>{habit.title}</Text>
                    <Text style={[styles.streak, { color: colors.icon }]}>
                        Current Streak: {habit.streak} 🔥
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={[
                    styles.checkbox,
                    { borderColor: colors.primary },
                    completed && { backgroundColor: colors.primary }
                ]}
                onPress={() => toggleHabit(habit.id)}
            >
                {completed && <Ionicons name="checkmark" size={20} color="#FFF" />}
            </TouchableOpacity>
        </View>
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
        marginBottom: 4,
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
