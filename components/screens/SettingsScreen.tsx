import { useRoutines } from "@/context/RoutinesContext";
import { useSettings } from "@/context/SettingsContext";
import { useWorkoutLog } from "@/context/WorkoutLogContext";
import i18n from "@/lib/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Updates from "expo-updates";
import React from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Card,
  Divider,
  List,
  Modal,
  Portal,
  RadioButton,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationSettingsScreen } from "./NotificationSettingsScreen";
import { UnitsSettingsScreen } from "./UnitsSettingsScreen";

const I18N_STORAGE_KEY = "my-gym-tracker-i18n-locale";

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  // Future languages can be added here
  // { code: "es", name: "Spanish", nativeName: "Español" },
  // { code: "fr", name: "French", nativeName: "Français" },
];

type ScreenType = "main" | "notifications" | "units";

export function SettingsScreen() {
  const [locale, setLocale] = React.useState(i18n.locale);
  const [languageModalVisible, setLanguageModalVisible] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState<ScreenType>("main");
  const { settings, isLoaded } = useSettings();
  const { logs } = useWorkoutLog();
  const { routines } = useRoutines();

  const theme = useTheme();

  // Show loading state while settings are loading
  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title={String(i18n.t("more"))} />
        </Appbar.Header>
        <View
          style={[
            styles.content,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render different screens based on current screen
  if (currentScreen === "notifications") {
    return (
      <NotificationSettingsScreen onBack={() => setCurrentScreen("main")} />
    );
  }

  if (currentScreen === "units") {
    return <UnitsSettingsScreen onBack={() => setCurrentScreen("main")} />;
  }

  const getCurrentLanguageName = () => {
    const currentLang = AVAILABLE_LANGUAGES.find(
      (lang) => lang.code === locale
    );
    return currentLang?.nativeName || "English";
  };

  const handleLanguageSelect = async (newLocale: string) => {
    if (!newLocale || newLocale === locale) {
      setLanguageModalVisible(false);
      return;
    }

    setLanguageModalVisible(false);

    // Small delay to let modal close first
    setTimeout(() => {
      Alert.alert(
        String(i18n.t("language")),
        String(i18n.t("languageChangeMessage")),
        [
          { text: String(i18n.t("cancel")), style: "cancel" },
          {
            text: String(i18n.t("ok")),
            onPress: async () => {
              await AsyncStorage.setItem(I18N_STORAGE_KEY, newLocale);
              await Updates.reloadAsync();
            },
          },
        ]
      );
    }, 100);
  };

  const handleExportData = () => {
    Alert.alert(
      String(i18n.t("exportData")),
      String(i18n.t("selectExportFormat")),
      [
        { text: String(i18n.t("cancel")), style: "cancel" },
        {
          text: "CSV",
          onPress: () => exportToCSV(),
        },
        {
          text: "JSON",
          onPress: () => exportToJSON(),
        },
      ]
    );
  };

  const exportToCSV = async () => {
    try {
      let csvContent =
        "Workout Date,Routine Name,Exercise Name,Exercise Type,Set Number,Reps,Weight (kg),Duration (min),Completed\n";

      logs.forEach((log) => {
        const date = new Date(log.date).toISOString().split("T")[0];
        log.exercises.forEach((exercise) => {
          exercise.progress.forEach((set, setIndex) => {
            csvContent += `${date},${log.routineName},"${
              exercise.details.name
            }",${exercise.details.type},${setIndex + 1},${set.reps},${
              set.weight
            },${set.duration},${set.completed}\n`;
          });
        });
      });

      const filename = `gym-tracker-data-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: String(i18n.t("shareWorkoutData")),
        });
      } else {
        Alert.alert(
          String(i18n.t("exportSuccess")),
          String(i18n.t("fileSavedTo")) + fileUri
        );
      }
    } catch (error) {
      console.error("Export CSV error:", error);
      Alert.alert(
        String(i18n.t("exportError")),
        String(i18n.t("exportErrorMessage"))
      );
    }
  };

  const exportToJSON = async () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        appVersion: "1.0.0",
        data: {
          routines: routines,
          workoutLogs: logs,
          settings: settings,
        },
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const filename = `gym-tracker-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      const fileUri = FileSystem.documentDirectory + filename;

      await FileSystem.writeAsStringAsync(fileUri, jsonContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: String(i18n.t("shareWorkoutData")),
        });
      } else {
        Alert.alert(
          String(i18n.t("exportSuccess")),
          String(i18n.t("fileSavedTo")) + fileUri
        );
      }
    } catch (error) {
      console.error("Export JSON error:", error);
      Alert.alert(
        String(i18n.t("exportError")),
        String(i18n.t("exportErrorMessage"))
      );
    }
  };

  const handleReportBug = () => {
    const bugReportUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSc7WukV1HllIrx7YB31wXSPIWATs8-Vc8HqBySNYMPZuGusGQ/viewform?usp=sharing&ouid=105010301337217305064"; // You can replace this with your actual form URL
    Alert.alert(
      String(i18n.t("reportBug")),
      String(i18n.t("reportBugDescription")),
      [
        { text: String(i18n.t("cancel")), style: "cancel" },
        {
          text: String(i18n.t("openForm")),
          onPress: () => {
            Linking.openURL(bugReportUrl).catch(() => {
              Alert.alert(
                String(i18n.t("error")),
                String(i18n.t("cannotOpenUrl"))
              );
            });
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      String(i18n.t("clearDataTitle")),
      String(i18n.t("clearDataMessage")),
      [
        { text: String(i18n.t("cancel")), style: "cancel" },
        {
          text: String(i18n.t("clearData")),
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all app data
              await AsyncStorage.clear();
              await Updates.reloadAsync();
            } catch (e) {
              console.error("Failed to clear data", e);
            }
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(String(i18n.t("aboutTitle")), String(i18n.t("aboutMessage")), [
      { text: String(i18n.t("ok")) },
    ]);
  };

  const getNotificationStatus = () => {
    const { notifications } = settings;
    const activeCount = [
      notifications.workoutReminders,
      notifications.restTimerAlerts,
      notifications.dailyMotivation,
    ].filter(Boolean).length;

    if (activeCount === 0) return String(i18n.t("disabled"));
    return `${activeCount} ${String(i18n.t("enabled"))}`;
  };

  const getUnitsStatus = () => {
    const { units } = settings;
    return `${units.weightUnit.toUpperCase()}, ${units.distanceUnit}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Portal>
        <Modal
          visible={languageModalVisible}
          onDismiss={() => setLanguageModalVisible(false)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {String(i18n.t("selectLanguage"))}
            </Text>

            <View style={styles.languageList}>
              {AVAILABLE_LANGUAGES.map((language) => (
                <List.Item
                  key={language.code}
                  title={language.nativeName}
                  description={language.name}
                  left={(props) => (
                    <RadioButton
                      value={language.code}
                      status={
                        locale === language.code ? "checked" : "unchecked"
                      }
                      onPress={() => handleLanguageSelect(language.code)}
                    />
                  )}
                  onPress={() => handleLanguageSelect(language.code)}
                  style={styles.languageItem}
                />
              ))}
            </View>
          </View>
        </Modal>
      </Portal>

      <Appbar.Header>
        <Appbar.Content title={String(i18n.t("more"))} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* App Settings Section */}
        <Card style={styles.card} elevation={1}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <List.Icon icon="cog" color={theme.colors.primary} />
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.primary }]}
              >
                {String(i18n.t("appSettings"))}
              </Text>
            </View>

            <List.Item
              title={String(i18n.t("languageLabel"))}
              description={getCurrentLanguageName()}
              left={(props) => <List.Icon {...props} icon="translate" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setLanguageModalVisible(true)}
              style={styles.listItem}
            />

            <Divider style={styles.divider} />

            <List.Item
              title={String(i18n.t("notifications"))}
              description={getNotificationStatus()}
              left={(props) => <List.Icon {...props} icon="bell-outline" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setCurrentScreen("notifications")}
              style={styles.listItem}
            />

            <List.Item
              title={String(i18n.t("units"))}
              description={getUnitsStatus()}
              left={(props) => <List.Icon {...props} icon="weight-kilogram" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setCurrentScreen("units")}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Data & Privacy Section */}
        <Card style={styles.card} elevation={1}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <List.Icon icon="shield-outline" color={theme.colors.primary} />
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.primary }]}
              >
                {String(i18n.t("dataPrivacy"))}
              </Text>
            </View>

            <List.Item
              title={String(i18n.t("exportData"))}
              description={String(i18n.t("exportDataDescription"))}
              left={(props) => <List.Icon {...props} icon="export" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleExportData}
              style={styles.listItem}
            />

            <List.Item
              title={String(i18n.t("backup"))}
              description={String(i18n.t("backupDescription"))}
              left={(props) => (
                <List.Icon {...props} icon="cloud-upload-outline" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // TODO: Implement backup
                Alert.alert(
                  String(i18n.t("comingSoon")),
                  String(i18n.t("featureComingSoon"))
                );
              }}
              style={styles.listItem}
            />

            <Divider style={styles.divider} />

            <List.Item
              title={String(i18n.t("clearData"))}
              description={String(i18n.t("clearDataDescription"))}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="delete-outline"
                  color={theme.colors.error}
                />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleClearData}
              style={styles.listItem}
              titleStyle={{ color: theme.colors.error }}
            />
          </Card.Content>
        </Card>

        {/* Support & About Section */}
        <Card style={styles.card} elevation={1}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <List.Icon
                icon="help-circle-outline"
                color={theme.colors.primary}
              />
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.primary }]}
              >
                {String(i18n.t("supportAbout"))}
              </Text>
            </View>

            <List.Item
              title={String(i18n.t("reportBug"))}
              description={String(i18n.t("reportBugDescription"))}
              left={(props) => <List.Icon {...props} icon="bug-outline" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleReportBug}
              style={styles.listItem}
            />

            <List.Item
              title={String(i18n.t("feedback"))}
              description={String(i18n.t("feedbackDescription"))}
              left={(props) => <List.Icon {...props} icon="message-outline" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // TODO: Open feedback form
                Alert.alert(
                  String(i18n.t("comingSoon")),
                  String(i18n.t("featureComingSoon"))
                );
              }}
              style={styles.listItem}
            />

            <List.Item
              title={String(i18n.t("rateApp"))}
              description={String(i18n.t("rateAppDescription"))}
              left={(props) => <List.Icon {...props} icon="star-outline" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // TODO: Navigate to app store
                Alert.alert(
                  String(i18n.t("comingSoon")),
                  String(i18n.t("featureComingSoon"))
                );
              }}
              style={styles.listItem}
            />

            <Divider style={styles.divider} />

            <List.Item
              title={String(i18n.t("aboutTitle"))}
              description={String(i18n.t("aboutDescription"))}
              left={(props) => (
                <List.Icon {...props} icon="information-outline" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleAbout}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text
            variant="bodySmall"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            {String(i18n.t("version"))} 1.0.0
          </Text>
        </View>
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
  versionContainer: {
    marginTop: 24,
    paddingVertical: 16,
  },
  modalContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 24,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "600",
  },
  languageList: {
    marginBottom: 16,
  },
  languageItem: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
});
