import { useExercises } from "@/context/ExercisesContext";
import { ExerciseData, MuscleGroup } from "@/data/exercises";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Chip, Text, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const muscleGroupOptions: ExerciseData["muscleGroup"][] = [
  "Chest",
  "Back",
  "Biceps",
  "Triceps",
  "Shoulders",
  "Forearm",
  "Core",
  "Quadriceps",
  "Hamstrings",
  "Calves",
  "Cardio"
];

export default function AddExerciseScreen() {
  const theme = useTheme();
  const { addCustomExercise } = useExercises();

  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>();

  const handleSave = () => {
    if (!name.trim() || !muscleGroup) {
      return;
    }
    addCustomExercise(name, muscleGroup);
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <TextInput
          label="Exercise Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.label}>
          Muscle Group
        </Text>

        <View style={styles.chipContainer}>
          {muscleGroupOptions.map((group) => (
            <Chip
              key={group}
              mode="outlined"
              style={styles.chip}
              selected={muscleGroup === group}
              onPress={() => setMuscleGroup(group)}
            >
              {group}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          contentStyle={styles.buttonContent}
        >
          Save Exercise
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginBottom: 12,
  },
  input: {
    marginBottom: 24,
  },
  // --- NEW STYLES FOR THE CHIP GRID ---
  chipContainer: {
    flexDirection: "row", // Arrange items horizontally
    flexWrap: "wrap", // Allow items to wrap to the next line
    gap: 8, // Add a gap between chips
  },
  chip: {
    // Chips will size themselves based on their content
  },
  buttonContainer: {
    padding: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
