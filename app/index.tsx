import { DashboardScreen } from "@/components/screens/DashboardScreen"; // Import Dashboard
import { ExercisesScreen } from "@/components/screens/ExerciseScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { RoutinesScreen } from "@/components/screens/RoutinesScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen"; // Import Settings
import { AuthNavigator } from "@/components/screens/auth/AuthNavigator";
import { useAuth } from "@/context/AuthContext";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  BottomNavigation,
  Text,
  useTheme,
} from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FirebaseTest from "../components/FirebaseTest";

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
  const {
    user,
    loading,
    isGuest,
    signInAsGuest,
    firebaseReady,
    firebaseStatus,
    retryFirebaseInit,
  } = useAuth();
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
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
            Gym Track Mobile - Firebase Debug
          </Text>

          {/* Firebase Status Display */}
          <View
            style={{
              marginBottom: 20,
              padding: 15,
              backgroundColor: firebaseReady ? "#e8f5e8" : "#fee8e8",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: firebaseReady ? "#4caf50" : "#f44336",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
              Firebase Status:
            </Text>
            <Text
              style={{
                color: firebaseReady ? "#2e7d32" : "#c62828",
                fontSize: 14,
                marginBottom: 5,
              }}
            >
              {loading
                ? "Loading..."
                : firebaseReady
                ? "✅ Connected"
                : "❌ Failed"}
            </Text>
            <Text style={{ fontSize: 12, color: "#666" }}>
              {firebaseStatus}
            </Text>

            {!firebaseReady && !loading && (
              <TouchableOpacity
                onPress={retryFirebaseInit}
                style={{
                  marginTop: 10,
                  backgroundColor: "#2196f3",
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Retry Firebase Connection
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Firebase Test Component */}
          <FirebaseTest />

          <View
            style={{
              marginTop: 20,
              padding: 15,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            <Text
              style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}
            >
              Troubleshooting Instructions:
            </Text>
            <Text style={{ fontSize: 12, color: "#666", lineHeight: 18 }}>
              1. Check console logs for detailed Firebase errors{"\n"}
              2. Ensure you're running on a physical device or emulator{"\n"}
              3. Verify google-services.json is correctly configured{"\n"}
              4. Try rebuilding the app with 'npx expo run:android'{"\n"}
              5. If still failing, check Firebase project settings
            </Text>
          </View>

          <Text style={{ marginTop: 20, color: "#666", textAlign: "center" }}>
            Check the Metro bundler logs for detailed Firebase initialization
            info
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Show authentication screens if user is not authenticated
  return <AuthNavigator onGuestMode={handleGuestMode} />;
}
