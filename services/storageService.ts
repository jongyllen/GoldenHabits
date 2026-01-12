import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../models/Habit';

const HABITS_STORAGE_KEY = '@golden_habits_data';

export interface StorageData {
    active: Habit[];
    archived: Habit[];
}

export const storageService = {
    async saveHabits(active: Habit[], archived: Habit[]): Promise<void> {
        try {
            await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify({ active, archived }));
        } catch (e) {
            console.error('Failed to save habits', e);
            throw e;
        }
    },

    async loadHabits(): Promise<StorageData | null> {
        try {
            const stored = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            return null;
        } catch (e) {
            console.error('Failed to load habits', e);
            return null;
        }
    },

    async clearAll(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.error('Failed to clear storage', e);
            throw e;
        }
    }
};
