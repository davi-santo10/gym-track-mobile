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
import i18n from "@/lib/i18n";

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

  // --- FIX: Access nested translations using an array key ---
  const dayIndex = new Date().getDay();
  const todayKey = DAY_OF_WEEK[dayIndex].toLowerCase();
  const today = String(i18n.t(['days', todayKey]));
  
  const todaysRoutine = routines.find((r) => r.day === DAY_OF_WEEK[dayIndex]);
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
              {String(i18n.t('workoutCompleteTitle'))}
            </Text>
            <View style={styles.statRow}>
              <Text variant="titleMedium">{String(i18n.t('time'))}</Text>
              <Text variant="bodyLarge">
                {modalData ? formatDuration(modalData.duration) : ""}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text variant="titleMedium">{String(i18n.t('totalWeightLifted'))}</Text>
              <Text variant="bodyLarge">
                {modalData?.totalWeight.toLocaleString() ?? "0"} kg
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={hideModal}
              style={styles.modalButton}
            >
              {String(i18n.t('great'))}
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
                {String(i18n.t('gymTracker'))}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: -4 }}
              >
                {String(i18n.t('happyDay', { day: today }))}
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
                  title={String(i18n.t('workoutInProgress'))}
                  titleVariant="titleLarge"
                />
                <Card.Content>
                  <Text variant="titleMedium" style={{ marginBottom: 4 }}>
                    {activeWorkout.routine.name}
                  </Text>
                  <Text variant="bodyMedium">
                    {String(i18n.t('workoutInProgressMessage'))}
                  </Text>
                </Card.Content>
              </View>
            ) : (
              <View>
                <Card.Title title={String(i18n.t('todaysPlan'))} />
                {todaysRoutine ? (
                  <>
                    <Card.Content>
                      <Text variant="titleMedium">{todaysRoutine.name}</Text>
                      <Text variant="bodyMedium">
                        {String(i18n.t('exercisesPlanned', { count: todaysRoutine.exercises.length }))}
                      </Text>
                    </Card.Content>
                  </>
                ) : (
                  <Card.Content>
                    <Text variant="bodyMedium">
                      {String(i18n.t('noWorkoutToday'))}
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
              title={String(i18n.t('lastTime'))}
              subtitle={String(i18n.t('lastTimeFor', { routineName: todaysRoutine.name}))}
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
                      description={String(i18n.t('exerciseCount', { count: ex.progress.length}))}
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
                  {String(i18n.t('logNotFound'))}
                </Text>
              )}
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.card}>
            <Card.Title title={String(i18n.t('recentActivity'))} />
            <Card.Content>
              {mostRecentLogOverall ? (
                <List.Item
                  title={mostRecentLogOverall.routineName}
                  description={String(i18n.t('completedOn', { date: new Date(mostRecentLogOverall.date).toLocaleDateString()}))}
                  left={(props) => <List.Icon {...props} icon="history" />}
                  onPress={() =>
                    router.push({
                      pathname: "/log/[id]",
                      params: { id: mostRecentLogOverall.id },
                    })
                  }
                />
              ) : (
                <Text variant="bodyMedium">{String(i18n.t('noRecentWorkouts'))}</Text>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      {todaysRoutine && !activeWorkout && (
        <FAB
          icon="play"
          label={String(i18n.t('startWorkout'))}
          style={styles.fab}
          onPress={() => router.push({ pathname: '/routine/[id]', params: { id: todaysRoutine.id }})}
        />
      )}

      <AnimatedFAB
        icon="play-circle-outline"
        label={String(i18n.t('resumeWorkout'))}
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