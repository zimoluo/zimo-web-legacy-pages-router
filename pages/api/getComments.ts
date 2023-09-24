import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { NextApiRequest, NextApiResponse } from "next";

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
    const comments = await getComments(filePath);
    res.status(200).json({ comments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function getComments(filePath: string): Promise<any> {
  try {
    const params = {
      Bucket: awsBucket,
      Key: filePath,
    };

    const command = new GetObjectCommand(params);
    const s3Object = await s3.send(command);

    if (!s3Object.Body) {
      return {}; // Return an empty object if the file doesn't exist
    }

    let fileContents = "";
    await pipeline(s3Object.Body as Readable, async function* (source) {
      for await (const chunk of source) {
        fileContents += chunk.toString("utf-8");
      }
    });

    const data = JSON.parse(fileContents);

    if (typeof data.comments === "undefined") {
      return {}; // Return an empty object if the comments field is missing
    }

    return data.comments;
  } catch (error: any) {
    // If any exception occurs (including file not found), return an empty object
    return {};
  }
}
