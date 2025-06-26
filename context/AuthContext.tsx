import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { firebaseService } from "../config/firebase";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isFirebaseAvailable: boolean;
  firebaseError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Initialize Firebase and set up auth listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeFirebaseAuth = async () => {
      try {
        console.log("🔥 Initializing Firebase Auth...");

        // Initialize Firebase using the singleton service
        await firebaseService.initialize();

        // Check if Firebase is properly initialized
        const status = await firebaseService.checkFirebaseStatus();
        if (!status.initialized) {
          throw new Error(status.error || "Firebase initialization failed");
        }

        console.log("✅ Firebase initialized successfully");
        setIsFirebaseAvailable(true);
        setFirebaseError(null);

        // Get auth instance and set up listener
        const auth = firebaseService.getAuth();

        unsubscribe = auth.onAuthStateChanged(
          (firebaseUser: FirebaseAuthTypes.User | null) => {
            console.log(
              "🔥 Auth state changed:",
              firebaseUser?.email || "No user"
            );

            if (firebaseUser) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                emailVerified: firebaseUser.emailVerified,
              });
            } else {
              setUser(null);
            }
            setLoading(false);
          }
        );
      } catch (error) {
        console.error("❌ Firebase Auth initialization error:", error);
        setIsFirebaseAvailable(false);
        setFirebaseError(
          error instanceof Error
            ? error.message
            : "Firebase initialization failed"
        );
        setLoading(false);

        // Log detailed status for debugging
        const status = await firebaseService.checkFirebaseStatus();
        console.log(
          "Firebase status details:",
          JSON.stringify(status, null, 2)
        );
      }
    };

    initializeFirebaseAuth();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string): Promise<void> => {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase is not available in this build");
    }

    try {
      const auth = firebaseService.getAuth();
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase is not available in this build");
    }

    try {
      const auth = firebaseService.getAuth();
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase is not available in this build");
    }

    try {
      const auth = firebaseService.getAuth();
      await auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (!isFirebaseAvailable) {
      throw new Error("Firebase is not available in this build");
    }

    try {
      const auth = firebaseService.getAuth();
      await auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isFirebaseAvailable,
    firebaseError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
