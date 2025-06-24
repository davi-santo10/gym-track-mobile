import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Exercise } from './RoutinesContext';
import { ExerciseData } from '@/data/exercises';

interface RoutineBuilderContextType {
  routineName: string;
  setRoutineName: (name: string) => void;
  exercises: Exercise[];
  addExercise: (exercise: ExerciseData) => void;
  removeExercise: (exerciseId: string) => void;
  toggleExercise: (exercise: ExerciseData) => void;
  updateSets: (exerciseId: string, sets: string) => void;
  updateReps: (exerciseId: string, reps: string) => void;
  startBuilding: (initialRoutine?: { name: string; exercises: Exercise[] }) => void;
  clearBuilder: () => void;
  setBuilderExercises: (exercises: Exercise[]) => void
}

const RoutineBuilderContext = createContext<RoutineBuilderContextType>({} as any);

export const RoutineBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const toggleExercise = useCallback((exerciseData: ExerciseData) => {
    setExercises(current => {
      const existingIndex = current.findIndex(e => e.id === exerciseData.id)
      if (existingIndex > -1) {
        const newExercises = [...current]
        newExercises.splice(existingIndex, 1)
        return newExercises
      } else {
        const newExercise: Exercise = {...exerciseData, sets:'3', reps:'10'}
        return [...current, newExercise]
      }
    })
  }, [])

  const addExercise = useCallback((exercise: ExerciseData) => {
    setExercises(current => {
      if (current.find(e => e.id === exercise.id)) return current;
      const newExercise: Exercise = { ...exercise, sets: '3', reps: '10' };
      return [...current, newExercise];
    });
  }, []);
  
  const removeExercise = useCallback((exerciseId: string) => {
    setExercises(current => current.filter(e => e.id !== exerciseId));
  }, []);

  const updateSets = useCallback((exerciseId: string, sets: string) => {
    setExercises(current => current.map(e => e.id === exerciseId ? { ...e, sets } : e));
  }, []);
  
  const updateReps = useCallback((exerciseId: string, reps: string) => {
    setExercises(current => current.map(e => e.id === exerciseId ? { ...e, reps } : e));
  }, []);

  const startBuilding = useCallback((initialRoutine?: { name: string; exercises: Exercise[] }) => {
    setRoutineName(initialRoutine?.name || '');
    setExercises(initialRoutine?.exercises || []);
  }, []);
  
  const clearBuilder = useCallback(() => {
    setRoutineName('');
    setExercises([]);
  }, []);

  const setBuilderExercises = useCallback((newExercises: Exercise[]) => {
    setExercises(newExercises)
  }, []) 

  const value = {
    routineName, setRoutineName, exercises, toggleExercise, addExercise, removeExercise,
    updateSets, updateReps, startBuilding, clearBuilder, setBuilderExercises
  };

  return <RoutineBuilderContext.Provider value={value}>{children}</RoutineBuilderContext.Provider>;
};

export const useRoutineBuilder = () => useContext(RoutineBuilderContext);