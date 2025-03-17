import React, { useState } from 'react';

import { useAppDispatch } from '@/stores/hooks';
import { fetchAllProducts, fetchFilteredProducts } from '@/stores/products/productThunk';

const NAME_REGEX = /^[A-Za-z0-9\s]+$/;

function useProductSearch(initialSearch: { name: string }) {
  const dispatch = useAppDispatch();
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
