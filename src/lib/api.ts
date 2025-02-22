import { nanoid } from 'nanoid';

import DB from '@/lib/demo-db';
import { DBType } from '@/types/DBmodel';

// Getting data taking into account filters
export function getData<T extends keyof DBType>(
  model: T,
  filters?: Record<string, (prop: string, row: any) => boolean>
): DBType[T] | null {
  const result = DB[model];

  if (!result) return null;

  if (Array.isArray(result)) {
    // Filtering data
    if (filters) {
      return result.filter((row) =>
        Object.keys(filters).every((prop) => filters[prop](prop, row))
      ) as unknown as DBType[T];
    }
    return result as unknown as DBType[T];
  }
  return result as unknown as DBType[T];
}

// Getting one element
export function getById<T extends keyof DBType>(
  model: T,
  id: number
): DBType[T] extends (infer U)[] ? U | undefined : never {
  if (!(model in DB)) return null as any;

  const data = DB[model];
  if (!Array.isArray(data)) return null as any;

  return data.find((item) => item.id === id) as any;
}

// Adding an element
export function postData<T extends keyof DBType>(
  model: T,
  data: DBType[T] extends (infer U)[] ? Omit<U, 'id'> : never
) {
  if (!(model in DB)) return null;

  const collection = DB[model];
  if (!Array.isArray(collection)) return null;

  const newItem = { id: Date.now(), ...data } as any;
  // const newItem = { id: nanoid(), ...data } as any;
  collection.push(newItem);
  return newItem;
}

// Update element
export function putData<T extends keyof DBType>(
  model: T,
  id: number,
  data: DBType[T] extends (infer U)[] ? Partial<U> : never
) {
  if (!(model in DB)) return null;

  const collection = DB[model];
  if (!Array.isArray(collection)) return null;

  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return null;

  collection[index] = { ...collection[index], ...data };
  return collection[index];
}

// Delete element
export function deleteData<T extends keyof DBType>(model: T, id: number) {
  if (!(model in DB)) return null;

  const collection = DB[model];
  if (!Array.isArray(collection)) return null;

  DB[model] = collection.filter((item) => item.id !== id) as any;
  return id;
}
