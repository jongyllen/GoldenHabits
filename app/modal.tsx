import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';

const COMMON_ICONS = ['✨', '🏃‍♂️', '💧', '📚', '🧘‍♀️', '🥦', '🛌', '💡', '🍎', '🍵', '🏋️‍♀️', '🎸'];

export default function ModalScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { habits, addHabit, archivedHabits, restoreHabit, updateHabit, deleteHabit } = useHabits();
  const { colors } = useTheme();

  const existingHabit = id ? habits.find(h => h.id === id) : null;
  const [title, setTitle] = useState(existingHabit?.title || '');
  const [icon, setIcon] = useState(existingHabit?.icon || '✨');
  const [goalDaysPerWeek, setGoalDaysPerWeek] = useState(existingHabit?.goalDaysPerWeek || 7);
  const [targetValue, setTargetValue] = useState(existingHabit?.targetValue?.toString() || '');
  const [unit, setUnit] = useState(existingHabit?.unit || '');

  const [showReminder, setShowReminder] = useState(!!existingHabit?.reminderTime);
  const [reminderDate, setReminderDate] = useState(() => {
    if (existingHabit?.reminderTime) {
      const [h, m] = existingHabit.reminderTime.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    }
    const d = new Date();
    d.setHours(9, 0, 0, 0); // Default 9 AM
    return d;
  });
  const [showPicker, setShowPicker] = useState(false);

  const router = useRouter();

  const handleSave = async () => {
    if (title.trim()) {
      const reminderTime = showReminder
        ? `${reminderDate.getHours().toString().padStart(2, '0')}:${reminderDate.getMinutes().toString().padStart(2, '0')}`
        : undefined;

      const numericTarget = targetValue ? parseInt(targetValue, 10) : undefined;

      if (id) {
        await updateHabit(id, title.trim(), icon, goalDaysPerWeek, numericTarget, unit, reminderTime);
      } else {
        await addHabit(title.trim(), icon, goalDaysPerWeek, numericTarget, unit, reminderTime);
      }
      router.back();
    }
  };

  const handleRestore = async (id: string) => {
    await restoreHabit(id);
    router.back();
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {archivedHabits.length > 0 && !id && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.icon }]}>From History</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionList}>
              {archivedHabits.map(habit => (
                <View key={habit.id} style={styles.suggestionWrapper}>
                  <TouchableOpacity
                    style={[styles.suggestionItem, { backgroundColor: colors.surface, borderColor: colors.primaryContainer }]}
                    onPress={() => handleRestore(habit.id)}
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
        )}

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

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.icon }]}>Daily Reminder</Text>
            <TouchableOpacity onPress={() => setShowReminder(!showReminder)}>
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
              onPress={() => setShowPicker(!showPicker)}
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
                  if (Platform.OS === 'android') setShowPicker(false);
                  if (date) setReminderDate(date);
                }}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.icon }]}>Quantitative Goal (Optional)</Text>
          <Text style={[styles.helperText, { color: colors.icon }]}>e.g. 5 glasses, 15 pushups, 30 minutes</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 12, color: colors.onSurface, borderColor: colors.primaryContainer, backgroundColor: colors.surface }]}
              placeholder="Amount (e.g. 10)"
              placeholderTextColor={colors.icon}
              value={targetValue}
              onChangeText={setTargetValue}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { flex: 2, color: colors.onSurface, borderColor: colors.primaryContainer, backgroundColor: colors.surface }]}
              placeholder="Unit (e.g. mins)"
              placeholderTextColor={colors.icon}
              value={unit}
              onChangeText={setUnit}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.icon }]}>Weekly Goal</Text>
          <Text style={[styles.helperText, { color: colors.icon }]}>How many days per week do you want to do this?</Text>
          <View style={styles.frequencyContainer}>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.frequencyItem,
                  { backgroundColor: colors.surface, borderColor: colors.primaryContainer },
                  goalDaysPerWeek === num && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => setGoalDaysPerWeek(num)}
              >
                <Text style={[
                  styles.frequencyText,
                  { color: goalDaysPerWeek === num ? '#FFF' : colors.onSurface }
                ]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.icon }]}>Select Icon</Text>
          <View style={styles.iconGrid}>
            {COMMON_ICONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.iconItem,
                  { backgroundColor: colors.surface },
                  icon === item && { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primaryContainer }
                ]}
                onPress={() => setIcon(item)}
              >
                <Text style={styles.iconText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }, !title && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={!title}
        >
          <Text style={styles.createButtonText}>{id ? 'Save Changes' : 'Create Habit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelButtonText, { color: colors.icon }]}>Cancel</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
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
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  frequencyItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  frequencyText: {
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    opacity: 0.8,
  },
  input: {
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '500',
    borderWidth: 1,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconItem: {
    width: '21%',
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconText: {
    fontSize: 28,
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
  bottomSpacer: {
    height: 40,
  },
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
  createButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelButton: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionList: {
    paddingRight: 24,
  },
  suggestionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
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
  suggestionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth: 120,
  },
});
