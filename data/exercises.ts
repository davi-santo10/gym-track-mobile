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

export type ExerciseType = 'strength' | 'cardio';

export interface ExerciseData {
	id: string;
	name: string;
	muscleGroup: MuscleGroup;
	type: ExerciseType;
	restTime?: number;
  	imageUrl?: string;
}

export const PREDEFINED_EXERCISES: ExerciseData[] = [
	// Chest
	{ id: 'ex_1', name: 'Barbell Bench Press', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_2', name: 'Dumbbell Bench Press', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_3', name: 'Incline Dumbbell Press', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_4', name: 'Push-up', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_5', name: 'Chest Dip', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_6', name: 'Dumbbell Fly', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_7', name: 'Cable Crossover', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_8', name: 'Incline Barbell Bench Press', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_9', name: 'Decline Barbell Bench Press', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_10', name: 'Incline Dumbbell Fly', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_11', name: 'Decline Dumbbell Press', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_12', name: 'Pec-Deck Machine', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_13', name: 'Machine Chest Press', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_14', name: 'Smith Machine Bench Press', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_15', name: 'Dumbbell Pullover', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_16', name: 'Incline Push-up', muscleGroup: 'Chest', type: 'strength' },
	{ id: 'ex_17', name: 'Decline Push-up', muscleGroup: 'Chest', type: 'strength' },

	// Back
	{ id: 'ex_18', name: 'Pull-up', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_19', name: 'Lat Pulldown', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_20', name: 'Bent Over Barbell Row', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_21', name: 'T-Bar Row', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_22', name: 'Seated Cable Row', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_23', name: 'Dumbbell Row', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_24', name: 'Face Pull', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_25', name: 'Chin-up', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_26', name: 'Pendlay Row', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_27', name: 'Inverted Row', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_28', name: 'Straight-Arm Pulldown', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_29', name: 'Rack Pull', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_30', name: 'Hyperextension', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_31', name: 'Machine Row', muscleGroup: 'Back', type: 'strength' },
	{ id: 'ex_32', name: 'Seal Row', muscleGroup: 'Back', type: 'strength' },

	// Biceps
	{ id: 'ex_33', name: 'Barbell Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_34', name: 'Dumbbell Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_35', name: 'Hammer Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_36', name: 'Preacher Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_37', name: 'Concentration Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_38', name: 'EZ-Bar Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_39', name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_40', name: 'Cable Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_41', name: 'Reverse Grip Barbell Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_42', name: 'Spider Curl', muscleGroup: 'Biceps', type: 'strength' },
	{ id: 'ex_43', name: 'Zottman Curl', muscleGroup: 'Biceps', type: 'strength' },

	// Triceps
	{ id: 'ex_44', name: 'Tricep Pushdown (Rope)', muscleGroup: 'Triceps', type: 'strength' },
	{ id: 'ex_45', name: 'Skull Crusher', muscleGroup: 'Triceps', type: 'strength' },
	{ id: 'ex_46', name: 'Close-Grip Bench Press', muscleGroup: 'Triceps', type: 'strength' },
	{ id: 'ex_47', name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', type: 'strength' },
	{ id: 'ex_48', name: 'Bench Dip', muscleGroup: 'Triceps', type: 'strength' },
	{ id: 'ex_49', name: 'Tricep Kickback', muscleGroup: 'Triceps', type: 'strength' },
	{ id: 'ex_50', name: 'Diamond Push-up', muscleGroup: 'Triceps', type: 'strength' },
	{ id: 'ex_51', name: 'Seated Triceps Press', muscleGroup: 'Triceps', type: 'strength' },
	{ id: 'ex_52', name: 'Tate Press', muscleGroup: 'Triceps', type: 'strength' },
	{ id: 'ex_53', name: 'JM Press', muscleGroup: 'Triceps', type: 'strength' },

	// Shoulders
	{ id: 'ex_54', name: 'Overhead Press (Barbell)', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_55', name: 'Seated Dumbbell Press', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_56', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_57', name: 'Dumbbell Front Raise', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_58', name: 'Bent Over Dumbbell Raise', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_59', name: 'Barbell Shrug', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_60', name: 'Arnold Press', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_61', name: 'Upright Row', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_62', name: 'Machine Shoulder Press', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_63', name: 'Cable Lateral Raise', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_64', name: 'Landmine Press', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_65', name: 'Reverse Pec-Deck', muscleGroup: 'Shoulders', type: 'strength' },
	{ id: 'ex_66', name: 'Pike Push-up', muscleGroup: 'Shoulders', type: 'strength' },

	// Forearm
	{ id: 'ex_67', name: 'Dumbbell Wrist Curl', muscleGroup: 'Forearm', type: 'strength' },
	{ id: 'ex_68', name: 'Dumbbell Reverse Wrist Curl', muscleGroup: 'Forearm', type: 'strength' },
	{ id: 'ex_69', name: "Farmer's Walk", muscleGroup: 'Forearm', type: 'strength' },
	{ id: 'ex_70', name: 'Barbell Wrist Curl', muscleGroup: 'Forearm', type: 'strength' },
	{ id: 'ex_71', name: 'Barbell Reverse Wrist Curl', muscleGroup: 'Forearm', type: 'strength' },
	{ id: 'ex_72', name: 'Plate Pinch', muscleGroup: 'Forearm', type: 'strength' },
	{ id: 'ex_73', name: 'Wrist Roller', muscleGroup: 'Forearm', type: 'strength' },

	// Core
	{ id: 'ex_74', name: 'Crunch', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_75', name: 'Plank', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_76', name: 'Leg Raise', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_77', name: 'Russian Twist', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_78', name: 'Hanging Knee Raise', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_79', name: 'Cable Crunch', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_80', name: 'Side Plank', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_81', name: 'Hanging Leg Raise', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_82', name: 'Ab Rollout', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_83', name: 'Wood Chop', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_84', name: 'Pallof Press', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_85', name: 'Bicycle Crunch', muscleGroup: 'Core', type: 'strength' },
	{ id: 'ex_86', name: 'Dead Bug', muscleGroup: 'Core', type: 'strength' },

	// Quadriceps
	{ id: 'ex_87', name: 'Barbell Back Squat', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_88', name: 'Leg Press', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_89', name: 'Lunge', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_90', name: 'Leg Extension', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_91', name: 'Goblet Squat', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_92', name: 'Barbell Front Squat', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_93', name: 'Hack Squat', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_94', name: 'Bulgarian Split Squat', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_95', name: 'Sissy Squat', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_96', name: 'Step-Up', muscleGroup: 'Quadriceps', type: 'strength' },
	{ id: 'ex_97', name: 'Walking Lunge', muscleGroup: 'Quadriceps', type: 'strength' },

	// Hamstrings
	{ id: 'ex_98', name: 'Deadlift', muscleGroup: 'Hamstrings', type: 'strength' },
	{ id: 'ex_99', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', type: 'strength' },
	{ id: 'ex_100', name: 'Lying Leg Curl', muscleGroup: 'Hamstrings', type: 'strength' },
	{ id: 'ex_101', name: 'Seated Leg Curl', muscleGroup: 'Hamstrings', type: 'strength' },
	{ id: 'ex_102', name: 'Good Morning', muscleGroup: 'Hamstrings', type: 'strength' },
	{ id: 'ex_103', name: 'Stiff-Legged Deadlift', muscleGroup: 'Hamstrings', type: 'strength' },
	{ id: 'ex_104', name: 'Glute-Ham Raise (GHR)', muscleGroup: 'Hamstrings', type: 'strength' },
	{ id: 'ex_105', name: 'Kettlebell Swing', muscleGroup: 'Hamstrings', type: 'strength' },
	{ id: 'ex_106', name: 'Nordic Hamstring Curl', muscleGroup: 'Hamstrings', type: 'strength' },
	{ id: 'ex_107', name: 'Single-Leg Romanian Deadlift', muscleGroup: 'Hamstrings', type: 'strength' },

	// Calves
	{ id: 'ex_108', name: 'Standing Calf Raise', muscleGroup: 'Calves', type: 'strength' },
	{ id: 'ex_109', name: 'Seated Calf Raise', muscleGroup: 'Calves', type: 'strength' },
	{ id: 'ex_110', name: 'Donkey Calf Raise', muscleGroup: 'Calves', type: 'strength' },
	{ id: 'ex_111', name: 'Leg Press Calf Raise', muscleGroup: 'Calves', type: 'strength' },
	{ id: 'ex_112', name: 'Smith Machine Calf Raise', muscleGroup: 'Calves', type: 'strength' },
	{ id: 'ex_113', name: 'Single-Leg Calf Raise', muscleGroup: 'Calves', type: 'strength' },
	{ id: 'ex_114', name: 'Tibialis Raise', muscleGroup: 'Calves', type: 'strength' },

	// Cardio
	{ id: 'ex_115', name: 'Treadmill', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_116', name: 'Stationary Bike', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_117', name: 'Elliptical', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_118', name: 'Rowing Machine', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_119', name: 'StairMaster', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_120', name: 'Outdoor Running', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_121', name: 'Cycling', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_122', name: 'Swimming', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_123', name: 'Jump Rope', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_124', name: 'HIIT Training', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_125', name: 'Walking', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_126', name: 'Jogging', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_127', name: 'Spin Class', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_128', name: 'Burpees', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_129', name: 'Mountain Climbers', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_130', name: 'Boxing', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_131', name: 'Kickboxing', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_132', name: 'Dance Cardio', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_133', name: 'Step Aerobics', muscleGroup: 'Cardio', type: 'cardio' },
	{ id: 'ex_134', name: 'Zumba', muscleGroup: 'Cardio', type: 'cardio' },
];