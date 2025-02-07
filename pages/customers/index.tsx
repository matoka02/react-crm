import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Layout from '@/components/Layout';
import SkeletonList from '@/components/SkeletonList';
import {
  fetchCustomers,
  setSearch,
  setSearchOpen,
  setSnackbarOpen,
} from '@/stores/customers/customerSlice';

export default function CustomerListPage(): React.ReactElement {
  const dispatch = useDispatch();
  const { customers, isLoading, snackbarOpen, snackbarMessage, searchOpen, search } = useSelector(
    (state: any) => state.customer
  );
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(customers.slice(0, 10));

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    setItems(customers.slice((page - 1) * 10, page * 10));
  }, [customers, page]);

  const handleSearch = () => {
    const filters = { firstname: search.firstname, lastname: search.lastname };
    dispatch(fetchCustomers());
    dispatch(setSearchOpen(false));
  };

  const handleToggleSearch = () => {
    dispatch(setSearchOpen(!searchOpen));
  };

  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch({ ...search, [evt.target.name]: evt.target.value }));
  };

  const handleNewCustomer = () => {
    // Handle new customer logic
  };

  const handleSnackbarClose = () => {
    dispatch(setSnackbarOpen(false));
  };

  const handleDeleteDialogClose = (confirmed: boolean) => {
    if (confirmed) {
      // Perform delete action here
    }
    // Reset dialog state
  };

  return (
    <Layout title={`Customers (${customers.length})`} navigation="Application / Customer">
      {!isLoading ? (
        <Box component="div">
          <Box component="div"></Box>
        </Box>
      ) : (
        <SkeletonList />
      )}
    </Layout>
  );
}
