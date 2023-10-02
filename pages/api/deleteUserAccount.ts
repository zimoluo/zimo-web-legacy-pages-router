import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { decryptSub } from "@/lib/encryptSub";
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
    const { secureSub } = req.body;
    const result = await deleteUserFile(secureSub);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteUserFile(
  secureSub: string
): Promise<{ success: boolean; message: string }> {
  const decodedSub = decryptSub(secureSub);
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${decodedSub}.json`,
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
