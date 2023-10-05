import { NextApiRequest, NextApiResponse } from "next";
import { checkIfUserExistsBySub } from "@/lib/accountServerManager";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { sub } = req.body;
    const exists = await checkIfUserExistsBySub(sub);
    res.status(200).json({ exists });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
