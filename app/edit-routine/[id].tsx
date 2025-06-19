// In app/edit-routine/[id].tsx

import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Button, TextInput, Text, useTheme, IconButton, List } from 'react-native-paper';
import { useRoutines } from '@/context/RoutinesContext';
import { useRoutineBuilder } from '@/context/RoutineBuilderContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditRoutineScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();


  const { routines, editRoutine } = useRoutines();
  const {
    routineName, setRoutineName, exercises, updateSets, updateReps,
    removeExercise, startBuilding, clearBuilder
  } = useRoutineBuilder();

  const routineToEdit = routines.find(r => r.id === id);

  useEffect(() => {
    if (routineToEdit) {
      startBuilding(routineToEdit);
    }
    return () => {
      clearBuilder();
    };
  }, [routineToEdit]);


  const handleSave = () => {
    if (!id) return; 
    if (!routineName.trim() || exercises.length === 0) return;
    

    editRoutine(id, { name: routineName, exercises });
    router.back();
  };


  if (!routineToEdit) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            label="Routine Name"
            value={routineName}
            onChangeText={setRoutineName}
            mode="outlined"
            style={styles.input}
          />
          <Text variant="titleLarge" style={styles.title}>Exercises</Text>
          
          {exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseContainer}>
              <Text variant="titleMedium">{exercise.name}</Text>
              <View style={styles.bottomRow}>
                <TextInput
                  label="Sets"
                  value={exercise.sets}
                  onChangeText={(text) => updateSets(exercise.id, text)}
                  mode="outlined"
                  style={styles.setsInput}
                  keyboardType="numeric"
                />
                <TextInput
                  label="Reps"
                  value={exercise.reps}
                  onChangeText={(text) => updateReps(exercise.id, text)}
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
            Save Changes
          </Button>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  input: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 16,
  },
  exerciseContainer: {
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  setsInput: {
    flex: 1,
  },
  repsInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  deleteButton: {
    margin: 0,
  },
  addExerciseButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  saveButton: {
    margin: 16,
    marginTop: 8,
    paddingVertical: 8,
  },
});