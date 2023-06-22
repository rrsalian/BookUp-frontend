// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAojJ6BE6gL6i34puKfrrf_s918JAzszZs",
  authDomain: "bookup-4c4c7.firebaseapp.com",
  projectId: "bookup-4c4c7",
  storageBucket: "bookup-4c4c7.appspot.com",
  messagingSenderId: "206732083356",
  appId: "1:206732083356:web:6ca67679167902860aed59"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const authProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User> {
   let res = await signInWithPopup(auth, authProvider);
   return res.user
}

export function signOut(): void {
    auth.signOut();
}

