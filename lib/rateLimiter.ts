import { NextApiRequest, NextApiResponse } from "next";

const requestTimestamps: { [key: string]: number[] } = {};

export const rateLimiterMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  maxRequests: number,
  timeWindowMillis: number
) => {
  const clientIp =
    (Array.isArray(req.headers["cf-connecting-ip"])
      ? req.headers["cf-connecting-ip"][0]
      : req.headers["cf-connecting-ip"]) ||
    (Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"]) ||
    req.socket.remoteAddress?.toString();

  if (!clientIp) {
    res.status(500).json({ error: "Unable to determine IP address" });
    return false;
  }

  if (typeof window !== "undefined") {
    res
      .status(500)
      .json({ error: "This function can only run on server side." });
    return false;
  }

  const key = `${req.url}-${clientIp}`;
  const now = Date.now();

  // Use local in-memory storage
  if (!requestTimestamps[key]) {
    requestTimestamps[key] = [];
  }

  requestTimestamps[key] = requestTimestamps[key].filter(
    (timestamp) => now - timestamp < timeWindowMillis
  );

  if (requestTimestamps[key].length >= maxRequests) {
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
    return false;
  }

  requestTimestamps[key].push(now);

  return true;
};
