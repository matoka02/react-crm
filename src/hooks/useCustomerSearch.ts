import React, { useState } from 'react';

import { setSearch } from '@/stores/customers/customerSlice';
import { fetchAllCustomers, fetchFilteredCustomers } from '@/stores/customers/customerThunk';
import { useAppDispatch } from '@/stores/hooks';

const NAME_REGEX = /^[A-Za-z\s]+$/;

function useCustomerSearch(initialSearch: { firstName: string; lastName: string }) {
  const dispatch = useAppDispatch();
  const [search, setLocalSearch] = useState(initialSearch);

  // Validation
  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;

    if (value === '' || NAME_REGEX.test(value)) {
      setLocalSearch((prev) => ({ ...prev, [name]: value }));
      dispatch(setSearch({ ...search, [name]: value }));
    }
  };

  // Starts search
  const handleSearch = () => {
    dispatch(fetchFilteredCustomers(search));
  };

  // Show all users
  const handleResetSearch = () => {
    dispatch(fetchAllCustomers());
    dispatch(setSearch({ firstName: '', lastName: '' })); // Redux state
    setLocalSearch({ firstName: '', lastName: '' }); // Local state
  };

  return { search, handleSearchChange, handleSearch, handleResetSearch };
}

export default useCustomerSearch;
