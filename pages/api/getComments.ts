import { NextApiRequest, NextApiResponse } from "next";
import { getComments } from "@/lib/accountServerManager";
import { rateLimiterMiddleware } from "@/lib/rateLimiter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await rateLimiterMiddleware(req, res, 30, 20 * 1000))) {
    res
      .status(429)
      .json({ error: "Too many requests. Please load again later." });
    return;
  }

  try {
    const { filePath } = req.body;
    const comments = await getComments(filePath);
    res.status(200).json({ comments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
