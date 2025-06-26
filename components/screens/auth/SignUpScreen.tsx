import { useAuth } from "@/context/AuthContext";
import i18n from "@/lib/i18n";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface SignUpScreenProps {
  onNavigateToLogin: () => void;
}

export function SignUpScreen({ onNavigateToLogin }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { signUp, loading } = useAuth();
  const theme = useTheme();

  const validateForm = () => {
    if (
      !formData.displayName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Alert.alert(String(i18n.t("error")), String(i18n.t("fillAllFields")));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert(
        String(i18n.t("error")),
        String(i18n.t("passwordsDoNotMatch"))
      );
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert(String(i18n.t("error")), String(i18n.t("passwordTooShort")));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert(String(i18n.t("error")), String(i18n.t("invalidEmail")));
      return false;
    }

    if (!acceptTerms) {
      Alert.alert(
        String(i18n.t("error")),
        String(i18n.t("acceptTermsRequired"))
      );
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await signUp(
        formData.email.trim(),
        formData.password,
        formData.displayName.trim()
      );
      // Navigation will be handled by the auth state change
    } catch (error: any) {
      let errorMessage = String(i18n.t("signUpError"));

      if (error.code === "auth/email-already-in-use") {
        errorMessage = String(i18n.t("emailAlreadyInUse"));
      } else if (error.code === "auth/invalid-email") {
        errorMessage = String(i18n.t("invalidEmail"));
      } else if (error.code === "auth/weak-password") {
        errorMessage = String(i18n.t("weakPassword"));
      }

      Alert.alert(String(i18n.t("signUpFailed")), errorMessage);
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: theme.colors.primary }]}
          >
            {String(i18n.t("createAccount"))}
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {String(i18n.t("joinUsToday"))}
          </Text>
        </View>

        <Card style={styles.card} elevation={2}>
          <Card.Content style={styles.cardContent}>
            <TextInput
              label={String(i18n.t("fullName"))}
              value={formData.displayName}
              onChangeText={(value) => updateFormData("displayName", value)}
              mode="outlined"
              autoCapitalize="words"
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              label={String(i18n.t("email"))}
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
              disabled={loading}
            />

            <TextInput
              label={String(i18n.t("password"))}
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
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

            <TextInput
              label={String(i18n.t("confirmPassword"))}
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData("confirmPassword", value)}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              style={styles.input}
              disabled={loading}
            />

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={acceptTerms ? "checked" : "unchecked"}
                onPress={() => setAcceptTerms(!acceptTerms)}
                disabled={loading}
              />
              <Text variant="bodyMedium" style={styles.checkboxText}>
                {String(i18n.t("acceptTermsAndPrivacy"))}
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={handleSignUp}
              style={styles.signUpButton}
              disabled={loading}
              loading={loading}
            >
              {String(i18n.t("createAccount"))}
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {String(i18n.t("alreadyHaveAccount"))}
          </Text>
          <Button mode="text" onPress={onNavigateToLogin} disabled={loading}>
            {String(i18n.t("signIn"))}
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 8,
  },
  signUpButton: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
