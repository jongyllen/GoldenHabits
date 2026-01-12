import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit, calculateStreak, isCompletedToday } from '../models/Habit';

interface HabitContextType {
    habits: Habit[];
    addHabit: (title: string, icon: string) => Promise<void>;
    toggleHabit: (id: string) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    overallProgress: number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const HABITS_STORAGE_KEY = '@golden_habits_data';

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        loadHabits();
    }, []);

    const loadHabits = async () => {
        try {
            const stored = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
            if (stored) {
                const parsed: Habit[] = JSON.parse(stored);
                // Refresh streaks on load
                const updated = parsed.map(h => ({
                    ...h,
                    streak: calculateStreak(h.completedDates)
                }));
                setHabits(updated);
            }
        } catch (e) {
            console.error('Failed to load habits', e);
        }
    };

    const saveHabits = async (newHabits: Habit[]) => {
        try {
            await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(newHabits));
            setHabits(newHabits);
        } catch (e) {
            console.error('Failed to save habits', e);
        }
    };

    const addHabit = async (title: string, icon: string) => {
        const newHabit: Habit = {
            id: Math.random().toString(36).substring(7),
            title,
            icon,
            streak: 0,
            createdAt: new Date().toISOString(),
            completedDates: [],
        };
        const updated = [...habits, newHabit];
        await saveHabits(updated);
    };

    const toggleHabit = async (id: string) => {
        const now = new Date();
        const todayStr = now.toISOString();

        const updated = habits.map(h => {
            if (h.id === id) {
                let newDates = [...h.completedDates];
                if (isCompletedToday(h)) {
                    // Remove today's completion (uncheck)
                    newDates = newDates.filter(d => {
                        const date = new Date(d);
                        return !(date.getFullYear() === now.getFullYear() &&
                            date.getMonth() === now.getMonth() &&
                            date.getDate() === now.getDate());
                    });
                } else {
                    // Add today's completion
                    newDates.push(todayStr);
                }
                return {
                    ...h,
                    completedDates: newDates,
                    streak: calculateStreak(newDates)
                };
            }
            return h;
        });
        await saveHabits(updated);
    };

    const deleteHabit = async (id: string) => {
        const updated = habits.filter(h => h.id !== id);
        await saveHabits(updated);
    };

    const overallProgress = habits.length > 0
        ? habits.filter(h => isCompletedToday(h)).length / habits.length
        : 0;

    return (
        <HabitContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit, overallProgress }}>
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
