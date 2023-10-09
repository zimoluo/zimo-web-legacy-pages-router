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

  if (!(await rateLimiterMiddleware(req, res, 10, 60 * 1000))) {
    res
      .status(429)
      .json({
        error:
          "Too many requests. You can only delete ten replies within a minute.",
      });
    return;
  }

  try {
    const { filePath, commentIndex, replyIndex, existingReply } = req.body;

    const regex = /^(blog|photos|projects)\/comments\/[^\/\\:*?"<>|]+$/;
    if (!regex.test(filePath)) {
      res.status(400).json({
        error:
          "Invalid filePath. It should match 'blog/likedBy/{valid-name}', 'photos/likedBy/{valid-name}', or 'projects/likedBy/{valid-name}'.",
      });
      throw new Error("Illegal file path to be uploaded.");
    }
    
    const tokenUserSub = getSubFromSessionToken(req);
    if (tokenUserSub === null) {
      throw new Error("No user is deleting this reply.");
    }

    const downloadedComments = await getComments(filePath);

    const targetComment = downloadedComments[commentIndex];
    if (
      !targetComment ||
      !targetComment.replies ||
      !targetComment.replies[replyIndex]
    ) {
      throw new Error("Reply to be deleted does not exist.");
    }

    const targetReply = targetComment.replies[replyIndex];

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    if (
      targetReply.from !== existingReply.from ||
      targetReply.content !== existingReply.content ||
      targetReply.date !== existingReply.date ||
      (targetReply.to
        ? targetReply.to !== existingReply.to
        : !!existingReply.to) // Check 'to' if it exists
    ) {
      throw new Error(
        "Server reply and client reply do not match. Please refresh the page."
      );
    }

    if (
      targetReply.from !== tokenUserSub &&
      tokenUserState !== "admin" // Ensure that the user is either the author or an admin
    ) {
      throw new Error(
        "User either is not admin or is not deleting their own reply."
      );
    }

    // Remove this specific reply and create a new updatedComment object
    const updatedComment = {
      ...targetComment,
      replies: targetComment.replies.filter((_, i) => i !== replyIndex),
    };

    // Replace the original comment with the updated one in downloadedComments
    const updatedComments = downloadedComments.map((comment, i) =>
      i === commentIndex ? updatedComment : comment
    );

    await uploadCommentsToServer(filePath, updatedComments);
    res.status(200).json({ success: true, updatedComments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
