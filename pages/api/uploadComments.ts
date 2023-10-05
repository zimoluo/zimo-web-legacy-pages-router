import { NextApiRequest, NextApiResponse } from "next";
import { uploadCommentsToServer } from "@/lib/accountServerManager";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { filePath, comments } = req.body;
    await uploadCommentsToServer(filePath, comments);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
