import type { NextApiRequest, NextApiResponse } from "next";
import ogs from "open-graph-scraper";
import { ref, set, push, get } from "firebase/database"; // Realtime Database imports
import { db } from "../../lib/firebase"; // Firestore imports

// Function to save link data to the database
async function saveLinkToDatabase(userId: string, linkData: any) {
  // Ensure the user document exists
  const userRef = ref(db, `users/${userId}`);
  const userSnapshot = await get(userRef);

  if (!userSnapshot.exists()) {
    console.log("User document does not exist. Creating...");
    await set(userRef, { createdAt: new Date().toISOString() });
  }

  // Add link to the user's "links" subcollection
  const linksRef = ref(db, `users/${userId}/links`);
  const newLinkRef = push(linksRef); // Generate a unique ID for the link
  await set(newLinkRef, linkData);

  console.log("Link saved with ID:", newLinkRef.key);

  return { id: newLinkRef.key, ...linkData };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { url, userId } = req.body;

  if (!url || !userId) {
    return res.status(400).json({ error: "Missing URL or userId" });
  }

  // If fetching Open Graph data fails, save the URL with minimal metadata
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
      const savedLink = await saveLinkToDatabase(userId, linkData);
      return res.status(200).json(savedLink);
    }

    // Save link to the database
    const savedLink = await saveLinkToDatabase(userId, result);
    return res.status(200).json(savedLink);
  } catch (error) {
    console.error("Error:", error);

    try {
      const savedLink = await saveLinkToDatabase(userId, linkData);
      return res.status(200).json(savedLink);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ error: "Failed to save link" });
    }
  }
}
