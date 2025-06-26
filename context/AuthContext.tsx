import AsyncStorage from "@react-native-async-storage/async-storage";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// User Profile Interface (stored locally)
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  preferences: {
    weightUnit: "kg" | "lbs";
    language: "en" | "pt";
    theme: "light" | "dark" | "system";
  };
  notifications: {
    workoutReminders: boolean;
    progressUpdates: boolean;
    achievements: boolean;
  };
  subscription: {
    isPremium: boolean;
    plan?: string;
    expiresAt?: string;
  };
}

// Auth Context Interface
interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOutGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Create default user profile (stored locally)
  const createDefaultProfile = (user: FirebaseAuthTypes.User): UserProfile => {
    return {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || undefined,
      createdAt: new Date().toISOString(),
      preferences: {
        weightUnit: "kg",
        language: "en",
        theme: "system",
      },
      notifications: {
        workoutReminders: true,
        progressUpdates: true,
        achievements: true,
      },
      subscription: {
        isPremium: false,
      },
    };
  };

  // Load user profile from local storage
  const loadUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const profileData = await AsyncStorage.getItem(`userProfile_${uid}`);
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error("Error loading user profile:", error);
      return null;
    }
  };

  // Save user profile to local storage
  const saveUserProfile = async (profile: UserProfile): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        `userProfile_${profile.uid}`,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  // Check guest mode
  const checkGuestMode = async () => {
    try {
      const guestMode = await AsyncStorage.getItem("isGuestMode");
      setIsGuest(guestMode === "true");
    } catch (error) {
      console.error("Error checking guest mode:", error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        // Load or create user profile
        let profile = await loadUserProfile(user.uid);
        if (!profile) {
          profile = createDefaultProfile(user);
          await saveUserProfile(profile);
        }
        setUserProfile(profile);
        setIsGuest(false);
        await AsyncStorage.removeItem("isGuestMode");
      } else {
        setUserProfile(null);
        await checkGuestMode();
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      // Update display name
      await userCredential.user.updateProfile({ displayName });

      // Create and save user profile locally
      const profile = createDefaultProfile(userCredential.user);
      profile.displayName = displayName;
      await saveUserProfile(profile);
      setUserProfile(profile);
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Sign out
  const signOutUser = async (): Promise<void> => {
    try {
      await auth().signOut();
      setUserProfile(null);
      await AsyncStorage.removeItem("isGuestMode");
      setIsGuest(false);
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw new Error("Failed to sign out. Please try again.");
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  // Update user profile (local storage only)
  const updateUserProfile = async (
    updates: Partial<UserProfile>
  ): Promise<void> => {
    if (!userProfile) {
      throw new Error("No user profile found");
    }

    try {
      const updatedProfile = { ...userProfile, ...updates };
      await saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error("Failed to update profile. Please try again.");
    }
  };

  // Refresh user profile
  const refreshUserProfile = async (): Promise<void> => {
    if (!user) return;

    try {
      const profile = await loadUserProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error: any) {
      console.error("Refresh profile error:", error);
    }
  };

  // Sign in as guest
  const signInAsGuest = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem("isGuestMode", "true");
      setIsGuest(true);
    } catch (error: any) {
      console.error("Guest sign in error:", error);
      throw new Error("Failed to sign in as guest. Please try again.");
    }
  };

  // Sign out guest
  const signOutGuest = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("isGuestMode");
      setIsGuest(false);
    } catch (error: any) {
      console.error("Guest sign out error:", error);
      throw new Error("Failed to sign out. Please try again.");
    }
  };

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isGuest,
    signUp,
    signIn,
    signOut: signOutUser,
    resetPassword,
    updateUserProfile,
    refreshUserProfile,
    signInAsGuest,
    signOutGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
