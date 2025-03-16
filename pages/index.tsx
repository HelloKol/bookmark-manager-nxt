import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import Bookmarks from "@/components/Bookmarks";
import Greeting from "@/components/Greeting";
import SearchbarHeader from "@/components/SearchbarHeader";
import { auth, db } from "@/lib/firebase";

interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user details from Realtime Database
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
            });
          } else {
            // If no additional details are found, set only the basic user info
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            });
          }
        });
      } else {
        setUser(null); // Clear user state if not authenticated
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <SearchbarHeader loading={loading} />
      <Greeting name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`} />
      <Bookmarks user={user} loading={loading} setLoading={setLoading} />
    </div>
  );
}
