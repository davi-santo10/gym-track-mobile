import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Routine, Exercise } from './RoutinesContext';
import { WorkoutLog } from './WorkoutLogContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_WORKOUT_KEY = 'my-gym-tracker-active-workout'
const EXERCISE_PROGRESS_KEY = 'my-gym-tracker-exercise-progress'

export interface SetProgress {
  reps: string;
  weight: string;
  completed: boolean;
}
export type ExerciseProgress = Record<string, SetProgress[]>;

export interface ActiveWorkout {
  routine: Routine;
  startTime: number;
  previousLog?: WorkoutLog;
}

interface ActiveWorkoutContextType {
  activeWorkout: ActiveWorkout | null;
  exerciseProgress: ExerciseProgress;
  isLoaded: boolean;
  startWorkout: (routine: Routine, previousLog?: WorkoutLog) => void;
  finishWorkout: () => void;
  updateSetProgress: (exerciseId: string, setIndex: number, newProgress: Partial<SetProgress>) => void;
}

const ActiveWorkoutContext = createContext<ActiveWorkoutContextType>({} as any);

export const ActiveWorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress>({});
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect (() => {
    const loadStateFromStorage = async () => {
      try {
        const savedWorkoutJSON = await AsyncStorage.getItem(ACTIVE_WORKOUT_KEY)
        const savedProgressJSON = await AsyncStorage.getItem(EXERCISE_PROGRESS_KEY)

        if (savedWorkoutJSON) {
          setActiveWorkout(JSON.parse(savedWorkoutJSON))
        }
        if (savedProgressJSON) {
          setExerciseProgress(JSON.parse(savedProgressJSON))
        }
      } catch (e) {
        console.error("Failed to load active workout state." , e)
      } finally {
        setIsLoaded(true)
      }
    }
    loadStateFromStorage()
  }, [])

  useEffect(() => {
    if (!isLoaded) return;
    if (activeWorkout) {
      AsyncStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(activeWorkout))
    } else {
      AsyncStorage.removeItem(ACTIVE_WORKOUT_KEY)
    }
  }, [activeWorkout, isLoaded])

  useEffect(() => {
    if (!isLoaded) return;
    if (Object.keys(exerciseProgress).length > 0) {
      AsyncStorage.setItem(EXERCISE_PROGRESS_KEY, JSON.stringify(exerciseProgress))
    } else {
      AsyncStorage.removeItem(EXERCISE_PROGRESS_KEY)
    }
  }, [exerciseProgress, isLoaded])

  const startWorkout = useCallback((routine: Routine, previousLog?: WorkoutLog) => {
    const newWorkout: ActiveWorkout = { routine, startTime: Date.now(), previousLog };
    setActiveWorkout(newWorkout);


    const initialProgress = routine.exercises.reduce((acc, exercise) => {
      acc[exercise.id] = Array.from({ length: parseInt(exercise.sets, 10) || 0 }).map(() => ({
        reps: exercise.reps, 
        weight: '',       
        completed: false,
      }));
      return acc;
    }, {} as ExerciseProgress);
    setExerciseProgress(initialProgress);
  }, []);

  const finishWorkout = useCallback(() => {
    setActiveWorkout(null);
    setExerciseProgress({});
  }, []);

  const updateSetProgress = useCallback((exerciseId: string, setIndex: number, newProgress: Partial<SetProgress>) => {
    setExerciseProgress(current => {
      const newTotalProgress = { ...current };
      const specificExerciseProgress = [...newTotalProgress[exerciseId]];
      specificExerciseProgress[setIndex] = {
        ...specificExerciseProgress[setIndex],
        ...newProgress,
      };
      newTotalProgress[exerciseId] = specificExerciseProgress;
      return newTotalProgress;
    });
  }, []);

  const value = { activeWorkout, exerciseProgress, isLoaded, startWorkout, finishWorkout, updateSetProgress };

  return <ActiveWorkoutContext.Provider value={value}>{children}</ActiveWorkoutContext.Provider>;
};

export const useActiveWorkout = () => useContext(ActiveWorkoutContext);