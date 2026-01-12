import * as Notifications from 'expo-notifications';
import { Habit } from '../models/Habit';
import { parseTimeString } from '../utils/dateUtils';
import { isHabitCompletedToday } from '../utils/habitUtils';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const notificationService = {
    async requestPermissions() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        return finalStatus === 'granted';
    },

    async cancelNotification(habitId: string) {
        for (let i = 0; i < 7; i++) {
            await Notifications.cancelScheduledNotificationAsync(`${habitId}-${i}`);
        }
    },

    async scheduleNotification(habit: Habit) {
        if (!habit.reminderTime) return;

        const hasPermission = await this.requestPermissions();
        if (!hasPermission) return;

        await this.cancelNotification(habit.id);

        const { hours, minutes } = parseTimeString(habit.reminderTime);

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            date.setHours(hours, minutes, 0, 0);

            // If it's today and already passed or already completed
            if (i === 0) {
                if (date < new Date() || isHabitCompletedToday(habit)) {
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
    },

    async syncAllNotifications(activeHabits: Habit[]) {
        for (const habit of activeHabits) {
            if (habit.reminderTime) {
                await this.scheduleNotification(habit);
            } else {
                await this.cancelNotification(habit.id);
            }
        }
    }
};
