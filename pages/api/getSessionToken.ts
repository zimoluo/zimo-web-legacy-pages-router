import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { jwtKey } from "@/lib/encryptionkey";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).end(); // Method Not Allowed
  }

  const sessionToken = req.cookies.session_token;

  if (!sessionToken) {
    return res.status(200).json({ exists: false });
  }

  const secretKey = jwtKey;

  try {
    // Verify and decode the JWT
    const decodedToken = jwt.verify(sessionToken, secretKey);

    return res.status(200).json({ exists: true, sessionToken: decodedToken });
  } catch (error) {
    return res.status(401).json({ exists: false, error: "Invalid token" });
  }
};
