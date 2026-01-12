import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from '../../constants/theme';
import { useHabits } from '../../context/HabitContext';

export default function StatsScreen() {
  const { habits, debugShiftDates } = useHabits();
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

        {habits.map(habit => {
          const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date;
          });

          return (
            <View key={habit.id} style={[styles.habitStatCard, { backgroundColor: colors.surface }]}>
              <View style={styles.habitStatHeader}>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitIcon}>{habit.icon}</Text>
                  <Text style={[styles.habitTitle, { color: colors.onSurface }]}>{habit.title}</Text>
                </View>
                <View style={styles.habitData}>
                  <Text style={[styles.habitStreak, { color: colors.primary }]}>{habit.streak} 🔥</Text>
                  <Text style={[styles.habitTotal, { color: colors.icon }]}>{habit.completedDates.length} total</Text>
                </View>
              </View>

              <View style={styles.weeklyGrid}>
                {last7Days.map((date, i) => {
                  const isDone = habit.completedDates.some(d => {
                    const compDate = new Date(d);
                    return compDate.getFullYear() === date.getFullYear() &&
                      compDate.getMonth() === date.getMonth() &&
                      compDate.getDate() === date.getDate();
                  });

                  return (
                    <View key={i} style={styles.dayColumn}>
                      <View style={[
                        styles.dayCircle,
                        { borderColor: colors.primaryContainer },
                        isDone && { backgroundColor: colors.primary, borderColor: colors.primary }
                      ]}>
                        {isDone && <Ionicons name="checkmark" size={10} color="#FFF" />}
                      </View>
                      <Text style={[styles.dayLabel, { color: colors.icon }]}>
                        {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {habits.length === 0 && (
          <Text style={[styles.noneText, { color: colors.icon }]}>No data to display yet.</Text>
        )}

        <View style={styles.debugSection}>
          <Text style={[styles.debugLabel, { color: colors.icon }]}>Debug Tools</Text>
          <TouchableOpacity
            style={[styles.debugButton, { backgroundColor: colors.secondaryContainer }]}
            onPress={async () => {
              await debugShiftDates();
              alert('Dates shifted back by 24h!');
            }}
          >
            <Ionicons name="time-outline" size={20} color={colors.secondary} />
            <Text style={[styles.debugButtonText, { color: colors.secondary }]}>Simulate Tomorrow</Text>
          </TouchableOpacity>
        </View>
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
  habitStatCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  habitStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  weeklyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  noneText: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  debugSection: {
    marginTop: 48,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 24,
  },
  debugLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 8,
  },
  debugButtonText: {
    fontSize: 16,
    fontWeight: '700',
  }
});
