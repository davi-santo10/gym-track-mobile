// React Native Firebase - Development Build Compatible
import firebase from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Firebase configuration - should match your google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyBorhkJuYIHNgT4EcdvYmgLDL2d5z5-zqE",
  authDomain: "gym-track-mobile-19e15.firebaseapp.com",
  projectId: "gym-track-mobile-19e15",
  storageBucket: "gym-track-mobile-19e15.firebasestorage.app",
  messagingSenderId: "1013588999582",
  appId: "1:1013588999582:android:91c82a7b79b80e32d82f18",
  databaseURL: "https://gym-track-mobile-19e15-default-rtdb.firebaseio.com/"
};

// Implement Gemini's singleton pattern
class FirebaseService {
  private static instance: FirebaseService;
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('🔥 Firebase already initialized');
      return;
    }

    if (this.initializationPromise) {
      console.log('🔥 Firebase initialization in progress, waiting...');
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      console.log('🔥 Starting Firebase initialization...');
      
      // Check if Firebase native modules are available
      if (!firebase || !firebase.apps) {
        throw new Error('Firebase native modules not available in this build');
      }

      // Check if default app already exists (singleton pattern)
      if (firebase.apps.length === 0) {
        console.log('🔥 Initializing new Firebase app...');
        await firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase app initialized successfully');
      } else {
        console.log('🔥 Using existing Firebase app');
      }

      // Verify Firebase is working
      const app = firebase.app();
      console.log('🔥 Firebase app name:', app.name);
      console.log('🔥 Firebase project ID:', app.options.projectId);

      this.initialized = true;
      console.log('✅ Firebase initialization complete');

    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      this.initialized = false;
      this.initializationPromise = null;
      throw error;
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getAuth(): FirebaseAuthTypes.Module {
    if (!this.initialized) {
      throw new Error('Firebase not initialized. Call initialize() first.');
    }
    return auth();
  }

  public async checkFirebaseStatus(): Promise<{
    initialized: boolean;
    error?: string;
    appName?: string;
    projectId?: string;
  }> {
    try {
      if (!firebase || !firebase.apps) {
        return {
          initialized: false,
          error: 'Firebase native modules not available'
        };
      }

      if (firebase.apps.length === 0) {
        return {
          initialized: false,
          error: 'No Firebase apps initialized'
        };
      }

      const app = firebase.app();
      return {
        initialized: true,
        appName: app.name,
        projectId: app.options.projectId
      };
    } catch (error) {
      return {
        initialized: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export the singleton instance
export const firebaseService = FirebaseService.getInstance();

// Export auth for convenience, but with proper error handling
export const getFirebaseAuth = (): FirebaseAuthTypes.Module => {
  try {
    return firebaseService.getAuth();
  } catch (error) {
    console.warn('⚠️ Firebase Auth not available:', error);
    throw error;
  }
};

// Export the Firebase app if available
export const getFirebaseApp = () => {
  try {
    if (firebase.apps.length === 0) {
      throw new Error('No Firebase app initialized');
    }
    return firebase.app();
  } catch (error) {
    console.warn('⚠️ Firebase app not available:', error);
    throw error;
  }
};

export default firebaseService;