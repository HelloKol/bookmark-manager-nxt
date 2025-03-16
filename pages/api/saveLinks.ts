// /api/saveLinks.ts

import type { NextApiRequest, NextApiResponse } from "next";
import ogs from "open-graph-scraper";
import { ref, set, push, get } from "firebase/database"; // Realtime Database imports
import { db } from "../../lib/firebase";

// Function to save link data to a specific folder in the database
async function saveLinkToDatabase(
  userId: string,
  folderId: string,
  linkData: any
) {
  if (!folderId) {
    throw new Error("folderId is required to save a link");
  }

  // Ensure the user document exists
  const userRef = ref(db, `users/${userId}`);
  const userSnapshot = await get(userRef);

  if (!userSnapshot.exists()) {
    console.log("User document does not exist. Creating...");
    await set(userRef, { createdAt: new Date().toISOString() });
  }

  // Ensure the folder exists
  const folderRef = ref(db, `users/${userId}/folders/${folderId}`);
  const folderSnapshot = await get(folderRef);

  if (!folderSnapshot.exists()) {
    console.log(`Folder ${folderId} does not exist. Creating...`);
    await set(folderRef, {
      folderName: "Untitled Folder", // Default name, can be updated later
      createdAt: new Date().toISOString(),
    });
  }

  // Add link to the folder's "links" subcollection
  const linksRef = ref(db, `users/${userId}/folders/${folderId}/links`);
  const newLinkRef = push(linksRef); // Generate a unique ID for the link
  await set(newLinkRef, linkData);

  console.log(`Link saved under folder ${folderId} with ID:`, newLinkRef.key);

  return { id: newLinkRef.key, ...linkData };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { url, userId, folderId } = req.body;

  if (!url || !userId || !folderId) {
    return res.status(400).json({ error: "Missing URL, userId, or folderId" });
  }

  // Default link data in case Open Graph fails
  const linkData = {
    requestUrl: url,
    title: "",
    description: "",
    image: "",
    createdAt: new Date().toISOString(),
  };

  try {
    // Fetch Open Graph data
    const options = { url };
    const { error, result } = await ogs(options);

    if (error) {
      console.warn("Open Graph fetch error:", error);
      const savedLink = await saveLinkToDatabase(userId, folderId, linkData);
      return res.status(200).json(savedLink);
    }

    const savedLink = await saveLinkToDatabase(userId, folderId, result);
    return res.status(200).json(savedLink);
  } catch (error) {
    console.error("Error:", error);

    try {
      const savedLink = await saveLinkToDatabase(userId, folderId, linkData);
      return res.status(200).json(savedLink);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ error: "Failed to save link" });
    }
  }
}
