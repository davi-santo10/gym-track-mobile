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
    { id: 'ex_51', name: 'Incline Barbell Bench Press', muscleGroup: 'Chest' },
    { id: 'ex_52', name: 'Decline Barbell Bench Press', muscleGroup: 'Chest' },
    { id: 'ex_53', name: 'Incline Dumbbell Fly', muscleGroup: 'Chest' },
    { id: 'ex_54', name: 'Decline Dumbbell Press', muscleGroup: 'Chest' },
    { id: 'ex_55', name: 'Pec-Deck Machine', muscleGroup: 'Chest' },
    { id: 'ex_56', name: 'Machine Chest Press', muscleGroup: 'Chest' },
    { id: 'ex_57', name: 'Smith Machine Bench Press', muscleGroup: 'Chest' },
    { id: 'ex_58', name: 'Dumbbell Pullover', muscleGroup: 'Chest' },
    { id: 'ex_59', name: 'Incline Push-up', muscleGroup: 'Chest' },
    { id: 'ex_60', name: 'Decline Push-up', muscleGroup: 'Chest' },

    // Back
    { id: 'ex_8', name: 'Pull-up', muscleGroup: 'Back' },
    { id: 'ex_9', name: 'Lat Pulldown', muscleGroup: 'Back' },
    { id: 'ex_10', name: 'Bent Over Barbell Row', muscleGroup: 'Back' },
    { id: 'ex_11', name: 'T-Bar Row', muscleGroup: 'Back' },
    { id: 'ex_12', name: 'Seated Cable Row', muscleGroup: 'Back' },
    { id: 'ex_13', name: 'Dumbbell Row', muscleGroup: 'Back' },
    { id: 'ex_14', name: 'Face Pull', muscleGroup: 'Back' },
    { id: 'ex_61', name: 'Chin-up', muscleGroup: 'Back' },
    { id: 'ex_62', name: 'Pendlay Row', muscleGroup: 'Back' },
    { id: 'ex_63', name: 'Inverted Row', muscleGroup: 'Back' },
    { id: 'ex_64', name: 'Straight-Arm Pulldown', muscleGroup: 'Back' },
    { id: 'ex_65', name: 'Rack Pull', muscleGroup: 'Back' },
    { id: 'ex_66', name: 'Hyperextension', muscleGroup: 'Back' },
    { id: 'ex_67', name: 'Machine Row', muscleGroup: 'Back' },
    { id: 'ex_68', name: 'Seal Row', muscleGroup: 'Back' },

    // Biceps
    { id: 'ex_15', name: 'Barbell Curl', muscleGroup: 'Biceps' },
    { id: 'ex_16', name: 'Dumbbell Curl', muscleGroup: 'Biceps' },
    { id: 'ex_17', name: 'Hammer Curl', muscleGroup: 'Biceps' },
    { id: 'ex_18', name: 'Preacher Curl', muscleGroup: 'Biceps' },
    { id: 'ex_19', name: 'Concentration Curl', muscleGroup: 'Biceps' },
    { id: 'ex_69', name: 'EZ-Bar Curl', muscleGroup: 'Biceps' },
    { id: 'ex_70', name: 'Incline Dumbbell Curl', muscleGroup: 'Biceps' },
    { id: 'ex_71', name: 'Cable Curl', muscleGroup: 'Biceps' },
    { id: 'ex_72', name: 'Reverse Grip Barbell Curl', muscleGroup: 'Biceps' },
    { id: 'ex_73', name: 'Spider Curl', muscleGroup: 'Biceps' },
    { id: 'ex_74', name: 'Zottman Curl', muscleGroup: 'Biceps' },

    // Triceps
    { id: 'ex_20', name: 'Tricep Pushdown (Rope)', muscleGroup: 'Triceps' },
    { id: 'ex_21', name: 'Skull Crusher', muscleGroup: 'Triceps' },
    { id: 'ex_22', name: 'Close-Grip Bench Press', muscleGroup: 'Triceps' },
    { id: 'ex_23', name: 'Overhead Tricep Extension', muscleGroup: 'Triceps' },
    { id: 'ex_24', name: 'Bench Dip', muscleGroup: 'Triceps' },
    { id: 'ex_75', name: 'Tricep Kickback', muscleGroup: 'Triceps' },
    { id: 'ex_76', name: 'Diamond Push-up', muscleGroup: 'Triceps' },
    { id: 'ex_77', name: 'Seated Triceps Press', muscleGroup: 'Triceps' },
    { id: 'ex_78', name: 'Tate Press', muscleGroup: 'Triceps' },
    { id: 'ex_79', name: 'JM Press', muscleGroup: 'Triceps' },

    // Shoulders
    { id: 'ex_25', name: 'Overhead Press (Barbell)', muscleGroup: 'Shoulders' },
    { id: 'ex_26', name: 'Seated Dumbbell Press', muscleGroup: 'Shoulders' },
    { id: 'ex_27', name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders' },
    { id: 'ex_28', name: 'Dumbbell Front Raise', muscleGroup: 'Shoulders' },
    { id: 'ex_29', name: 'Bent Over Dumbbell Raise', muscleGroup: 'Shoulders' },
    { id: 'ex_30', name: 'Barbell Shrug', muscleGroup: 'Shoulders' },
    { id: 'ex_80', name: 'Arnold Press', muscleGroup: 'Shoulders' },
    { id: 'ex_81', name: 'Upright Row', muscleGroup: 'Shoulders' },
    { id: 'ex_82', name: 'Machine Shoulder Press', muscleGroup: 'Shoulders' },
    { id: 'ex_83', name: 'Cable Lateral Raise', muscleGroup: 'Shoulders' },
    { id: 'ex_84', name: 'Landmine Press', muscleGroup: 'Shoulders' },
    { id: 'ex_85', name: 'Reverse Pec-Deck', muscleGroup: 'Shoulders' },
    { id: 'ex_86', name: 'Pike Push-up', muscleGroup: 'Shoulders' },

    // Forearm
    { id: 'ex_31', name: 'Dumbbell Wrist Curl', muscleGroup: 'Forearm' },
    { id: 'ex_32', name: 'Dumbbell Reverse Wrist Curl', muscleGroup: 'Forearm' },
    { id: 'ex_33', name: "Farmer's Walk", muscleGroup: 'Forearm' },
    { id: 'ex_87', name: 'Barbell Wrist Curl', muscleGroup: 'Forearm' },
    { id: 'ex_88', name: 'Barbell Reverse Wrist Curl', muscleGroup: 'Forearm' },
    { id: 'ex_89', name: 'Plate Pinch', muscleGroup: 'Forearm' },
    { id: 'ex_90', name: 'Wrist Roller', muscleGroup: 'Forearm' },

    // Core
    { id: 'ex_34', name: 'Crunch', muscleGroup: 'Core' },
    { id: 'ex_35', name: 'Plank', muscleGroup: 'Core' },
    { id: 'ex_36', name: 'Leg Raise', muscleGroup: 'Core' },
    { id: 'ex_37', name: 'Russian Twist', muscleGroup: 'Core' },
    { id: 'ex_38', name: 'Hanging Knee Raise', muscleGroup: 'Core' },
    { id: 'ex_91', name: 'Cable Crunch', muscleGroup: 'Core' },
    { id: 'ex_92', name: 'Side Plank', muscleGroup: 'Core' },
    { id: 'ex_93', name: 'Hanging Leg Raise', muscleGroup: 'Core' },
    { id: 'ex_94', name: 'Ab Rollout', muscleGroup: 'Core' },
    { id: 'ex_95', name: 'Wood Chop', muscleGroup: 'Core' },
    { id: 'ex_96', name: 'Pallof Press', muscleGroup: 'Core' },
    { id: 'ex_97', name: 'Bicycle Crunch', muscleGroup: 'Core' },
    { id: 'ex_98', name: 'Dead Bug', muscleGroup: 'Core' },

    // Quadriceps
    { id: 'ex_39', name: 'Barbell Back Squat', muscleGroup: 'Quadriceps' },
    { id: 'ex_40', name: 'Leg Press', muscleGroup: 'Quadriceps' },
    { id: 'ex_41', name: 'Lunge', muscleGroup: 'Quadriceps' },
    { id: 'ex_42', name: 'Leg Extension', muscleGroup: 'Quadriceps' },
    { id: 'ex_43', name: 'Goblet Squat', muscleGroup: 'Quadriceps' },
    { id: 'ex_99', name: 'Barbell Front Squat', muscleGroup: 'Quadriceps' },
    { id: 'ex_100', name: 'Hack Squat', muscleGroup: 'Quadriceps' },
    { id: 'ex_101', name: 'Bulgarian Split Squat', muscleGroup: 'Quadriceps' },
    { id: 'ex_102', name: 'Sissy Squat', muscleGroup: 'Quadriceps' },
    { id: 'ex_103', name: 'Step-Up', muscleGroup: 'Quadriceps' },
    { id: 'ex_104', name: 'Walking Lunge', muscleGroup: 'Quadriceps' },

    // Hamstrings
    { id: 'ex_44', name: 'Deadlift', muscleGroup: 'Hamstrings' },
    { id: 'ex_45', name: 'Romanian Deadlift', muscleGroup: 'Hamstrings' },
    { id: 'ex_46', name: 'Lying Leg Curl', muscleGroup: 'Hamstrings' },
    { id: 'ex_47', name: 'Seated Leg Curl', muscleGroup: 'Hamstrings' },
    { id: 'ex_48', name: 'Good Morning', muscleGroup: 'Hamstrings' },
    { id: 'ex_105', name: 'Stiff-Legged Deadlift', muscleGroup: 'Hamstrings' },
    { id: 'ex_106', name: 'Glute-Ham Raise (GHR)', muscleGroup: 'Hamstrings' },
    { id: 'ex_107', name: 'Kettlebell Swing', muscleGroup: 'Hamstrings' },
    { id: 'ex_108', name: 'Nordic Hamstring Curl', muscleGroup: 'Hamstrings' },
    { id: 'ex_109', name: 'Single-Leg Romanian Deadlift', muscleGroup: 'Hamstrings' },

    // Calves
    { id: 'ex_49', name: 'Standing Calf Raise', muscleGroup: 'Calves' },
    { id: 'ex_50', name: 'Seated Calf Raise', muscleGroup: 'Calves' },
    { id: 'ex_110', name: 'Donkey Calf Raise', muscleGroup: 'Calves' },
    { id: 'ex_111', name: 'Leg Press Calf Raise', muscleGroup: 'Calves' },
    { id: 'ex_112', name: 'Smith Machine Calf Raise', muscleGroup: 'Calves' },
    { id: 'ex_113', name: 'Single-Leg Calf Raise', muscleGroup: 'Calves' },
    { id: 'ex_114', name: 'Tibialis Raise', muscleGroup: 'Calves' },
];