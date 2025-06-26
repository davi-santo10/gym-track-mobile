import React, { useState } from "react";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";
import { LoginScreen } from "./LoginScreen";
import { SignUpScreen } from "./SignUpScreen";

type AuthScreen = "login" | "signup" | "forgotPassword";

interface AuthNavigatorProps {
  onGuestMode: () => void;
}

export function AuthNavigator({ onGuestMode }: AuthNavigatorProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>("login");

  switch (currentScreen) {
    case "login":
      return (
        <LoginScreen
          onNavigateToSignUp={() => setCurrentScreen("signup")}
          onNavigateToForgotPassword={() => setCurrentScreen("forgotPassword")}
          onGuestMode={onGuestMode}
        />
      );
    case "signup":
      return (
        <SignUpScreen onNavigateToLogin={() => setCurrentScreen("login")} />
      );
    case "forgotPassword":
      return (
        <ForgotPasswordScreen
          onNavigateToLogin={() => setCurrentScreen("login")}
        />
      );
    default:
      return (
        <LoginScreen
          onNavigateToSignUp={() => setCurrentScreen("signup")}
          onNavigateToForgotPassword={() => setCurrentScreen("forgotPassword")}
          onGuestMode={onGuestMode}
        />
      );
  }
}
