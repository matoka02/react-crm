import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { deleteData, getData, postData } from '@/lib/api';
import { getSearchFilters } from '@/lib/utils';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const filters = getSearchFilters(req.query);
      const products = getData('products', filters);
      return resp.status(201).json(products);
    } catch (error) {
      return resp.status(500).json({ message: 'Error fetching products', error });
    }
  }

  if (req.method === 'POST') {
    try {
      const newProduct = postData('products', req.body);
      return resp.status(201).json(newProduct);
    } catch (error) {
      return resp.status(500).json({ message: 'Error creating product', error });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const parsedId = Number(id);

      if (!id || Number.isNaN(parsedId)) {
        return resp.status(400).json({ message: 'Invalid product ID' });
      }

      const deletedId = deleteData('products', parsedId);
      if (!deletedId) {
        return resp.status(404).json({ message: 'Product not found' });
      }

      resp.status(200).json({ message: 'Product deleted successfully', id: deletedId });
    } catch (error) {
      return resp.status(500).json({ message: 'Error deleting product', error });
    }
  }

  resp.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return resp.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default handler;
