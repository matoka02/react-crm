import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { getData, postData } from '@/lib/api';
import { getSearchFilters } from '@/lib/utils';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'GET') {
    const filters = getSearchFilters(req.query);
    const customers = getData('customers', filters);
    return resp.status(200).json(customers);
  }

  if (req.method === 'POST') {
    const newCustomer = postData('customers', req.body);
    return resp.status(200).json(newCustomer);
  }

  return resp.status(405).json({ message: 'Method Not Allowed' });
}

export default handler;
