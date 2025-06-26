import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Exercise } from "./RoutinesContext";
import { useSettings } from "./SettingsContext";

// Updated progress type to handle both strength and cardio
export interface LogSetProgress {
  reps: number;
  weight: number;
  duration: number; // For cardio exercises
  completed?: boolean;
}

export interface WorkoutLog {
  routineId: string;
  sets: any;
  id: string;
  date: number;
  routineName: string;
  duration: number;
  exercises: Array<{
    details: Exercise;
    progress: LogSetProgress[];
  }>;
}

export interface WorkoutSummary {
  id: string;
  duration: number;
  totalWeight: number;
  totalSets: number;
}

interface WorkoutLogContextType {
  logs: WorkoutLog[];
  setLastWorkoutSummary: (summary: WorkoutSummary) => void;
  consumeLastWorkoutSummary: () => WorkoutSummary | null;
  addWorkoutLog: (log: Omit<WorkoutLog, "id">) => void;
  deleteWorkoutLog: (logId: string) => void;
  clearAllLogs: () => void;
  // Unit conversion helpers for displaying weights from logs
  getDisplayWeightFromLog: (weight: number) => number;
  getCurrentWeightUnit: () => string;
}

const WorkoutLogContext = createContext<WorkoutLogContextType>({} as any);
const LOGS_STORAGE_KEY = "my-gym-tracker-workout-logs";

export const WorkoutLogProvider = ({ children }: { children: ReactNode }) => {
  const { settings, convertWeight } = useSettings();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [lastWorkoutSummary, setLastWorkoutSummary] =
    useState<WorkoutSummary | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY);
        if (storedLogs !== null) {
          setLogs(JSON.parse(storedLogs));
        }
      } catch (e) {
        console.error("Failed to load workout logs.", e);
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadLogs();
  }, []);

  useEffect(() => {
    if (!isDataLoaded) return;
    const saveLogs = async () => {
      try {
        await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
      } catch (e) {
        console.error("Failed to save workout logs.", e);
      }
    };
    saveLogs();
  }, [logs, isDataLoaded]);

  const addWorkoutLog = useCallback((logData: Omit<WorkoutLog, "id">) => {
    const newLog: WorkoutLog = {
      ...logData,
      id: `log-${Date.now()}`,
    };
    setLogs((currentLogs) => [newLog, ...currentLogs]);
  }, []);

  const deleteWorkoutLog = useCallback((logId: string) => {
    setLogs((currentLogs) => currentLogs.filter((log) => log.id !== logId));
  }, []);

  const clearAllLogs = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(LOGS_STORAGE_KEY);
      setLogs([]);
    } catch (e) {
      console.error("Failed to clear workout logs.", e);
    }
  }, []);

  const consumeLastWorkoutSummary = useCallback(() => {
    const summary = lastWorkoutSummary;
    setLastWorkoutSummary(null);
    return summary;
  }, [lastWorkoutSummary]);

  // Unit conversion helper - weights are stored as kg in logs
  const getDisplayWeightFromLog = useCallback(
    (weight: number): number => {
      return convertWeight(weight, "kg", settings.units.weightUnit);
    },
    [convertWeight, settings.units.weightUnit]
  );

  const getCurrentWeightUnit = useCallback((): string => {
    return settings.units.weightUnit;
  }, [settings.units.weightUnit]);

  const value = {
    logs,
    addWorkoutLog,
    deleteWorkoutLog,
    clearAllLogs,
    setLastWorkoutSummary,
    consumeLastWorkoutSummary,
    getDisplayWeightFromLog,
    getCurrentWeightUnit,
  };

  return (
    <WorkoutLogContext.Provider value={value}>
      {children}
    </WorkoutLogContext.Provider>
  );
};

export const useWorkoutLog = () => useContext(WorkoutLogContext);
