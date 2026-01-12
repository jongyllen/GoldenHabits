import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useHabits } from '../../context/HabitContext';

export default function StatsScreen() {
  const { habits } = useHabits();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Habit Statistics', headerShown: true, headerLargeTitle: true }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="flame" size={32} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.onSurface }]}>{bestStreak}</Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Best Streak</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.secondaryContainer }]}>
            <Ionicons name="checkmark-done" size={32} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.onSurface }]}>{totalCompletions}</Text>
            <Text style={[styles.statLabel, { color: colors.icon }]}>Total Done</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>All Time Performance</Text>

        {habits.map(habit => (
          <View key={habit.id} style={[styles.habitStatRow, { borderBottomColor: colors.primaryContainer }]}>
            <View style={styles.habitInfo}>
              <Text style={styles.habitIcon}>{habit.icon}</Text>
              <Text style={[styles.habitTitle, { color: colors.onSurface }]}>{habit.title}</Text>
            </View>
            <View style={styles.habitData}>
              <Text style={[styles.habitStreak, { color: colors.primary }]}>{habit.streak} 🔥</Text>
              <Text style={[styles.habitTotal, { color: colors.icon }]}>{habit.completedDates.length} total</Text>
            </View>
          </View>
        ))}

        {habits.length === 0 && (
          <Text style={[styles.noneText, { color: colors.icon }]}>No data to display yet.</Text>
        )}
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    padding: 24,
    borderRadius: 28,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  habitStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  habitData: {
    alignItems: 'flex-end',
  },
  habitStreak: {
    fontSize: 16,
    fontWeight: '700',
  },
  habitTotal: {
    fontSize: 12,
    marginTop: 2,
  },
  noneText: {
    textAlign: 'center',
    marginTop: 40,
  }
});
