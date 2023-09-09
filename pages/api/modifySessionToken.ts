import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { jwtKey } from '@/lib/encryptionkey';

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
      return res.status(405).end(); // Method Not Allowed
    }
  
    // Parse cookies to get the existing session token
    const cookies = parse(req.headers.cookie || '');
    const existingToken = cookies['session_token'];
  
    if (!existingToken) {
      return res.status(400).json({ error: 'No existing session token' });
    }
  
    const clientUserData: UserData = req.body;
  
    try {
      // Decode the existing token to get the original data and expiration
      const decoded: any = jwt.verify(existingToken, jwtKey);
  
      // Merge the existing user data with updated data from the client
      const modifiedUserData: UserData = {
        ...decoded,
        ...clientUserData
      };
  
      // Calculate the remaining time for the token
      const remainingTime = decoded.exp * 1000 - Date.now();
  
      // Create a new token with the modified data but the original expiration time
      const newToken = jwt.sign(modifiedUserData, jwtKey, { expiresIn: remainingTime / 1000 });
  
      res.setHeader('Set-Cookie', [
        `session_token=${newToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${new Date(
          Date.now() + remainingTime
        ).toUTCString()}`
      ]);
  
      res.status(200).json({ success: true });
  
    } catch (error) {
      res.status(400).json({ error: 'Invalid or expired session token' });
    }
  };
  