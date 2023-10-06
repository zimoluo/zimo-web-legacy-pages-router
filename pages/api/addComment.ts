import { NextApiRequest, NextApiResponse } from "next";
import {
  getUserDataBySub,
  getSubFromSessionToken,
  uploadCommentsToServer,
  getComments,
} from "@/lib/accountServerManager";
import { rateLimiterMiddleware } from "@/lib/rateLimiter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  if (!rateLimiterMiddleware(req, res, 10, 60 * 1000)) {
    res.status(429).json({ error: "Too many requests. You can only send ten comments within a minute." });
    return;
  }

  try {
    const { filePath, newComment } = req.body;
    const tokenUserSub = getSubFromSessionToken(req);
    if (tokenUserSub === null) {
      throw new Error("No user is sending this comment.");
    }

    if (newComment.author !== tokenUserSub) {
      throw new Error("User sending comment does not match token.");
    }

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    const downloadedComments = await getComments(filePath);

    const updatedComments = [
      ...downloadedComments,
      newComment,
    ] as CommentEntry[];

    await uploadCommentsToServer(filePath, updatedComments);
    res.status(200).json({ success: true, updatedComments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
