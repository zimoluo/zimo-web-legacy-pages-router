import { fetchUploadSettingsToServer } from "@/lib/accountClientManager";
import {
  fetchCheckIfUserExistsBySub,
  fetchUserDataBySubServerSide,
  getSubFromSessionToken,
} from "@/lib/accountServerManager";
import { NextApiRequest, NextApiResponse } from "next";

type ApiError = {
  error: string;
};

type ApiSuccessResponse = {
  integratedUser: UserData;
  downloadedSettings: SettingsState | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccessResponse | ApiError>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { localSettings } = req.body;

  try {
    const sub = getSubFromSessionToken(req);
    if (sub === null) {
      return res.status(400).json({ error: "Invalid session token" });
    }

    if (!fetchCheckIfUserExistsBySub(sub)) {
      return res.status(404).json({ error: "User not found" });
    }

    let downloadedUser = (await fetchUserDataBySubServerSide(sub, [
      "name",
      "profilePic",
      "state",
      "websiteSettings",
    ])) as unknown as UserData;

    if (downloadedUser === null) {
      throw new Error("Failed to download user.");
    }

    let downloadedSettings = null;

    if (localSettings.syncSettings) {
      if (downloadedUser.websiteSettings === null) {
        downloadedUser = { ...downloadedUser, websiteSettings: localSettings };
        await fetchUploadSettingsToServer(sub, localSettings);
      } else {
        downloadedSettings = downloadedUser.websiteSettings;
      }
    }

    const integratedUser = { ...downloadedUser, sub };

    res.status(200).json({ integratedUser, downloadedSettings });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
