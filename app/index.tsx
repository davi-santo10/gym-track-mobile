import { HomeScreen } from '@/components/screens/HomeScreen';
import { ExercisesScreen } from '@/components/screens/ExerciseScreen';
import { RoutinesScreen } from '@/components/screens/RoutinesScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';
import React, { useState } from 'react';
import { View } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MainNavigation() {
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'routines', title: 'Routines', focusedIcon: 'clipboard-text', unfocusedIcon: 'clipboard-text-outline' },
    { key: 'exercises', title: 'Exercises', focusedIcon: 'dumbbell' },
    { key: 'history', title: 'History', focusedIcon: 'history' },
  ]);
  
  type AppRoute = typeof routes[number];

  const renderScene = ({ route }: { route: AppRoute }) => {
    switch (route.key) {
      case 'home':
        return <View style={{ flex: 1 }}><HomeScreen /></View>;
      case 'routines':
        return <View style={{ flex: 1 }}><RoutinesScreen /></View>;
      case 'exercises':
        return <View style={{ flex: 1 }}><ExercisesScreen /></View>;
      case 'history':
        return <View style={{ flex: 1 }}><HistoryScreen /></View>;
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.elevation.level2,
      }}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={true}
        labeled={false}
        barStyle={{ height: 90 }}
        safeAreaInsets={{
          bottom: insets.bottom,
        }}
      />
    </View>
  );
}