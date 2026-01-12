import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GoalSettings } from '../components/habit-editor/GoalSettings';
import { IconPicker } from '../components/habit-editor/IconPicker';
import { ReminderPicker } from '../components/habit-editor/ReminderPicker';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { formatTime, parseTimeString } from '../utils/dateUtils';

export default function ModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { habits, addHabit, archivedHabits, restoreHabit, updateHabit, deleteHabit } = useHabits();
  const { colors } = useTheme();
  const router = useRouter();

  const existingHabit = useMemo(() => id ? habits.find(h => h.id === id) : null, [id, habits]);

  const [title, setTitle] = useState(existingHabit?.title || '');
  const [icon, setIcon] = useState(existingHabit?.icon || '✨');
  const [goalDaysPerWeek, setGoalDaysPerWeek] = useState(existingHabit?.goalDaysPerWeek || 7);
  const [targetValue, setTargetValue] = useState(existingHabit?.targetValue?.toString() || '');
  const [unit, setUnit] = useState(existingHabit?.unit || '');

  const [showReminder, setShowReminder] = useState(!!existingHabit?.reminderTime);
  const [reminderDate, setReminderDate] = useState(() => {
    if (existingHabit?.reminderTime) {
      const { hours, minutes } = parseTimeString(existingHabit.reminderTime);
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return d;
    }
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [showPicker, setShowPicker] = useState(false);

  const handleSave = async () => {
    if (title.trim()) {
      const reminderTime = showReminder ? formatTime(reminderDate.getHours(), reminderDate.getMinutes()) : undefined;
      const numericTarget = targetValue ? parseInt(targetValue, 10) : undefined;

      if (id) {
        await updateHabit(id, title.trim(), icon, goalDaysPerWeek, numericTarget, unit, reminderTime);
      } else {
        await addHabit(title.trim(), icon, goalDaysPerWeek, numericTarget, unit, reminderTime);
      }
      router.back();
    }
  };

  const handleDeleteHistory = (habit: any) => {
    Alert.alert(
      'Delete from History',
      `Permanently delete "${habit.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
      ]
    );
  };

  const renderHistory = () => {
    if (archivedHabits.length === 0 || id) return null;
    return (
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.icon }]}>From History</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionList}>
          {archivedHabits.map(habit => (
            <View key={habit.id} style={styles.suggestionWrapper}>
              <TouchableOpacity
                style={[styles.suggestionItem, { backgroundColor: colors.surface, borderColor: colors.primaryContainer }]}
                onPress={() => { restoreHabit(habit.id); router.back(); }}
              >
                <Text style={styles.suggestionIcon}>{habit.icon}</Text>
                <Text style={[styles.suggestionTitle, { color: colors.onSurface }]} numberOfLines={1}>{habit.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteHistoryButton, { backgroundColor: colors.surface, borderColor: colors.primaryContainer }]}
                onPress={() => handleDeleteHistory(habit)}
              >
                <Ionicons name="close-circle" size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderHistory()}

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.icon }]}>Habit Name</Text>
          <TextInput
            style={[styles.input, { color: colors.onSurface, borderColor: colors.primaryContainer, backgroundColor: colors.surface }]}
            placeholder="e.g. Daily Meditation"
            placeholderTextColor={colors.icon}
            value={title}
            onChangeText={setTitle}
            autoFocus={archivedHabits.length === 0}
          />
        </View>

        <ReminderPicker
          showReminder={showReminder}
          reminderDate={reminderDate}
          showPicker={showPicker}
          onToggleReminder={() => setShowReminder(!showReminder)}
          onTogglePicker={() => setShowPicker(!showPicker)}
          onDateChange={setReminderDate}
        />

        <GoalSettings
          targetValue={targetValue}
          unit={unit}
          goalDaysPerWeek={goalDaysPerWeek}
          onTargetValueChange={setTargetValue}
          onUnitChange={setUnit}
          onGoalDaysChange={setGoalDaysPerWeek}
        />

        <IconPicker selectedIcon={icon} onSelect={setIcon} />

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }, !title && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={!title}
        >
          <Text style={styles.createButtonText}>{id ? 'Save Changes' : 'Create Habit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={[styles.cancelButtonText, { color: colors.icon }]}>Cancel</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { padding: 24 },
  section: { marginBottom: 32 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  input: {
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '500',
    borderWidth: 1,
  },
  suggestionList: { paddingRight: 24 },
  suggestionWrapper: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 12,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1,
    borderRightWidth: 0,
  },
  deleteHistoryButton: {
    paddingVertical: 12,
    paddingRight: 12,
    paddingLeft: 4,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionIcon: { fontSize: 20, marginRight: 8 },
  suggestionTitle: { fontSize: 14, fontWeight: '600', maxWidth: 120 },
  bottomSpacer: { height: 40 },
  createButton: {
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  createButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  cancelButton: { height: 60, alignItems: 'center', justifyContent: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600' },
});

