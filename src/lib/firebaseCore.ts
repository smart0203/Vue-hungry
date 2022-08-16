import { ref } from "@vue/composition-api";
import { initializeApp, FirebaseApp } from "firebase/app";
const firebaseAPIKey = process.env.VUE_APP_FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.VUE_APP_FIREBASE_AUTH_DOMAIN;
const firebaseDatabaseURL = process.env.VUE_APP_FIREBASE_DATABASE_URL;
const firebaseDataStorageBucket = process.env.VUE_APP_FIREBASE_STORAGE_BUCKET;
const firebaseAppId = process.env.VUE_APP_FIREBASE_APP_ID;
const firebaseAppProjectId = process.env.VUE_APP_FIREBASE_PROJECT_ID;

const firebaseInstance = ref<FirebaseApp | null>(null);

function initFirebase() {
  if (firebaseInstance.value !== null) {
    return;
  }
  const firebaseConfig = {
    apiKey: firebaseAPIKey,
    authDomain: firebaseAuthDomain,
    databaseURL: firebaseDatabaseURL,
    storageBucket: firebaseDataStorageBucket,
    appId: firebaseAppId,
    projectId: firebaseAppProjectId,
  };

  // Initialize Firebase
  firebaseInstance.value = initializeApp(firebaseConfig);
}

export { initFirebase, firebaseInstance };
