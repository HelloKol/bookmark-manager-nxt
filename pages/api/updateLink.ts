import type { NextApiRequest, NextApiResponse } from "next";
import ogs from "open-graph-scraper";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, folderId, linkId, requestUrl } = req.body;

  if (!userId || !folderId || !linkId || !requestUrl) {
    return res
      .status(400)
      .json({ error: "Missing userId, folderId, linkId, or requestUrl" });
  }

  // Default link data in case Open Graph fails
  const linkData = {
    requestUrl,
    url: requestUrl, // Add URL field to match Bookmark interface
    title: requestUrl, // Default title is the URL
    description: "",
    image: "",
    updatedAt: new Date().toISOString(),
  };

  try {
    // Get the folders document
    const foldersDocRef = doc(db, "users", userId, "data", "folders");
    const foldersDoc = await getDoc(foldersDocRef);

    if (!foldersDoc.exists()) {
      return res.status(404).json({ error: "Folders document not found" });
    }

    const foldersData = foldersDoc.data();
    const folderData = foldersData[folderId];

    if (!folderData || !folderData.links) {
      return res.status(404).json({ error: "Folder or links not found" });
    }

    const links = folderData.links;

    if (!links[linkId]) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Fetch Open Graph data for the updated URL
    const options = { url: requestUrl };
    const { error, result } = await ogs(options);

    let updatedLink;

    if (error) {
      console.warn("Open Graph fetch error:", error);
      // If Open Graph fails, use the default link data
      updatedLink = linkData;
    } else {
      // Prepare updated link data
      updatedLink = {
        ...result,
        url: requestUrl, // Make sure to store the updated URL in both fields
        requestUrl, // Make sure to store the updated URL
        updatedAt: new Date().toISOString(),
      };
    }

    // Update the link in the folder
    const updatedFoldersData = {
      ...foldersData,
      [folderId]: {
        ...folderData,
        links: {
          ...links,
          [linkId]: updatedLink,
        },
      },
    };

    await setDoc(foldersDocRef, updatedFoldersData);

    return res.status(200).json({ linkId, ...updatedLink });
  } catch (error) {
    console.error("Error updating link:", error);

    // If something goes wrong, try to save the default link data
    try {
      const foldersDocRef = doc(db, "users", userId, "data", "folders");
      const foldersDoc = await getDoc(foldersDocRef);

      if (foldersDoc.exists()) {
        const foldersData = foldersDoc.data();
        const folderData = foldersData[folderId];

        if (folderData && folderData.links) {
          const updatedFoldersData = {
            ...foldersData,
            [folderId]: {
              ...folderData,
              links: {
                ...folderData.links,
                [linkId]: linkData,
              },
            },
          };

          await setDoc(foldersDocRef, updatedFoldersData);
          return res.status(200).json({ linkId, ...linkData });
        }
      }
    } catch (innerError) {
      console.error("Error in fallback update:", innerError);
    }

    return res.status(500).json({ error: "Failed to update link" });
  }
}
