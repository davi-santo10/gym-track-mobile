# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `gym-tracker-mobile`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Add Web App to Firebase Project

1. In your Firebase project dashboard, click the web icon (`</>`)
2. Enter app nickname: `Gym Tracker Mobile`
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Configure Firebase in Your App

1. Open `config/firebase.ts` in your project
2. Replace the placeholder values with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
};
```

## Step 4: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Get started"
2. Go to "Sign-in method" tab
3. Enable these providers:
   - **Email/Password**: Click and enable
   - **Google** (optional): Enable and configure
   - **Apple** (for iOS): Enable and configure

## Step 5: Set Up Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location close to your users
4. Click "Done"

## Step 6: Configure Firestore Security Rules

Replace the default rules with these (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow read access to public data (if any)
    match /{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

## Step 7: Set Up Firebase Storage

1. Go to "Storage" → "Get started"
2. Start in test mode
3. Choose same location as Firestore
4. Click "Done"

## Step 8: Configure Storage Security Rules

Replace default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile pictures
    match /profile-pictures/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 9: Test Your Setup

1. Start your app: `npx expo start`
2. Try creating a new account
3. Check Firebase Console to see if:
   - User appears in Authentication
   - User document created in Firestore
   - Profile picture uploads to Storage (if you test that feature)

## Step 10: Production Setup (Later)

When ready for production:

1. **Firestore Rules**: Make them more restrictive
2. **Storage Rules**: Add file size limits and type validation
3. **Authentication**: Configure proper OAuth for Google/Apple
4. **Billing**: Set up Firebase billing plan
5. **Security**: Review all security rules

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized"**

   - Check that your config values are correct
   - Ensure no placeholder values remain

2. **"Permission denied"**

   - Check Firestore security rules
   - Ensure user is authenticated

3. **"Network error"**

   - Check internet connection
   - Verify Firebase project is active

4. **Image upload fails**
   - Check Storage security rules
   - Verify Storage is enabled

### Debug Tips:

1. Check browser console for detailed error messages
2. Monitor Firebase Console for real-time activity
3. Use Firebase Auth state listener to debug auth flow
4. Test with Firebase Emulator Suite for local development

## Next Steps

Once Firebase is set up, you can:

1. **Test Authentication**: Try login/signup flows
2. **Test Profile Management**: Upload profile pictures
3. **Data Migration**: Move existing local data to Firestore
4. **Sync Implementation**: Add real-time data synchronization
5. **Offline Support**: Implement offline-first data handling

---

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs) or create an issue in your project repository.
