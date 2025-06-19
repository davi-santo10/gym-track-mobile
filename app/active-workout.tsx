// In app/active-workout.tsx

import { useActiveWorkout } from "@/context/ActiveWorkoutContext";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Keyboard, StyleSheet, View } from "react-native";
import {
  Button,
  Checkbox,
  List,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export default function ActiveWorkoutScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { activeWorkout, exerciseProgress, updateSetProgress, finishWorkout } =
    useActiveWorkout();
  const [elapsedTime, setElapsedTime] = useState("00:00");

  useEffect(() => {
    if (!activeWorkout) return;
    const timerId = setInterval(() => {
      const seconds = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
      setElapsedTime(formatTime(seconds));
    }, 1000);
    return () => clearInterval(timerId);
  }, [activeWorkout]);

  useEffect(() => {
    if (activeWorkout) {
      navigation.setOptions({ title: activeWorkout.routine.name });
    }
  }, [activeWorkout, navigation]);

  const handleFinishWorkout = () => {
    finishWorkout();
    router.back();
  };

  if (!activeWorkout) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Active Workout Found.</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <FlatList
        data={activeWorkout.routine.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        renderItem={({ item }) => {
          const progress = exerciseProgress[item.id] || [];
          const isExerciseComplete = progress.every((set) => set.completed);

          return (
            <List.Accordion
              title={item.name}
              titleStyle={styles.accordionTitle}
              description={item.muscleGroup}
              style={[
                styles.accordion,
                isExerciseComplete && {
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
              right={(props) => (
                <Checkbox.Android
                  status={isExerciseComplete ? "checked" : "unchecked"}
                />
              )}
            >
              <View style={styles.detailsContainer}>
                <View style={styles.setRow}>
                  <Text style={[styles.setHeader, styles.setColumn]}>Set</Text>
                  <Text style={[styles.setHeader, styles.repsColumn]}>
                    Reps
                  </Text>
                  <Text style={[styles.setHeader, styles.weightColumn]}>
                    Weight (kg)
                  </Text>
                  <Text style={[styles.setHeader, styles.statusColumn]}>
                    Done
                  </Text>
                </View>

                {progress.map((setProgress, setIndex) => (
                  <View key={setIndex} style={styles.setRow}>
                    <Text style={[styles.cellText, styles.setColumn]}>
                      {setIndex + 1}
                    </Text>
                    <TextInput
                      style={styles.repsColumn}
                      value={setProgress.reps}
                      onChangeText={(text) =>
                        updateSetProgress(item.id, setIndex, { reps: text })
                      }
                      keyboardType="numeric"
                      mode="outlined"
                      dense
                      disabled={setProgress.completed}
                    />
                    <TextInput
                      style={styles.weightColumn}
                      value={setProgress.weight}
                      keyboardType="numeric"
                      onChangeText={(text) =>
                        updateSetProgress(item.id, setIndex, { weight: text })
                      }
                      mode="outlined"
                      dense
                      disabled={setProgress.completed}
                    />
                    <View style={[styles.statusColumn, styles.statusCell]}>
                      <Checkbox.Android
                        color={theme.colors.primary} // Color when checked
                        uncheckedColor={theme.colors.onSurfaceVariant}
                        status={setProgress.completed ? "checked" : "unchecked"}
                        onPress={() =>
                          updateSetProgress(item.id, setIndex, {
                            completed: !setProgress.completed,
                          })
                        }
                      />
                    </View>
                  </View>
                ))}
              </View>
            </List.Accordion>
          );
        }}
      />

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleFinishWorkout}
          contentStyle={styles.buttonContent}
        >
          Finish Workout
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 8, paddingBottom: 100 },
  accordion: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 8,
  },
  accordionTitle: {
    fontWeight: "bold",
  },
  detailsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    borderTopColor: "rgba(255,255,255,0.1)",
    borderTopWidth: 1,
  },
  setHeader: {
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 12,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // FIX #2: A new style specifically for the text inside cells
  cellText: {
    textAlign: "center",
  },
  setColumn: { width: "15%", textAlign: "center" },
  repsColumn: { width: "20%", textAlign: "center" },
  weightColumn: { width: "35%" },
  statusColumn: { width: "20%" },
  // FIX #2: This style is for the View holding the checkbox
  statusCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.1)",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  // FIX #1: Added the missing style definitions
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
});
