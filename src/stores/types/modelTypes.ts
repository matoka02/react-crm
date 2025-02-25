/**
 * The ID is generated on the backend. In the project, the backend imitation is performed on API routers.
 */

/* ====== CUSTOMERS ====== */

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  membership: boolean;
  rewards: number;
  avatar?: string;
}

export interface NewCustomer {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  membership: boolean;
  rewards: number;
  avatar?: string;
}

/* ====== CATEGORIES ====== */

export interface Category {
  id: string;
  name: string;
  description: string;
  picture?: string;
}

export interface NewCategory {
  name: string;
  description: string;
  picture?: string;
}

/* ====== PRODUCTS ====== */

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  numInStock: number;
  unitPrice: number;
}

export interface NewProduct {
  name: string;
  categoryId: string;
  categoryName?: string;
  numInStock: number;
  unitPrice: number;
}


/* ====== ORDERS ====== */

export interface Address{
  address: string;
  city: string;
  zipcode: string;
  country: string;
}

export interface Order {
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
}
