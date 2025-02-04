import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { deleteData, getById, putData } from '@/lib/api';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  const { id } = req.query;
  const productId = parseInt(id as string);

  if (req.method === 'GET') {
    const product = getById('products', productId);
    return product ? resp.status(200).json(product) : resp.status(404).json({ message: 'Not Found' });
  }

  if (req.method === 'PUT') {
    const updatedProduct = putData('products', productId, req.body);
    return updatedProduct ? resp.status(200).json(updatedProduct) : resp.status(404).json({ message: 'Not Found' });
  }

  if (req.method === 'DELETE') {
    deleteData('products', productId)
    return resp.status(200).end;
  }

  return resp.status(405).json({ message: 'Method Not Allowed' });
}

export default handler;
