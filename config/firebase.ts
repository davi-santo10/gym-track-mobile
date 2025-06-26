// Import React Native Firebase - Using the native SDKs for better performance
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Initialize Firebase if not already initialized
let app;
try {
  // Try to get existing app
  app = firebase.app();
} catch (error) {
  // If no app exists, the native initialization will handle it
  // For React Native Firebase, the default app is automatically initialized
  // by the native SDKs using google-services.json and GoogleService-Info.plist
  console.log('Firebase app will be initialized by native SDKs');
}

// Ensure Firebase is properly initialized before exporting services
const initializeFirebaseServices = () => {
  try {
    // Test if Firebase is properly configured
    const currentApp = firebase.app();
    console.log('Firebase initialized successfully:', currentApp.name);
    return { auth: auth(), firestore: firestore() };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error('Firebase configuration is incomplete. Please ensure google-services.json (Android) and GoogleService-Info.plist (iOS) are properly configured.');
  }
};

// Export services with initialization check
export const firebaseServices = initializeFirebaseServices();
export { auth, firestore };
export default firebase.app();