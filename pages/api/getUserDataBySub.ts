import { NextApiRequest, NextApiResponse } from "next";
import { getUserDataBySub } from "@/lib/accountServerManager";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { sub, fields } = req.body;
    const data = await getUserDataBySub(sub, fields);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
