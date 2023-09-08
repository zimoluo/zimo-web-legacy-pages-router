import type { NextApiRequest, NextApiResponse } from 'next';
import jwt_decode from 'jwt-decode'; 
import { encryptSub } from '@/lib/encryptSub';

type AccountPayloadData = {
  name: string;
  profilePic: string;
  secureSub: string;
}; 

type ApiError = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccountPayloadData | ApiError>
) {
  const token = req.headers['authorization']?.split(' ')[1] || '';

  if (!token) {
    res.status(401).json({ error: 'Token missing from request headers.' });
    return;
  }

  try {
    const payload = jwt_decode(token) as any;
    const encryptedSub = encryptSub(payload.sub);

    const securePayload: AccountPayloadData = {
      name: payload.name,
      profilePic: payload.picture,
      secureSub: encryptedSub,
    };

    res.status(200).json(securePayload);
  } catch (err) {
    console.error('Invalid token:', err);
    res.status(400).json({ error: 'Invalid token' });
  }
}
