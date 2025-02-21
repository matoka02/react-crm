import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  Fab,
  Grid2,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@/components/Alert';
import DataTable from '@/components/DataTable';
import DeleteDialog from '@/components/DeleteDialog';
import Layout from '@/components/Layout';
import SkeletonList from '@/components/SkeletonList';
import useCustomerSearch from '@/hooks/useCustomerSearch';
import {
  fetchAllCustomers,
  clearError,
  setSearchOpen,
  deleteCustomer,
} from '@/stores/customers/customerSlice';
import { AppDispatch, RootState } from '@/stores/store';

export default function CustomerListPage(): React.ReactElement {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    customers,
    isLoading,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    searchOpen,
    search,
  } = useSelector((state: RootState) => state.customers);
  // console.table(customers);

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, [dispatch]);

  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(customers.slice(0, 10));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const {
    search: localSearch,
    handleSearchChange,
    handleSearch,
    handleResetSearch,
  } = useCustomerSearch(search);

  useEffect(() => {
    setItems(customers.slice((page - 1) * 10, page * 10));
  }, [customers, page]);

  // Snackbar
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  // Search customers
  const handleToggleSearch = () => {
    dispatch(setSearchOpen(!searchOpen));
  };

  // Delete customer
  const handleOpenDeleteDialog = (id?: number) => {
    if (id) {
      setSelectedCustomerId(id);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteDialogClose = (confirmed: boolean) => {
    if (confirmed && selectedCustomerId) {
      dispatch(deleteCustomer(selectedCustomerId))
        .unwrap()
        .finally(() => {
          dispatch(fetchAllCustomers());
        });
    }
    setDeleteDialogOpen(false);
    setSelectedCustomerId(null);
  };

  // Add customer
  const handleNewCustomer = () => {
    router.push('/customers/new');
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
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* Table with clients */}
          <DataTable
            model="customer"
            items={items}
            dataKeys={[
              'avatar',
              'firstName',
              'lastName',
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
            // onDelete={(evt, id) => {
            //   setSelectedCustomerId(id ?? null);
            //   setDeleteDialogOpen(true);
            // }}
            onDelete={(evt, id) => handleOpenDeleteDialog(id)}
            onPageChange={(_, newPage) => setPage(newPage)}
          />

          {/* Delete dialog */}
          <DeleteDialog
            open={deleteDialogOpen}
            closeDialog={handleDeleteDialogClose}
            dialogTitle="Delete customer"
            dialogText={`Are you sure you want to delete this customer with ID ${selectedCustomerId}?`}
          />

          {/* Searchbar */}
          <Drawer
            anchor="right"
            open={searchOpen}
            onClose={handleToggleSearch}
            ModalProps={{
              sx: { backgroundColor: 'transparent' },
            }}
          >
            <Box sx={{ width: 300, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Search Customers
              </Typography>
              <form
                onSubmit={(evt) => {
                  evt.preventDefault();
                  handleSearch();
                }}
              >
                <TextField
                  fullWidth
                  margin="dense"
                  label="First Name"
                  name="firstName"
                  value={localSearch.firstName}
                  onChange={handleSearchChange}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  label="Last Name"
                  name="lastName"
                  value={localSearch.lastName}
                  onChange={handleSearchChange}
                />
                <Grid2
                  container
                  spacing={2}
                  sx={{
                    width: '100%',
                    mt: 2,
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexGrow: 1,
                  }}
                  component="div"
                >
                  <Grid2 size={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      sx={{
                        minWidth: 120,
                        width: '100%',
                        color: 'white',
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Search
                    </Button>
                  </Grid2>
                  <Grid2 size={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        width: '100%',
                        whiteSpace: 'nowrap',
                        color: 'white',
                        backgroundColor: theme.palette.success.main,
                        '&:hover': {
                          backgroundColor: theme.palette.success.dark,
                        },
                      }}
                      onClick={handleResetSearch}
                    >
                      Show All
                    </Button>
                  </Grid2>
                  <Grid2 size={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        minWidth: 120,
                        width: '100%',
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
                  </Grid2>
                </Grid2>
              </form>
            </Box>
          </Drawer>
        </Box>
      )}
    </Layout>
  );
}
