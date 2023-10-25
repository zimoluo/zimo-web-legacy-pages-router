import { fetchUploadSettingsToServer } from "@/lib/accountClientManager";
import {
  checkIfUserExistsBySub,
  getUserDataBySub,
  getSubFromSessionToken,
} from "@/lib/accountServerManager";
import { rateLimiterMiddleware } from "@/lib/rateLimiter";
import { NextApiRequest, NextApiResponse } from "next";

type ApiError = {
  error: string;
};

type ApiSuccessResponse = {
  integratedUser?: UserData;
  downloadedSettings?: SettingsState | null;
  exists: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccessResponse | ApiError>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  if (!rateLimiterMiddleware(req, res, 40, 60 * 1000)) {
    res.status(429).json({
      error:
        "Too many requests. You can only restore session forty times within a minute.",
    });
    return;
  }

  const { localSettings } = req.body;

  try {
    const sub = getSubFromSessionToken(req);
    if (sub === null) {
      return res.status(200).json({ exists: false });
    }

    if (!checkIfUserExistsBySub(sub)) {
      return res.status(404).json({ error: "User not found" });
    }

    let downloadedUser = (await getUserDataBySub(sub, [
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

    res.status(200).json({ integratedUser, downloadedSettings, exists: true });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
