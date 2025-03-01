import { Product } from '../types/modelTypes';

/**
 * Gets the total number of products in an order.
 * @param products - Array of products in the order.
 * @returns Number of products.
 */

const getProductCount = (products: Product[]): number => products.length;

export default getProductCount;
