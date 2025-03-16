import type { NextApiRequest, NextApiResponse } from "next";
import ogs from "open-graph-scraper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const options = { url };
    const { error, result } = await ogs(options);

    if (error) {
      return res.status(500).json({ error: "Failed to fetch metadata" });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
