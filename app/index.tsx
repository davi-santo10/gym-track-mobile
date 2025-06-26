import { DashboardScreen } from "@/components/screens/DashboardScreen"; // Import Dashboard
import { ExercisesScreen } from "@/components/screens/ExerciseScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { RoutinesScreen } from "@/components/screens/RoutinesScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen"; // Import Settings
import { AuthNavigator } from "@/components/screens/auth/AuthNavigator";
import { useAuth } from "@/context/AuthContext";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  BottomNavigation,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function MainNavigation() {
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [routes] = useState([
    {
      key: "home",
      title: i18n.t("home"),
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "routines",
      title: i18n.t("routines"),
      focusedIcon: "clipboard-text",
      unfocusedIcon: "clipboard-text-outline",
    },
    { key: "exercises", title: i18n.t("exercises"), focusedIcon: "dumbbell" },
    {
      key: "dashboard",
      title: i18n.t("history"),
      focusedIcon: "history",
      unfocusedIcon: "history",
    },
    {
      key: "more",
      title: i18n.t("more"),
      focusedIcon: "dots-horizontal",
      unfocusedIcon: "dots-horizontal",
    },
  ]);

  type AppRoute = (typeof routes)[number];

  const renderScene = ({ route }: { route: AppRoute }) => {
    switch (route.key) {
      case "home":
        return (
          <View style={{ flex: 1 }}>
            <HomeScreen />
          </View>
        );
      case "routines":
        return (
          <View style={{ flex: 1 }}>
            <RoutinesScreen />
          </View>
        );
      case "exercises":
        return (
          <View style={{ flex: 1 }}>
            <ExercisesScreen />
          </View>
        );
      case "dashboard":
        return (
          <View style={{ flex: 1 }}>
            <DashboardScreen />
          </View>
        );
      case "more":
        return (
          <View style={{ flex: 1 }}>
            <SettingsScreen />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.elevation.level2,
      }}
    >
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

export default function App() {
  const { user, loading, isGuest, signInAsGuest } = useAuth();
  const theme = useTheme();

  const handleGuestMode = async () => {
    try {
      await signInAsGuest();
    } catch (error) {
      console.error("Error enabling guest mode:", error);
    }
  };

  // Show loading screen while initializing
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={{ marginTop: 16 }}>
          {String(i18n.t("loading"))}
        </Text>
      </View>
    );
  }

  // Show main app if user is authenticated or in guest mode
  if (user || isGuest) {
    return <MainNavigation />;
  }

  // Show authentication screens if user is not authenticated
  return <AuthNavigator onGuestMode={handleGuestMode} />;
}
