import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  fetchAllProducts,
  fetchFilteredProducts,
} from '@/stores/products/productSlice';
import { AppDispatch } from '@/stores/store';

const NAME_REGEX = /^[A-Za-z0-9\s]+$/;

function useProductSearch(initialSearch: { name: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setLocalSearch] = useState(initialSearch);

  // Validation
  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;

    if (value === '' || NAME_REGEX.test(value)) {
      setLocalSearch((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Start search
  const handleSearch = () => {
    dispatch(fetchFilteredProducts(search));
  };

  // Show all products
  const handleResetSearch = () => {
    dispatch(fetchAllProducts());
    setLocalSearch({ name: '' });
  };

  return { search, handleSearchChange, handleSearch, handleResetSearch };
}

export default useProductSearch;
