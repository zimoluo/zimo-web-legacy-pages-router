import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  res.setHeader('Set-Cookie', [
    `session_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${new Date(
      0
    ).toUTCString()}`
  ]);

  res.status(200).json({ success: true });
};
