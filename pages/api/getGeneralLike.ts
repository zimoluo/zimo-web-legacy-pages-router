import { NextApiRequest, NextApiResponse } from "next";
import { getLikedBy } from "@/lib/accountServerManager";
import { rateLimiterMiddleware } from "@/lib/rateLimiter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimiterMiddleware(req, res, 40, 20 * 1000)) {
    res
      .status(429)
      .json({ error: "Too many requests. Please load again later." });
    return;
  }

  try {
    const { filePath } = req.body;
    const likedBy = await getLikedBy(filePath);
    res.status(200).json({ likedBy });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
