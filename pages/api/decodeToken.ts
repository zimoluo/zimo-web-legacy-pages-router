import type { NextApiRequest, NextApiResponse } from 'next';
import { encryptSub } from '@/lib/encryptSub';
import { OAuth2Client } from 'google-auth-library';
import { clientId } from '@/lib/googlekey';

type AccountPayloadData = {
  name: string;
  profilePic: string;
  secureSub: string;
}; // Replace with your own type definition

type ApiError = {
  error: string;
};

const client = new OAuth2Client();

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
    const ticket = await client.verifyIdToken({idToken: token, audience: clientId})
    const payload = ticket.getPayload();
    
    if (!payload) {
        res.status(401).json({ error: 'Failed to verify token.' });
        return;
    }

    const fetchedName = payload.name ? payload.name : 'Anonymous';
    const fetchedPicture = payload.picture ? payload.picture : '/favicon.svg';
    const encryptedSub = encryptSub(payload.sub); 

    const securePayload: AccountPayloadData = {
      name: fetchedName,
      profilePic: fetchedPicture,
      secureSub: encryptedSub,
    };

    res.status(200).json(securePayload);
  } catch (err) {
    console.error('Invalid token:', err);
    res.status(400).json({ error: 'Invalid token' });
  }
}

