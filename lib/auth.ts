import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export const signup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  // Create user with email and password
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Store additional user details in Realtime Database
  const user = userCredential.user;
  await set(ref(db, `users/${user.uid}`), {
    firstName,
    lastName,
    email,
  });

  return userCredential;
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    // Set session cookie
    await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    // Redirect to dashboard
    // router.push("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please check your credentials.");
  }
};

export const logout = async () => {
  try {
    await signOut(auth);

    // Clear session cookie
    await fetch("/api/logout", {
      method: "POST",
    });

    // Redirect to login
    // router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
    alert("Logout failed. Please try again.");
  }
};

import { User } from "firebase/auth";
import { ref, set } from "firebase/database";

export const onAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
