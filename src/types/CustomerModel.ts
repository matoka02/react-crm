import { Customer } from './model';

class CustomerModel implements Customer {
  id: number;

  firstname: string;

  lastname: string;

  email: string;

  avatar?: string;

  mobile: string;

  membership: boolean;

  rewards: number;

  orders?: string[];

  orderAmount: number;

  constructor(
    firstname: string,
    lastname: string,
    email: string,
    mobile: string,
    rewards: number,
    membership: boolean,
    avatar?: string
  ) {
    this.id = 0;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.mobile = mobile;
    this.membership = membership;
    this.rewards = rewards;
    this.orderAmount = 0;
    this.avatar = avatar;
  }
}

export default CustomerModel;
