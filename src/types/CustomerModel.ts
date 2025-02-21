import { Customer } from './DBmodel';

class CustomerModel implements Customer {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  avatar?: string;

  mobile: string;

  membership: boolean;

  rewards: number;

  orders?: string[];

  orderAmount: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    rewards: number,
    membership: boolean,
    avatar?: string
  ) {
    this.id = 0;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobile = mobile;
    this.membership = membership;
    this.rewards = rewards;
    this.orderAmount = 0;
    this.avatar = avatar;
  }
}

export default CustomerModel;
