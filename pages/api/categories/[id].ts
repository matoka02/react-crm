import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { deleteData, getById, putData } from '@/lib/api';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  const { id } = req.query;
  const categoryId = parseInt(id as string, 10);

  if (req.method === 'GET') {
    const category = getById('categories', categoryId);
    return category
      ? resp.status(200).json(category)
      : resp.status(404).json({ message: 'Not Found' });
  }

  if (req.method === 'PUT') {
    const updatedCategory = putData('categories', categoryId, req.body);
    return updatedCategory
      ? resp.status(200).json(updatedCategory)
      : resp.status(404).json({ message: 'Not Found' });
  }

  if (req.method === 'DELETE') {
    deleteData('categories', categoryId);
    return resp.status(200).end;
  }

  return resp.status(405).json({ message: 'Method Not Allowed' });
}

export default handler;
