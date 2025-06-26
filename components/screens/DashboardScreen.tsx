import { useRoutines } from "@/context/RoutinesContext";
import { useWorkoutLog } from "@/context/WorkoutLogContext";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, List, SegmentedButtons, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const LogbookView = () => {
  const { logs } = useWorkoutLog();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "numeric",
    });
  };

  return (
    <FlatList
      data={logs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <List.Item
          title={item.routineName}
          description={formatDate(item.date)}
          left={(props) => <List.Icon {...props} icon="calendar-check" />}
          onPress={() =>
            router.push({
              pathname: "/log/[id]",
              params: { id: item.id },
            })
          }
        />
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text variant="bodyMedium">{i18n.t("noWorkoutLogs")}</Text>
          <Text variant="bodySmall">{i18n.t("finishAWorkout")}</Text>
        </View>
      )}
    />
  );
};

// This is a placeholder for your future progress charts
const ProgressView = () => {
  const { routines } = useRoutines();

  if (routines.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">{i18n.t("progress")}</Text>
        <Text variant="bodyMedium">{i18n.t("noRoutinesToTrack")}</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={routines}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          left={(props) => <List.Icon {...props} icon="chart-line" />}
          onPress={() =>
            router.push({
              pathname: "/progress/[id]",
              params: { id: item.id },
            })
          }
        />
      )}
    />
  );
};

export function DashboardScreen() {
  const [view, setView] = React.useState("logbook");

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Appbar.Header>
        <Appbar.Content title={i18n.t("history")} />
      </Appbar.Header>

      <View style={styles.segmentedButtonContainer}>
        <SegmentedButtons
          value={view}
          onValueChange={setView}
          buttons={[
            { value: "logbook", label: i18n.t("logbook") },
            { value: "progress", label: i18n.t("progress") },
          ]}
        />
      </View>

      {view === "logbook" ? <LogbookView /> : <ProgressView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: 16,
    gap: 8,
  },
  segmentedButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
