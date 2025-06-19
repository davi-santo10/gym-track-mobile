// In app/index.tsx

import React, { useState, useMemo } from 'react';
import { SectionList, StyleSheet, View} from 'react-native'
import { BottomNavigation } from 'react-native-paper';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { useExercises } from '@/context/ExercisesContext';
import { RoutinesScreen } from '@/components/screens/RoutinesScreen';
import { ExercisesScreen } from '@/components/screens/ExerciseScreen';
import { ExerciseData } from '@/data/exercises';

export default function MainNavigation() {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'routines', title: 'Routines', focusedIcon: 'clipboard-text', unfocusedIcon: 'clipboard-text-outline' },
    { key: 'exercises', title: 'Exercises', focusedIcon: 'dumbbell', unfocusedIcon: 'dumbbell' },
  ]);

  // This function tells the navigator which component to show for each key
  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    routines: RoutinesScreen,
    exercises: ExercisesScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={true}
      // --- ADD THIS PROP TO HIDE ALL LABELS ---
      labeled={false}
	  barStyle={{ height:90}}
    />
  );
}