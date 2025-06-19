import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Routine, Exercise } from './RoutinesContext';

export interface SetProgress {
  reps: string;
  weight: string;
  completed: boolean;
}
export type ExerciseProgress = Record<string, SetProgress[]>;

export interface ActiveWorkout {
  routine: Routine;
  startTime: number;
}

interface ActiveWorkoutContextType {
  activeWorkout: ActiveWorkout | null;
  exerciseProgress: ExerciseProgress;
  startWorkout: (routine: Routine) => void;
  finishWorkout: () => void;

  updateSetProgress: (exerciseId: string, setIndex: number, newProgress: Partial<SetProgress>) => void;
}

const ActiveWorkoutContext = createContext<ActiveWorkoutContextType>({} as any);

export const ActiveWorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress>({});

  const startWorkout = useCallback((routine: Routine) => {
    const newWorkout: ActiveWorkout = { routine, startTime: Date.now() };
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

  const value = { activeWorkout, exerciseProgress, startWorkout, finishWorkout, updateSetProgress };

  return <ActiveWorkoutContext.Provider value={value}>{children}</ActiveWorkoutContext.Provider>;
};

export const useActiveWorkout = () => useContext(ActiveWorkoutContext);