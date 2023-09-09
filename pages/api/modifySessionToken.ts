import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { jwtKey } from '@/lib/encryptionkey';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const cookies = parse(req.headers.cookie || '');
  const existingToken = cookies['session_token'];

  if (!existingToken) {
    return res.status(400).json({ error: 'No existing session token' });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(existingToken, jwtKey);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired session token' });
  }

  const clientUserData: UserData = req.body;
  const modifiedUserData = {
    ...decoded,
    ...clientUserData
  };

  // Remove the 'exp' property from the payload if it exists
  if (modifiedUserData.exp) {
    delete modifiedUserData.exp;
  }

  const remainingTimeInSeconds = decoded.exp - Math.floor(Date.now() / 1000);

  let newToken: string;
  try {
    newToken = jwt.sign(modifiedUserData, jwtKey, { expiresIn: remainingTimeInSeconds });
  } catch (err) {
    console.error('JWT creation failed:', err);
    return res.status(500).json({ error: 'Could not create new token' });
  }

  res.setHeader('Set-Cookie', [
    `session_token=${newToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${new Date(
      decoded.exp * 1000
    ).toUTCString()}`
  ]);

  return res.status(200).json({ success: true });
};
