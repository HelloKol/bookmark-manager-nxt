import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../lib/firebase-admin";
import { setCookie } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { idToken } = req.body;

  try {
    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set cookie
    setCookie("session", sessionCookie, {
      req,
      res,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return res.status(500).json({ error: "Failed to create session cookie" });
  }
}
