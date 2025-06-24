// davi-santo10/gym-track-mobile/gym-track-mobile-a3c082c6a5f179f164780a4960a695da27fed457/app/add-routine.tsx
import { useRoutineBuilder } from "@/context/RoutineBuilderContext";
import { DayOfWeek, Exercise, useRoutines } from "@/context/RoutinesContext";
import i18n from "@/lib/i18n"; // Import i18n
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
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
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function AddRoutineScreen() {
  const theme = useTheme();
  const { addRoutine } = useRoutines();

  const {
    routineName,
    setRoutineName,
    exercises,
    updateSets,
    updateReps,
    removeExercise,
    startBuilding,
    clearBuilder,
    setBuilderExercises,
  } = useRoutineBuilder();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | undefined>();

  useEffect(() => {
    startBuilding();
    return () => {
      clearBuilder();
    };
  }, []);

  const handleSave = () => {
    if (!routineName.trim() || exercises.length === 0) {
      return;
    }
    addRoutine(routineName, exercises, selectedDay);
    router.back();
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Exercise>) => {
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
            <Text variant="titleMedium">{item.name}</Text>
            <View style={styles.bottomRow}>
              <TextInput
                label={i18n.t("set", { count: 2 })}
                value={item.sets}
                onChangeText={(text) => updateSets(item.id, text)}
                mode="outlined"
                style={styles.setsInput}
                keyboardType="numeric"
              />
              <TextInput
                label={i18n.t("reps")}
                value={item.reps}
                onChangeText={(text) => updateReps(item.id, text)}
                mode="outlined"
                style={styles.repsInput}
                keyboardType="numeric"
              />
              <IconButton
                icon="delete-outline"
                onPress={() => removeExercise(item.id)}
                style={styles.deleteButton}
              />
            </View>
          </View>
        </View>
      );
    },
    [theme.colors, updateSets, updateReps, removeExercise]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
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

              <Text variant="titleLarge" style={styles.exercisesTitle}>
                {i18n.t("exercises")}
              </Text>
            </View>
          }
          ListFooterComponent={
            <Button
              mode="elevated"
              onPress={() => {
                Keyboard.dismiss();
                router.push("/select-exercises");
              }}
              style={styles.addExerciseButton}
            >
              {i18n.t("addExercises")}
            </Button>
          }
        />
      </View>
      <SafeAreaView edges={["bottom"]}>
        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          {i18n.t("saveRoutine")}
        </Button>
      </SafeAreaView>
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
  exercisesTitle: {
    marginBottom: 16,
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
  bottomRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  setsInput: { flex: 1 },
  repsInput: { flex: 1, marginHorizontal: 8 },
  deleteButton: { margin: 0 },
  addExerciseButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    marginHorizontal: PADDING_HORIZONTAL,
  },
  saveButton: { marginHorizontal: 16, marginVertical: 8, paddingVertical: 8 },
});
