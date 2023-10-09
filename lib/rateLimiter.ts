import { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";

// Configurations for Redis
const redisPort = process.env.ZIMO_WEB_REDIS_PORT;
const redisHost = process.env.ZIMO_WEB_REDIS_HOST;
const redisPassword = process.env.ZIMO_WEB_REDIS_PASSWORD;

// LOCAL_MODE: true to use local in-memory storage, false to use Redis
const LOCAL_MODE = false;

// Local storage for timestamps when LOCAL_MODE is true
const requestTimestamps: { [key: string]: number[] } = {};

// Initialize Redis when LOCAL_MODE is false
let redis: Redis | null = null;
if (!LOCAL_MODE) {
  if (!redisPort) {
    throw new Error("Redis port does not exist.");
  }

  const numberPort = parseInt(redisPort);

  redis = new Redis({
    port: numberPort,
    host: redisHost,
    username: "default",
    password: redisPassword,
    db: 0,
  });
}

export const rateLimiterMiddleware = async (
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

  let requestTimestampsLocal: number[] = [];

  if (LOCAL_MODE) {
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
  } else {
    // Use Redis
    if (!redis) throw new Error("Redis client is not initialized");

    const timestampsJson = await redis.get(key);
    requestTimestampsLocal = timestampsJson ? JSON.parse(timestampsJson) : [];

    requestTimestampsLocal = requestTimestampsLocal.filter(
      (timestamp) => now - timestamp < timeWindowMillis
    );

    if (requestTimestampsLocal.length >= maxRequests) {
      res
        .status(429)
        .json({ error: "Too many requests, please try again later." });
      return false;
    }

    requestTimestampsLocal.push(now);
    await redis.set(
      key,
      JSON.stringify(requestTimestampsLocal),
      "PX",
      timeWindowMillis
    );
  }

  return true;
};
