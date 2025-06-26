import { useWorkoutLog } from "@/context/WorkoutLogContext";
import i18n from "@/lib/i18n";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}`;
};

export default function LogDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    logs,
    deleteWorkoutLog,
    getDisplayWeightFromLog,
    getCurrentWeightUnit,
  } = useWorkoutLog();

  const log = logs.find((l) => l.id === id);

  const handleDelete = () => {
    if (!log) return;
    Alert.alert(
      i18n.t("deleteWorkoutLogTitle"),
      i18n.t("deleteWorkoutLogMessage"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("delete"),
          onPress: () => {
            deleteWorkoutLog(log.id);
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    if (log) {
      navigation.setOptions({
        title: i18n.t("workoutDetails"),
        headerRight: () => (
          <IconButton icon="delete-outline" onPress={handleDelete} />
        ),
      });
    }
  });
  if (!log) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="headlineMedium">{log.routineName}</Text>
          <Text variant="bodyLarge">{new Date(log.date).toDateString()}</Text>
          <Text variant="bodyMedium">
            {i18n.t("duration", { duration: formatDuration(log.duration) })}
          </Text>
        </View>

        {log.exercises.map((exerciseLog, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title
              title={exerciseLog.details.name}
              subtitle={exerciseLog.details.muscleGroup}
            />
            <Card.Content>
              {exerciseLog.progress.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <Text style={styles.setText}>
                    {i18n.t("set")} {setIndex + 1}
                  </Text>
                  <Text>
                    {set.reps} {i18n.t("reps")}
                  </Text>
                  <Text>
                    {getDisplayWeightFromLog(set.weight || 0).toFixed(1)}{" "}
                    {getCurrentWeightUnit()}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 24, gap: 4 },
  card: { marginBottom: 16 },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  setText: { fontWeight: "bold" },
});
