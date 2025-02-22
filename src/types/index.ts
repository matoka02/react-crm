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
