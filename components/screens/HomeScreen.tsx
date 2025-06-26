import { useActiveWorkout } from "@/context/ActiveWorkoutContext";
import { useRoutines } from "@/context/RoutinesContext";
import { useSettings } from "@/context/SettingsContext";
import { useWorkoutLog, WorkoutSummary } from "@/context/WorkoutLogContext";
import i18n, { t } from "@/lib/i18n";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
  const {
    logs,
    consumeLastWorkoutSummary,
    getDisplayWeightFromLog,
    getCurrentWeightUnit,
  } = useWorkoutLog();
  const theme = useTheme();
  const { activeWorkout } = useActiveWorkout();
  const { formatWeight } = useSettings();

  const [modalData, setModalData] = useState<WorkoutSummary | null>(null);
  const [isFabVisible, setIsFabVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const summary = consumeLastWorkoutSummary();
      if (summary) {
        setModalData(summary);
      }
    }, [consumeLastWorkoutSummary])
  );

  const dayIndex = new Date().getDay();
  const todayKey = DAY_OF_WEEK[dayIndex].toLowerCase();
  const today = String(i18n.t(`days.${todayKey}`));
  const dayOfMonth = new Date().getDate();

  const todaysRoutine = routines.find((r) => r.day === DAY_OF_WEEK[dayIndex]);
  const lastLogForTodaysRoutine = todaysRoutine
    ? logs.find((log) => log.routineName === todaysRoutine.name)
    : undefined;
  const mostRecentLogOverall = logs[0];

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
            <View style={styles.celebrationHeader}>
              <Text
                variant="headlineMedium"
                style={[
                  styles.celebrationTitle,
                  { color: theme.colors.primary },
                ]}
              >
                🎉 {String(i18n.t("workoutCompleteTitle"))}
              </Text>
              <Text
                variant="bodyLarge"
                style={[
                  styles.celebrationSubtitle,
                  { color: theme.colors.onSurface },
                ]}
              >
                {String(i18n.t("great"))} You've completed your workout!
              </Text>
            </View>

            <View style={styles.summaryContainer}>
              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <View style={styles.statRow}>
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onPrimaryContainer }}
                  >
                    ⏱️ {String(i18n.t("time"))}
                  </Text>
                  <Text
                    variant="titleLarge"
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.onPrimaryContainer },
                    ]}
                  >
                    {modalData ? formatDuration(modalData.duration) : "0:00"}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.colors.secondaryContainer },
                ]}
              >
                <View style={styles.statRow}>
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSecondaryContainer }}
                  >
                    🏋️ {String(i18n.t("totalWeightLifted"))}
                  </Text>
                  <Text
                    variant="titleLarge"
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.onSecondaryContainer },
                    ]}
                  >
                    {modalData
                      ? formatWeight(
                          getDisplayWeightFromLog(modalData.totalWeight)
                        )
                      : `0 ${getCurrentWeightUnit()}`}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: theme.colors.tertiaryContainer },
                ]}
              >
                <View style={styles.statRow}>
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onTertiaryContainer }}
                  >
                    💪 Total Sets
                  </Text>
                  <Text
                    variant="titleLarge"
                    style={[
                      styles.summaryValue,
                      { color: theme.colors.onTertiaryContainer },
                    ]}
                  >
                    {modalData?.totalSets ?? 0}
                  </Text>
                </View>
              </View>
            </View>

            <Button
              mode="contained"
              onPress={hideModal}
              style={styles.modalButton}
            >
              {String(i18n.t("great"))}
            </Button>
          </View>
        </Modal>
      </Portal>

      <Appbar.Header>
        <Appbar.Content
          title={
            <View>
              <Text
                variant="headlineSmall"
                style={{ color: theme.colors.onSurface, fontWeight: "600" }}
              >
                {String(i18n.t("gymTracker"))}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: -2 }}
              >
                {String(i18n.t("happyDay", { day: today }))}
              </Text>
            </View>
          }
        />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.card, styles.mainCard]} elevation={2}>
          {activeWorkout ? (
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.primaryContainer },
                  ]}
                >
                  <Text style={{ fontSize: 24, color: theme.colors.primary }}>
                    🏋️
                  </Text>
                </View>
                <View style={styles.headerTextContainer}>
                  <Text
                    variant="titleLarge"
                    style={[styles.cardTitle, { color: theme.colors.primary }]}
                  >
                    {String(i18n.t("workoutInProgress"))}
                  </Text>
                  <Text
                    variant="titleMedium"
                    style={[
                      styles.routineName,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {activeWorkout.routine.name}
                  </Text>
                </View>
              </View>
              <Text
                variant="bodyMedium"
                style={[
                  styles.cardDescription,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {String(i18n.t("workoutInProgressMessage"))}
              </Text>
            </Card.Content>
          ) : (
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>📅</Text>
                </View>
                <View style={styles.headerTextContainer}>
                  <Text variant="titleLarge" style={styles.cardTitle}>
                    {String(i18n.t("todaysPlan"))}
                  </Text>
                  {todaysRoutine && (
                    <Text
                      variant="titleMedium"
                      style={[
                        styles.routineName,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {todaysRoutine.name}
                    </Text>
                  )}
                </View>
              </View>

              {todaysRoutine ? (
                <View style={styles.exerciseListContainer}>
                  {todaysRoutine.exercises.slice(0, 3).map((ex) => (
                    <Text
                      key={ex.id}
                      variant="bodyMedium"
                      style={[
                        styles.exerciseListItem,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                      numberOfLines={1}
                    >
                      • {ex.name}
                    </Text>
                  ))}
                  {todaysRoutine.exercises.length > 3 && (
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.moreExercisesText,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      +{todaysRoutine.exercises.length - 3} more exercises
                    </Text>
                  )}
                </View>
              ) : (
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.cardDescription,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {String(i18n.t("noWorkoutToday"))}
                </Text>
              )}
            </Card.Content>
          )}
        </Card>

        {todaysRoutine && (
          <Card
            style={[styles.card, styles.secondaryCard]}
            elevation={1}
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
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>📊</Text>
                </View>
                <View style={styles.headerTextContainer}>
                  <Text variant="titleLarge" style={styles.cardTitle}>
                    {String(i18n.t("lastTime"))}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {String(
                      i18n.t("lastTimeFor", { routineName: todaysRoutine.name })
                    )}
                  </Text>
                </View>
              </View>

              {lastLogForTodaysRoutine ? (
                <View style={styles.lastWorkoutContainer}>
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.dateText,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {new Date(
                      lastLogForTodaysRoutine.date
                    ).toLocaleDateString()}
                  </Text>
                  <View style={styles.exerciseList}>
                    {lastLogForTodaysRoutine.exercises.slice(0, 3).map((ex) => (
                      <View key={ex.details.id} style={styles.exerciseItem}>
                        <View style={styles.exerciseItemRow}>
                          <List.Icon icon="weight-lifter" />
                          <View style={styles.exerciseContent}>
                            <Text
                              variant="bodyMedium"
                              style={{ color: theme.colors.onSurface }}
                            >
                              {ex.details.name}
                            </Text>
                            <Text
                              variant="bodySmall"
                              style={{
                                color: theme.colors.onSurfaceVariant,
                                marginTop: 2,
                              }}
                            >
                              {String(
                                t("exerciseCount", {
                                  count: ex.progress.length,
                                })
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                    {lastLogForTodaysRoutine.exercises.length > 3 && (
                      <Text
                        variant="bodySmall"
                        style={[
                          styles.moreText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        +{lastLogForTodaysRoutine.exercises.length - 3} more
                        exercises
                      </Text>
                    )}
                  </View>
                </View>
              ) : (
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.cardDescription,
                    {
                      color: theme.colors.onSurfaceVariant,
                      fontStyle: "italic",
                    },
                  ]}
                >
                  {String(i18n.t("logNotFound"))}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}

        {!todaysRoutine && mostRecentLogOverall && (
          <Card
            style={[styles.card, styles.ultimaVezMainCard]}
            elevation={2}
            onPress={() => {
              router.push({
                pathname: "/log/[id]",
                params: { id: mostRecentLogOverall.id },
              });
            }}
          >
            <Card.Content style={styles.ultimaVezCardContent}>
              {/* Última Vez Header */}
              <View style={styles.ultimaVezHeader}>
                <View
                  style={[
                    styles.ultimaVezIconContainer,
                    { backgroundColor: theme.colors.primaryContainer },
                  ]}
                >
                  <Text style={{ fontSize: 20, color: theme.colors.primary }}>
                    📊
                  </Text>
                </View>
                <Text
                  variant="titleLarge"
                  style={[
                    styles.ultimaVezTitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {String(i18n.t("lastTime"))}
                </Text>
              </View>

              {/* Performance subtitle */}
              <Text
                variant="bodyMedium"
                style={[
                  styles.performanceSubtitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {String(i18n.t("performanceIn"))}{" "}
                {mostRecentLogOverall.routineName}
              </Text>

              {/* Date */}
              <Text
                variant="bodySmall"
                style={[
                  styles.workoutDate,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {new Date(mostRecentLogOverall.date).toLocaleDateString()}
              </Text>

              {/* Exercise List */}
              <View style={styles.ultimaVezExerciseList}>
                {mostRecentLogOverall.exercises.slice(0, 3).map((ex, index) => (
                  <View
                    key={ex.details.id}
                    style={styles.ultimaVezExerciseItem}
                  >
                    <View
                      style={[
                        styles.exerciseIcon,
                        {
                          backgroundColor: theme.colors.surfaceVariant,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: theme.colors.onSurfaceVariant,
                        }}
                      >
                        🏋️‍♂️
                      </Text>
                    </View>
                    <View style={styles.ultimaVezExerciseInfo}>
                      <Text
                        variant="bodyMedium"
                        style={[
                          styles.ultimaVezExerciseName,
                          { color: theme.colors.onSurface },
                        ]}
                        numberOfLines={1}
                      >
                        {ex.details.name}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={[
                          styles.ultimaVezExerciseCount,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {String(
                          t("exerciseCount", {
                            count: ex.progress.length,
                          })
                        )}
                      </Text>
                    </View>
                  </View>
                ))}

                {mostRecentLogOverall.exercises.length > 3 && (
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.ultimaVezMoreExercises,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    +{mostRecentLogOverall.exercises.length - 3} more exercises
                  </Text>
                )}
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {todaysRoutine && !activeWorkout && (
        <FAB
          icon="play"
          label={String(i18n.t("startWorkout"))}
          style={styles.fab}
          onPress={() =>
            router.push({
              pathname: "/routine/[id]",
              params: { id: todaysRoutine.id },
            })
          }
        />
      )}

      <AnimatedFAB
        icon="play-circle-outline"
        label={String(i18n.t("resumeWorkout"))}
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  mainCard: {
    marginTop: 8,
    marginBottom: 4,
  },
  secondaryCard: {
    marginTop: 4,
    marginBottom: 8,
  },
  cardContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  routineName: {
    fontWeight: "500",
  },
  cardDescription: {
    lineHeight: 22,
  },
  exerciseListContainer: {
    marginTop: 4,
  },
  exerciseListItem: {
    lineHeight: 22,
    marginBottom: 6,
    paddingLeft: 4,
  },
  moreExercisesText: {
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
    paddingVertical: 4,
  },
  lastWorkoutContainer: {
    marginTop: 4,
  },
  dateText: {
    marginBottom: 12,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  exerciseList: {
    gap: 8,
  },
  exerciseItem: {
    paddingVertical: 6,
  },
  exerciseItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  exerciseContent: {
    flex: 1,
    marginLeft: 12,
  },
  recentActivityContainer: {
    marginTop: 4,
  },
  recentActivityItem: {
    paddingVertical: 8,
  },
  recentActivityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  moreText: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 8,
    paddingVertical: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 24,
  },
  modalContent: {
    padding: 24,
    alignItems: "center",
  },
  celebrationHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  celebrationTitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  celebrationSubtitle: {
    fontWeight: "500",
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    marginBottom: 8,
  },
  summaryValue: {
    fontWeight: "600",
  },
  modalButton: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  // Última Vez card styles to match the image design exactly
  ultimaVezMainCard: {
    marginTop: 4,
    marginBottom: 8,
  },
  ultimaVezCardContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  ultimaVezCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    elevation: 2,
  },
  ultimaVezHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ultimaVezIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ultimaVezTitle: {
    fontWeight: "600",
    fontSize: 18,
  },
  performanceSubtitle: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  workoutDate: {
    marginBottom: 20,
    fontSize: 12,
    opacity: 0.7,
  },
  ultimaVezExerciseList: {
    gap: 16,
  },
  ultimaVezExerciseItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  ultimaVezExerciseInfo: {
    flex: 1,
  },
  ultimaVezExerciseName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  ultimaVezExerciseCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  ultimaVezMoreExercises: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 8,
    fontSize: 14,
    opacity: 0.8,
  },
});
