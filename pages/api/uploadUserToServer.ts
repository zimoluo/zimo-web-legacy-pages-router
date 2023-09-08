import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { decryptSub } from "@/lib/encryptSub";
import { NextApiRequest, NextApiResponse } from "next";

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
  const decodedSub = decryptSub(secureSub);
  const params = {
    Bucket: awsBucket,
    Key: `${directory}/${decodedSub}.json`,
    Body: JSON.stringify(user),
    ContentType: "application/json",
  };

  const command = new PutObjectCommand(params);
  try {
    await s3.send(command);
    return { success: true, message: "User data successfully uploaded." };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to upload user data. Error: ${err}`,
    };
  }
}

export async function fetchUploadUserToServer(user: any, secureSub: string) {
  try {
    const response = await fetch('/api/uploadUserToServer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, secureSub }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('Error uploading user data:', error);
    return null;
  }
}
