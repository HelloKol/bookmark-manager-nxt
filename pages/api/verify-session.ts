import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../lib/firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await auth.verifySessionCookie(sessionCookie);
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
