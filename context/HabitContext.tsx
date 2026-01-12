import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit, calculateStreak, isCompletedToday } from '../models/Habit';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

interface HabitContextType {
    habits: Habit[];
    archivedHabits: Habit[];
    addHabit: (title: string, icon: string, reminderTime?: string) => Promise<void>;
    toggleHabit: (id: string) => Promise<void>;
    archiveHabit: (id: string) => Promise<void>;
    restoreHabit: (id: string) => Promise<void>;
    updateHabit: (id: string, title: string, icon: string, reminderTime?: string) => Promise<void>;
    reorderHabits: (newHabits: Habit[]) => Promise<void>;
    debugShiftDates: () => Promise<void>;
    overallProgress: number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = '@golden_habits_data';

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [archivedHabits, setArchivedHabits] = useState<Habit[]>([]);

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        try {
            const stored = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
            if (stored) {
                const { active, archived } = JSON.parse(stored);

                const refreshStreaks = (list: Habit[]) => list.map(h => ({
                    ...h,
                    streak: calculateStreak(h.completedDates)
                }));

                const refreshedActive = refreshStreaks(active || []);
                const refreshedArchived = refreshStreaks(archived || []);

                setHabits(refreshedActive);
                setArchivedHabits(refreshedArchived);

                // Sync notifications for all active habits
                syncAllNotifications(refreshedActive);
            }
        } catch (e) {
            console.error('Failed to load habits', e);
        }
    };

    const saveHabits = async (active: Habit[], archived: Habit[]) => {
        try {
            await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify({ active, archived }));
            setHabits(active);
            setArchivedHabits(archived);
        } catch (e) {
            console.error('Failed to save habits', e);
        }
    };

    const requestPermissions = async () => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        return finalStatus === 'granted';
    };

    const cancelNotification = async (habitId: string) => {
        // Cancel all 7 potential notifications for this habit
        for (let i = 0; i < 7; i++) {
            await Notifications.cancelScheduledNotificationAsync(`${habitId}-${i}`);
        }
    };

    const scheduleNotification = async (habit: Habit) => {
        if (!habit.reminderTime) return;

        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        await cancelNotification(habit.id);

        const [hours, minutes] = habit.reminderTime.split(':').map(Number);

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(hours, minutes, 0, 0);

            // If it's today and already passed or already completed
            if (i === 0) {
                if (date < new Date() || isCompletedToday(habit)) {
                    continue; // Skip today
                }
            }

            await Notifications.scheduleNotificationAsync({
                identifier: `${habit.id}-${i}`,
                content: {
                    title: "Time for GoldenHabits! ✨",
                    body: `Don't forget to: ${habit.title}`,
                    data: { habitId: habit.id },
                },
                trigger: {
                    type: 'calendar',
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate(),
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                    repeats: false,
                } as any,
            });
        }
    };

    const syncAllNotifications = async (activeHabits: Habit[]) => {
        // Clear all first to be safe (or we could be more surgical)
        // await Notifications.cancelAllScheduledNotificationsAsync(); 
        // Better to be surgical to avoid interfering with other things if any
        for (const habit of activeHabits) {
            if (habit.reminderTime) {
                await scheduleNotification(habit);
            } else {
                await cancelNotification(habit.id);
            }
        }
    };

    const addHabit = async (title: string, icon: string, reminderTime?: string) => {
        const hId = Math.random().toString(36).substring(7);
        const newHabit: Habit = {
            id: hId,
            title,
            icon,
            streak: 0,
            createdAt: new Date().toISOString(),
            completedDates: [],
            reminderTime,
        };
        const updated = [...habits, newHabit];
        await saveHabits(updated, archivedHabits);

        if (reminderTime) {
            await scheduleNotification(newHabit);
        }
    };

    const toggleHabit = async (id: string) => {
        const now = new Date();
        const todayStr = now.toISOString();

        const updated = habits.map(h => {
            if (h.id === id) {
                let newDates = [...h.completedDates];
                if (isCompletedToday(h)) {
                    newDates = newDates.filter(d => {
                        const date = new Date(d);
                        return !(date.getFullYear() === now.getFullYear() &&
                            date.getMonth() === now.getMonth() &&
                            date.getDate() === now.getDate());
                    });
                } else {
                    newDates.push(todayStr);
                }
                const updatedHabit = {
                    ...h,
                    completedDates: newDates,
                    streak: calculateStreak(newDates)
                };

                // Reschedule notifications based on completion status
                if (updatedHabit.reminderTime) {
                    scheduleNotification(updatedHabit);
                }

                return updatedHabit;
            }
            return h;
        });
        await saveHabits(updated, archivedHabits);
    };

    const archiveHabit = async (id: string) => {
        const habitToArchive = habits.find(h => h.id === id);
        if (!habitToArchive) return;

        await cancelNotification(habitToArchive.id);

        const newActive = habits.filter(h => h.id !== id);
        const newArchived = [{ ...habitToArchive, notificationId: undefined }, ...archivedHabits];
        await saveHabits(newActive, newArchived);
    };

    const restoreHabit = async (id: string) => {
        const habitToRestore = archivedHabits.find(h => h.id === id);
        if (!habitToRestore) return;

        const newArchived = archivedHabits.filter(h => h.id !== id);
        const newActive = [habitToRestore, ...habits];
        await saveHabits(newActive, newArchived);

        if (habitToRestore.reminderTime) {
            await scheduleNotification(habitToRestore);
        }
    };

    const reorderHabits = async (newHabits: Habit[]) => {
        await saveHabits(newHabits, archivedHabits);
    };

    const updateHabit = async (id: string, title: string, icon: string, reminderTime?: string) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;

        const updatedHabit: Habit = { ...habit, title, icon, reminderTime };
        const updated = habits.map(h => h.id === id ? updatedHabit : h);
        await saveHabits(updated, archivedHabits);

        if (reminderTime) {
            await scheduleNotification(updatedHabit);
        } else if (habit.reminderTime) {
            await cancelNotification(id);
        }
    };

    const debugShiftDates = async () => {
        const shiftAll = (list: Habit[]) => list.map(h => {
            const shiftDate = (d: string) => {
                const date = new Date(d);
                date.setDate(date.getDate() - 1);
                return date.toISOString();
            };

            const newDates = h.completedDates.map(shiftDate);
            return {
                ...h,
                createdAt: shiftDate(h.createdAt),
                completedDates: newDates,
                streak: calculateStreak(newDates)
            };
        });

        await saveHabits(shiftAll(habits), shiftAll(archivedHabits));
    };

    const overallProgress = habits.length > 0
        ? habits.filter(h => isCompletedToday(h)).length / habits.length
        : 0;

    return (
        <HabitContext.Provider value={{ habits, archivedHabits, addHabit, toggleHabit, archiveHabit, restoreHabit, updateHabit, reorderHabits, debugShiftDates, overallProgress }}>
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (context === undefined) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
};
