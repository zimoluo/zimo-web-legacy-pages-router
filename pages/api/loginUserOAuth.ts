import {
  fetchDecodedToken,
  getUserByPayload,
} from "@/lib/accountServerManager";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { jwtKey } from "@/lib/encryptionkey";

type ApiError = {
  error: string;
};

const createSessionToken = (userSubData: string) => {
  const secretKey = jwtKey;

  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is undefined!");
  }

  // Create JWT token
  const token = jwt.sign({ sub: userSubData }, secretKey, { expiresIn: "60d" });

  return token;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccountPayloadData | ApiError>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { idToken, localSettingsData } = req.body;

  try {
    const decodedPayload = await fetchDecodedToken(idToken);

    if (decodedPayload === null) {
      throw new Error("Invalid payload.");
    }

    const fetchedUser = await getUserByPayload(
      decodedPayload,
      localSettingsData
    );

    if (fetchedUser === null) {
      throw new Error("Failed to fetch user.");
    }

    // Create JWT session token using payload.sub
    const sessionToken = createSessionToken(decodedPayload.sub);

    // Optionally, set JWT token as cookie in response headers if you're using cookies
    res.setHeader("Set-Cookie", [
      `session_token=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${new Date(
        Date.now() + 60 * 60 * 24 * 60 * 1000 // 60 days
      ).toUTCString()}`,
    ]);

    res.status(200).json(fetchedUser);
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
