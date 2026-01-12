export interface Habit {
  id: string;
  title: string;
  streak: number;
  createdAt: string; // ISO date string
  completedDates: string[]; // Array of ISO date strings (just YYYY-MM-DD or full ISO)
  icon: string;
  reminderTime?: string; // e.g., "08:30"
  notificationId?: string;
  goalDaysPerWeek: number; // e.g., 7 for every day
  targetValue?: number; // e.g., 5
  unit?: string; // e.g., "glasses"
  progressLog?: Record<string, number>; // date string -> current count
}

export const isCompletedToday = (habit: Habit): boolean => {
  const now = new Date();
  const todayStr = now.toDateString();

  // If it's a quantitative habit, completion depends on the progressLog
  if (habit.targetValue && habit.progressLog) {
    const currentProgress = habit.progressLog[todayStr] || 0;
    if (currentProgress >= habit.targetValue) {
      // Ensure the todayStr (or ISO equivalent) is in completedDates for streak calculation
      // However, for consistency with current logic, lets check completedDates first
      // Actually, we'll make HabitContext manage both.
    }
  }

  if (!habit.completedDates || habit.completedDates.length === 0) return false;

  const lastCompletionStr = habit.completedDates[habit.completedDates.length - 1];
  const lastCompletion = new Date(lastCompletionStr);

  return (
    lastCompletion.getFullYear() === now.getFullYear() &&
    lastCompletion.getMonth() === now.getMonth() &&
    lastCompletion.getDate() === now.getDate()
  );
};

export const calculateStreak = (completedDates: string[]): number => {
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
