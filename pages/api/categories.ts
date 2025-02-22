import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { deleteData, getData, postData } from '@/lib/api';
import { getSearchFilters } from '@/lib/utils';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const filters = getSearchFilters(req.query);
      const categories = getData('categories', filters);
      return resp.status(201).json(categories);
    } catch (error) {
      return resp.status(500).json({ message: 'Error fetching categories', error });
    }
  }

  if (req.method === 'POST') {
    try {
      const newCategory = postData('categories', req.body);
      return resp.status(201).json(newCategory);
    } catch (error) {
      return resp.status(500).json({ message: 'Error creating category', error });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const parsedId = Number(id);

      if (!id || Number.isNaN(parsedId)) {
        return resp.status(400).json({ message: 'Invalid category ID' });
      }

      const deletedId = deleteData('categories', parsedId);
      if (!deletedId) {
        return resp.status(404).json({ message: 'Category not found' });
      }

      resp.status(200).json({ message: 'Category deleted successfully', id: deletedId });
    } catch (error) {
      return resp.status(500).json({ message: 'Error deleting category', error });
    }
  }

  resp.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return resp.status(405).json({ message: `Method ${req.method} Not Allowed` });
}

export default handler;
