import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Routine } from "./RoutinesContext";
import { useSettings } from "./SettingsContext";
import { WorkoutLog } from "./WorkoutLogContext";

const ACTIVE_WORKOUT_KEY = "my-gym-tracker-active-workout";
const EXERCISE_PROGRESS_KEY = "my-gym-tracker-exercise-progress";
const REST_TIMER_KEY = "my-gym-tracker-rest-timer";

// Progress for strength exercises
export interface SetProgress {
  reps: string;
  weight: string;
  completed: boolean;
}

// Progress for cardio exercises
export interface CardioProgress {
  duration: string; // actual duration completed in minutes
  targetDuration: string; // target duration in minutes
  completed: boolean;
}

export type ExerciseProgress = Record<string, SetProgress[] | CardioProgress>;

export interface RestTimer {
  isActive: boolean;
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  exerciseId: string;
  exerciseName: string;
}

export interface ActiveWorkout {
  routine: Routine;
  startTime: number;
  previousLog?: WorkoutLog;
}

interface ActiveWorkoutContextType {
  activeWorkout: ActiveWorkout | null;
  exerciseProgress: ExerciseProgress;
  restTimer: RestTimer | null;
  isLoaded: boolean;
  startWorkout: (routine: Routine, previousLog?: WorkoutLog) => void;
  finishWorkout: () => void;
  updateSetProgress: (
    exerciseId: string,
    setIndex: number,
    newProgress: Partial<SetProgress>
  ) => void;
  updateCardioProgress: (
    exerciseId: string,
    newProgress: Partial<CardioProgress>
  ) => void;
  startRestTimer: (
    exerciseId: string,
    exerciseName: string,
    duration: number
  ) => void;
  stopRestTimer: () => void;
  // Unit conversion helpers
  getDisplayWeight: (weight: number) => number;
  getStorageWeight: (displayWeight: number) => number;
  getCurrentWeightUnit: () => string;
}

const ActiveWorkoutContext = createContext<ActiveWorkoutContextType>({} as any);

export const ActiveWorkoutProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { settings, convertWeight } = useSettings();
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(
    null
  );
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress>(
    {}
  );
  const [restTimer, setRestTimer] = useState<RestTimer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Timer interval effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (restTimer?.isActive && restTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setRestTimer((current) => {
          if (!current || current.timeLeft <= 1) {
            return null; // Timer finished
          }
          return {
            ...current,
            timeLeft: current.timeLeft - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [restTimer?.isActive, restTimer?.timeLeft]);

  useEffect(() => {
    const loadStateFromStorage = async () => {
      try {
        const savedWorkoutJSON = await AsyncStorage.getItem(ACTIVE_WORKOUT_KEY);
        const savedProgressJSON = await AsyncStorage.getItem(
          EXERCISE_PROGRESS_KEY
        );
        const savedTimerJSON = await AsyncStorage.getItem(REST_TIMER_KEY);

        if (savedWorkoutJSON) {
          setActiveWorkout(JSON.parse(savedWorkoutJSON));
        }
        if (savedProgressJSON) {
          setExerciseProgress(JSON.parse(savedProgressJSON));
        }
        if (savedTimerJSON) {
          const timer = JSON.parse(savedTimerJSON);
          // Don't restore active timers, only show if there was time left
          if (timer.timeLeft > 0) {
            setRestTimer({
              ...timer,
              isActive: false, // Don't auto-resume active timers
            });
          }
        }
      } catch (e) {
        console.error("Failed to load active workout state.", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadStateFromStorage();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (activeWorkout) {
      AsyncStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(activeWorkout));
    } else {
      AsyncStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }
  }, [activeWorkout, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (Object.keys(exerciseProgress).length > 0) {
      AsyncStorage.setItem(
        EXERCISE_PROGRESS_KEY,
        JSON.stringify(exerciseProgress)
      );
    } else {
      AsyncStorage.removeItem(EXERCISE_PROGRESS_KEY);
    }
  }, [exerciseProgress, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (restTimer) {
      AsyncStorage.setItem(REST_TIMER_KEY, JSON.stringify(restTimer));
    } else {
      AsyncStorage.removeItem(REST_TIMER_KEY);
    }
  }, [restTimer, isLoaded]);

  const startWorkout = useCallback(
    (routine: Routine, previousLog?: WorkoutLog) => {
      const newWorkout: ActiveWorkout = {
        routine,
        startTime: Date.now(),
        previousLog,
      };
      setActiveWorkout(newWorkout);

      const initialProgress = routine.exercises.reduce((acc, exercise) => {
        if (exercise.type === "cardio") {
          // For cardio exercises, initialize with target duration
          acc[exercise.id] = {
            duration: "",
            targetDuration: exercise.duration || "30",
            completed: false,
          } as CardioProgress;
        } else {
          // For strength exercises, initialize sets array
          const previousExerciseLog = previousLog?.exercises.find(
            (e) => e.details.name === exercise.name
          );

          acc[exercise.id] = Array.from({
            length: parseInt(exercise.sets || "0", 10) || 0,
          }).map((_, setIndex) => {
            const previousSet = previousExerciseLog?.progress[setIndex];
            let displayWeight = "";

            // If there's a previous weight, convert it from storage (kg) to display unit
            if (previousSet && previousSet.weight > 0) {
              const convertedWeight = convertWeight(
                previousSet.weight,
                "kg",
                settings.units.weightUnit
              );
              displayWeight = convertedWeight.toFixed(1);
            }

            return {
              reps: exercise.reps || "",
              weight: displayWeight,
              completed: false,
            };
          }) as SetProgress[];
        }
        return acc;
      }, {} as ExerciseProgress);
      setExerciseProgress(initialProgress);

      // Clear any existing rest timer when starting a new workout
      setRestTimer(null);
    },
    [convertWeight, settings.units.weightUnit]
  );

  const finishWorkout = useCallback(() => {
    setActiveWorkout(null);
    setExerciseProgress({});
    setRestTimer(null);
  }, []);

  const startRestTimer = useCallback(
    (exerciseId: string, exerciseName: string, duration: number) => {
      setRestTimer({
        isActive: true,
        timeLeft: duration,
        totalTime: duration,
        exerciseId,
        exerciseName,
      });
    },
    []
  );

  const stopRestTimer = useCallback(() => {
    setRestTimer(null);
  }, []);

  const updateSetProgress = useCallback(
    (
      exerciseId: string,
      setIndex: number,
      newProgress: Partial<SetProgress>
    ) => {
      setExerciseProgress((current) => {
        const newTotalProgress = { ...current };
        const specificExerciseProgress = [
          ...(newTotalProgress[exerciseId] as SetProgress[]),
        ];
        const updatedSet = {
          ...specificExerciseProgress[setIndex],
          ...newProgress,
        };
        specificExerciseProgress[setIndex] = updatedSet;
        newTotalProgress[exerciseId] = specificExerciseProgress;

        // Auto-start rest timer when a set is completed (but not the last set)
        if (newProgress.completed === true && activeWorkout) {
          const exercise = activeWorkout.routine.exercises.find(
            (ex) => ex.id === exerciseId
          );
          if (exercise && exercise.restTime) {
            const totalSets = specificExerciseProgress.length;
            const completedSets = specificExerciseProgress.filter(
              (set) => set.completed
            ).length;

            // Only start timer if this isn't the last set
            if (completedSets < totalSets) {
              startRestTimer(exerciseId, exercise.name, exercise.restTime);
            }
          }
        }

        return newTotalProgress;
      });
    },
    [activeWorkout, startRestTimer]
  );

  const updateCardioProgress = useCallback(
    (exerciseId: string, newProgress: Partial<CardioProgress>) => {
      setExerciseProgress((current) => {
        const newTotalProgress = { ...current };
        newTotalProgress[exerciseId] = {
          ...(newTotalProgress[exerciseId] as CardioProgress),
          ...newProgress,
        };
        return newTotalProgress;
      });
    },
    []
  );

  // Unit conversion helpers - weights are always stored as kg in the database
  const getDisplayWeight = useCallback(
    (weight: number): number => {
      return convertWeight(weight, "kg", settings.units.weightUnit);
    },
    [convertWeight, settings.units.weightUnit]
  );

  const getStorageWeight = useCallback(
    (displayWeight: number): number => {
      return convertWeight(displayWeight, settings.units.weightUnit, "kg");
    },
    [convertWeight, settings.units.weightUnit]
  );

  const getCurrentWeightUnit = useCallback((): string => {
    return settings.units.weightUnit;
  }, [settings.units.weightUnit]);

  const value = {
    activeWorkout,
    exerciseProgress,
    restTimer,
    isLoaded,
    startWorkout,
    finishWorkout,
    updateSetProgress,
    updateCardioProgress,
    startRestTimer,
    stopRestTimer,
    getDisplayWeight,
    getStorageWeight,
    getCurrentWeightUnit,
  };

  return (
    <ActiveWorkoutContext.Provider value={value}>
      {children}
    </ActiveWorkoutContext.Provider>
  );
};

export const useActiveWorkout = () => useContext(ActiveWorkoutContext);
