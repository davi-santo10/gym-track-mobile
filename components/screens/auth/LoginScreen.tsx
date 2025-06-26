import { useAuth } from "@/context/AuthContext";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginScreenProps {
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
  onGuestMode: () => void;
}

export function LoginScreen({
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onGuestMode,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, signInAsGuest } = useAuth();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(String(i18n.t("error")), String(i18n.t("fillAllFields")));
      return;
    }

    try {
      await signIn(email.trim(), password);
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      let errorMessage = String(i18n.t("loginError"));

      if (error.code === "auth/user-not-found") {
        errorMessage = String(i18n.t("userNotFound"));
      } else if (error.code === "auth/wrong-password") {
        errorMessage = String(i18n.t("wrongPassword"));
      } else if (error.code === "auth/invalid-email") {
        errorMessage = String(i18n.t("invalidEmail"));
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = String(i18n.t("tooManyAttempts"));
      }

      Alert.alert(String(i18n.t("loginFailed")), errorMessage);
    }
  };

  const handleGuestMode = async () => {
    try {
      await signInAsGuest();
      onGuestMode();
    } catch (error) {
      console.error("Error enabling guest mode:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            {String(i18n.t("welcomeBack"))}
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {String(i18n.t("signInToContinue"))}
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

            <TextInput
              label={String(i18n.t("password"))}
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              disabled={loading}
            />

            <Button
              mode="text"
              onPress={onNavigateToForgotPassword}
              style={styles.forgotPasswordButton}
              disabled={loading}
            >
              {String(i18n.t("forgotPassword"))}
            </Button>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={loading}
              loading={loading}
            >
              {String(i18n.t("signIn"))}
            </Button>

            <Divider style={styles.divider} />

            <Button
              mode="outlined"
              onPress={handleGuestMode}
              style={styles.guestButton}
              disabled={loading}
              icon="account-outline"
            >
              {String(i18n.t("continueAsGuest"))}
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {String(i18n.t("dontHaveAccount"))}
          </Text>
          <Button mode="text" onPress={onNavigateToSignUp} disabled={loading}>
            {String(i18n.t("signUp"))}
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
    marginBottom: 16,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  loginButton: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  guestButton: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
