import { Habit } from '../models/Habit';
import { isToday, toDateString } from './dateUtils';

export const isHabitCompletedToday = (habit: Habit): boolean => {
    const now = new Date();
    const todayKey = toDateString(now);

    // If it's a quantitative habit, completion depends on the progressLog
    if (habit.targetValue && habit.progressLog) {
        const currentProgress = habit.progressLog[todayKey] || 0;
        if (currentProgress >= habit.targetValue) {
            return true;
        }
    }

    if (!habit.completedDates || habit.completedDates.length === 0) return false;

    const lastCompletionStr = habit.completedDates[habit.completedDates.length - 1];
    const lastCompletion = new Date(lastCompletionStr);

    return isToday(lastCompletion);
};

export const calculateHabitStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;

    // Sort dates in descending order and normalize to mid-day to avoid TZ issues
    const sortedDates = [...new Set(completedDates)]
        .map(d => new Date(d).setHours(12, 0, 0, 0))
        .sort((a, b) => b - a);

    let currentStreak = 0;
    const now = new Date().setHours(12, 0, 0, 0);
    const yesterday = new Date(now - 86400000).setHours(12, 0, 0, 0);

    // If not completed today and not completed yesterday, streak is 0
    if (sortedDates[0] < yesterday) return 0;

    for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date(sortedDates[0] - i * 86400000).setHours(12, 0, 0, 0);
        if (sortedDates[i] === expectedDate) {
            currentStreak++;
        } else {
            break;
        }
    }

    return currentStreak;
};
