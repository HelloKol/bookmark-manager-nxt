import React, { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import LinkPreviewCard from "../components/LinkPreviewCard";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "@/lib/auth";
import Link from "next/link";
import Greeting from "@/components/Greeting";

interface Preview {
  favicon?: string;
  ogImage?: { url: string }[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl: string;
  ogUrl: string;
}

interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
}

export default function Home() {
  const [urls, setUrls] = useState<string[]>([]); // State to store array of URLs
  const [previews, setPreviews] = useState<Preview[]>([]); // State to store metadata for each link
  const [loading, setLoading] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const [savedLinks, setSavedLinks] = useState<Preview[]>([]); // State to store saved links
  const [user, setUser] = useState<User | null>(null); // Updated to include additional user details

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

  useEffect(() => {
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}/links`);

    // Subscribe to real-time updates
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const links = Object.values(snapshot.val()) as Preview[];
        setSavedLinks(links);
      } else {
        setSavedLinks([]); // Clear saved links if the snapshot is empty
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]); // Re-run effect if the user changes

  const handleFetchMetadata = async () => {
    if (urls.length === 0) return;

    const user = auth.currentUser;
    if (!user) return alert("Not authenticated");

    setLoading(true);
    setPreviews([]); // Clear previous previews

    try {
      const metadataPromises = urls.map(async (url) => {
        // Remove trailing slash from the URL if it exists
        const cleanUrl = url.replace(/\/$/, "");

        const res = await fetch("/api/saveLinks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: cleanUrl, userId: user.uid }), // Send the cleaned URL
        });

        const data = await res.json();
        if (res.ok) {
          return data;
        } else {
          throw new Error(data.error);
        }
      });

      // Wait for all metadata to be fetched
      const metadata = await Promise.all(metadataPromises);
      setPreviews(metadata); // Set the fetched metadata for all links
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle change in textarea (split URLs by newline)
  const handleUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextAreaValue(value);

    const urlsArray = value
      .split("\n") // Split by new lines
      .map((url) => url.trim())
      .filter((url) => url); // Filter out empty URLs
    setUrls(urlsArray);
  };

  // Handle keydown event to detect Enter or Shift + Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      // If Shift is not held, we prevent the default action to avoid new line and fetch metadata
      if (!e.shiftKey) {
        e.preventDefault();
        handleFetchMetadata();
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Link className="block" href="/dashboard">
        Dashboard
      </Link>

      <button onClick={() => logout()} disabled={loading} className="mb-10">
        Logout
      </button>

      <Greeting name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`} />

      <h1>Link Preview App</h1>

      <div style={{ marginBottom: "1rem" }}>
        <textarea
          value={textAreaValue} // Use the local state for textarea value
          onChange={handleUrlsChange}
          onKeyDown={handleKeyDown} // Add keydown event handler
          placeholder="Paste URLs here, one per line"
          className="border border-gray-300 rounded-md bg-zinc-900"
          rows={10}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        />
        <button onClick={handleFetchMetadata} disabled={loading}>
          {loading ? "Loading..." : "Fetch Previews"}
        </button>
      </div>

      {/* Render fetched previews */}
      {previews.length > 0 && (
        <div className="saved-links grid grid-cols-12 gap-4">
          <h2 className="col-span-full">Fetched Previews</h2>
          {previews.map((preview, index) => (
            <LinkPreviewCard key={index} preview={preview} />
          ))}
        </div>
      )}

      {/* Render saved links from the database */}
      {savedLinks.length > 0 && (
        <div className="saved-links grid grid-cols-12 gap-4">
          <h2 className="col-span-full">Saved Links</h2>
          {savedLinks.map((link, index) => (
            <LinkPreviewCard key={index} preview={link} />
          ))}
        </div>
      )}
    </div>
  );
}
