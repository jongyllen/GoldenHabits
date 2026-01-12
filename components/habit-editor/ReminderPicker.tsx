import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ReminderPickerProps {
    showReminder: boolean;
    reminderDate: Date;
    showPicker: boolean;
    onToggleReminder: () => void;
    onTogglePicker: () => void;
    onDateChange: (date: Date) => void;
}

export const ReminderPicker: React.FC<ReminderPickerProps> = ({
    showReminder,
    reminderDate,
    showPicker,
    onToggleReminder,
    onTogglePicker,
    onDateChange,
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.section}>
            <View style={styles.row}>
                <Text style={[styles.label, { color: colors.icon }]}>Daily Reminder</Text>
                <TouchableOpacity onPress={onToggleReminder}>
                    <Ionicons
                        name={showReminder ? "notifications" : "notifications-off-outline"}
                        size={24}
                        color={showReminder ? colors.primary : colors.icon}
                    />
                </TouchableOpacity>
            </View>

            {showReminder && (
                <TouchableOpacity
                    style={[styles.timeButton, { backgroundColor: colors.surface, borderColor: colors.primaryContainer }]}
                    onPress={onTogglePicker}
                >
                    <Text style={[styles.timeText, { color: colors.onSurface }]}>
                        {reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <View style={styles.timeLabelContainer}>
                        <Text style={[styles.tapToChange, { color: colors.primary }]}>{showPicker ? 'Done' : 'Change'}</Text>
                        <Ionicons name="time-outline" size={20} color={colors.primary} />
                    </View>
                </TouchableOpacity>
            )}

            {showReminder && showPicker && (
                <View style={styles.pickerContainer}>
                    <DateTimePicker
                        value={reminderDate}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, date) => {
                            if (Platform.OS === 'android' && event.type === 'set') onTogglePicker();
                            if (date) onDateChange(date);
                        }}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    timeText: {
        fontSize: 18,
        fontWeight: '600',
    },
    timeLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tapToChange: {
        fontSize: 14,
        fontWeight: '600',
    },
    pickerContainer: {
        marginTop: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
});
