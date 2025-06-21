import { useActiveWorkout } from "@/context/ActiveWorkoutContext";
import { useRoutines } from "@/context/RoutinesContext";
import { useWorkoutLog, WorkoutSummary } from "@/context/WorkoutLogContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AnimatedFAB,
  Appbar,
  Button,
  Card,
  FAB,
  List,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const DAY_OF_WEEK: (
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
)[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

export function HomeScreen() {
  const { routines } = useRoutines();
  const { logs, lastWorkoutSummary, setLastWorkoutSummary } = useWorkoutLog();
  const theme = useTheme();
  const { activeWorkout } = useActiveWorkout();

  const [modalData, setModalData] = useState<WorkoutSummary | null>(null);
  const [isFabVisible, setIsFabVisible] = useState(false);

  const today = DAY_OF_WEEK[new Date().getDay()];
  const todaysRoutine = routines.find((r) => r.day === today);
  const lastLogForTodaysRoutine = todaysRoutine
    ? logs.find((log) => log.routineName === todaysRoutine.name)
    : undefined;
  const mostRecentLogOverall = logs[0];

  useEffect(() => {
    if (lastWorkoutSummary) {
      setModalData(lastWorkoutSummary);
      setLastWorkoutSummary(null);
    }
  }, [lastWorkoutSummary, setLastWorkoutSummary]);

  useEffect(() => {
    setIsFabVisible(!!activeWorkout);
  }, [activeWorkout]);

  const hideModal = () => {
    setModalData(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Portal>
        <Modal
          visible={!!modalData}
          onDismiss={hideModal}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Workout Complete!
            </Text>
            <View style={styles.statRow}>
              <Text variant="titleMedium">Time:</Text>
              <Text variant="bodyLarge">
                {modalData ? formatDuration(modalData.duration) : ""}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="titleMedium">Total Weight Lifted:</Text>
              <Text variant="bodyLarge">
                {modalData?.totalWeight.toLocaleString() ?? "0"} kg
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={hideModal}
              style={styles.modalButton}
            >
              Great!
            </Button>
          </View>
        </Modal>
      </Portal>

      <Appbar.Header>
        <Appbar.Content
          title={
            <View>
              <Text
                variant="titleLarge"
                style={{ color: theme.colors.onSurface }}
              >
                Gym Tracker
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: -4 }}
              >
                {`Happy ${today}!`}
              </Text>
            </View>
          }
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Card style={styles.card}>
          <View style={styles.planCardContainer}>
            {activeWorkout ? (
              <View>
                <Card.Title
                  title="Workout in Progress"
                  titleVariant="titleLarge"
                />
                <Card.Content>
                  <Text variant="titleMedium" style={{ marginBottom: 4 }}>
                    {activeWorkout.routine.name}
                  </Text>
                  <Text variant="bodyMedium">
                    A workout is currently active. Keep up the great work!
                  </Text>
                </Card.Content>
              </View>
            ) : (
              // This is the "Today's Plan" view.
              <View>
                <Card.Title title="Today's Plan" />
                {todaysRoutine ? (
                  <>
                    <Card.Content>
                      <Text variant="titleMedium">{todaysRoutine.name}</Text>
                      <Text variant="bodyMedium">
                        {todaysRoutine.exercises.length} exercises planned
                      </Text>
                    </Card.Content>
                    {/* --- CHANGE 2: The Card.Actions and Button were removed from here --- */}
                  </>
                ) : (
                  <Card.Content>
                    <Text variant="bodyMedium">
                      You have no workouts scheduled for today. Resting is also
                      essential!
                    </Text>
                  </Card.Content>
                )}
              </View>
            )}
          </View>
        </Card>

        {todaysRoutine ? (
          <Card
            style={styles.card}
            onPress={
              lastLogForTodaysRoutine
                ? () => {
                    router.push({
                      pathname: "/log/[id]",
                      params: { id: lastLogForTodaysRoutine.id },
                    });
                  }
                : undefined
            }
          >
            <Card.Title
              title="Last Time"
              subtitle={`Performance for ${todaysRoutine.name}`}
            />
            <Card.Content>
              {lastLogForTodaysRoutine ? (
                <View>
                  <Text variant="bodySmall">
                    {new Date(
                      lastLogForTodaysRoutine.date
                    ).toLocaleDateString()}
                  </Text>
                  {lastLogForTodaysRoutine.exercises.slice(0, 3).map((ex) => (
                    <List.Item
                      key={ex.details.id}
                      title={ex.details.name}
                      description={`${ex.progress.length} sets`}
                      left={(props) => (
                        <List.Icon {...props} icon="weight-lifter" />
                      )}
                    />
                  ))}
                  {lastLogForTodaysRoutine.exercises.length > 3 && (
                    <Text style={{ textAlign: "center", marginVertical: 8 }}>
                      ...
                    </Text>
                  )}
                </View>
              ) : (
                <Text variant="bodyMedium">
                  You haven't logged this workout before. Let's get it!
                </Text>
              )}
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.card}>
            <Card.Title title="Recent Activity" />
            <Card.Content>
              {mostRecentLogOverall ? (
                <List.Item
                  title={mostRecentLogOverall.routineName}
                  description={`Completed on ${new Date(
                    mostRecentLogOverall.date
                  ).toLocaleDateString()}`}
                  left={(props) => <List.Icon {...props} icon="history" />}
                  onPress={() =>
                    router.push({
                      pathname: "/log/[id]",
                      params: { id: mostRecentLogOverall.id },
                    })
                  }
                />
              ) : (
                <Text variant="bodyMedium">No recent workouts logged.</Text>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      {todaysRoutine && (
        <FAB
          icon="play"
          label="Start Workout"
          style={styles.fab}
          onPress={() => router.push({ pathname: '/routine/[id]', params: { id: todaysRoutine.id }})}
        />
      )}

      <AnimatedFAB
        icon="play-circle-outline"
        label="Resume Workout"
        extended
        onPress={() => router.push("/active-workout")}
        visible={isFabVisible}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { marginHorizontal: 16, marginTop: 16 },
  planCardContainer: {
    minHeight: 130,
    justifyContent: "center",
  },
  modalContainer: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
  },
  modalContent: {
    alignItems: "center",
    gap: 16,
  },
  modalTitle: {
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  modalButton: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 16,
  },
  inProgressCardContent: {
    paddingBottom: 16,
  },
});
