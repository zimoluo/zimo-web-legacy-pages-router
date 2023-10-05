import { NextApiRequest, NextApiResponse } from "next";
import {
  getUserDataBySub,
  getSubFromSessionToken,
  uploadCommentsToServer,
  getComments,
} from "@/lib/accountServerManager";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  try {
    const { filePath, index, existingComment } = req.body;
    const tokenUserSub = getSubFromSessionToken(req);
    if (tokenUserSub === null) {
      throw new Error("No user is deleting this comment.");
    }

    const downloadedComments = await getComments(filePath);

    const targetComment = downloadedComments[index];
    if (!targetComment) {
      throw new Error('Comment to be deleted does not exist.')
    };

    const { state: tokenUserState } = (await getUserDataBySub(tokenUserSub, [
      "state",
    ])) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    if (
      targetComment.author !== existingComment.author ||
      targetComment.content !== existingComment.content ||
      targetComment.date !== existingComment.date
    ) {
      throw new Error("Server comment and client comment do not match. Please refresh the page and try again.");
    }

    if (targetComment.author !== tokenUserSub && tokenUserState !== 'admin') {
      throw new Error("User either is not admin or is not deleting their own comment.");
    }

    const updatedComments = downloadedComments.filter((_, i) => i !== index) as CommentEntry[];

    await uploadCommentsToServer(filePath, updatedComments);
    res.status(200).json({ success: true, updatedComments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
