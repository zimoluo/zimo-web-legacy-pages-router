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

  if (typeof window !== "undefined") {
    res
      .status(500)
      .json({ error: "This function can only run on server side." });
    return false;
  }

  // Use this version for api-blind tracking.
  // const key = `${clientIp}`;
  // Alternatively, use a global key that will affect every ip in the world.
  // const key = 'globalKeyLockDown'
  const key = `${req.url}-${clientIp}`;

  if (!requestTimestamps[key]) {
    requestTimestamps[key] = [];
  }

  const now = Date.now();
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
  console.log(requestTimestamps);
  return true;
};
