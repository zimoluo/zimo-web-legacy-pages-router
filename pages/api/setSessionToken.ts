import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { jwtKey } from "@/lib/encryptionkey";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const userData: UserData = req.body;

  if (!userData) {
    return res.status(400).json({ error: "No user data provided" });
  }

  const secretKey = jwtKey;

  // Create JWT token
  const token = jwt.sign(userData, secretKey, { expiresIn: "60d" });

  res.setHeader("Set-Cookie", [
    `session_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${new Date(
      Date.now() + 60 * 60 * 24 * 60 * 1000 // 60 days
    ).toUTCString()}`,
  ]);

  res.status(200).json({ success: true });
};
