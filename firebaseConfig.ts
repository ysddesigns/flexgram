// Import the functions you need from the SDKs you need
import AsyncStorage, {
  AsyncStorageStatic,
} from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVSWkmttGwobBLVlqn-GCfNZWamWprUJU",
  authDomain: "maijchat-8f3f9.firebaseapp.com",
  projectId: "maijchat-8f3f9",
  storageBucket: "maijchat-8f3f9.firebasestorage.app",
  messagingSenderId: "256038902377",
  appId: "1:256038902377:web:506dfeffa9d28c6f0320f8",
  measurementId: "G-V8K8YHL5R8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
auth.useDeviceLanguage(); //use device language else set auth.languageCode = "language_code"
export { auth, signInWithPhoneNumber, RecaptchaVerifier };

export const db = getFirestore(app);
