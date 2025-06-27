import {
  CardioProgress,
  SetProgress,
  useActiveWorkout,
} from "@/context/ActiveWorkoutContext";
import { useWorkoutLog } from "@/context/WorkoutLogContext";
import i18n from "@/lib/i18n";
import { Redirect, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Keyboard, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  IconButton,
  List,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function ActiveWorkoutScreen() {
  const theme = useTheme();
  const {
    activeWorkout,
    exerciseProgress,
    restTimer,
    finishWorkout,
    updateSetProgress,
    updateCardioProgress,
    stopRestTimer,
    getDisplayWeight,
    getStorageWeight,
    getCurrentWeightUnit,
  } = useActiveWorkout();
  const { addWorkoutLog, setLastWorkoutSummary } = useWorkoutLog();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [workoutSummary, setWorkoutSummary] = useState<{
    duration: number;
    totalWeight: number;
    totalSets: number;
    completedExercises: number;
  } | null>(null);

  useEffect(() => {
    if (activeWorkout?.routine?.exercises.length === 1) {
      setExpandedId(activeWorkout.routine.exercises[0].id);
    }
  }, [activeWorkout]);

  if (!activeWorkout) {
    return <Redirect href="/" />;
  }

  const calculateWorkoutSummary = () => {
    if (!activeWorkout) return null;

    const workoutDuration = Math.floor(
      (Date.now() - activeWorkout.startTime) / 1000
    );

    let totalWeight = 0;
    let totalSets = 0;
    let completedExercises = 0;

    activeWorkout.routine.exercises.forEach((exercise) => {
      const progress = exerciseProgress[exercise.id];

      if (exercise.type === "cardio") {
        const cardioProgress = progress as CardioProgress;
        if (cardioProgress?.completed) {
          completedExercises++;
        }
      } else {
        const setProgress = progress as SetProgress[];
        if (setProgress) {
          setProgress.forEach((set) => {
            if (set.completed) {
              totalSets++;
              // Convert the display weight to storage weight (kg) for calculation
              const displayWeight = parseFloat(set.weight) || 0;
              const storageWeight = getStorageWeight(displayWeight);
              totalWeight += storageWeight;
            }
          });

          // Check if all sets are completed for this exercise
          if (setProgress.every((set) => set.completed)) {
            completedExercises++;
          }
        }
      }
    });

    return {
      duration: workoutDuration,
      totalWeight,
      totalSets,
      completedExercises,
    };
  };

  const handleFinishWorkout = () => {
    if (!activeWorkout) return;

    const summary = calculateWorkoutSummary();
    if (summary) {
      setWorkoutSummary(summary);
      setShowCompletionModal(true);
    }
  };

  const handleConfirmFinish = () => {
    if (!activeWorkout || !workoutSummary) return;

    // Create the workout log
    const newLogId = `log-${Date.now()}`;
    addWorkoutLog({
      routineId: activeWorkout.routine.id,
      routineName: activeWorkout.routine.name,
      sets: workoutSummary.totalSets,
      exercises: activeWorkout.routine.exercises.map((exercise) => {
        const progress = exerciseProgress[exercise.id];

        if (exercise.type === "cardio") {
          const cardioProgress = progress as CardioProgress;
          return {
            details: exercise,
            progress: cardioProgress
              ? [
                  {
                    reps: 0,
                    weight: 0,
                    duration: parseInt(cardioProgress.duration) || 0,
                    completed: cardioProgress.completed,
                  },
                ]
              : [],
          };
        } else {
          const setProgress = progress as SetProgress[];
          return {
            details: exercise,
            progress:
              setProgress?.map((set) => ({
                reps: parseInt(set.reps) || 0,
                weight: getStorageWeight(parseFloat(set.weight) || 0),
                duration: 0,
                completed: set.completed,
              })) || [],
          };
        }
      }),
      date: Date.now(),
      duration: workoutSummary.duration,
    });

    setLastWorkoutSummary({
      id: newLogId,
      duration: workoutSummary.duration,
      totalWeight: workoutSummary.totalWeight,
      totalSets: workoutSummary.totalSets,
    });

    setShowCompletionModal(false);
    finishWorkout();
    router.replace("/");
  };

  const handleAccordionPress = (exerciseId: string) => {
    setExpandedId((currentId) =>
      currentId === exerciseId ? null : exerciseId
    );
  };

  if (!activeWorkout) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>
          {i18n.t("noActiveWorkout")}
        </Text>
        <Button onPress={() => router.back()}>{i18n.t("goBack")}</Button>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      {/* Workout Finish Confirmation Modal */}
      <Portal>
        <Modal
          visible={showCompletionModal}
          onDismiss={() => setShowCompletionModal(false)}
          contentContainerStyle={[
            styles.confirmationModalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.confirmationModalContent}>
            <View style={styles.confirmationHeader}>
              <Text
                variant="headlineSmall"
                style={[
                  styles.confirmationTitle,
                  { color: theme.colors.onSurface },
                ]}
              >
                {String(i18n.t("finishWorkout"))}?
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.confirmationMessage,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {String(i18n.t("finishWorkoutConfirmation"))}
              </Text>
            </View>

            <View style={styles.confirmationButtonContainer}>
              <Button
                mode="outlined"
                onPress={() => setShowCompletionModal(false)}
                style={styles.confirmationButton}
              >
                {String(i18n.t("continueWorkout"))}
              </Button>
              <Button
                mode="contained"
                onPress={handleConfirmFinish}
                style={styles.confirmationButton}
              >
                {String(i18n.t("finishAndSave"))}
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Rest Timer */}
      {restTimer && (
        <Card
          style={[
            styles.restTimerCard,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Card.Content style={styles.restTimerContent}>
            <View style={styles.restTimerInfo}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onPrimaryContainer }}
              >
                {i18n.t("restTimer")}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onPrimaryContainer, opacity: 0.8 }}
              >
                {restTimer.exerciseName}
              </Text>
            </View>
            <View style={styles.restTimerControls}>
              <Text
                variant="headlineSmall"
                style={{
                  color: theme.colors.onPrimaryContainer,
                  fontWeight: "bold",
                }}
              >
                {formatTime(restTimer.timeLeft)}
              </Text>
              <IconButton
                icon="close"
                size={20}
                iconColor={theme.colors.onPrimaryContainer}
                onPress={stopRestTimer}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      <FlatList
        data={activeWorkout.routine.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        renderItem={({ item }) => {
          const progress = exerciseProgress[item.id];

          // Check if exercise is complete based on type
          const isExerciseComplete =
            item.type === "cardio"
              ? (progress as CardioProgress)?.completed || false
              : (progress as SetProgress[])?.every((set) => set.completed) ||
                false;

          const previousExerciseLog =
            activeWorkout?.previousLog?.exercises.find(
              (e) => e.details.name === item.name
            );

          return (
            <List.Accordion
              title={item.name}
              titleStyle={[
                styles.accordionTitle,
                { color: theme.colors.onSurface },
              ]}
              description={item.muscleGroup}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
              style={[
                styles.accordion,
                { backgroundColor: theme.colors.surface },
                isExerciseComplete && {
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
              right={(props) => (
                <Checkbox.Android
                  status={isExerciseComplete ? "checked" : "unchecked"}
                  color={theme.colors.primary}
                  uncheckedColor={theme.colors.onSurfaceVariant}
                />
              )}
              expanded={expandedId === item.id}
              onPress={() => handleAccordionPress(item.id)}
            >
              <View
                style={[
                  styles.detailsContainer,
                  { borderTopColor: theme.colors.outline },
                ]}
              >
                {item.type === "cardio" ? (
                  // Cardio exercise UI
                  <View>
                    <View style={styles.cardioHeader}>
                      <Text
                        style={[
                          styles.setHeader,
                          { width: "50%", color: theme.colors.onSurface },
                        ]}
                      >
                        {i18n.t("targetDuration")}
                      </Text>
                      <Text
                        style={[
                          styles.setHeader,
                          { width: "50%", color: theme.colors.onSurface },
                        ]}
                      >
                        {i18n.t("done")}
                      </Text>
                    </View>
                    <View style={styles.cardioRow}>
                      <TextInput
                        style={styles.cardioInput}
                        value={(progress as CardioProgress)?.duration || ""}
                        placeholder={
                          (progress as CardioProgress)?.targetDuration || "30"
                        }
                        onChangeText={(text) =>
                          updateCardioProgress(item.id, { duration: text })
                        }
                        keyboardType="numeric"
                        mode="outlined"
                        dense
                        disabled={(progress as CardioProgress)?.completed}
                        label={i18n.t("minutes")}
                        textColor={theme.colors.onSurface}
                      />
                      <View style={[styles.statusColumn, styles.statusCell]}>
                        <Checkbox.Android
                          color={theme.colors.primary}
                          uncheckedColor={theme.colors.onSurfaceVariant}
                          status={
                            (progress as CardioProgress)?.completed
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() =>
                            updateCardioProgress(item.id, {
                              completed: !(progress as CardioProgress)
                                ?.completed,
                            })
                          }
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  // Strength exercise UI (original)
                  <View>
                    <View style={styles.setRow}>
                      <Text
                        style={[
                          styles.setHeader,
                          styles.setColumn,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {i18n.t("set")}
                      </Text>
                      <Text
                        style={[
                          styles.setHeader,
                          styles.repsColumn,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {i18n.t("reps")}
                      </Text>
                      <Text
                        style={[
                          styles.setHeader,
                          styles.weightColumn,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {i18n.t("weight")} ({getCurrentWeightUnit()})
                      </Text>
                      <Text
                        style={[
                          styles.setHeader,
                          styles.statusColumn,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {i18n.t("done")}
                      </Text>
                    </View>

                    {(progress as SetProgress[])?.map(
                      (setProgress, setIndex) => {
                        const previousSet =
                          previousExerciseLog?.progress[setIndex];

                        return (
                          <View key={setIndex} style={styles.setRow}>
                            <Text
                              style={[
                                styles.cellText,
                                styles.setColumn,
                                { color: theme.colors.onSurface },
                              ]}
                            >
                              {setIndex + 1}
                            </Text>
                            <TextInput
                              style={styles.repsColumn}
                              value={setProgress.reps}
                              placeholder={
                                previousSet ? `${previousSet.reps}` : ""
                              }
                              onChangeText={(text) =>
                                updateSetProgress(item.id, setIndex, {
                                  reps: text,
                                })
                              }
                              keyboardType="numeric"
                              mode="outlined"
                              dense
                              disabled={setProgress.completed}
                              textColor={theme.colors.onSurface}
                            />
                            <TextInput
                              style={styles.weightColumn}
                              value={setProgress.weight}
                              placeholder={
                                previousSet
                                  ? `${getDisplayWeight(
                                      previousSet.weight
                                    ).toFixed(1)}`
                                  : ""
                              }
                              keyboardType="numeric"
                              onChangeText={(text) =>
                                updateSetProgress(item.id, setIndex, {
                                  weight: text,
                                })
                              }
                              mode="outlined"
                              dense
                              disabled={setProgress.completed}
                              textColor={theme.colors.onSurface}
                            />
                            <View
                              style={[styles.statusColumn, styles.statusCell]}
                            >
                              <Checkbox.Android
                                color={theme.colors.primary}
                                uncheckedColor={theme.colors.onSurfaceVariant}
                                status={
                                  setProgress.completed
                                    ? "checked"
                                    : "unchecked"
                                }
                                onPress={() =>
                                  updateSetProgress(item.id, setIndex, {
                                    completed: !setProgress.completed,
                                  })
                                }
                              />
                            </View>
                          </View>
                        );
                      }
                    )}
                  </View>
                )}
              </View>
            </List.Accordion>
          );
        }}
      />

      <View
        style={[styles.buttonContainer, { borderColor: theme.colors.outline }]}
      >
        <Button
          mode="contained"
          onPress={handleFinishWorkout}
          contentStyle={styles.buttonContent}
        >
          {i18n.t("finishWorkout")}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 8, paddingBottom: 100 },
  // Confirmation Modal Styles
  confirmationModalContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 24,
  },
  confirmationModalContent: {
    padding: 24,
  },
  confirmationHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  confirmationTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 12,
  },
  confirmationMessage: {
    textAlign: "center",
    lineHeight: 22,
  },
  confirmationButtonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  confirmationButton: {
    flex: 1,
  },
  // Rest Timer Styles
  restTimerCard: {
    margin: 8,
    marginBottom: 16,
    elevation: 4,
  },
  restTimerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  restTimerInfo: {
    flex: 1,
  },
  restTimerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Exercise List Styles
  accordion: {
    borderRadius: 12,
    marginBottom: 8,
  },
  accordionTitle: {
    fontWeight: "bold",
  },
  detailsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
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
  cellText: {
    textAlign: "center",
  },
  setColumn: { width: "15%", textAlign: "center" },
  repsColumn: { width: "20%", textAlign: "center" },
  weightColumn: { width: "35%" },
  statusColumn: { width: "20%" },
  statusCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Cardio-specific styles
  cardioHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  cardioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  cardioInput: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  buttonContent: {
    paddingVertical: 8,
  },
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
