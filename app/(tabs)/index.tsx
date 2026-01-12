import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HabitTile from '../../components/HabitTile';
import ProgressCard from '../../components/ProgressCard';
import { Colors } from '../../constants/theme';
import { useHabits } from '../../context/HabitContext';
import { Habit } from '../../models/Habit';

export default function HomeScreen() {
  const { habits, overallProgress, reorderHabits } = useHabits();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const router = useRouter();
  const confettiRef = useRef<any>(null);
  const [hasCelebratedToday, setHasCelebratedToday] = useState(false);

  useEffect(() => {
    if (overallProgress === 1 && habits.length > 0 && !hasCelebratedToday) {
      confettiRef.current?.start();
      setHasCelebratedToday(true);
    } else if (overallProgress < 1) {
      setHasCelebratedToday(false);
    }
  }, [overallProgress, habits.length, hasCelebratedToday]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
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
                <Text style={[styles.title, { color: colors.primary }]}>GoldenHabits</Text>
                <Text style={[styles.subtitle, { color: colors.onSurface }]}>Your Progress</Text>
              </View>

              <ProgressCard progress={overallProgress} />

              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Today's Habits</Text>
              </View>

              {habits.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Ionicons name="sparkles-outline" size={64} color={colors.primary} style={{ opacity: 0.3 }} />
                  <Text style={[styles.emptyText, { color: colors.icon }]}>
                    No habits yet. Start something new!
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
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/modal')}
        >
          <Ionicons name="add" size={30} color="#FFF" />
          <Text style={styles.fabLabel}>Add Habit</Text>
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
    marginTop: 8,
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
