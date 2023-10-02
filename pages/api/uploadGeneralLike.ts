import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { promisify } from "util";
import * as zlib from "zlib";

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
    const { filePath, likedBy } = req.body;
    await uploadLikedBy(filePath, likedBy);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

const gzip = promisify(zlib.gzip);

async function uploadLikedBy(filePath: string, likedBy: any): Promise<void> {
  try {
    // Convert likedBy to JSON string and compress it using gzip
    const compressedLikedBy = await gzip(JSON.stringify({ likedBy }));

    const params = {
      Bucket: awsBucket,
      Key: filePath,
      Body: compressedLikedBy, // Upload compressed likedBy
      ContentEncoding: "gzip", // Set ContentEncoding header to indicate that the content is gzip-compressed
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
  } catch (error: any) {
    // Log the error and rethrow
    console.error(`Could not upload likedBy: ${error.message}`);
    throw error;
  }
}
