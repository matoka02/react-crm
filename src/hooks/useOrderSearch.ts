import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchAllOrders, fetchFilteredOrders } from '@/stores/orders/orderSlice';
import { AppDispatch } from '@/stores/store';

export const REFERENCE_REGEX = /^[a-zA-Z0-9-]+$/;

function useOrderSearch(initialSearch: { reference: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setLocalSearch] = useState(initialSearch);

  // Validation
  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;

    if (value === '' || REFERENCE_REGEX.test(value)) {
      setLocalSearch((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Start search
  const handleSearch = () => {
    dispatch(fetchFilteredOrders(search));
  };

  // Show all products
  const handleResetSearch = () => {
    dispatch(fetchAllOrders());
    setLocalSearch({ reference: '' });
  };

  return { search, handleSearchChange, handleSearch, handleResetSearch };
}

export default useOrderSearch;
