import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HabitTile from '../../components/HabitTile';
import ProgressCard from '../../components/ProgressCard';
import { useHabits } from '../../context/HabitContext';
import { useTheme } from '../../context/ThemeContext';
import { Habit, isCompletedToday } from '../../models/Habit';

export default function HomeScreen() {
  const { habits, reorderHabits, overallProgress } = useHabits();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const confettiRef = useRef<any>(null);
  const [hasCelebratedToday, setHasCelebratedToday] = useState(false);

  const totalHabitsCount = habits.length;
  const completedHabitsCount = habits.filter(h => isCompletedToday(h)).length;

  useEffect(() => {
    const completedCount = habits.filter(h => isCompletedToday(h)).length;
    const progress = habits.length > 0 ? completedCount / habits.length : 0;

    if (progress === 1 && !hasCelebratedToday && habits.length > 0) {
      confettiRef.current?.start();
      setHasCelebratedToday(true);
    }
  }, [habits, hasCelebratedToday]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack.Screen options={{ headerShown: false }} />

        <DraggableFlatList
          data={habits}
          onDragEnd={({ data }) => reorderHabits(data)}
          keyExtractor={(item) => item.id}
          renderItem={({ item, drag, isActive }: RenderItemParams<Habit>) => (
            <ScaleDecorator>
              <TouchableOpacity
                onLongPress={drag}
                disabled={isActive}
                activeOpacity={1}
                style={{ marginBottom: 12 }}
              >
                <HabitTile habit={item} />
              </TouchableOpacity>
            </ScaleDecorator>
          )}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <View style={styles.header}>
                <Text style={[styles.dateText, { color: colors.icon }]}>{dateStr}</Text>
                <Text style={[styles.title, { color: colors.onSurface }]}>Golden<Text style={{ color: colors.primary }}>Habits</Text></Text>
                <Text style={[styles.subtitle, { color: colors.icon }]}>Your daily momentum</Text>
              </View>

              <ProgressCard
                progress={overallProgress}
                totalHabits={totalHabitsCount}
                completedHabits={completedHabitsCount}
              />

              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Today&apos;s Routine</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.icon }]}>Tap to complete, hold to reorder</Text>
              </View>

              {habits.length === 0 && (
                <View style={[styles.emptyContainer, { backgroundColor: colors.surface }, colors.cardShadow]}>
                  <View style={[styles.emptyIconContainer, { backgroundColor: colors.primaryContainer }]}>
                    <Ionicons name="sparkles" size={40} color={colors.primary} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>New Beginnings</Text>
                  <Text style={[styles.emptyText, { color: colors.icon }]}>
                    Your journey to golden habits starts here. Add your first habit to begin!
                  </Text>
                </View>
              )}
            </View>
          }
          ListFooterComponent={<View style={styles.footerSpacer} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        />

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/modal')}
          style={styles.fabWrapper}
        >
          <LinearGradient
            colors={colors.goldGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fab}
          >
            <Ionicons name="add" size={28} color="#FFF" />
            <Text style={styles.fabLabel}>Add Habit</Text>
          </LinearGradient>
        </TouchableOpacity>

        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut={true}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: 24,
  },
  header: {
    marginBottom: 28,
    marginTop: 20,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.6,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    padding: 32,
    borderRadius: 32,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  footerSpacer: {
    height: 120,
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 28,
  },
  fabLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: -0.2,
  },
});

