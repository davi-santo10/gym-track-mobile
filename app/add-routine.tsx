import { router, useFocusEffect } from 'expo-router';
import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, View, ScrollView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Button,
  TextInput,
  useTheme,
  IconButton,
  Modal,
  Portal,
  Appbar,
  Searchbar,
  List,
  Text,
} from 'react-native-paper';
import { useRoutines } from '@/context/RoutinesContext';
import { useRoutineBuilder } from '@/context/RoutineBuilderContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddRoutineScreen() {
  const theme = useTheme();
  const { addRoutine } = useRoutines();

  const {
    routineName, setRoutineName, exercises, updateSets, updateReps,
    removeExercise, startBuilding, clearBuilder
  } = useRoutineBuilder();

  useEffect(() => {
    startBuilding();
    return () => {
      clearBuilder
    }
  }, [])

  const handleSave = () => {
    if (!routineName.trim() || exercises.length === 0) { return; }
    addRoutine(routineName, exercises);
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
          <Text variant="titleLarge" style={styles.title}>Exercises</Text>
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
  modalContainer: { flex: 1 },
  modalContent: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24 },
  input: { marginBottom: 24 },
  title: { marginBottom: 16 },
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
  saveButton: { margin: 16, marginTop: 8, paddingVertical: 8 },
});