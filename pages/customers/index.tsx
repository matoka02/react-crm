import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  Fab,
  Grid,
  Grid2,
  Snackbar,
  TextField,
  Tooltip,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@/components/Alert';
import DataTable from '@/components/DataTable';
import DeleteDialog from '@/components/DeleteDialog';
import Layout from '@/components/Layout';
import SkeletonList from '@/components/SkeletonList';
import {
  fetchAllCustomers,
  fetchFilteredCustomers,
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
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(customers.slice(0, 10));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setItems(customers.slice((page - 1) * 10, page * 10));
  }, [customers, page]);

  const handleSearch = () => {
    dispatch(fetchFilteredCustomers(search));
    dispatch(setSearchOpen(false));
  };

  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    dispatch(setSearch({ ...search, [name]: value }));

    if (searchTimeout) clearTimeout(searchTimeout);
    if (value.length >= 1) {
      const timeout = setTimeout(
        () => dispatch(fetchFilteredCustomers({ ...search, [name]: value })),
        500
      );
      setSearchTimeout(timeout);
    }
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
        <Box suppressHydrationWarning>
          {/* Control buttons */}
          <Tooltip title="Add Customer">
            <Fab
              onClick={handleNewCustomer}
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 80,
                zIndex: 1200,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              <AddIcon sx={{ color: 'white' }} />
            </Fab>
          </Tooltip>
          <Tooltip title="Search">
            <Fab
              onClick={handleToggleSearch}
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 1200,
                backgroundColor: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
              }}
            >
              <SearchIcon sx={{ color: 'white' }} />
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
              'action',
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
                name="firstName"
                value={search.firstName}
                onChange={handleSearchChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Last Name"
                name="lastName"
                value={search.lastName}
                onChange={handleSearchChange}
              />
              <Grid container spacing={2} sx={{ mt: 2 }} component="div">
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      color: 'white',
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      color: 'white',
                      backgroundColor: theme.palette.secondary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.dark,
                      },
                    }}
                    onClick={handleToggleSearch}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Drawer>
        </Box>
      )}
    </Layout>
  );
}
