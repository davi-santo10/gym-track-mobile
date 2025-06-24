import { useRoutines } from "@/context/RoutinesContext";
import i18n, { t } from "@/lib/i18n";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Appbar, FAB, IconButton, List } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export function RoutinesScreen() {
  const { routines, deleteRoutine } = useRoutines();

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Appbar.Header>
        <Appbar.Content title={String(i18n.t("myRoutines"))} />
      </Appbar.Header>

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={
              item.day
                ? String(
                    t("exerciseCountWithDay", {
                      count: item.exercises.length,
                      day: String(i18n.t(`days.${item.day.toLowerCase()}`)),
                    })
                  )
                : String(t("exerciseCount", { count: item.exercises.length }))
            }
            left={(props) => (
              <List.Icon {...props} icon="clipboard-list-outline" />
            )}
            onPress={() => {
              router.push(`/routine/${item.id}`);
            }}
            right={() => (
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon="pencil-outline"
                  onPress={() => {
                    router.push(`/edit-routine/${item.id}`);
                  }}
                />
                <IconButton
                  icon="delete-outline"
                  onPress={() => deleteRoutine(item.id)}
                />
              </View>
            )}
          />
        )}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/add-routine")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0, zIndex: 1 },
});
