import { NextApiRequest, NextApiResponse } from "next";
import {
  deleteUserFile,
  getSubFromSessionToken,
  getUserDataBySub,
} from "@/lib/accountServerManager";
import { rateLimiterMiddleware } from "@/lib/rateLimiter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!rateLimiterMiddleware(req, res, 10, 60 * 1000)) {
    res.status(429).json({
      error:
        "Too many requests. You can only have ten user delete requests within a minute.",
    });
    return;
  }

  try {
    const { sub } = req.body;
    const tokenUser = getSubFromSessionToken(req);
    if (sub !== tokenUser) {
      throw new Error("The user to be deleted is not the current user.");
    }

    const { state } = (await getUserDataBySub(sub, ["state"])) as {
      state: UserState;
    };
    if (state === "banned") {
      throw new Error(
        "The user to be deleted is banned. Banned user cannot delete their account by themselves. Please contact admin."
      );
    }

    const result = await deleteUserFile(sub);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
