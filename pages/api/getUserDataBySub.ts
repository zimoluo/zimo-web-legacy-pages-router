import { NextApiRequest, NextApiResponse } from "next";
import { getUserDataBySub } from "@/lib/accountServerManager";
import { rateLimiterMiddleware } from "@/lib/rateLimiter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimiterMiddleware(req, res, 200, 60 * 1000)) {
    res
      .status(429)
      .json({ error: "Too many requests. Please load again later." });
    return;
  }

  try {
    const { sub, fields } = req.body;
    const data = await getUserDataBySub(sub, fields);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
