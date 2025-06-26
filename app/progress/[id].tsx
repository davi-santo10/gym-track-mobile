import EvolutionGraph from "@/components/EvolutionGraph";
import { useRoutines } from "@/context/RoutinesContext";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoutineProgressScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { routines } = useRoutines();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null
  );

  const routine = routines.find((r) => r.id === id);

  useEffect(() => {
    if (routine) {
      navigation.setOptions({
        title: routine.name,
      });
    }
  }, [routine, navigation]);

  if (!routine) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  const handleExercisePress = (exerciseId: string) => {
    setSelectedExerciseId(
      selectedExerciseId === exerciseId ? null : exerciseId
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {routine.name} - Progress
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Select an exercise to see its evolution
        </Text>

        {routine.exercises.map((exercise) => (
          <Card key={exercise.id} style={styles.card}>
            <TouchableOpacity onPress={() => handleExercisePress(exercise.id)}>
              <Card.Title
                title={exercise.name}
                right={(props) => (
                  <Text style={{ marginRight: 12 }}>
                    {selectedExerciseId === exercise.id ? "▲" : "▼"}
                  </Text>
                )}
              />
            </TouchableOpacity>
            {selectedExerciseId === exercise.id && (
              <Card.Content>
                <EvolutionGraph
                  exerciseId={exercise.id}
                  routineName={routine.name}
                />
              </Card.Content>
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    marginBottom: 12,
  },
});
