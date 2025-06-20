import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SetProgress} from '@/context/ActiveWorkoutContext'
import { Exercise } from "./RoutinesContext";

export interface WorkoutLog {
	id: string;
	date: number;
	routineName:string;
	duration:number;
	exercises: Array<{
		details: Exercise;
		progress: SetProgress[]
	}>
}

interface WorkoutLogContextType {
	logs: WorkoutLog[]
	addWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'date'>) => void
	deleteWorkoutLog: (logId: string) => void
	clearAllLogs: () => void
}

const WorkoutLogContext = createContext<WorkoutLogContextType>({} as any)
const LOGS_STORAGE_KEY = 'my-gym-tracker-workout-logs'

export const WorkoutLogProvider = ({ children } : { children: ReactNode }) => {
	const [logs, setLogs] = useState<WorkoutLog[]>([])
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	useEffect(() => {
		const loadLogs = async () => {
			try {
				const storedLogs = await AsyncStorage.getItem(LOGS_STORAGE_KEY)
				if (storedLogs !== null) {
					setLogs(JSON.parse(storedLogs))
				}
			} catch (e) {
				console.error("Failed to load workout logs.", e)

			} finally {
				setIsDataLoaded(true)
			}
		}
		loadLogs()
	}, [])

	useEffect (() => {
		if (!isDataLoaded) return;
		const saveLogs = async () => {
			try {
				await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs))
			} catch (e) {
				console.error("Failed to save workout logs.", e)
			}
		}
		saveLogs ();
	}, [logs, isDataLoaded])

	const addWorkoutLog = useCallback((logData: Omit<WorkoutLog, 'id' | 'date'>) => {
		const newLog: WorkoutLog = {
			...logData,
			id: `log-${Date.now()}`,
			date: Date.now()
		}
		setLogs(currentLogs => [newLog, ...currentLogs])
	}, [])

	const deleteWorkoutLog = useCallback((logId: string) => {
		setLogs(currentLogs => currentLogs.filter(log => log.id !== logId))
	}, [])

	const clearAllLogs = useCallback(async () => {
		try {
			await AsyncStorage.removeItem(LOGS_STORAGE_KEY)
			setLogs([])
		} catch (e) {
			console.error("Failed to clear workout logs.", e)
		}
	}, [])

	const value = { logs, addWorkoutLog,deleteWorkoutLog, clearAllLogs }

	return (
		<WorkoutLogContext.Provider value={value}>
			{children}
		</WorkoutLogContext.Provider>
	)
}

export const useWorkoutLog = () => useContext(WorkoutLogContext)