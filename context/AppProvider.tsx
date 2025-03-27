import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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

  useEffect(() => {
    setIsUserLoading("loading");

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, `users/${firebaseUser.uid}`);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              profileImageUrl: userData.profileImageUrl || "",
            });
          } else {
            // If user document doesn't exist, just store basic auth data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            });
          }

          setIsUserLoading("success");
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsUserLoading("error");
        }
      } else {
        setUser(null);
        setIsUserLoading("success");
      }
    });

    return () => unsubscribeAuth();
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
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
