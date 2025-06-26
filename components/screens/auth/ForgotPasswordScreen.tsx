import { useAuth } from "@/context/AuthContext";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
}

export function ForgotPasswordScreen({
  onNavigateToLogin,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword, loading } = useAuth();
  const theme = useTheme();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert(String(i18n.t("error")), String(i18n.t("emailRequired")));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(String(i18n.t("error")), String(i18n.t("invalidEmail")));
      return;
    }

    try {
      await resetPassword(email.trim());
      setEmailSent(true);
    } catch (error: any) {
      let errorMessage = String(i18n.t("resetPasswordError"));

      if (error.code === "auth/user-not-found") {
        errorMessage = String(i18n.t("userNotFound"));
      } else if (error.code === "auth/invalid-email") {
        errorMessage = String(i18n.t("invalidEmail"));
      }

      Alert.alert(String(i18n.t("resetPasswordFailed")), errorMessage);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text
              variant="headlineLarge"
              style={[styles.title, { color: theme.colors.primary }]}
            >
              {String(i18n.t("checkYourEmail"))}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {String(i18n.t("resetPasswordEmailSent"))}
            </Text>
          </View>

          <Card style={styles.card} elevation={2}>
            <Card.Content style={styles.cardContent}>
              <Text variant="bodyMedium" style={styles.emailText}>
                {email}
              </Text>

              <Button
                mode="contained"
                onPress={onNavigateToLogin}
                style={styles.backButton}
              >
                {String(i18n.t("backToLogin"))}
              </Button>

              <Button
                mode="text"
                onPress={() => setEmailSent(false)}
                style={styles.resendButton}
              >
                {String(i18n.t("tryDifferentEmail"))}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            {String(i18n.t("resetPassword"))}
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {String(i18n.t("resetPasswordInstructions"))}
          </Text>
        </View>

        <Card style={styles.card} elevation={2}>
          <Card.Content style={styles.cardContent}>
            <TextInput
              label={String(i18n.t("email"))}
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              disabled={loading}
            />

            <Button
              mode="contained"
              onPress={handleResetPassword}
              style={styles.resetButton}
              disabled={loading}
              loading={loading}
            >
              {String(i18n.t("sendResetEmail"))}
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Button mode="text" onPress={onNavigateToLogin} disabled={loading}>
            {String(i18n.t("backToLogin"))}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  card: {
    marginBottom: 24,
  },
  cardContent: {
    padding: 24,
  },
  input: {
    marginBottom: 24,
  },
  resetButton: {
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  resendButton: {
    marginBottom: 16,
  },
  emailText: {
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
  },
});
