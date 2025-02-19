import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchFilteredCustomers, setSearch } from '@/stores/customers/customerSlice';
import { AppDispatch } from '@/stores/store';

const NAME_REGEX = /^[A-Za-z\s]+$/;

function useCustomerSearch(initialSearch: { firstName: string; lastName: string }) {
  const dispatch = useDispatch<AppDispatch>();
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

  return { search, handleSearchChange, handleSearch };
}

export default useCustomerSearch;
