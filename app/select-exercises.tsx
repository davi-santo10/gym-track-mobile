import React, { useMemo, useState } from 'react';
import { SectionList, StyleSheet, View, Keyboard } from 'react-native';
import { Checkbox, List, Searchbar, useTheme, Text, FAB } from 'react-native-paper';
import { useExercises } from '@/context/ExercisesContext';
import { useRoutineBuilder } from '@/context/RoutineBuilderContext';
import { router } from 'expo-router';
import { ExerciseData } from '@/data/exercises';

export default function SelectExercisesScreen() {
  const theme = useTheme();
  const { exercises: exerciseLibrary } = useExercises();
  const { exercises: selectedExercises, addExercise, removeExercise } = useRoutineBuilder();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedIds = useMemo(() => new Set(selectedExercises.map(e => e.id)), [selectedExercises]);

  const sections = useMemo(() => {
    const filtered = exerciseLibrary.filter(exercise =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const grouped = filtered.reduce((acc, exercise) => {
      const group = exercise.muscleGroup;
      if (!acc[group]) acc[group] = [];
      acc[group].push(exercise);
      return acc;
    }, {} as Record<string, ExerciseData[]>);
    return Object.keys(grouped).map(muscleGroup => ({
      title: muscleGroup,
      data: grouped[muscleGroup],
    }));
  }, [exerciseLibrary, searchQuery]);

  return (
    // The entire screen is now just the content, the header is handled by the layout file.
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <Searchbar
            placeholder="Search exercise library"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text
            variant="titleMedium"
            style={[styles.sectionHeader, { color: theme.colors.primary }]}
          >
            {title}
          </Text>
        )}
        renderItem={({ item }) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <List.Item
              title={item.name}
              description={item.muscleGroup}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              onPress={() => {
                isSelected ? removeExercise(item.id) : addExercise(item);
              }}
              right={() => <Checkbox status={isSelected ? 'checked' : 'unchecked'} />}
            />
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text variant="bodyMedium">No exercises found.</Text>
          </View>
        )}
      />
      <FAB
        icon="plus"
        label="Create New"
        style={styles.fab}
        onPress={() => router.push('/add-exercise')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 96,
  },
  searchbar: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 16,
  },
});