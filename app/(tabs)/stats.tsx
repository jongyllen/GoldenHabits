import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import BentoStatCard from '../../components/BentoStatCard';
import HeatmapGrid from '../../components/HeatmapGrid';
import { useHabits } from '../../context/HabitContext';
import { useTheme } from '../../context/ThemeContext';

export default function StatsScreen() {
  const { habits } = useHabits();
  const { colors } = useTheme();

  const stats = useMemo(() => {
    const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
    const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
    const activeHabits = habits.length;

    // Unique days active
    const allCompletedDates = habits.flatMap(h => h.completedDates);
    const uniqueDates = new Set(allCompletedDates.map(d => new Date(d).toDateString())).size;

    return {
      totalCompletions,
      bestStreak,
      activeHabits,
      uniqueDates
    };
  }, [habits]);

  const heatmapData = useMemo(() => {
    const data: Record<string, number> = {};
    const totalHabits = habits.length;
    if (totalHabits === 0) return data;

    habits.forEach(habit => {
      habit.completedDates.forEach(dateStr => {
        const dateKey = new Date(dateStr).toDateString();
        data[dateKey] = (data[dateKey] || 0) + (1 / totalHabits);
      });
    });
    return data;
  }, [habits]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerSubtitle, { color: colors.icon }]}>YOUR INSIGHTS</Text>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Progress <Text style={{ color: colors.primary }}>Hub</Text></Text>
        </View>

        <View style={styles.bentoGrid}>
          <View style={styles.row}>
            <BentoStatCard
              title="Best Streak"
              value={stats.bestStreak}
              icon="flame"
              subtitle="Days in a row"
              gradient={colors.goldGradient}
            />
            <BentoStatCard
              title="Total Done"
              value={stats.totalCompletions}
              icon="checkmark-done"
              subtitle="Completions"
              gradient={colors.tealGradient}
            />
          </View>
          <View style={[styles.row, { marginTop: -4 }]}>
            <BentoStatCard
              title="Active"
              value={stats.activeHabits}
              icon="list"
              subtitle="Working on"
            />
            <BentoStatCard
              title="Active Days"
              value={stats.uniqueDates}
              icon="calendar"
              subtitle="Lifetime"
            />
          </View>
        </View>

        <HeatmapGrid data={heatmapData} daysToShow={91} />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Habit Analysis</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.icon }]}>Track your consistency vs goals</Text>
        </View>

        {habits.map(habit => {
          // Calculate completions this week (starting from last Sunday)
          const now = new Date();
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);

          const weekCompletions = habit.completedDates.filter(d => new Date(d) >= startOfWeek).length;
          const progress = Math.min(1, weekCompletions / (habit.goalDaysPerWeek || 7));

          return (
            <View key={habit.id} style={[styles.habitDetailCard, { backgroundColor: colors.surface }, colors.cardShadow]}>
              <View style={styles.habitHeader}>
                <View style={[styles.habitIconWrapper, { backgroundColor: colors.primaryContainer }]}>
                  <Text style={styles.habitIcon}>{habit.icon}</Text>
                </View>
                <View style={styles.habitNameContainer}>
                  <Text style={[styles.habitName, { color: colors.onSurface }]}>{habit.title}</Text>
                  <Text style={[styles.habitMeta, { color: colors.icon }]}>
                    {habit.goalDaysPerWeek || 7} days/week goal
                  </Text>
                </View>
                <View style={styles.rateBadge}>
                  <Text style={[styles.rateValue, { color: colors.primary }]}>{weekCompletions}/{habit.goalDaysPerWeek || 7}</Text>
                  <Text style={[styles.rateLabel, { color: colors.icon }]}>This Week</Text>
                </View>
              </View>

              <View style={styles.habitProgressTrack}>
                <View style={[styles.habitProgressBar, {
                  backgroundColor: colors.primary,
                  width: `${progress * 100}%`
                }]} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.habitProgressLabel, { color: colors.icon }]}>
                  {progress === 1 ? 'Goal Met! ✨' : `${habit.streak} day streak 🔥`}
                </Text>
                <Text style={[styles.habitProgressLabel, { color: colors.icon, fontWeight: '700' }]}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
            </View>
          )
        })}

        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={48} color={colors.icon} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyText, { color: colors.icon }]}>No data to analyze yet</Text>
          </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  bentoGrid: {
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.6,
  },
  habitDetailCard: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitIcon: {
    fontSize: 22,
  },
  habitNameContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  habitMeta: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  rateBadge: {
    alignItems: 'flex-end',
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  rateLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  habitProgressTrack: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  habitProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  habitProgressLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
});
