import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { deleteData, getData, postData } from '@/lib/api';
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

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const parsedId = Number(id);

      if (!id || Number.isNaN(parsedId)) {
        return resp.status(400).json({ message: 'Invalid customer ID' });
      }

      const deletedId = deleteData('customers', parsedId);
      if (!deletedId) {
        return resp.status(404).json({ message: 'Customer not found' });
      }

      resp.status(200).json({ message: 'Customer deleted successfully', id: deletedId });
    } catch (error) {
      return resp.status(500).json({ message: 'Error deleting customer', error });
    }
  }

  resp.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return resp.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default handler;
