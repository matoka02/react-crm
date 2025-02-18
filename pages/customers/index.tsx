import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { Box, Button, Drawer, Fab, Grid2, Snackbar, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@/components/Alert';
import DataTable from '@/components/DataTable';
import DeleteDialog from '@/components/DeleteDialog';
import Layout from '@/components/Layout';
import SkeletonList from '@/components/SkeletonList';
import {
  fetchCustomers,
  setSearch,
  setSearchOpen,
  setSnackbarOpen,
} from '@/stores/customers/customerSlice';
import { AppDispatch, RootState } from '@/stores/store';

export default function CustomerListPage(): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, isLoading, snackbarOpen, snackbarMessage, searchOpen, search } = useSelector(
    (state: RootState) => state.customers
  );
  // console.table(customers);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const [page, setPage] = useState(1);
  const [items, setItems] = useState(customers.slice(0, 10));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  useEffect(() => {
    setItems(customers.slice((page - 1) * 10, page * 10));
  }, [customers, page]);

  const handleSearch = () => {
    dispatch(fetchCustomers());
    dispatch(setSearchOpen(false));
  };

  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch({ ...search, [evt.target.name]: evt.target.value }));
  };

  const handleToggleSearch = () => {
    dispatch(setSearchOpen(!searchOpen));
  };

  const handleNewCustomer = () => {
    console.log('Redirect to new customer page');
  };

  const handleDeleteDialogClose = (confirmed: boolean) => {
    if (confirmed && selectedCustomerId) {
      console.log(`Delete customer ID: ${selectedCustomerId}`);
    }
    setDeleteDialogOpen(false);
    setSelectedCustomerId(null);
  };

  return (
    <Layout title={`Customers (${customers.length})`} navigation="Application / Customer">
      {isLoading ? (
        <SkeletonList />
      ) : (
        <Box>
          {/* Control buttons */}
          <Tooltip title="Add Customer">
            <Fab
              color="primary"
              onClick={handleNewCustomer}
              sx={{ position: 'fixed', bottom: 16, right: 80 }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Search">
            <Fab
              color="secondary"
              onClick={handleToggleSearch}
              sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
              <SearchIcon />
            </Fab>
          </Tooltip>

          {/* Notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => dispatch(setSnackbarOpen(false))}
          >
            <Alert onClose={() => dispatch(setSnackbarOpen(false))} severity="success">
              {snackbarMessage || 'Operation successful!'}
            </Alert>
          </Snackbar>

          {/* Table with clients */}
          <DataTable
            model="customer"
            items={items}
            dataKeys={[
              'avatar',
              'firstname',
              'lastname',
              'email',
              'mobile',
              'membership',
              'actions',
            ]}
            headers={[
              'Photo',
              'First Name',
              'Last Name',
              'Email',
              'Mobile',
              'Membership',
              'Actions',
            ]}
            page={page}
            totalPages={Math.ceil(customers.length / 10)}
            onDelete={(evt, id) => {
              setSelectedCustomerId(id ?? null);
              setDeleteDialogOpen(true);
            }}
            onPageChange={(_, newPage) => setPage(newPage)}
          />

          {/* Delete dialog */}
          <DeleteDialog open={deleteDialogOpen} closeDialog={handleDeleteDialogClose} />

          {/* Searchbar */}
          <Drawer anchor="right" open={searchOpen} onClose={handleToggleSearch}>
            <Box sx={{ width: 300, p: 2 }}>
              <h4>Search Customers</h4>
              <TextField
                fullWidth
                margin="dense"
                label="First Name"
                name="firstname"
                value={search.firstname}
                onChange={handleSearchChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Last Name"
                name="lastname"
                value={search.lastname}
                onChange={handleSearchChange}
              />
              <Grid2 container spacing={2} sx={{ mt: 2 }}>
                <Grid2 xs={6}>
                  <Button fullWidth variant="contained" color="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </Grid2>
                <Grid2 xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleToggleSearch}
                  >
                    Close
                  </Button>
                </Grid2>
              </Grid2>
            </Box>
          </Drawer>
        </Box>
      )}
    </Layout>
  );
}
