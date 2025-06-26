import {
  DateFormat,
  DistanceUnit,
  useSettings,
  WeightUnit,
} from "@/context/SettingsContext";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
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

type SettingType = "weight" | "distance" | "date";

interface UnitsSettingsScreenProps {
  onBack?: () => void;
}

export function UnitsSettingsScreen({ onBack }: UnitsSettingsScreenProps) {
  const { settings, updateUnitsSettings, resetToDefaults } = useSettings();
  const theme = useTheme();
  const [activeModal, setActiveModal] = useState<SettingType | null>(null);

  const weightOptions = [
    {
      value: "kg" as WeightUnit,
      label: String(i18n.t("kilograms")),
      icon: "weight-kilogram",
    },
    {
      value: "lbs" as WeightUnit,
      label: String(i18n.t("pounds")),
      icon: "weight-pound",
    },
  ];

  const distanceOptions = [
    {
      value: "km" as DistanceUnit,
      label: String(i18n.t("kilometers")),
      icon: "map-marker-distance",
    },
    {
      value: "miles" as DistanceUnit,
      label: String(i18n.t("miles")),
      icon: "map-marker-distance",
    },
  ];

  const dateOptions = [
    {
      value: "DD/MM/YYYY" as DateFormat,
      label: "DD/MM/YYYY",
      example: "31/12/2023",
    },
    {
      value: "MM/DD/YYYY" as DateFormat,
      label: "MM/DD/YYYY",
      example: "12/31/2023",
    },
    {
      value: "YYYY-MM-DD" as DateFormat,
      label: "YYYY-MM-DD",
      example: "2023-12-31",
    },
  ];

  const handleWeightUnitChange = (unit: WeightUnit) => {
    updateUnitsSettings({ weightUnit: unit });
    setActiveModal(null);
  };

  const handleDistanceUnitChange = (unit: DistanceUnit) => {
    updateUnitsSettings({ distanceUnit: unit });
    setActiveModal(null);
  };

  const handleDateFormatChange = (format: DateFormat) => {
    updateUnitsSettings({ dateFormat: format });
    setActiveModal(null);
  };

  const getWeightUnitDisplay = () => {
    const option = weightOptions.find(
      (opt) => opt.value === settings.units.weightUnit
    );
    return option?.label || weightOptions[0].label;
  };

  const getDistanceUnitDisplay = () => {
    const option = distanceOptions.find(
      (opt) => opt.value === settings.units.distanceUnit
    );
    return option?.label || distanceOptions[0].label;
  };

  const getDateFormatDisplay = () => {
    const option = dateOptions.find(
      (opt) => opt.value === settings.units.dateFormat
    );
    return option
      ? `${option.label} (${option.example})`
      : dateOptions[0].label;
  };

  const renderWeightModal = () => (
    <Modal
      visible={activeModal === "weight"}
      onDismiss={() => setActiveModal(null)}
      contentContainerStyle={[
        styles.modalContainer,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <View style={styles.modalContent}>
        <Text variant="headlineSmall" style={styles.modalTitle}>
          {String(i18n.t("weightUnit"))}
        </Text>

        <View style={styles.optionsList}>
          {weightOptions.map((option) => (
            <List.Item
              key={option.value}
              title={option.label}
              left={(props) => <List.Icon {...props} icon={option.icon} />}
              right={() => (
                <RadioButton
                  value={option.value}
                  status={
                    settings.units.weightUnit === option.value
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => handleWeightUnitChange(option.value)}
                />
              )}
              onPress={() => handleWeightUnitChange(option.value)}
              style={styles.optionItem}
            />
          ))}
        </View>
      </View>
    </Modal>
  );

  const renderDistanceModal = () => (
    <Modal
      visible={activeModal === "distance"}
      onDismiss={() => setActiveModal(null)}
      contentContainerStyle={[
        styles.modalContainer,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <View style={styles.modalContent}>
        <Text variant="headlineSmall" style={styles.modalTitle}>
          {String(i18n.t("distanceUnit"))}
        </Text>

        <View style={styles.optionsList}>
          {distanceOptions.map((option) => (
            <List.Item
              key={option.value}
              title={option.label}
              left={(props) => <List.Icon {...props} icon={option.icon} />}
              right={() => (
                <RadioButton
                  value={option.value}
                  status={
                    settings.units.distanceUnit === option.value
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => handleDistanceUnitChange(option.value)}
                />
              )}
              onPress={() => handleDistanceUnitChange(option.value)}
              style={styles.optionItem}
            />
          ))}
        </View>
      </View>
    </Modal>
  );

  const renderDateModal = () => (
    <Modal
      visible={activeModal === "date"}
      onDismiss={() => setActiveModal(null)}
      contentContainerStyle={[
        styles.modalContainer,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <View style={styles.modalContent}>
        <Text variant="headlineSmall" style={styles.modalTitle}>
          {String(i18n.t("dateFormat"))}
        </Text>

        <View style={styles.optionsList}>
          {dateOptions.map((option) => (
            <List.Item
              key={option.value}
              title={option.label}
              description={option.example}
              left={(props) => <List.Icon {...props} icon="calendar" />}
              right={() => (
                <RadioButton
                  value={option.value}
                  status={
                    settings.units.dateFormat === option.value
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => handleDateFormatChange(option.value)}
                />
              )}
              onPress={() => handleDateFormatChange(option.value)}
              style={styles.optionItem}
            />
          ))}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Portal>
        {renderWeightModal()}
        {renderDistanceModal()}
        {renderDateModal()}
      </Portal>

      <Appbar.Header>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title={String(i18n.t("unitsSettings"))} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Units Section */}
        <Card style={styles.card} elevation={1}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <List.Icon icon="ruler" color={theme.colors.primary} />
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.primary }]}
              >
                Measurement Units
              </Text>
            </View>

            <List.Item
              title={String(i18n.t("weightUnit"))}
              description={getWeightUnitDisplay()}
              left={(props) => <List.Icon {...props} icon="weight-kilogram" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setActiveModal("weight")}
              style={styles.listItem}
            />

            <Divider style={styles.divider} />

            <List.Item
              title={String(i18n.t("distanceUnit"))}
              description={getDistanceUnitDisplay()}
              left={(props) => (
                <List.Icon {...props} icon="map-marker-distance" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setActiveModal("distance")}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Display Formats Section */}
        <Card style={styles.card} elevation={1}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <List.Icon icon="format-text" color={theme.colors.primary} />
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.primary }]}
              >
                Display Formats
              </Text>
            </View>

            <List.Item
              title={String(i18n.t("dateFormat"))}
              description={getDateFormatDisplay()}
              left={(props) => <List.Icon {...props} icon="calendar" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setActiveModal("date")}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Preview Section */}
        <Card style={styles.card} elevation={1}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <List.Icon icon="eye-outline" color={theme.colors.primary} />
              <Text
                variant="titleMedium"
                style={[styles.sectionTitle, { color: theme.colors.primary }]}
              >
                Preview
              </Text>
            </View>

            <View style={styles.previewSection}>
              <Text variant="bodyMedium" style={styles.previewItem}>
                Weight: 70.5 {settings.units.weightUnit}
              </Text>
              <Text variant="bodyMedium" style={styles.previewItem}>
                Distance: 5.2 {settings.units.distanceUnit}
              </Text>
              <Text variant="bodyMedium" style={styles.previewItem}>
                Date:{" "}
                {(() => {
                  const today = new Date();
                  const day = today.getDate().toString().padStart(2, "0");
                  const month = (today.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                  const year = today.getFullYear();

                  switch (settings.units.dateFormat) {
                    case "MM/DD/YYYY":
                      return `${month}/${day}/${year}`;
                    case "YYYY-MM-DD":
                      return `${year}-${month}-${day}`;
                    case "DD/MM/YYYY":
                    default:
                      return `${day}/${month}/${year}`;
                  }
                })()}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Reset Section */}
        <Card style={styles.card} elevation={1}>
          <Card.Content style={styles.cardContent}>
            <Button
              mode="outlined"
              onPress={resetToDefaults}
              icon="restore"
              style={styles.resetButton}
            >
              {String(i18n.t("reset"))}
            </Button>
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
  optionsList: {
    marginBottom: 16,
  },
  optionItem: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  previewSection: {
    gap: 12,
  },
  previewItem: {
    paddingVertical: 4,
  },
  resetButton: {
    marginTop: 8,
  },
});
