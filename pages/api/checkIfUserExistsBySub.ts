
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { sub } = req.body;
    const exists = await checkIfUserExistsBySub(sub);
    res.status(200).json({ exists });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function checkIfUserExistsBySub(
  sub: string
): Promise<boolean> {
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${sub}.json`,
  };

  try {
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
