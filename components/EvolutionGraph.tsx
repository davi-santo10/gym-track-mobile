import { LogSetProgress, useWorkoutLog } from "@/context/WorkoutLogContext";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Text, useTheme } from "react-native-paper";

interface EvolutionGraphProps {
  exerciseId: string;
  routineName: string;
  exerciseType?: "strength" | "cardio";
}

export default function EvolutionGraph({
  exerciseId,
  routineName,
  exerciseType = "strength",
}: EvolutionGraphProps) {
  const { logs, getDisplayWeightFromLog, getCurrentWeightUnit } =
    useWorkoutLog();
  const theme = useTheme();
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 12 * 7);

  // Filter logs for the specific routine and time frame
  const routineLogs = logs.filter(
    (log) =>
      log.routineName === routineName && new Date(log.date) >= twelveWeeksAgo
  );

  // Extract data points for the specific exercise
  const dataPoints = routineLogs
    .map((log) => {
      const exerciseLog = log.exercises.find(
        (ex) => ex.details.id === exerciseId
      );
      if (!exerciseLog) return null;

      if (exerciseType === "cardio") {
        // For cardio exercises, track duration
        const cardioData = exerciseLog.progress.find((set) => set.duration > 0);
        if (!cardioData) return null;

        return {
          date: new Date(log.date),
          value: cardioData.duration,
        };
      } else {
        // For strength exercises, find the best set (max weight)
        const bestSet = exerciseLog.progress.reduce(
          (max, current) => {
            const currentWeight = current.weight || 0;
            const maxWeight = max.weight || 0;
            return currentWeight > maxWeight ? current : max;
          },
          {
            weight: 0,
            reps: 0,
            duration: 0,
            completed: false,
          } as LogSetProgress
        );

        if (bestSet.weight <= 0) return null;

        return {
          date: new Date(log.date),
          value: parseFloat(getDisplayWeightFromLog(bestSet.weight).toFixed(1)),
        };
      }
    })
    .filter(
      (point): point is { date: Date; value: number } =>
        point !== null && point.value > 0
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (dataPoints.length < 2) {
    return (
      <View style={styles.centered}>
        <Text>
          Not enough data to display a chart. Complete at least two workouts for
          this exercise.
        </Text>
      </View>
    );
  }

  const chartData = {
    labels: dataPoints.map((point) =>
      point.date.toLocaleDateString([], { month: "short", day: "numeric" })
    ),
    datasets: [{ data: dataPoints.map((point) => point.value) }],
  };

  const yAxisSuffix =
    exerciseType === "cardio" ? " min" : ` ${getCurrentWeightUnit()}`;

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: (opacity = 1) => theme.colors.onSurface,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: theme.colors.primary,
    },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 32}
        height={250}
        yAxisSuffix={yAxisSuffix}
        yAxisInterval={1}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
  },
});
