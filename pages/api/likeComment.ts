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

  if (!(await rateLimiterMiddleware(req, res, 40, 60 * 1000))) {
    res.status(429).json({
      error:
        "Too many requests. You can only like forty comments within a minute.",
    });
    return;
  }

  try {
    const { filePath, index, existingComment } = req.body;

    const regex = /^(blog|photos|projects)\/comments\/[^\/\\:*?"<>|]+$/;
    if (!regex.test(filePath)) {
      throw new Error("Illegal file path to be uploaded.");
    }

    const tokenUserSub = getSubFromSessionToken(req);
    if (tokenUserSub === null) {
      throw new Error("No user is liking this comment.");
    }

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    const downloadedComments = await getComments(filePath);

    const targetComment = downloadedComments[index];

    if (!targetComment) {
      throw new Error("Comment to be liked does not exist.");
    }

    if (
      targetComment.author !== existingComment.author ||
      targetComment.content !== existingComment.content ||
      targetComment.date !== existingComment.date
    ) {
      throw new Error(
        "Server comment and client comment do not match. Please refresh the page and try again."
      );
    }

    const updatedComments = downloadedComments!.map((comment, i) => {
      if (i !== index) return comment; // Skip if it's not the comment we want to modify

      if (comment.likedBy.includes(tokenUserSub)) {
        // Return a new comment object with the decryptedSub removed from the likedBy array
        return {
          ...comment,
          likedBy: comment.likedBy.filter((sub) => sub !== tokenUserSub),
        };
      } else {
        // Return a new comment object with the decryptedSub added to the likedBy array
        return {
          ...comment,
          likedBy: [...comment.likedBy, tokenUserSub],
        };
      }
    });

    await uploadCommentsToServer(filePath, updatedComments);
    res.status(200).json({ success: true, updatedComments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
