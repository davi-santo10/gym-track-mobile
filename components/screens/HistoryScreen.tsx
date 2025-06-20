import { useWorkoutLog } from "@/context/WorkoutLogContext";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export function HistoryScreen() {
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
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Appbar.Header>
        <Appbar.Content title="Workout History" />
      </Appbar.Header>

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
            <Text variant="bodyMedium">No workout logs yet.</Text>
            <Text variant="bodySmall">Finish a workout to see it here!</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: 16,
  },
});
