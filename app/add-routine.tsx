import { useRoutineBuilder } from "@/context/RoutineBuilderContext";
import { DayOfWeek, useRoutines } from "@/context/RoutinesContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
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
const screenWidth = Dimensions.get('window').width;
const totalGapSize = (CHIPS_PER_ROW - 1) * GAP;
const availableWidth = screenWidth - (PADDING_HORIZONTAL * 2);
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
  } = useRoutineBuilder();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | undefined>();

  useEffect(() => {
    startBuilding();
    return () => {
      clearBuilder;
    };
  }, []);

  const handleSave = () => {
    if (!routineName.trim() || exercises.length === 0) {
      return;
    }
    addRoutine(routineName, exercises, selectedDay);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
       <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            label="Routine Name"
            value={routineName}
            onChangeText={setRoutineName}
            mode="outlined"
            style={styles.input}
          />
          
          <Text variant="titleLarge" style={styles.title}>Assign to a day (optional)</Text>
          <View style={styles.chipContainer}>
            {days.map(day => {
              const isSelected = selectedDay === day;
              
              return (
                <Chip
                  key={day}
                  // 1. Set the mode dynamically
                  mode={isSelected ? 'flat' : 'outlined'}
                  style={[
                    styles.chip,
                    // 2. Only apply a background color when selected
                    isSelected && { backgroundColor: theme.colors.primaryContainer }
                  ]}
                  textStyle={{
                    // 3. Ensure text color has good contrast in both states
                    color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurface
                  }}
                  onPress={() => setSelectedDay(currentDay => currentDay === day ? undefined : day)}
                >
                  {day}
                </Chip>
              );
            })}
          </View>
          
          <Text variant="titleLarge" style={styles.exercisesTitle}>Exercises</Text>
          
          {exercises.map(exercise => (
            <View key={exercise.id} style={styles.exerciseContainer}>
              <Text variant="titleMedium">{exercise.name}</Text>
              <View style={styles.bottomRow}>
                <TextInput
                  label="Sets"
                  value={exercise.sets}
                  onChangeText={text => updateSets(exercise.id, text)}
                  mode="outlined"
                  style={styles.setsInput}
                  keyboardType="numeric"
                />
                <TextInput
                  label="Reps"
                  value={exercise.reps}
                  onChangeText={text => updateReps(exercise.id, text)}
                  mode="outlined"
                  style={styles.repsInput}
                  keyboardType="numeric"
                />
                <IconButton
                  icon="delete-outline"
                  onPress={() => removeExercise(exercise.id)}
                  style={styles.deleteButton}
                />
              </View>
            </View>
          ))}
          <Button mode="elevated" onPress={() => router.push('/select-exercises')} style={styles.addExerciseButton}>
            Add Exercises
          </Button>
        </ScrollView>
        <SafeAreaView edges={['bottom']}>
          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            Save Routine
          </Button>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: 16, 
    paddingBottom: 24,
  },
  input: { marginBottom: 16 },
  title: { marginBottom: 12 },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    marginBottom: 24,
  },
  chip: {
    width: chipWidth,
    justifyContent: 'center',
  },
  exercisesTitle: {
    marginBottom: 16,
  },
  exerciseContainer: {
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  setsInput: { flex: 1 },
  repsInput: { flex: 1, marginHorizontal: 8 },
  deleteButton: { margin: 0 },
  addExerciseButton: { marginTop: 8, alignSelf: 'flex-start' },
  saveButton: { marginHorizontal: 16, marginVertical: 8, paddingVertical: 8 },
});
