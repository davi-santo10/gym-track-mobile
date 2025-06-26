import { useExercises } from "@/context/ExercisesContext";
import { ExerciseType, MuscleGroup } from "@/data/exercises";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Chip,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const muscleGroupOptions: MuscleGroup[] = [
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
  "Cardio",
];

export default function AddExerciseScreen() {
  const theme = useTheme();
  const { addCustomExercise } = useExercises();

  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>();
  const [exerciseType, setExerciseType] = useState<ExerciseType>("strength");

  const handleSave = () => {
    if (!name.trim() || !muscleGroup) {
      return;
    }
    addCustomExercise(name, muscleGroup, exerciseType);
    router.back();
  };

  // Filter muscle groups based on exercise type
  const availableMuscleGroups =
    exerciseType === "cardio"
      ? (["Cardio"] as MuscleGroup[])
      : muscleGroupOptions.filter((group) => group !== "Cardio");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <TextInput
          label={i18n.t("exerciseName")}
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.label}>
          Exercise Type
        </Text>
        <SegmentedButtons
          value={exerciseType}
          onValueChange={(value) => {
            setExerciseType(value as ExerciseType);
            // Reset muscle group when changing exercise type
            setMuscleGroup(undefined);
          }}
          buttons={[
            {
              value: "strength",
              label: "Strength",
            },
            {
              value: "cardio",
              label: "Cardio",
            },
          ]}
          style={styles.segmentedButtons}
        />

        <Text variant="titleMedium" style={styles.label}>
          {i18n.t("muscleGroup")}
        </Text>

        <View style={styles.chipContainer}>
          {availableMuscleGroups.map((group) => (
            <Chip
              key={group}
              mode="outlined"
              style={styles.chip}
              selected={muscleGroup === group}
              onPress={() => setMuscleGroup(group)}
            >
              {i18n.t(`muscleGroups.${group}`)}
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
          {i18n.t("saveExercise")}
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
  segmentedButtons: {
    marginBottom: 24,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {},
  buttonContainer: {
    padding: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
