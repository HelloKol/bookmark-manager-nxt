import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "@/lib/firebase";

interface AppContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  user: User | null;
  userLoading: "loading" | "error" | "success";
}

interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setIsUserLoading] = useState<
    "loading" | "error" | "success"
  >("loading");

  // Listen for authentication state changes
  useEffect(() => {
    setIsUserLoading("loading");

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
              profileImageUrl: userData.profileImageUrl,
            });
          } else {
            // If no additional details are found, set only the basic user info
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            });
          }
        });

        setIsUserLoading("success");
      } else {
        setUser(null); // Clear user state if not authenticated
        setIsUserLoading("success");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{ searchTerm, setSearchTerm, user, userLoading }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
