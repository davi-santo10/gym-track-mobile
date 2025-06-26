import i18n from "@/lib/i18n";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";

interface TimePickerProps {
  visible: boolean;
  onDismiss: () => void;
  onTimeChange: (time: string) => void;
  initialTime: string; // Format: "HH:mm"
  title?: string;
}

export function TimePicker({
  visible,
  onDismiss,
  onTimeChange,
  initialTime,
  title,
}: TimePickerProps) {
  const theme = useTheme();

  // Convert initialTime string to Date object
  const [selectedDate, setSelectedDate] = useState(() => {
    const [hours, minutes] = initialTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  });

  const [showPicker, setShowPicker] = useState(visible);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (selectedTime) {
      setSelectedDate(selectedTime);
      if (Platform.OS === "android") {
        // On Android, immediately save the time
        const hours = selectedTime.getHours().toString().padStart(2, "0");
        const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
        onTimeChange(`${hours}:${minutes}`);
        onDismiss();
      }
    } else if (Platform.OS === "android") {
      // User cancelled on Android
      onDismiss();
    }
  };

  const handleSave = () => {
    const hours = selectedDate.getHours().toString().padStart(2, "0");
    const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
    onTimeChange(`${hours}:${minutes}`);
    onDismiss();
  };

  const handleCancel = () => {
    setShowPicker(false);
    onDismiss();
  };

  // Format time for display
  const formatTimeDisplay = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (Platform.OS === "android") {
    // On Android, show the native picker directly
    return showPicker && visible ? (
      <DateTimePicker
        value={selectedDate}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={handleTimeChange}
      />
    ) : null;
  }

  // On iOS, wrap in a modal for better UX
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
            {title || String(i18n.t("selectTime"))}
          </Text>

          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={selectedDate}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleTimeChange}
              style={styles.picker}
              textColor={theme.colors.onSurface}
            />
          </View>

          <View style={styles.selectedTimeContainer}>
            <Text variant="titleMedium" style={styles.selectedTimeLabel}>
              {String(i18n.t("selectedTime"))}:{" "}
              {formatTimeDisplay(selectedDate)}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.button}
            >
              {String(i18n.t("cancel"))}
            </Button>
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              {String(i18n.t("save"))}
            </Button>
          </View>
        </View>
      </Modal>
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
    marginBottom: 24,
    fontWeight: "600",
  },
  pickerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  picker: {
    width: 200,
    height: 120,
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
