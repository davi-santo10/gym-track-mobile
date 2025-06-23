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
  | 'Calves';

  export interface ExerciseData {
	id: string;
	name: string;
	muscleGroup: MuscleGroup;
	restTime?: number;
  	imageUrl?: string;
  }
  
  export const PREDEFINED_EXERCISES: ExerciseData[] = [
	// Chest
	{ id: 'ex_1', name: 'Barbell Bench Press', muscleGroup: 'Chest' },
	{ id: 'ex_2', name: 'Dumbbell Bench Press', muscleGroup: 'Chest' },
	{ id: 'ex_3', name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
	{ id: 'ex_4', name: 'Push-up', muscleGroup: 'Chest' },
	{ id: 'ex_5', name: 'Chest Dip', muscleGroup: 'Chest' },
	{ id: 'ex_6', name: 'Dumbbell Fly', muscleGroup: 'Chest' },
	{ id: 'ex_7', name: 'Cable Crossover', muscleGroup: 'Chest' },
	{ id: 'ex_8', name: 'Incline Barbell Bench Press', muscleGroup: 'Chest' },
	{ id: 'ex_9', name: 'Decline Barbell Bench Press', muscleGroup: 'Chest' },
	{ id: 'ex_10', name: 'Incline Dumbbell Fly', muscleGroup: 'Chest' },
	{ id: 'ex_11', name: 'Decline Dumbbell Press', muscleGroup: 'Chest' },
	{ id: 'ex_12', name: 'Pec-Deck Machine', muscleGroup: 'Chest' },
	{ id: 'ex_13', name: 'Machine Chest Press', muscleGroup: 'Chest' },
	{ id: 'ex_14', name: 'Smith Machine Bench Press', muscleGroup: 'Chest' },
	{ id: 'ex_15', name: 'Dumbbell Pullover', muscleGroup: 'Chest' },
	{ id: 'ex_16', name: 'Incline Push-up', muscleGroup: 'Chest' },
	{ id: 'ex_17', name: 'Decline Push-up', muscleGroup: 'Chest' },
  
	// Back
	{ id: 'ex_18', name: 'Pull-up', muscleGroup: 'Back' },
	{ id: 'ex_19', name: 'Lat Pulldown', muscleGroup: 'Back' },
	{ id: 'ex_20', name: 'Bent Over Barbell Row', muscleGroup: 'Back' },
	{ id: 'ex_21', name: 'T-Bar Row', muscleGroup: 'Back' },
	{ id: 'ex_22', name: 'Seated Cable Row', muscleGroup: 'Back' },
	{ id: 'ex_23', name: 'Dumbbell Row', muscleGroup: 'Back' },
	{ id: 'ex_24', name: 'Face Pull', muscleGroup: 'Back' },
	{ id: 'ex_25', name: 'Chin-up', muscleGroup: 'Back' },
	{ id: 'ex_26', name: 'Pendlay Row', muscleGroup: 'Back' },
	{ id: 'ex_27', name: 'Inverted Row', muscleGroup: 'Back' },
	{ id: 'ex_28', name: 'Straight-Arm Pulldown', muscleGroup: 'Back' },
	{ id: 'ex_29', name: 'Rack Pull', muscleGroup: 'Back' },
	{ id: 'ex_30', name: 'Hyperextension', muscleGroup: 'Back' },
	{ id: 'ex_31', name: 'Machine Row', muscleGroup: 'Back' },
	{ id: 'ex_32', name: 'Seal Row', muscleGroup: 'Back' },
  
	// Biceps
	{ id: 'ex_33', name: 'Barbell Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_34', name: 'Dumbbell Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_35', name: 'Hammer Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_36', name: 'Preacher Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_37', name: 'Concentration Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_38', name: 'EZ-Bar Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_39', name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_40', name: 'Cable Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_41', name: 'Reverse Grip Barbell Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_42', name: 'Spider Curl', muscleGroup: 'Biceps' },
	{ id: 'ex_43', name: 'Zottman Curl', muscleGroup: 'Biceps' },
  
	// Triceps
	{ id: 'ex_44', name: 'Tricep Pushdown (Rope)', muscleGroup: 'Triceps' },
	{ id: 'ex_45', name: 'Skull Crusher', muscleGroup: 'Triceps' },
	{ id: 'ex_46', name: 'Close-Grip Bench Press', muscleGroup: 'Triceps' },
	{ id: 'ex_47', name: 'Overhead Tricep Extension', muscleGroup: 'Triceps' },
	{ id: 'ex_48', name: 'Bench Dip', muscleGroup: 'Triceps' },
	{ id: 'ex_49', name: 'Tricep Kickback', muscleGroup: 'Triceps' },
	{ id: 'ex_50', name: 'Diamond Push-up', muscleGroup: 'Triceps' },
	{ id: 'ex_51', name: 'Seated Triceps Press', muscleGroup: 'Triceps' },
	{ id: 'ex_52', name: 'Tate Press', muscleGroup: 'Triceps' },
	{ id: 'ex_53', name: 'JM Press', muscleGroup: 'Triceps' },
  
	// Shoulders
	{ id: 'ex_54', name: 'Overhead Press (Barbell)', muscleGroup: 'Shoulders' },
	{ id: 'ex_55', name: 'Seated Dumbbell Press', muscleGroup: 'Shoulders' },
	{ id: 'ex_56', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders' },
	{ id: 'ex_57', name: 'Dumbbell Front Raise', muscleGroup: 'Shoulders' },
	{ id: 'ex_58', name: 'Bent Over Dumbbell Raise', muscleGroup: 'Shoulders' },
	{ id: 'ex_59', name: 'Barbell Shrug', muscleGroup: 'Shoulders' },
	{ id: 'ex_60', name: 'Arnold Press', muscleGroup: 'Shoulders' },
	{ id: 'ex_61', name: 'Upright Row', muscleGroup: 'Shoulders' },
	{ id: 'ex_62', name: 'Machine Shoulder Press', muscleGroup: 'Shoulders' },
	{ id: 'ex_63', name: 'Cable Lateral Raise', muscleGroup: 'Shoulders' },
	{ id: 'ex_64', name: 'Landmine Press', muscleGroup: 'Shoulders' },
	{ id: 'ex_65', name: 'Reverse Pec-Deck', muscleGroup: 'Shoulders' },
	{ id: 'ex_66', name: 'Pike Push-up', muscleGroup: 'Shoulders' },
  
	// Forearm
	{ id: 'ex_67', name: 'Dumbbell Wrist Curl', muscleGroup: 'Forearm' },
	{ id: 'ex_68', name: 'Dumbbell Reverse Wrist Curl', muscleGroup: 'Forearm' },
	{ id: 'ex_69', name: "Farmer's Walk", muscleGroup: 'Forearm' },
	{ id: 'ex_70', name: 'Barbell Wrist Curl', muscleGroup: 'Forearm' },
	{ id: 'ex_71', name: 'Barbell Reverse Wrist Curl', muscleGroup: 'Forearm' },
	{ id: 'ex_72', name: 'Plate Pinch', muscleGroup: 'Forearm' },
	{ id: 'ex_73', name: 'Wrist Roller', muscleGroup: 'Forearm' },
  
	// Core
	{ id: 'ex_74', name: 'Crunch', muscleGroup: 'Core' },
	{ id: 'ex_75', name: 'Plank', muscleGroup: 'Core' },
	{ id: 'ex_76', name: 'Leg Raise', muscleGroup: 'Core' },
	{ id: 'ex_77', name: 'Russian Twist', muscleGroup: 'Core' },
	{ id: 'ex_78', name: 'Hanging Knee Raise', muscleGroup: 'Core' },
	{ id: 'ex_79', name: 'Cable Crunch', muscleGroup: 'Core' },
	{ id: 'ex_80', name: 'Side Plank', muscleGroup: 'Core' },
	{ id: 'ex_81', name: 'Hanging Leg Raise', muscleGroup: 'Core' },
	{ id: 'ex_82', name: 'Ab Rollout', muscleGroup: 'Core' },
	{ id: 'ex_83', name: 'Wood Chop', muscleGroup: 'Core' },
	{ id: 'ex_84', name: 'Pallof Press', muscleGroup: 'Core' },
	{ id: 'ex_85', name: 'Bicycle Crunch', muscleGroup: 'Core' },
	{ id: 'ex_86', name: 'Dead Bug', muscleGroup: 'Core' },
  
	// Quadriceps
	{ id: 'ex_87', name: 'Barbell Back Squat', muscleGroup: 'Quadriceps' },
	{ id: 'ex_88', name: 'Leg Press', muscleGroup: 'Quadriceps' },
	{ id: 'ex_89', name: 'Lunge', muscleGroup: 'Quadriceps' },
	{ id: 'ex_90', name: 'Leg Extension', muscleGroup: 'Quadriceps' },
	{ id: 'ex_91', name: 'Goblet Squat', muscleGroup: 'Quadriceps' },
	{ id: 'ex_92', name: 'Barbell Front Squat', muscleGroup: 'Quadriceps' },
	{ id: 'ex_93', name: 'Hack Squat', muscleGroup: 'Quadriceps' },
	{ id: 'ex_94', name: 'Bulgarian Split Squat', muscleGroup: 'Quadriceps' },
	{ id: 'ex_95', name: 'Sissy Squat', muscleGroup: 'Quadriceps' },
	{ id: 'ex_96', name: 'Step-Up', muscleGroup: 'Quadriceps' },
	{ id: 'ex_97', name: 'Walking Lunge', muscleGroup: 'Quadriceps' },
  
	// Hamstrings
	{ id: 'ex_98', name: 'Deadlift', muscleGroup: 'Hamstrings' },
	{ id: 'ex_99', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings' },
	{ id: 'ex_100', name: 'Lying Leg Curl', muscleGroup: 'Hamstrings' },
	{ id: 'ex_101', name: 'Seated Leg Curl', muscleGroup: 'Hamstrings' },
	{ id: 'ex_102', name: 'Good Morning', muscleGroup: 'Hamstrings' },
	{ id: 'ex_103', name: 'Stiff-Legged Deadlift', muscleGroup: 'Hamstrings' },
	{ id: 'ex_104', name: 'Glute-Ham Raise (GHR)', muscleGroup: 'Hamstrings' },
	{ id: 'ex_105', name: 'Kettlebell Swing', muscleGroup: 'Hamstrings' },
	{ id: 'ex_106', name: 'Nordic Hamstring Curl', muscleGroup: 'Hamstrings' },
	{ id: 'ex_107', name: 'Single-Leg Romanian Deadlift', muscleGroup: 'Hamstrings' },
  
	// Calves
	{ id: 'ex_108', name: 'Standing Calf Raise', muscleGroup: 'Calves' },
	{ id: 'ex_109', name: 'Seated Calf Raise', muscleGroup: 'Calves' },
	{ id: 'ex_110', name: 'Donkey Calf Raise', muscleGroup: 'Calves' },
	{ id: 'ex_111', name: 'Leg Press Calf Raise', muscleGroup: 'Calves' },
	{ id: 'ex_112', name: 'Smith Machine Calf Raise', muscleGroup: 'Calves' },
	{ id: 'ex_113', name: 'Single-Leg Calf Raise', muscleGroup: 'Calves' },
	{ id: 'ex_114', name: 'Tibialis Raise', muscleGroup: 'Calves' },
  ];