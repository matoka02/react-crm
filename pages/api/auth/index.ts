import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import DB from '@/lib/demo-db';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method !== 'POST') {
    return resp.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { email, password } = req.body;

    if (email === 'admin@test.com' && password === 'password') {
      return resp.status(200).json(DB.token);
    }
  } catch (error) {
    return resp.status(500).json({ message: 'Incorrect login or password', error });
  }

  return resp.status(403).json({ error: 'Invalid credentials' });
}

export default handler;
