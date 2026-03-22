// src/firebase.ts
import { initializeApp, FirebaseApp, getApps } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
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

// User-provided Firebase configuration, hardcoded for AI Studio preview.
// In a real production environment, these should ideally come from environment variables.
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
let analytics: Analytics | undefined; // analytics can be undefined if not initialized

try {
  // Check if Firebase app is already initialized to prevent errors in development (StrictMode/HMR)
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully.");
  } else {
    // If already initialized, get the existing app instance
    app = getApps()[0];
    console.log("Firebase app already initialized, reusing existing instance.");
  }
  
  db = getFirestore(app);
  
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
  alert("Firebase प्रारम्भ गर्न असफल भयो। कृपया आफ्नो Firebase कन्फिगरेसन जाँच गर्नुहोस्।");
  // Re-throw to halt app if Firebase is essential and failed to initialize
  throw error; 
}

export { db, analytics };