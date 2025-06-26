// davi-santo10/gym-track-mobile/gym-track-mobile-a3c082c6a5f179f164780a4960a695da27fed457/app/edit-routine/[id].tsx
import { RestTimePicker } from "@/components/ui/RestTimePicker";
import { useRoutineBuilder } from "@/context/RoutineBuilderContext";
import { DayOfWeek, Exercise, useRoutines } from "@/context/RoutinesContext";
import i18n from "@/lib/i18n"; // Import i18n
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import {
  Button,
  Chip,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const days: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PADDING_HORIZONTAL = 16;
const GAP = 8;
const CHIPS_PER_ROW = 4;
const screenWidth = Dimensions.get("window").width;
const totalGapSize = (CHIPS_PER_ROW - 1) * GAP;
const availableWidth = screenWidth - PADDING_HORIZONTAL * 2;
const chipWidth = (availableWidth - totalGapSize) / CHIPS_PER_ROW;

export default function EditRoutineScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | undefined>();
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set()
  );
  const [restTimePickerVisible, setRestTimePickerVisible] = useState(false);
  const [currentExerciseId, setCurrentExerciseId] = useState<string>("");

  const { routines, editRoutine } = useRoutines();
  const {
    routineName,
    setRoutineName,
    exercises,
    updateSets,
    updateReps,
    updateDuration,
    updateRestTime,
    removeExercise,
    startBuilding,
    clearBuilder,
    setBuilderExercises,
  } = useRoutineBuilder();

  const routineToEdit = routines.find((r) => r.id === id);

  useEffect(() => {
    if (routineToEdit) {
      startBuilding(routineToEdit);
      setSelectedDay(routineToEdit.day);
    }
    return () => {
      clearBuilder();
    };
  }, [routineToEdit]);

  const toggleExerciseExpanded = (exerciseId: string) => {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const openRestTimePicker = (exerciseId: string) => {
    setCurrentExerciseId(exerciseId);
    setRestTimePickerVisible(true);
  };

  const handleRestTimeChange = (restTime: number) => {
    if (currentExerciseId) {
      updateRestTime(currentExerciseId, restTime);
    }
  };

  const formatRestTime = (seconds?: number): string => {
    if (!seconds) return String(i18n.t("restTime"));
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (remainingSeconds === 0) {
        return `${minutes}m`;
      } else {
        return `${minutes}m ${remainingSeconds}s`;
      }
    }
  };

  const handleSave = () => {
    if (!id || !routineName.trim() || exercises.length === 0) return;

    const updatedData = {
      name: routineName,
      exercises,
      day: selectedDay,
    };

    editRoutine(id, updatedData);
    router.back();
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Exercise>) => {
      const isExpanded = expandedExercises.has(item.id);

      return (
        <View
          style={[
            styles.exerciseContainer,
            {
              backgroundColor: isActive
                ? theme.colors.surfaceVariant
                : "transparent",
            },
          ]}
        >
          <TouchableOpacity
            onLongPress={drag}
            disabled={isActive}
            style={styles.dragHandle}
          >
            <IconButton icon="drag-vertical" size={28} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <View style={styles.exerciseHeader}>
              <Text variant="titleMedium" style={{ flex: 1 }}>
                {item.name}
              </Text>
              <IconButton
                icon={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                onPress={() => toggleExerciseExpanded(item.id)}
              />
              <IconButton
                icon="delete-outline"
                onPress={() => removeExercise(item.id)}
                style={styles.deleteButton}
              />
            </View>

            <View style={styles.bottomRow}>
              {item.type === "cardio" ? (
                // Cardio exercise UI
                <TextInput
                  label={i18n.t("targetDuration")}
                  value={item.duration || ""}
                  onChangeText={(text) => updateDuration(item.id, text)}
                  mode="outlined"
                  style={styles.durationInput}
                  keyboardType="numeric"
                />
              ) : (
                // Strength exercise UI
                <>
                  <TextInput
                    label={i18n.t("set", { count: 2 })}
                    value={item.sets || ""}
                    onChangeText={(text) => updateSets(item.id, text)}
                    mode="outlined"
                    style={styles.setsInput}
                    keyboardType="numeric"
                  />
                  <TextInput
                    label={i18n.t("reps")}
                    value={item.reps || ""}
                    onChangeText={(text) => updateReps(item.id, text)}
                    mode="outlined"
                    style={styles.repsInput}
                    keyboardType="numeric"
                  />
                </>
              )}
            </View>

            {/* Collapsible Rest Time Section */}
            {isExpanded && (
              <View style={styles.expandedSection}>
                <TouchableOpacity
                  style={[
                    styles.restTimeButton,
                    { borderColor: theme.colors.outline },
                  ]}
                  onPress={() => openRestTimePicker(item.id)}
                >
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    {formatRestTime(item.restTime)}
                  </Text>
                  <IconButton icon="chevron-right" size={16} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    },
    [
      theme.colors,
      updateSets,
      updateReps,
      updateDuration,
      removeExercise,
      expandedExercises,
      toggleExerciseExpanded,
      openRestTimePicker,
      formatRestTime,
    ]
  );

  if (!routineToEdit) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Rest Time Picker */}
      <RestTimePicker
        visible={restTimePickerVisible}
        onDismiss={() => setRestTimePickerVisible(false)}
        onTimeChange={handleRestTimeChange}
        initialTime={
          currentExerciseId
            ? exercises.find((e) => e.id === currentExerciseId)?.restTime || 60
            : 60
        }
        title={String(i18n.t("restBetweenSets"))}
      />

      {/* FIX: Add a wrapping View with flex: 1 for the list */}
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={exercises}
          onDragEnd={({ data }) => setBuilderExercises(data)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContentContainer}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: PADDING_HORIZONTAL }}>
              <TextInput
                label={i18n.t("routineName")}
                value={routineName}
                onChangeText={setRoutineName}
                mode="outlined"
                style={styles.input}
              />

              <Text variant="titleLarge" style={styles.title}>
                {i18n.t("assignDay")}
              </Text>
              <View style={styles.chipContainer}>
                {days.map((day) => {
                  const isSelected = selectedDay === day;

                  return (
                    <Chip
                      key={day}
                      mode={isSelected ? "flat" : "outlined"}
                      style={[
                        styles.chip,
                        isSelected && {
                          backgroundColor: theme.colors.primaryContainer,
                        },
                      ]}
                      textStyle={{
                        color: isSelected
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurface,
                      }}
                      onPress={() =>
                        setSelectedDay((currentDay) =>
                          currentDay === day ? undefined : day
                        )
                      }
                    >
                      {i18n.t(`days.${day.toLowerCase()}` as any)}
                    </Chip>
                  );
                })}
              </View>

              <Text variant="titleLarge" style={styles.title}>
                {i18n.t("exercises")}
              </Text>
            </View>
          }
          ListFooterComponent={
            <View style={{ paddingHorizontal: PADDING_HORIZONTAL }}>
              <Button
                mode="outlined"
                onPress={() => router.push("/select-exercises")}
                style={styles.addButton}
                icon="plus"
              >
                {i18n.t("addExercises")}
              </Button>

              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                disabled={!routineName.trim() || exercises.length === 0}
              >
                {i18n.t("saveRoutine")}
              </Button>
            </View>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContentContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  input: { marginBottom: 16 },
  title: { marginBottom: 12 },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
    marginBottom: 24,
  },
  chip: {
    width: chipWidth,
    justifyContent: "center",
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 16,
    paddingRight: 16,
    marginHorizontal: PADDING_HORIZONTAL,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "rgba(128, 128, 128, 0.3)",
  },
  dragHandle: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bottomRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  setsInput: { flex: 1 },
  repsInput: { flex: 1, marginHorizontal: 8 },
  durationInput: { flex: 2, marginRight: 8 },
  deleteButton: { margin: 0 },
  expandedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  restTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  addButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
});
