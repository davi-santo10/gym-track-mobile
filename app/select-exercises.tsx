import { useExercises } from "@/context/ExercisesContext";
import { useRoutineBuilder } from "@/context/RoutineBuilderContext";
import { Exercise } from "@/context/RoutinesContext";
import { ExerciseData } from "@/data/exercises";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, SectionList, StyleSheet, View } from "react-native";
import {
  Checkbox,
  FAB,
  IconButton,
  List,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";

export default function SelectExercisesScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { exercises: exerciseLibrary } = useExercises();
  const { exercises: initialExercises, setBuilderExercises } =
    useRoutineBuilder();
  const [searchQuery, setSearchQuery] = useState("");

  const [localSelection, setLocalSelection] = useState(
    () => new Set(initialExercises.map((e) => e.id))
  );
  const handleToggleExercise = (exercise: ExerciseData) => {
    setLocalSelection((currentSelection) => {
      const newSelection = new Set(currentSelection);
      if (newSelection.has(exercise.id)) {
        newSelection.delete(exercise.id);
      } else {
        newSelection.add(exercise.id);
      }
      return newSelection;
    });
  };

  const handleConfirm = useCallback(() => {
    const newExercises: Exercise[] = [];
    exerciseLibrary.forEach((exercise) => {
      if (localSelection.has(exercise.id)) {
        const existingExercise = initialExercises.find(
          (ex) => ex.id === exercise.id
        );
        if (existingExercise) {
          newExercises.push(existingExercise);
        } else {
          newExercises.push({ ...exercise, sets: "3", reps: "10" });
        }
      }
    });

    setBuilderExercises(newExercises);
    navigation.goBack();
  }, [
    localSelection,
    exerciseLibrary,
    initialExercises,
    setBuilderExercises,
    navigation,
  ]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <IconButton icon="close" onPress={handleCancel} />,
    });
  }, [navigation, handleConfirm, handleCancel]);

  const sections = useMemo(() => {
    const filtered = exerciseLibrary.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const grouped = filtered.reduce((acc, exercise) => {
      const group = exercise.muscleGroup;
      if (!acc[group]) acc[group] = [];
      acc[group].push(exercise);
      return acc;
    }, {} as Record<string, ExerciseData[]>);
    return Object.keys(grouped).map((muscleGroup) => ({
      title: muscleGroup,
      data: grouped[muscleGroup],
    }));
  }, [exerciseLibrary, searchQuery]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
          const isSelected = localSelection.has(item.id);
          return (
            <List.Item
              title={item.name}
              description={item.muscleGroup}
              titleStyle={{ color: theme.colors.onSurface }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              onPress={() => handleToggleExercise(item)}
              right={() => (
                <Checkbox status={isSelected ? "checked" : "unchecked"} />
              )}
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
        icon="check"
        label="Add Exercises"
        style={styles.fab}
        onPress={handleConfirm}
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
    fontWeight: "bold",
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 16,
  },
});
