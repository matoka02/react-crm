import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { DB } from '@/lib/demo-db';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method !== 'POST') {
    return resp.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  if (username === 'admin@test.com' && password === 'password') {
    return resp.status(200).json(DB.token);
  }

  return resp.status(403).json({ error: 'Invalid credentials' });
}

export default handler;
