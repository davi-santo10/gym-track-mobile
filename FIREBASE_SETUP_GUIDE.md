# Firebase Setup Guide

This guide will help you fix the Firebase configuration issues in your React Native app.

## Current Issues Identified

1. **Missing Firebase Configuration Files**
2. **Firebase Auth not properly initialized**
3. **Conflicting Firebase dependencies**

## Step-by-Step Setup

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database

### 2. Android Configuration

1. In Firebase Console, add an Android app
2. Use package name: `com.espiritosanto.gymtrackmobile`
3. Download `google-services.json`
4. Replace the template file at `android/app/google-services.json` with the downloaded file

### 3. iOS Configuration (if planning to support iOS)

1. In Firebase Console, add an iOS app
2. Use bundle ID: `com.espiritosanto.gymtrackmobile`
3. Download `GoogleService-Info.plist`
4. Place it in `ios/` folder

### 4. Install Dependencies

```bash
# Remove conflicting dependencies
npm uninstall firebase

# Install only React Native Firebase
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

### 5. Build and Run

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..

# Run the app
npx expo run:android
```

## Verification Steps

After completing the setup, the app should:

- ✅ Initialize Firebase without errors
- ✅ Show authentication screens
- ✅ Allow user registration/login
- ✅ Store data in Firestore

## Common Issues

### "Component auth has not been registered yet"

- Ensure `google-services.json` is in the correct location
- Verify Firebase project has Authentication enabled
- Check that the package name matches

### "No Firebase App '[DEFAULT]' has been created"

- Ensure Firebase is initialized before any Firebase services are used
- Check that the configuration files are valid

### Build Issues

- Clean and rebuild the project
- Ensure all dependencies are properly installed
- Check that the Firebase configuration files are not corrupted

## Testing

Test the following functionality:

1. App starts without Firebase errors
2. User can register with email/password
3. User can login with email/password
4. User can logout
5. User data persists between app sessions

## Need Help?

If you continue to experience issues:

1. Check the console for specific error messages
2. Verify your Firebase project settings
3. Ensure all configuration files are properly formatted
4. Try rebuilding the project from scratch
