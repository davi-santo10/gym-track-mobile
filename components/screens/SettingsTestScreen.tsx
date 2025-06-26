import { useSettings } from "@/context/SettingsContext";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export function SettingsTestScreen() {
  const { settings, formatWeight, formatDate, convertWeight } = useSettings();
  const theme = useTheme();

  const testWeight = 70.5;
  const testDate = new Date();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Settings Test Screen
            </Text>

            <View style={styles.section}>
              <Text variant="titleMedium">🔔 Notification Settings:</Text>
              <Text>
                Workout Reminders:{" "}
                {settings.notifications.workoutReminders ? "✅" : "❌"}
              </Text>
              <Text>
                Rest Timer Alerts:{" "}
                {settings.notifications.restTimerAlerts ? "✅" : "❌"}
              </Text>
              <Text>
                Daily Motivation:{" "}
                {settings.notifications.dailyMotivation ? "✅" : "❌"}
              </Text>
              <Text>
                Reminder Time: {settings.notifications.workoutReminderTime}
              </Text>
              <Text>
                Reminder Days: {settings.notifications.reminderDays.join(", ")}
              </Text>
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium">📏 Units Settings:</Text>
              <Text>Weight Unit: {settings.units.weightUnit}</Text>
              <Text>Distance Unit: {settings.units.distanceUnit}</Text>
              <Text>Date Format: {settings.units.dateFormat}</Text>
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium">🧪 Helper Functions Test:</Text>
              <Text>Format Weight: {formatWeight(testWeight)}</Text>
              <Text>Format Date: {formatDate(testDate)}</Text>
              <Text>
                Convert 70.5kg to lbs:{" "}
                {convertWeight(70.5, "kg", "lbs").toFixed(1)} lbs
              </Text>
              <Text>
                Convert 155lbs to kg:{" "}
                {convertWeight(155, "lbs", "kg").toFixed(1)} kg
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    gap: 8,
  },
});
