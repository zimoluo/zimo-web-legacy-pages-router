import { NextApiRequest, NextApiResponse } from "next";
import {
  checkIfUserExistsBySub,
  getUserDataBySub,
  getSubFromSessionToken,
  uploadUserToServer,
} from "@/lib/accountServerManager";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { settings, sub } = req.body;
    const tokenUser = getSubFromSessionToken(req);

    if (sub !== tokenUser) {
      throw new Error("User does not match.");
    }

    if (!(await checkIfUserExistsBySub(sub))) {
      throw new Error(
        "User does not exist. First create a user and then update user settings."
      );
    }

    const downloadedUser = (await getUserDataBySub(sub, [
      "name",
      "profilePic",
      "state",
    ])) as unknown as UserData;

    const securedUser = { ...downloadedUser, websiteSettings: settings };

    const result = await uploadUserToServer(securedUser, sub);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
