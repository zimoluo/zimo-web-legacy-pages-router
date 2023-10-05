import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { NextApiRequest, NextApiResponse } from "next";
import { getSubFromSessionToken } from "@/lib/accountServerManager";

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
    const tokenUser = getSubFromSessionToken(req);
    if (sub !== tokenUser) {
      throw new Error("The user to be deleted is not the current user.");
    }
    const result = await deleteUserFile(sub);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteUserFile(
  sub: string
): Promise<{ success: boolean; message: string }> {
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${sub}.json`,
  };

  const command = new DeleteObjectCommand(params);
  try {
    await s3.send(command);
    return { success: true, message: "User data successfully deleted." };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to delete user data. Error: ${err}`,
    };
  }
}
