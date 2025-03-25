import type { NextApiRequest, NextApiResponse } from "next";
import ogs from "open-graph-scraper";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

// Function to save link data to a specific folder or as a standalone bookmark
async function saveLinkToDatabase(
  userId: string,
  folderId: string | null, // Allow folderId to be null
  linkData: Record<
    string,
    string | object | number | boolean | undefined | null
  >
) {
  // Ensure the user document exists
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    console.log("User document does not exist. Creating...");
    await setDoc(userDocRef, { createdAt: new Date().toISOString() });
  }

  // Generate a unique ID for the link
  const linkId =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

  if (folderId) {
    // Save to a specific folder
    const foldersDocRef = doc(db, "users", userId, "data", "folders");
    const foldersDoc = await getDoc(foldersDocRef);

    let foldersData = foldersDoc.exists() ? foldersDoc.data() : {};

    // Check if the folder exists, if not create it
    if (!foldersData[folderId]) {
      console.log(`Folder ${folderId} does not exist. Creating...`);
      foldersData = {
        ...foldersData,
        [folderId]: {
          name: "Untitled Folder", // Default name, can be updated later
          slug: "untitled-folder",
          createdAt: new Date().toISOString(),
          links: {},
        },
      };
    }

    // Add link to the folder's links
    const updatedFoldersData = {
      ...foldersData,
      [folderId]: {
        ...foldersData[folderId],
        links: {
          ...(foldersData[folderId].links || {}),
          [linkId]: linkData,
        },
      },
    };

    await setDoc(foldersDocRef, updatedFoldersData);

    console.log(`Link saved under folder ${folderId} with ID:`, linkId);
    return { id: linkId, ...linkData };
  } else {
    // Save as a standalone bookmark
    const bookmarksDocRef = doc(db, "users", userId, "data", "bookmarks");
    const bookmarksDoc = await getDoc(bookmarksDocRef);

    const bookmarksData = bookmarksDoc.exists() ? bookmarksDoc.data() : {};

    // Add bookmark to the bookmarks collection
    const updatedBookmarksData = {
      ...bookmarksData,
      [linkId]: linkData,
    };

    await setDoc(bookmarksDocRef, updatedBookmarksData);

    console.log(`Bookmark saved without folder with ID:`, linkId);
    return { id: linkId, ...linkData };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { url, userId, folderId } = req.body;

  if (!url || !userId) {
    return res.status(400).json({ error: "Missing URL or userId" });
  }

  // Default link data in case Open Graph fails
  const linkData = {
    requestUrl: url,
    url: url, // Add URL field to match Bookmark interface
    title: url, // Default title is the URL
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
      const savedLink = await saveLinkToDatabase(
        userId,
        folderId || null,
        linkData
      );
      return res.status(200).json(savedLink);
    }

    // Prepare the link data with both OG data and required fields
    const enrichedLinkData = {
      ...result,
      requestUrl: url, // Ensure requestUrl field is present
      url: url, // Ensure URL field is present
      title: result.ogTitle || url, // Use OG title or fallback to URL
      createdAt: new Date().toISOString(),
    };

    const savedLink = await saveLinkToDatabase(
      userId,
      folderId || null,
      enrichedLinkData
    );
    return res.status(200).json(savedLink);
  } catch (error) {
    console.error("Error:", error);

    try {
      const savedLink = await saveLinkToDatabase(
        userId,
        folderId || null,
        linkData
      );
      return res.status(200).json(savedLink);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ error: "Failed to save link" });
    }
  }
}
