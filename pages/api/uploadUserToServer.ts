import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { decryptSub } from "@/lib/encryptSub";
import { NextApiRequest, NextApiResponse } from "next";
import * as zlib from "zlib";
import { promisify } from "util";

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

const directory = "account/users";

const gzip = promisify(zlib.gzip);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { user, secureSub } = req.body;
    const result = await uploadUserToServer(user, secureSub);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function uploadUserToServer(
  user: any,
  secureSub: string
): Promise<{ success: boolean; message: string }> {
  try {
    const decodedSub = decryptSub(secureSub);
    
    // Convert user to JSON string and compress it using gzip
    const compressedUser = await gzip(JSON.stringify(user));
    
    const params = {
      Bucket: awsBucket,
      Key: `${directory}/${decodedSub}.json`,
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
