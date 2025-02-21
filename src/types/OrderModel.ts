import { Address, Customer, Order, Product } from './DBmodel';

/**
 * Represents a order model implementing the `Order` interface.
 */

class OrderModel implements Order {
  id: number;

  reference: string;

  customerId: number;

  customer: Customer;

  customerName: string;

  products: Product[];

  amount: number;

  quantity: number;

  orderDate: string;

  shippedDate: string;

  shipAddress: Address;

  constructor(
    reference: string,
    customerId: number,
    customer: Customer,
    customerName: string,
    products: Product[],
    amount: number,
    quantity: number,
    orderDate?: string,
    shippedDate?: string,
    shipAddress?: Address
  ) {
    this.id = 0;
    this.reference = reference;
    this.customerId = customerId;
    this.customer = customer;
    this.customerName = customerName;
    this.products = products;
    this.amount = amount;
    this.quantity = quantity;
    this.orderDate = orderDate ?? '';
    this.shippedDate = shippedDate ?? '';
    this.shipAddress = shipAddress ?? ({} as Address);
  }
}

export default OrderModel;
