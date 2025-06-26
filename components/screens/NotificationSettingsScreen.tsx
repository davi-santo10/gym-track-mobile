import { TimePicker } from "@/components/ui/TimePicker";
import { useSettings } from "@/context/SettingsContext";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Card,
  Chip,
  Divider,
  List,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface NotificationSettingsScreenProps {
  onBack?: () => void;
}

export function NotificationSettingsScreen({
  onBack,
}: NotificationSettingsScreenProps) {
  const { settings, updateNotificationSettings } = useSettings();
  const theme = useTheme();
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Format time for display
  const formatTimeDisplay = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle time change from picker
  const handleTimeChange = (timeString: string) => {
    updateNotificationSettings({
      workoutReminderTime: timeString,
    });
  };

  // Toggle reminder day
  const toggleReminderDay = (day: string) => {
    const currentDays = settings.notifications.reminderDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    updateNotificationSettings({
      reminderDays: newDays,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title={String(i18n.t("notificationSettings"))} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Notification Types */}
        <Card style={styles.card} elevation={1}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <List.Icon icon="bell-outline" color={theme.colors.primary} />
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.primary }]}
              >
                Notification Types
              </Text>
            </View>

            <List.Item
              title={String(i18n.t("workoutReminders"))}
              description={String(i18n.t("workoutRemindersDescription"))}
              left={(props) => <List.Icon {...props} icon="calendar-clock" />}
              right={() => (
                <Switch
                  value={settings.notifications.workoutReminders}
                  onValueChange={(value) =>
                    updateNotificationSettings({ workoutReminders: value })
                  }
                />
              )}
              style={styles.listItem}
            />

            <Divider style={styles.divider} />

            <List.Item
              title={String(i18n.t("restTimerAlerts"))}
              description={String(i18n.t("restTimerAlertsDescription"))}
              left={(props) => <List.Icon {...props} icon="timer-outline" />}
              right={() => (
                <Switch
                  value={settings.notifications.restTimerAlerts}
                  onValueChange={(value) =>
                    updateNotificationSettings({ restTimerAlerts: value })
                  }
                />
              )}
              style={styles.listItem}
            />

            <Divider style={styles.divider} />

            <List.Item
              title={String(i18n.t("dailyMotivation"))}
              description={String(i18n.t("dailyMotivationDescription"))}
              left={(props) => <List.Icon {...props} icon="heart-outline" />}
              right={() => (
                <Switch
                  value={settings.notifications.dailyMotivation}
                  onValueChange={(value) =>
                    updateNotificationSettings({ dailyMotivation: value })
                  }
                />
              )}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Workout Reminder Settings */}
        {settings.notifications.workoutReminders && (
          <Card style={styles.card} elevation={1}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <List.Icon icon="calendar-clock" color={theme.colors.primary} />
                <Text
                  variant="titleMedium"
                  style={[styles.sectionTitle, { color: theme.colors.primary }]}
                >
                  Workout Reminder Settings
                </Text>
              </View>

              <List.Item
                title={String(i18n.t("reminderTime"))}
                description={formatTimeDisplay(
                  settings.notifications.workoutReminderTime
                )}
                left={(props) => <List.Icon {...props} icon="clock-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => setShowTimePicker(true)}
                style={styles.listItem}
              />

              <Divider style={styles.divider} />

              <View style={styles.daysSection}>
                <Text variant="titleSmall" style={styles.daysTitle}>
                  {String(i18n.t("reminderDays"))}
                </Text>
                <View style={styles.daysContainer}>
                  {DAYS_OF_WEEK.map((day) => (
                    <Chip
                      key={day}
                      mode={
                        settings.notifications.reminderDays.includes(day)
                          ? "flat"
                          : "outlined"
                      }
                      onPress={() => toggleReminderDay(day)}
                      style={styles.dayChip}
                      compact
                    >
                      {String(
                        i18n.t(`days.${day.toLowerCase()}` as any)
                      ).substring(0, 3)}
                    </Chip>
                  ))}
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Custom Time Picker */}
        <TimePicker
          visible={showTimePicker}
          onDismiss={() => setShowTimePicker(false)}
          onTimeChange={handleTimeChange}
          initialTime={settings.notifications.workoutReminderTime}
          title={String(i18n.t("reminderTime"))}
        />
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
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    marginLeft: 12,
    fontWeight: "600",
  },
  listItem: {
    paddingHorizontal: 0,
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 12,
  },
  daysSection: {
    paddingTop: 8,
  },
  daysTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dayChip: {
    minWidth: 50,
  },
});
