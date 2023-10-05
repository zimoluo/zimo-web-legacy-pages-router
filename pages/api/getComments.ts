import { NextApiRequest, NextApiResponse } from "next";
import { getComments } from "@/lib/accountServerManager";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { filePath } = req.body;
    const comments = await getComments(filePath);
    res.status(200).json({ comments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
