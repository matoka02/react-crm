export interface Entity {
  id: number;
  text?: string;
  value?: number;
}

export interface Category extends Entity {
  name: string;
  parentId: string;
}
export interface Token {
  accessToken: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  };
}

export interface User extends Entity {
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  mobile: string;
  homephone?: string;
  workphone?: string;
}

export interface Customer extends User {
  membership: boolean;
  rewards: number;
  orders?: string[];
  orderAmount: number;
}

export interface Address extends Entity {
  address: string;
  city: string;
  zipcode: string;
  country: string;
}

export interface Product extends Entity {
  name: string;
  categoryId: number | string;
  numInStock: number;
  unitPrice: number;
  category: Category;
  avatar?: string;
}

export interface Order extends Entity {
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


export interface DBType {
  token: Token;
  customers: Customer[];
  orders: Order[];
  products: Product[];
  categories: Category[];
}

export type ViewModel = Customer | Order | Product | Category;

export type SearchFilter = {
  equal?: TODO;
  contain?: TODO;
  startsWith?: TODO;
  endsWith?: TODO;
  lessThan?: TODO;
  greaterThan?: TODO;
  lessThanOrEqual?: TODO;
  greaterThanOrEqual?: TODO;
  filters?: TODO;
};
