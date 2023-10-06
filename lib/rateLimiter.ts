import { NextApiRequest, NextApiResponse } from "next";

const requestTimestamps: { [key: string]: number[] } = {};

export const rateLimiterMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  maxRequests: number,
  timeWindowMillis: number
) => {
  const clientIp =
    (Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.headers["x-forwarded-for"]) || req.socket.remoteAddress?.toString();

  if (!clientIp) {
    res.status(500).json({ error: "Unable to determine IP address" });
    return false;
  }

  if (!requestTimestamps[clientIp]) {
    requestTimestamps[clientIp] = [];
  }

  const now = Date.now();
  requestTimestamps[clientIp] = requestTimestamps[clientIp].filter(
    (timestamp) => now - timestamp < timeWindowMillis
  );

  if (requestTimestamps[clientIp].length >= maxRequests) {
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
    return false;
  }

  requestTimestamps[clientIp].push(now);
  return true;
};
