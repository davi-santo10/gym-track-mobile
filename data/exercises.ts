export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Biceps'
  | 'Triceps'
  | 'Shoulders'
  | 'Forearm'
  | 'Core'
  | 'Quadriceps'
  | 'Hamstrings'
  | 'Calves'
  | 'Cardio';

  export interface ExerciseData {
	id: string;
	name: string;
	muscleGroup: MuscleGroup;
    exerciseType: 'strength' | 'cardio';
	restTime?: number;
  	imageUrl?: string;
}
  
export const PREDEFINED_EXERCISES: ExerciseData[] = [
	// Chest
	{ id: 'ex_1', name: 'Barbell Bench Press', muscleGroup: 'Chest', exerciseType: 'strength' },
	{ id: 'ex_2', name: 'Dumbbell Bench Press', muscleGroup: 'Chest', exerciseType: 'strength' },
	{ id: 'ex_3', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', exerciseType: 'strength' },
	{ id: 'ex_4', name: 'Push-up', muscleGroup: 'Chest', exerciseType: 'strength' },
	{ id: 'ex_5', name: 'Chest Dip', muscleGroup: 'Chest', exerciseType: 'strength' },
	{ id: 'ex_6', name: 'Dumbbell Fly', muscleGroup: 'Chest', exerciseType: 'strength' },
	{ id: 'ex_7', name: 'Cable Crossover', muscleGroup: 'Chest', exerciseType: 'strength' },
  
	// Back
	{ id: 'ex_8', name: 'Pull-up', muscleGroup: 'Back', exerciseType: 'strength' },
	{ id: 'ex_9', name: 'Lat Pulldown', muscleGroup: 'Back', exerciseType: 'strength' },
	{ id: 'ex_10', name: 'Bent Over Barbell Row', muscleGroup: 'Back', exerciseType: 'strength' },
	{ id: 'ex_11', name: 'T-Bar Row', muscleGroup: 'Back', exerciseType: 'strength' },
	{ id: 'ex_12', name: 'Seated Cable Row', muscleGroup: 'Back', exerciseType: 'strength' },
	{ id: 'ex_13', name: 'Dumbbell Row', muscleGroup: 'Back', exerciseType: 'strength' },
	{ id: 'ex_14', name: 'Face Pull', muscleGroup: 'Back', exerciseType: 'strength' },
  
	// Biceps
	{ id: 'ex_15', name: 'Barbell Curl', muscleGroup: 'Biceps', exerciseType: 'strength' },
	{ id: 'ex_16', name: 'Dumbbell Curl', muscleGroup: 'Biceps', exerciseType: 'strength' },
	{ id: 'ex_17', name: 'Hammer Curl', muscleGroup: 'Biceps', exerciseType: 'strength' },
	{ id: 'ex_18', name: 'Preacher Curl', muscleGroup: 'Biceps', exerciseType: 'strength' },
	{ id: 'ex_19', name: 'Concentration Curl', muscleGroup: 'Biceps', exerciseType: 'strength' },
  
	// Triceps
	{ id: 'ex_20', name: 'Tricep Pushdown (Rope)', muscleGroup: 'Triceps', exerciseType: 'strength' },
	{ id: 'ex_21', name: 'Skull Crusher', muscleGroup: 'Triceps', exerciseType: 'strength' },
	{ id: 'ex_22', name: 'Close-Grip Bench Press', muscleGroup: 'Triceps', exerciseType: 'strength' },
	{ id: 'ex_23', name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', exerciseType: 'strength' },
	{ id: 'ex_24', name: 'Bench Dip', muscleGroup: 'Triceps', exerciseType: 'strength' },
  
	// Shoulders
	{ id: 'ex_25', name: 'Overhead Press (Barbell)', muscleGroup: 'Shoulders', exerciseType: 'strength' },
	{ id: 'ex_26', name: 'Seated Dumbbell Press', muscleGroup: 'Shoulders', exerciseType: 'strength' },
	{ id: 'ex_27', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders', exerciseType: 'strength' },
	{ id: 'ex_28', name: 'Dumbbell Front Raise', muscleGroup: 'Shoulders', exerciseType: 'strength' },
	{ id: 'ex_29', name: 'Bent Over Dumbbell Raise', muscleGroup: 'Shoulders', exerciseType: 'strength' },
	{ id: 'ex_30', name: 'Barbell Shrug', muscleGroup: 'Shoulders', exerciseType: 'strength' },
  
	// Forearm
	{ id: 'ex_31', name: 'Dumbbell Wrist Curl', muscleGroup: 'Forearm', exerciseType: 'strength' },
	{ id: 'ex_32', name: 'Dumbbell Reverse Wrist Curl', muscleGroup: 'Forearm', exerciseType: 'strength' },
	{ id: 'ex_33', name: "Farmer's Walk", muscleGroup: 'Forearm', exerciseType: 'strength' },
  
	// Core
	{ id: 'ex_34', name: 'Crunch', muscleGroup: 'Core', exerciseType: 'strength' },
	{ id: 'ex_35', name: 'Plank', muscleGroup: 'Core', exerciseType: 'cardio' }, // Plank is time-based
	{ id: 'ex_36', name: 'Leg Raise', muscleGroup: 'Core', exerciseType: 'strength' },
	{ id: 'ex_37', name: 'Russian Twist', muscleGroup: 'Core', exerciseType: 'strength' },
	{ id: 'ex_38', name: 'Hanging Knee Raise', muscleGroup: 'Core', exerciseType: 'strength' },
  
	// Quadriceps
	{ id: 'ex_39', name: 'Barbell Back Squat', muscleGroup: 'Quadriceps', exerciseType: 'strength' },
	{ id: 'ex_40', name: 'Leg Press', muscleGroup: 'Quadriceps', exerciseType: 'strength' },
	{ id: 'ex_41', name: 'Lunge', muscleGroup: 'Quadriceps', exerciseType: 'strength' },
	{ id: 'ex_42', name: 'Leg Extension', muscleGroup: 'Quadriceps', exerciseType: 'strength' },
	{ id: 'ex_43', name: 'Goblet Squat', muscleGroup: 'Quadriceps', exerciseType: 'strength' },
  
	// Hamstrings
	{ id: 'ex_44', name: 'Deadlift', muscleGroup: 'Hamstrings', exerciseType: 'strength' },
	{ id: 'ex_45', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', exerciseType: 'strength' },
	{ id: 'ex_46', name: 'Lying Leg Curl', muscleGroup: 'Hamstrings', exerciseType: 'strength' },
	{ id: 'ex_47', name: 'Seated Leg Curl', muscleGroup: 'Hamstrings', exerciseType: 'strength' },
	{ id: 'ex_48', name: 'Good Morning', muscleGroup: 'Hamstrings', exerciseType: 'strength' },
  
	// Calves
	{ id: 'ex_49', name: 'Standing Calf Raise', muscleGroup: 'Calves', exerciseType: 'strength' },
	{ id: 'ex_50', name: 'Seated Calf Raise', muscleGroup: 'Calves', exerciseType: 'strength' },

    // Cardio
    { id: 'ex_51', name: 'Treadmill Running', muscleGroup: 'Cardio', exerciseType: 'cardio' },
    { id: 'ex_52', name: 'Stationary Bike', muscleGroup: 'Cardio', exerciseType: 'cardio' },
    { id: 'ex_53', name: 'Elliptical Trainer', muscleGroup: 'Cardio', exerciseType: 'cardio' },
    { id: 'ex_54', name: 'Rowing Machine', muscleGroup: 'Cardio', exerciseType: 'cardio' },
    { id: 'ex_55', name: 'Stair Climber', muscleGroup: 'Cardio', exerciseType: 'cardio' },
    { id: 'ex_56', name: 'Jumping Jacks', muscleGroup: 'Cardio', exerciseType: 'cardio' },
  ];