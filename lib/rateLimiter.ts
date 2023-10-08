import { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";

const redisPort = process.env.ZIMO_WEB_REDIS_PORT;
const redisHost = process.env.ZIMO_WEB_REDIS_HOST;
const redisPassword = process.env.ZIMO_WEB_REDIS_PASSWORD;

if (!redisPort) {
  throw new Error("Redis port does not exist.");
}

const numberPort = parseInt(redisPort);

const redis = new Redis({
  port: numberPort,
  host: redisHost,
  username: "default",
  password: redisPassword,
  db: 0,
});

export const rateLimiterMiddleware = async (
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

  const key = `${req.url}-${clientIp}`;
  const now = Date.now();

  // Retrieve request timestamps from Redis and parse them.
  const timestampsJson = await redis.get(key);
  console.log(key, timestampsJson);
  let requestTimestamps: number[] = timestampsJson
    ? JSON.parse(timestampsJson)
    : [];

  // Filter out outdated timestamps.
  requestTimestamps = requestTimestamps.filter(
    (timestamp) => now - timestamp < timeWindowMillis
  );

  if (requestTimestamps.length >= maxRequests) {
    res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
    return false;
  }

  // Push the new timestamp and save back to Redis with an expiration time.
  requestTimestamps.push(now);
  await redis.set(
    key,
    JSON.stringify(requestTimestamps),
    "PX",
    timeWindowMillis
  );
  return true;
};
