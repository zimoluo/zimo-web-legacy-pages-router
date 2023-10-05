import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { promisify } from "util";
import * as zlib from "zlib";
import {
  getLikedBy,
  getUserDataBySub,
  getSubFromSessionToken,
} from "@/lib/accountServerManager";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { filePath } = req.body;
    const updatedLikedBy = await uploadLikedBy(filePath, req);
    res.status(200).json(updatedLikedBy);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

const gzip = promisify(zlib.gzip);

async function uploadLikedBy(
  filePath: string,
  req: NextApiRequest
): Promise<string[]> {
  try {
    const downloadedLikedBy = await getLikedBy(filePath);
    const tokenUserSub = getSubFromSessionToken(req);

    if (tokenUserSub === null) {
      throw new Error("No user is making the like.");
    }

    const { state: tokenUserState } = (await getUserDataBySub(
      tokenUserSub,
      ["state"]
    )) as unknown as { state: UserState };

    if (tokenUserState === "banned") {
      throw new Error("User is banned.");
    }

    if (downloadedLikedBy === null) {
      throw new Error("Could not fetch likedBy data.");
    }

    let updatedLikedBy = downloadedLikedBy;

    if (downloadedLikedBy.includes(tokenUserSub)) {
      // Return a new comment object with the userSub removed from the likedBy array
      updatedLikedBy = downloadedLikedBy.filter((sub) => sub != tokenUserSub);
    } else {
      // Return a new comment object with the userSub added to the likedBy array
      updatedLikedBy = [...downloadedLikedBy, tokenUserSub];
    }

    // Convert likedBy to JSON string and compress it using gzip
    const compressedLikedBy = await gzip(
      JSON.stringify({ likedBy: updatedLikedBy })
    );

    const params = {
      Bucket: awsBucket,
      Key: filePath,
      Body: compressedLikedBy, // Upload compressed likedBy
      ContentEncoding: "gzip", // Set ContentEncoding header to indicate that the content is gzip-compressed
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return updatedLikedBy;
  } catch (error: any) {
    // Log the error and rethrow
    console.error(`Could not upload likedBy: ${error.message}`);
    throw error;
  }
}
