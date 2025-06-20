import { useRoutines } from "@/context/RoutinesContext";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Card, FAB, IconButton, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActiveWorkout } from "@/context/ActiveWorkoutContext";
import { useWorkoutLog } from "@/context/WorkoutLogContext";

export default function ViewRoutineScreen() {
  const theme = useTheme();
  const { startWorkout } = useActiveWorkout()
  const { logs } = useWorkoutLog()
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { routines } = useRoutines();

  const routine = routines.find((r) => r.id === id);

  useEffect(() => {
    if (routine) {
      navigation.setOptions({
        // --- CHANGE: The header title is now generic, not redundant ---
        title: "Routine Details",
        headerRight: () => (
          <IconButton
            icon="pencil-outline"
            onPress={() => {
              router.push(`/edit-routine/${routine.id}`);
            }}
          />
        ),
      });
    }
  }, [routine, navigation]);
  const handleStartWorkout = useCallback(() => {
    if (!routine) return;
    const lastWorkoutLog = logs.find(log => log.routineName === routine.name)

    startWorkout(routine, lastWorkoutLog)
    router.push(`/active-workout`)
  }, [routine, logs, startWorkout, router])

  if (!routine) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["left", "right", "bottom"]}
    >
      <FlatList
        data={routine.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <Text variant="headlineMedium" style={styles.routineTitle}>
              {routine.name}
            </Text>
            <Text variant="titleLarge" style={styles.exercisesHeader}>
              Exercises
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{item.name}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text variant="labelLarge">Sets</Text>
                  <Text variant="bodyLarge">{item.sets}</Text>
                </View>
                <View style={styles.stat}>
                  <Text variant="labelLarge">Reps</Text>
                  <Text variant="bodyLarge">{item.reps}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      />

      <FAB
        icon="play"
        label="Start Workout"
        style={styles.fab}
        onPress={handleStartWorkout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 24,
  },
  routineTitle: {
    fontWeight: "bold",
  },
  exercisesHeader: {
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  stat: {
    marginRight: 24,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 32,
  },
});