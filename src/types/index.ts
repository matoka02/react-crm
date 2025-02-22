/* ====== CUSTOMERS ====== */

export interface Customer {
  id: string;
  name: string;
  email: string;
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
}

export interface NewCategory {
  id: string;
  name: string;
  description: string;
  picture?: string;
}


/* ====== PRODUCTS ====== */

export interface Product {
  id: string;
  name: string;
  categoryId: string;
}

export interface NewProduct {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  numInStock: number;
  unitPrice: number;
}

