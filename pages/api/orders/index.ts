import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { deleteData, getData, postData } from '@/lib/api';
import { getSearchFilters } from '@/lib/utils';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const filters = getSearchFilters(req.query);
      const orders = getData('orders', filters);
      return resp.status(201).json(orders);
    } catch (error) {
      return resp.status(500).json({ message: 'Error fetching orders', error });
    }
  }

  if (req.method === 'POST') {
    try {
      const newOrder = postData('orders', req.body);
      return resp.status(201).json(newOrder);
    } catch (error) {
      return resp.status(500).json({ message: 'Error creating order', error });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const parsedId = Number(id);

      if (!id || Number.isNaN(parsedId)) {
        return resp.status(400).json({ message: 'Invalid order ID' });
      }

      const deletedId = deleteData('orders', parsedId);
      if (!deletedId) {
        return resp.status(404).json({ message: 'Order not found' });
      }

      resp.status(200).json({ message: 'Order deleted successfully', id: deletedId });
    } catch (error) {
      return resp.status(500).json({ message: 'Error deleting order', error });
    }
  }

  resp.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return resp.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default handler;

