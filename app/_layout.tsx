import 'react-native-gesture-handler'
import "react-native-reanimated";
import { enableFreeze } from 'react-native-screens';
enableFreeze(true)

import { ActiveWorkoutProvider } from "@/context/ActiveWorkoutContext";
import { ExercisesProvider } from "@/context/ExercisesContext";
import { RoutineBuilderProvider } from "@/context/RoutineBuilderContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform} from 'react-native'
import {
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  return (
    <RoutinesProvider>
      <ExercisesProvider>
        <RoutineBuilderProvider>
          <ActiveWorkoutProvider>
            <PaperProvider theme={theme}>
              <SafeAreaProvider>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <Stack
                  screenOptions={{
                    headerStyle: { backgroundColor: theme.colors.surface },
                    headerTintColor: theme.colors.onSurface,
                    animation: Platform.OS === 'android' ? 'none' : 'default'
                  }}
                >
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="add-routine"
                    options={{
                      animation: Platform.OS === 'android' ? 'none' : 'default',
                      title: "Add New Routine",
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
                      title: "Edit Routine",
                      animation: Platform.OS === 'android' ? 'none' : 'default',
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
                      title: "View Routine",
                      animation: Platform.OS === 'android' ? 'none' : 'default',
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
                      title: "Add Custom Exercise",
                      animation: Platform.OS === 'android' ? 'none' : 'default',
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
                      title: "Select Exercises",
                      presentation: "modal",
                      headerShown: true,
                      ...(Platform.OS === 'ios'
                        ? { animation: 'slide_from_bottom'}
                        : { presentation: 'modal'}
                        
                      ),
                      headerLeft: () => (
                        <IconButton
                          icon="close"
                          onPress={() => router.back()}
                        />
                      ),
                      headerRight: () => (
                        <IconButton
                          icon="check"
                          onPress={() => router.back()}
                        />
                      ),
                    }}
                  />
                  <Stack.Screen
                    name="active-workout"
                    options={{
                      title: "Active Workout",
                      // We keep the custom back button for consistency
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
          </ActiveWorkoutProvider>
        </RoutineBuilderProvider>
      </ExercisesProvider>
    </RoutinesProvider>
  );
}
