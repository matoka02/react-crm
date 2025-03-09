import { Customer } from '../types/modelTypes';

interface StateWithCustomers {
  customers: { customers: Customer[] };
}

/**
 * Gets the customer's first name by `customerId`, taking data from Redux state.
 * @param customerId - Customer ID.
 * @param getState - Redux `getState()` function.
 * @returns Customer first name, or "Unknown" if not found.
 */

const getCustomerName = (customerId: string, getState: () => any): string => {
  const { customers }: StateWithCustomers = getState();

  const foundCustomer = customers.customers.find(
    (customer) => String(customer.id) === String(customerId)
  );

  return foundCustomer?.firstName || 'Unknown';
};

export default getCustomerName;
