import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { getSearchFilters } from '@/lib/utils';
import { getData, postData } from '@/lib/api';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'GET') {
    const filters = getSearchFilters(req.query);
    const products = getData('products', filters);
    return resp.status(200).json(products);
  }

  if (req.method === 'POST') {
    const newProduct = postData('products', req.body);
    return resp.status(200).json(newProduct);
  }

  return resp.status(405).json({ message: 'Method Not Allowed' });
}

export default handler;
