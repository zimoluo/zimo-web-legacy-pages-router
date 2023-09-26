import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { promisify } from "util";
import * as zlib from "zlib";

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
    const { filePath, comments } = req.body;
    await uploadComments(filePath, comments);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

const gzip = promisify(zlib.gzip);

async function uploadComments(filePath: string, comments: any): Promise<void> {
  try {
    // Convert comments to JSON string and compress it using gzip
    const compressedComments = await gzip(JSON.stringify({ comments }));

    const params = {
      Bucket: awsBucket,
      Key: filePath,
      Body: compressedComments, // Upload compressed comments
      ContentEncoding: "gzip", // Set ContentEncoding header to indicate that the content is gzip-compressed
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
  } catch (error: any) {
    // Log the error and rethrow
    console.error(`An error occurred: ${error.message}`);
    throw error;
  }
}
