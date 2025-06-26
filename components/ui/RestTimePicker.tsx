import i18n from "@/lib/i18n";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";

interface RestTimePickerProps {
  visible: boolean;
  onDismiss: () => void;
  onTimeChange: (seconds: number) => void;
  initialTime: number; // in seconds
  title?: string;
}

// Common rest time presets in seconds
const REST_TIME_PRESETS = [
  { label: "30s", value: 30 },
  { label: "45s", value: 45 },
  { label: "60s", value: 60 },
  { label: "90s", value: 90 },
  { label: "2m", value: 120 },
  { label: "3m", value: 180 },
  { label: "4m", value: 240 },
  { label: "5m", value: 300 },
];

export function RestTimePicker({
  visible,
  onDismiss,
  onTimeChange,
  initialTime,
  title,
}: RestTimePickerProps) {
  const theme = useTheme();
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [selectionMode, setSelectionMode] = useState<"presets" | "custom">(
    "presets"
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Convert seconds to Date object for DateTimePicker
  const [customDate, setCustomDate] = useState(() => {
    const date = new Date();
    const minutes = Math.floor(initialTime / 60);
    const seconds = initialTime % 60;
    date.setHours(0, minutes, seconds, 0);
    return date;
  });

  const handleSave = () => {
    onTimeChange(selectedTime);
    onDismiss();
  };

  const handlePresetSelect = (seconds: number) => {
    setSelectedTime(seconds);
  };

  const handleCustomTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setCustomDate(selectedDate);
      const minutes = selectedDate.getMinutes();
      const seconds = selectedDate.getSeconds();
      const totalSeconds = minutes * 60 + seconds;
      setSelectedTime(totalSeconds);

      if (Platform.OS === "android") {
        // On Android, close the picker immediately
        setShowDatePicker(false);
      }
    } else if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  const formatTimeDisplay = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      if (remainingSeconds === 0) {
        return `${minutes}m`;
      } else {
        return `${minutes}m ${remainingSeconds}s`;
      }
    }
  };

  const openCustomPicker = () => {
    setSelectionMode("custom");
    if (Platform.OS === "android") {
      setShowDatePicker(true);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>
            {title || String(i18n.t("restTime"))}
          </Text>

          <Text variant="bodyMedium" style={styles.description}>
            {String(i18n.t("restTimeDescription"))}
          </Text>

          {/* Selection Mode Toggle */}
          <View style={styles.modeContainer}>
            <SegmentedButtons
              value={selectionMode}
              onValueChange={(value) =>
                setSelectionMode(value as "presets" | "custom")
              }
              buttons={[
                { value: "presets", label: "Quick Select" },
                { value: "custom", label: "Custom Time" },
              ]}
              style={styles.modeButtons}
            />
          </View>

          {selectionMode === "presets" ? (
            /* Preset Selection */
            <View style={styles.presetsContainer}>
              <View style={styles.presetsGrid}>
                {REST_TIME_PRESETS.map((preset) => (
                  <Button
                    key={preset.value}
                    mode={
                      selectedTime === preset.value ? "contained" : "outlined"
                    }
                    onPress={() => handlePresetSelect(preset.value)}
                    style={styles.presetButton}
                    compact
                  >
                    {preset.label}
                  </Button>
                ))}
              </View>
            </View>
          ) : (
            /* Custom Time Selection */
            <View style={styles.customContainer}>
              {Platform.OS === "ios" && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={customDate}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleCustomTimeChange}
                    style={styles.picker}
                    textColor={theme.colors.onSurface}
                  />
                </View>
              )}

              {Platform.OS === "android" && (
                <View style={styles.androidCustomContainer}>
                  <Text variant="bodyMedium" style={styles.androidHint}>
                    Tap the button below to set a custom time
                  </Text>
                  <Button
                    mode="outlined"
                    onPress={openCustomPicker}
                    style={styles.androidPickerButton}
                  >
                    Set Custom Time
                  </Button>
                </View>
              )}
            </View>
          )}

          <View style={styles.selectedTimeContainer}>
            <Text variant="titleMedium" style={styles.selectedTimeLabel}>
              Selected: {formatTimeDisplay(selectedTime)}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={onDismiss} style={styles.button}>
              {String(i18n.t("cancel"))}
            </Button>
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              {String(i18n.t("save"))}
            </Button>
          </View>
        </View>
      </Modal>

      {/* Android DateTimePicker */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={customDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleCustomTimeChange}
        />
      )}
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 24,
  },
  content: {
    padding: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "600",
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  modeContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  modeButtons: {
    width: "100%",
  },
  presetsContainer: {
    marginBottom: 24,
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  presetButton: {
    minWidth: 60,
    marginBottom: 8,
  },
  customContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  pickerContainer: {
    alignItems: "center",
  },
  picker: {
    width: 200,
    height: 120,
  },
  androidCustomContainer: {
    alignItems: "center",
    padding: 16,
  },
  androidHint: {
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.7,
  },
  androidPickerButton: {
    minWidth: 150,
  },
  selectedTimeContainer: {
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  selectedTimeLabel: {
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
