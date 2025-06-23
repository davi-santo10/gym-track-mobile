import { HomeScreen } from '@/components/screens/HomeScreen';
import { ExercisesScreen } from '@/components/screens/ExerciseScreen';
import { RoutinesScreen } from '@/components/screens/RoutinesScreen';
import { DashboardScreen } from '@/components/screens/DashboardScreen'; // Import Dashboard
import { SettingsScreen } from '@/components/screens/SettingsScreen';   // Import Settings
import React, { useState } from 'react';
import { View } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import i18n from '@/lib/i18n';

export default function MainNavigation() {
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [routes] = useState([
    { key: 'home', title: i18n.t('home'), focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'routines', title: i18n.t('routines'), focusedIcon: 'clipboard-text', unfocusedIcon: 'clipboard-text-outline' },
    { key: 'exercises', title: i18n.t('exercises'), focusedIcon: 'dumbbell' },
    { key: 'dashboard', title: i18n.t('dashboard'), focusedIcon: 'view-dashboard', unfocusedIcon: 'view-dashboard-outline' },
    { key: 'settings', title: i18n.t('settings'), focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
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
      case 'dashboard':
        return <View style={{ flex: 1 }}><DashboardScreen /></View>;
      case 'settings':
        return <View style={{ flex: 1 }}><SettingsScreen /></View>;
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