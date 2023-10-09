import { NextApiRequest, NextApiResponse } from "next";
import { rateLimiterMiddleware } from "@/lib/rateLimiter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!(await rateLimiterMiddleware(req, res, 100, 60 * 1000))) {
    res.status(429).json({
      error:
        "Too many requests. Rate limit is supposed to allow 100 requests per minute.",
    });
    return;
  }

  try {
    res
      .status(200)
      .json({ ip: req.headers["x-forwarded-for"], raw: JSON.stringify(req) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
