import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../context/AuthContext";

export const ProfileScreen: React.FC = () => {
  const { user, userProfile, updateUserProfile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || ""
  );
  const [workoutReminders, setWorkoutReminders] = useState(
    userProfile?.notifications.workoutReminders || false
  );
  const [progressUpdates, setProgressUpdates] = useState(
    userProfile?.notifications.progressUpdates || false
  );
  const [achievements, setAchievements] = useState(
    userProfile?.notifications.achievements || false
  );

  const handleSaveProfile = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      await updateUserProfile({
        displayName,
        notifications: {
          workoutReminders,
          progressUpdates,
          achievements,
        },
      });

      setIsEditing(false);
      Alert.alert(String(i18n.t("success")), String(i18n.t("profileUpdated")));
    } catch (error: any) {
      Alert.alert(String(i18n.t("error")), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      String(i18n.t("signOut")),
      String(i18n.t("signOutConfirmation")),
      [
        { text: String(i18n.t("cancel")), style: "cancel" },
        {
          text: String(i18n.t("signOut")),
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert(String(i18n.t("error")), error.message);
            }
          },
        },
      ]
    );
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user || !userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{String(i18n.t("noUserProfile"))}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            // This will be handled by the parent SettingsScreen
            // For now, we'll just show an alert as a placeholder
            Alert.alert(
              String(i18n.t("info")),
              "Use the settings navigation to go back"
            );
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
          <Text style={styles.backButtonText}>
            {String(i18n.t("settings"))}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {getInitials(userProfile.displayName || userProfile.email)}
            </Text>
          </View>
        </View>

        <Text style={styles.userName}>{userProfile.displayName}</Text>
        <Text style={styles.userEmail}>{userProfile.email}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons
            name={isEditing ? "close" : "pencil"}
            size={16}
            color="#007AFF"
          />
          <Text style={styles.editButtonText}>
            {isEditing
              ? String(i18n.t("cancel"))
              : String(i18n.t("editProfile"))}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Profile Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {String(i18n.t("personalInformation"))}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{String(i18n.t("displayName"))}</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={String(i18n.t("enterDisplayName"))}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{String(i18n.t("email"))}</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={userProfile.email}
            editable={false}
          />
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {String(i18n.t("notifications"))}
        </Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>
            {String(i18n.t("workoutReminders"))}
          </Text>
          <Switch
            value={workoutReminders}
            onValueChange={setWorkoutReminders}
            disabled={!isEditing}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>
            {String(i18n.t("progressUpdates"))}
          </Text>
          <Switch
            value={progressUpdates}
            onValueChange={setProgressUpdates}
            disabled={!isEditing}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>
            {String(i18n.t("achievements"))}
          </Text>
          <Switch
            value={achievements}
            onValueChange={setAchievements}
            disabled={!isEditing}
          />
        </View>
      </View>

      {/* Account Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {String(i18n.t("accountInformation"))}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{String(i18n.t("memberSince"))}</Text>
          <Text style={styles.infoValue}>
            {new Date(userProfile.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{String(i18n.t("accountType"))}</Text>
          <Text style={styles.infoValue}>
            {userProfile.subscription.isPremium
              ? String(i18n.t("premium"))
              : String(i18n.t("free"))}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {isEditing && (
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading
                ? String(i18n.t("saving"))
                : String(i18n.t("saveChanges"))}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.signOutButtonText}>
            {String(i18n.t("signOut"))}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backButtonContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
  header: {
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  editButtonText: {
    color: "#007AFF",
    marginLeft: 5,
    fontWeight: "500",
  },
  section: {
    backgroundColor: "white",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#333",
  },
  infoValue: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  signOutButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 50,
  },
});
