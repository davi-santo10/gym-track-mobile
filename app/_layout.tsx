import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { enableFreeze } from "react-native-screens";
// Disable screen freezing to prevent touch issues on real devices
enableFreeze(false);

import { ActiveWorkoutProvider } from "@/context/ActiveWorkoutContext";

import { ExercisesProvider } from "@/context/ExercisesContext";
import { RoutineBuilderProvider } from "@/context/RoutineBuilderContext";
import { RoutinesProvider } from "@/context/RoutinesContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { WorkoutLogProvider } from "@/context/WorkoutLogContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import i18n from "@/lib/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as Localization from "expo-localization";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform, Text, View } from "react-native";
import {
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();
const I18N_STORAGE_KEY = "my-gym-tracker-i18n-locale";

// Simple Error Boundary for production
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ color: "gray", textAlign: "center" }}>
            Please restart the app. If the problem persists, contact support.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

function StackNavigator() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  const insets = useSafeAreaInsets();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        animation: Platform.OS === "android" ? "slide_from_right" : "default",
        headerTitleAlign: "center",
        gestureEnabled: true,
        headerTransparent: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "slide_from_left",
        }}
      />
      <Stack.Screen
        name="add-routine"
        options={{
          title: i18n.t("addNewRoutine"),
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
          title: i18n.t("editRoutine"),
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
          title: i18n.t("viewRoutine"),
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
          title: i18n.t("addCustomExercise"),
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
          title: i18n.t("selectExercises"),
          // Add specific options for this problematic screen
          gestureEnabled: true,
          animationTypeForReplace: "pop",
          headerLeft: (props) => (
            <IconButton
              icon="arrow-left"
              iconColor={props.tintColor}
              onPress={() => router.back()}
              style={{ marginLeft: -8 }}
            />
          ),
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
          title: i18n.t("activeWorkout"),
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
          title: i18n.t("workoutDetails"),
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
        name="progress/[id]"
        options={{
          title: "Routine Progress",
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
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const colorScheme = useColorScheme();

  useEffect(() => {
    const loadI18n = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem(I18N_STORAGE_KEY);
        const deviceLocale = Localization.getLocales()[0]?.languageCode ?? "en";
        i18n.locale = savedLocale || deviceLocale;
      } catch (e) {
        console.error("Failed to load language from storage", e);
        // Fallback to English if there's any issue
        i18n.locale = "en";
      }
    };

    async function prepare() {
      try {
        await loadI18n();
      } catch (e) {
        console.warn("Error in prepare function:", e);
        // Set fallback locale
        i18n.locale = "en";
      } finally {
        if (loaded || error) {
          // Add a small delay to ensure everything is ready on real devices
          await new Promise((resolve) => setTimeout(resolve, 100));
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
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SettingsProvider>
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
                        <StackNavigator />
                      </SafeAreaProvider>
                    </PaperProvider>
                  </WorkoutLogProvider>
                </ActiveWorkoutProvider>
              </RoutineBuilderProvider>
            </ExercisesProvider>
          </RoutinesProvider>
        </SettingsProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
