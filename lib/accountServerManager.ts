import { OAuth2Client } from "google-auth-library";
import { clientId } from "@/lib/googlekey";
import jwt_decode from "jwt-decode";
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import * as zlib from "zlib";
import { promisify } from "util";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";
import { jwtKey } from "@/lib/encryptionkey";

export type AccountPayloadData = {
  name: string;
  profilePic: string;
  sub: string;
};

const ensureSecureDecode =
  process.env.ZIMO_WEB_ENSURE_SECURE_DECODING === "true";

if (!keyId) {
  throw new Error("AWS_KEY_ID is undefined!");
}

if (!secretKey) {
  throw new Error("AWS_SECRET_KEY_ZIMO_WEB is undefined!");
}

const s3 = new S3Client({
  region: awsBucketRegion,
  credentials: {
    accessKeyId: keyId,
    secretAccessKey: secretKey,
  },
});

const gzip = promisify(zlib.gzip);

async function uploadUserToServer(
  user: any,
  sub: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function is not running on server side.");
    }

    // Convert user to JSON string and compress it using gzip
    const directory = "account/users";
    const compressedUser = await gzip(JSON.stringify(user));

    const params = {
      Bucket: awsBucket,
      Key: `${directory}/${sub}.json`,
      Body: compressedUser, // Upload compressed user
      ContentEncoding: "gzip", // Set ContentEncoding header to indicate that the content is gzip-compressed
      ContentType: "application/json",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return { success: true, message: "User data successfully uploaded." };
  } catch (err: any) {
    console.error(`Failed to upload user data. Error: ${err}`);
    return {
      success: false,
      message: `Failed to upload user data. Error: ${err}`,
    };
  }
}

async function checkIfUserExistsBySub(sub: string): Promise<boolean> {
  const directory = "account/users";
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${sub}.json`,
  };

  try {
    if (typeof window !== "undefined") {
      throw new Error("This function is not running on server side.");
    }

    const command = new HeadObjectCommand(params);
    await s3.send(command);
    return true;
  } catch (err: any) {
    if (err.code === "NotFound") {
      return false;
    }
    throw err;
  }
}

export async function getUserDataBySub(
  sub: string,
  fields: string[] = []
): Promise<{ [key: string]: any }> {
  if (typeof window !== "undefined") {
    throw new Error("This function is not running on server side.");
  }

  const directory = "account/users";

  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${sub}.json`,
  };

  const command = new GetObjectCommand(params);
  const s3Object = await s3.send(command);

  if (!s3Object.Body) {
    throw new Error("Failed to fetch entry content from S3");
  }

  let fileContents = "";

  const isGzipped = s3Object.ContentEncoding === "gzip";

  await pipeline(
    s3Object.Body as Readable,
    isGzipped ? zlib.createGunzip() : (source) => source,
    async function* (source) {
      for await (const chunk of source) {
        fileContents += chunk.toString("utf-8");
      }
    }
  );

  const data = JSON.parse(fileContents);

  const items: { [key: string]: any } = {};

  fields.forEach((field) => {
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export async function getComments(filePath: string): Promise<CommentEntry[]> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function is not running on server side.");
    }

    const params = {
      Bucket: awsBucket,
      Key: filePath,
    };

    const command = new GetObjectCommand(params);
    const s3Object = await s3.send(command);

    if (!s3Object.Body) {
      return []; // Return an empty object if the file doesn't exist
    }

    let fileContents = "";

    // Check the ContentEncoding metadata
    const isGzipped = s3Object.ContentEncoding === "gzip";

    await pipeline(
      s3Object.Body as Readable,
      // Apply decompression only if the content is gzip-compressed
      isGzipped ? zlib.createGunzip() : (source) => source,
      async function* (source) {
        for await (const chunk of source) {
          fileContents += chunk.toString("utf-8");
        }
      }
    );

    const data = JSON.parse(fileContents);

    if (typeof data.comments === "undefined") {
      return []; // Return an empty object if the comments field is missing
    }

    return data.comments;
  } catch (error: any) {
    return [];
  }
}

export async function getLikedBy(filePath: string): Promise<string[]> {
  try {
    if (typeof window !== "undefined") {
      throw new Error("This function is not running on server side.");
    }

    const params = {
      Bucket: awsBucket,
      Key: filePath,
    };

    const command = new GetObjectCommand(params);
    const s3Object = await s3.send(command);

    if (!s3Object.Body) {
      return []; // Return an empty object if the file doesn't exist
    }

    let fileContents = "";

    // Check the ContentEncoding metadata
    const isGzipped = s3Object.ContentEncoding === "gzip";

    await pipeline(
      s3Object.Body as Readable,
      // Apply decompression only if the content is gzip-compressed
      isGzipped ? zlib.createGunzip() : (source) => source,
      async function* (source) {
        for await (const chunk of source) {
          fileContents += chunk.toString("utf-8");
        }
      }
    );

    const data = JSON.parse(fileContents);

    if (typeof data.likedBy === "undefined") {
      return []; // Return an empty object if the likedBy field is missing
    }

    return data.likedBy;
  } catch (error: any) {
    return [];
  }
}

export const getSubFromSessionToken = (req: NextApiRequest) => {
  if (typeof window !== "undefined") {
    console.error("This function can only be used by server-side functions.");
    return null;
  }

  const sessionToken = req.cookies.session_token;

  if (!sessionToken) {
    return null;
  }

  const secretKey = jwtKey;

  if (!secretKey) {
    throw new Error("JWT_KEY is undefined!");
  }

  try {
    // Verify and decode the JWT
    const decodedToken = jwt.verify(sessionToken, secretKey);
    return decodedToken.sub as string;
  } catch (error) {
    return null;
  }
};

export async function fetchDecodedToken(
  token: string
): Promise<AccountPayloadData | null> {
  if (typeof window !== "undefined") {
    console.error("This function can only be used by server-side functions.");
    return null;
  }

  if (!token) {
    console.error("Token is missing");
    return null;
  }

  try {
    let payload;
    if (ensureSecureDecode) {
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } else {
      payload = jwt_decode(token) as any;
    }

    if (!payload) {
      throw new Error("Failed to verify token.");
    }

    const fetchedName = payload.name || "Anonymous";
    const fetchedPicture = payload.picture || "/favicon.svg";

    const securePayload: AccountPayloadData = {
      name: fetchedName,
      profilePic: fetchedPicture,
      sub: payload.sub,
    };

    return securePayload;
  } catch (error) {
    console.error("Error fetching decoded token:", error);
    return null;
  }
}

export async function getUserByPayload(
  payload: AccountPayloadData,
  localSettingsData: SettingsState
) {
  if (typeof window !== "undefined") {
    console.error("This function can only be used by server-side functions.");
    return null;
  }

  let profilePic = payload.profilePic;
  let userName = payload.name;
  let userState = "normal";
  const userSub = payload.sub;
  let userSettings = localSettingsData.syncSettings ? localSettingsData : null;

  if (!(await fetchCheckIfUserExistsBySub(userSub))) {
    // Creating account data on server. Respects syncSettings option.
    const user = {
      profilePic: profilePic,
      name: userName,
      state: userState,
      websiteSettings: userSettings,
    } as unknown as UserData;
    await fetchUploadUserToServer(user, userSub);
  } else {
    // Downloading data from the server. Respects syncSettings option.
    const downloadedUser = await fetchUserDataBySubServerSide(userSub, [
      "name",
      "profilePic",
      "state",
      "websiteSettings",
    ]);

    if (downloadedUser === null) {
      console.error("Failed to download user data.");
      return null;
    }

    userName = downloadedUser.name;
    profilePic = downloadedUser.profilePic;
    userState = downloadedUser.state as UserState;
    userSettings = localSettingsData.syncSettings
      ? downloadedUser.websiteSettings
      : null;
  }

  const fetchedUser = {
    name: userName,
    profilePic: profilePic,
    sub: userSub,
    state: userState,
    websiteSettings: userSettings,
  } as UserData;

  return fetchedUser;
}

export async function fetchCheckIfUserExistsBySub(sub: string) {
  if (typeof window !== "undefined") {
    console.error("This function can only be used by server-side functions.");
    return null;
  }

  try {
    return await checkIfUserExistsBySub(sub);
  } catch (error: any) {
    console.error("Error checking if user exists:", error);
    return null;
  }
}

export async function fetchUploadUserToServer(
  user: Omit<UserData, "sub">,
  sub: string
) {
  if (typeof window !== "undefined") {
    console.error("This function can only be used by server-side functions.");
    return null;
  }

  try {
    // Call the logic to upload data to S3 directly instead of through the API
    const result = await uploadUserToServer(user, sub);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result;
  } catch (error) {
    console.error("Error uploading user data:", error);
    return null;
  }
}

export async function fetchUserDataBySubServerSide(
  sub: string,
  fields: string[]
) {
  if (typeof window !== "undefined") {
    console.error("This function can only be used by server-side functions.");
    return null;
  }

  try {
    const data = await getUserDataBySub(sub, fields);
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function fetchCommentsServerSide(
  filePath: string
): Promise<CommentEntry[] | null> {
  if (typeof window !== "undefined") {
    console.error("This function can only be used by server-side functions.");
    return null;
  }

  try {
    const comments = await getComments(filePath);
    return comments || []; // Return the comments or an empty array if comments are undefined
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return []; // Return an empty array if any error occurs
  }
}

export async function fetchGeneralLikeServerSide(
  filePath: string
): Promise<string[] | null> {
  if (typeof window !== "undefined") {
    console.error("This function can only be used by server-side functions.");
    return null;
  }

  try {
    const likedBy = await getLikedBy(filePath);
    return likedBy || []; // Return the likedBy or an empty array if likedBy is undefined
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return []; // Return an empty array if any error occurs
  }
}
