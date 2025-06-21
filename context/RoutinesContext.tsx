import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MuscleGroup } from "@/data/exercises";

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

interface ExerciseBase {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  restTime?: number;
  imageUrl?: string;
}

interface StrengthExercise extends ExerciseBase {
    exerciseType: 'strength';
    sets: string;
    reps: string;
}

interface CardioExercise extends ExerciseBase {
    exerciseType: 'cardio';
    duration: string;
}

export type Exercise = StrengthExercise | CardioExercise;

export interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
  day?: DayOfWeek;
}

interface RoutinesContextType {
  routines: Routine[];
  addRoutine: (name: string, exercises: Omit<Exercise, "id">[], day?: DayOfWeek) => void;
  editRoutine: (name: string, updatedData: Omit<Routine, "id">) => void;
  deleteRoutine: (routineId: string) => void;
}

const RoutinesContext = createContext<RoutinesContextType>({} as any);
const ROUTINES_STORAGE_KEY = "my-gym-tracker-routines";

export const RoutinesProvider = ({ children }: { children: ReactNode }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadRoutinesFromStorage = async () => {
      try {
        const storedRoutines = await AsyncStorage.getItem(ROUTINES_STORAGE_KEY);
        if (storedRoutines !== null) {
          setRoutines(JSON.parse(storedRoutines));
        }
      } catch (e) {
        console.error("Failed to load routines.", e);
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadRoutinesFromStorage();
  }, []);
  useEffect(() => {
    const saveRoutinesToStorage = async () => {
      if (!isDataLoaded) return;
      try {
        const stringifiedRoutines = JSON.stringify(routines);
        await AsyncStorage.setItem(ROUTINES_STORAGE_KEY, stringifiedRoutines);
      } catch (e) {
        console.error("Failed to save routines.", e);
      }
    };
    saveRoutinesToStorage();
  }, [routines, isDataLoaded]);

  const addRoutine = useCallback(
    (name: string, exercises: Omit<Exercise, "id">[], day?: DayOfWeek) => {
      const newRoutine: Routine = {
        id: Date.now().toString(),
        name: name,
        day: day,
        exercises: exercises.map((ex, index) => ({
          ...ex,
          id: `ex-${Date.now()}-${index}`,
        })),
      };
      setRoutines((currentRoutines) => [...currentRoutines, newRoutine]);
    },
    []
  );

  const editRoutine = useCallback(
    (routineId: string, updatedData: Omit<Routine, "id">) => {
      setRoutines((currentRoutines) =>
        currentRoutines.map((routine) =>
          routine.id === routineId
            ? { id: routine.id, ...updatedData }
            : routine
        )
      );
    },
    []
  );

  const deleteRoutine = useCallback((routineId: string) => {
    setRoutines((currentRoutines) =>
      currentRoutines.filter((routine) => routine.id !== routineId)
    );
  }, []);
  const value = { routines, addRoutine, editRoutine, deleteRoutine };

  return (
    <RoutinesContext.Provider value={value}>
      {children}
    </RoutinesContext.Provider>
  );
};

export const useRoutines = () => {
  const context = useContext(RoutinesContext);
  if (context === undefined) {
    throw new Error("useRoutines must be used within a RoutinesProvider");
  }
  return context;
};
