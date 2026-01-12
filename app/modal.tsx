import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from '../constants/theme';
import { useHabits } from '../context/HabitContext';

const COMMON_ICONS = ['✨', '🏃‍♂️', '💧', '📚', '🧘‍♀️', '🥦', '🛌', '💡', '🍎', '🍵', '🏋️‍♀️', '🎸'];

export default function ModalScreen() {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('✨');
  const { addHabit } = useHabits();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const handleCreate = async () => {
    if (title.trim()) {
      await addHabit(title.trim(), icon);
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.icon }]}>Habit Name</Text>
        <TextInput
          style={[styles.input, { color: colors.onSurface, borderColor: colors.primaryContainer, backgroundColor: colors.surface }]}
          placeholder="e.g. Daily Meditation"
          placeholderTextColor={colors.icon}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.icon }]}>Select Icon</Text>
        <FlatList
          data={COMMON_ICONS}
          numColumns={4}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.iconItem,
                { backgroundColor: colors.surface },
                icon === item && { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primaryContainer }
              ]}
              onPress={() => setIcon(item)}
            >
              <Text style={styles.iconText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.iconList}
        />
      </View>

      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: colors.primary }, !title && { opacity: 0.5 }]}
        onPress={handleCreate}
        disabled={!title}
      >
        <Text style={styles.createButtonText}>Create Habit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={[styles.cancelButtonText, { color: colors.icon }]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  input: {
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '500',
    borderWidth: 1,
  },
  iconList: {
    alignItems: 'center',
  },
  iconItem: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconText: {
    fontSize: 32,
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
});
