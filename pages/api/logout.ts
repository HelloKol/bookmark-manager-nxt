import { NextApiRequest, NextApiResponse } from "next";
import { deleteCookie } from "cookies-next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  // Clear session cookie
  deleteCookie("session", { req, res });

  return res.status(200).json({ success: true });
}
