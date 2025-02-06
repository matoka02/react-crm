import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { deleteData, getById, putData } from '@/lib/api';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  const { id } = req.query;
  const orderId = parseInt(id as string, 10);

  if (req.method === 'GET') {
    const order = getById('orders', orderId);
    return order ? resp.status(200).json(order) : resp.status(404).json({ message: 'Not Found' });
  }

  if (req.method === 'PUT') {
    const updatedOrder = putData('orders', orderId, req.body);
    return updatedOrder
      ? resp.status(200).json(updatedOrder)
      : resp.status(404).json({ message: 'Not Found' });
  }

  if (req.method === 'DELETE') {
    deleteData('orders', orderId);
    return resp.status(200).end;
  }

  return resp.status(405).json({ message: 'Method Not Allowed' });
}

export default handler;
