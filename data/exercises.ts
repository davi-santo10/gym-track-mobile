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
	restTime?: number;
  	imageUrl?: string;
  }
  
  // The new, comprehensive list of predefined exercises
  export const PREDEFINED_EXERCISES: ExerciseData[] = [
	// Chest
	{ id: 'ex_1', name: 'Barbell Bench Press', muscleGroup: 'Chest' },
	{ id: 'ex_2', name: 'Dumbbell Bench Press', muscleGroup: 'Chest' },
	{ id: 'ex_3', name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
	{ id: 'ex_4', name: 'Push-up', muscleGroup: 'Chest' },
	{ id: 'ex_5', name: 'Chest Dip', muscleGroup: 'Chest' },
	{ id: 'ex_6', name: 'Dumbbell Fly', muscleGroup: 'Chest' },
	{ id: 'ex_7', name: 'Cable Crossover', muscleGroup: 'Chest' },
  
	// Back
	{ id: 'ex_8', name: 'Pull-up', muscleGroup: 'Back' },
	{ id: 'ex_9', name: 'Lat Pulldown', muscleGroup: 'Back' },
	{ id: 'ex_10', name: 'Bent Over Barbell Row', muscleGroup: 'Back' },
	{ id: 'ex_11', name: 'T-Bar Row', muscleGroup: 'Back' },
	{ id: 'ex_12', name: 'Seated Cable Row', muscleGroup: 'Back' },
	{ id: 'ex_13', name: 'Dumbbell Row', muscleGroup: 'Back' },
	{ id: 'ex_14', name: 'Face Pull', muscleGroup: 'Back' },
  
	// Biceps
	{ id: 'ex_15', name: 'Barbell Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_16', name: 'Dumbbell Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_17', name: 'Hammer Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_18', name: 'Preacher Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_19', name: 'Concentration Curl', muscleGroup: 'Biceps' },
  
	// Triceps
	{ id: 'ex_20', name: 'Tricep Pushdown (Rope)', muscleGroup: 'Triceps' },
	{ id: 'ex_21', name: 'Skull Crusher', muscleGroup: 'Triceps' },
	{ id: 'ex_22', name: 'Close-Grip Bench Press', muscleGroup: 'Triceps' },
	{ id: 'ex_23', name: 'Overhead Tricep Extension', muscleGroup: 'Triceps' },
	{ id: 'ex_24', name: 'Bench Dip', muscleGroup: 'Triceps' },
  
	// Shoulders
	{ id: 'ex_25', name: 'Overhead Press (Barbell)', muscleGroup: 'Shoulders' },
	{ id: 'ex_26', name: 'Seated Dumbbell Press', muscleGroup: 'Shoulders' },
	{ id: 'ex_27', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders' },
	{ id: 'ex_28', name: 'Dumbbell Front Raise', muscleGroup: 'Shoulders' },
	{ id: 'ex_29', name: 'Bent Over Dumbbell Raise', muscleGroup: 'Shoulders' },
	{ id: 'ex_30', name: 'Barbell Shrug', muscleGroup: 'Shoulders' },
  
	// Forearm
	{ id: 'ex_31', name: 'Dumbbell Wrist Curl', muscleGroup: 'Forearm' },
	{ id: 'ex_32', name: 'Dumbbell Reverse Wrist Curl', muscleGroup: 'Forearm' },
	{ id: 'ex_33', name: "Farmer's Walk", muscleGroup: 'Forearm' },
  
	// Core
	{ id: 'ex_34', name: 'Crunch', muscleGroup: 'Core' },
	{ id: 'ex_35', name: 'Plank', muscleGroup: 'Core' },
	{ id: 'ex_36', name: 'Leg Raise', muscleGroup: 'Core' },
	{ id: 'ex_37', name: 'Russian Twist', muscleGroup: 'Core' },
	{ id: 'ex_38', name: 'Hanging Knee Raise', muscleGroup: 'Core' },
  
	// Quadriceps
	{ id: 'ex_39', name: 'Barbell Back Squat', muscleGroup: 'Quadriceps' },
	{ id: 'ex_40', name: 'Leg Press', muscleGroup: 'Quadriceps' },
	{ id: 'ex_41', name: 'Lunge', muscleGroup: 'Quadriceps' },
	{ id: 'ex_42', name: 'Leg Extension', muscleGroup: 'Quadriceps' },
	{ id: 'ex_43', name: 'Goblet Squat', muscleGroup: 'Quadriceps' },
  
	// Hamstrings
	{ id: 'ex_44', name: 'Deadlift', muscleGroup: 'Hamstrings' },
	{ id: 'ex_45', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings' },
	{ id: 'ex_46', name: 'Lying Leg Curl', muscleGroup: 'Hamstrings' },
	{ id: 'ex_47', name: 'Seated Leg Curl', muscleGroup: 'Hamstrings' },
	{ id: 'ex_48', name: 'Good Morning', muscleGroup: 'Hamstrings' },
  
	// Calves
	{ id: 'ex_49', name: 'Standing Calf Raise', muscleGroup: 'Calves' },
	{ id: 'ex_50', name: 'Seated Calf Raise', muscleGroup: 'Calves' },
  ];