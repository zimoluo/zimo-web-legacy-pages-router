import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { decryptSub } from "@/lib/encryptSub";
import { NextApiRequest, NextApiResponse } from "next";
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

const directory = "account/users";

interface Items {
  [key: string]: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { secureSub, fields } = req.body;
    const data = await getUserDataBySecureSub(secureSub, fields);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserDataBySecureSub(
  secureSub: string,
  fields: string[] = []
): Promise<Items> {
  const decodedSub = decryptSub(secureSub);
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${decodedSub}.json`,
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

  const items: Items = {};

  fields.forEach((field) => {
    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}
