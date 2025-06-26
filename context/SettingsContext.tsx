import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Storage keys for different settings
const SETTINGS_STORAGE_KEY = "my-gym-tracker-settings";

// Define the available units
export type WeightUnit = "kg" | "lbs";
export type DistanceUnit = "km" | "miles";
export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";

// Notification settings interface
export interface NotificationSettings {
  workoutReminders: boolean;
  restTimerAlerts: boolean;
  dailyMotivation: boolean;
  workoutReminderTime: string; // Format: "HH:mm"
  reminderDays: string[]; // Array of day names
}

// Units and measurements interface
export interface UnitsSettings {
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  dateFormat: DateFormat;
}

// Complete app settings interface
export interface AppSettings {
  notifications: NotificationSettings;
  units: UnitsSettings;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    workoutReminders: false,
    restTimerAlerts: true,
    dailyMotivation: false,
    workoutReminderTime: "18:00", // 6 PM default
    reminderDays: ["Monday", "Wednesday", "Friday"], // Default workout days
  },
  units: {
    weightUnit: "kg",
    distanceUnit: "km",
    dateFormat: "DD/MM/YYYY",
  },
};

// Context interface
interface SettingsContextType {
  settings: AppSettings;
  isLoaded: boolean;
  updateNotificationSettings: (
    updates: Partial<NotificationSettings>
  ) => Promise<void>;
  updateUnitsSettings: (updates: Partial<UnitsSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  // Helper functions for unit conversion
  convertWeight: (
    weight: number,
    fromUnit: WeightUnit,
    toUnit: WeightUnit
  ) => number;
  formatWeight: (weight: number) => string;
  formatDate: (date: Date) => string;
}

const SettingsContext = createContext<SettingsContextType>({} as any);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage on app start
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          // Merge with defaults to ensure all fields exist (for future updates)
          setSettings({
            notifications: {
              ...DEFAULT_SETTINGS.notifications,
              ...parsedSettings.notifications,
            },
            units: { ...DEFAULT_SETTINGS.units, ...parsedSettings.units },
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        // Fall back to defaults
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage whenever they change
  const saveSettings = useCallback(async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(newSettings)
      );
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, []);

  // Update notification settings
  const updateNotificationSettings = useCallback(
    async (updates: Partial<NotificationSettings>) => {
      const newSettings = {
        ...settings,
        notifications: { ...settings.notifications, ...updates },
      };
      await saveSettings(newSettings);
    },
    [settings, saveSettings]
  );

  // Update units settings
  const updateUnitsSettings = useCallback(
    async (updates: Partial<UnitsSettings>) => {
      const newSettings = {
        ...settings,
        units: { ...settings.units, ...updates },
      };
      await saveSettings(newSettings);
    },
    [settings, saveSettings]
  );

  // Reset all settings to defaults
  const resetToDefaults = useCallback(async () => {
    await saveSettings(DEFAULT_SETTINGS);
  }, [saveSettings]);

  // Helper function to convert weight between units
  const convertWeight = useCallback(
    (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
      if (fromUnit === toUnit) return weight;

      if (fromUnit === "kg" && toUnit === "lbs") {
        return weight * 2.20462; // 1 kg = 2.20462 lbs
      } else if (fromUnit === "lbs" && toUnit === "kg") {
        return weight / 2.20462; // 1 lbs = 0.453592 kg
      }

      return weight;
    },
    []
  );

  // Helper function to format weight with current unit
  const formatWeight = useCallback(
    (weight: number): string => {
      const unit = settings.units.weightUnit;
      return `${weight.toFixed(1)} ${unit}`;
    },
    [settings.units.weightUnit]
  );

  // Helper function to format date according to user preference
  const formatDate = useCallback(
    (date: Date): string => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      switch (settings.units.dateFormat) {
        case "MM/DD/YYYY":
          return `${month}/${day}/${year}`;
        case "YYYY-MM-DD":
          return `${year}-${month}-${day}`;
        case "DD/MM/YYYY":
        default:
          return `${day}/${month}/${year}`;
      }
    },
    [settings.units.dateFormat]
  );

  const value = {
    settings,
    isLoaded,
    updateNotificationSettings,
    updateUnitsSettings,
    resetToDefaults,
    convertWeight,
    formatWeight,
    formatDate,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
