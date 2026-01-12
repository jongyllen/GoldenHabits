import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Habit } from '../models/Habit';
import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';
import { isToday, toDateString, toISOString } from '../utils/dateUtils';
import { calculateHabitStreak, isHabitCompletedToday } from '../utils/habitUtils';

interface HabitContextType {
    habits: Habit[];
    archivedHabits: Habit[];
    addHabit: (title: string, icon: string, goalDaysPerWeek: number, targetValue?: number, unit?: string, reminderTime?: string) => Promise<void>;
    toggleHabit: (id: string) => Promise<void>;
    updateProgress: (id: string, delta: number) => Promise<void>;
    archiveHabit: (id: string) => Promise<void>;
    restoreHabit: (id: string) => Promise<void>;
    updateHabit: (id: string, title: string, icon: string, goalDaysPerWeek: number, targetValue?: number, unit?: string, reminderTime?: string) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;
    resetAllData: () => Promise<void>;
    reorderHabits: (newHabits: Habit[]) => Promise<void>;
    debugShiftDates: () => Promise<void>;
    overallProgress: number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [archivedHabits, setArchivedHabits] = useState<Habit[]>([]);

    const loadHabits = useCallback(async () => {
        const data = await storageService.loadHabits();
        if (data) {
            const refreshStreaks = (list: Habit[]) => list.map(h => ({
                ...h,
                goalDaysPerWeek: h.goalDaysPerWeek || 7,
                streak: calculateHabitStreak(h.completedDates)
            }));

            const refreshedActive = refreshStreaks(data.active || []);
            const refreshedArchived = refreshStreaks(data.archived || []);

            setHabits(refreshedActive);
            setArchivedHabits(refreshedArchived);

            notificationService.syncAllNotifications(refreshedActive);
        }
    }, []);

    useEffect(() => {
        loadHabits();
    }, [loadHabits]);

    const saveAndSync = useCallback(async (active: Habit[], archived: Habit[]) => {
        await storageService.saveHabits(active, archived);
        setHabits(active);
        setArchivedHabits(archived);
    }, []);

    const addHabit = useCallback(async (title: string, icon: string, goalDaysPerWeek: number, targetValue?: number, unit?: string, reminderTime?: string) => {
        const newHabit: Habit = {
            id: Math.random().toString(36).substring(7),
            title,
            icon,
            streak: 0,
            createdAt: toISOString(new Date()),
            completedDates: [],
            reminderTime,
            goalDaysPerWeek,
            targetValue,
            unit,
            progressLog: {},
        };
        const updated = [...habits, newHabit];
        await saveAndSync(updated, archivedHabits);

        if (reminderTime) {
            await notificationService.scheduleNotification(newHabit);
        }
    }, [habits, archivedHabits, saveAndSync]);

    const toggleHabit = useCallback(async (id: string) => {
        const now = new Date();
        const todayStr = toISOString(now);
        const todayKey = toDateString(now);

        const updated = habits.map(h => {
            if (h.id === id) {
                let newDates = [...h.completedDates];
                let newProgress = { ...(h.progressLog || {}) };
                const isDone = isHabitCompletedToday(h);

                if (isDone) {
                    newDates = newDates.filter(d => !isToday(new Date(d)));
                    if (h.targetValue) {
                        newProgress[todayKey] = 0;
                    }
                } else {
                    newDates.push(todayStr);
                    if (h.targetValue) {
                        newProgress[todayKey] = h.targetValue;
                    }
                }

                const updatedHabit = {
                    ...h,
                    completedDates: newDates,
                    progressLog: newProgress,
                    streak: calculateHabitStreak(newDates)
                };

                if (updatedHabit.reminderTime) {
                    notificationService.scheduleNotification(updatedHabit);
                }

                return updatedHabit;
            }
            return h;
        });
        await saveAndSync(updated, archivedHabits);
    }, [habits, archivedHabits, saveAndSync]);

    const updateProgress = useCallback(async (id: string, delta: number) => {
        const now = new Date();
        const todayStr = toISOString(now);
        const todayKey = toDateString(now);

        const updated = habits.map(h => {
            if (h.id === id && h.targetValue) {
                const currentProgress = (h.progressLog?.[todayKey] || 0);
                const newCount = Math.max(0, currentProgress + delta);

                let newDates = [...h.completedDates];
                const alreadyDone = isHabitCompletedToday(h);

                if (newCount >= h.targetValue && !alreadyDone) {
                    newDates.push(todayStr);
                } else if (newCount < h.targetValue && alreadyDone) {
                    newDates = newDates.filter(d => !isToday(new Date(d)));
                }

                const updatedHabit = {
                    ...h,
                    progressLog: {
                        ...(h.progressLog || {}),
                        [todayKey]: newCount
                    },
                    completedDates: newDates,
                    streak: calculateHabitStreak(newDates)
                };

                if (updatedHabit.reminderTime) {
                    notificationService.scheduleNotification(updatedHabit);
                }

                return updatedHabit;
            }
            return h;
        });
        await saveAndSync(updated, archivedHabits);
    }, [habits, archivedHabits, saveAndSync]);

    const archiveHabit = useCallback(async (id: string) => {
        const habitToArchive = habits.find(h => h.id === id);
        if (!habitToArchive) return;

        await notificationService.cancelNotification(habitToArchive.id);

        const newActive = habits.filter(h => h.id !== id);
        const newArchived = [{ ...habitToArchive, notificationId: undefined }, ...archivedHabits];
        await saveAndSync(newActive, newArchived);
    }, [habits, archivedHabits, saveAndSync]);

    const restoreHabit = useCallback(async (id: string) => {
        const habitToRestore = archivedHabits.find(h => h.id === id);
        if (!habitToRestore) return;

        const newArchived = archivedHabits.filter(h => h.id !== id);
        const newActive = [habitToRestore, ...habits];
        await saveAndSync(newActive, newArchived);

        if (habitToRestore.reminderTime) {
            await notificationService.scheduleNotification(habitToRestore);
        }
    }, [habits, archivedHabits, saveAndSync]);

    const deleteHabit = useCallback(async (id: string) => {
        const newArchived = archivedHabits.filter(h => h.id !== id);
        await saveAndSync(habits, newArchived);
    }, [habits, archivedHabits, saveAndSync]);

    const resetAllData = useCallback(async () => {
        await storageService.clearAll();
        setHabits([]);
        setArchivedHabits([]);
    }, []);

    const reorderHabits = useCallback(async (newHabits: Habit[]) => {
        await saveAndSync(newHabits, archivedHabits);
    }, [archivedHabits, saveAndSync]);

    const updateHabit = useCallback(async (id: string, title: string, icon: string, goalDaysPerWeek: number, targetValue?: number, unit?: string, reminderTime?: string) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;
        const updatedHabit: Habit = { ...habit, title, icon, reminderTime, goalDaysPerWeek, targetValue, unit };
        const updated = habits.map(h => h.id === id ? updatedHabit : h);
        await saveAndSync(updated, archivedHabits);

        if (reminderTime) {
            await notificationService.scheduleNotification(updatedHabit);
        } else if (habit.reminderTime) {
            await notificationService.cancelNotification(id);
        }
    }, [habits, archivedHabits, saveAndSync]);

    const debugShiftDates = useCallback(async () => {
        const shiftAll = (list: Habit[]) => list.map(h => {
            const shiftDate = (d: string) => {
                const date = new Date(d);
                date.setDate(date.getDate() - 1);
                return date.toISOString();
            };

            const shiftLogKey = (key: string) => {
                const date = new Date(key);
                date.setDate(date.getDate() - 1);
                return toDateString(date);
            };

            const newDates = h.completedDates.map(shiftDate);
            const newProgress: Record<string, number> = {};
            if (h.progressLog) {
                Object.entries(h.progressLog).forEach(([key, val]) => {
                    newProgress[shiftLogKey(key)] = val;
                });
            }

            return {
                ...h,
                createdAt: shiftDate(h.createdAt),
                completedDates: newDates,
                progressLog: newProgress,
                streak: calculateHabitStreak(newDates)
            };
        });

        await saveAndSync(shiftAll(habits), shiftAll(archivedHabits));
    }, [habits, archivedHabits, saveAndSync, saveAndSync]);

    const overallProgress = useMemo(() =>
        habits.length > 0
            ? habits.filter(h => isHabitCompletedToday(h)).length / habits.length
            : 0
        , [habits]);

    return (
        <HabitContext.Provider value={{
            habits,
            archivedHabits,
            addHabit,
            toggleHabit,
            updateProgress,
            archiveHabit,
            restoreHabit,
            updateHabit,
            deleteHabit,
            resetAllData,
            reorderHabits,
            debugShiftDates,
            overallProgress
        }}>
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

