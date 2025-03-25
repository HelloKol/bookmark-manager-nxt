import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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

  // Store additional user details in Firestore
  const user = userCredential.user;
  await setDoc(doc(db, `users/${user.uid}`), {
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
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please check your credentials.");
  }
};

// export const login = async (email: string, password: string) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const idToken = await userCredential.user.getIdToken();

//     const response = await fetch("/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ idToken }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create session cookie");
//     }

//     return userCredential;
//   } catch (error: any) {
//     console.error("Login error:", error);

//     // You can throw a more specific error for your UI to catch
//     throw new Error(
//       error?.message || "An unexpected error occurred during login"
//     );
//   }
// };

// export const login = async (email: string, password: string) => {
//   const userCredential = await signInWithEmailAndPassword(
//     auth,
//     email,
//     password
//   );
//   const idToken = await userCredential.user.getIdToken();

//   const response = await fetch("/api/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ idToken }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to create session cookie");
//   }

//   return userCredential;
// };

export const logout = async () => {
  try {
    await signOut(auth);

    // Clear session cookie
    await fetch("/api/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout error:", error);
    alert("Logout failed. Please try again.");
  }
};

export const onAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
