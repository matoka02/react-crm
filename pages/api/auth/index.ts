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

    return resp.status(403).json({ message: 'Incorrect login or password' });
  } catch (error) {
    return resp.status(500).json({ message: 'Server error', error });
  }
}

export default handler;
