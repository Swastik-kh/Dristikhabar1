import { initializeApp, FirebaseApp, getApps } from "firebase/app";
import { getFirestore, Firestore, initializeFirestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// User-provided Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: 'AIzaSyBFrJOmRsuP7WwSb1oD1fYSYvBcDJVSNfQ',
  authDomain: 'dristi-khabar.firebaseapp.com',
  projectId: 'dristi-khabar',
  storageBucket: 'dristi-khabar.firebasestorage.app',
  messagingSenderId: '905774533816',
  appId: '1:905774533816:web:bfaf49a1b3bf744f88384d',
  measurementId: 'G-HXFJ86GGXH'
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let analytics: Analytics | undefined;

try {
  // Check if Firebase app is already initialized to prevent errors in development (StrictMode/HMR)
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // Use initializeFirestore to set experimentalForceLongPolling to true
    // This helps avoid "transport errored" warnings by using a more stable (though slightly slower) connection method
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
    console.log("Firebase app initialized successfully with stable connection settings.");
  } else {
    // If already initialized, get the existing app instance
    app = getApps()[0];
    db = getFirestore(app);
    console.log("Firebase app already initialized, reusing existing instance.");
  }
  
  // Only initialize analytics if measurementId is provided and appears valid
  if (firebaseConfig.measurementId && firebaseConfig.measurementId.startsWith('G-')) {
    analytics = getAnalytics(app); 
    console.log("Firebase Analytics initialized successfully.");
  } else {
    console.warn("Firebase Analytics not initialized: Invalid or missing 'measurementId'.");
  }
  console.log("Firestore initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

export { db, analytics };