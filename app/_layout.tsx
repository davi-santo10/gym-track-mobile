import "react-native-gesture-handler";
import "react-native-reanimated";
import { enableFreeze } from "react-native-screens";
enableFreeze(true);

import { ActiveWorkoutProvider } from "@/context/ActiveWorkoutContext";
import { ExercisesProvider } from "@/context/ExercisesContext";
import { RoutineBuilderProvider } from "@/context/RoutineBuilderContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { WorkoutLogProvider } from "@/context/WorkoutLogContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import {
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import i18n from "@/lib/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from 'expo-localization';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
const I18N_STORAGE_KEY = 'my-gym-tracker-i18n-locale';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const colorScheme = useColorScheme();

  // Load language preference on startup
  useEffect(() => {
    const loadI18n = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem(I18N_STORAGE_KEY);
        const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';
        i18n.locale = savedLocale || deviceLocale;
      } catch (e) {
        console.error("Failed to load language from storage", e);
        // Fallback to device locale if anything goes wrong
        i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
      }
    };
    
    async function prepare() {
      try {
        await loadI18n();
      } catch (e) {
        console.warn(e);
      } finally {
        if(loaded || error) {
          await SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  return (
    <RoutinesProvider>
      <ExercisesProvider>
        <RoutineBuilderProvider>
          <ActiveWorkoutProvider>
            <WorkoutLogProvider>
              <PaperProvider theme={theme}>
                <SafeAreaProvider>
                  <StatusBar
                    style={colorScheme === "dark" ? "light" : "dark"}
                  />
                  <Stack
                    screenOptions={{
                      headerStyle: { backgroundColor: theme.colors.surface },
                      headerTintColor: theme.colors.onSurface,
                      animation:
                        Platform.OS === "android"
                          ? "slide_from_right"
                          : "default",
                      headerTitleAlign: "center",
                    }}
                  >
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false, animation: 'slide_from_left' }}
                    />
                    <Stack.Screen
                      name="add-routine"
                      options={{
                        title: i18n.t('addNewRoutine'),
                        headerLeft: (props) => (
                          <IconButton
                            icon="arrow-left"
                            iconColor={props.tintColor}
                            onPress={() => router.back()}
                            style={{ marginLeft: -8 }}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="edit-routine/[id]"
                      options={{
                        title: i18n.t('editRoutine'),
                        headerLeft: (props) => (
                          <IconButton
                            icon="arrow-left"
                            iconColor={props.tintColor}
                            onPress={() => router.back()}
                            style={{ marginLeft: -8 }}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="routine/[id]"
                      options={{
                        title: i18n.t('viewRoutine'),
                        headerLeft: (props) => (
                          <IconButton
                            icon="arrow-left"
                            iconColor={props.tintColor}
                            onPress={() => router.back()}
                            style={{ marginLeft: -8 }}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="add-exercise"
                      options={{
                        title: i18n.t('addCustomExercise'),
                        headerLeft: (props) => (
                          <IconButton
                            icon="arrow-left"
                            iconColor={props.tintColor}
                            onPress={() => router.back()}
                            style={{ marginLeft: -8 }}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="select-exercises"
                      options={{
                        title: i18n.t('selectExercises'),
                        presentation: "modal",
                        animation:
                          Platform.OS === "android"
                            ? "fade_from_bottom"
                            : "default",
                        headerLeft: () => <IconButton icon="close" />,
                        headerRight: () => (
                          <IconButton
                            icon="plus"
                            onPress={() => router.push("/add-exercise")}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="active-workout"
                      options={{
                        title: i18n.t('activeWorkout'),
                        headerLeft: (props) => (
                          <IconButton
                            icon="arrow-left"
                            iconColor={props.tintColor}
                            onPress={() => router.back()}
                            style={{ marginLeft: -8 }}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="log/[id]"
                      options={{
                        title: i18n.t('workoutDetails'),
                        headerLeft: (props) => (
                          <IconButton
                            icon="arrow-left"
                            iconColor={props.tintColor}
                            onPress={() => router.back()}
                            style={{ marginLeft: -8 }}
                          />
                        ),
                      }}
                    />
                  </Stack>
                </SafeAreaProvider>
              </PaperProvider>
            </WorkoutLogProvider>
          </ActiveWorkoutProvider>
        </RoutineBuilderProvider>
      </ExercisesProvider>
    </RoutinesProvider>
  );
}