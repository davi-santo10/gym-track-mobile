import React, { useState, useMemo } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { Appbar, FAB, IconButton, List, Searchbar, Text, useTheme } from 'react-native-paper';
import { useExercises } from '@/context/ExercisesContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExerciseData } from '@/data/exercises';
import { router } from 'expo-router';

export function ExercisesScreen() {
  const { exercises, deleteCustomExercise } = useExercises();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme()

  const sections = useMemo(() => {
    const filtered = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const grouped = filtered.reduce((acc, exercise) => {
      const group = exercise.muscleGroup;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(exercise);
      return acc;
    }, {} as Record<string, ExerciseData[]>);

    return Object.keys(grouped).map(muscleGroup => ({
      title: muscleGroup,
      data: grouped[muscleGroup],
    }));
  }, [exercises, searchQuery]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Appbar.Header>
        <Appbar.Content title="Exercise Library" />
      </Appbar.Header>
      <Searchbar
        placeholder="Search for an exercise"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <SectionList
        sections={sections} 
        keyExtractor={(item, index) => item.id + index}
        contentContainerStyle={styles.listContent}
        
        renderItem={({ item }) => (
			<List.Item
			  title={item.name}
			  description={item.muscleGroup}
			  right={() =>
				item.id.startsWith('custom-') ? (
				  <IconButton
					icon="delete-outline"
					onPress={() => deleteCustomExercise(item.id)}
				  />
				) :
				null
			  }
			/>
		  )}
        
        renderSectionHeader={({ section: { title } }) => (
			<View style={[styles.sectionHeaderContainer, { backgroundColor: theme.colors.background }]}>
            <Text 
              variant="titleMedium" 
              style={[styles.sectionHeaderText, { color: theme.colors.primary }]}
            >
              {title}
            </Text>
          </View>
        )}
        
        // This renders if the list is empty
        ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
                <Text variant='bodyMedium'>No exercises found.</Text>
            </View>
        )}
      />

      <FAB
        icon="plus"
        label="Add Custom"
        style={styles.fab}
        onPress={() => router.push(`/add-exercise`)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchbar: { marginHorizontal: 8, marginTop: 8 },
  listContent: { paddingBottom: 80 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  sectionHeaderContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontWeight: 'bold',
  },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});