// Firebase initialization (used for social sign-in)
// IMPORTANT: Replace these placeholder values with your Firebase project's config
// (found in Project settings > General in the Firebase console).
const firebaseConfig = {
  apiKey: "REPLACE_ME_API_KEY",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME_PROJECT_ID",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME_SENDER_ID",
  appId: "REPLACE_ME_APP_ID",
};

// Expose initialization status to the app for feature gating
window.firebaseInitialized = false;
window.firebaseAvailable = false;

try {
  if (!window.firebase) {
    console.warn('Firebase SDK not found. Ensure firebase-app-compat.js is included before this file.');
  }
  if (window.firebase && firebase.initializeApp) {
    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
    }
    window.firebaseInitialized = true;
    try {
      window.firebaseAuth = firebase.auth();
      window.firebaseAvailable = !!window.firebaseAuth;
      console.log('Firebase initialized and Auth is available.');
    } catch (err) {
      console.warn('Firebase initialized but auth is not available:', err);
      window.firebaseAvailable = false;
    }
  }
} catch (err) {
  console.warn('Firebase init error:', err);
}

// Helpful console hint for developers
if (!window.firebaseInitialized) {
  console.info('Firebase is not initialized. To enable social auth, open static/JS/firebase-init.js and paste your Firebase config.');
} else if (!window.firebaseAvailable) {
  console.info('Firebase initialized but Auth is not available. Check your Firebase scripts and that you included firebase-auth-compat.js');
} else {
  console.info('Firebase is ready for social sign-in. Remember to enable Google and GitHub providers and add your site to Authorized domains in Firebase Console.');
}