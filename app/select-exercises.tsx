// davi-santo10/gym-track-mobile/gym-track-mobile-a3c082c6a5f179f164780a4960a695da27fed457/app/select-exercises.tsx

import { useExercises } from "@/context/ExercisesContext";
import { useRoutineBuilder } from "@/context/RoutineBuilderContext";
import { Exercise } from "@/context/RoutinesContext";
import { ExerciseData } from "@/data/exercises";
import i18n from "@/lib/i18n";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox, FAB, Searchbar, Text, useTheme } from "react-native-paper";

export default function SelectExercisesScreen() {
  const theme = useTheme();
  const { exercises: exerciseLibrary } = useExercises();
  const { exercises: contextExercises, setBuilderExercises } =
    useRoutineBuilder();

  const [searchQuery, setSearchQuery] = useState("");
  // Local state for selected exercises (not immediately saved to context)
  const [localSelectedExercises, setLocalSelectedExercises] =
    useState<Exercise[]>(contextExercises);

  const selectedExerciseIds = useMemo(
    () => new Set(localSelectedExercises.map((e) => e.id)),
    [localSelectedExercises]
  );

  const filteredExercises = useMemo(() => {
    return exerciseLibrary.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exerciseLibrary, searchQuery]);

  const handleExerciseToggle = useCallback((item: ExerciseData) => {
    setLocalSelectedExercises((current) => {
      const existingIndex = current.findIndex((e) => e.id === item.id);
      if (existingIndex > -1) {
        // Remove exercise
        const newExercises = [...current];
        newExercises.splice(existingIndex, 1);
        return newExercises;
      } else {
        // Add exercise with default values
        const newExercise: Exercise = { ...item, sets: "3", reps: "10" };
        return [...current, newExercise];
      }
    });
  }, []);

  const handleConfirm = useCallback(() => {
    // Save changes to context
    setBuilderExercises(localSelectedExercises);
    router.back();
  }, [localSelectedExercises, setBuilderExercises]);

  // Override the back button behavior in the layout
  useFocusEffect(
    useCallback(() => {
      // This effect runs when the screen comes into focus
      // We'll use the layout's back button which just calls router.back()
      // No need to override it since it will just go back without saving
      return () => {
        // Cleanup function - nothing needed here
      };
    }, [])
  );

  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseData }) => {
      const isSelected = selectedExerciseIds.has(item.id);

      // Use Pressable for better touch handling on real devices
      const TouchComponent =
        Platform.OS === "android" ? Pressable : TouchableOpacity;

      return (
        <TouchComponent
          style={({ pressed }: { pressed?: boolean }) => [
            styles.listItem,
            {
              backgroundColor: pressed
                ? theme.colors.surfaceVariant
                : theme.colors.surface,
            },
          ]}
          onPress={() => handleExerciseToggle(item)}
          android_ripple={{
            color: theme.colors.surfaceVariant,
            borderless: false,
          }}
          // Immediate touch feedback with no delays
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          delayLongPress={500}
          unstable_pressDelay={0}
          pressRetentionOffset={{ top: 10, left: 10, bottom: 10, right: 10 }}
        >
          <View style={styles.itemContent} pointerEvents="none">
            <View style={styles.textContainer}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onSurface }}
              >
                {item.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {item.muscleGroup}
              </Text>
            </View>
            <Checkbox status={isSelected ? "checked" : "unchecked"} />
          </View>
        </TouchComponent>
      );
    },
    [selectedExerciseIds, handleExerciseToggle, theme.colors]
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Searchbar
          placeholder={String(i18n.t("searchExerciseLibrary"))}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        extraData={selectedExerciseIds}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Optimized for immediate responsiveness
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={1}
        windowSize={21}
        maxToRenderPerBatch={50}
        updateCellsBatchingPeriod={10}
        initialNumToRender={20}
        getItemLayout={(data, index) => ({
          length: 88, // minHeight + marginBottom
          offset: 88 * index,
          index,
        })}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text variant="bodyMedium">
              {String(i18n.t("noExercisesFound"))}
            </Text>
          </View>
        )}
      />

      <FAB
        icon="check"
        label={String(i18n.t("addExercises"))}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchbar: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 96,
    paddingHorizontal: 16,
  },
  listItem: {
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
    // Add minimum height for better touch targets
    minHeight: 80,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
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
