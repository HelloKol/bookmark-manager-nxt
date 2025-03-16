import type { NextApiRequest, NextApiResponse } from "next";
import ogs from "open-graph-scraper";
import { ref, update, remove } from "firebase/database";
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
    title: "",
    description: "",
    image: "",
    updatedAt: new Date().toISOString(),
  };

  try {
    // Remove the existing link data
    const linkRef = ref(
      db,
      `users/${userId}/folders/${folderId}/links/${linkId}`
    );
    await remove(linkRef);

    // Fetch Open Graph data for the updated URL
    const options = { url: requestUrl };
    const { error, result } = await ogs(options);

    if (error) {
      console.warn("Open Graph fetch error:", error);
      // If Open Graph fails, save the default link data
      await update(linkRef, linkData);
      return res.status(200).json({ linkId, ...linkData });
    }

    // Prepare updated link data
    const updatedLink = {
      ...result,
      requestUrl, // Make sure to store the updated URL
      updatedAt: new Date().toISOString(),
    };

    // Add the updated link data
    await update(linkRef, updatedLink);

    return res.status(200).json({ linkId, ...updatedLink });
  } catch (error) {
    console.error("Error updating link:", error);

    // If something goes wrong, save the default link data
    const linkRef = ref(
      db,
      `users/${userId}/folders/${folderId}/links/${linkId}`
    );
    await update(linkRef, linkData);

    return res.status(200).json({ linkId, ...linkData });
  }
}
