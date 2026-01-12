import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import HabitTile from '../../components/HabitTile';
import ProgressCard from '../../components/ProgressCard';
import { Colors } from '../../constants/theme';
import { useHabits } from '../../context/HabitContext';

export default function HomeScreen() {
  const { habits, overallProgress } = useHabits();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.dateText, { color: colors.icon }]}>{dateStr}</Text>
          <Text style={[styles.title, { color: colors.primary }]}>GoldenHabits</Text>
          <Text style={[styles.subtitle, { color: colors.onSurface }]}>Your Progress</Text>
        </View>

        <ProgressCard progress={overallProgress} />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Today's Habits</Text>
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="sparkles-outline" size={64} color={colors.primary} style={{ opacity: 0.3 }} />
            <Text style={[styles.emptyText, { color: colors.icon }]}>
              No habits yet. Start something new!
            </Text>
          </View>
        ) : (
          habits.map(habit => (
            <HabitTile key={habit.id} habit={habit} />
          ))
        )}

        <View style={styles.footerSpacer} />
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/modal')}
      >
        <Ionicons name="add" size={30} color="#FFF" />
        <Text style={styles.fabLabel}>Add Habit</Text>
      </TouchableOpacity>
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
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  footerSpacer: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  fabLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
