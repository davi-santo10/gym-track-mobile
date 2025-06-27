import { DashboardScreen } from "@/components/screens/DashboardScreen";
import { ExercisesScreen } from "@/components/screens/ExerciseScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { RoutinesScreen } from "@/components/screens/RoutinesScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { useState } from "react";
import { View } from "react-native";
import { BottomNavigation, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "routines",
      title: "Routines",
      focusedIcon: "dumbbell",
      unfocusedIcon: "dumbbell",
    },
    {
      key: "exercises",
      title: "Exercises",
      focusedIcon: "arm-flex",
      unfocusedIcon: "arm-flex-outline",
    },
    {
      key: "dashboard",
      title: "Dashboard",
      focusedIcon: "chart-line",
      unfocusedIcon: "chart-line-variant",
    },
    {
      key: "more",
      title: "More",
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
