import { NextApiRequest, NextApiResponse } from "next";
import {
  getUserDataBySub,
  uploadUserToServer,
} from "@/lib/accountServerManager";
import { getSubFromSessionToken } from "@/lib/accountServerManager";
import { rateLimiterMiddleware } from "@/lib/rateLimiter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  if (!(rateLimiterMiddleware(req, res, 10, 60 * 1000))) {
    res
      .status(429)
      .json({
        error: "Too many requests. You can only ban ten users within a minute.",
      });
    return;
  }

  try {
    const { sub } = req.body;
    const tokenUser = getSubFromSessionToken(req);
    if (!tokenUser) {
      throw new Error("No user is performing banning action.");
    }
    const { state: tokenUserState } = (await getUserDataBySub(tokenUser, [
      "state",
    ])) as unknown as { state: UserState };
    if (tokenUserState !== "admin") {
      throw new Error("User is not authorized to ban users.");
    }
    let newUserState: UserState = "normal";

    const {
      state: downloadedUserState,
      name,
      profilePic,
      websiteSettings,
    } = (await getUserDataBySub(sub, [
      "name",
      "profilePic",
      "state",
      "websiteSettings",
    ])) as unknown as UserData;
    if (downloadedUserState === "admin") {
      throw new Error(
        "The user to be banned is an admin, which cannot be banned."
      );
    }
    if (downloadedUserState === "normal") {
      newUserState = "banned";
    }

    const securedUser = {
      name,
      profilePic,
      websiteSettings,
      state: newUserState,
    };

    const result = await uploadUserToServer(securedUser, sub);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
