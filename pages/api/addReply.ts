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
  if (!rateLimiterMiddleware(req, res, 10, 60 * 1000)) {
    res.status(429).json({
      error:
        "Too many requests. You can only send ten replies within a minute.",
    });
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const { filePath, newReply, commentIndex } = req.body;

    const regex =
      /^(blog|photos|projects)\/comments\/[^\/\\:*?"<>|]+\.json$|^about\/homepage\/messages\.json$/;

    if (!regex.test(filePath)) {
      throw new Error("Illegal file path to be uploaded.");
    }

    const tokenUserSub = getSubFromSessionToken(req);
    if (tokenUserSub === null) {
      throw new Error("No user is sending this reply.");
    }

    if (newReply.from !== tokenUserSub) {
      throw new Error("User sending comment does not match token.");
    }

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    const downloadedComments = await getComments(filePath);

    const updatedComments = downloadedComments.map((comment, i) => {
      if (i !== commentIndex) return comment; // Skip if it's not the comment we want to modify

      // Initialize replies array if it does not exist
      const replies = comment.replies || [];

      // Return a new comment object with the new reply appended to the replies array
      return {
        ...comment,
        replies: [...replies, newReply],
      };
    });

    await uploadCommentsToServer(filePath, updatedComments);
    res.status(200).json({ success: true, updatedComments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
