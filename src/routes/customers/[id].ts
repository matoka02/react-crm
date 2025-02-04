import type { NextApiRequest, NextApiResponse } from 'next/dist/types';

import { deleteData, getById, putData } from '@/lib/api';

function handler(req: NextApiRequest, resp: NextApiResponse) {
  const { id } = req.query;
  const customerId = parseInt(id as string);

  if (req.method === 'GET') {
    const customer = getById('customers', customerId);
    return customer ? resp.status(200).json(customer) : resp.status(404).json({ message: 'Not Found' });
  }

  if (req.method === 'PUT') {
    const updatedCustomer = putData('customers', customerId, req.body);
    return updatedCustomer ? resp.status(200).json(updatedCustomer) : resp.status(404).json({ message: 'Not Found' });
  }

  if (req.method === 'DELETE') {
    deleteData('customers', customerId)
    return resp.status(200).end;
  }

  return resp.status(405).json({ message: 'Method Not Allowed' });
}

export default handler;
