import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { getSearchFilters } from '@/lib/utils';
import { getData, postData } from '@/lib/api';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'GET') {
    const filters = getSearchFilters(req.query);
    const orders = getData('orders', filters);
    return resp.status(200).json(orders);
  }

  if (req.method === 'POST') {
    const newOrder = postData('orders', req.body);
    return resp.status(200).json(newOrder);
  }

  return resp.status(405).json({ message: 'Method Not Allowed' });
}

export default handler;
