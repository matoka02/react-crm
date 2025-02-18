import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { getData, postData } from '@/lib/api';
import { getSearchFilters } from '@/lib/utils';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const filters = getSearchFilters(req.query);
      const customers = getData('customers', filters);
      return resp.status(201).json(customers);
    } catch (error) {
      return resp.status(500).json({ message: 'Error fetching customers', error });
    }
  }

  if (req.method === 'POST') {
    try {
      const newCustomer = postData('customers', req.body);
      return resp.status(201).json(newCustomer);
    } catch (error) {
      return resp.status(500).json({ message: 'Error creating customer', error });
    }
  }

  resp.setHeader('Allow', ['GET', 'POST']);
  return resp.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default handler;
