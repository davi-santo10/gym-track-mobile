// In context/ExercisesContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREDEFINED_EXERCISES, ExerciseData } from '@/data/exercises';

interface ExercisesContextType {
  exercises: ExerciseData[];
  addCustomExercise: (name: string, muscleGroup: ExerciseData['muscleGroup']) => void;
  deleteCustomExercise: (exerciseId: string) => void;
}

const ExercisesContext = createContext<ExercisesContextType>({} as any);
const EXERCISES_STORAGE_KEY = 'my-gym-tracker-exercises';

export const ExercisesProvider = ({ children }: { children: ReactNode }) => {
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const storedData = await AsyncStorage.getItem(EXERCISES_STORAGE_KEY);
        if (storedData !== null) {
          setExercises(JSON.parse(storedData));
        } else {
          setExercises(PREDEFINED_EXERCISES);
        }
      } catch (e) {
        console.error("Failed to load exercises.", e);
        setExercises(PREDEFINED_EXERCISES);
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadExercises();
  }, []);

  useEffect(() => {
    const saveExercises = async () => {
      if (!isDataLoaded) return;
      try {
        await AsyncStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(exercises));
      } catch (e) {
        console.error("Failed to save exercises.", e);
      }
    };
    saveExercises();
  }, [exercises, isDataLoaded]);

  const addCustomExercise = useCallback((name: string, muscleGroup: ExerciseData['muscleGroup']) => {
    const newExercise: ExerciseData = {
      id: `custom-${Date.now()}`,
      name,
      muscleGroup,
    };
    setExercises(currentExercises => [...currentExercises, newExercise]);
  }, []);

  const deleteCustomExercise = useCallback((exerciseId: string) => {
    setExercises(currentExercises =>
      currentExercises.filter(exercise => exercise.id !== exerciseId)
    );
  }, []);
  
  const value = { exercises, addCustomExercise, deleteCustomExercise };

  return (
    <ExercisesContext.Provider value={value}>
      {children}
    </ExercisesContext.Provider>
  );
};

export const useExercises = () => useContext(ExercisesContext);